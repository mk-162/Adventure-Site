export const coasteeringHub = {
  title: "Coasteering in Wales",
  strapline: "The birthplace of coasteering — cliff jumping, wild swimming, and coastal exploration where it all began",
  metaTitle: "Coasteering in Wales | Pembrokeshire, Gower & Anglesey | Adventure Wales",
  metaDescription: "The complete guide to coasteering in Wales — where it was invented. Cliff jumping, cave exploration, and wild swimming in Pembrokeshire, Gower, and Anglesey.",
  
  // Key stats for hero
  stats: {
    yearInvented: 1986,
    coastlineMiles: 870,
    operators: "20+",
    blueFlag: "45 beaches",
  },
  
  // Introduction - compelling editorial (3-4 paragraphs)
  introduction: `Coasteering was invented in Wales. Full stop. In 1986, Andy Middleton and his team at TYF Adventure in St Davids took the ancient art of exploring the coastal margin and turned it into a guided activity that has since spread across the world. Before TYF trademarked the term in the 1990s, climbers like Colin Mortlock had been exploring Pembrokeshire's sea cliffs since the 1960s — but it was that group of St Davids pioneers who created coasteering as we know it today.

What is coasteering? It's scrambling along rocky coastlines, leaping off cliffs into deep water, swimming through sea caves, and generally treating the coast as nature's ultimate adventure playground. Unlike other water sports, coasteering doesn't require months of training — with a wetsuit, buoyancy aid, helmet, and an experienced guide, beginners can experience the thrill of cliff jumping and cave exploring on their very first session. It's accessible adventure at its finest.

Pembrokeshire remains the undisputed world capital of coasteering. The Blue Lagoon at Abereiddy, the dramatic cliffs around St Davids Head, the caves of Stackpole — these locations offer geological features that seem purpose-built for the sport. Vertical cliffs plunge into deep water, sea caves penetrate the headlands, and natural platforms provide jumping spots from knee-trembling heights. The Gower Peninsula and Anglesey have developed their own coasteering scenes, but Pembrokeshire is where the magic began.

The beauty of coasteering is its adaptability. Guides assess the group and conditions, then choose a route that matches everyone's confidence. Nervous about jumping? No problem — there are always lower options or you can simply swim around. Craving adrenaline? There are cliffs where you can launch yourself from dizzying heights into the clear Welsh waters. No two sessions are ever the same, because the coast changes with every tide, every swell, every season. This is raw, elemental adventure — and Wales does it better than anywhere on earth.`,
  
  // Featured Locations
  coasteeringSpots: [
    {
      name: "St Davids Peninsula",
      slug: "st-davids-peninsula",
      region: "Pembrokeshire",
      regionSlug: "pembrokeshire",
      location: "Near St Davids",
      description: "The birthplace of coasteering. Dramatic cliffs, hidden coves, sea caves, and world-class jumping spots around Britain's smallest city. This is where TYF Adventure pioneered the sport in 1986.",
      difficulty: ["beginner", "intermediate", "advanced"],
      features: ["caves", "jumping", "swimming", "scrambling", "wildlife"],
      bestFor: "Classic Pembrokeshire coasteering with the original operators",
      insiderTip: "Book with TYF Adventure for the authentic experience — they invented the sport here. The coast near Porthclais is particularly spectacular.",
      operators: ["TYF Adventure", "Celtic Quest", "The Real Adventure Company"],
      rating: 4.9,
      lat: 51.8827,
      lng: -5.2691,
    },
    {
      name: "Abereiddy Blue Lagoon",
      slug: "abereiddy-blue-lagoon",
      region: "Pembrokeshire",
      regionSlug: "pembrokeshire",
      location: "Abereiddy",
      description: "An old slate quarry flooded by the sea, creating a stunning blue-green lagoon surrounded by dark cliffs. Iconic finishing point for many coasteering sessions with jumps ranging from beginner-friendly to genuinely terrifying.",
      difficulty: ["beginner", "intermediate", "advanced"],
      features: ["lagoon", "jumping", "quarry-cliffs", "clear-water"],
      bestFor: "Iconic blue lagoon jumping and beginner-friendly sessions",
      insiderTip: "The lagoon is home to cliff diving competitions. There are jumps from 3m to 20m+ — you decide how brave you're feeling. The water is surprisingly cold!",
      operators: ["Celtic Quest", "Preseli Venture", "TYF Adventure"],
      rating: 4.8,
      lat: 51.9372,
      lng: -5.2061,
    },
    {
      name: "Stackpole Quay",
      slug: "stackpole-quay",
      region: "Pembrokeshire",
      regionSlug: "pembrokeshire",
      location: "Near Pembroke",
      description: "South Pembrokeshire gem with indented limestone cliffs, sea caves, and natural arches. Less exposed than the north coast, making it reliable in more conditions. Often combined with a visit to nearby Barafundle Bay.",
      difficulty: ["beginner", "intermediate"],
      features: ["limestone-cliffs", "caves", "arches", "sheltered"],
      bestFor: "More sheltered conditions and limestone scenery",
      insiderTip: "After your session, walk to Barafundle Bay — consistently rated one of Britain's best beaches. Pack a picnic.",
      operators: ["Outer Reef", "Pembrokeshire Adventures"],
      rating: 4.7,
      lat: 51.6308,
      lng: -4.9097,
    },
    {
      name: "Freshwater West",
      slug: "freshwater-west",
      region: "Pembrokeshire",
      regionSlug: "pembrokeshire",
      location: "Near Pembroke",
      description: "Famous surf beach with rocky outcrops at either end perfect for coasteering. More exposed to Atlantic swells, so conditions dependent. The dramatic dunes featured in Harry Potter films.",
      difficulty: ["intermediate", "advanced"],
      features: ["exposed-coast", "rock-pools", "surf-influence", "dramatic-scenery"],
      bestFor: "Experienced coasteerers looking for wilder conditions",
      insiderTip: "Conditions here can be challenging — best for those with some experience. The south end has more sheltered pools and caves.",
      operators: ["Various Pembrokeshire operators"],
      rating: 4.6,
      lat: 51.6358,
      lng: -5.0656,
    },
    {
      name: "Rhossili & Worms Head",
      slug: "rhossili-worms-head",
      region: "Gower Peninsula",
      regionSlug: "gower",
      location: "Rhossili, Swansea",
      description: "Dramatic limestone cliffs at the tip of the Gower Peninsula. Coasteering here combines stunning scenery with excellent wildlife spotting — grey seals are common. Less crowded than Pembrokeshire.",
      difficulty: ["beginner", "intermediate", "advanced"],
      features: ["limestone", "seals", "caves", "dramatic-cliffs"],
      bestFor: "Gower coasteering with seal encounters",
      insiderTip: "Sessions here often include close encounters with grey seals. The limestone creates incredible caves and natural arches. Combine with a walk on Rhossili Bay.",
      operators: ["Adventures Wales", "Surfability UK", "Gower Adventures"],
      rating: 4.7,
      lat: 51.5667,
      lng: -4.2897,
    },
    {
      name: "Three Cliffs Bay",
      slug: "three-cliffs-bay",
      region: "Gower Peninsula",
      regionSlug: "gower",
      location: "Near Swansea",
      description: "One of Wales's most photographed beaches with distinctive limestone pinnacles. The cliffs and caves around the bay provide excellent coasteering opportunities in a stunning setting.",
      difficulty: ["beginner", "intermediate"],
      features: ["limestone-pinnacles", "caves", "scenic", "sheltered"],
      bestFor: "Scenic coasteering in an iconic location",
      insiderTip: "Access is on foot only, which keeps crowds down. The limestone is sharp — follow your guide's instructions about hand and foot placement.",
      operators: ["Adventures Wales", "Gower Adventures"],
      rating: 4.6,
      lat: 51.5692,
      lng: -4.1106,
    },
    {
      name: "Rhoscolyn",
      slug: "rhoscolyn",
      region: "Anglesey",
      regionSlug: "anglesey",
      location: "Holy Island, Anglesey",
      description: "Crystal-clear waters and dramatic cliffs on Holy Island. Less developed than Pembrokeshire but offering excellent coasteering with seabird colonies and stunning views across to Snowdonia.",
      difficulty: ["beginner", "intermediate", "advanced"],
      features: ["clear-water", "seabirds", "remote", "dramatic"],
      bestFor: "Clear water and a less commercial experience",
      insiderTip: "The water clarity here rivals anywhere in the UK. Sessions are weather-dependent — north coast can be rough. Great views of Snowdonia on clear days.",
      operators: ["Coasteering Wales", "Anglesey Adventures", "Sea & Summit"],
      rating: 4.7,
      lat: 53.2478,
      lng: -4.6303,
    },
    {
      name: "Porth Dafarch",
      slug: "porth-dafarch",
      region: "Anglesey",
      regionSlug: "anglesey",
      location: "Near Holyhead",
      description: "Sheltered cove near Holyhead with good rock pools and jumping spots. More accessible than other Anglesey locations with easier parking and facilities.",
      difficulty: ["beginner", "intermediate"],
      features: ["sheltered", "accessible", "rock-pools", "family-friendly"],
      bestFor: "Accessible Anglesey coasteering for beginners",
      insiderTip: "More sheltered than other Anglesey spots, making it reliable in mixed conditions. Good café at the beach for post-session treats.",
      operators: ["Coasteering Wales", "Anglesey Adventures"],
      rating: 4.5,
      lat: 53.3003,
      lng: -4.6478,
    },
  ],
  
  // Regional breakdown
  regions: [
    {
      name: "Pembrokeshire",
      slug: "pembrokeshire",
      tagline: "The birthplace and world capital of coasteering",
      bestFor: ["Original operators", "World-class locations", "All levels", "Caves and cliffs"],
      highlights: [
        "St Davids — where coasteering was invented",
        "Blue Lagoon at Abereiddy — iconic jumping spot",
        "Stackpole — limestone caves and arches",
        "20+ operators to choose from",
      ],
      topSpot: "St Davids Peninsula",
    },
    {
      name: "Gower Peninsula",
      slug: "gower",
      tagline: "Dramatic limestone cliffs and grey seal encounters",
      bestFor: ["Seal spotting", "Limestone scenery", "Less crowded", "Scenic coasteering"],
      highlights: [
        "Rhossili — seals and dramatic cliffs",
        "Three Cliffs Bay — iconic limestone pinnacles",
        "Closer to Swansea and Cardiff",
        "Britain's first AONB",
      ],
      topSpot: "Rhossili & Worms Head",
    },
    {
      name: "Anglesey",
      slug: "anglesey",
      tagline: "Crystal-clear waters and remote coastal adventure",
      bestFor: ["Clear water", "Remote feeling", "Less commercial", "North Wales access"],
      highlights: [
        "Rhoscolyn — stunning clarity and seabird colonies",
        "Holy Island — dramatic coastal features",
        "Less crowded than Pembrokeshire",
        "Views to Snowdonia",
      ],
      topSpot: "Rhoscolyn",
    },
  ],
  
  // What to expect guide
  whatToExpect: {
    duration: "2-3 hours typical session",
    groupSize: "6-12 participants per guide",
    includedGear: ["Wetsuit", "Helmet", "Buoyancy aid"],
    toBring: ["Swimwear", "Old trainers with laces (essential)", "Towel", "Change of clothes", "Shorts to wear over wetsuit (optional)"],
    activities: [
      {
        name: "Cliff Jumping",
        description: "From knee-height to 10+ metres. You choose your level — nothing is compulsory.",
      },
      {
        name: "Sea Cave Exploration",
        description: "Swimming into dark caves, some with bioluminescent plankton when conditions are right.",
      },
      {
        name: "Rock Scrambling",
        description: "Traversing along the coast at sea level, using hands and feet on rocky terrain.",
      },
      {
        name: "Wild Swimming",
        description: "Swimming between features, through gullies, and across open water.",
      },
      {
        name: "Wildlife Watching",
        description: "Seals, seabirds, jellyfish, and marine life — you're in their world.",
      },
    ],
  },
  
  // Season guide
  seasonGuide: {
    spring: {
      months: "March - May",
      conditions: "Sea temperatures 10-13°C. Calmer conditions emerging. Some breeding seabirds — operators avoid sensitive areas. Quieter sessions.",
      rating: 4,
      waterTemp: "10-13°C",
      tip: "May is ideal — warmer water, longer days, before summer crowds. Seal pups from autumn are now independent and curious about swimmers.",
    },
    summer: {
      months: "June - August",
      conditions: "Peak season. Warmest water (15-17°C). Longest days. Best conditions but busiest periods. Book well in advance.",
      rating: 5,
      waterTemp: "15-17°C",
      tip: "Book at least a week ahead in July/August. Early morning or evening sessions are quieter. The water is at its warmest but still cold!",
    },
    autumn: {
      months: "September - November",
      conditions: "Water still warm (13-16°C) in September. Crowds thin. Swells increasing. Grey seal breeding season — operators take care around haul-outs.",
      rating: 4,
      waterTemp: "13-16°C",
      tip: "September is a sweet spot — summer water temps, fewer crowds, beautiful light. October onwards gets chilly and weather-dependent.",
    },
    winter: {
      months: "December - February",
      conditions: "Cold water (8-11°C). Rough conditions common. Limited sessions available. For the dedicated only.",
      rating: 2,
      waterTemp: "8-11°C",
      tip: "Some operators run winter sessions for the brave. Thick wetsuits essential. Book a session then warm up in a St Davids pub.",
    },
  },
  
  // Safety information
  safetyGuide: {
    requirements: [
      "Must be able to swim 25 metres unaided",
      "No experience necessary — all skills taught on the day",
      "Moderate fitness helpful but sessions adapt to all levels",
      "Under 18s require parental consent (some operators have minimum ages)",
      "Medical conditions should be disclosed at booking",
    ],
    providedGear: [
      "Full wetsuit (5mm typically)",
      "Helmet (protects from rocks and accidental kicks)",
      "Buoyancy aid (keeps you afloat even in rough water)",
      "Some operators provide wetsuit boots",
    ],
    safetyMeasures: [
      "Qualified guides with lifeguard training and first aid",
      "Routes adapted to conditions — guides check tides, swell, weather",
      "No one forced to jump — alternatives always available",
      "Group briefing covers signals, entries, and emergency procedures",
      "All operators should be licensed by Adventure Activities Licensing Authority",
    ],
    risks: "Coasteering involves inherent risks including cold water, slippery rocks, changing sea conditions, and underwater hazards. Go with a licensed operator and follow guide instructions. Never coasteer independently unless very experienced.",
  },
  
  // Featured operators
  operators: [
    {
      name: "TYF Adventure",
      location: "St Davids, Pembrokeshire",
      description: "The original coasteering company — founded 1986. Over 200,000 participants. Highly experienced guides and the most iconic routes in Pembrokeshire.",
      priceFrom: "£75",
      duration: "3.5 hours",
      website: "https://www.tyf.com",
      established: 1986,
    },
    {
      name: "Celtic Quest Coasteering",
      location: "Abereiddy, Pembrokeshire",
      description: "Specialists based at the famous Blue Lagoon. All adventures finish with jumps into the stunning blue water of the flooded slate quarry.",
      priceFrom: "£55",
      duration: "2.5-3 hours",
      website: "https://www.celticquestcoasteering.com",
      established: 2008,
    },
    {
      name: "Preseli Venture",
      location: "Mathry, Pembrokeshire",
      description: "Eco-focused operator with on-site accommodation. Offers combined kayaking and coasteering full-day experiences. Family-friendly.",
      priceFrom: "£52",
      duration: "Half to full day",
      website: "https://www.preseliventure.co.uk",
      established: null,
    },
    {
      name: "Outer Reef Surf School",
      location: "Tenby, Pembrokeshire",
      description: "Multi-activity operator covering South Pembrokeshire. Coasteering at Stackpole and surrounding areas. Also offers surfing and kayaking.",
      priceFrom: "£45",
      duration: "2.5 hours",
      website: "https://www.outerreefsurfschool.com",
      established: 1999,
    },
    {
      name: "Adventures Wales",
      location: "Gower Peninsula",
      description: "Gower specialists with sessions at Rhossili, Three Cliffs Bay, and Oxwich. Focus on wildlife and scenic coasteering. Seal encounters common.",
      priceFrom: "£55",
      duration: "3 hours",
      website: "https://www.adventureswales.co.uk",
      established: null,
    },
    {
      name: "Coasteering Wales",
      location: "Anglesey",
      description: "Anglesey specialists offering sessions at Rhoscolyn and Porth Dafarch. Clear waters and dramatic Holy Island scenery.",
      priceFrom: "£50",
      duration: "3 hours",
      website: "https://www.coasteering-wales.co.uk",
      established: null,
    },
  ],
  
  // FAQs
  faqs: [
    {
      question: "What is coasteering exactly?",
      answer: "Coasteering is exploring the rocky coastline at sea level — a combination of rock scrambling, cliff jumping, cave swimming, and wild swimming. You wear a wetsuit, helmet, and buoyancy aid, and follow a qualified guide who chooses routes based on conditions and the group's confidence.",
    },
    {
      question: "Do I need to be a strong swimmer?",
      answer: "You need to be able to swim 25 metres unaided. The buoyancy aid keeps you afloat even in rough water, and guides are trained in water rescue. You don't need to be an Olympic swimmer, but basic swimming confidence is essential.",
    },
    {
      question: "Is coasteering dangerous?",
      answer: "Like all adventure sports, there are risks — cold water, slippery rocks, and changing sea conditions. However, licensed operators use qualified guides, appropriate safety equipment, and route-planning based on conditions. Accidents are rare when coasteering with professionals.",
    },
    {
      question: "Do I have to jump off cliffs?",
      answer: "Absolutely not. Nothing is compulsory. There are always lower entry points or you can simply swim around. Good guides never pressure anyone to jump from heights they're not comfortable with.",
    },
    {
      question: "What should I bring?",
      answer: "Swimwear (wear under your wetsuit), old trainers or wetsuit boots with laces (essential for grip), a towel, and a change of warm clothes for afterwards. Operators provide wetsuit, helmet, and buoyancy aid.",
    },
    {
      question: "How cold is the water?",
      answer: "Welsh sea temperatures range from 8°C in winter to 17°C in late summer. Even in August, it's cold by most standards. The wetsuit keeps you warm, but expect the initial plunge to be bracing. You warm up quickly once active.",
    },
    {
      question: "Can children do coasteering?",
      answer: "Yes! Many operators accept children from age 8 upwards (varies by company). Sessions are adapted to the group — there are always lower jumps and easier routes for younger or less confident participants. Family sessions are popular.",
    },
    {
      question: "When is the best time for coasteering?",
      answer: "May to September offers the best conditions — warmer water, calmer seas, longer days. July and August are busiest (book ahead). September is often the sweet spot: summer water temps with fewer crowds.",
    },
    {
      question: "How do I choose an operator?",
      answer: "Look for operators licensed by the Adventure Activities Licensing Authority (AALA). Check reviews on TripAdvisor. TYF Adventure in St Davids invented the sport — if in doubt, go to the source. Celtic Quest and Preseli Venture are also excellent Pembrokeshire choices.",
    },
    {
      question: "What if the weather is bad?",
      answer: "Coasteering happens in most conditions — rain doesn't matter when you're in the water! However, high winds, large swells, or thunderstorms may cause cancellations. Operators will contact you and usually reschedule if conditions are unsafe.",
    },
  ],
};
