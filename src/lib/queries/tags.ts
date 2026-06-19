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

  const tagsWithCounts = await Promise.all(
    result.map(async (tag) => {
      const [activityCount, accommodationCount, itineraryCount] =
        await Promise.all([
          db
            .select({ count: sql<number>`count(*)` })
            .from(activityTags)
            .where(eq(activityTags.tagId, tag.id)),
          db
            .select({ count: sql<number>`count(*)` })
            .from(accommodationTags)
            .where(eq(accommodationTags.tagId, tag.id)),
          db
            .select({ count: sql<number>`count(*)` })
            .from(itineraryTags)
            .where(eq(itineraryTags.tagId, tag.id)),
        ]);

      return {
        ...tag,
        count:
          Number(activityCount[0]?.count || 0) +
          Number(accommodationCount[0]?.count || 0) +
          Number(itineraryCount[0]?.count || 0),
      };
    })
  );

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
