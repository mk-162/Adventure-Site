import * as jose from "jose";
import { cookies } from "next/headers";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

const _JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_SECRET;
if (!_JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET or ADMIN_SECRET must be set in production");
}
const SECRET_KEY = new TextEncoder().encode(_JWT_SECRET ?? "");
const COOKIE_NAME = "admin_token";
const ALG = "HS256";

export interface AdminSession {
  id: number;
  email: string;
  name: string | null;
  role: "super" | "admin" | "editor" | "viewer";
}

/**
 * Create a signed JWT for an admin user.
 */
export async function createAdminToken(payload: AdminSession): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

/**
 * Verify an admin JWT token. Returns the session or null.
 */
export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET_KEY);
    if (
      typeof payload.id === "number" &&
      typeof payload.email === "string"
    ) {
      return {
        id: payload.id,
        email: payload.email,
        name: (payload.name as string | null) ?? null,
        role: (payload.role as AdminSession["role"]) ?? "viewer",
      };
    }
  } catch {
    // Invalid or expired token
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
 */
export async function authenticateAdmin(
  emailOrPassword: string,
  password: string
): Promise<{ token: string; session: AdminSession } | null> {
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

  return { token: await createAdminToken(session), session };
}
