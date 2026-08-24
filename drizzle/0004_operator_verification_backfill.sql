-- Backfill verification_level for existing operators with verified_at IS NOT NULL.
-- Operators marked as verified receive human_verified status.
-- All other records retain their default unverified state.
UPDATE "operators"
SET "verification_level" = 'human_verified'
WHERE "verified_at" IS NOT NULL
  AND "verification_level" = 'unverified';
