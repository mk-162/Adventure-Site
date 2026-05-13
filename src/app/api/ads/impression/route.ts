import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { adImpressions } from "@/db/schema";
import { adImpressionSchema } from "@/lib/api/validate";

export async function POST(request: NextRequest) {
  try {
    const parsed = adImpressionSchema.safeParse(await request.json().catch(() => null));

    // Impressions are best-effort: silently accept on validation failure
    if (!parsed.success) {
      return NextResponse.json({ ok: true });
    }

    const { slotName, pageType, pageSlug } = parsed.data;

    // Log impression (fire and forget - don't block on this)
    db.insert(adImpressions).values({
      slotName,
      pageType,
      pageSlug: pageSlug || null,
    }).catch(() => {
      // Silently fail - impressions are non-critical
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Always return success for impressions
  }
}
