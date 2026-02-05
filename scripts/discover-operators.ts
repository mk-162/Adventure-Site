/**
 * Discover new adventure operators via Google Places API.
 * Searches for activity businesses across Welsh regions and inserts new ones.
 * 
 * Usage: npx tsx scripts/discover-operators.ts [--dry-run] [--region snowdonia] [--type kayaking]
 * 
 * Requires GOOGLE_API_KEY and DATABASE_URL in .env
 */

import { db } from "../src/db";
import { operators, activities, activityTypes, regions } from "../src/db/schema";
import { eq, and, inArray } from "drizzle-orm";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error("Missing GOOGLE_API_KEY in .env");
  process.exit(1);
}

const PLACES_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const PLACE_DETAILS_URL = "https://places.googleapis.com/v1/places";
const DELAY_MS = 300;

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const regionFilter = args.find((a, i) => args[i - 1] === "--region") || null;
const typeFilter = args.find((a, i) => args[i - 1] === "--type") || null;

// Search queries per activity type — Welsh-specific
const searchQueries: Record<string, string[]> = {
  "coasteering": ["coasteering Wales", "coasteering Pembrokeshire", "coasteering Anglesey", "coasteering Gower"],
  "kayaking": ["kayaking Wales", "sea kayaking Pembrokeshire", "kayaking Snowdonia", "canoe hire Wales"],
  "climbing": ["rock climbing Wales", "climbing centre Wales", "bouldering Wales", "climbing instruction Snowdonia"],
  "surfing": ["surf school Wales", "surfing lessons Gower", "surf hire Pembrokeshire", "surfing Llŷn Peninsula"],
  "mountain-biking": ["mountain biking Wales", "MTB hire Wales", "bike park Wales", "mountain bike trails Wales"],
  "hiking": ["guided walks Wales", "hiking guide Snowdonia", "walking tours Pembrokeshire", "mountain guide Wales"],
  "caving": ["caving Wales", "caving experience Brecon Beacons", "underground adventures Wales"],
  "gorge-walking": ["gorge walking Wales", "canyoning Wales", "gorge scrambling Brecon Beacons"],
  "wild-swimming": ["wild swimming Wales", "open water swimming Wales", "swim coaching Wales"],
  "paddleboarding": ["paddleboarding Wales", "SUP hire Wales", "stand up paddle Wales"],
  "horse-riding": ["horse riding Wales", "pony trekking Wales", "horse trekking Brecon Beacons", "riding stables Wales"],
  "fishing": ["fishing Wales", "sea fishing trips Wales", "fly fishing Wales", "fishing guide Wales"],
  "zip-lining": ["zip line Wales", "adventure park Wales", "Zip World", "high ropes Wales"],
  "wildlife-birdwatching": ["wildlife tours Wales", "birdwatching Wales", "whale watching Wales", "dolphin watching Cardigan Bay"],
  "paintball-laser-tag": ["paintball Wales", "laser tag Wales", "combat games Wales"],
};

// Welsh regions with approximate centre coordinates for location biasing
const regionCentres: Record<string, { lat: number; lng: number; radius: number }> = {
  "snowdonia": { lat: 52.9, lng: -3.9, radius: 30000 },
  "pembrokeshire": { lat: 51.8, lng: -5.0, radius: 30000 },
  "brecon-beacons": { lat: 51.9, lng: -3.4, radius: 25000 },
  "anglesey": { lat: 53.25, lng: -4.35, radius: 20000 },
  "gower": { lat: 51.6, lng: -4.1, radius: 15000 },
  "ceredigion": { lat: 52.3, lng: -4.0, radius: 30000 },
  "south-wales-valleys": { lat: 51.7, lng: -3.4, radius: 25000 },
  "north-wales-coast": { lat: 53.2, lng: -3.5, radius: 30000 },
  "wye-valley": { lat: 51.8, lng: -2.7, radius: 20000 },
};

interface PlaceResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  websiteUri?: string;
  internationalPhoneNumber?: string;
  location?: { latitude: number; longitude: number };
  primaryType?: string;
  regularOpeningHours?: any;
}

async function searchPlaces(query: string, regionSlug?: string): Promise<PlaceResult[]> {
  const body: any = {
    textQuery: query,
    languageCode: "en",
    regionCode: "GB",
    maxResultCount: 20,
  };

  // Add location bias if region specified
  if (regionSlug && regionCentres[regionSlug]) {
    const { lat, lng, radius } = regionCentres[regionSlug];
    body.locationBias = {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius,
      },
    };
  }

  try {
    const res = await fetch(PLACES_SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY!,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.websiteUri,places.internationalPhoneNumber,places.location,places.primaryType",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`  API error: ${res.status} — ${err.substring(0, 100)}`);
      return [];
    }

    const data = await res.json();
    return data.places || [];
  } catch (err: any) {
    console.error(`  Fetch error: ${err.message}`);
    return [];
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isInWales(address: string | undefined): boolean {
  if (!address) return false;
  const lower = address.toLowerCase();
  return (
    lower.includes("wales") ||
    lower.includes("cymru") ||
    lower.includes("gwynedd") ||
    lower.includes("pembrokeshire") ||
    lower.includes("ceredigion") ||
    lower.includes("powys") ||
    lower.includes("conwy") ||
    lower.includes("denbighshire") ||
    lower.includes("flintshire") ||
    lower.includes("wrexham") ||
    lower.includes("anglesey") ||
    lower.includes("carmarthenshire") ||
    lower.includes("swansea") ||
    lower.includes("neath") ||
    lower.includes("bridgend") ||
    lower.includes("cardiff") ||
    lower.includes("newport") ||
    lower.includes("monmouthshire") ||
    lower.includes("torfaen") ||
    lower.includes("blaenau") ||
    lower.includes("caerphilly") ||
    lower.includes("merthyr") ||
    lower.includes("rhondda") ||
    lower.includes("vale of glamorgan") ||
    // Postcodes
    /\b(sa|ll|ld|sy|cf|np|hr)\d/i.test(lower)
  );
}

function guessRegion(address: string | undefined, lat?: number, lng?: number): string | null {
  if (!address) return null;
  const lower = address.toLowerCase();

  if (lower.includes("pembrokeshire") || lower.includes("haverfordwest") || lower.includes("tenby") || lower.includes("st davids")) return "pembrokeshire";
  if (lower.includes("gwynedd") || lower.includes("snowdon") || lower.includes("betws") || lower.includes("llanberis") || lower.includes("beddgelert") || lower.includes("blaenau ffestiniog")) return "snowdonia";
  if (lower.includes("anglesey") || lower.includes("ynys mon") || lower.includes("holyhead") || lower.includes("beaumaris")) return "anglesey";
  if (lower.includes("conwy") || lower.includes("llandudno") || lower.includes("colwyn") || lower.includes("rhyl") || lower.includes("prestatyn") || lower.includes("denbighshire") || lower.includes("flintshire")) return "north-wales-coast";
  if (lower.includes("brecon") || lower.includes("powys") || lower.includes("crickhowell") || lower.includes("abergavenny")) return "brecon-beacons";
  if (lower.includes("swansea") || lower.includes("gower") || lower.includes("mumbles")) return "gower";
  if (lower.includes("ceredigion") || lower.includes("aberystwyth") || lower.includes("cardigan") || lower.includes("new quay")) return "ceredigion";
  if (lower.includes("monmouth") || lower.includes("chepstow") || lower.includes("tintern")) return "wye-valley";
  if (lower.includes("merthyr") || lower.includes("rhondda") || lower.includes("caerphilly") || lower.includes("blaenau gwent") || lower.includes("pontypridd")) return "south-wales-valleys";

  return null;
}

async function main() {
  // Load existing operators for dedup
  const existingOps = await db.select({ name: operators.name, slug: operators.slug }).from(operators);
  const existingSlugs = new Set(existingOps.map((o) => o.slug));
  const existingNames = new Set(existingOps.map((o) => o.name.toLowerCase()));

  // Load regions and activity types for FK lookups
  const allRegions = await db.select().from(regions);
  const allTypes = await db.select().from(activityTypes);
  const regionMap = Object.fromEntries(allRegions.map((r) => [r.slug, r.id]));
  const typeMap = Object.fromEntries(allTypes.map((t) => [t.slug, t.id]));

  const typesToSearch = typeFilter ? [typeFilter] : Object.keys(searchQueries);
  
  let totalFound = 0;
  let totalNew = 0;
  let totalSkipped = 0;
  const newOperators: any[] = [];

  for (const typeSlug of typesToSearch) {
    const queries = searchQueries[typeSlug];
    if (!queries) {
      console.log(`Unknown type: ${typeSlug}`);
      continue;
    }

    console.log(`\n🔍 Searching: ${typeSlug}`);
    console.log("─".repeat(50));

    for (const query of queries) {
      const places = await searchPlaces(query, regionFilter || undefined);
      
      for (const place of places) {
        totalFound++;
        const name = place.displayName?.text || "";
        const slug = slugify(name);

        // Skip if not in Wales
        if (!isInWales(place.formattedAddress)) {
          continue;
        }

        // Skip if already exists
        if (existingSlugs.has(slug) || existingNames.has(name.toLowerCase())) {
          continue;
        }

        // Skip low-rated or no-rating places
        if (!place.rating || place.rating < 3.5) {
          continue;
        }

        const regionSlug = guessRegion(place.formattedAddress, place.location?.latitude, place.location?.longitude);
        const regionId = regionSlug ? regionMap[regionSlug] : null;

        const op = {
          name,
          slug,
          type: "primary" as const,
          category: "activity_provider" as const,
          website: place.websiteUri || null,
          phone: place.internationalPhoneNumber || null,
          address: place.formattedAddress || null,
          lat: place.location?.latitude ? String(place.location.latitude) : null,
          lng: place.location?.longitude ? String(place.location.longitude) : null,
          googleRating: place.rating ? String(place.rating) : null,
          reviewCount: place.userRatingCount || null,
          claimStatus: "stub" as const,
          googlePlaceId: place.id || null,
          siteId: 1,
          regionSlug,
          regionId,
          activityType: typeSlug,
          activityTypeId: typeMap[typeSlug] || null,
        };

        // Dedup within this run
        if (existingSlugs.has(slug)) continue;
        existingSlugs.add(slug);
        existingNames.add(name.toLowerCase());

        newOperators.push(op);
        totalNew++;

        if (DRY_RUN) {
          console.log(`  🆕 ${name} — ${place.rating}⭐ (${place.userRatingCount}) — ${regionSlug || "unknown region"}`);
          console.log(`     ${place.formattedAddress}`);
          console.log(`     ${place.websiteUri || "no website"}`);
        }
      }

      await sleep(DELAY_MS);
    }
  }

  if (!DRY_RUN && newOperators.length > 0) {
    console.log(`\n📝 Inserting ${newOperators.length} new operators...`);
    
    for (const op of newOperators) {
      try {
        const [inserted] = await db.insert(operators).values({
          siteId: 1,
          name: op.name,
          slug: op.slug,
          type: op.type,
          category: op.category,
          website: op.website,
          phone: op.phone,
          address: op.address,
          lat: op.lat,
          lng: op.lng,
          googleRating: op.googleRating,
          reviewCount: op.reviewCount,
          claimStatus: op.claimStatus,
          dataSource: "google_places",
          lastVerifiedAt: new Date(),
          googlePlaceId: op.googlePlaceId || null,
          serviceTypes: [op.activityType],
          regions: op.regionSlug ? [op.regionSlug] : [],
          activityTypes: [op.activityType],
        }).returning({ id: operators.id });

        console.log(`  ✅ ${op.name} (id: ${inserted.id}) — ${op.regionSlug}`);
      } catch (err: any) {
        console.error(`  ❌ ${op.name}: ${err.message.substring(0, 80)}`);
      }
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Total places found: ${totalFound}`);
  console.log(`New operators: ${totalNew}`);
  console.log(`${DRY_RUN ? "(DRY RUN — nothing inserted)" : `Inserted: ${totalNew}`}`);

  process.exit(0);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main();
