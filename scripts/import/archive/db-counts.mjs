import { db } from '../../src/db';
import { sites, regions, activityTypes, activities, operators, accommodation, events, posts, tags, answers, locations, transport } from '../../src/db/schema';
import { sql } from 'drizzle-orm';

const tables = { sites, regions, activityTypes, activities, operators, accommodation, events, posts, tags, answers, locations, transport };

for (const [name, table] of Object.entries(tables)) {
  const rows = await db.select({ count: sql`count(*)` }).from(table);
  console.log(`${name}: ${rows[0].count}`);
}
