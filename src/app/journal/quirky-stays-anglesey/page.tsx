import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ExternalLink, Bed } from "lucide-react";

// SEO metadata
export const metadata: Metadata = {
  title: "13 Quirky Places to Stay in Anglesey (2026) | Best Unique Accommodation & Stays",
  description: "From lighthouse keeper cottages and French châteaux to Mongolian yurts and luxury glamping domes — Anglesey offers an incredible range of unique accommodat",
  keywords: "quirky accommodation Anglesey, unique stays Anglesey, glamping Anglesey, unusual places to stay Anglesey, best places to stay Anglesey",
  openGraph: {
    title: "13 Quirky Places to Stay in Anglesey",
    description: "From lighthouse keeper cottages and French châteaux to Mongolian yurts and luxury glamping domes — Anglesey offers an incredible range of unique accommodation. Sleep where the keepers watched the wave",
    type: "article",
    images: ["/images/journal/quirky-stays-anglesey-hero.jpg"],
  },
};

// Accommodation data
const accommodations = [
  {
    "name": "Point Lynas Lighthouse",
    "location": "Llaneilian",
    "slug": "point-lynas-lighthouse",
    "description": "Perched on a dramatic headland on the north coast, the former lighthouse keepers' cottages offer a truly unique stay. Guests wake up to panoramic sea views and the chance to spot dolphins, porpoises, and seals directly from the window. The working lighthouse adds a historic maritime atmosphere to this remote retreat.",
    "price": "From £150-£300",
    "sleeps": "2-6",
    "highlight": "Perched on a dramatic headland on the north coast, the forme...",
    "image": "/images/accommodation/quirky/point-lynas-lighthouse.jpg",
    "bookingUrl": "https://pointlynaslighthouse.com",
    "features": [
      "Sea views",
      "Historic building",
      "Private garden",
      "Direct coastal path access"
    ],
    "bestFor": "Couples, History buffs, Wildlife watchers"
  },
  {
    "name": "Château Rhianfa",
    "location": "Menai Bridge",
    "slug": "ch-teau-rhianfa",
    "description": "A slice of the Loire Valley on the banks of the Menai Strait. This Grade II listed French-style château offers fairytale accommodation with turrets, spires, and landscaped gardens. It provides a luxurious and surreal base for exploring the island, complete with a private beach and views across to Snowdonia.",
    "price": "From £200-£500",
    "sleeps": "2-6",
    "highlight": "A slice of the Loire Valley on the banks of the Menai Strait...",
    "image": "/images/accommodation/quirky/ch-teau-rhianfa.jpg",
    "bookingUrl": "https://chateaurhianfa.co.uk",
    "features": [
      "Luxury rooms",
      "Private beach",
      "Fine dining",
      "Gardens"
    ],
    "bestFor": "Couples, Luxury travelers, Weddings"
  },
  {
    "name": "Melin Newydd Windmill",
    "location": "Tynlon",
    "slug": "melin-newydd-windmill",
    "description": "A beautifully restored 18th-century windmill offering three storeys of characterful accommodation. The top floor living room provides 360-degree views over the island's countryside. It retains original machinery features while offering modern comforts, making it a memorable base for a family adventure.",
    "price": "From £150-£250",
    "sleeps": "2-6",
    "highlight": "A beautifully restored 18th-century windmill offering three ...",
    "image": "/images/accommodation/quirky/melin-newydd-windmill.jpg",
    "bookingUrl": "https://anglesey-cottages.co.uk",
    "features": [
      "Panoramic views",
      "Historic machinery",
      "Rural setting",
      "Unique architecture"
    ],
    "bestFor": "Families, Architecture lovers, Groups"
  },
  {
    "name": "Wonderfully Wild",
    "location": "Beaumaris",
    "slug": "wonderfully-wild",
    "description": "Luxury safari lodges set in the rolling countryside near Beaumaris. These off-grid canvas lodges offer a glamping experience with proper beds, wood-burning stoves, and en-suite facilities. It's a perfect blend of outdoor living and comfort, ideal for families wanting to unplug.",
    "price": "From £120-£200",
    "sleeps": "2-6",
    "highlight": "Luxury safari lodges set in the rolling countryside near Bea...",
    "image": "/images/accommodation/quirky/wonderfully-wild.jpg",
    "bookingUrl": "https://wonderfullywild.co.uk",
    "features": [
      "Safari lodges",
      "Wood-burning stove",
      "Off-grid",
      "Rural views"
    ],
    "bestFor": "Families, Groups, Nature lovers"
  },
  {
    "name": "Anglesey Yurt Holidays",
    "location": "Holyhead",
    "slug": "anglesey-yurt-holidays",
    "description": "Authentic Mongolian yurts situated on a working family farm near the coast. Each yurt is individually decorated and features a wood burner and comfortable beds. The site offers a peaceful escape with stunning sunsets and easy access to the beaches of Holy Island.",
    "price": "From £90-£150",
    "sleeps": "2-6",
    "highlight": "Authentic Mongolian yurts situated on a working family farm ...",
    "image": "/images/accommodation/quirky/anglesey-yurt-holidays.jpg",
    "bookingUrl": "https://angleseyyurtholidays.co.uk",
    "features": [
      "Mongolian yurts",
      "Wood burner",
      "Farm setting",
      "Coastal location"
    ],
    "bestFor": "Couples, Families, Glamping enthusiasts"
  },
  {
    "name": "Hideaway in the Hills",
    "location": "Din Lligwy",
    "slug": "hideaway-in-the-hills",
    "description": "Nestled in a secluded valley near the ancient Din Lligwy settlement, these luxury glamping pods offer a peaceful retreat. Each pod features a private hot tub and ensuite facilities. The site is a haven for wildlife and stargazing, with little light pollution.",
    "price": "From £100-£180",
    "sleeps": "2-6",
    "highlight": "Nestled in a secluded valley near the ancient Din Lligwy set...",
    "image": "/images/accommodation/quirky/hideaway-in-the-hills.jpg",
    "bookingUrl": "https://hideawayinthehills.co.uk",
    "features": [
      "Private hot tub",
      "Ensuite pods",
      "Secluded location",
      "Dark skies"
    ],
    "bestFor": "Couples, Stargazers, Relaxation seekers"
  },
  {
    "name": "The Outbuildings",
    "location": "Llangaffo",
    "slug": "the-outbuildings",
    "description": "Offers unique stays including a converted shepherd's hut and a granary, set within the grounds of a country house with views of Snowdonia. The accommodation combines rustic charm with modern luxury, featuring wood burners and outdoor seating areas. Famous for its excellent food.",
    "price": "From £110-£180",
    "sleeps": "2-6",
    "highlight": "Offers unique stays including a converted shepherd's hut and...",
    "image": "/images/accommodation/quirky/the-outbuildings.jpg",
    "bookingUrl": "https://theoutbuildings.co.uk",
    "features": [
      "Mountain views",
      "On-site dining",
      "Rural charm",
      "Tennis court"
    ],
    "bestFor": "Foodies, Couples, Cyclists"
  },
  {
    "name": "Cleifiog Uchaf",
    "location": "Valley",
    "slug": "cleifiog-uchaf",
    "description": "A 16th-century historic manor house offering a step back in time. The property is steeped in history with original features like inglenook fireplaces and stone walls, yet updated with modern amenities. It provides a grand and atmospheric setting for large groups or special occasions.",
    "price": "From £150-£300",
    "sleeps": "2-6",
    "highlight": "A 16th-century historic manor house offering a step back in ...",
    "image": "/images/accommodation/quirky/cleifiog-uchaf.jpg",
    "bookingUrl": "https://cleifioguchaf.co.uk",
    "features": [
      "Historic building",
      "Large grounds",
      "Traditional features",
      "Group accommodation"
    ],
    "bestFor": "History enthusiasts, Large groups, Family gatherings"
  },
  {
    "name": "Away From It All",
    "location": "Ceidio",
    "slug": "away-from-it-all",
    "description": "Three geodesic glamping domes set on a hillside farm with panoramic views of the Llyn Peninsula and Snowdonia. Each dome is named after a local mountain range and features a wood-burning stove and a private hot tub. It's a true off-grid experience with style.",
    "price": "From £110-£190",
    "sleeps": "2-6",
    "highlight": "Three geodesic glamping domes set on a hillside farm with pa...",
    "image": "/images/accommodation/quirky/away-from-it-all.jpg",
    "bookingUrl": "https://away-from-it-all.co.uk",
    "features": [
      "Geodesic domes",
      "Hot tub",
      "Mountain views",
      "Farm stay"
    ],
    "bestFor": "Couples, Glamping lovers, Views"
  },
  {
    "name": "Canvas & Campfires",
    "location": "Llanfrýg",
    "slug": "canvas-campfires",
    "description": "Luxury safari tents situated on a smallholding in a quiet corner of Anglesey. The site focuses on a back-to-nature experience with fire pits, outdoor cooking, and plenty of space. The tents are fully furnished with proper beds and kitchens.",
    "price": "From £100-£180",
    "sleeps": "2-6",
    "highlight": "Luxury safari tents situated on a smallholding in a quiet co...",
    "image": "/images/accommodation/quirky/canvas-campfires.jpg",
    "bookingUrl": "https://canvasandcampfires.co.uk",
    "features": [
      "Safari tents",
      "Fire pits",
      "Smallholding",
      "Quiet location"
    ],
    "bestFor": "Families, Nature lovers, Quiet escapes"
  },
  {
    "name": "The Bathing House",
    "location": "Llanfairpwll",
    "slug": "the-bathing-house",
    "description": "A unique, Grade II listed bathing house located right on the water's edge of the Menai Strait. Accessed via a private causeway (tide dependent), this property offers total seclusion and immersion in the marine environment. Watch the tides change from your living room.",
    "price": "From £150-£300",
    "sleeps": "2-6",
    "highlight": "A unique, Grade II listed bathing house located right on the...",
    "image": "/images/accommodation/quirky/the-bathing-house.jpg",
    "bookingUrl": "https://menaiholidays.co.uk",
    "features": [
      "Waterfront location",
      "Private causeway",
      "Historic building",
      "Secluded"
    ],
    "bestFor": "Couples, Writers, Marine enthusiasts"
  },
  {
    "name": "Blackthorn Farm",
    "location": "Trearddur Bay",
    "slug": "blackthorn-farm",
    "description": "Charming shepherd's huts located on a coastal farm overlooking majestic sea cliffs. The huts are cozy and well-equipped, offering a glamping alternative to the main B&B and campsite. The location is renowned for its sunsets and proximity to South Stack.",
    "price": "From £80-£140",
    "sleeps": "2-6",
    "highlight": "Charming shepherd's huts located on a coastal farm overlooki...",
    "image": "/images/accommodation/quirky/blackthorn-farm.jpg",
    "bookingUrl": "https://blackthornfarm.co.uk",
    "features": [
      "Shepherd's huts",
      "Sea views",
      "Farm setting",
      "Near beach"
    ],
    "bestFor": "Couples, Hikers, Climbers"
  },
  {
    "name": "Plas Cadnant Garden Cottages",
    "location": "Menai Bridge",
    "slug": "plas-cadnant-garden-cottages",
    "description": "Stay within the grounds of the historic Plas Cadnant Hidden Gardens. The cottages are restored outbuildings offering character and charm, surrounded by waterfalls, river walks, and beautifully manicured gardens. A peaceful haven close to the bridge.",
    "price": "From £120-£250",
    "sleeps": "2-6",
    "highlight": "Stay within the grounds of the historic Plas Cadnant Hidden ...",
    "image": "/images/accommodation/quirky/plas-cadnant-garden-cottages.jpg",
    "bookingUrl": "https://plascadnant.co.uk",
    "features": [
      "Historic gardens",
      "Waterfalls",
      "Character cottages",
      "River walks"
    ],
    "bestFor": "Garden lovers, Couples, Tranquility seekers"
  }
];

export default function QuirkyStaysAnglesey() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src="/images/journal/quirky-stays-anglesey-hero.jpg"
          alt="Quirky accommodation in Anglesey"
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
              13 Quirky Places to Stay in Anglesey
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              From lighthouse keeper cottages and French châteaux to Mongolian yurts and luxury glamping domes — Anglesey offers an incredible range of unique accommodation. Sleep where the keepers watched the waves, wake up in a castle, or stargaze from your geodome hot tub.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed">
            Anglesey isn't just about stunning coastline and historic sites (though they're spectacular). It's about finding places that capture the island's unique character — historic, wild, and welcoming. These are the most unusual, beautiful, and memorable places to stay on Ynys Môn.
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
            <h2>Why Choose Quirky Accommodation in Anglesey?</h2>
            <p>
              Anglesey deserves accommodation that matches its character. These unique stays aren't just places to sleep — they're part of your adventure, putting you right in the heart of the landscape and local culture.
            </p>
            
            <h3>Best Areas to Stay in Anglesey</h3>
            <ul>
              <li><strong>Menai Bridge:</strong> Château stays, rib rides, close to Snowdonia</li>
              <li><strong>Beaumaris:</strong> Castle town, coastal glamping, watersports</li>
              <li><strong>Holyhead/Holy Island:</strong> South Stack, Trearddur Bay, rugged coast</li>
              <li><strong>East Coast:</strong> Lligwy Beach, Moelfre, Red Wharf Bay</li>
              <li><strong>Central Anglesey:</strong> Windmills, rural charm, hub for exploring</li>
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
