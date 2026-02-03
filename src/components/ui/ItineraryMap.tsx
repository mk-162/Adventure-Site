"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "./MapView";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-2xl bg-gray-200 animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading route map...</span>
    </div>
  ),
});

interface ItineraryDay {
  dayNumber: number;
  title: string;
  lat?: number;
  lng?: number;
  type: "activity" | "accommodation" | "location";
}

interface ItineraryMapProps {
  days: ItineraryDay[];
  className?: string;
}

export function ItineraryMap({ days, className }: ItineraryMapProps) {
  // Convert days to markers with numbered pins
  const markers: MapMarker[] = days
    .filter((day) => day.lat && day.lng)
    .map((day) => ({
      id: `day-${day.dayNumber}`,
      lat: day.lat!,
      lng: day.lng!,
      type: day.type,
      title: `Day ${day.dayNumber}: ${day.title}`,
      subtitle: `Stop ${day.dayNumber}`,
    }));

  // Calculate center from all points
  const center = markers.length > 0
    ? [
        markers.reduce((sum, m) => sum + m.lat, 0) / markers.length,
        markers.reduce((sum, m) => sum + m.lng, 0) / markers.length,
      ] as [number, number]
    : undefined;

  return (
    <MapView
      markers={markers}
      center={center}
      zoom={9}
      height="400px"
      showRoute={true}
      className={className}
    />
  );
}
