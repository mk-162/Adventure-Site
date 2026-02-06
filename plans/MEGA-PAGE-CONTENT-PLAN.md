# Mega Landing Page Content Plan

**Purpose:** Define exactly what content each mega page needs and track completion status.

---

## Current Mega Pages

| Activity | Data File | Page Route | Status |
|----------|-----------|------------|--------|
| Mountain Biking | ✅ 473 lines | `/mountain-biking` | Live |
| Coasteering | ✅ 387 lines | `/coasteering` | Live |
| Hiking | ✅ 595 lines | `/hiking` | Live |
| Surfing | ✅ 632 lines | `/surfing` | Live |
| Caving | ✅ 685 lines | `/caving` | Live |

## Planned Mega Pages (Priority Order)

| Activity | Why Wales Wins | Est. Search Vol | Priority |
|----------|---------------|-----------------|----------|
| Zip Lining | World's fastest (Velocity 2), multiple world-class venues | 30k+ | 🔴 P1 |
| Climbing | Legendary crags, sea cliffs, sport & trad, bouldering | 15k+ | 🔴 P1 |
| Kayaking/Sea Kayaking | Pembrokeshire = world-class sea kayaking | 12k+ | 🟠 P2 |
| Wild Swimming | Lakes, waterfalls, coast — trending activity | 10k+ | 🟠 P2 |
| Gorge Walking | Welsh specialty, multiple operators | 8k+ | 🟡 P3 |
| SUP/Paddleboarding | Growing sport, scenic locations | 8k+ | 🟡 P3 |
| Canyoning | Niche but Wales has great spots | 5k+ | 🟢 P4 |

---

## Content Requirements Per Mega Page

Every mega page must include these sections:

### 1. Hero & Meta (Required)
```typescript
{
  title: "Activity in Wales",
  strapline: "Compelling one-liner",
  metaTitle: "SEO title | Adventure Wales",
  metaDescription: "150 chars for snippets",
  stats: { /* 4-5 key numbers */ }
}
```

### 2. Introduction (Required)
- **Length:** 3-4 paragraphs, 400-600 words
- **Tone:** Authoritative, passionate, honest
- **Must include:**
  - Why Wales specifically (not just generic)
  - Honest assessment (difficulty, weather, challenges)
  - History/context where relevant
  - Hook that makes people want to do it

### 3. League Table / Venue Directory (Required)
The main structured data section. Format varies by activity:

| Activity | Table Type | Fields Required |
|----------|------------|-----------------|
| Mountain Biking | Trail Centres | name, grades, trailCount, hasUplift, hasCafe, hasBikeHire, priceFrom, insiderTip |
| Coasteering | Spots/Locations | name, difficulty, features, operators, insiderTip |
| Hiking | Trails | name, distance, elevation, duration, difficulty, highlights |
| Surfing | Surf Spots | name, waveType, difficulty, bestSwell, bestWind, bestTide |
| Caving | Caves/Systems | name, type, difficulty, features, tourOptions |
| Zip Lining | Venues | name, speeds, heights, features, priceFrom |
| Climbing | Crags | name, type (sport/trad/boulder), grades, aspect, approach |

**Minimum entries:** 8-15 venues/locations per page

### 4. Grading/Difficulty Guide (Required for technical activities)
- Explain the grading system used
- What each level means in practice
- Who each level suits
- Progression advice

### 5. Seasonal Guide (Required)
```typescript
seasonGuide: {
  bestMonths: ["May", "June", "September"],
  peakSeason: "July-August",
  offSeason: "November-February",
  monthByMonth: [
    { month: "January", conditions: "...", crowdLevel: "empty", rating: 2 },
    // ...all 12 months
  ]
}
```

### 6. Regional Breakdown (Required)
- Which Welsh regions are best for this activity
- Unique characteristics of each region
- Links to region + activity combo pages

### 7. FAQs (Required)
**Minimum:** 10 questions
**Source from:**
- Google "People Also Ask"
- Reddit/forum discussions
- TripAdvisor Q&As
- Operator FAQ pages

**Standard questions to always include:**
1. Do I need experience?
2. What should I wear/bring?
3. Is it safe?
4. How much does it cost?
5. Best time of year?
6. Can beginners do it?
7. How do I book?
8. What if weather is bad?
9. Age/fitness requirements?
10. Best location for X?

### 8. Operators Section (Pulled from DB)
- Premium operators featured
- Filter by region
- Link to operator profiles

### 9. Related Content (Auto-generated)
- Related itineraries
- Related blog posts
- Related events
- Nearby accommodation

### 10. Social Proof (Future)
- Curated reviews/quotes
- Video embeds
- Instagram/social mentions

---

## Detailed Content Requirements by Activity

### 🚴 Mountain Biking (COMPLETE)
**Status:** ✅ Live and comprehensive

**Current content:**
- [x] 10 trail centres with full data
- [x] Grading guide (green → pro)
- [x] Season guide
- [x] Introduction
- [x] Stats

**Gaps to fill:**
- [ ] Add 2-3 more trail centres (Gwydir, Revolution Bike Park)
- [ ] Bike hire providers section
- [ ] Bike transport/logistics tips
- [ ] More FAQs

---

### 🌊 Coasteering (COMPLETE)
**Status:** ✅ Live and comprehensive

**Current content:**
- [x] 8+ spots with operators
- [x] Regional breakdown
- [x] Safety info
- [x] Introduction (birthplace story)

**Gaps to fill:**
- [ ] What to expect section (blow-by-blow of a session)
- [ ] Kit list
- [ ] Tide/conditions guide
- [ ] More Anglesey spots

---

### 🥾 Hiking (COMPLETE)
**Status:** ✅ Live and comprehensive

**Current content:**
- [x] 15+ featured trails
- [x] Mountain summits
- [x] Long-distance paths
- [x] Snowdon routes breakdown

**Gaps to fill:**
- [ ] Add more Brecon Beacons routes
- [ ] Add Pembrokeshire Coast Path sections
- [ ] Guided walk operators
- [ ] Wild camping info

---

### 🏄 Surfing (COMPLETE)
**Status:** ✅ Live and comprehensive

**Current content:**
- [x] 10+ surf spots
- [x] Wave/swell guide
- [x] Surf schools
- [x] Seasonal guide

**Gaps to fill:**
- [ ] Wetsuit guide (thickness by season)
- [ ] Surf forecast resources
- [ ] Board hire locations
- [ ] More Llŷn Peninsula spots

---

### 🦇 Caving (COMPLETE)
**Status:** ✅ Live and comprehensive

**Current content:**
- [x] Show caves vs wild caves
- [x] Difficulty guide
- [x] Tour operators
- [x] Dan yr Ogof, Big Pit, etc.

**Gaps to fill:**
- [ ] Permit/access info for wild caves
- [ ] Caving clubs
- [ ] Kit requirements
- [ ] Mine exploration section

---

## New Mega Pages to Build

### ⚡ Zip Lining (PRIORITY 1)

**Why Wales wins:** World's fastest zip line (Velocity 2), world's first 4-person zip (Titan), underground zip lines. Zip World = global leader.

**Venues to include:**
| Venue | Location | Key Feature | Price From |
|-------|----------|-------------|------------|
| Zip World Velocity 2 | Penrhyn Quarry | World's fastest (125mph) | £89 |
| Zip World Titan | Llechwedd | 4-person, longest in Europe | £75 |
| Zip World Fforest | Betws-y-Coed | Family-friendly, tree-top | £30 |
| Zip World Caverns | Blaenau | Underground, Bounce Below | £35 |
| Go Below | Conwy | Underground adventure | £95 |
| Other smaller venues | Various | | |

**Content sections needed:**
- [ ] Introduction (why Wales = zip line capital)
- [ ] Venue comparison table
- [ ] Age/weight restrictions guide
- [ ] What to expect (first-timer guide)
- [ ] Combo experiences (zip + cave)
- [ ] Booking tips (advance booking essential)
- [ ] Weather policy
- [ ] 10+ FAQs

**Data file:** `src/data/activity-hubs/zip-lining.ts`
**Page route:** `/zip-lining`

---

### 🧗 Climbing (PRIORITY 1)

**Why Wales wins:** Legendary crags (Tremadog, Gogarth, Llanberis Pass), sea cliff climbing, sport climbing development, bouldering, indoor walls.

**Crags to include:**
| Crag | Region | Type | Famous For |
|------|--------|------|------------|
| Tremadog | Snowdonia | Trad/Sport | Vector, Cream, Eric Jones |
| Gogarth | Anglesey | Sea cliff | Big multi-pitch trad |
| Llanberis Pass | Snowdonia | Trad | Classic mountain routes |
| Pen Trwyn | Conwy | Sport | Limestone sport climbing |
| Pembrokeshire sea cliffs | Pembrokeshire | Trad/DWS | Sea cliff adventure |
| Clogwyn Du'r Arddu | Snowdonia | Trad | Elite mountain crag |
| The Llech | Snowdonia | Bouldering | World-class bouldering |

**Content sections needed:**
- [ ] Introduction (Welsh climbing history, ethics)
- [ ] Crag directory with grades, aspect, approach
- [ ] Climbing types explained (trad/sport/boulder/DWS)
- [ ] Grade comparison table
- [ ] Indoor walls section
- [ ] Guided climbing operators
- [ ] Gear shops
- [ ] Access/conservation notes
- [ ] Weather & conditions
- [ ] 10+ FAQs

**Data file:** `src/data/activity-hubs/climbing.ts`
**Page route:** `/climbing`

---

### 🛶 Kayaking & Sea Kayaking (PRIORITY 2)

**Why Wales wins:** Pembrokeshire = world-class sea kayaking, wildlife, caves. River kayaking in Snowdonia, Wye Valley.

**Locations to include:**
| Location | Type | Features |
|----------|------|----------|
| Pembrokeshire Coast | Sea kayaking | Caves, wildlife, cliffs |
| Anglesey | Sea kayaking | Tidal races, seals |
| Wye Valley | River | Scenic paddle, gentle |
| Snowdonia rivers | White water | Rapids, gorges |
| Gower | Sea kayaking | Caves, bays |
| Bala Lake | Lake | Gentle, scenic |

**Content sections needed:**
- [ ] Introduction (sea vs river vs lake)
- [ ] Location directory
- [ ] Skill levels explained
- [ ] Kit guide
- [ ] Guided tour operators
- [ ] Kayak hire locations
- [ ] Tides & conditions guide
- [ ] Wildlife encounters
- [ ] 10+ FAQs

**Data file:** `src/data/activity-hubs/kayaking.ts`
**Page route:** `/kayaking`

---

### 🏊 Wild Swimming (PRIORITY 2)

**Why Wales wins:** Waterfalls, mountain lakes (llyns), coast, rivers. Growing trend. Natural, accessible.

**Swim spots to include:**
| Spot | Region | Type | Features |
|------|--------|------|----------|
| Blue Lagoon, Abereiddy | Pembrokeshire | Quarry | Iconic, cold, clear |
| Fairy Glen | Snowdonia | River pool | Waterfalls, gorge |
| Llyn Idwal | Snowdonia | Mountain lake | Dramatic, cold |
| Llyn Padarn | Snowdonia | Lake | Accessible, scenic |
| Pontcysyllte | Mid Wales | Aqueduct | Unique, canal |
| Gower beaches | Gower | Sea | Blue Flag, accessible |

**Content sections needed:**
- [ ] Introduction (wild swimming movement)
- [ ] Swim spot directory (categorised by type)
- [ ] Safety guide (essential)
- [ ] Water temperature guide by season
- [ ] Kit guide (wetsuits, tow floats, etc.)
- [ ] Guided swims/events
- [ ] Water quality info
- [ ] Cold water acclimatisation
- [ ] 10+ FAQs

**Data file:** `src/data/activity-hubs/wild-swimming.ts`
**Page route:** `/wild-swimming`

---

### 🏞️ Gorge Walking (PRIORITY 3)

**Why Wales wins:** Welsh specialty, accessible adventure, multiple operators.

**Gorges to include:**
| Gorge | Region | Difficulty | Features |
|-------|--------|------------|----------|
| Brecon Beacons gorges | Brecon | All levels | Classic, waterfalls |
| Snowdonia gorges | Snowdonia | Intermediate+ | Mountain scenery |
| Conwy Falls | Snowdonia | All levels | Accessible |

**Content sections needed:**
- [ ] What is gorge walking (vs canyoning)
- [ ] Gorge directory
- [ ] Difficulty guide
- [ ] What to expect
- [ ] Operators
- [ ] Kit provided vs bring
- [ ] Best conditions
- [ ] 10+ FAQs

**Data file:** `src/data/activity-hubs/gorge-walking.ts`
**Page route:** `/gorge-walking`

---

### 🏄‍♂️ SUP / Paddleboarding (PRIORITY 3)

**Why Wales wins:** Stunning locations, accessible, growing sport.

**Locations to include:**
| Location | Type | Features |
|----------|------|----------|
| Gower beaches | Sea | Flat water, scenic |
| Pembrokeshire coast | Sea | Wildlife, caves |
| Bala Lake | Lake | Flat, easy |
| River Wye | River | Scenic, gentle |
| Snowdonia lakes | Lake | Mountain views |

**Content sections needed:**
- [ ] Introduction (SUP growth)
- [ ] Location directory
- [ ] Sea vs lake vs river
- [ ] Conditions guide
- [ ] SUP hire locations
- [ ] Lessons/tours
- [ ] Kit guide
- [ ] 10+ FAQs

**Data file:** `src/data/activity-hubs/paddleboarding.ts`
**Page route:** `/paddleboarding` or `/sup`

---

## Content Sourcing Checklist

For each new mega page, gather:

### Official Sources
- [ ] Visit Wales media library (images)
- [ ] Natural Resources Wales info
- [ ] National Park authority content
- [ ] Local council tourism info

### SEO Research
- [ ] Google autocomplete terms
- [ ] People Also Ask questions
- [ ] Related searches
- [ ] Competitor page analysis
- [ ] Search volume data

### User-Generated Content
- [ ] TripAdvisor reviews (quotes)
- [ ] Google reviews (quotes)
- [ ] Reddit discussions
- [ ] YouTube videos to embed
- [ ] Instagram content (with permission)

### Practical Data
- [ ] Operator websites (prices, times)
- [ ] Google Maps (coordinates, parking)
- [ ] Weather patterns (Met Office)
- [ ] Access info (NRW, NT)

---

## Build Order

1. **Week 1-2:** Zip Lining mega page (high volume, unique to Wales)
2. **Week 2-3:** Climbing mega page (established community, lots of data)
3. **Week 4-5:** Kayaking mega page
4. **Week 5-6:** Wild Swimming mega page
5. **Week 7+:** Gorge Walking, SUP as time allows

---

## Quality Checklist

Before publishing any mega page:

- [ ] Introduction is compelling and Wales-specific
- [ ] At least 8 venues/locations in directory
- [ ] All locations have lat/lng coordinates
- [ ] Insider tips for each location
- [ ] Grading/difficulty explained
- [ ] Seasonal guide complete (all 12 months)
- [ ] At least 10 FAQs answered
- [ ] Links to related operators (from DB)
- [ ] Links to related itineraries
- [ ] Meta title optimised for target keyphrase
- [ ] Meta description under 160 chars
- [ ] Schema markup (FAQPage, TouristDestination)
- [ ] Mobile responsive
- [ ] Images have alt text
- [ ] No broken links
