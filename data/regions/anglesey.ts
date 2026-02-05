/**
 * Anglesey (Ynys Môn) Region Data
 * Comprehensive content for Adventure Wales region pages
 * Last updated: February 2025
 * Sources: Perplexity research, Visit Anglesey, Isle of Anglesey Coast Path
 */

export const angleseyData = {
  slug: 'anglesey',
  name: 'Anglesey',
  welshName: 'Ynys Môn',

  heroContent: `Anglesey is Wales' island escape—714 square kilometres of flat farmland, wild coastline, and adventure opportunities you won't find on the mainland. Connected by Thomas Telford's iconic Menai Suspension Bridge (1826), this is where Snowdonia's mountains finally give way to something different: 140 miles of coastal path, consistent surf breaks, and beaches backed by dunes rather than cliffs.

The Isle of Anglesey Coastal Path circles the entire island, passing sea stacks, hidden coves, and the dramatic 400-step descent to South Stack Lighthouse. Rhosneigr is the watersports hub—kitesurfers, windsurfers, and SUP paddlers share the bay—while coasteering at Porth Ruffydd delivers cliff jumps and cave swims in crystal-clear water. Newborough Forest is home to rare red squirrels, and Beaumaris boasts a UNESCO-listed castle that Edward I never quite finished.

This is adventure at a gentler pace. The terrain is flatter than Snowdonia, the crowds thinner than Pembrokeshire, and the Welsh language is spoken everywhere. Stay in a whitewashed cottage, eat seafood landed that morning, and watch the sun set over the Irish Sea. Anglesey isn't trying to be anywhere else—and that's exactly the point.`,

  keyFacts: [
    { label: 'Area', value: '714 km² (276 sq miles)', detail: "Wales' largest island" },
    { label: 'Coastal Path', value: '140 miles (225 km)', detail: 'Circles the entire island in 12 sections' },
    { label: 'Population', value: '~70,000', detail: 'Main towns: Holyhead, Llangefni, Beaumaris' },
    { label: 'UNESCO Site', value: 'Beaumaris Castle', detail: 'Part of the Castles of Edward I in Gwynedd' },
    { label: 'Connection', value: '2 bridges to mainland', detail: 'Menai Suspension (1826) and Britannia Bridge' },
    { label: 'Ferry Port', value: "Holyhead", detail: "UK's second-busiest passenger port (Dublin ferries)" },
    { label: 'Longest Place Name', value: 'Llanfairpwllgwyngyll...', detail: '58 letters, on the main railway line' },
    { label: 'Wildlife', value: 'Red squirrels, puffins, seals', detail: 'Newborough Forest and Puffin Island' },
    { label: 'Dark Sky Status', value: 'Dark Sky Discovery Site', detail: 'Excellent stargazing at multiple locations' },
    { label: 'Welsh Language', value: '57% Welsh speakers', detail: 'One of the most Welsh-speaking areas' },
  ],

  bestFor: [
    { rank: 1, activity: 'Coastal Walking', description: '140-mile path around the entire island—cliffs, beaches, lighthouses' },
    { rank: 2, activity: 'Coasteering', description: 'Cliff jumping and cave swimming at Porth Ruffydd and Porth Dafarch' },
    { rank: 3, activity: 'Watersports', description: 'Surfing, kitesurfing, SUP at Rhosneigr—consistent wind and waves' },
    { rank: 4, activity: 'Sea Kayaking', description: 'Menai Strait paddling, cave exploration, seal watching' },
    { rank: 5, activity: 'Wildlife Watching', description: 'Red squirrels at Newborough, puffins off Beaumaris, seals everywhere' },
    { rank: 6, activity: 'Rock Climbing', description: 'Sea cliff traverses and sport climbing at Trearddur Bay' },
    { rank: 7, activity: 'Cycling', description: 'Flat lanes, forest trails at Newborough, coastal cycle routes' },
    { rank: 8, activity: 'Beach Adventures', description: 'Huge sandy beaches at Newborough, Rhosneigr, Benllech' },
    { rank: 9, activity: 'Heritage Exploration', description: 'Beaumaris Castle, standing stones, historic bridges' },
    { rank: 10, activity: 'Boat Trips', description: 'Puffin Island cruises from Beaumaris, Menai Strait tours' },
  ],

  seasonGuide: {
    spring: {
      months: 'March - May',
      weather: '10-15°C, changeable. Sea temps 9-12°C',
      highlights: [
        'Wildflowers on the coastal path',
        'Puffins return to Puffin Island (April)',
        'Fewer crowds than summer',
        'Red squirrels active in Newborough',
      ],
      bestActivities: ['Coastal walking', 'Birdwatching', 'Cycling', 'Photography'],
      avoid: 'Exposed sections of coast path in strong winds',
    },
    summer: {
      months: 'June - August',
      weather: '18-22°C, sea temps 15-18°C. Long warm days',
      highlights: [
        'Peak watersports season',
        'All boat trips running',
        'Longest daylight for coastal walks',
        'Beaumaris events and festivals',
      ],
      bestActivities: ['Surfing', 'Coasteering', 'Sea kayaking', 'Beach days'],
      avoid: 'Rhosneigr car parks on sunny weekends—arrive early',
    },
    autumn: {
      months: 'September - November',
      weather: '10-15°C falling to 8-12°C. Sea temps 13-15°C',
      highlights: [
        'Dramatic autumn storms (storm watching)',
        'Seal pupping season',
        'Red squirrels very active',
        'Quieter coastal path',
      ],
      bestActivities: ['Coasteering', 'Walking', 'Photography', 'Wildlife watching'],
      avoid: 'Cliff edges in gales—check weather warnings',
    },
    winter: {
      months: 'December - February',
      weather: '5-10°C, sea temps 8-10°C. Windy, occasional storms',
      highlights: [
        'Empty beaches and paths',
        'Hardy watersports (big waves)',
        'Seal pups on beaches',
        'Dark sky stargazing',
      ],
      bestActivities: ['Winter walking', 'Storm watching', 'Stargazing', 'Pub days'],
      avoid: 'Rural roads can ice over. Ferry services may be disrupted by storms',
    },
  },

  insiderTips: [
    {
      tip: 'Llanddwyn Island access',
      detail: "The 'Island of Lovers' at Newborough is only accessible at low tide. Check times before walking out—you don't want to get stranded with the red squirrels.",
    },
    {
      tip: 'Rhosneigr morning hack',
      detail: 'Arrive before 10am on weekends for guaranteed parking and uncrowded waves. The afternoon crowds descend from Snowdonia.',
    },
    {
      tip: 'South Stack without crowds',
      detail: "Visit midweek for clifftop solitude. The 400 steps to the lighthouse are worth it, but weekends are rammed. Bring binoculars for seabirds.",
    },
    {
      tip: 'Porth Dafarch parking',
      detail: 'Free clifftop spots if you arrive by 9am. The pay-and-display at Trearddur Bay fills fast—park in the village and walk 10 minutes.',
    },
    {
      tip: 'Speak Welsh',
      detail: "Anglesey is 57% Welsh-speaking. Greet with 'Bore da' (good morning) or 'Diolch' (thank you)—locals appreciate the effort.",
    },
    {
      tip: 'Best seafood',
      detail: 'The Lobster Pot at Church Bay serves crabs landed by local boats. No frills, sea views, proper seafood. Book for dinner.',
    },
    {
      tip: 'Red squirrels',
      detail: 'Newborough Forest is one of the few places in Wales to see red squirrels. Walk the old railway trail early morning for best sightings.',
    },
    {
      tip: 'Quiet beach',
      detail: "Aberffraw Dunes are where locals go. Wildflowers, birds, no facilities. Pack a picnic and your rubbish.",
    },
    {
      tip: 'Menai Bridge sunset',
      detail: 'Free parking at the suspension bridge viewpoint. Watch the sun set over the Menai Strait—one of the best spots on the island.',
    },
    {
      tip: 'Coasteering booking',
      detail: 'Anglesey Adventures at Trearddur Bay run excellent sessions. Book direct—cheaper than third-party sites. Wetsuits provided.',
    },
  ],

  topExperiences: [
    {
      name: 'South Stack Lighthouse Walk',
      type: 'hiking',
      duration: '2-3 hours',
      difficulty: 'Moderate',
      description: 'Dramatic clifftop path to the iconic lighthouse. 400 steps down, seabird colonies, stunning views.',
      priceRange: 'Free',
    },
    {
      name: 'Coasteering at Porth Ruffydd',
      type: 'coasteering',
      duration: '3 hours',
      difficulty: 'Moderate',
      description: 'Cliff jumping, cave swimming, and scrambling on dramatic sea cliffs. All equipment provided.',
      priceRange: '£55-70',
    },
    {
      name: 'Anglesey Coastal Path: Trearddur to Rhoscolyn',
      type: 'hiking',
      duration: '4-5 hours',
      difficulty: 'Moderate',
      description: 'One of the best sections—sea arches, hidden coves, and the Holy Island circuit.',
      priceRange: 'Free',
    },
    {
      name: 'Surfing at Rhosneigr',
      type: 'surfing',
      duration: '2-3 hours',
      difficulty: 'All levels',
      description: "Anglesey's surf hub with consistent waves. Lessons available. Café culture après-surf.",
      priceRange: '£40-60 lesson',
    },
    {
      name: 'Puffin Island Boat Trip',
      type: 'wildlife',
      duration: '2 hours',
      difficulty: 'Any',
      description: 'Cruise from Beaumaris past seals and around Puffin Island. Best April-July for puffins.',
      priceRange: '£15-25',
    },
    {
      name: 'Newborough Forest Red Squirrel Walk',
      type: 'wildlife',
      duration: '2-3 hours',
      difficulty: 'Easy',
      description: "One of Wales' few red squirrel habitats. Walk the old railway trail for best sightings.",
      priceRange: 'Free (parking £5)',
    },
    {
      name: 'Beaumaris Castle Visit',
      type: 'heritage',
      duration: '2 hours',
      difficulty: 'Easy',
      description: "Edward I's unfinished masterpiece—UNESCO-listed, perfectly symmetrical, remarkably intact.",
      priceRange: '£9',
    },
    {
      name: 'Sea Kayaking the Menai Strait',
      type: 'kayaking',
      duration: '3-4 hours',
      difficulty: 'Intermediate',
      description: 'Paddle beneath the bridges, explore the strait, spot seals. Tidal conditions—guides essential.',
      priceRange: '£50-70',
    },
    {
      name: 'Llanddwyn Island Walk',
      type: 'hiking',
      duration: '3-4 hours',
      difficulty: 'Easy',
      description: "The 'Island of Lovers' at Newborough. Lighthouse ruins, beaches, views to Snowdonia.",
      priceRange: 'Free (parking £5)',
    },
    {
      name: 'Kitesurfing at Rhosneigr',
      type: 'kitesurfing',
      duration: '3 hours',
      difficulty: 'Intermediate',
      description: "Wales' premier kitesurfing spot. Consistent winds, sandy beach, schools for beginners.",
      priceRange: '£150-200 lesson',
    },
    {
      name: 'Bwa Gwyn Sea Arch Walk',
      type: 'hiking',
      duration: '2 hours',
      difficulty: 'Easy',
      description: 'Coastal path to a dramatic natural arch. Part of the Isle of Anglesey Coastal Path.',
      priceRange: 'Free',
    },
    {
      name: 'Stand-Up Paddleboarding at Rhoscolyn',
      type: 'paddleboarding',
      duration: '2-3 hours',
      difficulty: 'Beginner',
      description: 'Sheltered bay for SUP, crystal-clear water, seal sightings common. Rentals available.',
      priceRange: '£30-50 hire',
    },
  ],

  faqs: [
    {
      question: 'How long does it take to walk around Anglesey?',
      answer: 'The Isle of Anglesey Coastal Path is 140 miles, typically walked in 10-14 days. It divides into 12 official sections, each walkable in 4-8 hours. You can also do day walks of the best sections.',
    },
    {
      question: 'Can I see puffins on Anglesey?',
      answer: "Puffin Island (off Beaumaris) has a colony visible from boat trips April-July. You can't land on the island, but boats get close. Seabirds also nest at South Stack cliffs.",
    },
    {
      question: 'Is Anglesey good for surfing?',
      answer: "Yes! Rhosneigr is the main spot with consistent waves and several surf schools. The beach break suits all abilities. Also good for kitesurfing and windsurfing. Traeth Lligwy on the north coast works in different conditions.",
    },
    {
      question: 'How do I get to Anglesey without a car?',
      answer: "Train to Bangor (3-4 hours from London), then bus across the Menai Bridge. Or train direct to Holyhead (on Anglesey). Local buses connect main villages, but are infrequent. A car gives most flexibility.",
    },
    {
      question: 'Where are the best beaches on Anglesey?',
      answer: 'Newborough/Llanddwyn for drama and red squirrels. Rhosneigr for watersports. Benllech for families (facilities, lifeguards). Traeth Lligwy for peace. Porth Dafarch for coasteering access.',
    },
    {
      question: 'What is Llanddwyn Island?',
      answer: "The 'Island of Lovers' at Newborough—actually a tidal peninsula. Named for St Dwynwen (Welsh patron saint of lovers). Lighthouse ruins, crosses, beaches with Snowdonia views. Check tides before walking out.",
    },
    {
      question: 'Is Beaumaris Castle worth visiting?',
      answer: "Absolutely. It's a UNESCO World Heritage Site and considered Edward I's finest castle design—perfectly symmetrical, remarkably intact despite never being finished. Allow 1-2 hours.",
    },
    {
      question: 'Do I need to book activities in advance?',
      answer: 'In summer, yes—especially coasteering, boat trips, and surf lessons. Shoulder seasons are more flexible. Accommodation also books up, especially in August.',
    },
    {
      question: 'Is Anglesey family-friendly?',
      answer: 'Very. Flat terrain suits all abilities. Benllech and Rhosneigr beaches have facilities. Newborough Forest is pushchair-accessible. Sea Zoo and Anglesey Model Village entertain kids.',
    },
    {
      question: 'Can I wild camp on Anglesey?',
      answer: "You need landowner permission. The coast path has designated campsites. Newborough Forest has a campsite. Discreet wild camping in dunes is sometimes tolerated if you leave no trace.",
    },
  ],

  hiddenGems: [
    {
      name: 'Aberffraw Dunes',
      type: 'Beach/Dunes',
      description: "Where locals go when tourists descend on Newborough. Wildflowers, birdlife, no facilities. Proper escape.",
      location: 'West Anglesey',
    },
    {
      name: 'Church Bay',
      type: 'Beach',
      description: 'Tiny sandy cove with the Lobster Pot café and genuine local character. Best crab sandwiches on the island.',
      location: 'North-west coast',
    },
    {
      name: 'Parys Mountain',
      type: 'Industrial heritage',
      description: 'Otherworldly former copper mine with orange and purple landscapes. Walking trails through lunar terrain.',
      location: 'Near Amlwch',
    },
    {
      name: 'Rhoscolyn',
      type: 'Beach/Village',
      description: 'Sheltered bay on Holy Island. Crystal-clear water, great for SUP and kayaking. Quieter than Trearddur.',
      location: 'Holy Island',
    },
    {
      name: 'Bryn Celli Ddu',
      type: 'Prehistoric site',
      description: '5,000-year-old Neolithic passage tomb aligned with summer solstice. Atmospheric and rarely crowded.',
      location: 'Near Llanddaniel',
    },
    {
      name: "Din Lligwy",
      type: 'Ancient settlement',
      description: "4th-century settlement ruins in a woodland clearing. Stone huts still visible. Few visitors.",
      location: 'Near Moelfre',
    },
  ],

  localEatsAndDrinks: [
    {
      name: 'The Lobster Pot',
      type: 'Seafood restaurant',
      location: 'Church Bay',
      specialty: 'Fresh crab and lobster landed by local boats',
      priceRange: '££',
    },
    {
      name: 'Dylan\'s Restaurant',
      type: 'Restaurant',
      location: 'Menai Bridge',
      specialty: 'Local seafood with waterfront views',
      priceRange: '££-£££',
    },
    {
      name: 'The Oyster Catcher',
      type: 'Pub/Restaurant',
      location: 'Rhosneigr',
      specialty: 'Surfers\' pub with good food and local beers',
      priceRange: '££',
    },
    {
      name: 'Catch 22 Brasserie',
      type: 'Restaurant',
      location: 'Beaumaris',
      specialty: 'Seafood and steaks in the castle shadow',
      priceRange: '££-£££',
    },
    {
      name: 'The Marram Grass',
      type: 'Café',
      location: 'Newborough',
      specialty: 'Coffee and light lunches near the forest trails',
      priceRange: '£',
    },
    {
      name: 'Hooton\'s Homegrown',
      type: 'Farm shop/Café',
      location: 'Brynsiencyn',
      specialty: 'Farm-fresh produce, excellent ice cream',
      priceRange: '£',
    },
  ],

  meta: {
    seoTitle: 'Anglesey (Ynys Môn) | Coastal Adventures & Watersports | Adventure Wales',
    seoDescription: "Discover Anglesey: Wales' largest island. 140 miles of coastal path, world-class watersports at Rhosneigr, coasteering at Porth Ruffydd, and red squirrels at Newborough.",
    heroImage: '/images/regions/anglesey-hero.jpg',
    socialImage: '/images/regions/anglesey-og.jpg',
    lastUpdated: '2025-02-06',
  },
};

export default angleseyData;
