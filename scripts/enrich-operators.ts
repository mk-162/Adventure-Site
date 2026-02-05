/**
 * Operator Directory Enrichment Script
 * 
 * Run with:
 * DATABASE_URL="postgresql://neondb_owner:npg_9KwogLV1dZAG@ep-delicate-wave-abcma093-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require" npx tsx scripts/enrich-operators.ts
 */

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const SITE_ID = 1; // adventurewales.com

// Enriched operator data based on deep research
const enrichedOperators = [
  // COASTEERING OPERATORS
  {
    slug: 'tyf-adventure',
    tagline: 'Pioneers of coasteering since 1986',
    description: `TYF Adventure is the original coasteering company, having pioneered the sport in 1986 from their base in the heart of St Davids. With over 200,000 guided adventures under their belt, they've set the standard for coastal exploration in Pembrokeshire.

Their 3.5-hour coasteering sessions (£65pp) take you through sea caves, over rock formations, and into exhilarating cliff jumps along some of Britain's most dramatic coastline. What sets TYF apart is their unique Powerboat Coasteering option, using RIBs to access remote sea caves and hidden coves that land-based trips can't reach.

All equipment included: 5mm wetsuits, buoyancy aids, helmets. Sessions run at 9am or 1:30pm, with guides maintaining an intimate 1:8 ratio. They also offer sea kayaking, surfing, SUP, and climbing. Perfect for families (age 8+), couples, and adventure groups. TripAdvisor consistently rates them 4.9+ stars with reviews praising their knowledgeable guides who bring the local marine ecology to life.`,
    uniqueSellingPoint: 'Original coasteering pioneers with exclusive powerboat access to remote sea caves',
    priceRange: '£65-£95'
  },
  {
    slug: 'preseli-venture',
    tagline: 'Eco-adventure on the Pembrokeshire coast',
    description: `Preseli Venture combines world-class adventure activities with award-winning eco-accommodation on the stunning North Pembrokeshire coast. Running coasteering sessions for over 25 years, they're known for their environmentally conscious approach and deep knowledge of local wildlife.

Half-day coasteering from £52 includes all equipment, with sessions exploring the dramatic cliffs, caves, and rock pools around Abereiddy. Their guides are passionate about minimising impact while maximising thrills - expect to learn about seals, seabirds, and marine habitats between cliff jumps.

What makes Preseli special is their "leave no trace" philosophy and purpose-built eco-lodge accommodation. They offer multi-day adventure packages combining coasteering with surfing, kayaking, and wild swimming. Perfect for environmentally-minded adventurers and families wanting an immersive coastal experience.`,
    uniqueSellingPoint: 'Eco-conscious adventures with sustainable lodge accommodation',
    priceRange: '£52-£85'
  },
  {
    slug: 'activity-pembrokeshire',
    tagline: 'Small groups, big adventures',
    description: `Activity Pembrokeshire specialises in intimate, personalised coastal adventures with a maximum group size of 8 - meaning more attention, more flexibility, and more time in the water. Based in Pembrokeshire, they focus exclusively on coasteering and sea kayaking, doing both exceptionally well.

Their coasteering sessions explore the spectacular geology around St Davids Peninsula, with guides who genuinely love sharing the coastline's secrets. Expect sea caves carved over millennia, natural rock pools teeming with life, and cliff jumps tailored to your comfort level.

With a perfect 5.0 Google rating, reviews consistently mention the personal touch - guides remembering names, adapting routes to conditions, and going above and beyond to create memorable experiences. Ideal for families with nervous first-timers, couples wanting quality time, or small groups.`,
    uniqueSellingPoint: 'Maximum 8 per group for personalised attention',
    priceRange: '£55-£75'
  },
  // MOUNTAIN BIKING
  {
    slug: 'bikepark-wales',
    tagline: "The UK's premier downhill mountain bike destination",
    description: `BikePark Wales is Britain's answer to world-class bike parks, purpose-built on a former coal mine in the Brecon Beacons. With over 40 trails across 500m of vertical descent, it caters to everyone from nervous beginners to professional downhillers.

Green and blue trails offer flowing berms, gentle jumps, and confidence-building descents. Red and black runs deliver serious technical challenges with rock gardens, drops, and jumps. The efficient minibus uplift (£36-50/day) means maximum runs with minimum pedalling.

Bike hire from £99/day includes quality downhill rigs. Their "Ticket to Ride" family packages (£325 for 4) include guided coaching, bikes, and uplift. Facilities include bike wash, well-stocked shop, and excellent café. 4.8 Google rating with riders praising trail variety and maintenance.`,
    uniqueSellingPoint: "UK's largest purpose-built bike park with 40+ trails",
    priceRange: '£8-£50 (pedal to full uplift)'
  },
  {
    slug: 'antur-stiniog',
    tagline: 'Steep, raw, and utterly Welsh',
    description: `Antur Stiniog is the antidote to sanitised bike parks. Carved into the slate mountains above Blaenau Ffestiniog, these trails are steeper, rawer, and more technical than anywhere else in Wales. If you want to test yourself against proper mountain terrain, this is it.

The gradient here is exceptional - over 350m descent on some runs. Trails range from flowing blue-graded descents through ancient woodland to brutal black runs that challenge even expert riders. The uplift service runs Land Rovers up the mountain, adding to the back-country atmosphere.

Best for: Intermediate to expert riders wanting challenging terrain. Beginners should build confidence at Coed y Brenin first. 4.8 Google rating, with riders praising the "real mountain biking" experience.`,
    uniqueSellingPoint: 'Steepest descents in Wales with authentic mountain atmosphere',
    priceRange: '£25-£40'
  },
  {
    slug: 'coed-y-brenin-nrw',
    tagline: "Wales' original trail centre",
    description: `Coed y Brenin pioneered purpose-built mountain bike trails in the UK back in 1996, and it remains one of Britain's finest riding destinations. Set in a stunning Snowdonia forest, it offers everything from gentle family-friendly routes to technical single-track.

Unlike bike parks, Coed y Brenin is pedal-powered - you earn your descents. The famous MBR trail serves up 18km of flowing single-track, while the Beast delivers 38km of challenging terrain. Forest roads provide easier options for families.

The visitor centre includes bike wash, excellent café, and connection to Brenin Bikes for quality hire. Free trail access (small parking charge) makes it outstanding value. Perfect for all abilities.`,
    uniqueSellingPoint: 'Free world-class trails in stunning Snowdonia forest',
    priceRange: 'Free (parking £5-7)'
  },
  // NATIONAL CENTRES
  {
    slug: 'plas-y-brenin',
    tagline: 'The National Outdoor Centre',
    description: `Plas y Brenin is THE place to develop outdoor skills in the UK. As the National Outdoor Centre, it's trained generations of mountaineers, climbers, paddlers, and outdoor professionals from its stunning location in the heart of Snowdonia.

Courses cover everything from complete beginner hill skills (2 days, 1:8 ratio) to advanced mountaineering instructor qualifications. Personal instruction runs £350/day for 1:1 coaching from world-class instructors.

What makes Plas y Brenin special is the depth of expertise. Many instructors literally wrote the books on outdoor education. The facilities are exceptional: indoor climbing walls, paddling pool, library, comfortable accommodation, and a legendary bar.`,
    uniqueSellingPoint: 'UK national centre with unmatched instructor expertise',
    priceRange: '£150-£400 (courses vary)'
  },
  {
    slug: 'plas-menai',
    tagline: "Wales' National Watersports Centre",
    description: `Plas Menai is Wales' premier watersports facility, perfectly positioned on the Menai Strait between Anglesey and the mainland. The strait's unique tidal flows and sheltered waters create ideal learning conditions for everything from dinghy sailing to powerboating.

Courses range from RYA qualifications (Start Sailing, Day Skipper) to taster sessions for families. Their sea kayaking explores Anglesey's dramatic coastline with potential seal and seabird encounters.

Accommodation on-site makes multi-day courses convenient. 4.6 Google rating with reviews praising professional instruction and stunning location.`,
    uniqueSellingPoint: 'National centre with RYA qualifications on the Menai Strait',
    priceRange: '£80-£300 (courses vary)'
  },
  // SNOWDONIA GUIDES
  {
    slug: 'mountainxperience',
    tagline: 'Gold Award Snowdonia guiding',
    description: `MountainXperience has earned Gold Snowdonia Ambassador status for their exceptional guided experiences across Eryri (Snowdonia). Whether you want to summit Snowdon avoiding the crowds, tackle the infamous Crib Goch scramble, or master navigation skills, they deliver.

Their signature experiences include guided Snowdon walks via quiet routes (Rhyd Ddu, Watkin Path), Crib Goch scrambles for those ready for exposure and scrambling, and the complete Snowdon Horseshoe. Wild camping experiences add an extra dimension.

Guides are qualified Mountain Leaders with genuine passion. Small groups (max 6) ensure personal attention. 5.0 Google rating with reviews highlighting local knowledge and ability to match challenges to abilities.`,
    uniqueSellingPoint: 'Gold Snowdonia Ambassador with expert local guides',
    priceRange: '£45-£120'
  },
  // SURF SCHOOLS
  {
    slug: 'llangennith-surf-school',
    tagline: "Gower's original surf school",
    description: `Llangennith Surf School operates on one of Britain's finest surf beaches - a 3-mile sweep of consistent waves backed by Rhossili's dramatic cliffs. They've taught thousands to surf since 1988, and their instructors' local knowledge is unmatched.

Two-hour lessons cover beach safety, paddling technique, and standing up - most beginners ride waves by the end. All equipment included. Group lessons keep costs reasonable while private sessions accelerate learning.

What sets Llangennith apart is the beach itself - proper Atlantic waves, far less crowded than Cornwall, with stunning scenery. Perfect 5.0 Google rating.`,
    uniqueSellingPoint: 'Premier Atlantic beach with consistent beginner-friendly waves',
    priceRange: '£35-£75'
  },
  {
    slug: 'outer-reef-surf-school',
    tagline: 'Pembrokeshire surf and coasteering',
    description: `Outer Reef combines top-quality surf instruction with coasteering adventures across Pembrokeshire's best beaches. Based near Freshwater West (featured in Harry Potter), they access some of Wales' finest surf spots.

Surf lessons run at beaches suited to conditions - Freshwater West for experienced surfers, Broad Haven and Newgale for beginners. Instruction covers everything from first-time foam board sessions to performance coaching.

Their coasteering sessions explore Pembrokeshire's dramatic sea cliffs, and combo days mixing surf and coasteering make excellent group experiences. 4.9 Google rating.`,
    uniqueSellingPoint: 'Multi-activity coastal adventures at iconic Pembrokeshire beaches',
    priceRange: '£40-£75'
  },
  {
    slug: 'hells-mouth-surf-school',
    tagline: 'Learn to surf on the Llŷn Peninsula',
    description: `Hell's Mouth (Porth Neigwl) offers one of Wales' most consistent surf beaches - a 4-mile bay catching Atlantic swells that other spots miss. Hell's Mouth Surf School has taught on this beach for years, understanding exactly where and when conditions suit different abilities.

Lessons run for all levels, with the gently shelving beach perfect for beginners. The relatively uncrowded waters mean more waves and less stress than busier surf destinations.

The Llŷn Peninsula setting is spectacular - this is Welsh surfing as it should be: dramatic cliffs, clean water, and proper community feel. 5.0 Google rating.`,
    uniqueSellingPoint: 'Uncrowded 4-mile beach with consistent year-round waves',
    priceRange: '£40-£70'
  },
  // ZIP WORLD
  {
    slug: 'zip-world',
    tagline: 'Epic adventures in epic locations',
    description: `Zip World has transformed disused Welsh quarries and mines into world-class adventure attractions. From the world's fastest zip line to underground trampolining, they've created experiences that simply don't exist anywhere else.

Velocity at Penrhyn Quarry sends you flying at 100mph over a flooded slate quarry. Titan is Europe's longest zip line at 1.5km. Bounce Below lets you bounce on giant trampolines in Victorian slate caverns. Quarry Karts combines go-karting with mountain terrain.

Multiple sites across North Wales (Penrhyn Quarry, Llechwedd, Betws-y-Coed) mean there's always something nearby. 4.8 Google rating with visitors consistently amazed by the unique settings.`,
    uniqueSellingPoint: "World record-breaking zip lines in spectacular quarry settings",
    priceRange: '£25-£100'
  },
  // ANGLESEY
  {
    slug: 'anglesey-adventures',
    tagline: 'Island adventures by sea',
    description: `Anglesey Adventures unlocks the island's spectacular coastline through sea kayaking, coasteering, and SUP. Based on Anglesey, they access sea caves, hidden beaches, and wildlife-rich waters that most visitors never see.

Sea kayaking trips (from £55 adults, £40 children) explore dramatic cliffs and caves, with wildlife encounters including seals, porpoises, and diverse seabirds. The Wildlife Kayaking Tour to Puffin Island is particularly special during breeding season.

What sets Anglesey Adventures apart is their wildlife focus - guides are genuinely knowledgeable about marine ecology. Small groups (max 8) ensure everyone gets close to the action. 4.9 Google rating.`,
    uniqueSellingPoint: 'Wildlife-focused paddling with potential seal and puffin encounters',
    priceRange: '£40-£135'
  },
  // ADVENTURE BRITAIN
  {
    slug: 'adventure-britain',
    tagline: 'Brecon Beacons multi-activity base',
    description: `Adventure Britain operates from a 70-acre outdoor pursuits centre at the top of the Swansea Valley, making them ideally placed for Brecon Beacons adventures. Their speciality is multi-activity packages combining accommodation with activities like caving, canyoning, climbing, and gorge walking.

The "Big Four" weekend (£365pp) includes caving, canyoning, Pen y Fan summit, and canoeing with 2 nights half-board - exceptional value for a properly packed adventure weekend.

Bunkhouse accommodation keeps groups together, and all transport between activities is included. 5.0 Google rating with reviews praising the value, variety, and guide expertise.`,
    uniqueSellingPoint: '70-acre activity base with all-inclusive adventure packages',
    priceRange: '£115-£365'
  },
  // GOWER
  {
    slug: 'gower-activity-centres',
    tagline: 'Gower family adventures',
    description: `Gower Activity Centres has been introducing families to coastal adventures since 1989. Operating across the Gower Peninsula's stunning beaches and coastline, they offer coasteering, surfing, kayaking, and multi-activity days designed to get everyone involved.

Coasteering sessions explore Gower's sea caves, rock arches, and tidal pools. Their approach prioritises fun and safety in equal measure, making them ideal for families with mixed abilities. The team knows Gower intimately, adapting sessions to conditions.

They work extensively with schools and youth groups, so child-friendly instruction comes naturally. 4.8 Google rating reflects consistent quality.`,
    uniqueSellingPoint: 'Family-specialist with 35+ years Gower experience',
    priceRange: '£35-£65'
  },
  {
    slug: 'rip-n-rock',
    tagline: 'Surf, climb, coasteer on the Gower',
    description: `Rip N Rock brings infectious enthusiasm to Gower's adventure scene. Specialising in surfing, climbing, and coasteering, they're known for high-energy sessions that leave you buzzing.

Coasteering on Gower's limestone cliffs offers unique geology - sea caves, blowholes, and dramatic rock formations. Surf lessons at Caswell and Langland benefit from sheltered conditions. Rock climbing at accessible Gower crags provides proper outdoor experience.

The team's passion is genuine - these are people who live for adventures and love sharing them. 5.0 Google rating with reviews mentioning the fun, energetic atmosphere.`,
    uniqueSellingPoint: 'Energetic guides with triple-activity expertise',
    priceRange: '£40-£70'
  },
  {
    slug: 'llangorse-multi-activity-centre',
    tagline: 'Brecon Beacons family adventure hub',
    description: `Llangorse Multi Activity Centre offers an enormous range of adventures around Wales' largest natural lake. From indoor climbing and high ropes to water sports and horse riding, they can fill a week without repetition.

The lakeside setting is stunning, with the Brecon Beacons rising behind. Water activities include kayaking, canoeing, SUP, and sailing. Land-based options span climbing walls, zip lines, and rope courses.

Purpose-built facilities make this ideal for families and groups. Multi-activity packages offer excellent value. 4.7 Google rating praises variety and family-friendly approach.`,
    uniqueSellingPoint: 'Lakeside location with 20+ different activities',
    priceRange: '£25-£60 per activity'
  },
];

// NEW operators to add to the database
const newOperators = [
  {
    name: 'Celtic Quest Coasteering',
    slug: 'celtic-quest-coasteering',
    category: 'activity_provider',
    regions: ['pembrokeshire'],
    activityTypes: ['coasteering'],
    website: 'https://www.celticquestcoasteering.com',
    description: `Celtic Quest is Pembrokeshire's most affordable coasteering operator without compromising quality. Established in 2008, this micro-business focuses exclusively on coasteering, and they do it brilliantly.

Half-day sessions from just £39-55 include all equipment (5mm wetsuits, helmets, buoyancy aids, gloves, hoods) and expert guidance. Sessions explore the coast around Abereiddy, finishing at the famous Blue Lagoon. Everything is optional - guides tailor jumps and challenges to individual comfort levels.

What sets Celtic Quest apart is the value-for-money and personal attention. Reviews consistently mention guides who remember names and create a fun, supportive atmosphere. Perfect 5-star TripAdvisor reviews.`,
    tagline: 'Quality coasteering at honest prices',
    uniqueSellingPoint: 'Best-value coasteering in Pembrokeshire',
    priceRange: '£39-£55',
    googleRating: '5.0',
  },
  {
    name: 'Go Below Underground Adventures',
    slug: 'go-below-underground',
    category: 'activity_provider',
    regions: ['snowdonia'],
    activityTypes: ['caving', 'zip-lining', 'adventure'],
    website: 'https://www.go-below.co.uk',
    description: `Go Below takes you into the otherworldly depths of abandoned Victorian slate mines beneath Snowdonia. This isn't caving - it's underground adventure on an industrial scale, with zip lines, scrambles, and boat journeys through vast caverns.

The Challenge Adventure (£69, age 10+) includes underground zip lines, rope bridges, and boat crossings. Hero Xtreme (£79, age 12+) ups the ante with longer routes. Ultimate Xtreme (£109, age 18+) is a 7-hour epic reaching 1,375 feet below surface - the deepest public access point in the UK.

What makes Go Below unique is the sheer scale - these are enormous Victorian industrial caverns, not tight potholing passages. Claustrophobes generally cope fine. Reviews are exceptional.`,
    tagline: "The UK's deepest underground adventure",
    uniqueSellingPoint: 'Deepest public access point in UK at 1,375 feet',
    priceRange: '£69-£399',
    googleRating: '4.9',
  },
  {
    name: 'National White Water Centre',
    slug: 'national-white-water-centre',
    category: 'activity_provider',
    regions: ['snowdonia'],
    activityTypes: ['rafting', 'kayaking', 'canyoning'],
    website: 'https://www.nationalwhitewatercentre.co.uk',
    description: `The National White Water Centre at Bala has been the UK's premier natural white water venue for 40 years. The River Tryweryn delivers consistent Grade 3-4 rapids thanks to dam-controlled releases - proper white water whatever the weather.

Rapid Sessions (£54, 1 hour) pack maximum thrills into lunch breaks. Ultimate Rafting (2 hours) extends the fun. The Rafting Safari (£310 per raft) is perfect for groups wanting exclusive boat hire.

This is the real deal - natural river rapids, not an artificial course. The setting in Snowdonia National Park is stunning. 4.7 Google rating.`,
    tagline: "40 years of UK white water excellence",
    uniqueSellingPoint: 'Dam-controlled natural rapids for guaranteed white water',
    priceRange: '£54-£310',
    googleRating: '4.7',
  },
  {
    name: 'Snowdonia Adventures',
    slug: 'snowdonia-adventures',
    category: 'activity_provider',
    regions: ['snowdonia'],
    activityTypes: ['scrambling', 'hill-walking', 'climbing'],
    website: 'https://www.snowdonia-adventures.co.uk',
    description: `Snowdonia Adventures specialises in guided scrambles across Eryri's finest ridgelines - Tryfan North Ridge, Crib Goch, the Glyders, and the complete Snowdon Horseshoe. If you want to move beyond straightforward hillwalking, they'll get you there safely.

Their scrambling experiences suit various abilities: introductory scrambles on Y Gribin teach techniques before committing to exposed ridges. Tryfan North Ridge (Grade 1) delivers proper scrambling with the famous Adam and Eve stones at the summit. Crib Goch (Grade 1, very exposed) requires head for heights.

Guides are qualified Mountain Leaders with extensive local knowledge. Small groups (max 6) ensure everyone gets support on technical sections.`,
    tagline: "Wales' finest ridge scrambles",
    uniqueSellingPoint: 'Specialists in Tryfan, Crib Goch, and technical ridgelines',
    priceRange: '£95-£180',
    googleRating: '5.0',
  },
  {
    name: 'Dan yr Ogof Showcaves',
    slug: 'dan-yr-ogof-showcaves',
    category: 'activity_provider',
    regions: ['brecon-beacons'],
    activityTypes: ['caving', 'family-attraction'],
    website: 'https://www.showcaves.co.uk',
    description: `Dan yr Ogof is the largest showcave complex in Britain, offering a gentler underground experience than adventure caving. Three separate cave systems - Dan yr Ogof, Cathedral Cave, and Bone Cave - reveal stunning formations without the crawling.

Walkthrough tours suit all abilities and ages, with dramatic stalactites, underground lakes, and the famous "Dome of St Paul's" chamber. The Dinosaur Park adds family appeal with life-sized dinosaur models.

While not an adventure caving experience, Dan yr Ogof provides accessible underground exploration for those who'd never consider wetsuit caving. The formations are genuinely impressive.`,
    tagline: "Britain's largest showcave complex",
    uniqueSellingPoint: 'Accessible underground wonder for all ages',
    priceRange: '£15-£20',
    googleRating: '4.4',
  },
  {
    name: 'Black Mountain Activities',
    slug: 'black-mountain-activities',
    category: 'activity_provider',
    regions: ['brecon-beacons'],
    activityTypes: ['canyoning', 'gorge-walking', 'caving', 'sup'],
    website: 'https://www.blackmountainactivities.co.uk',
    description: `Black Mountain Activities operates from the western Brecon Beacons, accessing excellent gorge walking, canyoning, and adventure caving in the Black Mountain area. Their location means less crowded venues and more wilderness feel.

Gorge walking sessions follow mountain streams, involving scrambling over waterfalls, sliding down natural water chutes, and jumping into pools. Canyoning adds abseiling to the mix. Adventure caving explores the extensive cave systems beneath the Brecon Beacons.

Best for: Groups wanting active Brecon Beacons adventures away from crowds.`,
    tagline: 'Western Beacons adventure specialists',
    uniqueSellingPoint: 'Less crowded venues in the Black Mountain area',
    priceRange: '£45-£85',
    googleRating: '4.9',
  },
];

async function main() {
  console.log('🏔️ Enriching Adventure Wales Operator Directory\n');

  // Update existing operators with enriched descriptions
  console.log('📝 Updating existing operators...\n');
  
  for (const op of enrichedOperators) {
    try {
      const result = await sql`
        UPDATE operators 
        SET 
          description = ${op.description},
          tagline = ${op.tagline},
          unique_selling_point = ${op.uniqueSellingPoint},
          price_range = ${op.priceRange},
          updated_at = NOW()
        WHERE slug = ${op.slug}
        RETURNING name
      `;

      if (result.length > 0) {
        console.log(`✅ Updated: ${result[0].name}`);
      } else {
        console.log(`⚠️ Not found: ${op.slug}`);
      }
    } catch (err: any) {
      console.error(`❌ Error updating ${op.slug}:`, err.message);
    }
  }

  // Add new operators
  console.log('\n➕ Adding new operators...\n');

  for (const op of newOperators) {
    try {
      // Check if already exists
      const existing = await sql`SELECT id FROM operators WHERE slug = ${op.slug}`;
      
      if (existing.length > 0) {
        console.log(`⏭️ Already exists: ${op.name}`);
        continue;
      }

      await sql`
        INSERT INTO operators (
          site_id, name, slug, category, regions, activity_types, website,
          description, tagline, unique_selling_point, price_range, google_rating
        ) VALUES (
          ${SITE_ID}, ${op.name}, ${op.slug}, ${op.category}, ${op.regions}, ${op.activityTypes}, ${op.website},
          ${op.description}, ${op.tagline}, ${op.uniqueSellingPoint}, ${op.priceRange}, ${op.googleRating}
        )
      `;
      
      console.log(`✅ Added: ${op.name}`);
    } catch (err: any) {
      console.error(`❌ Error adding ${op.name}:`, err.message);
    }
  }

  // Clean up duplicate with fewer details (ll-n-adventures was already removed)
  console.log('\n🧹 Cleaning up...\n');
  
  // Update the duplicate Adventures Wales entry with the better one
  try {
    // Delete the stub entry (id 95 with short description)
    const result = await sql`
      DELETE FROM operators 
      WHERE slug = 'adventures-wales' AND id = 95
      RETURNING name
    `;
    if (result.length > 0) {
      console.log(`🗑️ Removed duplicate Adventures Wales stub entry`);
    }
  } catch (err: any) {
    console.log(`⚠️ Could not remove duplicate: ${err.message}`);
  }

  console.log('\n✨ Operator enrichment complete!');
}

main().catch(console.error);
