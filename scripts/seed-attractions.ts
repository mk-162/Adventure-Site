
import "dotenv/config";
import { sql } from "@vercel/postgres";

const attractions = [
  { name: "Cardiff Castle", slug: "cardiff-castle", region: "south-wales", description: "2,000 years of history in the heart of Cardiff...", website: "https://www.cardiffcastle.com", lat: 51.4816, lng: -3.1815, priceFrom: 14.50 },
  { name: "Caernarfon Castle", slug: "caernarfon-castle", region: "snowdonia", description: "UNESCO World Heritage fortress...", website: "https://cadw.gov.wales/visit/places-to-visit/caernarfon-castle", lat: 53.1394, lng: -4.2772, priceFrom: 11.50 },
  { name: "Conwy Castle", slug: "conwy-castle", region: "north-wales", description: "Medieval masterpiece towering over the town...", website: "https://cadw.gov.wales/visit/places-to-visit/conwy-castle", lat: 53.2803, lng: -3.8268, priceFrom: 10.50 },
  { name: "Harlech Castle", slug: "harlech-castle", region: "snowdonia", description: "Dramatic clifftop castle with Snowdonia views...", website: "https://cadw.gov.wales/visit/places-to-visit/harlech-castle", lat: 52.8597, lng: -4.1094, priceFrom: 8.50 },
  { name: "Pembroke Castle", slug: "pembroke-castle", region: "pembrokeshire", description: "Birthplace of Henry VII...", website: "https://www.pembrokecastle.co.uk", lat: 51.6747, lng: -4.9177, priceFrom: 9.00 },
  { name: "St Fagans National Museum of History", slug: "st-fagans", region: "south-wales", description: "Award-winning open-air museum...", website: "https://museum.wales/stfagans/", lat: 51.4877, lng: -3.2719, priceFrom: 0 },
  { name: "Big Pit National Coal Museum", slug: "big-pit", region: "south-wales", description: "Go 90 metres underground in a real coal mine...", website: "https://museum.wales/bigpit/", lat: 51.7689, lng: -3.1053, priceFrom: 0 },
  { name: "Ffestiniog Railway", slug: "ffestiniog-railway", region: "snowdonia", description: "Heritage narrow-gauge railway through Snowdonia...", website: "https://www.festrail.co.uk", lat: 52.9277, lng: -3.9994, priceFrom: 25.00 },
  { name: "Snowdon Mountain Railway", slug: "snowdon-mountain-railway", region: "snowdonia", description: "Rack railway to the summit of Wales...", website: "https://www.snowdonrailway.co.uk", lat: 53.0789, lng: -4.0181, priceFrom: 32.00 },
  { name: "Bodnant Garden", slug: "bodnant-garden", region: "north-wales", description: "80 acres of National Trust gardens...", website: "https://www.nationaltrust.org.uk/visit/wales/bodnant-garden", lat: 53.2278, lng: -3.8036, priceFrom: 14.00 },
  { name: "National Botanic Garden of Wales", slug: "national-botanic-garden", region: "carmarthenshire", description: "The Great Glasshouse and 568 acres of garden...", website: "https://botanicgarden.wales", lat: 51.8494, lng: -4.1494, priceFrom: 12.50 },
  { name: "Zip World Penrhyn Quarry", slug: "zip-world-velocity", region: "snowdonia", description: "Europe's fastest zip line at 100mph...", website: "https://www.zipworld.co.uk", lat: 53.2039, lng: -4.0586, priceFrom: 30.00 },
  { name: "Folly Farm", slug: "folly-farm", region: "pembrokeshire", description: "Zoo, farm, funfair and play areas...", website: "https://www.folly-farm.co.uk", lat: 51.7739, lng: -4.7836, priceFrom: 15.95 },
  { name: "Oakwood Theme Park", slug: "oakwood-theme-park", region: "pembrokeshire", description: "Wales' biggest theme park...", website: "https://www.oakwoodthemepark.co.uk", lat: 51.7986, lng: -4.7494, priceFrom: 20.00 },
  { name: "Portmeirion", slug: "portmeirion", region: "snowdonia", description: "Italianate fantasy village on the Welsh coast...", website: "https://portmeirion.wales", lat: 52.9136, lng: -4.0939, priceFrom: 14.00 },
  { name: "Dan yr Ogof Caves", slug: "dan-yr-ogof", region: "brecon-beacons", description: "Britain's largest showcave complex...", website: "https://www.showcaves.co.uk", lat: 51.8428, lng: -3.6764, priceFrom: 18.50 },
  { name: "Aberglasney Gardens", slug: "aberglasney-gardens", region: "carmarthenshire", description: "A garden lost in time, restored to glory...", website: "https://aberglasney.org", lat: 51.8647, lng: -3.9772, priceFrom: 10.50 },
  { name: "Dolaucothi Gold Mines", slug: "dolaucothi-gold-mines", region: "carmarthenshire", description: "The only Roman gold mine in the UK...", website: "https://www.nationaltrust.org.uk/visit/wales/dolaucothi-gold-mines", lat: 52.0406, lng: -3.9367, priceFrom: 10.00 },
  { name: "Skomer Island", slug: "skomer-island", region: "pembrokeshire", description: "Puffin paradise — 43,000 Atlantic puffins in season...", website: "https://www.welshwildlife.org/skomer-skokholm/", lat: 51.7356, lng: -5.2906, priceFrom: 20.00 },
  { name: "Welsh Mountain Zoo", slug: "welsh-mountain-zoo", region: "north-wales", description: "Conservation zoo with Snowdonia views...", website: "https://www.welshmountainzoo.org", lat: 53.2839, lng: -3.7464, priceFrom: 14.75 },
];

async function seedAttractions() {
  console.log("🏰 Seeding attractions...");

  // 1. Get Site ID
  const siteRes = await sql`SELECT id FROM sites LIMIT 1`;
  if (siteRes.rows.length === 0) {
    console.error("No site found. Please run main seed first.");
    process.exit(1);
  }
  const siteId = siteRes.rows[0].id;

  // 2. Get "Attractions" activity type
  const typeRes = await sql`SELECT id FROM activity_types WHERE slug = 'attractions' LIMIT 1`;
  if (typeRes.rows.length === 0) {
    console.error("Attractions activity type not found. Please run main seed first.");
    process.exit(1);
  }
  const attractionsTypeId = typeRes.rows[0].id;

  // 3. Get Region map
  const regionsRes = await sql`SELECT id, slug FROM regions`;
  const regionMap = regionsRes.rows.reduce((acc, row) => {
    acc[row.slug] = row.id;
    return acc;
  }, {} as Record<string, number>);

  // 4. Insert Attractions
  let count = 0;
  for (const attr of attractions) {
    const regionId = regionMap[attr.region];
    if (!regionId) {
      console.warn(`Region not found for ${attr.name}: ${attr.region}`);
      continue;
    }

    // Check if already exists
    const existing = await sql`SELECT id FROM activities WHERE site_id = ${siteId} AND slug = ${attr.slug} LIMIT 1`;
    if (existing.rows.length > 0) {
      await sql`UPDATE activities SET name = ${attr.name}, description = ${attr.description}, booking_url = ${attr.website}, lat = ${attr.lat}, lng = ${attr.lng}, price_from = ${attr.priceFrom}, status = 'published' WHERE id = ${existing.rows[0].id}`;
    } else {
      await sql`
        INSERT INTO activities (
          site_id, region_id, operator_id, activity_type_id, name, slug,
          description, booking_url, lat, lng, price_from, status
        ) VALUES (
          ${siteId}, ${regionId}, NULL, ${attractionsTypeId},
          ${attr.name}, ${attr.slug}, ${attr.description}, ${attr.website},
          ${attr.lat}, ${attr.lng}, ${attr.priceFrom}, 'published'
        )
      `;
    }
    count++;
  }

  console.log(`✅ ${count} attractions seeded successfully!`);
  process.exit(0);
}

seedAttractions().catch((err) => {
  console.error(err);
  process.exit(1);
});
