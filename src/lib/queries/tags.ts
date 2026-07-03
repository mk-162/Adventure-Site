import { db } from "@/db";
import {
  regions,
  activityTypes,
  activities,
  accommodation,
  operators,
  itineraries,
  tags,
  activityTags,
  accommodationTags,
  itineraryTags,
} from "@/db/schema";
import { eq, and, asc, sql } from "drizzle-orm";

// =====================
// TAG QUERIES
// =====================

export async function getAllTags() {
  const result = await db.select().from(tags).orderBy(asc(tags.name));

  // Collapsed N+1: 3 grouped COUNT queries (one per join table) instead of
  // 3 per-tag queries. Merged in JS by tagId.
  const [activityCounts, accommodationCounts, itineraryCounts] =
    await Promise.all([
      db
        .select({
          tagId: activityTags.tagId,
          count: sql<number>`count(*)`,
        })
        .from(activityTags)
        .groupBy(activityTags.tagId),
      db
        .select({
          tagId: accommodationTags.tagId,
          count: sql<number>`count(*)`,
        })
        .from(accommodationTags)
        .groupBy(accommodationTags.tagId),
      db
        .select({
          tagId: itineraryTags.tagId,
          count: sql<number>`count(*)`,
        })
        .from(itineraryTags)
        .groupBy(itineraryTags.tagId),
    ]);

  const countMap = new Map<number, number>();
  for (const { tagId, count } of activityCounts) {
    countMap.set(tagId, (countMap.get(tagId) ?? 0) + Number(count));
  }
  for (const { tagId, count } of accommodationCounts) {
    countMap.set(tagId, (countMap.get(tagId) ?? 0) + Number(count));
  }
  for (const { tagId, count } of itineraryCounts) {
    countMap.set(tagId, (countMap.get(tagId) ?? 0) + Number(count));
  }

  const tagsWithCounts = result.map((tag) => ({
    ...tag,
    count: countMap.get(tag.id) ?? 0,
  }));

  return tagsWithCounts.sort((a, b) => {
    // Sort by type then name
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    return a.name.localeCompare(b.name);
  });
}

export async function getTagBySlug(slug: string) {
  const result = await db
    .select()
    .from(tags)
    .where(eq(tags.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function getTaggedActivities(tagId: number) {
  return db
    .select({
      activity: activities,
      region: regions,
      operator: operators,
      activityType: activityTypes,
    })
    .from(activities)
    .innerJoin(activityTags, eq(activities.id, activityTags.activityId))
    .leftJoin(regions, eq(activities.regionId, regions.id))
    .leftJoin(operators, eq(activities.operatorId, operators.id))
    .leftJoin(activityTypes, eq(activities.activityTypeId, activityTypes.id))
    .where(and(eq(activityTags.tagId, tagId), eq(activities.status, "published")));
}

export async function getTaggedAccommodation(tagId: number) {
  return db
    .select({
      accommodation: accommodation,
      region: regions,
    })
    .from(accommodation)
    .innerJoin(
      accommodationTags,
      eq(accommodation.id, accommodationTags.accommodationId)
    )
    .leftJoin(regions, eq(accommodation.regionId, regions.id))
    .where(
      and(
        eq(accommodationTags.tagId, tagId),
        eq(accommodation.status, "published")
      )
    );
}

export async function getTaggedItineraries(tagId: number) {
  return db
    .select({
      itinerary: itineraries,
      region: regions,
    })
    .from(itineraries)
    .innerJoin(itineraryTags, eq(itineraries.id, itineraryTags.itineraryId))
    .leftJoin(regions, eq(itineraries.regionId, regions.id))
    .where(
      and(eq(itineraryTags.tagId, tagId), eq(itineraries.status, "published"))
    );
}

export async function getRelatedTags(tagType: string) {
  return db
    .select()
    .from(tags)
    .where(eq(tags.type, tagType as any))
    .orderBy(asc(tags.name));
}

// =====================
// SLUG QUERIES FOR STATIC GENERATION
// =====================

export async function getAllTagSlugs() {
  const result = await db
    .select({ slug: tags.slug })
    .from(tags);
  return result.map((r) => r.slug);
}
