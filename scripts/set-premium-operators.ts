import "dotenv/config";
import { sql } from "@vercel/postgres";

async function main() {
  try {
    // First, query all operators
    console.log("\n📋 Current Operators:\n");
    const operators = await sql`
      SELECT slug, name, claim_status 
      FROM operators 
      ORDER BY name
    `;
    
    operators.rows.forEach((op) => {
      console.log(`  - ${op.name} (${op.slug}) [${op.claim_status}]`);
    });
    
    console.log(`\nTotal operators: ${operators.rows.length}\n`);
    
    // Pick 5-8 well-known operators to set as premium
    // Looking for recognizable names, adventure-focused operators
    const premiumSlugs = [
      "zip-world",                  // Famous zip-line attractions
      "plas-y-brenin",              // National Mountain Sports Centre
      "plas-menai",                 // National Watersports Centre
      "bikepark-wales",             // Major bike park
      "tyf-adventure",              // Well-known Pembrokeshire operator
      "adventure-britain",          // Major adventure company
      "snowdonia-mountain-guides",  // Professional guiding service
      "muuk-adventures",            // Recognized brand
    ];
    
    console.log("🌟 Setting these operators to PREMIUM:\n");
    premiumSlugs.forEach((slug) => {
      const op = operators.rows.find((o) => o.slug === slug);
      if (op) {
        console.log(`  ✓ ${op.name}`);
      } else {
        console.log(`  ⚠ ${slug} (not found in database)`);
      }
    });
    
    // Filter to only existing slugs
    const existingSlugs = premiumSlugs.filter((slug) => 
      operators.rows.some((o) => o.slug === slug)
    );
    
    if (existingSlugs.length === 0) {
      console.log("\n⚠️  No matching operators found. Aborting.");
      return;
    }
    
    console.log(`\n🔄 Updating ${existingSlugs.length} operators to premium...\n`);
    
    // Update the operators
    const result = await sql`
      UPDATE operators 
      SET claim_status = 'premium' 
      WHERE slug = ANY(${existingSlugs})
    `;
    
    console.log(`✅ Successfully updated ${result.rowCount} operators to premium status!\n`);
    
    // Verify the changes
    const updated = await sql`
      SELECT slug, name, claim_status 
      FROM operators 
      WHERE claim_status = 'premium'
      ORDER BY name
    `;
    
    console.log("✨ Premium operators:\n");
    updated.rows.forEach((op) => {
      console.log(`  🏆 ${op.name}`);
    });
    console.log();
    
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
