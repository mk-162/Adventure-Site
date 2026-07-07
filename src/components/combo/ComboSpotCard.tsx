import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Ruler,
  TrendingUp,
  Car,
  Lightbulb,
  PoundSterling,
  Calendar,
} from "lucide-react";
import type { ComboSpot } from "@/lib/combo-data";
import { getDifficultyColor } from "@/lib/design-tokens";

/** True when the field has a real value — guards against the literal string "null" seen in some JSON. */
function hasValue(value: string | undefined | null): value is string {
  return Boolean(value) && value !== "null";
}

export function ComboSpotCard({ spot, index }: { spot: ComboSpot; index: number }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <CardContent className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
              {index + 1}
            </span>
            <h3 className="font-bold text-primary text-lg leading-tight">{spot.name}</h3>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-sm font-semibold shrink-0 ${getDifficultyColor(spot.difficulty)}`}>
            {spot.difficulty}
          </span>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-4">{spot.description}</p>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          {hasValue(spot.duration) && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-accent-strong" />
              {spot.duration}
            </span>
          )}
          {hasValue(spot.distance) && (
            <span className="flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5 text-accent-strong" />
              {spot.distance}
            </span>
          )}
          {hasValue(spot.elevationGain) && (
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-accent-strong" />
              ↑{spot.elevationGain}
            </span>
          )}
          {hasValue(spot.estimatedCost) && (
            <span className="flex items-center gap-1">
              <PoundSterling className="w-3.5 h-3.5 text-accent-strong" />
              {spot.estimatedCost}
            </span>
          )}
          {hasValue(spot.bestSeason) && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-accent-strong" />
              {spot.bestSeason}
            </span>
          )}
        </div>
      </CardContent>

      {/* Details */}
      <CardContent className="border-t border-border px-5 py-3 bg-slate-50 space-y-2.5">
        {hasValue(spot.bestFor) && (
          <p className="text-sm"><span className="font-semibold text-emerald-700">Best for:</span> <span className="text-slate-600">{spot.bestFor}</span></p>
        )}
        {hasValue(spot.parking) && (
          <p className="text-sm flex items-start gap-1.5">
            <Car className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="text-slate-600">{spot.parking}</span>
          </p>
        )}
        {spot.startPoint && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${spot.startPoint.lat},${spot.startPoint.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent-strong transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            Get directions to {spot.startPoint.name}
          </a>
        )}
        {hasValue(spot.insiderTip) && (
          <div className="flex items-start gap-1.5 bg-amber-50 rounded-lg p-2 -mx-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800"><span className="font-semibold">Insider tip:</span> {spot.insiderTip}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
