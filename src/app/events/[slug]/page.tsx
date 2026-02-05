import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventBySlug, getEvents, getAllEventSlugs, getAccommodationByRegion, getActivitiesByRegion } from "@/lib/queries";
import { 
  MapPin, Calendar, Clock, Users, ExternalLink, 
  ChevronRight, Ticket, Trophy, Mountain, Navigation
} from "lucide-react";
import MapView, { type MapMarker } from "@/components/ui/MapView";
import { SaveEventButton } from "@/components/events/SaveEventButton";
import { ShareEventButton } from "@/components/events/ShareEventButton";
import { AddToCalendarButton } from "@/components/events/AddToCalendarButton";
import { WeatherWidget } from "@/components/weather/WeatherWidget";
import { JsonLd, createEventSchema } from "@/components/seo/JsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatDate(date: Date | null): string {
  if (!date) return "TBC";
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(date: Date | null): string {
  if (!date) return "TBC";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const data = await getEventBySlug(slug);

  if (!data) {
    notFound();
  }

  const { event, region } = data;

  // Get related events + nearby accommodation/activities
  const [relatedEvents, nearbyAccommodation, nearbyActivities] = await Promise.all([
    getEvents({ limit: 4 }),
    region ? getAccommodationByRegion(region.slug, 3) : Promise.resolve([]),
    region ? getActivitiesByRegion(region.slug, 3) : Promise.resolve([]),
  ]);

  // Determine event category icon
  const getCategoryIcon = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case "running":
      case "trail running":
        return Trophy;
      case "triathlon":
        return Trophy;
      case "cycling":
        return Trophy;
      default:
        return Mountain;
    }
  };

  const CategoryIcon = getCategoryIcon(event.type);
  const heroImage = event.heroImage || '/images/activities/trail-running-hero.jpg';

  // Check if date is within 7 days for weather
  const isWithin7Days = event.dateStart &&
    new Date(event.dateStart).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 &&
    new Date(event.dateStart).getTime() > new Date().getTime();

  return (
    <>
      <JsonLd data={createEventSchema({
        ...event,
        lat: event.lat ? String(event.lat) : null,
        lng: event.lng ? String(event.lng) : null,
        registrationCost: event.registrationCost ? String(event.registrationCost) : null,
      })} />

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="relative h-[40vh] min-h-[300px] bg-[#1e3a4c]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: `url('${heroImage}')`,
            }}
          />
          <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-300 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/events" className="hover:text-white">Events</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{event.name}</span>
            </nav>

            {/* Type badge */}
            {event.type && (
              <span className="inline-flex items-center gap-1 bg-[#ea580c] text-white text-xs font-medium px-3 py-1 rounded-full w-fit mb-3">
                <CategoryIcon className="h-3 w-3" />
                {event.type}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {event.name}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-white/80">
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>
                )}
                {region && (
                  <Link href={`/${region.slug}`} className="hover:text-white">
                    {region.name}
                  </Link>
                )}
              </div>

              {/* Action Buttons (Save/Share) */}
              <div className="flex items-center gap-2">
                <div className="bg-white rounded-full p-1">
                   <SaveEventButton eventId={event.id} />
                </div>
                <div className="bg-white rounded-full p-1">
                  <ShareEventButton eventName={event.name} eventUrl={`https://adventurewales.co.uk/events/${event.slug}`} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Date Banner */}
              <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-shrink-0 bg-[#1e3a4c] text-white rounded-xl p-4 text-center min-w-[100px]">
                  <div className="text-3xl font-bold">
                    {event.dateStart ? new Date(event.dateStart).getDate() : "TBC"}
                  </div>
                  <div className="text-sm uppercase">
                    {event.dateStart
                      ? new Date(event.dateStart).toLocaleDateString("en-GB", { month: "short" })
                      : event.monthTypical || ""}
                  </div>
                  {event.dateStart && (
                    <div className="text-xs mt-1 opacity-80">
                      {new Date(event.dateStart).getFullYear()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#1e3a4c] mb-1">Event Date</h2>
                  <p className="text-gray-600 mb-2">
                    {formatDate(event.dateStart)}
                    {event.dateEnd && event.dateEnd !== event.dateStart && (
                      <> - {formatDate(event.dateEnd)}</>
                    )}
                  </p>
                  {!event.dateStart && event.monthTypical && (
                    <p className="text-sm text-gray-500 mt-1">
                      Typically held in {event.monthTypical}
                    </p>
                  )}
                  {event.dateStart && (
                    <AddToCalendarButton event={event} />
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">About This Event</h2>
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                  <p>{event.description || `Join us for ${event.name}, an exciting ${event.type || 'adventure'} event in ${region?.name || 'Wales'}. Challenge yourself and experience the best of Welsh outdoor events.`}</p>
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
                    {event.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Weather Forecast (Conditional) */}
              {isWithin7Days && event.lat && event.lng && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">Weather Forecast</h2>
                  <WeatherWidget
                    lat={Number(event.lat)}
                    lng={Number(event.lng)}
                    regionName={event.location || region?.name || "Wales"}
                    compact={false}
                  />
                </div>
              )}

              {/* Event Details */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">Event Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#1e3a4c]/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-[#1e3a4c]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1e3a4c]">Date</p>
                      <p className="text-gray-600 text-sm">
                        {formatShortDate(event.dateStart)}
                        {event.dateEnd && ` - ${formatShortDate(event.dateEnd)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#1e3a4c]/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-[#1e3a4c]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1e3a4c]">Location</p>
                      <p className="text-gray-600 text-sm">{event.location || "TBC"}</p>
                    </div>
                  </div>

                  {event.capacity && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#1e3a4c]/10 rounded-lg">
                        <Users className="h-5 w-5 text-[#1e3a4c]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1e3a4c]">Capacity</p>
                        <p className="text-gray-600 text-sm">{event.capacity} participants</p>
                      </div>
                    </div>
                  )}

                  {event.registrationCost && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#1e3a4c]/10 rounded-lg">
                        <Ticket className="h-5 w-5 text-[#1e3a4c]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1e3a4c]">Entry Fee</p>
                        <p className="text-gray-600 text-sm">From £{Number(event.registrationCost).toFixed(0)}</p>
                      </div>
                    </div>
                  )}

                  {event.difficulty && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#1e3a4c]/10 rounded-lg">
                        <Mountain className="h-5 w-5 text-[#1e3a4c]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1e3a4c]">Difficulty</p>
                        <p className="text-gray-600 text-sm capitalize">{event.difficulty}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Map */}
              {event.lat && event.lng && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">Location</h2>
                  <MapView
                    markers={[{
                      id: event.id,
                      lat: Number(event.lat),
                      lng: Number(event.lng),
                      type: "event" as const,
                      title: event.name,
                      subtitle: event.location || undefined,
                      link: `/events/${event.slug}`,
                    }]}
                    center={[Number(event.lat), Number(event.lng)]}
                    zoom={13}
                    height="300px"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-gray-600 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location || "Event location"}
                    </p>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#ea580c] hover:underline"
                    >
                      <Navigation className="h-4 w-4" />
                      Get Directions
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                {/* Price */}
                {event.registrationCost && (
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-[#1e3a4c]">
                      £{Number(event.registrationCost).toFixed(0)}
                      <span className="text-base font-normal text-gray-500"> entry fee</span>
                    </div>
                  </div>
                )}

                {/* Register button */}
                {event.website ? (
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#ea580c] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#ea580c] transition-colors"
                  >
                    <Ticket className="h-5 w-5" />
                    Register Now
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 w-full bg-gray-300 text-gray-500 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                  >
                    Registration Opening Soon
                  </button>
                )}

                {/* Quick info */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Event Type</span>
                    <span className="font-medium text-[#1e3a4c]">{event.type || "Adventure"}</span>
                  </div>
                  {event.capacity && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Capacity</span>
                      <span className="font-medium text-[#1e3a4c]">{event.capacity}</span>
                    </div>
                  )}
                  {region && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Region</span>
                      <Link href={`/${region.slug}`} className="font-medium text-[#ea580c] hover:underline">
                        {region.name}
                      </Link>
                    </div>
                  )}
                  {event.ageRange && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Age Range</span>
                      <span className="font-medium text-[#1e3a4c] capitalize">{event.ageRange}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Where to Stay */}
              {nearbyAccommodation.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-[#1e3a4c] mb-4">Where to Stay</h3>
                  <div className="space-y-3">
                    {nearbyAccommodation.map(({ accommodation: acc }) => (
                      <Link
                        key={acc.id}
                        href={`/stay/${acc.slug}`}
                        className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-[#1e3a4c]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-4 w-4 text-[#1e3a4c]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-[#1e3a4c] truncate">{acc.name}</p>
                          <p className="text-xs text-gray-500 truncate">{acc.type || "Accommodation"}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {region && (
                    <Link href={`/${region.slug}/stay`} className="block text-center text-sm text-[#ea580c] font-medium hover:underline mt-3 pt-3 border-t">
                      See all accommodation →
                    </Link>
                  )}
                </div>
              )}

              {/* Things to Do */}
              {nearbyActivities.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-[#1e3a4c] mb-4">While You&apos;re There</h3>
                  <div className="space-y-3">
                    {nearbyActivities.map(({ activity: act, activityType }) => (
                      <Link
                        key={act.id}
                        href={`/activities/${act.slug}`}
                        className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-[#ea580c]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mountain className="h-4 w-4 text-[#ea580c]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-[#1e3a4c] truncate">{act.name}</p>
                          <p className="text-xs text-gray-500 truncate">{activityType?.name || "Activity"}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {region && (
                    <Link href={`/${region.slug}/things-to-do`} className="block text-center text-sm text-[#ea580c] font-medium hover:underline mt-3 pt-3 border-t">
                      More things to do →
                    </Link>
                  )}
                </div>
              )}

              {/* Advertise */}
              <div className="bg-gradient-to-br from-[#ea580c]/5 to-[#ea580c]/10 rounded-xl p-6 shadow-sm border border-[#ea580c]/20">
                <h3 className="font-bold text-[#1e3a4c] mb-2">Promote Your Business</h3>
                <p className="text-sm text-gray-600 mb-3">Reach thousands of adventure seekers visiting this page.</p>
                <Link href="/advertise" className="inline-flex items-center gap-1 text-[#ea580c] font-bold text-sm hover:underline">
                  Advertise here →
                </Link>
              </div>

              {/* Add Your Event CTA */}
              <div className="bg-[#1e3a4c] rounded-xl p-6 shadow-sm text-center text-white">
                 <h3 className="font-bold text-lg mb-2">Own this event?</h3>
                 <p className="text-sm text-gray-300 mb-4">Claim it to manage details and promote it to more people.</p>
                 <Link href="/contact" className="text-[#ea580c] font-bold text-sm hover:underline">
                   Contact Us to Claim
                 </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Related Events */}
        {relatedEvents.length > 1 && (
          <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1e3a4c]">More Events</h2>
                <Link href="/events" className="text-[#ea580c] font-medium hover:underline">
                  View all events →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedEvents
                  .filter((item) => item.event.id !== event.id)
                  .slice(0, 4)
                  .map((item) => (
                    <Link
                      key={item.event.id}
                      href={`/events/${item.event.slug}`}
                      className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-[#1e3a4c] text-white rounded-lg p-2 text-center min-w-[50px]">
                          <div className="text-lg font-bold">
                            {item.event.dateStart ? new Date(item.event.dateStart).getDate() : "?"}
                          </div>
                          <div className="text-xs uppercase">
                            {item.event.dateStart
                              ? new Date(item.event.dateStart).toLocaleDateString("en-GB", { month: "short" })
                              : item.event.monthTypical?.slice(0, 3) || "TBC"}
                          </div>
                        </div>
                        <div>
                          {item.event.type && (
                            <span className="text-xs text-[#ea580c] font-medium">{item.event.type}</span>
                          )}
                          <h3 className="font-semibold text-[#1e3a4c] line-clamp-1">{item.event.name}</h3>
                        </div>
                      </div>
                      {item.event.location && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.event.location}
                        </p>
                      )}
                    </Link>
                  ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await getEventBySlug(slug);
  if (!data) {
    return { title: "Event Not Found | Adventure Wales" };
  }

  const { event, region } = data;
  const regionName = region?.name || "Wales";
  const dateStr = event.dateStart
    ? new Date(event.dateStart).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : "";
  const typeStr = event.type ? `${event.type} ` : "";

  const title = `${event.name} — ${typeStr}Event in ${regionName}${dateStr ? ` (${dateStr})` : ""} | Adventure Wales`;
  const description = event.description?.slice(0, 155)
    || `${event.name} — ${typeStr}adventure event in ${regionName}.${dateStr ? ` ${dateStr}.` : ""} Find details, tickets, and more.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Adventure Wales",
    },
  };
}
