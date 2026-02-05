/**
 * Snowdonia (Eryri) Region Data
 * Comprehensive content for Adventure Wales region pages
 * Last updated: February 2025
 * Sources: Perplexity research, Visit Wales, Eryri National Park, local knowledge
 */

export const snowdoniaData = {
  slug: 'snowdonia',
  name: 'Snowdonia',
  welshName: 'Eryri',

  // Rich introductory content
  heroContent: `Snowdonia. Eryri. The name alone conjures images of jagged peaks, deep valleys carved by glaciers, and a raw, untamed landscape that's irresistible to adventure seekers. This is a land forged by ice and fire, where Yr Wyddfa (Snowdon) at 1,085m stands sentinel as Wales' highest peak over a kingdom of outdoor pursuits. From the knife-edge scramble of Crib Goch to whizzing down Europe's fastest zip line at 100mph, Snowdonia offers a playground unlike anywhere else in Britain.

This 823 square-mile national park is Wales' undisputed adventure capital. Ancient slate quarries have been reborn as adrenaline hubs—underground trampolines in caverns, zip wires over flooded pits, and mountain biking through industrial archaeology. Rivers like the Afon Conwy, Glaslyn, and Llugwy fuel world-class kayaking and canyoning through U-shaped gorges carved by glaciers.

But Snowdonia isn't just about the big-ticket thrills. It's about warming up in a centuries-old pub after conquering a peak, hearing Welsh spoken in the village shop, and finding yourself utterly alone on a misty ridge with only the mountain sheep for company. The Welsh call this landscape 'Eryri'—land of eagles—and while the eagles are long gone, the wild spirit that inspired the name remains absolutely intact.`,

  // Specific, verifiable facts
  keyFacts: [
    { label: 'Area', value: '823 sq miles (2,131 km²)', detail: "Wales' largest national park" },
    { label: 'Highest Peak', value: '1,085m (3,560ft)', detail: 'Yr Wyddfa (Snowdon) - highest in England & Wales' },
    { label: 'Established', value: '1951', detail: 'Third UK national park after Peak District and Lake District' },
    { label: 'Peaks over 3,000ft', value: '15 mountains', detail: 'Including the famous Welsh 3000s challenge' },
    { label: 'Lakes', value: '100+ natural lakes', detail: 'Including Llyn Llydaw, Glaslyn, and Bala (largest in Wales)' },
    { label: 'Population', value: '~26,000', detail: 'Main hubs: Llanberis (~2,000), Blaenau Ffestiniog (~6,000)' },
    { label: 'Annual Visitors', value: '6+ million', detail: 'Snowdon summit alone sees 600,000+ hikers annually' },
    { label: 'Dark Sky Status', value: 'International Dark Sky Reserve', detail: 'One of only 18 worldwide' },
    { label: 'Welsh Name', value: 'Eryri', detail: "Means 'land of eagles' or 'highlands'" },
    { label: 'Heritage', value: 'UNESCO-related slate landscapes', detail: 'Gwynedd slate sites recognized for industrial heritage' },
  ],

  // Ranked activities by what the region is famous for
  bestFor: [
    { rank: 1, activity: 'Mountain Hiking & Scrambling', description: "Wales' highest peaks, from gentle paths to knife-edge ridges like Crib Goch" },
    { rank: 2, activity: 'Rock Climbing', description: 'Trad and sport routes on sea cliffs, crags, and mountain faces. Birthplace of British climbing' },
    { rank: 3, activity: 'Zip Lining', description: "Zip World's Velocity 2 (100mph), Titan 2, and Fforest - Europe's largest zip zone" },
    { rank: 4, activity: 'Mountain Biking', description: 'Coed y Brenin trails, Antur Stiniog, and epic cross-country routes' },
    { rank: 5, activity: 'White Water Kayaking', description: 'Afon Conwy, Glaslyn, and Llugwy offer grade 2-5 rapids' },
    { rank: 6, activity: 'Canyoning & Gorge Walking', description: 'Deep gorges carved by glacial rivers near Betws-y-Coed' },
    { rank: 7, activity: 'Underground Adventures', description: 'Bounce Below trampolines, cavern zip lines in old slate mines' },
    { rank: 8, activity: 'Trail Running', description: 'XTERRA Snowdonia, Snowdon Races, and endless mountain trails' },
    { rank: 9, activity: 'Sea Kayaking', description: 'Llŷn Peninsula and Anglesey coastlines within easy reach' },
    { rank: 10, activity: 'Wild Swimming', description: 'Glacial lakes, plunge pools, and mountain tarns' },
  ],

  // Seasonal activity guide
  seasonGuide: {
    spring: {
      months: 'March - May',
      weather: 'Changeable, 8-15°C at low levels, often below freezing on peaks. Snow patches persist until May',
      highlights: [
        'Ideal scrambling conditions on Crib Goch and Tryfan (less crowded, stable rock)',
        'Wildflowers carpeting the lower valleys',
        'Lambing season - some paths have restrictions',
        'Waterfalls at their most powerful after winter rains',
      ],
      bestActivities: ['Hiking', 'Scrambling', 'Rock climbing', 'Waterfall photography'],
      avoid: 'Lambing fields (March-April), very high routes still have snow',
    },
    summer: {
      months: 'June - August',
      weather: '15-22°C at low levels, 10-15°C on summits. Longest daylight (sunset 9:30pm). Rain still possible',
      highlights: [
        'All attractions and activities at full operation',
        'Warmest conditions for wild swimming',
        'Longest days for big mountain routes',
        'XTERRA Snowdonia Trail Marathon (July)',
      ],
      bestActivities: ['All water sports', 'Camping', 'Long mountain days', 'Zip World'],
      avoid: 'Weekends at popular spots - arrive before 8am for Pen-y-Pass parking',
    },
    autumn: {
      months: 'September - November',
      weather: '8-15°C falling to 5-10°C by November. Crisp clear days interspersed with Atlantic storms',
      highlights: [
        'Golden foliage in Gwydir Forest and valleys',
        "Fewer visitors but full facilities until late October",
        'Excellent mountain biking conditions',
        'Storm watching on the coast',
      ],
      bestActivities: ['Mountain biking', 'Photography', 'Hiking', 'Mushroom foraging'],
      avoid: 'High routes in November storms - check Met Office gales warnings',
    },
    winter: {
      months: 'December - February',
      weather: '0-7°C at low levels, regularly sub-zero on peaks. Snow above 600m common',
      highlights: [
        'Winter mountaineering and ice climbing on north faces',
        'Snowdon Railway runs near-summit (weather permitting)',
        'Atmospheric misty valleys and frozen waterfalls',
        'Ffestiniog Railway Santa trains (December)',
      ],
      bestActivities: ['Winter mountaineering', 'Photography', 'Cosy pub walks', 'Heritage railways'],
      avoid: 'High routes without crampons/ice axe experience - avalanche risk above 800m',
    },
  },

  // Real insider tips from locals
  insiderTips: [
    {
      tip: 'Skip the Llanberis Path crowds',
      detail: "Take the Rhyd Ddu path instead—same summit, half the people. It's 7 miles round trip with wilder scenery and a proper mountain feel.",
    },
    {
      tip: 'Pen-y-Pass parking hack',
      detail: "The £10 car park fills by 7am on weekends. Park free at Nant Gwynant (5 miles away) and take the Watkin Path instead, or use the Sherpa bus from Llanberis.",
    },
    {
      tip: 'Best post-hike pub',
      detail: 'The Heights in Llanberis has real ales and mountain views from the terrace. Avoid the obvious tourist cafes on the high street.',
    },
    {
      tip: 'Cwm Idwal for beginners',
      detail: "If Snowdon feels too much, the Cwm Idwal circular (3 miles) gives you dramatic scenery, a glacial lake, and the iconic Devil's Kitchen—without the crowds or commitment.",
    },
    {
      tip: 'Crib Goch reality check',
      detail: "That Instagram knife-edge ridge? It kills people. Don't attempt it without scrambling experience, a head for heights, and good weather. Book a guide if in doubt.",
    },
    {
      tip: 'Zip World booking window',
      detail: "Book Velocity 2 at least 2 weeks ahead in summer, 1 week in shoulder season. Tuesday-Thursday slots are 40% less busy than weekends.",
    },
    {
      tip: 'Secret swimming spot',
      detail: "Llyn Dinas near Beddgelert has a hidden beach on the far shore—10 minute walk from the road. Warmer than the mountain tarns and usually empty.",
    },
    {
      tip: 'Best breakfast in the mountains',
      detail: 'Caffi Gwynant at Nant Gwynant does a legendary full Welsh breakfast. Opens at 8am—fuel up before the Watkin Path.',
    },
    {
      tip: 'Phone signal warning',
      detail: "Coverage is patchy to non-existent in valleys and on peaks. Download offline OS maps before you arrive—Outdoor Active or OS Maps apps work offline.",
    },
    {
      tip: 'Welsh language greeting',
      detail: "Say 'Sut mae?' (sih-my) for 'How are you?' to locals. They'll appreciate the effort and often switch to English with a smile.",
    },
  ],

  // Top experiences with specific details
  topExperiences: [
    {
      name: 'Summit Yr Wyddfa via Pyg Track',
      type: 'hiking',
      duration: '5-7 hours',
      difficulty: 'Challenging',
      description: "The most popular route to Wales' highest peak. Rocky in places with stunning views across Glaslyn and Llyn Llydaw.",
      priceRange: 'Free (parking £10)',
    },
    {
      name: 'Crib Goch Scramble',
      type: 'scrambling',
      duration: '6-8 hours',
      difficulty: 'Expert',
      description: "Britain's most famous knife-edge ridge. Exposure on both sides, Grade 1 scramble. Not for the faint-hearted.",
      priceRange: 'Free (guided £150-250)',
    },
    {
      name: 'Velocity 2 Zip Line',
      type: 'zip-lining',
      duration: '3 hours',
      difficulty: 'Any',
      description: "Europe's fastest zip line at Penrhyn Quarry—reach 100mph over a flooded slate quarry.",
      priceRange: '£60-80',
    },
    {
      name: 'Bounce Below',
      type: 'underground',
      duration: '1 hour',
      difficulty: 'Any',
      description: 'Giant trampolines suspended in a 176-year-old slate cavern. Surreal and unforgettable.',
      priceRange: '£30-40',
    },
    {
      name: 'Coed y Brenin Mountain Biking',
      type: 'mountain-biking',
      duration: '2-5 hours',
      difficulty: 'All levels',
      description: "The UK's first purpose-built mountain bike center. Red and black trails through ancient forest.",
      priceRange: 'Free (bike hire £40-60)',
    },
    {
      name: 'Tryfan North Ridge',
      type: 'scrambling',
      duration: '4-6 hours',
      difficulty: 'Challenging',
      description: "Classic Grade 1 scramble up a pointy peak. Touch Adam and Eve (summit stones) if you dare.",
      priceRange: 'Free',
    },
    {
      name: 'Afon Llugwy White Water',
      type: 'kayaking',
      duration: '3-4 hours',
      difficulty: 'Intermediate',
      description: 'Grade 3-4 rapids through forested gorges. Best after rain—too low in dry spells.',
      priceRange: '£60-90 guided',
    },
    {
      name: 'Aber Falls Walk',
      type: 'hiking',
      duration: '2 hours',
      difficulty: 'Easy',
      description: "Gentle 2-mile walk to a spectacular 120ft waterfall. Family-friendly and accessible.",
      priceRange: 'Free (parking £3)',
    },
    {
      name: 'Snowdon Mountain Railway',
      type: 'heritage',
      duration: '2.5 hours',
      difficulty: 'Any',
      description: "Victorian rack railway to near the summit. Book ahead—it's iconic for a reason.",
      priceRange: '£40-50 return',
    },
    {
      name: 'Welsh 3000s Challenge',
      type: 'hiking',
      duration: '12-24 hours',
      difficulty: 'Expert',
      description: 'All 15 Welsh peaks over 3,000ft in one push. 30 miles, 13,000ft ascent. The ultimate test.',
      priceRange: 'Free',
    },
    {
      name: 'Gorge Walking Dolgellau',
      type: 'canyoning',
      duration: '3-4 hours',
      difficulty: 'Moderate',
      description: 'Scramble, swim, and jump through river gorges with qualified guides.',
      priceRange: '£50-70',
    },
    {
      name: 'Ffestiniog Railway',
      type: 'heritage',
      duration: '2-3 hours',
      difficulty: 'Any',
      description: "Historic narrow-gauge steam railway through stunning scenery from Porthmadog to Blaenau Ffestiniog.",
      priceRange: '£35-45 return',
    },
  ],

  // FAQs with real questions visitors ask
  faqs: [
    {
      question: 'Do I need to be fit to climb Snowdon?',
      answer: "Reasonably fit, yes. The Llanberis Path is the easiest route (9 miles return, 5-7 hours) but it's still a proper mountain. If you can walk 10 miles with 1,000m elevation gain, you'll be fine. Start training a few weeks before if you're unsure.",
    },
    {
      question: 'Is Crib Goch safe for beginners?',
      answer: "No. Crib Goch is a Grade 1 scramble with serious exposure—people die here every year. You need scrambling experience, a head for heights, and good weather. If in doubt, book a qualified mountain guide (around £150-250 for the day).",
    },
    {
      question: 'When is the best time to visit Snowdonia?',
      answer: 'May-June and September offer the best balance: decent weather, fewer crowds than summer, and all facilities open. July-August is warmest but busiest. Winter is spectacular but requires mountaineering skills for high routes.',
    },
    {
      question: 'How do I get to Snowdonia without a car?',
      answer: 'Train to Bangor (3.5 hours from London Euston), then Sherpa bus to Llanberis and Pen-y-Pass. The Snowdon Sherpa (S1/S2) runs regularly in summer, hourly on weekends. Transport for Wales trains also reach Betws-y-Coed directly.',
    },
    {
      question: 'Is wild camping allowed in Snowdonia?',
      answer: "Technically no—you need landowner permission. However, discreet wild camping above 500m is often tolerated if you leave no trace, arrive late, leave early, and avoid honeypot areas. Never light fires.",
    },
    {
      question: 'How far in advance should I book Zip World?',
      answer: "At least 2 weeks for summer weekends, 1 week for midweek slots. Velocity 2 sells out fastest. Book direct on their website—third-party sites often charge extra.",
    },
    {
      question: 'What should I pack for hiking in Snowdonia?',
      answer: 'Essentials: waterproof jacket and trousers, warm layers (fleece/down), sturdy boots, map and compass, head torch, first aid kit, plenty of food and water, phone with offline maps. Weather changes fast—always pack for worse conditions than forecast.',
    },
    {
      question: 'Is there phone signal on Snowdon?',
      answer: "Patchy at best. You'll get signal at the summit café and some ridgelines, but valleys are often dead zones. Download offline OS Maps before you go. In emergencies, text 999 (register for SMS emergency service first).",
    },
    {
      question: 'Can I take my dog up Snowdon?',
      answer: "Yes, but keep them on a lead near livestock (sheep everywhere). Some routes are rocky and challenging for dogs. The Llanberis Path is easiest for four-legged friends. Bring water for them too.",
    },
    {
      question: 'What if the weather turns bad on the mountain?',
      answer: "Don't continue to the summit—turn back. Use your map and compass (GPS can fail), stick to the path, and descend the way you came if visibility drops. The summit café can provide shelter if you're already near the top. Call 999 for mountain rescue if genuinely stuck.",
    },
  ],

  // Hidden gems and lesser-known spots
  hiddenGems: [
    {
      name: 'Cwm Bochlwyd',
      type: 'Wild lake',
      description: 'Dramatic corrie lake below Tryfan with far fewer visitors than Cwm Idwal next door. Perfect wild swimming spot.',
      location: 'Ogwen Valley',
    },
    {
      name: 'Plas Brondanw Gardens',
      type: 'Historic gardens',
      description: 'Italianate gardens designed by the creator of Portmeirion, deliberately framing views of Snowdon. Overlooked by most visitors.',
      location: 'Near Penrhyndeudraeth',
    },
    {
      name: 'Dinorwig Quarry',
      type: 'Industrial heritage',
      description: "World's second-largest slate quarry—now an atmospheric ghost town with free access. The scale is staggering.",
      location: 'Llanberis',
    },
    {
      name: 'Swallow Falls off-peak',
      type: 'Waterfall',
      description: 'Famous falls, but visit at 8am or 6pm to avoid the coach parties. The car park is free outside tourist hours.',
      location: 'Betws-y-Coed',
    },
    {
      name: 'Llyn Parc',
      type: 'Hidden lake',
      description: 'Secluded lake in Gwydir Forest with old mining ruins. The walk in is muddy but the solitude is worth it.',
      location: 'Near Betws-y-Coed',
    },
    {
      name: 'Nantlle Ridge',
      type: 'Mountain walk',
      description: "One of the finest ridge walks in Wales with a fraction of Snowdon's crowds. Seven summits, endless views.",
      location: 'West of Snowdon',
    },
  ],

  // Local food and drink recommendations
  localEatsAndDrinks: [
    {
      name: 'The Heights',
      type: 'Pub',
      location: 'Llanberis',
      specialty: 'Real ales and mountain views from the terrace',
      priceRange: '££',
    },
    {
      name: 'Caffi Gwynant',
      type: 'Café',
      location: 'Nant Gwynant',
      specialty: 'Full Welsh breakfast before the Watkin Path',
      priceRange: '£',
    },
    {
      name: 'Ty Glyn',
      type: 'Restaurant',
      location: 'Capel Curig',
      specialty: 'Hearty Welsh cawl and bara brith',
      priceRange: '££',
    },
    {
      name: 'Plas y Brenin',
      type: 'Café',
      location: 'Capel Curig',
      specialty: 'Climber-friendly café at the National Mountain Centre',
      priceRange: '£',
    },
    {
      name: 'Cobdens Hotel',
      type: 'Hotel bar',
      location: 'Capel Curig',
      specialty: 'Cosy pub with log fires and local beers',
      priceRange: '££',
    },
    {
      name: 'Glaslyn Ices',
      type: 'Ice cream',
      location: 'Beddgelert',
      specialty: 'Award-winning Welsh ice cream in a picture-perfect village',
      priceRange: '£',
    },
  ],

  // Meta information for SEO and display
  meta: {
    seoTitle: 'Snowdonia (Eryri) | Adventure Activities & Hiking Guide | Adventure Wales',
    seoDescription: "Discover Snowdonia's best adventures: summit Yr Wyddfa, scramble Crib Goch, ride Europe's fastest zip line, and explore ancient slate caverns. Complete visitor guide with insider tips.",
    heroImage: '/images/regions/snowdonia-hero.jpg',
    socialImage: '/images/regions/snowdonia-og.jpg',
    lastUpdated: '2025-02-06',
  },
};

export default snowdoniaData;
