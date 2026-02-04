// Shared utility for resolving activity hero images
// Used by activity detail pages and itinerary timeline thumbnails

const localActivityImages = new Set([
  "archery", "boat-tour", "caving", "climbing", "coasteering",
  "gorge-scrambling", "gorge-walking", "high-ropes", "hiking",
  "hiking-scrambling", "kayaking", "mine-exploration", "mountain-biking",
  "paddleboarding", "rafting", "sea-kayaking", "sup", "surfing",
  "trail-running", "wildlife-boat-tour", "wild-swimming", "windsurfing", "zip-lining",
]);

export function getActivityHeroImage(
  activitySlug: string,
  activityTypeSlug?: string | null
): string {
  // Try activity type first
  if (activityTypeSlug && localActivityImages.has(activityTypeSlug)) {
    return `/images/activities/${activityTypeSlug}-hero.jpg`;
  }
  // Try to match from slug
  const slugParts = activitySlug.toLowerCase().split("-");
  for (const part of slugParts) {
    if (localActivityImages.has(part)) {
      return `/images/activities/${part}-hero.jpg`;
    }
  }
  // Check compound matches
  const compoundMatches = [
    "gorge-walking", "gorge-scrambling", "sea-kayaking", "mountain-biking",
    "trail-running", "wild-swimming", "zip-lining", "boat-tour",
    "wildlife-boat-tour", "mine-exploration", "high-ropes", "hiking-scrambling",
  ];
  for (const match of compoundMatches) {
    if (activitySlug.includes(match)) {
      return `/images/activities/${match}-hero.jpg`;
    }
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
