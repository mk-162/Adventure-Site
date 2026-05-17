/**
 * Import 02: Activity Types
 * 
 * Seeds the activity type taxonomy. Activities and operators both reference
 * these. The CSV in content/activities.csv uses display names that need
 * mapping to the canonical slugs used by the DB activity_types table.
 * 
 * Usage: npx tsx scripts/import/02-activity-types.ts [--dry-run]
 */

import { db } from '../../src/db';
import { activityTypes } from '../../src/db/schema';
import { eq } from 'drizzle-orm';
import { SITE_ID } from './lib/helpers';

const DRY_RUN = process.argv.includes('--dry-run');

// Canonical activity types with display names used in CSVs
// CSV values → slug mappings
const ACTIVITY_TYPE_DATA = [
  { name: 'Climbing', slug: 'climbing', description: 'Rock climbing, indoor walls, and bouldering across Wales' },
  { name: 'Surfing', slug: 'surfing', description: 'Surf schools, lessons, and board hire on Welsh beaches' },
  { name: 'Coasteering', slug: 'coasteering', description: 'Cliff jumping, cave swimming, and coastal exploration' },
  { name: 'Mountain Biking', slug: 'mountain-biking', description: 'Trail centres, singletrack, and downhill runs' },
  { name: 'Hiking', slug: 'hiking', description: 'Mountain walks, coastal paths, and scenic trails' },
  { name: 'Kayaking', slug: 'kayaking', description: 'Sea kayaking, river paddling, and canoe tours' },
  { name: 'Paddleboarding', slug: 'paddleboarding', description: 'SUP sessions, tours, and lessons' },
  { name: 'Caving', slug: 'caving', description: 'Underground adventures and cave exploration' },
  { name: 'Gorge Walking', slug: 'gorge-walking', description: 'Scramble through gorges, waterfalls, and rivers' },
  { name: 'Wild Swimming', slug: 'wild-swimming', description: 'Lakes, rivers, waterfalls, and sea swimming' },
  { name: 'White Water Rafting', slug: 'white-water-rafting', description: 'Rapids, rafting trips, and river adventures' },
  { name: 'Canyoning', slug: 'canyoning', description: 'Abseil waterfalls, jump pools, and canyon exploration' },
  { name: 'Zip Lining', slug: 'zip-lining', description: 'Zip lines, aerial adventures, and high wire courses' },
  { name: 'High Ropes', slug: 'high-ropes', description: 'Treetop adventures and aerial challenges' },
  { name: 'Archery', slug: 'archery', description: 'Target shooting and archery courses' },
  { name: 'Horse Riding', slug: 'horse-riding', description: 'Trail rides, beach rides, and equestrian adventures' },
  { name: 'Fishing', slug: 'fishing', description: 'Coastal, river, and coarse fishing in Wales' },
  { name: 'Sailing', slug: 'sailing', description: 'Coastal sailing and boat trips' },
  { name: 'Windsurfing', slug: 'windsurfing', description: 'Wind-powered water sports lessons and hire' },
  { name: 'Kitesurfing', slug: 'kitesurfing', description: 'Kite surfing sessions and lessons' },
  { name: 'Paragliding', slug: 'paragliding', description: 'Tandem flights and paragliding lessons' },
  { name: 'Skydiving', slug: 'skydiving', description: 'Tandem skydives and accelerate freefall experiences' },
  { name: 'Seafari', slug: 'seafari', description: 'Wildlife boat tours and coastal seafaris' },
  { name: 'Gorge Scrambling', slug: 'gorge-scrambling', description: 'More technical than gorge walking — river canyoneering' },
  { name: 'Mine Exploration', slug: 'mine-exploration', description: 'Underground mine tours and heritage sites' },
  { name: 'Boat Tours', slug: 'boat-tour', description: 'Coastal cruises and wildlife boat tours' },
  { name: 'Wildlife Boat Tours', slug: 'wildlife-boat-tour', description: 'Seabird, seal, and wildlife boat trips' },
  { name: 'Trail Running', slug: 'trail-running', description: 'Guided trail and fell running experiences' },
  { name: 'Bouldering', slug: 'bouldering', description: 'Low-level climbing without ropes on boulder problems' },
  { name: 'Beaches', slug: 'beaches', description: 'Welsh beaches — swimming, bodyboarding, and coastal fun' },
];

// CSV "Type" values → canonical slugs
export const ACTIVITY_TYPE_CSV_MAP: Record<string, string> = {
  'climbing': 'climbing',
  'rock climbing': 'climbing',
  'indoor climbing': 'climbing',
  'surfing': 'surfing',
  'surf': 'surfing',
  'coasteering': 'coasteering',
  'mountain biking': 'mountain-biking',
  'mtb': 'mountain-biking',
  'hiking': 'hiking',
  'walking': 'hiking',
  'kayaking': 'kayaking',
  'sea kayaking': 'kayaking',
  'canoeing': 'kayaking',
  'paddleboarding': 'paddleboarding',
  'sup': 'paddleboarding',
  'stand-up paddleboarding': 'paddleboarding',
  'caving': 'caving',
  'gorge walking': 'gorge-walking',
  'wild swimming': 'wild-swimming',
  'wild-swimming': 'wild-swimming',
  'swimming': 'wild-swimming',
  'white water rafting': 'white-water-rafting',
  'rafting': 'white-water-rafting',
  'canyoning': 'canyoning',
  'zip lining': 'zip-lining',
  'zip-lining': 'zip-lining',
  'high ropes': 'high-ropes',
  'archery': 'archery',
  'horse riding': 'horse-riding',
  'fishing': 'fishing',
  'sailing': 'sailing',
  'windsurfing': 'windsurfing',
  'kitesurfing': 'kitesurfing',
  'paragliding': 'paragliding',
  'skydiving': 'skydiving',
  'seafari': 'seafari',
  'gorge scrambling': 'gorge-scrambling',
  'mine exploration': 'mine-exploration',
  'boat tour': 'boat-tour',
  'boat tours': 'boat-tour',
  'wildlife boat tour': 'wildlife-boat-tour',
  'wildlife boat tours': 'wildlife-boat-tour',
  'trail running': 'trail-running',
  'bouldering': 'bouldering',
  'beaches': 'beaches',
};

async function main() {
  console.log('=== Import 02: Activity Types ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  const existing = await db
    .select()
    .from(activityTypes)
    .where(eq(activityTypes.siteId, SITE_ID));

  console.log(`Currently ${existing.length} activity types in DB:`);
  existing.forEach(t => console.log(`  - ${t.name} (${t.slug})`));

  const slugs = new Set(existing.map(t => t.slug));
  let created = 0;

  for (const at of ACTIVITY_TYPE_DATA) {
    if (slugs.has(at.slug)) {
      console.log(`  ⏭ "${at.name}" already exists`);
      continue;
    }

    console.log(`  → "${at.name}" (${at.slug})`);

    if (!DRY_RUN) {
      await db.insert(activityTypes).values({
        siteId: SITE_ID,
        name: at.name,
        slug: at.slug,
        description: at.description,
      });
    }
    created++;
  }

  if (DRY_RUN) {
    console.log(`\nDry run complete. Would create ${created} new type(s).`);
  } else {
    console.log(`\n✅ Created ${created} activity type(s).`);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
