import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { subscribeSchema, validateJsonBody } from "@/lib/api/validate";

export async function POST(request: NextRequest) {
  try {
    const v = await validateJsonBody(request, subscribeSchema);
    if (!v.ok) return v.response;

    const { email, source } = v.data;
    const normalizedEmail = email.toLowerCase();

    // Check for existing subscriber
    const existing = await db
      .select({ id: newsletterSubscribers.id })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "You're already subscribed!" },
        { status: 400 }
      );
    }

    // Insert new subscriber
    await db.insert(newsletterSubscribers).values({
      email: normalizedEmail,
      source: source || "website",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
