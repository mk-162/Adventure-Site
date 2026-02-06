"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowUpDown, 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  ExternalLink,
  CheckCircle,
  X,
  Star,
  Zap,
  Coffee,
  Bike,
  ShowerHead,
  Droplet,
  ShoppingBag,
} from "lucide-react";

interface TrailCentre {
  name: string;
  slug: string;
  region: string;
  regionSlug: string;
  location: string;
  grades: string[];
  trailCount: number;
  hasUplift: boolean;
  hasCafe: boolean;
  hasBikeHire: boolean;
  hasShowers: boolean;
  hasBikeWash: boolean;
  hasShop: boolean;
  bestFor: string;
  description: string;
  website: string;
  rating: number;
  priceFrom: string;
  insiderTip: string;
  lat: number;
  lng: number;
}

interface TrailCentreTableProps {
  centres: TrailCentre[];
}

const gradeColors: Record<string, string> = {
  green: "#22c55e",
  blue: "#3b82f6",
  red: "#ef4444",
  black: "#111",
  pro: "#7c3aed",
};

export function TrailCentreTable({ centres }: TrailCentreTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "trails">("rating");
  const [sortDesc, setSortDesc] = useState(true);

  const sortedCentres = [...centres].sort((a, b) => {
    if (sortBy === "rating") {
      return sortDesc ? b.rating - a.rating : a.rating - b.rating;
    }
    return sortDesc ? b.trailCount - a.trailCount : a.trailCount - b.trailCount;
  });

  const toggleSort = (field: "rating" | "trails") => {
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
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Centre
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                Region
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                Grades
              </th>
              <th 
                className="px-4 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-primary transition-colors"
                onClick={() => toggleSort("trails")}
              >
                <div className="flex items-center gap-1">
                  Trails
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">
                Facilities
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
            {sortedCentres.map((centre) => (
              <tr 
                key={centre.slug}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-primary">
                      {centre.name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {centre.location}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Link 
                    href={`/${centre.regionSlug}/mountain-biking`}
                    className="text-sm text-gray-600 hover:text-accent-hover transition-colors"
                  >
                    {centre.region}
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-1.5">
                    {centre.grades.map((grade) => (
                      <div
                        key={grade}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: gradeColors[grade] }}
                        title={grade}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-700 font-medium">
                  {centre.trailCount}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {centre.hasUplift && (
                      <span title="Uplift"><Zap className="h-4 w-4 text-accent-hover" /></span>
                    )}
                    {centre.hasCafe && (
                      <span title="Café"><Coffee className="h-4 w-4 text-gray-400" /></span>
                    )}
                    {centre.hasBikeHire && (
                      <span title="Bike hire"><Bike className="h-4 w-4 text-gray-400" /></span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-accent-hover font-medium">
                    <Star className="h-4 w-4 fill-current" />
                    {centre.rating}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => setExpandedId(expandedId === centre.slug ? null : centre.slug)}
                    className="text-primary hover:text-accent-hover transition-colors"
                  >
                    {expandedId === centre.slug ? (
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
            {sortedCentres
              .filter((c) => c.slug === expandedId)
              .map((centre) => (
                <div key={centre.slug} className="max-w-4xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <h4 className="font-semibold text-primary mb-1">
                          About
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {centre.description}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-primary mb-1">
                          Best for
                        </h4>
                        <p className="text-gray-700 text-sm">
                          {centre.bestFor}
                        </p>
                      </div>

                      <div className="bg-accent-hover/10 border-l-4 border-accent-hover p-3 rounded-r">
                        <h4 className="font-semibold text-primary mb-1 flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          Insider Tip
                        </h4>
                        <p className="text-gray-700 text-sm italic">
                          {centre.insiderTip}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-primary mb-2">
                          Facilities
                        </h4>
                        <div className="space-y-1 text-sm">
                          <FacilityItem 
                            has={centre.hasUplift} 
                            label="Uplift service" 
                            icon={<Zap className="h-4 w-4" />}
                          />
                          <FacilityItem 
                            has={centre.hasCafe} 
                            label="Café" 
                            icon={<Coffee className="h-4 w-4" />}
                          />
                          <FacilityItem 
                            has={centre.hasBikeHire} 
                            label="Bike hire" 
                            icon={<Bike className="h-4 w-4" />}
                          />
                          <FacilityItem 
                            has={centre.hasShowers} 
                            label="Showers" 
                            icon={<ShowerHead className="h-4 w-4" />}
                          />
                          <FacilityItem 
                            has={centre.hasBikeWash} 
                            label="Bike wash" 
                            icon={<Droplet className="h-4 w-4" />}
                          />
                          <FacilityItem 
                            has={centre.hasShop} 
                            label="Shop" 
                            icon={<ShoppingBag className="h-4 w-4" />}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          Price from
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {centre.priceFrom === "Free" ? "Free" : `£${centre.priceFrom}`}
                        </div>
                      </div>

                      <a
                        href={centre.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
                      >
                        Visit website
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {sortedCentres.map((centre) => (
          <div
            key={centre.slug}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === centre.slug ? null : centre.slug)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-primary mb-1">
                    {centre.name}
                  </h3>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {centre.location}, {centre.region}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-accent-hover font-medium">
                  <Star className="h-4 w-4 fill-current" />
                  {centre.rating}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {centre.grades.map((grade) => (
                    <div
                      key={grade}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: gradeColors[grade] }}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  {centre.trailCount} trails
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3">
                {centre.hasUplift && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Zap className="h-3 w-3 text-accent-hover" />
                    Uplift
                  </div>
                )}
                {centre.hasCafe && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Coffee className="h-3 w-3" />
                    Café
                  </div>
                )}
                {centre.hasBikeHire && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Bike className="h-3 w-3" />
                    Hire
                  </div>
                )}
              </div>
            </div>

            {expandedId === centre.slug && (
              <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {centre.description}
                </p>

                <div className="bg-accent-hover/10 border-l-4 border-accent-hover p-3 rounded-r">
                  <p className="text-sm text-gray-700 italic">
                    💡 {centre.insiderTip}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm font-bold text-primary">
                    {centre.priceFrom === "Free" ? "Free" : `From £${centre.priceFrom}`}
                  </div>
                  <a
                    href={centre.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
                  >
                    Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FacilityItem({ 
  has, 
  label, 
  icon 
}: { 
  has: boolean; 
  label: string; 
  icon: React.ReactNode;
}) {
  return (
    <div className={`flex items-center gap-2 ${has ? 'text-gray-700' : 'text-gray-400'}`}>
      {has ? (
        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
      ) : (
        <X className="h-4 w-4 text-gray-300 flex-shrink-0" />
      )}
      <div className="flex items-center gap-1.5">
        {icon}
        {label}
      </div>
    </div>
  );
}
