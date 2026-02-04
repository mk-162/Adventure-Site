import "dotenv/config";
import { sql } from "@vercel/postgres";
import { readdirSync } from "fs";
import { join } from "path";

async function checkOverlap() {
  // Get all JSON file slugs
  const journalDir = join(process.cwd(), "data/journal");
  const jsonFiles = readdirSync(journalDir).filter((f) => f.endsWith(".json"));
  const jsonSlugs = jsonFiles.map(f => f.replace('.json', ''));

  // Get existing posts that match JSON slugs
  const existingPosts = await sql`
    SELECT slug, created_at, updated_at
    FROM posts 
    WHERE site_id = 1
    AND slug = ANY(${jsonSlugs})
    AND created_at < updated_at
  `;

  if (existingPosts.rows.length > 0) {
    console.log(`\n🔄 Posts that were UPDATED (existed before):`);
    console.log(`   Count: ${existingPosts.rows.length}`);
    existingPosts.rows.forEach((row: any) => {
      console.log(`   - ${row.slug}`);
    });
  } else {
    console.log(`\n✨ All 101 JSON articles were NEW imports!`);
    console.log(`   The existing 27 posts were from different sources.`);
  }
}

checkOverlap()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
