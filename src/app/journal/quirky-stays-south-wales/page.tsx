import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ExternalLink, Bed } from "lucide-react";

// SEO metadata
export const metadata: Metadata = {
  title: "11 Quirky Places to Stay in South Wales (2026) | Best Unique Accommodation & Stays",
  description: "From forest glamping at mountain bike hubs to historic castles and converted lighthouses — South Wales offers unique stays that connect you to its industri",
  keywords: "quirky accommodation South Wales, unique stays South Wales, glamping South Wales, unusual places to stay South Wales, best places to stay South Wales",
  openGraph: {
    title: "11 Quirky Places to Stay in South Wales",
    description: "From forest glamping at mountain bike hubs to historic castles and converted lighthouses — South Wales offers unique stays that connect you to its industrial heritage and natural beauty.",
    type: "article",
    images: ["/images/journal/quirky-stays-south-wales-hero.jpg"],
  },
};

// Accommodation data
const accommodations = [
  {
    "name": "Cwmcarn Forest Glamping",
    "location": "Cwmcarn, Newport",
    "slug": "cwmcarn-forest-glamping",
    "description": "Nestled within the Cwmcarn Forest, these glamping pods and luxury lodges offer a serene escape surrounded by woodland. The site is a haven for mountain bikers and walkers, with trails starting right from the door.",
    "price": "From £50-£120 per night",
    "sleeps": "2-6",
    "highlight": "Nestled within the Cwmcarn Forest, these glamping pods and l...",
    "image": "/images/accommodation/quirky/cwmcarn-forest-glamping.jpg",
    "bookingUrl": "https://www.cwmcarnforest.co.uk",
    "features": [
      "Glamping Pods",
      "Luxury Lodges",
      "Forest Setting",
      "Bike Wash"
    ],
    "bestFor": "Mountain Bikers, Couples, Families"
  },
  {
    "name": "Rock UK Summit Centre",
    "location": "Trelewis, Merthyr Tydfil",
    "slug": "rock-uk-summit-centre",
    "description": "Situated on the site of the former Trelewis drift mine, this centre offers bunkhouse accommodation alongside extensive climbing and activity facilities. It provides a unique blend of industrial heritage and modern adventure.",
    "price": "From £25-£60 per person",
    "sleeps": "2-6",
    "highlight": "Situated on the site of the former Trelewis drift mine, this...",
    "image": "/images/accommodation/quirky/rock-uk-summit-centre.jpg",
    "bookingUrl": "https://rockuk.org/centres/summit-centre/",
    "features": [
      "Climbing Walls",
      "Man-made Caving",
      "Bunkhouse",
      "Cafe"
    ],
    "bestFor": "Groups, Schools, Climbers, Cyclists"
  },
  {
    "name": "Craig y Nos Castle",
    "location": "Pen-y-cae, Upper Swansea Valley",
    "slug": "craig-y-nos-castle",
    "description": "This historic castle in the Brecon Beacons was once the home of opera singer Adelina Patti. It offers a dramatic stay with ghost tours, a theatre, and stunning grounds in the Upper Swansea Valley.",
    "price": "From £80-£180 per night",
    "sleeps": "2-6",
    "highlight": "This historic castle in the Brecon Beacons was once the home...",
    "image": "/images/accommodation/quirky/craig-y-nos-castle.jpg",
    "bookingUrl": "https://www.craigynoscastle.com",
    "features": [
      "Historic Castle",
      "Opera House",
      "Ghost Tours",
      "Dog Friendly"
    ],
    "bestFor": "Couples, History Buffs, Dog Owners"
  },
  {
    "name": "Llechwen Hall Hotel",
    "location": "Llanfabon, Pontypridd",
    "slug": "llechwen-hall-hotel",
    "description": "Perched on a hilltop overlooking the valleys, this charming country house hotel offers panoramic views and a peaceful retreat. The building, a former schoolhouse, retains its historic character while providing modern comforts.",
    "price": "From £70-£150 per night",
    "sleeps": "2-6",
    "highlight": "Perched on a hilltop overlooking the valleys, this charming ...",
    "image": "/images/accommodation/quirky/llechwen-hall-hotel.jpg",
    "bookingUrl": "https://www.llechwen.co.uk",
    "features": [
      "Panoramic Views",
      "Restaurant",
      "Terrace",
      "Events Venue"
    ],
    "bestFor": "Couples, Relaxed Travelers, Foodies"
  },
  {
    "name": "Heritage Park Hotel",
    "location": "Trehafod, Rhondda",
    "slug": "heritage-park-hotel",
    "description": "Located adjacent to the Rhondda Heritage Park, this modern hotel is steeped in the industrial history of the valleys. It serves as an excellent base for exploring the local mining heritage and the surrounding hills.",
    "price": "From £60-£120 per night",
    "sleeps": "2-6",
    "highlight": "Located adjacent to the Rhondda Heritage Park, this modern h...",
    "image": "/images/accommodation/quirky/heritage-park-hotel.jpg",
    "bookingUrl": "https://www.heritageparkhotel.co.uk",
    "features": [
      "Restaurant",
      "Gym",
      "Bar",
      "Modern Rooms"
    ],
    "bestFor": "Families, History Enthusiasts, Business Travelers"
  },
  {
    "name": "West Usk Lighthouse",
    "location": "St Brides, Newport",
    "slug": "west-usk-lighthouse",
    "description": "A truly unique bed and breakfast located in a converted lighthouse overlooking the Usk estuary. Guests can enjoy circular rooms, a rooftop hot tub, and sweeping views across the Bristol Channel.",
    "price": "From £120-£200 per night",
    "sleeps": "2-6",
    "highlight": "A truly unique bed and breakfast located in a converted ligh...",
    "image": "/images/accommodation/quirky/west-usk-lighthouse.jpg",
    "bookingUrl": "https://www.westusklighthouse.co.uk",
    "features": [
      "Lighthouse Stay",
      "Rooftop Hot Tub",
      "Sea Views",
      "Circular Rooms"
    ],
    "bestFor": "Couples, Romantic Getaways, Architecture Lovers"
  },
  {
    "name": "Llanthony Priory Hotel",
    "location": "Llanthony, Black Mountains",
    "slug": "llanthony-priory-hotel",
    "description": "Set within the ruined walls of a 12th-century Augustinian priory, this hotel offers an atmospheric and secluded stay in the Black Mountains. It is a favorite among hikers and those seeking a digital detox.",
    "price": "From £80-£140 per night",
    "sleeps": "2-6",
    "highlight": "Set within the ruined walls of a 12th-century Augustinian pr...",
    "image": "/images/accommodation/quirky/llanthony-priory-hotel.jpg",
    "bookingUrl": "https://www.llanthonypriory.co.uk",
    "features": [
      "Historic Ruins",
      "Remote Location",
      "Bar",
      "Traditional Food"
    ],
    "bestFor": "Hikers, History Buffs, Escapists"
  },
  {
    "name": "Dare Valley Country Park Accommodation",
    "location": "Aberdare",
    "slug": "dare-valley-country-park-accommodation",
    "description": "Situated in a country park reclaimed from a former colliery, this accommodation offers hotel rooms and camping options. The park is a designated Dark Sky Discovery Site and features lakes and trails.",
    "price": "From £40-£100 per night",
    "sleeps": "2-6",
    "highlight": "Situated in a country park reclaimed from a former colliery,...",
    "image": "/images/accommodation/quirky/dare-valley-country-park-accommodation.jpg",
    "bookingUrl": "https://www.darevalleycountrypark.co.uk",
    "features": [
      "Dark Sky Discovery Site",
      "Lakes",
      "Cafe",
      "Bike Hire"
    ],
    "bestFor": "Families, Cyclists, Nature Lovers"
  },
  {
    "name": "Afan Lodge",
    "location": "Afan Valley",
    "slug": "afan-lodge",
    "description": "This Swiss-style alpine lodge in the heart of the Afan Valley is designed specifically for outdoor enthusiasts. With stunning views and bike-friendly facilities, it's a perfect base for tackling the local trails.",
    "price": "From £70-£130 per night",
    "sleeps": "2-6",
    "highlight": "This Swiss-style alpine lodge in the heart of the Afan Valle...",
    "image": "/images/accommodation/quirky/afan-lodge.jpg",
    "bookingUrl": "https://www.afanlodge.co.uk",
    "features": [
      "Bike Storage",
      "Drying Room",
      "Restaurant",
      "Valley Views"
    ],
    "bestFor": "Mountain Bikers, Hikers, Groups"
  },
  {
    "name": "Bryn Bettws Lodge",
    "location": "Afan Forest",
    "slug": "bryn-bettws-lodge",
    "description": "Located high in the Afan Forest, this lodge offers log cabins and group accommodation directly on the mountain bike trails. It provides a rustic and immersive woodland experience.",
    "price": "From £60-£150 per night",
    "sleeps": "2-6",
    "highlight": "Located high in the Afan Forest, this lodge offers log cabin...",
    "image": "/images/accommodation/quirky/bryn-bettws-lodge.jpg",
    "bookingUrl": "https://www.brynbettws.com",
    "features": [
      "Log Cabins",
      "Bike Park On-site",
      "Group Accommodation",
      "Woodland Setting"
    ],
    "bestFor": "Mountain Bikers, Groups, Schools"
  },
  {
    "name": "Clyngwyn Bunkhouse",
    "location": "Pontneddfechan",
    "slug": "clyngwyn-bunkhouse",
    "description": "A converted farm bunkhouse and shepherd's hut located in the heart of Waterfall Country. It offers a simple, communal base for exploring the famous Four Falls Trail and surrounding gorges.",
    "price": "From £20-£50 per person",
    "sleeps": "2-6",
    "highlight": "A converted farm bunkhouse and shepherd's hut located in the...",
    "image": "/images/accommodation/quirky/clyngwyn-bunkhouse.jpg",
    "bookingUrl": "https://www.bunkhouse-south-wales.co.uk",
    "features": [
      "Near Waterfalls",
      "Fire Pit",
      "Farm Setting",
      "Cafe On-site"
    ],
    "bestFor": "Hikers, Groups, Canyoning Enthusiasts"
  }
];

export default function QuirkyStaysSouthWales() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src="/images/journal/quirky-stays-south-wales-hero.jpg"
          alt="Quirky accommodation in South Wales"
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
              11 Quirky Places to Stay in South Wales
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              From forest glamping at mountain bike hubs to historic castles and converted lighthouses — South Wales offers unique stays that connect you to its industrial heritage and natural beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed">
            South Wales combines mountain biking meccas, dramatic valleys, and industrial heritage with stunning natural beauty. These quirky stays range from lighthouses and castles to forest pods right on the trails — perfect for adventurers and history buffs alike.
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
            <h2>Why Choose Quirky Accommodation in South Wales?</h2>
            <p>
              South Wales deserves accommodation that matches its character. These unique stays aren't just places to sleep — they're part of your adventure, putting you right in the heart of the landscape and local culture.
            </p>
            
            <h3>Best Areas to Stay in South Wales</h3>
            <ul>
              <li><strong>Cwmcarn:</strong> Forest glamping, world-class MTB trails</li>
              <li><strong>Afan Valley:</strong> Alpine lodges, bike park heaven</li>
              <li><strong>Pontneddfechan:</strong> Waterfall Country, gorge walking</li>
              <li><strong>Black Mountains:</strong> Priory stays, Offa's Dyke, remote escapes</li>
              <li><strong>Newport/St Brides:</strong> Lighthouse stays, coastal walks, wetlands</li>
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
