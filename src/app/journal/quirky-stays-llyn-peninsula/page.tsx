import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ExternalLink, Bed } from "lucide-react";

// SEO metadata
export const metadata: Metadata = {
  title: "14 Quirky Places to Stay in Llŷn Peninsula (2026) | Best Unique Accommodation & Stays",
  description: "From beach-accessible campsites and shepherd huts to the famous Ty Coch Inn and luxury glamping domes — the Llŷn Peninsula offers wild, remote and beautifu",
  keywords: "quirky accommodation Llŷn Peninsula, unique stays Llŷn Peninsula, glamping Llŷn Peninsula, unusual places to stay Llŷn Peninsula, best places to stay Llŷn Peninsula",
  openGraph: {
    title: "14 Quirky Places to Stay in Llŷn Peninsula",
    description: "From beach-accessible campsites and shepherd huts to the famous Ty Coch Inn and luxury glamping domes — the Llŷn Peninsula offers wild, remote and beautiful places to stay at the very edge of Wales.",
    type: "article",
    images: ["/images/journal/quirky-stays-llyn-peninsula-hero.jpg"],
  },
};

// Accommodation data
const accommodations = [
  {
    "name": "Ty Coch Inn",
    "location": "Porthdinllaen, Morfa Nefyn",
    "slug": "ty-coch-inn",
    "description": "This traditional pub and B&B offers a comfortable basecamp for exploring the waters and coast of the Llŷn Peninsula. Expect a relaxed, friendly atmosphere, hearty meals, and a welcome pint after a day of adventure. It's a great spot to swap stories with other travelers and locals alike.",
    "price": "From £80-£150",
    "sleeps": "2-6",
    "highlight": "Iconic pub located directly on the beach, accessible only by foot or via the golf course. Known for its stunning location and lively atmosphere.",
    "image": "/images/regions/mid-wales-hero.jpg",
    "bookingUrl": "https://www.tycoch.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Porth Iago Camping (Tyddyn Mawr)",
    "location": "Rhoshirwaun, near Aberdaron",
    "slug": "porth-iago-camping-tyddyn-mawr",
    "description": "Famous campsite just above Porth Iago beach. Very unique location offering direct access to a sheltered cove perfect for swimming and sunsets.",
    "price": "From £20-£30",
    "sleeps": "2-6",
    "highlight": "A simple campsite located directly above the stunning Porth Iago cove, offering incredible sunset views and direct beach access.",
    "image": "/images/regions/mid-wales-hero.jpg",
    "bookingUrl": "https://www.porthiago.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Bert's Kitchen Garden",
    "location": "Trefor",
    "slug": "bert-s-kitchen-garden",
    "description": "A unique eco-campsite nestled in a kitchen garden. Offers a peaceful retreat with a focus on sustainable living and nature connection.",
    "price": "From £25-£50",
    "sleeps": "2-6",
    "highlight": "Eco-friendly campsite set in a kitchen garden with a strong focus on sustainability, foraging, and connecting with nature.",
    "image": "/images/regions/mid-wales-hero.jpg",
    "bookingUrl": "https://bertskg.com",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Away From It All",
    "location": "Ceidio, Pwllheli",
    "slug": "away-from-it-all",
    "description": "Luxury glamping domes on a working farm on the Llŷn Peninsula. Enjoy panoramic views of the mountains and coast with hot tubs available.",
    "price": "From £90-£150",
    "sleeps": "2-6",
    "highlight": "Luxury geodesic glamping domes situated on a working farm with panoramic views of the Llŷn Peninsula and Snowdonia mountains.",
    "image": "/images/regions/mid-wales-hero.jpg",
    "bookingUrl": "https://www.away-from-it-all.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Brook Cottage Shepherd Huts",
    "location": "Pwllheli",
    "slug": "brook-cottage-shepherd-huts",
    "description": "Luxury shepherd huts in a tranquil setting. Perfect for couples looking for a romantic escape with high-end amenities.",
    "price": "From £100-£180",
    "sleeps": "2-6",
    "highlight": "Hand-crafted luxury shepherd huts set in a tranquil wildflower meadow, offering a romantic and secluded getaway.",
    "image": "/images/regions/mid-wales-hero.jpg",
    "bookingUrl": "https://www.brookcottageshepherdhuts.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Whistling Sands Campsite",
    "location": "Porthor (Whistling Sands)",
    "slug": "whistling-sands-campsite",
    "description": "Pitch your tent on the stunning Llŷn Peninsula near Porthor beach. A no-frills campsite that's all about location and direct access to the coast.",
    "price": "From £15-£30",
    "sleeps": "2-6",
    "highlight": "Located near the famous 'Whistling Sands' beach (Porthor), managed by the National Trust, offering a back-to-nature experience.",
    "image": "/images/regions/mid-wales-hero.jpg",
    "bookingUrl": "https://www.nationaltrust.org.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Aberdaron YHA",
    "location": "Aberdaron",
    "slug": "aberdaron-yha",
    "description": "This Llŷn Peninsula hostel is a no-frills basecamp for exploring the rugged coastline. Expect a social atmosphere and easy access to the beach and coastal path.",
    "price": "From £25-£60",
    "sleeps": "2-6",
    "highlight": "Situated at the very tip of the Llŷn Peninsula, overlooking the bay and close to the departure point for Bardsey Island.",
    "image": "/images/regions/mid-wales-hero.jpg",
    "bookingUrl": "https://www.yha.org.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "West Wales Windsurf",
    "location": "Glan y Don, Abersoch",
    "slug": "west-wales-windsurf",
    "description": "This no-frills campsite is all about maximizing your time in the water. Expect a laid-back vibe where wetsuits and sandy feet are the norm.",
    "price": "From £15-£30",
    "sleeps": "2-6",
    "highlight": "A specialist watersports campsite tailored for windsurfers and surfers, located close to prime spots like Hell's Mouth.",
    "image": "/images/regions/mid-wales-hero.jpg",
    "bookingUrl": "https://www.westwaleswindsurf.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Aberafon Camping",
    "location": "Gyrn Goch",
    "slug": "aberafon-camping",
    "description": "Beachfront site with private beach access. Ideal for families and couples looking for a quiet seaside retreat.",
    "price": "From £15-£30",
    "sleeps": "2-6",
    "highlight": "A unique coastal campsite with its own private beach access, offering stunning sea views and a peaceful atmosphere.",
    "image": "/images/regions/mid-wales-hero.jpg",
    "bookingUrl": "https://www.aberafon.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Castell Deudraeth",
    "location": "Minffordd (near Portmeirion)",
    "slug": "castell-deudraeth",
    "description": "Stay in a unique Victorian mansion just outside the famous Portmeirion village. Combines historic charm with modern luxury.",
    "price": "From £150-£300",
    "sleeps": "2-6",
    "highlight": "A Victorian castellated mansion located within the grounds of the Italianate village of Portmeirion, offering a unique historic stay.",
    "image": "/images/regions/mid-wales-hero.jpg",
    "bookingUrl": "https://portmeirion.wales",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "The Little Thatch Barn",
    "location": "Rhiw",
    "slug": "the-little-thatch-barn",
    "description": "A beautifully converted thatched barn offering a unique and cozy stay. Perfect for a romantic getaway with stunning coastal views.",
    "price": "From £80-£150",
    "sleeps": "2-6",
    "highlight": "A charming, traditional thatched barn conversion in a remote location with breathtaking views of Hell's Mouth bay.",
    "image": "/images/regions/mid-wales-hero.jpg",
    "bookingUrl": "https://www.airbnb.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Dwyros Campsite",
    "location": "Aberdaron",
    "slug": "dwyros-campsite",
    "description": "Overlooking Aberdaron bay. Simple and scenic campsite offering a true back-to-basics experience with incredible views.",
    "price": "From £15-£25",
    "sleeps": "2-6",
    "highlight": "Perched on the cliffs overlooking Aberdaron Bay, this campsite offers simple facilities but unbeatable panoramic views.",
    "image": "/images/regions/mid-wales-hero.jpg",
    "bookingUrl": "http://www.dwyros.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Lion Hotel",
    "location": "Tudweiliog",
    "slug": "lion-hotel",
    "description": "A traditional country pub with rooms, offering a warm welcome and hearty food. A great stopover for walkers on the Llŷn Coastal Path.",
    "price": "From £70-£120",
    "sleeps": "2-6",
    "highlight": "A historic coaching inn dating back to the 18th century, known for its traditional character and proximity to the coastal path.",
    "image": "/images/regions/mid-wales-hero.jpg",
    "bookingUrl": "https://www.lionhoteltudweiliog.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  },
  {
    "name": "Plas Bodegroes",
    "location": "Efailnewydd, near Pwllheli",
    "slug": "plas-bodegroes",
    "description": "Historic country house offering elegant accommodation and renowned dining. A sophisticated retreat for food lovers.",
    "price": "From £120-£200",
    "sleeps": "2-6",
    "highlight": "A Grade II listed Georgian country house set in beautiful grounds, formerly a Michelin-starred restaurant with rooms.",
    "image": "/images/regions/mid-wales-hero.jpg",
    "bookingUrl": "https://www.plasbodegroes.co.uk",
    "features": [],
    "bestFor": "Adventure seekers"
  }
];

export default function QuirkyStaysLlnPeninsula() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src="/images/journal/quirky-stays-llyn-peninsula-hero.jpg"
          alt="Quirky accommodation in Llŷn Peninsula"
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
              14 Quirky Places to Stay in Llŷn Peninsula
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              From beach-accessible campsites and shepherd huts to the famous Ty Coch Inn and luxury glamping domes — the Llŷn Peninsula offers wild, remote and beautiful places to stay at the very edge of Wales.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed">
            The Llŷn Peninsula feels like the end of the world — in the best possible way. Remote beaches, rugged coastline, and some of the most peaceful corners of Wales. These unique stays capture that wild, remote spirit while keeping you comfortable.
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
            <h2>Why Choose Quirky Accommodation in Llŷn Peninsula?</h2>
            <p>
              Llŷn Peninsula deserves accommodation that matches its character. These unique stays aren't just places to sleep — they're part of your adventure, putting you right in the heart of the landscape and local culture.
            </p>
            
            <h3>Best Areas to Stay in Llŷn Peninsula</h3>
            <ul>
              <li><strong>Aberdaron:</strong> Tip of the peninsula, Bardsey Island access, hostels and huts</li>
              <li><strong>Porthdinllaen:</strong> Beach-only access, iconic Ty Coch Inn</li>
              <li><strong>Porthor (Whistling Sands):</strong> Famous beach, National Trust camping</li>
              <li><strong>Abersoch:</strong> Watersports hub, Hell's Mouth, glamping</li>
              <li><strong>Pwllheli:</strong> Central base, shepherd huts, farm stays</li>
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
