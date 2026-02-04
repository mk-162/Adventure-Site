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
  tags 
} from '@/db/schema';
import { eq } from 'drizzle-orm';

const BASE_URL = 'https://adventurewales.co.uk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all published content from the database
  const [
    regionsData,
    activitiesData,
    accommodationData,
    eventsData,
    answersData,
    activityTypesData,
    operatorsData,
    tagsData
  ] = await Promise.all([
    db.select().from(regions).where(eq(regions.status, 'published')),
    db.select().from(activities).where(eq(activities.status, 'published')),
    db.select().from(accommodation).where(eq(accommodation.status, 'published')),
    db.select().from(events).where(eq(events.status, 'published')),
    db.select().from(answers).where(eq(answers.status, 'published')),
    db.select().from(activityTypes),
    db.select().from(operators).where(eq(operators.claimStatus, 'claimed')),
    db.select().from(tags)
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

  // Region pages
  regionsData.forEach((region) => {
    sitemap.push({
      url: `${BASE_URL}/${region.slug}`,
      lastModified: region.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
    
    // Region sub-pages
    sitemap.push(
      {
        url: `${BASE_URL}/${region.slug}/things-to-do`,
        lastModified: region.createdAt || new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/${region.slug}/where-to-stay`,
        lastModified: region.createdAt || new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }
    );
  });

  // Activity pages
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

  // Activity type pages (region + activity type combinations)
  regionsData.forEach((region) => {
    activityTypesData.forEach((activityType) => {
      sitemap.push({
        url: `${BASE_URL}/${region.slug}/things-to-do/${activityType.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
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

  return sitemap;
}
