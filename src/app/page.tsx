import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { regions, activities, events, operators, activityTypes } from "@/db/schema";
import { eq, desc, asc, sql, and, inArray } from "drizzle-orm";
import { HeroSection } from "@/components/home/hero-section";
import { SearchBar } from "@/components/home/search-bar";
import { RegionsGrid } from "@/components/home/regions-grid";
import { ActivitiesRow } from "@/components/home/activities-row";
import { FeaturedItineraries } from "@/components/home/featured-itineraries";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { TrustedPartners } from "@/components/home/trusted-partners";
import { Newsletter } from "@/components/home/newsletter";
import { JsonLd, createWebSiteSchema, createOrganizationSchema } from "@/components/seo/JsonLd";
import { SectionHeader } from "@/components/ui/section-header";
import { getFeaturedItineraries } from "@/lib/queries";
import { ThisWeekendWidget } from "@/components/events/ThisWeekendWidget";
import { LAUNCH_REGIONS, LAUNCH_COMBOS } from "@/lib/launch";

/**
 * Map of region slug → activity type slugs, derived from the launch allowlist —
 * the SearchBar navigates straight to `/${region}/${activity}`, so every pair
 * here must be a live combo page or the search 404s. LAUNCH_COMBOS is the
 * source of truth (some verified combos are JSON-backed with no DB activity
 * rows, so a DB-derived map would wrongly omit them).
 */
function getRegionActivityMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const combo of LAUNCH_COMBOS) {
    const [regionSlug, activitySlug] = combo.split("/");
    if (!map[regionSlug]) map[regionSlug] = [];
    map[regionSlug].push(activitySlug);
  }
  return map;
}

async function _getHomePageData() {
  const [regionsData, activitiesData, eventsData, operatorsData, activityTypesData, featuredItinerariesData, adventureCountData] = await Promise.all([
    db.select().from(regions)
      .where(and(eq(regions.status, "published"), inArray(regions.slug, [...LAUNCH_REGIONS])))
      .orderBy(asc(regions.name)),
    db.select().from(activities).where(eq(activities.status, "published")).limit(10),
    db.select().from(events).where(eq(events.status, "published")).orderBy(asc(events.dateStart)).limit(10),
    db.select().from(operators).where(
      sql`${operators.status} = 'published' AND (${operators.claimStatus} IN ('premium', 'claimed') OR (${operators.trialTier} = 'premium' AND ${operators.trialExpiresAt} > NOW()))`
    ).orderBy(sql`CASE
      WHEN ${operators.claimStatus} = 'premium' THEN 0
      WHEN ${operators.trialTier} = 'premium' AND ${operators.trialExpiresAt} > NOW() THEN 0
      ELSE 1 END`).limit(8),
    db.select().from(activityTypes).orderBy(asc(activityTypes.name)),
    getFeaturedItineraries(3),
    // Honest hero stat: activities actually published within the launch-region
    // scope (not the full ~174 across all of Wales — see LAUNCH_REGIONS).
    db.select({ count: sql<number>`count(*)` })
      .from(activities)
      .innerJoin(regions, eq(activities.regionId, regions.id))
      .where(and(eq(activities.status, "published"), inArray(regions.slug, [...LAUNCH_REGIONS]))),
  ]);

  const regionActivityMap = getRegionActivityMap();
  // Only offer activity types that are bookable somewhere in the launch slice —
  // activity-only searches navigate to `/${slug}` hub pages.
  const launchActivitySlugs = new Set(Object.values(regionActivityMap).flat());

  return {
    regions: regionsData,
    activities: activitiesData,
    events: eventsData,
    operators: operatorsData,
    activityTypes: activityTypesData.filter((at) => launchActivitySlugs.has(at.slug)),
    itineraries: featuredItinerariesData,
    regionActivityMap,
    adventureCount: Number(adventureCountData[0]?.count ?? 0),
  };
}

const getHomePageData = unstable_cache(
  _getHomePageData,
  ["homepage-data"],
  { revalidate: 300, tags: ["content"] }
);

export default async function HomePage() {
  const data = await getHomePageData();

  // Filter weekend events
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + (6 - today.getDay() + 7) % 7);
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  const endOfSunday = new Date(sunday);
  endOfSunday.setHours(23, 59, 59, 999);

  const weekendEvents = data.events.filter(e => {
    if (!e.dateStart) return false;
    const d = new Date(e.dateStart);
    return d >= today && d <= endOfSunday;
  });

  return (
    <>
      <JsonLd data={createWebSiteSchema()} />
      <JsonLd data={createOrganizationSchema()} />
      <div className="min-h-screen">
        <HeroSection adventureCount={data.adventureCount} />
        <SearchBar regions={data.regions} activityTypes={data.activityTypes} regionActivityMap={data.regionActivityMap} />
        <RegionsGrid regions={data.regions} />
        <ActivitiesRow />
        <FeaturedItineraries itineraries={data.itineraries} />

        {weekendEvents.length > 0 ? (
          <section className="py-12 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <SectionHeader eyebrow="Coming Up" title="This Weekend in Wales" />
              <ThisWeekendWidget events={weekendEvents} />
            </div>
          </section>
        ) : (
          <UpcomingEvents events={data.events} />
        )}

        <TrustedPartners operators={data.operators} />

        <Newsletter />
      </div>
    </>
  );
}
