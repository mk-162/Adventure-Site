---
title: Content Expansion (launch slice → full Wales)
status: active
date: 2026-07-06
tags: [project, content, launch, adventure-wales]
---

# Content Expansion

The workstream that grows the publicly-visible, *verified* slice of Adventure Wales. Strategy (decided Jul 2026): the site was stalled with ~89% of 1,657 inventory items unverified — so we ship a small, honest, code-gated slice and widen it region by region as content is verified, instead of chasing all-Wales completion.

## Current state (2026-07-06)

- **Live scope (behind the code gate, `src/lib/launch.ts`):** 8 regions (snowdonia, pembrokeshire, brecon-beacons, gower, anglesey, llyn-peninsula, south-wales, mid-wales), **24 combos**, **18 published operators** (of 166; rest are `draft`). `LAUNCH_BEST_LISTS` is empty — no best-of pages verified yet.
- Expansion from the original Snowdonia-only slice was done by a 37-agent Sonnet workflow (verify operators + QA/fix combos per region).
- Branch `goal/launch-content-overhaul` (PR #105), build green (1,833 pages), 61 tests pass, live-crawl at 0 broken links (916 URLs). **Not yet deployed to prod** — gated on the e2e remediation plan in `audits/04-e2e-functionality-review.md` (phases 1+2 done; phase 3 abuse-hardening pending) and Vercel env (`NEXT_PUBLIC_SITE_URL`/`APP_URL`).

### Known debts inside the launched scope

- **Combos need re-linking to the now-18 published operators** — the swarm nulled operator links back when only 7 operators were live, so live combo pages under-link. First expansion action.
- **Deferred combos** (verified content not ready): `pembrokeshire/coasteering`, `pembrokeshire/kayaking`, `gower/coasteering`. Earlier Snowdonia deferrals: climbing, trail-running, surfing (Adventure Parc lagoon closed), scenic-railway (needs DB activity rows).
- **Held operators**: `black-mountain-adventure` (dedupe), `gower-activity-centres` (TLS), `llangennith-surf-school`.
- Pre-existing `/activities` page bugs: all-Wales curated collections leak outside launch scope; missing hub routes (/archery, /canyoning, /zip-lining, /white-water-rafting, …).

## The engine

Content is produced and verified via [[content-ops-pipeline]] (audit → inventory → task queue → Claude swarm → verify), operators via [[operator-verification-publishing]] (Sonnet research + Opus verify, `operators.status` gate), to the quality bar in [[pseo-content-strategy]] with images per [[image-sourcing]].

Widening the launch is deliberately a **one-line change**: verify the content, add the region/combo to `LAUNCH_REGIONS`/`LAUNCH_COMBOS` in `src/lib/launch.ts`, redeploy. But remember the two expansion learnings:

1. Verify an operator's REAL region before linking it anywhere.
2. Every link-generating surface must respect the allowlist (footer, homepage grid, region grids, /destinations, combo cross-links, activity→operator join) — then prove it with a build + live crawl.

## Next actions (priority order)

1. Re-link the 24 live combos to the 18 published operators (only where region-verified).
2. Deploy the gated slice to prod once e2e phase 3 is done; let real traffic validate.
3. Clear the 3 held operators and 3 deferred combos through the verification pipeline.
4. Verify + enable first best-of lists (`LAUNCH_BEST_LISTS` currently empty).
5. Fix `/activities` hub bugs (scope leaks + missing routes).
6. Resume region-by-region widening (remaining: wye-valley, ceredigion, carmarthenshire, north-wales-coast) using the swarm-per-region method.
7. Longer term: resolve the markdown-vs-DB source-of-truth decision (see warning in [[content-ops-pipeline]]) before any bulk markdown authoring.

## History (for context)

Feb 2026: pSEO playbooks + ~273-page build plans (`playbook/`, superseded as plans, principles kept). May 2026: go-live rescue plan — shrink/hide rather than expand; audit found 1,838 gaps. Jun 2026: goals 1–6 rebuilt Snowdonia content (region page, 10+ combos, operator briefs). Jul 2026: launch gate + Snowdonia slice, then 8-region expansion. Newer sources (`goals/`, `STATUS.md`, memory) win over `playbook/`/`plans/` on any conflict.
