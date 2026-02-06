/**
 * Wye Valley Region Data
 * Last updated: February 2025
 */

export const wyeValleyData = {
  slug: 'wye-valley',
  name: 'Wye Valley',
  welshName: 'Dyffryn Gwy',

  heroContent: `The Wye Valley is where Britain's love affair with wild landscapes began. When the Romantic poets came here in the 18th century, they invented tourism—and it's easy to see why. The River Wye winds through steep wooded gorges, past ruined abbeys and towering limestone cliffs, creating scenery that inspired Wordsworth, Turner, and generations since.

This is the closest adventure area to London in Wales—2.5 hours from the capital, straddling the English border. Tintern Abbey's Gothic ruins are the iconic image, but the real adventures lie beyond: canoeing the Wye's gentle waters, rock climbing on the limestone crags, mountain biking through the Forest of Dean, and walking the 136-mile Wye Valley Walk.

The valley has that rare quality of feeling wild while remaining accessible. Canoe from Hay-on-Wye to Chepstow over multiple days. Scramble up Symonds Yat for peregrine falcon views. Explore the Forest of Dean's dark heart. This is gentle adventure with genuine depth—and at the end, there's always a proper pub.`,

  keyFacts: [
    { label: 'AONB Status', value: 'Area of Outstanding Natural Beauty', detail: 'Designated 1971, shared with England' },
    { label: 'River Wye', value: '154 miles', detail: '5th longest UK river, 50+ navigable miles' },
    { label: 'Wye Valley Walk', value: '136 miles', detail: 'Plynlimon to Chepstow' },
    { label: 'Key Landmark', value: 'Tintern Abbey', detail: '12th-century Cistercian ruins' },
    { label: 'Distance from London', value: '2.5 hours', detail: 'Closest Welsh adventure region to capital' },
    { label: 'Climbing', value: "Wintour's Leap, Symonds Yat", detail: 'Limestone crags, sport and trad' },
    { label: 'Forest of Dean', value: '42 sq miles', detail: 'Ancient woodland, MTB trails' },
    { label: 'Wildlife', value: 'Peregrine falcons', detail: "Symonds Yat—one of UK's best viewing spots" },
    { label: 'Border Character', value: 'Welsh/English', detail: 'Historic frontier, mixed culture' },
    { label: 'Main Towns', value: 'Chepstow, Monmouth', detail: 'Market towns with castle ruins' },
  ],

  bestFor: [
    { rank: 1, activity: 'Canoeing & Kayaking', description: 'Multi-day river trips from Hay-on-Wye to Chepstow' },
    { rank: 2, activity: 'Walking', description: '136-mile Wye Valley Walk through gorge and woodland' },
    { rank: 3, activity: 'Rock Climbing', description: "Limestone crags at Symonds Yat and Wintour's Leap" },
    { rank: 4, activity: 'Mountain Biking', description: 'Forest of Dean trails—family to expert' },
    { rank: 5, activity: 'Heritage Exploration', description: 'Tintern Abbey, Chepstow Castle, Raglan Castle' },
    { rank: 6, activity: 'Wildlife Watching', description: 'Peregrine falcons at Symonds Yat Rock' },
    { rank: 7, activity: 'Caving', description: 'Clearwell Caves and limestone systems' },
    { rank: 8, activity: 'Cycling', description: 'Quiet lanes, old railway trails' },
    { rank: 9, activity: 'Wild Swimming', description: 'River Wye swimming spots' },
    { rank: 10, activity: 'Photography', description: 'Tintern, river views, autumn colours' },
  ],

  seasonGuide: {
    spring: { months: 'March - May', weather: '10-16°C', highlights: ['Bluebells in the Forest of Dean', 'Peregrine falcon nesting', 'River levels good for paddling'], bestActivities: ['Walking', 'Birdwatching', 'Canoeing'], avoid: 'High river after rain' },
    summer: { months: 'June - August', weather: '16-22°C', highlights: ['Warm river for swimming', 'Long days on the water', 'Hay Festival'], bestActivities: ['Canoeing', 'Wild swimming', 'Climbing'], avoid: 'Tintern crowds on weekends' },
    autumn: { months: 'September - November', weather: '10-15°C', highlights: ['Spectacular autumn colours', 'Quiet trails', 'Mushroom foraging'], bestActivities: ['Walking', 'Photography', 'Mountain biking'], avoid: 'Slippery limestone after rain' },
    winter: { months: 'December - February', weather: '4-9°C', highlights: ['Atmospheric Tintern', 'Empty valley', 'Pub walks'], bestActivities: ['Heritage visits', 'Walking', 'Pub lunches'], avoid: 'River too high/cold for paddling' },
  },

  insiderTips: [
    { tip: 'Symonds Yat Rock timing', detail: 'Arrive early morning or evening for peregrine views without crowds. RSPB volunteers have scopes.' },
    { tip: 'Canoe trip logistics', detail: 'Wye Valley Canoes and others offer car shuttles. 2-3 day trips from Hay to Monmouth are ideal.' },
    { tip: 'Tintern without tourists', detail: 'Visit late afternoon when coach parties leave. The abbey is magical at dusk.' },
    { tip: 'Forest of Dean bike trails', detail: 'Pedalabikeaway hires bikes with trail maps. Start at Cannop—work up to the harder trails.' },
    { tip: 'Best pub after paddling', detail: 'The Boat Inn at Penallt—riverside terrace, good beer, canoe-friendly.' },
  ],

  topExperiences: [
    { name: 'Multi-day Wye Canoe Trip', type: 'canoeing', duration: '2-4 days', difficulty: 'Moderate', description: 'Paddle from Hay-on-Wye through the gorge to Chepstow.', priceRange: '£50-80/day inc. shuttle' },
    { name: 'Tintern Abbey Visit', type: 'heritage', duration: '1-2 hours', difficulty: 'Easy', description: 'Romantic 12th-century ruins in the valley.', priceRange: '£9' },
    { name: 'Symonds Yat Peregrines', type: 'wildlife', duration: '2-3 hours', difficulty: 'Easy', description: 'Watch nesting peregrines with RSPB volunteers. Free.', priceRange: 'Free' },
    { name: 'Forest of Dean Mountain Biking', type: 'mountain-biking', duration: '3-5 hours', difficulty: 'All levels', description: 'Trails from family green to expert black.', priceRange: '£25-40 bike hire' },
    { name: 'Wye Valley Walk: Tintern Section', type: 'hiking', duration: '4-5 hours', difficulty: 'Moderate', description: 'Classic section through the gorge past the abbey.', priceRange: 'Free' },
    { name: "Rock Climbing at Wintour's Leap", type: 'climbing', duration: '4-5 hours', difficulty: 'Various', description: 'Limestone crags above the river. Trad and sport routes.', priceRange: 'Free (guide £80-120)' },
  ],

  faqs: [
    { question: 'Is the Wye Valley in Wales or England?', answer: 'Both—the river forms the border. Tintern is in Wales (Monmouthshire), while Symonds Yat is in England (Forest of Dean). The AONB straddles both.' },
    { question: 'Can I canoe the Wye myself?', answer: 'Yes—the Wye is navigable for about 50 miles from Hay-on-Wye. Hire canoes/kayaks from operators who provide car shuttles. Grade 1-2, suitable for beginners with basic instruction.' },
    { question: 'How close is it to London?', answer: '2.5 hours by car (M4/M48 to Chepstow). Train to Chepstow from Bristol/Newport. The closest Welsh adventure region to London.' },
  ],

  hiddenGems: [
    { name: 'Devil\'s Pulpit', type: 'Viewpoint', description: 'Limestone outcrop with views down to Tintern Abbey. According to legend, the devil preached to monks here.', location: 'Above Tintern' },
    { name: 'Puzzlewood', type: 'Fantasy forest', description: 'Moss-covered ancient woodland. Filming location for Star Wars, Doctor Who.', location: 'Forest of Dean' },
  ],

  localEatsAndDrinks: [
    { name: 'The Boat Inn', type: 'Pub', location: 'Penallt', specialty: 'Riverside pub, canoe-friendly', priceRange: '££' },
    { name: 'The Anchor', type: 'Pub', location: 'Tintern', specialty: 'Abbey views from the garden', priceRange: '££' },
  ],

  meta: {
    seoTitle: 'Wye Valley | Canoeing, Walking & Tintern Abbey | Adventure Wales',
    seoDescription: "Discover the Wye Valley: multi-day canoe trips, Tintern Abbey, Forest of Dean MTB, and peregrine watching at Symonds Yat. Just 2.5 hours from London.",
    heroImage: '/images/regions/wye-valley-hero.jpg',
    lastUpdated: '2025-02-06',
  },
};

export default wyeValleyData;
