/**
 * Unified content importer.
 *
 * Reads CSVs in /content and upserts them into the database.
 *
 * Order: activity types → activities → operators → locations → accommodation
 *        → events → transport → food (skipped — no dedicated table).
 *
 * Idempotent: re-running updates existing rows (matched on slug + site_id)
 * rather than duplicating. Empty/incomplete rows are skipped with a reason.
 *
 * Usage:
 *   npx tsx scripts/import-all.ts                # import everything
 *   npx tsx scripts/import-all.ts activities     # import a single section
 *   npx tsx scripts/import-all.ts --dry-run      # parse + validate only
 */

import { config as loadEnv } from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Prefer .env.local (Vercel-style local override) over .env.
// Load BEFORE importing ./sql so it sees the correct DATABASE_URL.
loadEnv({ path: ".env.local" });
loadEnv();

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { sql } = require("./sql") as typeof import("./sql");

// =========================================================================
// CSV parsing
// =========================================================================

function parseCSV(content: string): Record<string, string>[] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    const next = content[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        current.push(field);
        field = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && next === "\n") i++;
        current.push(field);
        rows.push(current);
        current = [];
        field = "";
      } else {
        field += ch;
      }
    }
  }
  if (field.length > 0 || current.length > 0) {
    current.push(field);
    rows.push(current);
  }

  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows
    .slice(1)
    .filter((row) => row.some((c) => c.trim().length > 0))
    .map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = (row[i] ?? "").trim();
      });
      return obj;
    });
}

// =========================================================================
// Helpers
// =========================================================================

const CONTENT_DIR = path.join(__dirname, "..", "content");
const DRY_RUN = process.argv.includes("--dry-run");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function nullable(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toUpperCase() === "N/A") return null;
  return trimmed;
}

function parsePrice(value: string | undefined): { from: number | null; to: number | null } {
  if (!value) return { from: null, to: null };
  const lower = value.toLowerCase();
  if (lower.includes("free")) return { from: 0, to: 0 };
  const match = value.match(/(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?/);
  if (!match) return { from: null, to: null };
  const from = parseFloat(match[1]);
  return {
    from,
    to: match[2] ? parseFloat(match[2]) : from,
  };
}

function parseRating(value: string | undefined): number | null {
  if (!value) return null;
  const match = value.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

function parseGPS(value: string | undefined): { lat: number | null; lng: number | null } {
  if (!value) return { lat: null, lng: null };
  const match = value.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return { lat: null, lng: null };
  return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
}

interface Stats {
  inserted: number;
  updated: number;
  skipped: number;
  errors: number;
}

function emptyStats(): Stats {
  return { inserted: 0, updated: 0, skipped: 0, errors: 0 };
}

function logStats(label: string, stats: Stats) {
  console.log(
    `   📊 ${label}: ${stats.inserted} inserted, ${stats.updated} updated, ${stats.skipped} skipped, ${stats.errors} errors`,
  );
}

// =========================================================================
// Reference lookups (cached per run)
// =========================================================================

let cachedSiteId: number | null = null;
async function getSiteId(): Promise<number> {
  if (cachedSiteId !== null) return cachedSiteId;
  const result = await sql<{ id: number }>`
    SELECT id FROM sites
    WHERE domain IN ('adventurewales.com', 'adventurewales.co.uk')
    ORDER BY id
    LIMIT 1
  `;
  if (!result.rows[0]) {
    throw new Error(
      "No site row found. Seed sites first (npm run db:seed) before running import-all.",
    );
  }
  cachedSiteId = result.rows[0].id;
  return cachedSiteId;
}

const regionCache = new Map<string, number>();
async function getRegionId(regionName: string): Promise<number | null> {
  if (!regionName) return null;
  const key = regionName.toLowerCase().trim();
  if (regionCache.has(key)) return regionCache.get(key)!;

  const slug = slugify(regionName);
  const result = await sql<{ id: number }>`
    SELECT id FROM regions
    WHERE LOWER(name) = ${key}
       OR slug = ${slug}
    LIMIT 1
  `;
  const id = result.rows[0]?.id ?? null;
  if (id !== null) regionCache.set(key, id);
  return id;
}

const activityTypeCache = new Map<string, number>();
async function getActivityTypeId(name: string, siteId: number): Promise<number | null> {
  if (!name) return null;
  const key = name.toLowerCase().trim();
  if (activityTypeCache.has(key)) return activityTypeCache.get(key)!;

  const slug = slugify(name);
  const existing = await sql<{ id: number }>`
    SELECT id FROM activity_types
    WHERE site_id = ${siteId} AND (LOWER(name) = ${key} OR slug = ${slug})
    LIMIT 1
  `;
  if (existing.rows[0]) {
    activityTypeCache.set(key, existing.rows[0].id);
    return existing.rows[0].id;
  }

  if (DRY_RUN) return null;
  const inserted = await sql<{ id: number }>`
    INSERT INTO activity_types (site_id, name, slug)
    VALUES (${siteId}, ${name}, ${slug})
    RETURNING id
  `;
  const id = inserted.rows[0].id;
  activityTypeCache.set(key, id);
  return id;
}

async function getOperatorId(name: string, siteId: number): Promise<number | null> {
  if (!name) return null;
  const slug = slugify(name);
  const result = await sql<{ id: number }>`
    SELECT id FROM operators
    WHERE site_id = ${siteId} AND (LOWER(name) = ${name.toLowerCase()} OR slug = ${slug})
    LIMIT 1
  `;
  return result.rows[0]?.id ?? null;
}

// =========================================================================
// Importers
// =========================================================================

async function importOperators(): Promise<Stats> {
  console.log("\n🏢 Importing operators...");
  const stats = emptyStats();
  const csvPath = path.join(CONTENT_DIR, "operators.csv");
  if (!fs.existsSync(csvPath)) {
    console.log("   ⚠️ operators.csv not found, skipping");
    return stats;
  }

  const rows = parseCSV(fs.readFileSync(csvPath, "utf-8"));
  const siteId = await getSiteId();

  for (const row of rows) {
    const name = row["Business Name"] || row["Name"];
    if (!name) {
      stats.skipped++;
      continue;
    }
    const slug = slugify(name);

    try {
      const existing = await sql<{ id: number }>`
        SELECT id FROM operators WHERE site_id = ${siteId} AND slug = ${slug} LIMIT 1
      `;

      const website = nullable(row["Website"]);
      const email = nullable(row["Contact Email"]);
      const phone = nullable(row["Phone"]);
      const address = nullable(row["Physical Address"]);
      const description = nullable(row["description"]);
      const tagline = nullable(row["tagline"]);
      const tripadvisorUrl = nullable(row["TripAdvisor URL"]);
      const googleRating = parseRating(row["Google Rating"]);
      // operators.price_range is varchar(10); truncate gracefully
      const priceRangeRaw = nullable(row["Price Range"]);
      const priceRange = priceRangeRaw ? priceRangeRaw.slice(0, 10) : null;
      const usp = nullable(row["unique_selling_point"] || row["Unique Selling Point"]);
      const logoUrl = nullable(row["logo_url"]);
      const regions = row["Regions Covered"]
        ? row["Regions Covered"].split(",").map((r) => r.trim()).filter(Boolean)
        : null;
      const activityTypes = row["Activities Offered"]
        ? row["Activities Offered"].split(",").map((a) => a.trim()).filter(Boolean)
        : null;

      if (DRY_RUN) {
        stats.skipped++;
        continue;
      }

      if (existing.rows[0]) {
        await sql`
          UPDATE operators SET
            website = COALESCE(${website}, website),
            email = COALESCE(${email}, email),
            phone = COALESCE(${phone}, phone),
            address = COALESCE(${address}, address),
            description = COALESCE(${description}, description),
            tagline = COALESCE(${tagline}, tagline),
            tripadvisor_url = COALESCE(${tripadvisorUrl}, tripadvisor_url),
            google_rating = COALESCE(${googleRating}, google_rating),
            price_range = COALESCE(${priceRange}, price_range),
            unique_selling_point = COALESCE(${usp}, unique_selling_point),
            logo_url = COALESCE(${logoUrl}, logo_url),
            regions = COALESCE(${regions}, regions),
            activity_types = COALESCE(${activityTypes}, activity_types),
            updated_at = NOW()
          WHERE id = ${existing.rows[0].id}
        `;
        stats.updated++;
      } else {
        await sql`
          INSERT INTO operators (
            site_id, name, slug, website, email, phone, address,
            description, tagline, tripadvisor_url, google_rating,
            price_range, unique_selling_point, logo_url, regions, activity_types
          ) VALUES (
            ${siteId}, ${name}, ${slug}, ${website}, ${email}, ${phone}, ${address},
            ${description}, ${tagline}, ${tripadvisorUrl}, ${googleRating},
            ${priceRange}, ${usp}, ${logoUrl}, ${regions}, ${activityTypes}
          )
        `;
        stats.inserted++;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.log(`   ❌ ${name}: ${message}`);
      stats.errors++;
    }
  }

  logStats("operators", stats);
  return stats;
}

async function importActivities(): Promise<Stats> {
  console.log("\n🎢 Importing activities...");
  const stats = emptyStats();
  const csvPath = path.join(CONTENT_DIR, "activities.csv");
  if (!fs.existsSync(csvPath)) {
    console.log("   ⚠️ activities.csv not found, skipping");
    return stats;
  }

  const rows = parseCSV(fs.readFileSync(csvPath, "utf-8"));
  const siteId = await getSiteId();

  for (const row of rows) {
    const name = row["Activity Name"];
    if (!name) {
      stats.skipped++;
      continue;
    }
    const slug = slugify(name);

    const regionId = await getRegionId(row["Region"]);
    if (!regionId) {
      console.log(`   ⚠️ Region not found (${row["Region"]}) — skipping ${name}`);
      stats.skipped++;
      continue;
    }

    const activityTypeId = await getActivityTypeId(row["Type"], siteId);
    const operatorId = await getOperatorId(row["Operator"], siteId);

    const price = parsePrice(row["Price Range (£)"]);
    const meetingPoint = nullable(row["Location/Meeting Point"]);
    const duration = nullable(row["Duration"]);
    const difficulty = nullable(row["Difficulty"]);
    const season = nullable(row["Season"]);
    const minAgeRaw = nullable(row["Min Age"]);
    const minAge = minAgeRaw ? parseInt(minAgeRaw, 10) || null : null;
    const bookingUrl = nullable(row["Booking URL"]);
    const sourceUrl = nullable(row["Source URL"]);

    let description = nullable(row["description"]) ?? "";
    const extras: string[] = [];
    if (row["best_for"]) extras.push(`**Best for:** ${row["best_for"].trim()}`);
    if (row["skip_if"]) extras.push(`**Skip if:** ${row["skip_if"].trim()}`);
    if (row["local_tip"]) extras.push(`**Local tip:** ${row["local_tip"].trim()}`);
    if (row["highlights"]) {
      const items = row["highlights"].split(",").map((h) => `• ${h.trim()}`).join("\n");
      extras.push(`**Highlights:**\n${items}`);
    }
    if (row["whats_included"]) {
      const items = row["whats_included"].split(",").map((h) => `• ${h.trim()}`).join("\n");
      extras.push(`**What's included:**\n${items}`);
    }
    if (row["requirements"]) {
      const items = row["requirements"].split(",").map((h) => `• ${h.trim()}`).join("\n");
      extras.push(`**Requirements:**\n${items}`);
    }
    if (extras.length > 0) {
      description = `${description}\n\n${extras.join("\n\n")}`.trim();
    }
    const finalDescription = description.length > 0 ? description : null;

    if (DRY_RUN) {
      stats.skipped++;
      continue;
    }

    try {
      const existing = await sql<{ id: number }>`
        SELECT id FROM activities WHERE site_id = ${siteId} AND slug = ${slug} LIMIT 1
      `;

      if (existing.rows[0]) {
        await sql`
          UPDATE activities SET
            region_id = COALESCE(${regionId}, region_id),
            operator_id = COALESCE(${operatorId}, operator_id),
            activity_type_id = COALESCE(${activityTypeId}, activity_type_id),
            description = COALESCE(${finalDescription}, description),
            meeting_point = COALESCE(${meetingPoint}, meeting_point),
            price_from = COALESCE(${price.from}, price_from),
            price_to = COALESCE(${price.to}, price_to),
            duration = COALESCE(${duration}, duration),
            difficulty = COALESCE(${difficulty}, difficulty),
            min_age = COALESCE(${minAge}, min_age),
            season = COALESCE(${season}, season),
            booking_url = COALESCE(${bookingUrl}, booking_url),
            source_url = COALESCE(${sourceUrl}, source_url),
            updated_at = NOW()
          WHERE id = ${existing.rows[0].id}
        `;
        stats.updated++;
      } else {
        await sql`
          INSERT INTO activities (
            site_id, region_id, operator_id, activity_type_id,
            name, slug, description, meeting_point,
            price_from, price_to, duration, difficulty, min_age,
            season, booking_url, source_url, status
          ) VALUES (
            ${siteId}, ${regionId}, ${operatorId}, ${activityTypeId},
            ${name}, ${slug}, ${finalDescription}, ${meetingPoint},
            ${price.from}, ${price.to}, ${duration}, ${difficulty}, ${minAge},
            ${season}, ${bookingUrl}, ${sourceUrl}, 'published'
          )
        `;
        stats.inserted++;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.log(`   ❌ ${name}: ${message}`);
      stats.errors++;
    }
  }

  logStats("activities", stats);
  return stats;
}

async function importLocations(): Promise<Stats> {
  console.log("\n📍 Importing locations...");
  const stats = emptyStats();
  const csvPath = path.join(CONTENT_DIR, "locations.csv");
  if (!fs.existsSync(csvPath)) {
    console.log("   ⚠️ locations.csv not found, skipping");
    return stats;
  }

  const rows = parseCSV(fs.readFileSync(csvPath, "utf-8"));
  const siteId = await getSiteId();

  for (const row of rows) {
    const name = row["Location Name"];
    if (!name) {
      stats.skipped++;
      continue;
    }
    const slug = slugify(name);

    const regionId = await getRegionId(row["Region"]);
    if (!regionId) {
      console.log(`   ⚠️ Region not found (${row["Region"]}) — skipping ${name}`);
      stats.skipped++;
      continue;
    }

    const coords = parseGPS(row["GPS Coordinates"]);
    const description = nullable(row["description"]) ?? nullable(row["Activities Available"]);
    const parkingInfo = nullable(row["Parking Info"]);
    const facilities = nullable(row["facilities"]) ?? nullable(row["Facilities"]);
    const accessNotes = nullable(row["Access Notes"]);
    const bestTime = nullable(row["Best Time to Visit"]);
    const crowdLevel = nullable(row["Crowd Level"]);

    if (DRY_RUN) {
      stats.skipped++;
      continue;
    }

    try {
      const existing = await sql<{ id: number }>`
        SELECT id FROM locations WHERE site_id = ${siteId} AND slug = ${slug} LIMIT 1
      `;
      if (existing.rows[0]) {
        await sql`
          UPDATE locations SET
            region_id = COALESCE(${regionId}, region_id),
            description = COALESCE(${description}, description),
            lat = COALESCE(${coords.lat}, lat),
            lng = COALESCE(${coords.lng}, lng),
            parking_info = COALESCE(${parkingInfo}, parking_info),
            facilities = COALESCE(${facilities}, facilities),
            access_notes = COALESCE(${accessNotes}, access_notes),
            best_time = COALESCE(${bestTime}, best_time),
            crowd_level = COALESCE(${crowdLevel}, crowd_level)
          WHERE id = ${existing.rows[0].id}
        `;
        stats.updated++;
      } else {
        await sql`
          INSERT INTO locations (
            site_id, region_id, name, slug, description,
            lat, lng, parking_info, facilities, access_notes,
            best_time, crowd_level, status
          ) VALUES (
            ${siteId}, ${regionId}, ${name}, ${slug}, ${description},
            ${coords.lat}, ${coords.lng}, ${parkingInfo}, ${facilities}, ${accessNotes},
            ${bestTime}, ${crowdLevel}, 'published'
          )
        `;
        stats.inserted++;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.log(`   ❌ ${name}: ${message}`);
      stats.errors++;
    }
  }

  logStats("locations", stats);
  return stats;
}

async function importAccommodation(): Promise<Stats> {
  console.log("\n🏨 Importing accommodation...");
  const stats = emptyStats();
  const csvPath = path.join(CONTENT_DIR, "accommodation.csv");
  if (!fs.existsSync(csvPath)) {
    console.log("   ⚠️ accommodation.csv not found, skipping");
    return stats;
  }

  const rows = parseCSV(fs.readFileSync(csvPath, "utf-8"));
  const siteId = await getSiteId();

  for (const row of rows) {
    const name = row["Property Name"];
    if (!name) {
      stats.skipped++;
      continue;
    }
    const slug = slugify(name);

    const regionId = await getRegionId(row["Region"]);
    if (!regionId) {
      console.log(`   ⚠️ Region not found (${row["Region"]}) — skipping ${name}`);
      stats.skipped++;
      continue;
    }

    const price = parsePrice(row["Price/Night (£)"]);
    const rating = parseRating(row["Google Rating"]);
    const type = nullable(row["Type"]);
    const website = nullable(row["Website"]);
    const features = nullable(row["Adventure Features"]);
    const bookingUrl = nullable(row["Booking.com URL"]);
    const airbnbUrl = nullable(row["Airbnb URL"]);
    const description = nullable(row["description"]);

    if (DRY_RUN) {
      stats.skipped++;
      continue;
    }

    try {
      const existing = await sql<{ id: number }>`
        SELECT id FROM accommodation WHERE site_id = ${siteId} AND slug = ${slug} LIMIT 1
      `;
      if (existing.rows[0]) {
        await sql`
          UPDATE accommodation SET
            region_id = COALESCE(${regionId}, region_id),
            type = COALESCE(${type}, type),
            website = COALESCE(${website}, website),
            price_from = COALESCE(${price.from}, price_from),
            price_to = COALESCE(${price.to}, price_to),
            adventure_features = COALESCE(${features}, adventure_features),
            booking_url = COALESCE(${bookingUrl}, booking_url),
            airbnb_url = COALESCE(${airbnbUrl}, airbnb_url),
            google_rating = COALESCE(${rating}, google_rating),
            description = COALESCE(${description}, description)
          WHERE id = ${existing.rows[0].id}
        `;
        stats.updated++;
      } else {
        await sql`
          INSERT INTO accommodation (
            site_id, region_id, name, slug, type, website,
            price_from, price_to, adventure_features,
            booking_url, airbnb_url, google_rating, description, status
          ) VALUES (
            ${siteId}, ${regionId}, ${name}, ${slug}, ${type}, ${website},
            ${price.from}, ${price.to}, ${features},
            ${bookingUrl}, ${airbnbUrl}, ${rating}, ${description}, 'published'
          )
        `;
        stats.inserted++;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.log(`   ❌ ${name}: ${message}`);
      stats.errors++;
    }
  }

  logStats("accommodation", stats);
  return stats;
}

async function importEvents(): Promise<Stats> {
  console.log("\n🎪 Importing events...");
  const stats = emptyStats();
  const files: string[] = [];

  const mainCsv = path.join(CONTENT_DIR, "events.csv");
  if (fs.existsSync(mainCsv)) files.push(mainCsv);

  const eventsDir = path.join(CONTENT_DIR, "events");
  if (fs.existsSync(eventsDir)) {
    for (const f of fs.readdirSync(eventsDir)) {
      if (f.endsWith(".csv")) files.push(path.join(eventsDir, f));
    }
  }

  if (files.length === 0) {
    console.log("   ⚠️ No event CSVs found, skipping");
    return stats;
  }

  const siteId = await getSiteId();

  for (const file of files) {
    console.log(`   📄 ${path.relative(CONTENT_DIR, file)}`);
    const rows = parseCSV(fs.readFileSync(file, "utf-8"));

    for (const row of rows) {
      const name = row["Event Name"];
      if (!name) {
        stats.skipped++;
        continue;
      }
      const slug = slugify(name);

      const regionId = await getRegionId(row["Region"]);
      if (!regionId) {
        console.log(`   ⚠️ Region not found (${row["Region"]}) — skipping ${name}`);
        stats.skipped++;
        continue;
      }

      const cost = parsePrice(row["Registration Cost (£)"]);
      const type = nullable(row["Type"]);
      const description = nullable(row["description"]) ?? nullable(row["Description"]);
      const monthTypical = nullable(row["Date(s)/Month"]);
      const location = nullable(row["Location"]);
      const website = nullable(row["Website"]);
      const capacityRaw = nullable(row["Participant Capacity"]);
      const capacity = capacityRaw && /^\d+/.test(capacityRaw) ? parseInt(capacityRaw, 10) : null;

      if (DRY_RUN) {
        stats.skipped++;
        continue;
      }

      try {
        const existing = await sql<{ id: number }>`
          SELECT id FROM events WHERE site_id = ${siteId} AND slug = ${slug} LIMIT 1
        `;
        if (existing.rows[0]) {
          await sql`
            UPDATE events SET
              region_id = COALESCE(${regionId}, region_id),
              type = COALESCE(${type}, type),
              description = COALESCE(${description}, description),
              month_typical = COALESCE(${monthTypical}, month_typical),
              location = COALESCE(${location}, location),
              website = COALESCE(${website}, website),
              registration_cost = COALESCE(${cost.from}, registration_cost),
              capacity = COALESCE(${capacity}, capacity)
            WHERE id = ${existing.rows[0].id}
          `;
          stats.updated++;
        } else {
          await sql`
            INSERT INTO events (
              site_id, region_id, name, slug, type, description,
              month_typical, location, website, registration_cost, capacity, status
            ) VALUES (
              ${siteId}, ${regionId}, ${name}, ${slug}, ${type}, ${description},
              ${monthTypical}, ${location}, ${website}, ${cost.from}, ${capacity}, 'published'
            )
          `;
          stats.inserted++;
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.log(`   ❌ ${name}: ${message}`);
        stats.errors++;
      }
    }
  }

  logStats("events", stats);
  return stats;
}

async function importTransport(): Promise<Stats> {
  console.log("\n🚌 Importing transport...");
  const stats = emptyStats();
  const csvPath = path.join(CONTENT_DIR, "transport.csv");
  if (!fs.existsSync(csvPath)) {
    console.log("   ⚠️ transport.csv not found, skipping");
    return stats;
  }

  const rows = parseCSV(fs.readFileSync(csvPath, "utf-8"));
  const siteId = await getSiteId();

  for (const row of rows) {
    const name = row["Name/Route"];
    const type = row["Service Type"];
    if (!name || !type) {
      stats.skipped++;
      continue;
    }

    const regionId = await getRegionId(row["Region Covered"]);
    if (!regionId) {
      console.log(`   ⚠️ Region not found (${row["Region Covered"]}) — skipping ${name}`);
      stats.skipped++;
      continue;
    }

    const stops = nullable(row["Stops/Locations"]);
    const frequency = nullable(row["Frequency"]);
    const season = nullable(row["Season"]);
    const cost = nullable(row["Cost (£)"]);
    const website = nullable(row["Website"]);
    const notes = nullable(row["description"]) ?? nullable(row["Notes"]);

    if (DRY_RUN) {
      stats.skipped++;
      continue;
    }

    try {
      const existing = await sql<{ id: number }>`
        SELECT id FROM transport
        WHERE site_id = ${siteId} AND region_id = ${regionId} AND type = ${type} AND name = ${name}
        LIMIT 1
      `;
      if (existing.rows[0]) {
        await sql`
          UPDATE transport SET
            stops = COALESCE(${stops}, stops),
            frequency = COALESCE(${frequency}, frequency),
            season = COALESCE(${season}, season),
            cost = COALESCE(${cost}, cost),
            website = COALESCE(${website}, website),
            notes = COALESCE(${notes}, notes)
          WHERE id = ${existing.rows[0].id}
        `;
        stats.updated++;
      } else {
        await sql`
          INSERT INTO transport (
            site_id, region_id, type, name, route, stops,
            frequency, season, cost, website, notes
          ) VALUES (
            ${siteId}, ${regionId}, ${type}, ${name}, ${name}, ${stops},
            ${frequency}, ${season}, ${cost}, ${website}, ${notes}
          )
        `;
        stats.inserted++;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.log(`   ❌ ${name}: ${message}`);
      stats.errors++;
    }
  }

  logStats("transport", stats);
  return stats;
}

async function importFood(): Promise<Stats> {
  console.log("\n🍻 Importing food (cafes & pubs) as locations...");
  const stats = emptyStats();
  const foodDir = path.join(CONTENT_DIR, "food");
  if (!fs.existsSync(foodDir)) {
    console.log("   ⚠️ content/food not found, skipping");
    return stats;
  }
  const siteId = await getSiteId();

  for (const file of fs.readdirSync(foodDir).filter((f) => f.endsWith(".csv"))) {
    const full = path.join(foodDir, file);
    const isCafe = file.includes("cafe");
    console.log(`   📄 ${file}`);
    const rows = parseCSV(fs.readFileSync(full, "utf-8"));

    for (const row of rows) {
      const name = isCafe ? row["name"] : row["Pub Name"];
      if (!name) {
        stats.skipped++;
        continue;
      }
      const regionName = isCafe ? row["region"] : row["Region"];
      const regionId = await getRegionId(regionName);
      if (!regionId) {
        console.log(`   ⚠️ Region not found (${regionName}) — skipping ${name}`);
        stats.skipped++;
        continue;
      }

      const slug = (isCafe && row["slug"]) || slugify(name);
      const facilitiesParts: string[] = [];
      if (isCafe) {
        if (row["dog_friendly"]) facilitiesParts.push(`Dog friendly: ${row["dog_friendly"]}`);
        if (row["outdoor_seating"]) facilitiesParts.push(`Outdoor seating: ${row["outdoor_seating"]}`);
        if (row["specialty"]) facilitiesParts.push(`Specialty: ${row["specialty"]}`);
      } else {
        if (row["Food Served"]) facilitiesParts.push(`Food: ${row["Food Served"]}`);
        if (row["Real Ale"]) facilitiesParts.push(`Real ale: ${row["Real Ale"]}`);
        if (row["Dog Friendly"]) facilitiesParts.push(`Dog friendly: ${row["Dog Friendly"]}`);
        if (row["Beer Garden"]) facilitiesParts.push(`Beer garden: ${row["Beer Garden"]}`);
        if (row["Sunday Roast"]) facilitiesParts.push(`Sunday roast: ${row["Sunday Roast"]}`);
      }
      const facilities = facilitiesParts.length > 0 ? facilitiesParts.join(" • ") : null;

      const lat = isCafe && row["lat"] ? parseFloat(row["lat"]) : null;
      const lng = isCafe && row["lon"] ? parseFloat(row["lon"]) : null;
      const description = nullable(row["description"]);
      const accessNotes = isCafe
        ? nullable(row["near_spots"]) && `Near: ${row["near_spots"]}`
        : nullable(row["Near Attraction"]) && `Near: ${row["Near Attraction"]}`;

      if (DRY_RUN) {
        stats.skipped++;
        continue;
      }

      try {
        const existing = await sql<{ id: number }>`
          SELECT id FROM locations WHERE site_id = ${siteId} AND slug = ${slug} LIMIT 1
        `;
        if (existing.rows[0]) {
          await sql`
            UPDATE locations SET
              region_id = COALESCE(${regionId}, region_id),
              description = COALESCE(${description}, description),
              lat = COALESCE(${lat}, lat),
              lng = COALESCE(${lng}, lng),
              facilities = COALESCE(${facilities}, facilities),
              access_notes = COALESCE(${accessNotes}, access_notes)
            WHERE id = ${existing.rows[0].id}
          `;
          stats.updated++;
        } else {
          await sql`
            INSERT INTO locations (
              site_id, region_id, name, slug, description,
              lat, lng, facilities, access_notes, status
            ) VALUES (
              ${siteId}, ${regionId}, ${name}, ${slug}, ${description},
              ${lat}, ${lng}, ${facilities}, ${accessNotes}, 'published'
            )
          `;
          stats.inserted++;
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.log(`   ❌ ${name}: ${message}`);
        stats.errors++;
      }
    }
  }

  logStats("food", stats);
  return stats;
}

// =========================================================================
// Entry point
// =========================================================================

const importers: Record<string, () => Promise<Stats>> = {
  operators: importOperators,
  activities: importActivities,
  locations: importLocations,
  accommodation: importAccommodation,
  events: importEvents,
  transport: importTransport,
  food: importFood,
};

// Pipeline order per goals/2-import-pipeline.md
const ORDER = [
  "operators",
  "activities",
  "locations",
  "accommodation",
  "events",
  "transport",
  "food",
];

async function main() {
  const targets = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const sections = targets.length > 0 ? targets : ORDER;

  console.log(`\n📦 Adventure Wales content import`);
  if (DRY_RUN) console.log(`   🧪 DRY RUN — no writes will be performed`);
  console.log(`   Sections: ${sections.join(" → ")}\n`);

  const totals = emptyStats();
  for (const section of sections) {
    const importer = importers[section];
    if (!importer) {
      console.log(`\n⚠️ Unknown section "${section}", skipping`);
      continue;
    }
    const stats = await importer();
    totals.inserted += stats.inserted;
    totals.updated += stats.updated;
    totals.skipped += stats.skipped;
    totals.errors += stats.errors;
  }

  console.log(`\n✅ Import complete`);
  logStats("TOTAL", totals);
  if (totals.errors > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error("\n❌ Import failed:", err);
  process.exit(1);
});
