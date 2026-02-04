import "dotenv/config";
import { sql } from "@vercel/postgres";

async function seedItinerary() {
  console.log("🌱 Seeding itinerary...");

  // 1. Get Site ID
  const siteRes = await sql`SELECT id FROM sites LIMIT 1`;
  let siteId = siteRes.rows[0]?.id;

  if (!siteId) {
      const siteResult = await sql`
        INSERT INTO sites (domain, name, tagline, primary_color, accent_color)
        VALUES ('adventurewales.com', 'Adventure Wales', 'Your Welsh Adventure Starts Here', '#1e3a4c', '#f97316')
        ON CONFLICT (domain) DO UPDATE SET name = 'Adventure Wales'
        RETURNING id
      `;
      siteId = siteResult.rows[0].id;
  }

  // 2. Get or Create Region (Snowdonia)
  let regionId;
  const regionRes = await sql`SELECT id FROM regions WHERE slug = 'snowdonia' LIMIT 1`;
  if (regionRes.rows.length > 0) {
    regionId = regionRes.rows[0].id;
  } else {
    const r = await sql`
      INSERT INTO regions (site_id, name, slug, description, lat, lng, status)
      VALUES (${siteId}, 'Snowdonia', 'snowdonia', 'Mountains and magic', 52.9, -3.9, 'published')
      RETURNING id
    `;
    regionId = r.rows[0].id;
  }

  // 3. Create/Get Activities for reference
  const activitiesToCreate = [
    { name: "Zip World Velocity 2", slug: "zip-world-velocity-2", lat: 53.17, lng: -4.06 },
    { name: "Mount Snowdon Hike", slug: "mount-snowdon-hike", lat: 53.06, lng: -4.07 },
    { name: "Slate Caverns", slug: "slate-caverns", lat: 52.99, lng: -3.94 }, // Wet weather alt
    { name: "Padarn Lake Walk", slug: "padarn-lake-walk", lat: 53.11, lng: -4.11 }, // Budget alt
    { name: "Surf Snowdonia", slug: "surf-snowdonia", lat: 53.19, lng: -3.83 },
    { name: "Conwy Castle", slug: "conwy-castle", lat: 53.28, lng: -3.83 }, // Wet weather alt
  ];

  const activityMap: Record<string, number> = {};

  // Insert Activity Types if missing
  const atRes = await sql`SELECT id FROM activity_types LIMIT 1`;
  let atId = atRes.rows[0]?.id;
  if (!atId) {
      const newAt = await sql`INSERT INTO activity_types (site_id, name, slug) VALUES (${siteId}, 'General', 'general') RETURNING id`;
      atId = newAt.rows[0].id;
  }

  for (const act of activitiesToCreate) {
    const res = await sql`
      INSERT INTO activities (site_id, region_id, activity_type_id, name, slug, lat, lng, status)
      VALUES (${siteId}, ${regionId}, ${atId}, ${act.name}, ${act.slug}, ${act.lat}, ${act.lng}, 'published')
      ON CONFLICT (site_id, slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `;
    activityMap[act.slug] = res.rows[0].id;
  }

  // 4. Create Itinerary
  const itinerarySlug = "ultimate-north-wales-weekend";
  
  let itineraryId;
  const itinRes = await sql`SELECT id FROM itineraries WHERE slug = ${itinerarySlug}`;
  if (itinRes.rows.length > 0) {
    itineraryId = itinRes.rows[0].id;
    await sql`DELETE FROM itinerary_stops WHERE itinerary_id = ${itineraryId}`;
    await sql`DELETE FROM itinerary_items WHERE itinerary_id = ${itineraryId}`; // Clear legacy items
  } else {
    const res = await sql`
      INSERT INTO itineraries (
        site_id, region_id, title, slug, tagline, description,
        duration_days, difficulty, best_season, price_estimate_from, price_estimate_to, status
      ) VALUES (
        ${siteId}, ${regionId}, 'The Ultimate North Wales Weekend', ${itinerarySlug},
        'Mountains, Castles and Coast in 3 Action-Packed Days',
        'Experience the best of Snowdonia with this thrill-seeker weekend guide.',
        3, 'moderate', 'Spring/Summer', 350, 600, 'published'
      )
      RETURNING id
    `;
    itineraryId = res.rows[0].id;
  }

  console.log(`Itinerary ID: ${itineraryId}`);

  // 5. Insert Stops
  // Day 1: Zip World
  await sql`
    INSERT INTO itinerary_stops (
      itinerary_id, day_number, order_index, stop_type,
      title, description, activity_id,
      start_time, duration, travel_to_next, travel_mode,
      wet_alt_title, wet_alt_description, wet_alt_activity_id, wet_alt_cost_from,
      budget_alt_title, budget_alt_description, budget_alt_activity_id, budget_alt_cost_from,
      lat, lng, cost_from
    ) VALUES (
      ${itineraryId}, 1, 1, 'activity',
      'The Fastest Zip Line in the World', 'Experience Velocity 2, soaring over Penrhyn Quarry.', ${activityMap['zip-world-velocity-2']},
      '10:00', '2 hours', '30 min drive', 'drive',
      'Explore the Slate Caverns', 'Go underground to escape the rain.', ${activityMap['slate-caverns']}, 25.00,
      'Walk around Padarn Lake', 'Enjoy the scenic views for free.', ${activityMap['padarn-lake-walk']}, 0.00,
      53.17, -4.06, 89.00
    )
  `;

  // Day 1: Lunch
  await sql`
    INSERT INTO itinerary_stops (
      itinerary_id, day_number, order_index, stop_type,
      title, description,
      start_time, duration,
      food_name, food_budget, food_type,
      lat, lng, cost_from
    ) VALUES (
      ${itineraryId}, 1, 2, 'food',
      'Lunch at The Slate', 'Great local food right by the quarry.',
      '12:30', '1 hour',
      'The Slate Restaurant', '£15-20', 'lunch',
      53.17, -4.06, 15.00
    )
  `;

    // Day 2: Snowdon
  await sql`
    INSERT INTO itinerary_stops (
      itinerary_id, day_number, order_index, stop_type,
      title, description, activity_id,
      start_time, duration,
      wet_alt_title, wet_alt_description, wet_alt_activity_id, wet_alt_cost_from,
      lat, lng, cost_from
    ) VALUES (
      ${itineraryId}, 2, 1, 'activity',
      'Conquer Mount Snowdon', 'Take the Pyg Track up to the summit.', ${activityMap['mount-snowdon-hike']},
      '09:00', '6 hours',
      'Visit Conwy Castle', 'Stay dry inside a medieval fortress.', ${activityMap['conwy-castle']}, 12.00,
      53.06, -4.07, 0.00
    )
  `;

  console.log("✅ Itinerary seeded successfully!");
  process.exit(0);
}

seedItinerary().catch((err) => {
    console.error(err);
    process.exit(1);
});
