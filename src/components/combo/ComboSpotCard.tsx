import {
  MapPin,
  Clock,
  Mountain,
  Ruler,
  TrendingUp,
  Car,
  Lightbulb,
  PoundSterling,
  Calendar,
} from "lucide-react";
import type { ComboSpot } from "@/lib/combo-data";

function getDifficultyColor(difficulty: string) {
  switch (difficulty?.toLowerCase()) {
    case "easy": return "bg-green-100 text-green-700";
    case "moderate": return "bg-yellow-100 text-yellow-700";
    case "challenging": case "hard": case "difficult": return "bg-orange-100 text-orange-700";
    case "expert": case "extreme": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
}

export function ComboSpotCard({ spot, index }: { spot: ComboSpot; index: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
              {index + 1}
            </span>
            <h3 className="font-bold text-primary text-lg leading-tight">{spot.name}</h3>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${getDifficultyColor(spot.difficulty)}`}>
            {spot.difficulty}
          </span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">{spot.description}</p>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          {spot.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-accent-hover" />
              {spot.duration}
            </span>
          )}
          {spot.distance && (
            <span className="flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5 text-accent-hover" />
              {spot.distance}
            </span>
          )}
          {spot.elevationGain && (
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-accent-hover" />
              ↑{spot.elevationGain}
            </span>
          )}
          {spot.estimatedCost && (
            <span className="flex items-center gap-1">
              <PoundSterling className="w-3.5 h-3.5 text-accent-hover" />
              {spot.estimatedCost}
            </span>
          )}
          {spot.bestSeason && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-accent-hover" />
              {spot.bestSeason}
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="border-t border-gray-100 px-5 py-3 bg-gray-50/50 space-y-2">
        {spot.bestFor && (
          <p className="text-xs"><span className="font-semibold text-emerald-700">Best for:</span> <span className="text-gray-600">{spot.bestFor}</span></p>
        )}
        {spot.parking && (
          <p className="text-xs flex items-start gap-1.5">
            <Car className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
            <span className="text-gray-600">{spot.parking}</span>
          </p>
        )}
        {spot.startPoint && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${spot.startPoint.lat},${spot.startPoint.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-accent-hover transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            Get directions to {spot.startPoint.name}
          </a>
        )}
        {spot.insiderTip && (
          <div className="flex items-start gap-1.5 bg-amber-50 rounded-lg p-2 -mx-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800"><span className="font-semibold">Insider tip:</span> {spot.insiderTip}</p>
          </div>
        )}
      </div>
    </div>
  );
}
