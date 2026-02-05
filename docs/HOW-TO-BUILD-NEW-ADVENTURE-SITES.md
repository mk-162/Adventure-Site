# How To Build New Adventure Sites

The complete playbook for launching a new adventure destination site — from zero to market-leading content. Built from everything we learned with Adventure Wales.

> **Who this is for:** You (MK) and any AI agents tasked with building the next site. Follow this in order. Don't skip steps.

---

## Table of Contents

1. [Philosophy — What We Learned](#1-philosophy--what-we-learned)
2. [Content Architecture — The Pyramid](#2-content-architecture--the-pyramid)
3. [Phase 1: Foundation — Define the Destination](#3-phase-1-foundation--define-the-destination)
4. [Phase 2: Database & Infrastructure](#4-phase-2-database--infrastructure)
5. [Phase 3: Region Research](#5-phase-3-region-research)
6. [Phase 4: Operator Discovery](#6-phase-4-operator-discovery)
7. [Phase 5: Pillar Content Creation](#7-phase-5-pillar-content-creation)
8. [Phase 6: Image Sourcing](#8-phase-6-image-sourcing)
9. [Phase 7: Local Expert Program](#9-phase-7-local-expert-program)
10. [Phase 8: Hub Page Integration](#10-phase-8-hub-page-integration)
11. [Phase 9: Review, QA & Launch](#11-phase-9-review-qa--launch)
12. [Phase 10: Ongoing Maintenance](#12-phase-10-ongoing-maintenance)
13. [Skills Reference](#13-skills-reference)
14. [Quality Standards](#14-quality-standards)
15. [Content Volume Targets](#15-content-volume-targets)
16. [Cost Estimates](#16-cost-estimates)

---

## 1. Philosophy — What We Learned

These are the hard-won lessons from building Adventure Wales. Ignore them at your peril.

### Don't build a directory. Build a trip planning tool.
Nobody bookmarks a list of operators. People bookmark the page that helped them plan their weekend. Every page should answer: "What should I do, where should I stay, and how do I get there?"

### Depth beats breadth. Every time.
One comprehensive, opinionated, locally-informed guide to "Mountain Biking in South Wales" is worth more than 50 thin operator listing pages. Google rewards depth. Users reward depth. Thin content is worse than no content — it trains people not to come back.

### The content quality bar: 5 tests.
Every page must pass ALL of these before publishing:
1. **Bookmark test** — Would someone save this page for their trip?
2. **Share test** — Would someone text this link to a friend?
3. **Return test** — Would someone come back to this page?
4. **SEO test** — Can this rank top 3 for its target keyword within 6 months?
5. **Content test** — Does this contain information you can't find on the first Google result?

### Be honest, not promotional.
"This trail is brilliant but the parking is a nightmare on weekends" is more useful than "enjoy world-class trails in a stunning setting." Honesty builds trust. Trust converts.

### The tier system matters.
- **T1 — Destination draws:** What people Google. Gets rich landing pages. "Zip World", "Snowdon", "Coasteering Pembrokeshire"
- **T2 — Trip enhancers:** Makes a good trip great. In itineraries and region pages. Castles, pubs, beaches, viewpoints
- **T3 — Practical services:** Data only. Gear shops, parking, bike washes. Never gets its own URL

### Operators come AFTER content.
The mistake with Wales was jumping straight to operator pages. The content layer between "I'm interested in surfing" and "Book this specific operator" didn't exist. Build the content pyramid first, then populate with operators.

### Real photos only.
AI-generated outdoor photos look fake. Users notice. Use Unsplash, Wikimedia Commons, tourism board media libraries. Credit photographers. A missing image is better than a fake one.

### Local experts are your moat.
AI can write decent editorial. It can't replace a local guide saying "park at the overflow car park — the main one floods in winter." Build a network of local contributors. Their knowledge is what makes the site irreplaceable.

---

## 2. Content Architecture — The Pyramid

Every site follows the same content structure. Build from the top down.

```
              LEVEL 1: WALES-WIDE PILLAR PAGES
           /activities/surfing — "Surfing in Wales"
         Comprehensive guide, all regions, 2,500+ words
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    LEVEL 2: REGION+ACTIVITY COMBO PAGES
  /pembrokeshire/      /gower/       /snowdonia/
  things-to-do/       things-to-do/  things-to-do/
    surfing             surfing        surfing
  2,000+ words each, with rich components
         │              │              │
    ┌────┼────┐    ┌────┼────┐    ┌────┼────┐
    │         │    │         │    │         │
    LEVEL 3: BEST-OF LIST PAGES
  /pembrokeshire/  /gower/       /snowdonia/
  best-surf-spots  best-beaches  best-surf-spots
  Ranked, opinionated, shareable
         │              │              │
    LEVEL 4: OPERATOR/EXPERIENCE PAGES
    /experiences/celtic-surf  /experiences/llangennith-surf
    Individual booking pages — bottom of funnel
```

### Internal linking rules:
- Every page links UP to its parent
- Every page links DOWN to its children
- Every page links ACROSS to siblings (same activity different region, or same region different activity)
- Pillar pages link to ALL their combo pages
- Combo pages link to their best-of lists
- Best-of lists link back to their combo page

### Additionally:
- **Region pages** (`/{region}`) link to all combo pages for that region
- **Destinations page** (`/destinations`) links to all region pages with editorial comparison content
- **Homepage** features top guides and best-of lists

---

## 3. Phase 1: Foundation — Define the Destination

**Time:** 2-3 days | **Who:** MK + AI research

### Step 1.1: Choose the territory
- Geographic scope (country, county group, national park?)
- Domain name (adventurescotland.co.uk, adventurelakedistrict.co.uk)
- Brand positioning — what makes this area special for adventure?

### Step 1.2: Research regions
For each natural sub-region:

| Field | Example |
|-------|---------|
| Name | The Cairngorms |
| Slug | cairngorms |
| Description | 2-3 sentences |
| Lat/Lng centre | 57.07, -3.67 |
| Key activities | Hiking, mountain biking, skiing, wild swimming |
| Unique selling point | UK's largest national park, sub-arctic plateau |
| Nearest city | Inverness (45 min), Edinburgh (2.5 hrs) |

**Target:** 8-15 regions per site.

**Skill used:** `web_search` + manual research. Check:
- Visit Scotland / Visit England / tourism board sites
- National Park websites
- Google "best outdoor activities in [area]"
- Competitor adventure sites

### Step 1.3: Research activity types
List every bookable outdoor activity in the area:
- Which activities from the existing shared list apply?
- Are there area-specific activities? (e.g., "munro bagging" for Scotland, "ghyll scrambling" for Lake District)

**Target:** 15-25 activity types per site.

### Step 1.4: Competitor analysis
For each main competitor:
- What do they cover that we should cover?
- What do they do badly that we can do better?
- What don't they cover at all? (That's our gap)

**Output:** `docs/sites/{slug}/SITE-BRIEF.md` with regions, activities, brand identity, competitor notes.

### Step 1.5: Keyword research
For each region × activity combo:
- Primary keyword: "{activity} in {region}" — check search volume
- Secondary keywords: "best {activity} {region}", "{region} {activity} guide"
- Long-tail: "beginner {activity} {region}", "family {activity} {region}"

Prioritise combos with search volume. Don't build pages nobody's searching for.

---

## 4. Phase 2: Database & Infrastructure

**Time:** 1-2 hours | **Who:** AI agent

The platform is multi-tenant. Every table has `siteId`. See `docs/MULTISITE-PLAYBOOK.md` for full infrastructure details.

### Step 2.1: Create site record
```sql
INSERT INTO sites (domain, name, tagline, primary_color, accent_color)
VALUES ('adventurescotland.co.uk', 'Adventure Scotland',
        'Your Scottish Adventure Starts Here', '#2d3b4e', '#e65100');
```

### Step 2.2: Seed regions
Insert all regions from the site brief with status='draft'.

### Step 2.3: Seed activity types
Reuse existing activity type IDs where they match (hiking, surfing, etc.). Create new ones for area-specific activities.

### Step 2.4: Configure domain
- Add custom domain in Vercel dashboard
- Point DNS (CNAME to cname.vercel-dns.com)
- SSL auto-provisions

**Output:** Site exists in DB, domain configured, ready for content.

---

## 5. Phase 3: Region Research

**Time:** 3-5 days | **Who:** AI sub-agents (one per region)

This is the deep research phase. Each region gets its own dedicated research session.

### Step 3.1: Transport research
For each region, research and verify:

| Category | What to find |
|----------|-------------|
| Train stations | Name, operator, journey times from major cities, connecting buses |
| Bus services | Route numbers, operators, key stops, frequency, seasonal changes |
| Airports | Nearest, drive time, distance |
| Driving | Routes from 4-5 major cities, journey times, road names |
| Parking | Specific car parks at activity spots, costs, capacity, tips |
| Car-free viability | Honest assessment — is it genuinely possible? |

**Critical rule:** Verify every bus route and train station. Don't invent them. If unsure, mark as "needs verification."

**Skill used:** `aw-deep-research`
**Sources:** National Rail, Traveline, bus operator websites, Google Maps

### Step 3.2: Accommodation research
Per region, find 10-30 adventure-friendly stays:
- Hostels, bunkhouses (budget adventure travellers)
- B&Bs, guest houses (mid-range)
- Hotels, glamping (premium)
- Campsites (budget)

For each: name, type, price range, location, what makes it good for adventure travellers (bike storage, drying rooms, packed lunch service, etc.)

**Skill used:** `aw-deep-research`, `web_search`
**Sources:** Booking.com, HostelWorld, independent hostel sites, campsite directories

### Step 3.3: Local knowledge research
Per region:
- 3-5 insider tips (things only locals know)
- Month-by-month "best time to visit" guide
- Weather patterns and microclimates
- Hidden gems (lesser-known spots)
- Where to eat/drink near activity hubs (specific named places)

**Skill used:** `aw-deep-research`
**Sources:** Local blogs, TripAdvisor forums, Reddit r/[area], local tourism forums

### Step 3.4: Location/spot research
Discover the specific places within each region:
- Trail heads, beaches, climbing crags, rivers, lakes
- For each: name, lat/lng, parking, access, facilities
- What makes this spot special vs alternatives

**Skill used:** `adventure-research`, `web_search`

**Output per region:** Structured research data stored in `docs/sites/{slug}/research/{region}.json`

---

## 6. Phase 4: Operator Discovery

**Time:** 3-5 days | **Who:** AI sub-agents

### Step 4.1: Primary operator discovery
For each region × activity combo with search demand:

1. Search: "{activity} in {region name}" / "{activity} {area} book"
2. For each operator found:

| Field | Required |
|-------|----------|
| Name | ✅ |
| Website | ✅ |
| Phone | If available |
| Email | If available |
| Address/postcode | ✅ (for geocoding) |
| Activities offered | ✅ |
| Price range | ✅ |
| Duration | ✅ |
| Difficulty levels | ✅ |
| Min age | If applicable |
| Group size | If available |
| Google rating | ✅ |
| Review count | ✅ |
| Booking URL | ✅ |
| Booking platform | (direct, beyonk, fareharbor, etc.) |
| Certifications | (AALA, BCU, etc.) |
| Season | When they operate |

**Skill used:** `adventure-research`
**Sources:** Google Search, Google Maps, TripAdvisor, operator websites

### Step 4.2: Geocode all operators
Use postcodes.io (UK, free, no API key) for UK sites:
```bash
curl -s "https://api.postcodes.io/postcodes/{POSTCODE}" | jq '.result | {lat: .latitude, lng: .longitude}'
```

**Critical rule from Wales:** Postcodes are the source of truth for coordinates. Don't use Google Maps estimates — they drift.

### Step 4.3: Secondary operator discovery
- Pubs/restaurants near adventure spots
- Gear rental/shops
- Transport providers
- These are T2/T3 — data only, no standalone pages

### Step 4.4: Verify and deduplicate
- Check all websites are live (HTTP 200)
- Remove duplicates
- Cross-reference Google ratings
- Flag any operators that look closed/defunct

**Output:** Complete operator database ready for import.

---

## 7. Phase 5: Pillar Content Creation

**Time:** 5-10 days | **Who:** AI sub-agents + MK review

This is where the site goes from data to destination. Each piece of content gets its own dedicated research-and-write session.

### Forum-first research (MANDATORY)

Before writing any content, research the relevant forums. Official websites tell you what businesses want you to know. Forums tell you what you actually need to know. The `aw-deep-research` skill has a full list of sport-specific forums (Singletrack, UKClimbing, Walkhighlands, Magic Seaweed, Song of the Paddle, etc.) and mandatory search patterns.

### Tiered tips (MANDATORY)

Every combo page needs TWO sets of tips:
- **🟢 First Timer** — practical basics (accommodation with jet wash, cycling distance to trails, what to download, gear hire)
- **🔴 Regular / Returning** — insider knowledge (which spots drain best, where locals actually eat, what's overrated, current changes)

This stops experienced visitors being bored by basics, and gives newcomers the confidence they need.

### The content creation process (per page):

```
┌─────────────────────────┐
│ 1. DEEP RESEARCH        │ — forums first, then web search, competitor analysis
│    (30-60 min per page)  │ — Skill: aw-deep-research
├─────────────────────────┤
│ 2. CONTENT WRITING      │ — editorial, tips, expert quotes, honest assessment
│    (30-60 min per page)  │ — Skill: aw-content-writer
├─────────────────────────┤
│ 3. IMAGE SOURCING       │ — Unsplash, Wikimedia, tourism boards
│    (15-30 min per page)  │ — Skill: aw-image-sourcer
├─────────────────────────┤
│ 4. DATA ASSEMBLY        │ — JSON combo data file with all fields populated
│    (15-30 min per page)  │ — Manual/script
├─────────────────────────┤
│ 5. MK REVIEW            │ — Read, flag issues, approve or request changes
│    (10-15 min per page)  │ — Human
└─────────────────────────┘
```

### Step 5.1: Build combo pages (Level 2) — priority order

Start with the highest-traffic combos. For Wales, this was:
1. Hiking in Snowdonia
2. Coasteering in Pembrokeshire
3. Surfing in Pembrokeshire
4. Mountain Biking in South Wales
5. Beaches in Gower

**For each combo page, produce a JSON file at `data/combo-pages/{region}--{activity}.json` containing:**

| Section | Content | Target |
|---------|---------|--------|
| `title` | "{Activity} in {Region}" | — |
| `strapline` | One compelling sentence | 15-25 words |
| `metaTitle` | SEO-optimised title | 50-60 chars |
| `metaDescription` | SEO meta description | 150-160 chars |
| `editorial` | Long-form markdown guide | 1,500-2,500 words |
| `topTips` | Flat list fallback tips | 5-8 tips |
| `tieredTips` | First Timer + Regular tips (preferred over flat) | 6-10 each tier |
| `localTakes` | Expert quotes with photo/bio | 1-3 per page |
| `featuredExpert` | Extended expert panel | 1 per page |
| `honestTruth` | What's great / what's not | 4-6 each |
| `spots` | Detailed spot guides | 5-10 per page |
| `practicalInfo` | Weather, gear, safety, transport, parking | All sections |
| `faqs` | Real questions people ask | 6-10 per page |
| `whereToEat` | Specific post-activity food recommendations | 3-5 places |
| `whereToStay` | Adventure-friendly accommodation picks | 3-5 options |
| `localDirectory.gearShops` | Local gear/rental shops | 2-4 shops |
| `events` | Races, festivals, competitions | All known |
| `nearbyAlternatives` | Same activity other regions + same region other activities | 2-4 each |
| `keywords` | Primary, secondary, long-tail, local intent | Full set |
| `imageCredits` | Attribution for all sourced images | All images |

### Step 5.2: Build best-of lists (Level 3)

For each combo page, create at least one best-of list. Store at `data/best-lists/{region}--best-{slug}.json`.

**Prioritise by search volume:**
- "Best hikes in {region}" — nearly always high volume
- "Best beaches in {region}" — if coastal
- "Best walks in {region}" — different intent to "hikes"
- "Best {activity} in {region}" — for popular activities

**Each list entry needs:**

| Field | Required |
|-------|----------|
| Rank | ✅ |
| Name | ✅ |
| One-line verdict | ✅ (opinionated, specific) |
| Image | ✅ |
| Why it made the list | ✅ (2-3 sentences) |
| Key stats | ✅ (difficulty, duration, distance, cost) |
| Best for | ✅ |
| Skip if | ✅ (honest — who should NOT do this) |
| Insider tip | ✅ (one non-obvious tip) |
| Season | ✅ |
| Parking | ✅ (where + cost) |
| Start point lat/lng | ✅ |

**List rules:**
- #1 should be the genuinely best, not the most famous
- Mix difficulties across the list
- Include 1-2 hidden gems most other lists miss
- Include at least 1 beginner/accessible option
- Be honest about downsides
- The ranking should be OPINIONATED — that's what makes it shareable

### Step 5.3: Build activity pillar pages (Level 1)

These are Wales-wide (or Scotland-wide) pages. One per major activity type.

**Priority order:** Start with the 5-8 activity types that have the most search volume and the most combo pages below them.

**Content blocks for each pillar page:**

| Block | Content |
|-------|---------|
| Hero + strapline | Compelling image + hook |
| Editorial intro | 500+ words of genuine expertise about this activity in this country |
| The Local Take | Expert quote from prominent figure in this activity |
| Top Tips | 5-8 country-wide tips |
| Best Regions For This | Ranked with reasons, links to every combo page |
| At a Glance | Season, difficulty range, cost range, age suitability |
| Featured Expert | Photo, bio, extended perspective |
| The Honest Truth | Country-wide pros/cons of this activity here |
| Interactive Map | All spots across the country |
| Gear Guide | What you need, where to get it |
| FAQs | 8-12 questions, schema markup |
| Every Combo Page | Linked prominently as "Browse by Region" |
| Related Journal Articles | Blog posts about this activity |

### Step 5.4: Write supporting content

| Content Type | Target Per Site | Notes |
|-------------|----------------|-------|
| Region descriptions | 1 per region (300-500 words) | Written as editorial, not marketing |
| Activity descriptions | 1 per activity listing (150-300 words) | What makes THIS one special |
| Operator profiles | 1 per operator (200-400 words) | What makes them different |
| Itineraries | 30-50 | Multi-day trip plans with activities + accommodation + food |
| FAQ/Answer pages | 50-100 | Common questions, SEO-rich |
| Guide pages | 20-30 | Gear, safety, beginners, seasonal |
| Journal articles | 20-40 | "10 Best...", trip reports, seasonal guides |

### Step 5.5: Content component reference

These components are built and available for all combo/pillar pages:

| Component | Location | Purpose |
|-----------|----------|---------|
| `<LocalTake />` | `src/components/content/LocalTake.tsx` | Expert quote with photo, name, role. Tinted callout. |
| `<TopTips />` | `src/components/content/TopTips.tsx` | Numbered tips in accent-bordered box |
| `<FeaturedExpert />` | `src/components/content/FeaturedExpert.tsx` | Large expert panel with photo, bio, perspective |
| `<HonestTruth />` | `src/components/content/HonestTruth.tsx` | Two-column: what's great (green) / what's not (amber) |
| `<ProTip />` | `src/components/content/ProTip.tsx` | Inline single-tip callout |
| `<BestOfCard />` | `src/components/content/BestOfCard.tsx` | Card for embedding best-of list links |
| `<ImageCredit />` | `src/components/content/ImageCredit.tsx` | Photo attribution |

All components render from the combo data JSON — no separate coding needed per page.

---

## 8. Phase 6: Image Sourcing

**Time:** 2-3 days | **Who:** AI sub-agents

### Priority order for sources:

| Priority | Source | Licence | Cost | Quality |
|----------|--------|---------|------|---------|
| 1 | **Tourism board media libraries** | Usually free for editorial | £0 | Excellent — professional, location-specific |
| 2 | **Unsplash** | Free, no attribution required (but appreciated) | £0 | Good — search for specific locations |
| 3 | **Wikimedia Commons** | CC-BY or CC-BY-SA (must credit) | £0 | Variable — excellent for landmarks |
| 4 | **Pexels / Pixabay** | Free, no attribution required | £0 | Good — more generic |
| 5 | **Flickr CC** | Check specific licence per image | £0 | Good for UK outdoors |
| 6 | **Operator websites** | Ask permission | £0 | Authentic but low-res |
| ❌ | **AI-generated** | N/A | N/A | **NO. Real photos only.** |

### Search strategy:
- **Always include the specific location** in searches: "mountain biking Afan Forest" not "mountain biking"
- If no location-specific results, try: "UK {activity}" or "British {activity}"
- **Reject any image that's clearly not the right country** — wrong vegetation, wrong landscape
- When in doubt, skip it. Missing image > fake image.

### Unsplash API:
```bash
curl -s "https://api.unsplash.com/search/photos?query={query}&per_page=10&orientation=landscape" \
  -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY"
```
Rate limit: 50 requests/hour. Space them out.

### Image requirements:

| Context | Dimensions | Format |
|---------|-----------|--------|
| Hero/Banner | 1200×630px | JPG/WebP |
| Activity card | 800×600px | JPG/WebP |
| Best-of list entry | 1200×800px | JPG |
| Expert portrait | 400×400px | JPG (circular crop in component) |
| Region hero | 1200×800px | JPG |

### Store images:
```
public/images/content/{region}--{activity}/
public/images/best-lists/{region}--{slug}/
public/images/regions/{region}-hero.jpg
```

### Always record credits:
Every sourced image must have a credit entry in the combo/best-list JSON:
```json
{
  "image": "/images/content/south-wales--mountain-biking/hero.jpg",
  "photographer": "Jake Colling",
  "source": "Unsplash",
  "sourceUrl": "https://unsplash.com/photos/abc123",
  "licence": "Unsplash License"
}
```

**Skill used:** `aw-image-sourcer`

---

## 9. Phase 7: Local Expert Program

**Time:** Ongoing | **Who:** MK (outreach) + AI (management)

This is the content moat. AI writes the structure; local experts make it irreplaceable.

### The model:
Every combo page and best-of list gets a **Local Expert** — a real person with a photo, bio, and ongoing relationship.

### What we offer them:
- Permanent, prominent profile on a page targeting their customers
- They're positioned as THE authority for this activity in this area
- Free — more valuable than paid advertising for their business
- Takes 15 minutes per month of their time

### What they give us:
- Their name, photo, and a quote for the page
- A monthly check-in: "anything changed?" (trail closures, price changes, new things)
- Occasional 3-5 question interview for fresh content
- Their credibility (E-E-A-T signals for Google)

### How to find them:
1. Operators already in the database — email the owner/manager
2. Local outdoor instructors / guides
3. Equipment shop owners
4. Running/cycling/climbing club leaders
5. Adventure bloggers in the area

### The outreach message (template):
```
Hi [Name],

I'm building Adventure [Country] — a trip planning guide for outdoor 
adventures in [area]. We're creating the definitive guide to [activity] 
in [region] and I'd love to feature you as our local expert.

What that means:
- Your photo, name, and bio featured prominently on the page
- A quote from you about [activity] in [region]
- A link back to [their business]
- 15 minutes of your time, once a month

The page is designed to rank #1 for "[activity] in [region]" on Google.
That's free, permanent exposure for your business.

Interested? I can send you 3 quick questions to get started.

[MK]
```

### Monthly check-in process:
1. Database stores `lastContactedAt` per expert
2. Monthly cron job flags who's due
3. Draft message: "Hey [Name], quick check — anything changed at [business] this month? Trail closures, price updates, new sessions? Also: [one specific question for fresh content]"
4. MK approves and sends
5. Response gets incorporated into page data
6. Update `lastContactedAt`

### Placeholder strategy:
Until real experts are recruited:
- Create realistic AI-generated expert profiles
- Mark with `isPlaceholder: true` (renders with "AI Placeholder" badge in dev, hidden in prod)
- Use realistic local names and plausible roles
- Write quotes that sound like real people, not marketing
- Replace with real interviews as they come in

---

## 10. Phase 8: Hub Page Integration

**Time:** 2-3 days | **Who:** AI agent

This is where all the content weaves together into a coherent site.

### Region pages (`/{region}`) must show:

```
1. EXPLORE BY ACTIVITY (grid of cards)
   [Hiking →] [Surfing →] [Climbing →] [MTB →]
   Each links to → /{region}/things-to-do/{type}

2. OUR TOP PICKS (best-of list cards)
   📋 10 Best Hikes in {Region}
   📋 Best Beaches in {Region}
   Each links to → /{region}/best-{slug}

3. FEATURED EXPERIENCES (curated, not random)
   Editorially chosen operator cards — not the first 4 from the DB

4. FROM THE JOURNAL (related articles)
   Blog posts tagged to this region
```

### Combo pages (`/{region}/things-to-do/{type}`) must show:
```
1. Rich editorial content (from JSON)
2. LocalTake, TopTips, FeaturedExpert, HonestTruth (from JSON)
3. Operator listings
4. Related best-of lists sidebar
5. Where to eat / where to stay
6. Practical info (weather, gear, safety, transport)
7. FAQs
8. Cross-links: same activity other regions + same region other activities
```

### Destinations page (`/destinations`) must show:
```
1. Region comparison content (not just a grid of cards)
2. "Best region for..." quick picks
3. Interactive comparison table
4. Seasonal recommendations by region
5. Map
```

### Homepage must show:
```
1. Popular Guides section (top best-of lists)
2. Featured regions
3. Activity type navigation
4. Trip planner CTA (the product)
```

---

## 11. Phase 9: Review, QA & Launch

**Time:** 2-3 days | **Who:** MK + AI

### Content review checklist:
- [ ] Region descriptions — accurate? Engaging? Not generic?
- [ ] Activity details — prices current? Links work?
- [ ] Operator info — up to date? Nobody major missing?
- [ ] Combo page content — passes the 5 quality tests?
- [ ] Best-of lists — rankings defensible? Honest?
- [ ] Expert profiles — realistic? Clearly marked as placeholder if AI?
- [ ] Images — real photos? Properly credited? Right location?

### Technical QA:
- [ ] Build passes clean (no TypeScript errors)
- [ ] All pages load (no 500s)
- [ ] No broken internal links
- [ ] Images display correctly (not broken, correct aspect ratio)
- [ ] SEO metadata present on every page
- [ ] Schema markup on FAQ sections
- [ ] Mobile responsive (test at 375px, 768px, 1024px)
- [ ] Sitemap includes all pillar, combo, and best-of pages
- [ ] robots.txt correct

### Data completeness:
- [ ] Every region has: description, lat/lng, hero image, transport data
- [ ] Every combo page has: editorial, spots, FAQs, practical info
- [ ] Every best-of list has: 8-10 entries with full details
- [ ] Every operator has: name, location, at least one activity, contact info

### Go live:
1. Flip all content status to 'published'
2. Submit sitemap to Google Search Console
3. Submit to Bing Webmaster Tools
4. Monitor error logs for first 48 hours
5. Check analytics — are pages being crawled?

---

## 12. Phase 10: Ongoing Maintenance

### Weekly:
- Check for broken external links (operator websites change)
- Monitor Google Search Console for crawl errors

### Monthly:
- Contact local experts for updates
- Update seasonal content (what's in season now)
- Add new operators discovered
- Publish 2-4 journal articles
- Check competitor sites for new content ideas

### Quarterly:
- Full price audit (are operator prices still current?)
- Content gap analysis (what are people searching for that we don't cover?)
- Add new best-of lists based on search demand
- Update "Updated [Month] [Year]" on all best-of lists
- Review and refresh editorial content on top-performing pages

### Annually:
- Full site content review
- Update year in all best-of list titles ("Best Hikes 2027")
- Strategic review — new regions? New activity types?
- Expert program review — who's active? Who needs replacing?

---

## 13. Skills Reference

### Available Clawdbot skills:

| Skill | Purpose | When to use |
|-------|---------|------------|
| `aw-deep-research` | Region research, transport, local knowledge, content gaps | Phase 3, 5 |
| `aw-content-writer` | Editorial content, descriptions, guides, articles | Phase 5 |
| `aw-image-sourcer` | Find and download licensed images | Phase 6 |
| `adventure-research` | Operator discovery, pricing, contact details | Phase 4 |
| `nano-banana-pro` | AI image generation | **Last resort only** |

### Sub-agent pattern:
Each combo page should be built by a dedicated sub-agent session:
```
sessions_spawn:
  task: "Research and write the combo page for {activity} in {region}..."
  label: "{region}-{activity}"
  model: sonnet
  runTimeoutSeconds: 1800
```

This ensures each page gets focused research time and doesn't rush through.

### Key tools for research:
- `web_search` — Brave search for discovery
- `web_fetch` — Extract content from specific URLs
- Unsplash API — Image sourcing (key in `.env`)
- postcodes.io — UK geocoding (free, no key needed)

---

## 14. Quality Standards

### Content voice:
- **Authentic, not corporate.** Write like a knowledgeable friend, not a tourism board.
- **Opinionated.** Say what's good, what to skip, what to watch out for.
- **Specific.** Trail names, parking costs, café recommendations. Not "enjoy stunning scenery."
- **Honest.** "The parking is a nightmare on weekends" > "convenient facilities available."
- **UK English.** Colour, favourite, centre, metres.

### Fact verification:
- Every bus route, train station, and trail must be verified against a real source
- Prices must come from operator websites, not guessed
- If a fact can't be verified, mark it: `[NEEDS VERIFICATION]`
- Re-verify all facts quarterly

### SEO standards:
- Every page has unique `<title>` and `<meta description>`
- H1 contains primary keyword naturally
- Content structured with H2/H3 hierarchy
- Images have descriptive alt text (not "image-1.jpg")
- Internal links use descriptive anchor text (not "click here")
- FAQ sections use schema markup
- Canonical URLs set correctly

### Image standards:
- Real photos only (no AI generation)
- Properly licensed with credits stored in data
- Location-appropriate (reject images obviously from wrong country)
- Optimised for web (compressed, correct dimensions)
- WebP format where possible

---

## 15. Content Volume Targets

### Per new site (at launch):

| Content Type | Target | Priority |
|-------------|--------|----------|
| Regions | 8-15 | P1 |
| Activity types | 15-25 | P1 |
| Operators | 50-150 | P1 |
| Activities | 100-300 | P1 |
| Combo pages (enriched) | 30-50 | P1 |
| Best-of lists | 20-40 | P1 |
| Activity pillar pages | 8-12 | P2 |
| Itineraries | 30-50 | P2 |
| FAQ/Answer pages | 50-100 | P2 |
| Guide pages | 20-30 | P3 |
| Journal articles | 20-40 | P3 |
| Local experts recruited | 10-20 | P2 |
| **Total pages** | **~400-900** | |

### Per month (ongoing):
- 2-4 new journal articles
- 1-2 new best-of lists
- 5-10 new operator listings
- Expert check-ins completed
- Seasonal content updates

---

## 16. Cost Estimates

### Per new site:

| Item | Cost |
|------|------|
| Domain registration | £10/year |
| Hosting (Vercel) | £0 (shared deployment) |
| Database (Neon) | £0 (shared DB, siteId scoping) |
| AI content generation (API calls) | £20-50 |
| Image sourcing | £0 (free licensed sources) |
| MK review time | 2-3 days |
| **Total monetary cost** | **~£30-60** |

### Ongoing per site:
| Item | Cost/month |
|------|-----------|
| Domain | ~£1 |
| AI for monthly content | £5-10 |
| Expert outreach time | 2-3 hours |
| Content updates | 1-2 hours |

---

## Appendix: File Locations

| What | Where |
|------|-------|
| Database schema | `src/db/schema.ts` |
| Query functions | `src/lib/queries.ts` |
| Combo page data | `data/combo-pages/{region}--{activity}.json` |
| Best-of list data | `data/best-lists/{region}--best-{slug}.json` |
| Combo data TypeScript types | `src/lib/combo-data.ts` |
| Combo page renderer | `src/app/[region]/things-to-do/[activity-type]/page.tsx` |
| Combo enrichment component | `src/components/combo/ComboEnrichment.tsx` |
| Rich content components | `src/components/content/*.tsx` |
| Region page | `src/app/[region]/page.tsx` |
| Destinations page | `src/app/destinations/page.tsx` |
| Images | `public/images/` |
| Site briefs | `docs/sites/{slug}/SITE-BRIEF.md` |
| Research data | `docs/sites/{slug}/research/` |
| Multi-site infrastructure | `docs/MULTISITE-PLAYBOOK.md` |
| Pillar content plan | `docs/PILLAR-CONTENT-PLAN.md` |
| Strategy | `STRATEGY.md` |

---

*Built from Adventure Wales. Designed to scale to Adventure Scotland, Adventure Lake District, Adventure West Country, and beyond.*

*Last updated: February 2026*
