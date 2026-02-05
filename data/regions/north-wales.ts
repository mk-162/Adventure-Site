/**
 * North Wales Coast Region Data
 * Comprehensive content for Adventure Wales region pages
 * Last updated: February 2025
 */

export const northWalesData = {
  slug: 'north-wales',
  name: 'North Wales',
  welshName: 'Gogledd Cymru',

  heroContent: `North Wales is where adventure tourism was reinvented. This is the land of Zip World's 100mph lines, underground trampolines in slate caverns, and inland surf lagoons—all against a backdrop of Victorian seaside charm and Snowdonia's dramatic peaks. The north coast stretches from Prestatyn to Caernarfon, a ribbon of sandy beaches, headlands, and resort towns that serves as the gateway to Wales' adventure heartland.

Llandudno's Victorian grandeur and the Great Orme's wildlife rub shoulders with Conwy's medieval walls and castle. The River Dee at Llangollen offers white water rafting, while the Menai Strait provides kayaking with views of both coastline and mountains. This is accessible adventure—the A55 expressway runs the length of the coast, trains arrive from London in under four hours, and you can go from beach to mountain summit in 30 minutes.

What makes North Wales special is the variety. One day you're coasteering on sea cliffs, the next you're bouncing on underground trampolines or hurtling down a mountain coaster. The infrastructure is there, the operators are world-class, and the landscapes deliver. It's adventure made easy—but no less thrilling for that.`,

  keyFacts: [
    { label: 'Coast Path', value: 'Part of 870-mile Wales Coast Path', detail: 'Prestatyn to Anglesey section' },
    { label: 'Main Resort', value: 'Llandudno', detail: 'Victorian seaside town, Great Orme headland' },
    { label: 'Medieval Town', value: 'Conwy', detail: 'UNESCO-listed castle and town walls' },
    { label: 'Adventure Hub', value: 'Zip World', detail: "World's fastest zip line at 100mph" },
    { label: 'White Water', value: 'River Dee, Llangollen', detail: 'Grade 3-4 rapids, rafting and kayaking' },
    { label: 'Inland Surf', value: 'Adventure Parc Snowdonia', detail: 'Year-round surf lagoon at Dolgarrog' },
    { label: 'Great Orme', value: 'Limestone headland', detail: 'Cable car, tramway, copper mines' },
    { label: 'Menai Strait', value: '14 miles', detail: 'Kayaking, eFoiling between Anglesey and mainland' },
    { label: 'Nearest Airports', value: 'Liverpool, Manchester', detail: '1-2 hours drive' },
    { label: 'Train Access', value: 'North Wales Main Line', detail: 'London-Holyhead via Chester and Bangor' },
  ],

  bestFor: [
    { rank: 1, activity: 'Zip Lining', description: "Zip World's Velocity (100mph), Titan, and forest adventures" },
    { rank: 2, activity: 'White Water Rafting', description: 'River Dee at Llangollen—grade 3-4 rapids' },
    { rank: 3, activity: 'Coasteering', description: 'Sea cliffs and caves along the north coast' },
    { rank: 4, activity: 'Underground Adventures', description: 'Bounce Below trampolines, cavern zip lines' },
    { rank: 5, activity: 'Surfing', description: 'Inland lagoon at Surf Snowdonia, year-round guaranteed waves' },
    { rank: 6, activity: 'Coastal Walking', description: 'Wales Coast Path from Prestatyn to Caernarfon' },
    { rank: 7, activity: 'Mountain Biking', description: 'Coed y Brenin, Penmachno, and forest trails' },
    { rank: 8, activity: 'Sea Kayaking', description: 'Menai Strait, coastal exploration, wildlife trips' },
    { rank: 9, activity: 'Gorge Walking', description: 'Waterfall canyons near Betws-y-Coed' },
    { rank: 10, activity: 'Heritage Railway', description: 'Great Orme Tramway, Snowdon Mountain Railway' },
  ],

  seasonGuide: {
    spring: { months: 'March - May', weather: '10-15°C, showers', highlights: ['Wildflowers on coast path', 'River levels good for rafting', 'Fewer crowds'], bestActivities: ['Coastal walking', 'White water rafting', 'Mountain biking'], avoid: 'High zip lines in strong winds' },
    summer: { months: 'June - August', weather: '15-22°C, warmest', highlights: ['All attractions open', 'Llandudno Victorian Festival', 'Surf lagoon at its best'], bestActivities: ['All water sports', 'Zip World', 'Beach days'], avoid: 'Book Zip World 2+ weeks ahead' },
    autumn: { months: 'September - November', weather: '10-15°C, storms', highlights: ['Golden forests', 'Dramatic coasteering conditions', 'Quieter paths'], bestActivities: ['Gorge walking', 'Photography', 'Hiking'], avoid: 'Check weather for exposed activities' },
    winter: { months: 'December - February', weather: '5-10°C, windy', highlights: ['Empty beaches', 'Cosy pubs', 'Snow on Snowdonia peaks'], bestActivities: ['Winter walking', 'Indoor attractions', 'Pub days'], avoid: 'Some outdoor activities close or reduce' },
  },

  insiderTips: [
    { tip: 'Zip World booking', detail: 'Book Velocity 2-3 weeks ahead in summer. Tuesday-Thursday slots are 40% less busy.' },
    { tip: 'Llandudno parking', detail: 'Avoid pier car parks (£10+/day). Free residential streets uphill, 10-minute walk to town.' },
    { tip: 'Best fish and chips', detail: 'The Cottage Loaf in Llandudno or Rhyl Harbour for day-boat fresh seafood.' },
    { tip: 'Great Orme for free', detail: 'Walk up the Haulfre Gardens path instead of paying for tramway or cable car. Views just as good.' },
    { tip: 'Quiet coast path', detail: 'The section from Deganwy to Penmaenmawr is dramatic and less walked than popular stretches.' },
    { tip: 'River Dee reality', detail: "Rafting is best after rain—water levels can be too low in dry spells. Operators will advise." },
    { tip: 'Surf Snowdonia timing', detail: 'Book early morning sessions for best water conditions. Afternoon can get choppy.' },
    { tip: 'Conwy without crowds', detail: 'Visit the castle first thing or late afternoon. The town walls walk is free and atmospheric.' },
  ],

  topExperiences: [
    { name: 'Velocity 2 Zip Line', type: 'zip-lining', duration: '3 hours', difficulty: 'Any', description: "Europe's fastest zip—100mph over a flooded quarry.", priceRange: '£60-80' },
    { name: 'White Water Rafting on River Dee', type: 'rafting', duration: '3-4 hours', difficulty: 'Moderate', description: 'Grade 3-4 rapids through spectacular gorges at Llangollen.', priceRange: '£50-70' },
    { name: 'Great Orme Exploration', type: 'hiking', duration: '3-4 hours', difficulty: 'Moderate', description: 'Walk the limestone headland, visit Bronze Age copper mines.', priceRange: 'Free (mines £8)' },
    { name: 'Bounce Below', type: 'underground', duration: '1 hour', difficulty: 'Any', description: 'Trampoline through a 176-year-old slate cavern.', priceRange: '£30-40' },
    { name: 'Surf Snowdonia', type: 'surfing', duration: '2 hours', difficulty: 'All levels', description: 'Guaranteed waves in an inland lagoon. Lessons available.', priceRange: '£50-70 session' },
    { name: 'Conwy Castle and Walls', type: 'heritage', duration: '2-3 hours', difficulty: 'Easy', description: 'UNESCO-listed medieval fortress with complete town walls.', priceRange: '£12' },
    { name: 'Wales Coast Path: Llandudno to Conwy', type: 'hiking', duration: '3-4 hours', difficulty: 'Moderate', description: 'Classic section past the Great Orme and along the estuary.', priceRange: 'Free' },
    { name: 'Menai Strait Kayaking', type: 'kayaking', duration: '3-4 hours', difficulty: 'Intermediate', description: 'Paddle the strait between mainland and Anglesey.', priceRange: '£50-70' },
  ],

  faqs: [
    { question: 'Is Zip World worth it?', answer: 'Yes if you like adrenaline. Velocity 2 is genuinely thrilling (100mph, 500ft drop). Book ahead—it sells out. Bounce Below is surreal and fun for all ages.' },
    { question: 'How do I get to North Wales?', answer: 'Train to Llandudno Junction or Bangor (3.5-4 hours from London). A55 expressway runs the coast by car. Liverpool and Manchester airports are 1-2 hours away.' },
    { question: 'Which is better—Llandudno or Conwy?', answer: 'Different vibes. Llandudno is Victorian seaside with pier and promenade. Conwy has medieval walls, castle, and quainter feel. Both are great—do both.' },
    { question: 'Can you surf in North Wales?', answer: 'Yes—Surf Snowdonia offers guaranteed waves year-round in an inland lagoon. For ocean surfing, head to Anglesey (Rhosneigr) or the Llŷn Peninsula.' },
  ],

  hiddenGems: [
    { name: 'Aber Falls', type: 'Waterfall', description: 'Stunning 120ft waterfall, easy 2-mile walk. Off the tourist radar.', location: 'Near Abergwyngregyn' },
    { name: 'Puffin Island', type: 'Wildlife', description: 'Boat trips from Beaumaris. Seabirds, seals, no crowds.', location: 'Off Anglesey' },
    { name: 'Bodnant Garden', type: 'Garden', description: '80 acres of world-class gardens. Laburnum arch in May.', location: 'Conwy Valley' },
  ],

  localEatsAndDrinks: [
    { name: 'The Cottage Loaf', type: 'Café', location: 'Llandudno', specialty: 'Award-winning fish and chips', priceRange: '£' },
    { name: 'Signatures Restaurant', type: 'Restaurant', location: 'Conwy', specialty: 'Fine dining in a historic building', priceRange: '£££' },
    { name: 'The Albion Ale House', type: 'Pub', location: 'Conwy', specialty: 'Tiny pub, excellent real ales', priceRange: '£' },
  ],

  meta: {
    seoTitle: 'North Wales | Zip World, Coasteering & Adventure Activities | Adventure Wales',
    seoDescription: "Discover North Wales: home to Zip World's 100mph lines, white water rafting on the Dee, Victorian Llandudno, and medieval Conwy. Your adventure gateway.",
    heroImage: '/images/regions/north-wales-hero.jpg',
    lastUpdated: '2025-02-06',
  },
};

export default northWalesData;
