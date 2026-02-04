import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { activities, operators } from "@/db/schema";
import { eq, and, ne, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const activityTypeId = searchParams.get("activityTypeId");
  const regionId = searchParams.get("regionId");
  const excludeId = searchParams.get("excludeId");

  if (!activityTypeId && !regionId) {
    return NextResponse.json(
      { error: "At least one of activityTypeId or regionId is required" },
      { status: 400 }
    );
  }

  try {
    const conditions = [eq(activities.status, "published")];

    if (activityTypeId) {
      conditions.push(eq(activities.activityTypeId, parseInt(activityTypeId)));
    }
    if (regionId) {
      conditions.push(eq(activities.regionId, parseInt(regionId)));
    }
    if (excludeId) {
      conditions.push(ne(activities.id, parseInt(excludeId)));
    }

    const results = await db
      .select({
        id: activities.id,
        name: activities.name,
        slug: activities.slug,
        priceFrom: activities.priceFrom,
        operatorName: operators.name,
      })
      .from(activities)
      .leftJoin(operators, eq(activities.operatorId, operators.id))
      .where(and(...conditions))
      .orderBy(sql`RANDOM()`)
      .limit(3);

    return NextResponse.json({ alternatives: results });
  } catch (error) {
    console.error("Error fetching alternatives:", error);
    return NextResponse.json(
      { error: "Failed to fetch alternatives" },
      { status: 500 }
    );
  }
}
