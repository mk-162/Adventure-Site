import { db } from "@/db";
import { regions, locations, transport } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

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

export async function getLocationBySlug(slug: string) {
  const result = await db
    .select({
      location: locations,
      region: regions,
    })
    .from(locations)
    .leftJoin(regions, eq(locations.regionId, regions.id))
    .where(and(eq(locations.slug, slug), eq(locations.status, "published")))
    .limit(1);
  return result[0] || null;
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
