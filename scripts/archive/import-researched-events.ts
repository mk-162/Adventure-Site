/**
 * Import researched events from data/research/events-*.json into the database
 * Handles deduplication by slug and merges data from multiple sources
 */

import { db } from '../src/db';
import { events, regions } from '../src/db/schema';
import { eq, and } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

const RESEARCH_DIR = path.join(process.cwd(), 'data/research');
const SITE_ID = 1; // Adventure Wales

interface ResearchedEvent {
  name: string;
  slug?: string;
  type?: string;
  category?: string;
  date?: string;
  dateStart?: string;
  dateEnd?: string;
  monthTypical?: string;
  location?: string;
  region?: string;
  regionSlug?: string;
  lat?: number;
  lng?: number;
  website?: string;
  ticketUrl?: string;
  registrationCost?: string | number;
  capacity?: number;
  description?: string;
  heroImage?: string;
  status?: string;
  confidence?: string;
  difficulty?: string;
  ageRange?: string;
  isRecurring?: boolean;
  tags?: string[];
}

// Generate slug from name if not provided
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 255);
}

// Parse registration cost to number
function parseRegistrationCost(cost: string | number | undefined): number | null {
  if (cost === undefined || cost === null) return null;
  if (typeof cost === 'number') return cost;
  const match = cost.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

// Parse date string to Date object
function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  try {
    // Skip unparseable formats
    if (dateStr.includes('TBC') || dateStr.includes('Half Term') || dateStr.includes('Various')) {
      return null;
    }
    // Handle ISO dates
    if (dateStr.includes('T')) {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? null : d;
    }
    // Handle "19-20 September 2026" format
    const match = dateStr.match(/(\d+)(?:-\d+)?\s+(\w+)\s+(\d{4})/);
    if (match) {
      const [, day, month, year] = match;
      const months: Record<string, number> = {
        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
      };
      if (months[month] !== undefined) {
        return new Date(parseInt(year), months[month], parseInt(day));
      }
    }
    // Handle "Month YYYY" format (e.g., "July 2026")
    const monthYear = dateStr.match(/(\w+)\s+(\d{4})/);
    if (monthYear) {
      const [, month, year] = monthYear;
      const months: Record<string, number> = {
        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
      };
      if (months[month] !== undefined) {
        return new Date(parseInt(year), months[month], 1);
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Map region names to slugs
const regionMap: Record<string, string> = {
  'north-wales': 'snowdonia',
  'mid-wales': 'mid-wales', 
  'south-wales': 'south-wales',
  'pembrokeshire': 'pembrokeshire',
  'gower': 'gower',
  'brecon': 'brecon-beacons',
  'brecon-beacons': 'brecon-beacons',
  'snowdonia': 'snowdonia',
  'anglesey': 'anglesey',
  'carmarthenshire': 'carmarthenshire',
  'ceredigion': 'ceredigion',
  'swansea-bay': 'gower',
  'wales': 'mid-wales', // default
};

async function loadResearchedEvents(): Promise<ResearchedEvent[]> {
  const files = fs.readdirSync(RESEARCH_DIR).filter(f => f.startsWith('events-') && f.endsWith('.json'));
  const allEvents: ResearchedEvent[] = [];
  
  for (const file of files) {
    const filePath = path.join(RESEARCH_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    try {
      const events = JSON.parse(content);
      console.log(`Loaded ${events.length} events from ${file}`);
      allEvents.push(...events);
    } catch (e) {
      console.error(`Error parsing ${file}:`, e);
    }
  }
  
  return allEvents;
}

async function getRegionId(regionSlug: string): Promise<number | null> {
  const mapped = regionMap[regionSlug.toLowerCase()] || regionSlug;
  const region = await db.select({ id: regions.id })
    .from(regions)
    .where(and(eq(regions.slug, mapped), eq(regions.siteId, SITE_ID)))
    .limit(1);
  return region[0]?.id || null;
}

async function importEvents() {
  console.log('Loading researched events...');
  const researchedEvents = await loadResearchedEvents();
  console.log(`Total events loaded: ${researchedEvents.length}`);
  
  // Deduplicate by slug
  const eventMap = new Map<string, ResearchedEvent>();
  for (const event of researchedEvents) {
    const slug = event.slug || generateSlug(event.name);
    const existing = eventMap.get(slug);
    if (existing) {
      // Merge - prefer non-null values
      eventMap.set(slug, {
        ...existing,
        ...Object.fromEntries(
          Object.entries(event).filter(([_, v]) => v !== null && v !== undefined && v !== '')
        )
      });
    } else {
      eventMap.set(slug, { ...event, slug });
    }
  }
  
  console.log(`Unique events after deduplication: ${eventMap.size}`);
  
  let imported = 0;
  let updated = 0;
  let skipped = 0;
  
  for (const [slug, event] of eventMap) {
    try {
      // Check if event exists
      const existing = await db.select({ id: events.id })
        .from(events)
        .where(and(eq(events.slug, slug), eq(events.siteId, SITE_ID)))
        .limit(1);
      
      const regionId = await getRegionId(event.regionSlug || event.region || 'wales');
      
      const eventData = {
        siteId: SITE_ID,
        name: event.name,
        slug,
        type: event.type || event.category,
        category: event.category,
        description: event.description,
        dateStart: parseDate(event.dateStart || event.date),
        dateEnd: parseDate(event.dateEnd),
        monthTypical: event.monthTypical,
        location: event.location,
        lat: event.lat?.toString(),
        lng: event.lng?.toString(),
        website: event.website,
        ticketUrl: event.ticketUrl,
        registrationCost: parseRegistrationCost(event.registrationCost)?.toString(),
        capacity: event.capacity,
        heroImage: event.heroImage,
        status: 'published' as const,
        difficulty: event.difficulty?.slice(0, 50),
        ageRange: event.ageRange,
        isRecurring: event.isRecurring || false,
        regionId,
        tags: event.tags,
      };
      
      if (existing.length > 0) {
        // Update existing - only non-null fields
        await db.update(events)
          .set(Object.fromEntries(
            Object.entries(eventData).filter(([_, v]) => v !== null && v !== undefined)
          ))
          .where(eq(events.id, existing[0].id));
        updated++;
      } else {
        // Insert new
        await db.insert(events).values(eventData);
        imported++;
      }
    } catch (e) {
      console.error(`Error importing ${slug}:`, e);
      skipped++;
    }
  }
  
  console.log(`\nImport complete:`);
  console.log(`  - Imported: ${imported}`);
  console.log(`  - Updated: ${updated}`);
  console.log(`  - Skipped: ${skipped}`);
  console.log(`  - Total in DB: ${imported + updated}`);
}

importEvents()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
