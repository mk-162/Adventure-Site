"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  ExternalLink,
  Clock,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  Accessibility,
} from "lucide-react";

interface ShowCave {
  name: string;
  slug: string;
  location: string;
  description: string;
  facilities: string[];
  priceFrom: number;
  website: string;
  familyFriendly: boolean;
  highlights: string[];
  openingMonths: string;
  duration: string;
  accessibility: string;
  lat: number;
  lng: number;
}

interface ShowCaveCardProps {
  cave: ShowCave;
}

export function ShowCaveCard({ cave }: ShowCaveCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-primary mb-1">{cave.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              {cave.location}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">£{cave.priceFrom}</div>
            <div className="text-xs text-gray-500">adult entry</div>
          </div>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
          {cave.description}
        </p>

        {/* Quick info */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs bg-gray-100 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3 text-gray-500" />
            {cave.duration}
          </div>
          <div className="flex items-center gap-1.5 text-xs bg-gray-100 px-2 py-1 rounded-full">
            <Calendar className="h-3 w-3 text-gray-500" />
            {cave.openingMonths}
          </div>
          {cave.familyFriendly && (
            <div className="flex items-center gap-1.5 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              <Users className="h-3 w-3" />
              Family-friendly
            </div>
          )}
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {cave.highlights.map((highlight, i) => (
            <div
              key={i}
              className="flex items-start gap-1.5 text-xs text-gray-700"
            >
              <Star className="h-3 w-3 text-accent-hover flex-shrink-0 mt-0.5" />
              {highlight}
            </div>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-accent-hover transition-colors"
        >
          {expanded ? "Show less" : "More details"}
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
          {/* Facilities */}
          <div>
            <h4 className="text-sm font-semibold text-primary mb-2">Facilities</h4>
            <div className="flex flex-wrap gap-2">
              {cave.facilities.map((facility, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-full border border-gray-200"
                >
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {facility}
                </span>
              ))}
            </div>
          </div>

          {/* Accessibility */}
          <div className="flex items-start gap-2">
            <Accessibility className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{cave.accessibility}</p>
          </div>

          {/* CTA */}
          <a
            href={cave.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
          >
            Visit website
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}
