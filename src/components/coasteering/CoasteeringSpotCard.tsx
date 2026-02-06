"use client";

import { useState } from "react";
import { 
  MapPin, 
  Star,
  Zap,
  ChevronDown,
  ChevronUp,
  Waves,
  Mountain,
  Fish,
  Users,
} from "lucide-react";

interface CoasteeringSpot {
  name: string;
  slug: string;
  region: string;
  regionSlug: string;
  location: string;
  description: string;
  difficulty: string[];
  features: string[];
  bestFor: string;
  insiderTip: string;
  operators: string[];
  rating: number;
  lat: number;
  lng: number;
}

interface CoasteeringSpotCardProps {
  spots: CoasteeringSpot[];
}

const difficultyColors: Record<string, string> = {
  beginner: "#22c55e",
  intermediate: "#3b82f6",
  advanced: "#ef4444",
};

const featureIcons: Record<string, React.ReactNode> = {
  "caves": <Mountain className="h-3 w-3" />,
  "jumping": <span>🪂</span>,
  "swimming": <Waves className="h-3 w-3" />,
  "wildlife": <Fish className="h-3 w-3" />,
  "seals": <span>🦭</span>,
  "lagoon": <span>💎</span>,
};

export function CoasteeringSpotCards({ spots }: CoasteeringSpotCardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {spots.map((spot) => (
        <div
          key={spot.slug}
          className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-primary mb-1">
                  {spot.name}
                </h3>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {spot.location}, {spot.region}
                </div>
              </div>
              <div className="flex items-center gap-1 text-accent-hover font-semibold">
                <Star className="h-4 w-4 fill-current" />
                {spot.rating}
              </div>
            </div>

            {/* Difficulty badges */}
            <div className="flex gap-1.5 mb-3">
              {spot.difficulty.map((level) => (
                <span
                  key={level}
                  className="px-2 py-0.5 rounded-full text-xs font-medium text-white capitalize"
                  style={{ backgroundColor: difficultyColors[level] }}
                >
                  {level}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-700 mb-3">
              {spot.bestFor}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {spot.features.slice(0, 4).map((feature) => (
                <span
                  key={feature}
                  className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded text-gray-700"
                >
                  {featureIcons[feature] || <span>•</span>}
                  {feature.replace("-", " ")}
                </span>
              ))}
            </div>

            <button
              onClick={() => setExpandedId(expandedId === spot.slug ? null : spot.slug)}
              className="flex items-center gap-1 text-sm text-primary hover:text-accent-hover font-medium transition-colors"
            >
              {expandedId === spot.slug ? (
                <>Less info <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>More info <ChevronDown className="h-4 w-4" /></>
              )}
            </button>
          </div>

          {expandedId === spot.slug && (
            <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {spot.description}
              </p>

              <div className="bg-accent-hover/10 border-l-4 border-accent-hover p-3 rounded-r">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-accent-hover flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 italic">
                    {spot.insiderTip}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2 flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Operators at this location
                </h4>
                <div className="flex flex-wrap gap-2">
                  {spot.operators.map((op) => (
                    <span
                      key={op}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                    >
                      {op}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={`https://www.google.com/maps?q=${spot.lat},${spot.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
              >
                Get Directions
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
