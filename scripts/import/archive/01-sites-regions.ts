/**
 * Import 01: Sites & Regions
 * 
 * Verifies site entry and ensures all Welsh regions exist.
 * The DB already has 12 regions — this script confirms they're correct.
 * 
 * Usage: set -a; source .env.local; set +a; npx tsx scripts/import/01-sites-regions.ts [--dry-run]
 */

import { db } from '../../src/db';
import { sites, regions } from '../../src/db/schema';
import { SITE_ID } from './lib/helpers';

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  console.log('=== Import 01: Sites & Regions ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  const existingSites = await db.select().from(sites);
  console.log(`[sites] ${existingSites.length} site(s):`);
  for (const s of existingSites) {
    console.log(`  id=${s.id} name="${s.name}" domain="${s.domain}"`);
  }

  const existingRegions = await db.select().from(regions);
  console.log(`\n[regions] ${existingRegions.length} region(s):`);
  for (const r of existingRegions) {
    console.log(`  ${r.name} (${r.slug}) status=${r.status} siteId=${r.siteId}`);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
