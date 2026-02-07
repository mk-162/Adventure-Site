import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ExternalLink, Bed, Star, TreePine, Mountain } from "lucide-react";

// SEO metadata
export const metadata: Metadata = {
  title: "15 Quirky Places to Stay in Pembrokeshire (2026) | Best Unique Accommodation & Coastal Stays",
  description: "Discover the most unique and unusual accommodation in Pembrokeshire - from converted airplanes and UFO glamping to historic castles and clifftop lighthouses. The best quirky places to stay on the Welsh coast.",
  keywords: "quirky accommodation Pembrokeshire, unique stays Pembrokeshire, glamping Pembrokeshire, unusual places to stay Wales, best places to stay Pembrokeshire, coastal accommodation Wales",
  openGraph: {
    title: "15 Quirky Places to Stay in Pembrokeshire",
    description: "UFO glamping, castle stays, clifftop hostels and more - the most unique places to stay on the Pembrokeshire coast",
    type: "article",
    images: ["/images/journal/quirky-stays-pembrokeshire-hero.jpg"],
  },
};

// Accommodation data from JSON
const accommodations = [
  {
    name: "Apple Camping",
    location: "Tenby",
    slug: "apple-camping",
    description: "Apple Camping offers some of the most eccentric glamping in the UK. Guests can stay in a converted Etihad Airbus, a UFO, a Jet Star plane, or a Pacman-inspired dome. It's a quirky, fun-filled site perfect for those looking for something completely different.",
    price: "From £100/night",
    sleeps: "2-6",
    highlight: "Sleep in a plane, UFO or Pacman dome",
    image: "/images/accommodation/quirky/apple-camping.jpg",
    bookingUrl: "https://www.applecamping.co.uk",
    features: ["UFO", "Jet Star Plane", "Pacman Dome", "Witch's Hat"],
    bestFor: "Families and sci-fi fans",
  },
  {
    name: "Florence Springs Glamping",
    location: "Tenby",
    slug: "florence-springs",
    description: "This luxury glamping village offers hobbit houses, yurts, and treehouses, each with private wood-fired hot tubs. Set in a tranquil location, it provides a magical escape with a focus on relaxation and nature.",
    price: "From £120/night",
    sleeps: "2-6",
    highlight: "Hobbit houses with private hot tubs",
    image: "/images/accommodation/quirky/florence-springs.jpg",
    bookingUrl: "https://www.florencesprings.co.uk",
    features: ["Hobbit Houses", "Treehouses", "Private Hot Tubs", "Fishing Lake"],
    bestFor: "Couples and families seeking luxury glamping",
  },
  {
    name: "Top of the Woods",
    location: "Boncath",
    slug: "top-of-the-woods",
    description: "An award-winning eco-luxury glamping site located in 27 acres of wildflower meadows and ancient woodland. Accommodation includes safari lodges and pioneer camps, offering a back-to-nature experience with creature comforts.",
    price: "From £90/night",
    sleeps: "2-5",
    highlight: "Dark sky location in ancient woodland",
    image: "/images/accommodation/quirky/top-of-the-woods.jpg",
    bookingUrl: "https://www.topofthewoods.co.uk",
    features: ["Safari Lodges", "Pioneer Camps", "Dark Sky Location", "Dog Friendly"],
    bestFor: "Nature lovers and dog owners",
  },
  {
    name: "Roch Castle",
    location: "Roch",
    slug: "roch-castle",
    description: "A spectacularly restored 12th-century castle perched on a rocky outcrop, offering panoramic views of St Brides Bay. It operates as a luxury hotel with six en-suite bedrooms, blending historic architecture with modern art and design.",
    price: "From £200/night",
    sleeps: "2",
    highlight: "Sleep in a 12th-century castle",
    image: "/images/accommodation/quirky/roch-castle.jpg",
    bookingUrl: "https://www.rochcastle.com",
    features: ["Historic Castle", "Panoramic Views", "Luxury Suites", "Adults Only"],
    bestFor: "Couples and history buffs",
  },
  {
    name: "Twr y Felin Hotel",
    location: "St Davids",
    slug: "twr-y-felin",
    description: "Wales' first contemporary art hotel, created from a former windmill. It features over 100 pieces of specially commissioned art and offers luxury accommodation with a unique, modern aesthetic in the heart of St Davids.",
    price: "From £180/night",
    sleeps: "2",
    highlight: "Converted windmill art hotel",
    image: "/images/accommodation/quirky/twr-y-felin.jpg",
    bookingUrl: "https://www.twryfelinhotel.com",
    features: ["Converted Windmill", "Art Gallery", "AA Rosette Restaurant", "Luxury Rooms"],
    bestFor: "Art lovers and foodies",
  },
  {
    name: "Druidstone Hotel",
    location: "Broad Haven",
    slug: "druidstone-hotel",
    description: "A bohemian, family-run hotel perched on the cliff edge above Druidston Haven. Known for its eccentric charm, relaxed atmosphere, and stunning views, it has been a favorite of artists and walkers for decades.",
    price: "From £100/night",
    sleeps: "2-4",
    highlight: "Clifftop bohemian retreat",
    image: "/images/accommodation/quirky/druidstone-hotel.jpg",
    bookingUrl: "https://www.druidstone.co.uk",
    features: ["Clifftop Location", "Cellar Bar", "Sea Views", "Eclectic Decor"],
    bestFor: "Walkers and creatives",
  },
  {
    name: "Beavers Retreat Glamping",
    location: "Tenby",
    slug: "beavers-retreat",
    description: "A family-run glamping site offering a range of geodomes and bell tents. Guests can enjoy wood-fired hot tubs and unique alpaca trekking experiences, all set within the beautiful Pembrokeshire countryside.",
    price: "From £80/night",
    sleeps: "2-4",
    highlight: "Geodomes with alpaca trekking",
    image: "/images/accommodation/quirky/beavers-retreat.jpg",
    bookingUrl: "https://www.beaversretreat.co.uk",
    features: ["Geodomes", "Hot Tubs", "Alpaca Trekking", "Dog Friendly"],
    bestFor: "Families and animal lovers",
  },
  {
    name: "The Little Retreat",
    location: "Lawrenny",
    slug: "the-little-retreat",
    description: "Set in the grounds of the historic Lawrenny Park estate, this site offers luxury geodomes and stargazing tents. It focuses on wellbeing with wild swimming, foraging, and yoga opportunities in a secluded woodland setting.",
    price: "From £100/night",
    sleeps: "2-4",
    highlight: "Wellness-focused woodland glamping",
    image: "/images/accommodation/quirky/the-little-retreat.jpg",
    bookingUrl: "https://www.thelittleretreat.co.uk",
    features: ["Luxury Domes", "Stargazing", "Woodland Setting", "Wellbeing Activities"],
    bestFor: "Wellness seekers and couples",
  },
  {
    name: "YHA Pwll Deri",
    location: "Goodwick",
    slug: "yha-pwll-deri",
    description: "A remote cottage hostel with one of the most spectacular locations in Wales, perched 400ft above the sea on the rugged Strumble Head coast. It offers simple accommodation with breathtaking sunsets and direct coast path access.",
    price: "From £25/night",
    sleeps: "Multiple",
    highlight: "Clifftop hostel 400ft above the sea",
    image: "/images/accommodation/quirky/yha-pwll-deri.jpg",
    bookingUrl: "https://www.yha.org.uk/hostel/yha-pwll-deri",
    features: ["Clifftop Location", "Remote", "Sea Views", "Self-Catering"],
    bestFor: "Hikers and budget travelers",
  },
  {
    name: "West Blockhouse Fort",
    location: "Dale",
    slug: "west-blockhouse-fort",
    description: "A Victorian coastal artillery fort managed by the Landmark Trust. Guests stay within the historic fortifications, enjoying dramatic sea views and a unique insight into military history.",
    price: "From £300/night",
    sleeps: "8",
    highlight: "Stay in a Victorian fort",
    image: "/images/accommodation/quirky/west-blockhouse-fort.jpg",
    bookingUrl: "https://www.landmarktrust.org.uk",
    features: ["Historic Fort", "Sea Views", "Sleeps 8", "Unique Architecture"],
    bestFor: "Groups and history enthusiasts",
  },
  {
    name: "Fforest Farm",
    location: "Cilgerran",
    slug: "fforest-farm",
    description: "A 200-acre farm bordering the Teifi Marshes nature reserve, offering geodomes, crog lofts, and garden shacks. It features an on-site cedar barrel sauna, a relaxed pub, and easy access to river and woodland adventures.",
    price: "From £100/night",
    sleeps: "2-6",
    highlight: "200-acre farm with onsen and pub",
    image: "/images/accommodation/quirky/fforest-farm.jpg",
    bookingUrl: "https://www.coldatnight.co.uk",
    features: ["Geodomes", "Onsen", "Cedar Sauna", "River Access", "Pub"],
    bestFor: "Active families and nature lovers",
  },
  {
    name: "Aros yn Pentre Glas",
    location: "Hebron",
    slug: "aros-yn-pentre-glas",
    description: "This unique site features a converted bus and a cosy cabin, offering a quirky off-grid experience in the Preseli Hills. It focuses on sustainability and low-impact living.",
    price: "From £80/night",
    sleeps: "2-4",
    highlight: "Off-grid converted bus in the hills",
    image: "/images/accommodation/quirky/aros-yn-pentre-glas.jpg",
    bookingUrl: "https://www.airbnb.co.uk",
    features: ["Converted Bus", "Cabin", "Off-grid", "Eco-friendly"],
    bestFor: "Couples and eco-conscious travelers",
  },
  {
    name: "Ty Felin",
    location: "Newport",
    slug: "ty-felin",
    description: "A beautiful, accessible barn conversion located near the coast in Newport. It combines traditional character with modern accessibility features, making it an inclusive base for exploring the National Park.",
    price: "From £150/night",
    sleeps: "8",
    highlight: "Accessible barn conversion",
    image: "/images/accommodation/quirky/ty-felin.jpg",
    bookingUrl: "https://www.hostunusual.com/property/ty-felin/",
    features: ["Accessible", "Barn Conversion", "Sleeps 8", "Coastal Location"],
    bestFor: "Groups and families",
  },
  {
    name: "Celtic Camping & Bunkhouses",
    location: "St Davids",
    slug: "celtic-camping",
    description: "A rustic, no-frills site with sweeping sea views over the Irish Sea. It offers huge camping fields and basic bunkhouse accommodation in converted farm buildings, popular with large groups and outdoor education centers.",
    price: "From £10/night",
    sleeps: "Multiple",
    highlight: "Sea views and coast path access",
    image: "/images/accommodation/quirky/celtic-camping.jpg",
    bookingUrl: "https://www.celtic-camping.co.uk",
    features: ["Sea Views", "Group Accommodation", "Rustic", "Coast Path Access"],
    bestFor: "Groups and rugged campers",
  },
  {
    name: "Strumble Head Lighthouse Cottage",
    location: "Goodwick",
    slug: "strumble-head-lighthouse",
    description: "Stay in the former keeper's cottage at the iconic Strumble Head Lighthouse. While you can't stay in the tower itself, the cottage offers an unmatched location on a rocky island accessed by a footbridge, surrounded by the wild sea.",
    price: "From £150/night",
    sleeps: "4",
    highlight: "Lighthouse cottage on rocky island",
    image: "/images/accommodation/quirky/strumble-head-lighthouse.jpg",
    bookingUrl: "https://www.trinityhouse.co.uk",
    features: ["Lighthouse Cottage", "Remote", "Island Location", "Spectacular Views"],
    bestFor: "Couples and lighthouse enthusiasts",
  },
];

export default function QuirkyStaysPembrokeshire() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src="/images/journal/quirky-stays-pembrokeshire-hero.jpg"
          alt="Quirky accommodation on the Pembrokeshire coast"
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
              15 Quirky Places to Stay in Pembrokeshire
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              From sleeping in converted aircraft and UFO domes to historic castles and clifftop lighthouses — Pembrokeshire offers some of the most eccentric and magical places to stay in Wales.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed">
            Pembrokeshire isn't just about stunning coastline (though it's spectacular). It's about finding places that match the wild, creative spirit of the coast. We've tracked down the most unusual, beautiful, and downright extraordinary places to stay — from glamping in hobbit houses to sleeping in Victorian forts.
          </p>
          
          <div className="bg-slate-50 border-l-4 border-accent p-6 my-8 not-prose">
            <h3 className="font-bold text-lg mb-2">What makes our picks different?</h3>
            <ul className="space-y-2 text-slate-600">
              <li>✓ Every listing is verified and bookable</li>
              <li>✓ Hand-picked for uniqueness and character</li>
              <li>✓ Adventure-focused — perfect for coastal exploration</li>
              <li>✓ All budgets from £10 to £300/night</li>
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
            <h2>Why Choose Quirky Accommodation in Pembrokeshire?</h2>
            <p>
              Pembrokeshire has one of the most beautiful coastlines in Britain, with dramatic cliffs, secret coves, and some of the best coastal walking in the UK. Why pair that with a boring hotel when you can sleep in a UFO, a castle, or a lighthouse?
            </p>
            <p>
              The best accommodation in Pembrokeshire puts you in the landscape and becomes part of your adventure. Wake up to sea views from a clifftop fort. Fall asleep in a hobbit house listening to owls. Watch the sunset from your hot tub after a day on the Coast Path.
            </p>
            
            <h3>Best Areas to Stay in Pembrokeshire</h3>
            <ul>
              <li><strong>Tenby:</strong> Beautiful walled town, beaches, and the most quirky glamping options</li>
              <li><strong>St Davids:</strong> Britain's smallest city, cathedral, great coastal access</li>
              <li><strong>Broad Haven:</strong> Surfing, clifftop walks, relaxed atmosphere</li>
              <li><strong>Newport:</strong> Preseli Hills, quieter coast, great for hiking</li>
              <li><strong>Dale:</strong> Watersports hub, sheltered bay, historic fort</li>
            </ul>
            
            <h3>Booking Tips for Pembrokeshire</h3>
            <ul>
              <li><strong>Book early:</strong> Quirky stays book up fast, especially summer weekends</li>
              <li><strong>Shoulder season:</strong> May and September offer great weather and fewer crowds</li>
              <li><strong>Coast Path:</strong> Many stays offer direct access to the Pembrokeshire Coast Path</li>
              <li><strong>Coastal adventures:</strong> Consider proximity to coasteering, surfing, and boat trips</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Explore More Quirky Stays in Wales</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/journal/quirky-stays-anglesey" className="group">
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <Image
                src="/images/regions/anglesey-hero.jpg"
                alt="Anglesey"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold group-hover:text-accent transition-colors">
              Quirky Stays: Anglesey →
            </h3>
            <p className="text-sm text-slate-500">Lighthouses, yurts and coastal glamping</p>
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
            <p className="text-sm text-slate-500">Treehouses, slate mine glamping and mountain lodges</p>
          </Link>
          
          <Link href="/journal/quirky-stays-gower" className="group">
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <Image
                src="/images/regions/gower-hero.jpg"
                alt="Gower Peninsula"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold group-hover:text-accent transition-colors">
              Quirky Stays: Gower →
            </h3>
            <p className="text-sm text-slate-500">Shepherd huts and coastal pods</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
