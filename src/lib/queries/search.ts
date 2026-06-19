import { db } from "@/db";
import { regions, activities, locations, operators } from "@/db/schema";
import { eq, and, ilike } from "drizzle-orm";

// =====================
// SEARCH QUERIES
// =====================

export async function searchActivities(query: string, limit = 20) {
  return db
    .select({
      activity: activities,
      region: regions,
      operator: operators,
    })
    .from(activities)
    .leftJoin(regions, eq(activities.regionId, regions.id))
    .leftJoin(operators, eq(activities.operatorId, operators.id))
    .where(
      and(
        eq(activities.status, "published"),
        ilike(activities.name, `%${query}%`)
      )
    )
    .limit(limit);
}

export async function searchAll(query: string) {
  const [activitiesResults, operatorsResults, locationsResults] =
    await Promise.all([
      searchActivities(query, 5),
      db
        .select()
        .from(operators)
        .where(ilike(operators.name, `%${query}%`))
        .limit(5),
      db
        .select()
        .from(locations)
        .where(
          and(
            eq(locations.status, "published"),
            ilike(locations.name, `%${query}%`)
          )
        )
        .limit(5),
    ]);

  return {
    activities: activitiesResults,
    operators: operatorsResults,
    locations: locationsResults,
  };
}
