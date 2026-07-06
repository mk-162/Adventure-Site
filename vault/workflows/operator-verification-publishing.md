---
title: Operator Verification & Publishing
status: active
date: 2026-07-06
tags: [workflow, operators, content-ops, adventure-wales]
---

# Operator Verification & Publishing

How an operator goes from CSV stub to a published `/directory/<slug>` page. This is public data about real, named businesses — **accuracy is a liability issue**. When unsure, mark unknown rather than guess.

> [!danger] The master CSV is systematically wrong
> `data/wales/Wales database - Operators.csv` (and derived stubs) contains **systematically wrong phone numbers, emails, and Google ratings** — placeholder/fabricated data. It is seed data only, NEVER publish-safe. Every operator must go through the enrichment pass below before `status='published'`.

## The publish gate (code-enforced)

- `operators.status` column, **default `draft`**. Only verified operators are `published` (18 of 166 as of Jul 2026).
- All public queries filter published-only: `src/lib/queries/operators.ts` (and the activity→operator join in `src/lib/queries/activities.ts`). Draft operators are invisible; no data migration needed to hide them.

## Pipeline: stub → researched → verified → published

1. **Stub exists** — seeded from CSV or created in `/admin/content/operators` (min: name, slug, region, type, short description, hero; `claimStatus = stub` shows a "Claim this listing" banner).
2. **Task generated** — content-ops audit flags missing fields; task lands in `content/ops/task-queue.json` with `output_path: data/research/content-ops/operator-<slug>.json`. See [[content-ops-pipeline]].
3. **Research pass (Sonnet)** — per `data/research/content-ops/_ENRICHMENT_SPEC.md`:
   - Treat seed data as possibly wrong; verify everything via web search/fetch.
   - Confirm against the operator's **own website first**, then corroborate: Visit Wales, Go North Wales, TripAdvisor, Companies House.
   - Write proposal JSON to the exact given path. Shape: `_meta` (slug, route, `recommendedNextStatus`, `identityConfidence` HIGH/MEDIUM/LOW + reason, `redFlags[]`) + `proposedOperatorData` (name, website, tagline, 2–3 factual paragraphs, contact, lat/lng, priceRange, googleRating, activityTypes, regions, tripadvisorUrl) + `fieldSources` (source URL per non-obvious field).
   - Never invent Google ratings — only report a rating you can source.
4. **Verify pass (Opus)** — adversarially re-check the proposal before it touches the DB. `recommendedNextStatus = "published"` is allowed ONLY if identityConfidence is HIGH **and** name + website + phone + at least one activity are all confirmed. Otherwise `review`.
5. **Apply + publish** — update the DB row, set `operators.status = 'published'`. Hero image per [[image-sourcing]] rules (real, licensed, attributed — no AI images of real businesses).

## Rule: verify the operator's REAL region before linking

Key learning from the 8-region expansion (Jul 2026): auto-generated combo pages had scattered single-site operators across regions they don't serve. Before publishing or linking an operator on a region/combo page, confirm where the business **actually operates** (their own site's location page). If it doesn't serve the region in question, say so in `redFlags` and set `regions` to where it really operates.

## Red flags that block publishing

- Placeholder phone/email (from the master CSV)
- Region mismatch (listed in a region it doesn't serve)
- Closed/defunct business, or name change / rebrand (e.g. Adventure Parc Snowdonia's operational changes must be explicitly flagged)
- Duplicate slugs for the same business (dedupe before publish)

Currently held (do not publish without resolving): `black-mountain-adventure` (dedupe), `gower-activity-centres` (TLS/site issue), `llangennith-surf-school`.

## Commercial tiering (context)

Not every operator gets a rich free page: strategic anchors and premium sales lures get full treatment; ordinary unpaid operators stay minimal stubs with a claim CTA. Decisions recorded in `content/ops/commercial-decisions.json`. Claims are approved at `/admin/commercial/claims` (magic-link email flow); claimed operators self-edit at `/dashboard/listing`.

## Minimum fields for a visible operator

Human-sounding description (150–300 words for priority operators), website, correct region + activity mapping, real licensed hero image, contact details (or explicit reason absent), claim CTA if unclaimed, LocalBusiness schema when data supports it.

## Related

- [[content-ops-pipeline]] · [[image-sourcing]] · [[content-expansion]]
