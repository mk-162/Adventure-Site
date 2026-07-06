import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { magicLinks, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { setUserSession } from "@/lib/user-auth";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  // Redirect relative to the request itself — works regardless of env config
  const to = (path: string) => NextResponse.redirect(new URL(path, req.url));

  if (!token) {
    return to("/login?error=missing-token");
  }

  try {
    const linkRecord = await db.select().from(magicLinks)
      .where(eq(magicLinks.token, token))
      .limit(1);

    if (linkRecord.length === 0) {
      return to("/login?error=invalid-token");
    }

    const magicLink = linkRecord[0];

    if (magicLink.used) {
      return to("/login?error=token-used");
    }

    if (new Date() > magicLink.expiresAt) {
      return to("/login?error=token-expired");
    }

    // Mark as used
    await db.update(magicLinks).set({ used: true }).where(eq(magicLinks.id, magicLink.id));

    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, magicLink.email),
    });

    if (!user) {
      return to("/login?error=user-not-found");
    }

    // Update last login
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

    // Set session
    await setUserSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return to("/my-adventures");
  } catch (error) {
    console.error("User verify error:", error);
    return to("/login?error=server-error");
  }
}
