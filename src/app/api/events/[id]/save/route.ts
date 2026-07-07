import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eventSaves } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { eventSaveIdParamSchema, isUniqueViolationError } from "@/lib/api/validate";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT_IP = { limit: 30, windowMs: 60 * 60 * 1000 }; // 30 per IP per hour

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(`event-save:ip:${ip}`, RATE_LIMIT_IP.limit, RATE_LIMIT_IP.windowMs)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(RATE_LIMIT_IP.windowMs / 1000)) } }
    );
  }

  const parsed = eventSaveIdParamSchema.safeParse(await params);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.issues.map(
          (i) => `${i.path.join(".") || "params"}: ${i.message}`
        ),
      },
      { status: 400 }
    );
  }
  const eventId = parseInt(parsed.data.id);

  const cookieStore = await cookies();
  let sessionId = cookieStore.get("aw_session_id")?.value;

  // Set cookie if not exists
  if (!sessionId) {
    sessionId = randomUUID();
    cookieStore.set("aw_session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
    });
  }

  try {
    // Check if already saved
    const existing = await db
      .select()
      .from(eventSaves)
      .where(and(eq(eventSaves.eventId, eventId), eq(eventSaves.sessionId, sessionId)))
      .limit(1);

    let saved = false;

    if (existing.length > 0) {
      // Unsave
      await db
        .delete(eventSaves)
        .where(and(eq(eventSaves.eventId, eventId), eq(eventSaves.sessionId, sessionId)));
      saved = false;
    } else {
      // Save. Two concurrent toggles can both see "not saved" and both try
      // to insert — the unique_event_save constraint (event_id, session_id)
      // makes the loser a 23505, which just means the row is already saved.
      try {
        await db.insert(eventSaves).values({
          eventId,
          sessionId,
        });
      } catch (insertError) {
        if (!isUniqueViolationError(insertError)) throw insertError;
      }
      saved = true;
    }

    // Get count
    const countRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(eventSaves)
      .where(eq(eventSaves.eventId, eventId));

    const count = Number(countRes[0]?.count || 0);

    return NextResponse.json({ saved, count });
  } catch (error) {
    console.error("Error saving event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
