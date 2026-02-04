import { db } from "@/db";
import { itineraries } from "@/db/schema";

async function main() {
  const rows = await db.select({ 
    title: itineraries.title, 
    desc: itineraries.description, 
    difficulty: itineraries.difficulty, 
    season: itineraries.bestSeason, 
    days: itineraries.durationDays, 
    price: itineraries.priceEstimateFrom 
  }).from(itineraries).limit(3);
  
  for (const r of rows) {
    console.log('=== ' + r.title + ' ===');
    console.log('Days:', r.days, '| Difficulty:', r.difficulty, '| Season:', r.season, '| Price:', r.price);
    console.log((r.desc ?? '').substring(0, 2000));
    console.log();
  }
  process.exit(0);
}
main();
# DB enrichment: Big Red activity updated 2026-02-04T18:45:10
