# Content Overhaul — Batch 1 Working List

Parent plan: `plans/content-overhaul-batch-1.md`
Tracker: `content/inventory/coverage-findings.csv`
Status as of: 2026-05-18

This is the practical next-action list after reconciling Jules's Snowdonia audit (session `11321011470620508728`) with the repo-grounded audit already in the tracker. Use this in place of re-reading the full priority queue when picking up work.

## Reconciliation summary

- Jules audited the 9 Snowdonia files listed in `plans/jules-snowdonia-audit-brief-v2.md`. Findings have been merged into the matching CSV rows; `Research Status` is now `jules+repo-audit` on every reconciled row.
- 5 new rows added for combos Jules covered that weren't yet tracked: caving, gorge-walking, zip-lining, wild-swimming, trail-running.
- The 8 P0/P1 operator + no-data combo rows remain `repo-audit` because Jules's brief did not include them.
- The region row score was lowered from 4 → 3 to reflect Jules's view of the *rendered* markdown vs the repo-data potential — same gap, sharper number.

## P0 — ship first

These are the items that, if shipped, materially change how the site reads at launch.

### Safe content rewrites (no external verification needed — all source material in repo)

1. **`content/regions/snowdonia.md`** — rewrite to the depth of `data/regions/snowdonia.ts`. Must surface Dark Sky Reserve, UNESCO slate landscape heritage, Welsh-language identity, and Snowdonia beyond Yr Wyddfa (Glyderau, Carneddau, Rhinogs, Cadair Idris). *This pass is in scope for the current goal.*

### Require external fact / image verification before shipping

2. **`data/combo-pages/snowdonia--surfing.json`** — anchor: Adventure Parc Snowdonia. Needs verified opening hours, session pricing, capacity. Editor must check current Surf Snowdonia branding.
3. **`data/combo-pages/snowdonia--underground-trampolines.json`** — anchor: Bounce Below at Llechwedd. Needs Zip World current pricing, age limits, height restrictions.
4. **`data/combo-pages/snowdonia--scenic-railway.json`** — Snowdon Mountain Railway, Ffestiniog, Welsh Highland, Talyllyn. All four need current timetables / season closures / booking links. Editor verification mandatory.
5. **`/directory/zip-world` operator media** — hero image must be Openverse/Unsplash with attribution; experience-level breakdown (Velocity 2 / Titan 2 / Quarry Karts / Caverns / Fforest) needs current pricing.
6. **`/directory/adventure-parc-snowdonia` operator media** — same pattern; lagoon session pricing changes seasonally.

## P1 — right behind

### Safe content rewrites (Jules + repo audit confirmed named gaps)

7. **`data/combo-pages/snowdonia--hiking.json` update** — add Glyderau Bochlwyd Horseshoe, Moel Siabod Daear Ddu, and Welsh 3000s as a hike line (currently only in `events`). Source: `content/spots/hiking/snowdonia.csv` quality_score ≥ 90 entries.
8. **`data/combo-pages/snowdonia--wild-swimming.json` update** — add Cwm Bochlwyd as "the less-crowded alternative to Llyn Idwal" (already in `data/regions/snowdonia.ts` hiddenGems).
9. **`data/combo-pages/snowdonia--climbing.json` intro rewrite** — promote the British-climbing heritage narrative (Joe Brown / Don Whillans / Pen-y-Gwryd training ground) from buried spot descriptions into the page introduction.
10. **`data/combo-pages/snowdonia--trail-running.json` intro rewrite** — promote XTERRA / Snowdon Race / Welsh 3000s race culture into the intro.
11. **`data/combo-pages/snowdonia--zip-lining.json` framing rewrite** — explicitly position the page as a Zip World portfolio (which it honestly is) rather than a diversified scene.

### Require external fact / image verification

12. **`/directory/plas-y-brenin` operator media** — National Outdoor Centre context, current course breadth (verify the latest course catalogue).
13. **`/directory/coed-y-brenin-nrw` operator media** — first purpose-built UK MTB centre heritage; current trail status (NRW closures change).
14. **`/directory/pen-y-gwryd-hotel` auto-fixable fields** — coordinates + Google rating per content-gap-audit; verify the 1953 Everest training-base narrative still aligns with the hotel's own about page before claiming it.
15. **`data/combo-pages/snowdonia--kayaking.json`** — Afon Conwy / Llugwy / Glaslyn whitewater grades change with seasonal flow; needs paddler-source verification (Welsh Canoeing or recent guidebook).
16. **`data/combo-pages/snowdonia--beaches.json`** — drive-on rules for Black Rock Sands change; lifeguard cover varies; verify before publishing.

## P2 — editorial decision before any content work

These are NOT in scope for Batch 1 content — they need an editorial yes/no first.

- **`/snowdonia/things-to-do/coasteering`** — redirect to Llŷn/Anglesey, or remove from the activity matrix. Don't fill.
- **`/snowdonia/things-to-do/canyoning`** — decide: merge into gorge-walking with sub-sections, or keep distinct. The Jules audit on gorge-walking flagged the same scope question.
- **`/snowdonia/things-to-do/horse-riding`** — low search intent; only fill if itinerary completeness specifically requires it.

## Existing Snowdonia combo pages with confirmed named gaps from Jules

These are the audit-only items from the Batch 1 brief — Jules confirms there are specific named places missing, not vague "feels thin" complaints. All are safe content edits if a researcher cross-references the spot CSVs.

| Combo | Named missing place(s) | Source for fill |
| --- | --- | --- |
| Hiking | Glyderau Bochlwyd Horseshoe; Moel Siabod Daear Ddu; Carnedd Llewelyn & Dafydd; Welsh 3000s as a hike line | `content/spots/hiking/snowdonia.csv` |
| Mountain Biking | Penmachno full loops / heritage framing; Coed y Brenin UK-first heritage | `content/mtb/centres.csv`, `data/regions/snowdonia.ts` |
| Climbing | Joe Brown / Don Whillans heritage narrative in intro | `data/regions/snowdonia.ts` bestFor #2; existing operator notes |
| Caving | Slate-mining heritage framing; Llechwedd Deep Mine tour as distinct from Caverns zip | `data/regions/snowdonia.ts` keyFacts (UNESCO slate) |
| Gorge Walking | Ceunant Mawr; scope distinction vs canyoning | combo file scope decision |
| Zip-lining | Velocity 2 as Europe-fastest framing; slate-quarry-reuse story | `data/regions/snowdonia.ts` topExperiences |
| Wild Swimming | Cwm Bochlwyd; Llyn Cwellyn | `data/regions/snowdonia.ts` hiddenGems |
| Trail Running | XTERRA Snowdonia framing; UTS Ultra-Trail Snowdonia (verify still active) | `data/regions/snowdonia.ts` seasonGuide |

## What is intentionally NOT on this list

- Operator media batches beyond the five named in P0/P1 — those go to Batch 2 per the priority queue, no exceptions.
- Long-tail combo pages outside Snowdonia — Batch 3.
- Tier-3 service pages (gear shops, bike washes) — out per STRATEGY.md.
- AI-generated photos of real operators / events — never, per `docs/EDITOR-WORKFLOW.md` §3c.

## Order of operations for the current goal

This goal (Goal 2) is scoped to:
1. The reconciliation above (done — see the CSV).
2. This working list (you're reading it).
3. The `content/regions/snowdonia.md` rewrite from P0 item #1.

Items 2–16 above are the next pickup queue once Goal 2 ships.
