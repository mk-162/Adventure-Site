# Goal 5 — Rewrite Snowdonia Region Page

## Objective
Rewrite `content/regions/snowdonia.md` to match the depth and quality of `data/regions/snowdonia.ts`.

## Branch
Continue on `goal/launch-content-overhaul`. Do not create a new branch or PR.

## Constraints
- Do not invent facts.
- Pull real content from `data/regions/snowdonia.ts`.
- Surface the key elements flagged in the tracker:
  - Dark Sky Reserve status
  - UNESCO slate landscape heritage
  - Welsh-language identity / Eryri
  - Clear distinction between Snowdon (Yr Wyddfa) and the wider ranges (Glyderau, Carneddau, Rhinogs, Cadair Idris)
- Keep the tone consistent with the improved combo pages: honest, specific, useful.
- Structure should feel like a proper destination guide, not pub-chat copy.

## Inputs
- `data/regions/snowdonia.ts` (primary source)
- Current `content/regions/snowdonia.md` (to understand what exists)
- `content/inventory/coverage-findings.csv` (for context on the gap)

## Tasks
1. Read both the TS data file and the existing markdown.
2. Produce a full rewrite of the region page.
3. Update the tracker row for the region page to reflect the new score and notes.
4. Commit with clear message.
5. Push and confirm PR #105 is updated.

## Success Criteria
- Region page now properly reflects the rich data in the TS file.
- Tracker updated.
- Branch pushed, PR current.

## Reporting
Report files changed, new region page score, commit SHA, and PR confirmation.