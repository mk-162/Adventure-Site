import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { getEffectiveTier, isTrialActive } from "@/lib/trial-utils";
import { cn } from "@/lib/utils";

/** Render an operator logo safely: next/image for local paths, raw <img> for
 *  external hosts (logos come from arbitrary DB/editor URLs not in remotePatterns).
 *  Falls back to an initial-letter avatar so the row never has awkward empty space. */
function OperatorLogo({
  src,
  name,
  className,
}: {
  src: string | null;
  name: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-primary/10 font-bold text-primary",
          className
        )}
        aria-hidden="true"
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }
  if (src.startsWith("/")) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl", className)}>
        <Image src={src} alt={name} fill className="object-cover" sizes="64px" />
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} className="h-full w-full object-cover" />
    </div>
  );
}

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

  if (variant === "featured") {
    return (
      <Link href={`/directory/${operator.slug}`} className="block">
        <Card className={`group hover:shadow-xl transition-shadow border-2 border-accent-strong/20 relative ${isPremium ? "border-l-4 border-l-amber-400 bg-amber-50/30" : ""}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <OperatorLogo src={operator.logoUrl} name={operator.name} className="w-16 h-16 shrink-0 text-xl" />
              <div>
                <h3 className="font-bold text-lg text-primary group-hover:text-accent-strong transition-colors">
                  {operator.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <VerifiedBadge claimStatus={effectiveTier as any} isTrial={isTrial} size="lg" />
                </div>
                {operator.tagline && (
                  <p className="text-sm text-slate-500 mt-1">{operator.tagline}</p>
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
            <p className="text-slate-600 text-sm mb-4 line-clamp-2">
              {operator.uniqueSellingPoint}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {operator.googleRating && (
                <span className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold text-primary">{operator.googleRating}</span>
                  {operator.reviewCount && (
                    <span className="text-slate-400">
                      ({operator.reviewCount.toLocaleString()})
                    </span>
                  )}
                </span>
              )}
              {operator.priceRange && (
                <span className="text-sm text-slate-500">
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
        </CardContent>
        </Card>
      </Link>
    );
  }

  // Default card — consistent row anatomy: avatar, name + verified badge,
  // location, rating (real only), price, category chips.
  return (
    <Card className={`hover:shadow-md transition-shadow relative p-0 ${isPremium ? "border-l-4 border-l-amber-400 bg-amber-50/30" : ""}`}>
      {isPremium && (
        <span className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full" aria-label="Sponsored listing">
          Sponsored
        </span>
      )}
      <Link
        href={`/directory/${operator.slug}`}
        className="group flex items-center gap-4 p-4"
      >
        <OperatorLogo src={operator.logoUrl} name={operator.name} className="w-14 h-14 shrink-0 text-lg" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-primary group-hover:text-accent-strong transition-colors truncate">
              {operator.name}
            </h3>
            <VerifiedBadge claimStatus={effectiveTier as any} isTrial={isTrial} size="sm" showLabel={false} />
          </div>

          {operator.address && (
            <p className="text-sm text-slate-500 flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              {operator.address}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            {operator.googleRating && (
              <span className="flex items-center gap-1 text-sm">
                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                <span className="font-semibold text-primary">{operator.googleRating}</span>
                {operator.reviewCount != null && (
                  <span className="text-slate-400">({operator.reviewCount})</span>
                )}
              </span>
            )}
            {operator.priceRange && (
              <span className="text-sm text-slate-500">{operator.priceRange}</span>
            )}
            {operator.activityTypes && operator.activityTypes.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {operator.activityTypes.slice(0, 2).map((type) => (
                  <Badge key={type} variant="outline" size="sm">
                    {type}
                  </Badge>
                ))}
                {operator.activityTypes.length > 2 && (
                  <Badge variant="outline" size="sm">
                    +{operator.activityTypes.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-accent-strong transition-colors flex-shrink-0" />
      </Link>
    </Card>
  );
}
