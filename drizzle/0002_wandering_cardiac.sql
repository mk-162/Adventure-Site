CREATE TABLE "magic_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"operator_id" integer,
	"purpose" varchar(50) DEFAULT 'login' NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "magic_links_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "operator_claims" (
	"id" serial PRIMARY KEY NOT NULL,
	"operator_id" integer NOT NULL,
	"claimant_name" varchar(255) NOT NULL,
	"claimant_email" varchar(255) NOT NULL,
	"claimant_role" varchar(100),
	"verification_method" varchar(50),
	"claim_status" varchar(50) DEFAULT 'pending' NOT NULL,
	"rejection_reason" text,
	"ip_address" varchar(45),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"verified_at" timestamp,
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "operator_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"operator_id" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"role" varchar(100),
	"last_login_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "stripe_customer_id" varchar(255);--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "billing_tier" varchar(50) DEFAULT 'free';--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "billing_email" varchar(255);--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "operators" ADD COLUMN "verified_by_email" varchar(255);--> statement-breakpoint
ALTER TABLE "magic_links" ADD CONSTRAINT "magic_links_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_claims" ADD CONSTRAINT "operator_claims_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_sessions" ADD CONSTRAINT "operator_sessions_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE no action ON UPDATE no action;