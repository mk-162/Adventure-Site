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

- Branch: `goal/launch-content-overhaul` (all July 2026 work; large uncommitted tree as of 2026-07-06)
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
- ⬜ **Phase 3 — abuse hardening** (do before real traffic): Zod-validate
  `dashboard/listing/actions.ts` (`javascript:` URI risk); fix `/api/admin/bulk`
  (status enum, soft-delete, adminUserId); rate-limit user-login/newsletter/subscribe/
  track-view; 400-on-NaN in public GET APIs; `event_saves` unique constraint (drizzle
  syntax bug); publish-filter MCP search; enforce admin roles.
- ⬜ **Phase 4 — admin usability**: operator publish/unpublish UI (currently SQL-only!),
  slug immutability on rename, build/remove 5 broken edit routes, wire delete buttons,
  admin logout.
- ⬜ **Phase 5 — monetization enablement** (post-launch): see [[business-model]].
- ⬜ **Phase 6 — SEO/perf**: noindex unlaunched detail pages, OG images (none exist),
  ISR on region pages, real 404s for journal/answers soft-404s, CI off the prod DB.

## Go-live gate

Phases 1–3 done + crawl at 0 broken links (add crawler to CI — script pattern in
[[link-integrity-crawl]]) + prod env vars set (`NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_APP_URL` = `https://adventurewales.co.uk`) + manual pass of
region → combo → activity → operator → claim.

## Current focus

Phases 1–2 complete and verified (typecheck/lint clean, 72/72 tests, build green,
0 broken links). Work is **uncommitted** on the branch.

## Next action

Commit/PR the Phase 1+2 work, then start Phase 3 (abuse hardening list above).
