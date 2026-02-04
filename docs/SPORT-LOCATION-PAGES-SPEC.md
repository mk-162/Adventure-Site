# Sport/Location Pages — Technical Spec

## Clearing Up the Terminology

The site has three distinct content layers. Understanding the difference is critical.

### Layer 1: Activities (already built)
**What they are:** Individual bookable experiences from specific operators.
**URL:** `/activities/{slug}`
**Examples:**
- `/activities/coasteering-classic` — TYF Adventure's coasteering trip in Pembrokeshire
- `/activities/uplift-pass` — BikePark Wales uplift pass
- `/activities/2-hour-surf-lesson` — Llangennith Surf School lesson
- `/activities/crib-goch-guided-walk` — MountainXperience guided scramble

**Key traits:**
- Tied to ONE operator
- Has a specific price, duration, booking URL
- Is a product you can buy
- Lives in the `activities` DB table

### Layer 2: Sport/Location Pages (THIS SPEC — to be built)
**What they are:** Comprehensive editorial guide pages for a sport in a specific region. The definitive resource. The SEO authority page.
**URL:** `/{region}/things-to-do/{activity-type}`
**Examples:**
- `/snowdonia/things-to-do/hiking` — EVERYTHING about hiking in Snowdonia
- `/pembrokeshire/things-to-do/surfing` — EVERYTHING about surfing in Pembrokeshire
- `/south-wales/things-to-do/mountain-biking` — Every trail centre, shop, route in South Wales

**Key traits:**
- NOT a single bookable product
- Is an editorial hub aggregating ALL content about this sport+location combo
- Shows: spots/routes, bookable activities, operators, gear shops, events, journal posts, videos, FAQs
- This is what ranks for "hiking in Snowdonia" or "mountain biking south wales"
- Commercially sponsorable — operators can pay to be featured
- Lives in the `guide_pages` DB table (being built now)

### Layer 3: Best-Of Lists (to be built)
**What they are:** Ranked, opinionated lists.
**URL:** `/{region}/best-{activity}`
**Examples:**
- `/snowdonia/best-hikes`
- `/pembrokeshire/best-surf-spots`

**Key traits:**
- Ranked entries with verdicts
- Targets "best X in Y" keywords
- Links heavily into the Layer 2 hub page
- Lives in the `guide_pages` DB table (type: "best_of")

---

## The Relationship Between Layers

```
LAYER 2: Sport/Location Hub Page
/snowdonia/things-to-do/hiking
"Hiking in Snowdonia"
┌─────────────────────────────────────────────┐
│                                             │
│  EDITORIAL INTRO (300-500 words)            │
│                                             │
│  TOP SPOTS (from guide_page_spots)          │
│  ├─ Snowdon via Llanberis Path              │
│  ├─ Crib Goch                               │
│  ├─ Tryfan North Ridge                      │
│  ├─ Cadair Idris                            │
│  └─ Cwm Idwal                               │
│                                             │
│  BOOKABLE EXPERIENCES (from activities)     │─── LAYER 1
│  ├─ Llanberis Path Guided Walk £45  [Book]  │    These are the products
│  ├─ Snowdon Summit Hike £60        [Book]   │    from specific operators
│  ├─ Crib Goch Guided Walk £55      [Book]   │
│  └─ Hill Walking Courses £120      [Book]   │
│                                             │
│  LOCAL DIRECTORY (from operators + JSON)     │
│  ├─ OPERATORS: MountainXperience, SMG...    │
│  ├─ GEAR SHOPS: Joe Brown's, Cotswold...    │
│  ├─ FOOD: Pete's Eats, Moel Siabod Cafe    │
│  └─ ACCOMMODATION: YHA Llanberis...         │
│                                             │
│  YOUTUBE VIDEOS (2-4 embeds)                │
│                                             │
│  EVENTS (Snowdonia Marathon, etc.)          │
│                                             │
│  JOURNAL POSTS (from posts table)           │
│  ├─ "48 Hours in Snowdonia"                 │
│  ├─ "Welsh 3000s Challenge"                 │
│  └─ "Best Viewpoints Snowdonia"             │
│                                             │
│  RELATED ITINERARIES                        │
│  ├─ Snowdonia Adventure Weekend             │
│  └─ Multi-Sport Challenge                   │
│                                             │
│  PRACTICAL INFO (weather, gear, parking)    │
│                                             │
│  FAQs (5-8 questions)                       │
│                                             │
│  BEST-OF LISTS ────────────────────────┐    │
│  ├─ "10 Best Hikes in Snowdonia →"     │    │─── LAYER 3
│  └─ "Best Easy Walks Snowdonia →"      │    │
│                                        │    │
│  NEARBY ──────────────────────────┐    │    │
│  ├─ Hiking in Brecon Beacons →    │    │    │─── Other LAYER 2 pages
│  ├─ Climbing in Snowdonia →       │    │    │
│  └─ Mountain Biking Snowdonia →   │    │    │
│                                             │
│  SPONSOR BANNER (if page is sponsored)      │─── Commercial
│                                             │
└─────────────────────────────────────────────┘
```

---

## What the Page Component Needs to Do

The page at `/{region}/things-to-do/{activity-type}` needs to pull from MULTIPLE data sources:

### Data Sources

| Section | Source | Query |
|---------|--------|-------|
| Editorial content | `guide_pages` table | Match by regionId + activityTypeId, type="combo" |
| Top spots/routes | `guide_page_spots` table | FK to guide_pages.id |
| Bookable experiences | `activities` table | Filter by regionId + activityTypeId |
| Operators | `operators` table | Filter by regions[] contains region AND activityTypes[] contains activity |
| Gear shops | `operators` table | Filter by category="gear_rental" AND regions[] contains region |
| Food/drink | `operators` table | Filter by category="food_drink" AND regions[] contains region |
| Accommodation | `accommodation` table | Filter by regionId |
| Events | `events` table | Filter by regionId (+ keyword match on type) |
| Journal posts | `posts` table | Filter by regionId + activityTypeId, OR matching tags |
| Itineraries | `itineraries` + `itinerary_stops` | Itineraries in this region with stops matching this activity type |
| YouTube videos | `guide_pages.dataFile` JSON | From the JSON data file |
| FAQs | `guide_pages.dataFile` JSON | From the JSON data file |
| Practical info | `guide_pages.dataFile` JSON | From the JSON data file |
| Sponsor | `guide_pages.sponsorOperatorId` | Join to operators |
| Best-of lists | `guide_pages` table | type="best_of", same region + activity |
| Nearby combos | `guide_pages` table | Same activity different region, OR same region different activity |

### Fallback Behaviour

If no `guide_pages` record exists for a combo, the page should still work using the current behaviour (just showing filtered activities). The guide_pages data layers ON TOP of the existing page. This means:

1. Page loads → check for guide_pages record
2. **If found**: Rich page with all sections above
3. **If not found**: Current listing page (activities only) — still functional, just less rich
4. This lets us roll out content progressively without breaking existing pages

---

## Page Sections — Detailed Spec

### Section 1: Hero
- **If guide_pages exists**: Custom hero image, H1, strapline from DB
- **If not**: Generated H1 "{ActivityType} in {Region}", generic activity type hero image
- Quick stats bar: # of experiences, # of operators, price range, best season

### Section 2: Editorial Introduction
- Source: `guide_pages.introduction` (markdown)
- Only shows if guide_pages record exists
- 300-500 words, rendered as markdown
- Contains primary keyword naturally

### Section 3: Top Spots / Routes
- Source: `guide_page_spots` joined to this guide page
- Each spot rendered as a card with:
  - Rank number, name, image
  - Difficulty badge, duration, distance
  - Description text
  - Insider tip (collapsible/expandable)
  - Parking info
  - Map pin (lat/lng)
  - "Book Guided Version →" if operatorId is set
  - YouTube embed if youtubeVideoId is set
- Spots are the EDITORIAL content — these aren't bookable products, they're places/routes
- Interactive map showing all spots as numbered pins

### Section 4: Bookable Experiences
- Source: `activities` table, filtered by region + activity type
- These ARE the bookable products from operators
- Rendered as existing ActivityCard components
- Grouped or sorted by: operator, price, difficulty
- "Book Now" buttons link to operator booking
- **This is where the money comes from** — operators pay to be listed/featured here

### Section 5: Local Directory
- **Operators**: From `operators` table where `activityTypes` array contains this activity AND `regions` array contains this region
- **Gear Shops**: From `operators` where category = "gear_rental" and region matches
- **Food/Drink**: From `operators` where category = "food_drink" and region matches  
- **Accommodation**: From `accommodation` table filtered by region
- Each shows: name, logo, rating, review count, link to directory page
- Sponsored/featured operators show with a highlight

### Section 6: YouTube Videos
- Source: JSON data file (referenced by `guide_pages.dataFile`)
- 2-4 embedded videos
- Lazy-loaded (YouTube embeds are heavy)
- Shows: thumbnail, title, channel, duration
- Click to expand/play

### Section 7: Events
- Source: `events` table filtered by regionId
- Plus supplementary events from JSON data file
- Shows: name, date/month, type, registration cost
- Sorted by next occurrence

### Section 8: Related Journal Posts
- Source: `posts` table where:
  - `regionId` matches AND `activityTypeId` matches, OR
  - `regionId` matches AND post tags overlap with activity type slug
- Rendered as article cards: title, excerpt, hero image, read time
- Max 6, sorted by publishedAt desc

### Section 9: Related Itineraries
- Source: `itineraries` that are in this region AND have stops with this activity type
- Rendered as itinerary cards (existing component)
- Max 3

### Section 10: Practical Info
- Source: JSON data file
- Accordion/collapsible sections:
  - Weather & Conditions
  - Gear Checklist
  - Getting There (drive times, public transport, parking)
  - Safety
- Only shows if data exists in JSON

### Section 11: FAQs
- Source: JSON data file + potentially from `answers` table matching region
- Rendered with FAQ schema markup
- Collapsible Q&A format

### Section 12: Best-Of Lists (cross-links)
- Source: `guide_pages` where type="best_of" AND same region + activity
- Rendered as prominent link cards: "10 Best Hikes in Snowdonia →"

### Section 13: Nearby Alternatives
- Source: `guide_pages` where:
  - Same activity, different region (published)
  - Same region, different activity (published)
- Rendered as pill links or small cards

### Section 14: Sponsor Banner
- Source: `guide_pages.sponsorOperatorId`
- If sponsored: prominent banner with operator branding, tagline, CTA
- If not: either empty or house ad for "Sponsor this page" / operator signup

---

## SEO Output

Each page should generate:

### Meta Tags
```html
<title>{metaTitle from guide_pages, or generated}</title>
<meta name="description" content="{metaDescription from guide_pages, or generated}" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{strapline}" />
<meta property="og:image" content="{heroImage}" />
<link rel="canonical" href="https://adventurewales.co.uk/{urlPath}" />
```

### Structured Data (JSON-LD)
```json
[
  { "@type": "BreadcrumbList", ... },
  { "@type": "FAQPage", ... },
  { "@type": "ItemList", "itemListElement": [spots...] },
  { "@type": "LocalBusiness", ... } // for each operator
  { "@type": "Place", ... } // for each spot with lat/lng
  { "@type": "VideoObject", ... } // for each YouTube embed
  { "@type": "Event", ... } // for each event
]
```

### Internal Links Generated
- Breadcrumb: Home → {Region} → Things to Do → {Activity}
- Each activity card → `/activities/{slug}`
- Each operator → `/directory/{slug}`
- Each journal post → `/journal/{slug}`
- Each itinerary → `/itineraries/{slug}`
- Each best-of list → `/{region}/best-{slug}`
- Each nearby combo → `/{region}/things-to-do/{activity}`
- Each accommodation → `/accommodation/{slug}` or region where-to-stay
- Each event → `/events/{slug}`

---

## Commercial Model

### What's Sellable

| Placement | Description | Price Model |
|-----------|-------------|-------------|
| **Page Sponsor** | Exclusive branding on the page, banner, CTA | Monthly/annual per page |
| **Featured Operator** | Highlighted in bookable experiences section | Monthly per page |
| **Featured in Directory** | Highlighted in local directory section | Monthly per page |
| **Featured Spot** | Operator's guided version highlighted on a spot card | Per spot per month |

### How It Works in the DB

```
guide_pages:
  sponsorOperatorId → exclusive page sponsor
  sponsorDisplayName, sponsorTagline, sponsorCtaText, sponsorCtaUrl
  sponsorExpiresAt → auto-unpublish when expired
  featuredOperatorIds → JSON array of operators to highlight in listings
```

Existing tables also contribute:
- `pageSponsors` table — can hold additional sponsor data
- `serviceSlots` table — can hold featured placements per section

### Admin Workflow
1. Create guide page in admin (draft)
2. Add editorial content + spots
3. Assign sponsor (if sold)
4. Set featured operators (if sold)
5. Publish
6. Track: target keyword, search volume, current ranking

---

## Data Flow: Where Content Comes From

```
STATIC / EDITORIAL (written once, updated occasionally)
├── guide_pages table → title, intro, hero, SEO fields, sponsor
├── guide_page_spots table → ranked spots with editorial content
└── JSON data file → videos, FAQs, practical info, gear lists, local shops

DYNAMIC / AUTO-POPULATED (from existing DB, always current)
├── activities table → bookable experiences
├── operators table → directory listings
├── accommodation table → where to stay
├── events table → upcoming events
├── posts table → related journal articles
└── itineraries table → related itineraries

COMMERCIAL (managed via admin)
├── guide_pages.sponsorOperatorId → page sponsor
├── guide_pages.featuredOperatorIds → featured operators
└── serviceSlots / pageSponsors → additional placements
```

---

## Build Order

### Phase 1: Database + Admin (in progress)
- [x] `guide_pages` table schema
- [x] `guide_page_spots` table schema
- [x] Migration to Neon
- [x] Admin CRUD pages

### Phase 2: Page Component
- [ ] Refactor `/{region}/things-to-do/{activity-type}/page.tsx`
- [ ] New queries in `queries.ts` for all data sources
- [ ] Guide page data loader (DB + JSON file merge)
- [ ] Section components (spots, directory, videos, FAQs, practical info)
- [ ] Sponsor banner component
- [ ] Schema markup generation
- [ ] Fallback to current listing if no guide_pages record

### Phase 3: Content Creation
- [ ] Tier 1 combo pages (10 pages, per the brief)
- [ ] JSON data files with videos, FAQs, practical info
- [ ] Images (hero + spots + gallery)

### Phase 4: Best-Of List Pages
- [ ] New route `/{region}/best-{slug}/page.tsx`
- [ ] Best-of page component
- [ ] Tier 1 best-of lists content

### Phase 5: SEO & Commercial
- [ ] Schema markup audit
- [ ] Internal link mesh verification
- [ ] Sponsor workflow testing
- [ ] Ranking tracking setup

---

## Key Decisions Still Needed

1. **Multi-region activities**: BikePark Wales is in Brecon Beacons but also South Wales. Add junction table, or duplicate, or use broader region tagging?

2. **Untyped activities**: 52 activities have no activityTypeId. These won't show on any sport/location page. Need a cleanup pass to assign types.

3. **Operator region/activity matching**: Operators have `regions[]` and `activityTypes[]` as text arrays (slugs). The sport/location page needs to query these. Current array matching is string-based — needs indexing if this gets slow.

4. **JSON data files vs DB**: Some content (videos, FAQs, practical info, gear lists) lives in JSON files, not the DB. This is fine for now but means edits need code deploys. Consider moving to DB columns or a JSONB field on guide_pages if admin editing is needed.

5. **Best-of URL structure**: Currently proposed as `/{region}/best-{slug}`. Need to create a new dynamic route. Confirm this doesn't clash with existing `/{region}/[...slug]` catch-all.
