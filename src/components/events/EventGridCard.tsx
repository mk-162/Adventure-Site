import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventGridCardProps {
  event: {
    id: number;
    name: string;
    slug: string;
    type: string | null;
    location: string | null;
    dateStart: Date | null;
    heroImage: string | null;
    category: string | null;
    monthTypical: string | null;
  };
  region?: {
    name: string;
  } | null;
  featured?: boolean;
}

const FALLBACK_IMAGES: Record<string, string[]> = {
  running: [
    "/images/misc/events-races-01-73c695f1.jpg",
    "/images/misc/events-races-02-4805ea61.jpg",
    "/images/misc/events-races-03-cfb10155.jpg",
    "/images/misc/events-races-04-3b0137ef.jpg",
    "/images/misc/events-races-05-99540cb7.jpg",
  ],
  triathlon: [
    "/images/misc/events-races-01-73c695f1.jpg",
    "/images/misc/events-races-02-4805ea61.jpg",
    "/images/misc/events-races-03-cfb10155.jpg",
  ],
  festival: [
    "/images/misc/events-festival-01-33fb98e2.jpg",
    "/images/misc/events-festival-02-d5627625.jpg",
    "/images/misc/events-festival-03-a5e74d4a.jpg",
    "/images/misc/events-festival-04-3bd3476c.jpg",
    "/images/misc/events-festival-05-ca042094.jpg",
  ],
  default: [
    "/images/misc/events-races-01-73c695f1.jpg",
    "/images/misc/events-races-02-4805ea61.jpg",
    "/images/misc/events-races-03-cfb10155.jpg",
  ]
};

// Helper to format date
function getEventDate(dateStart: Date | null, monthTypical: string | null) {
  if (dateStart) {
    const day = dateStart.getDate();
    const month = dateStart.toLocaleString('default', { month: 'short' });
    return { day, month: month.toUpperCase() };
  }

  // Fallback to monthTypical parsing if dateStart is null
  if (monthTypical) {
    const parts = monthTypical.split(" ");
    return {
      day: parts[1] || "",
      month: parts[0]?.substring(0, 3).toUpperCase() || "TBC"
    };
  }

  return { day: "TBC", month: "" };
}

export function EventGridCard({ event, region, featured }: EventGridCardProps) {
  // Image Logic
  let imageUrl = event.heroImage;

  // If fallback logic is needed
  if (!imageUrl) {
    const type = event.type?.toLowerCase() || 'default';
    let images = FALLBACK_IMAGES.default;

    if (type.includes('festival')) images = FALLBACK_IMAGES.festival;
    else if (type.includes('run') || type.includes('race') || type.includes('marathon')) images = FALLBACK_IMAGES.running;
    else if (type.includes('triathlon')) images = FALLBACK_IMAGES.triathlon;

    // Use ID to pick index deterministically
    const index = event.id % images.length;
    imageUrl = images[index];
  }

  const { day, month } = getEventDate(event.dateStart, event.monthTypical);

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        "group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 block",
        featured && "col-span-1 sm:col-span-2 lg:col-span-2 ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
      )}
    >
      <img
        alt={event.name}
        className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
        src={imageUrl}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Date Badge */}
      <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur rounded-lg p-2 text-center shadow-lg min-w-[3.5rem]">
        <span className="block text-lg font-display font-extrabold text-slate-900 dark:text-white leading-none">
          {day}
        </span>
        <span className="block text-[0.65rem] font-bold text-slate-500 uppercase mt-0.5">
          {month}
        </span>
      </div>

      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 bg-primary/90 text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10">
          Featured
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 transform group-hover:translate-y-[-0.25rem] transition-transform duration-300">
        {event.type && (
          <span className="px-2 py-0.5 bg-blue-600/80 backdrop-blur rounded text-[0.65rem] font-bold text-white uppercase tracking-wider mb-2 inline-block">
            {event.type}
          </span>
        )}

        <h3 className={cn(
          "font-display font-bold text-white mb-1 leading-tight line-clamp-2",
          featured ? "text-2xl md:text-3xl" : "text-lg"
        )}>
          {event.name}
        </h3>

        <div className="flex items-center gap-1 text-slate-300 text-xs mt-1">
          <MapPin className="h-3 w-3" />
          {event.location || region?.name || "Wales"}
        </div>
      </div>
    </Link>
  );
}
