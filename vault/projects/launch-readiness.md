---
title: Launch Readiness
status: active
priority: high
date: 2026-07-06
tags: [project, launch]
---

# Launch Readiness — go-live for the 8-region slice

## Business context

Ship a narrow, honest, verified slice (8 regions / 24 combos / 18 operators) instead of
chasing all-Wales completion; let real traffic validate. Scope is code-enforced
([[site-facts]] → launch gate).

## Key links

- Branch: `goal/launch-content-overhaul` (all July 2026 work; committed through `b742ce4`, 2026-07-07)
- Full findings + phase plan + progress log: `audits/04-e2e-functionality-review.md`
- Vercel project: `adventure-site` (not yet deployed to prod)

## Phase status (from the July 2026 e2e review)

- ✅ **Phase 1 — launch blockers** (2026-07-06): activity-route redirect shadowing removed;
  search/events filters fixed (Next 16 `await searchParams`); homepage gate leaks fixed;
  `/api/operators` billing-field leak closed; open redirect deleted; claim takeover closed
  (domain match); email/Google/account fixes; `getAppUrl()` guard.
- ✅ **Phase 2 — link integrity** (2026-07-06): **crawl = 0 broken links** (916 URLs).
  Gate applied at every link source; `src/lib/content-links.ts` normalizes authored links;
  104 legacy links rewritten across 42 content files.
- ✅ **Phase 3 — abuse hardening** (2026-07-06/07, agent-wave, commit `0ec19c7`):
  Zod validation via `src/lib/api/validate.ts` (incl. `dashboard/listing/actions.ts`),
  `/api/admin/bulk` fixes, rate limits on user-login/newsletter/subscribe/track-view,
  400-on-NaN, `event_saves` unique constraint (drizzle `0001` migration), MCP publish
  filter, admin role enforcement + billing/Stripe fixes with tests.
- ✅ **Phase 4 — admin usability** (2026-07-06/07, commits `0ec19c7`+): PublicationPanel
  publish/unpublish UI, edit routes for 5 content types, ArchiveButton soft-archive
  wired on list pages, admin logout, guide-pages dead Add button removed, login fixes.
- ⬜ **Phase 5 — monetization enablement** (post-launch): see [[business-model]].
- ✅ **Phase 6 — SEO/perf** (2026-07-07, commits `84316c5`/`b742ce4`): noindex for
  unlaunched-region detail pages (6 templates), static OG image + alt, robots /admin
  exact block, region pages now SSG + revalidate 3600, `LAUNCH_GATED` flag rename,
  imagery mismatch fixes (region heroes, zip-lining/hiking card photos).
- ✅ **Design-system migration wave** (2026-07-07, `84316c5`/`b742ce4`, spec
  [[design-framework]]): homepage, region, combo/activity, directory/operator templates
  on Button/UniversalCard/SectionHeader/StatTile/EmptyState primitives; fake UI removed
  (filter bars, enquiry form, dead buttons); operator sidebar de-duplicated; token sweep
  in migrated scopes (~141 files elsewhere still use the `accent-hover` alias — same
  rendered value, mechanical rename pending).
- ✅ **Combo ("sport in a location") template overhaul** (2026-07-10, this session): fixed
  silent schema drift in `src/lib/combo-data.ts` via a `practicalInfoNormalized` accessor —
  Safety, Getting-There (structured drive-times), gear-hire, cafés (`postActivitySpots`) and
  accommodation (`localDirectory.accommodation`) now render; they existed in the JSON but were
  invisible because the renderer read non-existent field names. New
  `src/components/combo/ComboMap.tsx` (real Leaflet map over `MapView`) replaces the fake
  directions-list. `ComboEnrichment.tsx` restructured around map → what-to-do → spots → tips →
  need-to-know, with a sticky jump-nav + hero image; per-spot `howToDoIt`/`access`/
  `routeDescription` fields added to `ComboSpotCard`; dev-only zod drift validator in
  `src/lib/combo-schema.ts`. Verified: typecheck/lint clean, build OK (1,836 pages).
- ⚠️ **Phase 4 — combo tips + how-to content** (2026-07-10): 23 launch combos authored with
  `topTips` (8) + tiered tips (8/8) + how-to on 186/192 spots via a Sonnet agent workflow
  grounded in each combo's existing researched data + cited web research. JSON integrity
  deep-verified (every original value byte-identical; additions only). **NOT publish-ready:
  all 23 came back `needs-review` — they carry ~137 web-sourced facts + 77 writer flags (e.g.
  the Pen-y-Pass £25 pre-booking price, seasonal opening windows) that need HUMAN verification
  before publish**, since the JSON has no re-verification-date mechanism. The session produced a
  per-combo review doc listing every citation + flag. `south-wales--mountain-biking` was the
  pre-existing house-style reference (untouched).
- ✅ **Combo deferred follow-ups** (2026-07-10): `MapView` gained opt-in `fitBounds` +
  `numberedMarkers` props (backward-compatible; combo maps now frame all spots and number them
  to match the cards). Region-level "Plan a full trip to {region}" itineraries module added to
  combo pages via `getItineraries({ regionId, limit: 3 })` — published itineraries as cards
  (links always resolve), gated on results so regions with none (llyn-peninsula) render nothing;
  labelled region-level, not activity-specific (no itinerary→activity data exists in the DB).

## Go-live gate

Phases 1–3 done + crawl at 0 broken links (add crawler to CI — script pattern in
[[link-integrity-crawl]]) + prod env vars set (`NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_APP_URL` = `https://adventurewales.co.uk`) + manual pass of
region → combo → activity → operator → claim.

## Current focus

Phases 1–4 + 6 and the design-system migration are complete, committed
(`0ec19c7` → `b742ce4`), and verified on 2026-07-07: typecheck clean, 89/89 tests,
clean production build, **crawl 912 URLs / 0 broken links / 8 expected redirects**.
Note: two Claude session crashes occurred mid-wave on 2026-07-06/07 — all agent work
was recovered from the stash + relaunched agents; nothing was lost.

## Next action

Go-live gate is now: prod env vars (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`)
+ manual pass of region → combo → activity → operator → claim, then deploy
(Vercel project `adventure-site`). **Blocker for combo content: human-verify the ~137
web-sourced facts + 77 flags in the Phase 4 review doc before those tips go live.**
Post-launch: Phase 5 (monetization), the sitewide `accent-hover`→`accent-strong`
mechanical rename, and adding the crawler to CI.
