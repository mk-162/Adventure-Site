import { db } from "@/db";
import { operators } from "@/db/schema";
import { eq, and, desc, asc, sql, arrayContains, gte } from "drizzle-orm";
import { getActivities } from "./activities";

// =====================
// OPERATOR QUERIES
// =====================

export async function getOperators(options?: {
  regionSlug?: string;
  activityTypeSlug?: string;
  claimStatus?: "stub" | "claimed" | "premium";
  category?: string;
  minRating?: number;
  query?: string;
  limit?: number;
  offset?: number;
  sortBy?: "recommended" | "rating" | "name" | "distance";
  lat?: number;
  lng?: number;
  maxDistanceKm?: number;
}) {
  const conditions = [];
  const hasGeo = typeof options?.lat === "number" && typeof options?.lng === "number";
  const distanceExpression = hasGeo
    ? sql<number>`(6371 * acos(
        cos(radians(${options?.lat})) * cos(radians(${operators.lat})) *
        cos(radians(${operators.lng}) - radians(${options?.lng})) +
        sin(radians(${options?.lat})) * sin(radians(${operators.lat}))
      ))`
    : null;

  if (options?.claimStatus) {
    conditions.push(eq(operators.claimStatus, options.claimStatus));
  }
  // Default: show all operators (stub, claimed, premium)

  if (options?.category) {
    conditions.push(eq(operators.category, options.category as any));
  }

  if (options?.regionSlug) {
    conditions.push(arrayContains(operators.regions, [options.regionSlug]));
  }

  if (options?.activityTypeSlug) {
    conditions.push(arrayContains(operators.activityTypes, [options.activityTypeSlug]));
  }

  if (options?.minRating) {
    conditions.push(gte(operators.googleRating, options.minRating.toString()));
  }

  if (options?.query) {
    const search = `%${options.query}%`;
    conditions.push(sql`(${operators.name} ILIKE ${search} OR ${operators.tagline} ILIKE ${search})`);
  }

  if (hasGeo && options?.maxDistanceKm && distanceExpression) {
    conditions.push(sql`
      ${operators.lat} IS NOT NULL
      AND ${operators.lng} IS NOT NULL
      AND ${distanceExpression} <= ${options.maxDistanceKm}
    `);
  }

  // Count query
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(operators)
    .where(and(...conditions));

  const total = Number(countResult[0]?.count || 0);

  let query = db
    .select()
    .from(operators);

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  if (options?.sortBy === "distance" && distanceExpression) {
    query = query.orderBy(sql`${distanceExpression} ASC NULLS LAST`, asc(operators.name)) as typeof query;
  } else if (options?.sortBy === "rating") {
    query = query.orderBy(desc(operators.googleRating), asc(operators.name)) as typeof query;
  } else if (options?.sortBy === "recommended") {
    query = query.orderBy(
      desc(sql`CASE WHEN ${operators.claimStatus} = 'premium' THEN 1 ELSE 0 END`),
      desc(operators.googleRating),
      asc(operators.name)
    ) as typeof query;
  } else {
    query = query.orderBy(asc(operators.name)) as typeof query;
  }

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }

  if (options?.offset) {
    query = query.offset(options.offset) as typeof query;
  }

  const result = await query;

  return { operators: result, total };
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
