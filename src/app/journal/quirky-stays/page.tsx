import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Sparkles, Castle, TreePine, Waves, Mountain, Compass, Ship, Building } from "lucide-react";

// SEO metadata
export const metadata: Metadata = {
  title: "Quirky Places to Stay in Wales (2026) | Unique Accommodation Guide",
  description: "Discover the most unique and unusual places to stay in Wales - from treehouses and castles to UFO glamping and lighthouse cottages. Hand-picked quirky accommodation across all regions.",
  keywords: "quirky accommodation Wales, unique stays Wales, unusual places to stay Wales, glamping Wales, best quirky hotels Wales, unique accommodation UK",
  openGraph: {
    title: "Quirky Places to Stay in Wales - Regional Guide",
    description: "From Snowdonia treehouses to Pembrokeshire UFO glamping - explore Wales' most unique accommodation",
    type: "article",
    images: ["/images/journal/quirky-stays-index-hero.jpg"],
  },
};

const regions = [
  {
    name: "Snowdonia",
    slug: "quirky-stays-snowdonia",
    description: "Treehouses in ancient woodland, slate mine glamping, and mountain lodges with hot tubs",
    image: "/images/regions/snowdonia-hero.jpg",
    icon: TreePine,
    count: "12+",
    highlights: ["Living Room Treehouses", "Portmeirion Village", "Epic Retreats"],
    location: "North Wales"
  },
  {
    name: "Pembrokeshire",
    slug: "quirky-stays-pembrokeshire",
    description: "UFO glamping, converted aircraft, historic castles and clifftop lighthouses",
    image: "/images/regions/pembrokeshire-hero.jpg",
    icon: Waves,
    count: "15+",
    highlights: ["Apple Camping UFOs", "Roch Castle", "Florence Springs Hobbit Houses"],
    location: "West Wales"
  },
  {
    name: "Anglesey",
    slug: "quirky-stays-anglesey",
    description: "Lighthouse cottages, French châteaux, windmills and coastal glamping domes",
    image: "/images/regions/anglesey-hero.jpg",
    icon: Castle,
    count: "13+",
    highlights: ["Point Lynas Lighthouse", "Château Rhianfa", "Melin Newydd Windmill"],
    location: "North Wales"
  },
  {
    name: "Brecon Beacons",
    slug: "quirky-stays-brecon-beacons",
    description: "Lakeside cabins, railway brake vans, tipis and mountaintop glamping",
    image: "/images/regions/brecon-beacons-hero.jpg",
    icon: Mountain,
    count: "10+",
    highlights: ["Beacons Bluff Lake Cabins", "Toad & Snail Railway Van", "Camp Cynrig Tipis"],
    location: "South Wales"
  },
  {
    name: "Gower",
    slug: "quirky-stays-gower",
    description: "Shepherd huts with sea views, secret garden pods and clifftop glamping",
    image: "/images/regions/gower-hero.jpg",
    icon: Waves,
    count: "12+",
    highlights: ["Three Cliffs Bay Glamping", "Pitton Cross Shepherd Huts", "Oxwich Secret Garden"],
    location: "South Wales"
  },
  {
    name: "North Wales",
    slug: "quirky-stays-north-wales",
    description: "Zip World lodges, Wonderland houses, railway carriages and off-grid mountain huts",
    image: "/images/regions/north-wales-hero.jpg",
    icon: Sparkles,
    count: "15+",
    highlights: ["Llechwedd Safari Lodges", "Wonderland House", "Crashpad Mountain Lodge"],
    location: "North Wales"
  },
  {
    name: "South Wales",
    slug: "quirky-stays-south-wales",
    description: "Forest glamping at bike parks, converted lighthouses and historic castle hotels",
    image: "/images/regions/south-wales-hero.jpg",
    icon: TreePine,
    count: "11+",
    highlights: ["West Usk Lighthouse", "Craig y Nos Castle", "Cwmcarn Forest Glamping"],
    location: "South Wales"
  },
  {
    name: "Wye Valley",
    slug: "quirky-stays-wye-valley",
    description: "Railway carriages in Dark Sky Reserves, medieval gatehouses and astro-pods",
    image: "/images/regions/wye-valley-hero.jpg",
    icon: Castle,
    count: "13+",
    highlights: ["Moon Conker Astro-Pod", "Welsh Gatehouse", "Llancayo Windmill"],
    location: "Wales/England Border"
  },
  {
    name: "Llŷn Peninsula",
    slug: "quirky-stays-llyn-peninsula",
    description: "Beach-access campsites, luxury domes, shepherd huts and the famous Ty Coch Inn",
    image: "/images/regions/llyn-peninsula-hero.jpg",
    icon: Waves,
    count: "14+",
    highlights: ["Ty Coch Inn", "Porth Iago Camping", "Castell Deudraeth"],
    location: "North Wales"
  }
];

export default function QuirkyStaysIndex() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px]">
        <Image
          src="/images/journal/quirky-stays-index-hero.jpg"
          alt="Quirky accommodation across Wales"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl">
            <span className="inline-block px-3 py-1 bg-accent text-white text-sm font-semibold rounded-full mb-4">
              <Sparkles className="w-4 h-4 inline mr-1" />
              Accommodation Guide
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Quirky Places to Stay in Wales
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Forget boring hotels. From treehouses and castles to UFO glamping and lighthouse cottages — discover Wales' most extraordinary places to stay, region by region.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed">
            Wales is packed with incredible landscapes — from Snowdonia's mountains to Pembrokeshire's coastline. But why sleep somewhere ordinary when you can make your accommodation part of the adventure? We've scoured every corner of Wales to find the most unique, quirky, and memorable places to stay.
          </p>
          
          <div className="bg-slate-50 border-l-4 border-accent p-6 my-8 not-prose">
            <h3 className="font-bold text-lg mb-2">What you'll find in this guide:</h3>
            <ul className="space-y-2 text-slate-600">
              <li>✓ <strong>115+ verified quirky stays</strong> across 9 Welsh regions</li>
              <li>✓ From budget campsites to luxury castle hotels</li>
              <li>✓ Hand-picked for uniqueness, character, and adventure access</li>
              <li>✓ Direct booking links and honest descriptions</li>
              <li>✓ Perfect for couples, families, groups, and solo adventurers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Regional Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore by Region</h2>
        <p className="text-lg text-slate-600 mb-12">
          Choose your region and discover the most unique places to stay
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regions.map((region) => {
            const IconComponent = region.icon;
            return (
              <Link 
                key={region.slug} 
                href={`/journal/${region.slug}`}
                className="group"
              >
                <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={region.image}
                      alt={`Quirky accommodation in ${region.name}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-accent" />
                      <span className="text-sm font-bold text-slate-800">{region.count} stays</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      {region.location}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-accent transition-colors">
                      {region.name}
                    </h3>
                    
                    <p className="text-slate-600 mb-4 line-clamp-2">
                      {region.description}
                    </p>
                    
                    {/* Highlights */}
                    <div className="space-y-1 mb-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Featured Stays:</p>
                      <ul className="text-sm text-slate-600 space-y-0.5">
                        {region.highlights.map((highlight, idx) => (
                          <li key={idx} className="truncate">• {highlight}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* CTA */}
                    <div className="flex items-center text-accent font-semibold group-hover:gap-3 gap-2 transition-all">
                      Explore {region.name}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Types Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What Kind of Quirky Are You Looking For?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg mb-2">🌲 Off-Grid & Eco</h3>
              <p className="text-sm text-slate-600 mb-3">Treehouses, eco-cabins, shepherd huts</p>
              <p className="text-xs text-slate-500">Best in: Snowdonia, Wye Valley, Pembrokeshire</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg mb-2">🏰 Historic & Heritage</h3>
              <p className="text-sm text-slate-600 mb-3">Castles, lighthouses, windmills, forts</p>
              <p className="text-xs text-slate-500">Best in: Pembrokeshire, Anglesey, Wye Valley</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg mb-2">✨ Luxury Glamping</h3>
              <p className="text-sm text-slate-600 mb-3">Hot tubs, geodomes, safari lodges</p>
              <p className="text-xs text-slate-500">Best in: All regions - wide selection</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg mb-2">🎪 Proper Weird</h3>
              <p className="text-sm text-slate-600 mb-3">UFOs, planes, astro-pods, themed houses</p>
              <p className="text-xs text-slate-500">Best in: Pembrokeshire, North Wales, Wye Valley</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          <h2>How to Book Quirky Accommodation in Wales</h2>
          
          <h3>Book Early</h3>
          <p>
            The most unique stays book up months in advance, especially for weekends and school holidays. If you find something special, don't wait — these places have limited availability by nature.
          </p>
          
          <h3>Consider Midweek</h3>
          <p>
            Many quirky stays offer significant discounts Sunday-Thursday. You'll also have the place more to yourself and avoid crowds at nearby attractions.
          </p>
          
          <h3>Check Accessibility</h3>
          <p>
            Some remote stays require 4x4 access, good walking fitness, or tide-dependent causeways. Read the access info carefully — this is often part of the charm, but you need to be prepared.
          </p>
          
          <h3>Minimum Stays</h3>
          <p>
            Expect 2-3 night minimums, especially at weekends and peak season. Many places offer better value for longer stays, and you'll want the extra time to explore anyway.
          </p>
          
          <h3>Facilities Vary</h3>
          <p>
            Quirky doesn't always mean luxury. Some eco-stays are genuinely off-grid with composting toilets and solar showers. Others have hot tubs and underfloor heating. Always check what's included.
          </p>
        </div>
      </section>

      {/* Related Content */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Plan Your Welsh Adventure</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/destinations" className="group">
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <Image
                  src="/images/destinations-hero.jpg"
                  alt="Welsh Destinations"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold group-hover:text-accent transition-colors">
                Explore Destinations →
              </h3>
              <p className="text-sm text-slate-500">Discover what to do in each region</p>
            </Link>
            
            <Link href="/activities" className="group">
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <Image
                  src="/images/activities-hero.jpg"
                  alt="Activities in Wales"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold group-hover:text-accent transition-colors">
                Browse Activities →
              </h3>
              <p className="text-sm text-slate-500">Find your perfect adventure</p>
            </Link>
            
            <Link href="/journal" className="group">
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <Image
                  src="/images/journal-hero.jpg"
                  alt="Adventure Wales Journal"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold group-hover:text-accent transition-colors">
                Read More Guides →
              </h3>
              <p className="text-sm text-slate-500">Expert tips and inspiration</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
