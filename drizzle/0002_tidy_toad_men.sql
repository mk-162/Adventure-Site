CREATE TYPE "public"."content_review_status" AS ENUM('discovered', 'triaged', 'research_needed', 'researched', 'generated', 'qa_needed', 'reviewed', 'signed_off', 'published', 'refresh_due', 'blocked', 'archived');--> statement-breakpoint
CREATE TYPE "public"."evidence_source_type" AS ENUM('csv_seed', 'operator_website', 'operator_confirmed', 'google_places', 'official_tourism_board', 'manual_research', 'other');--> statement-breakpoint
CREATE TYPE "public"."evidence_verdict" AS ENUM('unverified', 'verified', 'disputed', 'needs_recheck', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."ops_decision" AS ENUM('strategic_anchor', 'premium_sales_lure', 'claimed_basic', 'stub_only', 'remove_or_block', 'needs_human_permission');--> statement-breakpoint
CREATE TYPE "public"."verification_level" AS ENUM('unverified', 'csv_seed', 'self_reported', 'human_verified', 'disputed');--> statement-breakpoint
CREATE TABLE "content_review_state" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_item_id" varchar(255) NOT NULL,
	"status" "content_review_status" DEFAULT 'discovered' NOT NULL,
	"reviewed_by_email" varchar(255),
	"reviewed_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_review_state_content_item_id_unique" UNIQUE("content_item_id")
);
--> statement-breakpoint
CREATE TABLE "email_suppression" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"reason" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "email_suppression_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "listing_evidence" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" varchar(255) NOT NULL,
	"field" varchar(100) NOT NULL,
	"value" text,
	"source_url" text,
	"source_type" "evidence_source_type" NOT NULL,
	"verifier_email" varchar(255),
	"verified_at" timestamp,
	"recheck_due_at" timestamp,
	"verdict" "evidence_verdict" DEFAULT 'unverified' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ops_decisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_item_id" varchar(255) NOT NULL,
	"title" varchar(255),
	"route_or_slug" varchar(255),
	"decision" "ops_decision" NOT NULL,
	"decided_by_email" varchar(255) NOT NULL,
	"decided_at" timestamp DEFAULT now() NOT NULL,
	"rationale" text,
	"next_action" text,
	"evidence_snapshot" jsonb,
	"guardrails" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "operator_interest" ADD COLUMN "status" varchar(50) DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE "operator_interest" ADD COLUMN "handled_by_email" varchar(255);--> statement-breakpoint
ALTER TABLE "operator_interest" ADD COLUMN "handled_at" timestamp;--> statement-breakpoint
ALTER TABLE "operator_interest" ADD COLUMN "next_action" text;--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "verification_level" "verification_level" DEFAULT 'unverified' NOT NULL;--> statement-breakpoint
CREATE INDEX "content_review_state_status_idx" ON "content_review_state" USING btree ("status");--> statement-breakpoint
CREATE INDEX "listing_evidence_entity_idx" ON "listing_evidence" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "listing_evidence_entity_field_idx" ON "listing_evidence" USING btree ("entity_type","entity_id","field");--> statement-breakpoint
CREATE INDEX "listing_evidence_verdict_idx" ON "listing_evidence" USING btree ("verdict");--> statement-breakpoint
CREATE INDEX "ops_decisions_content_item_id_idx" ON "ops_decisions" USING btree ("content_item_id");--> statement-breakpoint
CREATE INDEX "operator_interest_status_idx" ON "operator_interest" USING btree ("status");--> statement-breakpoint
CREATE INDEX "operators_verification_level_idx" ON "operators" USING btree ("verification_level");