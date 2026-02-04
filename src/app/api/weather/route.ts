import { NextRequest, NextResponse } from "next/server";

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

// Simple mock generator
function getMockData() {
    const weatherTypes = [
        { icon: "sun", description: "Sunny", tempRange: [12, 18], rainChance: 5 },
        { icon: "partly-cloudy", description: "Partly Cloudy", tempRange: [10, 16], rainChance: 20 },
        { icon: "cloud", description: "Cloudy", tempRange: [8, 14], rainChance: 40 },
        { icon: "rain", description: "Light Rain", tempRange: [8, 13], rainChance: 80 },
        { icon: "storm", description: "Stormy", tempRange: [10, 15], rainChance: 95 },
        { icon: "fog", description: "Foggy", tempRange: [6, 11], rainChance: 10 },
        { icon: "snow", description: "Snow", tempRange: [-2, 4], rainChance: 60 },
    ];

    const current = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    const temp = Math.floor(Math.random() * (current.tempRange[1] - current.tempRange[0] + 1) + current.tempRange[0]);
    
    return {
        current: {
            temp: temp,
            feelsLike: temp - 2,
            windSpeed: Math.floor(Math.random() * 25) + 5, // 5-30 mph
            humidity: Math.floor(Math.random() * 40) + 60, // 60-100%
            icon: current.icon,
            description: current.description
        },
        forecast: Array.from({ length: 5 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i + 1);
            
            const forecast = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            const high = Math.floor(Math.random() * (forecast.tempRange[1] - forecast.tempRange[0] + 1) + forecast.tempRange[0]);
            
            return {
                date: date.toISOString().split('T')[0],
                high: high,
                low: high - 6,
                icon: forecast.icon,
                rain: forecast.rainChance,
                description: forecast.description
            };
        })
    };
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
        return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
    }

    const cacheKey = `${lat},${lng}`;
    const cached = cache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        return NextResponse.json(cached.data);
    }

    // In a real implementation, we would use the Met Office DataPoint API here
    // const apiKey = process.env.MET_OFFICE_API_KEY;
    // ... logic to fetch from API ...

    // For now, return realistic mock data
    const data = getMockData();

    cache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data);
}
