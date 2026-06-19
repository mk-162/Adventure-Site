# Goal 1 — Content Overhaul Batch 1

## Objective
Turn the existing launch/content audit work into a concrete execution queue for the first overhaul batch, focused on Snowdonia and the highest-value launch blockers.

## Branch
Continue on the existing branch: `goal/launch-content-overhaul`
Do NOT create a new branch.
Do NOT open a new PR.
Update the existing PR #105 if you make changes.

## Constraints
- Do not install, upgrade, or remove dependencies.
- Do not change package.json, lockfiles, or CI config.
- Do not rewrite public-facing content copy speculatively.
- This batch is about audit structure, priority, and launch execution assets.
- Prefer repo-grounded findings over web research unless strictly necessary.

## Inputs to read first
- `content/content-gap-audit.md`
- `docs/EDITOR-WORKFLOW.md`
- `plans/jules-snowdonia-audit-brief.md`
- `plans/whole-site-content-launch-plan.md`
- `plans/content-completeness-audit-plan.md`
- `STRATEGY.md`

## Tasks
1. Create `content/inventory/coverage-findings.csv` if it does not exist.
   - Use this exact header:
   - `Page Type,Page Title / Slug,Region,Activity,Current Coverage Score (1-5),Famous Things Missing,Top Missing Spots/Locations,Research Status,Priority,Notes,Last Updated`

2. Create `plans/content-overhaul-priority-queue.md`.
   It should be a practical launch queue, not waffle.
   Include these sections:
   - What is already improved by PR #105
   - Top launch blockers still left
   - Batch 1: Snowdonia region/activity completeness
   - Batch 2: operator media/identity gaps on key pages
   - Batch 3: combo-page completeness gaps
   - What should wait until after launch

3. Seed `content/inventory/coverage-findings.csv` with an initial first-pass queue based on repo evidence.
   - Add 10–20 rows.
   - Focus on Snowdonia region/activity pages first, then the most visible operator/media gaps.
   - Use `repo-audit` as `Research Status` where findings are from local files rather than external research.
   - Be concrete and named; no vague filler.

4. Create `plans/content-overhaul-batch-1.md`.
   This should be an execution brief for the next round of content work.
   Include:
   - Scope
   - Exact files or page types to tackle first
   - Definition of done
   - Risks (wrong images, generic copy, stale facts, thin pages)
   - Hand-off note for Jules research results when they land

5. Do a quick verification pass.
   - Ensure all new files exist.
   - Ensure CSV schema is correct.
   - Ensure no code/build files were changed unless absolutely necessary.

## Success Criteria
- There is now a real `content/inventory/coverage-findings.csv` in the repo.
- There is a prioritised launch queue in `plans/content-overhaul-priority-queue.md`.
- There is a concrete execution brief in `plans/content-overhaul-batch-1.md`.
- Changes are committed to the existing branch `goal/launch-content-overhaul` and pushed.
- PR #105 reflects the updated work.

## Reporting
When finished, report:
- what files were created/updated
- how many initial audit rows were seeded
- commit SHA
- confirmation that PR #105 was updated
