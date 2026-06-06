#!/usr/bin/env node
/** Import 05: Accommodation Sub-files (campsites, glamping, hostels)
 *
 * The main accommodation.csv (70 rows) is already in DB.
 * The sub-files under content/accommodation/ have different schema
 * and are NOT imported yet. This script handles:
 *   - accommodation/campsites.csv (58 rows)
 *   - accommodation/glamping.csv (31 rows)
 *   - accommodation/hostels.csv (40 rows)
 *
 * Usage: set -a; source .env.local; set +a; npx tsx scripts/import/05-accommodation.ts [--dry-run]
 */

import { db } from '../../src/db';
import { accommodation, regions as regionsTbl } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const SITE_ID = 1;
const DRY_RUN = process.argv.includes('--dry-run');
const CONTENT = join(process.cwd(), 'content');

// --- Minimal CSV parser ---
function parseCsv(text: string): Record<string, string>[] {
  const lines: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQ && text[i + 1] === '"') { cur += '"'; i++; }
      else { inQ = !inQ; }
    } else if (ch === '\n' && !inQ) {
      if (cur.trim()) lines.push(cur);
      cur = '';
    } else if (ch !== '\r') { cur += ch; }
  }
  if (cur.trim()) lines.push(cur);
  if (lines.length < 2) return [];
  const hdrs = splitLine(lines[0]);
  return lines.slice(1).map(line => {
    const vals = splitLine(line);
    const row: Record<string, string> = {};
    hdrs.forEach((h, idx) => { row[h] = vals[idx] ?? ''; });
    return row;
  });
}

function splitLine(line: string): string[] {
  const vals: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else { inQ = !inQ; }
    } else if (ch === ',' && !inQ) { vals.push(cur.trim()); cur = ''; }
    else { cur += ch; }
  }
  vals.push(cur.trim());
  return vals;
}

function readCsvRel(p: string): Record<string, string>[] {
  const full = join(CONTENT, p);
  if (!existsSync(full)) return [];
  return parseCsv(readFileSync(full, 'utf-8'));
}

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('=== Import 05: Accommodation Sub-files ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  // Lookup
  const regionRows = await db.select().from(regionsTbl);
  const regionBySlug = new Map<string, number>();
  for (const r of regionRows) regionBySlug.set(r.slug.toLowerCase(), r.id);

  const existing = await db.select({ slug: accommodation.slug }).from(accommodation);
  const existingSlugs = new Set(existing.map(a => a.slug));

  const toInsert: typeof accommodation.$inferInsert[] = [];
  let skipped = 0;

  const files = ['accommodation/campsites.csv', 'accommodation/glamping.csv', 'accommodation/hostels.csv'];

  for (const file of files) {
    const rows = readCsvRel(file);
    console.log(`[${file}] ${rows.length} rows`);

    for (const r of rows) {
      const name = r.name?.trim();
      if (!name) continue;

      // campsites/glamping/hostels have a slug field
      const slug = r.slug?.trim() || slugify(name);
      if (!slug || existingSlugs.has(slug)) { skipped++; continue; }
      existingSlugs.add(slug);

      const regionSlug = r.region?.trim().toLowerCase();
      const regionId = regionSlug ? regionBySlug.get(regionSlug) ?? null : null;

      const price = r.price_from?.trim();
      const priceNum = price ? parseFloat(price.replace(/[^0-9.]/g, '')) : NaN;

      let lat: string | null = null;
      let lng: string | null = null;
      if (r.lat) {
        const v = parseFloat(r.lat);
        if (!isNaN(v)) lat = v.toFixed(7);
      }
      if (r.lon || r.lng) {
        const v = parseFloat(r.lon || r.lng || '');
        if (!isNaN(v)) lng = v.toFixed(7);
      }

      // Map file to type
      let type: string | null = null;
      if (file.includes('campsite')) type = 'Campsite';
      else if (file.includes('glamping')) type = 'Glamping';
      else if (file.includes('hostel')) type = 'Hostel';

      toInsert.push({
        siteId: SITE_ID,
        name,
        slug,
        regionId,
        type,
        lat,
        lng,
        website: r.website?.trim() || null,
        address: r.address?.trim() || r.location?.trim() || null,
        priceFrom: isNaN(priceNum) ? null : priceNum.toString(),
        adventureFeatures: r.facilities?.trim() || null,
        description: r.description?.trim() || null,
        status: regionId ? 'published' : 'draft',
      });
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`To insert: ${toInsert.length}`);
  console.log(`Skipped (already in DB): ${skipped}`);

  if (DRY_RUN) {
    console.log('\nSample:');
    toInsert.slice(0, 5).forEach(a => {
      console.log(`  → ${a.name} (${a.slug}) type=${a.type} region=${a.regionId}`);
    });
    if (toInsert.length > 5) console.log(`  ... and ${toInsert.length - 5} more`);
  } else if (toInsert.length > 0) {
    for (let i = 0; i < toInsert.length; i += 50) {
      await db.insert(accommodation).values(toInsert.slice(i, i + 50));
      console.log(`  Inserted ${Math.min(i + 50, toInsert.length)}/${toInsert.length}`);
    }
    console.log('✅ Done.');
  } else {
    console.log('\n✅ Nothing to insert.');
  }
}

main().catch(err => { console.error('Error:', err); process.exit(1); });
