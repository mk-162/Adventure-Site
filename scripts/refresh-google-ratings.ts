/**
 * Refresh Google ratings for all operators via Places API (New).
 * 
 * Usage: npx tsx scripts/refresh-google-ratings.ts
 * 
 * Requires GOOGLE_API_KEY and DATABASE_URL in .env
 * Rate: ~80 operators = ~80 API calls = well within free $200/mo credit
 */

import { db } from "../src/db";
import { operators } from "../src/db/schema";
import { eq, isNotNull } from "drizzle-orm";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error("Missing GOOGLE_API_KEY in .env");
  process.exit(1);
}

const PLACES_URL = "https://places.googleapis.com/v1/places:searchText";
const DELAY_MS = 200; // Be gentle with the API

interface PlaceResult {
  displayName?: { text: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  formattedAddress?: string;
}

async function searchPlace(query: string): Promise<PlaceResult | null> {
  try {
    const res = await fetch(PLACES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY!,
        "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.googleMapsUri,places.formattedAddress",
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "en",
        regionCode: "GB",
      }),
    });

    if (!res.ok) {
      console.error(`  API error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data.places?.[0] || null;
  } catch (err: any) {
    console.error(`  Fetch error: ${err.message}`);
    return null;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Get all operators with a website (more likely to be real businesses)
  const ops = await db
    .select({
      id: operators.id,
      name: operators.name,
      slug: operators.slug,
      address: operators.address,
      googleRating: operators.googleRating,
      reviewCount: operators.reviewCount,
    })
    .from(operators)
    .orderBy(operators.name);

  console.log(`Found ${ops.length} operators to check\n`);

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const op of ops) {
    // Build search query — name + address for better matching
    const query = op.address
      ? `${op.name} ${op.address.split(",").slice(-2).join(",").trim()}`
      : `${op.name} Wales`;

    process.stdout.write(`${op.name}... `);

    const place = await searchPlace(query);

    if (!place || !place.rating) {
      console.log("❌ not found");
      notFound++;
      await sleep(DELAY_MS);
      continue;
    }

    // Check if the name roughly matches (avoid false positives)
    const placeName = place.displayName?.text?.toLowerCase() || "";
    const opName = op.name.toLowerCase();
    const nameWords = opName.split(/\s+/);
    const matchScore = nameWords.filter((w) => placeName.includes(w)).length / nameWords.length;

    if (matchScore < 0.4) {
      console.log(`⚠️  skip (matched "${place.displayName?.text}" — too different)`);
      skipped++;
      await sleep(DELAY_MS);
      continue;
    }

    const oldRating = op.googleRating ? parseFloat(op.googleRating) : null;
    const oldCount = op.reviewCount;
    const newRating = place.rating;
    const newCount = place.userRatingCount || 0;

    // Update if rating or count changed
    if (oldRating !== newRating || oldCount !== newCount) {
      await db
        .update(operators)
        .set({
          googleRating: String(newRating),
          reviewCount: newCount,
        })
        .where(eq(operators.id, op.id));

      const ratingChange = oldRating ? ` (was ${oldRating})` : " (new)";
      const countChange = oldCount ? ` (was ${oldCount})` : "";
      console.log(`✅ ${newRating}⭐ (${newCount} reviews)${ratingChange}${countChange}`);
      updated++;
    } else {
      console.log(`✓ ${newRating}⭐ (${newCount} reviews) — no change`);
    }

    await sleep(DELAY_MS);
  }

  console.log(`\n--- Summary ---`);
  console.log(`Updated: ${updated}`);
  console.log(`Unchanged/verified: ${ops.length - updated - notFound - skipped}`);
  console.log(`Not found: ${notFound}`);
  console.log(`Skipped (name mismatch): ${skipped}`);
  console.log(`Total API calls: ${ops.length}`);

  process.exit(0);
}

main();
