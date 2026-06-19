# Research & Skills Master Brief

## What We Need To Do

Adventure Wales has structure but lacks depth. The site has 635 pages but many are thin. This brief maps out every research and content creation workstream, what skill is needed for each, and what the output looks like.

---

## Master Table: Subjects × Skills

| # | Subject Area | Skill Required | Input | Output | Volume | Priority |
|---|-------------|---------------|-------|--------|--------|:--------:|
| 1 | **Combo Page Content** | Combo Page Research | Region + activity type | JSON data file per combo | ~34 total (10 done, 24 remaining) | 🔴 |
| 2 | **Best-Of Lists** | Best-Of List Research | Region + list type | JSON data file per list | ~35 total (0 done) | 🔴 |
| 3 | **Microcopy & Tips** | Microcopy Generation | Region/activity/spot context | DB records (content_snippets) | ~350 snippets | 🔴 |
| 4 | **Operator Enrichment** | Adventure Research (enhanced) | Operator name + region | Updated operator records | 51 operators | 🟡 |
| 5 | **Image Sourcing** | Image Sourcing | Page data JSON | Downloaded + attributed images | ~290 for Tier 1 | 🟡 |
| 6 | **Events Discovery** | Events Research | Region + activity | New event records | ~30 missing events | 🟡 |
| 7 | **Activity Cleanup** | DB Maintenance (script) | Current activities table | Fixed activity_type_ids, deduped types | 52 untyped + duplicates | 🔴 |
| 8 | **Journal Rewrite** | Editorial Enhancement | Existing journal posts | Improved posts with personality | 128 posts | 🟡 |
| 9 | **Region Content** | Region Editorial | Region data + research | Rich intro, getting there, why visit | 12 regions | 🟡 |
| 10 | **Video Research** | Video Research | Combo page topics | YouTube video IDs + metadata | ~80 videos across pages | 🟢 |
| 11 | **Guide Pages** | Guide Page Content | Combo page JSON → editorial | Rendered guide page content | ~34 pages | 🟢 |
| 12 | **Accommodation Enhancement** | Accommodation Research | Current listings | Enhanced descriptions, images, booking links | 70 listings | 🟢 |
| 13 | **New Activity Types** | Activity Discovery | Gap analysis | New activities (paintballing, sightseeing, stag/hen) | ~20-30 new | 🟢 |
| 14 | **Content Gap Scanning** | Automated Audit (script) | DB + JSON files | Report of what's missing | Ongoing | 🟡 |

---

## Skill Specifications

### Skill 1: Combo Page Research
**Purpose:** Create comprehensive activity×region JSON data files  
**Brief location:** `docs/ACTIVITY-REGION-PAGES-BRIEF.md`  
**Image brief:** `briefs/COMBO-PAGES-IMAGE-BRIEF.md`

**What the agent does:**
1. Reads the content brief for JSON schema
2. Checks `data/combo-pages/` for what exists
3. Picks the next meaningful combo (validated against Google autocomplete)
4. Researches: spots/routes, practical info, gear, parking, safety, operators, gear shops, food spots
5. Finds 2-4 YouTube videos
6. Builds keyword strategy
7. Outputs JSON to `data/combo-pages/{region}--{activity}.json`

**Exists?** Brief exists, no dedicated skill package. Agent can work from the brief directly.

---

### Skill 2: Best-Of List Research
**Purpose:** Create ranked "best X in Y" list JSON data  
**Brief location:** Part 2 of `docs/ACTIVITY-REGION-PAGES-BRIEF.md`

**What the agent does:**
1. Reads the brief for JSON schema
2. Checks `data/best-lists/` for what exists
3. Picks the next high-demand list (Google autocomplete validation)
4. Researches: ranked entries with honest verdicts, key stats, insider tips
5. Outputs JSON to `data/best-lists/{region}--best-{slug}.json`

**Exists?** Brief exists, no dedicated skill. Can work from the brief.

---

### Skill 3: Microcopy Generation
**Purpose:** Generate local tips, hot tips, warnings, fun facts, microcopy  
**Brief location:** `plans/MICROCOPY-CONTENT-PLAN.md` (schema) + needs generation skill

**What the agent does:**
1. Takes a region, activity type, or specific spot as input
2. Researches real local knowledge (forums, blogs, guidebooks, operator sites)
3. Generates 5-10 snippets per context, each tagged appropriately
4. Outputs as JSON array matching the `content_snippets` schema
5. Validates: is this actually useful? Would a local agree? Is it specific enough?

**Quality bar:**
- ❌ "Bring waterproof clothing" (too generic)
- ✅ "Pen-y-Pass car park fills by 7am in summer — use the Sherpa bus from Nant Peris (£5 return)" (specific, actionable)

**Exists?** Plan exists, skill needs creating. See section below.

---

### Skill 4: Adventure Research (Enhanced)
**Purpose:** Enrich operator records with full business data  
**Brief location:** `skills/adventure-research/SKILL.md`

**What the agent does:**
1. Takes an operator name + region
2. Researches: website, phone, email, GPS, Google rating, review count, opening hours, social media, services, pricing
3. Checks for booking platform (Beyonk/direct/etc.)
4. Outputs structured data matching the operators table schema

**Exists?** ✅ Skill exists but needs enhancement for:
- Opening hours
- Social media links
- Booking platform detection
- Service detail depth (group sizes, min age, duration per activity)
- Image/logo sourcing

---

### Skill 5: Image Sourcing
**Purpose:** Find, download, and attribute CC-licensed images  
**Brief location:** `briefs/COMBO-PAGES-IMAGE-BRIEF.md`

**What the agent does:**
1. Reads combo page / best-of list JSON for required image paths
2. Searches sources in priority order (Visit Wales → Flickr CC → Unsplash → etc.)
3. Downloads, resizes, strips EXIF, optimises
4. Updates `public/images/attributions.json`
5. Commits to repo

**Exists?** Brief exists, scripts exist (`scripts/fetch_openverse_images.py`, `scripts/fetch_unsplash_images.py`). No unified skill.

---

### Skill 6: Events Research
**Purpose:** Discover and create Welsh adventure events/races/festivals

**What the agent does:**
1. Searches for events by region + activity type
2. Checks: running races, triathlons, cycling sportives, walking festivals, climbing comps, surf comps
3. Captures: name, date, location, website, registration cost, capacity, description
4. Cross-references with existing events in DB
5. Outputs as structured data for DB seeding

**Key sources:**
- runbritain.com
- racesonline.uk  
- TriStar events
- British Cycling
- Surf competitions calendar
- parkrun locations in Wales
- Visit Wales events page

**Exists?** ❌ Needs creating.

---

### Skill 7: Editorial Enhancement
**Purpose:** Improve existing content quality (journal posts, guide text, region descriptions)

**What the agent does:**
1. Reads existing content
2. Identifies weak spots: generic language, missing specificity, bland tone
3. Rewrites with local personality, honest opinions, specific details
4. Adds microcopy hooks ("Pro tip:", "Locals know:", "Skip if:")
5. Maintains SEO keyword density

**Quality shift:**
- Before: "Snowdonia offers many exciting hiking opportunities for visitors."
- After: "Snowdonia's mountains will humble you. The weather changes in minutes, the paths are serious, and the views are unlike anything else in the UK. But that's exactly why people keep coming back."

**Exists?** ❌ Needs creating.

---

### Skill 8: Video Research
**Purpose:** Find relevant YouTube videos for combo pages and best-of lists

**What the agent does:**
1. Takes activity + region + specific spots as input
2. Searches YouTube with specific queries (defined in combo brief)
3. Filters: recent (last 3 years), quality production, genuine creator, correct location, English
4. Returns: video ID, title, channel, description, duration
5. Verifies video is still live

**Exists?** Search terms exist in combo brief, no dedicated skill.

---

### Skill 9: Content Gap Scanner (Automated)
**Purpose:** Continuously audit what content is missing

**What it does:**
1. Queries DB for all region × activity_type pairs with activities
2. Checks which pairs have no combo page JSON
3. Checks which combo pages have no best-of list
4. Checks which operators lack key fields (phone, GPS, rating)
5. Checks which activities have no type assigned
6. Checks which pages reference missing images
7. Outputs a structured gap report

**Implementation:** Python or Node script, not an AI skill. Run periodically.

**Exists?** ❌ Needs creating. Could be a simple CLI script.

---

## What To Build First

### Week 1: Foundation
1. **Create `content_snippets` table** (from Microcopy Plan)
2. **Build content gap scanner script** — know exactly what's missing
3. **Fix 52 untyped activities** — one SQL session
4. **Deduplicate activity types** — one SQL session
5. **Create microcopy generation skill**

### Week 2: Core Content
6. **Generate 60 Phase 1 microcopy snippets** (Tier 1 combo pages)
7. **Create 5 highest-priority missing combo pages** (Brecon hiking, South Wales MTB, Anglesey kayaking, Pembs hiking, Gower coasteering)
8. **Create first 5 best-of lists** (best hikes Snowdonia, best walks Snowdonia, best beaches Pembs, best walks Brecon, best beaches Gower)

### Week 3: Enrichment
9. **Enhance adventure research skill** for full operator enrichment
10. **Run operator enrichment** on all 51 operators
11. **Events research** — find ~30 missing events
12. **Image sourcing** — heroes for all combo pages

### Week 4: Quality
13. **Journal editorial pass** — improve 128 posts
14. **Region content enrichment** — 12 regions
15. **Generate Phase 2 microcopy** (120 snippets)
16. **Video research** for all Tier 1 combo pages

---

## Skill Creation Priority

| Order | Skill | Why First |
|:-----:|-------|-----------|
| 1 | Microcopy Generation | New capability, enriches every page type |
| 2 | Content Gap Scanner | Tells us exactly what to focus on |
| 3 | Events Research | Missing page type, quick win |
| 4 | Editorial Enhancement | Multiplier — improves everything |
| 5 | Video Research | Easy to implement, high SEO value |
| 6 | Adventure Research (enhance) | Already exists, just needs expanding |

Skills 1 (Combo Research) and 2 (Best-Of Research) don't need dedicated skills — the briefs are comprehensive enough for any capable agent to work from.
