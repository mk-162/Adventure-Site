export const cavingHub = {
  title: "Caving in Wales",
  strapline: "Explore Britain's most spectacular underground world",
  metaTitle: "Caving in Wales | Show Caves, Adventure Caves & Guided Trips | Adventure Wales",
  metaDescription: "The complete guide to caving in Wales. Show caves, adventure caving, operators, difficulty guide, and insider tips. Home to Britain's deepest and longest cave systems.",
  
  // Key stats for hero
  stats: {
    showCaves: 4,
    adventureCaves: "20+",
    operators: 12,
    depthRecord: "308m",
  },
  
  // Introduction - compelling editorial (4 paragraphs)
  introduction: `Wales doesn't just have caves — it has *the* caves. Hidden beneath the Brecon Beacons lies some of the most spectacular underground scenery in Europe. From the cavernous halls of Dan yr Ogof (Britain's largest showcave complex) to the record-breaking depths of Ogof Ffynnon Ddu (Britain's deepest cave at 308 metres), Welsh limestone has been sculpted by millennia of water into something truly extraordinary.

What makes Welsh caving unique? It's the sheer variety. You can walk through a cathedral-sized cavern with your family, marvel at 40-foot waterfalls crashing into underground pools, then — if you dare — crawl, squeeze, and swim through wild cave passages that only a handful of people have ever seen. The same region offers both experiences, often within miles of each other.

The Brecon Beacons (Bannau Brycheiniog) hosts four of Britain's five longest cave systems. That's not an accident — the Carboniferous limestone here is ideal for cave formation, and the abundant Welsh rainfall has been doing its work for millions of years. The result is a maze of passages totalling hundreds of kilometres, with new discoveries still being made by dedicated cavers.

Here's the truth: you don't need to be an expert to experience Welsh caves. The show caves at Dan yr Ogof are genuinely awe-inspiring — well-lit paths through formations that took 315 million years to create. But if you want more adventure, guided trips into wild caves start from complete beginner level. Professional instructors provide all the kit, all the knowledge, and all the reassurance you need. The only requirement is curiosity — and perhaps a willingness to get a bit muddy.`,
  
  // Show Caves (tourist caves with facilities)
  showCaves: [
    {
      name: "Dan yr Ogof",
      slug: "dan-yr-ogof",
      location: "Brecon Beacons",
      description: "Britain's largest showcave and the centrepiece of the National Showcaves Centre for Wales. Follow a 1km well-lit trail alongside the underground River Llynfell through spectacular formations — the Rasher of Bacon, the Angel, and the Alabaster Pillar. Discovered in 1912 by two local brothers, only 16km of the 17km system has been explored.",
      facilities: ["Parking", "Café", "Gift shop", "Toilets", "Dinosaur park", "Iron Age village", "Shire horse centre"],
      priceFrom: 21,
      website: "https://www.showcaves.co.uk",
      familyFriendly: true,
      highlights: [
        "UK's largest showcave",
        "Underground river walk",
        "Stunning stalactites & stalagmites",
        "315 million years of geology"
      ],
      openingMonths: "March - October",
      duration: "2-3 hours (full site)",
      accessibility: "Mostly accessible, some steep sections",
      lat: 51.8389,
      lng: -3.6861,
    },
    {
      name: "Cathedral Cave",
      slug: "cathedral-cave",
      location: "Brecon Beacons",
      description: "The second cave at Dan yr Ogof, Cathedral Cave earns its name with vast chambers and 40-foot waterfalls cascading into crystal-clear pools. The Dome of St Paul's rivals its London namesake in scale, if not in sunlight. Walk behind the falls for an immersive experience. Wedding ceremonies are held in the main chamber — that's how impressive the acoustics are.",
      facilities: ["Part of Dan yr Ogof complex"],
      priceFrom: 21,
      website: "https://www.showcaves.co.uk",
      familyFriendly: true,
      highlights: [
        "40-foot underground waterfalls",
        "Walk behind the falls",
        "Cathedral-sized chambers",
        "Stunning acoustics"
      ],
      openingMonths: "March - October",
      duration: "30-45 minutes",
      accessibility: "Good paths throughout",
      lat: 51.8389,
      lng: -3.6861,
    },
    {
      name: "Bone Cave (Ogof yr Esgyrn)",
      slug: "bone-cave",
      location: "Brecon Beacons",
      description: "The most archaeologically significant cave in Wales. Bones of 42 humans dating back over 3,000 years were discovered here, along with cave bear, woolly rhinoceros, and reindeer remains from the Ice Age. Roman artefacts suggest continuous use from Bronze Age to Roman occupation. Hard hats provided — you'll need to duck through low sections.",
      facilities: ["Part of Dan yr Ogof complex", "Hard hats provided"],
      priceFrom: 21,
      website: "https://www.showcaves.co.uk",
      familyFriendly: true,
      highlights: [
        "42 Bronze Age skeletons",
        "Ice Age animal bones",
        "Roman artefacts",
        "7,000-year-old deer bones"
      ],
      openingMonths: "March - October",
      duration: "20-30 minutes",
      accessibility: "Some stooping required, hard hats needed",
      lat: 51.8389,
      lng: -3.6861,
    },
    {
      name: "Zip World Caverns",
      slug: "zip-world-caverns",
      location: "Blaenau Ffestiniog, Snowdonia",
      description: "A unique underground adventure course through giant Victorian slate caverns at Llechwedd. This isn't traditional caving — it's an adventure playground in a cathedral-sized quarry, with zip lines, via ferrata, rope bridges, and traverses through illuminated chambers. Perfect for adventure seekers who want the underground experience without getting muddy.",
      facilities: ["Parking", "Café", "Shop", "Equipment provided", "Deep Mine tour available"],
      priceFrom: 55,
      website: "https://www.zipworld.co.uk/adventures/caverns",
      familyFriendly: true,
      highlights: [
        "Underground zip lines",
        "Giant slate caverns",
        "Via ferrata course",
        "No caving experience needed"
      ],
      openingMonths: "Year-round",
      duration: "2-3 hours",
      accessibility: "Moderate fitness required",
      lat: 52.9927,
      lng: -3.9386,
    },
  ],
  
  // Adventure Caves (wild caves with guided trips)
  adventureCaves: [
    {
      name: "Porth yr Ogof",
      slug: "porth-yr-ogof",
      difficulty: "beginner",
      location: "Ystradfellte, Brecon Beacons",
      description: "The most popular adventure cave in Wales, featuring the largest cave entrance in South Wales. A river flows through the entrance, creating dramatic scenery and an exciting introduction to wild caving. Multiple entrances mean you can tailor trips from easy walks to more challenging through-trips. The 'tradesman's entrance' is the classic beginner route.",
      whatToExpect: [
        "River wading (thigh-deep in places)",
        "Some crawling through passages",
        "Squeezes through narrow gaps",
        "Complete darkness between chambers",
        "Getting wet is guaranteed"
      ],
      typicalDuration: "3-4 hours",
      operatorsOffering: ["Black Mountain Adventure", "Blue Ocean Activities", "Hawk Adventures", "Adventure Britain"],
      bestFor: "First-time cavers, groups, team building",
      lat: 51.8064,
      lng: -3.5628,
    },
    {
      name: "Bridge Cave",
      slug: "bridge-cave",
      difficulty: "beginner",
      location: "Penwyllt, Brecon Beacons",
      description: "A classic beginner cave with short crawls, chambers to explore, and formations to admire — all without the river wading. Perfect for groups who want a genuine cave experience without getting soaked. The cave is well-suited to instruction and building confidence.",
      whatToExpect: [
        "Short crawls and squeezes",
        "Standing chambers",
        "Rock formations",
        "Dry throughout (mostly)",
        "Good for claustrophobia building"
      ],
      typicalDuration: "2-3 hours",
      operatorsOffering: ["Black Mountain Adventure", "Hawk Adventures"],
      bestFor: "Nervous first-timers, children, school groups",
      lat: 51.8367,
      lng: -3.7044,
    },
    {
      name: "Little Neath River Cave",
      slug: "little-neath-river-cave",
      difficulty: "intermediate",
      location: "Neath Valley, Brecon Beacons",
      description: "A spectacular river cave system following the path of the Neath through underground chambers. Features stunning flowstone formations, canal passages, and the challenge of navigating an active stream. More committing than Porth yr Ogof — expect to get fully wet.",
      whatToExpect: [
        "Deep wading in river sections",
        "Swimming through sumps",
        "Technical climbs",
        "Beautiful formations",
        "3-4 hour commitment minimum"
      ],
      typicalDuration: "4-5 hours",
      operatorsOffering: ["Hawk Adventures", "Adventure Britain", "Black Mountain Adventure"],
      bestFor: "Experienced beginners, adventure seekers",
      lat: 51.7789,
      lng: -3.5817,
    },
    {
      name: "Cwm Dwr",
      slug: "cwm-dwr",
      difficulty: "intermediate",
      location: "Penwyllt, Brecon Beacons",
      description: "A challenging cave system connected to the vast Ogof Ffynnon Ddu network. Features vertical sections, tight crawls, and sections requiring single rope technique (SRT). The through-trip to OFD is one of the great Welsh caving adventures but requires permits and experience.",
      whatToExpect: [
        "Vertical pitches (with ropes)",
        "Extended crawling sections",
        "Technical route-finding",
        "5+ hours underground",
        "SRT skills needed for some routes"
      ],
      typicalDuration: "5-8 hours",
      operatorsOffering: ["Specialist guiding via caving clubs"],
      bestFor: "Experienced cavers looking to progress",
      lat: 51.8411,
      lng: -3.6972,
    },
    {
      name: "Town Drain",
      slug: "town-drain",
      difficulty: "intermediate",
      location: "Penwyllt, Brecon Beacons",
      description: "Despite the unglamorous name, Town Drain offers excellent sport caving with tight squeezes, traverses, and interesting formations. Popular with caving clubs as a step up from beginner caves without requiring SRT equipment.",
      whatToExpect: [
        "Tight squeezes (the 'letter box')",
        "Traversing above drops",
        "Extended flat-out crawls",
        "Getting dirty is certain",
        "Good fitness required"
      ],
      typicalDuration: "3-4 hours",
      operatorsOffering: ["Hawk Adventures", "Black Mountain Adventure"],
      bestFor: "Building caving skills, club trips",
      lat: 51.8389,
      lng: -3.6950,
    },
    {
      name: "Ogof Ffynnon Ddu (OFD)",
      slug: "ogof-ffynnon-ddu",
      difficulty: "expert",
      location: "Penwyllt, Brecon Beacons",
      description: "Britain's deepest cave (308m) and third longest (60+ km). A vast three-dimensional maze of passages, streamways, and boulder chambers. OFD has three main sections: OFD1 (entrance series), OFD2 (top entrance), and OFD3. The through-trip from Top Entrance to OFD1 is the deepest through-trip in Britain at 231m — a serious undertaking.",
      whatToExpect: [
        "Multi-hour trips (6-12+ hours)",
        "Complex navigation in 3D maze",
        "Deep pitches requiring SRT",
        "Swimming through sumps",
        "National Nature Reserve rules"
      ],
      typicalDuration: "6-12+ hours",
      operatorsOffering: ["South Wales Caving Club (permit required)", "Specialist caving instructors"],
      bestFor: "Experienced cavers only",
      permitRequired: true,
      permitInfo: "Access controlled by South Wales Caving Club. Training weekends available for prospective cavers.",
      lat: 51.8431,
      lng: -3.6897,
    },
    {
      name: "Dan yr Ogof (Wild Sections)",
      slug: "dan-yr-ogof-wild",
      difficulty: "expert",
      location: "Brecon Beacons",
      description: "Beyond the show cave lies 16km of wild passage — Britain's second-longest cave system. Features deep sumps, technical diving sections, and passages only explored by a handful of cavers. The cave was discovered in 1912 but new passages are still being found.",
      whatToExpect: [
        "Cave diving sections",
        "Multi-day expeditions possible",
        "Technical rigging required",
        "Historic exploration zone",
        "Permit and permission essential"
      ],
      typicalDuration: "Variable",
      operatorsOffering: ["Permission from showcaves required", "Specialist expedition cavers only"],
      bestFor: "Expert cavers and cave divers",
      permitRequired: true,
      lat: 51.8389,
      lng: -3.6861,
    },
    {
      name: "Pembrokeshire Sea Caves",
      slug: "pembrokeshire-sea-caves",
      difficulty: "beginner",
      location: "Pembrokeshire Coast",
      description: "The Pembrokeshire coast hides dozens of sea caves accessible by kayak or coasteering. Explore carved passages, echoing chambers, and swim through flooded caverns with seals, starfish, and phosphorescent plankton. A completely different caving experience — no crawling, just sea-level exploration.",
      whatToExpect: [
        "Sea kayaking or coasteering access",
        "Swimming into caves",
        "Marine wildlife encounters",
        "Tidal timing essential",
        "Guided trips recommended"
      ],
      typicalDuration: "Half-day to full-day",
      operatorsOffering: ["TYF Adventure", "Celtic Quest Coasteering", "Preseli Venture"],
      bestFor: "Families, wildlife lovers, those avoiding tight spaces",
      lat: 51.8547,
      lng: -5.2289,
    },
  ],
  
  // Operators
  operators: [
    {
      name: "Black Mountain Adventure",
      slug: "black-mountain-adventure",
      website: "https://www.blackmountain.co.uk",
      location: "Brecon Beacons",
      services: ["Beginner caving", "Intermediate trips", "Corporate team building", "Schools", "Stag/hen parties"],
      priceFrom: 65,
      rating: 4.9,
      reviewCount: 500,
      specialties: "Porth yr Ogof specialists with 15 entrances to choose from. All equipment provided including wetsuits and helmets.",
      minGroupSize: 4,
      equipment: "Full wetsuit, cave suit, helmet, torch provided",
      lat: 51.8150,
      lng: -3.5800,
    },
    {
      name: "Blue Ocean Activities",
      slug: "blue-ocean-activities",
      website: "https://www.blueoceanactivities.co.uk",
      location: "Brecon Beacons",
      services: ["Caving", "Coasteering", "Gorge walking", "Paddle boarding"],
      priceFrom: 59,
      rating: 5.0,
      reviewCount: 600,
      specialties: "TripAdvisor Travellers' Choice award. 10+ years guiding experience. Tailored trips for all abilities.",
      minGroupSize: 4,
      equipment: "All equipment provided",
      lat: 51.8100,
      lng: -3.5700,
    },
    {
      name: "Hawk Adventures",
      slug: "hawk-adventures",
      website: "https://www.hawkadventures.co.uk",
      location: "Brecon Beacons",
      services: ["Caving", "Rock climbing", "Gorge walking", "Navigation courses", "Team building"],
      priceFrom: 65,
      rating: 4.8,
      reviewCount: 350,
      specialties: "Operating since 1990. Bespoke caving trips from beginner to advanced. Award-winning outdoor education provider.",
      minGroupSize: 4,
      equipment: "All equipment provided",
      lat: 51.8200,
      lng: -3.5900,
    },
    {
      name: "Adventure Britain",
      slug: "adventure-britain",
      website: "https://www.adventurebritain.com",
      location: "Penderyn, Brecon Beacons",
      services: ["Caving", "Coasteering", "Climbing", "Gorge walking", "Multi-activity days"],
      priceFrom: 65,
      rating: 4.9,
      reviewCount: 450,
      specialties: "Based near Porth yr Ogof. Comprehensive beginner courses and intermediate progression trips.",
      minGroupSize: 4,
      equipment: "All equipment provided",
      lat: 51.7800,
      lng: -3.5600,
    },
    {
      name: "TYF Adventure",
      slug: "tyf-adventure",
      website: "https://www.tyf.com",
      location: "St Davids, Pembrokeshire",
      services: ["Caving", "Coasteering", "Sea kayaking", "Surfing", "Climbing"],
      priceFrom: 75,
      rating: 4.8,
      reviewCount: 800,
      specialties: "Brecon Beacons caving plus Pembrokeshire sea caves. UK's original coasteering company.",
      minGroupSize: 2,
      equipment: "All equipment provided",
      lat: 51.8820,
      lng: -5.2640,
    },
    {
      name: "UWC Atlantic Experience",
      slug: "uwc-atlantic-experience",
      website: "https://uwcatlanticexperience.com",
      location: "Atlantic College, South Wales",
      services: ["Caving", "Kayaking", "Climbing", "Coasteering", "Outdoor education"],
      priceFrom: 70,
      rating: 4.7,
      reviewCount: 200,
      specialties: "Based at UWC Atlantic College. Full-day experiences including lunch break. Ages 10+.",
      minGroupSize: 8,
      equipment: "All equipment provided",
      lat: 51.4020,
      lng: -3.4450,
    },
    {
      name: "Parkwood Outdoors Dolygaer",
      slug: "parkwood-dolygaer",
      website: "https://www.parkwoodoutdoors.co.uk/centre/dolygaer",
      location: "Dolygaer, Brecon Beacons",
      services: ["Caving", "Climbing", "Kayaking", "Archery", "Residential courses"],
      priceFrom: 45,
      rating: 4.6,
      reviewCount: 300,
      specialties: "Award-winning activity centre with residential accommodation. School groups and corporate specialists.",
      minGroupSize: 6,
      equipment: "All equipment provided",
      lat: 51.9200,
      lng: -3.4500,
    },
    {
      name: "Adventure Activities Wales",
      slug: "adventure-activities-wales",
      website: "https://www.adventureactivitieswales.co.uk",
      location: "Caernarfon, North Wales",
      services: ["Underground adventures", "Mine exploration", "Coasteering", "Canyoning", "MTB"],
      priceFrom: 55,
      rating: 4.9,
      reviewCount: 250,
      specialties: "Family-run business. Mine explorations in Snowdonia slate caverns. Free photo/video documentation.",
      minGroupSize: 2,
      equipment: "All equipment provided",
      lat: 53.1400,
      lng: -4.2700,
    },
    {
      name: "Go Below Underground Adventures",
      slug: "go-below",
      website: "https://www.go-below.co.uk",
      location: "Betws-y-Coed, Snowdonia",
      services: ["Underground adventure", "Mine exploration", "Zip lines", "Via ferrata", "Waterfall abseil"],
      priceFrom: 99,
      rating: 4.9,
      reviewCount: 2500,
      specialties: "Unique underground adventures in Victorian slate mines. Underground waterfalls, boat trips, and Britain's deepest underground zip line.",
      minGroupSize: 1,
      equipment: "All equipment provided",
      lat: 53.0920,
      lng: -3.7980,
    },
    {
      name: "Celtic Quest Coasteering",
      slug: "celtic-quest",
      website: "https://www.celticquestcoasteering.com",
      location: "Abereiddy, Pembrokeshire",
      services: ["Sea cave exploration", "Coasteering", "Cliff jumping", "Marine wildlife"],
      priceFrom: 45,
      rating: 4.9,
      reviewCount: 600,
      specialties: "Pembrokeshire sea cave specialists. Explore caves by swimming and coasteering.",
      minGroupSize: 2,
      equipment: "Wetsuits, helmets, buoyancy aids provided",
      lat: 51.9350,
      lng: -5.2030,
    },
    {
      name: "South Wales Caving Club",
      slug: "swcc",
      website: "https://www.swcc.org.uk",
      location: "Penwyllt, Brecon Beacons",
      services: ["Club trips", "Training weekends", "Cave access", "Accommodation"],
      priceFrom: 20,
      rating: null,
      reviewCount: null,
      specialties: "Manage access to Ogof Ffynnon Ddu. Training weekends for prospective members. Clubhouse with accommodation.",
      minGroupSize: null,
      equipment: "Personal gear required for members",
      lat: 51.8367,
      lng: -3.7044,
    },
  ],
  
  // Regional breakdown
  regions: [
    {
      name: "Brecon Beacons (Bannau Brycheiniog)",
      slug: "brecon-beacons",
      description: "The undisputed heartland of Welsh caving. The Brecon Beacons contains four of Britain's five longest cave systems, including the deepest (Ogof Ffynnon Ddu) and second-longest (Dan yr Ogof). The limestone belt runs through the southern edge of the National Park, creating a concentration of caves unmatched anywhere in the UK.",
      mainCaves: ["Dan yr Ogof", "Porth yr Ogof", "Ogof Ffynnon Ddu", "Little Neath River Cave", "Bridge Cave"],
      bestFor: "Serious caving, showcaves, adventure trips",
      keyFacts: [
        "4 of Britain's 5 longest caves",
        "Britain's deepest cave (308m)",
        "UK's largest showcave",
        "Most adventure caving operators"
      ],
    },
    {
      name: "Pembrokeshire Coast",
      slug: "pembrokeshire",
      description: "A different kind of caving experience — sea caves carved into the dramatic Pembrokeshire coastline. Access is by kayak, coasteering, or swimming at low tide. Less claustrophobic than underground caving but equally spectacular, with opportunities to spot seals, starfish, and bioluminescent plankton.",
      mainCaves: ["Pwll y Wrach (Witches Cauldron)", "St Non's Bay caves", "Blue Lagoon sea caves", "Ramsey Island caves"],
      bestFor: "Sea caves, coasteering, families, wildlife",
      keyFacts: [
        "Dozens of sea caves",
        "Access via coasteering/kayak",
        "Seal colonies",
        "Less claustrophobic experience"
      ],
    },
    {
      name: "Snowdonia (North Wales)",
      slug: "snowdonia",
      description: "While natural caves are limited in Snowdonia, the Victorian slate industry left an incredible underground legacy. Vast quarried caverns at Llechwedd and elsewhere offer underground experiences from tourist attractions to serious adventure courses. Go Below operates Britain's deepest underground zip line.",
      mainCaves: ["Zip World Caverns (Llechwedd)", "Go Below mines", "Sygun Copper Mine"],
      bestFor: "Underground adventures, mines, family attractions",
      keyFacts: [
        "Victorian slate caverns",
        "Underground zip lines",
        "Mine exploration",
        "Year-round access"
      ],
    },
  ],
  
  // Difficulty guide
  difficultyGuide: [
    {
      level: "beginner",
      label: "Beginner",
      color: "#22c55e",
      description: "Short trips in horizontal caves with easy passages. Some crawling and wading, but nothing technical. All kit provided, no experience needed.",
      whatToExpect: [
        "2-4 hour trips",
        "Basic crawling and walking",
        "Some water wading (thigh-deep max)",
        "Short squeezes through passages",
        "Complete darkness experience"
      ],
      physicalRequirements: "Basic fitness — if you can walk a few miles and climb a few flights of stairs, you can do this. Ability to crawl on hands and knees. No claustrophobia (though mild nervousness is normal).",
      suitableCaves: ["Porth yr Ogof", "Bridge Cave", "Pembrokeshire sea caves"],
      icon: "circle",
    },
    {
      level: "intermediate",
      label: "Intermediate",
      color: "#3b82f6",
      description: "Longer trips with more challenging passages. Extended crawls, tighter squeezes, deeper water, and some vertical sections using ladders. Previous caving experience recommended.",
      whatToExpect: [
        "4-6 hour trips",
        "Extended flat-out crawling",
        "Swimming through flooded passages",
        "Ladder climbs",
        "Technical route-finding"
      ],
      physicalRequirements: "Good fitness required. Upper body strength for climbing. Comfortable in confined spaces. Previous beginner trip recommended.",
      suitableCaves: ["Little Neath River Cave", "Town Drain", "Cwm Dwr (easier routes)"],
      icon: "square",
    },
    {
      level: "advanced",
      label: "Advanced",
      color: "#ef4444",
      description: "Serious caving requiring technical skills. Single rope technique (SRT) for vertical pitches. Multi-hour trips in complex cave systems. Club membership or extensive experience essential.",
      whatToExpect: [
        "6-10+ hour trips",
        "SRT descents and ascents",
        "Complex 3D navigation",
        "Sumps (flooded passages)",
        "Serious commitment required"
      ],
      physicalRequirements: "High fitness level. Technical rope skills (SRT). Experience of multiple intermediate trips. Mental resilience for long trips underground.",
      suitableCaves: ["Ogof Ffynnon Ddu (shorter routes)", "Cwm Dwr through-trips"],
      icon: "diamond",
    },
    {
      level: "expert",
      label: "Expert",
      color: "#111",
      description: "Expedition-level caving. Multi-day trips, cave diving, technical exploration. Reserved for experienced cavers with club backing and emergency skills.",
      whatToExpect: [
        "10+ hour to multi-day trips",
        "Cave diving sections",
        "First exploration possible",
        "Self-rescue capability required",
        "Permit and permission essential"
      ],
      physicalRequirements: "Elite caving fitness. Full SRT proficiency. Cave diving qualification for some systems. Years of progressive experience.",
      suitableCaves: ["OFD deep systems", "Dan yr Ogof (wild sections)"],
      icon: "skull",
    },
  ],
  
  // Gear guide
  gearGuide: {
    operatorProvided: [
      { item: "Wetsuit", description: "3-5mm neoprene for water caves (warmer than it sounds)" },
      { item: "Oversuit/Cavesuit", description: "Tough outer layer over wetsuit to protect against abrasion" },
      { item: "Helmet", description: "Essential — caves have low ceilings and rock falls" },
      { item: "Headtorch", description: "Helmet-mounted LED light (operators carry spares)" },
      { item: "Wellies", description: "Wellington boots (sometimes available to hire for ~£3)" },
    ],
    youBring: [
      { item: "Swimwear", description: "To wear under wetsuit" },
      { item: "Towel", description: "You will be wet and muddy afterwards" },
      { item: "Change of clothes", description: "Including warm layers for after" },
      { item: "Old trainers", description: "Backup if wellies don't fit" },
      { item: "Hot drink/snack", description: "For warming up afterwards" },
    ],
    ownGearCavers: [
      { item: "Personal SRT kit", description: "Harness, descender, ascenders, cowstails" },
      { item: "Undersuit", description: "Fleece or thermal layer under oversuit" },
      { item: "Multiple light sources", description: "Primary + backup + backup backup" },
      { item: "Emergency kit", description: "First aid, bivvy bag, whistle, food" },
    ],
    tips: [
      "Avoid jewellery — it catches on rock and gets lost",
      "Tie back long hair",
      "Bring a plastic bag for wet kit",
      "Contact lenses better than glasses (they fog up)",
      "Don't eat a massive meal beforehand — you'll be crawling",
    ],
  },
  
  // Season guide
  seasonGuide: {
    spring: {
      months: "March - May",
      conditions: "Water levels dropping after winter. Show caves open from Easter. Good balance of fewer crowds and reasonable conditions.",
      rating: 4,
      tip: "Late spring (May) is excellent — warmer outside for changing, water levels manageable. Book Easter weekends early.",
    },
    summer: {
      months: "June - August",
      conditions: "Peak season for show caves and adventure trips. Water levels lowest. Longest days make post-caving more pleasant. Busiest period.",
      rating: 5,
      tip: "Book adventure trips 2-3 weeks ahead for weekends. Water in caves is refreshingly cool on hot days. The temperature underground is constant 10°C year-round.",
    },
    autumn: {
      months: "September - November",
      conditions: "Quieter than summer. Water levels rising after autumn rains. Some operators reduce schedules. Show caves open until end October typically.",
      rating: 4,
      tip: "September is ideal — summer crowds gone, water still manageable. Check operator schedules as some wind down. Check water levels after heavy rain.",
    },
    winter: {
      months: "December - February",
      conditions: "Show caves closed. Water levels high in adventure caves — some become inaccessible. Underground mines and dry caves still available. The underground temperature is actually warmer than outside!",
      rating: 3,
      tip: "Wild caves are actually warmer in winter than summer (constant 10°C). Focus on mine adventures (Zip World, Go Below) which run year-round. Check with operators — some run winter trips in lower water caves.",
    },
  },
  
  // What to expect section
  whatToExpect: {
    beforeYouGo: [
      "Book in advance — groups of 4+ typically required",
      "Confirm you can swim (for water caves)",
      "Disclose any medical conditions or claustrophobia",
      "Eat a light meal 2 hours before",
      "Arrive 15-30 minutes early for briefing",
    ],
    duringTheTrip: [
      "Full safety briefing and equipment fitting",
      "Walk/drive to cave entrance (varies 5-30 mins)",
      "Enter cave as a group, guide leads",
      "Mix of walking, crawling, climbing, wading",
      "Stop for rest and water in chambers",
      "Photography opportunities in larger spaces",
      "Exit and debrief",
    ],
    afterTheTrip: [
      "Change out of wet gear (bring towel and dry clothes)",
      "Hot drink/snack (some operators provide)",
      "Photos often shared via WhatsApp/email",
      "Expect to feel tired but exhilarated",
      "You will find sand in strange places for days",
    ],
  },
  
  // FAQs
  faqs: [
    {
      question: "I'm claustrophobic — can I still go caving?",
      answer: "Many people with mild claustrophobia successfully cave — the darkness is often more challenging than the tight spaces. Start with a beginner cave like Porth yr Ogof which has large chambers, or try sea caves which feel more open. Talk to your guide about your concerns — they're experts at building confidence. That said, if you have severe claustrophobia, caving may not be for you."
    },
    {
      question: "How fit do I need to be?",
      answer: "For beginner trips, if you can walk 3-4 miles and climb several flights of stairs, you'll be fine. You'll be crawling on hands and knees, so arm strength helps. Intermediate and advanced caving requires progressively higher fitness. The biggest factor is mental resilience — being comfortable in confined spaces underground for several hours."
    },
    {
      question: "Will I get stuck in a tight passage?",
      answer: "Guides choose caves appropriate to group size and experience. If a squeeze is too tight for you, there's always an alternative route or you simply don't do that section. Getting genuinely stuck is extremely rare with guided trips. The squeezes are uncomfortable, not dangerous."
    },
    {
      question: "What's the temperature in Welsh caves?",
      answer: "Underground temperature is constant year-round at about 10°C (50°F). This feels cold when you first enter from summer heat, but warming after coming in from a winter's day. Wetsuits keep you warm in water caves. You'll likely feel cooler when you stop moving, so guides keep groups active."
    },
    {
      question: "Is caving safe?",
      answer: "Guided caving with reputable operators has an excellent safety record. All commercial operators are insured and follow British Caving Association guidelines. Caves themselves don't change — the same passages have been used for decades. Risks come from flooding (guides check conditions), getting lost (guides know the routes), and minor injuries from slipping (helmets and careful movement mitigate this). The South Wales Cave Rescue Team is world-class."
    },
    {
      question: "Can children go caving?",
      answer: "Show caves welcome all ages. For adventure caving, minimum age is typically 10-12 years, depending on operator and cave. Children need to be comfortable in dark, wet environments. Family-specific trips are available from several operators. Sea caves via coasteering often have lower age minimums (8+)."
    },
    {
      question: "Do I need to know how to swim?",
      answer: "For water caves like Porth yr Ogof, swimming ability is required — you'll be wading chest-deep and occasionally swimming short distances. Dry caves and show caves don't require swimming. Be honest with your operator about swimming ability when booking."
    },
    {
      question: "What happens if it rains?",
      answer: "Light rain doesn't affect cave trips — you're going to get wet anyway. However, heavy or persistent rain raises water levels in active (water-bearing) caves, making them dangerous. Operators monitor conditions and will reschedule if unsafe. This is most common in autumn/winter. Dry caves and mines are unaffected by rain."
    },
    {
      question: "Can I take photos underground?",
      answer: "Most operators allow and encourage photography. Phone cameras work well with modern LED lighting, but expect them to get wet and muddy. Waterproof cases recommended. Action cameras (GoPro etc.) are ideal. Some operators provide professional photos included in the price. Ask before your trip."
    },
    {
      question: "What if I need the toilet underground?",
      answer: "There are no facilities underground — go before you enter! Most trips are 3-4 hours, which is manageable. For longer trips, talk to your guide about protocol (essentially: hold it or emergency measures apply). This is rarely an issue in practice."
    },
  ],
  
  // Related content
  relatedActivities: ["gorge-walking", "coasteering", "climbing"],
  relatedItineraries: ["multi-sport-challenge", "adrenaline-junkie-weekend", "brecon-beacons-adventure"],
  relatedPosts: [], // Will link to any caving posts
};
