import "dotenv/config";
import { sql } from "@vercel/postgres";

async function main() {
  const regions = await sql`SELECT slug FROM regions WHERE status='published' LIMIT 3`;
  const activities = await sql`SELECT slug FROM activities WHERE status='published' LIMIT 3`;
  const accommodation = await sql`SELECT slug FROM accommodation WHERE status='published' LIMIT 3`;
  const operators = await sql`SELECT slug FROM operators LIMIT 3`;
  const itineraries = await sql`SELECT slug FROM itineraries WHERE status='published' LIMIT 3`;
  const events = await sql`SELECT slug FROM events LIMIT 3`;
  const posts = await sql`SELECT slug, category FROM posts WHERE status='published' LIMIT 5`;
  const answers = await sql`SELECT slug FROM answers LIMIT 3`;
  const tags = await sql`SELECT slug FROM tags LIMIT 3`;
  const guides = await sql`SELECT slug FROM posts WHERE status='published' LIMIT 3`;
  const safety = await sql`SELECT slug FROM answers WHERE slug LIKE '%safety%' LIMIT 3`;
  const activityTypes = await sql`SELECT slug FROM activity_types LIMIT 3`;

  console.log(JSON.stringify({
    regions: regions.rows.map(r => r.slug),
    activities: activities.rows.map(r => r.slug),
    accommodation: accommodation.rows.map(r => r.slug),
    operators: operators.rows.map(r => r.slug),
    itineraries: itineraries.rows.map(r => r.slug),
    events: events.rows.map(r => r.slug),
    posts: posts.rows.map(r => ({ slug: r.slug, category: r.category })),
    answers: answers.rows.map(r => r.slug),
    tags: tags.rows.map(r => r.slug),
    guides: guides.rows.map(r => r.slug),
    safety: safety.rows.map(r => r.slug),
    activityTypes: activityTypes.rows.map(r => r.slug),
  }, null, 2));
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
