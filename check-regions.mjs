import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL
});

const result = await pool.query("SELECT id, name, slug, status FROM regions WHERE status = 'published' ORDER BY id LIMIT 10");
console.log(result.rows);
await pool.end();
