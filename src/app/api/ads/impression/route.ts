import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: NextRequest) {
  try {
    const { slotName, pageType, pageSlug } = await request.json();

    // Log impression (fire and forget - don't block on this)
    sql`
      INSERT INTO ad_impressions (slot_name, page_type, page_slug, created_at)
      VALUES (${slotName}, ${pageType}, ${pageSlug || null}, NOW())
    `.catch(() => {
      // Silently fail - impressions are non-critical
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Always return success for impressions
  }
}
