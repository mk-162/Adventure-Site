"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Info, Sun, Snowflake } from "lucide-react";

interface WeatherData {
  current: {
    temp: number;
    windSpeed: number;
    icon: string;
    description: string;
  };
}

interface ActivityWeatherAlertProps {
  lat: number;
  lng: number;
  activityType?: string;
}

export function ActivityWeatherAlert({ lat, lng, activityType = "activities" }: ActivityWeatherAlertProps) {
  const [weather, setWeather] = useState<WeatherData['current'] | null>(null);

  useEffect(() => {
    fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      .then(res => res.json())
      .then(data => setWeather(data.current))
      .catch(console.error);
  }, [lat, lng]);

  if (!weather) return null;

  // Logic
  const isRain = ['rain', 'storm'].includes(weather.icon);
  const isWindy = weather.windSpeed > 25;
  const isCold = weather.temp < 5;
  const isGreat = weather.icon === 'sun' && !isWindy && weather.temp > 12;

  // Prioritize warnings
  if (isRain) {
    return (
      <div className="w-full bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
        <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-sm text-blue-700 font-medium">
                🌧️ Rain expected — consider wet weather alternatives if you're planning {activityType}.
            </p>
        </div>
      </div>
    );
  }

  if (isWindy) {
     return (
      <div className="w-full bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg">
        <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
            <p className="text-sm text-orange-700 font-medium">
                💨 High winds forecast — check with operator before booking water activities.
            </p>
        </div>
      </div>
    );
  }

  if (isCold) {
      return (
      <div className="w-full bg-cyan-50 border-l-4 border-cyan-500 p-4 mb-6 rounded-r-lg">
        <div className="flex items-center gap-3">
            <Snowflake className="w-5 h-5 text-cyan-500 shrink-0" />
            <p className="text-sm text-cyan-700 font-medium">
                🧊 Cold snap — pack extra layers for your {activityType} adventure.
            </p>
        </div>
      </div>
    );
  }

  if (isGreat) {
       return (
      <div className="w-full bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
        <div className="flex items-center gap-3">
            <Sun className="w-5 h-5 text-green-500 shrink-0" />
            <p className="text-sm text-green-700 font-medium">
                ☀️ Perfect conditions for {activityType} this week!
            </p>
        </div>
      </div>
    );
  }

  return null;
}
