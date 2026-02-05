"use client";

import { useState } from "react";
import {
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Users,
  CheckCircle,
} from "lucide-react";

interface AdventureCave {
  name: string;
  slug: string;
  difficulty: string;
  location: string;
  description: string;
  whatToExpect: string[];
  typicalDuration: string;
  operatorsOffering: string[];
  bestFor: string;
  permitRequired?: boolean;
  permitInfo?: string;
  lat?: number;
  lng?: number;
}

interface AdventureCaveCardProps {
  cave: AdventureCave;
}

const difficultyColors: Record<string, { bg: string; text: string; border: string }> = {
  beginner: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  intermediate: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  advanced: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  expert: { bg: "bg-gray-900", text: "text-white", border: "border-gray-700" },
};

export function AdventureCaveCard({ cave }: AdventureCaveCardProps) {
  const [expanded, setExpanded] = useState(false);
  const colors = difficultyColors[cave.difficulty] || difficultyColors.beginner;

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-primary">{cave.name}</h3>
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${colors.bg} ${colors.text}`}
              >
                {cave.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              {cave.location}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            {cave.typicalDuration}
          </div>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
          {cave.description}
        </p>

        {/* Best for */}
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm text-gray-700">
            <span className="font-medium">Best for:</span> {cave.bestFor}
          </span>
        </div>

        {/* Permit warning */}
        {cave.permitRequired && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <span className="font-semibold">Permit required.</span>{" "}
              {cave.permitInfo}
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-accent-hover transition-colors"
        >
          {expanded ? "Show less" : "What to expect"}
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
          {/* What to expect */}
          <div>
            <h4 className="text-sm font-semibold text-primary mb-2">What to expect</h4>
            <ul className="space-y-1.5">
              {cave.whatToExpect.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Operators */}
          {cave.operatorsOffering.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-primary mb-2">
                Available from
              </h4>
              <div className="flex flex-wrap gap-2">
                {cave.operatorsOffering.map((operator, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200"
                  >
                    {operator}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
