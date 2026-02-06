"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowUpDown, 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  ExternalLink,
  Star,
  Zap,
  Waves,
  Wind,
  Timer,
  Car,
  Coffee,
  ShoppingBag,
  Shield,
} from "lucide-react";

interface SurfSpot {
  name: string;
  slug: string;
  region: string;
  regionSlug: string;
  location: string;
  waveType: string;
  difficulty: string[];
  bestSwell: string;
  bestWind: string;
  bestTide: string;
  description: string;
  facilities: string[];
  website: string | null;
  rating: number;
  insiderTip: string;
  lat: number;
  lng: number;
}

interface SurfSpotTableProps {
  spots: SurfSpot[];
}

const difficultyColors: Record<string, string> = {
  beginner: "#22c55e",
  intermediate: "#3b82f6",
  advanced: "#ef4444",
  expert: "#7c3aed",
};

const facilityIcons: Record<string, React.ReactNode> = {
  "parking": <Car className="h-4 w-4" />,
  "toilets": <span className="text-xs">🚻</span>,
  "showers": <span className="text-xs">🚿</span>,
  "cafe": <Coffee className="h-4 w-4" />,
  "surf-hire": <Waves className="h-4 w-4" />,
  "surf-school": <span className="text-xs">🏄</span>,
  "lifeguards-seasonal": <Shield className="h-4 w-4" />,
  "changing-rooms": <span className="text-xs">🚪</span>,
  "pub": <span className="text-xs">🍺</span>,
};

export function SurfSpotTable({ spots }: SurfSpotTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "name">("rating");
  const [sortDesc, setSortDesc] = useState(true);

  const sortedSpots = [...spots].sort((a, b) => {
    if (sortBy === "rating") {
      return sortDesc ? b.rating - a.rating : a.rating - b.rating;
    }
    return sortDesc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
  });

  const toggleSort = (field: "rating" | "name") => {
    if (sortBy === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(field);
      setSortDesc(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-primary transition-colors"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Surf Spot
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                Region
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                Wave Type
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                Skill Level
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                Conditions
              </th>
              <th 
                className="px-4 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-primary transition-colors"
                onClick={() => toggleSort("rating")}
              >
                <div className="flex items-center gap-1">
                  Rating
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="px-4 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedSpots.map((spot) => (
              <tr 
                key={spot.slug}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-primary">
                      {spot.name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {spot.location}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Link 
                    href={`/${spot.regionSlug}/surfing`}
                    className="text-sm text-gray-600 hover:text-accent-hover transition-colors"
                  >
                    {spot.region}
                  </Link>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {spot.waveType}
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-1.5">
                    {spot.difficulty.map((level) => (
                      <div
                        key={level}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: difficultyColors[level] }}
                        title={level}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Waves className="h-3 w-3" />
                      {spot.bestSwell}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Wind className="h-3 w-3" />
                      {spot.bestWind}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-accent-hover font-medium">
                    <Star className="h-4 w-4 fill-current" />
                    {spot.rating}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => setExpandedId(expandedId === spot.slug ? null : spot.slug)}
                    className="text-primary hover:text-accent-hover transition-colors"
                  >
                    {expandedId === spot.slug ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Expanded details */}
        {expandedId && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            {sortedSpots
              .filter((s) => s.slug === expandedId)
              .map((spot) => (
                <div key={spot.slug} className="max-w-4xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <h4 className="font-semibold text-primary mb-1">
                          About
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {spot.description}
                        </p>
                      </div>

                      <div className="bg-accent-hover/10 border-l-4 border-accent-hover p-3 rounded-r">
                        <h4 className="font-semibold text-primary mb-1 flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          Insider Tip
                        </h4>
                        <p className="text-gray-700 text-sm italic">
                          {spot.insiderTip}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-primary mb-2">
                          Best Conditions
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Waves className="h-4 w-4 text-blue-500" />
                            <span>Swell: {spot.bestSwell}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Wind className="h-4 w-4 text-gray-500" />
                            <span>Wind: {spot.bestWind}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Timer className="h-4 w-4 text-gray-500" />
                            <span>Tide: {spot.bestTide}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-primary mb-2">
                          Facilities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {spot.facilities.map((facility) => (
                            <div
                              key={facility}
                              className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded text-gray-700"
                            >
                              {facilityIcons[facility] || <span>•</span>}
                              {facility.replace("-", " ").replace("seasonal", "(seasonal)")}
                            </div>
                          ))}
                        </div>
                      </div>

                      {spot.website && (
                        <a
                          href={spot.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
                        >
                          Visit website
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {sortedSpots.map((spot) => (
          <div
            key={spot.slug}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === spot.slug ? null : spot.slug)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-primary mb-1">
                    {spot.name}
                  </h3>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {spot.location}, {spot.region}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-accent-hover font-medium">
                  <Star className="h-4 w-4 fill-current" />
                  {spot.rating}
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1.5">
                  {spot.difficulty.map((level) => (
                    <div
                      key={level}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: difficultyColors[level] }}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  {spot.waveType}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Waves className="h-3 w-3" />
                  {spot.bestSwell}
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="h-3 w-3" />
                  {spot.bestWind}
                </div>
              </div>
            </div>

            {expandedId === spot.slug && (
              <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {spot.description}
                </p>

                <div className="bg-accent-hover/10 border-l-4 border-accent-hover p-3 rounded-r">
                  <p className="text-sm text-gray-700 italic">
                    💡 {spot.insiderTip}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {spot.facilities.map((facility) => (
                    <span
                      key={facility}
                      className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700"
                    >
                      {facility.replace("-", " ")}
                    </span>
                  ))}
                </div>

                {spot.website && (
                  <a
                    href={spot.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
                  >
                    Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
