"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import clsx from "clsx";

// Dynamically import Leaflet components to avoid SSR issues
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

export type MarkerType =
  | "activity"
  | "accommodation"
  | "operator"
  | "event"
  | "location"
  | "transport";

export interface MapMarker {
  id: string | number;
  lat: number;
  lng: number;
  type: MarkerType;
  title: string;
  image?: string;
  link?: string;
  price?: string;
  subtitle?: string;
}

interface MapViewProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  interactive?: boolean;
  showRoute?: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
  className?: string;
}

const markerColors: Record<MarkerType, string> = {
  activity: "#3b82f6", // blue
  accommodation: "#22c55e", // green
  operator: "#f97316", // orange
  event: "#ef4444", // red
  location: "#a855f7", // purple
  transport: "#1f2937", // gray/black
};

const typeLabels: Record<MarkerType, string> = {
  activity: "Activity",
  accommodation: "Stay",
  operator: "Operator",
  event: "Event",
  location: "Location",
  transport: "Transport",
};

export default function MapView({
  markers,
  center,
  zoom = 10,
  height = "400px",
  interactive = true,
  showRoute = false,
  onMarkerClick,
  className,
}: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    setIsMounted(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  // Calculate center from markers if not provided
  const mapCenter = center || calculateCenter(markers);

  if (!isMounted || !L) {
    return (
      <div
        className={clsx(
          "bg-gray-100 flex items-center justify-center text-gray-400 animate-pulse rounded-xl",
          className
        )}
        style={{ height }}
      >
        Loading map...
      </div>
    );
  }

  // Create custom icon
  const createIcon = (type: MarkerType) => {
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="
        background-color: ${markerColors[type]};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });
  };

  const routePositions = showRoute
    ? markers.map((m) => [m.lat, m.lng] as [number, number])
    : [];

  return (
    <div className={clsx("rounded-xl overflow-hidden relative z-0", className)} style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showRoute && routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            color="#f97316"
            weight={3}
            opacity={0.8}
            dashArray="10, 10"
          />
        )}

        {markers.map((marker, index) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={createIcon(marker.type)}
            eventHandlers={{
              click: () => onMarkerClick?.(marker),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                {marker.image && (
                  <img
                    src={marker.image}
                    alt={marker.title}
                    className="w-full h-24 object-cover rounded-t-lg -mt-3 -mx-3 mb-2"
                    style={{ width: "calc(100% + 24px)" }}
                  />
                )}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-[#1e3a4c] text-sm leading-tight">
                    {showRoute && (
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-[#f97316] text-white text-xs rounded-full mr-1">
                        {index + 1}
                      </span>
                    )}
                    {marker.title}
                  </h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full text-white shrink-0"
                    style={{ backgroundColor: markerColors[marker.type] }}
                  >
                    {typeLabels[marker.type]}
                  </span>
                </div>
                {marker.subtitle && (
                  <p className="text-gray-600 text-xs mt-1">{marker.subtitle}</p>
                )}
                {marker.price && (
                  <p className="text-[#f97316] font-semibold text-sm mt-1">
                    {marker.price}
                  </p>
                )}
                {marker.link && (
                  <Link
                    href={marker.link}
                    className="block mt-2 text-xs text-[#f97316] hover:underline font-medium"
                  >
                    View Details →
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function calculateCenter(markers: MapMarker[]): [number, number] {
  if (markers.length === 0) {
    // Default to center of Wales
    return [52.4, -3.6];
  }

  const sumLat = markers.reduce((sum, m) => sum + m.lat, 0);
  const sumLng = markers.reduce((sum, m) => sum + m.lng, 0);

  return [sumLat / markers.length, sumLng / markers.length];
}
