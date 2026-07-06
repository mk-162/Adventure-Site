import { db } from "@/db";
import { regions, accommodation } from "@/db/schema";
import { eq, and, asc, inArray } from "drizzle-orm";
import { getRegionBySlug } from "./sites-regions";

// =====================
// ACCOMMODATION QUERIES
// =====================

export async function getAccommodation(options?: {
  regionId?: number;
  /** Filter to a set of regions (e.g. launch regions). Ignored if regionId is set. */
  regionIds?: number[];
  type?: string;
  limit?: number;
  offset?: number;
}) {
  const conditions = [eq(accommodation.status, "published")];

  if (options?.regionId) {
    conditions.push(eq(accommodation.regionId, options.regionId));
  } else if (options?.regionIds && options.regionIds.length > 0) {
    conditions.push(inArray(accommodation.regionId, options.regionIds));
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
// SLUG QUERIES FOR STATIC GENERATION
// =====================

export async function getAllAccommodationSlugs() {
  const result = await db
    .select({ slug: accommodation.slug })
    .from(accommodation)
    .where(eq(accommodation.status, "published"));
  return result.map((r) => r.slug);
}
