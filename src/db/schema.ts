import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  decimal,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const statusEnum = pgEnum("status", [
  "draft",
  "review",
  "published",
  "archived",
]);

export const operatorTypeEnum = pgEnum("operator_type", ["primary", "secondary"]);

export const claimStatusEnum = pgEnum("claim_status", [
  "stub",
  "claimed",
  "premium",
]);

export const operatorCategoryEnum = pgEnum("operator_category", [
  "activity_provider",
  "accommodation",
  "food_drink",
  "gear_rental",
  "transport",
]);

export const bookingPlatformEnum = pgEnum("booking_platform", [
  "none",
  "beyonk",
  "rezdy",
  "fareharbor",
  "direct",
]);

export const adminRoleEnum = pgEnum("admin_role", [
  "super",
  "admin",
  "editor",
  "viewer",
]);

export const adStatusEnum = pgEnum("ad_status", [
  "draft",
  "active",
  "paused",
  "ended",
]);

export const tagTypeEnum = pgEnum("tag_type", [
  "activity",
  "terrain",
  "difficulty",
  "amenity",
  "feature",
  "region",
]);

// =====================
// CORE CONTENT TABLES
// =====================

// Sites (multi-tenant)
export const sites = pgTable("sites", {
  id: serial("id").primaryKey(),
  domain: varchar("domain", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  tagline: text("tagline"),
  logoUrl: text("logo_url"),
  primaryColor: varchar("primary_color", { length: 7 }),
  accentColor: varchar("accent_color", { length: 7 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Regions within a site
export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  heroImage: text("hero_image"),
  heroCredit: varchar("hero_credit", { length: 255 }),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  status: statusEnum("status").default("draft").notNull(),
  completenessScore: integer("completeness_score").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Activity types taxonomy
export const activityTypes = pgTable("activity_types", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  heroImage: text("hero_image"),
  description: text("description"),
});

// Activities/experiences
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  regionId: integer("region_id").references(() => regions.id),
  operatorId: integer("operator_id").references(() => operators.id),
  activityTypeId: integer("activity_type_id").references(() => activityTypes.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  meetingPoint: text("meeting_point"),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  priceFrom: decimal("price_from", { precision: 10, scale: 2 }),
  priceTo: decimal("price_to", { precision: 10, scale: 2 }),
  duration: varchar("duration", { length: 100 }),
  difficulty: varchar("difficulty", { length: 50 }),
  minAge: integer("min_age"),
  season: varchar("season", { length: 255 }),
  bookingUrl: text("booking_url"),
  bookingPlatform: bookingPlatformEnum("booking_platform").default("none").notNull(),
  bookingPartnerRef: varchar("booking_partner_ref", { length: 255 }),
  bookingAffiliateUrl: text("booking_affiliate_url"),
  sourceUrl: text("source_url"),
  status: statusEnum("status").default("draft").notNull(),
  completenessScore: integer("completeness_score").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Locations/spots
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  regionId: integer("region_id").references(() => regions.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  parkingInfo: text("parking_info"),
  facilities: text("facilities"),
  accessNotes: text("access_notes"),
  bestTime: varchar("best_time", { length: 255 }),
  crowdLevel: varchar("crowd_level", { length: 50 }),
  status: statusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Accommodation
export const accommodation = pgTable("accommodation", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  regionId: integer("region_id").references(() => regions.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }),
  address: text("address"),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  website: text("website"),
  priceFrom: decimal("price_from", { precision: 10, scale: 2 }),
  priceTo: decimal("price_to", { precision: 10, scale: 2 }),
  adventureFeatures: text("adventure_features"),
  bookingUrl: text("booking_url"),
  airbnbUrl: text("airbnb_url"),
  googleRating: decimal("google_rating", { precision: 2, scale: 1 }),
  description: text("description"),
  status: statusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  regionId: integer("region_id").references(() => regions.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }),
  description: text("description"),
  dateStart: timestamp("date_start"),
  dateEnd: timestamp("date_end"),
  monthTypical: varchar("month_typical", { length: 50 }),
  location: text("location"),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  website: text("website"),
  registrationCost: decimal("registration_cost", { precision: 10, scale: 2 }),
  capacity: integer("capacity"),
  status: statusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Transport options
export const transport = pgTable("transport", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  regionId: integer("region_id").references(() => regions.id),
  type: varchar("type", { length: 100 }),
  name: varchar("name", { length: 255 }).notNull(),
  route: text("route"),
  stops: text("stops"),
  frequency: varchar("frequency", { length: 255 }),
  season: varchar("season", { length: 255 }),
  cost: varchar("cost", { length: 100 }),
  website: text("website"),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tags
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  type: tagTypeEnum("type").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tag junction tables
export const activityTags = pgTable("activity_tags", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id")
    .references(() => activities.id)
    .notNull(),
  tagId: integer("tag_id")
    .references(() => tags.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accommodationTags = pgTable("accommodation_tags", {
  id: serial("id").primaryKey(),
  accommodationId: integer("accommodation_id")
    .references(() => accommodation.id)
    .notNull(),
  tagId: integer("tag_id")
    .references(() => tags.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const locationTags = pgTable("location_tags", {
  id: serial("id").primaryKey(),
  locationId: integer("location_id")
    .references(() => locations.id)
    .notNull(),
  tagId: integer("tag_id")
    .references(() => tags.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const itineraryTags = pgTable("itinerary_tags", {
  id: serial("id").primaryKey(),
  itineraryId: integer("itinerary_id")
    .references(() => itineraries.id)
    .notNull(),
  tagId: integer("tag_id")
    .references(() => tags.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Itineraries
export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  regionId: integer("region_id").references(() => regions.id),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  tagline: text("tagline"),
  description: text("description"),
  durationDays: integer("duration_days"),
  difficulty: varchar("difficulty", { length: 50 }),
  bestSeason: varchar("best_season", { length: 255 }),
  heroImage: text("hero_image"),
  priceEstimateFrom: decimal("price_estimate_from", { precision: 10, scale: 2 }),
  priceEstimateTo: decimal("price_estimate_to", { precision: 10, scale: 2 }),
  status: statusEnum("status").default("draft").notNull(),
  completenessScore: integer("completeness_score").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Itinerary day items (legacy — kept for migration compatibility)
export const itineraryItems = pgTable("itinerary_items", {
  id: serial("id").primaryKey(),
  itineraryId: integer("itinerary_id")
    .references(() => itineraries.id)
    .notNull(),
  dayNumber: integer("day_number").notNull(),
  orderIndex: integer("order_index").notNull(),
  activityId: integer("activity_id").references(() => activities.id),
  accommodationId: integer("accommodation_id").references(() => accommodation.id),
  locationId: integer("location_id").references(() => locations.id),
  timeOfDay: varchar("time_of_day", { length: 50 }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  duration: varchar("duration", { length: 100 }),
  travelTimeToNext: varchar("travel_time_to_next", { length: 100 }),
});

// Stop type enum
export const stopTypeEnum = pgEnum("stop_type", [
  "activity",
  "food",
  "accommodation",
  "transport",
  "freeform",
]);

// Travel mode enum
export const travelModeEnum = pgEnum("travel_mode", [
  "drive",
  "walk",
  "cycle",
  "bus",
  "train",
  "ferry",
  "none",
]);

// Food type enum
export const foodTypeEnum = pgEnum("food_type", [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "pub",
  "cafe",
]);

// Itinerary stops — the engine
export const itineraryStops = pgTable("itinerary_stops", {
  id: serial("id").primaryKey(),
  itineraryId: integer("itinerary_id")
    .references(() => itineraries.id)
    .notNull(),
  dayNumber: integer("day_number").notNull(),
  orderIndex: integer("order_index").notNull(),
  stopType: stopTypeEnum("stop_type").notNull(),

  // Timing
  startTime: varchar("start_time", { length: 10 }),
  duration: varchar("duration", { length: 50 }),
  travelToNext: varchar("travel_to_next", { length: 100 }),
  travelMode: travelModeEnum("travel_mode"),

  // Primary content
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  activityId: integer("activity_id").references(() => activities.id),
  accommodationId: integer("accommodation_id").references(() => accommodation.id),
  locationId: integer("location_id").references(() => locations.id),
  operatorId: integer("operator_id").references(() => operators.id),
  costFrom: decimal("cost_from", { precision: 10, scale: 2 }),
  costTo: decimal("cost_to", { precision: 10, scale: 2 }),

  // Wet weather alternative
  wetAltTitle: varchar("wet_alt_title", { length: 255 }),
  wetAltDescription: text("wet_alt_description"),
  wetAltActivityId: integer("wet_alt_activity_id").references(() => activities.id),
  wetAltCostFrom: decimal("wet_alt_cost_from", { precision: 10, scale: 2 }),
  wetAltCostTo: decimal("wet_alt_cost_to", { precision: 10, scale: 2 }),

  // Budget alternative
  budgetAltTitle: varchar("budget_alt_title", { length: 255 }),
  budgetAltDescription: text("budget_alt_description"),
  budgetAltActivityId: integer("budget_alt_activity_id").references(() => activities.id),
  budgetAltCostFrom: decimal("budget_alt_cost_from", { precision: 10, scale: 2 }),
  budgetAltCostTo: decimal("budget_alt_cost_to", { precision: 10, scale: 2 }),

  // Food stop details
  foodName: varchar("food_name", { length: 255 }),
  foodBudget: varchar("food_budget", { length: 50 }),
  foodLink: text("food_link"),
  foodNotes: text("food_notes"),
  foodType: foodTypeEnum("food_type"),

  // Map
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  routeToNextJson: jsonb("route_to_next_json"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// FAQ/Answer engine pages
export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  regionId: integer("region_id").references(() => regions.id),
  question: text("question").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  quickAnswer: text("quick_answer"),
  fullContent: text("full_content"),
  relatedQuestions: jsonb("related_questions"),
  status: statusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// =====================
// COMMERCIAL TABLES
// =====================

// Operators/Partners
export const operators = pgTable("operators", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  type: operatorTypeEnum("type").default("secondary").notNull(),
  category: operatorCategoryEnum("category"),
  website: text("website"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  description: text("description"),
  tagline: text("tagline"),
  logoUrl: text("logo_url"),
  coverImage: text("cover_image"),
  googleRating: decimal("google_rating", { precision: 2, scale: 1 }),
  reviewCount: integer("review_count"),
  tripadvisorUrl: text("tripadvisor_url"),
  priceRange: varchar("price_range", { length: 10 }),
  uniqueSellingPoint: text("unique_selling_point"),
  claimStatus: claimStatusEnum("claim_status").default("stub").notNull(),
  claimedByEmail: varchar("claimed_by_email", { length: 255 }),
  claimedAt: timestamp("claimed_at"),
  trustSignals: jsonb("trust_signals"),
  serviceTypes: text("service_types").array(),
  regions: text("regions").array(),
  activityTypes: text("activity_types").array(),
  bookingPlatform: bookingPlatformEnum("booking_platform").default("none").notNull(),
  bookingPartnerRef: varchar("booking_partner_ref", { length: 255 }),
  bookingAffiliateId: varchar("booking_affiliate_id", { length: 255 }),
  bookingWidgetUrl: text("booking_widget_url"),
  serviceDetails: jsonb("service_details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Partner offers/promotions
export const operatorOffers = pgTable("operator_offers", {
  id: serial("id").primaryKey(),
  operatorId: integer("operator_id")
    .references(() => operators.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  discount: varchar("discount", { length: 100 }),
  validFrom: timestamp("valid_from"),
  validUntil: timestamp("valid_until"),
  status: statusEnum("status").default("draft").notNull(),
});

// Advertisers
export const advertisers = pgTable("advertisers", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }),
  website: text("website"),
  status: statusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Ad campaigns
export const adCampaigns = pgTable("ad_campaigns", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  advertiserId: integer("advertiser_id")
    .references(() => advertisers.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  status: adStatusEnum("status").default("draft").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ad creatives
export const adCreatives = pgTable("ad_creatives", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id")
    .references(() => adCampaigns.id)
    .notNull(),
  slotType: varchar("slot_type", { length: 100 }),
  imageUrl: text("image_url"),
  linkUrl: text("link_url"),
  altText: text("alt_text"),
  targetingRegions: text("targeting_regions").array(),
  targetingActivities: text("targeting_activities").array(),
  priority: integer("priority").default(0),
  status: statusEnum("status").default("draft").notNull(),
});

// Ad slots configuration
export const adSlots = pgTable("ad_slots", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  pageType: varchar("page_type", { length: 100 }).notNull(),
  slotName: varchar("slot_name", { length: 100 }).notNull(),
  enabled: boolean("enabled").default(true),
  minPriority: varchar("min_priority", { length: 50 }),
  fallbackCreativeId: integer("fallback_creative_id"),
  excludeAdvertisers: text("exclude_advertisers").array(),
});

// Page-specific ad assignments
export const pageAds = pgTable("page_ads", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  pageType: varchar("page_type", { length: 100 }).notNull(),
  pageSlug: varchar("page_slug", { length: 255 }),
  heroBanner: jsonb("hero_banner"),
  mpuSlots: jsonb("mpu_slots"),
  linkList: jsonb("link_list"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Page sponsors
export const pageSponsors = pgTable("page_sponsors", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  pageType: varchar("page_type", { length: 100 }).notNull(),
  pageSlug: varchar("page_slug", { length: 255 }),
  operatorId: integer("operator_id").references(() => operators.id),
  displayName: varchar("display_name", { length: 255 }),
  tagline: text("tagline"),
  ctaText: varchar("cta_text", { length: 100 }),
  ctaUrl: text("cta_url"),
  excludeOtherAds: boolean("exclude_other_ads").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Service slots config
export const serviceSlots = pgTable("service_slots", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  scopeType: varchar("scope_type", { length: 50 }).notNull(),
  scopeSlug: varchar("scope_slug", { length: 255 }),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  label: varchar("label", { length: 255 }),
  description: text("description"),
  href: text("href"),
  operatorId: integer("operator_id").references(() => operators.id),
  visible: boolean("visible").default(true),
  featured: boolean("featured").default(false),
  icon: varchar("icon", { length: 50 }),
  notes: text("notes"),
  expiresAt: timestamp("expires_at"),
});

// =====================
// ADMIN/CMS TABLES
// =====================

// Admin users
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  role: adminRoleEnum("role").default("viewer").notNull(),
  sitePermissions: text("site_permissions").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

// Content validation rules
export const contentRules = pgTable("content_rules", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").references(() => sites.id),
  contentType: varchar("content_type", { length: 100 }).notNull(),
  fieldName: varchar("field_name", { length: 100 }).notNull(),
  ruleType: varchar("rule_type", { length: 50 }).notNull(),
  ruleValue: text("rule_value"),
  errorMessage: text("error_message"),
});

// Bulk operations log
export const bulkOperations = pgTable("bulk_operations", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").references(() => sites.id),
  adminUserId: integer("admin_user_id").references(() => adminUsers.id),
  operationType: varchar("operation_type", { length: 100 }).notNull(),
  contentType: varchar("content_type", { length: 100 }).notNull(),
  affectedIds: text("affected_ids").array(),
  changes: jsonb("changes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Content status history
export const statusHistory = pgTable("status_history", {
  id: serial("id").primaryKey(),
  contentType: varchar("content_type", { length: 100 }).notNull(),
  contentId: integer("content_id").notNull(),
  oldStatus: varchar("old_status", { length: 50 }),
  newStatus: varchar("new_status", { length: 50 }).notNull(),
  changedBy: integer("changed_by").references(() => adminUsers.id),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// =====================
// RELATIONS
// =====================

export const sitesRelations = relations(sites, ({ many }) => ({
  regions: many(regions),
  activityTypes: many(activityTypes),
  activities: many(activities),
  locations: many(locations),
  accommodation: many(accommodation),
  events: many(events),
  transport: many(transport),
  itineraries: many(itineraries),
  answers: many(answers),
  operators: many(operators),
  advertisers: many(advertisers),
  tags: many(tags),
}));

export const regionsRelations = relations(regions, ({ one, many }) => ({
  site: one(sites, { fields: [regions.siteId], references: [sites.id] }),
  activities: many(activities),
  locations: many(locations),
  accommodation: many(accommodation),
  events: many(events),
  transport: many(transport),
  itineraries: many(itineraries),
  answers: many(answers),
}));

export const operatorsRelations = relations(operators, ({ one, many }) => ({
  site: one(sites, { fields: [operators.siteId], references: [sites.id] }),
  activities: many(activities),
  offers: many(operatorOffers),
}));

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  site: one(sites, { fields: [activities.siteId], references: [sites.id] }),
  region: one(regions, { fields: [activities.regionId], references: [regions.id] }),
  operator: one(operators, { fields: [activities.operatorId], references: [operators.id] }),
  activityType: one(activityTypes, { fields: [activities.activityTypeId], references: [activityTypes.id] }),
  activityTags: many(activityTags),
}));

export const accommodationRelations = relations(accommodation, ({ one, many }) => ({
  site: one(sites, { fields: [accommodation.siteId], references: [sites.id] }),
  region: one(regions, { fields: [accommodation.regionId], references: [regions.id] }),
  accommodationTags: many(accommodationTags),
}));

export const locationsRelations = relations(locations, ({ one, many }) => ({
  site: one(sites, { fields: [locations.siteId], references: [sites.id] }),
  region: one(regions, { fields: [locations.regionId], references: [regions.id] }),
  locationTags: many(locationTags),
}));

export const itinerariesRelations = relations(itineraries, ({ one, many }) => ({
  site: one(sites, { fields: [itineraries.siteId], references: [sites.id] }),
  region: one(regions, { fields: [itineraries.regionId], references: [regions.id] }),
  items: many(itineraryItems),
  stops: many(itineraryStops),
  itineraryTags: many(itineraryTags),
}));

export const itineraryItemsRelations = relations(itineraryItems, ({ one }) => ({
  itinerary: one(itineraries, { fields: [itineraryItems.itineraryId], references: [itineraries.id] }),
  activity: one(activities, { fields: [itineraryItems.activityId], references: [activities.id] }),
  accommodation: one(accommodation, { fields: [itineraryItems.accommodationId], references: [accommodation.id] }),
  location: one(locations, { fields: [itineraryItems.locationId], references: [locations.id] }),
}));

export const itineraryStopsRelations = relations(itineraryStops, ({ one }) => ({
  itinerary: one(itineraries, { fields: [itineraryStops.itineraryId], references: [itineraries.id] }),
  activity: one(activities, { fields: [itineraryStops.activityId], references: [activities.id] }),
  accommodation: one(accommodation, { fields: [itineraryStops.accommodationId], references: [accommodation.id] }),
  location: one(locations, { fields: [itineraryStops.locationId], references: [locations.id] }),
  operator: one(operators, { fields: [itineraryStops.operatorId], references: [operators.id] }),
  wetAltActivity: one(activities, { fields: [itineraryStops.wetAltActivityId], references: [activities.id] }),
  budgetAltActivity: one(activities, { fields: [itineraryStops.budgetAltActivityId], references: [activities.id] }),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  site: one(sites, { fields: [tags.siteId], references: [sites.id] }),
  activityTags: many(activityTags),
  accommodationTags: many(accommodationTags),
  locationTags: many(locationTags),
  itineraryTags: many(itineraryTags),
}));

export const activityTagsRelations = relations(activityTags, ({ one }) => ({
  activity: one(activities, { fields: [activityTags.activityId], references: [activities.id] }),
  tag: one(tags, { fields: [activityTags.tagId], references: [tags.id] }),
}));

export const accommodationTagsRelations = relations(accommodationTags, ({ one }) => ({
  accommodation: one(accommodation, { fields: [accommodationTags.accommodationId], references: [accommodation.id] }),
  tag: one(tags, { fields: [accommodationTags.tagId], references: [tags.id] }),
}));

export const locationTagsRelations = relations(locationTags, ({ one }) => ({
  location: one(locations, { fields: [locationTags.locationId], references: [locations.id] }),
  tag: one(tags, { fields: [locationTags.tagId], references: [tags.id] }),
}));

export const itineraryTagsRelations = relations(itineraryTags, ({ one }) => ({
  itinerary: one(itineraries, { fields: [itineraryTags.itineraryId], references: [itineraries.id] }),
  tag: one(tags, { fields: [itineraryTags.tagId], references: [tags.id] }),
}));

// =====================
// OPERATOR INTEREST TABLE
// =====================

export const operatorInterest = pgTable("operator_interest", {
  id: serial("id").primaryKey(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  numLocations: integer("num_locations").default(1),
  planInterest: varchar("plan_interest", { length: 50 }), // 'free', 'verified', 'premium'
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Post category enum
export const postCategoryEnum = pgEnum("post_category", [
  "guide",
  "gear",
  "safety",
  "seasonal",
  "news",
  "trip-report",
  "spotlight",
]);

// Blog posts / journal articles
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id")
    .references(() => sites.id)
    .notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: postCategoryEnum("category").notNull(),
  heroImage: text("hero_image"),
  author: varchar("author", { length: 100 }),
  readTimeMinutes: integer("read_time_minutes"),
  regionId: integer("region_id").references(() => regions.id),
  activityTypeId: integer("activity_type_id").references(() => activityTypes.id),
  status: statusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Post tags junction
export const postTags = pgTable("post_tags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .references(() => posts.id)
    .notNull(),
  tagId: integer("tag_id")
    .references(() => tags.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const postsRelations = relations(posts, ({ one, many }) => ({
  site: one(sites, { fields: [posts.siteId], references: [sites.id] }),
  region: one(regions, { fields: [posts.regionId], references: [regions.id] }),
  activityType: one(activityTypes, { fields: [posts.activityTypeId], references: [activityTypes.id] }),
  postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
  tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
}));
