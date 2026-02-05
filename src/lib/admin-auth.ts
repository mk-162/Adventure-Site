import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_SECRET || "dev-secret";
const COOKIE_NAME = "admin_token";

export interface AdminSession {
  id: number;
  email: string;
  name: string | null;
  role: "super" | "admin" | "editor" | "viewer";
}

/**
 * Create a signed JWT for an admin user.
 */
export function createAdminToken(payload: AdminSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify an admin token. Returns the session or null.
 * Also handles legacy shared-password tokens (plain string match).
 */
export function verifyAdminToken(token: string): AdminSession | null {
  // Try JWT first
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminSession;
    if (decoded.id && decoded.email) return decoded;
  } catch {
    // Not a JWT — check legacy shared password
  }

  // Legacy: token is the raw ADMIN_PASSWORD
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;
  if (adminPassword && token === adminPassword) {
    return {
      id: 0,
      email: "admin@local",
      name: "Legacy Admin",
      role: "super",
    };
  }

  return null;
}

/**
 * Get the current admin session from cookies.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Authenticate an admin by email + password.
 * Falls back to shared ADMIN_PASSWORD for backwards compatibility.
 */
export async function authenticateAdmin(
  emailOrPassword: string,
  password?: string
): Promise<{ token: string; session: AdminSession } | null> {
  // If only one arg provided, try legacy shared password
  if (!password) {
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;
    if (adminPassword && emailOrPassword === adminPassword) {
      const session: AdminSession = {
        id: 0,
        email: "admin@local",
        name: "Legacy Admin",
        role: "super",
      };
      return { token: createAdminToken(session), session };
    }
    return null;
  }

  // Email + password flow: look up admin user
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;

  const user = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, emailOrPassword))
    .limit(1);

  if (!user[0]) return null;

  // For now, validate against shared password (until per-user passwords are added)
  if (!adminPassword || password !== adminPassword) return null;

  // Update last login
  await db
    .update(adminUsers)
    .set({ lastLogin: new Date() })
    .where(eq(adminUsers.id, user[0].id));

  const session: AdminSession = {
    id: user[0].id,
    email: user[0].email,
    name: user[0].name,
    role: user[0].role,
  };

  return { token: createAdminToken(session), session };
}
