/**
 * Operator Directory Enrichment Script
 * 
 * Run with:
 * DATABASE_URL="postgresql://neondb_owner:npg_9KwogLV1dZAG@ep-delicate-wave-abcma093-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require" npx tsx scripts/enrich-operators.ts
 */

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Enriched operator data based on deep research
const enrichedOperators: Array<{
  slug: string;
  description: string;
  tagline?: string;
  uniqueSellingPoint?: string;
  priceRange?: string;
}> = [
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

What makes Preseli special is their "leave no trace" philosophy and purpose-built eco-lodge accommodation. They offer multi-day adventure packages combining coasteering with surfing, kayaking, and wild swimming. Perfect for environmentally-minded adventurers and families wanting an immersive coastal experience. Groups up to 12, suitable for ages 8+.`,
    uniqueSellingPoint: 'Eco-conscious adventures with sustainable lodge accommodation',
    priceRange: '£52-£85'
  },
  {
    slug: 'activity-pembrokeshire',
    tagline: 'Small groups, big adventures',
    description: `Activity Pembrokeshire specialises in intimate, personalised coastal adventures with a maximum group size of 8 - meaning more attention, more flexibility, and more time in the water. Based in Pembrokeshire, they focus exclusively on coasteering and sea kayaking, doing both exceptionally well.

Their coasteering sessions explore the spectacular geology around St Davids Peninsula, with guides who genuinely love sharing the coastline's secrets. Expect sea caves carved over millennia, natural rock pools teeming with life, and cliff jumps tailored to your comfort level.

With a perfect 5.0 Google rating, reviews consistently mention the personal touch - guides remembering names, adapting routes to conditions, and going above and beyond to create memorable experiences. Ideal for families with nervous first-timers, couples wanting quality time, or small groups who don't want to be lost in a crowd.`,
    uniqueSellingPoint: 'Maximum 8 per group for personalised attention',
    priceRange: '£55-£75'
  },

  // MOUNTAIN BIKING
  {
    slug: 'bikepark-wales',
    tagline: "The UK's premier downhill mountain bike destination",
    description: `BikePark Wales is Britain's answer to world-class bike parks, purpose-built on a former coal mine in the Brecon Beacons. With over 40 trails across 500m of vertical descent, it caters to everyone from nervous beginners to professional downhillers.

Green and blue trails offer flowing berms, gentle jumps, and confidence-building descents. Red and black runs deliver serious technical challenges with rock gardens, drops, and jumps. The efficient minibus uplift (£36-50/day) means maximum runs with minimum pedalling.

Bike hire from £99/day includes quality downhill rigs. Their "Ticket to Ride" family packages (£325 for 4) include guided coaching, bikes, and uplift - perfect for family introduction days. Facilities include bike wash, well-stocked shop, and excellent café.

Pro tip: Weekday mornings offer shorter lift queues. Book ahead for busy weekends. 4.8 Google rating with riders praising trail variety and maintenance.`,
    uniqueSellingPoint: "UK's largest purpose-built bike park with 40+ trails",
    priceRange: '£8-£50 (pedal to full uplift)'
  },
  {
    slug: 'antur-stiniog',
    tagline: 'Steep, raw, and utterly Welsh',
    description: `Antur Stiniog is the antidote to sanitised bike parks. Carved into the slate mountains above Blaenau Ffestiniog, these trails are steeper, rawer, and more technical than anywhere else in Wales. If you want to test yourself against proper mountain terrain, this is it.

The gradient here is exceptional - over 350m descent on some runs. Trails range from flowing blue-graded descents through ancient woodland to brutal black runs that challenge even expert riders. The uplift service runs Land Rovers up the mountain, adding to the back-country atmosphere.

Bike hire available on-site, including e-MTBs for exploring the wider trails. The café has that proper mountain-sports vibe - muddy boots welcome, hearty food, local banter. 4.8 Google rating, with riders praising the "real mountain biking" experience.

Best for: Intermediate to expert riders wanting challenging terrain. Beginners should build confidence at Coed y Brenin first.`,
    uniqueSellingPoint: 'Steepest descents in Wales with authentic mountain atmosphere',
    priceRange: '£25-£40'
  },
  {
    slug: 'coed-y-brenin-nrw',
    tagline: "Wales' original trail centre",
    description: `Coed y Brenin pioneered purpose-built mountain bike trails in the UK back in 1996, and it remains one of Britain's finest riding destinations. Set in a stunning Snowdonia forest, it offers everything from gentle family-friendly routes to technical single-track that'll test any rider.

Unlike bike parks, Coed y Brenin is pedal-powered - you earn your descents. The famous MBR trail serves up 18km of flowing single-track, while the Beast delivers 38km of challenging terrain. Forest roads provide easier options for families and beginners.

The visitor centre includes bike wash, excellent café, and connection to Brenin Bikes for quality hire. Trails are exceptionally well-maintained by Natural Resources Wales. Free trail access (small parking charge) makes it outstanding value.

Perfect for: All abilities, especially those who enjoy the full mountain biking experience rather than just descending. Combine with walks on the numerous hiking trails.`,
    uniqueSellingPoint: 'Free world-class trails in stunning Snowdonia forest',
    priceRange: 'Free (parking £5-7)'
  },

  // NATIONAL CENTRES
  {
    slug: 'plas-y-brenin',
    tagline: 'The National Outdoor Centre',
    description: `Plas y Brenin is THE place to develop outdoor skills in the UK. As the National Outdoor Centre, it's trained generations of mountaineers, climbers, paddlers, and outdoor professionals from its stunning location in the heart of Snowdonia.

Courses cover everything from complete beginner hill skills (2 days, 1:8 ratio) to advanced mountaineering instructor qualifications. Personal instruction runs £350/day for 1:1 coaching from world-class instructors - worth every penny for accelerated learning.

What makes Plas y Brenin special is the depth of expertise. Many instructors literally wrote the books on outdoor education. The facilities are exceptional: indoor climbing walls, paddling pool, library, comfortable accommodation, and a legendary bar where mountain stories flow.

Ideal for: Anyone serious about developing outdoor skills, from absolute beginners to aspiring professionals. Book courses well ahead - they fill up quickly.`,
    uniqueSellingPoint: 'UK national centre with unmatched instructor expertise',
    priceRange: '£150-£400 (courses vary)'
  },
  {
    slug: 'plas-menai',
    tagline: "Wales' National Watersports Centre",
    description: `Plas Menai is Wales' premier watersports facility, perfectly positioned on the Menai Strait between Anglesey and the mainland. The strait's unique tidal flows and sheltered waters create ideal learning conditions for everything from dinghy sailing to powerboating.

Courses range from RYA qualifications (Start Sailing, Day Skipper) to taster sessions for families. Their sea kayaking explores Anglesey's dramatic coastline with potential seal and seabird encounters. Windsurfing and SUP benefit from the consistent winds.

Accommodation on-site makes multi-day courses convenient, and the location offers easy access to Snowdonia's mountains for combined water/mountain adventures. 4.6 Google rating with reviews praising professional instruction and stunning location.

Best for: Anyone wanting formal watersports qualifications in a stunning location. Family groups benefit from the range of activities available.`,
    uniqueSellingPoint: 'National centre with RYA qualifications on the Menai Strait',
    priceRange: '£80-£300 (courses vary)'
  },

  // SNOWDONIA GUIDES
  {
    slug: 'mountainxperience',
    tagline: 'Gold Award Snowdonia guiding',
    description: `MountainXperience has earned Gold Snowdonia Ambassador status for their exceptional guided experiences across Eryri (Snowdonia). Whether you want to summit Snowdon avoiding the crowds, tackle the infamous Crib Goch scramble, or master navigation skills, they deliver.

Their signature experiences include guided Snowdon walks via quiet routes (Rhyd Ddu, Watkin Path), Crib Goch scrambles for those ready for exposure and scrambling, and the complete Snowdon Horseshoe for the ambitious. Wild camping experiences add an extra dimension.

Guides are qualified Mountain Leaders with genuine passion for sharing Snowdonia's mountains safely. Small groups (max 6) ensure personal attention. 5.0 Google rating with reviews highlighting guides' local knowledge and ability to match challenges to abilities.

Perfect for: First-time Snowdon visitors wanting expertise, experienced hillwalkers ready for scrambling, and anyone wanting to avoid the Llanberis Path crowds.`,
    uniqueSellingPoint: 'Gold Snowdonia Ambassador with expert local guides',
    priceRange: '£45-£120'
  },

  // SURF SCHOOLS
  {
    slug: 'llangennith-surf-school',
    tagline: "Gower's original surf school",
    description: `Llangennith Surf School operates on one of Britain's finest surf beaches - a 3-mile sweep of consistent waves backed by Rhossili's dramatic cliffs. They've taught thousands to surf since 1988, and their instructors' local knowledge is unmatched.

Two-hour lessons cover beach safety, paddling technique, and standing up - most beginners ride waves by the end. All equipment included: quality wetsuits, soft-top boards, and rash vests. Group lessons keep costs reasonable while private sessions accelerate learning.

What sets Llangennith apart is the beach itself - proper Atlantic waves, far less crowded than Cornwall, with stunning scenery. The surf shop stocks quality gear and the team genuinely stoke about getting people into surfing.

Perfect 5.0 Google rating. Best for: Beginners wanting quality instruction, families, and surfers looking to escape crowded breaks. Check conditions and tides - they'll advise on optimal lesson times.`,
    uniqueSellingPoint: 'Premier Atlantic beach with consistent beginner-friendly waves',
    priceRange: '£35-£75'
  },
  {
    slug: 'outer-reef-surf-school',
    tagline: 'Pembrokeshire surf and coasteering',
    description: `Outer Reef combines top-quality surf instruction with coasteering adventures across Pembrokeshire's best beaches. Based near Freshwater West (featured in Harry Potter), they access some of Wales' finest surf spots.

Surf lessons run at beaches suited to conditions - Freshwater West for experienced surfers, Broad Haven and Newgale for beginners. Instruction covers everything from first-time foam board sessions to performance coaching for intermediates wanting to progress.

Their coasteering sessions explore Pembrokeshire's dramatic sea cliffs, and combo days mixing surf and coasteering make excellent group experiences. 4.9 Google rating praises the team's energy and local expertise.

Best for: Families wanting beach-based activities, stag/hen groups, and anyone wanting to combine surfing with other coastal adventures. Westfield accommodation packages available.`,
    uniqueSellingPoint: 'Multi-activity coastal adventures at iconic Pembrokeshire beaches',
    priceRange: '£40-£75'
  },
  {
    slug: 'hells-mouth-surf-school',
    tagline: 'Learn to surf on the Llŷn Peninsula',
    description: `Hell's Mouth (Porth Neigwl) offers one of Wales' most consistent surf beaches - a 4-mile bay catching Atlantic swells that other spots miss. Hell's Mouth Surf School has taught on this beach for years, understanding exactly where and when conditions suit different abilities.

Lessons run for all levels, with the gently shelving beach perfect for beginners. The relatively uncrowded waters mean more waves and less stress than busier surf destinations. Equipment quality is excellent, with proper winter wetsuits for year-round surfing.

The Llŷn Peninsula setting is spectacular - this is Welsh surfing as it should be: dramatic cliffs, clean water, and proper community feel. 5.0 Google rating from surfers who appreciate the personal touch and local knowledge.

Perfect for: Surfers wanting to escape crowds, families on Llŷn Peninsula holidays, and anyone seeking authentic Welsh surf culture.`,
    uniqueSellingPoint: 'Uncrowded 4-mile beach with consistent year-round waves',
    priceRange: '£40-£70'
  },

  // ZIP WORLD
  {
    slug: 'zip-world',
    tagline: 'Epic adventures in epic locations',
    description: `Zip World has transformed disused Welsh quarries and mines into world-class adventure attractions. From the world's fastest zip line to underground trampolining, they've created experiences that simply don't exist anywhere else.

Velocity at Penrhyn Quarry sends you flying at 100mph over a flooded slate quarry - utterly exhilarating. Titan is Europe's longest zip line at 1.5km. Bounce Below lets you bounce on giant trampolines in Victorian slate caverns. Quarry Karts combines go-karting with mountain terrain.

Multiple sites across North Wales (Penrhyn Quarry, Llechwedd, Betws-y-Coed) mean there's always something nearby. Book ahead for popular activities, especially school holidays. 4.8 Google rating with visitors consistently amazed by the unique settings.

Best for: Thrill-seekers, families (age requirements vary by activity), and anyone wanting "bucket list" Welsh experiences. Combine multiple activities for full adventure days.`,
    uniqueSellingPoint: "World record-breaking zip lines in spectacular quarry settings",
    priceRange: '£25-£100'
  },

  // ANGLESEY
  {
    slug: 'anglesey-adventures',
    tagline: 'Island adventures by sea',
    description: `Anglesey Adventures unlocks the island's spectacular coastline through sea kayaking, coasteering, and SUP. Based on Anglesey, they access sea caves, hidden beaches, and wildlife-rich waters that most visitors never see.

Sea kayaking trips (from £55 adults, £40 children) explore dramatic cliffs and caves, with wildlife encounters including seals, porpoises, and diverse seabirds. The Wildlife Kayaking Tour to Puffin Island is particularly special during breeding season. Coasteering sessions tackle the island's rugged northwest coast.

What sets Anglesey Adventures apart is their wildlife focus - guides are genuinely knowledgeable about marine ecology and time trips for optimal encounters. Small groups (max 8) ensure everyone gets close to the action.

4.9 Google rating. Best for: Wildlife enthusiasts, families, and anyone wanting to explore Anglesey's coast beyond the beaches.`,
    uniqueSellingPoint: 'Wildlife-focused paddling with potential seal and puffin encounters',
    priceRange: '£40-£135'
  },

  // ADVENTURE BRITAIN
  {
    slug: 'adventure-britain',
    tagline: 'Brecon Beacons multi-activity base',
    description: `Adventure Britain operates from a 70-acre outdoor pursuits centre at the top of the Swansea Valley, making them ideally placed for Brecon Beacons adventures. Their speciality is multi-activity packages combining accommodation with activities like caving, canyoning, climbing, and gorge walking.

The "Big Four" weekend (£365pp) includes caving, canyoning, Pen y Fan summit, and canoeing with 2 nights half-board - exceptional value for a properly packed adventure weekend. Their caving trips access some of South Wales' finest cave systems.

Bunkhouse accommodation keeps groups together, and all transport between activities is included. 5.0 Google rating with reviews praising the value, variety, and guide expertise.

Best for: Groups wanting action-packed weekends, families wanting multi-activity experiences, stag/hen parties seeking active adventures. Book full packages for best value.`,
    uniqueSellingPoint: '70-acre activity base with all-inclusive adventure packages',
    priceRange: '£115-£365'
  },

  // GOWER OPERATORS  
  {
    slug: 'gower-activity-centres',
    tagline: 'Gower family adventures',
    description: `Gower Activity Centres has been introducing families to coastal adventures since 1989. Operating across the Gower Peninsula's stunning beaches and coastline, they offer coasteering, surfing, kayaking, and multi-activity days designed to get everyone involved.

Coasteering sessions explore Gower's sea caves, rock arches, and tidal pools. Their approach prioritises fun and safety in equal measure, making them ideal for families with mixed abilities and ages. Multi-activity days let groups sample several adventures.

The team knows Gower intimately, adapting sessions to conditions and abilities. They work extensively with schools and youth groups, so child-friendly instruction comes naturally. 4.8 Google rating reflects consistent quality.

Best for: Families, school groups, youth organisations, and anyone wanting a gentle introduction to coastal adventures in a stunning setting.`,
    uniqueSellingPoint: 'Family-specialist with 35+ years Gower experience',
    priceRange: '£35-£65'
  },
  {
    slug: 'rip-n-rock',
    tagline: 'Surf, climb, coasteer on the Gower',
    description: `Rip N Rock brings infectious enthusiasm to Gower's adventure scene. Specialising in surfing, climbing, and coasteering, they're known for high-energy sessions that leave you buzzing.

Coasteering on Gower's limestone cliffs offers unique geology - sea caves, blowholes, and dramatic rock formations different from Pembrokeshire's volcanic coast. Surf lessons at Caswell and Langland benefit from sheltered conditions. Rock climbing at accessible Gower crags provides proper outdoor experience without long approaches.

The team's passion is genuine - these are people who live for adventures and love sharing them. 5.0 Google rating with reviews consistently mentioning the fun, energetic atmosphere.

Perfect for: Adventurous families, friend groups, and anyone wanting enthusiastic guides who'll push you just enough to achieve more than you expected.`,
    uniqueSellingPoint: 'Energetic guides with triple-activity expertise',
    priceRange: '£40-£70'
  },

  // LLANGORSE
  {
    slug: 'llangorse-multi-activity-centre',
    tagline: 'Brecon Beacons family adventure hub',
    description: `Llangorse Multi Activity Centre offers an enormous range of adventures around Wales' largest natural lake. From indoor climbing and high ropes to water sports and horse riding, they can fill a week without repetition.

The lakeside setting is stunning, with the Brecon Beacons rising behind. Water activities include kayaking, canoeing, SUP, and sailing. Land-based options span climbing walls, zip lines, and rope courses. Horse riding treks explore the surrounding countryside.

Purpose-built facilities make this ideal for families and groups - everything is on-site, well-maintained, and designed for accessibility. Multi-activity packages offer excellent value. 4.7 Google rating praises variety and family-friendly approach.

Best for: Families wanting variety, groups with mixed interests, and anyone wanting multiple activities from one convenient base.`,
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
    activity_types: ['coasteering'],
    website: 'https://www.celticquestcoasteering.com',
    description: `Celtic Quest is Pembrokeshire's most affordable coasteering operator without compromising quality. Established in 2008, this micro-business focuses exclusively on coasteering, and they do it brilliantly.

Half-day sessions from just £39-55 include all equipment (5mm wetsuits, helmets, buoyancy aids, gloves, hoods) and expert guidance. Sessions explore the coast around Abereiddy, finishing at the famous Blue Lagoon. Everything is optional - guides tailor jumps and challenges to individual comfort levels.

What sets Celtic Quest apart is the value-for-money and personal attention. Reviews consistently mention guides who remember names and create a fun, supportive atmosphere. They'll take photos and videos (£20) capturing your adventure.

Perfect 5-star TripAdvisor reviews. Best for: Budget-conscious adventurers, families with nervous first-timers, and anyone wanting genuine Pembrokeshire coasteering without premium prices.`,
    tagline: 'Quality coasteering at honest prices',
    unique_selling_point: 'Best-value coasteering in Pembrokeshire',
    price_range: '£39-£55',
    google_rating: '5.0',
  },
  {
    name: 'Go Below Underground Adventures',
    slug: 'go-below-underground',
    category: 'activity_provider',
    regions: ['snowdonia'],
    activity_types: ['caving', 'zip-lining', 'adventure'],
    website: 'https://www.go-below.co.uk',
    description: `Go Below takes you into the otherworldly depths of abandoned Victorian slate mines beneath Snowdonia. This isn't caving - it's underground adventure on an industrial scale, with zip lines, scrambles, and boat journeys through vast caverns.

The Challenge Adventure (£69, age 10+) includes underground zip lines, rope bridges, and boat crossings through flooded tunnels. Hero Xtreme (£79, age 12+) ups the ante with longer routes and bigger features. Ultimate Xtreme (£109, age 18+) is a 7-hour epic reaching 1,375 feet below surface - the deepest public access point in the UK.

What makes Go Below unique is the sheer scale - these are enormous Victorian industrial caverns, not tight potholing passages. Claustrophobes generally cope fine. Deep Sleep overnight stays (from £399) include sleeping in underground cabins.

Reviews are exceptional. Best for: Adventurers wanting something genuinely different, groups seeking unique experiences, and anyone fascinated by industrial heritage.`,
    tagline: "The UK's deepest underground adventure",
    unique_selling_point: 'Deepest public access point in UK at 1,375 feet',
    price_range: '£69-£399',
    google_rating: '4.9',
  },
  {
    name: 'National White Water Centre',
    slug: 'national-white-water-centre',
    category: 'activity_provider',
    regions: ['snowdonia'],
    activity_types: ['rafting', 'kayaking', 'canyoning'],
    website: 'https://www.nationalwhitewatercentre.co.uk',
    description: `The National White Water Centre at Bala has been the UK's premier natural white water venue for 40 years. The River Tryweryn delivers consistent Grade 3-4 rapids thanks to dam-controlled releases - proper white water whatever the weather.

Rapid Sessions (£54, 1 hour) pack maximum thrills into lunch breaks. Ultimate Rafting (2 hours) extends the fun. The Rafting Safari (£310 per raft) is perfect for groups wanting exclusive boat hire. Canyoning in the Tryweryn Valley adds gorge walking and waterfall jumps.

This is the real deal - natural river rapids, not an artificial course. The setting in Snowdonia National Park is stunning, and the centre's facilities include changing rooms, café, and riverside viewing.

For independent paddlers, facility fees (£20/day, £13 for NGB members) access the rapids. 4.7 Google rating. Best for: Thrill-seekers, groups wanting guaranteed white water, and kayakers wanting world-class training waves.`,
    tagline: "40 years of UK white water excellence",
    unique_selling_point: 'Dam-controlled natural rapids for guaranteed white water',
    price_range: '£54-£310',
    google_rating: '4.7',
  },
  {
    name: 'Snowdonia Adventures',
    slug: 'snowdonia-adventures',
    category: 'activity_provider',
    regions: ['snowdonia'],
    activity_types: ['scrambling', 'hill-walking', 'climbing'],
    website: 'https://www.snowdonia-adventures.co.uk',
    description: `Snowdonia Adventures specialises in guided scrambles across Eryri's finest ridgelines - Tryfan North Ridge, Crib Goch, the Glyders, and the complete Snowdon Horseshoe. If you want to move beyond straightforward hillwalking, they'll get you there safely.

Their scrambling experiences suit various abilities: introductory scrambles on Y Gribin teach techniques before committing to exposed ridges. Tryfan North Ridge (Grade 1) delivers proper scrambling with the famous Adam and Eve stones at the summit. Crib Goch (Grade 1, very exposed) requires head for heights but is achievable with guidance.

Guides are qualified Mountain Leaders with extensive local knowledge. Small groups (max 6) ensure everyone gets support on technical sections. Winter mountaineering courses available November-March.

Best for: Hillwalkers ready to progress, confident scramblers wanting company on exposed ridges, and anyone wanting to tick off Wales' classic mountaineering challenges.`,
    tagline: "Wales' finest ridge scrambles",
    unique_selling_point: 'Specialists in Tryfan, Crib Goch, and technical ridgelines',
    price_range: '£95-£180',
    google_rating: '5.0',
  },
  {
    name: 'Dan yr Ogof Showcaves',
    slug: 'dan-yr-ogof-showcaves',
    category: 'activity_provider',
    regions: ['brecon-beacons'],
    activity_types: ['caving', 'family-attraction'],
    website: 'https://www.showcaves.co.uk',
    description: `Dan yr Ogof is the largest showcave complex in Britain, offering a gentler underground experience than adventure caving. Three separate cave systems - Dan yr Ogof, Cathedral Cave, and Bone Cave - reveal stunning formations without the crawling and squeezing.

Walkthrough tours suit all abilities and ages, with dramatic stalactites, underground lakes, and the famous "Dome of St Paul's" chamber. The Dinosaur Park adds family appeal with life-sized dinosaur models (yes, really - kids love it).

While not an adventure caving experience, Dan yr Ogof provides accessible underground exploration for those who'd never consider wetsuit caving. The formations are genuinely impressive, and the scale of the caverns is awe-inspiring.

Perfect for: Families with young children, those curious about caves but not ready for adventure caving, and wet-weather day-trip seekers in the Brecon Beacons.`,
    tagline: "Britain's largest showcave complex",
    unique_selling_point: 'Accessible underground wonder for all ages',
    price_range: '£15-£20',
    google_rating: '4.4',
  },
  {
    name: 'Black Mountain Activities',
    slug: 'black-mountain-activities',
    category: 'activity_provider',
    regions: ['brecon-beacons'],
    activity_types: ['canyoning', 'gorge-walking', 'caving', 'sup'],
    website: 'https://www.blackmountainactivities.co.uk',
    description: `Black Mountain Activities operates from the western Brecon Beacons, accessing excellent gorge walking, canyoning, and adventure caving in the Black Mountain area. Their location means less crowded venues and more wilderness feel.

Gorge walking sessions follow mountain streams, involving scrambling over waterfalls, sliding down natural water chutes, and jumping into pools. Canyoning adds abseiling to the mix. Adventure caving explores the extensive cave systems beneath the Brecon Beacons.

SUP on the Usk Reservoir provides calmer contrast, and they offer multi-activity days combining water and underground adventures.

Best for: Groups wanting active Brecon Beacons adventures away from crowds, families ready for wet and wild experiences, and anyone drawn to the quieter western mountains.`,
    tagline: 'Western Beacons adventure specialists',
    unique_selling_point: 'Less crowded venues in the Black Mountain area',
    price_range: '£45-£85',
    google_rating: '4.9',
  },
];

async function main() {
  console.log('🏔️ Enriching Adventure Wales Operator Directory\n');

  // Update existing operators with enriched descriptions
  console.log('📝 Updating existing operators...\n');
  
  for (const op of enrichedOperators) {
    try {
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (op.description) {
        updateFields.push(`description = $${paramIndex++}`);
        values.push(op.description);
      }
      if (op.tagline) {
        updateFields.push(`tagline = $${paramIndex++}`);
        values.push(op.tagline);
      }
      if (op.uniqueSellingPoint) {
        updateFields.push(`unique_selling_point = $${paramIndex++}`);
        values.push(op.uniqueSellingPoint);
      }
      if (op.priceRange) {
        updateFields.push(`price_range = $${paramIndex++}`);
        values.push(op.priceRange);
      }

      values.push(op.slug);

      const result = await sql(`
        UPDATE operators 
        SET ${updateFields.join(', ')}, updated_at = NOW()
        WHERE slug = $${paramIndex}
        RETURNING name
      `, values);

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
          name, slug, category, regions, activity_types, website,
          description, tagline, unique_selling_point, price_range, google_rating
        ) VALUES (
          ${op.name}, ${op.slug}, ${op.category}, ${op.regions}, ${op.activity_types}, ${op.website},
          ${op.description}, ${op.tagline}, ${op.unique_selling_point}, ${op.price_range}, ${op.google_rating}
        )
      `;
      
      console.log(`✅ Added: ${op.name}`);
    } catch (err: any) {
      console.error(`❌ Error adding ${op.name}:`, err.message);
    }
  }

  // Remove duplicates (keep the one with longer description)
  console.log('\n🧹 Checking for duplicates...\n');
  
  const duplicateSlugs = [
    { keep: 'hells-mouth-surf-school', remove: 'hell-s-mouth-surf-school' },
    { keep: 'llyn-adventures', remove: 'll-n-adventures' },
  ];

  for (const dup of duplicateSlugs) {
    try {
      const result = await sql`
        DELETE FROM operators WHERE slug = ${dup.remove} RETURNING name
      `;
      if (result.length > 0) {
        console.log(`🗑️ Removed duplicate: ${result[0].name} (kept ${dup.keep})`);
      }
    } catch (err: any) {
      console.error(`❌ Error removing duplicate:`, err.message);
    }
  }

  console.log('\n✨ Operator enrichment complete!');
}

main().catch(console.error);
