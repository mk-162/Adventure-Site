# Pillar Content Plan — Adventure Wales

## The Problem

The site has data (137 activities, 28 operators, 12 regions, 34 combo JSONs, 14 best-list JSONs) but the architecture skips straight to operator booking pages. There's no content layer that earns trust, ranks for high-volume keywords, or gives people a reason to stay.

A visitor searching "mountain biking south wales" should land on a comprehensive, opinionated, locally-informed guide — not a grid of operator cards with a generic paragraph.

## The Vision

Every high-intent search related to Welsh outdoor adventure should land on an Adventure Wales page that is **the best resource on the internet for that topic**. Not the longest. The most useful.

---

## Content Architecture: The Pyramid

```
                    WALES-WIDE PILLAR
                 /activities/surfing
              "The Complete Guide to Surfing in Wales"
                    (Tier 1 — NEW)
                        │
          ┌─────────────┼─────────────┐
          │             │             │
    REGION COMBO    REGION COMBO   REGION COMBO
  /pembrokeshire/   /gower/        /snowdonia/
  things-to-do/    things-to-do/   things-to-do/
    surfing          surfing         surfing
   (Tier 2 — EXISTS, NEEDS ENRICHMENT)
          │             │             │
    ┌─────┼─────┐       │       ┌─────┼─────┐
    │           │       │       │           │
  BEST-OF    BEST-OF  BEST-OF  BEST-OF   BEST-OF
  /pembrokeshire/ /gower/      /snowdonia/
  best-surf-spots best-surf-  best-surf-spots
   (Tier 3 — DATA EXISTS, NO ROUTE)          spots
          │             │             │
    OPERATOR PAGES  OPERATOR PAGES  OPERATOR PAGES
    /experiences/*  /experiences/*   /experiences/*
     (Tier 4 — EXISTS as /activities/[slug])
```

Every level links up, down, and across. That's the hub-and-spoke.

---

## Content Types

### Type 1: Wales-Wide Activity Pillar Pages (NEW — build these)
**URL:** `/activities/{type}` (e.g., `/activities/surfing`)
**Target:** "surfing in wales", "mountain biking wales", "coasteering wales"
**Word count:** 2,500-4,000+
**Purpose:** THE definitive guide. Links down to every combo page. Ranks for the broadest keywords.

**Content blocks:**
- Hero + strapline
- Editorial intro (500+ words — real knowledge, not fluff)
- 🗣️ **The Local Take** — expert quote with photo
- 💡 **Top Tips** — 5-8 specific tips in a pop-out callout
- 🏔️ **Best Regions For This** — ranked with reasons, links to combo pages
- 📊 **At a Glance** — season, difficulty range, cost range, age suitability
- 👤 **Featured Expert** — photo, bio, extended perspective on the activity in Wales
- ✅ **The Honest Truth** — what's great / what's not great about doing this in Wales
- 🗺️ **Interactive Map** — all spots across Wales
- 📋 **Gear Guide** — what you need, where to get it
- ❓ **FAQs** — 8-12 questions, schema markup
- 🔗 **Every Combo Page** — linked prominently
- 📝 **Related Articles** — journal posts about this activity

### Type 2: Region + Activity Combo Pages (EXISTS — enrich massively)
**URL:** `/{region}/things-to-do/{type}`
**Target:** "hiking in snowdonia", "coasteering pembrokeshire"
**Word count:** 2,000-3,500
**Purpose:** The definitive guide for this activity IN this region. Links up to pillar, down to operators, across to best-of lists.

**Content blocks (upgrade from current):**
- Everything current (spots, FAQs, practical info)
- PLUS: 🗣️ The Local Take
- PLUS: 💡 Top Tips
- PLUS: 👤 Featured Expert (local to this region)
- PLUS: ✅ The Honest Truth
- PLUS: 📰 Related best-of lists prominently linked
- PLUS: 🏠 Where to stay (specific to this activity — "stay in Llanberis for easy access to Snowdon paths")
- PLUS: 🍽️ Where to eat after (specific post-activity recommendations)

### Type 3: Best-Of List Pages (DATA EXISTS — build route + components)
**URL:** `/{region}/best-{slug}` (e.g., `/snowdonia/best-hikes`)
**Target:** "best hikes in snowdonia", "best beaches pembrokeshire"
**Word count:** 1,500-2,500
**Purpose:** Ranked, opinionated, shareable. The viral content that drives links and social shares.

**Content blocks (spec already in ACTIVITY-REGION-PAGES-BRIEF.md):**
- Ranked list with photos, verdicts, insider tips
- Comparison table
- Map with numbered pins
- "How We Picked These"
- Seasonal recommendations
- Links to combo page (hub)
- FAQs

### Type 4: Destination Pillar Pages (UPGRADE /destinations + region pages)
**URL:** `/destinations` and `/{region}`
**Purpose:** Trip planning landing pages. "Where should I go in Wales?"

**`/destinations` needs:**
- Region comparison content (not just a grid of cards)
- "Best region for..." quick picks (families, adrenaline, couples, budget)
- Interactive comparison table
- Featured regions with editorial summaries
- Seasonal recommendations by region
- Links to every region page

**`/{region}` pages need:**
- Activity type grid linking to EVERY combo page (not just "View all things to do")
- Featured best-of lists for this region
- "Top 5 experiences" with editorial picks, not random operator cards
- Related journal articles
- Trip planning CTA with region pre-selected

---

## Complete Best-Of List Inventory

### What Exists (14 lists — data only, no route)
✅ snowdonia--best-hikes
✅ snowdonia--best-walks
✅ snowdonia--best-scrambles
✅ snowdonia--best-mountain-bike-trails
✅ snowdonia--best-waterfalls
✅ snowdonia--best-zip-lines
✅ pembrokeshire--best-beaches
✅ pembrokeshire--best-coasteering
✅ pembrokeshire--best-surf-spots
✅ pembrokeshire--best-kayaking-spots
✅ gower--best-beaches
✅ gower--best-surf-spots
✅ anglesey--best-beaches
✅ brecon-beacons--best-walks

### Priority 1 — High-volume, high-intent (build next)
These target keywords with significant search volume and clear trip-planning intent:

| List | Target Keyword | Notes |
|------|---------------|-------|
| snowdonia/best-wild-swims | best wild swimming snowdonia | Trending activity |
| brecon-beacons/best-hikes | best hikes brecon beacons | #1 activity in the region |
| brecon-beacons/best-waterfalls | best waterfalls brecon beacons | Waterfall country = massive draw |
| pembrokeshire/best-walks | best walks pembrokeshire | Coast path sections |
| pembrokeshire/best-beaches | ✅ exists | |
| gower/best-walks | best walks gower | Popular search |
| gower/best-wild-swims | best wild swimming gower | |
| anglesey/best-walks | best walks anglesey | Coastal path |
| anglesey/best-kayaking | best kayaking anglesey | Sea kayaking hub |
| south-wales/best-mountain-bike-trails | best MTB trails south wales | BikePark Wales, Afan, Cwmcarn |
| south-wales/best-waterfalls | best waterfalls south wales | Waterfall country is in Brecon/S.Wales overlap |
| wye-valley/best-walks | best walks wye valley | Popular area |
| wales/best-beaches | best beaches in wales | Cross-region Wales-wide list |
| wales/best-hikes | best hikes in wales | Cross-region Wales-wide list |
| wales/best-adventures | best adventures in wales | Broad entry point |
| wales/best-mountain-bike-trails | best MTB wales | Cross-region |

### Priority 2 — Long-tail, high-value
| List | Target Keyword |
|------|---------------|
| snowdonia/best-easy-walks | easy walks snowdonia |
| snowdonia/best-family-walks | family walks snowdonia |
| snowdonia/best-dog-walks | dog friendly walks snowdonia |
| brecon-beacons/best-family-walks | family walks brecon beacons |
| pembrokeshire/best-family-beaches | family beaches pembrokeshire |
| pembrokeshire/best-hidden-beaches | hidden beaches pembrokeshire |
| gower/best-hidden-beaches | secret beaches gower |
| snowdonia/best-lakes | best lakes snowdonia |
| wales/best-castles | best castles in wales (T2 content) |
| wales/best-camping | best camping in wales |
| wales/best-glamping | best glamping in wales |
| wales/best-rainy-day-activities | things to do in wales when it rains |

### Priority 3 — Seasonal & niche
| List | Target Keyword |
|------|---------------|
| wales/best-winter-adventures | winter adventures wales |
| wales/best-autumn-walks | autumn walks wales |
| snowdonia/best-winter-hikes | winter hiking snowdonia |
| wales/best-stag-do-activities | stag do wales |
| wales/best-hen-do-activities | hen do wales |
| wales/best-things-for-couples | romantic adventures wales |
| wales/best-adrenaline-activities | adrenaline activities wales |
| wales/best-free-activities | free things to do in wales |

---

## How Content Weaves Into Hub Pages

### Region Page (`/{region}`)
**Current:** Shows 4 random operator cards under "Top Experiences"
**Should show:**

```
┌─────────────────────────────────────────┐
│ SNOWDONIA                               │
│                                         │
│ ┌─── EXPLORE BY ACTIVITY ────────────┐  │
│ │ [Hiking] [Climbing] [MTB] [Caving] │  │
│ │ [Wild Swimming] [Gorge Walking]    │  │
│ │ [Zip-lining] [Trail Running]       │  │
│ │ Each card → combo page             │  │
│ └────────────────────────────────────┘  │
│                                         │
│ ┌─── OUR TOP PICKS ─────────────────┐  │
│ │ 📋 10 Best Hikes in Snowdonia     │  │
│ │ 📋 Best Scrambles in Snowdonia    │  │
│ │ 📋 Best Waterfalls in Snowdonia   │  │
│ │ 📋 Best MTB Trails in Snowdonia   │  │
│ │ Each → best-of list page          │  │
│ └────────────────────────────────────┘  │
│                                         │
│ ┌─── FEATURED EXPERIENCES ──────────┐  │
│ │ [Curated operator cards — not     │  │
│ │  random, editorially chosen]      │  │
│ └────────────────────────────────────┘  │
│                                         │
│ ┌─── FROM THE JOURNAL ──────────────┐  │
│ │ [Related articles for this region]│  │
│ └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Combo Page (`/{region}/things-to-do/{type}`)
**Add sidebar or inline:**
```
┌─── RELATED LISTS ─────────────┐
│ 📋 10 Best Hikes in Snowdonia │
│ 📋 Best Easy Walks Snowdonia  │
│ 📋 Best Family Walks          │
│ → More lists                  │
└───────────────────────────────┘
```

### Activity Pillar Page (`/activities/{type}`)
**Section: "Best Of" Lists**
```
Every best-of list related to this activity, grouped by region:
- Snowdonia: Best Hikes, Best Scrambles, Best Easy Walks
- Pembrokeshire: Best Walks, Best Coastal Walks
- Brecon Beacons: Best Walks, Best Family Walks
```

### Homepage
**"Popular Guides" section:**
```
📋 10 Best Hikes in Snowdonia
📋 Best Beaches in Pembrokeshire
📋 Best Adventures in Wales
📋 Best MTB Trails in South Wales
```

---

## Rich Content Components Needed

### 1. `<LocalTake />` — The Local Voice
```
┌──────────────────────────────────────┐
│ 🗣️ THE LOCAL TAKE                   │
│                                      │
│ [Photo]  "Quote from a real local    │
│          expert — opinionated and    │
│          specific."                  │
│                                      │
│          — Name, Role, Business      │
└──────────────────────────────────────┘
```
- Photo (AI placeholder for now, replaced with real photos from interviews)
- Quote (AI-generated placeholder, replaced with real quotes)
- Name, role, business name
- Optional link to operator/directory page
- Visually distinct — tinted background, quote marks, stands out from body copy

### 2. `<TopTips />` — Specific, Useful Tips
```
┌──────────────────────────────────────┐
│ 💡 TOP TIPS                          │
│                                      │
│ 1. Specific actionable tip           │
│ 2. Another specific tip              │
│ 3. Insider knowledge tip             │
│ 4. Money-saving tip                  │
│ 5. Safety/practical tip              │
└──────────────────────────────────────┘
```
- 3-8 tips per instance
- Each tip is 1-2 sentences max
- Visually distinct callout box
- Can appear multiple times per page (different sections)

### 3. `<FeaturedExpert />` — Extended Expert Panel
```
┌──────────────────────────────────────┐
│ 👤 FEATURED EXPERT                   │
│                                      │
│ [Large Photo]                        │
│                                      │
│ Name                                 │
│ Role / Credentials                   │
│                                      │
│ 2-3 paragraphs of their perspective  │
│ on this activity/region. Not a       │
│ testimonial — genuine insight.       │
│                                      │
│ [Visit their profile →]              │
└──────────────────────────────────────┘
```
- Placeholder: AI-generated name, role, perspective
- Clear marker for "replace with real interview"
- Links to their operator/directory page if they have one

### 4. `<HonestTruth />` — Pros & Cons, Editorially
```
┌──────────────────────────────────────┐
│ ✅ THE HONEST TRUTH                  │
│                                      │
│ What's great:                        │
│ • Specific positive point            │
│ • Another positive                   │
│                                      │
│ What's not:                          │
│ • Honest negative / limitation       │
│ • Another honest point               │
└──────────────────────────────────────┘
```

### 5. `<ProTip />` — Inline Callout
```
┌──────────────────────────────────────┐
│ 💡 Pro tip: Single-line inline tip   │
│ that appears within body copy.       │
└──────────────────────────────────────┘
```

### 6. `<BestOfCard />` — For embedding lists in hub pages
```
┌──────────────────────────────────────┐
│ 📋 10 Best Hikes in Snowdonia       │
│ From Nantlle Ridge to Tryfan —      │
│ our honest picks, ranked.            │
│                                      │
│ [Read the full list →]               │
└──────────────────────────────────────┘
```

---

## Research + Writing Process

Each pillar/combo page needs a dedicated research session. The process:

### Phase 1: Deep Research (sub-agent)
For each page (e.g., "Mountain Biking in South Wales"):
1. **Web research** — MTB forums, Strava segments, trail centre websites, recent reviews
2. **Competitor analysis** — what do the top 3 Google results cover? What do they miss?
3. **Local knowledge** — specific trail names, conditions, recent changes
4. **Expert identification** — find real local experts, guides, shop owners
5. **Seasonal intelligence** — when trails are muddy, when they drain, closures
6. **Practical details** — parking costs, bike wash locations, café recommendations

### Phase 2: Content Writing (sub-agent)
Using research output:
1. Write editorial intro (500+ words of genuine expertise)
2. Create LocalTake quote (AI placeholder with "REPLACE" marker)
3. Write TopTips (5-8 specific, non-obvious tips)
4. Create FeaturedExpert panel (AI placeholder with "REPLACE" marker)
5. Write HonestTruth section
6. Expand spot descriptions (200+ words each)
7. Write FAQs (8-12, covering real questions people ask)
8. Write best-of list entries (if corresponding list needed)

### Phase 3: Integration
1. Update combo JSON with enriched content
2. Generate/update best-of list JSON
3. Components render automatically from data

---

## Build Sequence

### Sprint 1: Foundation (do first)
1. ☐ Build rich content components (LocalTake, TopTips, FeaturedExpert, HonestTruth, ProTip, BestOfCard)
2. ☐ Build best-of list page route (`/{region}/best-{slug}`)
3. ☐ Build Wales-wide best-of route (`/wales/best-{slug}` or `/best/{slug}`)
4. ☐ Extend combo data schema to support new content blocks
5. ☐ Update ComboEnrichment to render new components

### Sprint 2: Showcase Pages (prove the concept)
6. ☐ Research + write: "Mountain Biking in South Wales" (combo page)
7. ☐ Research + write: "Best MTB Trails in South Wales" (best-of list)
8. ☐ Research + write: "Mountain Biking in Wales" (activity pillar page)
9. ☐ Build activity pillar page route (`/activities/{type}`)
10. ☐ Wire up all internal links between the 3 showcase pages

### Sprint 3: Hub Integration
11. ☐ Add activity type grid to region pages → combo pages
12. ☐ Add best-of list cards to region pages
13. ☐ Enrich /destinations page
14. ☐ Add "Related Lists" sidebar to combo pages
15. ☐ Homepage "Popular Guides" section

### Sprint 4: Content at Scale
16. ☐ Create `aw-pillar-builder` skill for sub-agent content production
17. ☐ Priority 1 best-of lists (16 lists)
18. ☐ Enrich all 34 existing combo pages with new content blocks
19. ☐ Fill missing combo pages (at least the high-traffic ones)
20. ☐ Wales-wide pillar pages for top 8 activity types

### Sprint 5: Continuous
21. ☐ Replace AI placeholder LocalTakes with real interviews
22. ☐ Replace AI FeaturedExperts with real expert contributions
23. ☐ Add real photography
24. ☐ Seasonal content updates
25. ☐ New best-of lists based on search demand

---

## Success Metrics

- **Bookmark test:** Would someone planning a trip save this page?
- **Share test:** Would someone text this to a friend who asked "where should I go mountain biking?"
- **Return test:** Would someone come back to this page to plan their next trip?
- **SEO test:** Does this page rank in the top 3 for its primary keyword within 6 months?
- **Content test:** Does this page contain information you genuinely cannot find on the first Google result?

---

*If a page doesn't pass all 5 tests, it's not done.*
