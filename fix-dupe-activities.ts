import { db } from "./src/db";
import { activities, itineraryItems } from "./src/db/schema";
import { eq, inArray } from "drizzle-orm";

async function main() {
  // Get all activities grouped by slug
  const allActivities = await db.select({
    id: activities.id,
    name: activities.name,
    slug: activities.slug,
  }).from(activities).orderBy(activities.slug, activities.id);
  
  // Group by slug, keep highest ID
  const bySlug: Record<string, number[]> = {};
  allActivities.forEach(a => {
    if (!bySlug[a.slug]) bySlug[a.slug] = [];
    bySlug[a.slug].push(a.id);
  });
  
  let dupeCount = 0;
  for (const [slug, ids] of Object.entries(bySlug)) {
    if (ids.length > 1) {
      dupeCount++;
      const keepId = Math.max(...ids);
      const deleteIds = ids.filter(id => id !== keepId);
      
      // Update foreign keys
      for (const deleteId of deleteIds) {
        await db.update(itineraryItems).set({ activityId: keepId }).where(eq(itineraryItems.activityId, deleteId));
      }
      
      // Delete duplicates
      await db.delete(activities).where(inArray(activities.id, deleteIds));
    }
  }
  
  console.log(`Fixed ${dupeCount} duplicate activities`);
  const remaining = await db.select({ id: activities.id }).from(activities);
  console.log(`Remaining activities: ${remaining.length}`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
