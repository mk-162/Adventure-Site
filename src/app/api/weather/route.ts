import { NextRequest, NextResponse } from "next/server";
import { validateSearchParams, weatherQuerySchema } from "@/lib/api/validate";

// Cache responses in-memory per region for 30 minutes. Function instances
// outlive a single request on Fluid Compute, so this is genuinely shared.
const CACHE_DURATION = 30 * 60 * 1000;
const cache = new Map<string, { data: unknown; timestamp: number }>();

// WMO weather code → icon + label (Open-Meteo uses WMO codes).
// See https://open-meteo.com/en/docs (search "WMO Weather interpretation codes").
function wmoToIcon(code: number): { icon: string; description: string } {
  if (code === 0) return { icon: "sun", description: "Clear sky" };
  if (code === 1) return { icon: "partly-cloudy", description: "Mainly clear" };
  if (code === 2) return { icon: "partly-cloudy", description: "Partly cloudy" };
  if (code === 3) return { icon: "cloud", description: "Overcast" };
  if (code === 45 || code === 48) return { icon: "fog", description: "Foggy" };
  if (code >= 51 && code <= 57) return { icon: "rain", description: "Drizzle" };
  if (code >= 61 && code <= 65) return { icon: "rain", description: "Rain" };
  if (code >= 66 && code <= 67) return { icon: "rain", description: "Freezing rain" };
  if (code >= 71 && code <= 77) return { icon: "snow", description: "Snow" };
  if (code >= 80 && code <= 82) return { icon: "rain", description: "Rain showers" };
  if (code >= 85 && code <= 86) return { icon: "snow", description: "Snow showers" };
  if (code >= 95) return { icon: "storm", description: "Thunderstorm" };
  return { icon: "cloud", description: "Cloudy" };
}

function getMockData() {
  return {
    current: {
      temp: 13,
      feelsLike: 11,
      windSpeed: 12,
      humidity: 78,
      icon: "partly-cloudy",
      description: "Partly cloudy",
    },
    forecast: Array.from({ length: 5 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      return {
        date: date.toISOString().split("T")[0],
        high: 14,
        low: 8,
        icon: "partly-cloudy",
        rain: 20,
        description: "Partly cloudy",
      };
    }),
  };
}

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    wind_speed_10m?: number;
    relative_humidity_2m?: number;
    weather_code?: number;
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

async function fetchOpenMeteo(lat: number, lng: number): Promise<OpenMeteoResponse | null> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    current:
      "temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m,weather_code",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "Europe/London",
    wind_speed_unit: "mph",
    temperature_unit: "celsius",
    forecast_days: "6",
  });

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      { next: { revalidate: 1800 } },
    );
    if (!res.ok) return null;
    return (await res.json()) as OpenMeteoResponse;
  } catch (e) {
    console.error("[weather] Open-Meteo fetch failed", e);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const v = validateSearchParams(request.nextUrl.searchParams, weatherQuerySchema);
  if (!v.ok) return v.response;
  const lat = Number(v.data.lat);
  const lng = Number(v.data.lng);

  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  const raw = await fetchOpenMeteo(lat, lng);

  if (!raw || !raw.current || !raw.daily) {
    const fallback = getMockData();
    cache.set(cacheKey, { data: fallback, timestamp: Date.now() });
    return NextResponse.json(fallback);
  }

  const currentMeta = wmoToIcon(raw.current.weather_code ?? 3);

  const data = {
    current: {
      temp: Math.round(raw.current.temperature_2m ?? 0),
      feelsLike: Math.round(raw.current.apparent_temperature ?? 0),
      windSpeed: Math.round(raw.current.wind_speed_10m ?? 0),
      humidity: Math.round(raw.current.relative_humidity_2m ?? 0),
      icon: currentMeta.icon,
      description: currentMeta.description,
    },
    forecast: (raw.daily.time || [])
      .slice(1, 6) // skip "today" — show next 5 days
      .map((date, i) => {
        const meta = wmoToIcon(raw.daily!.weather_code[i + 1] ?? 3);
        return {
          date,
          high: Math.round(raw.daily!.temperature_2m_max[i + 1] ?? 0),
          low: Math.round(raw.daily!.temperature_2m_min[i + 1] ?? 0),
          icon: meta.icon,
          rain: Math.round(
            raw.daily!.precipitation_probability_max?.[i + 1] ?? 0,
          ),
          description: meta.description,
        };
      }),
  };

  cache.set(cacheKey, { data, timestamp: Date.now() });
  return NextResponse.json(data);
}
