import { NextResponse } from "next/server";
import { db } from "@/db";
import { pageViews, sites } from "@/db/schema";
import { sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { trackViewSchema, validateJsonBody } from "@/lib/api/validate";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT_IP = { limit: 60, windowMs: 60 * 60 * 1000 }; // 60 per IP per hour

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(`track-view:ip:${ip}`, RATE_LIMIT_IP.limit, RATE_LIMIT_IP.windowMs)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(RATE_LIMIT_IP.windowMs / 1000)) } }
      );
    }

    const v = await validateJsonBody(request, trackViewSchema);
    if (!v.ok) return v.response;
    const { pageType, pageSlug, operatorId } = v.data;
    const today = new Date().toISOString().split("T")[0];

    // Simple unique visitor tracking via cookie
    const cookieStore = await cookies();
    const viewedCookieName = `viewed_${pageType}_${pageSlug}_${today}`;
    const hasViewed = cookieStore.has(viewedCookieName);

    // Get default site (ID 1 usually)
    const site = await db.query.sites.findFirst();
    if (!site) return NextResponse.json({ error: "Site not found" }, { status: 500 });

    const incrementUnique = hasViewed ? 0 : 1;

    // Use sql.raw for date string if needed, but Drizzle should handle string for date column
    await db.insert(pageViews).values({
        siteId: site.id,
        pageType,
        pageSlug,
        operatorId: operatorId || null,
        viewDate: today,
        viewCount: 1,
        uniqueVisitors: incrementUnique,
    }).onConflictDoUpdate({
        target: [pageViews.siteId, pageViews.pageType, pageViews.pageSlug, pageViews.viewDate],
        set: {
            viewCount: sql`${pageViews.viewCount} + 1`,
            uniqueVisitors: sql`${pageViews.uniqueVisitors} + ${incrementUnique}`,
        }
    });

    const response = NextResponse.json({ success: true });

    // Set cookie if not present
    if (!hasViewed) {
        response.cookies.set(viewedCookieName, "1", { maxAge: 86400, path: "/", httpOnly: true });
    }

    return response;
  } catch (error) {
    console.error("Track view error", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
