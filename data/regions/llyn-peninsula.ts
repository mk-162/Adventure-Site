/**
 * Llŷn Peninsula Region Data
 * Last updated: February 2025
 */

export const llynPeninsulaData = {
  slug: 'llyn-peninsula',
  name: 'Llŷn Peninsula',
  welshName: "Pen Llŷn",

  heroContent: `The Llŷn Peninsula is where Wales keeps its secrets. This remote finger of land juts into the Irish Sea west of Snowdonia, ending at Bardsey Island—the 'Island of 20,000 Saints' that was once a major pilgrimage destination. The landscape is elemental: wild headlands, hidden beaches, and a fierce Welsh identity that pervades every village.

This is not mainstream tourist Wales. The Llŷn is where Welsh is spoken as a first language, where farms tumble down to the sea, and where you can surf uncrowded breaks at Hell's Mouth (Porth Neigwl) with only seals for company. The coast path circles 100 miles of dramatic scenery, past pilgrim churches, Iron Age forts, and coves accessible only at low tide.

Adventure here means solitude. The surfing at Porth Oer (Whistling Sands) and Porth Neigwl is among Wales' best. The hiking is wild and weather-dependent. The villages of Abersoch and Aberdaron offer shelter when the Atlantic storms roll in. This is adventure at the edge of Wales—literally and spiritually.`,

  keyFacts: [
    { label: 'AONB Status', value: 'Area of Outstanding Natural Beauty', detail: 'Designated 1956' },
    { label: 'Coast Path', value: '100 miles', detail: 'Llŷn Coastal Path, part of Wales Coast Path' },
    { label: 'Bardsey Island', value: 'Island of 20,000 Saints', detail: 'Medieval pilgrimage destination, boat trips' },
    { label: 'Main Surf Beach', value: 'Porth Neigwl (Hell's Mouth)', detail: '4 miles of sand, consistent Atlantic swell' },
    { label: 'Welsh Language', value: '70%+ first language', detail: 'One of the most Welsh-speaking areas' },
    { label: 'Main Villages', value: 'Abersoch, Aberdaron, Pwllheli', detail: 'Sailing town, pilgrimage end, market town' },
    { label: 'Whistling Sands', value: 'Porth Oer', detail: 'Beach that squeaks when you walk on it' },
    { label: 'Tre'r Ceiri', value: 'Iron Age hillfort', detail: '150 stone huts, 1800 years old' },
    { label: 'Distance from Snowdonia', value: '30-45 minutes', detail: 'Beyond the mountains, into the sea' },
    { label: 'Population', value: '~20,000', detail: 'Sparse, agricultural, traditional' },
  ],

  bestFor: [
    { rank: 1, activity: 'Surfing', description: "Hell's Mouth (Porth Neigwl)—4 miles of empty beach, powerful waves" },
    { rank: 2, activity: 'Coastal Walking', description: '100-mile Llŷn Coastal Path—wild, remote, dramatic' },
    { rank: 3, activity: 'Sea Kayaking', description: 'Island exploration, sea caves, wildlife encounters' },
    { rank: 4, activity: 'Wild Beaches', description: 'Porth Oer (Whistling Sands), Porth Ceiriad, Porth Ysgo' },
    { rank: 5, activity: 'Sailing', description: 'Abersoch sailing scene—racing, cruising, RYA courses' },
    { rank: 6, activity: 'Bardsey Island Trip', description: 'Boat crossing to the sacred island, day or overnight' },
    { rank: 7, activity: 'Heritage Exploration', description: "Tre'r Ceiri hillfort, pilgrim churches" },
    { rank: 8, activity: 'Wild Swimming', description: 'Secluded coves, clear Atlantic water' },
    { rank: 9, activity: 'Birdwatching', description: 'Seabirds on Bardsey, choughs on headlands' },
    { rank: 10, activity: 'Stargazing', description: 'Dark skies across the peninsula' },
  ],

  seasonGuide: {
    spring: { months: 'March - May', weather: '10-14°C', highlights: ['Wildflowers on coast path', 'Lambing', 'Early Bardsey trips'], bestActivities: ['Coastal walking', 'Birdwatching', 'Photography'], avoid: 'Boat trips cancelled in rough weather' },
    summer: { months: 'June - August', weather: '16-20°C', highlights: ['Best surfing conditions', 'Bardsey boats running', 'Long beach days'], bestActivities: ['Surfing', 'Sea kayaking', 'All water sports'], avoid: 'Abersoch crowds on sunny weekends' },
    autumn: { months: 'September - November', weather: '10-15°C', highlights: ['Best surf swells', 'Empty beaches', 'Autumn light'], bestActivities: ['Surfing', 'Walking', 'Photography'], avoid: 'Exposed sections in storms' },
    winter: { months: 'December - February', weather: '5-9°C', highlights: ['Dramatic storms', 'Complete solitude', 'Winter surf'], bestActivities: ['Storm watching', 'Winter walking', 'Pub days'], avoid: 'No Bardsey boats, some businesses close' },
  },

  insiderTips: [
    { tip: "Hell's Mouth without crowds", detail: "Park at the National Trust car park at Porth Neigwl. Walk south for emptier peaks. Arrive early—serious surfers are gone by lunch." },
    { tip: 'Bardsey Island overnight', detail: 'Stay overnight in the farmhouse for a completely different experience. Book months ahead. Bring food.' },
    { tip: 'Whistling Sands phenomenon', detail: "Porth Oer's sand squeaks when dry—the quartz grains rub together. Only works when the sand is dry and clean." },
    { tip: "Tre'r Ceiri timing", detail: 'The hillfort is atmospheric at any time, but sunset views are extraordinary. 45-minute walk up from Llanaelhaearn.' },
    { tip: 'Abersoch vs Aberdaron', detail: 'Abersoch has the sailing scene and more facilities. Aberdaron is the quieter pilgrimage village. Both have good pubs.' },
  ],

  topExperiences: [
    { name: 'Surfing at Hell's Mouth', type: 'surfing', duration: '3-4 hours', difficulty: 'Intermediate', description: '4 miles of empty beach with powerful Atlantic waves.', priceRange: 'Free (lesson £40-60)' },
    { name: 'Llŷn Coastal Path: Aberdaron Circuit', type: 'hiking', duration: '5-6 hours', difficulty: 'Moderate', description: 'Wild coastal walk with Bardsey views.', priceRange: 'Free' },
    { name: 'Bardsey Island Day Trip', type: 'heritage/wildlife', duration: 'Full day', difficulty: 'Easy', description: 'Boat crossing to the sacred island. Seabirds, seals, ruins.', priceRange: '£50-70' },
    { name: "Tre'r Ceiri Hillfort Walk", type: 'hiking', duration: '2-3 hours', difficulty: 'Moderate', description: 'Iron Age fort with 150 stone huts and stunning views.', priceRange: 'Free' },
    { name: 'Whistling Sands Beach Day', type: 'beach', duration: '3-4 hours', difficulty: 'Easy', description: "The famous squeaking sand of Porth Oer. Crystal water.", priceRange: '£3 parking' },
    { name: 'Sea Kayaking from Abersoch', type: 'kayaking', duration: '3-4 hours', difficulty: 'Beginner/Intermediate', description: 'Explore St Tudwal's Islands, sea caves, seals.', priceRange: '£50-70' },
  ],

  faqs: [
    { question: 'Is the Llŷn Peninsula remote?', answer: "Yes—that's the point. Limited buses, quiet roads, Welsh-speaking communities. You need a car or bike for flexibility. Embrace the pace." },
    { question: 'Can I visit Bardsey Island?', answer: 'Day trips run Easter-October, weather permitting. Booking essential. Overnight stays available at the island farmhouse. Boat from Aberdaron or Porth Meudwy.' },
    { question: 'Is Hell's Mouth good for beginners?', answer: "No—it's powerful and exposed. Beginners should try Porth Ceiriad or take a lesson with West Coast Surf. Hell's Mouth is for intermediate+ surfers." },
    { question: 'What makes Whistling Sands whistle?', answer: 'The sand is almost pure quartz. When dry, the rounded grains rub against each other to create a squeaking sound as you walk. Unique in Britain.' },
  ],

  hiddenGems: [
    { name: 'Porth Ysgo', type: 'Secret beach', description: 'Tiny cove down steep steps. Usually empty. Wild swimming.', location: 'Near Aberdaron' },
    { name: 'St Beuno's Church, Clynnog Fawr', type: 'Historic church', description: '16th-century pilgrim church with holy well.', location: 'North Llŷn' },
  ],

  localEatsAndDrinks: [
    { name: 'Ty Coch Inn', type: 'Pub', location: 'Porthdinllaen', specialty: 'Beach pub on the sand—walk or boat only', priceRange: '££' },
    { name: 'The Ship Hotel', type: 'Pub', location: 'Aberdaron', specialty: 'Pilgrim inn at the end of the road', priceRange: '££' },
  ],

  meta: {
    seoTitle: "Llŷn Peninsula | Surfing, Wild Beaches & Bardsey Island | Adventure Wales",
    seoDescription: "Discover the Llŷn Peninsula: Hell's Mouth surfing, 100-mile coast path, Bardsey Island pilgrimages, and Wales' most Welsh-speaking corner. Wild, remote, unforgettable.",
    heroImage: '/images/regions/llyn-peninsula-hero.jpg',
    lastUpdated: '2025-02-06',
  },
};

export default llynPeninsulaData;
