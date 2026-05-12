const { neon } = require("@neondatabase/serverless");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

const neonSql = neon(databaseUrl);

async function sql(strings, ...values) {
  const rows = await neonSql(strings, ...values);
  return {
    rows,
    rowCount: rows.length,
  };
}

sql.query = async function query(text, values = []) {
  const rows = await neonSql.query(text, values);
  return {
    rows,
    rowCount: rows.length,
  };
};

module.exports = { sql };
