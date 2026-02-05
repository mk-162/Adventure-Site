'use client';

import dynamic from 'next/dynamic';
import type { MapMarker } from '@/components/ui/MapView';

const MapView = dynamic(() => import('@/components/ui/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] rounded-xl bg-gray-200 animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  ),
});

interface ActivityLocationMapProps {
  markers: MapMarker[];
  center?: [number, number];
  nearbyCount: number;
}

export function ActivityLocationMap({ markers, center, nearbyCount }: ActivityLocationMapProps) {
  if (markers.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-primary mb-4">
        Location & Nearby Accommodation
      </h2>
      <MapView
        markers={markers}
        center={center}
        zoom={13}
        height="350px"
        className="rounded-xl shadow-sm"
      />

      {/* Map Legend */}
      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3b82f6] border-2 border-white shadow-sm"></span>
          Activity
        </span>
        {nearbyCount > 0 && (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#22c55e] border-2 border-white shadow-sm"></span>
            Nearby Stays ({nearbyCount})
          </span>
        )}
      </div>
    </section>
  );
}
