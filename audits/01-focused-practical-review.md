# Focused Practical Review Prompt (Adventure Site)

You are a pragmatic senior engineer working with a solo founder. The site is not live yet.

**Focus Areas:**
- Identify the most important bugs and fragile areas in the codebase
- Improve visibility into the current state of the project
- Recommend how to gradually tighten code quality
- Identify opportunities to simplify content operations

**Constraints:**
- Be direct and practical
- Prioritize high-impact, lower-effort items
- Avoid suggesting large architectural rewrites unless they clearly reduce risk or complexity

**Output Format:**
- Executive Summary
- Key Problem Areas (bugs, fragile code, visibility gaps)
- Recommended Actions (prioritized)
- Quick Wins

---

# Completed Review — 2026-06-10

## Executive Summary

The site is in better shape than its repo suggests. The core platform — Next.js 16 App Router, Drizzle + Neon, static generation with selective ISR, Zod-validated API routes, JWT auth behind a working `proxy.ts` — is solid and launch-viable. `tsc --noEmit` passes clean, the security hardening from PR #100 mostly landed, and the content-ops pipeline (audit → task queue → Claude worker swarm) is genuinely clever.

The real risks are concentrated in four places:

1. **Admin auth is the weakest security link.** One shared plain-text password from an env var, compared with `!==`, no rate limiting on the login route. The route protection itself works, but the lock on the door is flimsy.
2. **Content has no single source of truth.** Markdown in `content/`, CSVs, static TS files in `data/`, and the Neon DB all hold overlapping content, with one-shot archived import scripts as the only bridge. Pages render from the DB; edits elsewhere silently go stale.
3. **Near-zero test coverage with no test gate.** 4 test files against 346 source files, and CI doesn't run them anyway.
4. **You can't see the state of your own project.** 39 root-level markdown docs (30+ untouched since February), a content inventory that's 6 days stale, no error tracking, no analytics, no link checking.

Note: an earlier automated pass flagged `src/proxy.ts` using a named export as a critical "middleware not active" bug. **This was verified false** — `export function proxy()` is the documented Next.js 16 convention (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md:32`). Admin routes are protected.

## Key Problem Areas

### Bugs and security weaknesses

- **Shared plain-text admin password** — `src/lib/admin-auth.ts:74-85`. Every admin user authenticates against the same `ADMIN_PASSWORD` env var via direct string comparison (no hashing, not timing-safe). The current value in `.env.local` is a dated temp password.
- **No rate limiting on `/api/auth/admin-login`** — `src/app/api/auth/admin-login/route.ts`. The operator magic-link flow has per-email and per-IP limits; the admin login — the more valuable target — has none. Brute-forceable.
- **Admin CMS accepts untyped data** — `src/lib/api/validate.ts:59-93`. `validateCmsBody` whitelists field *names* but types everything `z.unknown()`. `{ lat: "abc", priceFrom: [] }` passes validation and fails later at the DB or silently corrupts pages.
- **Upload route path handling** — `src/app/api/upload/route.ts:62-89`. Filename is sanitized but `contentType` feeds into `path.join` for the local-filesystem fallback. Confirm it's an enum allowlist, not a free string.
- **Six silent `.catch(() => {})` blocks** — e.g. `src/components/admin/ImageUpload.tsx` falls back to `{}` on a failed JSON parse, so a failed upload surfaces later as `data.url === undefined`. Also `header.tsx`, `EnquireAllVendors.tsx`, `AdSlot.tsx`, `CustomStopForm.tsx`, `ViewTracker.tsx`.
- **`ws` moderate CVE** in production deps — `npm audit fix` resolves it.
- **Long sessions, no revocation** — user JWTs last 90 days (`src/lib/user-auth.ts:22`), operator 30 days. Logout doesn't invalidate tokens.

### Fragile code

- **~21 copy-pasted activity hub pages** at 900–965 lines each (`src/app/hiking/page.tsx` 935, `src/app/surfing/page.tsx` 965, `src/app/coasteering/page.tsx` 916…). Metadata, fetch logic, and layout are 90%+ identical. Every cross-cutting fix means ~20 edits, and one will be missed.
- **Hand-maintained 20–36KB data files** in `src/data/activity-hubs/` (caving.ts 34KB, surfing.ts 32KB…) hardcoding spots, operators, and seasons that also exist in the DB. Drift is a when, not an if.
- **Duplicate components both in active use**: `FavoriteButton.tsx` and `FavouriteButton.tsx`, 11 combined import sites — flagged in `COMPONENT_MIGRATION_AUDIT.md` in February, still unmerged.
- **`data/regions/*.ts` (11 files) is dead weight** — never imported anywhere; the DB superseded it. Anyone "fixing" content there is editing a file nothing reads.
- **Error boundaries only at the root** — one `src/app/error.tsx`; no per-segment boundaries under `[region]/`, `activities/`, or admin, so a single failed fetch blanks the whole page.
- **`queries.ts` is a 1,331-line monolith** with 60+ exported functions, zero tests, and 7 `any`s at the joins.

### Visibility gaps

- **No production observability at all**: no Sentry/error tracking, no analytics, no uptime check. When the site breaks post-launch, the first report will come from a user — or nobody.
- **Content inventory is stale** — `content/ops/status-report.md` was generated 2026-06-04; regeneration is a manual `npm run content-ops:audit`.
- **380KB of tracked source URLs, never validated** (`content/ops/source-registry.json`, all "unreviewed") — dead links accumulate invisibly.
- **39 root markdown docs, no current one.** README doesn't mention content-ops or the admin dashboard; `TODO.md` is one line; 30+ docs are from Feb 14. There is no answer to "what's the status?" short of reading five files and the git log.
- **`.env.example` is missing `GOOGLE_API_KEY`, `PERPLEXITY_API_KEY`, `YOUTUBE_API_KEY`** that scripts actually read — scripts fail confusingly on a fresh setup.
- **Repo bloat hides signal**: 319 `temp/extracted/` images and `server.log` are git-tracked; `public/` (261MB, 839 tracked files) lives in the repo.

## Recommended Actions (prioritized)

**P0 — before launch (a day or two total)**

1. Harden admin login: hash per-user passwords (bcrypt/argon2) in the existing `adminUsers` table, add the same rate limiter the operator login uses, and rotate `ADMIN_PASSWORD` and `JWT_SECRET`. (`src/lib/admin-auth.ts`, `src/app/api/auth/admin-login/route.ts`)
2. Add error tracking (Sentry or Vercel's equivalent) plus Vercel Analytics. Hours of work; transforms post-launch life for a solo founder.
3. `npm audit fix` for the `ws` CVE.
4. Replace `z.unknown()` in `validateCmsBody` with real types for the ~10 fields that matter (lat/lng, prices, durations, enums); verify the upload `contentType` allowlist.

**P1 — first two weeks after launch**

5. Add logging to the 6 silent catch blocks and drop `error.tsx` boundaries into `[region]/`, `activities/[slug]/`, and admin segments.
6. Write ~20 tests where money and access live: admin/operator auth flows, Stripe webhook handling, and the 10 most-used `queries.ts` functions. Add `npm test` to `.github/workflows/ci.yml` (it currently only lints/typechecks/builds).
7. Pick one source of truth per content type, write it down, and delete or archive the rest: pages render from the DB, so either wire markdown → DB sync or stop editing markdown. Delete `data/regions/*.ts`.
8. Automate the content-ops audit: a nightly GitHub Action running `content-ops:audit` + `content-ops:report`, plus a weekly link-check over `source-registry.json`.

**P2 — gradual tightening (ratchet, don't rewrite)**

9. Lower the lint ceiling as you fix: `--max-warnings=579` → 550 → 500…, starting with the 114 `@typescript-eslint/no-explicit-any` warnings. Never let it rise.
10. When you next touch any activity page, extract the shared 90% into one `ActivityHubPage` template + per-activity config. Do it incrementally, two or three pages per pass — not as a big-bang rewrite.
11. Merge FavoriteButton/FavouriteButton; migrate the 32 raw `<img>` tags to `next/image` opportunistically.

## Quick Wins

- `npm audit fix` — minutes, closes the only known CVE.
- Untrack junk: `git rm -r --cached temp/ && git rm --cached server.log`, add both to `.gitignore`.
- Add the 3 missing keys to `.env.example`.
- Delete the unused `data/regions/*.ts` files (verified: zero imports).
- Sweep ~30 stale root docs into `archive/` and write a 20-line `STATUS.md` (what's live, current blockers, the 4 commands that matter). Make `npm run content-ops:report` your daily glance.
- Add `npm test` to CI — one line, even with only 4 test files it stops regressions in what *is* tested.
- Check whether `openai` (≈40MB) is still imported anywhere (`src/` has zero hits; check `scripts/`) and remove it if dead.
