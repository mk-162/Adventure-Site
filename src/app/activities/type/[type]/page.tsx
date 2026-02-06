import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft, MapPin, Filter } from "lucide-react";
import { getActivitiesByActivityType } from "@/lib/queries";
import { ActivityCard } from "@/components/cards/activity-card";
import { JsonLd, createBreadcrumbSchema } from "@/components/seo/JsonLd";

interface ActivityTypePageProps {
  params: Promise<{ type: string }>;
}

// Activity type display names and descriptions
const activityTypeInfo: Record<string, { name: string; description: string }> = {
  "mountain-biking": { name: "Mountain Biking", description: "Trail centres, singletrack, and downhill runs across Wales" },
  "coasteering": { name: "Coasteering", description: "Cliff jumping, cave swimming, and coastal exploration" },
  "hiking": { name: "Hiking", description: "Mountain walks, coastal paths, and scenic trails" },
  "surfing": { name: "Surfing", description: "Surf schools, lessons, and board hire" },
  "caving": { name: "Caving", description: "Underground adventures and cave exploration" },
  "kayaking": { name: "Kayaking", description: "Sea kayaking, river paddling, and canoe tours" },
  "paddleboarding": { name: "Paddleboarding", description: "SUP sessions, tours, and lessons" },
  "climbing": { name: "Climbing", description: "Rock climbing, indoor walls, and bouldering" },
  "zip-lining": { name: "Zip Lining", description: "Zip lines, aerial adventures, and high wire courses" },
  "gorge-walking": { name: "Gorge Walking", description: "Scramble through gorges, waterfalls, and rivers" },
  "wild-swimming": { name: "Wild Swimming", description: "Lakes, rivers, waterfalls, and sea swimming" },
  "white-water-rafting": { name: "White Water Rafting", description: "Rapids, rafting trips, and river adventures" },
  "canyoning": { name: "Canyoning", description: "Abseil waterfalls, jump pools, and canyon exploration" },
};

export async function generateMetadata({ params }: ActivityTypePageProps): Promise<Metadata> {
  const { type } = await params;
  const info = activityTypeInfo[type];
  
  if (!info) {
    return { title: "Activities | Adventure Wales" };
  }

  return {
    title: `${info.name} Experiences in Wales | Adventure Wales`,
    description: `Browse all ${info.name.toLowerCase()} experiences across Wales. ${info.description}. Compare operators, prices, and book your adventure.`,
    openGraph: {
      title: `${info.name} Experiences in Wales`,
      description: `Browse all ${info.name.toLowerCase()} experiences across Wales. ${info.description}.`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(activityTypeInfo).map((type) => ({ type }));
}

export default async function ActivityTypePage({ params }: ActivityTypePageProps) {
  const { type } = await params;
  const info = activityTypeInfo[type];

  if (!info) {
    notFound();
  }

  const activities = await getActivitiesByActivityType(type);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Activities", url: "/activities" },
    { name: info.name, url: `/activities/type/${type}` },
  ];

  // Group by region for better organization
  const byRegion = activities.reduce((acc, row) => {
    const regionName = row.region?.name || "Other";
    if (!acc[regionName]) acc[regionName] = [];
    acc[regionName].push(row);
    return acc;
  }, {} as Record<string, typeof activities>);

  return (
    <>
      <JsonLd data={createBreadcrumbSchema(breadcrumbItems)} />
      <main className="min-h-screen pt-16 bg-gray-50">
        {/* Header */}
        <section className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/activities" className="hover:text-white">Activities</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{info.name}</span>
            </nav>

            <div className="flex items-center gap-4 mb-4">
              <Link 
                href={`/${type}`}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {info.name} guide
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {info.name} Experiences
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              {info.description}. Browse {activities.length} experiences from operators across Wales.
            </p>
          </div>
        </section>

        {/* Activities Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {activities.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">No {info.name.toLowerCase()} experiences listed yet.</p>
                <Link 
                  href="/activities"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-accent-hover transition-colors"
                >
                  Browse all activities
                </Link>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(byRegion).map(([regionName, regionActivities]) => (
                  <div key={regionName}>
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-bold text-primary">{regionName}</h2>
                      <span className="text-sm text-gray-500">({regionActivities.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {regionActivities.map((row) => (
                        <ActivityCard
                          key={row.activity.id}
                          activity={row.activity}
                          region={row.region}
                          operator={row.operator}
                          activityType={row.activityType}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-white border-t">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Run a {info.name.toLowerCase()} business in Wales?
            </h2>
            <p className="text-gray-600 mb-6">
              Get listed on Adventure Wales and reach thousands of adventure seekers.
            </p>
            <Link
              href="/advertise"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-hover text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold"
            >
              List your business
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
