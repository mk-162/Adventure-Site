import Link from "next/link";
import { MapPin, Clock, Star } from "lucide-react";
import { Badge, DifficultyBadge, PriceBadge } from "@/components/ui/badge";

interface ActivityCardProps {
  activity: {
    id: number;
    name: string;
    slug: string;
    priceFrom: string | null;
    priceTo: string | null;
    duration: string | null;
    difficulty: string | null;
  };
  region?: {
    name: string;
    slug: string;
  } | null;
  operator?: {
    name: string;
    slug: string;
    googleRating: string | null;
  } | null;
  activityType?: {
    slug: string;
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

// Get activity image - prioritize local images based on activity type or name
function getActivityImage(activitySlug: string, activityTypeSlug?: string | null): string {
  // Try activity type first
  if (activityTypeSlug && localActivityImages.has(activityTypeSlug)) {
    return `/images/activities/${activityTypeSlug}-hero.jpg`;
  }
  
  // Try to match activity slug to known images
  const slugParts = activitySlug.toLowerCase().split("-");
  for (const part of slugParts) {
    if (localActivityImages.has(part)) {
      return `/images/activities/${part}-hero.jpg`;
    }
  }
  
  // Check for compound matches
  const compoundMatches = [
    "gorge-scrambling", "gorge-walking", "sea-kayaking", "mine-exploration", 
    "mountain-biking", "trail-running", "wild-swimming", "boat-tour", 
    "wildlife-boat-tour", "high-ropes", "zip-lining", "hiking-scrambling"
  ];
  for (const match of compoundMatches) {
    if (activitySlug.includes(match)) {
      return `/images/activities/${match}-hero.jpg`;
    }
  }
  
  // Default fallback
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
  const imageUrl = image || getActivityImage(activity.slug, activityType?.slug);

  if (variant === "horizontal") {
    return (
      <Link
        href={`/activities/${activity.slug}`}
        className="group flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        {/* Image */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${imageUrl}')` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-[#1e3a4c] group-hover:text-[#f97316] transition-colors line-clamp-1">
              {activity.name}
            </h3>
            {operator && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                {operator.name}
                {operator.googleRating && (
                  <span className="flex items-center text-[#f97316]">
                    <Star className="h-3 w-3 fill-current" />
                    {operator.googleRating}
                  </span>
                )}
              </p>
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
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        {activity.difficulty && (
          <div className="absolute top-3 right-3">
            <DifficultyBadge level={activity.difficulty} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-[#1e3a4c] mb-1 group-hover:text-[#f97316] transition-colors line-clamp-1">
          {activity.name}
        </h3>

        {operator && !hideOperator && (
          <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
            {operator.name}
            {operator.googleRating && (
              <span className="flex items-center text-[#f97316]">
                <Star className="h-3 w-3 fill-current" />
                {operator.googleRating}
              </span>
            )}
          </p>
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
