import Link from "next/link";
import { MapPin, Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { getEffectiveTier, isTrialActive } from "@/lib/trial-utils";

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
    // Trial fields
    billingTier?: string | null;
    trialTier?: string | null;
    trialExpiresAt?: Date | null;
  };
  variant?: "default" | "featured" | "compact";
}

export function OperatorCard({ operator, variant = "default" }: OperatorCardProps) {
  const effectiveTier = getEffectiveTier(operator as any);
  const isTrial = isTrialActive(operator as any);

  // Use effectiveTier for premium check
  const isPremium = effectiveTier === "premium";
  const isClaimed = operator.claimStatus === "claimed" || isPremium;

  if (variant === "featured") {
    return (
      <Link
        href={`/directory/${operator.slug}`}
        className={`group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border-2 border-accent-hover/20 relative ${isPremium ? "border-l-4 border-l-amber-400 bg-amber-50/30" : "bg-white"}`}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {operator.logoUrl && (
                <div
                  className="w-16 h-16 rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url('${operator.logoUrl}')` }}
                />
              )}
              <div>
                <h3 className="font-bold text-lg text-primary group-hover:text-accent-hover transition-colors">
                  {operator.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <VerifiedBadge claimStatus={effectiveTier as any} isTrial={isTrial} size="lg" />
                </div>
                {operator.tagline && (
                  <p className="text-sm text-gray-500 mt-1">{operator.tagline}</p>
                )}
              </div>
            </div>
            {isPremium ? (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full" aria-label="Sponsored listing">
                Sponsored
              </span>
            ) : (
              <Badge variant="accent">Featured</Badge>
            )}
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
                  <Star className="h-4 w-4 fill-accent-hover text-accent-hover" />
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
    <div className={`rounded-xl shadow-sm hover:shadow-md transition-shadow relative ${isPremium ? "border-l-4 border-l-amber-400 bg-amber-50/30" : "bg-white"}`}>
      {isPremium && (
        <span className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full" aria-label="Sponsored listing">
          Sponsored
        </span>
      )}
      <Link
        href={`/directory/${operator.slug}`}
        className="group flex items-center gap-4 p-4"
      >
        {/* Logo */}
        {operator.logoUrl && (
          <div
            className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0"
            style={{ backgroundImage: `url('${operator.logoUrl}')` }}
          />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-primary group-hover:text-accent-hover transition-colors truncate">
              {operator.name}
            </h3>
            <VerifiedBadge claimStatus={effectiveTier as any} isTrial={isTrial} size="sm" showLabel={false} />
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
                <Star className="h-3 w-3 fill-accent-hover text-accent-hover" />
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
        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-accent-hover transition-colors flex-shrink-0" />
      </Link>

      {!isClaimed && (
        <div className="px-4 pb-3 border-t border-gray-100">
          <Link
            href="/advertise"
            className="text-xs text-gray-400 hover:text-accent-hover transition-colors"
          >
            Is this your business? Claim this listing →
          </Link>
        </div>
      )}
    </div>
  );
}
