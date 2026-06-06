# Adventure Wales Content Ops Status Report

Generated: 2026-06-06

## Source audit

- File: `content/content-gap-audit.json`
- Generated: `2026-02-05T19:59:03.333Z`

## Current audit summary

- Critical: 22
- High: 42
- Medium: 13
- Low: 286
- Total: 363
- Auto-fixable: 313

## Queue seeded

- `content/ops/task-queue.json` contains 80 top-priority tasks.
- Priority order: critical/high operator trust breakers first, then launch-visible editorial/dynamic risks.

## Verification

- `task-queue.json` validates as JSON.
- `commercial-decisions.json` validates as JSON.
- `npm ci` completed.
- `npm run typecheck` passed.
- `npm run audit:content` is blocked locally until `DATABASE_URL` / `POSTGRES_URL` is available.

## Needs MK decision

- Strategic Anchor operator list.
- Premium Sales Lure candidates.
- Event hide/refresh policy for stale pages.

## Latest operational batch

Batch: `2026-06-06-critical-operator-trust-breakers-01`

Scope: first critical operator trust-breaker pass focused on Afan Forest Park, Cwmcarn Forest, Gethin Woods / Bike Park Merthyr, Hell's Mouth Surf School, and Celtic Trail Cycle Shuttle.

Result:

- Safe fields captured for 4 operators: Afan Forest Park, Cwmcarn Forest, Gethin Woods / Bike Park Merthyr, Hell's Mouth Surf School.
- 1 operator blocked: Celtic Trail Cycle Shuttle. The existing source looks like a placeholder and the domain did not resolve; do not apply its current phone/email/rating/media.
- Data written to `content/ops/operator-enrichment-batches/2026-06-06-critical-operator-trust-breakers-01.json`.
- Individual research files updated/created under `data/research/operators/`.
- `scripts/apply-operator-enrichment-batch.mjs` added so the batch can be applied to the database once `DATABASE_URL` / `POSTGRES_URL` is available.

Verification:

- Batch JSON validates.
- Updated `task-queue.json` validates.
- Apply script dry-run completed and listed 4 operators with safe fields.
- `npm run typecheck` passed.
- `npm run build` compiled successfully but failed at page-data collection because `DATABASE_URL` is not set for `/api/admin/[contentType]`.

Blocker:

- Live database rows were not updated because `DATABASE_URL` / `POSTGRES_URL` is not set in this environment.
- Full production build remains blocked for the same environment reason: admin API routes require `DATABASE_URL` during page-data collection.

## Next operational batch

Either provide DB env and apply the accepted batch, or run the next 5 critical operator tasks: Gigrin Farm, Grange Trekking Centre, Heatherton World of Activities, Lloyd Langford Expeditions, and Llandegla/Oneplanet Adventure. Continue to reject unverifiable placeholder listings rather than filling them with invented data.
