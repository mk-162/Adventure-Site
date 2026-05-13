import "dotenv/config";
import { sql } from "./sql";

async function main() {
  try {
    // Check for regions with missing coordinates
    console.log("\n📍 Checking for regions with missing coordinates...\n");
    
    const regionsWithoutCoords = await sql`
      SELECT id, name, slug, lat, lng 
      FROM regions 
      WHERE lat IS NULL OR lng IS NULL
      ORDER BY name
    `;
    
    if (regionsWithoutCoords.rows.length === 0) {
      console.log("✅ All regions have coordinates!\n");
      return;
    }
    
    console.log("⚠️  Regions missing coordinates:\n");
    regionsWithoutCoords.rows.forEach((region) => {
      console.log(`  - ${region.name} (${region.slug})`);
    });
    
    console.log(`\nTotal: ${regionsWithoutCoords.rows.length}\n`);
    
    // Set center of Wales coordinates (52.13, -3.78) for regions without coords
    console.log("🔄 Updating regions with center-of-Wales coordinates (52.13, -3.78)...\n");
    
    const result = await sql`
      UPDATE regions 
      SET lat = 52.13, lng = -3.78 
      WHERE lat IS NULL OR lng IS NULL
    `;
    
    console.log(`✅ Successfully updated ${result.rowCount} regions!\n`);
    
    // Verify all regions now have coordinates
    const allRegions = await sql`
      SELECT id, name, slug, lat, lng 
      FROM regions 
      ORDER BY name
    `;
    
    console.log("📋 All regions:\n");
    allRegions.rows.forEach((region) => {
      const coords = region.lat && region.lng 
        ? `${region.lat}, ${region.lng}` 
        : "NO COORDS";
      console.log(`  ${coords === "NO COORDS" ? "❌" : "✓"} ${region.name} (${coords})`);
    });
    console.log();
    
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
