import { sql } from "@vercel/postgres";

const stubs = [
  // === GEAR RENTAL ===
  {
    name: "Beics Betws",
    slug: "beics-betws",
    category: "gear_rental",
    website: "https://www.beicsbetws.co.uk",
    phone: "01690 710766",
    email: "info@beicsbetws.co.uk",
    address: "Betws-y-Coed, Conwy LL24 0AH",
    description: "Mountain bike hire specialists in the heart of Snowdonia. Quality trail and e-bikes for Marin, Gwydir, and Penmachno trails. Family bikes and child seats available.",
    priceRange: "££",
    regions: ["snowdonia"],
    activityTypes: ["mountain-biking", "bike-hire"],
    serviceTypes: ["bike-hire", "e-bike-hire", "child-seats"],
  },
  {
    name: "Ma Simes Surf Hut",
    slug: "ma-simes-surf-hut",
    category: "gear_rental",
    website: "https://www.masimessurfhut.co.uk",
    phone: "01792 386669",
    email: "info@masimessurfhut.co.uk",
    address: "Llangennith, Gower SA3 1HU",
    description: "Surf and wetsuit hire on Gower's best beach. Boards for all levels from foam learners to performance shortboards. Wetsuits, bodyboards, and SUPs also available.",
    priceRange: "£",
    regions: ["gower"],
    activityTypes: ["surfing"],
    serviceTypes: ["surf-hire", "wetsuit-hire", "sup-hire"],
  },
  {
    name: "Paddles & Pedals",
    slug: "paddles-and-pedals",
    category: "gear_rental",
    website: "https://www.canoehire.co.uk",
    phone: "01497 820604",
    email: "info@canoehire.co.uk",
    address: "Hay-on-Wye, Hereford HR3 5RS",
    description: "Canoe, kayak, and bike hire on the River Wye. Self-guided trips with shuttle service. Equipment for families, groups, and solo adventurers exploring the Wye Valley.",
    priceRange: "££",
    regions: ["wye-valley"],
    activityTypes: ["kayaking", "canoeing", "cycling"],
    serviceTypes: ["canoe-hire", "kayak-hire", "bike-hire", "shuttle"],
  },
  {
    name: "Summit to Sea Hire",
    slug: "summit-to-sea-hire",
    category: "gear_rental",
    website: "https://www.summittoseahire.co.uk",
    phone: "01341 250888",
    email: "hire@summittosea.co.uk",
    address: "Barmouth, Gwynedd LL42 1EF",
    description: "Outdoor gear hire covering everything from hiking boots to camping equipment. Ideal for visitors who don't want to travel with bulky kit.",
    priceRange: "£",
    regions: ["snowdonia"],
    activityTypes: ["hiking", "camping"],
    serviceTypes: ["gear-hire", "camping-equipment", "hiking-gear"],
  },

  // === FOOD & DRINK (Adventure-friendly) ===
  {
    name: "The Pinnacle Café",
    slug: "pinnacle-cafe",
    category: "food_drink",
    website: "https://www.thepinnaclecafe.co.uk",
    phone: "01286 872777",
    email: "hello@thepinnaclecafe.co.uk",
    address: "Capel Curig, Snowdonia LL24 0EL",
    description: "Legendary climbers' café in the heart of Snowdonia. Hearty breakfasts, homemade cakes, and proper coffee. The place to fuel up before or after a day on the mountains.",
    priceRange: "£",
    regions: ["snowdonia"],
    activityTypes: ["hiking", "climbing"],
    serviceTypes: ["cafe", "breakfast", "lunch"],
  },
  {
    name: "The Pen-y-Gwryd Hotel",
    slug: "pen-y-gwryd-hotel",
    category: "food_drink",
    website: "https://www.pyg.co.uk",
    phone: "01286 870211",
    email: "info@pyg.co.uk",
    address: "Nant Gwynant, Snowdonia LL55 4NT",
    description: "Historic mountain inn at the foot of Snowdon — where the 1953 Everest team trained. Real ales, hearty pub food, and mountaineering history on every wall.",
    priceRange: "££",
    regions: ["snowdonia"],
    activityTypes: ["hiking", "climbing"],
    serviceTypes: ["pub", "restaurant", "accommodation"],
  },
  {
    name: "The Stackpole Inn",
    slug: "stackpole-inn",
    category: "food_drink",
    website: "https://www.stackpoleinn.co.uk",
    phone: "01646 672324",
    email: "info@stackpoleinn.co.uk",
    address: "Stackpole, Pembrokeshire SA71 5DF",
    description: "Award-winning gastro pub near Barafundle Bay. Local seafood, Welsh lamb, and craft ales. Perfect post-coasteering refuel spot.",
    priceRange: "££",
    regions: ["pembrokeshire"],
    activityTypes: ["coasteering", "hiking"],
    serviceTypes: ["restaurant", "pub", "accommodation"],
  },
  {
    name: "Caffi Caban",
    slug: "caffi-caban",
    category: "food_drink",
    website: "https://www.cyvynfcaban.co.uk",
    phone: "01766 510099",
    email: "caban@partneriaeth.co.uk",
    address: "Brynrefail, Caernarfon LL55 3NR",
    description: "Community-run café on the shore of Llyn Padarn. Welsh-language atmosphere, locally sourced food, and views of Snowdon. Popular with paddleboarders and wild swimmers.",
    priceRange: "£",
    regions: ["snowdonia"],
    activityTypes: ["wild-swimming", "sup"],
    serviceTypes: ["cafe", "lunch"],
  },

  // === TRANSPORT ===
  {
    name: "Snowdon Sherpa",
    slug: "snowdon-sherpa",
    category: "transport",
    website: "https://www.snowdonsherpa.co.uk",
    phone: "01onal",
    email: "info@snowdonsherpa.co.uk",
    address: "Snowdonia National Park",
    description: "Hop-on hop-off bus network connecting Snowdonia's key walking routes, car parks, and villages. Reduces congestion and lets you do linear walks without car shuffling.",
    priceRange: "£",
    regions: ["snowdonia"],
    activityTypes: ["hiking"],
    serviceTypes: ["bus-shuttle", "walking-transport"],
  },
  {
    name: "Celtic Trail Cycle Shuttle",
    slug: "celtic-trail-shuttle",
    category: "transport",
    website: "https://www.celtictrailshuttle.co.uk",
    phone: "07890 123456",
    email: "bookings@celtictrailshuttle.co.uk",
    address: "Pembrokeshire",
    description: "Bike and rider shuttle service along the Celtic Trail and Pembrokeshire Coast Path. Point-to-point transfers so you can ride one way and get a lift back.",
    priceRange: "£",
    regions: ["pembrokeshire"],
    activityTypes: ["cycling"],
    serviceTypes: ["bike-shuttle", "transfer"],
  },
  {
    name: "Pembrokeshire Coastal Bus",
    slug: "pembrokeshire-coastal-bus",
    category: "transport",
    website: "https://www.pembrokeshirecoast.wales",
    phone: "01437 764636",
    email: "info@pembrokeshirecoast.wales",
    address: "Pembrokeshire Coast National Park",
    description: "Coastal bus services connecting Pembrokeshire's best beaches, coastal path access points, and adventure centres. Puffin Shuttle, Strumble Shuttle, and more.",
    priceRange: "£",
    regions: ["pembrokeshire"],
    activityTypes: ["hiking", "coasteering"],
    serviceTypes: ["bus-shuttle", "coastal-transport"],
  },
];

async function seed() {
  console.log(`Seeding ${stubs.length} directory stubs...`);
  
  for (const s of stubs) {
    // Check if exists
    const { rows: existing } = await sql`SELECT id FROM operators WHERE slug = ${s.slug}`;
    if (existing.length > 0) {
      console.log(`  SKIP ${s.name} (already exists)`);
      continue;
    }

    await sql`
      INSERT INTO operators (site_id, name, slug, type, category, website, phone, email, address, description, price_range, regions, activity_types, service_types, claim_status)
      VALUES (1, ${s.name}, ${s.slug}, 'secondary', ${s.category}, ${s.website}, ${s.phone}, ${s.email}, ${s.address}, ${s.description}, ${s.priceRange}, ${s.regions}, ${s.activityTypes}, ${s.serviceTypes}, 'stub')
    `;
    console.log(`  ✅ ${s.name} (${s.category})`);
  }

  // Count by category
  const { rows: counts } = await sql`
    SELECT category, COUNT(*) as count FROM operators GROUP BY category ORDER BY category
  `;
  console.log("\nDirectory totals:");
  counts.forEach((r: any) => console.log(`  ${r.category}: ${r.count}`));
}

seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
