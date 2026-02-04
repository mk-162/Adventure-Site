import "dotenv/config";
import { sql } from "@vercel/postgres";

async function main() {
  const res = await sql`
    SELECT 'regions' as tbl, count(*)::int as cnt FROM regions UNION ALL
    SELECT 'activities', count(*)::int FROM activities UNION ALL
    SELECT 'accommodation', count(*)::int FROM accommodation UNION ALL
    SELECT 'operators', count(*)::int FROM operators UNION ALL
    SELECT 'itineraries', count(*)::int FROM itineraries UNION ALL
    SELECT 'itinerary_stops', count(*)::int FROM itinerary_stops UNION ALL
    SELECT 'events', count(*)::int FROM events UNION ALL
    SELECT 'posts', count(*)::int FROM posts UNION ALL
    SELECT 'tags', count(*)::int FROM tags UNION ALL
    SELECT 'answers', count(*)::int FROM answers UNION ALL
    SELECT 'locations', count(*)::int FROM locations
    ORDER BY 1
  `;
  console.table(res.rows);

  // Check published vs draft
  const statusRes = await sql`
    SELECT 'activities' as tbl, a.status::text, count(*)::int as cnt FROM activities a GROUP BY a.status
    UNION ALL SELECT 'itineraries', i.status::text, count(*)::int FROM itineraries i GROUP BY i.status
    UNION ALL SELECT 'operators', o.claim_status::text, count(*)::int FROM operators o GROUP BY o.claim_status  
    UNION ALL SELECT 'regions', r.status::text, count(*)::int FROM regions r GROUP BY r.status
    UNION ALL SELECT 'posts', p.status::text, count(*)::int FROM posts p GROUP BY p.status
    UNION ALL SELECT 'accommodation', ac.status::text, count(*)::int FROM accommodation ac GROUP BY ac.status
    ORDER BY 1, 2
  `;
  console.log("\n=== STATUS BREAKDOWN ===");
  console.table(statusRes.rows);

  // Check itineraries with stops
  const itinRes = await sql`
    SELECT i.slug, i.title, i.duration_days, count(s.id)::int as stops
    FROM itineraries i
    LEFT JOIN itinerary_stops s ON s.itinerary_id = i.id
    GROUP BY i.id, i.slug, i.title, i.duration_days
    ORDER BY stops DESC
    LIMIT 20
  `;
  console.log("\n=== TOP ITINERARIES BY STOPS ===");
  console.table(itinRes.rows);

  // Check completeness
  const completeness = await sql`
    SELECT 'activities_no_coords' as check_name, count(*)::int as cnt FROM activities WHERE lat IS NULL OR lng IS NULL
    UNION ALL SELECT 'activities_no_price', count(*)::int FROM activities WHERE price_from IS NULL
    UNION ALL SELECT 'activities_no_description', count(*)::int FROM activities WHERE description IS NULL OR description = ''
    UNION ALL SELECT 'accommodation_no_coords', count(*)::int FROM accommodation WHERE lat IS NULL OR lng IS NULL
    UNION ALL SELECT 'operators_no_description', count(*)::int FROM operators WHERE description IS NULL OR description = ''
    UNION ALL SELECT 'operators_no_website', count(*)::int FROM operators WHERE website IS NULL OR website = ''
    UNION ALL SELECT 'regions_no_coords', count(*)::int FROM regions WHERE lat IS NULL OR lng IS NULL
    ORDER BY 1
  `;
  console.log("\n=== DATA COMPLETENESS GAPS ===");
  console.table(completeness.rows);

  // Check images
  const imageRes = await sql`
    SELECT 'activities_no_hero' as check_name, count(*)::int as cnt FROM activities WHERE 1=1
    UNION ALL SELECT 'regions_no_hero', count(*)::int FROM regions WHERE hero_image IS NULL OR hero_image = ''
    UNION ALL SELECT 'operators_no_logo', count(*)::int FROM operators WHERE logo_url IS NULL OR logo_url = ''
    UNION ALL SELECT 'operators_no_cover', count(*)::int FROM operators WHERE cover_image IS NULL OR cover_image = ''
    ORDER BY 1
  `;
  console.log("\n=== IMAGE GAPS ===");
  console.table(imageRes.rows);

  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
