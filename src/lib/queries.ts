import { db } from "@/db";
import {
  sites,
  regions,
  activityTypes,
  activities,
  locations,
  accommodation,
  events,
  transport,
  operators,
  itineraries,
  itineraryItems,
  answers,
} from "@/db/schema";
import { eq, and, ilike, desc, asc, sql } from "drizzle-orm";

// =====================
// SITE QUERIES
// =====================

export async function getSiteByDomain(domain: string) {
  const result = await db
    .select()
    .from(sites)
    .where(eq(sites.domain, domain))
    .limit(1);
  return result[0] || null;
}

export async function getDefaultSite() {
  const result = await db.select().from(sites).limit(1);
  return result[0] || null;
}

// =====================
// REGION QUERIES
// =====================

export async function getAllRegions(siteId?: number) {
  const query = db
    .select()
    .from(regions)
    .where(eq(regions.status, "published"))
    .orderBy(asc(regions.name));

  return query;
}

export async function getRegionBySlug(slug: string) {
  const result = await db
    .select()
    .from(regions)
    .where(and(eq(regions.slug, slug), eq(regions.status, "published")))
    .limit(1);
  return result[0] || null;
}

export async function getRegionWithStats(slug: string) {
  const region = await getRegionBySlug(slug);
  if (!region) return null;

  const [activitiesCount, accommodationCount, eventsCount, operatorsCount] =
    await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(activities)
        .where(
          and(
            eq(activities.regionId, region.id),
            eq(activities.status, "published")
          )
        ),
      db
        .select({ count: sql<number>`count(*)` })
        .from(accommodation)
        .where(
          and(
            eq(accommodation.regionId, region.id),
            eq(accommodation.status, "published")
          )
        ),
      db
        .select({ count: sql<number>`count(*)` })
        .from(events)
        .where(
          and(eq(events.regionId, region.id), eq(events.status, "published"))
        ),
      db
        .select({ count: sql<number>`count(*)` })
        .from(operators)
        .where(eq(operators.claimStatus, "claimed")),
    ]);

  return {
    ...region,
    stats: {
      activities: Number(activitiesCount[0]?.count || 0),
      accommodation: Number(accommodationCount[0]?.count || 0),
      events: Number(eventsCount[0]?.count || 0),
      operators: Number(operatorsCount[0]?.count || 0),
    },
  };
}

// =====================
// ACTIVITY TYPE QUERIES
// =====================

export async function getAllActivityTypes() {
  return db.select().from(activityTypes).orderBy(asc(activityTypes.name));
}

export async function getActivityTypeBySlug(slug: string) {
  const result = await db
    .select()
    .from(activityTypes)
    .where(eq(activityTypes.slug, slug))
    .limit(1);
  return result[0] || null;
}

// =====================
// ACTIVITY QUERIES
// =====================

export async function getActivities(options?: {
  regionId?: number;
  activityTypeId?: number;
  operatorId?: number;
  limit?: number;
  offset?: number;
}) {
  const conditions = [eq(activities.status, "published")];

  if (options?.regionId) {
    conditions.push(eq(activities.regionId, options.regionId));
  }
  if (options?.activityTypeId) {
    conditions.push(eq(activities.activityTypeId, options.activityTypeId));
  }
  if (options?.operatorId) {
    conditions.push(eq(activities.operatorId, options.operatorId));
  }

  let query = db
    .select({
      activity: activities,
      region: regions,
      operator: operators,
      activityType: activityTypes,
    })
    .from(activities)
    .leftJoin(regions, eq(activities.regionId, regions.id))
    .leftJoin(operators, eq(activities.operatorId, operators.id))
    .leftJoin(activityTypes, eq(activities.activityTypeId, activityTypes.id))
    .where(and(...conditions))
    .orderBy(asc(activities.name));

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }
  if (options?.offset) {
    query = query.offset(options.offset) as typeof query;
  }

  return query;
}

export async function getActivityBySlug(slug: string) {
  const result = await db
    .select({
      activity: activities,
      region: regions,
      operator: operators,
      activityType: activityTypes,
    })
    .from(activities)
    .leftJoin(regions, eq(activities.regionId, regions.id))
    .leftJoin(operators, eq(activities.operatorId, operators.id))
    .leftJoin(activityTypes, eq(activities.activityTypeId, activityTypes.id))
    .where(and(eq(activities.slug, slug), eq(activities.status, "published")))
    .limit(1);
  return result[0] || null;
}

export async function getActivitiesByRegion(regionSlug: string, limit?: number) {
  const region = await getRegionBySlug(regionSlug);
  if (!region) return [];

  return getActivities({ regionId: region.id, limit });
}

export async function getActivitiesByType(
  regionSlug: string,
  activityTypeSlug: string,
  limit?: number
) {
  const [region, activityType] = await Promise.all([
    getRegionBySlug(regionSlug),
    getActivityTypeBySlug(activityTypeSlug),
  ]);

  if (!region || !activityType) return [];

  return getActivities({
    regionId: region.id,
    activityTypeId: activityType.id,
    limit,
  });
}

// =====================
// OPERATOR QUERIES
// =====================

export async function getOperators(options?: {
  regionSlug?: string;
  activityTypeSlug?: string;
  claimStatus?: "stub" | "claimed" | "premium";
  limit?: number;
  offset?: number;
}) {
  // For now, return all claimed operators
  // TODO: Filter by region/activity type arrays
  let query = db
    .select()
    .from(operators)
    .where(eq(operators.claimStatus, options?.claimStatus || "claimed"))
    .orderBy(asc(operators.name));

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }

  return query;
}

export async function getOperatorBySlug(slug: string) {
  const result = await db
    .select()
    .from(operators)
    .where(eq(operators.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function getOperatorWithActivities(slug: string) {
  const operator = await getOperatorBySlug(slug);
  if (!operator) return null;

  const operatorActivities = await getActivities({ operatorId: operator.id });

  return {
    ...operator,
    activities: operatorActivities,
  };
}

// =====================
// ACCOMMODATION QUERIES
// =====================

export async function getAccommodation(options?: {
  regionId?: number;
  type?: string;
  limit?: number;
  offset?: number;
}) {
  const conditions = [eq(accommodation.status, "published")];

  if (options?.regionId) {
    conditions.push(eq(accommodation.regionId, options.regionId));
  }
  if (options?.type) {
    conditions.push(eq(accommodation.type, options.type));
  }

  let query = db
    .select({
      accommodation: accommodation,
      region: regions,
    })
    .from(accommodation)
    .leftJoin(regions, eq(accommodation.regionId, regions.id))
    .where(and(...conditions))
    .orderBy(asc(accommodation.name));

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }

  return query;
}

export async function getAccommodationBySlug(slug: string) {
  const result = await db
    .select({
      accommodation: accommodation,
      region: regions,
    })
    .from(accommodation)
    .leftJoin(regions, eq(accommodation.regionId, regions.id))
    .where(
      and(eq(accommodation.slug, slug), eq(accommodation.status, "published"))
    )
    .limit(1);
  return result[0] || null;
}

export async function getAccommodationByRegion(regionSlug: string, limit?: number) {
  const region = await getRegionBySlug(regionSlug);
  if (!region) return [];

  return getAccommodation({ regionId: region.id, limit });
}

// =====================
// EVENT QUERIES
// =====================

export async function getEvents(options?: {
  regionId?: number;
  type?: string;
  limit?: number;
  offset?: number;
}) {
  const conditions = [eq(events.status, "published")];

  if (options?.regionId) {
    conditions.push(eq(events.regionId, options.regionId));
  }
  if (options?.type) {
    conditions.push(eq(events.type, options.type));
  }

  let query = db
    .select({
      event: events,
      region: regions,
    })
    .from(events)
    .leftJoin(regions, eq(events.regionId, regions.id))
    .where(and(...conditions))
    .orderBy(asc(events.name));

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }

  return query;
}

export async function getEventBySlug(slug: string) {
  const result = await db
    .select({
      event: events,
      region: regions,
    })
    .from(events)
    .leftJoin(regions, eq(events.regionId, regions.id))
    .where(and(eq(events.slug, slug), eq(events.status, "published")))
    .limit(1);
  return result[0] || null;
}

// =====================
// LOCATION QUERIES
// =====================

export async function getLocations(options?: {
  regionId?: number;
  limit?: number;
}) {
  const conditions = [eq(locations.status, "published")];

  if (options?.regionId) {
    conditions.push(eq(locations.regionId, options.regionId));
  }

  let query = db
    .select({
      location: locations,
      region: regions,
    })
    .from(locations)
    .leftJoin(regions, eq(locations.regionId, regions.id))
    .where(and(...conditions))
    .orderBy(asc(locations.name));

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }

  return query;
}

// =====================
// TRANSPORT QUERIES
// =====================

export async function getTransport(options?: {
  regionId?: number;
  type?: string;
  limit?: number;
}) {
  const conditions: any[] = [];

  if (options?.regionId) {
    conditions.push(eq(transport.regionId, options.regionId));
  }
  if (options?.type) {
    conditions.push(eq(transport.type, options.type));
  }

  let query = db
    .select({
      transport: transport,
      region: regions,
    })
    .from(transport)
    .leftJoin(regions, eq(transport.regionId, regions.id))
    .orderBy(asc(transport.name));

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }

  return query;
}

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
// ANSWER/FAQ QUERIES
// =====================

export async function getAnswers(options?: {
  regionId?: number;
  limit?: number;
}) {
  const conditions = [eq(answers.status, "published")];

  if (options?.regionId) {
    conditions.push(eq(answers.regionId, options.regionId));
  }

  let query = db
    .select({
      answer: answers,
      region: regions,
    })
    .from(answers)
    .leftJoin(regions, eq(answers.regionId, regions.id))
    .where(and(...conditions))
    .orderBy(asc(answers.question));

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }

  return query;
}

export async function getAnswerBySlug(slug: string) {
  const result = await db
    .select({
      answer: answers,
      region: regions,
    })
    .from(answers)
    .leftJoin(regions, eq(answers.regionId, regions.id))
    .where(and(eq(answers.slug, slug), eq(answers.status, "published")))
    .limit(1);
  return result[0] || null;
}

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

// =====================
// MAP-SPECIFIC QUERIES
// =====================

export async function getAllRegionsWithCoordinates() {
  return db
    .select()
    .from(regions)
    .where(
      and(
        eq(regions.status, "published"),
        sql`${regions.lat} IS NOT NULL`,
        sql`${regions.lng} IS NOT NULL`
      )
    )
    .orderBy(asc(regions.name));
}

export async function getRegionEntitiesForMap(regionId: number) {
  const [regionActivities, regionAccommodation, regionLocations, regionEvents] =
    await Promise.all([
      db
        .select()
        .from(activities)
        .where(
          and(
            eq(activities.regionId, regionId),
            eq(activities.status, "published"),
            sql`${activities.lat} IS NOT NULL`,
            sql`${activities.lng} IS NOT NULL`
          )
        ),
      db
        .select()
        .from(accommodation)
        .where(
          and(
            eq(accommodation.regionId, regionId),
            eq(accommodation.status, "published"),
            sql`${accommodation.lat} IS NOT NULL`,
            sql`${accommodation.lng} IS NOT NULL`
          )
        ),
      db
        .select()
        .from(locations)
        .where(
          and(
            eq(locations.regionId, regionId),
            eq(locations.status, "published"),
            sql`${locations.lat} IS NOT NULL`,
            sql`${locations.lng} IS NOT NULL`
          )
        ),
      db
        .select()
        .from(events)
        .where(
          and(
            eq(events.regionId, regionId),
            eq(events.status, "published"),
            sql`${events.lat} IS NOT NULL`,
            sql`${events.lng} IS NOT NULL`
          )
        ),
    ]);

  return {
    activities: regionActivities,
    accommodation: regionAccommodation,
    locations: regionLocations,
    events: regionEvents,
  };
}
