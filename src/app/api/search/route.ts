import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { activities, operators, regions, accommodation } from "@/db/schema";
import { ilike, or, eq, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const typesParam = searchParams.get("type");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  const types = typesParam ? typesParam.split(",").map((t) => t.trim()) : [];
  const searchAll = types.length === 0;
  const limit = 10;

  const results: {
    activities: any[];
    operators: any[];
    regions: any[];
    accommodation: any[];
  } = {
    activities: [],
    operators: [],
    regions: [],
    accommodation: [],
  };

  try {
    const promises = [];

    // Activities
    if (searchAll || types.includes("activities")) {
      promises.push(
        db
          .select({
            id: activities.id,
            name: activities.name,
            slug: activities.slug,
            description: activities.description,
            type: sql<string>`'activity'`,
          })
          .from(activities)
          .where(
            and(
              eq(activities.status, "published"),
              or(
                ilike(activities.name, `%${query}%`),
                ilike(activities.description, `%${query}%`)
              )
            )
          )
          .limit(limit)
          .then((res) => {
            results.activities = res;
          })
      );
    }

    // Operators
    if (searchAll || types.includes("operators")) {
      promises.push(
        db
          .select({
            id: operators.id,
            name: operators.name,
            slug: operators.slug,
            description: operators.description,
            type: sql<string>`'operator'`,
          })
          .from(operators)
          .where(
            or(
              ilike(operators.name, `%${query}%`),
              ilike(operators.description, `%${query}%`)
            )
          )
          .limit(limit)
          .then((res) => {
            results.operators = res;
          })
      );
    }

    // Regions
    if (searchAll || types.includes("regions")) {
      promises.push(
        db
          .select({
            id: regions.id,
            name: regions.name,
            slug: regions.slug,
            description: regions.description,
            type: sql<string>`'region'`,
          })
          .from(regions)
          .where(
            and(
              eq(regions.status, "published"),
              or(
                ilike(regions.name, `%${query}%`),
                ilike(regions.description, `%${query}%`)
              )
            )
          )
          .limit(limit)
          .then((res) => {
            results.regions = res;
          })
      );
    }

    // Accommodation
    if (searchAll || types.includes("accommodation")) {
      promises.push(
        db
          .select({
            id: accommodation.id,
            name: accommodation.name,
            slug: accommodation.slug,
            description: accommodation.description,
            type: sql<string>`'accommodation'`,
          })
          .from(accommodation)
          .where(
            and(
              eq(accommodation.status, "published"),
              or(
                ilike(accommodation.name, `%${query}%`),
                ilike(accommodation.description, `%${query}%`)
              )
            )
          )
          .limit(limit)
          .then((res) => {
            results.accommodation = res;
          })
      );
    }

    await Promise.all(promises);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
