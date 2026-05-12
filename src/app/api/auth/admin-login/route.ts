import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const AdminLoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const parsed = AdminLoginBody.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { email, password } = parsed.data;
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
