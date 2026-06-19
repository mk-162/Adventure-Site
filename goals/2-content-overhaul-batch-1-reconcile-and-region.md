# Goal 2 — Content Overhaul Batch 1: Reconcile + Snowdonia Region Upgrade

## Objective
Take the new Jules Snowdonia audit output and turn it into usable repo state, then make one real public-facing content improvement by upgrading the Snowdonia region markdown using facts already present in the repo.

## Branch
Continue on the existing branch: `goal/launch-content-overhaul`
Do NOT create a new branch.
Do NOT open a new PR.
Update the existing PR #105.

## Constraints
- Do not install, upgrade, or remove dependencies.
- Do not change package.json, lockfiles, CI, or infra.
- Do not invent facts.
- For the Snowdonia region rewrite, use repo-grounded source material already in this codebase.
- Do not create new combo enrichment JSON files in this pass unless the facts are already strongly supported in repo data files. This pass is for reconciliation + one safe quality lift.

## Inputs to read first
- `content/inventory/coverage-findings.csv`
- `plans/content-overhaul-priority-queue.md`
- `plans/content-overhaul-batch-1.md`
- `content/regions/snowdonia.md`
- `data/regions/snowdonia.ts`
- Existing Snowdonia combo files under `data/combo-pages/`
- Jules findings from session `11321011470620508728` already shown in terminal output / tracker diff summary

## Tasks
1. Reconcile Jules findings into `content/inventory/coverage-findings.csv`.
   - Preserve the current header exactly.
   - Do not duplicate rows unnecessarily.
   - Merge Jules findings into the matching Snowdonia rows where they overlap.
   - Set `Research Status` to `jules+repo-audit` for reconciled rows.
   - Keep launch-context-aware `Priority` values if the repo plan had a stronger opinion.
   - Add new rows only where Jules surfaced a meaningful Snowdonia page not already in the tracker and the page clearly exists on site.
   - Normalize dates to today.

2. Create `plans/content-overhaul-batch-1-working-list.md`.
   It should be the practical next-action list after reconciliation.
   Include:
   - P0 items to ship first
   - P1 items right behind them
   - Which items are safe content rewrites vs which require external fact/image verification
   - Which existing Snowdonia combo pages now have confirmed named gaps from Jules

3. Upgrade `content/regions/snowdonia.md`.
   - Rewrite it so it better reflects the depth already present in `data/regions/snowdonia.ts`.
   - Keep the editorial voice human and grounded.
   - Must explicitly cover: Dark Sky Reserve, slate landscape / heritage, Welsh-language identity, and a clearer sense of Snowdonia beyond just Snowdon.
   - No generic travel fluff.
   - This should be a real improvement to the public page.

4. If needed, lightly update `plans/content-overhaul-priority-queue.md` or `plans/content-overhaul-batch-1.md` so they reflect the reconciled findings from Jules.
   - Only change what materially benefits execution.

5. Verify.
   - Confirm the CSV is still well-formed.
   - Confirm only the intended files changed.
   - Run a targeted build or content-safe verification only if necessary.

## Success Criteria
- `content/inventory/coverage-findings.csv` now reflects both repo audit and Jules findings without becoming messy.
- `plans/content-overhaul-batch-1-working-list.md` exists and is actually useful.
- `content/regions/snowdonia.md` is materially better and more authoritative.
- Branch `goal/launch-content-overhaul` is pushed.
- PR #105 is updated.

## Reporting
When finished, report:
- which rows were reconciled or added
- which files changed
- commit SHA
- confirmation PR #105 was updated
