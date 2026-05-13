import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { newsletterSchema, validateJsonBody } from "@/lib/api/validate";

export async function POST(request: NextRequest) {
  try {
    const v = await validateJsonBody(request, newsletterSchema);
    if (!v.ok) return v.response;

    const email = v.data.email.toLowerCase();

    // Check if email already exists
    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "You're already subscribed!" },
        { status: 200 }
      );
    }

    // Insert new subscriber
    await db.insert(newsletterSubscribers).values({
      email,
      source: "homepage",
    });

    return NextResponse.json(
      { message: "Thanks! You're on the list." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
