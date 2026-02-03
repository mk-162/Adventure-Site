import { db } from "./src/db";
import { regions } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const region = await db.select().from(regions).where(eq(regions.slug, "snowdonia")).limit(1);
  console.log("Description length:", region[0]?.description?.length);
  console.log("Description preview:", region[0]?.description?.substring(0, 500));
}
main().then(() => process.exit(0));
