import { db } from "@/db";
import {
  regions,
  activityTypes,
  activities,
  locations,
  accommodation,
  operators,
  itineraries,
  itineraryItems,
  itineraryStops,
} from "@/db/schema";
import { eq, and, desc, asc, sql } from "drizzle-orm";

// =====================
// ITINERARY QUERIES
// =====================

export async function getItineraries(options?: {
  regionId?: number;
  limit?: number;
}) {
  const conditions = [eq(itineraries.status, "published")];

  if (options?.regionId) {
    conditions.push(eq(itineraries.regionId, options.regionId));
  }

  let query = db
    .select({
      itinerary: itineraries,
      region: regions,
    })
    .from(itineraries)
    .leftJoin(regions, eq(itineraries.regionId, regions.id))
    .where(and(...conditions))
    .orderBy(asc(itineraries.title));

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }

  return query;
}

export async function getItineraryBySlug(slug: string) {
  const result = await db
    .select({
      itinerary: itineraries,
      region: regions,
    })
    .from(itineraries)
    .leftJoin(regions, eq(itineraries.regionId, regions.id))
    .where(
      and(eq(itineraries.slug, slug), eq(itineraries.status, "published"))
    )
    .limit(1);

  if (!result[0]) return null;

  // Get itinerary items
  const items = await db
    .select({
      item: itineraryItems,
      activity: activities,
      accommodation: accommodation,
      location: locations,
    })
    .from(itineraryItems)
    .leftJoin(activities, eq(itineraryItems.activityId, activities.id))
    .leftJoin(
      accommodation,
      eq(itineraryItems.accommodationId, accommodation.id)
    )
    .leftJoin(locations, eq(itineraryItems.locationId, locations.id))
    .where(eq(itineraryItems.itineraryId, result[0].itinerary.id))
    .orderBy(asc(itineraryItems.dayNumber), asc(itineraryItems.orderIndex));

  return {
    ...result[0],
    items,
  };
}

// =====================
// ITINERARY STOPS QUERIES
// =====================

export async function getItineraryWithStops(slug: string) {
  const itineraryResult = await getItineraryBySlug(slug);
  if (!itineraryResult) return null;

  const stopsData = await db
    .select({
      stop: itineraryStops,
      activity: activities,
      activityType: activityTypes,
      accomm: accommodation,
      location: locations,
      operator: operators,
    })
    .from(itineraryStops)
    .leftJoin(activities, eq(itineraryStops.activityId, activities.id))
    .leftJoin(activityTypes, eq(activities.activityTypeId, activityTypes.id))
    .leftJoin(accommodation, eq(itineraryStops.accommodationId, accommodation.id))
    .leftJoin(locations, eq(itineraryStops.locationId, locations.id))
    .leftJoin(operators, eq(itineraryStops.operatorId, operators.id))
    .where(eq(itineraryStops.itineraryId, itineraryResult.itinerary.id))
    .orderBy(asc(itineraryStops.dayNumber), asc(itineraryStops.orderIndex));

  // Fetch wet/budget alt activities separately
  const wetAltIds = stopsData
    .map(s => s.stop.wetAltActivityId)
    .filter((id): id is number => id !== null);
  const budgetAltIds = stopsData
    .map(s => s.stop.budgetAltActivityId)
    .filter((id): id is number => id !== null);

  const allAltIds = [...new Set([...wetAltIds, ...budgetAltIds])];
  const altActivitiesMap: Record<number, typeof activities.$inferSelect> = {};

  if (allAltIds.length > 0) {
    const altResults = await db
      .select()
      .from(activities)
      .where(sql`${activities.id} IN (${sql.join(allAltIds.map(id => sql`${id}`), sql`, `)})`);
    for (const a of altResults) {
      altActivitiesMap[a.id] = a;
    }
  }

  const stops = stopsData.map(row => ({
    ...row.stop,
    activity: row.activity,
    activityType: row.activityType,
    accommodation: row.accomm,
    location: row.location,
    operator: row.operator,
    wetAltActivity: row.stop.wetAltActivityId ? altActivitiesMap[row.stop.wetAltActivityId] || null : null,
    budgetAltActivity: row.stop.budgetAltActivityId ? altActivitiesMap[row.stop.budgetAltActivityId] || null : null,
  }));

  return {
    ...itineraryResult,
    stops,
  };
}

// =====================
// ITINERARY LISTING QUERIES
// =====================

export async function getItinerariesForListing() {
  return db.query.itineraries.findMany({
    where: eq(itineraries.status, "published"),
    with: {
      region: true,
      itineraryTags: {
        with: {
          tag: true,
        },
      },
    },
    orderBy: [asc(itineraries.title)],
  });
}

export async function getFeaturedItineraries(limit = 3) {
  // Get itineraries with most stops (most comprehensive)
  const itinerariesWithStopCounts = await db
    .select({
      itinerary: itineraries,
      region: regions,
      stopCount: sql<number>`COUNT(${itineraryStops.id})`.as('stop_count'),
    })
    .from(itineraries)
    .leftJoin(regions, eq(itineraries.regionId, regions.id))
    .leftJoin(itineraryStops, eq(itineraries.id, itineraryStops.itineraryId))
    .where(eq(itineraries.status, "published"))
    .groupBy(itineraries.id, regions.id)
    .orderBy(desc(sql`COUNT(${itineraryStops.id})`))
    .limit(limit);

  return itinerariesWithStopCounts;
}

// =====================
// SLUG QUERIES FOR STATIC GENERATION
// =====================

export async function getAllItinerarySlugs() {
  const result = await db
    .select({ slug: itineraries.slug })
    .from(itineraries)
    .where(eq(itineraries.status, "published"));
  return result.map((r) => r.slug);
}
