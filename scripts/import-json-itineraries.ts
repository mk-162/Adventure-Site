import "dotenv/config";
import { sql } from "@vercel/postgres";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

interface Stop {
  day: number;
  orderIndex: number;
  time: string;
  type: string;
  title: string;
  description: string;
  duration?: string;
  costFrom?: number;
  costTo?: number;
  lat?: number;
  lng?: number;
  travelToNext?: string;
  travelMode?: string;
  wetAlt?: {
    title: string;
    description: string;
    costFrom?: number;
    costTo?: number;
  };
  budgetAlt?: {
    title: string;
    description: string;
    costFrom?: number;
    costTo?: number;
  };
  foodType?: string;
}

interface Itinerary {
  slug: string;
  title: string;
  tagline: string;
  region: string;
  days: number;
  difficulty: string;
  bestSeason: string;
  groupType?: string;
  priceFrom: number;
  priceTo: number;
  budgetPriceFrom?: number;
  budgetPriceTo?: number;
  highlights?: string[];
  activityTypes?: string[];
  suitableFor?: string;
  notSuitableFor?: string;
  weatherDependency?: string;
  packingEssentials?: string[];
  costBreakdown?: any;
  knowBeforeYouGo?: any;
  stops: Stop[];
}

function normalizeFoodType(foodType: string | undefined): string | null {
  if (!foodType) return null;
  
  const lower = foodType.toLowerCase();
  
  // Map variations to valid enum values
  if (lower.includes('breakfast')) return 'breakfast';
  if (lower.includes('lunch')) return 'lunch';
  if (lower.includes('dinner')) return 'dinner';
  if (lower.includes('snack') || lower.includes('dessert') || lower.includes('tea')) return 'snack';
  if (lower.includes('brunch')) return 'lunch';
  if (lower.includes('pub')) return 'pub';
  if (lower.includes('cafe') || lower.includes('café')) return 'cafe';
  
  // Default to cafe for unknown types
  return 'cafe';
}

function normalizeTravelMode(travelMode: string | undefined): string {
  if (!travelMode) return 'drive';
  
  const lower = travelMode.toLowerCase();
  
  // Map variations to valid enum values
  if (lower === 'n/a' || lower === 'none') return 'none';
  if (lower.includes('bike') || lower.includes('cycle')) return 'cycle';
  if (lower.includes('bus') && lower.includes('train')) return 'bus'; // Pick one for combined modes
  if (lower.includes('bus')) return 'bus';
  if (lower.includes('train')) return 'train';
  if (lower.includes('walk')) return 'walk';
  if (lower.includes('ferry')) return 'ferry';
  if (lower.includes('drive') || lower.includes('car')) return 'drive';
  
  // Default to drive
  return 'drive';
}

function normalizeStopType(stopType: string): string {
  const lower = stopType.toLowerCase();
  
  // Map variations to valid enum values
  if (lower === 'departure' || lower === 'travel') return 'transport';
  if (lower === 'activity') return 'activity';
  if (lower === 'food') return 'food';
  if (lower === 'accommodation') return 'accommodation';
  if (lower === 'transport') return 'transport';
  if (lower === 'freeform') return 'freeform';
  
  // Default to freeform for unknown types
  return 'freeform';
}

function buildDescription(itinerary: Itinerary): string {
  const sections: string[] = [];

  // Tagline
  sections.push(itinerary.tagline);
  sections.push("");

  // Highlights
  if (itinerary.highlights && itinerary.highlights.length > 0) {
    sections.push("## Highlights");
    sections.push("");
    itinerary.highlights.forEach(h => sections.push(`- ${h}`));
    sections.push("");
  }

  // Suitable For
  if (itinerary.suitableFor) {
    sections.push("## Who This Is For");
    sections.push("");
    sections.push(itinerary.suitableFor);
    sections.push("");
  }

  // Not Suitable For
  if (itinerary.notSuitableFor) {
    sections.push("## Not Suitable For");
    sections.push("");
    sections.push(itinerary.notSuitableFor);
    sections.push("");
  }

  // Packing Essentials
  if (itinerary.packingEssentials && itinerary.packingEssentials.length > 0) {
    sections.push("## What to Pack");
    sections.push("");
    itinerary.packingEssentials.forEach(item => sections.push(`- ${item}`));
    sections.push("");
  }

  // Cost Breakdown
  if (itinerary.costBreakdown) {
    sections.push("## Cost Breakdown");
    sections.push("");
    
    if (itinerary.costBreakdown.standard) {
      sections.push("### Standard Budget");
      const std = itinerary.costBreakdown.standard;
      sections.push(`- Activities: £${std.activities}`);
      sections.push(`- Accommodation: £${std.accommodation}`);
      sections.push(`- Food: £${std.food}`);
      if (std.transport) sections.push(`- Transport: £${std.transport}`);
      sections.push(`- **Total: £${std.total}**`);
      sections.push("");
    }

    if (itinerary.costBreakdown.budget) {
      sections.push("### Budget Option");
      const bud = itinerary.costBreakdown.budget;
      sections.push(`- Activities: £${bud.activities}`);
      sections.push(`- Accommodation: £${bud.accommodation}`);
      sections.push(`- Food: £${bud.food}`);
      if (bud.transport) sections.push(`- Transport: £${bud.transport}`);
      sections.push(`- **Total: £${bud.total}**`);
      sections.push("");
    }
  }

  // Know Before You Go
  if (itinerary.knowBeforeYouGo) {
    sections.push("## Know Before You Go");
    sections.push("");
    
    Object.entries(itinerary.knowBeforeYouGo).forEach(([key, value]) => {
      const title = key.charAt(0).toUpperCase() + key.slice(1);
      sections.push(`### ${title}`);
      sections.push("");
      sections.push(value as string);
      sections.push("");
    });
  }

  return sections.join("\n");
}

async function importJsonItineraries() {
  console.log("🌱 Importing JSON itineraries...");

  let importedCount = 0;
  let stopsCreatedCount = 0;
  let errorCount = 0;

  try {
    // Get site ID (always 1 for Adventure Wales)
    const siteRes = await sql`SELECT id FROM sites LIMIT 1`;
    const siteId = siteRes.rows[0]?.id || 1;

    // Get or create "Multi-Region" region for multi-region itineraries
    let multiRegionId: number;
    const multiRegionRes = await sql`SELECT id FROM regions WHERE slug = 'multi-region' LIMIT 1`;
    if (multiRegionRes.rows.length > 0) {
      multiRegionId = multiRegionRes.rows[0].id;
    } else {
      const r = await sql`
        INSERT INTO regions (site_id, name, slug, description, status)
        VALUES (${siteId}, 'Multi-Region', 'multi-region', 'Adventures spanning multiple regions of Wales', 'published')
        RETURNING id
      `;
      multiRegionId = r.rows[0].id;
      console.log("✓ Created Multi-Region region");
    }

    // Read all JSON files
    const dataDir = join(process.cwd(), "data", "itineraries");
    const files = await readdir(dataDir);
    const jsonFiles = files.filter(f => f.endsWith(".json"));

    console.log(`Found ${jsonFiles.length} JSON files to import\n`);

    for (const file of jsonFiles) {
      try {
        const filePath = join(dataDir, file);
        const content = await readFile(filePath, "utf-8");
        const itinerary: Itinerary = JSON.parse(content);

        console.log(`Processing: ${itinerary.title} (${itinerary.slug})`);

        // Look up region
        let regionId: number;
        if (itinerary.region === "multi") {
          regionId = multiRegionId;
        } else {
          const regionRes = await sql`SELECT id FROM regions WHERE slug = ${itinerary.region} LIMIT 1`;
          if (regionRes.rows.length > 0) {
            regionId = regionRes.rows[0].id;
          } else {
            console.log(`  ⚠️  Region '${itinerary.region}' not found, using Multi-Region`);
            regionId = multiRegionId;
          }
        }

        // Build rich description
        const description = buildDescription(itinerary);

        // Upsert itinerary
        let itineraryId: number;
        const existingRes = await sql`SELECT id FROM itineraries WHERE slug = ${itinerary.slug}`;
        
        if (existingRes.rows.length > 0) {
          // Update existing
          itineraryId = existingRes.rows[0].id;
          await sql`
            UPDATE itineraries SET
              title = ${itinerary.title},
              tagline = ${itinerary.tagline},
              description = ${description},
              duration_days = ${itinerary.days},
              difficulty = ${itinerary.difficulty},
              best_season = ${itinerary.bestSeason},
              price_estimate_from = ${itinerary.priceFrom},
              price_estimate_to = ${itinerary.priceTo},
              region_id = ${regionId},
              status = 'published'
            WHERE id = ${itineraryId}
          `;
          console.log(`  ✓ Updated itinerary (ID: ${itineraryId})`);
        } else {
          // Insert new
          const res = await sql`
            INSERT INTO itineraries (
              site_id, region_id, title, slug, tagline, description,
              duration_days, difficulty, best_season, 
              price_estimate_from, price_estimate_to, status
            ) VALUES (
              ${siteId}, ${regionId}, ${itinerary.title}, ${itinerary.slug},
              ${itinerary.tagline}, ${description},
              ${itinerary.days}, ${itinerary.difficulty}, ${itinerary.bestSeason},
              ${itinerary.priceFrom}, ${itinerary.priceTo}, 'published'
            )
            RETURNING id
          `;
          itineraryId = res.rows[0].id;
          console.log(`  ✓ Created itinerary (ID: ${itineraryId})`);
        }

        // Delete existing stops
        await sql`DELETE FROM itinerary_stops WHERE itinerary_id = ${itineraryId}`;

        // Insert stops
        let stopsForThisItinerary = 0;
        for (const stop of itinerary.stops) {
          // Normalize enum values
          const travelMode = normalizeTravelMode(stop.travelMode);
          const stopType = normalizeStopType(stop.type);
          const foodType = normalizeFoodType(stop.foodType);
          
          // Build the insert query
          if (stopType === "food") {
            // Food stop
            await sql`
              INSERT INTO itinerary_stops (
                itinerary_id, day_number, order_index, stop_type,
                title, description,
                start_time, duration, travel_to_next, travel_mode,
                food_name, food_type, food_budget,
                lat, lng, cost_from, cost_to,
                budget_alt_title, budget_alt_description,
                budget_alt_cost_from, budget_alt_cost_to
              ) VALUES (
                ${itineraryId}, ${stop.day}, ${stop.orderIndex}, ${stopType},
                ${stop.title}, ${stop.description || null},
                ${stop.time || null}, ${stop.duration || null}, 
                ${stop.travelToNext || null}, ${travelMode},
                ${stop.title}, ${foodType}, 
                ${stop.costFrom ? `£${stop.costFrom}-${stop.costTo || stop.costFrom}` : null},
                ${stop.lat || null}, ${stop.lng || null},
                ${stop.costFrom || null}, ${stop.costTo || null},
                ${stop.budgetAlt?.title || null}, ${stop.budgetAlt?.description || null},
                ${stop.budgetAlt?.costFrom || null}, ${stop.budgetAlt?.costTo || null}
              )
            `;
          } else {
            // Activity, accommodation, transport, or freeform stop
            await sql`
              INSERT INTO itinerary_stops (
                itinerary_id, day_number, order_index, stop_type,
                title, description,
                start_time, duration, travel_to_next, travel_mode,
                lat, lng, cost_from, cost_to,
                wet_alt_title, wet_alt_description,
                wet_alt_cost_from, wet_alt_cost_to,
                budget_alt_title, budget_alt_description,
                budget_alt_cost_from, budget_alt_cost_to
              ) VALUES (
                ${itineraryId}, ${stop.day}, ${stop.orderIndex}, ${stopType},
                ${stop.title}, ${stop.description || null},
                ${stop.time || null}, ${stop.duration || null},
                ${stop.travelToNext || null}, ${travelMode},
                ${stop.lat || null}, ${stop.lng || null},
                ${stop.costFrom || null}, ${stop.costTo || null},
                ${stop.wetAlt?.title || null}, ${stop.wetAlt?.description || null},
                ${stop.wetAlt?.costFrom || null}, ${stop.wetAlt?.costTo || null},
                ${stop.budgetAlt?.title || null}, ${stop.budgetAlt?.description || null},
                ${stop.budgetAlt?.costFrom || null}, ${stop.budgetAlt?.costTo || null}
              )
            `;
          }
          
          stopsForThisItinerary++;
          stopsCreatedCount++;
        }

        console.log(`  ✓ Created ${stopsForThisItinerary} stops`);
        importedCount++;
        console.log("");

      } catch (error) {
        console.error(`  ✗ Error processing ${file}:`, error);
        errorCount++;
        console.log("");
      }
    }

    // Summary
    console.log("═══════════════════════════════════════");
    console.log("Import Summary:");
    console.log(`✓ ${importedCount} itineraries imported`);
    console.log(`✓ ${stopsCreatedCount} stops created`);
    if (errorCount > 0) {
      console.log(`✗ ${errorCount} errors encountered`);
    }
    console.log("═══════════════════════════════════════");

  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }

  process.exit(0);
}

importJsonItineraries();
