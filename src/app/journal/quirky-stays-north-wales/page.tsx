import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ExternalLink, Bed } from "lucide-react";

// SEO metadata
export const metadata: Metadata = {
  title: "15 Quirky Places to Stay in North Wales (2026) | Best Unique Accommodation & Stays",
  description: "From safari lodges at Zip World to Portmeirion's Italianate village, French châteaux on the Menai Strait to luxury treehouses — North Wales offers some of ",
  keywords: "quirky accommodation North Wales, unique stays North Wales, glamping North Wales, unusual places to stay North Wales, best places to stay North Wales",
  openGraph: {
    title: "15 Quirky Places to Stay in North Wales",
    description: "From safari lodges at Zip World to Portmeirion's Italianate village, French châteaux on the Menai Strait to luxury treehouses — North Wales offers some of the most unique and adventurous accommodation",
    type: "article",
    images: ["/images/journal/quirky-stays-north-wales-hero.jpg"],
  },
};

// Accommodation data
const accommodations = [
  {
    "name": "Llechwedd Glamping",
    "location": "Blaenau Ffestiniog",
    "slug": "llechwedd-glamping",
    "description": "Perched on a rugged hillside overlooking the historic Llechwedd Slate Caverns, these luxurious safari lodges offer a unique blend of industrial heritage and comfort. Wake up to panoramic views of the slate landscape and enjoy direct access to some of North Wales' most thrilling adventures.",
    "price": "From £££",
    "sleeps": "2-6",
    "highlight": "Perched on a rugged hillside overlooking the historic Llechw...",
    "image": "/images/accommodation/quirky/llechwedd-glamping.jpg",
    "bookingUrl": "https://llechwedd.co.uk/stay",
    "features": [
      "Wood-burning stove",
      "Private deck with views",
      "Luxury bedding",
      "En-suite facilities"
    ],
    "bestFor": "Families, Couples, Adventure seekers"
  },
  {
    "name": "Portmeirion Village",
    "location": "Minffordd, Penrhyndeudraeth",
    "slug": "portmeirion-village",
    "description": "Stay in the heart of the iconic Italianate village designed by Clough Williams-Ellis. Choose from rooms in the main hotel, the Castell Deudraeth, or one of the whimsical self-catering cottages scattered throughout the village. A truly surreal and beautiful experience.",
    "price": "From ££££",
    "sleeps": "2-6",
    "highlight": "Stay in the heart of the iconic Italianate village designed ...",
    "image": "/images/accommodation/quirky/portmeirion-village.jpg",
    "bookingUrl": "https://portmeirion.wales/stay",
    "features": [
      "Access to village gardens",
      "Unique architecture",
      "Fine dining restaurants",
      "Estuary views"
    ],
    "bestFor": "Couples, Architecture lovers, Luxury seekers"
  },
  {
    "name": "Chateau Rhianfa",
    "location": "Menai Bridge, Anglesey",
    "slug": "chateau-rhianfa",
    "description": "A fairytale French-style château overlooking the Menai Strait. Built in 1849, this Grade II listed building features turrets, spires, and elegant interiors. It offers a luxurious and romantic escape with stunning views of Snowdonia.",
    "price": "From ££££",
    "sleeps": "2-6",
    "highlight": "A fairytale French-style château overlooking the Menai Strai...",
    "image": "/images/accommodation/quirky/chateau-rhianfa.jpg",
    "bookingUrl": "https://chateaurhianfa.com",
    "features": [
      "French château architecture",
      "Views of Menai Strait",
      "Luxury rooms",
      "Fine dining"
    ],
    "bestFor": "Couples, Romantic getaways, Luxury seekers"
  },
  {
    "name": "The Windmill",
    "location": "Llangefni, Anglesey",
    "slug": "the-windmill",
    "description": "A beautifully restored 18th-century windmill offering unique self-catering accommodation. The circular rooms and top-floor living area provide 360-degree views of the island. A distinctive landmark transformed into a comfortable holiday home.",
    "price": "From £££",
    "sleeps": "2-6",
    "highlight": "A beautifully restored 18th-century windmill offering unique...",
    "image": "/images/accommodation/quirky/the-windmill.jpg",
    "bookingUrl": "https://www.thewindmillanglesey.co.uk",
    "features": [
      "360-degree views",
      "Circular rooms",
      "Historic building",
      "Modern interior"
    ],
    "bestFor": "Families, Groups, Unique stays"
  },
  {
    "name": "Crashpad Lodges at Yr Helfa",
    "location": "Llanberis / Snowdon",
    "slug": "crashpad-lodges-at-yr-helfa",
    "description": "An off-grid mountain lodge located halfway up Snowdon, accessible only by foot or 4x4. Offers a truly remote and immersive mountain experience. Powered by renewable energy, it's a sustainable retreat in the heart of the national park.",
    "price": "From £££",
    "sleeps": "2-6",
    "highlight": "An off-grid mountain lodge located halfway up Snowdon, acces...",
    "image": "/images/accommodation/quirky/crashpad-lodges-at-yr-helfa.jpg",
    "bookingUrl": "https://www.yrhelfa.co.uk",
    "features": [
      "Off-grid location",
      "Mountain views",
      "Wood-burning stove",
      "Sustainable design"
    ],
    "bestFor": "Hikers, Climbers, Eco-conscious travellers"
  },
  {
    "name": "Living Room Treehouses",
    "location": "Machynlleth",
    "slug": "living-room-treehouses",
    "description": "Six enchanting treehouses hidden deep in a Welsh valley. These sustainable structures are built high into the canopy, offering a magical and secluded escape. With wood-burning stoves and spring water showers, it's a back-to-nature experience with a touch of luxury.",
    "price": "From £££",
    "sleeps": "2-6",
    "highlight": "Six enchanting treehouses hidden deep in a Welsh valley. The...",
    "image": "/images/accommodation/quirky/living-room-treehouses.jpg",
    "bookingUrl": "https://www.living-room.co",
    "features": [
      "Treehouse accommodation",
      "Wood-burning stove",
      "Secluded woodland setting",
      "Sustainable design"
    ],
    "bestFor": "Couples, Nature lovers, Escapism"
  },
  {
    "name": "Wonderland House",
    "location": "Penmaenmawr",
    "slug": "wonderland-house",
    "description": "An Alice in Wonderland themed holiday home featuring whimsical decor, chequerboard floors, and tea party settings. A playful and eccentric property that brings the classic story to life, offering magnificent sea views.",
    "price": "From £££",
    "sleeps": "2-6",
    "highlight": "An Alice in Wonderland themed holiday home featuring whimsic...",
    "image": "/images/accommodation/quirky/wonderland-house.jpg",
    "bookingUrl": "https://wonderlandhouse.co.uk",
    "features": [
      "Themed decor",
      "Sea views",
      "Large group accommodation",
      "Whimsical design"
    ],
    "bestFor": "Groups, Families, Themed parties"
  },
  {
    "name": "The Laundry Retreat",
    "location": "Denbigh",
    "slug": "the-laundry-retreat",
    "description": "Luxury eco-roundhouses set within a walled garden near Denbigh. These timber-framed structures offer a blend of rustic charm and modern comfort, with stunning views of the Clwydian Range. A peaceful and adult-only sanctuary.",
    "price": "From £££",
    "sleeps": "2-6",
    "highlight": "Luxury eco-roundhouses set within a walled garden near Denbi...",
    "image": "/images/accommodation/quirky/the-laundry-retreat.jpg",
    "bookingUrl": "https://thelaundryretreat.co.uk",
    "features": [
      "Roundhouse design",
      "Walled garden setting",
      "Luxury interiors",
      "Views of Clwydian Range"
    ],
    "bestFor": "Couples, Quiet retreats, Luxury glamping"
  },
  {
    "name": "Slate Mountain Glamping",
    "location": "Blaenau Ffestiniog",
    "slug": "slate-mountain-glamping",
    "description": "Glamping pods situated on a steep hillside at Llechwedd, offering dramatic views over the slate quarry and the Moelwynion mountains. A comfortable and convenient base for exploring the industrial heritage and adventure activities of the area.",
    "price": "From ££",
    "sleeps": "2-6",
    "highlight": "Glamping pods situated on a steep hillside at Llechwedd, off...",
    "image": "/images/accommodation/quirky/slate-mountain-glamping.jpg",
    "bookingUrl": "https://slatemountain.co.uk/glamping",
    "features": [
      "Hillside location",
      "Quarry views",
      "En-suite facilities",
      "Comfortable pods"
    ],
    "bestFor": "Couples, Small families, Adventure seekers"
  },
  {
    "name": "Gwyrfai Valley Railway Carriage",
    "location": "Dinas, Caernarfon",
    "slug": "gwyrfai-valley-railway-carriage",
    "description": "A thoughtfully converted railway carriage located near the Welsh Highland Railway. Offers a nostalgic and cozy stay with original features and modern amenities. Situated in a peaceful valley setting.",
    "price": "From ££",
    "sleeps": "2-6",
    "highlight": "A thoughtfully converted railway carriage located near the W...",
    "image": "/images/accommodation/quirky/gwyrfai-valley-railway-carriage.jpg",
    "bookingUrl": "https://www.quirkyaccom.com/gwyrfai-valley-railway-carriage",
    "features": [
      "Converted carriage",
      "Original features",
      "Valley setting",
      "Near heritage railway"
    ],
    "bestFor": "Couples, Train enthusiasts, Nostalgia seekers"
  },
  {
    "name": "The Old Rectory",
    "location": "Conwy",
    "slug": "the-old-rectory",
    "description": "A National Trust holiday cottage located directly on the Conwy estuary, famously known as the house 'with the best view in Wales' looking towards Conwy Castle. A historic and atmospheric property with a unique waterside setting.",
    "price": "From £££",
    "sleeps": "2-6",
    "highlight": "A National Trust holiday cottage located directly on the Con...",
    "image": "/images/accommodation/quirky/the-old-rectory.jpg",
    "bookingUrl": "https://www.nationaltrust.org.uk/holidays/the-old-rectory-conwy",
    "features": [
      "Estuary views",
      "Historic building",
      "National Trust property",
      "Unique location"
    ],
    "bestFor": "History buffs, Families, View seekers"
  },
  {
    "name": "Quarryman's Cottage",
    "location": "Llanberis",
    "slug": "quarryman-s-cottage",
    "description": "Stay in a traditional slate worker's cottage in the heart of Llanberis. These cottages offer a glimpse into the past with thick stone walls and cozy fireplaces, while providing a comfortable base for modern adventures.",
    "price": "From ££",
    "sleeps": "2-6",
    "highlight": "Stay in a traditional slate worker's cottage in the heart of...",
    "image": "/images/accommodation/quirky/quarryman-s-cottage.jpg",
    "bookingUrl": "https://www.nationaltrust.org.uk/holidays",
    "features": [
      "Traditional architecture",
      "Slate construction",
      "Village location",
      "Wood burner"
    ],
    "bestFor": "Hikers, History enthusiasts, Couples"
  },
  {
    "name": "Aberdaron Shepherd's Huts",
    "location": "Aberdaron, Llŷn Peninsula",
    "slug": "aberdaron-shepherd-s-huts",
    "description": "Charming shepherd's huts located on the tip of the Llŷn Peninsula. These cozy retreats offer a simple and peaceful escape with stunning coastal views. Perfect for stargazing and enjoying the remote beauty of the area.",
    "price": "From ££",
    "sleeps": "2-6",
    "highlight": "Charming shepherd's huts located on the tip of the Llŷn Peni...",
    "image": "/images/accommodation/quirky/aberdaron-shepherd-s-huts.jpg",
    "bookingUrl": "https://aberdaronshepherdshuts.co.uk",
    "features": [
      "Shepherd's hut style",
      "Coastal location",
      "Sea views",
      "Peaceful setting"
    ],
    "bestFor": "Couples, Solo travellers, Coastal walkers"
  },
  {
    "name": "Little Dragon",
    "location": "Waunfawr",
    "slug": "little-dragon",
    "description": "Unique, dragon-inspired glamping pods offering a fun and comfortable stay. Located near Caernarfon, these pods are well-equipped and provide a great base for families and couples exploring North Wales.",
    "price": "From ££",
    "sleeps": "2-6",
    "highlight": "Unique, dragon-inspired glamping pods offering a fun and com...",
    "image": "/images/accommodation/quirky/little-dragon.jpg",
    "bookingUrl": "https://www.littledragon.wales",
    "features": [
      "Unique design",
      "Comfortable interior",
      "Rural setting",
      "Family friendly"
    ],
    "bestFor": "Families, Couples, Fun seekers"
  },
  {
    "name": "Plas y Brenin",
    "location": "Capel Curig",
    "slug": "plas-y-brenin",
    "description": "Stay at the National Outdoor Centre for a truly immersive adventure experience. Accommodation ranges from en-suite rooms to bunkhouses, all set within a historic building with stunning views of the Snowdon Horseshoe. Rub shoulders with world-class instructors and fellow adventurers.",
    "price": "From ££",
    "sleeps": "2-6",
    "highlight": "Stay at the National Outdoor Centre for a truly immersive ad...",
    "image": "/images/accommodation/quirky/plas-y-brenin.jpg",
    "bookingUrl": "https://pyb.co.uk",
    "features": [
      "Historic centre",
      "Mountain views",
      "On-site bar & meals",
      "Gear drying rooms"
    ],
    "bestFor": "Solo adventurers, Groups, Course participants"
  }
];

export default function QuirkyStaysNorthWales() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src="/images/journal/quirky-stays-north-wales-hero.jpg"
          alt="Quirky accommodation in North Wales"
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
              15 Quirky Places to Stay in North Wales
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              From safari lodges at Zip World to Portmeirion's Italianate village, French châteaux on the Menai Strait to luxury treehouses — North Wales offers some of the most unique and adventurous accommodation in the UK.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed">
            North Wales is adventure central, with Snowdonia, Anglesey, and the coast all within easy reach. These unique stays range from historic windmills and railway carriages to off-grid mountain lodges and Alice in Wonderland themed houses. Adventure seekers, you're home.
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
            <h2>Why Choose Quirky Accommodation in North Wales?</h2>
            <p>
              North Wales deserves accommodation that matches its character. These unique stays aren't just places to sleep — they're part of your adventure, putting you right in the heart of the landscape and local culture.
            </p>
            
            <h3>Best Areas to Stay in North Wales</h3>
            <ul>
              <li><strong>Llanberis:</strong> Snowdon's doorstep, slate cottages, mountain access</li>
              <li><strong>Blaenau Ffestiniog:</strong> Zip World on-site, slate mine glamping</li>
              <li><strong>Portmeirion:</strong> Italianate village, castle stays, estuary views</li>
              <li><strong>Betws-y-Coed:</strong> Central Snowdonia, waterfalls, outdoor hub</li>
              <li><strong>Conwy:</strong> Castle views, estuary cottages, coastal access</li>
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
