# Content Overhaul — Batch 1 Execution Brief

Parent plan: `plans/content-overhaul-priority-queue.md`
Tracker: `content/inventory/coverage-findings.csv`
Companion research brief: `plans/jules-snowdonia-audit-brief.md`

## Scope

**Region: Snowdonia (Eryri) only.**
Two slices, in this order:

1. The Snowdonia region page narrative and the eight `/snowdonia/things-to-do/*` pages that have no enrichment data file (P0/P1 rows in the CSV).
2. The Snowdonia-anchored Tier-1/Tier-2 operator listings with missing hero media (Zip World, Adventure Parc Snowdonia, Plas y Brenin, Coed y Brenin NRW, Pen-y-Gwryd Hotel).

Out of scope for Batch 1: any other region, any combo page that already has an enrichment file (audit-only, no rewrites), any Tier-3 service listings, any journal/event polish.

## Exact files / page types to tackle first

### Region narrative
- `content/regions/snowdonia.md` — rewrite to match the depth of `data/regions/snowdonia.ts`. Keep some local-voice character but front-load verifiable facts (Dark Sky Reserve, UNESCO slate, Welsh-language framing, four-season guide).

### Combo enrichment data files to create
Each file lives at `data/combo-pages/snowdonia--<activity>.json` and must follow the `ComboPageData` shape in `src/lib/combo-data.ts`.

- `data/combo-pages/snowdonia--surfing.json` — anchor: Adventure Parc Snowdonia (inland wave lagoon at Dolgarrog). Frame this as "the UK's only inland surf destination at this scale," not a coastal-surf page.
- `data/combo-pages/snowdonia--underground-trampolines.json` — anchor: Bounce Below (Llechwedd Slate Caverns, Blaenau Ffestiniog). Tie in Zip World Caverns and Llechwedd Deep Mine tour.
- `data/combo-pages/snowdonia--scenic-railway.json` — anchors: Snowdon Mountain Railway, Ffestiniog Railway, Welsh Highland Railway, Talyllyn Railway. This is a Tier-1 grouping page.
- `data/combo-pages/snowdonia--kayaking.json` — anchors: Afon Conwy whitewater, Afon Llugwy, Glaslyn, Llyn Padarn, Llyn Tegid (Bala). Distinguish from sea-kayaking.
- `data/combo-pages/snowdonia--canyoning.json` — anchors: Afon Cwm Llan, Fairy Glen, Ceunant Mawr. Clarify scope vs the existing gorge-walking combo.
- `data/combo-pages/snowdonia--beaches.json` — anchors: Black Rock Sands, Harlech, Barmouth, Dinas Dinlle. Rest-day pairing for hiking/MTB itineraries.

### Combo pages flagged for editorial decision (do NOT auto-fill)
- `/snowdonia/things-to-do/coasteering` — Snowdonia doesn't have the coastline. Decide: redirect to Llŷn/Anglesey, or remove from the region's activity matrix.
- `/snowdonia/things-to-do/sea-kayaking` — same problem; merge into the new `kayaking` combo or redirect.
- `/snowdonia/things-to-do/horse-riding`, `/sup`, `/paintball-laser-tag`, `/toboggan` — P2/P3. Defer to Batch 3 unless the editorial call is to ship a thin-but-honest page.

### Operator listings to fix
Hero image + logo + 200+ word description, sourced legally per `docs/EDITOR-WORKFLOW.md` §3c:

- `/directory/zip-world` — surface Velocity 2, Titan 2, Quarry Karts, Caverns, Fforest as distinct experiences.
- `/directory/adventure-parc-snowdonia` — lagoon sessions, Adventure Hub, on-site accommodation.
- `/directory/plas-y-brenin` — National Outdoor Centre context, course breadth.
- `/directory/coed-y-brenin-nrw` — first purpose-built MTB centre in the UK; MBR / Dragon's Back / Tarw / Cyflym trail breakdown.
- `/directory/pen-y-gwryd-hotel` — 1953 Everest training base heritage; Pyg Track proximity; populate coordinates + Google rating (auto-fixable).

### Existing combo pages — audit only
- `data/combo-pages/snowdonia--hiking.json` — cross-reference with `content/spots/hiking/snowdonia.csv`. Lift any quality_score ≥ 90 entry that isn't already present (likely candidates: Carneddau ridge, Nantlle Ridge, Glyderau Bochlwyd Horseshoe, Moel Siabod Daear Ddu).
- `data/combo-pages/snowdonia--mountain-biking.json` — verify Penmachno + Gwydir Forest are represented. Confirm BikePark Wales is NOT cross-listed (wrong region).
- `data/combo-pages/snowdonia--climbing.json` — verify Tremadog, Cromlech and Llanberis Pass classics are present; confirm the British-climbing-heritage narrative is in the introduction, not just spot lists.

## Definition of done

Per item:
- Each new `snowdonia--*.json` file passes the `ComboPageData` shape used by `src/lib/combo-data.ts` (≥ 5 named spots with coordinates, real operator slug references where one exists, FAQs, local-directory pairings, ≥ 1 event if seasonally relevant).
- Every spot has a verifiable source — not invented. Coordinates check out on a map.
- Every operator referenced via `operatorSlug` resolves to an existing operator in the directory; no dangling refs.
- The Snowdonia region markdown reads at the same depth as the data file but stays in the site's editorial voice.
- All Batch 1 operator listings clear the `🔴 Critical` and `🟠 High` thresholds in `content/content-gap-audit.md` (re-run the audit script before claiming done).
- `content/inventory/coverage-findings.csv` rows for Batch 1 items are updated: score increased and `Notes` reflects what changed.

Per batch:
- `npm run lint` and the existing combo-page tests still pass.
- A Lighthouse spot-check on the rewritten region page hits ≥ 85 mobile (per `docs/EDITOR-WORKFLOW.md` §3e).
- PR #105 description lists which Batch 1 items shipped.

## Risks

- **Wrong images.** Operators reused without permission, or AI-generated photos passed off as real venues. Mitigation: only Openverse/Unsplash, run via the `generate-images` skill, attribution captured on the entity record. No AI photos of real operators or events.
- **Generic copy.** "Stunning vistas in all seasons" filler that fails the STRATEGY.md bookmark test. Mitigation: every paragraph must contain at least one specific, verifiable, locally-grounded fact. If a section can be deleted without losing information density, delete it.
- **Stale facts.** Operator phone numbers, prices, opening times that look authoritative but aren't. Mitigation: only commit fields that have a source date inside the last \~18 months. Leave fields blank rather than guess.
- **Thin pages dressed up.** Six-spot combo pages where two of the spots are tangential. Mitigation: hard floor of 5 *genuinely strong* spots — if a region can't hit that for an activity, redirect rather than fill.
- **Cannibalisation.** A new Snowdonia combo for an activity Snowdonia isn't famous for ranking against the page for the region that IS famous (e.g. surfing in Snowdonia vs Llŷn/Gower). Mitigation: meta titles and intros must make the angle explicit ("inland surf lagoon" vs "Welsh surf beaches").
- **Operator listing diverges from canonical source.** The directory ends up contradicting the operator's own website. Mitigation: capture `dataSource` + `lastVerifiedAt` per `STRATEGY.md` §"Technical Principles" when editing.
- **Image-fixing creates a backlog of unverified hero images.** The 64 image gaps in the audit are tempting to batch-fix but each needs an editorial eye. Mitigation: Batch 1 caps at the five named operator listings; the long tail goes to Batch 2.

## Hand-off note for Jules research results when they land

Jules is running the brief in `plans/jules-snowdonia-audit-brief.md` and will write findings to `content/inventory/coverage-findings.csv` (the file this PR creates). When findings land:

1. Treat Jules's scores as a **second opinion**, not gospel. If Jules scores a page 2 but the repo evidence in this brief scored it 4, reconcile by reading the underlying enrichment file — Jules is judging the rendered page, this brief is judging the data.
2. Look for **new spots/locations** in Jules's findings that aren't in the existing combo enrichment files. Those are the highest-value additions; merge them in during the existing-combo audit step rather than treating them as a new round of work.
3. If Jules flags a page as a low score that this brief had as P2/P3, escalate it only if Jules names a specific famous spot or operator that's missing. Generic "feels thin" feedback is not enough to re-prioritise.
4. Resolve merge conflicts on the CSV by row, preserving Jules's `Famous Things Missing` / `Top Missing Spots` (more research-grounded) and this brief's `Priority` / `Notes` (more launch-context aware). Set `Research Status` to `jules+repo-audit` for reconciled rows.
5. After reconciliation, re-export the CSV's P0 rows as the Batch 1 working list — that's the source of truth for what ships in this PR.
