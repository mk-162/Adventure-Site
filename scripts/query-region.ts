import 'dotenv/config';
import { sql } from '@vercel/postgres';

async function main() {
  const region = process.argv[2] || 'snowdonia';
  const result = await sql`SELECT name, slug, description FROM regions WHERE slug = ${region}`;
  console.log(JSON.stringify(result.rows[0], null, 2));
}
main().catch(console.error);
