"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ItineraryStop } from "@/types/itinerary";
import { accommodation } from "@/db/schema";
import clsx from "clsx";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

type AccommodationData = typeof accommodation.$inferSelect;

interface ItineraryMapProps {
  stops: ItineraryStop[];
  mode: "standard" | "wet" | "budget";
  basecamp?: AccommodationData | null;
  className?: string;
}

const dayColors = [
  "#3b82f6", // Day 1: Blue
  "#22c55e", // Day 2: Green
  "var(--color-accent)", // Day 3: Orange
  "#ef4444", // Day 4: Red
  "#a855f7", // Day 5: Purple
];

export function ItineraryMap({ stops, mode, basecamp, className }: ItineraryMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  if (!isMounted || !L) {
    return (
      <div className={clsx("w-full h-[400px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400", className)}>
        Loading map...
      </div>
    );
  }

  const mapStops = stops.map(s => {
    let lat = s.lat ? Number(s.lat) : null;
    let lng = s.lng ? Number(s.lng) : null;
    let title = s.title;

    if (mode === "wet" && s.wetAltActivity) {
      lat = Number(s.wetAltActivity.lat);
      lng = Number(s.wetAltActivity.lng);
      title = s.wetAltTitle || s.wetAltActivity.name;
    } else if (mode === "budget" && s.budgetAltActivity) {
      lat = Number(s.budgetAltActivity.lat);
      lng = Number(s.budgetAltActivity.lng);
      title = s.budgetAltTitle || s.budgetAltActivity.name;
    } else if (s.activity) {
       if (lat === null) lat = Number(s.activity.lat);
       if (lng === null) lng = Number(s.activity.lng);
    }

    return { ...s, lat, lng, displayTitle: title };
  }).filter(s => s.lat !== null && s.lng !== null);

  const center: [number, number] = mapStops.length > 0 
    ? [mapStops.reduce((sum, s) => sum + (s.lat as number), 0) / mapStops.length, mapStops.reduce((sum, s) => sum + (s.lng as number), 0) / mapStops.length]
    : [52.4, -3.6];

  const createIcon = (day: number) => {
    const color = dayColors[(day - 1) % dayColors.length];
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">${day}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });
  };

  const createBasecampIcon = () => {
    return L.divIcon({
      className: "basecamp-marker",
      html: `<div style="
        background-color: var(--color-accent);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(249,115,22,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
      ">🏠</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });
  };

  const routePositions = mapStops.map(s => [s.lat, s.lng] as [number, number]);
  const uniqueDays = Array.from(new Set(mapStops.map(s => s.dayNumber))).sort((a,b) => a-b);

  // Basecamp connections - dashed lines from basecamp to first/last stops of each day
  const basecampConnections: Array<{ day: number; positions: [number, number][] }> = [];
  if (basecamp && basecamp.lat && basecamp.lng) {
    const basecampPos: [number, number] = [Number(basecamp.lat), Number(basecamp.lng)];
    
    uniqueDays.forEach(day => {
      const dayStops = mapStops.filter(s => s.dayNumber === day);
      if (dayStops.length > 0) {
        const firstStop = dayStops[0];
        const lastStop = dayStops[dayStops.length - 1];
        
        // Line from basecamp to first stop
        if (firstStop.lat && firstStop.lng) {
          basecampConnections.push({
            day,
            positions: [basecampPos, [firstStop.lat as number, firstStop.lng as number]]
          });
        }
        
        // Line from last stop back to basecamp (only if different from first)
        if (lastStop.lat && lastStop.lng && dayStops.length > 1) {
          basecampConnections.push({
            day,
            positions: [[lastStop.lat as number, lastStop.lng as number], basecampPos]
          });
        }
      }
    });
  }

  return (
    <div className={clsx("rounded-xl overflow-hidden relative group h-[400px] w-full", className)}>
      <div className="absolute top-4 right-4 z-[400] flex flex-wrap gap-2 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-md border border-gray-200 pointer-events-auto flex gap-1">
          <button
            onClick={() => setActiveDay(null)}
            className={clsx(
              "px-3 py-1.5 text-xs font-bold rounded-md transition-colors",
              activeDay === null ? "bg-gray-800 text-white" : "hover:bg-gray-100 text-gray-600"
            )}
          >
            All Days
          </button>
          {uniqueDays.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day === activeDay ? null : day)}
              className={clsx(
                "px-3 py-1.5 text-xs font-bold rounded-md transition-colors",
                activeDay === day ? "text-white" : "hover:bg-gray-100 text-gray-600"
              )}
              style={{ backgroundColor: activeDay === day ? dayColors[(day - 1) % dayColors.length] : undefined }}
            >
              Day {day}
            </button>
          ))}
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={9}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Basecamp dashed lines */}
        {basecampConnections.map((connection, idx) => (
          <Polyline
            key={`basecamp-${idx}`}
            positions={connection.positions}
            color="var(--color-accent)"
            weight={3}
            opacity={0.6}
            dashArray="8, 8"
          />
        ))}

        {routePositions.length > 1 && (
            <Polyline
            positions={routePositions}
            color="#6b7280"
            weight={4}
            opacity={0.6}
            dashArray="1, 0"
            />
        )}

        {/* Basecamp marker */}
        {basecamp && basecamp.lat && basecamp.lng && (
          <Marker
            position={[Number(basecamp.lat), Number(basecamp.lng)]}
            icon={createBasecampIcon()}
          >
            <Popup>
              <div className="min-w-[200px]">
                <span className="text-xs font-bold text-accent-hover uppercase tracking-wider mb-1 block">
                  Your Basecamp
                </span>
                <h3 className="font-bold text-primary">{basecamp.name}</h3>
                {basecamp.type && (
                  <p className="text-sm text-gray-600 mt-1">{basecamp.type}</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {mapStops.map((stop) => {
            const isVisible = activeDay === null || stop.dayNumber === activeDay;
            if (!isVisible) return null;

            return (
                <Marker
                    key={stop.id}
                    position={[stop.lat as number, stop.lng as number]}
                    icon={createIcon(stop.dayNumber)}
                >
                    <Popup>
                        <div className="min-w-[200px]">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                                Day {stop.dayNumber}
                            </span>
                            <h3 className="font-bold text-primary">{stop.displayTitle}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{stop.description}</p>
                        </div>
                    </Popup>
                </Marker>
            );
        })}

      </MapContainer>
    </div>
  );
}
