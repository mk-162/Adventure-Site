import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventBySlug, getEvents, getAllEventSlugs } from "@/lib/queries";
import { 
  MapPin, Calendar, Clock, Users, ExternalLink, 
  ChevronRight, Ticket, Trophy, Mountain, Navigation
} from "lucide-react";
import MapView, { type MapMarker } from "@/components/ui/MapView";

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

  // Get related events
  const relatedEvents = await getEvents({ limit: 4 });

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] bg-[#1e3a4c]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('/images/activities/trail-running-hero.jpg')`,
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
            <span className="inline-flex items-center gap-1 bg-[#f97316] text-white text-xs font-medium px-3 py-1 rounded-full w-fit mb-3">
              <CategoryIcon className="h-3 w-3" />
              {event.type}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {event.name}
          </h1>

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
              <div>
                <h2 className="text-xl font-bold text-[#1e3a4c] mb-1">Event Date</h2>
                <p className="text-gray-600">
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
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1e3a4c] mb-4">About This Event</h2>
              <p className="text-gray-600 leading-relaxed">
                {event.description || `Join us for ${event.name}, an exciting ${event.type || 'adventure'} event in ${region?.name || 'Wales'}. Challenge yourself and experience the best of Welsh outdoor events.`}
              </p>
            </div>

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
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#f97316] hover:underline"
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
                  className="flex items-center justify-center gap-2 w-full bg-[#f97316] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#ea580c] transition-colors"
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
                    <Link href={`/${region.slug}`} className="font-medium text-[#f97316] hover:underline">
                      {region.name}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Share Event */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1e3a4c] mb-3">Share This Event</h3>
              <p className="text-sm text-gray-500">
                Know someone who'd love this event? Share it with them!
              </p>
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
              <Link href="/events" className="text-[#f97316] font-medium hover:underline">
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
                          <span className="text-xs text-[#f97316] font-medium">{item.event.type}</span>
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
  );
}

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}
