import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { 
  activities, 
  operators, 
  regions, 
  accommodation, 
  itineraries,
  activityTypes 
} from "@/db/schema";
import { ilike, or, eq, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Support both old query-based search and new filter-based search
  const query = searchParams.get("q");
  const regionSlug = searchParams.get("region");
  const activitySlug = searchParams.get("activity");
  const when = searchParams.get("when");
  const typesParam = searchParams.get("type");

  const types = typesParam ? typesParam.split(",").map((t) => t.trim()) : [];
  const searchAll = types.length === 0;
  const limit = 20;

  const results: {
    activities: any[];
    operators: any[];
    regions: any[];
    accommodation: any[];
    itineraries: any[];
  } = {
    activities: [],
    operators: [],
    regions: [],
    accommodation: [],
    itineraries: [],
  };

  try {
    // If it's a text-based search query
    if (query) {
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
              heroImage: operators.logoUrl,
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
              heroImage: regions.heroImage,
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

      // Itineraries
      if (searchAll || types.includes("itineraries")) {
        promises.push(
          db
            .select({
              id: itineraries.id,
              title: itineraries.title,
              slug: itineraries.slug,
              description: itineraries.description,
              heroImage: itineraries.heroImage,
              type: sql<string>`'itinerary'`,
            })
            .from(itineraries)
            .where(
              and(
                eq(itineraries.status, "published"),
                or(
                  ilike(itineraries.title, `%${query}%`),
                  ilike(itineraries.description, `%${query}%`)
                )
              )
            )
            .limit(limit)
            .then((res) => {
              results.itineraries = res;
            })
        );
      }

      await Promise.all(promises);
      return NextResponse.json(results);
    }

    // Filter-based search (new search widget approach)
    if (regionSlug || activitySlug || when) {
      const promises = [];

      // Get region ID if specified
      let regionId: number | null = null;
      if (regionSlug) {
        const regionResult = await db
          .select()
          .from(regions)
          .where(and(eq(regions.slug, regionSlug), eq(regions.status, "published")))
          .limit(1);
        regionId = regionResult[0]?.id || null;
      }

      // Get activity type ID if specified
      let activityTypeId: number | null = null;
      if (activitySlug) {
        const activityTypeResult = await db
          .select()
          .from(activityTypes)
          .where(eq(activityTypes.slug, activitySlug))
          .limit(1);
        activityTypeId = activityTypeResult[0]?.id || null;
      }

      // Build activity conditions
      const activityConditions: any[] = [eq(activities.status, "published")];
      if (regionId) activityConditions.push(eq(activities.regionId, regionId));
      if (activityTypeId) activityConditions.push(eq(activities.activityTypeId, activityTypeId));

      promises.push(
        db
          .select({
            id: activities.id,
            name: activities.name,
            slug: activities.slug,
            description: activities.description,
            regionId: activities.regionId,
            activityTypeId: activities.activityTypeId,
            type: sql<string>`'activity'`,
          })
          .from(activities)
          .where(and(...activityConditions))
          .limit(50)
          .then((res) => {
            results.activities = res;
          })
      );

      // Build itinerary conditions
      const itineraryConditions: any[] = [eq(itineraries.status, "published")];
      if (regionId) itineraryConditions.push(eq(itineraries.regionId, regionId));

      promises.push(
        db
          .select({
            id: itineraries.id,
            title: itineraries.title,
            slug: itineraries.slug,
            description: itineraries.description,
            heroImage: itineraries.heroImage,
            durationDays: itineraries.durationDays,
            type: sql<string>`'itinerary'`,
          })
          .from(itineraries)
          .where(and(...itineraryConditions))
          .limit(30)
          .then((res) => {
            results.itineraries = res;
          })
      );

      // Build accommodation conditions
      const accommodationConditions: any[] = [eq(accommodation.status, "published")];
      if (regionId) accommodationConditions.push(eq(accommodation.regionId, regionId));

      promises.push(
        db
          .select({
            id: accommodation.id,
            name: accommodation.name,
            slug: accommodation.slug,
            description: accommodation.description,
            accommodationType: accommodation.type,
            type: sql<string>`'accommodation'`,
          })
          .from(accommodation)
          .where(and(...accommodationConditions))
          .limit(30)
          .then((res) => {
            results.accommodation = res;
          })
      );

      await Promise.all(promises);
      return NextResponse.json(results);
    }

    // No search params provided
    return NextResponse.json(
      { error: "Please provide either 'q' for text search or filters (region, activity, when)" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
