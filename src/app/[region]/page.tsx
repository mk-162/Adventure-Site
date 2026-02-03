import { notFound } from "next/navigation";
import { getRegionWithStats, getActivitiesByRegion, getAccommodationByRegion } from "@/lib/queries";
import { ButtonLink } from "@/components/ui/button";
import { ActivityCard } from "@/components/cards/activity-card";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { MapPin, Activity, Home, Calendar, Users } from "lucide-react";

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region: regionSlug } = await params;
  const region = await getRegionWithStats(regionSlug);

  if (!region) {
    notFound();
  }

  const [activities, accommodation] = await Promise.all([
    getActivitiesByRegion(regionSlug, 6),
    getAccommodationByRegion(regionSlug, 4),
  ]);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1589802829985-817e51171b92?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-12">
          {/* Breadcrumb */}
          <nav className="text-white/70 text-sm mb-4">
            <a href="/" className="hover:text-white">
              Home
            </a>
            <span className="mx-2">›</span>
            <span className="text-white">{region.name}</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {region.name}
          </h1>
          {region.description && (
            <p className="text-xl text-white/90 max-w-2xl">
              {region.description}
            </p>
          )}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-6 overflow-x-auto">
            <StatPill icon={Activity} label="Activities" value={region.stats.activities} />
            <StatPill icon={Home} label="Places to Stay" value={region.stats.accommodation} />
            <StatPill icon={Calendar} label="Events" value={region.stats.events} />
            <StatPill icon={Users} label="Operators" value={region.stats.operators} />
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-8 overflow-x-auto">
            <TabLink href={`/${regionSlug}`} active>Overview</TabLink>
            <TabLink href={`/${regionSlug}/things-to-do`}>Things to Do</TabLink>
            <TabLink href={`/${regionSlug}/itineraries`}>Itineraries</TabLink>
            <TabLink href={`/${regionSlug}/where-to-stay`}>Where to Stay</TabLink>
            <TabLink href={`/${regionSlug}/events`}>Events</TabLink>
            <TabLink href={`/${regionSlug}/getting-there`}>Getting There</TabLink>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">
            About {region.name}
          </h2>
          <p className="text-gray-600 max-w-3xl">
            {region.description || `Discover the adventures waiting for you in ${region.name}. From thrilling outdoor activities to peaceful nature experiences, this region offers something for every adventure seeker.`}
          </p>
        </section>

        {/* Top Activities */}
        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#f97316] font-semibold text-sm uppercase tracking-wider mb-2">
                Top Experiences
              </p>
              <h2 className="text-2xl font-bold text-[#1e3a4c]">
                Things to Do in {region.name}
              </h2>
            </div>
            <ButtonLink href={`/${regionSlug}/things-to-do`} variant="outline" size="sm">
              View All
            </ButtonLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((item) => (
              <ActivityCard
                key={item.activity.id}
                activity={item.activity}
                region={item.region}
                operator={item.operator}
              />
            ))}
          </div>
        </section>

        {/* Accommodation */}
        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#f97316] font-semibold text-sm uppercase tracking-wider mb-2">
                Adventure-Friendly
              </p>
              <h2 className="text-2xl font-bold text-[#1e3a4c]">
                Where to Stay
              </h2>
            </div>
            <ButtonLink href={`/${regionSlug}/where-to-stay`} variant="outline" size="sm">
              View All
            </ButtonLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {accommodation.map((item) => (
              <AccommodationCard
                key={item.accommodation.id}
                accommodation={item.accommodation}
                region={item.region}
              />
            ))}
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#1e3a4c] mb-4">
            Explore the Area
          </h2>
          <div className="bg-gray-100 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Interactive map coming soon</p>
              <p className="text-sm">Leaflet + OpenStreetMap</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatPill({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full whitespace-nowrap">
      <Icon className="h-4 w-4 text-[#f97316]" />
      <span className="font-semibold text-[#1e3a4c]">{value}</span>
      <span className="text-gray-500 text-sm">{label}</span>
    </div>
  );
}

function TabLink({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <a
      href={href}
      className={`py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
        active
          ? "border-[#f97316] text-[#1e3a4c]"
          : "border-transparent text-gray-500 hover:text-[#1e3a4c] hover:border-gray-300"
      }`}
    >
      {children}
    </a>
  );
}
