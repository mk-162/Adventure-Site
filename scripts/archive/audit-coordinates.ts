/**
 * Coordinate Audit Script
 * 
 * Geocodes every itinerary stop using OpenStreetMap Nominatim
 * and compares against stored coordinates. Flags anything 
 * more than 1km off.
 */

import fs from "fs";
import path from "path";

const ITINERARIES_DIR = path.join(process.cwd(), "data/itineraries");
const DELAY_MS = 1100; // Nominatim rate limit: 1 req/sec

interface Stop {
  day: number;
  orderIndex: number;
  type: string;
  title: string;
  lat?: number;
  lng?: number;
  description?: string;
}

interface Itinerary {
  slug: string;
  title: string;
  region: string;
  stops: Stop[];
}

interface AuditResult {
  file: string;
  itinerary: string;
  day: number;
  order: number;
  type: string;
  title: string;
  storedLat: number;
  storedLng: number;
  geocodedLat: number | null;
  geocodedLng: number | null;
  distanceKm: number | null;
  status: "ok" | "drift" | "major" | "not_found" | "missing";
  geocodedName?: string;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function geocode(query: string, region: string): Promise<{ lat: number; lng: number; name: string } | null> {
  // Search with Wales context
  const searchQuery = `${query}, ${region}, Wales, UK`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&countrycodes=gb`;
  
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "AdventureWales-CoordAudit/1.0" },
    });
    const data = await res.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        name: data[0].display_name,
      };
    }
  } catch (e) {
    // Retry with simpler query
  }

  // Fallback: try just the venue name + Wales
  const fallbackUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ", Wales")}&format=json&limit=1&countrycodes=gb`;
  try {
    const res = await fetch(fallbackUrl, {
      headers: { "User-Agent": "AdventureWales-CoordAudit/1.0" },
    });
    const data = await res.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        name: data[0].display_name,
      };
    }
  } catch (e) {}

  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const files = fs.readdirSync(ITINERARIES_DIR).filter((f) => f.endsWith(".json"));
  const results: AuditResult[] = [];
  let totalStops = 0;
  let checkedStops = 0;

  // Count total
  for (const file of files) {
    const data: Itinerary = JSON.parse(fs.readFileSync(path.join(ITINERARIES_DIR, file), "utf-8"));
    totalStops += data.stops.length;
  }

  console.log(`Auditing ${totalStops} stops across ${files.length} itineraries...\n`);

  for (const file of files) {
    const data: Itinerary = JSON.parse(fs.readFileSync(path.join(ITINERARIES_DIR, file), "utf-8"));

    for (const stop of data.stops) {
      checkedStops++;
      
      if (stop.lat == null || stop.lng == null) {
        results.push({
          file,
          itinerary: data.title,
          day: stop.day,
          order: stop.orderIndex,
          type: stop.type,
          title: stop.title,
          storedLat: 0,
          storedLng: 0,
          geocodedLat: null,
          geocodedLng: null,
          distanceKm: null,
          status: "missing",
        });
        continue;
      }

      // Geocode the stop
      const geo = await geocode(stop.title, data.region);
      await sleep(DELAY_MS);

      if (!geo) {
        results.push({
          file,
          itinerary: data.title,
          day: stop.day,
          order: stop.orderIndex,
          type: stop.type,
          title: stop.title,
          storedLat: stop.lat,
          storedLng: stop.lng,
          geocodedLat: null,
          geocodedLng: null,
          distanceKm: null,
          status: "not_found",
        });
        process.stdout.write(`[${checkedStops}/${totalStops}] ❓ ${stop.title} — not found in geocoder\n`);
        continue;
      }

      const dist = haversineKm(stop.lat, stop.lng, geo.lat, geo.lng);
      let status: AuditResult["status"] = "ok";
      if (dist > 5) status = "major";
      else if (dist > 1) status = "drift";

      const icon = status === "ok" ? "✅" : status === "drift" ? "⚠️" : "❌";
      process.stdout.write(
        `[${checkedStops}/${totalStops}] ${icon} ${stop.title} — ${dist.toFixed(1)}km off${status !== "ok" ? ` (stored: ${stop.lat},${stop.lng} geocoded: ${geo.lat},${geo.lng})` : ""}\n`
      );

      results.push({
        file,
        itinerary: data.title,
        day: stop.day,
        order: stop.orderIndex,
        type: stop.type,
        title: stop.title,
        storedLat: stop.lat,
        storedLng: stop.lng,
        geocodedLat: geo.lat,
        geocodedLng: geo.lng,
        distanceKm: Math.round(dist * 10) / 10,
        status,
        geocodedName: geo.name,
      });
    }
  }

  // Summary
  const ok = results.filter((r) => r.status === "ok").length;
  const drift = results.filter((r) => r.status === "drift").length;
  const major = results.filter((r) => r.status === "major").length;
  const notFound = results.filter((r) => r.status === "not_found").length;
  const missing = results.filter((r) => r.status === "missing").length;

  console.log(`\n${"=".repeat(60)}`);
  console.log(`AUDIT COMPLETE: ${results.length} stops`);
  console.log(`  ✅ OK (<1km): ${ok}`);
  console.log(`  ⚠️  Drift (1-5km): ${drift}`);
  console.log(`  ❌ Major (>5km): ${major}`);
  console.log(`  ❓ Not found: ${notFound}`);
  console.log(`  🚫 Missing coords: ${missing}`);
  console.log(`${"=".repeat(60)}\n`);

  // Print problems
  const problems = results.filter((r) => r.status === "drift" || r.status === "major");
  if (problems.length > 0) {
    console.log("PROBLEMS TO FIX:");
    console.log("-".repeat(60));
    for (const p of problems.sort((a, b) => (b.distanceKm || 0) - (a.distanceKm || 0))) {
      console.log(`${p.status === "major" ? "❌" : "⚠️"} ${p.file}`);
      console.log(`   Day ${p.day}.${p.order} [${p.type}] ${p.title}`);
      console.log(`   Stored:   ${p.storedLat}, ${p.storedLng}`);
      console.log(`   Geocoded: ${p.geocodedLat}, ${p.geocodedLng}`);
      console.log(`   Distance: ${p.distanceKm}km`);
      console.log(`   Geocoded as: ${p.geocodedName}`);
      console.log();
    }
  }

  // Save full report
  const reportPath = path.join(process.cwd(), "data/coordinate-audit.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`Full report saved to ${reportPath}`);
}

main().catch(console.error);
