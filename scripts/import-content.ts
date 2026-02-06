import "dotenv/config";
import { sql } from "@vercel/postgres";
import * as fs from "fs";
import * as path from "path";

// Simple CSV parser
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    return row;
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseGPS(coordStr: string): { lat: number | null; lng: number | null } {
  if (!coordStr) return { lat: null, lng: null };
  const match = coordStr.match(/([\d.-]+)\s*,\s*([\d.-]+)/);
  if (!match) return { lat: null, lng: null };
  return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
}

function parsePrice(priceStr: string): { from: number | null; to: number | null } {
  if (!priceStr) return { from: null, to: null };
  const match = priceStr.match(/(\d+)(?:\s*-\s*(\d+))?/);
  if (!match) return { from: null, to: null };
  return {
    from: parseInt(match[1]),
    to: match[2] ? parseInt(match[2]) : parseInt(match[1]),
  };
}

function parseRating(ratingStr: string): number | null {
  if (!ratingStr) return null;
  const match = ratingStr.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : null;
}

async function getRegionId(regionName: string): Promise<number | null> {
  const result = await sql`SELECT id FROM regions WHERE name = ${regionName} OR slug = ${slugify(regionName)} LIMIT 1`;
  return result.rows[0]?.id || null;
}

async function getSiteId(): Promise<number> {
  const result = await sql`SELECT id FROM sites WHERE domain = 'adventurewales.com' LIMIT 1`;
  return result.rows[0]?.id || 1;
}

async function importAccommodation() {
  console.log("\n🏨 Importing accommodation...");
  const contentDir = path.join(__dirname, "../content");
  const csvPath = path.join(contentDir, "accommodation.csv");
  
  if (!fs.existsSync(csvPath)) {
    console.log("   ⚠️ accommodation.csv not found, skipping");
    return;
  }

  const data = parseCSV(fs.readFileSync(csvPath, "utf-8"));
  const siteId = await getSiteId();
  let imported = 0;
  let skipped = 0;

  for (const row of data) {
    const regionId = await getRegionId(row["Region"]);
    if (!regionId) {
      console.log(`   ⚠️ Region not found: ${row["Region"]}, skipping ${row["Property Name"]}`);
      skipped++;
      continue;
    }

    const slug = slugify(row["Property Name"]);
    const price = parsePrice(row["Price/Night (£)"]);
    const rating = parseRating(row["Google Rating"]);

    try {
      await sql`
        INSERT INTO accommodation (site_id, region_id, name, slug, type, website, price_from, price_to, adventure_features, booking_url, airbnb_url, google_rating, description, status)
        VALUES (
          ${siteId}, ${regionId}, ${row["Property Name"]}, ${slug}, ${row["Type"]}, 
          ${row["Website"] || null}, ${price.from}, ${price.to},
          ${row["Adventure Features"] || null}, ${row["Booking.com URL"] || null}, 
          ${row["Airbnb URL"] === "N/A" ? null : row["Airbnb URL"]}, ${rating},
          ${row["description"] || null}, 'published'
        )
        ON CONFLICT (slug) DO UPDATE SET
          description = EXCLUDED.description,
          adventure_features = EXCLUDED.adventure_features,
          price_from = EXCLUDED.price_from,
          price_to = EXCLUDED.price_to
      `;
      imported++;
    } catch (e: any) {
      console.log(`   ❌ Error importing ${row["Property Name"]}: ${e.message}`);
      skipped++;
    }
  }
  console.log(`   ✅ Imported ${imported}, skipped ${skipped}`);
}

async function importLocations() {
  console.log("\n📍 Importing locations...");
  const contentDir = path.join(__dirname, "../content");
  const csvPath = path.join(contentDir, "locations.csv");
  
  if (!fs.existsSync(csvPath)) {
    console.log("   ⚠️ locations.csv not found, skipping");
    return;
  }

  const data = parseCSV(fs.readFileSync(csvPath, "utf-8"));
  const siteId = await getSiteId();
  let imported = 0;
  let skipped = 0;

  for (const row of data) {
    const regionId = await getRegionId(row["Region"]);
    if (!regionId) {
      console.log(`   ⚠️ Region not found: ${row["Region"]}, skipping ${row["Location Name"]}`);
      skipped++;
      continue;
    }

    const slug = slugify(row["Location Name"]);
    const coords = parseGPS(row["GPS Coordinates"]);

    try {
      await sql`
        INSERT INTO locations (site_id, region_id, name, slug, description, lat, lng, parking_info, facilities, access_notes, best_time, crowd_level, status)
        VALUES (
          ${siteId}, ${regionId}, ${row["Location Name"]}, ${slug},
          ${row["description"] || row["Activities Available"] || null},
          ${coords.lat}, ${coords.lng},
          ${row["Parking Info"] || null}, ${row["facilities"] || row["Facilities"] || null},
          ${row["Access Notes"] || null}, ${row["Best Time to Visit"] || null},
          ${row["Crowd Level"] || null}, 'published'
        )
        ON CONFLICT (slug) DO UPDATE SET
          description = EXCLUDED.description,
          lat = EXCLUDED.lat,
          lng = EXCLUDED.lng,
          parking_info = EXCLUDED.parking_info,
          facilities = EXCLUDED.facilities
      `;
      imported++;
    } catch (e: any) {
      console.log(`   ❌ Error importing ${row["Location Name"]}: ${e.message}`);
      skipped++;
    }
  }
  console.log(`   ✅ Imported ${imported}, skipped ${skipped}`);
}

async function importEvents() {
  console.log("\n🎪 Importing events...");
  const contentDir = path.join(__dirname, "../content");
  const eventsDir = path.join(contentDir, "events");
  
  // Collect all event CSV files
  const files: string[] = [];

  // Check for main events.csv
  const mainEventsPath = path.join(contentDir, "events.csv");
  if (fs.existsSync(mainEventsPath)) {
    files.push(mainEventsPath);
  }

  // Check for CSVs in events subdirectory
  if (fs.existsSync(eventsDir)) {
    const eventFiles = fs.readdirSync(eventsDir).filter(f => f.endsWith(".csv"));
    eventFiles.forEach(f => files.push(path.join(eventsDir, f)));
  }

  if (files.length === 0) {
    console.log("   ⚠️ No event CSV files found, skipping");
    return;
  }

  const siteId = await getSiteId();
  let imported = 0;
  let skipped = 0;

  for (const filePath of files) {
    console.log(`   📄 Processing ${path.relative(contentDir, filePath)}...`);
    const data = parseCSV(fs.readFileSync(filePath, "utf-8"));

    for (const row of data) {
      const regionId = await getRegionId(row["Region"]);
      if (!regionId) {
        console.log(`   ⚠️ Region not found: ${row["Region"]}, skipping ${row["Event Name"]}`);
        skipped++;
        continue;
      }

      const slug = slugify(row["Event Name"]);
      const cost = parsePrice(row["Registration Cost (£)"]);

      try {
        await sql`
          INSERT INTO events (site_id, region_id, name, slug, type, description, month_typical, location, website, registration_cost, capacity, status)
          VALUES (
            ${siteId}, ${regionId}, ${row["Event Name"]}, ${slug}, ${row["Type"]},
            ${row["description"] || row["Description"] || null},
            ${row["Date(s)/Month"] || null}, ${row["Location"] || null},
            ${row["Website"] || null}, ${cost.from},
            ${row["Participant Capacity"] || null}, 'published'
          )
          ON CONFLICT (slug) DO UPDATE SET
            description = EXCLUDED.description,
            month_typical = EXCLUDED.month_typical,
            registration_cost = EXCLUDED.registration_cost
        `;
        imported++;
      } catch (e: any) {
        console.log(`   ❌ Error importing ${row["Event Name"]}: ${e.message}`);
        skipped++;
      }
    }
  }
  console.log(`   ✅ Imported ${imported}, skipped ${skipped}`);
}

async function importTransport() {
  console.log("\n🚃 Importing transport...");
  const contentDir = path.join(__dirname, "../content");
  const csvPath = path.join(contentDir, "transport.csv");
  
  if (!fs.existsSync(csvPath)) {
    console.log("   ⚠️ transport.csv not found, skipping");
    return;
  }

  const data = parseCSV(fs.readFileSync(csvPath, "utf-8"));
  const siteId = await getSiteId();
  let imported = 0;
  let skipped = 0;

  for (const row of data) {
    const regionId = await getRegionId(row["Region Covered"]);
    if (!regionId) {
      console.log(`   ⚠️ Region not found: ${row["Region Covered"]}, skipping ${row["Name/Route"]}`);
      skipped++;
      continue;
    }

    const slug = slugify(`${row["Service Type"]}-${row["Name/Route"]}`);

    try {
      await sql`
        INSERT INTO transport (site_id, region_id, type, name, route, stops, frequency, season, cost, website, notes)
        VALUES (
          ${siteId}, ${regionId}, ${row["Service Type"]}, ${row["Name/Route"]}, ${row["Name/Route"]},
          ${row["Stops/Locations"] || null}, ${row["Frequency"] || null},
          ${row["Season"] || null}, ${row["Cost (£)"] || null},
          ${row["Website"] || null}, ${row["description"] || row["Notes"] || null}
        )
        ON CONFLICT DO NOTHING
      `;
      imported++;
    } catch (e: any) {
      console.log(`   ❌ Error importing ${row["Name/Route"]}: ${e.message}`);
      skipped++;
    }
  }
  console.log(`   ✅ Imported ${imported}, skipped ${skipped}`);
}

async function importCommercialPartners() {
  console.log("\n🤝 Importing commercial partners...");
  const contentDir = path.join(__dirname, "../content");
  const csvPath = path.join(contentDir, "commercial-partners.csv");
  
  if (!fs.existsSync(csvPath)) {
    console.log("   ⚠️ commercial-partners.csv not found, skipping");
    return;
  }

  const data = parseCSV(fs.readFileSync(csvPath, "utf-8"));
  const siteId = await getSiteId();
  let imported = 0;

  for (const row of data) {
    const slug = slugify(row["Partner Name"] || row["Name"] || "partner");
    
    try {
      await sql`
        INSERT INTO advertisers (site_id, name, contact_email, website, status)
        VALUES (${siteId}, ${row["Company Name"]}, ${row["Contact/Apply URL"] || null}, ${row["Website"] || null}, 'published')
        ON CONFLICT DO NOTHING
      `;
      imported++;
    } catch (e: any) {
      console.log(`   ❌ Error importing partner: ${e.message}`);
    }
  }
  console.log(`   ✅ Imported ${imported} partners`);
}

async function importAnswers() {
  console.log("\n❓ Importing FAQ answers...");
  const contentDir = path.join(__dirname, "../content/answers");
  
  if (!fs.existsSync(contentDir)) {
    console.log("   ⚠️ answers directory not found, skipping");
    return;
  }

  const siteId = await getSiteId();
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith(".md"));
  let imported = 0;

  for (const file of files) {
    const content = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (!frontmatterMatch) continue;

    const frontmatter = frontmatterMatch[1];
    const body = frontmatterMatch[2];

    const slugMatch = frontmatter.match(/slug:\s*["']?([^"'\n]+)/);
    const questionMatch = frontmatter.match(/question:\s*["']?([^"'\n]+)/);
    const regionMatch = frontmatter.match(/region:\s*["']?([^"'\n]+)/);

    if (!slugMatch || !questionMatch) continue;

    const slug = slugMatch[1].trim();
    const question = questionMatch[1].trim();
    const regionSlug = regionMatch ? regionMatch[1].trim() : null;
    
    const regionId = regionSlug && regionSlug !== "general" ? await getRegionId(regionSlug) : null;

    // Extract quick answer (first paragraph after # heading)
    const quickAnswerMatch = body.match(/## Quick Answer\n\n([^\n]+)/);
    const quickAnswer = quickAnswerMatch ? quickAnswerMatch[1] : null;

    try {
      await sql`
        INSERT INTO answers (site_id, region_id, question, slug, quick_answer, full_content, status)
        VALUES (${siteId}, ${regionId}, ${question}, ${slug}, ${quickAnswer}, ${body}, 'published')
        ON CONFLICT (slug) DO UPDATE SET
          full_content = EXCLUDED.full_content,
          quick_answer = EXCLUDED.quick_answer
      `;
      imported++;
    } catch (e: any) {
      console.log(`   ❌ Error importing ${slug}: ${e.message}`);
    }
  }
  console.log(`   ✅ Imported ${imported} answers`);
}

async function main() {
  console.log("📦 Starting content import...\n");
  
  await importAccommodation();
  await importLocations();
  await importEvents();
  await importTransport();
  await importCommercialPartners();
  await importAnswers();

  console.log("\n✅ Content import complete!");
}

main().catch(console.error);
