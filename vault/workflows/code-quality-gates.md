---
title: Code Quality Gates
status: active
date: 2026-07-06
tags: [workflow, ci, qa]
---

# Workflow: Code Quality Gates

Run before declaring any code change done. CI enforces the same set on push.

```bash
npm run typecheck      # tsc --noEmit — must be clean
npm run test           # vitest — 72 tests as of 2026-07-06, must all pass
npm run lint           # eslint, 0 errors; warning ceiling pinned at 496 (do not add warnings)
npm run build          # must be green; ~1,830 static pages
```

Then [[link-integrity-crawl]] if the change touches links, routes, gates, or content.

## Conventions that keep the gates green

- New public API routes: Zod-validate every input via `src/lib/api/validate.ts` patterns;
  return 400 on bad input, never 500; generic error messages to clients.
- New public operator queries: always `status='published'` ([[site-facts]]).
- New link-generating UI: filter through `src/lib/launch.ts` ([[link-integrity-crawl]] fix patterns).
- Next 16: `params`/`searchParams` are **Promises** — `await` them (silent no-op filters
  otherwise; this bit /search and /events).
- Emails: literal hex colours only, no CSS `var(--…)` (invisible in email clients).
- Absolute URLs that leave the request (emails, Stripe): `getAppUrl()` from
  `src/lib/app-url.ts`, never raw `process.env.NEXT_PUBLIC_APP_URL`.
- DB schema changes: `npm run db:generate` + migrate; never `db:push` (migration baseline
  discipline since July 2026). Drizzle gotcha: constraints inside an object literal in the
  table's config array are **silently ignored** — verify generated SQL contains them.

## CI notes

- `.github/workflows/ci.yml` builds against the **production** `DATABASE_URL` (known risk —
  Phase 6 item to move to a branch DB).
- Husky pre-commit runs lint-staged.
