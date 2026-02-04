import "dotenv/config";
import { sql } from "@vercel/postgres";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const journalDir = path.join(process.cwd(), "data", "journal");
  const files = fs.readdirSync(journalDir).filter(f => f.endsWith(".json"));
  
  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(journalDir, file), "utf-8"));
    
    if (!data.heroImage || !data.slug) {
      skipped++;
      continue;
    }

    const result = await sql`
      UPDATE posts 
      SET hero_image = ${data.heroImage}, updated_at = NOW()
      WHERE slug = ${data.slug} AND (hero_image IS NULL OR hero_image != ${data.heroImage})
    `;
    
    if (result.rowCount && result.rowCount > 0) {
      console.log(`✅ ${data.slug} → ${data.heroImage}`);
      updated++;
    } else {
      skipped++;
    }
  }

  console.log(`\n=== Done: ${updated} updated, ${skipped} skipped ===`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
