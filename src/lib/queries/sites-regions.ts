import { db } from "@/db";
import {
  sites,
  regions,
  activityTypes,
  activities,
  locations,
  accommodation,
  events,
  operators,
} from "@/db/schema";
import { eq, and, desc, asc, sql } from "drizzle-orm";

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

// =====================
// ACTIVITY TYPE BY REGION
// =====================

/**
 * Get activity types that have at least one activity in a region
 * Returns activity type + count of activities
 */
export async function getActivityTypesForRegion(regionId: number) {
  const result = await db
    .select({
      activityType: activityTypes,
      count: sql<number>`count(${activities.id})`,
    })
    .from(activities)
    .innerJoin(activityTypes, eq(activities.activityTypeId, activityTypes.id))
    .where(
      and(
        eq(activities.regionId, regionId),
        eq(activities.status, "published")
      )
    )
    .groupBy(activityTypes.id)
    .orderBy(desc(sql`count(${activities.id})`));

  return result;
}
