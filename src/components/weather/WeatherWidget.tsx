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
  CloudSun
} from "lucide-react";
import clsx from "clsx";

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

export function WeatherWidget({ lat, lng, regionName, compact = false }: WeatherWidgetProps) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
          <div className={clsx("animate-pulse bg-gray-100 rounded-xl border border-gray-200", compact ? "h-[200px]" : "h-[200px]")} />
      );
  }
  
  if (error || !data) return null;

  const CurrentIcon = ICON_MAP[data.current.icon] || Cloud;

  return (
    <div className={clsx(
      "bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm",
      compact ? "p-4" : "p-6"
    )}>
      <div className={clsx("flex flex-col", !compact && "md:flex-row md:items-center md:gap-8")}>
        
        {/* Left: Current Weather */}
        <div className="flex-1">
            <div className="flex justify-between items-start mb-4 md:mb-2">
                <div>
                    <h3 className="font-bold text-[#1e3a4c]">{regionName} Weather</h3>
                    <p className="text-sm text-gray-500 capitalize">{data.current.description}</p>
                </div>
                {/* Temp on mobile or compact */}
                <div className={clsx("flex flex-col items-end", !compact && "md:hidden")}>
                    <div className="text-3xl font-bold text-[#1e3a4c]">{data.current.temp}°C</div>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-4 md:mb-0">
                <CurrentIcon className="w-10 h-10 lg:w-12 lg:h-12 text-[#f97316]" />
                <div>
                    {!compact && <div className="hidden md:block text-3xl font-bold text-[#1e3a4c] mb-1">{data.current.temp}°C</div>}
                    <div className="flex gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Wind className="w-3 h-3" />
                            {data.current.windSpeed}mph
                        </div>
                        <div className="flex items-center gap-1">
                            <Droplets className="w-3 h-3" />
                            {data.current.humidity}%
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Forecast & Best For */}
        <div className={clsx("flex-1", !compact && "md:border-l md:border-gray-100 md:pl-8")}>
             {/* Forecast */}
            <div className="grid grid-cols-5 gap-2 text-center mb-4 md:mb-2">
            {data.forecast.map((day) => {
                const DayIcon = ICON_MAP[day.icon] || Cloud;
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
                return (
                <div key={day.date} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400">{dayName}</span>
                    <DayIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-bold text-[#1e3a4c]">{day.high}°</span>
                </div>
                );
            })}
            </div>

            {/* Best For */}
            {!compact && (
                <div className="bg-[#1e3a4c]/5 rounded-lg p-3 text-xs lg:text-sm mt-3">
                <span className="font-bold text-[#1e3a4c]">Best for: </span>
                <span className="text-gray-700">{getBestFor(data.current)}</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
