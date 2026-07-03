import { db } from "@/db";
import {
  regions,
  activityTypes,
  answers,
  tags,
  posts,
  postTags,
} from "@/db/schema";
import { eq, and, desc, asc, sql, inArray } from "drizzle-orm";
import { getTagBySlug } from "./tags";

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

  // Collapsed N+1: one batched tags query for all posts instead of one per post.
  const results = await query;

  const postIds = results.map((r) => r.post.id);
  const tagsByPostId = new Map<number, typeof tags.$inferSelect[]>();
  if (postIds.length > 0) {
    const allTags = await db
      .select({
        postId: postTags.postId,
        tag: tags,
      })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(inArray(postTags.postId, postIds));
    for (const row of allTags) {
      const arr = tagsByPostId.get(row.postId) ?? [];
      arr.push(row.tag);
      tagsByPostId.set(row.postId, arr);
    }
  }

  const postsWithTags = results.map((result) => ({
    ...result,
    tags: tagsByPostId.get(result.post.id) ?? [],
  }));

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
