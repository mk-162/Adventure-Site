"use client";

import {
  MapPin,
  ExternalLink,
  Star,
  Users,
  CheckCircle,
} from "lucide-react";

interface Operator {
  name: string;
  slug: string;
  website: string;
  location: string;
  services: string[];
  priceFrom: number;
  rating: number | null;
  reviewCount: number | null;
  specialties: string;
  minGroupSize: number | null;
  equipment: string;
}

interface OperatorCardProps {
  operator: Operator;
}

export function OperatorCard({ operator }: OperatorCardProps) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-accent-hover/30 transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-primary mb-1">{operator.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              {operator.location}
            </div>
          </div>
          {operator.rating && (
            <div className="flex items-center gap-1 text-accent-hover">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold">{operator.rating}</span>
              {operator.reviewCount && (
                <span className="text-xs text-gray-500">
                  ({operator.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Specialties */}
        <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-2">
          {operator.specialties}
        </p>

        {/* Services */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {operator.services.slice(0, 4).map((service, i) => (
            <span
              key={i}
              className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium"
            >
              {service}
            </span>
          ))}
          {operator.services.length > 4 && (
            <span className="text-xs text-gray-500">
              +{operator.services.length - 4} more
            </span>
          )}
        </div>

        {/* Key info */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">From</span>{" "}
            <span className="font-bold text-primary">£{operator.priceFrom}</span>
          </div>
          {operator.minGroupSize && (
            <div className="flex items-center gap-1 text-gray-600">
              <Users className="h-4 w-4" />
              Min {operator.minGroupSize}
            </div>
          )}
        </div>

        {/* Equipment note */}
        {operator.equipment && (
          <div className="flex items-start gap-2 text-xs text-gray-600 mb-4">
            <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
            {operator.equipment}
          </div>
        )}

        {/* CTA */}
        <a
          href={operator.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
        >
          Visit website
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
