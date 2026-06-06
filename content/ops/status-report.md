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
- Vercel environment variables pulled to ignored local `.env.local`; `DATABASE_URL` is now available for local operations.

## Needs MK decision

- Strategic Anchor operator list.
- Premium Sales Lure candidates.
- Event hide/refresh policy for stale pages.

## Latest operational batch

Batch: `2026-06-06-critical-operator-trust-breakers-02`

Scope: second trust-breaker pass focused on Gigrin Farm Red Kite Feeding, Grange Trekking Centre, Heatherton World of Activities, Lloyd Langford Expeditions, and Oneplanet Adventure / Llandegla.

Result:

- Safe fields captured for 3 operators: Gigrin Farm Red Kite Feeding, Heatherton World of Activities, and Oneplanet Adventure.
- Partial safe fields captured for 1 operator: Grange Trekking Centre; no direct email or standalone logo was verified.
- 1 operator blocked: Lloyd Langford Expeditions. No current official/operator-owned source could be identified; do not apply placeholder data.
- Data written to `content/ops/operator-enrichment-batches/2026-06-06-critical-operator-trust-breakers-02.json`.
- Individual research files updated/created under `data/research/operators/`.

Verification:

- Batch JSON validates.
- Updated `task-queue.json` validates.
- Apply script dry-run completed and listed 4 operators with safe fields.
- `npm run typecheck` passed.
- Batch applied to live database using Vercel-pulled `DATABASE_URL`: 5 operator rows updated.
- `npm run build` passed with `.env.local` loaded: 1,973 static pages generated.

Note:

- Lloyd Langford Expeditions remains blocked/unverified and was not applied.

## Previous operational batch

Batch: `2026-06-06-critical-operator-trust-breakers-01`

Scope: first critical operator trust-breaker pass focused on Afan Forest Park, Cwmcarn Forest, Gethin Woods / Bike Park Merthyr, Hell's Mouth Surf School, and Celtic Trail Cycle Shuttle.

Result:

- Safe fields captured for 4 operators: Afan Forest Park, Cwmcarn Forest, Gethin Woods / Bike Park Merthyr, Hell's Mouth Surf School.
- 1 operator blocked: Celtic Trail Cycle Shuttle. The existing source looks like a placeholder and the domain did not resolve; do not apply its current phone/email/rating/media.
- Data written to `content/ops/operator-enrichment-batches/2026-06-06-critical-operator-trust-breakers-01.json`.
- Individual research files updated/created under `data/research/operators/`.
- `scripts/apply-operator-enrichment-batch.mjs` added and used to apply the batch after pulling Vercel env locally.

Verification:

- Batch JSON validates.
- Updated `task-queue.json` validates.
- Apply script dry-run completed and listed 4 operators with safe fields.
- `npm run typecheck` passed.
- `npm run build` previously compiled successfully but failed at page-data collection before Vercel env was pulled.
- Batch applied to live database using Vercel-pulled `DATABASE_URL`: 5 operator rows updated.
- Later full build verification passed after Vercel env was pulled locally.

Note:

- Celtic Trail Cycle Shuttle remains blocked/unverified and was not applied.

## Next operational batch

Run the next critical operator tasks from `content/ops/task-queue.json`: Llŷn Adventures duplicate slugs, Llandysul Angling Association, Ma Simes Surf Hut, Paddles & Pedals, and any remaining critical operator trust breakers. Continue to reject unverifiable placeholder listings rather than filling them with invented data.
