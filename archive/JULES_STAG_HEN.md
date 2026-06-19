# Jules Brief: Stag/Hen + Attractions + Generic Cards

## Context
Adventure Wales is expanding into 3 new content areas. This brief covers the **code** work only — schema, seed data, pages, components. Content writing is handled separately.

**Stack**: Next.js 15 (App Router), Tailwind CSS, Drizzle ORM, Neon Postgres
**Schema**: `src/db/schema.ts` (Drizzle)
**Queries**: `src/lib/queries.ts`
**Seed**: `scripts/seed.ts`
**Existing patterns**: Look at how existing activity types, combo pages, and hub pages work.

---

## Task 1: Add New Activity Types to Seed Data

In `scripts/seed.ts`, the `activityTypeData` array currently has 18 types. Add these 3:

```ts
{ name: "Stag & Hen Parties", slug: "stag-hen", icon: "party-popper" },
{ name: "Sightseeing", slug: "sightseeing", icon: "camera" },
{ name: "Attractions", slug: "attractions", icon: "landmark" },
```

Also add these 2 that were in the content gap analysis but missing from seed:

```ts
{ name: "Quad Biking", slug: "quad-biking", icon: "car" },
{ name: "White Water Rafting", slug: "white-water-rafting", icon: "waves" },
```

**Note**: Horse Riding, Fishing, Wildlife, Paintball, Beaches were already added in a previous session — verify they're in the seed before adding duplicates.

---

## Task 2: Operator Schema — Group/Stag-Hen Fields

Add these fields to the `operators` table in `src/db/schema.ts`:

```ts
// Group & stag/hen fields
groupFriendly: boolean("group_friendly").default(false),
groupMinSize: integer("group_min_size"),
groupMaxSize: integer("group_max_size"),
groupPriceFrom: integer("group_price_from"), // pence
stagHenPackages: boolean("stag_hen_packages").default(false),
youtubeVideoId: varchar("youtube_video_id", { length: 20 }),
```

**Important**: `youtubeVideoId` may already exist (check first — was added by a migration script). Don't duplicate it.

Generate and run the Drizzle migration for any new columns.

---

## Task 3: Generic Itinerary Cards

Itinerary stops sometimes have gaps where no bookable activity exists. Create generic "downtime" stops.

### 3a. Add `is_generic` to itinerary_stops schema

In `src/db/schema.ts`, add to the `itinerary_stops` table:

```ts
isGeneric: boolean("is_generic").default(false),
```

### 3b. Create seed data for generic stops

Add a new seed function or extend the existing one. Create these generic activities that can be inserted as itinerary stops:

```ts
const genericStops = [
  { title: "Rest & Relaxation", slug: "rest-relaxation", description: "Take a breather. You've earned it. Find a cosy spot and recharge.", icon: "coffee" },
  { title: "Local Walk", slug: "local-walk", description: "Explore the area on foot. Ask locals for the best route — they always know.", icon: "footprints" },
  { title: "Shopping in Town", slug: "shopping-in-town", description: "Browse local shops, pick up souvenirs, support small businesses.", icon: "shopping-bag" },
  { title: "Beach Time", slug: "beach-time", description: "Towel, book, maybe a swim if you're brave enough. This is Wales — the water's fresh.", icon: "umbrella" },
  { title: "Pub Lunch", slug: "pub-lunch", description: "Find the nearest local. Wales has some absolute crackers. Ask for the carvery.", icon: "beer" },
  { title: "Scenic Drive", slug: "scenic-drive", description: "Wind the windows down, take the long way round. Every road in Wales is a scenic route.", icon: "car" },
  { title: "Café Stop", slug: "cafe-stop", description: "Coffee, cake, and planning the next adventure. Welsh cakes if you can find them.", icon: "coffee" },
  { title: "Photography Walk", slug: "photography-walk", description: "Wales is ridiculously photogenic. Golden hour on the coast will fill your camera roll.", icon: "camera" },
];
```

### 3c. Update ItineraryTimeline component

In the itinerary detail page, generic stops should render differently:
- No operator link or "View Details" button
- Lighter styling — more of a suggestion than a booking
- Show the icon and description
- No price

Look at `src/app/itineraries/[slug]/page.tsx` and the timeline components. Add a conditional for `isGeneric` stops.

---

## Task 4: Stag/Hen Hub Page

Create `/app/stag-hen/page.tsx` — a rich landing page (NOT just an activity type listing).

### Structure:

1. **Hero Section**
   - Title: "Plan the Ultimate Stag or Hen Weekend in Wales"
   - Subtitle: "Adventure packages, city nightlife, and everything in between"
   - Two CTAs: "Browse Stag Activities" / "Browse Hen Activities" (both scroll to activities section)
   - Background: dark gradient with adventure imagery

2. **Why Wales? Section**
   - 4-5 cards with icons:
     - "Cardiff is a UK top-5 stag/hen destination"
     - "Adventure activities 30 minutes from city nightlife"
     - "More affordable than London or Edinburgh"
     - "Mountains, coastline, and rivers on your doorstep"
     - "15+ adventure operators with group packages"

3. **Popular Activities Grid**
   Cross-link to existing activity type pages, but framed for groups:
   ```
   Gorge Walking → /activities?type=gorge-walking
   Coasteering → /activities?type=coasteering
   Canyoning → /activities?type=canyoning
   Paintball → /activities?type=paintball
   Surfing → /activities?type=surfing
   Climbing → /activities?type=climbing
   Zip Lining → /activities?type=zip-lining
   Wild Swimming → /activities?type=wild-swimming
   ```
   Each card: activity name, one-liner description, "from £X pp" price, link.

4. **By Region Section**
   Cards for the 5 key stag/hen regions:
   - South Wales — "City + adventure. Best of both worlds."
   - Brecon Beacons — "Lodges, hot tubs, and mountain activities"
   - Pembrokeshire — "Coastal adventures, camping, and surf"
   - Snowdonia — "Go big. Mountains, zip lines, gorges"
   - Gower — "Beach parties, surfing, coasteering"
   Each links to `/{region}/things-to-do/stag-hen`

5. **Operators Section**
   Query operators where `stag_hen_packages = true` OR `activity_types` array contains `stag-hen`.
   Display as operator cards (reuse existing `OperatorCard` component).
   "Get a Group Quote" CTA on each.

6. **FAQ Section**
   Hardcoded FAQs with schema.org markup:
   - "How much does a stag/hen weekend in Wales cost?" → "From £150pp for a day to £350pp for a full weekend..."
   - "What's the best time of year?" → "March-September for outdoor activities..."
   - "What's the minimum group size?" → "Most operators take groups of 6+..."
   - "Can you do stag/hen activities in winter?" → "Yes — caving, gorge walking, and indoor climbing work year-round..."
   - "Cardiff or Snowdonia?" → "Cardiff for nightlife + daytime activities. Snowdonia for full adventure immersion..."

### Styling
Match the existing site aesthetic. Use the dark hero pattern from the homepage. Cards should be the same style as region/activity cards elsewhere.

### Data Fetching
- Fetch operators with stag/hen tags from DB
- Fetch activity types for the grid
- Static page with `revalidate = 3600`

---

## Task 5: Attractions Seed Data

Create a new seed script `scripts/seed-attractions.ts` that adds the top 20 Welsh attractions as activities under the "Attractions" activity type.

```ts
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
```

Each attraction should:
- Be linked to the "Attractions" activity type
- Be linked to the correct region (look up region ID by slug)
- Have `operator_id` set to NULL (these aren't operator-run activities in our system — they're standalone attractions)
- Use status `published`

Run format: `npx tsx scripts/seed-attractions.ts`

---

## Task 6: Route Redirect

Add a redirect so `/activities/stag-hen` → `/stag-hen` (the hub page is the canonical URL, not the activity type listing).

In `next.config.ts` or `vercel.json`, add:

```json
{
  "source": "/activities/stag-hen",
  "destination": "/stag-hen",
  "permanent": true
}
```

---

## Testing

After all changes:
1. `npm run build` must pass with zero errors
2. All existing pages must still work
3. New pages must render: `/stag-hen`, combo pages for new types
4. Generic stops must render correctly in itinerary timeline
5. Attractions must appear in activity listings when filtered

---

## Files You'll Touch

- `src/db/schema.ts` — operator fields, itinerary_stops field
- `scripts/seed.ts` — new activity types
- `scripts/seed-attractions.ts` — NEW file
- `src/app/stag-hen/page.tsx` — NEW file
- `src/app/itineraries/[slug]/page.tsx` — generic stop rendering
- `next.config.ts` or `vercel.json` — redirect
- Drizzle migration files

## Files NOT to Touch

- Don't modify existing component styling
- Don't change the homepage layout
- Don't alter existing activity type slugs
- Don't modify `src/lib/combo-data.ts` (enrichment data is handled separately)
