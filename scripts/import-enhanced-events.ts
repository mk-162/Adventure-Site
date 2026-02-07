#!/usr/bin/env npx tsx
/**
 * Import enhanced events to database
 * Reads JSON files from data/events/enhanced/ and upserts to events table
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { db } from '../src/db';
import { events, regions, sites } from '../src/db/schema';
import { eq, and } from 'drizzle-orm';

const ENHANCED_DIR = join(__dirname, '../data/events/enhanced');

interface EnhancedEvent {
  slug: string;
  name: string;
  description?: string;
  category?: string;
  type?: string;
  website?: string;
  social?: { website?: string };
  entry?: { registration_url?: string };
  location?: {
    town?: string;
    venue?: string;
    region?: string;
    coordinates?: { lat: number; lng: number };
    start?: { coordinates?: { lat: number; lng: number } };
  };
  coordinates?: { lat: number; lng: number };
  heroImage?: { url: string; alt?: string; source?: string; credit?: string };
  photos?: Array<{ url: string; alt?: string; source?: string }>;
  dates?: {
    start?: string;
    end?: string;
    year?: number;
    date?: string;
    season2026?: string;
    typical?: string;
    recurring?: string;
  };
  dates2026?: { start?: string; end?: string };
  date?: string;
  year?: number;
  isRecurring?: boolean;
  recurringSchedule?: string;
  highlights?: string[];
  tags?: string[];
  difficulty?: { label?: string };
  entry?: { type?: string; notes?: string; fee?: any };
  [key: string]: any;
}

// Region slug to ID mapping (will be populated at runtime)
const regionMap: Record<string, number> = {};

function getCoordinates(data: EnhancedEvent): { lat: number | null; lng: number | null } {
  const coords = 
    data.location?.coordinates ||
    data.location?.start?.coordinates ||
    data.coordinates;
  
  return {
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null
  };
}

function getWebsite(data: EnhancedEvent): string | null {
  return data.website || 
         data.social?.website || 
         data.entry?.registration_url || 
         null;
}

function getHeroImage(data: EnhancedEvent): string | null {
  return data.heroImage?.url || 
         data.photos?.[0]?.url || 
         null;
}

function getDateStart(data: EnhancedEvent): Date | null {
  const dateStr = 
    data.date ||
    data.dates?.start ||
    data.dates2026?.start ||
    data.dates?.date;
  
  if (dateStr && dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
    return new Date(dateStr);
  }
  return null;
}

function getDateEnd(data: EnhancedEvent): Date | null {
  const dateStr = 
    data.dates?.end ||
    data.dates2026?.end;
  
  if (dateStr && dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
    return new Date(dateStr);
  }
  return null;
}

function getTypicalMonth(data: EnhancedEvent): string | null {
  return data.dates?.typical || 
         data.dates?.recurring || 
         data.recurringSchedule ||
         null;
}

function getLocationText(data: EnhancedEvent): string | null {
  const parts = [
    data.location?.venue,
    data.location?.town,
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(', ') : null;
}

function mapRegionSlug(regionSlug: string | undefined): number | null {
  if (!regionSlug) return null;
  
  // Normalize region slugs
  const normalized = regionSlug.toLowerCase()
    .replace(/\s+/g, '-')
    .replace('brecon-beacons', 'brecon-beacons')
    .replace('south-wales', 'south-wales')
    .replace('north-wales', 'north-wales')
    .replace('mid-wales', 'mid-wales')
    .replace('pembrokeshire', 'pembrokeshire')
    .replace('snowdonia', 'snowdonia');
  
  return regionMap[normalized] || null;
}

async function loadRegions(siteId: number) {
  const allRegions = await db.select()
    .from(regions)
    .where(eq(regions.siteId, siteId));
  
  for (const region of allRegions) {
    regionMap[region.slug] = region.id;
  }
  
  console.log(`📍 Loaded ${allRegions.length} regions`);
}

async function importEvent(data: EnhancedEvent, siteId: number): Promise<{ action: 'inserted' | 'updated' | 'skipped'; slug: string }> {
  const coords = getCoordinates(data);
  const regionSlug = data.location?.region || data.region;
  
  const eventData = {
    siteId,
    regionId: mapRegionSlug(regionSlug),
    name: data.name,
    slug: data.slug,
    type: data.type || data.category,
    description: data.description,
    dateStart: getDateStart(data),
    dateEnd: getDateEnd(data),
    monthTypical: getTypicalMonth(data),
    location: getLocationText(data),
    lat: coords.lat?.toString() || null,
    lng: coords.lng?.toString() || null,
    website: getWebsite(data),
    heroImage: getHeroImage(data),
    category: data.category,
    isRecurring: data.isRecurring ?? (data.recurringSchedule ? true : false),
    recurringSchedule: data.recurringSchedule || data.dates?.recurring,
    difficulty: data.difficulty?.label,
    externalSource: 'enhanced-import',
    status: 'published' as const,
  };
  
  // Check if event exists
  const existing = await db.select({ id: events.id })
    .from(events)
    .where(and(
      eq(events.siteId, siteId),
      eq(events.slug, data.slug)
    ))
    .limit(1);
  
  if (existing.length > 0) {
    // Update existing
    await db.update(events)
      .set({
        ...eventData,
        // Don't overwrite these if they exist
        regionId: eventData.regionId || undefined,
      })
      .where(eq(events.id, existing[0].id));
    
    return { action: 'updated', slug: data.slug };
  } else {
    // Insert new
    await db.insert(events).values(eventData);
    return { action: 'inserted', slug: data.slug };
  }
}

async function main() {
  // Get the Adventure Wales site ID
  const site = await db.select()
    .from(sites)
    .where(eq(sites.domain, 'adventure.wales'))
    .limit(1);
  
  if (site.length === 0) {
    console.error('❌ Site adventure.wales not found in database');
    process.exit(1);
  }
  
  const siteId = site[0].id;
  console.log(`🌐 Using site: ${site[0].name} (ID: ${siteId})`);
  
  // Load regions
  await loadRegions(siteId);
  
  // Read all enhanced event files
  const files = await readdir(ENHANCED_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  
  console.log(`\n📦 Importing ${jsonFiles.length} enhanced events...\n`);
  
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const file of jsonFiles) {
    try {
      const content = await readFile(join(ENHANCED_DIR, file), 'utf-8');
      const data = JSON.parse(content) as EnhancedEvent;
      
      const result = await importEvent(data, siteId);
      
      switch (result.action) {
        case 'inserted':
          console.log(`  ➕ ${result.slug}`);
          inserted++;
          break;
        case 'updated':
          console.log(`  🔄 ${result.slug}`);
          updated++;
          break;
        case 'skipped':
          skipped++;
          break;
      }
    } catch (err) {
      console.error(`  ❌ ${file}: ${err}`);
      errors++;
    }
  }
  
  console.log(`\n📊 Import Summary:`);
  console.log(`   ➕ Inserted: ${inserted}`);
  console.log(`   🔄 Updated: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  
  process.exit(errors > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
