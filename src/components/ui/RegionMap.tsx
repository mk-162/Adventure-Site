"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "./MapView";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video rounded-2xl bg-gray-200 animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  ),
});

interface RegionMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
}

export function RegionMap({ markers, center, zoom = 10, height = "400px", className }: RegionMapProps) {
  return (
    <MapView
      markers={markers}
      center={center}
      zoom={zoom}
      height={height}
      className={className}
    />
  );
}
