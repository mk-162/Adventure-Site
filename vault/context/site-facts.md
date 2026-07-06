---
title: Site Facts (Technical)
status: active
date: 2026-07-06
tags: [context, technical, facts]
---

# Site Facts — verified 2026-07-06

## Stack

- Next.js 16 App Router (Turbopack), React 19, TypeScript, Tailwind
- Drizzle ORM on Neon Postgres (single neon-http client, `src/db/index.ts`; schema `src/db/schema.ts`, 48 tables)
- Vercel deploy (project `adventure-site`, `prj_jYhyWXgaIz8VD51ntQZaffaKl8u5`); Vercel Blob for uploads; Resend for email; Stripe for billing (not yet configured in prod)
- Tests: vitest (`src/lib/__tests__/`, `src/components/__tests__/`); CI: `.github/workflows/ci.yml` (audit → typecheck → lint → test → build); husky pre-commit
- Migrations: squashed baseline `drizzle/0000_baseline.sql` (recorded as applied July 2026); use `db:generate`/`db:migrate`, NOT `db:push`

## Launch gate (the single most important fact)

Public scope is **code-gated**, not data-gated. `src/lib/launch.ts`:
- `LAUNCH_REGIONS` — 8 regions: snowdonia, pembrokeshire, brecon-beacons, gower, anglesey, llyn-peninsula, south-wales, mid-wales
- `LAUNCH_COMBOS` — 24 verified `region/activity` pairs
- `LAUNCH_BEST_LISTS` — empty (none verified)
Everything outside 404s and is dropped from `src/app/sitemap.ts`. Widening = one-line change there ([[launch-widening]]).

## Operator publish gate

`operators.status` column, default `draft`. 18 operators `published` (of 166). All public
queries filter `status='published'` (`src/lib/queries/operators.ts`). Never bypass it in a
new query — the homepage once did, that was a bug.

## Auth domains (three, one shared JWT_SECRET)

- Admin: per-user scrypt hashes in `admin_users` (set via `npx tsx scripts/set-admin-password.ts <email>`); gate in `src/proxy.ts` (Next 16 renamed middleware→proxy), fail-closed; `admin_token` cookie, 7d
- Operator: magic-link claim/login (`/api/auth/*`), 14d session; claim instant-approval requires email-domain ↔ website-domain match, else `/admin/commercial/claims` queue
- Consumer: magic-link (`/api/user/*`) + optional Google OAuth (hidden unless `NEXT_PUBLIC_GOOGLE_LOGIN=1`), 30d session
- Known gap: no server-side token revocation (STATUS.md open decision 2)

## Env vars that matter (names only; see `.env.example`)

`DATABASE_URL`, `JWT_SECRET`, `ADMIN_SECRET`, `RESEND_API_KEY`, `MCP_API_KEY`,
`BLOB_READ_WRITE_TOKEN`, `STRIPE_*` (5 vars — billing dark until set; watch the
VERIFIED vs ENHANCED price-ID split), `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_APP_URL`
(**required in prod** — emails/Stripe/OG break to `*.vercel.app` or throw without them),
`BOOKING_AFFILIATE_ID` (affiliate revenue silently off without it).

## Key content sources

- DB is what renders. `content/` + `data/` markdown/JSON feed it via import scripts — **no live sync** (open decision, STATUS.md #1)
- Combo pages render rich JSON from `data/combo-pages/` even with 0 DB activity rows
- Authored-content links are normalized at render time by `src/lib/content-links.ts` (legacy URL schemes, unlaunched-region links → plain text)

## Canonical domain

`https://adventurewales.co.uk` (hard-coded in canonicals; `.env.example` now matches).

## History pointers

- May 2026 security audit + fixes: `audits/01-03`; July 2026 e2e functionality review + remediation log: `audits/04-e2e-functionality-review.md`
- Current work state: [[launch-readiness]]
