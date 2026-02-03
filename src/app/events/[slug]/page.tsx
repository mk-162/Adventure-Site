import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventBySlug, getEvents } from "@/lib/queries";
import { 
  ChevronRight, 
  MapPin, 
  Calendar,
  Clock,
  Users,
  Ticket,
  Globe,
  Share2,
  Heart,
  ExternalLink,
  CalendarPlus
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatDate(date: Date | null): string {
  if (!date) return "TBC";
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function formatEventType(type: string | null): string {
  if (!type) return "Event";
  const labels: Record<string, string> = {
    race: "Race",
    festival: "Festival",
    competition: "Competition",
    challenge: "Challenge",
    fair: "Fair",
    market: "Market",
    workshop: "Workshop",
  };
  return labels[type.toLowerCase()] || type;
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getEventBySlug(slug);

  if (!data) {
    notFound();
  }

  const { event, region } = data;

  return (
    <div className="min-h-screen pb-24 lg:pb-12">
      {/* Hero Image */}
      <div className="relative w-full h-64 sm:h-80 lg:h-[400px] overflow-hidden lg:mx-auto lg:max-w-7xl lg:mt-6 lg:rounded-2xl lg:px-4">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center lg:rounded-2xl"
          style={{ 
            backgroundImage: region 
              ? `url('/images/regions/${region.slug}-hero.jpg')` 
              : `url('/images/activities/hiking-hero.jpg')` 
          }}
        />

        {/* Type Badge */}
        <div className="absolute top-4 left-4 lg:left-8 z-20">
          <span className="bg-[#f97316] text-white text-xs font-bold px-3 py-1.5 rounded-full">
            {formatEventType(event.type)}
          </span>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 lg:right-8 z-20 flex gap-2">
          <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-lg transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-10 z-20">
          {/* Date Badge */}
          {event.dateStart && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg mb-4">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{formatDate(event.dateStart)}</span>
            </div>
          )}
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2">
            {event.name}
          </h1>
          
          {region && (
            <p className="text-white/80 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.location || region.name}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Info Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex items-center gap-6">
              {event.dateStart && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-5 h-5 text-[#f97316]" />
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-[#1e3a4c]">{formatDate(event.dateStart)}</p>
                  </div>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-5 h-5 text-[#f97316]" />
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium text-[#1e3a4c]">{event.location}</p>
                  </div>
                </div>
              )}
              {event.capacity && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-5 h-5 text-[#f97316]" />
                  <div>
                    <p className="text-gray-500">Capacity</p>
                    <p className="font-medium text-[#1e3a4c]">{event.capacity} people</p>
                  </div>
                </div>
              )}
            </div>
            {event.registrationCost && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Entry Fee</p>
                <p className="text-2xl font-bold text-[#1e3a4c]">£{event.registrationCost}</p>
              </div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Description */}
            <section className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-[#1e3a4c] mb-4">About This Event</h2>
              {event.description ? (
                <div className="text-gray-600 leading-relaxed space-y-4">
                  {event.description.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {event.name} is a {formatEventType(event.type).toLowerCase()} taking place in {region?.name || "Wales"}.
                  Check the event website for full details.
                </p>
              )}
            </section>

            {/* Event Details */}
            <section className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-[#1e3a4c] mb-4">Event Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.dateStart && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#1e3a4c] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium text-[#1e3a4c]">{formatDate(event.dateStart)}</p>
                    </div>
                  </div>
                )}
                {event.dateEnd && event.dateEnd !== event.dateStart && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#1e3a4c] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium text-[#1e3a4c]">{formatDate(event.dateEnd)}</p>
                    </div>
                  </div>
                )}
                {event.monthTypical && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-[#1e3a4c] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Typically Held</p>
                      <p className="font-medium text-[#1e3a4c]">{event.monthTypical}</p>
                    </div>
                  </div>
                )}
                {event.registrationCost && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Ticket className="w-5 h-5 text-[#1e3a4c] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Entry Fee</p>
                      <p className="font-medium text-[#1e3a4c]">£{event.registrationCost}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Location */}
            <section className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-[#1e3a4c] mb-4">Location</h2>
              <p className="text-gray-600 flex items-start gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[#1e3a4c] shrink-0 mt-0.5" />
                {event.location || region?.name || "Wales"}
              </p>
              {/* Map placeholder */}
              <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                <span className="text-gray-400 text-sm">Map coming soon</span>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Registration Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg sticky top-24">
              <h3 className="text-lg font-bold text-[#1e3a4c] mb-2">Register for this event</h3>
              {event.registrationCost && (
                <p className="text-3xl font-bold text-[#1e3a4c] mb-4">
                  £{event.registrationCost}
                  <span className="text-sm font-normal text-gray-500"> entry</span>
                </p>
              )}

              {event.website ? (
                <a 
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#f97316] hover:bg-[#f97316]/90 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Register Now
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <button className="w-full bg-[#f97316] hover:bg-[#f97316]/90 text-white font-bold py-3 rounded-xl transition-colors">
                  Get More Info
                </button>
              )}

              <button className="flex items-center justify-center gap-2 w-full mt-3 bg-white border border-gray-200 text-[#1e3a4c] font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">
                <CalendarPlus className="w-4 h-4" />
                Add to Calendar
              </button>

              {event.capacity && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Limited to {event.capacity} participants
                </p>
              )}
            </div>

            {/* Website Link */}
            {event.website && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="font-bold text-[#1e3a4c] mb-3">Official Website</h4>
                <a 
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1e3a4c]"
                >
                  <Globe className="w-4 h-4" />
                  {event.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              </div>
            )}

            {/* Region Link */}
            {region && (
              <Link 
                href={`/${region.slug}`}
                className="block bg-[#1e3a4c] rounded-xl p-5 text-white hover:bg-[#1e3a4c]/90 transition-colors"
              >
                <h4 className="font-bold mb-1">Explore {region.name}</h4>
                <p className="text-white/70 text-sm">Discover more activities and events in the area</p>
              </Link>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            {event.registrationCost && (
              <>
                <span className="text-sm text-gray-500">Entry</span>
                <p className="font-bold text-[#1e3a4c]">£{event.registrationCost}</p>
              </>
            )}
            {!event.registrationCost && event.dateStart && (
              <p className="font-medium text-[#1e3a4c] text-sm">{formatDate(event.dateStart)}</p>
            )}
          </div>
          <a 
            href={event.website || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#f97316] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const events = await getEvents({ limit: 100 });
  return events.map(e => ({ slug: e.event.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await getEventBySlug(slug);
  if (!data) return { title: "Event Not Found" };
  
  return {
    title: `${data.event.name} | Adventure Wales`,
    description: data.event.description?.slice(0, 160) || `${data.event.name} - ${data.event.type} in Wales`,
  };
}
