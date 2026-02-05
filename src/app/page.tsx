import { db } from "@/db";
import { regions, activities, events, operators, activityTypes } from "@/db/schema";
import { eq, desc, asc, sql } from "drizzle-orm";
import { HeroSection } from "@/components/home/hero-section";
import { SearchBar } from "@/components/home/search-bar";
import { RegionsGrid } from "@/components/home/regions-grid";
import { ActivitiesRow } from "@/components/home/activities-row";
import { FeaturedItineraries } from "@/components/home/featured-itineraries";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { Newsletter } from "@/components/home/newsletter";
import { JsonLd, createWebSiteSchema, createOrganizationSchema } from "@/components/seo/JsonLd";
import { getFeaturedItineraries } from "@/lib/queries";
import { ThisWeekendWidget } from "@/components/events/ThisWeekendWidget";

/** Build a map of region slug → activity type slugs that exist in that region */
async function getRegionActivityMap(): Promise<Record<string, string[]>> {
  const rows = await db
    .select({
      regionSlug: regions.slug,
      activitySlug: activityTypes.slug,
    })
    .from(activities)
    .innerJoin(regions, eq(activities.regionId, regions.id))
    .innerJoin(activityTypes, eq(activities.activityTypeId, activityTypes.id))
    .where(eq(activities.status, "published"))
    .groupBy(regions.slug, activityTypes.slug);

  const map: Record<string, string[]> = {};
  for (const row of rows) {
    if (!map[row.regionSlug]) map[row.regionSlug] = [];
    map[row.regionSlug].push(row.activitySlug);
  }
  return map;
}

async function getHomePageData() {
  const [regionsData, activitiesData, eventsData, operatorsData, activityTypesData, featuredItinerariesData, regionActivityMap] = await Promise.all([
    db.select().from(regions).where(eq(regions.status, "published")).limit(6),
    db.select().from(activities).where(eq(activities.status, "published")).limit(10),
    db.select().from(events).where(eq(events.status, "published")).orderBy(asc(events.dateStart)).limit(10),
    db.select().from(operators).where(
      sql`${operators.claimStatus} IN ('premium', 'claimed')`
    ).orderBy(sql`CASE WHEN ${operators.claimStatus} = 'premium' THEN 0 ELSE 1 END`).limit(8),
    db.select().from(activityTypes).orderBy(asc(activityTypes.name)),
    getFeaturedItineraries(3),
    getRegionActivityMap(),
  ]);

  return {
    regions: regionsData,
    activities: activitiesData,
    events: eventsData,
    operators: operatorsData,
    activityTypes: activityTypesData,
    itineraries: featuredItinerariesData,
    regionActivityMap,
  };
}

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
        <HeroSection />
        <SearchBar regions={data.regions} activityTypes={data.activityTypes} regionActivityMap={data.regionActivityMap} />
        <RegionsGrid regions={data.regions} />
        <ActivitiesRow />
        <FeaturedItineraries itineraries={data.itineraries} />

        {weekendEvents.length > 0 ? (
          <section className="py-12 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <ThisWeekendWidget events={weekendEvents} />
            </div>
          </section>
        ) : (
          <UpcomingEvents events={data.events} />
        )}

        {/* Trusted Partners */}
        {data.operators.length > 0 && (
          <section className="py-12 sm:py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-8">
                <span className="text-[#ea580c] font-bold uppercase tracking-wider text-sm">Trusted Partners</span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#1e3a4c]">Adventure Providers We Recommend</h2>
                <p className="mt-2 text-gray-500 max-w-xl mx-auto text-sm">Vetted, insured, and reviewed by real adventurers across Wales.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.operators.map(op => (
                  <a
                    key={op.id}
                    href={`/directory/${op.slug}`}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all hover:-translate-y-0.5 text-center group"
                  >
                    {op.logoUrl ? (
                      <img src={op.logoUrl} alt={op.name} className="w-12 h-12 mx-auto rounded-lg object-cover mb-3" />
                    ) : (
                      <div className="w-12 h-12 mx-auto rounded-lg bg-[#1e3a4c]/10 flex items-center justify-center text-[#1e3a4c] font-bold text-lg mb-3">
                        {op.name.charAt(0)}
                      </div>
                    )}
                    <h3 className="font-semibold text-sm text-[#1e3a4c] group-hover:text-[#ea580c] transition-colors line-clamp-1">{op.name}</h3>
                    {op.googleRating && (
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="text-xs text-gray-500">{op.googleRating}</span>
                      </div>
                    )}
                    {op.claimStatus === "premium" && (
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Premium</span>
                    )}
                  </a>
                ))}
              </div>
              <div className="text-center mt-6">
                <a href="/directory" className="text-[#ea580c] font-bold hover:underline text-sm">
                  View all providers →
                </a>
              </div>
            </div>
          </section>
        )}

        <Newsletter />
      </div>
    </>
  );
}
