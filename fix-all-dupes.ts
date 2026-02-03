import { db } from "./src/db";
import { accommodation, operators, events, locations, transport, itineraryItems } from "./src/db/schema";
import { eq, inArray } from "drizzle-orm";

async function dedupeTable(table: any, tableName: string, fkUpdates: Array<{table: any, column: string}> = []) {
  const all = await db.select({
    id: table.id,
    slug: table.slug,
  }).from(table).orderBy(table.slug, table.id);
  
  const bySlug: Record<string, number[]> = {};
  all.forEach(item => {
    if (!bySlug[item.slug]) bySlug[item.slug] = [];
    bySlug[item.slug].push(item.id);
  });
  
  let dupeCount = 0;
  for (const [slug, ids] of Object.entries(bySlug)) {
    if (ids.length > 1) {
      dupeCount++;
      const keepId = Math.max(...ids);
      const deleteIds = ids.filter(id => id !== keepId);
      
      // Update foreign keys
      for (const fk of fkUpdates) {
        for (const deleteId of deleteIds) {
          await db.update(fk.table).set({ [fk.column]: keepId }).where(eq(fk.table[fk.column], deleteId));
        }
      }
      
      await db.delete(table).where(inArray(table.id, deleteIds));
    }
  }
  
  const remaining = await db.select({ id: table.id }).from(table);
  console.log(`${tableName}: Fixed ${dupeCount} duplicates, ${remaining.length} remaining`);
}

async function main() {
  await dedupeTable(accommodation, "accommodation", [{ table: itineraryItems, column: "accommodationId" }]);
  await dedupeTable(operators, "operators", []);
  await dedupeTable(events, "events", []);
  await dedupeTable(locations, "locations", [{ table: itineraryItems, column: "locationId" }]);
  await dedupeTable(transport, "transport", []);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
