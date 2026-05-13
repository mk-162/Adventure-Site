/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

type QueryResult<T = any> = {
  rows: T[];
  rowCount: number;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

const neonSql = neon(databaseUrl);

export async function sql<T = any>(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<QueryResult<T>> {
  const rows = (await neonSql(strings, ...values)) as T[];
  return {
    rows,
    rowCount: rows.length,
  };
}
