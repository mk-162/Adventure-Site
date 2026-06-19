# Goal 3 — Content Overhaul Batch 1: Safe Snowdonia Combo Upgrades

## Objective
Ship the next safest tranche of the content overhaul by improving existing Snowdonia combo pages where the repo and reconciled audit already give us concrete named gaps, without needing fresh external research.

## Branch
Continue on the existing branch: `goal/launch-content-overhaul`
Do NOT create a new branch.
Do NOT open a new PR.
Update the existing PR #105.

## Constraints
- Do not install, upgrade, or remove dependencies.
- Do not change package.json, lockfiles, CI, infra, or app logic unless required for content schema validity.
- Do not create brand-new combo pages in this goal.
- Only update EXISTING Snowdonia combo data files that already exist in the repo.
- Only use facts already supported by repo source material (`data/regions/snowdonia.ts`, existing combo JSON, spot CSVs, content inventory, current operator slugs).
- No speculative claims, pricing, opening hours, or unverifiable operator details.

## Inputs to read first
- `plans/content-overhaul-batch-1-working-list.md`
- `content/inventory/coverage-findings.csv`
- `data/regions/snowdonia.ts`
- `content/spots/hiking/snowdonia.csv`
- `data/combo-pages/snowdonia--hiking.json`
- `data/combo-pages/snowdonia--wild-swimming.json`
- `data/combo-pages/snowdonia--climbing.json`
- `data/combo-pages/snowdonia--trail-running.json`
- `data/combo-pages/snowdonia--zip-lining.json`
- `src/lib/combo-data.ts`

## Tasks
1. Upgrade `data/combo-pages/snowdonia--hiking.json`.
   - Add the strongest missing routes already supported by repo sources.
   - Prioritise named gaps from the working list / CSV: Glyderau Bochlwyd Horseshoe, Moel Siabod Daear Ddu, Carnedd Llewelyn & Dafydd, Welsh 3000s framing where appropriate.
   - Keep quality high; do not bloat with weak filler.

2. Upgrade `data/combo-pages/snowdonia--wild-swimming.json`.
   - Add repo-supported named gaps such as Cwm Bochlwyd if the source material supports it cleanly.
   - Tighten framing so it feels genuinely Snowdonia-specific.

3. Upgrade `data/combo-pages/snowdonia--climbing.json` intro / framing.
   - Bring the British climbing heritage into the intro using repo-grounded facts.
   - Make sure the page reads like Snowdonia, not generic climbing copy.

4. Upgrade `data/combo-pages/snowdonia--trail-running.json` intro / framing.
   - Surface the race / mountain-running identity already supported in repo sources.
   - Keep it factual and specific.

5. Upgrade `data/combo-pages/snowdonia--zip-lining.json` framing.
   - Make the page honest about the Zip World portfolio dominating this category.
   - Use the quarry-reuse / slate-adventure angle if supported in repo data.

6. Update `content/inventory/coverage-findings.csv` for every item you materially improved.
   - Increase scores only where the changes genuinely justify it.
   - Preserve schema exactly.
   - Set `Research Status` appropriately (`repo-audit` or `jules+repo-audit` as already applicable).
   - Update notes to reflect what changed.

7. Lightly improve `content/regions/snowdonia.md` only if needed to keep tone grounded and non-performative.
   - No major rewrite unless clearly beneficial.

8. Verify.
   - Ensure all edited combo JSON files still match the `ComboPageData` shape.
   - Run targeted validation/build if needed.
   - Confirm only intended files changed.

## Success Criteria
- 5 existing Snowdonia combo files are materially stronger.
- The changes are specific, locally-grounded, and free of generic filler.
- `coverage-findings.csv` is updated to reflect real progress.
- Branch `goal/launch-content-overhaul` is pushed.
- PR #105 is updated.

## Reporting
When finished, report:
- which files changed
- what concrete content was added or reframed
- which tracker rows were updated
- commit SHA
- confirmation PR #105 was updated
