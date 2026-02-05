/**
 * Postcode Lookup & Coordinate Fix
 * 
 * Phase 1: For every food/accommodation stop, search for postcode via postcodes.io
 * Uses the nearest postcode lookup (reverse geocode from existing coords)
 * then validates the result makes sense.
 * 
 * Phase 2: Manual review file generated for anything that can't be auto-resolved.
 */
import fs from "fs";
import path from "path";

const ITINERARIES_DIR = path.join(process.cwd(), "data/itineraries");
const DELAY_MS = 200; // postcodes.io is generous with rate limits

interface Stop {
  day: number;
  orderIndex: number;
  type: string;
  title: string;
  lat?: number;
  lng?: number;
  postcode?: string;
  [key: string]: any;
}

interface PostcodeResult {
  postcode: string;
  latitude: number;
  longitude: number;
  admin_district: string;
  parish: string;
  country: string;
}

async function reversePostcode(lat: number, lng: number): Promise<PostcodeResult | null> {
  try {
    const url = `https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}&limit=1&radius=2000`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 200 && data.result && data.result.length > 0) {
      const r = data.result[0];
      return {
        postcode: r.postcode,
        latitude: r.latitude,
        longitude: r.longitude,
        admin_district: r.admin_district,
        parish: r.parish || "",
        country: r.country,
      };
    }
  } catch {}
  return null;
}

async function lookupPostcode(postcode: string): Promise<PostcodeResult | null> {
  try {
    const url = `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.replace(/\s/g, ""))}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 200 && data.result) {
      const r = data.result;
      return {
        postcode: r.postcode,
        latitude: r.latitude,
        longitude: r.longitude,
        admin_district: r.admin_district,
        parish: r.parish || "",
        country: r.country,
      };
    }
  } catch {}
  return null;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const files = fs.readdirSync(ITINERARIES_DIR).filter(f => f.endsWith(".json"));
  
  // Collect all unique venues (by title) across itineraries
  const venueMap = new Map<string, { stops: Array<{ file: string; day: number; order: number; lat: number; lng: number }>; type: string; title: string }>();
  
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(ITINERARIES_DIR, file), "utf-8"));
    for (const stop of data.stops as Stop[]) {
      if (!["food", "accommodation"].includes(stop.type)) continue;
      if (!stop.lat || !stop.lng) continue;
      
      const key = stop.title.toLowerCase().trim();
      if (!venueMap.has(key)) {
        venueMap.set(key, { stops: [], type: stop.type, title: stop.title });
      }
      venueMap.get(key)!.stops.push({
        file, day: stop.day, order: stop.orderIndex,
        lat: Number(stop.lat), lng: Number(stop.lng),
      });
    }
  }

  console.log(`Found ${venueMap.size} unique food/accommodation venues\n`);

  const results: Array<{
    title: string;
    type: string;
    oldLat: number;
    oldLng: number;
    postcode: string;
    newLat: number;
    newLng: number;
    drift: number;
    district: string;
    country: string;
    files: string[];
    status: "updated" | "ok" | "not_wales" | "no_postcode" | "too_far";
  }> = [];

  let i = 0;
  for (const [key, venue] of venueMap) {
    i++;
    const ref = venue.stops[0]; // Use first occurrence coords
    
    // Reverse geocode to find nearest postcode
    const pc = await reversePostcode(ref.lat, ref.lng);
    await sleep(DELAY_MS);
    
    if (!pc) {
      console.log(`[${i}/${venueMap.size}] ❌ ${venue.title} — no postcode found near ${ref.lat}, ${ref.lng}`);
      results.push({
        title: venue.title, type: venue.type,
        oldLat: ref.lat, oldLng: ref.lng,
        postcode: "", newLat: 0, newLng: 0, drift: 0,
        district: "", country: "",
        files: venue.stops.map(s => s.file),
        status: "no_postcode",
      });
      continue;
    }

    if (pc.country !== "Wales" && pc.country !== "England") {
      console.log(`[${i}/${venueMap.size}] ⚠️ ${venue.title} — postcode ${pc.postcode} is in ${pc.country}`);
      results.push({
        title: venue.title, type: venue.type,
        oldLat: ref.lat, oldLng: ref.lng,
        postcode: pc.postcode, newLat: pc.latitude, newLng: pc.longitude, 
        drift: haversineKm(ref.lat, ref.lng, pc.latitude, pc.longitude),
        district: pc.admin_district, country: pc.country,
        files: venue.stops.map(s => s.file),
        status: "not_wales",
      });
      continue;
    }

    const drift = haversineKm(ref.lat, ref.lng, pc.latitude, pc.longitude);
    
    if (drift > 5) {
      // Postcode is far from stored coords — something's wrong, flag for manual review
      console.log(`[${i}/${venueMap.size}] ❌ ${venue.title} — nearest postcode ${pc.postcode} is ${drift.toFixed(1)}km away (${pc.admin_district})`);
      results.push({
        title: venue.title, type: venue.type,
        oldLat: ref.lat, oldLng: ref.lng,
        postcode: pc.postcode, newLat: pc.latitude, newLng: pc.longitude, drift: Math.round(drift * 10) / 10,
        district: pc.admin_district, country: pc.country,
        files: venue.stops.map(s => s.file),
        status: "too_far",
      });
    } else if (drift > 0.5) {
      // Postcode is somewhat close — update coords to postcode location
      console.log(`[${i}/${venueMap.size}] ⚠️ ${venue.title} — ${pc.postcode} (${pc.admin_district}) drift ${drift.toFixed(1)}km → updating`);
      results.push({
        title: venue.title, type: venue.type,
        oldLat: ref.lat, oldLng: ref.lng,
        postcode: pc.postcode, newLat: pc.latitude, newLng: pc.longitude, drift: Math.round(drift * 10) / 10,
        district: pc.admin_district, country: pc.country,
        files: venue.stops.map(s => s.file),
        status: "updated",
      });
    } else {
      console.log(`[${i}/${venueMap.size}] ✅ ${venue.title} — ${pc.postcode} (${pc.admin_district}) ✓`);
      results.push({
        title: venue.title, type: venue.type,
        oldLat: ref.lat, oldLng: ref.lng,
        postcode: pc.postcode, newLat: pc.latitude, newLng: pc.longitude, drift: Math.round(drift * 10) / 10,
        district: pc.admin_district, country: pc.country,
        files: venue.stops.map(s => s.file),
        status: "ok",
      });
    }
  }

  // Summary
  const ok = results.filter(r => r.status === "ok").length;
  const updated = results.filter(r => r.status === "updated").length;
  const tooFar = results.filter(r => r.status === "too_far").length;
  const noPC = results.filter(r => r.status === "no_postcode").length;
  const notWales = results.filter(r => r.status === "not_wales").length;

  console.log(`\n${"=".repeat(50)}`);
  console.log(`RESULTS: ${results.length} venues`);
  console.log(`  ✅ Accurate (<500m): ${ok}`);
  console.log(`  ⚠️  Updated (500m-5km drift): ${updated}`);
  console.log(`  ❌ Needs manual review (>5km): ${tooFar}`);
  console.log(`  🚫 No postcode found: ${noPC}`);
  console.log(`  🏴 Not in Wales: ${notWales}`);

  // Now apply fixes to itinerary files
  if (updated > 0) {
    console.log(`\nApplying ${updated} coordinate updates...`);
    
    const updatesToApply = results.filter(r => r.status === "updated");
    
    for (const file of files) {
      const filePath = path.join(ITINERARIES_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      let changed = false;
      
      for (const stop of data.stops as Stop[]) {
        if (!["food", "accommodation"].includes(stop.type)) continue;
        const key = stop.title.toLowerCase().trim();
        const update = updatesToApply.find(u => u.title.toLowerCase().trim() === key);
        if (update) {
          stop.lat = update.newLat;
          stop.lng = update.newLng;
          stop.postcode = update.postcode;
          changed = true;
        }
        // Also add postcode to accurate ones
        const okResult = results.find(r => r.title.toLowerCase().trim() === key && r.status === "ok");
        if (okResult && !stop.postcode) {
          stop.postcode = okResult.postcode;
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      }
    }
    console.log("Done.");
  }

  // Save full report
  fs.writeFileSync(
    path.join(process.cwd(), "data/postcode-audit.json"),
    JSON.stringify(results, null, 2)
  );
  
  // Save manual review list
  const manualReview = results.filter(r => ["too_far", "no_postcode", "not_wales"].includes(r.status));
  if (manualReview.length > 0) {
    console.log(`\n⚠️  MANUAL REVIEW NEEDED (${manualReview.length} venues):`);
    for (const r of manualReview) {
      console.log(`  ${r.title} [${r.status}] — ${r.postcode || "no postcode"} in ${r.files.join(", ")}`);
    }
  }
}

main().catch(console.error);
