#!/usr/bin/env tsx

import { sql } from '@vercel/postgres';
import * as fs from 'fs';
import * as path from 'path';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface ActivityRow {
  id: number;
  name: string;
  meeting_point: string | null;
}

interface AccommodationRow {
  id: number;
  name: string;
  address: string | null;
  region_id: number | null;
}

interface EventRow {
  id: number;
  name: string;
  location: string | null;
}

// Parse CSV file
function parseCSV(filePath: string): any[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim().replace(/^"(.*)"$/, '$1'));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/^"(.*)"$/, '$1'));
    
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  });
}

// Build location lookup from CSV
function buildLocationLookup(): Map<string, Location> {
  const locationsCSV = parseCSV(path.join(__dirname, '../data/wales/Wales database - Locations.csv'));
  const lookup = new Map<string, Location>();
  
  locationsCSV.forEach((row: any) => {
    const coords = row['GPS Coordinates'];
    if (coords && coords.includes(',')) {
      const [lat, lng] = coords.split(',').map((s: string) => parseFloat(s.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        const name = row['Location Name'].trim();
        lookup.set(name.toLowerCase(), { name, lat, lng });
        
        // Add common variations
        if (name.includes('(')) {
          const shortName = name.split('(')[0].trim();
          lookup.set(shortName.toLowerCase(), { name, lat, lng });
        }
        if (name.includes('-')) {
          const noHyphen = name.replace(/-/g, ' ');
          lookup.set(noHyphen.toLowerCase(), { name, lat, lng });
        }
      }
    }
  });
  
  return lookup;
}

// Known Welsh coordinates for common locations
const KNOWN_COORDS: Record<string, [number, number]> = {
  'st davids': [51.882, -5.269],
  'st. davids': [51.882, -5.269],
  'bala': [52.915, -3.600],
  'llanberis': [53.119, -4.131],
  'betws-y-coed': [53.092, -3.800],
  'dolgellau': [52.744, -3.889],
  'capel curig': [53.096, -3.910],
  'blaenau ffestiniog': [52.994, -3.938],
  'conwy': [53.281, -3.827],
  'tenby': [51.672, -4.701],
  'stackpole quay': [51.616, -4.891],
  'newgale': [51.858, -5.120],
  'whitesands beach': [51.892, -5.303],
  'abereiddy': [51.931, -5.203],
  'rhosneigr': [53.231, -4.520],
  'abersoch': [52.824, -4.500],
  'pwllheli': [52.888, -4.418],
  'merthyr tydfil': [51.750, -3.380],
  'brecon': [51.948, -3.390],
  'swansea': [51.621, -3.944],
  'cardiff': [51.481, -3.179],
  'newport': [51.588, -2.998],
  'rhossili': [51.569, -4.287],
  'llangennith': [51.597, -4.268],
  'port eynon': [51.546, -4.215],
  'oxwich': [51.558, -4.165],
  'aberystwyth': [52.415, -4.083],
  'machynlleth': [52.590, -3.850],
  'llandegla': [53.056, -3.191],
  'porthmadog': [52.926, -4.132],
  'caernarfon': [53.139, -4.273],
  'anglesey': [53.270, -4.353],
  'nefyn': [52.935, -4.523],
  'criccieth': [52.918, -4.233],
  'llandudno': [53.324, -3.827],
  'chepstow': [51.641, -2.677],
  'llanelli': [51.685, -4.162],
  'pembrey': [51.703, -4.320],
  'pendine': [51.738, -4.502],
  'ogwen valley': [53.120, -4.020],
  'talybont-on-usk': [51.820, -3.330],
  'barry island': [51.398, -3.267],
  'newborough': [53.136, -4.410],
  'menai strait': [53.220, -4.163],
};

// Region center coordinates for fallbacks
const REGION_CENTERS: Record<string, [number, number]> = {
  'snowdonia': [52.911, -3.890],
  'pembrokeshire': [51.850, -4.900],
  'brecon beacons': [51.884, -3.430],
  'anglesey': [53.270, -4.353],
  'gower': [51.594, -4.165],
  'mid wales': [52.400, -3.700],
  'llŷn peninsula': [52.900, -4.500],
  'north wales': [53.050, -3.700],
  'south wales': [51.600, -3.500],
  'carmarthenshire': [51.900, -4.200],
};

function findCoordinates(text: string | null, locationLookup: Map<string, Location>): [number, number] | null {
  if (!text) return null;
  
  const lowerText = text.toLowerCase();
  
  // Direct lookup in location database
  if (locationLookup.has(lowerText)) {
    const loc = locationLookup.get(lowerText)!;
    return [loc.lat, loc.lng];
  }
  
  // Check if any location name is contained in the text
  for (const [key, loc] of locationLookup.entries()) {
    if (lowerText.includes(key)) {
      return [loc.lat, loc.lng];
    }
  }
  
  // Check known coordinates
  for (const [place, coords] of Object.entries(KNOWN_COORDS)) {
    if (lowerText.includes(place)) {
      return coords;
    }
  }
  
  return null;
}

function getRegionCoords(regionName: string | null, offset: boolean = false): [number, number] | null {
  if (!regionName) return null;
  
  const coords = REGION_CENTERS[regionName.toLowerCase()];
  if (!coords) return null;
  
  if (offset) {
    // Add small random offset to avoid stacking pins
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;
    return [coords[0] + latOffset, coords[1] + lngOffset];
  }
  
  return coords;
}

async function main() {
  console.log('🗺️  Populating GPS coordinates for Adventure Wales database...\n');
  
  // Build location lookup
  console.log('📍 Building location lookup from CSV...');
  const locationLookup = buildLocationLookup();
  console.log(`   Found ${locationLookup.size} locations with coordinates\n`);
  
  let activitiesUpdated = 0;
  let accommodationUpdated = 0;
  let eventsUpdated = 0;
  
  // ============================================
  // UPDATE ACTIVITIES
  // ============================================
  console.log('🏃 Processing Activities...');
  const activities = await sql<ActivityRow>`
    SELECT id, name, meeting_point
    FROM activities
    WHERE lat IS NULL OR lng IS NULL
  `;
  
  for (const activity of activities.rows) {
    const coords = findCoordinates(activity.meeting_point, locationLookup);
    
    if (coords) {
      await sql`
        UPDATE activities
        SET lat = ${coords[0]}, lng = ${coords[1]}
        WHERE id = ${activity.id}
      `;
      console.log(`   ✓ ${activity.name}: ${coords[0]}, ${coords[1]}`);
      activitiesUpdated++;
    } else {
      console.log(`   ⚠ ${activity.name}: No coordinates found for "${activity.meeting_point}"`);
    }
  }
  
  console.log(`\n   Updated ${activitiesUpdated}/${activities.rows.length} activities\n`);
  
  // ============================================
  // UPDATE ACCOMMODATION
  // ============================================
  console.log('🏨 Processing Accommodation...');
  const accommodation = await sql<AccommodationRow>`
    SELECT a.id, a.name, a.address, r.name as region_name
    FROM accommodation a
    LEFT JOIN regions r ON a.region_id = r.id
    WHERE a.lat IS NULL OR a.lng IS NULL
  `;
  
  for (const acc of accommodation.rows) {
    // Try to find by name or address
    let coords = findCoordinates(acc.name, locationLookup);
    if (!coords) {
      coords = findCoordinates(acc.address, locationLookup);
    }
    
    // Fallback to region center with offset
    if (!coords) {
      const regionName = (acc as any).region_name;
      coords = getRegionCoords(regionName, true);
    }
    
    if (coords) {
      await sql`
        UPDATE accommodation
        SET lat = ${coords[0]}, lng = ${coords[1]}
        WHERE id = ${acc.id}
      `;
      console.log(`   ✓ ${acc.name}: ${coords[0]}, ${coords[1]}`);
      accommodationUpdated++;
    } else {
      console.log(`   ⚠ ${acc.name}: No coordinates found`);
    }
  }
  
  console.log(`\n   Updated ${accommodationUpdated}/${accommodation.rows.length} accommodation\n`);
  
  // ============================================
  // UPDATE EVENTS
  // ============================================
  console.log('📅 Processing Events...');
  const events = await sql<EventRow>`
    SELECT e.id, e.name, e.location, r.name as region_name
    FROM events e
    LEFT JOIN regions r ON e.region_id = r.id
    WHERE e.lat IS NULL OR e.lng IS NULL
  `;
  
  for (const event of events.rows) {
    let coords = findCoordinates(event.location, locationLookup);
    
    // Fallback to region center
    if (!coords) {
      const regionName = (event as any).region_name;
      coords = getRegionCoords(regionName, false);
    }
    
    if (coords) {
      await sql`
        UPDATE events
        SET lat = ${coords[0]}, lng = ${coords[1]}
        WHERE id = ${event.id}
      `;
      console.log(`   ✓ ${event.name}: ${coords[0]}, ${coords[1]}`);
      eventsUpdated++;
    } else {
      console.log(`   ⚠ ${event.name}: No coordinates found for "${event.location}"`);
    }
  }
  
  console.log(`\n   Updated ${eventsUpdated}/${events.rows.length} events\n`);
  
  // ============================================
  // SUMMARY
  // ============================================
  console.log('═══════════════════════════════════════');
  console.log('✅ SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`   Activities:     ${activitiesUpdated} updated`);
  console.log(`   Accommodation:  ${accommodationUpdated} updated`);
  console.log(`   Events:         ${eventsUpdated} updated`);
  console.log(`   TOTAL:          ${activitiesUpdated + accommodationUpdated + eventsUpdated} coordinates added`);
  console.log('═══════════════════════════════════════\n');
}

main()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
