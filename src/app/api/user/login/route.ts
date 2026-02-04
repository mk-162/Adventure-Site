import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, magicLinks } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { email, name, newsletterOptIn } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find or create user
    let user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user) {
      const result = await db.insert(users).values({
        email: email.toLowerCase(),
        name: name || null,
        newsletterOptIn: newsletterOptIn ?? false,
      }).returning();
      user = result[0];
    }

    // Create magic link
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await db.insert(magicLinks).values({
      email: email.toLowerCase(),
      token,
      purpose: "login",
      expiresAt,
    });

    // Send email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/api/user/verify?token=${token}`;

    // Use Resend if available
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "Adventure Wales <noreply@adventurewales.co.uk>",
        to: email.toLowerCase(),
        subject: "Sign in to Adventure Wales",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1e3a4c; padding: 24px; text-align: center;">
              <h1 style="color: white; margin: 0;">Adventure Wales</h1>
            </div>
            <div style="padding: 32px; background: #f9fafb;">
              <h2 style="color: #1e3a4c;">Sign In</h2>
              <p>Hey${user.name ? ` ${user.name}` : ""}! Click below to sign in to your Adventure Wales account.</p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verifyUrl}" style="background: #f97316; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Sign In →
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">This link expires in 48 hours. If you didn't request this, ignore this email.</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
