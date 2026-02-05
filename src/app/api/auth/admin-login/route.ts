import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  // Support both new (email + password) and legacy (password only) flows
  const result = email
    ? await authenticateAdmin(email, password)
    : await authenticateAdmin(password || body.password);

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
