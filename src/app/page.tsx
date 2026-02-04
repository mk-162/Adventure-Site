import { db } from "@/db";
import { regions, activities, events, operators, activityTypes } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { HeroSection } from "@/components/home/hero-section";
import { SearchBar } from "@/components/home/search-bar";
import { RegionsGrid } from "@/components/home/regions-grid";
import { ActivitiesRow } from "@/components/home/activities-row";
import { FeaturedItineraries } from "@/components/home/featured-itineraries";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { Newsletter } from "@/components/home/newsletter";
import { JsonLd, createWebSiteSchema, createOrganizationSchema } from "@/components/seo/JsonLd";

async function getHomePageData() {
  const [regionsData, activitiesData, eventsData, operatorsData, activityTypesData] = await Promise.all([
    db.select().from(regions).where(eq(regions.status, "published")).limit(6),
    db.select().from(activities).where(eq(activities.status, "published")).limit(10),
    db.select().from(events).where(eq(events.status, "published")).limit(4),
    db.select().from(operators).where(eq(operators.claimStatus, "claimed")).limit(4),
    db.select().from(activityTypes).orderBy(asc(activityTypes.name)),
  ]);

  return {
    regions: regionsData,
    activities: activitiesData,
    events: eventsData,
    operators: operatorsData,
    activityTypes: activityTypesData,
  };
}

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <>
      <JsonLd data={createWebSiteSchema()} />
      <JsonLd data={createOrganizationSchema()} />
      <div className="min-h-screen">
        <HeroSection />
        <SearchBar regions={data.regions} activityTypes={data.activityTypes} />
        <RegionsGrid regions={data.regions} />
        <ActivitiesRow />
        <FeaturedItineraries activities={data.activities} />
        <UpcomingEvents events={data.events} />
        <Newsletter />
      </div>
    </>
  );
}
