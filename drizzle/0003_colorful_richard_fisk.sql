ALTER TYPE "public"."post_category" ADD VALUE 'opinion';--> statement-breakpoint
CREATE TABLE "advertiser_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"primary_email" varchar(255),
	"primary_phone" varchar(50),
	"contact_name" varchar(255),
	"billing_email" varchar(255),
	"billing_custom_amount" numeric(10, 2),
	"billing_notes" text,
	"stripe_customer_id" varchar(255),
	"admin_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_saves" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"source" varchar(50) DEFAULT 'homepage',
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "outreach_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"subject" varchar(255),
	"body_template" text,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"sent_count" integer DEFAULT 0,
	"opened_count" integer DEFAULT 0,
	"clicked_count" integer DEFAULT 0,
	"claimed_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"sent_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "outreach_recipients" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer NOT NULL,
	"operator_id" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"sent_at" timestamp,
	"opened_at" timestamp,
	"clicked_at" timestamp,
	"claimed_at" timestamp,
	CONSTRAINT "outreach_unique_recipient" UNIQUE("campaign_id","operator_id")
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"page_type" varchar(50) NOT NULL,
	"page_slug" varchar(255) NOT NULL,
	"operator_id" integer,
	"view_date" date NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"unique_visitors" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "page_views_unique" UNIQUE("site_id","page_type","page_slug","view_date")
);
--> statement-breakpoint
CREATE TABLE "user_favourites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"favourite_type" varchar(50) NOT NULL,
	"favourite_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"region_preference" varchar(100),
	"newsletter_opt_in" boolean DEFAULT false,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "hero_image" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "image_gallery" jsonb;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "category" varchar(100);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "tags" text[];--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "is_recurring" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "recurring_schedule" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "is_featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "is_promoted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "promoted_until" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "operator_id" integer;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "external_source" varchar(100);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "external_id" varchar(255);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "external_url" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "ticket_url" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "difficulty" varchar(50);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "age_range" varchar(100);--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "account_id" integer;--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "data_source" varchar(50) DEFAULT 'manual';--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "last_verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "google_place_id" varchar(255);--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "stripe_subscription_id" varchar(255);--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "stripe_subscription_status" varchar(50);--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "billing_period_end" timestamp;--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "billing_custom_amount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "billing_notes" text;--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "admin_notes" text;--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "trial_tier" varchar(50);--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "trial_started_at" timestamp;--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "trial_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "trial_converted_at" timestamp;--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "trial_source" varchar(100);--> statement-breakpoint
ALTER TABLE "event_saves" ADD CONSTRAINT "event_saves_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outreach_campaigns" ADD CONSTRAINT "outreach_campaigns_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outreach_recipients" ADD CONSTRAINT "outreach_recipients_campaign_id_outreach_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."outreach_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outreach_recipients" ADD CONSTRAINT "outreach_recipients_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favourites" ADD CONSTRAINT "user_favourites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_saves_event_id_idx" ON "event_saves" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_saves_session_id_idx" ON "event_saves" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "outreach_recipients_campaign_id_idx" ON "outreach_recipients" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "outreach_recipients_operator_id_idx" ON "outreach_recipients" USING btree ("operator_id");--> statement-breakpoint
CREATE INDEX "page_views_operator_id_idx" ON "page_views" USING btree ("operator_id");--> statement-breakpoint
CREATE INDEX "page_views_page_slug_idx" ON "page_views" USING btree ("page_slug");--> statement-breakpoint
CREATE INDEX "page_views_date_idx" ON "page_views" USING btree ("view_date");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operators" ADD CONSTRAINT "operators_account_id_advertiser_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."advertiser_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accommodation_site_id_idx" ON "accommodation" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "accommodation_region_id_idx" ON "accommodation" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "accommodation_slug_idx" ON "accommodation" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "accommodation_status_idx" ON "accommodation" USING btree ("status");--> statement-breakpoint
CREATE INDEX "accommodation_tags_accommodation_id_idx" ON "accommodation_tags" USING btree ("accommodation_id");--> statement-breakpoint
CREATE INDEX "accommodation_tags_tag_id_idx" ON "accommodation_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "activities_site_id_idx" ON "activities" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "activities_region_id_idx" ON "activities" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "activities_operator_id_idx" ON "activities" USING btree ("operator_id");--> statement-breakpoint
CREATE INDEX "activities_activity_type_id_idx" ON "activities" USING btree ("activity_type_id");--> statement-breakpoint
CREATE INDEX "activities_slug_idx" ON "activities" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "activities_status_idx" ON "activities" USING btree ("status");--> statement-breakpoint
CREATE INDEX "activity_regions_activity_id_idx" ON "activity_regions" USING btree ("activity_id");--> statement-breakpoint
CREATE INDEX "activity_regions_region_id_idx" ON "activity_regions" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "activity_tags_activity_id_idx" ON "activity_tags" USING btree ("activity_id");--> statement-breakpoint
CREATE INDEX "activity_tags_tag_id_idx" ON "activity_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "activity_types_site_id_idx" ON "activity_types" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "activity_types_slug_idx" ON "activity_types" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "ad_campaigns_site_id_idx" ON "ad_campaigns" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "ad_campaigns_advertiser_id_idx" ON "ad_campaigns" USING btree ("advertiser_id");--> statement-breakpoint
CREATE INDEX "ad_creatives_campaign_id_idx" ON "ad_creatives" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "advertisers_site_id_idx" ON "advertisers" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "answers_site_id_idx" ON "answers" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "answers_region_id_idx" ON "answers" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "answers_slug_idx" ON "answers" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "answers_status_idx" ON "answers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "events_site_id_idx" ON "events" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "events_region_id_idx" ON "events" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "events_operator_id_idx" ON "events" USING btree ("operator_id");--> statement-breakpoint
CREATE INDEX "events_slug_idx" ON "events" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "events_status_idx" ON "events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "events_date_start_idx" ON "events" USING btree ("date_start");--> statement-breakpoint
CREATE INDEX "guide_page_spots_guide_page_id_idx" ON "guide_page_spots" USING btree ("guide_page_id");--> statement-breakpoint
CREATE INDEX "guide_page_spots_operator_id_idx" ON "guide_page_spots" USING btree ("operator_id");--> statement-breakpoint
CREATE INDEX "guide_page_spots_activity_id_idx" ON "guide_page_spots" USING btree ("activity_id");--> statement-breakpoint
CREATE INDEX "guide_pages_site_id_idx" ON "guide_pages" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "guide_pages_region_id_idx" ON "guide_pages" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "guide_pages_activity_type_id_idx" ON "guide_pages" USING btree ("activity_type_id");--> statement-breakpoint
CREATE INDEX "guide_pages_slug_idx" ON "guide_pages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "guide_pages_url_path_idx" ON "guide_pages" USING btree ("url_path");--> statement-breakpoint
CREATE INDEX "guide_pages_content_status_idx" ON "guide_pages" USING btree ("content_status");--> statement-breakpoint
CREATE INDEX "itineraries_site_id_idx" ON "itineraries" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "itineraries_region_id_idx" ON "itineraries" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "itineraries_slug_idx" ON "itineraries" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "itineraries_status_idx" ON "itineraries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "itinerary_items_itinerary_id_idx" ON "itinerary_items" USING btree ("itinerary_id");--> statement-breakpoint
CREATE INDEX "itinerary_items_activity_id_idx" ON "itinerary_items" USING btree ("activity_id");--> statement-breakpoint
CREATE INDEX "itinerary_items_accommodation_id_idx" ON "itinerary_items" USING btree ("accommodation_id");--> statement-breakpoint
CREATE INDEX "itinerary_items_location_id_idx" ON "itinerary_items" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "itinerary_stops_itinerary_id_idx" ON "itinerary_stops" USING btree ("itinerary_id");--> statement-breakpoint
CREATE INDEX "itinerary_stops_activity_id_idx" ON "itinerary_stops" USING btree ("activity_id");--> statement-breakpoint
CREATE INDEX "itinerary_stops_accommodation_id_idx" ON "itinerary_stops" USING btree ("accommodation_id");--> statement-breakpoint
CREATE INDEX "itinerary_stops_location_id_idx" ON "itinerary_stops" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "itinerary_stops_operator_id_idx" ON "itinerary_stops" USING btree ("operator_id");--> statement-breakpoint
CREATE INDEX "itinerary_stops_day_order_idx" ON "itinerary_stops" USING btree ("day_number","order_index");--> statement-breakpoint
CREATE INDEX "itinerary_tags_itinerary_id_idx" ON "itinerary_tags" USING btree ("itinerary_id");--> statement-breakpoint
CREATE INDEX "itinerary_tags_tag_id_idx" ON "itinerary_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "location_tags_location_id_idx" ON "location_tags" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "location_tags_tag_id_idx" ON "location_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "locations_site_id_idx" ON "locations" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "locations_region_id_idx" ON "locations" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "locations_slug_idx" ON "locations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "locations_status_idx" ON "locations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "magic_links_email_idx" ON "magic_links" USING btree ("email");--> statement-breakpoint
CREATE INDEX "magic_links_token_idx" ON "magic_links" USING btree ("token");--> statement-breakpoint
CREATE INDEX "magic_links_operator_id_idx" ON "magic_links" USING btree ("operator_id");--> statement-breakpoint
CREATE INDEX "operator_claims_operator_id_idx" ON "operator_claims" USING btree ("operator_id");--> statement-breakpoint
CREATE INDEX "operator_claims_status_idx" ON "operator_claims" USING btree ("claim_status");--> statement-breakpoint
CREATE INDEX "operator_offers_operator_id_idx" ON "operator_offers" USING btree ("operator_id");--> statement-breakpoint
CREATE INDEX "operator_sessions_operator_id_idx" ON "operator_sessions" USING btree ("operator_id");--> statement-breakpoint
CREATE INDEX "operator_sessions_email_idx" ON "operator_sessions" USING btree ("email");--> statement-breakpoint
CREATE INDEX "operators_site_id_idx" ON "operators" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "operators_account_id_idx" ON "operators" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "operators_slug_idx" ON "operators" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "operators_claim_status_idx" ON "operators" USING btree ("claim_status");--> statement-breakpoint
CREATE INDEX "operators_category_idx" ON "operators" USING btree ("category");--> statement-breakpoint
CREATE INDEX "post_tags_post_id_idx" ON "post_tags" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_tags_tag_id_idx" ON "post_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "posts_site_id_idx" ON "posts" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category");--> statement-breakpoint
CREATE INDEX "posts_region_id_idx" ON "posts" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "posts_activity_type_id_idx" ON "posts" USING btree ("activity_type_id");--> statement-breakpoint
CREATE INDEX "posts_status_idx" ON "posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "regions_site_id_idx" ON "regions" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "regions_slug_idx" ON "regions" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "regions_status_idx" ON "regions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tags_site_id_idx" ON "tags" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tags_type_idx" ON "tags" USING btree ("type");--> statement-breakpoint
CREATE INDEX "transport_site_id_idx" ON "transport" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "transport_region_id_idx" ON "transport" USING btree ("region_id");