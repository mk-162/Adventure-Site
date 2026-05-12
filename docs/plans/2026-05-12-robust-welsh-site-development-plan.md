# Robust Welsh Site — Phased Development Plan

**Date:** 2026-05-12
**Goal brief:** `docs/plans/robust-welsh-site-goal-brief.md`
**Author:** Claude (planning pass only — no code changes in this iteration)
**Target:** Adventure Wales is safe to deploy, technically stable, and operationally maintainable.

This plan turns the audit evidence in `audit/claude-output-ADV-12.json`, `docs/ERROR-AUDIT.md`, and `docs/SITE_STRUCTURE_AUDIT.md` into a phased, bite-sized work programme suitable for Claude Code to execute in subsequent passes.

---

## 1. Current Risk Summary (verified against repo, 2026-05-12)

Each item below was confirmed by reading the current source — the audit reports pre-date several fixes, so this section is the authoritative starting point.

### A. Already fixed (do **not** re-do)

| Audit claim | Current state | Evidence |
|---|---|---|
| `/api/admin/*` not protected by middleware | Fixed | `src/middleware.ts:91` matcher = `["/admin/:path*", "/api/admin/:path*"]` |
| `/api/upload` has no auth | Partially fixed (weak check) | `src/app/api/upload/route.ts:21-26` — see Phase 1 |
| `DATABASE_URL` non-null assertion | Fixed | `src/db/index.ts:5-8` throws if unset |
| No root error boundary | Fixed | `src/app/error.tsx` exists |
| `src/lib/auth.ts` has `"dev-secret"` JWT fallback | Fixed for operator auth | `src/lib/auth.ts:4-7` throws if unset |
| Hub-routing duplicate content | Partially mitigated | `next.config.ts:34-69` has `/activities/type/:slug → /:slug` and `/activities/:slug → /:slug` redirects |
| `heroImage` schema/query mismatch | Fixed | `heroImage` columns exist in `src/db/schema.ts:105,128,254,421,1078,1175`; `src/app/api/search/route.ts` references resolve |
| `.env.example` missing `DATABASE_URL` | Fixed | Present at top of file |

### B. Genuine production blockers (still open) — **Phase 1**

1. **Open-admin footgun.** `src/middleware.ts:17-23` — if `ADMIN_PASSWORD` is unset (e.g. wrong env, typo), the middleware short-circuits with `NextResponse.next()` and every `/admin` + `/api/admin` route is public. One missing env var = full DB compromise.
2. **`"dev-secret"` JWT fallback (admin).** `src/middleware.ts:5` and `src/lib/admin-auth.ts:7` both fall back to the literal `"dev-secret"` if `JWT_SECRET`/`ADMIN_SECRET` are unset — an attacker who knows this default can forge admin tokens.
3. **Legacy raw-password cookie backdoor.** `src/middleware.ts:44-47` and `src/lib/admin-auth.ts:38-48` accept the literal `ADMIN_PASSWORD` value as a session cookie, bypassing JWT entirely. Combined with the basic-auth handler at `src/middleware.ts:51-71` (which sets the password as the cookie), this is a session-token-equals-password design.
4. **`/api/mcp` is fully public.** `src/app/api/mcp/route.ts:377-389` exposes full-text DB search to any caller with no API key, no allow-list, no rate limit.
5. **Login magic-link has no rate limit.** `src/app/api/auth/login/route.ts:31` — only a comment.
6. **Weak upload auth.** `src/app/api/upload/route.ts:23` — `request.headers.get("cookie")?.includes("admin_token")` is substring match on a raw header; not a JWT verify. Anyone who can set any cookie containing the string `admin_token` (e.g. `admin_tokenisbogus=1`) passes the check.
7. **Dynamic CMS API accepts arbitrary bodies.** `src/app/api/admin/[contentType]/route.ts:171-187` does `db.insert(table).values(body)` directly from `request.json()`. PATCH (200-229) and the param-name-as-filter loop (116-122) have the same problem — any URL param matching a column becomes a filter, and any JSON key matching a column gets inserted.
8. **Error messages leak DB internals.** `src/app/api/admin/[contentType]/route.ts:155,191,234,273` and `src/app/api/admin/billing/route.ts:132` return `error.message` (and DB column names) verbatim to clients.
9. **Billing DB call outside try/catch.** `src/app/api/admin/billing/route.ts:24-30` — connection failure throws an unhandled error and no JSON response.
10. **`CREATE TABLE` on every POST.** `src/app/api/operator-interest/route.ts:25-37` runs DDL on every public POST.
11. **No security headers.** `vercel.json` is `{}`; `next.config.ts` has no `headers()`. Missing CSP, `X-Frame-Options`, `Referrer-Policy`, `X-Content-Type-Options`, `Strict-Transport-Security`.
12. **Two next.config files.** `next.config.js` (empty comment) and `next.config.ts` (real config) co-exist — Next's resolution order can shadow the TS config silently.

### C. Reliability / build-quality blockers — **Phase 2**

13. **`lint` script is broken.** `package.json:9` — `"lint": "eslint"` with no path. Need `eslint .` or equivalent.
14. **`scripts/` excluded from typecheck.** `tsconfig.json:36` excludes the entire `scripts/` tree — all seed/import scripts are unchecked.
15. **No CI.** No `.github/` directory exists. Nothing catches type/lint/build regressions before deploy.
16. **No pre-commit gate.** No husky, no lint-staged.
17. **113 `as any` / `eslint-disable` markers** in admin CMS, Stripe webhook, bulk route (confirmed in `src/app/api/admin/[contentType]/route.ts`, `src/app/api/admin/bulk/route.ts`, billing route `current_period_end as number` at line 118).

### D. Data integrity / API hygiene — **Phase 3**

18. No Zod (or equivalent) schema validation across the API surface — confirmed: `package.json` has no `zod`.
19. Dual JWT libraries (`jsonwebtoken` + `jose`) used in different layers; admin auth uses `jsonwebtoken` server-side and `jose` in middleware — divergence risk.
20. Dual Postgres clients (`@neondatabase/serverless` + `@vercel/postgres`) — operator-interest route still uses `@vercel/postgres` raw SQL.

### E. Test/coverage gap — **Phase 4**

21. Zero tests anywhere in the repo. No `vitest`/`jest`/`playwright` deps.
22. No `test` script in `package.json`.

### F. SEO / route architecture — **Phase 5**

23. Hub pages (`/mountain-biking` etc.) not in `sitemap.ts`. Canonical tags missing from competing pages. (Per `docs/SITE_STRUCTURE_AUDIT.md`; redirects partially in place, but sitemap + canonicals are not.)
24. Home-page search routes to `/search?activity=…` which is broken/empty (per audit; verify in Phase 5).

### G. Performance / a11y polish — **Phase 6**

25. `remotePatterns` is permissive (`**.unsplash.com`, `**.googleusercontent.com`).
26. No bundle analyzer, no Lighthouse CI, no Web Vitals reporting.
27. Filter-component duplication (per audit) is **code debt, not a blocker** — defer.

### Phase mapping

| Phase | Items | Outcome |
|---|---|---|
| 0 | Baseline | Confirmed safe starting point |
| 1 | B1–B12 | No deploy-once-and-you're-pwned footguns |
| 2 | C13–C17 | Green typecheck/lint/build on every PR |
| 3 | D18–D20 | Validated inputs, consolidated libs |
| 4 | E21–E22 | Regression safety on auth + payments |
| 5 | F23–F24 | Canonical SEO + working internal links |
| 6 | G25–G27 | Headers + bundle + a11y polish |

---

## 2. Safety Rules (apply to every phase)

1. **Do not read or print secrets.** Never echo `.env`. If a file must be read for type-only purposes, redact values.
2. **Do not commit `.env` files.** Always update `.env.example` (placeholders only).
3. **Do not push to `main`.** All work goes on feature branches; merges via PR.
4. **Small commits.** One concern per commit; phase-1 branches stay ≤ ~300 LOC each.
5. **External behaviour stable.** Public URLs keep working unless an intentional 301 is added (Phase 5 only).
6. **No destructive git ops** (`reset --hard`, `push --force`, branch deletes) without explicit user approval.
7. **No `--no-verify`** on commits — once husky is installed in Phase 2, hooks must pass.
8. **`db:push` is risky.** Drizzle's `push` applies schema directly. Prefer `db:generate` + `db:migrate` for any schema change introduced by this plan.
9. **Verify before recommending.** Re-grep each file before editing — the audit is a snapshot, not ground truth.
10. **One file rewrite at a time.** For files >300 LOC, use `Edit` with anchored snippets, not full `Write`.

---

## 3. Verification Commands (use after every phase)

```bash
# Typecheck (must pass cleanly)
npx tsc --noEmit

# Lint (after Phase 2 fix to the lint script)
npm run lint

# Build (real production build; fails closed if env-guards trip)
npm run build

# Tests (added in Phase 4; runs zero specs until then)
npm test

# Local smoke (start dev server and curl the key routes)
npm run dev &
sleep 5
curl -sf http://localhost:3000/                              # home
curl -sf http://localhost:3000/snowdonia                     # region hub
curl -sf http://localhost:3000/mountain-biking               # activity hub
curl -sfI http://localhost:3000/api/admin/operators          # expect 401
curl -sfI http://localhost:3000/api/upload -X POST           # expect 401
curl -sf  http://localhost:3000/api/mcp -X POST -d '{}'      # expect 401 (after Phase 1.4)
kill %1
```

---

## 4. Phase 0 — Baseline & Branch Hygiene

**Goal:** confirm green starting line before any rework.

### 0.1 Branch off `main`
- **Files:** none
- **Steps:** `git checkout -b chore/robustness-phase-0`
- **Acceptance:** clean working tree on a new branch.
- **Commit:** none (preparation only).

### 0.2 Capture baseline output
- **Files:** none (write to `audit/baseline-2026-05-12.txt`, gitignored).
- **Steps:** run typecheck, lint (note the broken script), build.
- **Acceptance:** baseline counts of TS errors / lint errors / build status recorded for comparison after each later phase.

### 0.3 Tidy stray top-level files
- **Files to triage** (currently untracked per `git status`):
  - `AUDIT-BRIEF.md`, `CONTENT-ENGINE-PLAN.md`, `CONTENT-MANAGEMENT-SYSTEMS.md`, `CONTENT-SYSTEMS-MAP.md`, `JULES-AUDIT-SESSION.md`, `audit/`, `docs/plans/`.
- **Action:** decide which to commit (this plan + audit JSON belong in repo), which to `.gitignore` (anything with operational secrets).
- **Acceptance:** `git status` is clean (or only contains intentional working files).
- **Commit:** `chore: add audit artefacts and planning docs`

---

## 5. Phase 1 — Critical Security / Auth / Env Hardening

**Goal:** make it impossible to deploy a vulnerable build. Every item below is a one-bad-env-var-away footgun in the current state.

**Branch:** `security/phase-1-hardening`. Each task = one commit.

### 1.1 Remove `"dev-secret"` JWT fallback
- **Files:** `src/middleware.ts:5`, `src/lib/admin-auth.ts:7`
- **Change:** read `JWT_SECRET` (or `ADMIN_SECRET`) once; if missing **and** `NODE_ENV === "production"`, throw at module load. In non-prod, allow a noisy `console.warn` once, never the string `"dev-secret"`.
- **Acceptance:**
  - Search confirms no occurrence of `"dev-secret"` in `src/` after change.
  - Production build with missing `JWT_SECRET` fails fast at startup, not at request time.
- **Commit:** `security(auth): remove dev-secret JWT fallback`

### 1.2 Close the open-admin footgun
- **Files:** `src/middleware.ts:17-23`
- **Change:** if `ADMIN_PASSWORD`/`ADMIN_SECRET` is missing **in production**, deny all `/admin` and `/api/admin` requests (return 503 or redirect to a configured-misconfigured page). In dev, only allow when `NODE_ENV === "development"` AND an explicit `ALLOW_OPEN_ADMIN_DEV=1` is set.
- **Acceptance:**
  - With `NODE_ENV=production` and no `ADMIN_PASSWORD`, hitting `/admin` returns 503 (or 401), never 200.
  - Manual curl test passes.
- **Commit:** `security(admin): fail closed when admin secret is missing`

### 1.3 Retire the raw-password cookie path
- **Files:** `src/middleware.ts:44-71`, `src/lib/admin-auth.ts:38-48,65-82`
- **Change:** delete the legacy `if (adminToken === adminPassword)` branch; remove the basic-auth handler that **stores the password as the cookie value** (replace with a proper basic-auth → JWT exchange or remove entirely if admins log in via `/admin/login`). Keep JWT verification as the only accepted session.
- **Acceptance:**
  - No code path in `src/` compares a cookie value to `ADMIN_PASSWORD` directly.
  - `/admin` login still works via the `/admin/login` page.
- **Commit:** `security(admin): remove legacy password-as-cookie session path`

### 1.4 Lock down `/api/mcp`
- **Files:** `src/app/api/mcp/route.ts`
- **Change:** require an `Authorization: Bearer ${MCP_API_KEY}` header; reject otherwise with 401. Add a constant-time string compare (`crypto.timingSafeEqual`). Document the key in `.env.example`.
- **Optional:** allow an "introspection" subset (`initialize`, `tools/list`) without a key, but require the key for `tools/call`.
- **Acceptance:**
  - `curl -X POST /api/mcp -d '{"method":"tools/call"}'` returns 401 without the header.
  - With the header, behaviour unchanged.
- **Commit:** `security(mcp): require bearer token for tools/call`

### 1.5 Add Zod validation + remove `error.message` leakage on dynamic CMS API
- **Files:**
  - `src/app/api/admin/[contentType]/route.ts` (full review of GET/POST/PATCH/DELETE)
  - new `src/lib/api/validate.ts` (helper)
- **Change:**
  1. Add `zod` to `dependencies`.
  2. Build a per-content-type Zod schema map (start with the seven tables in `tableMap` — pick the columns we actually want to allow writing).
  3. In POST/PATCH: `schema.parse(body)`; on failure return `{ error: "Validation failed", issues }` with 400.
  4. Replace `column in table` param-loop (lines 116-122) with an allow-list per content type (do **not** trust dynamic key matching).
  5. Replace `error.message` returns (lines 155, 191, 234, 273) with `{ error: "Internal error" }` + log full error server-side.
- **Acceptance:**
  - Posting an unknown field returns 400, not a DB error.
  - Posting a known-good payload still works (manually verified in /admin UI).
  - No 500 response includes `error.message` text from PG.
- **Commit:** `security(cms-api): zod-validate bodies and stop leaking errors`

### 1.6 Fix `/api/upload` auth check
- **Files:** `src/app/api/upload/route.ts:21-26`
- **Change:** replace the `cookie.includes("admin_token")` substring match with a real check: read `admin_token` cookie value, call `verifyAdminToken` (or the jose equivalent), and accept either a valid admin JWT or a valid operator session.
- **Acceptance:**
  - `curl -X POST /api/upload --cookie "admin_tokenfoo=bar"` → 401.
  - With a valid admin JWT cookie, upload still works.
- **Commit:** `security(upload): properly verify admin token instead of substring match`

### 1.7 Rate-limit auth endpoints
- **Files:**
  - `src/app/api/auth/login/route.ts`
  - `src/app/api/auth/claim/route.ts` (verify exists; throttle if so)
  - new `src/lib/rate-limit.ts`
- **Change:** add a lightweight in-memory token-bucket keyed by `email` + IP for dev, and document that production should swap in `@upstash/ratelimit` via env. Default: **5 magic links per email per hour, 20 per IP per hour**.
- **Acceptance:** 6th request from same email in <1h returns 429.
- **Commit:** `security(auth): rate-limit magic-link requests`

### 1.8 Stop creating tables at request time
- **Files:** `src/app/api/operator-interest/route.ts:25-37`
- **Change:** remove the inline `CREATE TABLE`; rely on Drizzle migration. If the table is missing in the schema, add it in `src/db/schema.ts` and generate a migration (see safety rule 8 — prefer `db:generate` over `db:push`).
- **Acceptance:** route no longer runs DDL. New migration file committed under `drizzle/`.
- **Commit:** `chore(db): move operator_interest table to drizzle schema`

### 1.9 Fix billing route's pre-try DB call
- **Files:** `src/app/api/admin/billing/route.ts:24-30`
- **Change:** wrap the entire handler body (or move the `operator` lookup) inside the existing try/catch so a DB connection failure returns JSON 500, not a thrown error.
- **Acceptance:** simulated DB failure returns `{"error":"Internal error"}` with 500.
- **Commit:** `fix(billing): handle DB failure with JSON response`

### 1.10 Security headers
- **Files:** `next.config.ts` (add a `headers()` function), optionally `vercel.json`.
- **Change:** add baseline headers for all routes:
  ```
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY (or use CSP frame-ancestors)
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  ```
  Add a **report-only** CSP first (`Content-Security-Policy-Report-Only`) so we don't break the site; tighten in Phase 6.
- **Acceptance:** `curl -I /` shows all five headers.
- **Commit:** `security(headers): add baseline security headers + CSP report-only`

### 1.11 Delete the empty `next.config.js`
- **Files:** delete `next.config.js`; keep `next.config.ts`.
- **Acceptance:** only one config file remains; `npm run build` still succeeds.
- **Commit:** `chore(config): remove stub next.config.js (shadowed next.config.ts)`

### 1.12 Complete `.env.example`
- **Files:** `.env.example`
- **Change:** add placeholders (values empty) for every env var referenced in source. From a quick grep we need at least:
  - `ADMIN_PASSWORD`, `ADMIN_SECRET`
  - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_VERIFIED_PRICE_ID`, `STRIPE_PREMIUM_PRICE_ID`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - `OPENAI_API_KEY`
  - `MCP_API_KEY` (new in 1.4)
  - `NODE_ENV`
  - `ALLOW_OPEN_ADMIN_DEV` (new in 1.2)
- **Acceptance:** run `node -e "require('dotenv').config({path:'.env.example'})"`; build a script that asserts every `process.env.X` referenced under `src/` either has a guard or appears in `.env.example`.
- **Commit:** `docs(env): complete .env.example with all referenced variables`

### Phase 1 exit gate
- All 12 items merged.
- Verification commands pass.
- Deploy a Vercel **preview** with intentionally missing `ADMIN_PASSWORD` → confirm `/admin` returns 503, not 200.

---

## 6. Phase 2 — Build / Type / Lint Reliability

**Branch:** `infra/phase-2-build-gates`.

### 2.1 Fix the lint script
- **Files:** `package.json:9`
- **Change:** `"lint": "next lint"` (recommended for Next 16) or `"lint": "eslint . --max-warnings=0"`.
- **Acceptance:** `npm run lint` completes and lists either zero issues or a known list we then clean.
- **Commit:** `fix(lint): use working eslint invocation`

### 2.2 Include `scripts/` in typecheck (read-only first)
- **Files:** `tsconfig.json:36`
- **Change:** remove `"scripts"` from `exclude`. Expect new errors — fix the obvious ones; for unfixable scripts, add a per-file `// @ts-nocheck` with a TODO and an open follow-up.
- **Acceptance:** `npx tsc --noEmit` completes; new errors documented.
- **Commit:** `chore(ts): include scripts/ in typecheck`

### 2.3 Run typecheck, capture current errors, fix the deploy-blocking ones
- **Files:** any files producing TS errors.
- **Acceptance:** `npx tsc --noEmit` exits 0.
- **Commit:** one per logical group (e.g. `fix(types): null guards on itinerary.durationDays`).

### 2.4 Add CI workflow
- **Files:** new `.github/workflows/ci.yml`
- **Change:** on push + PR:
  1. checkout
  2. setup-node@v4 (Node 24 LTS)
  3. `npm ci`
  4. `npx tsc --noEmit`
  5. `npm run lint`
  6. `npm run build` (with secrets stubbed via GitHub Actions env)
- **Acceptance:** CI green on the PR that adds the file.
- **Commit:** `ci: add typecheck + lint + build pipeline`

### 2.5 Pre-commit hooks
- **Files:**
  - `package.json` — add `husky`, `lint-staged` as devDeps; add `prepare` script.
  - `.husky/pre-commit` — runs `npx lint-staged`.
  - `.lintstagedrc.json` — `{ "*.{ts,tsx}": ["eslint --fix", "bash -c 'tsc --noEmit'"] }`.
- **Acceptance:** committing a file with a deliberate type error fails locally.
- **Commit:** `chore: add husky + lint-staged pre-commit hooks`

### 2.6 Delete `audit-complete.txt`, `cta-audit-done.txt` cruft if no longer needed
- **Acceptance:** repo root is cleaner.
- **Commit:** `chore: drop stale audit marker files`

### Phase 2 exit gate
- `npx tsc --noEmit` exits 0.
- `npm run lint` exits 0.
- `npm run build` exits 0.
- CI is green on `main`.

---

## 7. Phase 3 — API Validation & Data Integrity

**Branch:** `infra/phase-3-api-validation`.

### 3.1 Add Zod schemas for every public API route
- **Files:** all routes under `src/app/api/` (≈25 routes). Group into ~5 PRs:
  1. `auth/*`
  2. `admin/*` (extend Phase 1.5)
  3. `webhooks/stripe/*`
  4. `operators/*`, `user/*`, `claim/*`
  5. `newsletter/*`, `subscribe/*`, `operator-interest/*`, `track/*`, `track-view/*`, `ads/*`, `posts/*`, `tags/*`, `alternatives/*`, `weather/*`, `events/*`, `itineraries/*`, `billing/*`
- **Pattern:**
  ```ts
  const Body = z.object({ ... });
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  ```
- **Acceptance:** every POST/PATCH handler validates its input; no `await req.json()` returns into a DB write without parse.
- **Commit cadence:** one commit per route group, each ≤ 5 files.

### 3.2 Consolidate JWT libraries
- **Files:** `src/lib/admin-auth.ts`, `src/lib/auth.ts`, `src/lib/user-auth.ts`, `src/middleware.ts`
- **Change:** drop `jsonwebtoken`, use `jose` everywhere (edge-compatible, supports both server and middleware).
- **Acceptance:** `package.json` no longer lists `jsonwebtoken`; all auth tests still pass.
- **Commit:** `refactor(auth): consolidate on jose`

### 3.3 Consolidate Postgres clients
- **Files:** `src/app/api/operator-interest/route.ts` (the only `@vercel/postgres` consumer once 1.8 is done).
- **Change:** route through Drizzle (`db.insert(operatorInterest).values(...)`). Remove `@vercel/postgres` from deps.
- **Acceptance:** no `import { sql } from "@vercel/postgres"` in `src/`.
- **Commit:** `refactor(db): drop @vercel/postgres in favour of drizzle/neon-http`

### 3.4 Reduce `as any` in admin CMS surface
- **Files:** `src/app/api/admin/[contentType]/route.ts`, `src/app/api/admin/bulk/route.ts`, `src/app/api/admin/billing/route.ts`
- **Change:** with Zod schemas in place, replace `Record<string, any>` table maps with a typed `ContentTypeRegistry` and remove the `as any` cast on Drizzle builders by using `db.query[contentType].findMany(...)`.
- **Acceptance:** `grep -c 'as any' src/app/api/admin/ → < 10`.
- **Commit:** `refactor(admin-api): tighten types on dynamic CMS routes`

### Phase 3 exit gate
- Sending an invalid body to any API route returns 400 with a generic message.
- `npm run build` still succeeds.
- Only one JWT lib and one Postgres client in `package.json`.

---

## 8. Phase 4 — Test Coverage & CI Gates

**Branch:** `infra/phase-4-tests`.

### 4.1 Add Vitest
- **Files:** new `vitest.config.ts`, new `tests/` directory, `package.json` (add `vitest`, `@vitest/coverage-v8`, `"test": "vitest run"`, `"test:watch": "vitest"`).
- **Acceptance:** `npm test` runs and reports zero specs (passing).
- **Commit:** `chore(test): scaffold vitest`

### 4.2 Unit tests for security-critical code
- **Files (new tests):**
  - `tests/lib/admin-auth.test.ts` — `verifyAdminToken` rejects forged tokens, rejects raw-password cookies (regression for Phase 1.3), rejects expired JWTs.
  - `tests/lib/auth.test.ts` — operator JWT round-trip + invalid token paths.
  - `tests/lib/rate-limit.test.ts` — bucket behaviour from Phase 1.7.
- **Acceptance:** 3 test files, all passing locally and in CI.
- **Commit:** `test(auth): cover admin + operator token verification`

### 4.3 Integration tests for the dynamic CMS API
- **Files (new):** `tests/api/admin-contenttype.test.ts`
- **Approach:** mock Drizzle's `db` with `vi.mock`; assert that:
  - GET with unauthenticated cookie returns 401.
  - POST with invalid body returns 400 (regression for Phase 1.5).
  - POST with valid body inserts and returns 200.
- **Acceptance:** suite passes; coverage of the route file > 70%.
- **Commit:** `test(admin-api): cover validation and auth paths`

### 4.4 Stripe webhook signature verification test
- **Files (new):** `tests/api/stripe-webhook.test.ts`
- **Approach:** verify that an unsigned/forged body returns 400; a signed body (using test secret) returns 200 and updates the operator row.
- **Acceptance:** suite passes.
- **Commit:** `test(stripe): cover webhook signature verification`

### 4.5 Smoke test critical pages (Playwright optional, defer if heavy)
- **Files (new, lightweight):** `tests/smoke/routes.test.ts` — for each of `/`, `/snowdonia`, `/mountain-biking`, `/destinations`, `/itineraries`, `/events`, hit the page in a Node `fetch` against a built server and assert 200 + non-empty HTML.
- **Acceptance:** smoke passes against `npm run start`.
- **Commit:** `test(smoke): assert critical pages return 200`

### 4.6 Wire tests into CI
- **Files:** `.github/workflows/ci.yml`
- **Change:** add a `test` job (after build). Cache `~/.npm`.
- **Acceptance:** CI runs tests on every PR; red build blocks merge.
- **Commit:** `ci: run tests on every PR`

### Phase 4 exit gate
- All test suites pass locally and in CI.
- Coverage report exists (no hard threshold yet — set ≥ 60% for auth + payment files in Phase 6 polish).

---

## 9. Phase 5 — Route / SEO Architecture Cleanup

**Branch:** `seo/phase-5-canonicalisation`.

Per `docs/SITE_STRUCTURE_AUDIT.md`. Phase 1 redirects in `next.config.ts` already cover `/activities/type/:slug` and `/activities/:slug` → `/:slug`. The remaining gaps are canonical tags, sitemap entries, and broken internal search routing.

### 5.1 Add canonical tags to surviving competing pages
- **Files:**
  - `src/app/[region]/things-to-do/[activity-type]/page.tsx` — `metadata.alternates.canonical = '/${activityType}'`
  - `src/app/guides/[slug]/page.tsx` (if it still overlaps a hub)
- **Acceptance:** view-source on the page shows `<link rel="canonical" href="/mountain-biking">`.
- **Commit:** `seo(canonical): point region+activity combos at the activity hub`

### 5.2 Add hubs to sitemap
- **Files:** `src/app/sitemap.ts`
- **Change:** push the five+ activity hubs (`mountain-biking`, `coasteering`, `hiking`, `surfing`, `caving`, etc. — pull from `activityTypes` table to avoid hardcoding).
- **Acceptance:** `/sitemap.xml` includes every activity-hub URL.
- **Commit:** `seo(sitemap): include activity hub pages`

### 5.3 Fix home-page search
- **Files:** `src/components/home/search-bar.tsx` (per audit, line ~91)
- **Change:** route to `/${activitySlug}` when an activity is picked, instead of the broken `/search?activity=…`. Keep `/search` working as a generic full-text page (or 301 it).
- **Acceptance:** searching for "mountain biking" from home goes to `/mountain-biking`, not `/search?...`.
- **Commit:** `fix(search): route home search to activity hubs`

### 5.4 Audit internal links to deprecated routes
- **Files:** any source referencing `/book` (audit notes `header.tsx:68,121`) and `/search?activity=`.
- **Change:** replace with the canonical destination (`/trip-planner`, `/:activity`) to avoid redirect hops.
- **Acceptance:** `grep -rn '/book' src/components src/app/components` returns only the redirect declaration.
- **Commit:** `seo(links): swap deprecated internal routes for canonical ones`

### Phase 5 exit gate
- Sitemap manually inspected, includes hubs.
- Curl every hub: response includes `rel="canonical"`.
- No 301 hop on the home-page search flow.

---

## 10. Phase 6 — Performance / Accessibility Polish

**Branch:** `polish/phase-6`.

These are quality issues, not blockers. Take only as time allows.

### 6.1 Tighten image `remotePatterns`
- **Files:** `next.config.ts:11-30`
- **Change:** drop the wildcard `**.unsplash.com`; whitelist the specific hosts actually used.
- **Acceptance:** no third-party image origin allowed unless listed.
- **Commit:** `perf(images): tighten allowed remote image hosts`

### 6.2 Enforce CSP (move from report-only to enforcing)
- **Files:** `next.config.ts` headers().
- **Acceptance:** browser DevTools shows no CSP violations on the top 5 routes.
- **Commit:** `security(csp): move CSP from report-only to enforcing`

### 6.3 Bundle analyzer pass
- **Tools:** `@next/bundle-analyzer`.
- **Action:** run once, identify any client component that should be a server component (per audit: `lucide-react`, `radix-ui` optimisation already exists in config).
- **Commit:** `perf(bundle): split client/server boundaries`

### 6.4 A11y sweep on top 5 templates
- **Files:** Home, region hub, activity hub, activity detail, directory detail.
- **Action:** alt text, form labels, focus rings. No template re-design.
- **Commit:** one per template.

### 6.5 Coverage threshold
- **Files:** `vitest.config.ts`
- **Change:** require ≥ 60% on `src/lib/auth*`, `src/lib/admin-auth*`, `src/app/api/admin/**`, `src/app/api/auth/**`, `src/app/api/webhooks/**`.
- **Commit:** `test(coverage): enforce thresholds on security-critical paths`

### Phase 6 exit gate
- Lighthouse ≥ 90 on Home + a region hub + an activity hub.
- CSP enforced, no violations.
- Coverage report meets thresholds.

---

## 11. Commit Strategy

- **One concern per commit.** Tasks above are sized so each = 1 commit unless explicitly split.
- **Conventional Commits prefix:**
  - `security(...)` for Phase 1.1–1.10, 6.2.
  - `fix(...)` for bugs (1.6, 1.9, 5.3).
  - `chore(...)` for infra/cleanup (1.11, 1.12, 2.6, 3.2/3.3 if no behaviour change).
  - `refactor(...)` for typing-only changes (3.4).
  - `feat(...)` only when adding new user-visible behaviour (1.4 MCP key, 5.2 sitemap entries).
  - `test(...)` for Phase 4.
  - `ci(...)` for `.github/workflows/`.
  - `seo(...)` for Phase 5.
  - `perf(...)` for Phase 6.
- **PRs:** one PR per phase, with the phase exit gate as the PR checklist.
- **No squash on merge** for Phase 1 (we want each security commit to stand alone in the history).

---

## 12. Definition of Done

The Welsh site is "robust enough to deploy" when every box below is ticked:

### Security (Phase 1)
- [ ] No `"dev-secret"` string anywhere in `src/`.
- [ ] Production build fails fast when `JWT_SECRET` or `ADMIN_PASSWORD` is unset.
- [ ] No code path treats `ADMIN_PASSWORD` as a session cookie value.
- [ ] `/api/mcp` `tools/call` requires `MCP_API_KEY`.
- [ ] Magic-link login is rate-limited.
- [ ] `/api/upload` calls `verifyAdminToken` (or `getOperatorSession`); no substring matching on the Cookie header.
- [ ] Dynamic CMS API rejects unknown fields and returns a generic 500 message.
- [ ] No `error.message` from PG ever reaches the client.
- [ ] Five baseline security headers present on every response; CSP enabled (report-only is acceptable for DoD).
- [ ] One `next.config.*` file in the repo.
- [ ] `.env.example` lists every `process.env.X` referenced under `src/`.

### Build & types (Phase 2)
- [ ] `npx tsc --noEmit` exits 0 (including `scripts/`).
- [ ] `npm run lint` exits 0 (script fixed, baseline issues triaged).
- [ ] `npm run build` exits 0.
- [ ] GitHub Actions CI runs typecheck + lint + build + test on every PR; main is protected.
- [ ] Husky pre-commit gate active.

### API & data (Phase 3)
- [ ] Every API route validates its body with Zod (or equivalent) before touching the DB.
- [ ] One JWT library (`jose`) in `package.json`.
- [ ] One Postgres client (`@neondatabase/serverless` via Drizzle).
- [ ] `as any` count in `src/app/api/admin/` halved relative to baseline.

### Tests (Phase 4)
- [ ] Vitest configured, `npm test` runs in CI.
- [ ] Specs covering admin token verification, operator token, rate limit, dynamic CMS validation, Stripe webhook signature, and route smoke.
- [ ] Coverage report exists.

### SEO (Phase 5)
- [ ] Activity hubs in `sitemap.xml`.
- [ ] Region/activity combo pages emit a canonical to the activity hub.
- [ ] Home-page search routes directly to the hub (no `/search?activity=`).

### Operational
- [ ] A Vercel preview with intentionally missing `ADMIN_PASSWORD` is verified to deny `/admin`.
- [ ] A Vercel preview with intentionally missing `JWT_SECRET` is verified to fail at build (not silently).
- [ ] Runbook entry added to `docs/` (or this file's appendix) explaining how to rotate `JWT_SECRET`, `ADMIN_PASSWORD`, and `MCP_API_KEY`.

---

## 13. Out of Scope (defer)

These are real issues but not required for "robust enough to deploy":

- Filter component refactor (audit duplication).
- Migration to Drizzle migrations for the entire historical schema (only new schema changes in this plan go through migrations).
- Sentry / Datadog integration — useful but not a deploy blocker.
- Per-user admin passwords (currently a shared password gates per-user JWT issuance).
- Lighthouse CI in CI pipeline — manual checks suffice for now.
- Activity hub restructure beyond canonical + sitemap (the `/:activity/:region` reorganisation is a separate project).

---

## 14. Appendix — File index (for fast lookup in future passes)

| Concern | Primary file(s) |
|---|---|
| Admin auth | `src/middleware.ts`, `src/lib/admin-auth.ts` |
| Operator auth | `src/lib/auth.ts`, `src/lib/user-auth.ts` |
| Dynamic CMS | `src/app/api/admin/[contentType]/route.ts`, `src/app/api/admin/bulk/route.ts`, `src/app/api/admin/billing/route.ts` |
| MCP | `src/app/api/mcp/route.ts` |
| Auth flow | `src/app/api/auth/login/route.ts`, `src/app/api/auth/claim/route.ts` |
| Uploads | `src/app/api/upload/route.ts` |
| Stripe | `src/app/api/webhooks/stripe/route.ts`, `src/lib/stripe.ts` |
| DB | `src/db/index.ts`, `src/db/schema.ts` |
| Config | `next.config.ts`, `vercel.json`, `tsconfig.json`, `eslint.config.mjs`, `package.json`, `.env.example` |
| SEO | `src/app/sitemap.ts`, `next.config.ts` (redirects), `src/components/home/search-bar.tsx` |

---

*Plan written 2026-05-12. Re-grep each referenced file before editing — code may have moved since.*
