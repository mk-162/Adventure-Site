import "dotenv/config";
import { sql } from "@vercel/postgres";

const UNSPLASH_KEY = "BBqUqpMUJJiKvawiCURPSnrHJmcoajR6ULDyMKzuLu4";

interface UnsplashResult {
  urls: { regular: string };
  user: { name: string };
}

async function searchUnsplash(query: string): Promise<UnsplashResult | null> {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
  });
  if (res.status === 403) {
    console.log(`  ⏳ Rate limited, waiting 60s...`);
    await new Promise((r) => setTimeout(r, 60000));
    // Retry once
    const res2 = await fetch(url, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    });
    if (!res2.ok) return null;
    const data2 = await res2.json();
    return data2.results?.[0] || null;
  }
  if (!res.ok) {
    console.log(`  ⚠️ API error (${res.status})`);
    return null;
  }
  const data = await res.json();
  return data.results?.[0] || null;
}

// Smart search query from title + region
function buildQuery(title: string, regionName: string | null): string {
  const keywords: Record<string, string> = {
    adrenaline: "extreme sports adventure",
    surf: "surfing waves ocean",
    coasteer: "coasteering cliff jumping sea",
    kayak: "kayaking coast ocean",
    hike: "hiking mountain trail",
    bike: "mountain biking trail",
    climb: "rock climbing outdoor",
    cave: "caving underground adventure",
    "wild swim": "wild swimming lake river",
    "wild camp": "wild camping tent mountains",
    gorge: "gorge walking waterfall canyon",
    zip: "zip line adventure",
    camping: "camping tent mountains",
    waterfall: "waterfall hiking",
    "dark sky": "stargazing night sky mountains",
    photography: "landscape photography mountains",
    romantic: "couple hiking scenic coast",
    family: "family outdoor adventure",
    dog: "dog hiking mountains",
    winter: "winter mountains hiking",
    island: "island coast wildlife birds",
    stag: "group adventure outdoor activity",
    budget: "backpacking adventure outdoor",
    solo: "solo hiking mountain trail",
    "without a car": "train countryside adventure",
    "rainy day": "indoor adventure activities",
    "off-grid": "remote wilderness countryside",
    river: "river kayaking adventure",
    canoe: "canoeing river valley",
    autumn: "autumn forest countryside",
    summit: "mountain summit hiking peaks",
    "multi-sport": "outdoor sports adventure",
    "grand tour": "wales landscape scenic road",
    "first-timer": "wales adventure beginners",
    "day trip": "adventure day out",
    sampler: "wales adventure landscape",
  };

  const titleLower = title.toLowerCase();
  for (const [key, query] of Object.entries(keywords)) {
    if (titleLower.includes(key)) {
      const region = regionName && regionName !== "Multi-Region" ? ` ${regionName}` : " wales";
      return query + region;
    }
  }
  const region = regionName && regionName !== "Multi-Region" ? regionName : "wales";
  return `${title} adventure ${region}`;
}

async function main() {
  console.log("🖼️ Importing missing hero images...\n");

  // Fix carmarthenshire region
  console.log("📍 Fixing carmarthenshire region...");
  const carmResult = await searchUnsplash("carmarthenshire wales green hills");
  if (carmResult) {
    await sql`UPDATE regions SET hero_image = ${carmResult.urls.regular}, hero_credit = ${carmResult.user.name} WHERE slug = 'carmarthenshire'`;
    console.log(`  ✅ carmarthenshire — ${carmResult.user.name}`);
  } else {
    // Try broader search
    const fallback = await searchUnsplash("wales green countryside hills");
    if (fallback) {
      await sql`UPDATE regions SET hero_image = ${fallback.urls.regular}, hero_credit = ${fallback.user.name} WHERE slug = 'carmarthenshire'`;
      console.log(`  ✅ carmarthenshire (fallback) — ${fallback.user.name}`);
    } else {
      console.log(`  ❌ carmarthenshire — no results`);
    }
  }
  await new Promise((r) => setTimeout(r, 1500));

  // Itineraries
  console.log("\n🗺️ Fetching remaining itineraries...\n");
  const rows = await sql`
    SELECT i.id, i.slug, i.title, r.name as region_name
    FROM itineraries i
    LEFT JOIN regions r ON i.region_id = r.id
    WHERE i.status = 'published' AND i.hero_image IS NULL
    ORDER BY i.slug
  `;

  console.log(`${rows.rows.length} itineraries still need images.\n`);

  let updated = 0;
  let failed = 0;

  for (const row of rows.rows) {
    const query = buildQuery(row.title as string, row.region_name as string | null);
    process.stdout.write(`  ${row.slug}... `);

    const result = await searchUnsplash(query);
    if (result) {
      await sql`UPDATE itineraries SET hero_image = ${result.urls.regular} WHERE id = ${row.id as number}`;
      console.log(`✅`);
      updated++;
    } else {
      // Fallback: region name + landscape
      const regionQuery = ((row.region_name as string) || "wales") + " landscape adventure";
      const result2 = await searchUnsplash(regionQuery);
      if (result2) {
        await sql`UPDATE itineraries SET hero_image = ${result2.urls.regular} WHERE id = ${row.id as number}`;
        console.log(`✅ (fallback)`);
        updated++;
      } else {
        console.log(`❌`);
        failed++;
      }
      await new Promise((r) => setTimeout(r, 1500));
    }

    // ~1.5s between requests = max ~40/min, well under limit
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`\n✅ Done! Updated: ${updated}, Failed: ${failed}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
