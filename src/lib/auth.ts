import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const COOKIE_NAME = "aw_operator_session";

interface OperatorToken {
  operatorId: number;
  email: string;
  name: string;
}

export function createToken(payload: OperatorToken): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): OperatorToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as OperatorToken;
  } catch {
    return null;
  }
}

export async function getOperatorSession(): Promise<OperatorToken | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setOperatorSession(payload: OperatorToken) {
  const cookieStore = await cookies();
  const token = createToken(payload);
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
