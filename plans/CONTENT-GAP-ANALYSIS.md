# Content Gap Analysis — Adventure Wales

## Current State (February 2026)

| Entity | Count | Status |
|--------|------:|--------|
| Regions | 12 | All have pages, most lack rich content |
| Activities | 136 | Pages exist, 52 have no activityTypeId |
| Activity Types | 18 | In DB (36 with duplicates — needs cleanup) |
| Operators | 51 | Pages exist, most are stubs |
| Accommodation | 70 | Pages exist, seed data quality |
| Events | 46 | Pages exist, many outdated |
| Answers (FAQ) | 135 | Pages exist, varying quality |
| Journal Posts | 128 | Pages exist, some weak editorial |
| Itineraries | 54 | Pages exist, working well |
| Combo Pages | 10 | JSON data only (Tier 1 done) |
| Best-Of Lists | 0 | Not started |
| Guide Pages | 0 | DB table created, no content |
| Content Snippets | 0 | Not built yet |

---

## Gap Analysis by Area

### 1. Combo Pages (Activity × Region)

**What exists:** 10 Tier 1 combo page JSON files in `data/combo-pages/`

**What's missing:**

| Region | Has Combo Pages | Activities In DB | Missing Combos |
|--------|:-:|---|---|
| Snowdonia | 5 | hiking, mountain-biking, zip-lining, climbing, trail-running, toboggan, underground-trampolines, kayaking | gorge-walking (JSON exists but no DB match), caving, wild-swimming, running |
| Pembrokeshire | 3 | coasteering, surfing, sea-kayaking, wild-swimming | hiking (coastal path!), kayaking (JSON exists), wild-swimming |
| Brecon Beacons | 1 | mountain-biking, kayaking, canyoning, caving, climbing | hiking (MASSIVE gap — Pen y Fan!), caving, gorge-walking, wild-swimming |
| Gower | 1 | climbing, sup, surfing, coasteering | coasteering, hiking (Worm's Head), wild-swimming |
| Anglesey | 0 | surfing, sea-kayaking | kayaking, coasteering, hiking, wild-swimming |
| Llŷn Peninsula | 0 | coasteering, sup, sea-kayaking, surfing | surfing, kayaking, hiking |
| South Wales | 0 | mountain-biking, zip-lining | MTB (Afan, BikePark Wales — huge gap!) |
| Mid Wales | 0 | sup, kayaking, mountain-biking, trail-running, surfing | MTB (Nant yr Arian), kayaking |
| Wye Valley | 0 | — | kayaking (River Wye!), hiking |
| Carmarthenshire | 0 | — | hiking, cycling |
| North Wales | 0 | — | climbing, MTB, hiking |

**Priority gaps (high search volume, no page):**
1. 🔴 Brecon Beacons hiking — massive keyword, no combo page
2. 🔴 South Wales MTB — BikePark Wales, Afan, Cwmcarn
3. 🔴 Anglesey kayaking/coasteering
4. 🔴 Pembrokeshire hiking (coastal path)
5. 🟡 Gower coasteering
6. 🟡 Llŷn Peninsula surfing
7. 🟡 Wye Valley kayaking
8. 🟡 Snowdonia wild swimming / caving

### 2. Best-Of Lists

**What exists:** 0

**What's needed (high search volume):**

| List | Target Keyword | Est. Monthly Search |
|------|---------------|:---:|
| Best Hikes in Snowdonia | "best hikes snowdonia" | 5,000+ |
| Best Walks in Snowdonia | "best walks snowdonia" | 8,000+ |
| Best Beaches in Pembrokeshire | "best beaches pembrokeshire" | 6,000+ |
| Best Walks Brecon Beacons | "best walks brecon beacons" | 4,000+ |
| Best Beaches Gower | "best beaches gower" | 3,000+ |
| Best Beaches Anglesey | "best beaches anglesey" | 2,000+ |
| Best Scrambles Snowdonia | "best scrambles snowdonia" | 1,500+ |
| Best MTB Trails Snowdonia | "best mtb snowdonia" | 1,500+ |
| Best Surf Spots Pembrokeshire | "best surf pembrokeshire" | 2,000+ |
| Best Waterfalls Snowdonia | "best waterfalls snowdonia" | 2,000+ |
| Best Waterfalls Brecon Beacons | "best waterfalls brecon beacons" | 1,500+ |
| Best Wild Swimming Wales | "wild swimming wales" | 1,500+ |
| Best Easy Walks Snowdonia | "easy walks snowdonia" | 2,000+ |
| Best Dog Walks Snowdonia | "dog walks snowdonia" | 1,500+ |
| Best Adventures Wales | "best adventures wales" | 1,000+ |

**Every one of these is a page we should own and don't.**

### 3. Operator Data Quality

**What exists:** 51 operators, most are stubs with basic info

**What's missing per operator:**

| Field | % Complete | Gap |
|-------|:---------:|-----|
| Name, slug | 100% | — |
| Description | ~70% | Many are 1-sentence stubs |
| GPS coordinates | ~70% | ~15 missing lat/lng |
| Phone number | ~50% | Research needed |
| Website | ~80% | Some broken links |
| Google rating | ~60% | Need to scrape/research |
| Cover image | ~30% | Most have no image |
| Logo | ~10% | Almost none |
| Service details (pricing, group sizes) | ~25% | Only 14 have details |
| Opening hours | ~5% | Almost none |
| Social media links | ~5% | Almost none |
| Booking platform mapping | ~20% | Need Beyonk partnership |

**Priority:** The operator research skill (`skills/adventure-research/`) exists but needs enhancement to capture all these fields.

### 4. Activity Data Quality

**What exists:** 136 activities

**Issues:**
- 52 activities have NO `activity_type_id` — they're untyped and won't appear in combo pages
- Duplicate activity type IDs (e.g. mountain-biking has IDs 6 AND 24)
- Many activities lack: detailed descriptions, proper pricing, images, GPS coords
- Some activities are actually just operator listings renamed

### 5. Region Page Content

**What exists:** 12 region pages, all rendering

**What's missing:**
- Rich editorial introductions (most are thin)
- "Why visit" section with unique selling points
- Weather/season guidance per region
- Getting there info per region
- Featured operators/activities per region (showing but data-thin)
- Local tips / microcopy (see Microcopy Plan)

### 6. Events

**What exists:** 46 events

**Issues:**
- Many are placeholders with vague dates
- No images on most events
- No calendar view page
- Missing major events:
  - Snowdonia Marathon (October)
  - Man vs Mountain (various)  
  - Snowman Triathlon
  - Welsh Castles Relay
  - Pembrokeshire Coast Path Challenge
  - Gower Bike Ride
  - Various parkruns

### 7. Journal / Editorial

**What exists:** 128 posts

**Issues:**
- Many are AI-generated and lack personality
- Teaser text is generic
- Category distribution unknown — may be heavy on one area
- Need more "trip report" style personal content
- Need seasonal/timely content (Christmas markets, autumn colour, etc.)

### 8. Guide Pages

**What exists:** DB table created, admin CRUD built, 0 content

**What's needed:** Full editorial guide pages for every combo page (these are the rendered versions of the combo page JSON data). The page component needs building.

### 9. Accommodation

**What exists:** 70 listings

**Issues:**
- All seed data — no real operator input
- No booking links
- No Booking.com integration (MK applying via CJ)
- Thin descriptions
- No images for most

### 10. Content Snippets / Microcopy

**What exists:** Nothing — not built yet

**What's needed:** ~350 snippets (see Microcopy Content Plan)

---

## Research & Content Creation Priorities

### Immediate (This Week)

| # | Task | Type | Skill Needed | Est. Output |
|---|------|------|-------------|-------------|
| 1 | Fix 52 untyped activities | DB cleanup | Manual / SQL | Assign correct activity_type_id |
| 2 | Deduplicate activity types | DB cleanup | Manual / SQL | Merge duplicate IDs |
| 3 | Create Brecon Beacons hiking combo page | Content research | Combo page research | 1 JSON file |
| 4 | Create South Wales MTB combo page | Content research | Combo page research | 1 JSON file |
| 5 | Create first 5 best-of list JSONs | Content research | Best-of research | 5 JSON files |
| 6 | Generate Phase 1 microcopy (60 snippets) | Content generation | Microcopy skill | 60 DB records |

### Short Term (This Month)

| # | Task | Type | Skill Needed | Est. Output |
|---|------|------|-------------|-------------|
| 7 | Remaining Tier 2 combo pages (~12) | Content research | Combo page research | 12 JSON files |
| 8 | Operator data enrichment (all 51) | Web research | Adventure research skill (enhanced) | 51 updated records |
| 9 | Events audit + add missing major events | Web research | Events research | ~20 new events |
| 10 | Calendar page build | Development | Code | 1 new page |
| 11 | Best-of lists Tier 2 (~15) | Content research | Best-of research | 15 JSON files |
| 12 | Generate Phase 2 microcopy (120 snippets) | Content generation | Microcopy skill | 120 DB records |
| 13 | Region page content enrichment | Content writing | Editorial skill | 12 updated pages |
| 14 | Journal editorial quality pass | Content editing | Editorial skill | 128 improved posts |

### Medium Term (Next 2 Months)

| # | Task | Type | Skill Needed | Est. Output |
|---|------|------|-------------|-------------|
| 15 | Tier 3 combo pages (~12) | Content research | Combo page research | 12 JSON files |
| 16 | Best-of lists niche (~10) | Content research | Best-of research | 10 JSON files |
| 17 | New activity types coverage (paintballing, sightseeing, stag/hen) | Research + content | Multi-skill | ~20 new activities |
| 18 | Accommodation enrichment + Booking.com | Integration | Dev + research | 70 enhanced listings |
| 19 | Spot-level microcopy (120 snippets) | Content generation | Microcopy skill | 120 DB records |
| 20 | Guide page component + first 10 rendered | Development + content | Code + editorial | 10 new pages |
| 21 | Video research (YouTube IDs for all combo pages) | Research | Video research | ~80 video embeds |

---

## Skills Needed

| Skill | Purpose | Exists? | Status |
|-------|---------|:-------:|--------|
| **Adventure Research** | Operator data, business discovery | ✅ | Needs enhancement for full field coverage |
| **Combo Page Research** | Create activity×region JSON data | ❌ | Brief exists (`docs/ACTIVITY-REGION-PAGES-BRIEF.md`), no dedicated skill |
| **Best-Of List Research** | Create ranked list JSON data | ❌ | Brief exists (in combo brief), no dedicated skill |
| **Microcopy Generation** | Generate tips, warnings, fun facts | ❌ | Plan exists, skill needed |
| **Image Sourcing** | Find/download CC images for pages | ❌ | Brief exists (`briefs/COMBO-PAGES-IMAGE-BRIEF.md`), scripts exist |
| **Editorial Enhancement** | Improve journal/guide content quality | ❌ | Need to create |
| **Events Research** | Find/verify Welsh adventure events | ❌ | Need to create |
| **Video Research** | Find relevant YouTube videos per topic | ❌ | Search terms in combo brief, no skill |
| **Content Gap Scanner** | Automated audit of what's missing | ❌ | Could be a script, not a skill |

---

## Content Quality Standards (For All Skills)

### Tone
- Honest, opinionated, practical
- Write like a knowledgeable local friend, not a tourism board
- Include genuine downsides ("parking is a nightmare", "overrated on weekends")
- Specific > generic ("arrive before 8am" not "arrive early")

### Accuracy
- All lat/lng coordinates verified on a map
- All prices checked against operator websites
- All phone numbers verified
- All URLs tested

### SEO
- Natural keyword inclusion (not stuffed)
- Target "People Also Ask" for FAQs
- Include local-intent keywords ("near Llanberis")
- Schema-markup-ready structured data

### Welsh Specificity
- Use real Welsh place names (including Welsh language names)
- Reference specific landmarks, pubs, car parks
- Show knowledge of tidal patterns, weather patterns, seasonal changes
- Acknowledge both English and Welsh naming (Snowdon/Yr Wyddfa)
