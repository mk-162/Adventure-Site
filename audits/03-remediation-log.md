# Remediation Log — 2026-06-10

Status of fixes applied against `01-focused-practical-review.md` and `02-full-4-phase-audit.md`.

## Fixed

**Security**
- Per-user scrypt password hashes for admins (`src/lib/password.ts`, `admin_users.password_hash` column added to DB). Shared plain-text `ADMIN_PASSWORD` comparison removed from `src/lib/admin-auth.ts`; unknown-email timing equalized. A verify-bypass edge case (empty-buffer base64 hashes) was caught by the new test suite and guarded.
- Rate limiting on `/api/auth/admin-login` (5/email/hr, 20/IP/hr — same as operator login).
- `src/proxy.ts` fail-closed check now keys on the JWT secret (which it actually verifies with) instead of the removed shared password.
- Typed CMS validation: `validateCmsBody` enforces real per-field types (decimals, ints, booleans, dates, string arrays, jsonb) derived from the DB schema; `""` coerces to null for cleared form inputs.
- Session lifetimes shortened: user 90d → 30d, operator 30d → 14d (admin stays 7d).
- `JWT_SECRET` rotated in `.env.local`; `ADMIN_PASSWORD` deleted from it.
- `ws` CVE fixed (`npm audit` clean for production deps).
- Upload route confirmed already safe (enum-validated `contentType`) — audit item closed as already-mitigated.

**Quality**
- All 6 silent catch blocks now log; `ImageUpload` surfaces parse failures to the user instead of continuing with `{}`.
- `error.tsx` boundaries added for `[region]/`, `activities/`, `admin/`, `directory/` (using Next 16 `unstable_retry`).
- `FavoriteButton`/`FavouriteButton` merged into `FavouriteButton` (UK); US file deleted, all call sites updated.
- 38 new tests (password, CMS validation, rate limiter, admin auth with mocked DB) — 61 total, all passing. A pre-existing jsdom failure in `admin-auth.test.ts` was fixed (`@vitest-environment node`).
- `npm test` added to CI.
- Lint ratchet lowered 579 → 576 (current count); policy: lower with every fix batch, never raise.

**Hygiene & docs**
- `temp/` (319 images) and `server.log` untracked; `.gitignore` covers them.
- Dead `data/regions/*.ts` deleted (zero imports); unused `openai` dependency removed (package.json + next.config).
- 37 stale root docs + `briefs/`, `planning/`, `jules-tasks/`, `Jules-Audit/` moved to `archive/`; root `STATUS.md` created; README gained Current Status + Content Operations sections. (`@source not "../../archive"` added to globals.css so Tailwind doesn't scan archived docs.)
- `.env.example`: added `GOOGLE_API_KEY`, `PERPLEXITY_API_KEY`, `YOUTUBE_API_KEY`; removed `ADMIN_PASSWORD`, `OPENAI_API_KEY`.

**Content ops**
- Zod schemas for inventory/task-queue/gap-audit/research outputs (`scripts/content-ops/schemas.ts`); audit-control-plane validates loudly, skips bad files with named warnings, refuses to write an invalid inventory.
- Link checker (`npm run content-ops:links`) → `content/ops/link-check-report.{json,md}`.
- Nightly content-ops audit workflow (`.github/workflows/content-ops-nightly.yml`, 03:00 UTC, auto-commits `content/ops/`).

**Observability**
- `@vercel/analytics` added to the root layout.

## Action required (founder)

1. **Set the admin password** (the old shared password no longer works; until this runs, admin login is fail-closed):
   `npx tsx scripts/set-admin-password.ts admin@adventurewales.com`
2. **Rotate secrets on Vercel**: set the new `JWT_SECRET` (rotated locally only), remove `ADMIN_PASSWORD` env, and rotate `BLOB_READ_WRITE_TOKEN` / `RESEND_API_KEY` in their dashboards if they were ever exposed.
3. **Error tracking**: Vercel Analytics is wired; Sentry (or similar) still needs an account/DSN to add real exception tracking.
4. Review + commit the working tree (changes are uncommitted; pre-existing content-ops edits are mixed in).

## Fixed in second pass (same day)

- **Activity-hub consolidation, standard tier (3.1)**: the 12 standard hub pages (bouldering, canoeing, fishing, gorge-walking, horse-riding, kitesurfing, paddleboarding, paragliding, rock-climbing, sailing, wild-swimming, windsurfing) now render through one shared `src/components/activity-hub/StandardActivityHub.tsx`; each page is ~50 lines of content config. Verified by HTML diff against pre-refactor build: 11/12 byte-identical (modulo React text-boundary comments), and paddleboarding was *fixed* — it had a stale `notFound()` guard and was silently prerendering as a noindexed error page. The 6 mega hubs (hiking, surfing, caving, coasteering, mountain-biking, skydiving) and 3 mid-size pages stay deliberately bespoke per the shared-plumbing/bespoke-content strategy.
- **`queries.ts` domain split (3.3)**: 1,331-line monolith split into 10 domain modules under `src/lib/queries/` (largest 238 lines); `src/lib/queries.ts` is now a barrel re-export so all 38 import sites work unchanged. Pure move, verified by tsc + 61 tests + HTML diff of all 21 activity pages.
- Lint ratchet lowered again: 576 → 516 (hub consolidation deleted ~60 warnings' worth of duplicated JSX).

## Fixed in third pass (same day)

- **Image migration (3.5a)**: 20 of 32 raw `<img>` converted to `next/image` (fill + sizes or explicit dims, layout preserved). The 12 left are deliberate — DB/user-supplied URLs from arbitrary domains (operator logos, external event images, YouTube thumbs, admin previews) that `next/image` would reject at runtime, plus lightbox images sized by natural dimensions. Also fixed a pre-existing crash risk: `events/[slug]` rendered external-domain heroImages through `next/image`; now falls back to `<img>` for non-local paths.
- **Image pruning (3.5b)**: referenced-set analysis (code + data + content greps, dynamic-path protection, full DB scan of 284 text columns) found only 20 truly unreferenced files — quarantined to `unused-images/` (gitignored, reversible). The real weight was oversized originals: 812 JPEGs recompressed in place (max 2560px, q80 mozjpeg, EXIF orientation baked, only replaced when ≥20% smaller). **`public/images`: 261MB → 105MB.**
- **CSP enforcement (3.6)**: switched from Report-Only to enforcing `Content-Security-Policy`. Dropped `unsafe-eval` in production (dev keeps it for the bundler), added `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-src` allowlist for YouTube embeds, and `upgrade-insecure-requests`. `script-src` retains `'unsafe-inline'` — the site is SSG, so per-request nonces would force dynamic rendering; revisit if the site ever moves to dynamic. Header verified being served by a production `next start`.
- Lint ratchet: 516 → 496.

## Deferred / future work (now tracked in STATUS.md "Open decisions & future work")

- Markdown ↔ DB source-of-truth decision (Open Question 1) — needs founder call.
- Token revocation (`tokenVersion` claim) before onboarding more admins/operators (3.7 second half).
- `schema.ts` domain split (3.3 second half).
- Mega activity hubs: extract shared sections only if/when they drift (composition, not forced templating).
