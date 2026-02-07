import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ExternalLink, Bed } from "lucide-react";

// SEO metadata
export const metadata: Metadata = {
  title: "10 Quirky Places to Stay in Brecon Beacons (2026) | Best Unique Accommodation & Stays",
  description: "From lakeside cabins and railway brake vans to mountaintop glamping and converted slate mine accommodation — the Brecon Beacons offers unique stays that ma",
  keywords: "quirky accommodation Brecon Beacons, unique stays Brecon Beacons, glamping Brecon Beacons, unusual places to stay Brecon Beacons, best places to stay Brecon Beacons",
  openGraph: {
    title: "10 Quirky Places to Stay in Brecon Beacons",
    description: "From lakeside cabins and railway brake vans to mountaintop glamping and converted slate mine accommodation — the Brecon Beacons offers unique stays that match its wild, dramatic landscape.",
    type: "article",
    images: ["/images/journal/quirky-stays-brecon-beacons-hero.jpg"],
  },
};

// Accommodation data
const accommodations = [
  {
    "name": "Glamping at Parkwood Outdoors, Dolygaer",
    "location": "Pontsticill, Merthyr Tydfil",
    "slug": "glamping-at-parkwood-outdoors-dolygaer",
    "price": "From £80 per night",
    "sleeps": "2-6",
    "highlight": "Situated on the edge of the Pontsticill Reservoir with stunning views and access to adventure activities like kayaking and gorge walking directly on site.",
    "image": "/images/accommodation/quirky/glamping-at-parkwood-outdoors-dolygaer.jpg",
    "bookingUrl": "https://dolygaeroutdoor.co.uk/accommodations/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Aber Glamping",
    "location": "Talybont-on-Usk",
    "slug": "aber-glamping",
    "price": "From £95 per night",
    "sleeps": "2-6",
    "highlight": "Stay in a geodesic dome or bell tent set in a wildflower meadow with panoramic views of the Black Mountains. Features a communal kitchen and fire pit area.",
    "image": "/images/accommodation/quirky/aber-glamping.jpg",
    "bookingUrl": "http://www.aberglamping.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Woodland Park Glamping",
    "location": "Llandefalle",
    "slug": "woodland-park-glamping",
    "price": "From £100 per night",
    "sleeps": "2-6",
    "highlight": "Eco-friendly glamping pods nestled in ancient woodland, perfect for nature lovers seeking tranquility. Each pod has its own private decking area.",
    "image": "/images/accommodation/quirky/woodland-park-glamping.jpg",
    "bookingUrl": "https://www.woodlandparkglamping.co.uk/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Beacons Bluff Escapes",
    "location": "Llangorse",
    "slug": "beacons-bluff-escapes",
    "price": "From £120 per night",
    "sleeps": "2-6",
    "highlight": "Lakeside cabins with direct access to Llangorse Lake for wild swimming and kayaking. Offers stunning sunset views over the water.",
    "image": "/images/accommodation/quirky/beacons-bluff-escapes.jpg",
    "bookingUrl": "https://www.beaconsbluff.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Camp Cynrig Glamping Village",
    "location": "Cantref, Brecon",
    "slug": "camp-cynrig-glamping-village",
    "price": "From £90 per night",
    "sleeps": "2-6",
    "highlight": "A unique tipi village and cabin set in a quiet spot by the river Cynrig, offering a true off-grid experience with solar lighting and composting toilets.",
    "image": "/images/accommodation/quirky/camp-cynrig-glamping-village.jpg",
    "bookingUrl": "http://www.breconglampingvillage.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Coity Bach Farm Glamping",
    "location": "Talybont-on-Usk",
    "slug": "coity-bach-farm-glamping",
    "price": "From £85 per night",
    "sleeps": "2-6",
    "highlight": "Traditional gypsy caravans and pods on a working farm, offering a nostalgic and rustic stay. Guests can meet the farm animals.",
    "image": "/images/accommodation/quirky/coity-bach-farm-glamping.jpg",
    "bookingUrl": "https://coitybach.co.uk/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Argoed Barns",
    "location": "Brecon",
    "slug": "argoed-barns",
    "price": "From £110 per night",
    "sleeps": "2-6",
    "highlight": "A luxury shepherd's hut with a hot tub, set in a peaceful location with panoramic views of the Brecon Beacons. Ideal for romantic getaways.",
    "image": "/images/accommodation/quirky/argoed-barns.jpg",
    "bookingUrl": "http://www.argoedbarns.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Toad and Snail Glamping",
    "location": "Brecon",
    "slug": "toad-and-snail-glamping",
    "price": "From £100 per night",
    "sleeps": "2-6",
    "highlight": "Stay in a lovingly restored GWR brake van for a truly unique railway-themed accommodation experience. Includes a private wood-fired hot tub.",
    "image": "/images/accommodation/quirky/toad-and-snail-glamping.jpg",
    "bookingUrl": "https://toadandsnailglamping.com",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Cantref Adventure Farm",
    "location": "Cantref, Brecon",
    "slug": "cantref-adventure-farm",
    "price": "From £70 per night",
    "sleeps": "2-6",
    "highlight": "Camping pods located on a popular adventure farm, offering free entry to the farm park for guests. Great for families with young children.",
    "image": "/images/accommodation/quirky/cantref-adventure-farm.jpg",
    "bookingUrl": "https://www.cantref.com/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Dan-yr-Ogof Showcaves Campsite",
    "location": "Abercrave",
    "slug": "dan-yr-ogof-showcaves-campsite",
    "price": "From £25 per night",
    "sleeps": "2-6",
    "highlight": "Camping and caravanning site located at the National Showcaves Centre for Wales, surrounded by over 200 life-sized dinosaur models.",
    "image": "/images/accommodation/quirky/dan-yr-ogof-showcaves-campsite.jpg",
    "bookingUrl": "https://www.showcaves.co.uk/stay-at-dan-yr-ogof/campsite",
    "features": [],
    "bestFor": "Adventure seekers"
  }
];

export default function QuirkyStaysBreconBeacons() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src="/images/journal/quirky-stays-brecon-beacons-hero.jpg"
          alt="Quirky accommodation in Brecon Beacons"
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
              10 Quirky Places to Stay in Brecon Beacons
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              From lakeside cabins and railway brake vans to mountaintop glamping and converted slate mine accommodation — the Brecon Beacons offers unique stays that match its wild, dramatic landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed">
            The Brecon Beacons deserves accommodation that matches its epic mountains and waterfalls. Whether you want to wake up by a lake, sleep in a converted railway carriage, or glamping above a slate mine, these unusual stays put you right in the landscape.
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
                  {stay.description}
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
            <h2>Why Choose Quirky Accommodation in Brecon Beacons?</h2>
            <p>
              Brecon Beacons deserves accommodation that matches its character. These unique stays aren't just places to sleep — they're part of your adventure, putting you right in the heart of the landscape and local culture.
            </p>
            
            <h3>Best Areas to Stay in Brecon Beacons</h3>
            <ul>
              <li><strong>Pontsticill:</strong> Reservoir glamping, outdoor activities on-site</li>
              <li><strong>Talybont-on-Usk:</strong> Canal, geodomes, central location</li>
              <li><strong>Llangorse:</strong> Lakeside cabins, wild swimming, watersports</li>
              <li><strong>Brecon:</strong> Market town base, shepherd huts nearby</li>
              <li><strong>Black Mountains:</strong> Remote tipis, dark skies, off-grid escapes</li>
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
