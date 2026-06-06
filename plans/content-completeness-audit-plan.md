# Content Completeness Audit & Research Plan

**Date:** 2026-05-17
**Problem:** Site has lots of content, but feels incomplete. Regions don't lead with what they're famous for. Activity coverage is patchy (e.g. 8/15 best MTB spots).
**Goal:** Make Adventure Wales feel comprehensive and authoritative — page by page, region by region — through targeted research, not a full rewrite.

This plan is execution-focused. It assumes the inventory work in `goals/content-audit-organization.md` either exists or will be produced as a byproduct.

---

## 1. Audit existing content for completeness

The current audits measure *quality* (images, word count, SEO) and *inventory* (what exists). Neither answers the real question: **"What's missing that a knowledgeable local would expect to see here?"**

Run a **Coverage Gap Audit** in three passes:

### Pass A — Structural completeness (automated, 1 day)
For each page type, generate a CSV of:
- URL
- Item count present (operators, spots, accommodation, etc.)
- Expected minimum for that page type (see §5)
- Missing required fields (hero image, intro, FAQ, map, internal links)
- Last-updated date

Output: `content/inventory/coverage-gaps.csv`. One row per live page. This is mechanical — just runs against the DB + CSV inventory.

### Pass B — Famous-things check (manual, 1 day per 3–4 regions)
For each region and each major activity page, answer 5 questions with a yes/no/partial:
1. Does the page lead with what this place is **most famous for**?
2. Are the **top 3 must-do experiences** present and prominent?
3. Are the **best-known operators / centres / spots** present?
4. If a non-local searched the place name, would the page match their **top expectation**?
5. Is there at least one **distinctive local detail** (event, story, season, hazard) a guidebook would mention?

Score each page out of 5. Anything ≤ 3 goes on the fix list.

### Pass C — External cross-reference (manual, ½ day per activity)
Pick 3–5 authoritative external lists per activity (e.g. MBR's "best MTB in Wales", BMC for climbing, RYA for sailing, NRW, Visit Wales, Sustrans). For each list, tick off what we cover and flag what we don't.

Output: `content/inventory/external-coverage-{activity}.md` — one per activity, listing canonical items and our coverage status.

---

## 2. Layered research approach

Two tiers, run in sequence per priority area (see §3):

### Tier 1 — Quick research sweep (2–4 hours per region/activity)
Goal: close the obvious "everyone knows this should be here" gaps fast.

Sources, in order:
1. **Wikipedia + Wikidata** — fast canonical list of named places, events, landmarks.
2. **Visit Wales / regional tourism boards** — official top-N lists.
3. **Top 2 authoritative activity bodies** (BMC, MBA, RYA, BCU, NRW, Sustrans).
4. **Top 3 Google results** for `"best [activity] in [region] wales"` — capture names mentioned across multiple lists (consensus = canonical).
5. **YouTube + Strava heatmap** — quick visual check for popular routes/spots.

Capture per item: name, location (lat/lng or nearest town), what makes it notable, source URL. Don't write copy yet — just build the list.

### Tier 2 — Deep research (1–2 days per priority area)
Only for pages flagged as commercially or strategically important (top regions, top activities, lure-candidate operators).

Sources:
1. **Local guidebooks** — Cicerone, Pesda Press, Rockfax (titles, ToCs, index entries — fair use for reference).
2. **Local forums & subreddits** — `r/Wales`, `r/MTB`, UKClimbing forum, regional FB groups. Look for "underrated" and "hidden gem" threads.
3. **Operator websites** — read 5–10 operators' own "where we go" pages. They reveal locations not in tourist board lists.
4. **Strava segments + heatmaps** — popularity signal for routes.
5. **OS Maps / OpenStreetMap** — verify physical existence and approach details.
6. **Local journalism** — Wales Online, regional papers for events and incidents (safety context).
7. **One short phone call or email** to a respected local operator or club secretary per area, if a gap remains unresolved.

Deep research output goes into the same finding tracker (§4) but with `tier: deep` and richer notes.

---

## 3. Prioritisation

Fix in this order. Don't audit everything first then fix — interleave audit and fix per priority tier so visible improvement starts week 1.

### Tier 1 — Fix first (weeks 1–3)
- **Top 3 regions by current traffic** (check GA/Plausible). These are where new visitors land.
- **Top 5 activities by page volume or commercial intent** — almost certainly coasteering, MTB, surfing, climbing, hiking based on the existing content split.
- **Any page with score ≤ 2** from Pass B, regardless of region/activity — these actively damage trust.

### Tier 2 — Fix next (weeks 4–6)
- Remaining regions
- Remaining activities with ≥ 5 existing pages
- Combo pages (region × activity) for Tier 1 regions

### Tier 3 — Backlog
- Niche activities with < 5 pages — decide whether to expand or consolidate.
- Long-tail combo pages.
- Accommodation/transport/food (these support, not lead).

**Prioritisation rule of thumb:** a page that ranks or could rank for a high-intent search outranks a page that doesn't, regardless of how "incomplete" it feels. Pull current search positions before sequencing.

---

## 4. Tracking findings → content tasks

Use **one CSV** as the single source of truth. Don't spin up Notion, Linear, or a sheet per activity — one file, in repo, diffable.

`content/inventory/coverage-findings.csv`:

| Column           | Example                                        |
|------------------|------------------------------------------------|
| id               | `mtb-gap-001`                                  |
| date_found       | `2026-05-18`                                   |
| page_url         | `/mtb/snowdonia`                               |
| page_type        | `combo` / `region` / `activity` / `operator`   |
| gap_type         | `missing_spot` / `missing_operator` / `missing_event` / `wrong_lead` / `thin_section` |
| item_name        | `Coed y Brenin — The Beast`                    |
| tier             | `quick` / `deep`                               |
| source_urls      | `https://... ; https://...`                    |
| confidence       | `high` / `medium` / `low`                      |
| priority         | `P1` / `P2` / `P3`                             |
| status           | `found` / `drafted` / `imported` / `live` / `wontfix` |
| owner            | `mk` / `claude` / `jules`                      |
| notes            | Free text — 1–2 sentences max                  |

**Turning findings into tasks:**
- Every Friday: filter `status=found AND priority=P1`. Each row becomes one content task in `tasks/` (or wherever Jules/agents pick up work). Status moves to `drafted`.
- Once imported to DB / live, status moves to `live`.
- Wontfix is a valid outcome — record the reason.

Optional but cheap: a `scripts/coverage-report.ts` that summarises the CSV by region, activity, and status. Run it weekly. Don't build a dashboard.

---

## 5. What "complete" looks like per page type

These are minimum bars, not aspirations. Below the bar = incomplete; flagged. Above the bar = ship-ready; not necessarily great.

### Region page (e.g. `/snowdonia`)
- Lead paragraph names what the region is **most famous for** in the first 2 sentences.
- Top 5 activities, each with a 1–2 sentence summary and link to the region×activity page.
- Minimum **8 named places / experiences** with location.
- 3–5 itineraries linked.
- 5+ operators linked.
- 1 "best time to visit" + 1 "watch out for" section (local knowledge signal).
- Hero image clearly recognisable as that region.
- ≥ 1200 words.

### Activity mega page (e.g. `/mtb`)
- Lead paragraph states Wales's standing in that activity nationally/internationally if relevant.
- **All major regions covered** with at least one entry each (if the activity exists there).
- Minimum **15 named spots/centres/routes** (this is the 8/15 problem).
- Skill-level breakdown (beginner / intermediate / advanced).
- Seasonality notes.
- 3+ operator links.
- Safety / access notes.

### Region × activity combo page (e.g. `/snowdonia/mtb`)
- Minimum **5 named spots** with location, difficulty, approach.
- 2+ operators serving the area.
- 1 itinerary or sample day.
- Map.
- Practical: parking, nearest town, post-ride food.

### Operator page
- Real description (not stub), 200+ words.
- Verified contact details.
- Location accurate to postcode.
- 6+ images that match the actual operation.
- Activities offered listed.
- At least one specific offer or package if available.
- Accreditations if held.

### Itinerary page
- 8+ stops.
- Realistic timing and inter-stop transport.
- Weather / season contingencies.
- Booking links where applicable.

### Spot / place page
- Lat/lng or what3words.
- Approach + parking.
- Difficulty / suitability.
- Best season / conditions.
- Hazards.
- 1 distinctive detail (history, story, local name).

---

## 6. Execution shape (suggested 6-week cadence)

| Week | Focus                                                                              |
|------|------------------------------------------------------------------------------------|
| 1    | Pass A automated audit. Pull traffic data. Lock Tier 1 priority list.              |
| 2    | Pass B + C on Tier 1 regions and activities. Findings CSV populated.               |
| 3    | Quick-research sweep on Tier 1 gaps. Begin content drafting on P1 items.           |
| 4    | Deep research on top commercial pages. Continue drafting + import.                 |
| 5    | Pass A/B/C on Tier 2. Quick-research sweep.                                        |
| 6    | Drafting + import for Tier 2. Coverage report. Decide on Tier 3 expand-vs-consolidate. |

**Stop condition:** every Tier 1 page passes the §5 minimum bar and scores ≥ 4 on Pass B. Tier 2 and 3 continue in normal content cadence after that.

---

## 7. What not to do

- Don't research before auditing — you'll waste effort on pages that aren't priorities.
- Don't try to make every page world-class. Target the minimum bar in §5 first across all priorities, then iterate.
- Don't build a tooling/dashboard project around this — one CSV and a weekly script is enough.
- Don't fix images, copy, and coverage in the same pass for the same page. Coverage gaps first; quality polish is a separate sweep (covered by `whole-site-content-launch-plan.md`).
- Don't write content from scratch when an external authoritative list already orders things — use it as the spine, then add local colour.
