---
title: Link Integrity Crawl
status: active
date: 2026-07-06
tags: [workflow, qa, launch]
---

# Workflow: Link Integrity Crawl

The functional-audit method that caught 201+ broken links pre-launch. Run it after any
content change, gate change, or before deploy. Target: **0 bad URLs**.

## Steps

1. Build and serve the production bundle:
   ```bash
   rm -rf .next        # stale incremental cache can serve OLD rendered output — always clean
   npm run build
   PORT=3100 npm start &
   ```
   Wait for `curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/` → 200.
   Gotcha: if the port is already held by an old `next-server`, `npm start` fails but
   curl still answers — you'll silently test a stale build. `pkill -f next-server` first
   and confirm the PID changed.

2. BFS-crawl every internal link. Script pattern (recreate if lost): seed with `/`,
   all `LAUNCH_REGIONS`, all `LAUNCH_COMBOS`, key hubs, `/sitemap.xml`; fetch each URL,
   extract `href="/..."` (skip `/_next`, `/api`, assets), follow sitemap `<loc>` entries,
   record status + first referrer; report 4xx/5xx and 3xx with referrers.
   A working copy lived at the July 2026 session scratchpad `crawl.mjs`; ~918 URLs, ~2 min.

3. Triage output: every bad URL has a referrer — fix the **link source**, not the route.
   Expected legitimate redirects (8): `/regions`→`/destinations`, `/partners`→`/advertise`,
   `/book`→`/trip-planner`, `/sup`, `/sea-kayaking`, `/activities/{hub-name}`→hub pages.

## Fix patterns (in priority order)

- UI generating links: filter through `src/lib/launch.ts` (`isLaunchCombo` → combo link,
  else `isLaunchRegion` → region link, else render unlinked text). Applied everywhere as
  of 2026-07-06 — keep new components to the same pattern.
- Authored content (answers/guides/journal, incl. DB-imported): handled at render time by
  `normalizeContentHref` in `src/lib/content-links.ts` (tests in
  `src/lib/__tests__/content-links.test.ts`). Extend that map for new legacy schemes.
- Operator links: only ever from publish-gated queries ([[site-facts]]).

## Danger zone

- **Never add wildcard redirects under `/activities`** in `next.config.ts` — config
  redirects run before filesystem routing and will shadow `/activities/[slug]` +
  `/activities/type/[type]`, 404ing every activity link sitewide (this happened).
