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
  Mountain,
  Clock,
  TrendingUp,
  Car,
  Coffee,
} from "lucide-react";

interface Trail {
  name: string;
  slug: string;
  region: string;
  regionSlug: string;
  mountain: string | null;
  distance: string;
  elevation: string;
  duration: string;
  difficulty: string;
  description: string;
  highlights: string[];
  startPoint: string;
  facilities: string[];
  insiderTip: string;
  rating: number;
  lat: number;
  lng: number;
}

interface TrailTableProps {
  trails: Trail[];
}

const difficultyColors: Record<string, string> = {
  easy: "#22c55e",
  moderate: "#3b82f6",
  challenging: "#f59e0b",
  strenuous: "#ef4444",
  expert: "#7c3aed",
};

const difficultyLabels: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  challenging: "Challenging",
  strenuous: "Strenuous",
  expert: "Expert",
};

export function TrailTable({ trails }: TrailTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "difficulty">("rating");
  const [sortDesc, setSortDesc] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);

  const difficultyOrder = ["easy", "moderate", "challenging", "strenuous", "expert"];

  const filteredTrails = filterDifficulty 
    ? trails.filter(t => t.difficulty === filterDifficulty)
    : trails;

  const sortedTrails = [...filteredTrails].sort((a, b) => {
    if (sortBy === "rating") {
      return sortDesc ? b.rating - a.rating : a.rating - b.rating;
    }
    // Sort by difficulty
    const aIdx = difficultyOrder.indexOf(a.difficulty);
    const bIdx = difficultyOrder.indexOf(b.difficulty);
    return sortDesc ? bIdx - aIdx : aIdx - bIdx;
  });

  const toggleSort = (field: "rating" | "difficulty") => {
    if (sortBy === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(field);
      setSortDesc(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterDifficulty(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filterDifficulty === null 
              ? "bg-primary text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Trails
        </button>
        {difficultyOrder.map((diff) => (
          <button
            key={diff}
            onClick={() => setFilterDifficulty(diff)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              filterDifficulty === diff 
                ? "text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={filterDifficulty === diff ? { backgroundColor: difficultyColors[diff] } : {}}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: difficultyColors[diff] }}
            />
            {difficultyLabels[diff]}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Trail
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                Region
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                Distance
              </th>
              <th 
                className="px-4 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-primary transition-colors"
                onClick={() => toggleSort("difficulty")}
              >
                <div className="flex items-center gap-1">
                  Difficulty
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                Duration
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
            {sortedTrails.map((trail) => (
              <tr 
                key={trail.slug}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-primary">
                      {trail.name}
                    </div>
                    {trail.mountain && (
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <Mountain className="h-3 w-3" />
                        {trail.mountain}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Link 
                    href={`/${trail.regionSlug}/hiking`}
                    className="text-sm text-gray-600 hover:text-accent-hover transition-colors"
                  >
                    {trail.region}
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm">
                    <div className="text-gray-700">{trail.distance}</div>
                    <div className="text-gray-500">{trail.elevation} ↑</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: difficultyColors[trail.difficulty] }}
                  >
                    {difficultyLabels[trail.difficulty]}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  {trail.duration}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-accent-hover font-medium">
                    <Star className="h-4 w-4 fill-current" />
                    {trail.rating}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => setExpandedId(expandedId === trail.slug ? null : trail.slug)}
                    className="text-primary hover:text-accent-hover transition-colors"
                  >
                    {expandedId === trail.slug ? (
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
            {sortedTrails
              .filter((t) => t.slug === expandedId)
              .map((trail) => (
                <div key={trail.slug} className="max-w-4xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <h4 className="font-semibold text-primary mb-1">
                          About
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {trail.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-primary mb-1">
                          Highlights
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {trail.highlights.map((h) => (
                            <span key={h} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-accent-hover/10 border-l-4 border-accent-hover p-3 rounded-r">
                        <h4 className="font-semibold text-primary mb-1 flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          Insider Tip
                        </h4>
                        <p className="text-gray-700 text-sm italic">
                          {trail.insiderTip}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-primary mb-2">
                          Start Point
                        </h4>
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          {trail.startPoint}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-primary mb-2">
                          Facilities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {trail.facilities.map((f) => (
                            <span key={f} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`https://www.google.com/maps?q=${trail.lat},${trail.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
                        >
                          Get Directions
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {sortedTrails.map((trail) => (
          <div
            key={trail.slug}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === trail.slug ? null : trail.slug)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-primary mb-1">
                    {trail.name}
                  </h3>
                  {trail.mountain && (
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Mountain className="h-3 w-3" />
                      {trail.mountain}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-accent-hover font-medium">
                  <Star className="h-4 w-4 fill-current" />
                  {trail.rating}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: difficultyColors[trail.difficulty] }}
                >
                  {difficultyLabels[trail.difficulty]}
                </span>
                <span className="text-sm text-gray-600">{trail.region}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {trail.distance}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {trail.duration}
                </div>
              </div>
            </div>

            {expandedId === trail.slug && (
              <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {trail.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {trail.highlights.map((h) => (
                    <span key={h} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {h}
                    </span>
                  ))}
                </div>

                <div className="bg-accent-hover/10 border-l-4 border-accent-hover p-3 rounded-r">
                  <p className="text-sm text-gray-700 italic">
                    💡 {trail.insiderTip}
                  </p>
                </div>

                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Start: {trail.startPoint}
                </div>

                <a
                  href={`https://www.google.com/maps?q=${trail.lat},${trail.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
                >
                  Get Directions
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
