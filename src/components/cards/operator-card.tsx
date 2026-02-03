import Link from "next/link";
import { MapPin, Star, CheckCircle, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OperatorCardProps {
  operator: {
    id: number;
    name: string;
    slug: string;
    tagline: string | null;
    address: string | null;
    googleRating: string | null;
    reviewCount: number | null;
    priceRange: string | null;
    claimStatus: "stub" | "claimed" | "premium";
    activityTypes: string[] | null;
    uniqueSellingPoint: string | null;
    logoUrl: string | null;
  };
  variant?: "default" | "featured" | "compact";
}

export function OperatorCard({ operator, variant = "default" }: OperatorCardProps) {
  const isClaimed = operator.claimStatus === "claimed" || operator.claimStatus === "premium";
  const isPremium = operator.claimStatus === "premium";

  if (variant === "featured") {
    return (
      <Link
        href={`/directory/${operator.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border-2 border-[#f97316]/20"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {operator.logoUrl ? (
                <div
                  className="w-16 h-16 rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url('${operator.logoUrl}')` }}
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#1e3a4c] flex items-center justify-center text-white text-xl font-bold">
                  {operator.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-[#1e3a4c] group-hover:text-[#f97316] transition-colors">
                    {operator.name}
                  </h3>
                  {isClaimed && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                {operator.tagline && (
                  <p className="text-sm text-gray-500">{operator.tagline}</p>
                )}
              </div>
            </div>
            <Badge variant="accent">Featured</Badge>
          </div>

          {operator.uniqueSellingPoint && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {operator.uniqueSellingPoint}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {operator.googleRating && (
                <span className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-[#f97316] text-[#f97316]" />
                  <span className="font-semibold">{operator.googleRating}</span>
                  {operator.reviewCount && (
                    <span className="text-gray-400">
                      ({operator.reviewCount.toLocaleString()})
                    </span>
                  )}
                </span>
              )}
              {operator.priceRange && (
                <span className="text-sm text-gray-500">
                  {operator.priceRange}
                </span>
              )}
            </div>
          </div>

          {operator.activityTypes && operator.activityTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {operator.activityTypes.slice(0, 4).map((type) => (
                <Badge key={type} variant="outline" size="sm">
                  {type}
                </Badge>
              ))}
              {operator.activityTypes.length > 4 && (
                <Badge variant="outline" size="sm">
                  +{operator.activityTypes.length - 4} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link
      href={`/directory/${operator.slug}`}
      className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Logo */}
      {operator.logoUrl ? (
        <div
          className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0"
          style={{ backgroundImage: `url('${operator.logoUrl}')` }}
        />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-[#1e3a4c] flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
          {operator.name.charAt(0)}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[#1e3a4c] group-hover:text-[#f97316] transition-colors truncate">
            {operator.name}
          </h3>
          {isClaimed && (
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          )}
        </div>

        {operator.address && (
          <p className="text-sm text-gray-400 flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            {operator.address}
          </p>
        )}

        <div className="flex items-center gap-3 mt-1">
          {operator.googleRating && (
            <span className="flex items-center gap-1 text-sm">
              <Star className="h-3 w-3 fill-[#f97316] text-[#f97316]" />
              <span className="font-medium">{operator.googleRating}</span>
            </span>
          )}
          {operator.priceRange && (
            <span className="text-sm text-gray-500">{operator.priceRange}</span>
          )}
          {operator.activityTypes && operator.activityTypes.length > 0 && (
            <span className="text-xs text-gray-400">
              {operator.activityTypes.slice(0, 2).join(", ")}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#f97316] transition-colors flex-shrink-0" />
    </Link>
  );
}
