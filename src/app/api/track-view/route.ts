import { NextResponse } from "next/server";
import { db } from "@/db";
import { pageViews, sites } from "@/db/schema";
import { sql } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { pageType, pageSlug, operatorId } = await request.json();
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
