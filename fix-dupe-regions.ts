import { db } from "./src/db";
import { regions, activities, accommodation, events, locations, transport, itineraries, answers } from "./src/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";

async function main() {
  // Get all regions grouped by slug
  const allRegions = await db.select({
    id: regions.id,
    name: regions.name,
    slug: regions.slug,
  }).from(regions).orderBy(regions.slug, regions.id);
  
  // Group by slug, keep highest ID (most recent)
  const regionsBySlug: Record<string, number[]> = {};
  allRegions.forEach(r => {
    if (!regionsBySlug[r.slug]) regionsBySlug[r.slug] = [];
    regionsBySlug[r.slug].push(r.id);
  });
  
  for (const [slug, ids] of Object.entries(regionsBySlug)) {
    if (ids.length > 1) {
      const keepId = Math.max(...ids);
      const deleteIds = ids.filter(id => id !== keepId);
      
      console.log(`${slug}: keeping ID ${keepId}, removing IDs ${deleteIds.join(', ')}`);
      
      // Update foreign keys to point to keepId
      for (const deleteId of deleteIds) {
        await db.update(activities).set({ regionId: keepId }).where(eq(activities.regionId, deleteId));
        await db.update(accommodation).set({ regionId: keepId }).where(eq(accommodation.regionId, deleteId));
        await db.update(events).set({ regionId: keepId }).where(eq(events.regionId, deleteId));
        await db.update(locations).set({ regionId: keepId }).where(eq(locations.regionId, deleteId));
        await db.update(transport).set({ regionId: keepId }).where(eq(transport.regionId, deleteId));
        await db.update(itineraries).set({ regionId: keepId }).where(eq(itineraries.regionId, deleteId));
        await db.update(answers).set({ regionId: keepId }).where(eq(answers.regionId, deleteId));
      }
      
      // Delete duplicate regions
      await db.delete(regions).where(inArray(regions.id, deleteIds));
    }
  }
  
  console.log("\nDone! Remaining regions:");
  const remaining = await db.select({ id: regions.id, name: regions.name, slug: regions.slug }).from(regions);
  remaining.forEach(r => console.log(`  ${r.id}: ${r.name}`));
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
