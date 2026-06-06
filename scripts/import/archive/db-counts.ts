#!/usr/bin/env node
/** Quick DB count checker — wrapped in async IIFE to avoid top-level await issue */
import { db } from '../../src/db';
import {
  sites, regions, activityTypes, activities, operators,
  accommodation, events, posts, tags, answers, locations, transport
} from '../../src/db/schema';
import { sql } from 'drizzle-orm';

async function main() {
  const tables = {
    sites, regions, activityTypes, activities, operators,
    accommodation, events, posts, tags, answers, locations, transport
  };

  for (const [name, table] of Object.entries(tables)) {
    const rows = await db.select({ count: sql`count(*)` }).from(table);
    console.log(`${name}: ${rows[0].count}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
