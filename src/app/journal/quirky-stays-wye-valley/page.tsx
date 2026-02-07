import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ExternalLink, Bed } from "lucide-react";

// SEO metadata
export const metadata: Metadata = {
  title: "13 Quirky Places to Stay in Wye Valley (2026) | Best Unique Accommodation & Stays",
  description: "From converted railway carriages in Dark Sky Reserves to medieval gatehouses and windmills — the Wye Valley offers some of the most romantic and unique acc",
  keywords: "quirky accommodation Wye Valley, unique stays Wye Valley, glamping Wye Valley, unusual places to stay Wye Valley, best places to stay Wye Valley",
  openGraph: {
    title: "13 Quirky Places to Stay in Wye Valley",
    description: "From converted railway carriages in Dark Sky Reserves to medieval gatehouses and windmills — the Wye Valley offers some of the most romantic and unique accommodation in Wales, nestled in ancient woodl",
    type: "article",
    images: ["/images/journal/quirky-stays-wye-valley-hero.jpg"],
  },
};

// Accommodation data
const accommodations = [
  {
    "name": "Llanthony Castaway",
    "location": "Llanthony, Monmouthshire",
    "slug": "llanthony-castaway",
    "description": "A cosily restored, warmly rustic railway carriage set within 270 private acres of family-run farmland in the Black Mountains. Blissfully encircled by lush scenery, this 'secret' valley spot is perfect for couples looking to disconnect and reconnect with nature.",
    "price": "From £135 / night",
    "sleeps": "2-6",
    "highlight": "A lovingly restored railway carriage in a Dark Sky Reserve, offering total seclusion and epic stargazing.",
    "image": "/images/accommodation/quirky/llanthony-castaway.jpg",
    "bookingUrl": "https://hostunusual.com/property/llanthony-castaway/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Llancayo Windmill",
    "location": "Near Usk, Monmouthshire",
    "slug": "llancayo-windmill",
    "description": "Luxurious self-catering accommodation for 12 people in a historic windmill with spectacular views of the Welsh countryside. Features a balcony, underfloor heating, and is ideally located for exploring the Brecon Beacons and Wye Valley.",
    "price": "From £2427 / week",
    "sleeps": "2-6",
    "highlight": "A restored 19th-century windmill offering luxury self-catering accommodation across five floors.",
    "image": "/images/accommodation/quirky/llancayo-windmill.jpg",
    "bookingUrl": "https://hostunusual.com/property/llancayo-windmill/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Writer's Retreat",
    "location": "Abergavenny, Monmouthshire",
    "slug": "writer-s-retreat",
    "description": "Ideally located for a digital detox, this cabin was the setting for Robert Penn's book 'The Man Who Made Things Out of Trees'. It features a woodburner, spacious oak decking, and is surrounded by stunning walking trails.",
    "price": "From £525 (7 nights)",
    "sleeps": "2-6",
    "highlight": "A handcrafted wooden cabin nestled in an enchanting wooded valley at the foot of Sugar Loaf Mountain.",
    "image": "/images/accommodation/quirky/writer-s-retreat.jpg",
    "bookingUrl": "https://hostunusual.com/property/writers-retreat/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Anne's Hut",
    "location": "Penterry, Monmouthshire",
    "slug": "anne-s-hut",
    "description": "One hut houses the living and sleeping space with a woodburner, whilst the other features a luxury bathroom with a double-ended bath. Located in an Area of Outstanding Natural Beauty near Chepstow.",
    "price": "From £302 (2 nights)",
    "sleeps": "2-6",
    "highlight": "Two cosy shepherd's huts joined by decking, secluded in a green meadow with panoramic views.",
    "image": "/images/accommodation/quirky/anne-s-hut.jpg",
    "bookingUrl": "https://hostunusual.com/property/annes-hut/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Medley Meadow",
    "location": "Llanover, Monmouthshire",
    "slug": "medley-meadow",
    "description": "An eco-friendly glamping site offering four individually styled safari tents. Perfect for families and couples wanting to immerse themselves in nature, with private facilities and firepits.",
    "price": "From £135 / night",
    "sleeps": "2-6",
    "highlight": "Safari tents on a 9-acre conservation site, teeming with wildlife and indigenous trees.",
    "image": "/images/accommodation/quirky/medley-meadow.jpg",
    "bookingUrl": "https://hostunusual.com/property/medley-meadow/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Cromwell's Hideaway",
    "location": "Raglan, Monmouthshire",
    "slug": "cromwell-s-hideaway",
    "description": "A luxurious, self-contained hut featuring underfloor heating, a log burner, and a private fire pit. Blissfully secluded on farmland, offering a romantic escape with hotel-style comforts.",
    "price": "From £109 - £125 / night",
    "sleeps": "2-6",
    "highlight": "A bespoke-crafted shepherd's hut with exceptional views of Raglan Castle and the Brecon Beacons.",
    "image": "/images/accommodation/quirky/cromwell-s-hideaway.jpg",
    "bookingUrl": "https://hostunusual.com/property/cromwells-hideaway/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "The Welsh Gatehouse",
    "location": "Mathern, Monmouthshire",
    "slug": "the-welsh-gatehouse",
    "description": "Stay in your own castle towers with authentic period features, a spiral staircase, and a viewing platform at the top of the tower. A truly unique and romantic bolthole near Chepstow.",
    "price": "From £315 / night",
    "sleeps": "2-6",
    "highlight": "A Grade II listed, castle-style gatehouse dating back to 1270, offering a medieval-style luxury stay.",
    "image": "/images/accommodation/quirky/the-welsh-gatehouse.jpg",
    "bookingUrl": "https://hostunusual.com/property/the-welsh-gatehouse/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Sugar Loaf Cabin",
    "location": "Abergavenny, Monmouthshire",
    "slug": "sugar-loaf-cabin",
    "description": "Furnished with reclaimed materials and featuring a woodburner and high ceilings. A perfect base for exploring the Sugar Loaf mountain or simply relaxing on the terrace by the lake.",
    "price": "From £722 (7 nights)",
    "sleeps": "2-6",
    "highlight": "A rustic, vintage-styled cabin secluded by a wildlife lake and surrounded by woodland.",
    "image": "/images/accommodation/quirky/sugar-loaf-cabin.jpg",
    "bookingUrl": "https://hostunusual.com/property/sugar-loaf-cabin/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Stargazer Cabin",
    "location": "Monmouth, Monmouthshire",
    "slug": "stargazer-cabin",
    "description": "Nestled in a historic walled meadow garden, this retreat offers rural views towards Kymin Tower. Features a log burner, Nespresso machine, and a private firepit.",
    "price": "From £89 / night",
    "sleeps": "2-6",
    "highlight": "A cabin with a conical roof and huge glass panels for stargazing from bed.",
    "image": "/images/accommodation/quirky/stargazer-cabin.jpg",
    "bookingUrl": "https://hostunusual.com/property/stargazer-cabin/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "The Meeting Hall",
    "location": "Pantygelli, Monmouthshire",
    "slug": "the-meeting-hall",
    "description": "Retaining original wooden floorboards and panelling, this open-plan space sleeps four. Features a decked veranda and is situated just opposite a popular gastro pub.",
    "price": "From £515 (7 nights)",
    "sleeps": "2-6",
    "highlight": "A quirky former Sunday School hall from 1926, lovingly converted into a cosy holiday home.",
    "image": "/images/accommodation/quirky/the-meeting-hall.jpg",
    "bookingUrl": "https://hostunusual.com/property/the-meeting-hall/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Kymin Round House",
    "location": "Monmouth, Monmouthshire",
    "slug": "kymin-round-house",
    "description": "Perched atop the Kymin hill, this unique retreat offers views of the Wye Valley and Brecon Beacons. Furnished in Georgian style with modern amenities, surrounded by National Trust parkland.",
    "price": "From £450 (3 nights)",
    "sleeps": "2-6",
    "highlight": "A circular Georgian castellated building originally built as a picnic spot, offering spectacular panoramic views.",
    "image": "/images/accommodation/quirky/kymin-round-house.jpg",
    "bookingUrl": "https://hostunusual.com/property/kymin-round-house/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Moon Conker",
    "location": "Llanafanfawr, Powys",
    "slug": "moon-conker",
    "description": "An ethereal orb featuring a modular bed/table and a separate dining pod with pizza oven. Includes two outdoor baths for al fresco soaking in the wilderness of the Red Kite Estate.",
    "price": "From £145 / night",
    "sleeps": "2-6",
    "highlight": "A hi-tech, off-grid 'astro-pod' with ceiling windows for stargazing, set in a Dark Skies Park.",
    "image": "/images/accommodation/quirky/moon-conker.jpg",
    "bookingUrl": "https://hostunusual.com/property/moon-conker/",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Red Kite Barn",
    "location": "Builth Wells, Powys",
    "slug": "red-kite-barn",
    "description": "Featuring three double bedrooms, underfloor heating, and a zinc-clad kitchen with moorland views. Guests can arrange private chefs or beauty treatments for an indulgent group escape.",
    "price": "From £1313 (1 week)",
    "sleeps": "2-6",
    "highlight": "A luxury 'upside-down' converted stone barn set in 80 acres of private woodland.",
    "image": "/images/accommodation/quirky/red-kite-barn.jpg",
    "bookingUrl": "https://hostunusual.com/property/red-kite-barn/",
    "features": [],
    "bestFor": "Adventure seekers"
  }
];

export default function QuirkyStaysWyeValley() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src="/images/journal/quirky-stays-wye-valley-hero.jpg"
          alt="Quirky accommodation in Wye Valley"
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
              13 Quirky Places to Stay in Wye Valley
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              From converted railway carriages in Dark Sky Reserves to medieval gatehouses and windmills — the Wye Valley offers some of the most romantic and unique accommodation in Wales, nestled in ancient woodlands and historic estates.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed">
            The Wye Valley is one of the most beautiful corners of Wales — ancient woodlands, the mighty River Wye, and some of the darkest skies in Britain. These unique stays range from astro-pods and windmills to medieval castles and shepherd huts, all in stunning secluded settings.
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
            <h2>Why Choose Quirky Accommodation in Wye Valley?</h2>
            <p>
              Wye Valley deserves accommodation that matches its character. These unique stays aren't just places to sleep — they're part of your adventure, putting you right in the heart of the landscape and local culture.
            </p>
            
            <h3>Best Areas to Stay in Wye Valley</h3>
            <ul>
              <li><strong>Llanthony:</strong> Black Mountains, Dark Sky Reserve, converted carriages</li>
              <li><strong>Monmouth:</strong> Wye River, historic town, stargazer cabins</li>
              <li><strong>Abergavenny:</strong> Sugar Loaf mountain, woodland cabins, market town</li>
              <li><strong>Chepstow/Mathern:</strong> Medieval gatehouses, river views</li>
              <li><strong>Usk area:</strong> Windmills, rolling countryside, rural escapes</li>
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
