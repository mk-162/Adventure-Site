# Content Overhaul — Launch Priority Queue

> Superseded for daily execution by `plans/daily-jules-content-improvement-system.md` as of 2026-05-22.
>
> This file remains useful as historical context for the Snowdonia batch work. The corrected launch goal is: fix weak content at scale with daily Jules sessions until the directory is genuinely good. Do not treat hiding/noindexing as the main strategy.

Owner: content + editorial
Tracker: `content/inventory/coverage-findings.csv`
Working list (post-reconciliation): `plans/content-overhaul-batch-1-working-list.md`
Current launch plan: `plans/go-live-content-rescue-plan.md`
Status as of: 2026-05-22

Historical queue for getting Adventure Wales content launch-ready. The new daily Jules system changes the emphasis from manual batching to high-throughput fixing: priority operators, combo pages, image validation, and event refresh run every day until the site is credible across the corpus.

## What is already improved by PR #105

PR #105 (`goal/launch-content-overhaul`) is **infrastructure and editor enablement**, not page-by-page content. Specifically:

- **Editor workflow documented** — `docs/EDITOR-WORKFLOW.md` now describes admin consoles, claim approval flow, image replacement (Openverse/Unsplash via the `generate-images` skill), and pre-publish QA.
- **Snowdonia audit brief seeded** — `plans/jules-snowdonia-audit-brief.md` plus the `scripts/jules/*` client are in place so Jules-driven research can write findings back to `content/inventory/coverage-findings.csv`.
- **Booking affiliate plumbing** — `src/lib/booking.ts` + `BookingWidget` + tests centralise the `BOOKING_AFFILIATE_ID` so every "Search on Booking.com" CTA monetises consistently. Affects every region / accommodation / where-to-stay page.
- **Weather route hardened** — `/api/weather` failure handling improved; widgets no longer break on upstream rate-limits.
- **Claim search UX** — `/directory/claim` now has searchable operator selection, reducing manual claim-routing work for editors.
- **Accommodation + events pages** received small consistency tweaks.

What PR #105 explicitly does **not** do: no public-facing copy was rewritten, no enrichment data files were added, no operator hero images were sourced. That's what this queue is for.

## Top launch blockers still left

In priority order. These are the items that, if shipped, materially change how complete the site feels at launch.

1. **Tier-1 destination-draw operators with no media** — Zip World, Adventure Parc Snowdonia, BikePark Wales (not Snowdonia but launch-critical), Plas y Brenin, Coed y Brenin NRW. Per STRATEGY.md these are the pages that must rank and convert; missing hero/logo signals abandonment.
2. **Snowdonia combo pages with no enrichment data file** — surfing, underground-trampolines, scenic-railway are P0 because each is anchored by a real T1 attraction (Adventure Parc, Bounce Below, Snowdon Mountain Railway). Hollow URLs here look worse than no page at all.
3. **Snowdonia region markdown vs region data file mismatch** — `data/regions/snowdonia.ts` is rich and well-sourced; `content/regions/snowdonia.md` reads as a casual pub chat. Public-facing copy should reach the data file's depth.
4. **Operator audit fixes (22 critical, 42 high)** — `content/content-gap-audit.md` lists 64 operators missing cover image and/or logo. The auto-fixable subset (\~50%) can run through the `generate-images` skill quickly.
5. **Thin activity descriptions** — 7 activities (Ropes Course, Kayak Rental, MTB trail descriptions, etc.) below the 100-char minimum.
6. **Scenic Railway / Running / Gorge Walking activity types with zero linked activities** — either seed activities or remove the type. Empty `/activities?type=*` pages dilute SEO.

Lower-tier but still pre-launch:
- Mid-Wales combo pages — 21 pages with no enrichment data (whole region looks abandoned).
- Pembrokeshire long-tail combo pages (zip-lining, mountain-biking, paintball-laser-tag) where Pembs isn't actually famous for the activity.
- Llŷn Peninsula combo pages — 13 with no data.

## Batch 1: Snowdonia region/activity completeness

Goal: make Snowdonia feel **best-in-class** before launch. It's the highest-traffic region and the showcase for the rest of the site.

Sequence:

1. **Region page narrative parity.** Bring `content/regions/snowdonia.md` up to the standard of `data/regions/snowdonia.ts`. Surface Dark Sky Reserve, UNESCO slate landscapes, Welsh-language framing, and the four-season activity guide that already lives in the data file. *(P0)*
2. **Fill the three P0 combo enrichment files:**
   - `data/combo-pages/snowdonia--surfing.json` — built around Adventure Parc Snowdonia.
   - `data/combo-pages/snowdonia--underground-trampolines.json` — built around Bounce Below + Zip World Caverns.
   - `data/combo-pages/snowdonia--scenic-railway.json` — Snowdon Mountain Railway, Ffestiniog, Welsh Highland, Talyllyn.
3. **Audit existing P0/P1 combo files** (hiking, MTB, climbing) against `content/spots/hiking/snowdonia.csv` and the climbing crag/MTB centre CSVs. Lift any quality_score ≥ 90 spot that is currently missing from the combo. Resolve the gorge-walking-vs-canyoning scope question.
4. **Decide on coasteering / kayaking / sea-kayaking in Snowdonia.** These pages exist because of the activity-type × region matrix but Snowdonia doesn't have the coastline. Either redirect to Llŷn/Anglesey, or reframe as "where to find this nearby." Don't just fill them with generic copy.

Definition of done: every `/snowdonia/things-to-do/*` URL either has a real enrichment file with ≥ 5 named spots, or is intentionally redirected/removed.

## Batch 2: Operator media / identity gaps on key pages

Goal: no T1 or T2 operator listing should look like a stub on launch day.

Sequence:

1. **T1 destination-draw operators** (per STRATEGY.md tier system). Hero image + logo + description ≥ 200 words. Target list: Zip World, Adventure Parc Snowdonia, Coed y Brenin (NRW), Antur Stiniog, Plas y Brenin, Surf Snowdonia / inland wave, BikePark Wales, Bounce Below, Snowdon Mountain Railway.
2. **T2 trip-enhancer operators with strong narrative** — Pen-y-Gwryd Hotel (Everest 1953 heritage), The Stackpole Inn, Pinnacle Café. These appear in itineraries; weak listings cascade into weak itineraries.
3. **Auto-fixable batch** — the \~25 operators marked `*auto-fixable*` in `content/content-gap-audit.md` (missing coordinates + Google rating). Run through the audit-fix script or the `generate-images` skill; verify each result rather than batch-publishing.
4. **Duplicate slugs cleanup** — content-gap-audit shows two `Hell's Mouth Surf School` entries (`hells-mouth-surf-school` and `hell-s-mouth-surf-school`) and two `Llŷn Adventures` entries. Merge before sourcing images so we don't pay twice.

Definition of done: zero red-severity operator gaps in `content/content-gap-audit.md` for any operator that appears on a Tier-1 or Tier-2 page.

## Batch 3: Combo-page completeness gaps

Goal: kill the long tail of empty combo-page URLs without filling them with AI slop.

Sequence (after Batch 1 + Batch 2):

1. **Mid-Wales** — 21 combo pages with no enrichment file. Either populate the genuine ones (hiking already has data; MTB already has data; add wild-swimming, fishing, horse-riding, scenic-railway for the heritage lines) or remove activity-types that don't apply (e.g. surfing in Mid-Wales).
2. **Pembrokeshire long tail** — fill the activities Pembs is genuinely famous for that don't have data (kayaking already has data; surfing already has data; coasteering already has data; wild-swimming already has data — the actual gaps are zip-lining, mountain-biking, climbing, caving, paintball, scenic-railway, horse-riding). Most of these are P2/P3 — many should be removed rather than written.
3. **Llŷn Peninsula** — 13 missing combo files. Strongest gaps: hiking, coasteering, sea-kayaking, mountain-biking, climbing, surfing (where Llŷn is actually famous: Hell's Mouth / Porth Neigwl). The other 7 are removal candidates.
4. **Thin event descriptions** — \~45 events flagged in the audit. Auto-fixable; ship after Batch 1–2 ship.

Definition of done: every remaining `/[region]/things-to-do/[activity]` URL is either filled to the same bar as a Batch 1 page, or removed/redirected. No half-built pages live behind the nav.

## What should wait until after launch

Anything that doesn't pass the STRATEGY.md test ("would a real person bookmark this?"):

- **Tier-3 service pages** — gear shops, bike washes, parking pages. Per STRATEGY these should live inside itineraries, not as standalone URLs. Ignore the audit's nudge to create pages here.
- **Speculative copy rewrites** — don't rewrite working operator descriptions just because they're short. Use the audit to find pages that are *missing data*, not pages that could be longer.
- **Journal hero images** — 5 articles flagged. Editorial polish, not launch-blocking.
- **Activity-type taxonomy cleanup** — Scenic Railway / Running / Gorge Walking having 0 activities is a structural issue, but the right fix is seed-or-remove during Batch 1 (for Snowdonia at least), not a big-bang taxonomy refactor.
- **Combo enrichment for activities a region isn't famous for** — e.g. surfing in Mid-Wales, zip-lining in Pembrokeshire, scenic-railway in Gower. Per STRATEGY, "no page for an activity type with no Welsh presence in that region." Audit them out, don't fill them.
- **Operator pages for unverified businesses** — better to have a smaller, verified directory than a larger one with stubs at launch.
