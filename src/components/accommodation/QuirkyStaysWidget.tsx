"use client";

import Link from "next/link";
import { Sparkles, TreePine, Castle, Tent, ArrowRight } from "lucide-react";

interface QuirkyStay {
  name: string;
  type: string;
  location: string;
  region: string;
  priceRange: string;
  description: string;
  slug: string;
  image?: string;
}

// Curated list of the quirkiest stays
const QUIRKY_STAYS: QuirkyStay[] = [
  {
    name: "Living Room Treehouses",
    type: "Treehouse",
    location: "Machynlleth",
    region: "Snowdonia",
    priceRange: "£150-300",
    description: "Magical treehouses in a hidden valley. Disconnect and immerse in nature in beautifully crafted structures.",
    slug: "quirky-stays-snowdonia",
  },
  {
    name: "Red Kite Tree Tent",
    type: "Tree Tent",
    location: "Newbridge-on-Wye",
    region: "Brecon Beacons",
    priceRange: "£120-200",
    description: "Suspended spherical tent in the canopy. Featured on George Clarke's Amazing Spaces.",
    slug: "quirky-stays-brecon-beacons",
  },
  {
    name: "Apple Camping UFO & Jet",
    type: "Quirky",
    location: "Redberth",
    region: "Pembrokeshire",
    priceRange: "£100-250",
    description: "Sleep in a UFO or a converted Jet Star plane. A truly unique Pembrokeshire adventure base.",
    slug: "quirky-stays-pembrokeshire",
  },
  {
    name: "Florence Springs Hobbit House",
    type: "Hobbit House",
    location: "Tenby",
    region: "Pembrokeshire",
    priceRange: "£100-200",
    description: "Hobbit houses, treehouses and yurts with hot tubs, just outside Tenby.",
    slug: "quirky-stays-pembrokeshire",
  },
  {
    name: "Llanthony Priory Hotel",
    type: "Historic",
    location: "Llanthony",
    region: "Brecon Beacons",
    priceRange: "£80-150",
    description: "Hotel built into the ruins of a 12th-century priory. Truly atmospheric.",
    slug: "quirky-stays-brecon-beacons",
  },
  {
    name: "Portmeirion Village",
    type: "Unique Village",
    location: "Minffordd",
    region: "Snowdonia",
    priceRange: "£150-300",
    description: "Stay in a surreal Italianate village. Unlike anywhere else in Wales.",
    slug: "quirky-stays-snowdonia",
  },
];

const typeIcons: Record<string, typeof TreePine> = {
  "Treehouse": TreePine,
  "Tree Tent": TreePine,
  "Historic": Castle,
  "Hobbit House": Tent,
  "Quirky": Sparkles,
  "Unique Village": Castle,
};

interface QuirkyStaysWidgetProps {
  region?: string; // Filter by region if provided
  limit?: number;
  showTitle?: boolean;
  variant?: "grid" | "carousel";
}

export function QuirkyStaysWidget({ 
  region, 
  limit = 4, 
  showTitle = true,
  variant = "grid" 
}: QuirkyStaysWidgetProps) {
  // Filter by region if provided
  let stays = region 
    ? QUIRKY_STAYS.filter(s => s.region.toLowerCase().includes(region.toLowerCase()))
    : QUIRKY_STAYS;
  
  // Limit results
  stays = stays.slice(0, limit);

  if (stays.length === 0) return null;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-accent-hover font-bold uppercase tracking-wider text-sm mb-2">
                <Sparkles className="h-4 w-4" />
                Unique Stays
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                Quirky Places to Stay
              </h2>
              <p className="text-slate-600 mt-1">
                Treehouses, castles, UFOs, and hobbit holes — not your average accommodation
              </p>
            </div>
            <Link 
              href="/journal/quirky-stays"
              className="hidden sm:flex items-center gap-1 text-primary font-bold hover:text-accent-hover transition-colors"
            >
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className={variant === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          : "flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
        }>
          {stays.map((stay) => {
            const Icon = typeIcons[stay.type] || Sparkles;
            return (
              <Link
                key={stay.name}
                href={`/journal/${stay.slug}`}
                className={`group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:border-primary/30 transition-all duration-300 ${
                  variant === "carousel" ? "flex-shrink-0 w-72" : ""
                }`}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent-hover/20 relative overflow-hidden">
                  {stay.image ? (
                    <img 
                      src={stay.image} 
                      alt={stay.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="h-16 w-16 text-primary/30" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                    <Icon className="h-3 w-3" />
                    {stay.type}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-primary group-hover:text-accent-hover transition-colors line-clamp-1">
                    {stay.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {stay.location}, {stay.region}
                  </p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                    {stay.description}
                  </p>
                  <p className="text-sm font-bold text-accent-hover mt-2">
                    {stay.priceRange}/night
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link 
            href="/journal/quirky-stays"
            className="inline-flex items-center gap-1 text-primary font-bold hover:text-accent-hover"
          >
            See all quirky stays <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
