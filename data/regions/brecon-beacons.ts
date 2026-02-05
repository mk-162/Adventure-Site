/**
 * Brecon Beacons (Bannau Brycheiniog) Region Data
 * Comprehensive content for Adventure Wales region pages
 * Last updated: February 2025
 * Sources: Perplexity research, National Park Authority, Dark Sky Wales
 */

export const breconBeaconsData = {
  slug: 'brecon-beacons',
  name: 'Brecon Beacons',
  welshName: 'Bannau Brycheiniog',

  heroContent: `The Brecon Beacons—or Bannau Brycheiniog as it's now officially known—is where South Wales reaches for the sky. Pen y Fan at 886m is the highest peak in southern Britain, and the iconic flat-topped summits of the Central Beacons draw hikers from across the world. But this is far more than a one-mountain park: 1,344 square kilometres of rolling uplands, hidden waterfalls, limestone caves, and one of the world's finest Dark Sky Reserves.

The western Fforest Fawr Geopark is a UNESCO Global Geopark, where you can walk behind thundering waterfalls, explore caverns carved by millennia of water, and scramble through gorges that feel genuinely wild. The eastern Black Mountains offer ridge walks with views into England, while the peaceful Monmouthshire & Brecon Canal winds through the valleys below.

What makes this place special for adventure? It's accessible—under three hours from London, 30 minutes from Cardiff—yet delivers wilderness that feels genuinely remote. Add world-class stargazing (the park is an International Dark Sky Reserve), a thriving local food scene, and festivals like Hay and Green Man on the doorstep, and you've got a destination that satisfies every type of adventurer.`,

  keyFacts: [
    { label: 'Area', value: '1,344 km² (519 sq miles)', detail: "Wales' third-largest national park" },
    { label: 'Highest Peak', value: 'Pen y Fan 886m', detail: "Highest mountain in southern Britain" },
    { label: 'Established', value: '1957', detail: 'Tenth UK national park' },
    { label: 'UNESCO Status', value: 'Fforest Fawr Geopark', detail: 'UNESCO Global Geopark since 2005' },
    { label: 'Dark Sky Reserve', value: 'International Dark Sky Reserve', detail: 'One of only 22 worldwide' },
    { label: 'Mountain Ranges', value: '4 distinct ranges', detail: 'Central Beacons, Black Mountains, Fforest Fawr, Black Mountain' },
    { label: 'Waterfalls', value: '20+ major falls', detail: 'Including Sgwd yr Eira (walk-behind)' },
    { label: 'Population', value: '33,000', detail: 'Main towns: Brecon, Crickhowell, Abergavenny' },
    { label: 'Tourism Value', value: '£126 million/year', detail: '£4,000 per resident annually' },
    { label: 'Canal', value: '35 miles navigable', detail: 'Monmouthshire & Brecon Canal' },
  ],

  bestFor: [
    { rank: 1, activity: 'Mountain Hiking', description: 'Pen y Fan, Corn Du, Cribyn—iconic peaks with rewarding summit views' },
    { rank: 2, activity: 'Waterfall Walks', description: 'Sgwd yr Eira (walk behind the falls), Waterfall Country trails' },
    { rank: 3, activity: 'Stargazing', description: 'International Dark Sky Reserve with designated viewing points' },
    { rank: 4, activity: 'Caving & Gorge Walking', description: 'Cave systems and limestone gorges in the Geopark' },
    { rank: 5, activity: 'Mountain Biking', description: 'Forest trails, canal towpaths, and open mountain riding' },
    { rank: 6, activity: 'Wild Swimming', description: 'Mountain lakes, river pools, and waterfall plunge pools' },
    { rank: 7, activity: 'Canoeing & Kayaking', description: 'River Usk, Llangorse Lake, and peaceful canal paddling' },
    { rank: 8, activity: 'Horse Riding', description: 'Trail rides through open moorland and valleys' },
    { rank: 9, activity: 'Rock Climbing', description: 'Gritstone crags and quarried rock faces' },
    { rank: 10, activity: 'Trail Running', description: 'Fan Dance, Brecon Beacons Ultra, and countless mountain trails' },
  ],

  seasonGuide: {
    spring: {
      months: 'March - May',
      weather: '10-15°C, frequent showers. Snow possible on peaks until April',
      highlights: [
        'Wildflowers carpeting valleys',
        'Lambing season—new life on the hillsides',
        'Waterfalls at peak flow after winter rains',
        'Red kite feeding stations very active',
      ],
      bestActivities: ['Waterfall walks', 'Low-level hiking', 'Wildlife watching', 'Stargazing (clear nights)'],
      avoid: 'Muddy paths on popular routes. Lambing fields March-April',
    },
    summer: {
      months: 'June - August',
      weather: '15-25°C, longest days. Warmest for wild swimming',
      highlights: [
        'All activities at peak conditions',
        'Long daylight for big mountain days',
        'Abergavenny Food Festival (late August)',
        'Green Man Festival (Crickhowell, August)',
      ],
      bestActivities: ['Pen y Fan summits', 'Wild swimming', 'Canoeing', 'Multi-day hikes'],
      avoid: 'Pen y Fan car parks fill by 9am weekends. Book accommodation ahead for festivals',
    },
    autumn: {
      months: 'September - November',
      weather: '5-15°C, golden light. First frosts late October',
      highlights: [
        'Stunning autumn colours in Black Mountains',
        'Clear skies for stargazing',
        'Red kite activity peaks',
        'Hay Festival winter edition (November)',
      ],
      bestActivities: ['Ridge walks', 'Photography', 'Stargazing', 'Mountain biking'],
      avoid: 'High routes in gales—check Met Office warnings',
    },
    winter: {
      months: 'December - February',
      weather: '0-7°C at low levels, often sub-zero on peaks. Snow above 600m common',
      highlights: [
        'Best conditions for Dark Sky stargazing',
        'Snow-covered peaks for experienced hikers',
        'Cosy pubs and local character',
        'Fewer visitors—genuine solitude',
      ],
      bestActivities: ['Stargazing', 'Winter mountaineering', 'Waterfall walks', 'Pub walks'],
      avoid: 'Summit routes without proper winter gear. Paths ice over regularly',
    },
  },

  insiderTips: [
    {
      tip: 'Pen y Fan parking hack',
      detail: "The Storey Arms car park fills by 8am on summer weekends. Park at the Taff Trail layby 2km north (free) and walk/cycle in—locals call it the 'backdoor route'.",
    },
    {
      tip: 'Llyn y Fan Fach beats Pen y Fan',
      detail: "This mythical mountain lake (Lady of the Lake legend) offers drama without crowds. 4-mile hike from Llanddeusant. No facilities—pack everything. Wild ponies for company.",
    },
    {
      tip: 'Walk behind a waterfall',
      detail: 'Sgwd yr Eira in Waterfall Country is the real deal—a path takes you behind the curtain of water. Visit after rain for maximum drama, but expect wet feet.',
    },
    {
      tip: 'Best stargazing spot',
      detail: "Craig-y-Nos Country Park has a designated Dark Sky Discovery Site. Full moon nights are magical. Pack layers—it's cold at 2am even in summer.",
    },
    {
      tip: 'Abergavenny for food',
      detail: 'Skip Brecon town centre for eating—Abergavenny has the real food scene. Saturday market for local produce. The Walnut Tree for fine dining.',
    },
    {
      tip: 'Canal towpath gem',
      detail: "The Brecon to Goytre Wharf section (5 miles, flat) is perfect for families, bikes, and pushchairs. Kingfisher sightings at dawn and dusk.",
    },
    {
      tip: 'Avoid the T4 bus crush',
      detail: 'The T4 bus from Cardiff to Brecon via Storey Arms is great for car-free access, but rammed on summer weekends. Midweek services are peaceful.',
    },
    {
      tip: 'Red kite feeding',
      detail: 'Llanddeusant Red Kite Feeding Station (daily at 3pm winter, 4pm summer) draws 100+ birds. £4 donation, spectacular in any weather.',
    },
    {
      tip: 'Full moon Pen y Fan',
      detail: 'Experienced hikers do night ascents on full moon nights. Check weather, bring headtorch, go with someone who knows the route. Sunrise from the summit is unforgettable.',
    },
    {
      tip: 'The Felin Fach Griffin',
      detail: "This gastropub near the park's east edge is worth the detour—local lamb, Welsh rarebit, excellent wine list. Book dinner tables ahead.",
    },
  ],

  topExperiences: [
    {
      name: 'Summit Pen y Fan via Storey Arms',
      type: 'hiking',
      duration: '3-4 hours',
      difficulty: 'Moderate',
      description: "The most popular route to southern Britain's highest peak. 4.5 miles return with 450m ascent.",
      priceRange: 'Free (parking £5)',
    },
    {
      name: 'Waterfall Country Four Falls Trail',
      type: 'hiking',
      duration: '3-4 hours',
      difficulty: 'Moderate',
      description: 'Circular walk past four stunning waterfalls including Sgwd yr Eira (walk-behind).',
      priceRange: 'Free (parking £5)',
    },
    {
      name: 'Dark Sky Stargazing Experience',
      type: 'stargazing',
      duration: '3-4 hours',
      difficulty: 'Any',
      description: 'Guided stargazing sessions at designated Dark Sky sites with telescopes provided.',
      priceRange: '£25-50',
    },
    {
      name: 'Caving at Dan yr Ogof',
      type: 'caving',
      duration: '2-3 hours',
      difficulty: 'Easy to Moderate',
      description: 'Explore the National Showcaves complex—Cathedral Cave, Bone Cave, and dinosaur park.',
      priceRange: '£20-25',
    },
    {
      name: 'Llyn y Fan Fach Circuit',
      type: 'hiking',
      duration: '4-5 hours',
      difficulty: 'Challenging',
      description: 'Dramatic glacial lake beneath Bannau Sir Gaer. Wild and remote. Legendary Lady of the Lake.',
      priceRange: 'Free',
    },
    {
      name: 'Monmouthshire & Brecon Canal Paddling',
      type: 'paddling',
      duration: '3-4 hours',
      difficulty: 'Easy',
      description: 'Peaceful canoe or kayak along the lock-free canal through rolling countryside.',
      priceRange: '£30-50 hire',
    },
    {
      name: 'Black Mountains Ridge Walk',
      type: 'hiking',
      duration: '6-8 hours',
      difficulty: 'Challenging',
      description: 'Traverse the long ridge from Hay Bluff to Table Mountain. Views into England and Wales.',
      priceRange: 'Free',
    },
    {
      name: 'Gorge Walking in Fforest Fawr',
      type: 'gorge-walking',
      duration: '3-4 hours',
      difficulty: 'Moderate',
      description: 'Scramble through limestone gorges with waterfalls and plunge pools.',
      priceRange: '£45-65',
    },
    {
      name: 'Fan Dance (SAS Selection Route)',
      type: 'hiking',
      duration: '5-7 hours',
      difficulty: 'Expert',
      description: 'The infamous SAS selection march—15 miles over Pen y Fan carrying weight. Annual race event.',
      priceRange: 'Free (event entry £50-80)',
    },
    {
      name: 'Mountain Biking at Bike Park Wales',
      type: 'mountain-biking',
      duration: '3-5 hours',
      difficulty: 'All levels',
      description: "UK's first full-scale bike park with 40+ trails. Uplift available.",
      priceRange: '£30-40 day pass',
    },
    {
      name: 'Llanthony Priory Visit',
      type: 'heritage',
      duration: '2-3 hours',
      difficulty: 'Easy',
      description: "Ruined Augustinian priory in the Vale of Ewyas. Atmospheric, photogenic, with a pub in the crypt.",
      priceRange: 'Free (donations welcome)',
    },
    {
      name: 'Red Kite Feeding',
      type: 'wildlife',
      duration: '1-2 hours',
      difficulty: 'Any',
      description: 'Watch 100+ red kites swoop for food at Llanddeusant feeding station. Daily in winter.',
      priceRange: '£4 donation',
    },
  ],

  faqs: [
    {
      question: 'Is Pen y Fan difficult to climb?',
      answer: "The Storey Arms route is moderate—4.5 miles return with 450m ascent. If you can walk 5 miles with hills, you'll manage. Wear proper boots, bring layers, and check weather. It's a proper mountain, not a stroll.",
    },
    {
      question: 'Can you walk behind Sgwd yr Eira waterfall?',
      answer: "Yes! A path passes behind the curtain of water. It's wet (obviously), so wear waterproofs and grippy shoes. The falls are most dramatic after heavy rain. Part of the Four Falls Trail in Waterfall Country.",
    },
    {
      question: 'What is the Dark Sky Reserve?',
      answer: "The Brecon Beacons is an International Dark Sky Reserve—one of only 22 worldwide. Minimal light pollution means you can see the Milky Way with the naked eye. Best viewing: Craig-y-Nos, Usk Reservoir, and designated Discovery Sites.",
    },
    {
      question: 'How do I get there without a car?',
      answer: "Train to Abergavenny (2.5 hours from London), then X43 bus to Brecon. Or train to Merthyr Tydfil (from Cardiff), then T4 bus which stops at Storey Arms for Pen y Fan. The T4 runs regularly but gets busy.",
    },
    {
      question: 'Is wild camping allowed?',
      answer: "You need landowner permission, but responsible wild camping above the enclosed farmland is often tolerated. Leave no trace, avoid honeypot areas, and don't light fires. Some farmers actively discourage it.",
    },
    {
      question: "What's the weather like?",
      answer: 'Changeable! It can be sunny in Brecon and snowing on Pen y Fan. Always pack waterproofs and layers. Summer: 15-25°C. Winter: 0-7°C, often below freezing on peaks. Snow persists until April some years.',
    },
    {
      question: 'Are there good pubs and restaurants?',
      answer: "The Felin Fach Griffin is a destination gastropub. Abergavenny has the best food scene (The Walnut Tree for fine dining, Saturday market). In Brecon, try The Bear or Gurkha Corner. Crickhowell has excellent options too.",
    },
    {
      question: "What's the Fan Dance?",
      answer: "The infamous SAS selection march—a 15-mile route over Pen y Fan carrying a 35lb pack. There's an annual public race event. It's brutal but achievable with training. Many people just walk the route at their own pace.",
    },
    {
      question: 'Can I swim in the waterfalls?',
      answer: 'Some plunge pools are swimmable (Sgwd Gwladys has a popular pool). Water is cold year-round. Take care with currents after rain. Wild swimming is at your own risk—there are no lifeguards.',
    },
    {
      question: 'What about mountain biking?',
      answer: "Bike Park Wales (Merthyr) has 40+ trails with uplift. Natural trails in the forests around Talybont-on-Usk. The canal towpath is flat and family-friendly. Gap Road near Brecon is a classic mountain route.",
    },
  ],

  hiddenGems: [
    {
      name: 'Llyn y Fan Fach',
      type: 'Glacial lake',
      description: 'Remote mountain lake with Lady of the Lake legend. Wild ponies, dramatic cliffs, genuine solitude.',
      location: 'Western Beacons, from Llanddeusant',
    },
    {
      name: 'Llanthony Priory',
      type: 'Ruined priory',
      description: "Atmospheric 12th-century priory ruins in the Vale of Ewyas. There's a pub in the crypt.",
      location: 'Black Mountains',
    },
    {
      name: 'Partrishow Church',
      type: 'Medieval church',
      description: "Tiny 11th-century church with a rare medieval rood screen and dragon. Utterly peaceful.",
      location: 'Black Mountains',
    },
    {
      name: 'Henrhyd Falls',
      type: 'Waterfall',
      description: 'Tallest waterfall in South Wales (27m). Filmed for Batman: The Dark Knight Rises.',
      location: 'Near Coelbren',
    },
    {
      name: 'Crai Reservoir',
      type: 'Wild swimming',
      description: 'Less-visited reservoir with good swimming access. Quieter than Llangorse.',
      location: 'Western Beacons',
    },
    {
      name: 'Sugar Loaf',
      type: 'Mountain walk',
      description: 'Distinctive peak above Abergavenny. Shorter than Pen y Fan, excellent views.',
      location: 'Abergavenny',
    },
  ],

  localEatsAndDrinks: [
    {
      name: 'The Felin Fach Griffin',
      type: 'Gastropub',
      location: 'Felin Fach (near Brecon)',
      specialty: 'Michelin-listed with rooms. Local lamb, Welsh produce',
      priceRange: '£££',
    },
    {
      name: 'The Walnut Tree',
      type: 'Restaurant',
      location: 'Abergavenny',
      specialty: 'Legendary chef-owned restaurant. Worth the splurge',
      priceRange: '£££',
    },
    {
      name: 'The Bear',
      type: 'Coaching inn',
      location: 'Crickhowell',
      specialty: 'Historic pub with excellent beer and hearty food',
      priceRange: '££',
    },
    {
      name: 'Abergavenny Market',
      type: 'Market',
      location: 'Abergavenny',
      specialty: 'Tuesdays and Saturdays—local cheese, bread, produce',
      priceRange: '£-££',
    },
    {
      name: 'The Half Moon',
      type: 'Pub',
      location: 'Llanthony',
      specialty: "Pub in the priory grounds. Atmospheric doesn't cover it",
      priceRange: '££',
    },
    {
      name: 'Gurkha Corner',
      type: 'Restaurant',
      location: 'Brecon',
      specialty: 'Excellent Nepalese cuisine—popular with army personnel',
      priceRange: '££',
    },
  ],

  meta: {
    seoTitle: 'Brecon Beacons (Bannau Brycheiniog) | Hiking, Waterfalls & Dark Skies | Adventure Wales',
    seoDescription: "Explore the Brecon Beacons: summit Pen y Fan, walk behind waterfalls, stargaze in the Dark Sky Reserve, and discover the UNESCO Geopark. Complete adventure guide.",
    heroImage: '/images/regions/brecon-beacons-hero.jpg',
    socialImage: '/images/regions/brecon-beacons-og.jpg',
    lastUpdated: '2025-02-06',
  },
};

export default breconBeaconsData;
