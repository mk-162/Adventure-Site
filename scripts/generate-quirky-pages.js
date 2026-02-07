const fs = require('fs');
const path = require('path');

// Read JSON data files
const angleseyData = require('../data/accommodation/quirky/anglesey.json');
const breconData = require('../data/accommodation/quirky/brecon-beacons.json');
const gowerData = require('../data/accommodation/quirky/gower.json');
const llynData = require('../data/accommodation/quirky/llyn-peninsula.json');
const northWalesData = require('../data/accommodation/quirky/north-wales.json');
const southWalesData = require('../data/accommodation/quirky/south-wales.json');
const wyeValleyData = require('../data/accommodation/quirky/wye-valley.json');

const regions = [
  {
    name: 'anglesey',
    title: 'Anglesey',
    data: angleseyData,
    description: 'From lighthouse keeper cottages and French châteaux to Mongolian yurts and luxury glamping domes — Anglesey offers an incredible range of unique accommodation. Sleep where the keepers watched the waves, wake up in a castle, or stargaze from your geodome hot tub.',
    intro: 'Anglesey isn\'t just about stunning coastline and historic sites (though they\'re spectacular). It\'s about finding places that capture the island\'s unique character — historic, wild, and welcoming. These are the most unusual, beautiful, and memorable places to stay on Ynys Môn.',
    bestAreas: [
      '<strong>Menai Bridge:</strong> Château stays, rib rides, close to Snowdonia',
      '<strong>Beaumaris:</strong> Castle town, coastal glamping, watersports',
      '<strong>Holyhead/Holy Island:</strong> South Stack, Trearddur Bay, rugged coast',
      '<strong>East Coast:</strong> Lligwy Beach, Moelfre, Red Wharf Bay',
      '<strong>Central Anglesey:</strong> Windmills, rural charm, hub for exploring'
    ],
    count: angleseyData.length
  },
  {
    name: 'brecon-beacons',
    title: 'Brecon Beacons',
    data: breconData,
    description: 'From lakeside cabins and railway brake vans to mountaintop glamping and converted slate mine accommodation — the Brecon Beacons offers unique stays that match its wild, dramatic landscape.',
    intro: 'The Brecon Beacons deserves accommodation that matches its epic mountains and waterfalls. Whether you want to wake up by a lake, sleep in a converted railway carriage, or glamping above a slate mine, these unusual stays put you right in the landscape.',
    bestAreas: [
      '<strong>Pontsticill:</strong> Reservoir glamping, outdoor activities on-site',
      '<strong>Talybont-on-Usk:</strong> Canal, geodomes, central location',
      '<strong>Llangorse:</strong> Lakeside cabins, wild swimming, watersports',
      '<strong>Brecon:</strong> Market town base, shepherd huts nearby',
      '<strong>Black Mountains:</strong> Remote tipis, dark skies, off-grid escapes'
    ],
    count: breconData.length
  },
  {
    name: 'gower',
    title: 'Gower',
    data: gowerData,
    description: 'From shepherd huts overlooking Three Cliffs Bay to glamping pods with sea views and historic country inns — Gower offers quirky coastal stays that put you right on Britain\'s first Area of Outstanding Natural Beauty.',
    intro: 'Gower was Britain\'s first Area of Outstanding Natural Beauty, and it deserves accommodation that lives up to that title. These quirky stays put you right on the clifftops, in the dunes, or overlooking some of the most beautiful beaches in Wales.',
    bestAreas: [
      '<strong>Three Cliffs Bay/Pennard:</strong> Iconic views, luxury glamping',
      '<strong>Rhossili:</strong> Worm\'s Head, shepherd huts, epic sunsets',
      '<strong>Port Eynon:</strong> Beach access, surfing, clifftop glamping',
      '<strong>Oxwich:</strong> Bay views, secret garden pods, coastal walks',
      '<strong>Llangennith:</strong> Surfing hub, farm glamping, relaxed vibes'
    ],
    count: gowerData.length
  },
  {
    name: 'llyn-peninsula',
    title: 'Llŷn Peninsula',
    data: llynData,
    description: 'From beach-accessible campsites and shepherd huts to the famous Ty Coch Inn and luxury glamping domes — the Llŷn Peninsula offers wild, remote and beautiful places to stay at the very edge of Wales.',
    intro: 'The Llŷn Peninsula feels like the end of the world — in the best possible way. Remote beaches, rugged coastline, and some of the most peaceful corners of Wales. These unique stays capture that wild, remote spirit while keeping you comfortable.',
    bestAreas: [
      '<strong>Aberdaron:</strong> Tip of the peninsula, Bardsey Island access, hostels and huts',
      '<strong>Porthdinllaen:</strong> Beach-only access, iconic Ty Coch Inn',
      '<strong>Porthor (Whistling Sands):</strong> Famous beach, National Trust camping',
      '<strong>Abersoch:</strong> Watersports hub, Hell\'s Mouth, glamping',
      '<strong>Pwllheli:</strong> Central base, shepherd huts, farm stays'
    ],
    count: llynData.length
  },
  {
    name: 'north-wales',
    title: 'North Wales',
    data: northWalesData,
    description: 'From safari lodges at Zip World to Portmeirion\'s Italianate village, French châteaux on the Menai Strait to luxury treehouses — North Wales offers some of the most unique and adventurous accommodation in the UK.',
    intro: 'North Wales is adventure central, with Snowdonia, Anglesey, and the coast all within easy reach. These unique stays range from historic windmills and railway carriages to off-grid mountain lodges and Alice in Wonderland themed houses. Adventure seekers, you\'re home.',
    bestAreas: [
      '<strong>Llanberis:</strong> Snowdon\'s doorstep, slate cottages, mountain access',
      '<strong>Blaenau Ffestiniog:</strong> Zip World on-site, slate mine glamping',
      '<strong>Portmeirion:</strong> Italianate village, castle stays, estuary views',
      '<strong>Betws-y-Coed:</strong> Central Snowdonia, waterfalls, outdoor hub',
      '<strong>Conwy:</strong> Castle views, estuary cottages, coastal access'
    ],
    count: northWalesData.length
  },
  {
    name: 'south-wales',
    title: 'South Wales',
    data: southWalesData,
    description: 'From forest glamping at mountain bike hubs to historic castles and converted lighthouses — South Wales offers unique stays that connect you to its industrial heritage and natural beauty.',
    intro: 'South Wales combines mountain biking meccas, dramatic valleys, and industrial heritage with stunning natural beauty. These quirky stays range from lighthouses and castles to forest pods right on the trails — perfect for adventurers and history buffs alike.',
    bestAreas: [
      '<strong>Cwmcarn:</strong> Forest glamping, world-class MTB trails',
      '<strong>Afan Valley:</strong> Alpine lodges, bike park heaven',
      '<strong>Pontneddfechan:</strong> Waterfall Country, gorge walking',
      '<strong>Black Mountains:</strong> Priory stays, Offa\'s Dyke, remote escapes',
      '<strong>Newport/St Brides:</strong> Lighthouse stays, coastal walks, wetlands'
    ],
    count: southWalesData.length
  },
  {
    name: 'wye-valley',
    title: 'Wye Valley',
    data: wyeValleyData,
    description: 'From converted railway carriages in Dark Sky Reserves to medieval gatehouses and windmills — the Wye Valley offers some of the most romantic and unique accommodation in Wales, nestled in ancient woodlands and historic estates.',
    intro: 'The Wye Valley is one of the most beautiful corners of Wales — ancient woodlands, the mighty River Wye, and some of the darkest skies in Britain. These unique stays range from astro-pods and windmills to medieval castles and shepherd huts, all in stunning secluded settings.',
    bestAreas: [
      '<strong>Llanthony:</strong> Black Mountains, Dark Sky Reserve, converted carriages',
      '<strong>Monmouth:</strong> Wye River, historic town, stargazer cabins',
      '<strong>Abergavenny:</strong> Sugar Loaf mountain, woodland cabins, market town',
      '<strong>Chepstow/Mathern:</strong> Medieval gatehouses, river views',
      '<strong>Usk area:</strong> Windmills, rolling countryside, rural escapes'
    ],
    count: wyeValleyData.length
  }
];

function generatePage(region) {
  // Transform data to match template format
  const accommodations = region.data.map(item => {
    // Extract price range or default
    let price = item.price || item.priceRange || 'Check website';
    if (!price.includes('From') && !price.includes('Check')) {
      price = `From ${price}`;
    }

    // Get sleeps info
    let sleeps = '2-6'; // default
    if (item.features && Array.isArray(item.features)) {
      const sleepsFeature = item.features.find(f => f.toLowerCase().includes('sleeps'));
      if (sleepsFeature) {
        sleeps = sleepsFeature.replace(/sleeps?/i, '').trim();
      }
    }

    // Generate slug from name
    const slug = item.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Get highlight
    const highlight = item.what_makes_it_unique || item.highlight || item.description.substring(0, 60) + '...';

    // Get features
    let features = item.features || [];
    if (typeof features === 'string') {
      features = [features];
    }
    if (features.length === 0 && item.type) {
      features = [item.type];
    }

    // Get best for
    let bestFor = 'Adventure seekers';
    if (item.bestFor) {
      if (Array.isArray(item.bestFor)) {
        bestFor = item.bestFor.join(', ');
      } else {
        bestFor = item.bestFor;
      }
    }

    // Get booking URL
    const bookingUrl = item.booking_link || item.bookingUrl || item.website || '#';

    return {
      name: item.name,
      location: item.location,
      slug: slug,
      description: item.description,
      price: price,
      sleeps: sleeps,
      highlight: highlight,
      image: `/images/accommodation/quirky/${slug}.jpg`,
      bookingUrl: bookingUrl,
      features: features.slice(0, 4), // Max 4 features
      bestFor: bestFor
    };
  });

  const template = `import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ExternalLink, Bed } from "lucide-react";

// SEO metadata
export const metadata: Metadata = {
  title: "${region.count} Quirky Places to Stay in ${region.title} (2026) | Best Unique Accommodation & Stays",
  description: "${region.description.substring(0, 155)}",
  keywords: "quirky accommodation ${region.title}, unique stays ${region.title}, glamping ${region.title}, unusual places to stay ${region.title}, best places to stay ${region.title}",
  openGraph: {
    title: "${region.count} Quirky Places to Stay in ${region.title}",
    description: "${region.description.substring(0, 200)}",
    type: "article",
    images: ["/images/journal/quirky-stays-${region.name}-hero.jpg"],
  },
};

// Accommodation data
const accommodations = ${JSON.stringify(accommodations, null, 2)};

export default function QuirkyStays${region.title.replace(/[^a-zA-Z]/g, '')}() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src="/images/journal/quirky-stays-${region.name}-hero.jpg"
          alt="Quirky accommodation in ${region.title}"
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
              ${region.count} Quirky Places to Stay in ${region.title}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              ${region.description}
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed">
            ${region.intro}
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
              <div className={\`relative h-[400px] rounded-2xl overflow-hidden \${index % 2 === 1 ? 'md:order-2' : ''}\`}>
                <Image
                  src={stay.image}
                  alt={\`\${stay.name} - \${stay.highlight}\`}
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
            <h2>Why Choose Quirky Accommodation in ${region.title}?</h2>
            <p>
              ${region.title} deserves accommodation that matches its character. These unique stays aren't just places to sleep — they're part of your adventure, putting you right in the heart of the landscape and local culture.
            </p>
            
            <h3>Best Areas to Stay in ${region.title}</h3>
            <ul>
              ${region.bestAreas.map(area => `<li>${area}</li>`).join('\n              ')}
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
`;

  return template;
}

// Generate all pages
regions.forEach(region => {
  const pageContent = generatePage(region);
  const outputPath = path.join(__dirname, `../src/app/journal/quirky-stays-${region.name}/page.tsx`);
  fs.writeFileSync(outputPath, pageContent);
  console.log(`✓ Generated ${region.name}`);
});

console.log('\n✅ All regional pages generated!');
