import * as jose from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "aw_user_session";
const ALG = "HS256";

export interface UserToken {
  userId: number;
  email: string;
  name: string | null;
}

export async function createUserToken(payload: UserToken): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("90d")
    .sign(SECRET_KEY);
}

export async function verifyUserToken(token: string): Promise<UserToken | null> {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET_KEY);
    if (
      typeof payload.userId === "number" &&
      typeof payload.email === "string"
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        name: (payload.name as string | null) ?? null,
      };
    }
  } catch {
    // Invalid or expired token
  }
  return null;
}

export async function getUserSession(): Promise<UserToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export async function setUserSession(payload: UserToken) {
  const cookieStore = await cookies();
  const token = await createUserToken(payload);
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
