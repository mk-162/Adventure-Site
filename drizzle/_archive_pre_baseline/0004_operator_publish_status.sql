-- Operator publish gate: add status column mirroring every other content type.
-- Defaults to 'draft' so all existing operators go dark until deliberately
-- promoted to 'published' after accuracy verification.
--
-- NOTE: the drizzle snapshot had drifted from the live DB (prior `db:push`
-- usage), so `drizzle-kit generate` proposed recreating already-existing
-- objects. This file is hand-trimmed to the single real delta and uses
-- IF NOT EXISTS so it is safe to run against the drifted database.
ALTER TABLE "operators" ADD COLUMN IF NOT EXISTS "status" "status" DEFAULT 'draft' NOT NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "operators_status_idx" ON "operators" USING btree ("status");
