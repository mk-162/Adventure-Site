import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";
import { Badge, TypeBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

interface EventCardProps {
  event: {
    id: number;
    name: string;
    slug: string;
    type: string | null;
    location: string | null;
    monthTypical: string | null;
    website: string | null;
    registrationCost: string | null;
    description: string | null;
  };
  region?: {
    name: string;
    slug: string;
  } | null;
  variant?: "default" | "list" | "featured";
}

// Parse month from monthTypical (e.g., "January 25" -> { month: "JAN", day: "25" })
function parseDate(monthTypical: string | null): { month: string; day: string } {
  if (!monthTypical) return { month: "TBD", day: "" };
  const parts = monthTypical.split(" ");
  const month = parts[0]?.substring(0, 3).toUpperCase() || "TBD";
  const day = parts[1] || "";
  return { month, day };
}

export function EventCard({ event, region, variant = "default" }: EventCardProps) {
  const date = parseDate(event.monthTypical);

  if (variant === "list") {
    return (
      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
        {/* Left: Date + Info */}
        <div className="flex items-center gap-4">
          {/* Date Badge */}
          <div className="w-14 text-center flex-shrink-0">
            <div className="text-xs font-semibold text-accent-hover uppercase">
              {date.month}
            </div>
            <div className="text-2xl font-bold text-primary">
              {date.day || "—"}
            </div>
          </div>

          {/* Event Info */}
          <div>
            <h3 className="font-semibold text-primary">{event.name}</h3>
            <p className="text-sm text-gray-500">
              {event.location || region?.name || "Wales"}
            </p>
          </div>
        </div>

        {/* Right: Type + Details */}
        <div className="flex items-center gap-4">
          {event.type && (
            <span className="text-sm text-gray-500 hidden sm:block">
              {event.type}
            </span>
          )}
          <Link
            href={`/events/${event.slug}`}
            className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700 rounded-full hover:border-accent-hover hover:text-accent-hover transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/events/${event.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
      >
        {/* Image placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-primary to-[#2d5066]">
          {/* Date Badge */}
          <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 text-center">
            <div className="text-xs font-semibold text-accent-hover uppercase">
              {date.month}
            </div>
            <div className="text-xl font-bold text-primary">
              {date.day || "—"}
            </div>
          </div>
          <Badge variant="accent" className="absolute top-4 right-4">
            Featured
          </Badge>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg text-primary group-hover:text-accent-hover transition-colors mb-2">
            {event.name}
          </h3>

          <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
            <MapPin className="h-3 w-3" />
            {event.location || region?.name || "Wales"}
          </p>

          {event.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {event.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            {event.type && <TypeBadge type={event.type} />}
            {event.registrationCost && (
              <span className="text-sm font-semibold text-primary">
                From £{event.registrationCost}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      {/* Header with date */}
      <div className="bg-primary p-4 flex items-center gap-4">
        <div className="bg-white rounded-lg px-3 py-2 text-center">
          <div className="text-xs font-semibold text-accent-hover uppercase">
            {date.month}
          </div>
          <div className="text-xl font-bold text-primary">
            {date.day || "—"}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white group-hover:text-accent-hover transition-colors line-clamp-1">
            {event.name}
          </h3>
          <p className="text-white/70 text-sm flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {event.location || region?.name || "Wales"}
          </p>
        </div>
      </div>

      <div className="p-4">
        {event.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {event.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {event.type && <TypeBadge type={event.type} />}
          {event.registrationCost && (
            <span className="text-sm font-semibold text-primary">
              From £{event.registrationCost}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
