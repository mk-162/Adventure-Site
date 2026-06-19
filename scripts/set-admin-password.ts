/**
 * Set (or reset) the password for an admin user.
 *
 * Usage:
 *   npx tsx scripts/set-admin-password.ts <email> [password]
 *
 * If no password is given, a random 20-char one is generated and printed.
 * Reads DATABASE_URL from .env.local / environment.
 */
import "dotenv/config";
import { config } from "dotenv";
import { randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { hashPassword } from "../src/lib/password";

config({ path: ".env.local" });

async function main() {
  const [email, passwordArg] = process.argv.slice(2);
  if (!email) {
    console.error("Usage: npx tsx scripts/set-admin-password.ts <email> [password]");
    process.exit(1);
  }
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const password =
    passwordArg ?? randomBytes(15).toString("base64url").slice(0, 20);
  const hash = await hashPassword(password);

  const sql = neon(databaseUrl);
  const rows = await sql`
    UPDATE admin_users SET password_hash = ${hash}
    WHERE email = ${email}
    RETURNING id, email, role
  `;

  if (rows.length === 0) {
    console.error(`No admin user found with email ${email}`);
    process.exit(1);
  }

  console.log(`Password updated for ${rows[0].email} (role: ${rows[0].role})`);
  if (!passwordArg) {
    console.log(`Generated password: ${password}`);
    console.log("Store it in a password manager — it is not recoverable.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
