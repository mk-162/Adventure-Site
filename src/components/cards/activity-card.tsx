import Link from "next/link";
import { MapPin, Clock, Star } from "lucide-react";
import { Badge, DifficultyBadge, PriceBadge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

interface ActivityCardProps {
  activity: {
    id: number;
    name: string;
    slug: string;
    priceFrom: string | null;
    priceTo: string | null;
    duration: string | null;
    difficulty: string | null;
    bookingPlatform?: string | null;
    bookingAffiliateUrl?: string | null;
    bookingUrl?: string | null;
    heroImage?: string | null;
  };
  region?: {
    name: string;
    slug: string;
    heroImage?: string | null;
  } | null;
  operator?: {
    name: string;
    slug: string;
    googleRating: string | null;
    claimStatus?: "stub" | "claimed" | "premium";
  } | null;
  activityType?: {
    slug: string;
    heroImage?: string | null;
  } | null;
  image?: string;
  variant?: "default" | "compact" | "horizontal";
  hideOperator?: boolean;
}

// Available local activity hero images
const localActivityImages = new Set([
  "archery",
  "boat-tour",
  "caving",
  "climbing",
  "coasteering",
  "gorge-scrambling",
  "gorge-walking",
  "high-ropes",
  "hiking",
  "hiking-scrambling",
  "kayaking",
  "mine-exploration",
  "mountain-biking",
  "paddleboarding",
  "rafting",
  "sea-kayaking",
  "sup",
  "surfing",
  "trail-running",
  "wildlife-boat-tour",
  "wild-swimming",
  "windsurfing",
  "zip-lining",
]);

// Gallery image variants per activity type — used to deduplicate cards
const activityImageVariants: Record<string, string[]> = {
  "caving": ["02-458228b9", "03-fb4d036f", "04-8d6bb2da", "05-95ef7683", "06-70411151"],
  "climbing": ["02-c2c33740", "03-769d8444", "04-a6c69ad4", "05-62ff29a8", "06-a0eb9a7d"],
  "coasteering": ["02-519a34c0", "03-b5583981", "04-16568470", "05-d7153020", "06-d7bec2a8"],
  "gorge-walking": ["02-0027dfcc", "03-6eada4af", "04-d40b6bff", "05-507fc51c", "06-956385b9"],
  "hiking": ["03-96151002", "04-2bf15ed9", "05-c7cb2f1e", "06-74fc1189"],
  "kayaking": ["02-570fb957", "03-bcd19dc4", "04-ba6d1e33", "05-758c3658", "06-656475f5"],
  "mountain-biking": ["02-1fe6646f", "03-ce257a7c", "04-63e4b2e0", "05-ebb64387", "06-f0231015"],
  "paddleboarding": ["02-30a88c24", "03-02927bb8", "04-c0cf2a01", "05-46f4408f", "06-f35e1c4d"],
  "rafting": ["02-0d9b00f9", "03-3b5d5ae0", "04-bd3fe82b", "05-ed393aad", "06-e544a7c2"],
  "surfing": ["02-1ef1420b", "03-fc8506a1", "04-9bfdc377", "05-1b64a41d", "06-74705f6a"],
  "wild-swimming": ["02-bc83a30d", "03-9c4fdbe0", "04-aaaffc2e", "05-9ded1f48", "06-d4165348"],
  "zip-lining": ["02-dad94e84", "03-b56e3ec0", "04-534600ba", "05-d5ecfeb3", "06-15cc8072"],
  "sea-kayaking": ["02-570fb957", "03-bcd19dc4", "04-ba6d1e33", "05-758c3658", "06-656475f5"],
};

// Slug aliases for activities whose slug doesn't match any known type directly
const slugAliases: Record<string, string> = {
  "mtb": "mountain-biking",
  "downhill": "mountain-biking",
  "biking": "mountain-biking",
  "cycling": "mountain-biking",
  "paddle": "paddleboarding",
  "canoe": "kayaking",
  "canoeing": "kayaking",
  "abseil": "climbing",
  "abseiling": "climbing",
  "bouldering": "climbing",
  "cave": "caving",
  "gorge": "gorge-walking",
  "scrambling": "gorge-scrambling",
  "raft": "rafting",
  "swim": "wild-swimming",
  "swimming": "wild-swimming",
  "surf": "surfing",
  "bodyboard": "surfing",
  "bodyboarding": "surfing",
  "zipline": "zip-lining",
  "zip": "zip-lining",
  "ropes": "high-ropes",
  "trek": "hiking",
  "trekking": "hiking",
  "walk": "hiking",
  "walking": "hiking",
  "archery": "archery",
  "mine": "mine-exploration",
  "boat": "boat-tour",
  "wildlife": "wildlife-boat-tour",
  "windsurf": "windsurfing",
  "run": "trail-running",
  "running": "trail-running",
};

/**
 * Resolve the activity type slug from activityType or by matching against the activity slug.
 */
function resolveTypeSlug(activitySlug: string, activityTypeSlug?: string | null): string | null {
  // Direct match from DB activity type
  if (activityTypeSlug && localActivityImages.has(activityTypeSlug)) {
    return activityTypeSlug;
  }

  // Check compound matches first (longer strings match more specifically)
  const compoundMatches = [
    "gorge-scrambling", "gorge-walking", "sea-kayaking", "mine-exploration",
    "mountain-biking", "trail-running", "wild-swimming", "boat-tour",
    "wildlife-boat-tour", "high-ropes", "zip-lining", "hiking-scrambling",
  ];
  for (const match of compoundMatches) {
    if (activitySlug.includes(match)) {
      return match;
    }
  }

  // Try slug part aliases (handles "mtb", "downhill", etc.)
  const slugParts = activitySlug.toLowerCase().split("-");
  for (const part of slugParts) {
    if (localActivityImages.has(part)) {
      return part;
    }
    if (slugAliases[part]) {
      return slugAliases[part];
    }
  }

  return null;
}

/**
 * Get the image URL for an activity card with a full fallback chain:
 *   1. Activity's own heroImage (from DB)
 *   2. Local variant image for the type (rotated by activity ID to deduplicate)
 *   3. Local hero image for the type
 *   4. Activity type's heroImage from DB (Unsplash URL)
 *   5. Region hero image (local or DB)
 *   6. Default placeholder
 */
function getActivityImage(
  activityId: number,
  activitySlug: string,
  activityTypeSlug?: string | null,
  activityHeroImage?: string | null,
  activityTypeHeroImage?: string | null,
  regionSlug?: string | null,
  regionHeroImage?: string | null,
): string {
  // 1. Activity's own hero image from DB
  if (activityHeroImage) {
    return activityHeroImage;
  }

  const typeSlug = resolveTypeSlug(activitySlug, activityTypeSlug);

  if (typeSlug) {
    // 2. Use a variant image (rotated by activity ID) to avoid duplicates on listing pages
    const variants = activityImageVariants[typeSlug];
    if (variants && variants.length > 0) {
      const variantIndex = activityId % variants.length;
      return `/images/activities/${typeSlug}-${variants[variantIndex]}.jpg`;
    }

    // 3. Fall back to the type hero image
    if (localActivityImages.has(typeSlug)) {
      return `/images/activities/${typeSlug}-hero.jpg`;
    }
  }

  // 4. Activity type's hero image from DB (e.g. Unsplash URL)
  if (activityTypeHeroImage) {
    return activityTypeHeroImage;
  }

  // 5. Region hero image
  if (regionSlug) {
    return `/images/regions/${regionSlug}-hero.jpg`;
  }
  if (regionHeroImage) {
    return regionHeroImage;
  }

  // 6. Default placeholder
  return "/images/activities/hiking-hero.jpg";
}

export function ActivityCard({
  activity,
  region,
  operator,
  activityType,
  image,
  variant = "default",
  hideOperator = false,
}: ActivityCardProps) {
  const imageUrl = image || getActivityImage(
    activity.id,
    activity.slug,
    activityType?.slug,
    activity.heroImage,
    activityType?.heroImage,
    region?.slug,
    region?.heroImage,
  );

  if (variant === "horizontal") {
    return (
      <Link
        href={`/activities/${activity.slug}`}
        className="group flex bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      >
        {/* Image */}
        <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url('${imageUrl}')` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-primary group-hover:text-accent-hover transition-colors line-clamp-1">
              {activity.name}
            </h3>
            {operator && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  {operator.name}
                  {operator.googleRating && (
                    <span className="flex items-center text-accent-hover ml-1">
                      <Star className="h-3 w-3 fill-current" />
                      {operator.googleRating}
                    </span>
                  )}
                </span>
                {operator.claimStatus && (
                  <VerifiedBadge 
                    claimStatus={operator.claimStatus} 
                    size="sm" 
                    showLabel={false}
                  />
                )}
              </div>
            )}
            {region && (
              <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {region.name}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              {activity.duration && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.duration}
                </span>
              )}
              {activity.difficulty && (
                <DifficultyBadge level={activity.difficulty} />
              )}
            </div>
            <PriceBadge
              from={activity.priceFrom ? parseFloat(activity.priceFrom) : null}
              to={activity.priceTo ? parseFloat(activity.priceTo) : null}
            />
          </div>
        </div>
      </Link>
    );
  }

  // Default vertical card
  return (
    <Link
      href={`/activities/${activity.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {activity.difficulty && (
          <div className="absolute top-3 right-3">
            <DifficultyBadge level={activity.difficulty} />
          </div>
        )}
        {activity.bookingPlatform && activity.bookingPlatform !== "none" && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Instant Book
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-primary mb-1 group-hover:text-accent-hover transition-colors line-clamp-1">
          {activity.name}
        </h3>

        {operator && !hideOperator && (
          <div className="text-sm mb-1 flex items-center gap-1.5">
            <span className="text-gray-500 flex items-center gap-1">
              {operator.name}
              {operator.googleRating && (
                <span className="flex items-center text-accent-hover ml-0.5">
                  <Star className="h-3 w-3 fill-current" />
                  {operator.googleRating}
                </span>
              )}
            </span>
            {operator.claimStatus && (
              <VerifiedBadge 
                claimStatus={operator.claimStatus} 
                size="sm" 
                showLabel={false}
              />
            )}
          </div>
        )}

        {region && (
          <p className="text-sm text-gray-400 flex items-center gap-1 mb-3">
            <MapPin className="h-3 w-3" />
            {region.name}
          </p>
        )}

        <div className="flex items-center justify-between">
          {activity.duration && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.duration}
            </span>
          )}
          <PriceBadge
            from={activity.priceFrom ? parseFloat(activity.priceFrom) : null}
            to={activity.priceTo ? parseFloat(activity.priceTo) : null}
          />
        </div>
      </div>
    </Link>
  );
}
