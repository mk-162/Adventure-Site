/**
 * Carmarthenshire Region Data
 * Last updated: February 2025
 */

export const carmarthenshireData = {
  slug: 'carmarthenshire',
  name: 'Carmarthenshire',
  welshName: 'Sir Gaerfyrddin',

  heroContent: `Carmarthenshire is where the old Wales survives. This is the Garden of Wales—a fertile county of rolling farmland, wooded valleys, and castle-topped hills that feels untouched by tourism. The River Towy winds through the heart, past Dinefwr Castle and the market town of Llandeilo, while the Brecon Beacons' western edges rise to the north.

Adventure here is quieter but no less rewarding. Brechfa Forest offers mountain biking through ancient woodland. The Towy Valley provides kayaking and canoeing on one of Wales' most beautiful rivers. The Black Mountain (Mynydd Du)—the westernmost range of the Brecon Beacons—delivers remote hiking with none of Pen y Fan's crowds.

This is Dylan Thomas country. Laugharne, where he wrote in his boathouse, sits on the Taf Estuary. The market towns of Llandeilo and Carmarthen retain their Welsh character. The National Botanic Garden of Wales and Aberglasney Gardens draw visitors, but the real draw is the landscape itself—green, peaceful, and genuinely unspoiled.`,

  keyFacts: [
    { label: 'Nickname', value: 'Garden of Wales', detail: 'Fertile farmland and wooded valleys' },
    { label: 'Main River', value: 'River Towy', detail: 'One of Wales\' most scenic rivers' },
    { label: 'Mountain Range', value: 'Black Mountain (Mynydd Du)', detail: 'Western edge of Brecon Beacons' },
    { label: 'Forest', value: 'Brechfa Forest', detail: 'Mountain biking and walking trails' },
    { label: 'Main Towns', value: 'Carmarthen, Llandeilo, Llandovery', detail: 'Historic market towns' },
    { label: 'Dylan Thomas', value: 'Laugharne', detail: 'Boathouse where he lived and wrote' },
    { label: 'Castles', value: 'Dinefwr, Carreg Cennen', detail: 'Dramatic hilltop fortresses' },
    { label: 'Railway', value: 'Heart of Wales Line', detail: 'One of Britain\'s most scenic routes' },
    { label: 'Gardens', value: 'National Botanic Garden', detail: 'World\'s largest single-span glasshouse' },
    { label: 'Area', value: '2,395 km²', detail: 'Wales\' largest county' },
  ],

  bestFor: [
    { rank: 1, activity: 'Mountain Biking', description: 'Brechfa Forest trails—all abilities, quiet woodland' },
    { rank: 2, activity: 'River Canoeing/Kayaking', description: 'River Towy—gentle paddling through beautiful valley' },
    { rank: 3, activity: 'Remote Hiking', description: 'Black Mountain (Mynydd Du)—empty Beacons territory' },
    { rank: 4, activity: 'Castle Exploration', description: 'Carreg Cennen, Dinefwr—dramatic hilltop ruins' },
    { rank: 5, activity: 'Garden Visiting', description: 'National Botanic Garden, Aberglasney' },
    { rank: 6, activity: 'Scenic Railways', description: 'Heart of Wales Line—Swansea to Shrewsbury' },
    { rank: 7, activity: 'Wildlife Watching', description: 'Red kites, otters on the Towy' },
    { rank: 8, activity: 'Literary Heritage', description: 'Dylan Thomas Boathouse at Laugharne' },
    { rank: 9, activity: 'Horse Riding', description: 'Trekking through farmland and forest' },
    { rank: 10, activity: 'Dark Sky Stargazing', description: 'Black Mountain area—minimal light pollution' },
  ],

  seasonGuide: {
    spring: { months: 'March - May', weather: '10-15°C', highlights: ['Lambing in the valleys', 'Bluebells in Brechfa', 'River levels ideal'], bestActivities: ['Woodland walking', 'Canoeing', 'Garden visits'], avoid: 'Muddy forest trails early spring' },
    summer: { months: 'June - August', weather: '16-22°C', highlights: ['Long days for biking', 'River paddling', 'Festivals'], bestActivities: ['All activities', 'Kayaking', 'Castle visiting'], avoid: 'Book accommodation ahead' },
    autumn: { months: 'September - November', weather: '10-14°C', highlights: ['Golden valley colours', 'Quiet trails', 'Mushroom season'], bestActivities: ['Mountain biking', 'Hiking', 'Photography'], avoid: 'Exposed Black Mountain in storms' },
    winter: { months: 'December - February', weather: '4-8°C', highlights: ['Cosy market towns', 'Empty castles', 'Heart of Wales Line'], bestActivities: ['Railway journeys', 'Pub walks', 'Heritage sites'], avoid: 'Some outdoor activities limited' },
  },

  insiderTips: [
    { tip: 'Heart of Wales Line', detail: 'One of Britain\'s most scenic railways. 121 miles, 4 trains/day. Llandeilo and Llandovery stops for adventures.' },
    { tip: 'Carreg Cennen at sunset', detail: 'The castle on a cliff is spectacular at any time, but sunset views are extraordinary. Bring a torch for the cave beneath.' },
    { tip: 'Brechfa trails', detail: 'Less famous than Coed y Brenin but quieter and atmospheric. Gorlech trail for beginners, Raven for experts.' },
    { tip: 'Towy Valley paddling', detail: 'Gentle enough for beginners. Put in at Llandovery, take out at Llandeilo. Hire from local operators.' },
    { tip: 'The Cawdor', detail: 'Llandeilo\'s best pub/restaurant. Local produce, excellent beer. Book for dinner.' },
  ],

  topExperiences: [
    { name: 'Brechfa Forest Mountain Biking', type: 'mountain-biking', duration: '3-5 hours', difficulty: 'All levels', description: 'Ancient forest trails from family green to black.', priceRange: 'Free (bike hire £35)' },
    { name: 'Carreg Cennen Castle', type: 'heritage', duration: '2-3 hours', difficulty: 'Easy', description: 'Dramatic hilltop castle with cave beneath.', priceRange: '£6' },
    { name: 'River Towy Kayaking', type: 'kayaking', duration: '3-4 hours', difficulty: 'Easy', description: 'Gentle paddling through the beautiful Towy Valley.', priceRange: '£40-60 guided' },
    { name: 'Heart of Wales Line Journey', type: 'heritage', duration: '4 hours', difficulty: 'Any', description: 'Scenic train through remote mid-Wales countryside.', priceRange: '£15-25' },
    { name: 'Black Mountain Hike', type: 'hiking', duration: '5-7 hours', difficulty: 'Challenging', description: 'Remote Beacons walking—Fan Brycheiniog circuit.', priceRange: 'Free' },
    { name: 'Dylan Thomas Boathouse', type: 'heritage', duration: '1-2 hours', difficulty: 'Easy', description: "Where 'Under Milk Wood' was written. Estuary views.", priceRange: '£5' },
    { name: 'National Botanic Garden', type: 'garden', duration: '3-4 hours', difficulty: 'Easy', description: 'World\'s largest single-span glasshouse. 568 acres.', priceRange: '£14' },
  ],

  faqs: [
    { question: 'Is Carmarthenshire good for adventure?', answer: 'Yes—quietly so. Brechfa Forest MTB trails are excellent. The Black Mountain delivers remote Beacons hiking. The Towy is perfect for kayaking. Just fewer crowds than famous spots.' },
    { question: 'What is the Heart of Wales Line?', answer: '121-mile railway from Swansea to Shrewsbury through some of Britain\'s emptiest country. Stops at Llandeilo, Llandovery, and smaller request stops. 4 trains/day each way.' },
    { question: 'Is this Dylan Thomas country?', answer: 'Yes—he lived at the Boathouse in Laugharne, overlooking the Taf Estuary. \'Under Milk Wood\' was written there. The town is the model for Llareggub.' },
  ],

  hiddenGems: [
    { name: 'Llyn y Fan Fach', type: 'Glacial lake', description: 'Dramatic lake beneath the Black Mountain. Lady of the Lake legend.', location: 'Western Beacons' },
    { name: 'Dryslwyn Castle', type: 'Castle ruin', description: 'Less-visited hilltop ruin with Towy Valley views.', location: 'Near Llandeilo' },
  ],

  localEatsAndDrinks: [
    { name: 'The Cawdor', type: 'Pub/Restaurant', location: 'Llandeilo', specialty: 'Local produce, excellent dining', priceRange: '££-£££' },
    { name: 'Wright\'s Food Emporium', type: 'Deli/Café', location: 'Llanarthne', specialty: 'Welsh cheese, charcuterie, coffee', priceRange: '££' },
  ],

  meta: {
    seoTitle: 'Carmarthenshire | Mountain Biking, Castles & River Adventures | Adventure Wales',
    seoDescription: "Discover Carmarthenshire: Brechfa Forest trails, River Towy kayaking, dramatic castles like Carreg Cennen, and the Heart of Wales Line. The Garden of Wales.",
    heroImage: '/images/regions/carmarthenshire-hero.jpg',
    lastUpdated: '2025-02-06',
  },
};

export default carmarthenshireData;
