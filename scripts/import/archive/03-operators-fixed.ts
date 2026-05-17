#!/usr/bin/env node
/** Import 03 (fixed): Operators
 *
 * Uses csv-parse/sync for proper RFC 4180 handling (multi-line quoted fields, etc.)
 * Inserts one row at a time so bad rows don't kill the whole batch.
 *
 * Usage: set -a; source .env.local; set +a; npx tsx scripts/import/03-operators-fixed.ts [--dry-run]
 */

import { db } from '../../src/db';
import { operators, regions as regionsTbl, activityTypes as activityTypesTbl } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';

const SITE_ID = 1;
const DRY_RUN = process.argv.includes('--dry-run');
const CONTENT = join(process.cwd(), 'content');

function readCsvFile(relPath: string): Record<string, string>[] {
  const full = join(CONTENT, relPath);
  if (!existsSync(full)) {
    console.error(`  ⚠ File not found: ${full}`);
    return [];
  }
  const text = readFileSync(full, 'utf-8');
  try {
    return parse(text, {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
      trim: true,
    });
  } catch (err) {
    console.error(`  ⚠ CSV parse error for ${relPath}:`, err);
    return [];
  }
}

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function parseBool(val: string | undefined): boolean | null {
  if (!val) return null;
  const l = val.toLowerCase().trim();
  if (['true', 'yes', '1'].includes(l)) return true;
  if (['false', 'no', '0'].includes(l)) return false;
  return null;
}

function safeFloat(v: string | undefined): string | null {
  if (!v) return null;
  const n = parseFloat(v.replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? null : n.toFixed(7);
}

async function main() {
  console.log('=== Import 03: Operators (fixed) ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  // Lookups
  const regionRows = await db.select().from(regionsTbl);
  const regionByName = new Map<string, number>();
  for (const r of regionRows) {
    regionByName.set(r.name.toLowerCase(), r.id);
    regionByName.set(r.slug.toLowerCase(), r.id);
  }

  const existingOps = await db.select({ slug: operators.slug }).from(operators).where(eq(operators.siteId, SITE_ID));
  const opSlugs = new Set(existingOps.map(o => o.slug));

  const toInsert: any[] = [];
  let skipped = 0;

  // --- 1. Sub-CSVs (clean single-line data) ---
  const subFiles = ['operators/climbing.csv', 'operators/coasteering.csv', 'operators/hire.csv', 'operators/kayak.csv', 'operators/mtb.csv', 'operators/walking.csv'];

  for (const file of subFiles) {
    const rows = readCsvFile(file);
    console.log(`[${file}] ${rows.length} rows`);
    for (const r of rows) {
      const name = (r.name as string)?.trim();
      if (!name) continue;
      const slug = (r.slug as string)?.trim() || slugify(name);
      if (!slug || opSlugs.has(slug)) { skipped++; continue; }
      opSlugs.add(slug);

      const regionStr = (r.regions as string)?.trim();
      const regionSlugs = regionStr ? regionStr.split(',').map(s => slugify(s.trim())).filter(Boolean) : [];

      toInsert.push({
        siteId: SITE_ID, name, slug,
        website: (r.website as string)?.trim() || null,
        email: (r.email as string)?.trim() || null,
        phone: (r.phone as string)?.trim() || null,
        address: (r.address as string)?.trim() || null,
        lat: safeFloat(r.lat as string),
        lng: safeFloat(r.lng as string || r.lon as string),
        description: (r.description as string)?.trim() || null,
        category: (r.category as string)?.trim() ? (r.category.trim() as any) : null,
        serviceTypes: (r.service_types as string)?.trim()
          ? (r.service_types as string).split(',').map(s => s.trim()).filter(Boolean)
          : null,
        regions: regionSlugs.length > 0 ? regionSlugs : null,
        groupFriendly: parseBool(r.group_friendly as string),
        claimStatus: 'stub',
        dataSource: 'csv',
      });
    }
  }

  // --- 2. Surf CSV (has multi-line quoted fields — csv-parse handles this) ---
  const surf = readCsvFile('operators/surf.csv');
  console.log(`\n[operators/surf.csv] ${surf.length} rows`);
  for (const r of surf) {
    const name = (r.name as string)?.trim();
    if (!name) continue;
    const slug = (r.slug as string)?.trim() || slugify(name);
    if (!slug || opSlugs.has(slug)) continue;
    opSlugs.add(slug);

    const regionStr = (r.region as string)?.trim();
    const regionSlugs = regionStr ? regionStr.split(',').map(s => slugify(s.trim())).filter(Boolean) : [];
    const activitiesStr = (r.activities as string)?.trim();
    const activitySlugs = activitiesStr ? activitiesStr.split(',').map(s => slugify(s.trim())).filter(Boolean) : [];

    toInsert.push({
      siteId: SITE_ID, name, slug,
      website: (r.website as string)?.trim() || null,
      email: (r.email as string)?.trim() || null,
      phone: (r.phone as string)?.trim() || null,
      address: (r.address as string)?.trim() || null,
      lat: safeFloat(r.lat as string),
      lng: safeFloat(r.lon as string),
      description: (r.description as string)?.trim() || null,
      category: 'activity_provider',
      activityTypes: activitySlugs.length > 0 ? activitySlugs : null,
      regions: regionSlugs.length > 0 ? regionSlugs : null,
      claimStatus: 'stub',
      dataSource: 'csv',
    });
  }

  // --- 3. Main operators.csv (overlaps with sub-CSVs) ---
  const mainOps = readCsvFile('operators.csv');
  console.log(`\n[operators.csv] ${mainOps.length} rows`);
  for (const r of mainOps) {
    const name = (r['Business Name'] as string)?.trim();
    if (!name) continue;
    const slug = slugify(name);
    if (opSlugs.has(slug)) { skipped++; continue; }
    opSlugs.add(slug);

    const activityStr = (r['Activities Offered'] as string)?.trim();
    const activitySlugs = activityStr ? activityStr.split(',').map(s => slugify(s.trim())).filter(Boolean) : [];
    const regionStr = (r['Regions Covered'] as string)?.trim();
    const regionSlugs = regionStr ? regionStr.split(',').map(s => slugify(s.trim())).filter(Boolean) : [];

    // Parse google rating — must be numeric
    const ratingStr = (r['Google Rating'] as string)?.trim();
    let googleRating: string | null = null;
    if (ratingStr) {
      const m = ratingStr.match(/(\d+\.?\d*)/);
      if (m) {
        const n = parseFloat(m[1]);
        if (n >= 0 && n <= 5) googleRating = n.toFixed(1);
      }
    }

    // Parse trust_signals (JSON, may not be valid)
    let trustSignals: any = null;
    const tsStr = (r.trust_signals as string)?.trim();
    if (tsStr) {
      try { trustSignals = JSON.parse(tsStr); } catch { trustSignals = null; }
    }

    toInsert.push({
      siteId: SITE_ID, name, slug,
      website: (r.Website as string)?.trim() || null,
      email: (r['Contact Email'] as string)?.trim() || null,
      phone: (r.Phone as string)?.trim() || null,
      address: (r['Physical Address'] as string)?.trim() || null,
      description: (r.description as string)?.trim() || (r.Description as string)?.trim() || null,
      tagline: (r.tagline as string)?.trim() || null,
      googleRating,
      tripadvisorUrl: (r['TripAdvisor URL'] as string)?.trim() || null,
      priceRange: (r['Price Range'] as string)?.trim() || null,
      uniqueSellingPoint: (r['Unique Selling Point'] as string)?.trim()
        || (r.unique_selling_point as string)?.trim() || null,
      trustSignals,
      logoUrl: (r.logo_url as string)?.trim() || null,
      activityTypes: activitySlugs.length > 0 ? activitySlugs : null,
      regions: regionSlugs.length > 0 ? regionSlugs : null,
      claimStatus: 'stub',
      dataSource: 'csv',
    });
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total to insert: ${toInsert.length}`);
  console.log(`Skipped (duplicate): ${skipped}`);
  console.log(`Already in DB: ${existingOps.length}`);

  if (DRY_RUN) {
    console.log('\nDry run — no DB writes.');
    for (const op of toInsert.slice(0, 5)) {
      console.log(`  → ${op.name} (${op.slug}) category=${op.category}`);
    }
    if (toInsert.length > 5) console.log(`  ... and ${toInsert.length - 5} more`);
  } else if (toInsert.length > 0) {
    console.log('\nInserting (one at a time, with error handling)...');
    let inserted = 0;
    let failed = 0;
    for (let i = 0; i < toInsert.length; i++) {
      try {
        await db.insert(operators).values(toInsert[i]);
        inserted++;
        if (inserted % 10 === 0) console.log(`  ${inserted}/${toInsert.length}`);
      } catch (err: any) {
        failed++;
        const row = toInsert[i];
        const msg = err?.cause?.message || err?.message || String(err);
        const short = msg.length > 150 ? msg.substring(0, 150) + '…' : msg;
        console.error(`  ⚠ Failed: ${row?.name || '?'} (${row?.slug || '?'})  ${short}`);
      }
    }
    console.log(`\n✅ Done. Inserted ${inserted}, Failed ${failed}.`);
  } else {
    console.log('\n✅ Nothing to insert.');
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
