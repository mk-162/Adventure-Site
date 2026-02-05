/**
 * Pembrokeshire Region Data
 * Comprehensive content for Adventure Wales region pages
 * Last updated: February 2025
 * Sources: Perplexity research, Visit Pembrokeshire, Wales Coast Path
 */

export const pembrokeshireData = {
  slug: 'pembrokeshire',
  name: 'Pembrokeshire',
  welshName: 'Sir Benfro',

  heroContent: `Welcome to Britain's only coastal national park—and arguably Wales' most spectacular coastline. Pembrokeshire's 186-mile Coast Path unfurls along dramatic sea cliffs, hidden coves, and golden sand beaches that rival anything in the Mediterranean. This is where coasteering was born, where dolphins play in Cardigan Bay, and where the Atlantic swell rolls in to meet some of the UK's finest surf breaks.

But Pembrokeshire isn't just about the coast. The mystical Preseli Hills rise inland—the source of Stonehenge's bluestones—while tiny St Davids, Britain's smallest city, draws pilgrims to its magnificent 12th-century cathedral. Wildlife is everywhere: puffins nest on Skomer Island, Atlantic grey seals haul out on remote beaches, and choughs wheel above the clifftops.

This is adventure territory with soul. After a day of sea kayaking past sea caves or scrambling down to secret beaches, you'll find yourself in a whitewashed pub watching the sunset over the Celtic Sea, a pint of local ale in hand. Pembrokeshire has that rare quality: world-class adventure combined with the unhurried pace of a place that knows exactly what it is.`,

  keyFacts: [
    { label: 'National Park Status', value: "Britain's only coastal national park", detail: 'Established 1952' },
    { label: 'Coast Path', value: '186 miles', detail: '35,000ft cumulative elevation (more than Everest!)' },
    { label: 'Beaches', value: '50+', detail: 'From Blue Flag resorts to hidden coves' },
    { label: 'Blue Flag Beaches', value: '13', detail: 'More than any other Welsh county' },
    { label: 'Area', value: '240 sq miles (620 km²)', detail: 'Mostly coastal and marine' },
    { label: 'Highest Point', value: 'Foel Cwmcerwyn 536m', detail: 'In the Preseli Hills' },
    { label: 'Islands', value: '20+', detail: 'Including Skomer, Skokholm, Ramsey, Caldey' },
    { label: 'Wildlife', value: 'Dolphins, seals, puffins', detail: 'Cardigan Bay SAC - Special Area of Conservation' },
    { label: 'St Davids', value: "Britain's smallest city", detail: 'Population ~1,600, medieval cathedral' },
    { label: 'Heritage', value: 'Preseli Hills bluestones', detail: 'Source of Stonehenge inner stones' },
  ],

  bestFor: [
    { rank: 1, activity: 'Coasteering', description: "The birthplace of the sport—cliff jumping, wild swimming, and scrambling along sea-carved rocks" },
    { rank: 2, activity: 'Coastal Walking', description: 'The 186-mile Pembrokeshire Coast Path—world-class day hikes and multi-day adventures' },
    { rank: 3, activity: 'Surfing', description: 'Consistent Atlantic swell, 50+ beaches, from beginner-friendly to challenging reef breaks' },
    { rank: 4, activity: 'Sea Kayaking', description: 'Explore sea caves, arches, and island coastlines with expert guides' },
    { rank: 5, activity: 'Wildlife Watching', description: 'Dolphins, grey seals, puffins on Skomer, and the largest seabird colonies in southern Britain' },
    { rank: 6, activity: 'Stand-Up Paddleboarding', description: 'Calm estuaries and sheltered bays perfect for SUP touring' },
    { rank: 7, activity: 'Rock Climbing', description: 'Sea cliffs of limestone and sandstone with trad and sport routes' },
    { rank: 8, activity: 'Cycling', description: 'The Celtic Trail coast-to-coast route passes through stunning scenery' },
    { rank: 9, activity: 'Gorge Walking', description: 'Scramble through waterfalls and canyons in the wooded valleys' },
    { rank: 10, activity: 'Wild Swimming', description: 'Blue Lagoon at Abereiddy, secret coves, and crystal-clear bays' },
  ],

  seasonGuide: {
    spring: {
      months: 'March - May',
      weather: '10-15°C, increasingly sunny. Sea temps 8-12°C',
      highlights: [
        'Puffins return to Skomer Island (April-July)',
        'Wildflowers carpet the clifftops',
        'Seal pups can still be spotted on beaches',
        'Quieter coast path before summer crowds',
      ],
      bestActivities: ['Coastal walking', 'Wildlife boat trips', 'Photography', 'Birdwatching'],
      avoid: 'Easter weekend crowds at popular beaches',
    },
    summer: {
      months: 'June - August',
      weather: '18-22°C, warmest sea temps 14-17°C. Long days',
      highlights: [
        'All water sports at their best',
        'Puffins and seabirds nesting',
        'Longest days for epic coast path sections',
        'Beach festivals and events',
      ],
      bestActivities: ['Coasteering', 'Surfing', 'Sea kayaking', 'Island trips'],
      avoid: 'Tenby and Saundersfoot on bank holiday weekends—arrive early or explore quieter north coast',
    },
    autumn: {
      months: 'September - November',
      weather: '12-17°C falling to 8-12°C. Atlantic storms increase',
      highlights: [
        'Grey seal pupping season (September-November)',
        'Best surf swells of the year',
        'Dramatic storm watching',
        'Fewer crowds, golden light',
      ],
      bestActivities: ['Surfing', 'Seal watching', 'Coastal hiking', 'Storm photography'],
      avoid: 'Exposed cliff paths during gales—check weather warnings',
    },
    winter: {
      months: 'December - February',
      weather: '6-10°C, sea temps 8-10°C. Storms and clear spells',
      highlights: [
        'Dramatic winter seascapes',
        'Empty coast path sections',
        'Cosy pubs and local character',
        'Best storm watching at coastal headlands',
      ],
      bestActivities: ['Coastal walking', 'Storm watching', 'Pub walks', 'Photography'],
      avoid: 'Most water sports operators closed. Some coastal paths slippery after rain',
    },
  },

  insiderTips: [
    {
      tip: 'Abereiddy Blue Lagoon',
      detail: "This flooded slate quarry hosts the Red Bull Cliff Diving World Series. Visit for dramatic cliff jumping or just to swim in the eerie blue water. Free parking, easy access.",
    },
    {
      tip: 'Skip Whitesands, find Porthmelgan',
      detail: "Whitesands is gorgeous but packed in summer. Walk 15 minutes north to Porthmelgan—a sheltered cove between cliffs, usually empty, with great rock pools.",
    },
    {
      tip: 'Tenby parking reality',
      detail: "South Beach car park fills by 10am in summer. Use the Park & Ride from the A478 or stay north of the town and walk the coast path in.",
    },
    {
      tip: 'Skomer Island booking',
      detail: "Day trips sell out months ahead in puffin season (April-July). Book 6-8 weeks in advance on the Wildlife Trust website. The first boat (10am) gives you longest on the island.",
    },
    {
      tip: 'Best fish and chips',
      detail: "Morgans Fish & Chips in Saundersfoot—queue out the door for a reason. Eat on the harbour wall. Avoid the tourist traps on Tenby's main drag.",
    },
    {
      tip: 'Coasteering without crowds',
      detail: "Preseli Venture and TYF run coasteering from St Davids—quieter northern headlands vs. the busier Pembroke sections. Book direct for best prices.",
    },
    {
      tip: 'Marloes Sands at sunset',
      detail: "The 15-minute walk down keeps crowds away. At low tide, the beach stretches forever. Time it for sunset and you'll have it almost to yourself.",
    },
    {
      tip: 'The Sloop Inn, Porthgain',
      detail: "Proper harbourside pub in a former slate port. Local seafood, real ales, maritime character. Book for dinner in summer or just drop in for a pint.",
    },
    {
      tip: 'Strumble Head for dolphins',
      detail: "Best shore-based dolphin watching in Wales. Park at the lighthouse, bring binoculars. Early morning or evening are peak times—locals call it 'dolphin o'clock'.",
    },
    {
      tip: 'Cwm yr Eglwys for wild swimming',
      detail: "Tiny beach by a ruined church at Dinas Head. Sheltered, clear water, usually quiet. Combine with the circular headland walk (4 miles).",
    },
  ],

  topExperiences: [
    {
      name: 'Coasteering at St Davids',
      type: 'coasteering',
      duration: '3-4 hours',
      difficulty: 'Moderate',
      description: 'Cliff jumping, cave swimming, and sea-level scrambling where the sport was invented.',
      priceRange: '£50-70',
    },
    {
      name: 'Skomer Island Puffin Trip',
      type: 'wildlife',
      duration: 'Full day',
      difficulty: 'Easy',
      description: "Day trip to see the UK's most accessible puffin colony. April-July only. Book months ahead.",
      priceRange: '£25-35 + boat',
    },
    {
      name: 'Pembrokeshire Coast Path: Tenby to Manorbier',
      type: 'hiking',
      duration: '5-6 hours',
      difficulty: 'Moderate',
      description: 'Classic section past sandy beaches, limestone cliffs, and medieval Manorbier Castle.',
      priceRange: 'Free',
    },
    {
      name: 'Surfing at Freshwater West',
      type: 'surfing',
      duration: '2-3 hours',
      difficulty: 'Intermediate',
      description: "Pembrokeshire's premier surf beach—consistent waves, dramatic dunes. Lessons available.",
      priceRange: '£40-60 lesson, free if you bring kit',
    },
    {
      name: 'Sea Kayaking to Ramsey Island',
      type: 'kayaking',
      duration: '4-5 hours',
      difficulty: 'Intermediate',
      description: 'Paddle through Ramsey Sound (tidal race!), explore sea caves, spot seals and seabirds.',
      priceRange: '£60-90',
    },
    {
      name: 'Dolphin Watching from New Quay',
      type: 'wildlife',
      duration: '2 hours',
      difficulty: 'Any',
      description: 'Boat trip into Cardigan Bay to see resident bottlenose dolphins—95%+ success rate in summer.',
      priceRange: '£25-40',
    },
    {
      name: 'St Davids Head Circular Walk',
      type: 'hiking',
      duration: '3-4 hours',
      difficulty: 'Moderate',
      description: "Dramatic headland walk past Iron Age fort, wild coastline, and Britain's smallest city.",
      priceRange: 'Free',
    },
    {
      name: 'Blue Lagoon Wild Swimming',
      type: 'swimming',
      duration: '1-2 hours',
      difficulty: 'Easy',
      description: 'Swim in the famous flooded quarry at Abereiddy. Dramatic cliffs, deep blue water.',
      priceRange: 'Free (parking £3)',
    },
    {
      name: 'Preseli Hills Bluestones Walk',
      type: 'hiking',
      duration: '4-5 hours',
      difficulty: 'Moderate',
      description: "Walk among the outcrops where Stonehenge's bluestones were quarried 5,000 years ago.",
      priceRange: 'Free',
    },
    {
      name: 'Stack Rocks and Elegug Stacks',
      type: 'hiking',
      duration: '2 hours',
      difficulty: 'Easy',
      description: 'Short walk to dramatic sea stacks and the natural arch at Green Bridge of Wales.',
      priceRange: 'Free',
    },
    {
      name: 'Caldey Island Monastery Visit',
      type: 'heritage',
      duration: 'Half day',
      difficulty: 'Easy',
      description: 'Boat trip to island monastery, sample monk-made chocolate and perfume, peaceful beaches.',
      priceRange: '£15-20 return boat',
    },
    {
      name: 'Gorge Walking in Gwaun Valley',
      type: 'gorge-walking',
      duration: '3-4 hours',
      difficulty: 'Moderate',
      description: 'Scramble through a hidden valley with waterfalls, pools, and ancient woodland.',
      priceRange: '£45-65',
    },
  ],

  faqs: [
    {
      question: 'Is the Pembrokeshire Coast Path too hard for beginners?',
      answer: 'Not at all. The path has sections for all abilities. Try Tenby to Manorbier (5 miles, moderate) or the Stackpole Estate circular (4 miles, easy) for accessible tasters. The whole 186 miles takes 10-15 days and is properly challenging.',
    },
    {
      question: 'When can I see puffins on Skomer Island?',
      answer: 'Puffins arrive mid-April and leave by late July. Peak viewing is late May to early July. Day trips run from Martin\'s Haven (book months ahead). You can also see them from boat trips that circle the island without landing.',
    },
    {
      question: 'Is coasteering safe for beginners?',
      answer: "Yes—that's how most people try it. Operators like TYF, Preseli Venture, and Celtic Quest provide all equipment and qualified guides. You don't need to be a strong swimmer but should be comfortable in water. Most sessions cater to mixed groups.",
    },
    {
      question: 'Which beaches are best for surfing?',
      answer: "Freshwater West has the most consistent waves (intermediate+). Newgale is beginner-friendly with surf schools. Whitesands works on bigger swells. The south coast beaches (Broad Haven South) are sheltered for learning. Check Magic Seaweed for forecasts.",
    },
    {
      question: 'Can I wild camp on the coast path?',
      answer: 'Wild camping isn\'t technically allowed without landowner permission, but discreet, single-night camps are usually tolerated if you\'re off the path, leave no trace, and avoid farms and nature reserves. The coast path has plenty of campsites if you prefer facilities.',
    },
    {
      question: 'How do I get to Pembrokeshire without a car?',
      answer: 'Train to Haverfordwest, Tenby, or Pembroke from Swansea/Cardiff (change from London). Summer coastal buses (Puffin Shuttle, Celtic Coaster) link beaches and villages. Year-round service is limited—check Pembrokeshire Greenways for current routes.',
    },
    {
      question: 'What should I bring for coastal walks?',
      answer: 'Sturdy shoes (paths are often uneven), waterproof jacket, layers (wind off the sea), sun protection, water, and snacks. Binoculars for wildlife. OS Explorer OL35 and OL36 cover the coast path.',
    },
    {
      question: 'Are dogs allowed on beaches?',
      answer: 'Many beaches have dog restrictions May-September (typically before 10am or after 6pm only). Year-round dog-friendly beaches include Abereiddy, Cwm yr Eglwys, and much of the coast path. Check local signs.',
    },
    {
      question: 'Where can I see dolphins?',
      answer: 'Cardigan Bay has resident bottlenose dolphins—boat trips from New Quay have 95%+ success rates. You can also spot them from shore at Strumble Head, Mwnt, and New Quay headland. Best times are early morning or evening, calm days.',
    },
    {
      question: 'Is St Davids worth visiting?',
      answer: "Absolutely. Britain's smallest city has a stunning medieval cathedral hidden in a valley, plus great cafes, galleries, and local food shops. It's the launching point for coasteering, Ramsey Island trips, and some of the best coast path sections.",
    },
  ],

  hiddenGems: [
    {
      name: 'Swanlake Bay',
      type: 'Beach',
      description: 'Only accessible via coast path near Manorbier. Shingle at high tide reveals golden sand. Genuinely empty.',
      location: 'Near Manorbier',
    },
    {
      name: 'Traeth Llyfn',
      type: 'Beach',
      description: 'Dramatic metal steps down the cliff near Porthgain. Only accessible at low tide. Sweeping golden sands.',
      location: 'Near Porthgain',
    },
    {
      name: 'Ceibwr Bay',
      type: 'Beach',
      description: "Wild pebble beach with Wales' tallest sea cliffs. Visit the nearby Witches' Cauldron (collapsed cave).",
      location: 'Moylgrove',
    },
    {
      name: "The Druidstone",
      type: 'Pub/Restaurant',
      description: 'Legendary clifftop pub-hotel with eccentric character, stunning views, and live music. Worth the detour.',
      location: 'Broad Haven',
    },
    {
      name: 'Gwaun Valley',
      type: 'Hidden valley',
      description: 'Timeless wooded valley that still uses the pre-1752 calendar. Ancient woodland, waterfalls, tiny pubs.',
      location: 'Inland from Fishguard',
    },
    {
      name: 'Porthmelgan',
      type: 'Beach',
      description: 'Sheltered cove between St Davids Head and Whitesands. Protected by cliffs on three sides—natural sun trap.',
      location: 'Near St Davids',
    },
  ],

  localEatsAndDrinks: [
    {
      name: 'The Sloop Inn',
      type: 'Pub',
      location: 'Porthgain',
      specialty: 'Harbourside pub with local seafood and real ales',
      priceRange: '££',
    },
    {
      name: 'Morgans Fish & Chips',
      type: 'Takeaway',
      location: 'Saundersfoot',
      specialty: 'Best fish and chips in Pembrokeshire—queue expected',
      priceRange: '£',
    },
    {
      name: 'The Shed',
      type: 'Café/Bistro',
      location: 'Porthgain',
      specialty: 'Fish landed by local boats, lobster in season',
      priceRange: '£££',
    },
    {
      name: "Cwtch",
      type: 'Restaurant',
      location: 'St Davids',
      specialty: 'Modern Welsh cuisine, locally sourced ingredients',
      priceRange: '£££',
    },
    {
      name: 'The Druidstone',
      type: 'Pub/Restaurant',
      location: 'Broad Haven',
      specialty: 'Eccentric clifftop institution with amazing views',
      priceRange: '££',
    },
    {
      name: 'Ultracomida',
      type: 'Deli/Café',
      location: 'Narberth',
      specialty: 'Spanish-Welsh deli with excellent coffee and tapas',
      priceRange: '££',
    },
  ],

  meta: {
    seoTitle: 'Pembrokeshire | Coastal Adventures, Coasteering & Wildlife | Adventure Wales',
    seoDescription: "Discover Pembrokeshire: Britain's only coastal national park. Coasteering, surfing, sea kayaking, the 186-mile Coast Path, and world-class wildlife including puffins and dolphins.",
    heroImage: '/images/regions/pembrokeshire-hero.jpg',
    socialImage: '/images/regions/pembrokeshire-og.jpg',
    lastUpdated: '2025-02-06',
  },
};

export default pembrokeshireData;
