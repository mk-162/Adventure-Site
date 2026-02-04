"use client";

import { useEffect, useState } from "react";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudFog, 
  CloudSnow, 
  CloudLightning, 
  Wind, 
  Droplets,
  CloudSun,
  BarChart3
} from "lucide-react";
import clsx from "clsx";
import { ClimateChart } from "./ClimateChart";

interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    windSpeed: number;
    humidity: number;
    icon: string;
    description: string;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    icon: string;
    rain: number;
    description: string;
  }>;
}

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  regionName: string;
  compact?: boolean;
  regionSlug?: string;
}

const ICON_MAP: Record<string, any> = {
  sun: Sun,
  cloud: Cloud,
  "partly-cloudy": CloudSun,
  rain: CloudRain,
  storm: CloudLightning,
  snow: CloudSnow,
  fog: CloudFog,
};

export function WeatherWidget({ lat, lng, regionName, compact = false, regionSlug }: WeatherWidgetProps) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<"now" | "climate">("now");

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
        if (!res.ok) throw new Error("Failed to fetch weather");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [lat, lng]);

  const getBestFor = (weather: WeatherData['current']) => {
    if (weather.icon === 'sun' && weather.windSpeed < 15) return "Great day for coasteering, hiking, kayaking";
    if (weather.icon === 'rain' || weather.icon === 'storm') return "Perfect for indoor climbing, caving, museums";
    if (weather.windSpeed > 20) return "Check with operators for water activities";
    return "Good conditions for most outdoor activities";
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-xl border border-gray-200 h-[160px]" />
    );
  }
  
  if (error || !data) return null;

  const CurrentIcon = ICON_MAP[data.current.icon] || Cloud;
  const showTabs = !!regionSlug;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      {/* Header with optional tabs */}
      <div className="px-3 pt-3 pb-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-[#1e3a4c]">{regionName} Weather</h3>
        </div>

        {showTabs && (
          <div className="flex gap-1 border-b border-gray-100 -mx-3 px-3">
            <button
              onClick={() => setActiveTab("now")}
              className={clsx(
                "text-xs font-semibold pb-2 px-2 border-b-2 transition-colors",
                activeTab === "now"
                  ? "border-[#1e3a4c] text-[#1e3a4c]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              Now
            </button>
            <button
              onClick={() => setActiveTab("climate")}
              className={clsx(
                "text-xs font-semibold pb-2 px-2 border-b-2 transition-colors flex items-center gap-1",
                activeTab === "climate"
                  ? "border-[#1e3a4c] text-[#1e3a4c]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              <BarChart3 className="w-3 h-3" />
              Climate
            </button>
          </div>
        )}
      </div>

      {/* Tab content */}
      {activeTab === "now" ? (
        <div className="p-3 pt-2">
          {/* Current conditions row */}
          <div className="flex items-center gap-3 mb-3">
            <CurrentIcon className="w-8 h-8 text-[#f97316] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#1e3a4c]">{data.current.temp}°C</span>
                <span className="text-xs text-gray-500 capitalize truncate">{data.current.description}</span>
              </div>
              <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3" />
                  {data.current.windSpeed}mph
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  {data.current.humidity}%
                </span>
              </div>
            </div>
          </div>

          {/* 5-day forecast */}
          <div className="grid grid-cols-5 gap-1 text-center py-2 border-t border-gray-100">
            {data.forecast.map((day) => {
              const DayIcon = ICON_MAP[day.icon] || Cloud;
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
              return (
                <div key={day.date} className="flex flex-col items-center gap-0.5">
                  <span className="text-[9px] uppercase font-bold text-gray-400">{dayName}</span>
                  <DayIcon className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-[10px] font-bold text-[#1e3a4c]">{day.high}°</span>
                </div>
              );
            })}
          </div>

          {/* Best for - compact */}
          <div className="bg-[#1e3a4c]/5 rounded-lg px-2.5 py-2 text-[11px] mt-2">
            <span className="font-bold text-[#1e3a4c]">Best for: </span>
            <span className="text-gray-600">{getBestFor(data.current)}</span>
          </div>
        </div>
      ) : (
        <div className="p-2">
          {regionSlug && <ClimateChart regionSlug={regionSlug} compact />}
        </div>
      )}
    </div>
  );
}
