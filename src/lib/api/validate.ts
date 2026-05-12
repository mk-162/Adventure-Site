import { z } from "zod";

// Per-content-type allow-lists for POST/PATCH bodies.
// Only keys listed here can be written; unknown keys are stripped by Zod.
const ALLOWED_FIELDS: Record<string, readonly string[]> = {
  regions: [
    "name","slug","description","heroImage","heroCredit","lat","lng","status",
  ],
  activities: [
    "regionId","operatorId","activityTypeId","name","slug","description",
    "meetingPoint","lat","lng","priceFrom","priceTo","duration","difficulty",
    "minAge","season","bookingUrl","bookingPlatform","bookingPartnerRef",
    "bookingAffiliateUrl","sourceUrl","status","heroImage",
  ],
  itineraries: [
    "regionId","title","slug","tagline","description","durationDays",
    "difficulty","bestSeason","heroImage","priceEstimateFrom","priceEstimateTo","status",
  ],
  operators: [
    "accountId","name","slug","type","category","website","email","phone",
    "address","lat","lng","description","tagline","logoUrl","coverImage",
    "googleRating","reviewCount","tripadvisorUrl","priceRange","uniqueSellingPoint",
    "claimStatus","dataSource","googlePlaceId","trustSignals","serviceTypes",
    "regions","activityTypes","bookingPlatform","bookingPartnerRef","bookingAffiliateId",
    "bookingWidgetUrl","serviceDetails","billingTier","billingEmail",
    "billingCustomAmount","billingNotes","groupFriendly","groupMinSize","groupMaxSize",
    "groupPriceFrom","stagHenPackages","youtubeVideoId","adminNotes","trialTier",
  ],
  accommodation: [
    "regionId","name","slug","type","address","lat","lng","website",
    "priceFrom","priceTo","adventureFeatures","bookingUrl","airbnbUrl",
    "googleRating","description","status","heroImage",
  ],
  events: [
    "regionId","name","slug","type","description","dateStart","dateEnd",
    "monthTypical","location","lat","lng","website","registrationCost","capacity",
    "heroImage","imageGallery","category","tags","isRecurring","recurringSchedule",
    "isFeatured","isPromoted","promotedUntil","operatorId","externalSource",
    "externalId","externalUrl","ticketUrl","difficulty","ageRange","status",
  ],
  locations: [
    "regionId","name","slug","description","lat","lng","parkingInfo",
    "facilities","accessNotes","bestTime","crowdLevel","status",
  ],
  answers: [
    "regionId","question","slug","quickAnswer","fullContent",
    "relatedQuestions","status",
  ],
};

// Allowed filter keys for GET list queries (excludes special pagination params)
export const ALLOWED_FILTER_FIELDS = ALLOWED_FIELDS;

/**
 * Validate a POST/PATCH body for a given content type.
 * Returns { success: true, data } or { success: false, issues }.
 */
export function validateCmsBody(
  contentType: string,
  body: unknown
): { success: true; data: Record<string, unknown> } | { success: false; issues: string[] } {
  const allowed = ALLOWED_FIELDS[contentType];
  if (!allowed) {
    return { success: false, issues: [`Unknown content type: ${contentType}`] };
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { success: false, issues: ["Body must be a JSON object"] };
  }

  // Build a passthrough schema that accepts only the allowed keys
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const key of allowed) {
    shape[key] = z.unknown().optional();
  }
  const schema = z.object(shape).strict();

  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      success: false,
      issues: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }

  // Strip undefined values
  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(result.data)) {
    if (v !== undefined) data[k] = v;
  }
  return { success: true, data };
}

/**
 * Validate that a GET filter key is in the allow-list for the content type.
 */
export function isAllowedFilterKey(contentType: string, key: string): boolean {
  return (ALLOWED_FIELDS[contentType] ?? []).includes(key);
}
