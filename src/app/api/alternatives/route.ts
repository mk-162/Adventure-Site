import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { activities, operators } from "@/db/schema";
import { eq, and, ne, sql } from "drizzle-orm";
import { parseIntQueryParam } from "@/lib/api/validate";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const activityTypeIdParam = parseIntQueryParam(searchParams, "activityTypeId");
  if (!activityTypeIdParam.ok) return activityTypeIdParam.response;
  const regionIdParam = parseIntQueryParam(searchParams, "regionId");
  if (!regionIdParam.ok) return regionIdParam.response;
  const excludeIdParam = parseIntQueryParam(searchParams, "excludeId");
  if (!excludeIdParam.ok) return excludeIdParam.response;

  const activityTypeId = activityTypeIdParam.value;
  const regionId = regionIdParam.value;
  const excludeId = excludeIdParam.value;

  if (activityTypeId === undefined && regionId === undefined) {
    return NextResponse.json(
      { error: "At least one of activityTypeId or regionId is required" },
      { status: 400 }
    );
  }

  try {
    const conditions = [eq(activities.status, "published")];

    if (activityTypeId !== undefined) {
      conditions.push(eq(activities.activityTypeId, activityTypeId));
    }
    if (regionId !== undefined) {
      conditions.push(eq(activities.regionId, regionId));
    }
    if (excludeId !== undefined) {
      conditions.push(ne(activities.id, excludeId));
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
