import { pgTable, index, foreignKey, serial, integer, varchar, timestamp, numeric, unique, text, jsonb, boolean, date, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const adStatus = pgEnum("ad_status", ['draft', 'active', 'paused', 'ended'])
export const adminRole = pgEnum("admin_role", ['super', 'admin', 'editor', 'viewer'])
export const bookingPlatform = pgEnum("booking_platform", ['none', 'beyonk', 'rezdy', 'fareharbor', 'direct'])
export const claimStatus = pgEnum("claim_status", ['stub', 'claimed', 'premium'])
export const commentStatus = pgEnum("comment_status", ['pending', 'approved', 'rejected'])
export const foodType = pgEnum("food_type", ['breakfast', 'lunch', 'dinner', 'snack', 'pub', 'cafe'])
export const guidePageType = pgEnum("guide_page_type", ['combo', 'best_of'])
export const operatorCategory = pgEnum("operator_category", ['activity_provider', 'accommodation', 'food_drink', 'gear_rental', 'transport'])
export const operatorType = pgEnum("operator_type", ['primary', 'secondary'])
export const postCategory = pgEnum("post_category", ['guide', 'gear', 'safety', 'seasonal', 'news', 'trip-report', 'spotlight', 'opinion'])
export const status = pgEnum("status", ['draft', 'review', 'published', 'archived'])
export const stopType = pgEnum("stop_type", ['activity', 'food', 'accommodation', 'transport', 'freeform'])
export const tagType = pgEnum("tag_type", ['activity', 'terrain', 'difficulty', 'amenity', 'feature', 'region'])
export const travelMode = pgEnum("travel_mode", ['drive', 'walk', 'cycle', 'bus', 'train', 'ferry', 'none'])


export const adCampaigns = pgTable("ad_campaigns", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	advertiserId: integer("advertiser_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	status: adStatus().default('draft').notNull(),
	startDate: timestamp("start_date", { mode: 'string' }),
	endDate: timestamp("end_date", { mode: 'string' }),
	budget: numeric({ precision: 10, scale:  2 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ad_campaigns_advertiser_id_idx").using("btree", table.advertiserId.asc().nullsLast().op("int4_ops")),
	index("ad_campaigns_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "ad_campaigns_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.advertiserId],
			foreignColumns: [advertisers.id],
			name: "ad_campaigns_advertiser_id_advertisers_id_fk"
		}),
]);

export const sites = pgTable("sites", {
	id: serial().primaryKey().notNull(),
	domain: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	tagline: text(),
	logoUrl: text("logo_url"),
	primaryColor: varchar("primary_color", { length: 7 }),
	accentColor: varchar("accent_color", { length: 7 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("sites_domain_unique").on(table.domain),
]);

export const itineraries = pgTable("itineraries", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	regionId: integer("region_id"),
	title: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	tagline: text(),
	description: text(),
	durationDays: integer("duration_days"),
	difficulty: varchar({ length: 50 }),
	bestSeason: varchar("best_season", { length: 255 }),
	heroImage: text("hero_image"),
	priceEstimateFrom: numeric("price_estimate_from", { precision: 10, scale:  2 }),
	priceEstimateTo: numeric("price_estimate_to", { precision: 10, scale:  2 }),
	status: status().default('draft').notNull(),
	completenessScore: integer("completeness_score").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("itineraries_region_id_idx").using("btree", table.regionId.asc().nullsLast().op("int4_ops")),
	index("itineraries_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	index("itineraries_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("itineraries_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "itineraries_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.regionId],
			foreignColumns: [regions.id],
			name: "itineraries_region_id_regions_id_fk"
		}),
]);

export const itineraryItems = pgTable("itinerary_items", {
	id: serial().primaryKey().notNull(),
	itineraryId: integer("itinerary_id").notNull(),
	dayNumber: integer("day_number").notNull(),
	orderIndex: integer("order_index").notNull(),
	activityId: integer("activity_id"),
	accommodationId: integer("accommodation_id"),
	locationId: integer("location_id"),
	timeOfDay: varchar("time_of_day", { length: 50 }),
	title: varchar({ length: 255 }),
	description: text(),
	duration: varchar({ length: 100 }),
	travelTimeToNext: varchar("travel_time_to_next", { length: 100 }),
}, (table) => [
	index("itinerary_items_accommodation_id_idx").using("btree", table.accommodationId.asc().nullsLast().op("int4_ops")),
	index("itinerary_items_activity_id_idx").using("btree", table.activityId.asc().nullsLast().op("int4_ops")),
	index("itinerary_items_itinerary_id_idx").using("btree", table.itineraryId.asc().nullsLast().op("int4_ops")),
	index("itinerary_items_location_id_idx").using("btree", table.locationId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.itineraryId],
			foreignColumns: [itineraries.id],
			name: "itinerary_items_itinerary_id_itineraries_id_fk"
		}),
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "itinerary_items_activity_id_activities_id_fk"
		}),
	foreignKey({
			columns: [table.accommodationId],
			foreignColumns: [accommodation.id],
			name: "itinerary_items_accommodation_id_accommodation_id_fk"
		}),
	foreignKey({
			columns: [table.locationId],
			foreignColumns: [locations.id],
			name: "itinerary_items_location_id_locations_id_fk"
		}),
]);

export const pageAds = pgTable("page_ads", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	pageType: varchar("page_type", { length: 100 }).notNull(),
	pageSlug: varchar("page_slug", { length: 255 }),
	heroBanner: jsonb("hero_banner"),
	mpuSlots: jsonb("mpu_slots"),
	linkList: jsonb("link_list"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "page_ads_site_id_sites_id_fk"
		}),
]);

export const pageSponsors = pgTable("page_sponsors", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	pageType: varchar("page_type", { length: 100 }).notNull(),
	pageSlug: varchar("page_slug", { length: 255 }),
	operatorId: integer("operator_id"),
	displayName: varchar("display_name", { length: 255 }),
	tagline: text(),
	ctaText: varchar("cta_text", { length: 100 }),
	ctaUrl: text("cta_url"),
	excludeOtherAds: boolean("exclude_other_ads").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "page_sponsors_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.operatorId],
			foreignColumns: [operators.id],
			name: "page_sponsors_operator_id_operators_id_fk"
		}),
]);

export const operatorOffers = pgTable("operator_offers", {
	id: serial().primaryKey().notNull(),
	operatorId: integer("operator_id").notNull(),
	title: varchar({ length: 255 }).notNull(),
	discount: varchar({ length: 100 }),
	validFrom: timestamp("valid_from", { mode: 'string' }),
	validUntil: timestamp("valid_until", { mode: 'string' }),
	status: status().default('draft').notNull(),
}, (table) => [
	index("operator_offers_operator_id_idx").using("btree", table.operatorId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.operatorId],
			foreignColumns: [operators.id],
			name: "operator_offers_operator_id_operators_id_fk"
		}),
]);

export const locations = pgTable("locations", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	regionId: integer("region_id"),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	description: text(),
	lat: numeric({ precision: 10, scale:  7 }),
	lng: numeric({ precision: 10, scale:  7 }),
	parkingInfo: text("parking_info"),
	facilities: text(),
	accessNotes: text("access_notes"),
	bestTime: varchar("best_time", { length: 255 }),
	crowdLevel: varchar("crowd_level", { length: 50 }),
	status: status().default('draft').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("locations_region_id_idx").using("btree", table.regionId.asc().nullsLast().op("int4_ops")),
	index("locations_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	index("locations_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("locations_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "locations_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.regionId],
			foreignColumns: [regions.id],
			name: "locations_region_id_regions_id_fk"
		}),
]);

export const adSlots = pgTable("ad_slots", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	pageType: varchar("page_type", { length: 100 }).notNull(),
	slotName: varchar("slot_name", { length: 100 }).notNull(),
	enabled: boolean().default(true),
	minPriority: varchar("min_priority", { length: 50 }),
	fallbackCreativeId: integer("fallback_creative_id"),
	excludeAdvertisers: text("exclude_advertisers").array(),
}, (table) => [
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "ad_slots_site_id_sites_id_fk"
		}),
]);

export const answers = pgTable("answers", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	regionId: integer("region_id"),
	question: text().notNull(),
	slug: varchar({ length: 255 }).notNull(),
	quickAnswer: text("quick_answer"),
	fullContent: text("full_content"),
	relatedQuestions: jsonb("related_questions"),
	status: status().default('draft').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("answers_region_id_idx").using("btree", table.regionId.asc().nullsLast().op("int4_ops")),
	index("answers_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	index("answers_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("answers_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "answers_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.regionId],
			foreignColumns: [regions.id],
			name: "answers_region_id_regions_id_fk"
		}),
	unique("answers_slug_unique").on(table.slug),
]);

export const accommodationTags = pgTable("accommodation_tags", {
	id: serial().primaryKey().notNull(),
	accommodationId: integer("accommodation_id").notNull(),
	tagId: integer("tag_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("accommodation_tags_accommodation_id_idx").using("btree", table.accommodationId.asc().nullsLast().op("int4_ops")),
	index("accommodation_tags_tag_id_idx").using("btree", table.tagId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.accommodationId],
			foreignColumns: [accommodation.id],
			name: "accommodation_tags_accommodation_id_accommodation_id_fk"
		}),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tags.id],
			name: "accommodation_tags_tag_id_tags_id_fk"
		}),
]);

export const transport = pgTable("transport", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	regionId: integer("region_id"),
	type: varchar({ length: 100 }),
	name: varchar({ length: 255 }).notNull(),
	route: text(),
	stops: text(),
	frequency: varchar({ length: 255 }),
	season: varchar({ length: 255 }),
	cost: varchar({ length: 100 }),
	website: text(),
	lat: numeric({ precision: 10, scale:  7 }),
	lng: numeric({ precision: 10, scale:  7 }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("transport_region_id_idx").using("btree", table.regionId.asc().nullsLast().op("int4_ops")),
	index("transport_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "transport_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.regionId],
			foreignColumns: [regions.id],
			name: "transport_region_id_regions_id_fk"
		}),
]);

export const regions = pgTable("regions", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	description: text(),
	heroImage: text("hero_image"),
	heroCredit: varchar("hero_credit", { length: 255 }),
	lat: numeric({ precision: 10, scale:  7 }),
	lng: numeric({ precision: 10, scale:  7 }),
	status: status().default('draft').notNull(),
	completenessScore: integer("completeness_score").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("regions_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	index("regions_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("regions_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "regions_site_id_sites_id_fk"
		}),
]);

export const serviceSlots = pgTable("service_slots", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	scopeType: varchar("scope_type", { length: 50 }).notNull(),
	scopeSlug: varchar("scope_slug", { length: 255 }),
	serviceType: varchar("service_type", { length: 100 }).notNull(),
	label: varchar({ length: 255 }),
	description: text(),
	href: text(),
	operatorId: integer("operator_id"),
	visible: boolean().default(true),
	featured: boolean().default(false),
	icon: varchar({ length: 50 }),
	notes: text(),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "service_slots_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.operatorId],
			foreignColumns: [operators.id],
			name: "service_slots_operator_id_operators_id_fk"
		}),
]);

export const activityTypes = pgTable("activity_types", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	icon: varchar({ length: 100 }),
	description: text(),
	heroImage: text("hero_image"),
}, (table) => [
	index("activity_types_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	index("activity_types_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "activity_types_site_id_sites_id_fk"
		}),
]);

export const advertisers = pgTable("advertisers", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	contactEmail: varchar("contact_email", { length: 255 }),
	website: text(),
	status: status().default('draft').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("advertisers_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "advertisers_site_id_sites_id_fk"
		}),
]);

export const adminUsers = pgTable("admin_users", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }),
	role: adminRole().default('viewer').notNull(),
	sitePermissions: text("site_permissions").array(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	lastLogin: timestamp("last_login", { mode: 'string' }),
}, (table) => [
	unique("admin_users_email_unique").on(table.email),
]);

export const adCreatives = pgTable("ad_creatives", {
	id: serial().primaryKey().notNull(),
	campaignId: integer("campaign_id").notNull(),
	slotType: varchar("slot_type", { length: 100 }),
	imageUrl: text("image_url"),
	linkUrl: text("link_url"),
	altText: text("alt_text"),
	targetingRegions: text("targeting_regions").array(),
	targetingActivities: text("targeting_activities").array(),
	priority: integer().default(0),
	status: status().default('draft').notNull(),
}, (table) => [
	index("ad_creatives_campaign_id_idx").using("btree", table.campaignId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.campaignId],
			foreignColumns: [adCampaigns.id],
			name: "ad_creatives_campaign_id_ad_campaigns_id_fk"
		}),
]);

export const contentRules = pgTable("content_rules", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id"),
	contentType: varchar("content_type", { length: 100 }).notNull(),
	fieldName: varchar("field_name", { length: 100 }).notNull(),
	ruleType: varchar("rule_type", { length: 50 }).notNull(),
	ruleValue: text("rule_value"),
	errorMessage: text("error_message"),
}, (table) => [
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "content_rules_site_id_sites_id_fk"
		}),
]);

export const tags = pgTable("tags", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	type: tagType().notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("tags_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	index("tags_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("tags_type_idx").using("btree", table.type.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "tags_site_id_sites_id_fk"
		}),
]);

export const statusHistory = pgTable("status_history", {
	id: serial().primaryKey().notNull(),
	contentType: varchar("content_type", { length: 100 }).notNull(),
	contentId: integer("content_id").notNull(),
	oldStatus: varchar("old_status", { length: 50 }),
	newStatus: varchar("new_status", { length: 50 }).notNull(),
	changedBy: integer("changed_by"),
	reason: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.changedBy],
			foreignColumns: [adminUsers.id],
			name: "status_history_changed_by_admin_users_id_fk"
		}),
]);

export const activityRegions = pgTable("activity_regions", {
	id: serial().primaryKey().notNull(),
	activityId: integer("activity_id").notNull(),
	regionId: integer("region_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("activity_regions_activity_id_idx").using("btree", table.activityId.asc().nullsLast().op("int4_ops")),
	index("activity_regions_region_id_idx").using("btree", table.regionId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "activity_regions_activity_id_activities_id_fk"
		}),
	foreignKey({
			columns: [table.regionId],
			foreignColumns: [regions.id],
			name: "activity_regions_region_id_regions_id_fk"
		}),
]);

export const postTags = pgTable("post_tags", {
	id: serial().primaryKey().notNull(),
	postId: integer("post_id").notNull(),
	tagId: integer("tag_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("post_tags_post_id_idx").using("btree", table.postId.asc().nullsLast().op("int4_ops")),
	index("post_tags_tag_id_idx").using("btree", table.tagId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.postId],
			foreignColumns: [posts.id],
			name: "post_tags_post_id_posts_id_fk"
		}),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tags.id],
			name: "post_tags_tag_id_tags_id_fk"
		}),
]);

export const itineraryTags = pgTable("itinerary_tags", {
	id: serial().primaryKey().notNull(),
	itineraryId: integer("itinerary_id").notNull(),
	tagId: integer("tag_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("itinerary_tags_itinerary_id_idx").using("btree", table.itineraryId.asc().nullsLast().op("int4_ops")),
	index("itinerary_tags_tag_id_idx").using("btree", table.tagId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.itineraryId],
			foreignColumns: [itineraries.id],
			name: "itinerary_tags_itinerary_id_itineraries_id_fk"
		}),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tags.id],
			name: "itinerary_tags_tag_id_tags_id_fk"
		}),
]);

export const bulkOperations = pgTable("bulk_operations", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id"),
	adminUserId: integer("admin_user_id"),
	operationType: varchar("operation_type", { length: 100 }).notNull(),
	contentType: varchar("content_type", { length: 100 }).notNull(),
	affectedIds: text("affected_ids").array(),
	changes: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "bulk_operations_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.adminUserId],
			foreignColumns: [adminUsers.id],
			name: "bulk_operations_admin_user_id_admin_users_id_fk"
		}),
]);

export const activityTags = pgTable("activity_tags", {
	id: serial().primaryKey().notNull(),
	activityId: integer("activity_id").notNull(),
	tagId: integer("tag_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("activity_tags_activity_id_idx").using("btree", table.activityId.asc().nullsLast().op("int4_ops")),
	index("activity_tags_tag_id_idx").using("btree", table.tagId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "activity_tags_activity_id_activities_id_fk"
		}),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tags.id],
			name: "activity_tags_tag_id_tags_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }),
	regionPreference: varchar("region_preference", { length: 100 }),
	newsletterOptIn: boolean("newsletter_opt_in").default(false),
	lastLoginAt: timestamp("last_login_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const accommodation = pgTable("accommodation", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	regionId: integer("region_id"),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 100 }),
	address: text(),
	lat: numeric({ precision: 10, scale:  7 }),
	lng: numeric({ precision: 10, scale:  7 }),
	website: text(),
	priceFrom: numeric("price_from", { precision: 10, scale:  2 }),
	priceTo: numeric("price_to", { precision: 10, scale:  2 }),
	adventureFeatures: text("adventure_features"),
	bookingUrl: text("booking_url"),
	airbnbUrl: text("airbnb_url"),
	googleRating: numeric("google_rating", { precision: 2, scale:  1 }),
	description: text(),
	status: status().default('draft').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("accommodation_region_id_idx").using("btree", table.regionId.asc().nullsLast().op("int4_ops")),
	index("accommodation_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	index("accommodation_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("accommodation_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "accommodation_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.regionId],
			foreignColumns: [regions.id],
			name: "accommodation_region_id_regions_id_fk"
		}),
]);

export const operatorInterest = pgTable("operator_interest", {
	id: serial().primaryKey().notNull(),
	businessName: varchar("business_name", { length: 255 }).notNull(),
	contactName: varchar("contact_name", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 50 }),
	numLocations: integer("num_locations").default(1),
	planInterest: varchar("plan_interest", { length: 50 }),
	message: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const activities = pgTable("activities", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	regionId: integer("region_id"),
	operatorId: integer("operator_id"),
	activityTypeId: integer("activity_type_id"),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	description: text(),
	meetingPoint: text("meeting_point"),
	lat: numeric({ precision: 10, scale:  7 }),
	lng: numeric({ precision: 10, scale:  7 }),
	priceFrom: numeric("price_from", { precision: 10, scale:  2 }),
	priceTo: numeric("price_to", { precision: 10, scale:  2 }),
	duration: varchar({ length: 100 }),
	difficulty: varchar({ length: 50 }),
	minAge: integer("min_age"),
	season: varchar({ length: 255 }),
	bookingUrl: text("booking_url"),
	sourceUrl: text("source_url"),
	status: status().default('draft').notNull(),
	completenessScore: integer("completeness_score").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	bookingPlatform: bookingPlatform("booking_platform").default('none').notNull(),
	bookingPartnerRef: varchar("booking_partner_ref", { length: 255 }),
	bookingAffiliateUrl: text("booking_affiliate_url"),
}, (table) => [
	index("activities_activity_type_id_idx").using("btree", table.activityTypeId.asc().nullsLast().op("int4_ops")),
	index("activities_operator_id_idx").using("btree", table.operatorId.asc().nullsLast().op("int4_ops")),
	index("activities_region_id_idx").using("btree", table.regionId.asc().nullsLast().op("int4_ops")),
	index("activities_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	index("activities_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("activities_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "activities_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.regionId],
			foreignColumns: [regions.id],
			name: "activities_region_id_regions_id_fk"
		}),
	foreignKey({
			columns: [table.operatorId],
			foreignColumns: [operators.id],
			name: "activities_operator_id_operators_id_fk"
		}),
	foreignKey({
			columns: [table.activityTypeId],
			foreignColumns: [activityTypes.id],
			name: "activities_activity_type_id_activity_types_id_fk"
		}),
]);

export const locationTags = pgTable("location_tags", {
	id: serial().primaryKey().notNull(),
	locationId: integer("location_id").notNull(),
	tagId: integer("tag_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("location_tags_location_id_idx").using("btree", table.locationId.asc().nullsLast().op("int4_ops")),
	index("location_tags_tag_id_idx").using("btree", table.tagId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.locationId],
			foreignColumns: [locations.id],
			name: "location_tags_location_id_locations_id_fk"
		}),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tags.id],
			name: "location_tags_tag_id_tags_id_fk"
		}),
]);

export const userFavourites = pgTable("user_favourites", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	favouriteType: varchar("favourite_type", { length: 50 }).notNull(),
	favouriteId: integer("favourite_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_favourites_user_id_users_id_fk"
		}),
]);

export const operatorSessions = pgTable("operator_sessions", {
	id: serial().primaryKey().notNull(),
	operatorId: integer("operator_id").notNull(),
	email: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }),
	role: varchar({ length: 100 }),
	lastLoginAt: timestamp("last_login_at", { mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("operator_sessions_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("operator_sessions_operator_id_idx").using("btree", table.operatorId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.operatorId],
			foreignColumns: [operators.id],
			name: "operator_sessions_operator_id_operators_id_fk"
		}),
]);

export const magicLinks = pgTable("magic_links", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	token: varchar({ length: 255 }).notNull(),
	operatorId: integer("operator_id"),
	purpose: varchar({ length: 50 }).default('login').notNull(),
	used: boolean().default(false).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("magic_links_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("magic_links_operator_id_idx").using("btree", table.operatorId.asc().nullsLast().op("int4_ops")),
	index("magic_links_token_idx").using("btree", table.token.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.operatorId],
			foreignColumns: [operators.id],
			name: "magic_links_operator_id_operators_id_fk"
		}),
	unique("magic_links_token_unique").on(table.token),
]);

export const operatorClaims = pgTable("operator_claims", {
	id: serial().primaryKey().notNull(),
	operatorId: integer("operator_id").notNull(),
	claimantName: varchar("claimant_name", { length: 255 }).notNull(),
	claimantEmail: varchar("claimant_email", { length: 255 }).notNull(),
	claimantRole: varchar("claimant_role", { length: 100 }),
	verificationMethod: varchar("verification_method", { length: 50 }),
	claimStatus: varchar("claim_status", { length: 50 }).default('pending').notNull(),
	rejectionReason: text("rejection_reason"),
	ipAddress: varchar("ip_address", { length: 45 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	verifiedAt: timestamp("verified_at", { mode: 'string' }),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
}, (table) => [
	index("operator_claims_operator_id_idx").using("btree", table.operatorId.asc().nullsLast().op("int4_ops")),
	index("operator_claims_status_idx").using("btree", table.claimStatus.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.operatorId],
			foreignColumns: [operators.id],
			name: "operator_claims_operator_id_operators_id_fk"
		}),
]);

export const posts = pgTable("posts", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	slug: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	excerpt: text(),
	content: text().notNull(),
	category: postCategory().notNull(),
	heroImage: text("hero_image"),
	author: varchar({ length: 100 }),
	readTimeMinutes: integer("read_time_minutes"),
	regionId: integer("region_id"),
	activityTypeId: integer("activity_type_id"),
	status: status().default('draft').notNull(),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("posts_activity_type_id_idx").using("btree", table.activityTypeId.asc().nullsLast().op("int4_ops")),
	index("posts_category_idx").using("btree", table.category.asc().nullsLast().op("enum_ops")),
	index("posts_region_id_idx").using("btree", table.regionId.asc().nullsLast().op("int4_ops")),
	index("posts_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	index("posts_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("posts_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "posts_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.regionId],
			foreignColumns: [regions.id],
			name: "posts_region_id_regions_id_fk"
		}),
	foreignKey({
			columns: [table.activityTypeId],
			foreignColumns: [activityTypes.id],
			name: "posts_activity_type_id_activity_types_id_fk"
		}),
]);

export const advertiserAccounts = pgTable("advertiser_accounts", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	primaryEmail: varchar("primary_email", { length: 255 }),
	primaryPhone: varchar("primary_phone", { length: 50 }),
	contactName: varchar("contact_name", { length: 255 }),
	billingEmail: varchar("billing_email", { length: 255 }),
	billingCustomAmount: numeric("billing_custom_amount", { precision: 10, scale:  2 }),
	billingNotes: text("billing_notes"),
	stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
	adminNotes: text("admin_notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	subscribedAt: timestamp("subscribed_at", { mode: 'string' }).defaultNow().notNull(),
	source: varchar({ length: 50 }).default('homepage'),
}, (table) => [
	unique("newsletter_subscribers_email_unique").on(table.email),
]);

export const eventSaves = pgTable("event_saves", {
	id: serial().primaryKey().notNull(),
	eventId: integer("event_id").notNull(),
	sessionId: varchar("session_id", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("event_saves_event_id_idx").using("btree", table.eventId.asc().nullsLast().op("int4_ops")),
	index("event_saves_session_id_idx").using("btree", table.sessionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "event_saves_event_id_events_id_fk"
		}),
]);

export const commentVotes = pgTable("comment_votes", {
	id: serial().primaryKey().notNull(),
	commentId: integer("comment_id").notNull(),
	sessionId: varchar("session_id", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("comment_votes_comment_id_idx").using("btree", table.commentId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.commentId],
			foreignColumns: [comments.id],
			name: "comment_votes_comment_id_comments_id_fk"
		}),
	unique("unique_comment_vote").on(table.commentId, table.sessionId),
]);

export const itineraryStops = pgTable("itinerary_stops", {
	id: serial().primaryKey().notNull(),
	itineraryId: integer("itinerary_id").notNull(),
	dayNumber: integer("day_number").notNull(),
	orderIndex: integer("order_index").notNull(),
	stopType: stopType("stop_type").notNull(),
	startTime: varchar("start_time", { length: 10 }),
	duration: varchar({ length: 50 }),
	travelToNext: varchar("travel_to_next", { length: 100 }),
	travelMode: travelMode("travel_mode"),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	activityId: integer("activity_id"),
	accommodationId: integer("accommodation_id"),
	locationId: integer("location_id"),
	operatorId: integer("operator_id"),
	costFrom: numeric("cost_from", { precision: 10, scale:  2 }),
	costTo: numeric("cost_to", { precision: 10, scale:  2 }),
	wetAltTitle: varchar("wet_alt_title", { length: 255 }),
	wetAltDescription: text("wet_alt_description"),
	wetAltActivityId: integer("wet_alt_activity_id"),
	wetAltCostFrom: numeric("wet_alt_cost_from", { precision: 10, scale:  2 }),
	wetAltCostTo: numeric("wet_alt_cost_to", { precision: 10, scale:  2 }),
	budgetAltTitle: varchar("budget_alt_title", { length: 255 }),
	budgetAltDescription: text("budget_alt_description"),
	budgetAltActivityId: integer("budget_alt_activity_id"),
	budgetAltCostFrom: numeric("budget_alt_cost_from", { precision: 10, scale:  2 }),
	budgetAltCostTo: numeric("budget_alt_cost_to", { precision: 10, scale:  2 }),
	foodName: varchar("food_name", { length: 255 }),
	foodBudget: varchar("food_budget", { length: 50 }),
	foodLink: text("food_link"),
	foodNotes: text("food_notes"),
	foodType: foodType("food_type"),
	lat: numeric({ precision: 10, scale:  7 }),
	lng: numeric({ precision: 10, scale:  7 }),
	routeToNextJson: jsonb("route_to_next_json"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	isGeneric: boolean("is_generic").default(false),
	icon: varchar({ length: 50 }),
}, (table) => [
	index("itinerary_stops_accommodation_id_idx").using("btree", table.accommodationId.asc().nullsLast().op("int4_ops")),
	index("itinerary_stops_activity_id_idx").using("btree", table.activityId.asc().nullsLast().op("int4_ops")),
	index("itinerary_stops_day_order_idx").using("btree", table.dayNumber.asc().nullsLast().op("int4_ops"), table.orderIndex.asc().nullsLast().op("int4_ops")),
	index("itinerary_stops_itinerary_id_idx").using("btree", table.itineraryId.asc().nullsLast().op("int4_ops")),
	index("itinerary_stops_location_id_idx").using("btree", table.locationId.asc().nullsLast().op("int4_ops")),
	index("itinerary_stops_operator_id_idx").using("btree", table.operatorId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.itineraryId],
			foreignColumns: [itineraries.id],
			name: "itinerary_stops_itinerary_id_itineraries_id_fk"
		}),
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "itinerary_stops_activity_id_activities_id_fk"
		}),
	foreignKey({
			columns: [table.accommodationId],
			foreignColumns: [accommodation.id],
			name: "itinerary_stops_accommodation_id_accommodation_id_fk"
		}),
	foreignKey({
			columns: [table.locationId],
			foreignColumns: [locations.id],
			name: "itinerary_stops_location_id_locations_id_fk"
		}),
	foreignKey({
			columns: [table.operatorId],
			foreignColumns: [operators.id],
			name: "itinerary_stops_operator_id_operators_id_fk"
		}),
	foreignKey({
			columns: [table.wetAltActivityId],
			foreignColumns: [activities.id],
			name: "itinerary_stops_wet_alt_activity_id_activities_id_fk"
		}),
	foreignKey({
			columns: [table.budgetAltActivityId],
			foreignColumns: [activities.id],
			name: "itinerary_stops_budget_alt_activity_id_activities_id_fk"
		}),
]);

export const guidePages = pgTable("guide_pages", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	type: guidePageType().notNull(),
	regionId: integer("region_id").notNull(),
	activityTypeId: integer("activity_type_id").notNull(),
	slug: varchar({ length: 255 }).notNull(),
	urlPath: varchar("url_path", { length: 255 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	h1: varchar({ length: 255 }),
	strapline: text(),
	metaTitle: varchar("meta_title", { length: 255 }),
	metaDescription: text("meta_description"),
	heroImage: text("hero_image"),
	heroAlt: text("hero_alt"),
	introduction: text(),
	bestSeason: varchar("best_season", { length: 100 }),
	difficultyRange: varchar("difficulty_range", { length: 100 }),
	priceRange: varchar("price_range", { length: 100 }),
	dataFile: varchar("data_file", { length: 255 }),
	keywords: jsonb(),
	sponsorOperatorId: integer("sponsor_operator_id"),
	sponsorDisplayName: varchar("sponsor_display_name", { length: 255 }),
	sponsorTagline: text("sponsor_tagline"),
	sponsorCtaText: varchar("sponsor_cta_text", { length: 100 }),
	sponsorCtaUrl: text("sponsor_cta_url"),
	sponsorExpiresAt: timestamp("sponsor_expires_at", { mode: 'string' }),
	featuredOperatorIds: jsonb("featured_operator_ids"),
	targetKeyword: varchar("target_keyword", { length: 255 }),
	searchVolume: integer("search_volume"),
	currentRanking: integer("current_ranking"),
	lastRankCheck: timestamp("last_rank_check", { mode: 'string' }),
	contentStatus: status("content_status").default('draft').notNull(),
	priority: integer().default(0),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("guide_pages_activity_type_id_idx").using("btree", table.activityTypeId.asc().nullsLast().op("int4_ops")),
	index("guide_pages_content_status_idx").using("btree", table.contentStatus.asc().nullsLast().op("enum_ops")),
	index("guide_pages_region_id_idx").using("btree", table.regionId.asc().nullsLast().op("int4_ops")),
	index("guide_pages_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	index("guide_pages_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("guide_pages_url_path_idx").using("btree", table.urlPath.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "guide_pages_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.regionId],
			foreignColumns: [regions.id],
			name: "guide_pages_region_id_regions_id_fk"
		}),
	foreignKey({
			columns: [table.activityTypeId],
			foreignColumns: [activityTypes.id],
			name: "guide_pages_activity_type_id_activity_types_id_fk"
		}),
	foreignKey({
			columns: [table.sponsorOperatorId],
			foreignColumns: [operators.id],
			name: "guide_pages_sponsor_operator_id_operators_id_fk"
		}),
]);

export const outreachRecipients = pgTable("outreach_recipients", {
	id: serial().primaryKey().notNull(),
	campaignId: integer("campaign_id").notNull(),
	operatorId: integer("operator_id").notNull(),
	email: varchar({ length: 255 }).notNull(),
	status: varchar({ length: 50 }).default('pending').notNull(),
	sentAt: timestamp("sent_at", { mode: 'string' }),
	openedAt: timestamp("opened_at", { mode: 'string' }),
	clickedAt: timestamp("clicked_at", { mode: 'string' }),
	claimedAt: timestamp("claimed_at", { mode: 'string' }),
}, (table) => [
	index("outreach_recipients_campaign_id_idx").using("btree", table.campaignId.asc().nullsLast().op("int4_ops")),
	index("outreach_recipients_operator_id_idx").using("btree", table.operatorId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.campaignId],
			foreignColumns: [outreachCampaigns.id],
			name: "outreach_recipients_campaign_id_outreach_campaigns_id_fk"
		}),
	foreignKey({
			columns: [table.operatorId],
			foreignColumns: [operators.id],
			name: "outreach_recipients_operator_id_operators_id_fk"
		}),
	unique("outreach_unique_recipient").on(table.campaignId, table.operatorId),
]);

export const pageViews = pgTable("page_views", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	pageType: varchar("page_type", { length: 50 }).notNull(),
	pageSlug: varchar("page_slug", { length: 255 }).notNull(),
	operatorId: integer("operator_id"),
	viewDate: date("view_date").notNull(),
	viewCount: integer("view_count").default(0).notNull(),
	uniqueVisitors: integer("unique_visitors").default(0).notNull(),
}, (table) => [
	index("page_views_date_idx").using("btree", table.viewDate.asc().nullsLast().op("date_ops")),
	index("page_views_operator_id_idx").using("btree", table.operatorId.asc().nullsLast().op("int4_ops")),
	index("page_views_page_slug_idx").using("btree", table.pageSlug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "page_views_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.operatorId],
			foreignColumns: [operators.id],
			name: "page_views_operator_id_operators_id_fk"
		}),
	unique("page_views_unique").on(table.siteId, table.pageType, table.pageSlug, table.viewDate),
]);

export const outreachCampaigns = pgTable("outreach_campaigns", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	subject: varchar({ length: 255 }),
	bodyTemplate: text("body_template"),
	status: varchar({ length: 50 }).default('draft').notNull(),
	sentCount: integer("sent_count").default(0),
	openedCount: integer("opened_count").default(0),
	clickedCount: integer("clicked_count").default(0),
	claimedCount: integer("claimed_count").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	sentAt: timestamp("sent_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "outreach_campaigns_site_id_sites_id_fk"
		}),
]);

export const guidePageSpots = pgTable("guide_page_spots", {
	id: serial().primaryKey().notNull(),
	guidePageId: integer("guide_page_id").notNull(),
	rank: integer().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }),
	description: text(),
	verdict: text(),
	difficulty: varchar({ length: 50 }),
	duration: varchar({ length: 100 }),
	distance: varchar({ length: 50 }),
	elevationGain: varchar("elevation_gain", { length: 50 }),
	bestFor: text("best_for"),
	notSuitableFor: text("not_suitable_for"),
	bestSeason: varchar("best_season", { length: 100 }),
	parking: text(),
	estimatedCost: varchar("estimated_cost", { length: 100 }),
	insiderTip: text("insider_tip"),
	image: text(),
	imageAlt: text("image_alt"),
	lat: numeric({ precision: 10, scale:  7 }),
	lng: numeric({ precision: 10, scale:  7 }),
	operatorId: integer("operator_id"),
	activityId: integer("activity_id"),
	youtubeVideoId: varchar("youtube_video_id", { length: 20 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("guide_page_spots_activity_id_idx").using("btree", table.activityId.asc().nullsLast().op("int4_ops")),
	index("guide_page_spots_guide_page_id_idx").using("btree", table.guidePageId.asc().nullsLast().op("int4_ops")),
	index("guide_page_spots_operator_id_idx").using("btree", table.operatorId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.guidePageId],
			foreignColumns: [guidePages.id],
			name: "guide_page_spots_guide_page_id_guide_pages_id_fk"
		}),
	foreignKey({
			columns: [table.operatorId],
			foreignColumns: [operators.id],
			name: "guide_page_spots_operator_id_operators_id_fk"
		}),
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [activities.id],
			name: "guide_page_spots_activity_id_activities_id_fk"
		}),
]);

export const events = pgTable("events", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	regionId: integer("region_id"),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 100 }),
	description: text(),
	dateStart: timestamp("date_start", { mode: 'string' }),
	dateEnd: timestamp("date_end", { mode: 'string' }),
	monthTypical: varchar("month_typical", { length: 50 }),
	location: text(),
	lat: numeric({ precision: 10, scale:  7 }),
	lng: numeric({ precision: 10, scale:  7 }),
	website: text(),
	registrationCost: numeric("registration_cost", { precision: 10, scale:  2 }),
	capacity: integer(),
	status: status().default('draft').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	heroImage: text("hero_image"),
	imageGallery: jsonb("image_gallery"),
	category: varchar({ length: 100 }),
	tags: text().array(),
	isRecurring: boolean("is_recurring").default(false),
	recurringSchedule: varchar("recurring_schedule", { length: 255 }),
	isFeatured: boolean("is_featured").default(false),
	isPromoted: boolean("is_promoted").default(false),
	promotedUntil: timestamp("promoted_until", { mode: 'string' }),
	operatorId: integer("operator_id"),
	externalSource: varchar("external_source", { length: 100 }),
	externalId: varchar("external_id", { length: 255 }),
	externalUrl: text("external_url"),
	ticketUrl: text("ticket_url"),
	difficulty: varchar({ length: 50 }),
	ageRange: varchar("age_range", { length: 100 }),
}, (table) => [
	index("events_date_start_idx").using("btree", table.dateStart.asc().nullsLast().op("timestamp_ops")),
	index("events_operator_id_idx").using("btree", table.operatorId.asc().nullsLast().op("int4_ops")),
	index("events_region_id_idx").using("btree", table.regionId.asc().nullsLast().op("int4_ops")),
	index("events_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	index("events_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("events_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "events_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.regionId],
			foreignColumns: [regions.id],
			name: "events_region_id_regions_id_fk"
		}),
	foreignKey({
			columns: [table.operatorId],
			foreignColumns: [operators.id],
			name: "events_operator_id_operators_id_fk"
		}),
]);

export const comments = pgTable("comments", {
	id: serial().primaryKey().notNull(),
	pageSlug: varchar("page_slug", { length: 255 }).notNull(),
	pageType: varchar("page_type", { length: 50 }).notNull(),
	userId: integer("user_id"),
	sessionId: varchar("session_id", { length: 255 }),
	audioUrl: text("audio_url"),
	transcript: text(),
	summary: text(),
	status: commentStatus().default('pending').notNull(),
	votes: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	parentId: integer("parent_id"),
	title: varchar({ length: 255 }),
	duration: integer(),
	authorName: varchar("author_name", { length: 255 }),
	authorAvatar: text("author_avatar"),
	waveformData: jsonb("waveform_data"),
	downvotes: integer().default(0).notNull(),
	moderationReason: text("moderation_reason"),
}, (table) => [
	index("comments_page_slug_idx").using("btree", table.pageSlug.asc().nullsLast().op("text_ops")),
	index("comments_page_type_idx").using("btree", table.pageType.asc().nullsLast().op("text_ops")),
	index("comments_parent_id_idx").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
	index("comments_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("comments_votes_idx").using("btree", table.votes.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "comments_user_id_users_id_fk"
		}),
]);

export const operators = pgTable("operators", {
	id: serial().primaryKey().notNull(),
	siteId: integer("site_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	type: operatorType().default('secondary').notNull(),
	category: operatorCategory(),
	website: text(),
	email: varchar({ length: 255 }),
	phone: varchar({ length: 50 }),
	address: text(),
	lat: numeric({ precision: 10, scale:  7 }),
	lng: numeric({ precision: 10, scale:  7 }),
	description: text(),
	tagline: text(),
	logoUrl: text("logo_url"),
	coverImage: text("cover_image"),
	googleRating: numeric("google_rating", { precision: 2, scale:  1 }),
	reviewCount: integer("review_count"),
	tripadvisorUrl: text("tripadvisor_url"),
	priceRange: varchar("price_range", { length: 10 }),
	uniqueSellingPoint: text("unique_selling_point"),
	claimStatus: claimStatus("claim_status").default('stub').notNull(),
	claimedByEmail: varchar("claimed_by_email", { length: 255 }),
	claimedAt: timestamp("claimed_at", { mode: 'string' }),
	trustSignals: jsonb("trust_signals"),
	serviceTypes: text("service_types").array(),
	regions: text().array(),
	activityTypes: text("activity_types").array(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	bookingPlatform: bookingPlatform("booking_platform").default('none').notNull(),
	bookingPartnerRef: varchar("booking_partner_ref", { length: 255 }),
	bookingAffiliateId: varchar("booking_affiliate_id", { length: 255 }),
	bookingWidgetUrl: text("booking_widget_url"),
	serviceDetails: jsonb("service_details"),
	stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
	billingTier: varchar("billing_tier", { length: 50 }).default('free'),
	billingEmail: varchar("billing_email", { length: 255 }),
	verifiedAt: timestamp("verified_at", { mode: 'string' }),
	verifiedByEmail: varchar("verified_by_email", { length: 255 }),
	stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
	stripeSubscriptionStatus: varchar("stripe_subscription_status", { length: 50 }),
	billingPeriodEnd: timestamp("billing_period_end", { mode: 'string' }),
	accountId: integer("account_id"),
	billingCustomAmount: numeric("billing_custom_amount", { precision: 10, scale:  2 }),
	billingNotes: text("billing_notes"),
	adminNotes: text("admin_notes"),
	dataSource: varchar("data_source", { length: 50 }).default('manual'),
	lastVerifiedAt: timestamp("last_verified_at", { mode: 'string' }),
	googlePlaceId: varchar("google_place_id", { length: 255 }),
	youtubeVideoId: varchar("youtube_video_id", { length: 20 }),
	groupFriendly: boolean("group_friendly").default(false),
	groupMinSize: integer("group_min_size"),
	groupMaxSize: integer("group_max_size"),
	groupPriceFrom: integer("group_price_from"),
	stagHenPackages: boolean("stag_hen_packages").default(false),
	trialTier: varchar("trial_tier", { length: 50 }),
	trialStartedAt: timestamp("trial_started_at", { mode: 'string' }),
	trialExpiresAt: timestamp("trial_expires_at", { mode: 'string' }),
	trialConvertedAt: timestamp("trial_converted_at", { mode: 'string' }),
	trialSource: varchar("trial_source", { length: 100 }),
}, (table) => [
	index("operators_account_id_idx").using("btree", table.accountId.asc().nullsLast().op("int4_ops")),
	index("operators_category_idx").using("btree", table.category.asc().nullsLast().op("enum_ops")),
	index("operators_claim_status_idx").using("btree", table.claimStatus.asc().nullsLast().op("enum_ops")),
	index("operators_site_id_idx").using("btree", table.siteId.asc().nullsLast().op("int4_ops")),
	index("operators_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [sites.id],
			name: "operators_site_id_sites_id_fk"
		}),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [advertiserAccounts.id],
			name: "operators_account_id_advertiser_accounts_id_fk"
		}),
]);
