import * as jose from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "aw_operator_session";
const ALG = "HS256";

interface OperatorToken {
  operatorId: number;
  email: string;
  name: string;
}

export async function createToken(payload: OperatorToken): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string): Promise<OperatorToken | null> {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET_KEY);
    if (
      typeof payload.operatorId === "number" &&
      typeof payload.email === "string" &&
      typeof payload.name === "string"
    ) {
      return {
        operatorId: payload.operatorId,
        email: payload.email,
        name: payload.name,
      };
    }
  } catch {
    // Invalid or expired token
  }
  return null;
}

export async function getOperatorSession(): Promise<OperatorToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setOperatorSession(payload: OperatorToken) {
  const cookieStore = await cookies();
  const token = await createToken(payload);
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });
}

export async function clearOperatorSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
