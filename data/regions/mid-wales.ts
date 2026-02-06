/**
 * Mid Wales Region Data
 * Last updated: February 2025
 */

export const midWalesData = {
  slug: 'mid-wales',
  name: 'Mid Wales',
  welshName: 'Canolbarth Cymru',

  heroContent: `Mid Wales is where Wales draws breath. Between the peaks of Snowdonia and the coast of Pembrokeshire lies a vast, rolling interior—green hills, empty valleys, and a sense of space that's rare in crowded Britain. This is red kite country, mountain biking at Nant yr Arian, and the Cambrian Mountains that formed the 'Welsh Desert' of Victorian imagination.

Aberystwyth anchors the coast: a university town with Victorian pier, castle ruins, and the narrow-gauge Vale of Rheidol Railway. Inland, the landscape empties. The Elan Valley reservoirs shimmer between moorland hills. Machynlleth—once capital of Owain Glyndŵr's Wales—is now the Centre for Alternative Technology's home. Cardigan Bay dolphins patrol offshore.

Adventure here is about remoteness and self-reliance. The riding at Nant yr Arian and Sweet Lamb rivals anywhere in Wales. The hiking is lonely and wild. The roads are empty and perfect for cycling. This is not dramatic postcard Wales—it's bigger, quieter, and rewards those who seek it out.`,

  keyFacts: [
    { label: 'Main Town', value: 'Aberystwyth', detail: 'University town, Victorian seaside, cultural capital' },
    { label: 'Cambrian Mountains', value: '190,000 hectares', detail: 'Largest roadless area in Wales' },
    { label: 'Elan Valley', value: '6 reservoirs', detail: '70 sq miles of watershed, Victorian dams' },
    { label: 'Red Kites', value: 'Conservation success', detail: 'Nant yr Arian feeding station—daily at 3pm' },
    { label: 'MTB Centre', value: 'Nant yr Arian', detail: 'World-class trails through Cambrian forests' },
    { label: 'Heritage Railway', value: 'Vale of Rheidol', detail: "12 miles, narrow gauge, Devil's Bridge" },
    { label: 'Dolphins', value: 'Cardigan Bay SAC', detail: 'Largest UK pod of bottlenose dolphins' },
    { label: 'Population', value: 'Very sparse', detail: 'Least populated part of Wales' },
    { label: 'Historic Town', value: 'Machynlleth', detail: "Owain Glyndŵr's parliament, CAT base" },
    { label: 'Cambrian Line', value: 'Scenic railway', detail: 'Shrewsbury to Aberystwyth and coast' },
  ],

  bestFor: [
    { rank: 1, activity: 'Mountain Biking', description: 'Nant yr Arian, Sweet Lamb—world-class forest trails' },
    { rank: 2, activity: 'Wildlife Watching', description: 'Red kites at feeding stations, Cardigan Bay dolphins' },
    { rank: 3, activity: 'Remote Hiking', description: 'Cambrian Mountains—empty hills, bog-trotting, wild camping' },
    { rank: 4, activity: 'Road Cycling', description: 'Empty roads, challenging climbs, touring country' },
    { rank: 5, activity: 'Heritage Railways', description: "Vale of Rheidol to Devil's Bridge, narrow gauge" },
    { rank: 6, activity: 'Reservoir Walking', description: 'Elan Valley estate—dams, woodland, Victorian engineering' },
    { rank: 7, activity: 'Wild Swimming', description: 'Mountain rivers, reservoir edges, Cardigan Bay beaches' },
    { rank: 8, activity: 'Stargazing', description: 'Dark skies across the Cambrian interior' },
    { rank: 9, activity: 'Trail Running', description: 'Fell running territory—Cambrian Challenge routes' },
    { rank: 10, activity: 'Sea Kayaking', description: 'Cardigan Bay coastline from Aberystwyth' },
  ],

  seasonGuide: {
    spring: { months: 'March - May', weather: '10-15°C', highlights: ['Lambing season', 'Red kites nesting', 'Rhododendrons at Hafod'], bestActivities: ['Walking', 'Railway journeys', 'Wildlife watching'], avoid: 'Boggy hill paths after winter' },
    summer: { months: 'June - August', weather: '15-20°C', highlights: ['Long days for big rides', 'Dolphin watching best', 'Festivals in Aberystwyth'], bestActivities: ['Mountain biking', 'Sea kayaking', 'Beach days'], avoid: 'Midges in still valleys' },
    autumn: { months: 'September - November', weather: '8-14°C', highlights: ['Golden forests', 'Best MTB conditions', 'Red kite spectacle'], bestActivities: ['Mountain biking', 'Hiking', 'Photography'], avoid: 'Early darkness limits hill time' },
    winter: { months: 'December - February', weather: '3-8°C', highlights: ['Dramatic reservoirs', 'Empty trails', 'Red kite feeding peak'], bestActivities: ['Red kite watching', 'Pub walks', 'Heritage sites'], avoid: 'Exposed hills in bad weather' },
  },

  insiderTips: [
    { tip: 'Red kite feeding', detail: 'Nant yr Arian feeding at 3pm (2pm winter). Arrive early for front-row seats. 100+ birds.' },
    { tip: 'Elan Valley timing', detail: 'Visit after heavy rain when reservoirs overflow the dams. Spectacular.' },
    { tip: "Devil's Bridge combo", detail: 'Take the Vale of Rheidol railway up, walk the waterfalls, bus back.' },
    { tip: 'Sweet Lamb rally stages', detail: 'The rally driving venue opens for MTB some weekends. Unique terrain.' },
    { tip: 'Aberystwyth cliff railway', detail: 'Constitution Hill for sunset views. Camera Battery essential.' },
  ],

  topExperiences: [
    { name: 'Nant yr Arian Mountain Biking', type: 'mountain-biking', duration: '3-5 hours', difficulty: 'All levels', description: 'Red and black trails through Cambrian forests.', priceRange: 'Free (bike hire £40)' },
    { name: 'Red Kite Feeding', type: 'wildlife', duration: '1-2 hours', difficulty: 'Any', description: 'Watch 100+ red kites swoop for food at Nant yr Arian.', priceRange: 'Free (parking £3)' },
    { name: 'Vale of Rheidol Railway', type: 'heritage', duration: '2.5 hours return', difficulty: 'Any', description: "Steam train through Rheidol Valley to Devil's Bridge.", priceRange: '£22-28' },
    { name: 'Elan Valley Walk', type: 'hiking', duration: '3-5 hours', difficulty: 'Moderate', description: 'Walk the estate past Victorian dams and reservoirs.', priceRange: 'Free' },
    { name: 'Cardigan Bay Dolphin Trip', type: 'wildlife', duration: '2-3 hours', difficulty: 'Any', description: 'Boat trip from Aberystwyth or New Quay for dolphins.', priceRange: '£25-40' },
    { name: 'Hafod Estate Walk', type: 'hiking', duration: '2-3 hours', difficulty: 'Easy', description: 'Georgian landscaped estate with waterfalls and follies.', priceRange: 'Free' },
  ],

  faqs: [
    { question: 'Is Mid Wales boring?', answer: "Only if you need crowds. It's vast, empty, and beautiful. The mountain biking is world-class. The wildlife is exceptional. It's adventure for people who want space." },
    { question: 'How do I get there?', answer: 'Train to Aberystwyth on the Cambrian Line (scenic, 3+ hours from Shrewsbury). Driving gives most flexibility—the roads are empty.' },
    { question: 'Where should I stay?', answer: 'Aberystwyth for facilities and coast. Rhayader for Elan Valley. Machynlleth for CAT and inland adventures.' },
  ],

  hiddenGems: [
    { name: 'Claerwen Reservoir', type: 'Remote', description: 'The least-visited Elan Valley reservoir. True solitude.', location: 'Elan Valley' },
    { name: 'Cors Caron', type: 'Nature reserve', description: 'Raised peat bog—rare wildlife, boardwalk trails.', location: 'Near Tregaron' },
  ],

  localEatsAndDrinks: [
    { name: 'Ultracomida', type: 'Deli/Café', location: 'Aberystwyth', specialty: 'Spanish-Welsh deli with excellent coffee', priceRange: '££' },
    { name: 'Y Talbot', type: 'Pub', location: 'Tregaron', specialty: 'Historic drovers\' inn', priceRange: '££' },
  ],

  meta: {
    seoTitle: 'Mid Wales | Mountain Biking, Red Kites & Wild Landscapes | Adventure Wales',
    seoDescription: "Explore Mid Wales: Nant yr Arian MTB trails, red kite feeding, Elan Valley reservoirs, and the wild Cambrian Mountains. Adventure for those who seek space.",
    heroImage: '/images/regions/mid-wales-hero.jpg',
    lastUpdated: '2025-02-06',
  },
};

export default midWalesData;
