import "dotenv/config";
import { sql } from "@vercel/postgres";

async function verifyImport() {
  // Total count
  const totalResult = await sql`SELECT COUNT(*) as count FROM posts WHERE site_id = 1`;
  console.log(`\n📊 Total posts in database: ${totalResult.rows[0].count}`);

  // Count by category
  const categoryResult = await sql`
    SELECT category, COUNT(*) as count 
    FROM posts 
    WHERE site_id = 1 
    GROUP BY category 
    ORDER BY count DESC
  `;

  console.log("\n📚 Posts by category:");
  categoryResult.rows.forEach((row: any) => {
    console.log(`   ${row.category}: ${row.count}`);
  });

  // Tagged posts
  const taggedResult = await sql`
    SELECT COUNT(DISTINCT post_id) as count FROM post_tags
  `;
  console.log(`\n🏷️  Posts with tags: ${taggedResult.rows[0].count}`);

  // Total tags created
  const totalTagsResult = await sql`
    SELECT COUNT(*) as count FROM post_tags
  `;
  console.log(`   Total tag links: ${totalTagsResult.rows[0].count}`);

  console.log("\n✅ Verification complete!\n");
}

verifyImport()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
