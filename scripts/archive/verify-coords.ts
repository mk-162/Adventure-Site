/**
 * Coordinate verification via reverse geocoding.
 * Instead of searching for venue names (unreliable for informal names),
 * we check if stored coordinates are actually in the right region of Wales.
 */
import fs from "fs";
import path from "path";

const ITINERARIES_DIR = path.join(process.cwd(), "data/itineraries");
const DELAY_MS = 1100;

// Approximate region centers and max radius (km) for sanity check
const regionBounds: Record<string, { lat: number; lng: number; radiusKm: number }> = {
  snowdonia: { lat: 53.0, lng: -3.9, radiusKm: 40 },
  pembrokeshire: { lat: 51.8, lng: -5.0, radiusKm: 45 },
  "brecon-beacons": { lat: 51.85, lng: -3.5, radiusKm: 35 },
  gower: { lat: 51.58, lng: -4.15, radiusKm: 20 },
  anglesey: { lat: 53.25, lng: -4.4, radiusKm: 30 },
  "north-wales": { lat: 53.15, lng: -3.8, radiusKm: 50 },
  "mid-wales": { lat: 52.5, lng: -3.6, radiusKm: 50 },
  "south-wales": { lat: 51.7, lng: -3.4, radiusKm: 40 },
  "wye-valley": { lat: 51.8, lng: -2.65, radiusKm: 25 },
  "llyn-peninsula": { lat: 52.9, lng: -4.5, radiusKm: 30 },
  carmarthenshire: { lat: 51.9, lng: -4.1, radiusKm: 35 },
  "multi-region": { lat: 52.4, lng: -3.7, radiusKm: 120 },
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=14`;
    const res = await fetch(url, { headers: { "User-Agent": "AdventureWales-Audit/1.0" } });
    const data = await res.json();
    return data.display_name || null;
  } catch { return null; }
}

async function main() {
  const files = fs.readdirSync(ITINERARIES_DIR).filter(f => f.endsWith(".json"));
  const problems: any[] = [];
  let checked = 0;

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(ITINERARIES_DIR, file), "utf-8"));
    const bounds = regionBounds[data.region] || regionBounds["multi-region"];

    for (const stop of data.stops) {
      if (!stop.lat || !stop.lng) continue;
      
      const lat = Number(stop.lat);
      const lng = Number(stop.lng);

      // Check 1: Is it in roughly the right region?
      const distFromCenter = haversineKm(lat, lng, bounds.lat, bounds.lng);
      if (distFromCenter > bounds.radiusKm) {
        checked++;
        // Reverse geocode to see where it actually is
        const location = await reverseGeocode(lat, lng);
        await new Promise(r => setTimeout(r, DELAY_MS));
        
        const isInSea = location?.includes("Irish Sea") || location?.includes("Celtic Sea") || 
                        location?.includes("Bristol Channel") || location?.includes("Atlantic") ||
                        !location || location.includes("ocean");
        
        console.log(`❌ ${file}: Day ${stop.day}.${stop.orderIndex} [${stop.type}] "${stop.title}"`);
        console.log(`   ${distFromCenter.toFixed(0)}km from ${data.region} center`);
        console.log(`   Coords: ${lat}, ${lng}`);
        console.log(`   Reverse: ${location?.substring(0, 100) || "UNKNOWN/SEA"}`);
        console.log(`   ${isInSea ? "🌊 IN THE SEA!" : "📍 On land but wrong region?"}`);
        console.log();
        
        problems.push({
          file, title: stop.title, type: stop.type, day: stop.day, order: stop.orderIndex,
          lat, lng, region: data.region, distFromCenter: Math.round(distFromCenter),
          reverseLocation: location, isInSea,
        });
      }

      // Check 2: For food/accommodation, reverse geocode to verify it's on land
      if (["food", "accommodation"].includes(stop.type)) {
        // Quick sea check: is it in obviously wrong waters?
        // West of -5.35 is probably sea (except far west Pembrokeshire is -5.33 max)
        // South of 51.35 is Bristol Channel
        if (lng < -5.35 || lat < 51.35 || lng > -2.3) {
          checked++;
          const location = await reverseGeocode(lat, lng);
          await new Promise(r => setTimeout(r, DELAY_MS));
          
          if (!problems.find(p => p.title === stop.title && p.file === file)) {
            console.log(`⚠️ ${file}: Day ${stop.day}.${stop.orderIndex} [${stop.type}] "${stop.title}"`);
            console.log(`   Coords: ${lat}, ${lng} — edge of Wales`);
            console.log(`   Reverse: ${location?.substring(0, 100) || "UNKNOWN"}`);
            console.log();
            
            problems.push({
              file, title: stop.title, type: stop.type, day: stop.day, order: stop.orderIndex,
              lat, lng, region: data.region, distFromCenter: 0,
              reverseLocation: location, isInSea: false,
            });
          }
        }
      }
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Checked ${checked} edge-case coordinates.`);
  console.log(`Found ${problems.length} potential issues.`);
  console.log(`Sea issues: ${problems.filter(p => p.isInSea).length}`);

  fs.writeFileSync(path.join(process.cwd(), "data/coord-verify-results.json"), JSON.stringify(problems, null, 2));
  console.log(`\nSaved to data/coord-verify-results.json`);
}

main().catch(console.error);
