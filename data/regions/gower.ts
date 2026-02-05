/**
 * Gower Peninsula Region Data
 * Comprehensive content for Adventure Wales region pages
 * Last updated: February 2025
 * Sources: Perplexity research, Visit Swansea Bay, National Trust
 */

export const gowerData = {
  slug: 'gower',
  name: 'Gower',
  welshName: 'Gŵyr',

  heroContent: `The Gower Peninsula juts into the Bristol Channel like a wild afterthought—and what an afterthought it is. This compact slab of limestone, golden beaches, and ancient commons was the UK's very first Area of Outstanding Natural Beauty, designated in 1956 when people finally realised what the locals had known for centuries: this place is special.

Just 30 minutes from Swansea, you'll find three-mile sweeps of sand at Rhossili Bay (regularly voted one of Britain's best beaches), the tidal scramble to Worm's Head (a Viking 'sea serpent' promontory), and the iconic silhouette of Three Cliffs Bay. The 46-mile coastal path delivers constant drama: limestone cliffs, hidden coves, salt marshes, and surf breaks that put Gower firmly on the map as the heartland of Welsh surfing.

But it's the scale that makes Gower perfect for adventure. You can coasteer in the morning, surf in the afternoon, and walk to a clifftop pub for sunset—all within 15 minutes of each other. The south coast faces the Atlantic swell; the north side fringes the peaceful Loughor Estuary. Arthur's Stone and Neolithic tombs scatter the moorland. And throughout it all, there's a lived-in quality: ice cream at Joe's in Mumbles, salt marsh lamb from the farm shop, beach hut culture that's been here for generations.`,

  keyFacts: [
    { label: 'Area', value: '188 km² (73 sq miles)', detail: '74 km of coastline' },
    { label: 'Designation', value: "UK's first AONB", detail: 'Area of Outstanding Natural Beauty since 1956' },
    { label: 'Coastal Path', value: '46 miles', detail: 'Part of the 870-mile Wales Coast Path' },
    { label: 'Best Beach', value: 'Rhossili Bay', detail: '3 miles of sand, regularly voted UK best' },
    { label: 'Gateway Town', value: 'Mumbles', detail: '5 miles from Swansea, Victorian seaside charm' },
    { label: 'Iconic Feature', value: "Worm's Head", detail: 'Tidal island, accessible 2.5 hours either side of low tide' },
    { label: 'Surf Heritage', value: 'Welsh surfing heartland', detail: 'Langland, Caswell, and Llangennith breaks' },
    { label: 'Prehistoric Sites', value: "Arthur's Stone", detail: '5,000-year-old Neolithic burial chamber' },
    { label: 'Historic Castles', value: '3 medieval castles', detail: 'Oystermouth, Weobley, Pennard' },
    { label: 'Wildlife', value: 'Seals, choughs, oystercatchers', detail: 'Loughor Estuary is a vital bird habitat' },
  ],

  bestFor: [
    { rank: 1, activity: 'Surfing', description: 'World-class breaks at Langland, Caswell, Llangennith—Welsh surfing was born here' },
    { rank: 2, activity: 'Coastal Walking', description: '46 miles of path past cliffs, beaches, and tidal islands' },
    { rank: 3, activity: 'Coasteering', description: 'Limestone cliffs and caves around Rhossili and Three Cliffs' },
    { rank: 4, activity: 'Beach Days', description: 'Rhossili, Three Cliffs, Oxwich—some of Britain\'s finest sand' },
    { rank: 5, activity: 'Sea Kayaking', description: 'Paddle around headlands, explore sea caves and hidden coves' },
    { rank: 6, activity: 'Wild Swimming', description: 'Sheltered bays, tidal pools, and the infamous Worm\'s Head dip' },
    { rank: 7, activity: 'Rock Climbing', description: 'Limestone sea cliffs with routes for all abilities' },
    { rank: 8, activity: 'Horse Riding', description: 'Beach rides at Llangennith and moorland treks' },
    { rank: 9, activity: 'Mountain Biking', description: 'Rhossili Down and Cefn Bryn common tracks' },
    { rank: 10, activity: 'Birdwatching', description: 'Loughor Estuary salt marshes for waders and wildfowl' },
  ],

  seasonGuide: {
    spring: {
      months: 'March - May',
      weather: '10-15°C, frequent showers. Sea temps 9-12°C',
      highlights: [
        'Wildflowers on Cefn Bryn and coastal cliffs',
        'Lambing season at local farms',
        'Fewer crowds at popular beaches',
        'Coasteering and sea kayaking seasons begin',
      ],
      bestActivities: ['Coastal walking', 'Birdwatching', 'Coasteering', 'Photography'],
      avoid: "Worm's Head in strong winds—causeway can be treacherous",
    },
    summer: {
      months: 'June - August',
      weather: '18-22°C, sea temps 14-17°C. Long warm days',
      highlights: [
        'Peak surf conditions (warmest water)',
        'Beach hut season in full swing',
        'Worm\'s Head accessible in daylight hours',
        'Mumbles Oyster Festival',
      ],
      bestActivities: ['Surfing', 'Wild swimming', 'All water sports', 'Beach days'],
      avoid: 'Three Cliffs and Rhossili car parks fill by 9am on sunny weekends',
    },
    autumn: {
      months: 'September - November',
      weather: '10-16°C, sea temps 13-15°C. Best surf swells',
      highlights: [
        'Most consistent surf of the year',
        'Golden light for photography',
        'Empty beaches after half-term',
        'Seal pups on north coast',
      ],
      bestActivities: ['Surfing', 'Hiking', 'Mountain biking', 'Photography'],
      avoid: 'Exposed headlands in autumn gales',
    },
    winter: {
      months: 'December - February',
      weather: '5-10°C, sea temps 8-10°C. Storms and clear spells',
      highlights: [
        'Dramatic storm watching',
        'Rhossili Down walks (windswept, wild)',
        'Quiet local pubs and cosy atmosphere',
        'Surf still runs—locals in thick wetsuits',
      ],
      bestActivities: ['Storm watching', 'Winter walking', 'Pub lunches', 'Hardy surfing'],
      avoid: "Worm's Head (short daylight limits safe crossing times)",
    },
  },

  insiderTips: [
    {
      tip: "Worm's Head tide timing",
      detail: "Only accessible 2.5 hours either side of low tide—Dylan Thomas famously got stranded here as a boy. Check the tide boards at Rhossili before attempting. Allow 2 hours for the full scramble.",
    },
    {
      tip: 'Three Cliffs without crowds',
      detail: 'Park at Penmaen (1-mile walk through dunes) instead of the main car parks. Best at low tide for the classic photo. Early morning midweek is magical.',
    },
    {
      tip: 'Secret surf spot',
      detail: "Port Eynon Bay—car park 1 minute from the sand, much less crowded than Langland. Grab pasties from the village shop afterwards.",
    },
    {
      tip: "Joe's Ice Cream ritual",
      detail: "Joe's in Mumbles has been making ice cream since 1898. Get a cone and walk the pier. This is non-negotiable Gower tradition.",
    },
    {
      tip: 'Salt marsh lamb',
      detail: "Gower Salt Marsh Lamb grazes the Loughor Estuary—flavour is extraordinary. Buy from Weobley Castle farm shop or look for it on local menus.",
    },
    {
      tip: 'Beach huts at Langland',
      detail: 'You can rent the iconic beach huts (£30-50/day) for private BBQs and shelter. Book via Swansea Council—locals-only vibe.',
    },
    {
      tip: 'The quiet north side',
      detail: "Everyone heads south for beaches. The north coast around Loughor Estuary has salt marshes, birdwatching, and flat cycling lanes with no traffic.",
    },
    {
      tip: 'Cefn Bryn parking hack',
      detail: 'Free parking on common land around Cefn Bryn ridge, but lanes are narrow. Arrive before 10am on weekends or use the NT car park at Rhossili.',
    },
    {
      tip: 'St Cadoc\'s Church',
      detail: "Tiny 13th-century church in Cheriton, known as the 'Cathedral of Gower'. Peaceful, atmospheric, and never crowded.",
    },
    {
      tip: 'Surf lesson reality',
      detail: 'Summer lessons at Llangennith are packed. Book private lessons or go shoulder season for proper attention from instructors.',
    },
  ],

  topExperiences: [
    {
      name: 'Rhossili Bay Beach Walk',
      type: 'beach',
      duration: '2-3 hours',
      difficulty: 'Easy',
      description: "3 miles of pristine sand beneath Rhossili Down. Walk the full length at low tide for shipwreck views.",
      priceRange: 'Free (parking £7)',
    },
    {
      name: "Worm's Head Scramble",
      type: 'hiking',
      duration: '2-3 hours',
      difficulty: 'Moderate',
      description: "Tidal crossing to the 'sea serpent' headland. Check tide times—you have 2.5 hours either side of low tide.",
      priceRange: 'Free',
    },
    {
      name: 'Surfing at Langland Bay',
      type: 'surfing',
      duration: '2-3 hours',
      difficulty: 'All levels',
      description: "Gower's most accessible surf spot with consistent waves. Lessons available. Beach café for après-surf.",
      priceRange: '£40-60 lesson',
    },
    {
      name: 'Three Cliffs Bay Hike',
      type: 'hiking',
      duration: '2-3 hours',
      difficulty: 'Moderate',
      description: 'Walk through dunes to one of Wales\' most photographed bays. Scramble up the cliffs for views.',
      priceRange: 'Free (parking £3-5)',
    },
    {
      name: 'Coasteering at Fall Bay',
      type: 'coasteering',
      duration: '3-4 hours',
      difficulty: 'Moderate',
      description: 'Cliff jumping, cave swimming, and coastal scrambling on limestone cliffs near Rhossili.',
      priceRange: '£50-70',
    },
    {
      name: 'Gower Coast Path: Mumbles to Three Cliffs',
      type: 'hiking',
      duration: '5-6 hours',
      difficulty: 'Moderate',
      description: 'Classic section of the 46-mile path passing beaches, headlands, and Pennard Castle ruins.',
      priceRange: 'Free',
    },
    {
      name: 'Sea Kayaking Oxwich Bay',
      type: 'kayaking',
      duration: '3-4 hours',
      difficulty: 'Beginner',
      description: 'Paddle around the sheltered bay, explore caves, and spot seals on guided trips.',
      priceRange: '£45-65',
    },
    {
      name: 'Beach Horse Riding at Llangennith',
      type: 'horse-riding',
      duration: '1-2 hours',
      difficulty: 'All levels',
      description: 'Canter along the beach with surf crashing alongside. Sunrise and sunset rides available.',
      priceRange: '£50-80',
    },
    {
      name: "Arthur's Stone Walk",
      type: 'hiking',
      duration: '1-2 hours',
      difficulty: 'Easy',
      description: '5,000-year-old Neolithic burial chamber on Cefn Bryn with panoramic views across the peninsula.',
      priceRange: 'Free',
    },
    {
      name: 'Weobley Castle Visit',
      type: 'heritage',
      duration: '1-2 hours',
      difficulty: 'Easy',
      description: '700-year-old fortified manor house overlooking Loughor Estuary. Atmospheric and uncrowded.',
      priceRange: '£5',
    },
    {
      name: 'Surf Lesson at Llangennith',
      type: 'surfing',
      duration: '2 hours',
      difficulty: 'Beginner',
      description: 'Learn to surf on the beach where Welsh surfing began. Reliable waves, sandy bottom.',
      priceRange: '£40-50',
    },
    {
      name: 'Mumbles to Caswell Coastal Walk',
      type: 'hiking',
      duration: '2-3 hours',
      difficulty: 'Easy',
      description: 'Gentle clifftop path from Victorian Mumbles to pretty Caswell Bay. Finish with ice cream.',
      priceRange: 'Free',
    },
  ],

  faqs: [
    {
      question: 'Can you walk to Worm\'s Head?',
      answer: "Yes, but only 2.5 hours either side of low tide. Check the tide boards at Rhossili before crossing. The causeway is rocky and can be slippery. Allow 2 hours for the full scramble out and back. Dylan Thomas got stranded here as a boy—don't repeat his mistake.",
    },
    {
      question: 'Is Gower good for surfing?',
      answer: "Excellent. Gower is the heartland of Welsh surfing. Langland and Caswell have consistent waves and are beginner-friendly. Llangennith on the west side is more exposed with bigger swells. Summer has warmest water (14-17°C); autumn has best waves.",
    },
    {
      question: 'Which is the best beach on Gower?',
      answer: "Rhossili Bay is regularly voted Britain's best—3 miles of sand beneath dramatic cliffs. Three Cliffs Bay is the most photogenic. Caswell is sheltered and family-friendly. Llangennith is best for surfing.",
    },
    {
      question: 'How do I get to Gower without a car?',
      answer: "Train to Swansea (3 hours from London), then the Gower Explorer bus network covers most beaches and villages. Routes 118 (Rhossili), 116 (Llangennith), and others run regularly. Check NAT Group for timetables.",
    },
    {
      question: 'Is Gower busy?',
      answer: "On sunny summer weekends, yes—Three Cliffs and Rhossili car parks fill by 9am. Visit midweek, shoulder seasons, or explore the quieter north coast. Early morning is always peaceful.",
    },
    {
      question: 'Can I camp on Gower?',
      answer: "There are several campsites (Hillend near Llangennith is popular with surfers). Wild camping isn't officially permitted, but discreet, single-night camps away from beaches are sometimes tolerated. Leave no trace.",
    },
    {
      question: 'What is Three Cliffs Bay?',
      answer: "Three dramatic limestone pinnacles at the mouth of Pennard Pill. Possibly Wales' most photographed bay. Access via Penmaen (1-mile dune walk) or from Pennard Castle. Best at low tide.",
    },
    {
      question: "What's the Gower Way?",
      answer: "A 35-mile walking route along the spine of the peninsula from Rhossili to Penlle'r Castell. Less famous than the coast path but offers inland views, common land, and prehistoric sites. Usually walked in 2-3 days.",
    },
    {
      question: 'Where should I eat on Gower?',
      answer: "Joe's Ice Cream in Mumbles is essential. The King's Head in Llangennith is the surfers' pub. Patrick's with Rooms in Mumbles for fine dining. Weobley Castle farm shop for local produce.",
    },
    {
      question: 'Is coasteering available on Gower?',
      answer: 'Yes—several operators run sessions around Rhossili, Fall Bay, and Three Cliffs. The limestone coast is perfect for cliff jumping, cave swimming, and scrambling. Suitable for beginners with guides.',
    },
  ],

  hiddenGems: [
    {
      name: 'Brandy Cove',
      type: 'Beach',
      description: 'Tiny hidden cove between Caswell and Langland, named for 18th-century smuggling. Swim in near-solitude.',
      location: 'Between Caswell and Langland',
    },
    {
      name: 'Culver Hole',
      type: 'Historical site',
      description: 'Mysterious medieval stone dovecote built into a sea cave. Nobody knows why. 60-foot walls, 50+ nesting holes.',
      location: 'Port Eynon',
    },
    {
      name: 'Whiteford Sands',
      type: 'Beach',
      description: "Gower's only north-facing beach. Remote, backed by dunes and pinewoods. Iconic iron lighthouse (1865).",
      location: 'North Gower',
    },
    {
      name: "Parc le Breos Burial Chamber",
      type: 'Prehistoric site',
      description: '5,500-year-old Neolithic tomb in a wooded valley. Atmospheric and rarely visited.',
      location: 'Near Parkmill',
    },
    {
      name: 'Mewslade Bay',
      type: 'Beach',
      description: "Secret cove near Rhossili accessible at low tide. Wild swimming, no facilities, proper adventure.",
      location: 'Near Rhossili',
    },
    {
      name: 'The Ship Inn, Port Eynon',
      type: 'Pub',
      description: "Proper village local with sea views, good beer, and no pretension. Salt-weathered in the best way.",
      location: 'Port Eynon',
    },
  ],

  localEatsAndDrinks: [
    {
      name: "Joe's Ice Cream",
      type: 'Ice cream parlour',
      location: 'Mumbles',
      specialty: 'Family-run since 1898. The vanilla is legendary',
      priceRange: '£',
    },
    {
      name: "The King's Head",
      type: 'Pub',
      location: 'Llangennith',
      specialty: "Surfers' pub with live music and local character",
      priceRange: '££',
    },
    {
      name: 'Patrick\'s with Rooms',
      type: 'Restaurant',
      location: 'Mumbles',
      specialty: 'Fine dining with local seafood and Welsh produce',
      priceRange: '£££',
    },
    {
      name: 'Weobley Castle Farm Shop',
      type: 'Farm shop',
      location: 'Llanrhidian',
      specialty: 'Gower Salt Marsh Lamb and local produce',
      priceRange: '££',
    },
    {
      name: 'Langland Brasserie',
      type: 'Bar/Restaurant',
      location: 'Langland Bay',
      specialty: 'Beach bar with sunset views and cocktails',
      priceRange: '££',
    },
    {
      name: 'The Ship Inn',
      type: 'Pub',
      location: 'Port Eynon',
      specialty: 'Proper village local with sea views',
      priceRange: '£',
    },
  ],

  meta: {
    seoTitle: 'Gower Peninsula | Surfing, Beaches & Coastal Adventures | Adventure Wales',
    seoDescription: "Explore the Gower Peninsula: UK's first AONB. Surf world-class breaks, walk 46 miles of coast path, scramble to Worm's Head, and discover Britain's best beaches.",
    heroImage: '/images/regions/gower-hero.jpg',
    socialImage: '/images/regions/gower-og.jpg',
    lastUpdated: '2025-02-06',
  },
};

export default gowerData;
