# Scope Expansion Plan: Stag/Hen Parties, Sightseeing & Attractions

**Date:** 2026-02-05
**Status:** Plan — awaiting MK approval

---

## Why This Matters

### Stag/Hen = Huge Money, Huge Search Volume
- **Cardiff is a UK top-5 stag/hen destination** (alongside London, Bournemouth, Newcastle, Edinburgh)
- **75% of UK hen parties stay domestic** (Funktion Events data from 55,000+ bookings)
- Average stag/hen spend: **£200-350pp** for a weekend (accommodation + activities + nightlife)
- Groups of 8-20 people = **£2,000-7,000 per booking**
- The market is year-round but peaks March-September
- **Wales has a unique angle**: adventure stag/hen (gorge walking, coasteering, canyoning) vs generic city nightlife

### The Competitive Landscape
These operators already dominate Welsh stag/hen search:
| Operator | Location | What They Offer | Price From |
|----------|----------|----------------|------------|
| **Adventures Wales** | Porthcawl (nr Cardiff) | Full weekend packages + bus to Cardiff/Swansea nightlife | £235pp |
| **Blue Ocean Activities** | South Wales | Canyoning, gorge walking, coasteering, wild camping | £50pp/activity |
| **Quest Adventures** | Cardiff/South Wales | Coasteering, gorge walking, canyoning | £45pp/activity |
| **CIWW** | Cardiff Bay | White water rafting, gorge walking, kayaking | £40pp/activity |
| **Seren Ventures** | Snowdonia | Multi-activity days (gorge + abseil) | £70pp |
| **Gradient Adventure** | Snowdonia | Canyoning, coasteering, white water kayaking | £55pp |
| **Bearded Men Adventures** | Llangollen, North Wales | Custom all-inclusive packages | Custom |
| **Shaggy Sheep Wales** | Pembrokeshire/Brecon | Multi-activity weekends, glamping | £180pp |
| **Zip World** | Multiple North Wales | Zip lines, obstacle courses, group packages | £30pp |
| **Adventure Britain** | Various | Canyoning, caving, quad biking, paintball, clay shooting | £45pp |
| **Proactive Adventure** | Pembrokeshire | Blue Lake Buzz Day, coasteering, gorge walking | £50pp |
| **The Real Adventure Co** | Pembrokeshire | Custom group adventure days | £45pp |
| **Adventure Connections** | Wales-wide | Group accommodation + activities specialist (since 2000) | Package |
| **South Wales Adventure Co** | South Wales | Gorge walking, canyoning, coasteering | £45pp |
| **North Wales Active** | Betws-y-Coed | Gorge walking, coasteering, canyoning | £50pp |

**Key insight:** Most of these operators already exist in our DB or should be added. We're not creating a new vertical — we're **surfacing existing operators through a stag/hen lens**.

### Sightseeing & Attractions = The Missing Layer
- Wales has **600+ castles** (400 still standing), 3 National Parks, 90+ museums
- "Things to do in Wales" and "Wales attractions" are massive search terms
- Currently we only show adventure activities — no castles, gardens, heritage railways, museums
- This is the content layer that turns AW from "adventure booking site" to **"Wales trip planning hub"**

---

## Implementation Plan

### Phase 1: Stag & Hen Parties (THE BIG ONE)

#### 1a. New Activity Type: "Stag & Hen Parties"

Add to `activity_types`:
```
{ name: "Stag & Hen Parties", slug: "stag-hen", icon: "party-popper" }
```

But this isn't like other activity types. Stag/hen isn't *an activity* — it's **an audience filter across all activities**. The real value is:
- A dedicated hub page at `/activities/stag-hen`
- Combo pages per region: `/south-wales/things-to-do/stag-hen`
- Operators tagged as "stag/hen friendly" with group pricing

#### 1b. Content Architecture

**Hub Page: `/stag-hen` (or `/activities/stag-hen`)**

This should be a **pillar page** — not a thin category listing. Structure:

1. **Hero**: "Plan the Ultimate Stag or Hen Weekend in Wales"
   - Sub: "Adventure packages, city nightlife, and everything in between"
   - Dual CTAs: "Plan a Stag Do" / "Plan a Hen Party"

2. **Why Wales?** (SEO-rich intro)
   - Cardiff top-5 UK stag/hen destination
   - Adventure activities you can't get in most cities
   - Affordable vs London/Edinburgh
   - Mountains → City nightlife in 30 minutes

3. **Popular Activities for Stag/Hen Groups**
   Cross-link to existing activity types, but framed for groups:
   - 🏔️ **Gorge Walking** — "The classic. Get everyone muddy and screaming."
   - 🌊 **Coasteering** — "Sea cliffs, jumps, and caves. Not for the faint-hearted."
   - 🏞️ **Canyoning** — "Waterfalls, plunge pools, and zero phone signal. Perfect."
   - 🎯 **Paintball** — "Settle old scores before the wedding."
   - 🏎️ **Quad Biking** — "Mud, speed, and bragging rights."
   - 🧗 **Climbing** — "Trust falls, but 100ft up."
   - 🏄 **Surfing** — "Gower waves, group wipeouts, legendary stories."
   - 🤿 **Wild Swimming** — "For the brave. Ice plunge optional."
   - 🚂 **Zip Lining** — "Europe's fastest. Enough said."

4. **By Region** (cards linking to combo pages)
   - **Cardiff & South Wales** — "City + adventure. Best of both worlds."
   - **Brecon Beacons** — "Lodges, hot tubs, and mountain activities"
   - **Pembrokeshire** — "Coastal adventures, camping, and surf"
   - **Snowdonia** — "Go big. Mountains, zip lines, gorges"
   - **Gower** — "Beach parties, surfing, coasteering"

5. **Weekend Package Builder** (future interactive feature)
   - Day 1: Arrive + evening activity
   - Day 2: Main adventure day
   - Day 3: Brunch + chill activity
   - Auto-links to operators and accommodation

6. **Where to Stay**
   - City centre hotels (Cardiff, Swansea) — for nightlife
   - Group lodges (Brecon Beacons) — for hot tub vibes
   - Glamping (Pembrokeshire) — for boho hens
   - Bunkhouses (Snowdonia) — for budget stags

7. **Nightlife Guide**
   - Cardiff: Mill Lane → St Mary Street → Castle Quarter
   - Swansea: Wind Street
   - Tips: Pre-booking, group menus, afternoon tea (hens)

8. **Planning Tips**
   - Average costs breakdown
   - Best time to book (spring-summer)
   - Transport (minibus hire, trains, designated drivers)
   - Group size sweet spots (10-16 ideal)
   - Weather backup plans (this is Wales)

9. **Operators** (filterable by region, activity, price)
   - Featured/Premium operators first
   - "Get a Group Quote" CTA on each

10. **FAQs** (Schema markup)
    - "How much does a stag/hen weekend in Wales cost?"
    - "What's the best time of year for a stag do in Wales?"
    - "Can you do stag/hen activities in winter?"
    - "What's the minimum group size?"
    - "Is Cardiff or Snowdonia better for a hen weekend?"

#### 1c. Combo Pages (Region × Stag/Hen)

Create enriched combo pages for high-demand combinations:

| Priority | Page | Target Keywords |
|----------|------|----------------|
| 🔴 P1 | `/south-wales/things-to-do/stag-hen` | "Cardiff stag do", "stag weekend south wales" |
| 🔴 P1 | `/brecon-beacons/things-to-do/stag-hen` | "Brecon Beacons stag weekend", "adventure stag do Wales" |
| 🟡 P2 | `/pembrokeshire/things-to-do/stag-hen` | "Pembrokeshire hen party", "coastal hen weekend" |
| 🟡 P2 | `/snowdonia/things-to-do/stag-hen` | "Snowdonia stag do", "North Wales stag weekend" |
| 🟡 P2 | `/gower/things-to-do/stag-hen` | "Gower hen weekend", "beach hen party Wales" |

Each combo page gets:
- Region-specific operator listings (tagged for stag/hen)
- "Sample Weekend" itinerary
- Accommodation recommendations
- Nightlife/dining for that region
- Transport from major cities

#### 1d. Operator Tagging

Add to operator schema or use existing `activity_types` array:
```
stag_hen_friendly: boolean
group_min_size: number
group_max_size: number  
group_price_from: number (pence)
stag_hen_packages: boolean
```

Tag these existing operators (already in DB or should be added):
- Adventures Wales ✓
- Blue Ocean Activities ✓
- Quest Adventures ✓
- CIWW ✓
- Seren Ventures
- Gradient Adventure
- Bearded Men Adventures
- Shaggy Sheep Wales
- Zip World ✓
- Adventure Britain
- Proactive Adventure
- The Real Adventure Co
- Adventure Connections
- South Wales Adventure Co
- North Wales Active

#### 1e. Journal Content

Create 5-6 articles for SEO + internal linking:
1. "The Ultimate Guide to a Stag Weekend in Wales (2026)"
2. "The Ultimate Guide to a Hen Weekend in Wales (2026)"
3. "10 Adventure Activities for Your Stag/Hen Do in Wales"
4. "Cardiff vs Snowdonia: Where Should You Plan Your Stag/Hen?"
5. "How to Plan an Adventure Hen Weekend on a Budget"
6. "The Best Group Accommodation in Wales for Stag & Hen Parties"

#### 1f. FAQ/Answer Pages

Create 8-10 answer pages:
- "How much does a stag weekend in Wales cost?"
- "Best adventure activities for hen parties in Wales"
- "Can you do outdoor activities in Wales in winter?"
- "Group accommodation Wales stag hen"
- "Best nightlife in Cardiff for stag parties"
- "Adventure hen party ideas that aren't paintball"
- "Wales stag do packages all inclusive"
- "Best locations for a hen weekend in Wales"

---

### Phase 2: Sightseeing & Attractions

#### 2a. New Activity Types

```
{ name: "Sightseeing", slug: "sightseeing", icon: "camera" }
{ name: "Attractions", slug: "attractions", icon: "landmark" }
```

**Sightseeing** = self-guided/natural: viewpoints, walks, drives, beaches, waterfalls
**Attractions** = ticketed/structured: castles, museums, railways, theme parks, gardens

#### 2b. Attractions Sub-Categories

Wales attractions break down into:

| Category | Examples | Count |
|----------|----------|-------|
| **Castles & Heritage** | Cardiff Castle, Caernarfon, Conwy, Harlech, Pembroke | 400+ |
| **Heritage Railways** | Ffestiniog, Welsh Highland, Snowdon Mountain, Vale of Rheidol | 12+ |
| **Museums & Galleries** | St Fagans, National Museum Cardiff, Big Pit, Slate Museum | 90+ |
| **Gardens & Parks** | Bodnant Garden, Aberglasney, National Botanic Garden | 20+ |
| **Theme Parks & Family** | Folly Farm, Zip World, Oakwood, GreenWood | 15+ |
| **Wildlife Centres** | Skomer Island, RSPB South Stack, Welsh Mountain Zoo | 10+ |

#### 2c. Content Approach

**Don't try to list every castle.** That's Visit Wales's job.

Instead, create **curated "best of" content** that cross-links with adventures:

1. **"Castles Worth the Detour"** per region
   - 3-5 best castles, why they're special, what adventure is nearby
   - "Visit Conwy Castle in the morning, coasteer at Anglesey in the afternoon"

2. **"Rainy Day Alternatives"** (HUGE value)
   - For every outdoor activity region, list indoor/covered attractions
   - "If gorge walking gets rained off in Brecon Beacons, here's what to do instead"

3. **Itinerary Integration**
   - Add attractions as stops in existing itineraries
   - "Day 2 morning: Cardiff Castle → Afternoon: Coasteering at Porthcawl"
   - This is where your generic filler cards come in too

4. **"Complete Day Out" Cards**
   - Morning: Castle/museum (sightseeing)
   - Afternoon: Adventure activity
   - Evening: Restaurant/pub recommendation
   - These are shareable, bookmarkable content units

#### 2d. Data Seeding

Don't try to seed 400 castles. Seed the **top 20-30 attractions** that:
- Are near existing adventure operators
- Have strong cross-linking potential
- Are in regions we want to strengthen

Priority attractions to seed:
1. Cardiff Castle — South Wales
2. Caernarfon Castle — North Wales/Snowdonia
3. Conwy Castle — North Wales
4. Harlech Castle — Snowdonia
5. Pembroke Castle — Pembrokeshire
6. St Fagans Museum — South Wales
7. Big Pit National Coal Museum — South Wales
8. Ffestiniog Railway — Snowdonia
9. Snowdon Mountain Railway — Snowdonia
10. Welsh Highland Railway — Snowdonia
11. Bodnant Garden — North Wales
12. National Botanic Garden — Carmarthenshire
13. Zip World (Penrhyn Quarry) — Snowdonia
14. Folly Farm — Pembrokeshire
15. Oakwood Theme Park — Pembrokeshire
16. Skomer Island — Pembrokeshire
17. Portmeirion — Snowdonia
18. Dan yr Ogof Caves — Brecon Beacons
19. Aberglasney Gardens — Carmarthenshire
20. Dolaucothi Gold Mines — Carmarthenshire

---

### Phase 3: Generic Itinerary Cards

#### The Problem
Itineraries have gaps where there's no bookable activity. People need to eat, rest, explore.

#### The Solution
Create a set of **generic "downtime" activities** that can fill itinerary slots:

```
Generic cards (not tied to operators):
- "Rest & Relaxation" — "Take a breather. You've earned it."
- "Local Walk" — "Explore the area on foot. Ask locals for the best route."  
- "Shopping in Town" — "Browse local shops, pick up souvenirs."
- "Beach Time" — "Towel, book, maybe a swim if you're brave."
- "Pub Lunch" — "Find the nearest local. Wales has some crackers."
- "Scenic Drive" — "Wind the windows down, take the long way round."
- "Café Stop" — "Coffee, cake, and planning the next adventure."
- "Photography Walk" — "Wales is ridiculously photogenic. Make the most of it."
```

Implementation: Add a `is_generic` boolean to activities, or a separate `generic_activities` table. These appear in itineraries but don't link to operators.

---

## Content Generation Plan

### What AI Can Generate (Do It)
- Hub page copy (stag/hen, sightseeing, attractions)
- Combo page enrichment text
- FAQ/answer pages
- Journal article drafts (need human review)
- Attraction descriptions (based on web research)
- Generic itinerary card descriptions
- Nightlife/dining recommendations per region

### What Needs Human Input (MK)
- Which operators to feature as "premium" in stag/hen
- Pricing tiers for stag/hen operator listings (premium placement = ££)
- Whether to add a "Request Group Quote" form
- Photo selection for stag/hen hero images
- Whether attractions should be free listings or paid
- Final editorial tone review

### What Needs Real Research (Deep Research Skill)
- Current operator pricing (scrape/verify)
- Accommodation options per region with group capacity
- Transport routes and costs
- Nightlife venue status (places close/open frequently)

---

## Build Sequence

### Sprint 1 (Can Start Now) — Foundation
1. Add `stag-hen` activity type to seed data
2. Add `sightseeing` and `attractions` activity types
3. Create stag/hen hub page (`/activities/stag-hen` or `/stag-hen`)
4. Tag existing operators as stag/hen friendly
5. Add 10-15 stag/hen specific operators to DB
6. Create 8 generic itinerary cards
7. Write 10 FAQ/answer pages

### Sprint 2 — Content
8. Create 5 combo pages (South Wales, Brecon, Pembrokeshire, Snowdonia, Gower)
9. Write 6 journal articles
10. Seed top 20 attractions with descriptions
11. Create attraction combo pages for strongest regions
12. Cross-link stag/hen content into existing itineraries

### Sprint 3 — Commercial
13. "Request Group Quote" form (leads to operators)
14. Premium stag/hen operator placements
15. "Weekend Package Builder" interactive tool
16. Accommodation partnership links

---

## Commercial Angle

This is where stag/hen **really** pays:

1. **Operator listings** — Every stag/hen operator will want visibility. Premium placement = recurring revenue.
2. **Group quote leads** — "Tell us what you want, we'll connect you with operators." Each lead has 8-20 people × £200+ each. That's £1,600-4,000+ per lead.
3. **Accommodation affiliate** — Booking.com group accommodation, glamping sites, lodge parks.
4. **Cross-sell** — Stag/hen visitors discover other AW content (itineraries, activities) for future trips.

**Revenue potential:** Even 10 stag/hen leads per month at £50 per lead referral = £500/month. Premium operator listings on top. This section could be the highest-ROI content on the site.

---

## Summary

| Item | Type | Effort | Impact |
|------|------|--------|--------|
| Stag/Hen hub page | Content + Code | Medium | 🔴 Very High |
| Stag/Hen combo pages (5) | Content | Medium | 🔴 Very High |
| Stag/Hen FAQ pages (10) | Content | Low | 🟡 High |
| Stag/Hen journal articles (6) | Content | Medium | 🟡 High |
| Operator tagging | Data | Low | 🔴 Very High |
| Sightseeing activity type | Code | Low | 🟡 Medium |
| Attractions activity type | Code | Low | 🟡 Medium |
| Top 20 attractions seeded | Data | Medium | 🟡 Medium |
| Generic itinerary cards (8) | Code + Data | Low | 🟢 Medium |
| Group quote form | Code | Medium | 🔴 High (commercial) |

**Total estimated effort:** 2-3 focused sprint sessions
**Potential impact:** Highest-ROI content expansion on the site
