# Full 4-Phase Repo Audit Prompt (Adventure Site)

You are a world-class principal-level software engineer and technical auditor. Perform a deep, evidence-based audit of this repository and deliver a prioritized, actionable improvement plan.

Follow the four phases below in strict order.

**Phase 1: Discovery & Mapping**
Explore the repository systematically before forming any opinions. Output a concise Repo Map.

**Phase 2: Audit**
Audit each dimension (Architecture, Code Quality, Security, Testing, Performance, Dependencies, DevEx, Documentation). For every finding record: what, where (file:line), why it matters, and severity (Critical/High/Medium/Low). Also note strengths.

**Phase 3: Improvement Strategy**
Identify 3–5 root themes. Define target state, trade-offs, and definition of done.

**Phase 4: Detailed Task Plan**
Break work into tasks with title, description, files affected, acceptance criteria, effort, risk, and dependencies. Organize into Milestones 0–3. Flag Quick Wins.

**Final Deliverable**
Single document with:
- Executive Summary (health grade A–F, top risks, top opportunities)
- Repo Map
- Audit Report
- Improvement Strategy
- Task Plan
- Open Questions

Constraints: Analysis only. Be direct. Calibrate to project maturity.

---

# Completed Audit — 2026-06-10

## Executive Summary

**Health grade: B−** (calibrated to a pre-launch solo-founder project; against a production bar this would be a C+).

Adventure Wales is a content-heavy tourism platform on Next.js 16 / Drizzle / Neon with an unusually sophisticated AI-driven content-operations pipeline. The fundamentals are sound: clean typecheck, static-first rendering with selective ISR, parameterized SQL throughout, Zod validation on API mutations, verified Stripe webhooks, and active route protection via `src/proxy.ts`. Deliberate engineering investment is visible (security hardening PR #100, Zod rollout PR #102, a lint-debt ratchet, a documented shadcn migration).

**Top risks**

1. **Admin authentication**: one shared plain-text env-var password for all admins, compared with `!==`, no rate limiting on the admin login route (`src/lib/admin-auth.ts:74-85`).
2. **Content split-brain**: four overlapping stores (DB, `content/` markdown, `data/` TS/JSON, CSVs) with only archived one-shot import scripts connecting them; pages render from the DB, so edits elsewhere silently rot.
3. **Test coverage collapse**: 4 test files / 346 source files; CI never runs tests; auth, billing, and all 60+ query functions are untested.
4. **Zero production observability**: no error tracking, no analytics — for a solo founder, that means launch failures go undetected.
5. **Duplication at scale**: ~21 near-identical 900-line activity hub pages plus five 20–36KB hand-maintained data files guarantee divergence over time.

**Top opportunities**

1. A one-day observability + admin-auth hardening pass removes most launch risk.
2. The content-ops control plane is 80% of an excellent system — schema validation, scheduled regeneration, and link checking would close the loop.
3. Collapsing the activity-hub pages into one template would delete ~15–18k lines and make "add an activity" a config change.
4. Repo hygiene (untrack `temp/`, archive 30 stale docs, one STATUS doc) costs hours and permanently improves signal-to-noise.

**Verification note.** An automated reviewer flagged `src/proxy.ts`'s named export as a critical "middleware never runs" bug. This was checked against the Next.js 16 docs shipped with the project and is **false**: `export function proxy(request)` is the documented convention (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md:32`; default export is merely an alternative, line 62). Admin pages and `/api/admin/*` are gated, fail-closed when `ADMIN_PASSWORD` is unset (`src/proxy.ts:29-40`).

---

## Phase 1 — Repo Map

**Stack**: Next.js 16.2.6 (App Router) · React 19.2 · TypeScript 5.9 (strict) · Tailwind 4 + shadcn/radix · Drizzle ORM 0.45 + Neon serverless (HTTP driver) · jose JWT auth · Stripe 20 · Resend · Vercel Blob · Leaflet (dynamic-imported) · Vitest · deployed on Vercel.

**Scale**: 346 TS/TSX files in `src/`; 54 top-level routes; 15+ dynamic routes with `generateStaticParams`; ~20 API route groups; 37+ DB tables; 130 components; 227 markdown files in `content/`; 384 data files in `data/`; 839 tracked files (261MB) in `public/`.

```
src/
  app/                  54 routes: ~21 activity hub mega-pages (900-965 LOC each:
                        hiking, surfing, coasteering, ...), [region]/ (1,183 LOC),
                        activities/[slug], directory/[slug] (1,088 LOC),
                        admin/* (content CRUD, content-ops dashboard, billing),
                        api/* (auth, admin, billing, webhooks/stripe, upload, ...)
  components/           130 files; per-activity dirs (hiking/, surfing/, mtb/, ...)
                        duplicating table/card logic; ui/, seo/ (JSON-LD), maps/
  lib/                  queries.ts (1,331 LOC, 60+ fns), auth.ts (operator JWT),
                        admin-auth.ts, user-auth.ts, api/validate.ts (Zod), stripe.ts
  db/                   schema.ts (1,331 LOC, 37+ tables), index.ts (neon-http)
  proxy.ts              Next.js 16 middleware — protects /admin + /api/admin
data/                   activity-hubs/ (5 × 20-36KB hand-maintained TS),
                        regions/ (11 TS files — UNUSED, zero imports),
                        best-lists/ (30+ JSON, served via lib/best-list-data.ts),
                        combo-pages/, research/ (server-side only)
content/                21 subdirs: regions/, operators/profiles/, safety/ (markdown);
                        ops/ (generated inventory 2MB JSON + CSV, task-queue,
                        source/image registries, status-report.md)
scripts/                content-ops/ (audit-control-plane, generate-agent-tasks,
                        run-swarm — spawns Claude Code workers), archive/ (one-shot
                        DB importers)
tasks/content-ops/      100 generated per-task agent briefs
<root>                  39 .md files (30+ stale since Feb 14), temp/ (319 tracked
                        images), server.log (tracked)
```

**Data flow**: pages render from Neon via `queries.ts` (SSG + `generateStaticParams`, homepage ISR `revalidate: 300`, admin writes call `revalidatePath`). Static `data/activity-hubs/*` is imported at build into hub pages. `content/` markdown reaches the DB only via archived one-shot scripts. The content-ops pipeline (audit → inventory → task queue → Claude worker swarm → research JSON) feeds a read-mostly dashboard at `/admin/content-ops`.

---

## Phase 2 — Audit Report

### Architecture

| # | Finding | Where | Why it matters | Severity |
|---|---------|-------|----------------|----------|
| A1 | Four overlapping content stores (DB, markdown, static TS/JSON, CSV) with no sync; import scripts archived (`scripts/archive/import-content.ts` etc.) | `content/`, `data/`, `src/db` | Edits to non-DB stores never reach rendered pages; founder can't trust any single view of content | **High** |
| A2 | ~21 activity hub pages, 900–965 LOC each, ~90% structurally identical | `src/app/hiking/page.tsx` (935), `src/app/surfing/page.tsx` (965), `src/app/coasteering/page.tsx` (916), … | Every cross-cutting change = ~20 manual edits; divergence already visible | **High** |
| A3 | `data/regions/*.ts` (11 files) has zero imports — superseded by DB but still present | `data/regions/snowdonia.ts` etc. | Classic edit-the-dead-file trap | Medium |
| A4 | 227 markdown files in `content/` not wired to any page | `content/regions/`, `content/operators/profiles/` | Ambiguous status: staging? source of truth? dead? | Medium |
| A5 | Monoliths: `queries.ts` and `schema.ts` both 1,331 LOC; `GuidePageForm.tsx` 986 LOC | `src/lib/queries.ts`, `src/db/schema.ts`, `src/app/admin/content/guide-pages/[id]/GuidePageForm.tsx` | Hard to navigate, test, or safely refactor | Medium |
| A6 | No draft/preview mode despite `status` enums on content tables | `src/db/schema.ts` | Editors can't see unpublished content in situ | Low |

**Strengths**: static-first rendering with `generateStaticParams` across all dynamic routes and no `force-dynamic` anywhere; tag/path-based revalidation wired into admin CRUD; correct Neon HTTP-driver setup (`src/db/index.ts:1-3`); multi-tenant-ready schema; clean separation of operator/admin/user auth domains.

### Code Quality

| # | Finding | Where | Why it matters | Severity |
|---|---------|-------|----------------|----------|
| Q1 | 573 ESLint warnings against a pinned ceiling of 579 (`--max-warnings=579`); top rules: 146 unescaped entities, 114 `no-explicit-any`, 29 `no-img-element` | `package.json:9`, `eslint.config.mjs:16-40` | Ratchet exists but isn't tightening; ceiling is 6 warnings from breach | Medium |
| Q2 | 114 `any` instances incl. 7 in DB query joins | `src/lib/queries.ts:298,599,973,990,1061,1130` | Type holes precisely where data shapes matter most | **High** |
| Q3 | 6 silent `.catch(() => {})` / empty-catch blocks; worst: JSON-parse fallback to `{}` | `src/components/admin/ImageUpload.tsx`, `layout/header.tsx`, `itinerary/EnquireAllVendors.tsx`, `commercial/AdSlot.tsx`, `itinerary/CustomStopForm.tsx`, `ui/ViewTracker.tsx` | Failures surface later as confusing undefineds, or never | **High** |
| Q4 | Error boundaries only at root (`src/app/error.tsx`, `not-found.tsx`); none under `[region]/`, `activities/`, admin | `src/app/` | One failed fetch blanks an entire page | Medium |
| Q5 | Duplicate components both live: `FavoriteButton.tsx` vs `FavouriteButton.tsx`, 11 import sites; flagged Feb 15, unresolved | `src/components/ui/`, `COMPONENT_MIGRATION_AUDIT.md` | Behaviour drift between spellings | Medium |
| Q6 | Five hand-maintained activity data files, 20–36KB each, duplicating DB-held operator/spot data | `src/data/activity-hubs/{caving,surfing,hiking,mountain-biking,coasteering}.ts` | Content drift between hub pages and DB-driven pages | **High** |

**Strengths**: `strict: true` and `tsc --noEmit` passes clean; lint debt is *documented and intentional* (phase annotations in `eslint.config.mjs`); husky + lint-staged gate commits with eslint --fix and a typecheck.

### Security

| # | Finding | Where | Why it matters | Severity |
|---|---------|-------|----------------|----------|
| S1 | Single shared plain-text admin password from env, `password !== adminPassword` (no hash, not timing-safe), same credential for every admin | `src/lib/admin-auth.ts:74-85` | Compromise of one admin or the env var = full CMS + billing control; no per-user revocation | **Critical** (pre-launch: fix before go-live) |
| S2 | No rate limiting on `/api/auth/admin-login` (operator login *is* limited: 5/email/hr, 20/IP/hr) | `src/app/api/auth/admin-login/route.ts` | Combined with S1, admin login is brute-forceable | **High** |
| S3 | Admin CMS body validation is name-whitelist only — every field is `z.unknown().optional()` | `src/lib/api/validate.ts:59-93` | Type-invalid data reaches the DB layer; integrity + crash risk | **High** |
| S4 | Upload route: filename sanitized but user-supplied `contentType` participates in `path.join` for the local-FS fallback | `src/app/api/upload/route.ts:62-89` | Potential path traversal in non-Blob fallback; needs strict enum | Medium |
| S5 | CSP is Report-Only and allows `unsafe-inline`/`unsafe-eval` | `next.config.ts:66-67` | XSS mitigation not actually enforced | Medium |
| S6 | Session lifetimes: user JWT 90d, operator 30d, admin 7d; no revocation/blocklist; logout doesn't invalidate | `src/lib/user-auth.ts:22`, `src/lib/auth.ts:22` | Stolen tokens stay valid for months | Medium |
| S7 | Live secrets in local `.env.local` incl. a dated temp admin password (file correctly gitignored and never committed — verified via `git ls-files` and history) | `.env.local` | Rotate before launch; treat current values as burned once shared/screenshared | Medium |
| S8 | `ws` 8.x moderate CVE (uninitialized memory) in prod dependency tree | `npm audit --omit=dev` | Known vuln; fix available | Medium |

**Strengths (verified)**: `src/proxy.ts` actively gates `/admin` + `/api/admin` and fails closed without `ADMIN_PASSWORD` (`src/proxy.ts:29-40`); operators use rate-limited 48h magic links, no passwords; Stripe webhook signatures verified via `constructEvent` (`src/app/api/webhooks/stripe/route.ts:26`); all SQL parameterized through Drizzle (no injection found); Zod on all mutation routes (PR #102 landed); httpOnly/secure/sameSite cookies in production; HSTS, X-Frame-Options DENY, nosniff set; production build throws without JWT secret (`src/proxy.ts:6-8`).

### Testing

| # | Finding | Where | Why it matters | Severity |
|---|---------|-------|----------------|----------|
| T1 | 4 test files (~232 LOC) for 346 source files; nothing on user auth, Stripe billing, any of the 60+ query functions, or the itinerary engine | `src/lib/__tests__/` (admin-auth, booking, travel-utils), `src/components/__tests__/Skeleton.test.tsx` | No regression safety net where money and access live | **Critical** |
| T2 | CI never runs tests — workflow does typecheck/lint/build only; vitest configured but unused in CI | `.github/workflows/ci.yml`, `vitest.config.ts` | Even the 4 existing tests can silently break | **High** |

**Strengths**: vitest + jsdom correctly configured; tests properly excluded from the build tsconfig; the tests that exist (JWT round-trip, affiliate URL building) test real logic.

### Performance

| # | Finding | Where | Why it matters | Severity |
|---|---------|-------|----------------|----------|
| P1 | 32 raw `<img>` usages vs ~1 `next/image`; 261MB / 839 tracked files in `public/images` | grep across `src/`; `public/` | No format negotiation, responsive sizing, or lazy-load on most images; heavy repo and deploys | Medium |
| P2 | 107 of 346 files are `"use client"` (31%) | `src/` | Acceptable given maps/forms, but worth watching | Low |
| P3 | Homepage fires 7 parallel DB queries inside a 5-min `unstable_cache` | `src/app/page.tsx:39-59` | Fine under ISR; only a concern if cache tags get invalidated hot | Low |

**Strengths**: all Leaflet maps dynamically imported with `ssr: false` and loading skeletons (`src/components/ui/MapView.tsx:2-20`); `optimizePackageImports` for lucide/drizzle and `serverExternalPackages` for sharp/stripe/openai (`next.config.ts:7-11`); no web fonts; large research JSON stays server-side; comprehensive JSON-LD via `src/components/seo/JsonLd.tsx`; `sitemap.ts` + `robots.ts` present; 151 metadata references across routes.

### Dependencies

| # | Finding | Where | Why it matters | Severity |
|---|---------|-------|----------------|----------|
| D1 | `ws` moderate CVE (see S8) | transitive | Fix available via `npm audit fix` | Medium |
| D2 | `openai` (≈40MB) has zero imports in `src/`; possibly only used by scripts or dead | `package.json`, `next.config.ts:7` | Dead weight, larger installs | Low |
| D3 | All deps pinned exact (no `^`) | `package.json` | Reproducible builds (good) but no automatic security patches — needs a periodic update habit | Low |

**Strengths**: modern, coherent stack (Next 16 / React 19 / Tailwind 4 / Zod 4 / Drizzle 0.45); `audit:prod` / `audit:all` scripts exist; CI runs a production-dependency audit.

### DevEx

| # | Finding | Where | Why it matters | Severity |
|---|---------|-------|----------------|----------|
| X1 | `.env.example` missing `GOOGLE_API_KEY`, `PERPLEXITY_API_KEY`, `YOUTUBE_API_KEY` which scripts read | `.env.example` vs `scripts/` | Fresh-machine setup fails confusingly | Medium |
| X2 | 319 `temp/extracted/` images and `server.log` are git-tracked | `git ls-files` | Repo bloat, noisy diffs | Medium |
| X3 | Swarm runner requires Claude Code CLI — undocumented prerequisite | `scripts/content-ops/run-swarm.ts:95` | Pipeline unrunnable without tribal knowledge | Low |
| X4 | 27 npm scripts with no index; content-ops order (audit → tasks → swarm) only discoverable by reading source | `package.json` | Onboarding friction (including future-you) | Low |

**Strengths**: husky + lint-staged commit gates; CI with typecheck/lint/build and stubbed secrets; Drizzle Studio (`db:studio`) for DB inspection; rich script vocabulary once learned.

### Documentation

| # | Finding | Where | Why it matters | Severity |
|---|---------|-------|----------------|----------|
| C1 | 39 root .md files; 30+ untouched since Feb 14 (JULES_* briefs, *_COMPLETE.md, SNAGS.md 35KB, TODO.md ~1 line); plus briefs/, planning/, plans/, playbook/, goals/, jules-tasks/, Jules-Audit/ | repo root | No way to tell current from historical; "what's the status?" has no answer | **High** |
| C2 | README describes the platform vision but not operations — no mention of content-ops pipeline, admin dashboard, or launch state | `README.md` | The most important workflows are undocumented | Medium |
| C3 | Content inventory/status-report stale (generated 2026-06-04); regeneration manual | `content/ops/status-report.md` | The dashboard shows old truth | Medium |

**Strengths**: `STRATEGY.md` (May 18) is a genuine, current strategy doc; `COMPONENT_MIGRATION_AUDIT.md` is a model migration tracker; the generated `status-report.md` is exactly the right artifact — it just needs automation.

### Content-Ops (cross-cutting)

| # | Finding | Where | Why it matters | Severity |
|---|---------|-------|----------------|----------|
| O1 | No schema validation anywhere in the pipeline — gap audit read with silent fallback, swarm worker JSON outputs unvalidated, image/source status inferred by regex keyword matching | `scripts/content-ops/audit-control-plane.ts:29-30, 207-232` | Silent corruption propagates into inventory, dashboard, and decisions | **High** |
| O2 | Commercial decisions recorded to `content/ops/commercial-decisions.json` but never enforced — they change neither inventory status nor DB | `src/app/admin/content-ops/page.tsx:251-394` | Human judgement is captured then ignored by automation | **High** |
| O3 | Hardcoded launch-visibility and priority rules (Snowdonia bias, named operator slugs) and a hardcoded `.slice(0, 100)` task-queue cap | `audit-control-plane.ts:51-83, 268` | Strategy changes require code edits; long tail may never surface | Medium |
| O4 | Swarm has no retry/failure handling; logs local-only, not surfaced in the dashboard | `scripts/content-ops/run-swarm.ts:122-133` | Crashed workers silently drop tasks | Medium |
| O5 | 380KB source-registry of URLs, all "unreviewed", never link-checked; image-registry likewise manually statused | `content/ops/source-registry.json` | Dead citations and missing images undetected | Medium |

**Strengths**: the pipeline design (gap audit → scored inventory with status/gates → generated agent briefs → permission-bounded Claude workers → status report → human commercial-decision layer) is genuinely strong — ahead of what most teams have. Worker permissions are sensibly minimal (Read/Write/Edit/Search + 3 safe Bash commands, 40-turn cap).

---

## Phase 3 — Improvement Strategy

### Theme 1: Make admin access trustworthy
**Target state**: per-user hashed passwords in the existing `adminUsers` table, rate-limited login, rotated secrets, shorter sessions.
**Trade-offs**: ~a day of work, small migration; shared-password convenience is lost (that's the point).
**Done when**: no plain-text comparison in the codebase; admin-login is rate-limited identically to operator login; old `ADMIN_PASSWORD` no longer grants access; secrets rotated.

### Theme 2: One source of truth per content type
**Target state**: a written contract — DB is canonical for everything rendered; `content/` markdown is either an ingestion inbox with a working sync script or moved to `archive/`; `data/activity-hubs/*` is the declared canonical home of curated editorial (or migrated to DB — pick one); dead `data/regions/*` deleted.
**Trade-offs**: deciding is the hard part; either direction beats ambiguity. Markdown→DB sync is real work (~days); declaring-and-archiving is hours.
**Done when**: a `docs/CONTENT_SOURCES.md` table maps every content type to exactly one canonical store, and nothing outside canonical stores has been edited in 30 days.

### Theme 3: Safety net where money and access live
**Target state**: ~30–40 tests covering admin/operator/user auth flows, Stripe webhook event handling, upload validation, and the top-10 query functions; CI runs them; silent catches log.
**Trade-offs**: ~1 week; mocking Neon/Stripe needs initial setup (drizzle + neon-http is easy to fake at the fetch layer; Stripe ships test fixtures).
**Done when**: `npm test` is a required CI step, auth + webhook + upload paths have tests, and zero `.catch(() => {})` without at least a `console.error`.

### Theme 4: Observability for a solo operator
**Target state**: error tracking (Sentry or similar) + Vercel Analytics in production; nightly scheduled `content-ops:audit` + report; weekly link-check over source-registry; swarm run history visible in the dashboard.
**Trade-offs**: small recurring cost; an afternoon to wire.
**Done when**: a thrown error in production produces an alert; the dashboard's data is never more than 24h old; dead links are listed somewhere visible.

### Theme 5: Template out the activity hubs
**Target state**: one `ActivityHubPage` template + per-activity config objects; per-activity component dirs collapse into shared parameterized components; ~15–18k LOC deleted.
**Trade-offs**: the largest item here (1–2 weeks); risk of homogenizing pages that have earned real differences — keep an escape hatch for per-activity custom sections. Do it incrementally, not big-bang.
**Done when**: adding a new activity is a config + data change with no new page file; the 5 hub data files share one validated schema.

---

## Phase 4 — Task Plan

### Milestone 0 — Launch blockers & quick wins (≈2–3 days)

| ID | Task | Files | Acceptance criteria | Effort | Risk | Deps |
|----|------|-------|--------------------|--------|------|------|
| 0.1 ⚡ | `npm audit fix` for `ws` CVE | `package-lock.json` | `npm audit --omit=dev` clean; build passes | XS | Low | — |
| 0.2 | Per-user hashed admin passwords + timing-safe compare | `src/lib/admin-auth.ts`, `src/db/schema.ts` (+migration), seed script | bcrypt/argon2 hashes in `adminUsers`; shared-env-password path removed; login works | M | Med | — |
| 0.3 | Rate-limit `/api/auth/admin-login` (reuse operator limiter) | `src/app/api/auth/admin-login/route.ts`, `src/lib/api/` | 429 after threshold; mirrors operator limits | S | Low | — |
| 0.4 | Rotate `JWT_SECRET`, `ADMIN_PASSWORD`, review other live tokens | `.env.local`, Vercel env | Old values revoked everywhere | S | Low | 0.2 |
| 0.5 | Error tracking + analytics | `src/app/layout.tsx`, config | Test error appears in tracker; page views recorded | S | Low | — |
| 0.6 ⚡ | Untrack `temp/` (319 files) + `server.log`; extend `.gitignore` | `.gitignore` | `git ls-files | grep temp/` returns nothing | XS | Low | — |
| 0.7 ⚡ | Add missing keys to `.env.example`; delete unused `data/regions/*.ts` | `.env.example`, `data/regions/` | Fresh clone + example env runs scripts; build passes after deletion | XS | Low | — |
| 0.8 ⚡ | Real types in `validateCmsBody` for typed fields; enum-allowlist upload `contentType` | `src/lib/api/validate.ts:59-93`, `src/app/api/upload/route.ts` | `{lat:"abc"}` rejected with 400; traversal strings rejected | S | Med | — |

### Milestone 1 — Safety net (≈1 week)

| ID | Task | Files | Acceptance criteria | Effort | Risk | Deps |
|----|------|-------|--------------------|--------|------|------|
| 1.1 | Tests: admin/operator/user auth (token lifecycle, cookie flags, bad creds, rate limit) | `src/lib/__tests__/` | ~12 tests green | M | Low | 0.2 |
| 1.2 | Tests: Stripe webhook handling per event type incl. bad signature | `src/app/api/webhooks/stripe/` tests | ~8 tests green using Stripe fixtures | M | Med | — |
| 1.3 | Tests: top-10 `queries.ts` functions | `src/lib/__tests__/queries.test.ts` | ~10 tests green with mocked neon-http | M | Med | — |
| 1.4 ⚡ | Add `npm test` to CI | `.github/workflows/ci.yml` | Failing test fails the build | XS | Low | 1.1 |
| 1.5 | Log all 6 silent catches; add `error.tsx` to `[region]/`, `activities/[slug]/`, `admin/` | 6 components + 3 routes | No bare `.catch(() => {})`; segment failures show fallback UI | S | Low | — |
| 1.6 | Lint ratchet policy: drop ceiling with every fix batch (579 → 550 → …) | `package.json`, `eslint.config.mjs` | Ceiling ≤500 by end of milestone; never raised | S | Low | — |

### Milestone 2 — Content truth & ops automation (≈1–2 weeks)

| ID | Task | Files | Acceptance criteria | Effort | Risk | Deps |
|----|------|-------|--------------------|--------|------|------|
| 2.1 | Write `docs/CONTENT_SOURCES.md`: one canonical store per content type; archive or wire-up `content/` markdown accordingly | `docs/`, `content/`, `scripts/` | Every content type has exactly one declared home; non-canonical copies archived or synced | M | Med | — |
| 2.2 | Zod schemas for inventory items, task queue, swarm outputs; validate on read/write | `scripts/content-ops/*.ts`, new `scripts/content-ops/schemas.ts` | Malformed research JSON fails loudly with item ID | M | Low | — |
| 2.3 | Nightly scheduled `content-ops:audit` + `content-ops:report` (GitHub Action) | `.github/workflows/` | Dashboard data never >24h old | S | Low | 2.2 |
| 2.4 | Link-checker over `source-registry.json`; failures into the status report | new script, `content/ops/` | Weekly run lists dead URLs | S | Low | 2.2 |
| 2.5 | Enforce commercial decisions: decision file merges into inventory status / launch visibility on audit run | `audit-control-plane.ts`, `page.tsx:251-394` | A `remove_or_block` decision suppresses the item end-to-end | M | Med | 2.2 |
| 2.6 | Surface swarm run history + per-task success/failure in `/admin/content-ops` | `src/app/admin/content-ops/`, `run-swarm.ts` | Failed worker runs visible without reading log files | M | Low | — |
| 2.7 | Move config out of code: visibility/priority rules + queue cap into a config file | `audit-control-plane.ts:51-83,268` | Strategy change = config edit, no code change | S | Low | — |
| 2.8 ⚡ | Doc sweep: 30+ stale root .md → `archive/`; write `STATUS.md`; update README with content-ops workflow | repo root, `README.md` | ≤6 root .md files; STATUS.md answers "what's the state?" in one screen | S | Low | — |

### Milestone 3 — Structural debt (≈2–3 weeks, post-launch)

| ID | Task | Files | Acceptance criteria | Effort | Risk | Deps |
|----|------|-------|--------------------|--------|------|------|
| 3.1 | `ActivityHubPage` template; migrate 3 pilot activities, then the rest in batches | `src/app/{activity}/page.tsx` ×21, new template + config | Pilot pages pixel-equivalent; each migrated page deletes ~800 LOC | L | Med | 1.* |
| 3.2 | Shared schema + consolidation for the 5 activity-hub data files | `src/data/activity-hubs/*` | One Zod-validated shape; drift detectable | M | Med | 3.1 |
| 3.3 | Split `queries.ts` by domain (content / operators / commerce / analytics) | `src/lib/queries.ts` → `src/lib/queries/` | No file >400 LOC; 7 `any`s in joins replaced with typed results | M | Med | 1.3 |
| 3.4 | Merge FavoriteButton/FavouriteButton (pick UK spelling, site is Welsh) | `src/components/ui/`, 11 import sites | One component; zero dual imports | S | Low | — |
| 3.5 | Migrate 32 raw `<img>` to `next/image`; audit/prune 261MB `public/images` (consider Blob/CDN for the bulk) | components, `public/` | `no-img-element` warnings → 0; repo-tracked image weight cut substantially | M | Low | — |
| 3.6 | Enforce CSP: nonce-based scripts, drop `unsafe-inline`/`unsafe-eval`, switch from Report-Only | `next.config.ts:66-67` | Enforcing CSP, no violation reports for 2 weeks prior | M | Med | 0.5 |
| 3.7 | Shorten sessions (user 90d→30d, operator 30d→14d) + minimal revocation (token version claim) | `src/lib/{user-auth,auth,admin-auth}.ts` | Logout invalidates; durations reduced | M | Med | 1.1 |
| 3.8 | Remove `openai` if confirmed unused; quarterly dependency-update routine | `package.json` | Decision documented; deps ≤1 quarter stale | S | Low | — |

**Quick Wins** (⚡): 0.1, 0.6, 0.7, 0.8, 1.4, 2.8 — collectively under a day, disproportionate payoff.

---

## Open Questions

1. **Markdown's role**: is `content/` (227 files) an authoring inbox that should sync to the DB, or research staging to archive? Milestone 2.1 needs this decision first.
2. **Activity hub data**: migrate `src/data/activity-hubs/*` into the DB (admin-editable, one store) or keep as code-reviewed editorial config? Both defensible; pick one before 3.2.
3. **Is `openai` used anywhere** (scripts? planned feature)? Zero imports in `src/`; confirm `scripts/` before removing.
4. **Multi-tenant ambition**: the `sites` table and France component references suggest multi-region plans. If real, the activity-template work (3.1) should anticipate per-site config; if not, simplify.
5. **Swarm scale**: with 1,526 items needing QA and 123 needing research, what's the intended cadence — and should swarm execution itself move to CI/cron instead of a local machine?
6. **The temp admin password in `.env.local` is dated June 3** — has it been shared with anyone (contractors, screen shares)? That determines rotation urgency.
