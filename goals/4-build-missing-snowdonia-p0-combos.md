# Goal 4 — Content Overhaul Batch 1: Build the 3 Missing Snowdonia P0 Combo Pages

## Objective
Create the three highest-priority missing Snowdonia combo enrichment files so those URLs stop feeling hollow at launch.

These are the three P0 gaps from the tracker:
- `snowdonia--surfing.json`
- `snowdonia--underground-trampolines.json`
- `snowdonia--scenic-railway.json`

## Branch
Continue on the existing branch: `goal/launch-content-overhaul`
Do NOT create a new branch.
Do NOT open a new PR.
Update the existing PR #105.

## Constraints
- Do not install, upgrade, or remove dependencies.
- Do not change package.json, lockfiles, CI, infra, or app logic unless required for content/schema validity.
- Do not invent facts.
- Prefer durable, evergreen facts over volatile details.
- Avoid current pricing, opening hours, age limits, and timetable details unless already present in the repo and clearly trustworthy.
- If an operator slug is uncertain, leave `operatorSlug` blank rather than guess.
- These pages should be honest and specific, not padded. If a page only has one true anchor attraction, say that clearly and build around nearby pairings / alternatives rather than pretending there are many equal options.

## Inputs to read first
- `content/inventory/coverage-findings.csv`
- `plans/content-overhaul-batch-1-working-list.md`
- `plans/content-overhaul-batch-1.md`
- `src/lib/combo-data.ts`
- `data/regions/snowdonia.ts`
- Existing Snowdonia combo files for tone/shape:
  - `data/combo-pages/snowdonia--zip-lining.json`
  - `data/combo-pages/snowdonia--climbing.json`
  - `data/combo-pages/snowdonia--hiking.json`

## Tasks
1. Create `data/combo-pages/snowdonia--surfing.json`.
   - The page must be honest that Snowdonia is not a beach-surf destination.
   - Anchor it around Adventure Parc Snowdonia / inland-wave surfing at Dolgarrog.
   - Use nearby alternatives / same-region pairings intelligently so the page still feels useful.
   - Make the intro explicit about why this page exists.

2. Create `data/combo-pages/snowdonia--underground-trampolines.json`.
   - Anchor it around Bounce Below at Llechwedd.
   - Cross-reference the wider slate-cavern / quarry-adventure context so it feels rooted in Snowdonia rather than novelty fluff.
   - Keep it useful even if one attraction dominates.

3. Create `data/combo-pages/snowdonia--scenic-railway.json`.
   - Build around the four heritage rail experiences already named in the tracker: Snowdon Mountain Railway, Ffestiniog Railway, Welsh Highland Railway, Talyllyn Railway.
   - Make the page about why railways matter to the region: mountain access, slate heritage, landscape journey, family-friendly rest-day option.
   - Be careful with geography and wording.

4. For all three new files:
   - Match `ComboPageData` shape.
   - Include credible spots, practical info, FAQs, keywords, and nearby alternatives.
   - Use safe, stable language. No unverifiable hype.
   - If some parts of the shape are better left sparse than guessed, keep them sparse.

5. Update `content/inventory/coverage-findings.csv`.
   - Reflect the fact that these pages now have enrichment files.
   - Increase scores only if justified.
   - Update notes with what was actually created.

6. If useful, lightly update `plans/content-overhaul-batch-1-working-list.md` to reflect that these three P0 pages have moved from missing-file status into refinement / verification status.

7. Verify.
   - Ensure JSON is valid.
   - Run the minimum sensible build/validation needed to catch schema or import issues.
   - Confirm only intended files changed.

## Success Criteria
- The 3 highest-priority missing Snowdonia combo files now exist.
- They are useful, specific, and honest.
- The tracker reflects real progress.
- Branch `goal/launch-content-overhaul` is pushed.
- PR #105 is updated.

## Reporting
When finished, report:
- which files were created/updated
- what each new page is anchored around
- which tracker rows were updated
- commit SHA
- confirmation PR #105 was updated
