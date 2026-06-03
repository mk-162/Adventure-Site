# Adventure Wales Content Ops Control Plane

## Purpose
Adventure Wales should be managed as a content operations system, not as a pile of individual AI-written pages.

The system tracks every publishable asset by channel, status, evidence, freshness, commercial value, and launch readiness. Agents can research, draft, refine, and verify content, but they must work from the control plane rather than inventing tasks.

## Core Principle
Do not ask AI to finish the site. Use AI to operate a workflow:

1. Audit the corpus.
2. Prioritise the next most valuable fixes.
3. Dispatch narrow research/production/QA tasks.
4. Verify evidence and quality.
5. Publish only signed-off content.
6. Schedule refreshes.

## Content Channels

### 1. Evergreen static editorial
Relatively stable pages where quality and structure matter more than refresh frequency.

Examples:
- Activity × location pages, e.g. `/snowdonia/things-to-do/mountain-biking`
- Location landing pages, e.g. `/snowdonia`
- Activity landing pages, e.g. `/activities/mountain-biking`
- Guides and explainers

Primary goal:
- Search visibility, user usefulness, internal linking, destination credibility.

Default refresh cycle:
- 6–12 months, unless sources or routes change.

### 2. Commercial content
Revenue-linked pages and data. These need stricter commercial controls because not every operator should receive a full premium page for free.

Examples:
- Advertisers
- Sponsors
- Premium operators
- Claimed listings
- Unclaimed operator stubs
- Sponsored placements
- Booking/affiliate content

Primary goal:
- Trust, monetisation, operator acquisition, lead capture.

Default refresh cycle:
- 30–90 days for premium/active commercial pages.
- 6–12 months for ordinary stubs.

### 3. Dynamic recurring content
Pages where stale information damages trust quickly.

Examples:
- Events
- Itineraries
- Seasonal guides
- Journal/news content
- Opening times, timetable-dependent pages, live price-sensitive references

Primary goal:
- Freshness, user trust, timely usefulness.

Default refresh cycle:
- Events: before every season or event date.
- Itineraries: 90–180 days.
- Seasonal pages: before each relevant season.

## Universal Status Lifecycle

Every content item should move through a formal state machine.

Recommended statuses:

1. `discovered`
   - Item exists or has been identified.
   - No quality guarantee.

2. `triaged`
   - Priority, channel, owner, and intended treatment assigned.

3. `research_needed`
   - Needs source collection before writing or updating.

4. `researched`
   - Source URLs, evidence notes, and key facts captured.

5. `generated`
   - Draft or data update produced by an agent or editor.

6. `qa_needed`
   - Needs editorial, factual, image, SEO, or commercial review.

7. `reviewed`
   - Reviewer has checked the work and left notes.

8. `signed_off`
   - Approved for publication.

9. `published`
   - Live or ready to be live.

10. `refresh_due`
   - Published but due for another pass.

11. `blocked`
   - Cannot proceed without missing source, image, commercial decision, or technical fix.

12. `archived`
   - Removed from active production.

## Channel-Specific Gates

### Evergreen static editorial gates
- Has useful local detail.
- Has named places/operators where relevant.
- Has internal links to related activity, location, operator, itinerary, and commercial pages.
- Avoids time-sensitive claims unless sourced and dated.
- Has metadata and schema where applicable.
- Has image provenance and alt text.

### Commercial content gates
- Treatment matches commercial tier:
  - Strategic big player: full public treatment.
  - Premium lure: rich page allowed as sales asset.
  - Claimed/paid: full page according to package.
  - Ordinary unpaid: minimal stub unless strategically justified.
- Website/contact/region/activity fields verified.
- Description does not overclaim.
- Lead/claim/advertising CTA present.
- Sponsor/advertiser placement status recorded.
- Commercial owner or reviewer signs off.

### Dynamic recurring content gates
- Last verified date recorded.
- Next review date recorded.
- Time-sensitive claims have source URLs.
- Stale dates/prices/opening times removed or clearly caveated.
- Event status is current: upcoming, cancelled, postponed, past, archived.

## Matrix Checklist Fields

Each content item should have these fields:

- `id`
- `channel`
- `content_type`
- `route_or_slug`
- `title`
- `region`
- `activity`
- `commercial_tier`
- `priority`
- `status`
- `launch_visible`
- `owner`
- `assigned_agent`
- `source_count`
- `source_urls`
- `evidence_status`
- `image_status`
- `image_source_url`
- `copy_status`
- `seo_status`
- `schema_status`
- `commercial_review_status`
- `safety_or_legal_status`
- `last_generated_at`
- `last_reviewed_at`
- `next_review_due`
- `published_at`
- `blocker_reason`
- `review_notes`
- `quality_score`
- `confidence_score`

## Suggested Priority Model

Score each item from 0–100.

Inputs:
- Launch visibility: 0–25
- Commercial value: 0–25
- Search/user value: 0–20
- Current quality risk: 0–20
- Freshness risk: 0–10

The queue should work highest score first.

## Workflow Pattern For Every Channel

Each channel gets the same production phases:

1. Audit
   - Find current state and gaps.

2. Research
   - Capture sources, facts, image candidates, competitor examples, and local context.

3. Generate/refine
   - Produce the page, listing, event refresh, itinerary, or data patch.

4. QA
   - Check factual accuracy, image relevance, SEO, schema, tone, and commercial rules.

5. Sign off
   - Human or trusted reviewer approves.

6. Publish
   - Apply changes, build, commit, deploy when appropriate.

7. Refresh
   - Schedule the next review.

## Agent Rules

Agents must not choose arbitrary work. They consume tasks from the queue.

Every task brief must include:
- Content item ID.
- Channel and content type.
- Exact route/file/data path.
- Current status.
- Required output format.
- Source requirements.
- Acceptance criteria.
- Things not to change.

Agents must return:
- Files changed or proposed.
- Source URLs used.
- Claims that need human review.
- Image provenance.
- QA notes.
- Suggested next status.

## Buildable System

The practical system to build in the repo:

1. `content/ops/content-inventory.csv`
   - Master matrix for all publishable content.

2. `content/ops/source-registry.csv`
   - Source URLs, authority, last checked date, content item mapping.

3. `content/ops/image-registry.csv`
   - Image URL/path, licence/provenance, target page, status.

4. `content/ops/task-queue.json`
   - Generated daily queue for agents/Jules/Claude.

5. `scripts/content-ops/audit-control-plane.ts`
   - Builds/updates the inventory from files, routes, DB content, and existing audits.

6. `scripts/content-ops/generate-agent-tasks.ts`
   - Converts priority items into narrow agent briefs.

7. `scripts/content-ops/status-report.ts`
   - Summarises readiness by channel, status, priority, and blocker.

8. `/admin/content-ops`
   - Dashboard showing the matrix, filters, and readiness counts.

## Launch Definition

The site is launch-ready when:

- Every launch-visible item is `published` or `signed_off`.
- No homepage/core-nav/Snowdonia/Tier-1 operator page is in `discovered`, `generated`, `qa_needed`, or `blocked`.
- Dynamic items visible on launch have valid `next_review_due` dates.
- Commercial pages have correct treatment by tier.
- Build passes.
- Content audit has no critical launch-visible blockers.

## Best Practice Summary

The best practice is a control plane with a status matrix, not more isolated skills.

Skills define how to do work. The control plane decides what work exists, what state it is in, who/what should touch it next, and whether it is safe to publish.
