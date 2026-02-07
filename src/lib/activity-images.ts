// Shared utility for resolving activity hero images
// Used by activity detail pages and itinerary timeline thumbnails

import { attractionImages } from "@/data/attraction-images";

const localActivityImages = new Set([
  "archery", "boat-tour", "caving", "climbing", "coasteering",
  "gorge-scrambling", "gorge-walking", "high-ropes", "hiking",
  "hiking-scrambling", "kayaking", "mine-exploration", "mountain-biking",
  "paddleboarding", "rafting", "sea-kayaking", "sup", "surfing",
  "trail-running", "wildlife-boat-tour", "wild-swimming", "windsurfing", "zip-lining",
]);

// Slug aliases for activities whose slug doesn't contain the type name directly
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
  "zipline": "zip-lining",
  "zip": "zip-lining",
  "ropes": "high-ropes",
  "trek": "hiking",
  "trekking": "hiking",
  "walk": "hiking",
  "walking": "hiking",
  "mine": "mine-exploration",
  "boat": "boat-tour",
  "wildlife": "wildlife-boat-tour",
  "windsurf": "windsurfing",
  "run": "trail-running",
  "running": "trail-running",
};

/**
 * Resolve an activity type slug from the activityType or by matching against the activity slug.
 */
export function resolveActivityTypeSlug(
  activitySlug: string,
  activityTypeSlug?: string | null,
): string | null {
  if (activityTypeSlug && localActivityImages.has(activityTypeSlug)) {
    return activityTypeSlug;
  }

  // Check compound matches first (more specific)
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

  // Try slug parts with aliases
  const slugParts = activitySlug.toLowerCase().split("-");
  for (const part of slugParts) {
    if (localActivityImages.has(part)) {
      return part;
    }
    if (slugAliases[part] && localActivityImages.has(slugAliases[part])) {
      return slugAliases[part];
    }
  }

  return null;
}

export function getActivityHeroImage(
  activitySlug: string,
  activityTypeSlug?: string | null,
): string {
  // Check for specific attraction match first
  if (attractionImages[activitySlug]) {
    return attractionImages[activitySlug];
  }

  const typeSlug = resolveActivityTypeSlug(activitySlug, activityTypeSlug);
  if (typeSlug) {
    return `/images/activities/${typeSlug}-hero.jpg`;
  }
  return "/images/activities/hiking-hero.jpg";
}

// Map stop types to fallback images when no activity image is available
export function getStopTypeImage(stopType: string): string {
  switch (stopType) {
    case "accommodation":
      return "/images/activities/hiking-hero.jpg"; // fallback
    case "food":
      return "/images/activities/hiking-hero.jpg"; // fallback
    default:
      return "/images/activities/hiking-hero.jpg";
  }
}
