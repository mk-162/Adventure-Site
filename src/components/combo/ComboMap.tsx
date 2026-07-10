'use client';

import dynamic from 'next/dynamic';
import { MapPin, ArrowRight } from 'lucide-react';
import type { MapMarker } from '@/components/ui/MapView';
import type { ComboSpot } from '@/lib/combo-data';

const MapView = dynamic(() => import('@/components/ui/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] rounded-xl bg-gray-200 animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  ),
});

interface ComboMapProps {
  spots: ComboSpot[];
}

/**
 * Interactive map for combo ("sport in a location") pages.
 *
 * Plots one numbered marker per spot that has coordinates (numbering matches
 * the order of `spots`, 1-indexed — the same order used by ComboSpotCard).
 * Falls back to a "Get directions" list when there are no coordinates, and
 * always renders that list beneath the map so users have a plain-text option.
 */
export function ComboMap({ spots }: ComboMapProps) {
  const spotsWithCoords = spots.filter(
    (s): s is ComboSpot & { startPoint: NonNullable<ComboSpot['startPoint']> } =>
      Boolean(s.startPoint?.lat)
  );

  if (spotsWithCoords.length === 0) return null;

  const markers: MapMarker[] = spotsWithCoords.map((spot) => {
    const originalIndex = spots.indexOf(spot);
    return {
      id: spot.slug,
      lat: spot.startPoint.lat,
      lng: spot.startPoint.lng,
      type: 'location',
      title: `${originalIndex + 1}. ${spot.name}`,
      subtitle: spot.difficulty,
      link: undefined,
    };
  });

  const center = calculateCenter(markers);

  return (
    <div className="bg-white rounded-xl border border-border p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-accent-strong" />
        <span className="text-sm font-semibold text-primary">
          {spotsWithCoords.length} spot{spotsWithCoords.length === 1 ? '' : 's'} on the map
        </span>
      </div>

      <MapView
        markers={markers}
        center={center}
        zoom={11}
        height="350px"
        className="mb-4"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {spots.map((spot, i) => {
          if (!spot.startPoint?.lat) return null;
          return (
            <a
              key={spot.slug}
              href={`https://www.google.com/maps/dir/?api=1&destination=${spot.startPoint.lat},${spot.startPoint.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-sm"
            >
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-slate-700 truncate">{spot.name}</span>
              <ArrowRight className="w-3 h-3 text-slate-400 ml-auto shrink-0" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

function calculateCenter(markers: MapMarker[]): [number, number] {
  if (markers.length === 0) return [52.4, -3.6];
  const sumLat = markers.reduce((sum, m) => sum + m.lat, 0);
  const sumLng = markers.reduce((sum, m) => sum + m.lng, 0);
  return [sumLat / markers.length, sumLng / markers.length];
}
