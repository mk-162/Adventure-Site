---
title: pSEO Content Strategy (quality bar, linking, data rules)
status: active
date: 2026-07-06
tags: [workflow, seo, content, adventure-wales]
---

# pSEO Content Strategy

Distilled from `playbook/` (PSEO-STRATEGY, PSEO-PLAYBOOK, INTERNAL-LINKING, DATA-QUALITY, CONTENT-WORKFLOW — Feb 2026 era) plus the Jul 2026 launch-gate reality. Durable principles only.

## Page types that get built

| Type | Current URL pattern | Notes |
|---|---|---|
| Region hub | `/{region}` | Destination guide; hero, top experiences, transport |
| Combo (region × activity) | `/{region}/things-to-do/{activity}` | The core pSEO unit. Rich JSON in `data/combo-pages/{region}--{activity}.json` renders as primary content even with 0 DB activity rows |
| Best-of list | `/{region}/best-…` | Ranked, opinionated; only Tier A spots, max 10–15, with methodology |
| Operator directory/profile | `/directory/<slug>` | Commercial; see [[operator-verification-publishing]] |
| Activity hub / pillar | `/activities/{activity}` | All-Wales guide |
| Personas, glossary | `/for/…`, `/learn/…` | Long-tail, post-launch priority |

(Historical, superseded: the Feb 2026 plans' `/best/`, `/spots/`, `/trails/` URL trees and the "~273 pages" build-out matrix. Today everything is gated by the launch allowlist in `src/lib/launch.ts` — a page only exists publicly when verified and added there.)

## The quality bar

**Golden rules:** every page provides unique value (never variables swapped into a template); honest content including downsides and warnings; data defensibility (first-party spot/operator data is the moat); images licensed or linked, never copied.

**Publish gate per combo page:** 3+ real spots for that combination, 300+ words unique content, at least 1 (published) operator to link to, genuine search demand. Don't build pages nobody searches for; fewer richer pages beat doorway pages.

**The 5 tests (all must pass):** bookmark test, share test ("would you text this to a friend?"), return test, SEO test (top-3 potential in 6 months), content test (contains something the first Google result doesn't).

**Editorial rules:**
- No generic AI travel filler; specific to the exact region/activity ("Llangennith picks up any swell going", not "Gower has great beaches").
- No live pricing, opening hours, timetables, or age limits unless verified against a current official source — otherwise write evergreen copy and link to the operator for current details.
- Tiered tips: a "first timer" set and a "regular/returning" set on combo pages.
- Honest anchors: if one attraction dominates a page (e.g. Bounce Below for underground trampolines), say so and build around nearby pairings rather than padding.
- Gotcha: string `"null"` vs JSON null in combo JSON renders live `/directory/null` 404s.

## Data quality rules

Every spot scored 0–10: destination worth (0–3) + experience quality (0–3) + uniqueness (0–2) + practical quality (0–2). Tiers: 8–10 = **A** (full profile, best-of eligible, shown first), 5–7 = **B** (listed, brief profile), 1–4 = **C** (findable only, never promoted above A/B), 0 = exclude. Spot CSVs live in `content/spots/`; required fields: slug, name, region, lat/lon, quality_score, tier, unique description, source URLs.

## Internal linking rules

Hub & spoke. Every page links **up** to its parents (region hub + activity hub), **down** to its children, and **across** to siblings (same activity other region / same region other activity). Plus:

- Combo pages link to their spots, their (published) operators, and best-of lists; best-of lists link every item's profile and back to the combo page.
- Descriptive natural anchor text; link on first mention; no repeated exact-match anchors.
- Density guide: hubs 15–30 links, combo pages 10–20, profiles 8–15, curation 15–25, operators 5–10.
- Standard blocks: breadcrumbs, "keep exploring" related block, operator CTA where relevant.
- **Launch-gate rule (critical, Jul 2026):** every link-generating surface must filter by the launch allowlist — footer, homepage grid, region activity grids + best-lists, `/destinations`, combo "other activities" + `nearbyAlternatives`, and the activity→operator DB join. Otherwise the gate 404s pages the UI still links to. Verify with a build + live crawl (see [[content-ops-pipeline]]).
- Orphan check: no page with zero inbound internal links.

## Anti-patterns (these killed trust pre-launch)

Bulk-generating combo pages from CSV; publishing operator stubs to make the directory look bigger; "publish now, improve later"; padding nonsense combos (Snowdonia has no coasteering coastline — redirect or omit, don't fake it); search/filter URLs left indexable.

## Related

- [[content-ops-pipeline]] — how this bar is enforced at scale
- [[image-sourcing]] — image half of the quality bar
- [[content-expansion]] — current scope
