import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const COOKIE_NAME = "aw_user_session";

export interface UserToken {
  userId: number;
  email: string;
  name: string | null;
}

export function createUserToken(payload: UserToken): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "90d" });
}

export function verifyUserToken(token: string): UserToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as unknown as UserToken;
  } catch {
    return null;
  }
}

export async function getUserSession(): Promise<UserToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export async function setUserSession(payload: UserToken) {
  const cookieStore = await cookies();
  const token = createUserToken(payload);
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 90 * 24 * 60 * 60, // 90 days
    path: "/",
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
