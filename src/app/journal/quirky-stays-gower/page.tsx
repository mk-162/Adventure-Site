import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ExternalLink, Bed } from "lucide-react";

// SEO metadata
export const metadata: Metadata = {
  title: "12 Quirky Places to Stay in Gower (2026) | Best Unique Accommodation & Stays",
  description: "From shepherd huts overlooking Three Cliffs Bay to glamping pods with sea views and historic country inns — Gower offers quirky coastal stays that put you ",
  keywords: "quirky accommodation Gower, unique stays Gower, glamping Gower, unusual places to stay Gower, best places to stay Gower",
  openGraph: {
    title: "12 Quirky Places to Stay in Gower",
    description: "From shepherd huts overlooking Three Cliffs Bay to glamping pods with sea views and historic country inns — Gower offers quirky coastal stays that put you right on Britain's first Area of Outstanding ",
    type: "article",
    images: ["/images/journal/quirky-stays-gower-hero.jpg"],
  },
};

// Accommodation data
const accommodations = [
  {
    "name": "Three Cliffs Bay Holiday Park",
    "location": "Penmaen, Gower",
    "slug": "three-cliffs-bay-holiday-park",
    "price": "Check website",
    "sleeps": "2-6",
    "highlight": "Five-star holiday park offering luxury glamping tents and yurts, located a short walk from the iconic Three Cliffs Bay beach with panoramic coastal views.",
    "image": "/images/accommodation/quirky/three-cliffs-bay-holiday-park.jpg",
    "bookingUrl": "https://threecliffsbay.com/book",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Pitton Cross Camping",
    "location": "Rhossili, Gower",
    "slug": "pitton-cross-camping",
    "price": "Check website",
    "sleeps": "2-6",
    "highlight": "Features quirky shepherd huts and panoramic sea views towards Worm's Head. On-site facilities include a kite shop and a disc golf course.",
    "image": "/images/accommodation/quirky/pitton-cross-camping.jpg",
    "bookingUrl": "https://www.pittoncross.co.uk/pitton-cross-booking/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Scamperholidays",
    "location": "Rhossili, Gower",
    "slug": "scamperholidays",
    "price": "Check website",
    "sleeps": "2-6",
    "highlight": "Specialises in unique glamping experiences, offering shepherd huts, timber tents, and tiki huts, often situated at Pitton Cross with stunning coastal access.",
    "image": "/images/accommodation/quirky/scamperholidays.jpg",
    "bookingUrl": "https://scamperholidays.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Parc-Le-Breos House",
    "location": "Parkmill, Gower",
    "slug": "parc-le-breos-house",
    "price": "Check website",
    "sleeps": "2-6",
    "highlight": "A historic Victorian hunting lodge set in extensive grounds, operating as a guest house and pony trekking centre.",
    "image": "/images/accommodation/quirky/parc-le-breos-house.jpg",
    "bookingUrl": "https://parc-le-breos.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Clyne Farm Centre",
    "location": "Mayals, Swansea/Gower",
    "slug": "clyne-farm-centre",
    "price": "Check website",
    "sleeps": "2-6",
    "highlight": "Offers 9 unique holiday rentals in converted farm buildings and hosts the 'Muddiest Assault Course in the World' (Challenge Valley).",
    "image": "/images/accommodation/quirky/clyne-farm-centre.jpg",
    "bookingUrl": "https://clynefarm.com",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "The King Arthur Hotel",
    "location": "Reynoldston, Gower",
    "slug": "the-king-arthur-hotel",
    "price": "Check website",
    "sleeps": "2-6",
    "highlight": "A traditional country inn with characterful cottages situated directly on the village green, steeped in local history.",
    "image": "/images/accommodation/quirky/the-king-arthur-hotel.jpg",
    "bookingUrl": "https://www.kingarthurhotel.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Oxwich Bay Hotel - Secret Garden Pods",
    "location": "Oxwich, Gower",
    "slug": "oxwich-bay-hotel-secret-garden-pods",
    "price": "Check website",
    "sleeps": "2-6",
    "highlight": "Exclusive 'Secret Garden Pods' set within private walled gardens, just steps from the sweeping sands of Oxwich Bay.",
    "image": "/images/accommodation/quirky/oxwich-bay-hotel-secret-garden-pods.jpg",
    "bookingUrl": "https://www.oxwichbayhotel.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Bank Farm Leisure",
    "location": "Horton, Gower",
    "slug": "bank-farm-leisure",
    "price": "Check website",
    "sleeps": "2-6",
    "highlight": "Offers timber glamping pods with breathtaking views over Port Eynon Bay, featuring a heated swimming pool and roof terrace.",
    "image": "/images/accommodation/quirky/bank-farm-leisure.jpg",
    "bookingUrl": "https://www.bankfarmleisure.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Gower Camping (Kennexstone Farm)",
    "location": "Llangennith, Gower",
    "slug": "gower-camping-kennexstone-farm",
    "price": "Check website",
    "sleeps": "2-6",
    "highlight": "Glamping pods situated on a working farm near the famous Llangennith surfing beach.",
    "image": "/images/accommodation/quirky/gower-camping-kennexstone-farm.jpg",
    "bookingUrl": "https://gowercamping.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Nicholaston Farm",
    "location": "Penmaen, Gower",
    "slug": "nicholaston-farm",
    "price": "Check website",
    "sleeps": "2-6",
    "highlight": "Family-run farm with glamping facilities, farm shop, and café, located near Three Cliffs Bay and Tor Bay.",
    "image": "/images/accommodation/quirky/nicholaston-farm.jpg",
    "bookingUrl": "https://www.nicholastonfarm.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Greenways of Gower",
    "location": "Oxwich, Gower",
    "slug": "greenways-of-gower",
    "price": "Check website",
    "sleeps": "2-6",
    "highlight": "Luxury lodges with spectacular sea views over Oxwich Bay, offering a high-end holiday park experience.",
    "image": "/images/accommodation/quirky/greenways-of-gower.jpg",
    "bookingUrl": "https://premierleisureparks.com/greenways-of-gower/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Hael Farm Cottages",
    "location": "Southgate / Port Eynon, Gower",
    "slug": "hael-farm-cottages",
    "price": "Check website",
    "sleeps": "2-6",
    "highlight": "Charming cottages including 'Oxwich View' and 'Port Eynon Beach Cottage', offering peaceful stays near the coast.",
    "image": "/images/accommodation/quirky/hael-farm-cottages.jpg",
    "bookingUrl": "https://www.haelfarmcottages.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  }
];

export default function QuirkyStaysGower() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src="/images/journal/quirky-stays-gower-hero.jpg"
          alt="Quirky accommodation in Gower"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl">
            <span className="inline-block px-3 py-1 bg-accent text-white text-sm font-semibold rounded-full mb-4">
              Accommodation Guide
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              12 Quirky Places to Stay in Gower
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              From shepherd huts overlooking Three Cliffs Bay to glamping pods with sea views and historic country inns — Gower offers quirky coastal stays that put you right on Britain's first Area of Outstanding Natural Beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed">
            Gower was Britain's first Area of Outstanding Natural Beauty, and it deserves accommodation that lives up to that title. These quirky stays put you right on the clifftops, in the dunes, or overlooking some of the most beautiful beaches in Wales.
          </p>
          
          <div className="bg-slate-50 border-l-4 border-accent p-6 my-8 not-prose">
            <h3 className="font-bold text-lg mb-2">What makes our picks different?</h3>
            <ul className="space-y-2 text-slate-600">
              <li>✓ Every listing is verified and bookable</li>
              <li>✓ Hand-picked for uniqueness and character</li>
              <li>✓ Adventure-focused locations</li>
              <li>✓ Range of budgets to suit all travelers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Accommodation Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-16">
          {accommodations.map((stay, index) => (
            <article 
              key={stay.slug}
              id={stay.slug}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              {/* Image - alternating sides */}
              <div className={`relative h-[400px] rounded-2xl overflow-hidden ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <Image
                  src={stay.image}
                  alt={`${stay.name} - ${stay.highlight}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-slate-800">
                  #{index + 1}
                </div>
              </div>
              
              {/* Content */}
              <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  {stay.location}
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {stay.name}
                </h2>
                
                <p className="text-accent font-semibold mb-4">
                  {stay.highlight}
                </p>
                
                <p className="text-slate-600 mb-6">
                  {stay.highlight}
                </p>
                
                {/* Features */}
                {stay.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {stay.features.map((feature) => (
                      <span 
                        key={feature}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Details */}
                <div className="flex items-center gap-6 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-slate-400" />
                    <span>Sleeps {stay.sleeps}</span>
                  </div>
                  <div className="font-bold text-accent text-lg">
                    {stay.price}
                  </div>
                </div>
                
                {/* Best for */}
                <p className="text-sm text-slate-500 mb-6">
                  <strong>Best for:</strong> {stay.bestFor}
                </p>
                
                {/* CTA */}
                <a
                  href={stay.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
                >
                  Check Availability
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="bg-slate-50 py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <h2>Why Choose Quirky Accommodation in Gower?</h2>
            <p>
              Gower deserves accommodation that matches its character. These unique stays aren't just places to sleep — they're part of your adventure, putting you right in the heart of the landscape and local culture.
            </p>
            
            <h3>Best Areas to Stay in Gower</h3>
            <ul>
              <li><strong>Three Cliffs Bay/Pennard:</strong> Iconic views, luxury glamping</li>
              <li><strong>Rhossili:</strong> Worm's Head, shepherd huts, epic sunsets</li>
              <li><strong>Port Eynon:</strong> Beach access, surfing, clifftop glamping</li>
              <li><strong>Oxwich:</strong> Bay views, secret garden pods, coastal walks</li>
              <li><strong>Llangennith:</strong> Surfing hub, farm glamping, relaxed vibes</li>
            </ul>
            
            <h3>Booking Tips</h3>
            <ul>
              <li><strong>Book early:</strong> Quirky stays book up fast, especially weekends and school holidays</li>
              <li><strong>Check access:</strong> Some remote locations require good driving or walking</li>
              <li><strong>Minimum stays:</strong> Many unique stays have 2-3 night minimums</li>
              <li><strong>Facilities:</strong> Confirm what's included — some eco-stays are off-grid</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Explore More Quirky Stays in Wales</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/journal/quirky-stays" className="group">
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <Image
                src="/images/journal/quirky-stays-index-hero.jpg"
                alt="All Quirky Stays"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold group-hover:text-accent transition-colors">
              All Quirky Stays in Wales →
            </h3>
            <p className="text-sm text-slate-500">Browse all regions</p>
          </Link>
          
          <Link href="/journal/quirky-stays-snowdonia" className="group">
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <Image
                src="/images/regions/snowdonia-hero.jpg"
                alt="Snowdonia"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold group-hover:text-accent transition-colors">
              Quirky Stays: Snowdonia →
            </h3>
            <p className="text-sm text-slate-500">Treehouses and mountain lodges</p>
          </Link>
          
          <Link href="/journal/quirky-stays-pembrokeshire" className="group">
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <Image
                src="/images/regions/pembrokeshire-hero.jpg"
                alt="Pembrokeshire"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold group-hover:text-accent transition-colors">
              Quirky Stays: Pembrokeshire →
            </h3>
            <p className="text-sm text-slate-500">UFO glamping and coastal castles</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
