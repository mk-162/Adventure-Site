import { db } from "@/db";
import {
  regions,
  activityTypes,
  activities,
  operators,
  activityRegions,
} from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { getRegionBySlug } from "./sites-regions";

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
    .leftJoin(operators, and(eq(activities.operatorId, operators.id), eq(operators.status, "published")))
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
    .leftJoin(operators, and(eq(activities.operatorId, operators.id), eq(operators.status, "published")))
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

// Get all activities of a given type (no region filter)
export async function getActivitiesByActivityType(activityTypeSlug: string, limit?: number) {
  const activityType = await getActivityTypeBySlug(activityTypeSlug);
  if (!activityType) return [];

  return getActivities({ activityTypeId: activityType.id, limit });
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

  // Get activities with primary region match + multi-tagged via activityRegions
  // junction. The two reads are independent — run in parallel.
  const [primaryResults, multiTagged] = await Promise.all([
    getActivities({
      regionId: region.id,
      activityTypeId: activityType.id,
      limit,
    }),
    db
      .select({
        activity: activities,
        region: regions,
        operator: operators,
        activityType: activityTypes,
      })
      .from(activityRegions)
      .innerJoin(activities, eq(activityRegions.activityId, activities.id))
      .leftJoin(regions, eq(activities.regionId, regions.id))
      .leftJoin(operators, and(eq(activities.operatorId, operators.id), eq(operators.status, "published")))
      .leftJoin(activityTypes, eq(activities.activityTypeId, activityTypes.id))
      .where(
        and(
          eq(activityRegions.regionId, region.id),
          eq(activities.activityTypeId, activityType.id),
          eq(activities.status, "published")
        )
      )
      .orderBy(asc(activities.name)),
  ]);

  // Merge and deduplicate by activity ID
  const seen = new Set(primaryResults.map((r) => r.activity.id));
  const combined = [...primaryResults];
  for (const item of multiTagged) {
    if (!seen.has(item.activity.id)) {
      seen.add(item.activity.id);
      combined.push(item);
    }
  }

  return limit ? combined.slice(0, limit) : combined;
}

// =====================
// SLUG QUERIES FOR STATIC GENERATION
// =====================

export async function getAllActivitySlugs() {
  const result = await db
    .select({ slug: activities.slug })
    .from(activities)
    .where(eq(activities.status, "published"));
  return result.map((r) => r.slug);
}
