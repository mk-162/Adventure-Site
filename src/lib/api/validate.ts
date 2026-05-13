import { NextResponse } from "next/server";
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

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

function issuesToDetails(issues: z.ZodIssue[]): string[] {
  return issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`);
}

/**
 * Parse a JSON request body against a Zod schema.
 * Returns either the parsed data or a 400 NextResponse with
 * `{ error: string, details: string[] }`.
 */
export async function validateJsonBody<T>(
  request: Request,
  schema: z.ZodType<T>
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  const raw = await request.json().catch(() => null);
  const result = schema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data };
  return {
    ok: false,
    response: NextResponse.json(
      { error: "Validation failed", details: issuesToDetails(result.error.issues) },
      { status: 400 }
    ),
  };
}

/**
 * Parse URLSearchParams against a Zod schema.
 */
export function validateSearchParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodType<T>
): { ok: true; data: T } | { ok: false; response: NextResponse } {
  const obj: Record<string, string> = {};
  searchParams.forEach((v, k) => {
    obj[k] = v;
  });
  const result = schema.safeParse(obj);
  if (result.success) return { ok: true, data: result.data };
  return {
    ok: false,
    response: NextResponse.json(
      { error: "Validation failed", details: issuesToDetails(result.error.issues) },
      { status: 400 }
    ),
  };
}

// ---------------------------------------------------------------------------
// Auth schemas
// ---------------------------------------------------------------------------

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(512),
});

export const operatorMagicLinkSchema = z.object({
  email: z.string().email(),
});

export const operatorClaimSchema = z.object({
  operatorSlug: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  email: z.string().email(),
  role: z.string().max(100).optional(),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  name: z.string().max(255).optional(),
  newsletterOptIn: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Subscribe / Newsletter / Operator interest
// ---------------------------------------------------------------------------

export const subscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().max(50).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});

export const operatorInterestSchema = z.object({
  businessName: z.string().min(1).max(255),
  contactName: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().max(50).nullable().optional(),
  numLocations: z.number().int().nonnegative().max(10000).optional(),
  planInterest: z.string().max(50).optional(),
  message: z.string().max(5000).nullable().optional(),
});

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

export const UPLOAD_ALLOWED_FOLDERS = [
  "regions",
  "activities",
  "accommodation",
  "operators",
  "itineraries",
  "events",
  "ads",
] as const;

export const UPLOAD_ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const UPLOAD_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export const uploadFieldsSchema = z.object({
  contentType: z.enum(UPLOAD_ALLOWED_FOLDERS),
});

export function validateUploadFile(
  file: File | null
): { ok: true } | { ok: false; error: string } {
  if (!file) return { ok: false, error: "No file provided" };
  if (!(UPLOAD_ALLOWED_MIME as readonly string[]).includes(file.type)) {
    return { ok: false, error: "Invalid file type. Allowed: jpg, png, webp" };
  }
  if (file.size > UPLOAD_MAX_BYTES) {
    return { ok: false, error: "File size exceeds 5MB limit" };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// MCP (JSON-RPC 2.0)
// ---------------------------------------------------------------------------

export const mcpRequestSchema = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.union([z.string(), z.number(), z.null()]).optional(),
  method: z.string().min(1).max(100),
  params: z.unknown().optional(),
});

export const mcpToolCallParamsSchema = z.object({
  name: z.string().min(1).max(100),
  arguments: z.unknown().optional(),
});

// ---------------------------------------------------------------------------
// Ads / Tracking
// ---------------------------------------------------------------------------

export const adImpressionSchema = z.object({
  slotName: z.string().min(1).max(100),
  pageType: z.string().min(1).max(100),
  pageSlug: z.string().max(255).nullable().optional(),
});

export const adSlotQuerySchema = z.object({
  name: z.string().min(1).max(100),
  pageType: z.string().min(1).max(100),
  pageSlug: z.string().max(255).optional(),
});

export const trackClickQuerySchema = z.object({
  r: z.string().regex(/^\d+$/).optional(),
  url: z.string().min(1).max(2048),
});

export const trackOpenQuerySchema = z.object({
  r: z.string().regex(/^\d+$/).optional(),
});

export const trackViewSchema = z.object({
  pageType: z.string().min(1).max(100),
  pageSlug: z.string().min(1).max(255),
  operatorId: z.number().int().positive().nullable().optional(),
});

// ---------------------------------------------------------------------------
// Favourites
// ---------------------------------------------------------------------------

export const FAVOURITE_TYPES = ["event", "itinerary", "activity", "operator"] as const;

export const favouriteSchema = z.object({
  type: z.enum(FAVOURITE_TYPES),
  id: z.number().int().positive(),
});

// ---------------------------------------------------------------------------
// Billing
// ---------------------------------------------------------------------------

export const billingCheckoutSchema = z.object({
  priceId: z.string().min(1).max(255),
});

export const adminBillingSchema = z.object({
  action: z.enum([
    "create-customer",
    "create-subscription",
    "cancel-subscription",
    "sync",
  ]),
  operatorId: z.number().int().positive(),
  priceId: z.string().min(1).max(255).optional(),
});

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export const eventSubmitSchema = z.object({
  name: z.string().min(1).max(255),
  dateStart: z.string().min(1).max(64),
  dateEnd: z.string().max(64).nullable().optional(),
  description: z.string().max(20000).optional(),
  type: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  location: z.string().max(500).optional(),
  lat: z.union([z.number(), z.string()]).nullable().optional(),
  lng: z.union([z.number(), z.string()]).nullable().optional(),
  website: z.string().max(500).nullable().optional(),
  ticketUrl: z.string().max(500).nullable().optional(),
  registrationCost: z.union([z.string(), z.number()]).nullable().optional(),
  capacity: z.union([z.string(), z.number()]).nullable().optional(),
  difficulty: z.string().max(100).optional(),
  ageRange: z.string().max(100).optional(),
  heroImage: z.string().max(2000).nullable().optional(),
  promote: z.boolean().optional(),
});

export const eventIngestSchema = z.object({
  source: z.enum(["eventbrite"]),
});

export const eventSaveIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

// ---------------------------------------------------------------------------
// Admin bulk operations
// ---------------------------------------------------------------------------

export const ADMIN_BULK_CONTENT_TYPES = [
  "activities",
  "accommodation",
  "operators",
  "regions",
  "locations",
  "events",
  "transport",
  "itineraries",
  "answers",
] as const;

export const adminBulkSchema = z.object({
  contentType: z.enum(ADMIN_BULK_CONTENT_TYPES),
  operation: z.enum([
    "status_change",
    "field_update",
    "assign_operator",
    "assign_region",
    "delete",
  ]),
  ids: z.array(z.union([z.number().int(), z.string()])).min(1).max(1000),
  data: z.record(z.string(), z.unknown()).nullable().optional(),
});

// ---------------------------------------------------------------------------
// Weather
// ---------------------------------------------------------------------------

export const weatherQuerySchema = z.object({
  lat: z.string().regex(/^-?\d+(\.\d+)?$/),
  lng: z.string().regex(/^-?\d+(\.\d+)?$/),
});
