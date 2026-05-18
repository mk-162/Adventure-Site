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

2. ~~**`data/combo-pages/snowdonia--surfing.json`** — anchor: Adventure Parc Snowdonia.~~ **File created in Goal 4 batch-1.** Now in refinement / verification status: needs editor to verify current Adventure Parc Snowdonia session pricing, on-site lodging branding (Hilton Garden Inn vs newer name), and to backfill imagery with proper Openverse/Unsplash attribution before launch.
3. ~~**`data/combo-pages/snowdonia--underground-trampolines.json`** — anchor: Bounce Below at Llechwedd.~~ **File created in Goal 4 batch-1.** Now in refinement / verification status: needs editor to verify current Zip World pricing, height/age restrictions for Bounce Below and Caverns, and to confirm whether Llechwedd Deep Mine tour has a standalone directory slug worth back-referencing.
4. ~~**`data/combo-pages/snowdonia--scenic-railway.json`** — Snowdon Mountain Railway, Ffestiniog, Welsh Highland, Talyllyn.~~ **File created in Goal 4 batch-1.** Includes Llanberis Lake Railway and Bala Lake Railway as bonus lakeside lines. Now in refinement / verification status: needs editor to verify current-year timetables, summit-running policy for SMR, Santa-train dates, and ticket bands. `operatorSlug` deliberately left blank for all six railways pending directory entries.
5. ~~**`/directory/zip-world` operator media** — hero image must be Openverse/Unsplash with attribution; experience-level breakdown (Velocity 2 / Titan 2 / Quarry Karts / Caverns / Fforest) needs current pricing.~~ **Editorial brief created in Goal 6:** `content/operators/profiles/zip-world.md` (three-site portfolio breakdown, UNESCO slate landscape framing, Europe's-fastest correction, verification flags). `content/operators.csv` USP rewritten. DB seed + hero-image sourcing remain editor-side blockers.
6. ~~**`/directory/adventure-parc-snowdonia` operator media** — same pattern; lagoon session pricing changes seasonally.~~ **Editorial brief created in Goal 6:** `content/operators/profiles/adventure-parc-snowdonia.md` (surf lagoon + Adventure Hub + on-site lodging breakdown, world-first 2015 positioning, pairing notes). Operator row currently missing from `content/operators.csv` (DB-only) — editor must backfill the CSV from the brief before the next re-seed.

## P1 — right behind

### Safe content rewrites (Jules + repo audit confirmed named gaps)

7. ~~**`data/combo-pages/snowdonia--hiking.json` update**~~ — **Completed (Goal 3 batch-1).** Glyderau Bochlwyd Horseshoe, Moel Siabod Daear Ddu, Carnedd Llewelyn & Dafydd, Welsh 3000s added as a hike line; intro tightened to surface the wider ranges.
8. ~~**`data/combo-pages/snowdonia--wild-swimming.json` update**~~ — **Completed (Goal 3 batch-1).** Cwm Bochlwyd added as the less-crowded Llyn Idwal alternative; intro reworked with corrie / valley / quarry / waterfall taxonomy.
9. ~~**`data/combo-pages/snowdonia--climbing.json` intro rewrite**~~ — **Completed (Goal 3 batch-1).** British-climbing-birthplace narrative (Joe Brown / Don Whillans / Pen-y-Gwryd 1953) lifted into the intro.
10. ~~**`data/combo-pages/snowdonia--trail-running.json` intro rewrite**~~ — **Completed (Goal 3 batch-1).** Race / event culture (Snowdon Race, Eryri Trail Marathon, Welsh 3000s, XTERRA, Coed y Brenin) now anchors the intro.
11. ~~**`data/combo-pages/snowdonia--zip-lining.json` framing rewrite**~~ — **Completed (Goal 3 batch-1).** Page reframed as a Zip World portfolio across Penrhyn / Llechwedd / Fforest; Velocity 2 corrected to Europe's fastest.

### Goal-6 additions (combos)

12. ~~**`data/combo-pages/snowdonia--mountain-biking.json` intro rewrite**~~ — **Completed (Goal 6).** Coed y Brenin 1996 UK-first heritage now leads; four-flavour split (trail centre / downhill / natural / hand-cut) replaces the generic "playground" intro; BikePark Wales and Llandegla explicitly excluded with reason.
13. ~~**`data/combo-pages/snowdonia--caving.json` intro rewrite**~~ — **Completed (Goal 6).** UNESCO Slate Landscape framing leads; natural-vs-mine geology distinction up front; three-tier visitor offer (family / guided adventure / independent) now structures the read.
14. ~~**`data/combo-pages/snowdonia--gorge-walking.json` intro + spot add**~~ — **Completed (Goal 6).** Gorge-walking-vs-canyoning scope note resolved; Ceunant Mawr added as a distinct anchored spot between Ogwen Upper and family routes; four-valley taxonomy now structures the read.
15. ~~**`data/combo-pages/snowdonia--kayaking.json` create**~~ — **Completed (Goal 6).** Whitewater-first framing (Afon Conwy / Llugwy / Glaslyn) with explicit not-a-sea-kayaking-destination redirect; Bala / Padarn flat-water; Plas y Brenin as the National Outdoor Centre learn-to-paddle anchor. Whitewater grades flagged for editor verification.
16. ~~**`data/combo-pages/snowdonia--beaches.json` create**~~ — **Completed (Goal 6).** Cambrian Coast string (Harlech / Barmouth / Dinas Dinlle / Tywyn / Aberdovey / Fairbourne / Llandanwg); Black Rock Sands drive-on as the famous anchor with park-boundary note; Cardigan Bay dolphin framing. Drive-on rules / lifeguard dates / parking rates flagged for editor verification.

### Goal-6 additions (operators)

17. ~~**`/directory/plas-y-brenin` operator media**~~ — **Editorial brief created in Goal 6:** `content/operators/profiles/plas-y-brenin.md` (residential-not-drop-in model, course catalogue by discipline, National Outdoor Centre context). CSV USP rewritten. DB seed + media remain editor-side blockers.
18. ~~**`/directory/coed-y-brenin-nrw` operator media**~~ — **Editorial brief created in Goal 6:** `content/operators/profiles/coed-y-brenin-nrw.md` (1996 UK-first heritage, trail breakdown, NRW context). CSV USP rewritten. DB seed + media remain editor-side blockers.
19. ~~**`/directory/pen-y-gwryd-hotel`**~~ — **Editorial brief created in Goal 6:** `content/operators/profiles/pen-y-gwryd-hotel.md` (1953 Everest training-base heritage, family-run-since-1947, Smoke Room context). Operator row missing from CSV; auto-fixable fields (coords, Google rating) still need scripted refresh.

### What's left for Batch 2

- Re-seed the DB from the updated `content/operators.csv` rows so the new Zip World / Plas y Brenin / Coed y Brenin USPs land on the live operator pages.
- CSV backfill for the two operators that exist in the DB but not in `content/operators.csv` (Adventure Parc Snowdonia, Pen-y-Gwryd Hotel) using the new profile briefs as source.
- Operator media sourcing pass per `briefs/operator-assets-brief.md` — Tier-1 hero images + galleries.
- Run the auto-fixable Pen-y-Gwryd fields (coordinates, Google rating) through the existing `scripts/postcode-lookup.ts` and `scripts/refresh-google-ratings.ts`.
- Editor verification pass for all the pricing / opening-hours / trail-status flags noted in the tracker rows.

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
