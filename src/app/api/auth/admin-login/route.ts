import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/admin-auth";
import { adminLoginSchema, validateJsonBody } from "@/lib/api/validate";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT_EMAIL = { limit: 5, windowMs: 60 * 60 * 1000 }; // 5 per email per hour
const RATE_LIMIT_IP = { limit: 20, windowMs: 60 * 60 * 1000 }; // 20 per IP per hour

export async function POST(request: Request) {
  const v = await validateJsonBody(request, adminLoginSchema);
  if (!v.ok) return v.response;

  const { email, password } = v.data;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (
    !checkRateLimit(`admin-login:email:${email.toLowerCase()}`, RATE_LIMIT_EMAIL.limit, RATE_LIMIT_EMAIL.windowMs) ||
    !checkRateLimit(`admin-login:ip:${ip}`, RATE_LIMIT_IP.limit, RATE_LIMIT_IP.windowMs)
  ) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }
  const result = await authenticateAdmin(email, password);

  if (!result) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({
    success: true,
    user: {
      email: result.session.email,
      name: result.session.name,
      role: result.session.role,
    },
  });

  response.cookies.set("admin_token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
