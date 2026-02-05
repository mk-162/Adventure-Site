/**
 * Fast Coordinate Audit — food/accommodation/transport stops only
 * These are specific named venues that must be accurately placed.
 */
import fs from "fs";
import path from "path";

const ITINERARIES_DIR = path.join(process.cwd(), "data/itineraries");
const DELAY_MS = 1100;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocode(query: string, region: string) {
  for (const searchQuery of [
    `${query}, ${region}, Wales, UK`,
    `${query}, Wales, UK`,
    `${query}, UK`,
  ]) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&countrycodes=gb`;
      const res = await fetch(url, { headers: { "User-Agent": "AdventureWales-Audit/1.0" } });
      const data = await res.json();
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name };
      }
      await new Promise(r => setTimeout(r, DELAY_MS));
    } catch {}
  }
  return null;
}

async function main() {
  const files = fs.readdirSync(ITINERARIES_DIR).filter(f => f.endsWith(".json"));
  const stops: any[] = [];

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(ITINERARIES_DIR, file), "utf-8"));
    for (const stop of data.stops) {
      if (["food", "accommodation", "transport"].includes(stop.type)) {
        stops.push({ ...stop, file, region: data.region, itinerary: data.title });
      }
    }
  }

  // Deduplicate by title (many pubs appear in multiple itineraries)
  const seen = new Map<string, any>();
  for (const s of stops) {
    const key = s.title.toLowerCase().trim();
    if (!seen.has(key)) seen.set(key, s);
  }
  const unique = Array.from(seen.values());

  console.log(`Checking ${unique.length} unique food/accommodation/transport venues (${stops.length} total across itineraries)...\n`);

  const problems: any[] = [];
  let i = 0;

  for (const stop of unique) {
    i++;
    if (!stop.lat || !stop.lng) {
      console.log(`[${i}/${unique.length}] 🚫 ${stop.title} — MISSING COORDS`);
      problems.push({ ...stop, status: "missing", distanceKm: null });
      continue;
    }

    const geo = await geocode(stop.title, stop.region);
    await new Promise(r => setTimeout(r, DELAY_MS));

    if (!geo) {
      console.log(`[${i}/${unique.length}] ❓ ${stop.title} — not found`);
      continue;
    }

    const dist = haversineKm(stop.lat, stop.lng, geo.lat, geo.lng);
    const icon = dist < 1 ? "✅" : dist < 3 ? "⚠️" : "❌";
    
    if (dist > 1) {
      console.log(`[${i}/${unique.length}] ${icon} ${stop.title} — ${dist.toFixed(1)}km off`);
      console.log(`   Stored: ${stop.lat}, ${stop.lng}`);
      console.log(`   Geocoded: ${geo.lat}, ${geo.lng} (${geo.name.substring(0, 80)})`);
      problems.push({ ...stop, geocodedLat: geo.lat, geocodedLng: geo.lng, geocodedName: geo.name, distanceKm: Math.round(dist * 10) / 10, status: dist > 5 ? "major" : "drift" });
    } else {
      console.log(`[${i}/${unique.length}] ✅ ${stop.title} — ${dist.toFixed(1)}km`);
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`DONE. ${problems.length} issues found out of ${unique.length} venues.`);
  
  if (problems.length > 0) {
    console.log(`\nFIXES NEEDED:`);
    for (const p of problems.sort((a, b) => (b.distanceKm || 999) - (a.distanceKm || 999))) {
      console.log(`  ${p.status === "major" ? "❌" : p.status === "missing" ? "🚫" : "⚠️"} ${p.title} (${p.file}) — ${p.distanceKm ?? "no coords"}km`);
      if (p.geocodedLat) console.log(`     Fix to: ${p.geocodedLat}, ${p.geocodedLng}`);
    }
  }

  // Save report
  fs.writeFileSync(path.join(process.cwd(), "data/coord-audit-results.json"), JSON.stringify(problems, null, 2));
}

main().catch(console.error);
