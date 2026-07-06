---
title: Widening the Launch Scope
status: active
date: 2026-07-06
tags: [workflow, launch, content]
---

# Workflow: Widening the Launch Scope

How to add a region, combo, or operator to the public site. The gate exists so only
**verified** content is reachable — widening without verification defeats the launch
strategy ([[launch-readiness]]).

## Add a combo (region + activity page)

1. Verify the combo content: `data/combo-pages/{region}--{activity}.json` — real spots,
   no `"null"` strings (they render literally), `introduction` OR `editorial` present
   (`ComboEnrichment` crashes without either), operator links only to published operators
   **actually serving that region** (auto-generated combos historically scattered
   single-site operators across regions they don't serve).
2. Add `"region/activity"` to `LAUNCH_COMBOS` in `src/lib/launch.ts`.
3. The SearchBar, sitemap, hub pages, and content-link normalizer all derive from
   `LAUNCH_COMBOS` — no other edits needed.
4. Run [[link-integrity-crawl]]; redeploy.

## Add a region

1. All of the above for its combos, plus: region page content QA'd, hero image exists
   (`public/images/regions/{slug}-hero.jpg`), `/{region}/stay` + `/{region}/tips` content sane.
2. Add slug to `LAUNCH_REGIONS`. Crawl. Redeploy.

## Publish an operator

Follow [[operator-verification-publishing]] (enrichment + verification first — never
publish from raw CSV data). Then set `operators.status='published'`.
**There is currently no admin UI for this** (Phase 4 gap) — use SQL or a script, e.g.:
```bash
node -e "..." # UPDATE operators SET status='published' WHERE slug='...'
```
After publishing: re-check combos that reference the operator (past swarm nulled operator
links when only 7 were live — re-link opportunities listed in [[content-expansion]]).

## Deferred items waiting on verification (as of 2026-07-06)

- Combos: pembrokeshire/coasteering, pembrokeshire/kayaking, gower/coasteering;
  snowdonia combos climbing / trail-running / surfing (dead lagoon) / scenic-railway (needs DB rows)
- Operators: snowdonia-mountain-guides, coed-y-brenin-nrw, adventure-parc-snowdonia,
  black-mountain-adventure (dedupe first), gower-activity-centres (TLS issue), llangennith-surf-school
