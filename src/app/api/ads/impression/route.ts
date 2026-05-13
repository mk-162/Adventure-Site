import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { adImpressions } from "@/db/schema";
import { z } from "zod";

const ImpressionBody = z.object({
  slotName: z.string().min(1).max(100),
  pageType: z.string().min(1).max(100),
  pageSlug: z.string().max(255).optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = ImpressionBody.safeParse(await request.json());

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
