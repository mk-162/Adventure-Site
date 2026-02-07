import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ExternalLink, Bed, Star, TreePine, Mountain } from "lucide-react";

// SEO metadata
export const metadata: Metadata = {
  title: "12 Quirky Places to Stay in Snowdonia (2026) | Treehouses, Glamping & Unique Stays",
  description: "Discover the most unique and unusual accommodation in Snowdonia - from luxury treehouses and safari tents to converted boats and off-grid cabins. Hand-picked quirky stays for adventure seekers.",
  keywords: "quirky accommodation Snowdonia, unique stays Snowdonia, treehouse Snowdonia, glamping Snowdonia, unusual places to stay Wales, best accommodation Snowdonia",
  openGraph: {
    title: "12 Quirky Places to Stay in Snowdonia",
    description: "Treehouses, glamping, converted boats and more - the most unique places to stay in Snowdonia National Park",
    type: "article",
    images: ["/images/journal/quirky-stays-snowdonia-hero.jpg"],
  },
};

// Accommodation data
const accommodations = [
  {
    name: "Living Room Treehouses",
    location: "Machynlleth",
    slug: "living-room-treehouses",
    description: "Six enchanting treehouses hidden deep in a Welsh valley, completely off-grid and suspended high in the canopy. Features wood-burning stoves, solar lighting, and stunning valley views. Perfect for a digital detox.",
    price: "From £140/night",
    sleeps: "2-4",
    highlight: "Completely off-grid treehouse experience",
    image: "/images/accommodation/quirky/living-room-treehouses.jpg",
    bookingUrl: "https://www.living-room.co",
    features: ["Off-grid", "Wood burner", "Hot tub option", "Private"],
    bestFor: "Couples seeking romance and adventure",
  },
  {
    name: "Portmeirion Village",
    location: "Minffordd",
    slug: "portmeirion",
    description: "Stay within the iconic Italianate village designed by Clough Williams-Ellis. Choose from rooms in the hotel, self-catering cottages, or the castle itself. Wander sub-tropical gardens and colourful piazzas.",
    price: "From £150/night",
    sleeps: "2-6",
    highlight: "Sleep in an architectural masterpiece",
    image: "/images/accommodation/quirky/portmeirion.jpg",
    bookingUrl: "https://portmeirion.wales/stay",
    features: ["Historic", "Spa", "Restaurants", "Gardens"],
    bestFor: "Architecture lovers and The Prisoner fans",
  },
  {
    name: "Forest Holidays Beddgelert",
    location: "Beddgelert",
    slug: "forest-holidays-beddgelert",
    description: "Luxurious log cabins nestled deep within Beddgelert Forest with private hot tubs and floor-to-ceiling windows. Wake up to red squirrels on your deck and fall asleep under the stars.",
    price: "From £180/night",
    sleeps: "2-8",
    highlight: "Hot tub under the stars in ancient forest",
    image: "/images/accommodation/quirky/forest-holidays-beddgelert.jpg",
    bookingUrl: "https://www.forestholidays.co.uk/locations/wales/beddgelert/",
    features: ["Hot tub", "Log burner", "Pet-friendly", "WiFi"],
    bestFor: "Families and groups wanting forest immersion",
  },
  {
    name: "Llechwedd Glamping",
    location: "Blaenau Ffestiniog",
    slug: "llechwedd-glamping",
    description: "Luxury safari tents perched on a hillside overlooking the historic Llechwedd Slate Caverns. Direct access to Zip World adventures and underground experiences. Industrial heritage meets glamping luxury.",
    price: "From £120/night",
    sleeps: "2-6",
    highlight: "Glamping above a working slate mine",
    image: "/images/accommodation/quirky/llechwedd-glamping.jpg",
    bookingUrl: "https://llechwedd.co.uk/glamping/",
    features: ["Safari tent", "Adventure access", "Mountain views", "Restaurant"],
    bestFor: "Thrill-seekers wanting Zip World on the doorstep",
  },
  {
    name: "Graig Wen",
    location: "Arthog, near Dolgellau",
    slug: "graig-wen",
    description: "Award-winning eco-site with panoramic views of the Mawddach Estuary. Choose between yurts, a shepherd's hut, and eco-cabins set within 45 acres of wild woodland. Camping with comfort.",
    price: "From £90/night",
    sleeps: "2-5",
    highlight: "Mawddach Estuary views from your yurt",
    image: "/images/accommodation/quirky/graig-wen.jpg",
    bookingUrl: "https://www.graigwen.co.uk/",
    features: ["Yurts", "Shepherd's hut", "Eco-friendly", "Estuary views"],
    bestFor: "Eco-conscious adventurers",
  },
  {
    name: "Smugglers Cove Boatyard",
    location: "Frongoch, Mawddach Estuary",
    slug: "smugglers-cove",
    description: "Stay in a converted boat or quirky boathouse right on the edge of the estuary. Wood burners, direct water access for kayaking, and sunsets that'll stop you in your tracks.",
    price: "From £100/night",
    sleeps: "2-4",
    highlight: "Sleep on a boat in a secret cove",
    image: "/images/accommodation/quirky/smugglers-cove.jpg",
    bookingUrl: "https://www.smugglerscove.info/",
    features: ["Converted boat", "Kayak access", "Wood burner", "Secluded"],
    bestFor: "Water lovers and romantics",
  },
  {
    name: "The Laundry at Breathing Space",
    location: "Llanberis",
    slug: "the-laundry-llanberis",
    description: "A beautifully converted historic laundry building with industrial chic design. Exposed brickwork, high ceilings, and a wood-burning stove. Minutes from Snowdon's summit paths.",
    price: "From £110/night",
    sleeps: "2",
    highlight: "Industrial chic at the foot of Snowdon",
    image: "/images/accommodation/quirky/the-laundry.jpg",
    bookingUrl: "https://www.airbnb.co.uk/rooms/plus/23499427",
    features: ["Converted building", "Wood burner", "Snowdon access", "Character"],
    bestFor: "Couples wanting Snowdon on the doorstep",
  },
  {
    name: "Cae Wennol Yurts",
    location: "Conwy Valley",
    slug: "cae-wennol-yurts",
    description: "Eco-friendly yurts in a secluded wildflower meadow with stunning Conwy Valley views. Compost toilets, solar showers, and a communal kitchen. Simple living done beautifully.",
    price: "From £85/night",
    sleeps: "2-5",
    highlight: "Wildflower meadow with valley views",
    image: "/images/accommodation/quirky/cae-wennol.jpg",
    bookingUrl: "https://www.caewennolyurts.co.uk/",
    features: ["Yurt", "Eco-friendly", "Meadow setting", "Valley views"],
    bestFor: "Budget-conscious nature lovers",
  },
  {
    name: "Plas Cadnant Hidden Gardens Cottages",
    location: "Menai Bridge (edge of Snowdonia)",
    slug: "plas-cadnant",
    description: "Historic cottages set within secret Victorian gardens being lovingly restored. Explore hidden valleys, waterfalls, and woodland walks right from your door.",
    price: "From £130/night",
    sleeps: "2-6",
    highlight: "Stay in a secret Victorian garden",
    image: "/images/accommodation/quirky/plas-cadnant.jpg",
    bookingUrl: "https://www.plascadnant.co.uk/",
    features: ["Historic", "Gardens", "Waterfalls", "Peaceful"],
    bestFor: "Garden lovers and history buffs",
  },
  {
    name: "Epic Retreats Shepherd's Huts",
    location: "Various Snowdonia locations",
    slug: "epic-retreats",
    description: "Pop-up luxury shepherd's huts in spectacular secret locations across Snowdonia. Each retreat is in a different jaw-dropping spot - book the location, not just the hut.",
    price: "From £160/night",
    sleeps: "2",
    highlight: "Secret locations revealed on booking",
    image: "/images/accommodation/quirky/epic-retreats.jpg",
    bookingUrl: "https://www.epicretreats.wales/",
    features: ["Shepherd's hut", "Secret locations", "Luxury", "Exclusive"],
    bestFor: "Adventurers who love surprises",
  },
];

export default function QuirkyStaysSnowdonia() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src="/images/journal/quirky-stays-snowdonia-hero.jpg"
          alt="Treehouse accommodation in Snowdonia with mountain views"
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
              12 Quirky Places to Stay in Snowdonia
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Forget boring hotels. From treehouses suspended in ancient woodland to converted boats on secret estuaries — these are the most extraordinary places to sleep in Wales's most dramatic national park.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed">
            Snowdonia isn't just about the mountains (though they're spectacular). It's about the places that make you feel like you've stepped into another world. We've hunted down the most unusual, beautiful, and downright magical places to stay — accommodation that's part of the adventure, not just a place to crash.
          </p>
          
          <div className="bg-slate-50 border-l-4 border-accent p-6 my-8 not-prose">
            <h3 className="font-bold text-lg mb-2">What makes our picks different?</h3>
            <ul className="space-y-2 text-slate-600">
              <li>✓ We've verified every listing is real and bookable</li>
              <li>✓ Hand-picked for uniqueness, not just luxury</li>
              <li>✓ Adventure-focused — great bases for exploring</li>
              <li>✓ Mix of budgets from £85 to £180/night</li>
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
            <h2>Why Choose Quirky Accommodation in Snowdonia?</h2>
            <p>
              Standard hotels have their place, but Snowdonia deserves something special. When you're surrounded by 3,000-foot peaks, ancient oak forests, and crystal-clear lakes, why sleep somewhere ordinary?
            </p>
            <p>
              The best accommodation in Snowdonia puts you in the landscape, not just near it. Wake up in a treehouse as dawn light hits Cadair Idris. Fall asleep in a converted boat listening to the tide on the Mawddach. Watch stars from your hot tub after a day conquering Snowdon.
            </p>
            
            <h3>Best Areas to Stay in Snowdonia</h3>
            <ul>
              <li><strong>Beddgelert:</strong> Perfect base for Snowdon, beautiful village, forest lodges nearby</li>
              <li><strong>Blaenau Ffestiniog:</strong> Zip World adventures, industrial heritage, slate cavern glamping</li>
              <li><strong>Dolgellau:</strong> Mawddach Estuary, Cader Idris access, quieter than the north</li>
              <li><strong>Betws-y-Coed:</strong> Classic base, waterfalls, good transport links</li>
              <li><strong>Llanberis:</strong> Snowdon's doorstep, mountain railway, climber's hub</li>
            </ul>
            
            <h3>Booking Tips</h3>
            <ul>
              <li><strong>Book early:</strong> Quirky stays book up months ahead, especially weekends</li>
              <li><strong>Midweek deals:</strong> Many offer significant discounts Sunday-Thursday</li>
              <li><strong>Minimum stays:</strong> Expect 2-3 night minimums, especially in peak season</li>
              <li><strong>Check access:</strong> Some remote stays require 4x4 or walking — part of the charm</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Plan Your Snowdonia Adventure</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/destinations/snowdonia" className="group">
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <Image
                src="/images/regions/snowdonia-hero.jpg"
                alt="Snowdonia National Park"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold group-hover:text-accent transition-colors">
              Explore Snowdonia →
            </h3>
            <p className="text-sm text-slate-500">Activities, guides and local tips</p>
          </Link>
          
          <Link href="/hiking" className="group">
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <Image
                src="/images/activities/hiking-hero.jpg"
                alt="Hiking in Snowdonia"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold group-hover:text-accent transition-colors">
              Best Hikes in Snowdonia →
            </h3>
            <p className="text-sm text-slate-500">From Snowdon to hidden gems</p>
          </Link>
          
          <Link href="/journal/quirky-stays-pembrokeshire" className="group">
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <Image
                src="/images/regions/pembrokeshire-hero.jpg"
                alt="Pembrokeshire Coast"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold group-hover:text-accent transition-colors">
              Quirky Stays: Pembrokeshire →
            </h3>
            <p className="text-sm text-slate-500">Coastal cabins and clifftop glamping</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
