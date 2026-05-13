import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eventSaves } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { eventSaveIdParamSchema } from "@/lib/api/validate";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
      // Save
      await db.insert(eventSaves).values({
        eventId,
        sessionId,
      });
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
