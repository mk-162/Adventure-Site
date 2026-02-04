#!/usr/bin/env tsx

import { sql } from '@vercel/postgres';

// Manual coordinate fixes for items that couldn't be auto-matched
const ACTIVITY_FIXES: Record<string, [number, number]> = {
  'Boat Trip - Ramsey Island': [51.8620, -5.3290], // St Justinian launch point
  'Kayaking': [52.490, -4.050], // Borth area
  'SUP': [52.540, -3.630], // Trefeglwys (Mid Wales)
  'Wild Swimming': [51.850, -4.900], // Pembrokeshire (general)
  'Canyoning': [51.883, -3.437], // Bannau Brycheiniog / Brecon Beacons center
  'Rock Climbing': [51.590, -4.200], // Gower coast (general)
  'Paddle Boarding': [52.490, -4.050], // Borth area
};

const EVENT_FIXES: Record<string, [number, number]> = {
  'Tour of Britain (Wales Stages)': [52.300, -3.700], // Wales center
  'Welsh Gravity Enduro Series': [52.911, -3.890], // Snowdonia (main MTB region)
  'Wales Coast Path Festival': [52.500, -4.000], // Wales coast center
  'Welsh One Day Hill Climb': [52.300, -3.700], // Wales center
};

async function fixRemaining() {
  console.log('🔧 Fixing remaining coordinates...\n');
  
  let activitiesFixed = 0;
  let eventsFixed = 0;
  
  // Fix activities
  for (const [name, coords] of Object.entries(ACTIVITY_FIXES)) {
    const result = await sql`
      UPDATE activities
      SET lat = ${coords[0]}, lng = ${coords[1]}
      WHERE name = ${name} AND (lat IS NULL OR lng IS NULL)
      RETURNING id, name
    `;
    
    if (result.rows.length > 0) {
      console.log(`✓ Activity: ${name} → ${coords[0]}, ${coords[1]}`);
      activitiesFixed++;
    }
  }
  
  console.log('');
  
  // Fix events
  for (const [name, coords] of Object.entries(EVENT_FIXES)) {
    const result = await sql`
      UPDATE events
      SET lat = ${coords[0]}, lng = ${coords[1]}
      WHERE name = ${name} AND (lat IS NULL OR lng IS NULL)
      RETURNING id, name
    `;
    
    if (result.rows.length > 0) {
      console.log(`✓ Event: ${name} → ${coords[0]}, ${coords[1]}`);
      eventsFixed++;
    }
  }
  
  console.log('\n═══════════════════════════════════════');
  console.log(`✅ Fixed ${activitiesFixed} activities and ${eventsFixed} events`);
  console.log('═══════════════════════════════════════\n');
}

fixRemaining()
  .then(() => {
    console.log('🎉 All done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
