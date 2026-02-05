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

function parseGPS(coordStr: string): { lat: number | null; lng: number | null } {
  if (!coordStr) return { lat: null, lng: null };
  const match = coordStr.match(/([\d.-]+)\s*,\s*([\d.-]+)/);
  if (!match) return { lat: null, lng: null };
  return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
}

async function seed() {
  console.log("🌱 Starting seed...\n");

  const dataDir = path.join(__dirname, "../data/wales");

  // 1. Create Adventure Wales site
  console.log("1️⃣ Creating site...");
  const siteResult = await sql`
    INSERT INTO sites (domain, name, tagline, primary_color, accent_color)
    VALUES ('adventurewales.com', 'Adventure Wales', 'Your Welsh Adventure Starts Here', '#1e3a4c', '#f97316')
    ON CONFLICT (domain) DO UPDATE SET name = 'Adventure Wales'
    RETURNING id
  `;
  const siteId = siteResult.rows[0].id;
  console.log(`   ✅ Site created: id=${siteId}\n`);

  // 2. Create regions
  console.log("2️⃣ Creating regions...");
  const regionData = [
    { name: "Snowdonia", slug: "snowdonia", description: "Wales' adventure capital - mountains, zip lines, and wild swimming", lat: 52.9, lng: -3.9 },
    { name: "Pembrokeshire", slug: "pembrokeshire", description: "Dramatic coastline, coasteering, sea kayaking, and surfing", lat: 51.8, lng: -4.9 },
    { name: "Brecon Beacons", slug: "brecon-beacons", description: "Rolling hills, waterfalls, and Dark Sky Reserve", lat: 51.9, lng: -3.4 },
    { name: "Anglesey", slug: "anglesey", description: "Island adventures, sea kayaking, and coastal paths", lat: 53.3, lng: -4.4 },
    { name: "Gower", slug: "gower", description: "Britain's first AONB - surfing, climbing, and beaches", lat: 51.6, lng: -4.1 },
    { name: "Llŷn Peninsula", slug: "llyn-peninsula", description: "Remote Welsh wilderness and coastal adventures", lat: 52.9, lng: -4.6 },
    { name: "South Wales", slug: "south-wales", description: "Mountain biking, caving, and adventure parks", lat: 51.5, lng: -3.2 },
    { name: "North Wales", slug: "north-wales", description: "Coastal adventures and heritage railways", lat: 53.2, lng: -3.5 },
    { name: "Mid Wales", slug: "mid-wales", description: "Wild Wales - red kites and remote adventures", lat: 52.4, lng: -3.6 },
    { name: "Carmarthenshire", slug: "carmarthenshire", description: "Garden of Wales - castles and quiet adventures", lat: 51.9, lng: -4.2 },
    { name: "Wye Valley", slug: "wye-valley", description: "Canoeing, caving, and gorge walking", lat: 51.8, lng: -2.7 },
  ];

  const regionMap: Record<string, number> = {};
  for (const r of regionData) {
    const result = await sql`
      INSERT INTO regions (site_id, name, slug, description, lat, lng, status)
      VALUES (${siteId}, ${r.name}, ${r.slug}, ${r.description}, ${r.lat}, ${r.lng}, 'published')
      ON CONFLICT DO NOTHING
      RETURNING id
    `;
    if (result.rows[0]) {
      regionMap[r.name] = result.rows[0].id;
      regionMap[r.slug] = result.rows[0].id;
    }
  }
  console.log(`   ✅ ${Object.keys(regionMap).length / 2} regions created\n`);

  // 3. Create activity types
  console.log("3️⃣ Creating activity types...");
  const activityTypeData = [
    { name: "Zip Lining", slug: "zip-lining", icon: "zap" },
    { name: "Hiking", slug: "hiking", icon: "mountain" },
    { name: "Coasteering", slug: "coasteering", icon: "waves" },
    { name: "Sea Kayaking", slug: "sea-kayaking", icon: "ship" },
    { name: "Surfing", slug: "surfing", icon: "waves" },
    { name: "Mountain Biking", slug: "mountain-biking", icon: "bike" },
    { name: "Climbing", slug: "climbing", icon: "mountain" },
    { name: "Caving", slug: "caving", icon: "circle" },
    { name: "Wild Swimming", slug: "wild-swimming", icon: "droplet" },
    { name: "Kayaking", slug: "kayaking", icon: "ship" },
    { name: "Canyoning", slug: "canyoning", icon: "arrow-down" },
    { name: "Stand Up Paddleboarding", slug: "sup", icon: "user" },
    { name: "Running", slug: "running", icon: "footprints" },
    { name: "Trail Running", slug: "trail-running", icon: "footprints" },
    { name: "Gorge Walking", slug: "gorge-walking", icon: "map" },
    { name: "Underground Trampolines", slug: "underground-trampolines", icon: "arrow-up" },
    { name: "Toboggan", slug: "toboggan", icon: "arrow-down" },
    { name: "Scenic Railway", slug: "scenic-railway", icon: "train" },
    { name: "Stag & Hen Parties", slug: "stag-hen", icon: "party-popper" },
    { name: "Sightseeing", slug: "sightseeing", icon: "camera" },
    { name: "Attractions", slug: "attractions", icon: "landmark" },
    { name: "Quad Biking", slug: "quad-biking", icon: "car" },
    { name: "White Water Rafting", slug: "white-water-rafting", icon: "waves" },
  ];

  const activityTypeMap: Record<string, number> = {};
  for (const t of activityTypeData) {
    const result = await sql`
      INSERT INTO activity_types (site_id, name, slug, icon)
      VALUES (${siteId}, ${t.name}, ${t.slug}, ${t.icon})
      ON CONFLICT DO NOTHING
      RETURNING id
    `;
    if (result.rows[0]) {
      activityTypeMap[t.name.toLowerCase()] = result.rows[0].id;
      activityTypeMap[t.slug] = result.rows[0].id;
    }
  }
  console.log(`   ✅ ${Object.keys(activityTypeMap).length / 2} activity types created\n`);

  // 4. Import operators
  console.log("4️⃣ Importing operators...");
  const operatorsCSV = fs.readFileSync(path.join(dataDir, "Wales database - Operators.csv"), "utf-8");
  const operators = parseCSV(operatorsCSV);
  const operatorMap: Record<string, number> = {};

  for (const op of operators) {
    const slug = slugify(op["Business Name"]);
    const rating = parseRating(op["Google Rating"]);
    const regions = op["Regions Covered"]?.split(",").map((r) => slugify(r.trim())) || [];
    const activityTypes = op["Activities Offered"]?.split(",").map((a) => slugify(a.trim())) || [];

    const priceRange =
      op["Price Range"] === "Premium" ? "£££" : op["Price Range"] === "Budget" ? "£" : "££";

    const result = await sql`
      INSERT INTO operators (
        site_id, name, slug, type, category, website, email, phone, address,
        description, google_rating, tripadvisor_url, price_range, unique_selling_point,
        claim_status, regions, activity_types
      ) VALUES (
        ${siteId}, ${op["Business Name"]}, ${slug}, 'primary', 'activity_provider',
        ${op["Website"] || null}, ${op["Contact Email"] || null}, ${op["Phone"] || null},
        ${op["Physical Address"] || null}, ${op["Unique Selling Point"] || null},
        ${rating}, ${op["TripAdvisor URL"] || null}, ${priceRange},
        ${op["Unique Selling Point"] || null}, 'claimed',
        ${regions}, ${activityTypes}
      )
      ON CONFLICT DO NOTHING
      RETURNING id
    `;
    if (result.rows[0]) {
      operatorMap[op["Business Name"]] = result.rows[0].id;
    }
  }
  console.log(`   ✅ ${Object.keys(operatorMap).length} operators imported\n`);

  // 5. Import activities
  console.log("5️⃣ Importing activities...");
  const activitiesCSV = fs.readFileSync(path.join(dataDir, "Wales database - Activities.csv"), "utf-8");
  const activities = parseCSV(activitiesCSV);
  let activityCount = 0;

  for (const act of activities) {
    const slug = slugify(act["Activity Name"]);
    const price = parsePrice(act["Price Range (£)"]);
    const regionId = regionMap[act["Region"]] || regionMap[slugify(act["Region"])] || null;
    const operatorId = operatorMap[act["Operator"]] || null;
    const activityTypeId = activityTypeMap[act["Type"]?.toLowerCase()] || activityTypeMap[slugify(act["Type"])] || null;

    await sql`
      INSERT INTO activities (
        site_id, region_id, operator_id, activity_type_id, name, slug,
        meeting_point, price_from, price_to, duration, difficulty, season,
        min_age, booking_url, source_url, status
      ) VALUES (
        ${siteId}, ${regionId}, ${operatorId}, ${activityTypeId},
        ${act["Activity Name"]}, ${slug}, ${act["Location/Meeting Point"] || null},
        ${price.from}, ${price.to}, ${act["Duration"] || null},
        ${act["Difficulty"] || null}, ${act["Season"] || null},
        ${act["Min Age"] && !isNaN(parseInt(act["Min Age"])) ? parseInt(act["Min Age"]) : null},
        ${act["Booking URL"] || null}, ${act["Source URL"] || null}, 'published'
      )
      ON CONFLICT DO NOTHING
    `;
    activityCount++;
  }
  console.log(`   ✅ ${activityCount} activities imported\n`);

  // 6. Import locations
  console.log("6️⃣ Importing locations...");
  const locationsCSV = fs.readFileSync(path.join(dataDir, "Wales database - Locations.csv"), "utf-8");
  const locations = parseCSV(locationsCSV);
  let locationCount = 0;

  for (const loc of locations) {
    const slug = slugify(loc["Location Name"]);
    const coords = parseGPS(loc["GPS Coordinates"]);
    const regionId = regionMap[loc["Region"]] || regionMap[slugify(loc["Region"])] || null;

    await sql`
      INSERT INTO locations (
        site_id, region_id, name, slug, lat, lng,
        parking_info, facilities, access_notes, best_time, crowd_level, status
      ) VALUES (
        ${siteId}, ${regionId}, ${loc["Location Name"]}, ${slug},
        ${coords.lat}, ${coords.lng}, ${loc["Parking Info"] || null},
        ${loc["Facilities"] || null}, ${loc["Access Notes"] || null},
        ${loc["Best Time to Visit"] || null}, ${loc["Crowd Level"] || null}, 'published'
      )
      ON CONFLICT DO NOTHING
    `;
    locationCount++;
  }
  console.log(`   ✅ ${locationCount} locations imported\n`);

  // 7. Import accommodation
  console.log("7️⃣ Importing accommodation...");
  const accommodationCSV = fs.readFileSync(path.join(dataDir, "Wales database - Accommodation.csv"), "utf-8");
  const accommodations = parseCSV(accommodationCSV);
  let accommodationCount = 0;

  for (const acc of accommodations) {
    const slug = slugify(acc["Property Name"]);
    const price = parsePrice(acc["Price/Night (£)"]);
    const rating = parseRating(acc["Google Rating"]);
    const regionId = regionMap[acc["Region"]] || regionMap[slugify(acc["Region"])] || null;

    await sql`
      INSERT INTO accommodation (
        site_id, region_id, name, slug, type, address, website,
        price_from, price_to, adventure_features, booking_url, airbnb_url,
        google_rating, status
      ) VALUES (
        ${siteId}, ${regionId}, ${acc["Property Name"]}, ${slug},
        ${acc["Type"] || null}, ${acc["Location"] || null}, ${acc["Website"] || null},
        ${price.from}, ${price.to}, ${acc["Adventure Features"] || null},
        ${acc["Booking.com URL"] || null}, ${acc["Airbnb URL"] || null},
        ${rating}, 'published'
      )
      ON CONFLICT DO NOTHING
    `;
    accommodationCount++;
  }
  console.log(`   ✅ ${accommodationCount} accommodation imported\n`);

  // 8. Import events
  console.log("8️⃣ Importing events...");
  const eventsCSV = fs.readFileSync(path.join(dataDir, "Wales database - Events.csv"), "utf-8");
  const events = parseCSV(eventsCSV);
  let eventCount = 0;

  for (const evt of events) {
    const slug = slugify(evt["Event Name"]);
    const price = parsePrice(evt["Registration Cost (£)"]);
    const regionId = regionMap[evt["Region"]] || regionMap[slugify(evt["Region"])] || null;

    await sql`
      INSERT INTO events (
        site_id, region_id, name, slug, type, description, location,
        month_typical, website, registration_cost, status
      ) VALUES (
        ${siteId}, ${regionId}, ${evt["Event Name"]}, ${slug},
        ${evt["Type"] || null}, ${evt["Description"] || null}, ${evt["Location"] || null},
        ${evt["Date(s)/Month"] || null}, ${evt["Website"] || null},
        ${price.from}, 'published'
      )
      ON CONFLICT DO NOTHING
    `;
    eventCount++;
  }
  console.log(`   ✅ ${eventCount} events imported\n`);

  // 9. Import transport
  console.log("9️⃣ Importing transport...");
  const transportCSV = fs.readFileSync(path.join(dataDir, "Wales database - Transport.csv"), "utf-8");
  const transports = parseCSV(transportCSV);
  let transportCount = 0;

  for (const t of transports) {
    const regionId = regionMap[t["Region Covered"]] || regionMap[slugify(t["Region Covered"])] || null;

    await sql`
      INSERT INTO transport (
        site_id, region_id, type, name, route, stops, frequency,
        season, cost, website, notes
      ) VALUES (
        ${siteId}, ${regionId}, ${t["Service Type"] || null}, ${t["Name/Route"]},
        ${t["Name/Route"] || null}, ${t["Stops/Locations"] || null},
        ${t["Frequency"] || null}, ${t["Season"] || null},
        ${t["Cost (£)"] || null}, ${t["Website"] || null}, ${t["Notes"] || null}
      )
      ON CONFLICT DO NOTHING
    `;
    transportCount++;
  }
  console.log(`   ✅ ${transportCount} transport options imported\n`);

  console.log("🎉 Seed complete!");
  console.log(`
Summary:
- 1 site
- ${Object.keys(regionMap).length / 2} regions
- ${Object.keys(activityTypeMap).length / 2} activity types
- ${Object.keys(operatorMap).length} operators
- ${activityCount} activities
- ${locationCount} locations
- ${accommodationCount} accommodation
- ${eventCount} events
- ${transportCount} transport options
  `);

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
