#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const batchPath = process.argv.find((arg) => arg.endsWith('.json')) || 'content/ops/operator-enrichment-batches/2026-06-06-critical-operator-trust-breakers-01.json';
const batch = JSON.parse(readFileSync(batchPath, 'utf8'));

const rows = batch.operators.filter((op) => op.decision !== 'blocked_unverified' && op.fields && Object.keys(op.fields).length > 0);

console.log(`Batch: ${batch.batch_id}`);
console.log(`Operators with safe fields: ${rows.length}`);
for (const op of rows) {
  const aliases = [op.slug, ...(op.aliases || [])];
  const fields = Object.keys(op.fields).filter((key) => op.fields[key] !== null && op.fields[key] !== undefined);
  console.log(`- ${op.name} [${aliases.join(', ')}]: ${fields.join(', ')}`);
}

if (dryRun) {
  console.log('Dry run only; no database writes.');
  process.exit(0);
}

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL or POSTGRES_URL not set. Re-run with one of those env vars to apply this batch.');
  process.exit(1);
}

const sql = neon(databaseUrl);
let updated = 0;
for (const op of rows) {
  const aliases = [op.slug, ...(op.aliases || [])];
  const f = op.fields;
  for (const slug of aliases) {
    const result = await sql`
      UPDATE operators
      SET
        website = COALESCE(${f.website ?? null}, website),
        phone = COALESCE(${f.phone ?? null}, phone),
        email = COALESCE(${f.email ?? null}, email),
        address = COALESCE(${f.address ?? null}, address),
        lat = COALESCE(${f.lat ?? null}, lat),
        lng = COALESCE(${f.lng ?? null}, lng),
        description = COALESCE(${f.description ?? null}, description),
        logo_url = COALESCE(${f.logoUrl ?? null}, logo_url),
        cover_image = COALESCE(${f.coverImage ?? null}, cover_image),
        google_rating = COALESCE(${f.googleRating ?? null}, google_rating),
        review_count = COALESCE(${f.reviewCount ?? null}, review_count),
        data_source = 'research',
        last_verified_at = NOW(),
        admin_notes = CONCAT(
          COALESCE(admin_notes, ''),
          '\n',
          ${`Ops batch ${batch.batch_id}: ${op.decision}. Evidence: ${op.evidence.join(' | ')}`}::text
        )
      WHERE slug = ${slug}
      RETURNING slug
    `;
    if (result.length) {
      console.log(`Updated ${op.name}: ${result.map((r) => r.slug).join(', ')}`);
      updated += result.length;
    }
  }
}
console.log(`Done. Updated ${updated} operator rows.`);
