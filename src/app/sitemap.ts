import { MetadataRoute } from 'next';
import { db } from '@/db';
import { 
  regions, 
  activities, 
  accommodation, 
  events, 
  answers,
  activityTypes,
  operators,
  tags,
  posts
} from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

const BASE_URL = 'https://adventurewales.co.uk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all published content from the database
  const [
    regionsData,
    activitiesData,
    accommodationData,
    eventsData,
    answersData,
    comboPagesData,
    operatorsData,
    tagsData,
    postsData
  ] = await Promise.all([
    db.select({ slug: regions.slug, createdAt: regions.createdAt }).from(regions).where(eq(regions.status, 'published')),
    db.select({ slug: activities.slug, createdAt: activities.createdAt }).from(activities).where(eq(activities.status, 'published')),
    db.select({ slug: accommodation.slug, createdAt: accommodation.createdAt }).from(accommodation).where(eq(accommodation.status, 'published')),
    db.select({ slug: events.slug, createdAt: events.createdAt }).from(events).where(eq(events.status, 'published')),
    db.select({ slug: answers.slug, createdAt: answers.createdAt }).from(answers).where(eq(answers.status, 'published')),
    db.selectDistinct({
      regionSlug: regions.slug,
      activityTypeSlug: activityTypes.slug,
    })
    .from(activities)
    .innerJoin(regions, eq(activities.regionId, regions.id))
    .innerJoin(activityTypes, eq(activities.activityTypeId, activityTypes.id))
    .where(eq(activities.status, 'published')),
    db.select({ slug: operators.slug, createdAt: operators.createdAt }).from(operators).where(
      sql`(${operators.claimStatus} IN ('claimed', 'premium') OR (${operators.trialTier} = 'premium' AND ${operators.trialExpiresAt} > NOW()))`
    ),
    db.select({ slug: tags.slug, createdAt: tags.createdAt }).from(tags),
    db.select({ slug: posts.slug, createdAt: posts.createdAt, updatedAt: posts.updatedAt }).from(posts).where(eq(posts.status, 'published'))
  ]);

  const sitemap: MetadataRoute.Sitemap = [];

  // Static pages
  sitemap.push(
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/activities`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/accommodation`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/destinations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/regions`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/directory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/answers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/itineraries`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/journal`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/partners`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/book`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/trip-planner`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    }
  );

  // Activity hub pages (manual pages)
  const activityHubs = ['mountain-biking', 'coasteering', 'hiking', 'surfing', 'caving', 'stag-hen'];
  activityHubs.forEach((hub) => {
    sitemap.push({
      url: `${BASE_URL}/${hub}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  // Region pages
  regionsData.forEach((region) => {
    sitemap.push({
      url: `${BASE_URL}/${region.slug}`,
      lastModified: region.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
    
    // Region stay page (NEW URL - was /where-to-stay)
    sitemap.push({
      url: `${BASE_URL}/${region.slug}/stay`,
      lastModified: region.createdAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });
  });

  // Individual activity/experience pages
  activitiesData.forEach((activity) => {
    sitemap.push({
      url: `${BASE_URL}/activities/${activity.slug}`,
      lastModified: activity.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // Accommodation pages
  accommodationData.forEach((acc) => {
    sitemap.push({
      url: `${BASE_URL}/accommodation/${acc.slug}`,
      lastModified: acc.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // Event pages
  eventsData.forEach((event) => {
    sitemap.push({
      url: `${BASE_URL}/events/${event.slug}`,
      lastModified: event.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // Answer/FAQ pages
  answersData.forEach((answer) => {
    sitemap.push({
      url: `${BASE_URL}/answers/${answer.slug}`,
      lastModified: answer.createdAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // Operator/Directory pages
  operatorsData.forEach((operator) => {
    sitemap.push({
      url: `${BASE_URL}/directory/${operator.slug}`,
      lastModified: operator.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  });

  // Combo pages: region + activity type (NEW URL - was /{region}/things-to-do/{activity})
  comboPagesData.forEach((combo) => {
    sitemap.push({
      url: `${BASE_URL}/${combo.regionSlug}/${combo.activityTypeSlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  });

  // Tag pages
  tagsData.forEach((tag) => {
    sitemap.push({
      url: `${BASE_URL}/tags/${tag.slug}`,
      lastModified: tag.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // Post/Journal pages
  postsData.forEach((post) => {
    sitemap.push({
      url: `${BASE_URL}/journal/${post.slug}`,
      lastModified: post.updatedAt || post.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  return sitemap;
}
