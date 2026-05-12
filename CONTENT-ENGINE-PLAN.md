# Adventure Wales: AI-Powered Content Engine

**Goal:** Systematically generate all content types needed to launch Adventure Wales as a best-in-class trip planning platform.

---

## Content Types Matrix

| Content Type | Current Count | Target | Generator Skill | Priority |
|-------------|---------------|--------|----------------|----------|
| **Activity Mega Pages** | 10 | 10 | `mega-page-builder` | 🔴 P0 |
| **Region Pages** | 11 | 11 | `aw-deep-research` + `aw-content-writer` | 🔴 P0 |
| **Spot Profiles** | 170 CSVs | 50 rich pages | `aw-content-writer` | 🟡 P1 |
| **Itineraries** | 15 stubs | 55 complete | In-repo: `generate-itineraries` | 🔴 P0 |
| **FAQs** | 0 | 105 | In-repo: `generate-faqs` | 🟡 P1 |
| **Operator Profiles** | 50+ CSVs | 50 rich | `aw-content-writer` | 🟢 P2 |
| **Safety Guides** | 9 | 10 | `aw-content-writer` | 🟢 P2 |
| **Events** | Some | 50+ | `aw-event-enhancer` | 🟢 P2 |
| **Transport Guides** | Basic CSV | Rich pages | `aw-deep-research` | 🟡 P1 |
| **Food/Accommodation** | CSVs | Rich integration | `aw-deep-research` | 🟢 P2 |

---

## Phase 1: Core SEO Assets (Week 1-2)

### 1. Activity Mega Pages (10 pages)
**Use:** `mega-page-builder`

Target activities:
- Coasteering
- Mountain Biking
- Hiking
- Climbing
- Surfing
- Kayaking
- Wild Swimming
- Caving
- Zip-lining
- Gorge Walking

**Output format:** `/[activity]/` landing pages with:
- Hero section with authentic imagery
- "Best [Activity] Spots in Wales" section
- Spot cards (pulled from CSV data)
- Region breakdown
- Operator integration
- Practical info (gear, seasons, safety)
- FAQ section
- Related activities

**Execution:**
```bash
# For each activity
hermes "Load mega-page-builder skill. Build the coasteering mega page for Adventure Wales. Use existing data from content/spots/coasteering/ and content/operators.csv. Follow Ultimate France model from playbook."
```

---

### 2. Region Pages (11 pages)
**Use:** `aw-deep-research` + `aw-content-writer`

Target regions:
- Snowdonia
- Pembrokeshire
- Brecon Beacons
- Gower
- Anglesey
- Llyn Peninsula
- South Wales
- North Wales
- Mid Wales
- Carmarthenshire
- Wye Valley

**Output format:** `/regions/[region]/` pages with:
- Hero with region imagery
- Top activities in this region
- Seasonal guide
- Transport & access
- Weather patterns
- Local knowledge
- Hidden gems
- Where to stay/eat
- Insider tips

**Execution:**
```bash
hermes "Load aw-deep-research and aw-content-writer. Research and write the Snowdonia region page. Cover transport, weather, seasonal tips, hidden gems, and local operator intelligence. Use data from content/spots/ and content/operators.csv."
```

---

### 3. Itineraries (55 complete JSON files)
**Use:** In-repo skill `generate-itineraries`

Already defined in `.claude/skills/generate-itineraries/SKILL.md`:
- 13 Snowdonia itineraries
- 9 Pembrokeshire
- 7 Brecon Beacons
- 5 Gower
- 4 Anglesey
- etc.

**Execution:**
```bash
cd ~/projects/Adventure-Site
source .venv/bin/activate
python scripts/generate-itineraries.py --type all
```

**Output:** `data/itineraries/{slug}.json` with:
- Hour-by-hour timeline
- GPS coordinates
- Wet weather alternatives
- Budget alternatives
- Real food/accommodation stops
- Cost breakdown
- Know before you go

---

## Phase 2: Depth Content (Week 3-4)

### 4. FAQs (105 articles)
**Use:** In-repo skill `generate-faqs`

- 55 region FAQs (5 per region)
- 50 activity FAQs (5 per activity)

**Execution:**
```bash
cd ~/projects/Adventure-Site
source .venv/bin/activate

# Generate all FAQs
python scripts/generate-faqs.py --type all

# Or by category
python scripts/generate-faqs.py --type regions
python scripts/generate-faqs.py --type activities
```

**Output:** `content/answers/{slug}.md` with:
- Quick answer (for featured snippets)
- Detailed sections
- Practical tips
- Related questions
- Internal linking

---

### 5. Spot Profiles (Top 50)
**Use:** `aw-content-writer`

Convert CSV data → rich markdown profiles for Tier 1 spots.

**Priority spots (based on tier/search volume):**
- Rhossili Bay (surfing)
- Coed y Brenin (MTB)
- Snowdon (hiking)
- Blue Lagoon Abereiddy (coasteering)
- Pen y Fan (hiking)
- etc.

**Output format:** `content/spots/[activity]/[slug].md`

**Execution:**
```bash
hermes "Load aw-content-writer. Write a rich spot profile for Rhossili Bay surf spot. Use data from content/spots/surfing/gower-surf.csv. Include: what makes it special, who it's for, best conditions, honest downsides, practical details, local tips, nearby operators. Follow STRATEGY.md content quality bar."
```

---

### 6. Transport Guides
**Use:** `aw-deep-research`

Expand basic CSV into rich transport guidance:
- Car-free options (trains, buses, shuttles)
- Parking strategies by region
- EV charging points
- Bike transport
- Group transport

**Output:** `content/transport/[region].md`

---

## Phase 3: Conversion Assets (Week 5)

### 7. Operator Profiles (50 enhanced)
**Use:** `aw-content-writer`

Turn CSV listings → rich profiles with:
- Full service descriptions
- Pricing tables
- Session types
- Booking integration
- Reviews/ratings
- Accreditations
- Gallery

**Output:** `content/operators/[slug].md`

---

### 8. Events Calendar
**Use:** `aw-event-enhancer`

Populate events database:
- Races (trail running, cycling)
- Festivals
- Seasonal activities
- Competitions

**Output:** `content/events/[slug].md`

---

## Phase 4: Supporting Content (Ongoing)

### 9. Safety Guides (10 articles)
**Use:** `aw-content-writer`

Already have 9, add:
- General adventure safety

---

### 10. Imagery
**Use:** In-repo skill `generate-images` + `aw-image-sourcer`

**For generated content:**
```bash
cd ~/projects/Adventure-Site
source .venv/bin/activate

# Build Welsh landscape library
python scripts/fetch_openverse_images.py --entity wales --limit 100

# Activity images
python scripts/fetch_openverse_images.py --entity activities

# Region heroes
python scripts/fetch_openverse_images.py --entity regions
```

**For specific entity images:**
```bash
hermes "Load aw-image-sourcer. Source hero images for all 10 activity mega pages. Use Openverse (CC licensed) where possible, Unsplash as backup. Follow IMAGE-STRATEGY.md guidelines."
```

---

## Execution Order

### Week 1: SEO Foundation
1. ✅ Generate all 55 itineraries (`generate-itineraries`)
2. ✅ Source all imagery (`generate-images` + `aw-image-sourcer`)
3. 🔄 Build 10 activity mega pages (`mega-page-builder`)

### Week 2: Regional Depth
4. 🔄 Write 11 region pages (`aw-deep-research` + `aw-content-writer`)
5. 🔄 Generate 105 FAQs (`generate-faqs`)

### Week 3: Content Enrichment
6. 🔄 Write top 50 spot profiles (`aw-content-writer`)
7. 🔄 Expand transport guides (`aw-deep-research`)

### Week 4: Conversion Layer
8. 🔄 Enhance 50 operator profiles (`aw-content-writer`)
9. 🔄 Populate events calendar (`aw-event-enhancer`)
10. 🔄 Final safety guide (`aw-content-writer`)

---

## Quality Standards (From STRATEGY.md)

Every page must pass:
1. **Would a real person bookmark this?**
2. **Does it contain info you can't get from the first Google result?**
3. **Does it help someone plan or book something?**

### Content Quality Bar
- Specific place names, operators, prices
- Honest about downsides/challenges
- Local knowledge ("only locals know")
- Practical, actionable details
- Real data (coordinates, costs, times)

---

## Skill Loading Commands

### For Activity Mega Pages
```bash
hermes "Load mega-page-builder. Build [activity] mega page."
```

### For Region Pages
```bash
hermes "Load aw-deep-research and aw-content-writer. Research and write [region] page."
```

### For Spot Profiles
```bash
hermes "Load aw-content-writer. Write spot profile for [spot name]."
```

### For Operator Profiles
```bash
hermes "Load aw-content-writer. Enhance operator profile for [operator name]."
```

### For Transport Guides
```bash
hermes "Load aw-deep-research. Write transport guide for [region]."
```

### For Events
```bash
hermes "Load aw-event-enhancer. Research and add [event name] to events calendar."
```

---

## Automation Scripts

Located in `scripts/`:
- `generate-itineraries.py` — JSON itinerary stubs
- `generate-faqs.py` — FAQ articles with web research
- `fetch_openverse_images.py` — CC-licensed imagery
- `fetch_unsplash_images.py` — Higher quality (rate limited)

All require:
```bash
cd ~/projects/Adventure-Site
source .venv/bin/activate
export GEMINI_API_KEY="your-key"  # For itineraries/FAQs
```

---

## Success Metrics

### Content Coverage
- [x] 55 itineraries generated
- [ ] 10 activity mega pages live
- [ ] 11 region pages live
- [ ] 105 FAQs published
- [ ] 50 spot profiles rich
- [ ] 50 operator profiles enhanced

### SEO Targets (6 months)
- "surfing wales" → Page 1
- "mountain biking wales" → Page 1
- "coasteering wales" → Page 1
- "weekend adventure wales" → Page 1
- "things to do in snowdonia" → Page 1

### Business Metrics
- 10+ operators signed up (free tier)
- 3+ operators on Enhanced (£9.99/mo)
- 100+ itinerary enquiries
- 50+ bookings attributed

---

## Next Actions

1. **Verify API keys:**
   ```bash
   echo $GEMINI_API_KEY
   ```

2. **Run itinerary generation:**
   ```bash
   cd ~/projects/Adventure-Site && source .venv/bin/activate
   python scripts/generate-itineraries.py --type all
   ```

3. **Start content sprint:**
   - Load `mega-page-builder` and generate first activity page
   - Use output as template for remaining 9

4. **Parallel track: Run FAQ generation**
   ```bash
   python scripts/generate-faqs.py --type all
   ```

---

**Last Updated:** 2026-05-09
