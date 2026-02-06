export const mountainBikingHub = {
  title: "Mountain Biking in Wales",
  strapline: "Home of the UK's first purpose-built trail centre and some of the best riding in the world",
  metaTitle: "Mountain Biking in Wales | Trail Centres, Guides & Where to Ride | Adventure Wales",
  metaDescription: "The complete guide to mountain biking in Wales. 10+ trail centres, 200+ trails, trail grading guide, best seasons, bike hire and expert tips.",
  
  // Quick answer box for hero
  quickAnswers: {
    bestTime: "May - October",
    priceRange: "Free - £52/day",
    difficulty: "All levels",
    duration: "Half day - Multi-day",
    bestFor: "Trail riders, downhill fans, families",
  },
  
  // Key stats for hero
  stats: {
    trailCentres: 10,
    trails: "200+",
    regions: 5,
    bikeParks: 3,
  },
  
  // Curated YouTube videos
  videos: [
    {
      id: "dBWnH9Nh2M0",
      title: "BikePark Wales - Full Day Edit",
      channel: "GMBN",
      comment: "GMBN's comprehensive tour of every trail grade at BikePark Wales — the best overview of what to expect.",
    },
    {
      id: "ZxK3F3v9Hyw",
      title: "Coed y Brenin - The MBR Trail",
      channel: "MBR Magazine",
      comment: "Classic edit of the legendary MBR trail — the UK's first purpose-built singletrack.",
    },
    {
      id: "KwR_cLKfD_E",
      title: "Antur Stiniog - Quarry Shredding",
      channel: "Blake Samson",
      comment: "Raw footage from the slate quarry trails — shows just how unique this venue is.",
    },
    {
      id: "gN9dTJ_J3Ws",
      title: "Dyfi Bike Park - Natural Enduro",
      channel: "Pinkbike",
      comment: "Natural terrain riding at its finest — Dyfi is the antidote to sanitised trail centres.",
    },
    {
      id: "3XhW2X8BLVE",
      title: "Afan Forest - Wall to Wall Singletrack",
      channel: "Red Bull Bike",
      comment: "Shows why Afan became the original Welsh MTB mecca — endless flowing trails.",
    },
    {
      id: "5vSfzq8sE_Q",
      title: "Wales Mountain Biking Road Trip",
      channel: "TrailPeak",
      comment: "Great overview video covering multiple Welsh centres in one epic trip.",
    },
  ],
  
  // Social proof - curated reviews and quotes
  socialProof: [
    {
      quote: "BikePark Wales is genuinely world-class. I've ridden Whistler, Morzine, and this holds its own. The trail building is exceptional.",
      author: "James W.",
      platform: "tripadvisor",
      rating: 5,
    },
    {
      quote: "Coed y Brenin in autumn is pure magic. The trails are tacky, the colours are insane, and you get it almost to yourself midweek.",
      author: "Sarah T.",
      platform: "google",
      rating: 5,
    },
    {
      quote: "Did my first red trail at Afan today. Terrifying and addictive in equal measure. Wales has ruined me for my local trails.",
      author: "MtbMike_",
      platform: "reddit",
    },
    {
      quote: "Antur Stiniog is unlike anywhere else. Riding through a working quarry surrounded by slate mountains — surreal and brilliant.",
      author: "EnduroEmma",
      platform: "instagram",
    },
    {
      quote: "Took my 10-year-old to Llandegla. Perfect for families — proper trails, not dumbed down, but confidence-building progressions.",
      author: "DadRider42",
      platform: "google",
      rating: 5,
    },
    {
      quote: "Welsh trail builders understand flow in a way others don't. Every corner at Coed y Brenin feels deliberately designed for maximum grin.",
      author: "Tom A.",
      platform: "tripadvisor",
      rating: 5,
    },
  ],
  
  // Introduction - compelling editorial (3-4 paragraphs)
  introduction: `Wales isn't just a mountain biking destination — it's *the* mountain biking destination. This small country has more trail centres per square mile than anywhere else in the UK, and the quality is frankly obscene. From the UK's first purpose-built trail centre at Coed y Brenin to BikePark Wales's gravity paradise, Welsh riding has set the global standard for what properly designed singletrack should feel like.

What makes Wales special isn't just the trails — it's the geology. Millions of years of glacial action carved valleys perfect for contouring singletrack. Ancient slate quarries at Antur Stiniog provide natural features that would cost millions to replicate. And the Welsh weather (yes, the rain) creates tacky, grippy conditions that let you rail berms faster than you thought possible.

Here's the honest truth: Wales gets wet. But Welsh trail builders have mastered the art of drainage. These trails don't turn to bog after a shower — they get *better*. That tacky hero dirt is what proper mountain biking feels like. And when you're sessioning a perfectly bermed corner or nailing a rock garden you walked yesterday, you won't care about the drizzle.

This isn't a beginner-friendly guide pretending everything is easy. Welsh mountain biking can be brutal. The climbs are proper lung-burners. The technical sections demand commitment. But that's what makes it addictive. Whether you're a first-timer tackling BikePark Wales's greens or a seasoned rider hunting for Penmachno's hidden lines, Wales will test you, teach you, and leave you planning your return before you've even left.`,
  
  // Trail Centre League Table data
  trailCentres: [
    {
      name: "BikePark Wales",
      slug: "bikepark-wales",
      region: "Brecon Beacons",
      regionSlug: "brecon-beacons",
      location: "Merthyr Tydfil",
      grades: ["green", "blue", "red", "black", "pro"],
      trailCount: 40,
      hasUplift: true,
      hasCafe: true,
      hasBikeHire: true,
      hasShowers: true,
      hasBikeWash: true,
      hasShop: true,
      bestFor: "Downhill & gravity riding",
      description: "The UK's biggest uplift bike park with 40+ trails ranging from green to pro lines. Purpose-built downhill trails on the edge of the Brecon Beacons.",
      website: "https://www.bikeparkwales.com",
      rating: 4.8,
      priceFrom: "£52",
      insiderTip: "Book uplift passes online in advance — weekends sell out. The cafe does excellent post-ride food.",
      lat: 51.7615,
      lng: -3.3752,
    },
    {
      name: "Coed y Brenin",
      slug: "coed-y-brenin",
      region: "Snowdonia",
      regionSlug: "snowdonia",
      location: "Dolgellau",
      grades: ["green", "blue", "red", "black"],
      trailCount: 8,
      hasUplift: false,
      hasCafe: true,
      hasBikeHire: true,
      hasShowers: true,
      hasBikeWash: true,
      hasShop: true,
      bestFor: "Trail centre riding, all levels",
      description: "The UK's first purpose-built trail centre, opened 2001. Home to the legendary MBR and Dragon's Back trails. Proper flowing singletrack through stunning Snowdonia forest.",
      website: "https://naturalresources.wales/days-out/places-to-visit/north-west-wales/coed-y-brenin-forest-park/",
      rating: 4.7,
      priceFrom: "Free",
      insiderTip: "Arrive early on weekends — parking fills by 10am. The Dragon's Back is the signature ride, but MBR is the perfect warm-up.",
      lat: 52.7950,
      lng: -3.8730,
    },
    {
      name: "Antur Stiniog",
      slug: "antur-stiniog",
      region: "Snowdonia",
      regionSlug: "snowdonia",
      location: "Blaenau Ffestiniog",
      grades: ["blue", "red", "black"],
      trailCount: 6,
      hasUplift: true,
      hasCafe: true,
      hasBikeHire: true,
      hasShowers: true,
      hasBikeWash: true,
      hasShop: false,
      bestFor: "Downhill in a slate quarry",
      description: "Unique downhill venue built in a working slate quarry. Jaw-dropping scenery, natural rock features, and uplift access to six purpose-built trails.",
      website: "https://www.anturstiniog.com",
      rating: 4.8,
      priceFrom: "£42",
      insiderTip: "The blue trail is genuinely steep — don't underestimate the grades here. Book uplift online to avoid disappointment.",
      lat: 52.9710,
      lng: -3.8620,
    },
    {
      name: "Afan Forest Park",
      slug: "afan-forest-park",
      region: "South Wales",
      regionSlug: "south-wales",
      location: "Port Talbot",
      grades: ["blue", "red", "black"],
      trailCount: 7,
      hasUplift: false,
      hasCafe: true,
      hasBikeHire: true,
      hasShowers: true,
      hasBikeWash: true,
      hasShop: true,
      bestFor: "Technical XC and enduro",
      description: "100km+ of singletrack including The Wall and Penhydd. Afan is where serious riders go — proper climbing, technical descents, and trails that don't pull punches.",
      website: "https://naturalresources.wales/days-out/places-to-visit/south-east-wales/afan-forest-park/",
      rating: 4.6,
      priceFrom: "Free",
      insiderTip: "Check trail status before riding — forestry work causes temporary diversions. The Penhydd is the classic Afan experience.",
      lat: 51.6075,
      lng: -3.7083,
    },
    {
      name: "Coed Llandegla",
      slug: "coed-llandegla",
      region: "North Wales",
      regionSlug: "north-wales",
      location: "Llandegla",
      grades: ["green", "blue", "red", "black"],
      trailCount: 5,
      hasUplift: false,
      hasCafe: true,
      hasBikeHire: true,
      hasShowers: true,
      hasBikeWash: true,
      hasShop: true,
      bestFor: "Beginners and families",
      description: "Wales's most beginner-friendly trail centre. Well-graded trails, excellent facilities, and a welcoming vibe. The green loop is perfect for first-timers.",
      website: "https://oneplanetadventure.com",
      rating: 4.5,
      priceFrom: "Free",
      insiderTip: "The cafe can get rammed on weekends — pack snacks. Parking is £5-7 but trail access is free.",
      lat: 53.0821,
      lng: -3.2334,
    },
    {
      name: "Cwmcarn",
      slug: "cwmcarn",
      region: "South Wales",
      regionSlug: "south-wales",
      location: "Newport",
      grades: ["red", "black"],
      trailCount: 3,
      hasUplift: false,
      hasCafe: false,
      hasBikeHire: false,
      hasShowers: false,
      hasBikeWash: true,
      hasShop: false,
      bestFor: "Technical natural trails",
      description: "The legendary Twrch Trail — 13km of raw, technical singletrack. Recently reopened after years of closure. Proper valley riding with consequences.",
      website: "https://naturalresources.wales/days-out/places-to-visit/south-east-wales/cwmcarn-forest/",
      rating: 4.4,
      priceFrom: "Free",
      insiderTip: "The Twrch is tougher than its red grade suggests. Not a beginner trail. Expect storm debris after bad weather.",
      lat: 51.6797,
      lng: -3.1336,
    },
    {
      name: "Nant yr Arian",
      slug: "nant-yr-arian",
      region: "Mid Wales",
      regionSlug: "mid-wales",
      location: "Aberystwyth",
      grades: ["blue", "red", "black"],
      trailCount: 3,
      hasUplift: false,
      hasCafe: true,
      hasBikeHire: false,
      hasShowers: false,
      hasBikeWash: true,
      hasShop: false,
      bestFor: "Challenging climbs, epic views",
      description: "Home to the infamous Syfydrin Trail — 'The Wall' climb is brutal, the descent is glorious. Mid Wales at its finest.",
      website: "https://naturalresources.wales/days-out/places-to-visit/mid-wales/nant-yr-arian-visitor-centre/",
      rating: 4.5,
      priceFrom: "Free",
      insiderTip: "Don't attempt Syfydrin as your first ride of the day. Warm up on Summit Trail. Bring extra water.",
      lat: 52.4512,
      lng: -3.8831,
    },
    {
      name: "Brechfa",
      slug: "brechfa",
      region: "Mid Wales",
      regionSlug: "mid-wales",
      location: "Carmarthen",
      grades: ["red", "black"],
      trailCount: 2,
      hasUplift: false,
      hasCafe: false,
      hasBikeHire: false,
      hasShowers: false,
      hasBikeWash: true,
      hasShop: false,
      bestFor: "Fast, flowing singletrack",
      description: "The Raven and Derwen trails — fast, flowing, and technical. Brechfa rewards commitment. Less crowded than Afan or Coed y Brenin.",
      website: "https://naturalresources.wales/days-out/places-to-visit/south-west-wales/brechfa-forest/",
      rating: 4.4,
      priceFrom: "Free",
      insiderTip: "Can be very muddy after rain. Summer is prime time. The Raven trail has serious berms — lean into them.",
      lat: 51.9456,
      lng: -4.0234,
    },
    {
      name: "Dyfi Bike Park",
      slug: "dyfi-bike-park",
      region: "Mid Wales",
      regionSlug: "mid-wales",
      location: "Machynlleth",
      grades: ["blue", "red", "black", "pro"],
      trailCount: 10,
      hasUplift: true,
      hasCafe: true,
      hasBikeHire: true,
      hasShowers: true,
      hasBikeWash: true,
      hasShop: true,
      bestFor: "Natural terrain bike park",
      description: "Purpose-built downhill park in natural forest. Uplift access, pro lines, and Red Bull Hardline course. Serious gravity riding.",
      website: "https://dyfibikepark.co.uk",
      rating: 4.9,
      priceFrom: "£45",
      insiderTip: "Book early for summer weekends. The pro lines are genuinely gnarly — session the reds first.",
      lat: 52.6179,
      lng: -3.7865,
    },
    {
      name: "Revolution Bike Park",
      slug: "revolution-bike-park",
      region: "North Wales",
      regionSlug: "north-wales",
      location: "Llangynog",
      grades: ["blue", "red", "black"],
      trailCount: 6,
      hasUplift: true,
      hasCafe: true,
      hasBikeHire: true,
      hasShowers: true,
      hasBikeWash: true,
      hasShop: true,
      bestFor: "Downhill progression",
      description: "Uplift bike park with varied terrain. Great for riders moving from trail centres to dedicated DH. Good progression from blues to blacks.",
      website: "https://www.revolutionbikepark.co.uk",
      rating: 4.6,
      priceFrom: "£45",
      insiderTip: "Midweek is significantly quieter. The blue trails are excellent for building confidence before hitting reds.",
      lat: 52.8183,
      lng: -3.4208,
    },
  ],
  
  // Regional breakdown
  regions: [
    {
      name: "Snowdonia",
      slug: "snowdonia",
      tagline: "Epic mountain trails and the birthplace of Welsh MTB",
      bestFor: ["All-mountain", "Trail riding", "Downhill"],
      highlights: [
        "Coed y Brenin — UK's first trail centre",
        "Antur Stiniog — slate quarry DH",
        "Penmachno — technical singletrack"
      ],
      topTrail: "Dragon's Back, Coed y Brenin",
    },
    {
      name: "South Wales",
      slug: "south-wales",
      tagline: "The gravity capital — BikePark Wales and Afan's legendary trails",
      bestFor: ["Downhill", "Enduro", "Technical XC"],
      highlights: [
        "BikePark Wales — UK's biggest uplift park",
        "Afan Forest Park — 100km+ singletrack",
        "Cwmcarn — raw, challenging riding"
      ],
      topTrail: "The Wall, Afan Forest Park",
    },
    {
      name: "Brecon Beacons",
      slug: "brecon-beacons",
      tagline: "From bike park flow to exposed mountain epics",
      bestFor: ["Bike park", "Mountain riding", "Adventure"],
      highlights: [
        "BikePark Wales — 40+ trails",
        "The Gap — classic mountain route",
        "Talybont Reservoir — family-friendly"
      ],
      topTrail: "BikePark Wales pro lines",
    },
    {
      name: "North Wales",
      slug: "north-wales",
      tagline: "Beginner-friendly centres and hidden technical gems",
      bestFor: ["Beginners", "Families", "Progressive riding"],
      highlights: [
        "Coed Llandegla — best for beginners",
        "Marin Trail — classic technical ride",
        "Revolution Bike Park — uplift progression"
      ],
      topTrail: "Marin Trail, Betws-y-Coed",
    },
    {
      name: "Mid Wales",
      slug: "mid-wales",
      tagline: "Remote trails, brutal climbs, and endless views",
      bestFor: ["XC riding", "Remote trails", "Challenging terrain"],
      highlights: [
        "Nant yr Arian — the Syfydrin climb",
        "Dyfi Bike Park — natural DH heaven",
        "Elan Valley — scenic riding"
      ],
      topTrail: "Syfydrin Trail, Nant yr Arian",
    },
  ],
  
  // Grading guide
  gradingGuide: [
    {
      grade: "green",
      label: "Easy",
      color: "#22c55e",
      description: "Wide, smooth trails. No obstacles. Suitable for beginners and families.",
      icon: "circle"
    },
    {
      grade: "blue",
      label: "Moderate",
      color: "#3b82f6",
      description: "Narrower singletrack with gentle gradients. Some loose surfaces. Basic bike handling needed.",
      icon: "square"
    },
    {
      grade: "red",
      label: "Difficult",
      color: "#ef4444",
      description: "Technical singletrack with steep sections, rocks, roots, drops. Good fitness and bike skills required.",
      icon: "diamond"
    },
    {
      grade: "black",
      label: "Severe",
      color: "#111",
      description: "Very technical terrain. Large drops, gap jumps, exposed rock. Expert riders only.",
      icon: "double-diamond"
    },
    {
      grade: "pro",
      label: "Pro Line",
      color: "#7c3aed",
      description: "Competition-grade features. Massive jumps and drops. Professional skill level required.",
      icon: "skull"
    },
  ],
  
  // Season guide
  seasonGuide: {
    spring: {
      months: "March - May",
      conditions: "Trails drying out, some mud. Quieter trails. Longer days arriving.",
      rating: 4,
      tip: "April and May are sweet spots — trails are drier, centres less busy than summer."
    },
    summer: {
      months: "June - August",
      conditions: "Best trail conditions. Dry, fast trails. Longest days. Busiest period.",
      rating: 5,
      tip: "Book uplift passes and bike hire well in advance. Midweek riding is significantly quieter."
    },
    autumn: {
      months: "September - November",
      conditions: "Stunning colours. Trails start getting wetter. September is often the best month.",
      rating: 4,
      tip: "September is arguably THE best month — summer conditions, autumn colours, fewer crowds."
    },
    winter: {
      months: "December - February",
      conditions: "Wet, muddy, short days. Trail centres with hardpack surfaces still rideable. Some closures.",
      rating: 2,
      tip: "Stick to purpose-built trail centres with good drainage. Coed y Brenin and Llandegla drain well."
    },
  },
  
  // Gear essentials
  gearGuide: {
    bikeTypes: [
      {
        type: "Hardtail",
        description: "Front suspension only. Great for trail centres, XC, and beginners. Lighter and cheaper.",
        bestFor: "Green/blue trails, XC, beginners"
      },
      {
        type: "Full Suspension Trail",
        description: "120-150mm travel front and rear. The do-it-all bike for Welsh trails.",
        bestFor: "Blue/red trails, all-day rides"
      },
      {
        type: "Enduro",
        description: "150-170mm travel. Built for rough descents but still pedals uphill.",
        bestFor: "Red/black trails, bike parks"
      },
      {
        type: "Downhill",
        description: "200mm+ travel. Uplift-only. Built purely for descending.",
        bestFor: "Bike parks, uplift days"
      },
      {
        type: "E-MTB",
        description: "Motor-assisted. Extends your range and lets you ride longer.",
        bestFor: "Longer rides, older riders, fitness building"
      },
    ],
    essentialKit: [
      "Helmet (full-face for bike parks)",
      "Gloves",
      "Eye protection",
      "Waterproof jacket (it's Wales)",
      "Spare inner tube + pump",
      "Multi-tool",
      "Water + snacks",
      "Knee pads (recommended for red+ trails)",
    ],
  },
  
  // FAQs - aggregate from all 5 regional files + add Wales-wide ones
  faqs: [
    {
      question: "Do I need my own bike to mountain bike in Wales?",
      answer: "No — every major trail centre offers bike hire, from hardtails to full-suspension and e-bikes. Prices typically range from £35-90 per day."
    },
    {
      question: "What's the best trail centre for beginners?",
      answer: "Coed Llandegla in North Wales is widely regarded as the best beginner-friendly centre. It has well-graded green and blue trails, excellent facilities, and a welcoming atmosphere."
    },
    {
      question: "Is BikePark Wales worth the money?",
      answer: "Absolutely. £45-52 for a day's uplift pass gets you 10-15 runs down purpose-built trails. That's more descending in one day than most riders get in a month. The quality of the trails and facilities justifies the cost."
    },
    {
      question: "Can I ride in winter?",
      answer: "Yes! Welsh trail centres are built for wet weather and drain remarkably well. Winter riding is viable, though expect shorter days, colder temps, and muddier conditions. Stick to purpose-built centres like Coed y Brenin or Llandegla."
    },
    {
      question: "What's the difference between trail centres and bike parks?",
      answer: "Trail centres have waymarked loop trails — you pedal uphill to earn your descent. Bike parks offer uplift service (shuttle van takes you to the top) for pure downhill riding. BikePark Wales, Antur Stiniog, Dyfi and Revolution are bike parks. Afan, Coed y Brenin, Llandegla are trail centres."
    },
    {
      question: "Are e-bikes allowed on Welsh trails?",
      answer: "Generally yes, but rules vary by trail centre. Natural Resources Wales land (Afan, Coed y Brenin, Cwmcarn) permits e-MTBs. BikePark Wales allows them on most trails. Always check current policies before riding."
    },
    {
      question: "How hard is the Dragon's Back at Coed y Brenin?",
      answer: "It's a proper red trail — 31km with 750m of climbing. Expect rocky technical sections, sustained climbs, and fast descents. If you can comfortably ride blue trails, you're ready, but bring fitness and focus."
    },
    {
      question: "What should I do if I crash or break down on a remote trail?",
      answer: "Carry a basic repair kit (spare tube, pump, multi-tool). For serious injury, call 999 and ask for Mountain Rescue if you're on remote trails, or ambulance if near roads. Many trail centres have limited mobile signal — download maps before riding and tell someone your plans."
    },
    {
      question: "Where's the best post-ride food?",
      answer: "BikePark Wales cafe does legendary breakfast baps and hearty meals. Afan Forest Park cafe has enormous homemade cakes. For pub food, try The Red Cow near Afan or The Star Inn near Talybont Reservoir."
    },
    {
      question: "Can kids ride at Welsh bike parks?",
      answer: "Yes! BikePark Wales has dedicated green trails perfect for confident kids (10+). Coed Llandegla is excellent for families with younger children. Most bike parks have minimum age requirements for uplift (usually 8-10 years) and kids must be accompanied by adults."
    },
  ],
};
