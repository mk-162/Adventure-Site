CREATE TYPE "public"."ad_status" AS ENUM('draft', 'active', 'paused', 'ended');--> statement-breakpoint
CREATE TYPE "public"."admin_role" AS ENUM('super', 'admin', 'editor', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."booking_platform" AS ENUM('none', 'beyonk', 'rezdy', 'fareharbor', 'direct');--> statement-breakpoint
CREATE TYPE "public"."claim_status" AS ENUM('stub', 'claimed', 'premium');--> statement-breakpoint
CREATE TYPE "public"."food_type" AS ENUM('breakfast', 'lunch', 'dinner', 'snack', 'pub', 'cafe');--> statement-breakpoint
CREATE TYPE "public"."guide_page_type" AS ENUM('combo', 'best_of');--> statement-breakpoint
CREATE TYPE "public"."operator_category" AS ENUM('activity_provider', 'accommodation', 'food_drink', 'gear_rental', 'transport');--> statement-breakpoint
CREATE TYPE "public"."operator_type" AS ENUM('primary', 'secondary');--> statement-breakpoint
CREATE TYPE "public"."post_category" AS ENUM('guide', 'gear', 'safety', 'seasonal', 'news', 'trip-report', 'spotlight');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('draft', 'review', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."stop_type" AS ENUM('activity', 'food', 'accommodation', 'transport', 'freeform');--> statement-breakpoint
CREATE TYPE "public"."tag_type" AS ENUM('activity', 'terrain', 'difficulty', 'amenity', 'feature', 'region');--> statement-breakpoint
CREATE TYPE "public"."travel_mode" AS ENUM('drive', 'walk', 'cycle', 'bus', 'train', 'ferry', 'none');--> statement-breakpoint
CREATE TABLE "accommodation" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"region_id" integer,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" varchar(100),
	"address" text,
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"website" text,
	"price_from" numeric(10, 2),
	"price_to" numeric(10, 2),
	"adventure_features" text,
	"booking_url" text,
	"airbnb_url" text,
	"google_rating" numeric(2, 1),
	"description" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accommodation_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"accommodation_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"region_id" integer,
	"operator_id" integer,
	"activity_type_id" integer,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"meeting_point" text,
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"price_from" numeric(10, 2),
	"price_to" numeric(10, 2),
	"duration" varchar(100),
	"difficulty" varchar(50),
	"min_age" integer,
	"season" varchar(255),
	"booking_url" text,
	"booking_platform" "booking_platform" DEFAULT 'none' NOT NULL,
	"booking_partner_ref" varchar(255),
	"booking_affiliate_url" text,
	"source_url" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"completeness_score" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"icon" varchar(100),
	"hero_image" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "ad_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"advertiser_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" "ad_status" DEFAULT 'draft' NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"budget" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ad_creatives" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer NOT NULL,
	"slot_type" varchar(100),
	"image_url" text,
	"link_url" text,
	"alt_text" text,
	"targeting_regions" text[],
	"targeting_activities" text[],
	"priority" integer DEFAULT 0,
	"status" "status" DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ad_slots" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"page_type" varchar(100) NOT NULL,
	"slot_name" varchar(100) NOT NULL,
	"enabled" boolean DEFAULT true,
	"min_priority" varchar(50),
	"fallback_creative_id" integer,
	"exclude_advertisers" text[]
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"role" "admin_role" DEFAULT 'viewer' NOT NULL,
	"site_permissions" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_login" timestamp,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "advertisers" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"contact_email" varchar(255),
	"website" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"region_id" integer,
	"question" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"quick_answer" text,
	"full_content" text,
	"related_questions" jsonb,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "answers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "bulk_operations" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer,
	"admin_user_id" integer,
	"operation_type" varchar(100) NOT NULL,
	"content_type" varchar(100) NOT NULL,
	"affected_ids" text[],
	"changes" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer,
	"content_type" varchar(100) NOT NULL,
	"field_name" varchar(100) NOT NULL,
	"rule_type" varchar(50) NOT NULL,
	"rule_value" text,
	"error_message" text
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"region_id" integer,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" varchar(100),
	"description" text,
	"date_start" timestamp,
	"date_end" timestamp,
	"month_typical" varchar(50),
	"location" text,
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"website" text,
	"registration_cost" numeric(10, 2),
	"capacity" integer,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guide_page_spots" (
	"id" serial PRIMARY KEY NOT NULL,
	"guide_page_id" integer NOT NULL,
	"rank" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255),
	"description" text,
	"verdict" text,
	"difficulty" varchar(50),
	"duration" varchar(100),
	"distance" varchar(50),
	"elevation_gain" varchar(50),
	"best_for" text,
	"not_suitable_for" text,
	"best_season" varchar(100),
	"parking" text,
	"estimated_cost" varchar(100),
	"insider_tip" text,
	"image" text,
	"image_alt" text,
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"operator_id" integer,
	"activity_id" integer,
	"youtube_video_id" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guide_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"type" "guide_page_type" NOT NULL,
	"region_id" integer NOT NULL,
	"activity_type_id" integer NOT NULL,
	"slug" varchar(255) NOT NULL,
	"url_path" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"h1" varchar(255),
	"strapline" text,
	"meta_title" varchar(255),
	"meta_description" text,
	"hero_image" text,
	"hero_alt" text,
	"introduction" text,
	"best_season" varchar(100),
	"difficulty_range" varchar(100),
	"price_range" varchar(100),
	"data_file" varchar(255),
	"keywords" jsonb,
	"sponsor_operator_id" integer,
	"sponsor_display_name" varchar(255),
	"sponsor_tagline" text,
	"sponsor_cta_text" varchar(100),
	"sponsor_cta_url" text,
	"sponsor_expires_at" timestamp,
	"featured_operator_ids" jsonb,
	"target_keyword" varchar(255),
	"search_volume" integer,
	"current_ranking" integer,
	"last_rank_check" timestamp,
	"content_status" "status" DEFAULT 'draft' NOT NULL,
	"priority" integer DEFAULT 0,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "itineraries" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"region_id" integer,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"tagline" text,
	"description" text,
	"duration_days" integer,
	"difficulty" varchar(50),
	"best_season" varchar(255),
	"hero_image" text,
	"price_estimate_from" numeric(10, 2),
	"price_estimate_to" numeric(10, 2),
	"status" "status" DEFAULT 'draft' NOT NULL,
	"completeness_score" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "itinerary_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"itinerary_id" integer NOT NULL,
	"day_number" integer NOT NULL,
	"order_index" integer NOT NULL,
	"activity_id" integer,
	"accommodation_id" integer,
	"location_id" integer,
	"time_of_day" varchar(50),
	"title" varchar(255),
	"description" text,
	"duration" varchar(100),
	"travel_time_to_next" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "itinerary_stops" (
	"id" serial PRIMARY KEY NOT NULL,
	"itinerary_id" integer NOT NULL,
	"day_number" integer NOT NULL,
	"order_index" integer NOT NULL,
	"stop_type" "stop_type" NOT NULL,
	"start_time" varchar(10),
	"duration" varchar(50),
	"travel_to_next" varchar(100),
	"travel_mode" "travel_mode",
	"title" varchar(255) NOT NULL,
	"description" text,
	"activity_id" integer,
	"accommodation_id" integer,
	"location_id" integer,
	"operator_id" integer,
	"cost_from" numeric(10, 2),
	"cost_to" numeric(10, 2),
	"wet_alt_title" varchar(255),
	"wet_alt_description" text,
	"wet_alt_activity_id" integer,
	"wet_alt_cost_from" numeric(10, 2),
	"wet_alt_cost_to" numeric(10, 2),
	"budget_alt_title" varchar(255),
	"budget_alt_description" text,
	"budget_alt_activity_id" integer,
	"budget_alt_cost_from" numeric(10, 2),
	"budget_alt_cost_to" numeric(10, 2),
	"food_name" varchar(255),
	"food_budget" varchar(50),
	"food_link" text,
	"food_notes" text,
	"food_type" "food_type",
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"route_to_next_json" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "itinerary_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"itinerary_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"location_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"region_id" integer,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"parking_info" text,
	"facilities" text,
	"access_notes" text,
	"best_time" varchar(255),
	"crowd_level" varchar(50),
	"status" "status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "operator_interest" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"contact_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"num_locations" integer DEFAULT 1,
	"plan_interest" varchar(50),
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "operator_offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"operator_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"discount" varchar(100),
	"valid_from" timestamp,
	"valid_until" timestamp,
	"status" "status" DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "operators" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" "operator_type" DEFAULT 'secondary' NOT NULL,
	"category" "operator_category",
	"website" text,
	"email" varchar(255),
	"phone" varchar(50),
	"address" text,
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"description" text,
	"tagline" text,
	"logo_url" text,
	"cover_image" text,
	"google_rating" numeric(2, 1),
	"review_count" integer,
	"tripadvisor_url" text,
	"price_range" varchar(10),
	"unique_selling_point" text,
	"claim_status" "claim_status" DEFAULT 'stub' NOT NULL,
	"claimed_by_email" varchar(255),
	"claimed_at" timestamp,
	"trust_signals" jsonb,
	"service_types" text[],
	"regions" text[],
	"activity_types" text[],
	"booking_platform" "booking_platform" DEFAULT 'none' NOT NULL,
	"booking_partner_ref" varchar(255),
	"booking_affiliate_id" varchar(255),
	"booking_widget_url" text,
	"service_details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_ads" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"page_type" varchar(100) NOT NULL,
	"page_slug" varchar(255),
	"hero_banner" jsonb,
	"mpu_slots" jsonb,
	"link_list" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_sponsors" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"page_type" varchar(100) NOT NULL,
	"page_slug" varchar(255),
	"operator_id" integer,
	"display_name" varchar(255),
	"tagline" text,
	"cta_text" varchar(100),
	"cta_url" text,
	"exclude_other_ads" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"category" "post_category" NOT NULL,
	"hero_image" text,
	"author" varchar(100),
	"read_time_minutes" integer,
	"region_id" integer,
	"activity_type_id" integer,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"hero_image" text,
	"hero_credit" varchar(255),
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"status" "status" DEFAULT 'draft' NOT NULL,
	"completeness_score" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_slots" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"scope_type" varchar(50) NOT NULL,
	"scope_slug" varchar(255),
	"service_type" varchar(100) NOT NULL,
	"label" varchar(255),
	"description" text,
	"href" text,
	"operator_id" integer,
	"visible" boolean DEFAULT true,
	"featured" boolean DEFAULT false,
	"icon" varchar(50),
	"notes" text,
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" serial PRIMARY KEY NOT NULL,
	"domain" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"tagline" text,
	"logo_url" text,
	"primary_color" varchar(7),
	"accent_color" varchar(7),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sites_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "status_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_type" varchar(100) NOT NULL,
	"content_id" integer NOT NULL,
	"old_status" varchar(50),
	"new_status" varchar(50) NOT NULL,
	"changed_by" integer,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" "tag_type" NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transport" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"region_id" integer,
	"type" varchar(100),
	"name" varchar(255) NOT NULL,
	"route" text,
	"stops" text,
	"frequency" varchar(255),
	"season" varchar(255),
	"cost" varchar(100),
	"website" text,
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accommodation" ADD CONSTRAINT "accommodation_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accommodation" ADD CONSTRAINT "accommodation_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accommodation_tags" ADD CONSTRAINT "accommodation_tags_accommodation_id_accommodation_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accommodation_tags" ADD CONSTRAINT "accommodation_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_activity_type_id_activity_types_id_fk" FOREIGN KEY ("activity_type_id") REFERENCES "public"."activity_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_tags" ADD CONSTRAINT "activity_tags_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_tags" ADD CONSTRAINT "activity_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_types" ADD CONSTRAINT "activity_types_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_campaigns" ADD CONSTRAINT "ad_campaigns_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_campaigns" ADD CONSTRAINT "ad_campaigns_advertiser_id_advertisers_id_fk" FOREIGN KEY ("advertiser_id") REFERENCES "public"."advertisers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_creatives" ADD CONSTRAINT "ad_creatives_campaign_id_ad_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."ad_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_slots" ADD CONSTRAINT "ad_slots_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "advertisers" ADD CONSTRAINT "advertisers_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bulk_operations" ADD CONSTRAINT "bulk_operations_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bulk_operations" ADD CONSTRAINT "bulk_operations_admin_user_id_admin_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_rules" ADD CONSTRAINT "content_rules_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_page_spots" ADD CONSTRAINT "guide_page_spots_guide_page_id_guide_pages_id_fk" FOREIGN KEY ("guide_page_id") REFERENCES "public"."guide_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_page_spots" ADD CONSTRAINT "guide_page_spots_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_page_spots" ADD CONSTRAINT "guide_page_spots_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_pages" ADD CONSTRAINT "guide_pages_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_pages" ADD CONSTRAINT "guide_pages_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_pages" ADD CONSTRAINT "guide_pages_activity_type_id_activity_types_id_fk" FOREIGN KEY ("activity_type_id") REFERENCES "public"."activity_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_pages" ADD CONSTRAINT "guide_pages_sponsor_operator_id_operators_id_fk" FOREIGN KEY ("sponsor_operator_id") REFERENCES "public"."operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_itinerary_id_itineraries_id_fk" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_accommodation_id_accommodation_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_items" ADD CONSTRAINT "itinerary_items_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_stops" ADD CONSTRAINT "itinerary_stops_itinerary_id_itineraries_id_fk" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_stops" ADD CONSTRAINT "itinerary_stops_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_stops" ADD CONSTRAINT "itinerary_stops_accommodation_id_accommodation_id_fk" FOREIGN KEY ("accommodation_id") REFERENCES "public"."accommodation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_stops" ADD CONSTRAINT "itinerary_stops_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_stops" ADD CONSTRAINT "itinerary_stops_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_stops" ADD CONSTRAINT "itinerary_stops_wet_alt_activity_id_activities_id_fk" FOREIGN KEY ("wet_alt_activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_stops" ADD CONSTRAINT "itinerary_stops_budget_alt_activity_id_activities_id_fk" FOREIGN KEY ("budget_alt_activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_tags" ADD CONSTRAINT "itinerary_tags_itinerary_id_itineraries_id_fk" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_tags" ADD CONSTRAINT "itinerary_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_tags" ADD CONSTRAINT "location_tags_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_tags" ADD CONSTRAINT "location_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_offers" ADD CONSTRAINT "operator_offers_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operators" ADD CONSTRAINT "operators_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_ads" ADD CONSTRAINT "page_ads_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_sponsors" ADD CONSTRAINT "page_sponsors_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_sponsors" ADD CONSTRAINT "page_sponsors_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_activity_type_id_activity_types_id_fk" FOREIGN KEY ("activity_type_id") REFERENCES "public"."activity_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_slots" ADD CONSTRAINT "service_slots_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_slots" ADD CONSTRAINT "service_slots_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_changed_by_admin_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transport" ADD CONSTRAINT "transport_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transport" ADD CONSTRAINT "transport_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;