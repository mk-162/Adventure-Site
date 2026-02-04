"use client";

import { Sun, CloudRain, Thermometer } from "lucide-react";
import clsx from "clsx";
import climateData from "../../../data/climate/averages.json";

interface ClimateChartProps {
  regionSlug: string;
  compact?: boolean;
}

const MONTH_ABBR = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export function ClimateChart({ regionSlug, compact = false }: ClimateChartProps) {
  // Look up station from region mapping
  const stationKey = climateData.regionMapping[regionSlug as keyof typeof climateData.regionMapping];
  if (!stationKey) {
    console.warn(`No climate data for region: ${regionSlug}`);
    return null;
  }

  const station = climateData.stations[stationKey as keyof typeof climateData.stations];
  if (!station) return null;

  const months = station.months;

  // Calculate max values for scaling
  const maxRainfall = Math.max(...months.map((m) => m.rainfall));
  const maxTemp = Math.max(...months.map((m) => m.maxTemp));
  const minTemp = Math.min(...months.map((m) => m.minTemp));
  const tempRange = maxTemp - minTemp;
  const maxSunshine = Math.max(...months.map((m) => m.sunshine));

  // Determine best months (low rain, high temp, high sunshine)
  const bestMonths = months.map((m, idx) => {
    const rainScore = 1 - m.rainfall / maxRainfall;
    const tempScore = (m.maxTemp - minTemp) / tempRange;
    const sunScore = m.sunshine / maxSunshine;
    const overallScore = rainScore * 0.4 + tempScore * 0.3 + sunScore * 0.3;
    return { month: idx, score: overallScore };
  });

  const threshold = 0.65;
  const bestMonthIndices = bestMonths
    .filter((m) => m.score > threshold)
    .map((m) => m.month);

  // Create recommendation text
  const getBestMonthsText = () => {
    if (bestMonthIndices.length === 0) return null;
    
    // Find consecutive ranges
    const ranges: number[][] = [];
    let currentRange: number[] = [bestMonthIndices[0]];
    
    for (let i = 1; i < bestMonthIndices.length; i++) {
      if (bestMonthIndices[i] === bestMonthIndices[i - 1] + 1) {
        currentRange.push(bestMonthIndices[i]);
      } else {
        ranges.push(currentRange);
        currentRange = [bestMonthIndices[i]];
      }
    }
    ranges.push(currentRange);

    // Format ranges
    const rangeTexts = ranges.map((range) => {
      if (range.length === 1) {
        return months[range[0]].name;
      }
      return `${months[range[0]].name}-${months[range[range.length - 1]].name}`;
    });

    return rangeTexts.join(", ");
  };

  const bestMonthsText = getBestMonthsText();

  // Chart dimensions
  const chartHeight = compact ? 120 : 180;
  const barMaxHeight = compact ? 80 : 120;
  const padding = 20;

  return (
    <div
      className={clsx(
        "bg-white rounded-xl border border-gray-200 shadow-sm",
        compact ? "p-4" : "p-6"
      )}
    >
      <div className="mb-4">
        <h3 className={clsx("font-bold text-[#1e3a4c]", compact ? "text-sm" : "text-base")}>
          Climate Overview
        </h3>
        <p className={clsx("text-gray-500", compact ? "text-xs" : "text-sm")}>
          {station.name} • 30-year averages
        </p>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: chartHeight }}>
        {/* Month bars and data */}
        <div className="flex items-end justify-between h-full gap-1">
          {months.map((month, idx) => {
            const barHeight = (month.rainfall / maxRainfall) * barMaxHeight;
            const isBest = bestMonthIndices.includes(idx);
            const sunSize = (month.sunshine / maxSunshine) * 8 + 4;

            return (
              <div
                key={idx}
                className={clsx(
                  "flex-1 flex flex-col items-center justify-end gap-1 rounded-t transition-colors",
                  isBest && "bg-emerald-50"
                )}
                style={{ paddingTop: padding }}
              >
                {/* Sunshine indicator */}
                <div className="flex items-center justify-center" style={{ height: 12 }}>
                  <Sun
                    className="text-yellow-500"
                    style={{ width: sunSize, height: sunSize }}
                    strokeWidth={2.5}
                  />
                </div>

                {/* Temperature line point (we'll connect with SVG) */}
                <div className="relative w-full" style={{ height: 30 }}>
                  {/* Placeholder for SVG overlay */}
                </div>

                {/* Rainfall bar */}
                <div
                  className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  style={{ height: barHeight }}
                  title={`${month.name}: ${month.rainfall}mm rain`}
                />

                {/* Month label */}
                <div className={clsx("font-bold text-gray-600", compact ? "text-[10px]" : "text-xs")}>
                  {MONTH_ABBR[idx]}
                </div>
              </div>
            );
          })}
        </div>

        {/* SVG overlay for temperature lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ top: padding, height: chartHeight - padding - 20 }}
        >
          {/* Max temp line */}
          <polyline
            points={months
              .map((m, idx) => {
                const x = (idx / (months.length - 1)) * 100;
                const y = ((maxTemp - m.maxTemp) / tempRange) * (barMaxHeight - 60) + 20;
                return `${x}%,${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#f97316"
            strokeWidth={compact ? "2" : "3"}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Min temp line */}
          <polyline
            points={months
              .map((m, idx) => {
                const x = (idx / (months.length - 1)) * 100;
                const y = ((maxTemp - m.minTemp) / tempRange) * (barMaxHeight - 60) + 20;
                return `${x}%,${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#94A3B8"
            strokeWidth={compact ? "2" : "3"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 2"
          />
        </svg>
      </div>

      {/* Legend */}
      <div className={clsx("flex flex-wrap items-center gap-3 mt-4", compact ? "text-[10px]" : "text-xs")}>
        <div className="flex items-center gap-1">
          <CloudRain className="w-3 h-3 text-blue-500" />
          <span className="text-gray-600">Rainfall</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-0.5 bg-[#f97316] rounded" />
          <span className="text-gray-600">Max temp</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-0.5 bg-slate-400 rounded" style={{ backgroundImage: "repeating-linear-gradient(to right, #94A3B8 0, #94A3B8 4px, transparent 4px, transparent 6px)" }} />
          <span className="text-gray-600">Min temp</span>
        </div>
        <div className="flex items-center gap-1">
          <Sun className="w-3 h-3 text-yellow-500" />
          <span className="text-gray-600">Sunshine</span>
        </div>
      </div>

      {/* Best months recommendation */}
      {!compact && bestMonthsText && (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-sm text-emerald-900">
            <span className="font-bold">Best for adventure: </span>
            {bestMonthsText} — ideal conditions for outdoor activities
          </p>
        </div>
      )}

      {/* Attribution */}
      <p className={clsx("text-gray-400 mt-3", compact ? "text-[9px]" : "text-[10px]")}>
        Data: Met Office
      </p>
    </div>
  );
}
