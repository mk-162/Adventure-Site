import "dotenv/config";
import { sql } from "@vercel/postgres";

const UNSPLASH_KEY = "BBqUqpMUJJiKvawiCURPSnrHJmcoajR6ULDyMKzuLu4";

interface UnsplashResult {
  urls: {
    regular: string;
    small: string;
  };
  user: {
    name: string;
  };
}

async function searchUnsplash(query: string): Promise<UnsplashResult | null> {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
  });
  
  if (!res.ok) {
    console.log(`  ⚠️ API error for "${query}"`);
    return null;
  }
  
  const data = await res.json();
  return data.results?.[0] || null;
}

// Regions with specific search queries
const regionQueries: Record<string, string> = {
  snowdonia: "snowdonia wales mountains",
  pembrokeshire: "pembrokeshire coast wales",
  "brecon-beacons": "brecon beacons wales",
  anglesey: "anglesey island wales",
  gower: "gower peninsula beach wales",
  "llyn-peninsula": "llyn peninsula wales coast",
  "south-wales": "south wales valleys",
  "north-wales": "north wales coast",
  "mid-wales": "mid wales countryside",
  carmarthenshire: "carmarthenshire wales countryside",
  "wye-valley": "wye valley river uk",
};

// Activity types with search queries
const activityQueries: Record<string, string> = {
  "zip-lining": "zip line adventure",
  hiking: "hiking mountains uk",
  coasteering: "coasteering cliff jumping",
  "sea-kayaking": "sea kayaking coast",
  surfing: "surfing waves beach",
  "mountain-biking": "mountain biking trail",
  climbing: "rock climbing outdoor",
  caving: "caving cave adventure",
  "wild-swimming": "wild swimming lake",
  kayaking: "kayaking river",
  canyoning: "canyoning waterfall",
  sup: "stand up paddleboarding",
  running: "trail running mountains",
  "trail-running": "trail running mountains",
  "gorge-walking": "gorge walking waterfall",
  "underground-trampolines": "underground adventure",
  toboggan: "alpine coaster ride",
  "scenic-railway": "scenic mountain railway",
};

async function importImages() {
  console.log("🖼️ Importing images from Unsplash...\n");

  // Update regions
  console.log("📍 Updating region images...\n");
  for (const [slug, query] of Object.entries(regionQueries)) {
    console.log(`Searching: ${slug}`);
    const result = await searchUnsplash(query);
    
    if (result) {
      const imageUrl = result.urls.regular;
      const credit = result.user.name;
      
      await sql`
        UPDATE regions 
        SET hero_image = ${imageUrl}, hero_credit = ${credit}
        WHERE slug = ${slug}
      `;
      console.log(`  ✅ ${slug} - Photo by ${credit}`);
    } else {
      console.log(`  ⚠️ No image found for ${slug}`);
    }
    
    // Rate limit: 50 requests per hour, so be gentle
    await new Promise(r => setTimeout(r, 500));
  }

  // Update activity types
  console.log("\n🏃 Updating activity type images...\n");
  for (const [slug, query] of Object.entries(activityQueries)) {
    console.log(`Searching: ${slug}`);
    const result = await searchUnsplash(query);
    
    if (result) {
      const imageUrl = result.urls.regular;
      
      await sql`
        UPDATE activity_types 
        SET hero_image = ${imageUrl}
        WHERE slug = ${slug}
      `;
      console.log(`  ✅ ${slug}`);
    } else {
      console.log(`  ⚠️ No image found for ${slug}`);
    }
    
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("\n✅ Image import complete!");
  process.exit(0);
}

importImages().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
