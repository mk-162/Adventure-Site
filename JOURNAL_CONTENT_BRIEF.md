# Adventure Journal — Content Generation Brief

## Reference Data (USE THESE — don't invent new ones)

- **Tags (52):** [`data/reference/tags.csv`](data/reference/tags.csv) — activity, terrain, difficulty, feature, amenity types
- **Categories (7):** [`data/reference/categories.csv`](data/reference/categories.csv) — guide, gear, safety, seasonal, news, trip-report, spotlight
- **Regions (11):** [`data/reference/regions.csv`](data/reference/regions.csv) — all Welsh adventure regions

Every article MUST use tags and categories from these files. Do not create new tags or categories.

## What This Is

Adventure Wales needs a library of blog/journal articles to populate `/journal`. These drive SEO, support itineraries, and give commercial partners context to appear in.

The content lives in the `posts` database table. Each article has: title, slug, excerpt, category, tags, optional region, optional activity type, hero image reference.

## Voice & Tone

- **Direct, opinionated, practical.** Not tourism brochure copy.
- Write like a local friend who's actually done this stuff.
- Include honest assessments: "skip this if you hate heights"
- Specific details: prices, parking costs, drive times, what to wear
- Decision-useful: help the reader decide if this is for them

Reference existing content in `content/categories/` for the voice — e.g., `coasteering.md` is a great example.

## Content Categories

### 1. Activity Deep Dives (category: "guide")
**Already have:** coasteering, hiking, mountain-biking, surfing, climbing, caving, gorge-walking, kayaking, wild-swimming, zip-lining

**NEED (30+ articles):**
- SUP/paddleboarding in Wales
- Sea kayaking vs river kayaking
- Trail running in Wales
- Wild camping guide (legal situation, best spots)
- Rock climbing for beginners
- Kitesurfing in Wales
- Sailing around Anglesey
- Canyoning in Snowdonia
- Coasteering with kids
- Mountain biking trail centres ranked
- Best beginner surf beaches
- Night hiking in Wales
- Gorge walking vs canyoning — what's the difference?
- Underground adventures (mines, caves, Bounce Below)
- Wildlife watching (puffins, seals, dolphins)
- Fishing in Welsh rivers and lakes
- Horse riding / pony trekking
- Paragliding and hang gliding
- Open water swimming events
- Via ferrata in Wales

### 2. Location Guides (category: "guide")
**NEED (20+ articles):**
- "48 Hours in Snowdonia" — what to actually do
- "Pembrokeshire Beyond the Beaches"
- "Brecon Beacons for Non-Hikers"
- "Anglesey: The Underrated Adventure Island"
- "Gower Peninsula Adventure Guide"
- "North Wales Coast — More Than Caravans"
- "Mid Wales: Wales' Empty Quarter"
- "Wye Valley: Adventure on the Border"
- "Best Adventures Near Cardiff" (day trip guide)
- "Best Adventures Near Liverpool/Manchester" (gateway guide)
- "Welsh 3000s Challenge — Everything You Need to Know"
- "Snowdon: Which Path Should You Take?"
- "Pembrokeshire Coast Path: Section by Section"
- "Best Waterfalls in Wales"
- "Hidden Beaches of Wales"
- "Best Viewpoints in Snowdonia"
- "Castles + Adventure Combos" (family angle)

### 3. Gear Guides (category: "gear")
**Already have:** camping, climbing, coasteering, hiking, mountain-biking, wild-swimming

**NEED (10+ articles):**
- Wetsuit buying guide for Welsh waters
- Best waterproof jackets for Welsh weather
- Packing list: adventure weekend in Wales
- MTB bike hire vs bring your own
- Budget gear that actually works
- Kids' adventure gear guide
- Photography gear for adventure trips
- Camping in the rain — gear that makes it bearable
- Winter hiking gear for Welsh mountains
- Van life gear for touring Wales

### 4. Seasonal Content (category: "seasonal")
**Already have:** spring, summer, autumn, winter adventures

**NEED (8+ articles):**
- "What's Open in Winter" — activity calendar
- "School Holiday Adventure Planner" (Feb half-term, Easter, Summer, October)
- "Bank Holiday Weekend Ideas"
- "Christmas & New Year in Wales"
- "Storm Season Adventures" — what to do when it's wild
- "Shoulder Season Deals" — when to get best prices
- "Festival Season Adventure Add-Ons" (Green Man, etc.)
- "Dark Skies Season" — stargazing + adventure combos

### 5. Safety Content (category: "safety")
**Already have:** mountain, coasteering, water, weather (×2), cycling

**NEED (6+ articles):**
- "Sea swimming safety in Wales"
- "What to do if the weather turns on Snowdon"
- "River safety: understanding water levels"
- "Group safety: managing mixed ability groups"
- "Solo adventure safety checklist"
- "Emergency contacts and mountain rescue — how it works in Wales"

### 6. Trip Reports (category: "trip-report")
**NEED (10+ articles):**
- "We Tried the Snowdonia Adventure Weekend — Here's What Happened"
- "A Family of Four Takes on Pembrokeshire"
- "Solo Female Traveler: 5 Days in North Wales"
- "MTB Trail Centre Tour — Coed y Brenin to BikePark Wales"
- "Coasteering in January: Are We Mad?"
- "The Welsh 3000s in One Day — Our Attempt"
- "Vanlife Week: Touring Wales' West Coast"
- "Budget Wales: £50/Day Adventure Challenge"
- "Rainy Week in Snowdonia — What We Actually Did"
- "Accessible Adventures: Wheelchair-Friendly Wales"

### 7. Operator Spotlights (category: "spotlight")
**NEED (10+ articles):**
- Profile of TYF Adventure (Pembrokeshire pioneers)
- Profile of Zip World (the empire)
- Profile of Plas y Brenin (national centre)
- Profile of Adventure Britain
- Profile of Preseli Venture
- Profile of Antur Stiniog (MTB)
- Small operator spotlights (3-4 emerging operators)
- "How to Choose an Adventure Operator in Wales"
- "What Does 'Qualified Instructor' Actually Mean?"

## Article Format

Each article should be delivered as a JSON object:

```json
{
  "slug": "sup-paddleboarding-wales",
  "title": "SUP & Paddleboarding in Wales",
  "excerpt": "Flat water, surf, rivers — Wales has SUP options for every skill level. Here's where to go and what you'll pay.",
  "category": "guide",
  "content": "Full markdown article content here...",
  "heroImage": null,
  "author": "Adventure Wales",
  "regionSlug": null,
  "activityTypeSlug": "sup",
  "tags": ["sup", "coastal", "beginner-friendly", "family-friendly"],
  "readTimeMinutes": 8
}
```

## Content Requirements Per Article

1. **800-2000 words** — long enough for SEO, short enough to read
2. **Specific Welsh locations** mentioned (good for local SEO)
3. **Operator names** where relevant (links to our directory)
4. **Price ranges** (current 2025/2026 season)
5. **Honest difficulty/suitability** assessment
6. **Seasonal notes** — when to go, when to avoid
7. **At least 3 internal link opportunities** (to itineraries, activities, other articles)
8. **Tags** from our existing tag system: coasteering, surfing, mountain-biking, sea-kayaking, hiking, climbing, gorge-walking, caving, zip-lining, sup, kayaking, wild-swimming, trail-running, sailing, coastal, mountain, valley, forest, underground, river, lake, easy, moderate, challenging, extreme, family-friendly, beginner-friendly, dog-friendly, wheelchair-accessible, equipment-provided, guided, free-parking, public-transport, cafe, toilets, showers, bike-shop, camping, wifi

## Priority Order

1. **Activity deep dives** (these support itinerary pages)
2. **Location guides** (these drive regional SEO)
3. **Trip reports** (these feel authentic, drive trust)
4. **Gear guides** (practical, high search volume)
5. **Seasonal content** (time-sensitive relevance)
6. **Operator spotlights** (commercial value)
7. **Safety** (trust + authority)

## Delivery

Place JSON files in `data/journal/` — one per article:
```
data/journal/sup-paddleboarding-wales.json
data/journal/48-hours-snowdonia.json
...
```

An import script at `scripts/import-posts.ts` will load them into the database.

## Total Target: 100+ articles

This gives us a substantial content library for SEO, internal linking, and commercial sidebar placements. Every article is an opportunity to show relevant itineraries and operators.
