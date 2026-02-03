import { db } from "./src/db";
import { regions } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const allRegions = await db.select({
    id: regions.id,
    name: regions.name,
    slug: regions.slug,
    status: regions.status
  }).from(regions).orderBy(regions.name);
  
  console.log("All regions:");
  allRegions.forEach(r => console.log(`  ${r.id}: ${r.name} (${r.slug}) - ${r.status}`));
  
  // Find duplicates by name
  const names = allRegions.map(r => r.name);
  const dupes = names.filter((name, i) => names.indexOf(name) !== i);
  if (dupes.length > 0) {
    console.log("\nDuplicate names found:", [...new Set(dupes)]);
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
