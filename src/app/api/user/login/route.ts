import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, magicLinks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { userLoginSchema, validateJsonBody } from "@/lib/api/validate";
import { getAppUrl } from "@/lib/app-url";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT_EMAIL = { limit: 5, windowMs: 60 * 60 * 1000 };  // 5 per email per hour
const RATE_LIMIT_IP = { limit: 20, windowMs: 60 * 60 * 1000 };    // 20 per IP per hour

function tooManyRequests(windowMs: number) {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": String(Math.ceil(windowMs / 1000)) } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const v = await validateJsonBody(req, userLoginSchema);
    if (!v.ok) return v.response;

    const { name, newsletterOptIn } = v.data;
    const email = v.data.email.toLowerCase();

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(`user-login:email:${email}`, RATE_LIMIT_EMAIL.limit, RATE_LIMIT_EMAIL.windowMs)) {
      return tooManyRequests(RATE_LIMIT_EMAIL.windowMs);
    }
    if (!checkRateLimit(`user-login:ip:${ip}`, RATE_LIMIT_IP.limit, RATE_LIMIT_IP.windowMs)) {
      return tooManyRequests(RATE_LIMIT_IP.windowMs);
    }

    // Find or create user
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      const result = await db.insert(users).values({
        email,
        name: name || null,
        newsletterOptIn: newsletterOptIn ?? false,
      }).returning();
      user = result[0];
    }

    // Create magic link
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await db.insert(magicLinks).values({
      email,
      token,
      purpose: "login",
      expiresAt,
    });

    // Send email
    const verifyUrl = `${getAppUrl()}/api/user/verify?token=${token}`;

    if (!process.env.RESEND_API_KEY) {
      // Don't tell the user "check your email" when no email can be sent
      console.error("RESEND_API_KEY is not set — cannot send sign-in email");
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Sign-in email could not be sent" }, { status: 503 });
      }
      console.log(`[dev] magic link for ${email}: ${verifyUrl}`);
    }

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "Adventure Wales <noreply@adventurewales.co.uk>",
        to: email,
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
                <a href="${verifyUrl}" style="background: #ea580c; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
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
