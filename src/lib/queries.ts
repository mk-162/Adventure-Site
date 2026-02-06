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
  tags,
  activityTags,
  activityRegions,
  accommodationTags,
  itineraryTags,
  posts,
  postTags,
  itineraryStops,
} from "@/db/schema";
import { eq, and, ilike, desc, asc, sql, arrayContains, gte } from "drizzle-orm";

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

  // Get activities with primary region match
  const primaryResults = await getActivities({
    regionId: region.id,
    activityTypeId: activityType.id,
    limit,
  });

  // Also get activities multi-tagged to this region via activityRegions junction
  const multiTagged = await db
    .select({
      activity: activities,
      region: regions,
      operator: operators,
      activityType: activityTypes,
    })
    .from(activityRegions)
    .innerJoin(activities, eq(activityRegions.activityId, activities.id))
    .leftJoin(regions, eq(activities.regionId, regions.id))
    .leftJoin(operators, eq(activities.operatorId, operators.id))
    .leftJoin(activityTypes, eq(activities.activityTypeId, activityTypes.id))
    .where(
      and(
        eq(activityRegions.regionId, region.id),
        eq(activities.activityTypeId, activityType.id),
        eq(activities.status, "published")
      )
    )
    .orderBy(asc(activities.name));

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
}) {
  const conditions = [];

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

  // Count query
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(operators)
    .where(and(...conditions));

  const total = Number(countResult[0]?.count || 0);

  let query = db
    .select()
    .from(operators)
    .orderBy(asc(operators.name));

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
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
// POST/JOURNAL QUERIES
// =====================

export async function getAllPosts(options?: {
  category?: string;
  tagSlug?: string;
  limit?: number;
  offset?: number;
}) {
  const conditions = [eq(posts.status, "published")];

  if (options?.category) {
    conditions.push(eq(posts.category, options.category as any));
  }

  let query = db
    .select({
      post: posts,
      region: regions,
      activityType: activityTypes,
    })
    .from(posts)
    .leftJoin(regions, eq(posts.regionId, regions.id))
    .leftJoin(activityTypes, eq(posts.activityTypeId, activityTypes.id))
    .where(and(...conditions))
    .orderBy(desc(posts.publishedAt));

  // If filtering by tag, join with postTags
  if (options?.tagSlug) {
    const tag = await getTagBySlug(options.tagSlug);
    if (tag) {
      query = db
        .select({
          post: posts,
          region: regions,
          activityType: activityTypes,
        })
        .from(posts)
        .innerJoin(postTags, eq(posts.id, postTags.postId))
        .leftJoin(regions, eq(posts.regionId, regions.id))
        .leftJoin(activityTypes, eq(posts.activityTypeId, activityTypes.id))
        .where(and(...conditions, eq(postTags.tagId, tag.id)))
        .orderBy(desc(posts.publishedAt)) as typeof query;
    }
  }

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }
  if (options?.offset) {
    query = query.offset(options.offset) as typeof query;
  }

  // Get tags for each post
  const results = await query;
  
  const postsWithTags = await Promise.all(
    results.map(async (result) => {
      const postTagsData = await db
        .select({
          tag: tags,
        })
        .from(postTags)
        .innerJoin(tags, eq(postTags.tagId, tags.id))
        .where(eq(postTags.postId, result.post.id));

      return {
        ...result,
        tags: postTagsData.map((pt) => pt.tag),
      };
    })
  );

  return postsWithTags;
}

export async function getPostsCount(options?: {
  category?: string;
  tagSlug?: string;
}): Promise<number> {
  const conditions = [eq(posts.status, "published")];

  if (options?.category) {
    conditions.push(eq(posts.category, options.category as any));
  }

  if (options?.tagSlug) {
    const tag = await getTagBySlug(options.tagSlug);
    if (tag) {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .innerJoin(postTags, eq(posts.id, postTags.postId))
        .where(and(...conditions, eq(postTags.tagId, tag.id)));
      return Number(result[0]?.count ?? 0);
    }
  }

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(posts)
    .where(and(...conditions));
  return Number(result[0]?.count ?? 0);
}

export async function getPostBySlug(slug: string) {
  const result = await db
    .select({
      post: posts,
      region: regions,
      activityType: activityTypes,
    })
    .from(posts)
    .leftJoin(regions, eq(posts.regionId, regions.id))
    .leftJoin(activityTypes, eq(posts.activityTypeId, activityTypes.id))
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);

  if (!result[0]) return null;

  // Get tags for this post
  const postTagsData = await db
    .select({
      tag: tags,
    })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, result[0].post.id));

  return {
    ...result[0],
    tags: postTagsData.map((pt) => pt.tag),
  };
}

export async function getRelatedPosts(
  postId: number,
  category: string,
  limit = 3
) {
  return db
    .select({
      post: posts,
      region: regions,
      activityType: activityTypes,
    })
    .from(posts)
    .leftJoin(regions, eq(posts.regionId, regions.id))
    .leftJoin(activityTypes, eq(posts.activityTypeId, activityTypes.id))
    .where(
      and(
        eq(posts.status, "published"),
        eq(posts.category, category as any),
        sql`${posts.id} != ${postId}`
      )
    )
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export async function getPostsForSidebar(options?: {
  regionId?: number;
  activityTypeId?: number;
  limit?: number;
}) {
  const conditions = [eq(posts.status, "published")];

  if (options?.regionId) {
    conditions.push(eq(posts.regionId, options.regionId));
  }
  if (options?.activityTypeId) {
    conditions.push(eq(posts.activityTypeId, options.activityTypeId));
  }

  return db
    .select()
    .from(posts)
    .where(and(...conditions))
    .orderBy(desc(posts.publishedAt))
    .limit(options?.limit || 5);
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
  let altActivitiesMap: Record<number, typeof activities.$inferSelect> = {};

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

export async function getAllActivitySlugs() {
  const result = await db
    .select({ slug: activities.slug })
    .from(activities)
    .where(eq(activities.status, "published"));
  return result.map((r) => r.slug);
}

export async function getAllAccommodationSlugs() {
  const result = await db
    .select({ slug: accommodation.slug })
    .from(accommodation)
    .where(eq(accommodation.status, "published"));
  return result.map((r) => r.slug);
}

export async function getAllEventSlugs() {
  const result = await db
    .select({ slug: events.slug })
    .from(events)
    .where(eq(events.status, "published"));
  return result.map((r) => r.slug);
}

export async function getAllTagSlugs() {
  const result = await db
    .select({ slug: tags.slug })
    .from(tags);
  return result.map((r) => r.slug);
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
