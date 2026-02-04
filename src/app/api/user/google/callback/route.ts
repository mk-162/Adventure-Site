import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { setUserSession } from "@/lib/user-auth";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const storedState = req.cookies.get("oauth_state")?.value;

  // CSRF check
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(`${baseUrl}/login?error=invalid-state`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=no-code`);
  }

  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.redirect(`${baseUrl}/login?error=server-error`);
    }

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${baseUrl}/api/user/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Google token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${baseUrl}/login?error=token-exchange`);
    }

    const tokens = await tokenRes.json();

    // Get user info from Google
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoRes.ok) {
      return NextResponse.redirect(`${baseUrl}/login?error=user-info`);
    }

    const googleUser = await userInfoRes.json();
    const email = googleUser.email?.toLowerCase();
    const name = googleUser.name || null;

    if (!email) {
      return NextResponse.redirect(`${baseUrl}/login?error=no-email`);
    }

    // Find or create user
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      const result = await db.insert(users).values({
        email,
        name,
        newsletterOptIn: false,
      }).returning();
      user = result[0];
    } else if (!user.name && name) {
      // Update name if we didn't have one
      await db.update(users).set({ name }).where(eq(users.id, user.id));
    }

    // Update last login
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

    // Set session
    await setUserSession({
      userId: user.id,
      email: user.email,
      name: user.name || name,
    });

    // Clear oauth state cookie and redirect
    const response = NextResponse.redirect(`${baseUrl}/my-adventures`);
    response.cookies.delete("oauth_state");
    return response;
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(`${baseUrl}/login?error=server-error`);
  }
}
