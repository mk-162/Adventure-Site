---
title: Content Ops Pipeline (audit → inventory → tasks → swarm)
status: active
date: 2026-07-06
tags: [workflow, content-ops, adventure-wales]
---

# Content Ops Pipeline

Adventure Wales content is produced by a control plane, not ad-hoc AI writing. Agents consume tasks from a queue; they never invent their own work. Repo: `/home/minigeek/projects/Adventure-Site`.

## Commands (package.json)

| Command | What it does |
|---|---|
| `npm run audit:content` | Runs `scripts/content-gap-audit.ts` → writes `content/content-gap-audit.json` (+ `.md`). Raw gap list (missing descriptions, images, fields) by severity/category. Needs env (DB) loaded. |
| `npm run content-ops:audit` | `scripts/content-ops/audit-control-plane.ts` — builds/refreshes `content/ops/content-inventory.csv` + `.json` and `content/ops/task-queue.json` from the gap audit, routes, data files, and existing research JSON. Zod-validates inputs (`scripts/content-ops/schemas.ts`); invalid files are skipped with a warning. |
| `npm run content-ops:tasks` | `generate-agent-tasks.ts` — exports every queue item as a standalone markdown brief in `tasks/content-ops/<task-id>.md`. |
| `npm run content-ops:report` | `status-report.ts` — regenerates `content/ops/status-report.md` (channel/status counts, launch-visible blockers). |
| `npm run content-ops:swarm` | `run-swarm.ts` — launches Claude Code CLI workers against the queue. Flags: `--limit N` (default 3), `--concurrency N` (default 2), `--task-type research`, `--status research_needed`, `--model <m>`, `--dry-run`. Requires the Claude Code CLI installed. |
| `npm run content-ops:links` | `check-links.ts` — link integrity check. |

## Where state lives

- `content/ops/content-inventory.csv` — master matrix, one row per publishable item (~1,657 items as of Jun 2026). Columns include `id, channel, content_type, route_or_slug, priority, status, launch_visible, blocker_reason, quality_score, confidence_score`.
- `content/ops/task-queue.json` — generated queue, priority-ordered.
- `content/ops/status-report.md` — human-readable readiness summary.
- `content/ops/source-registry.json`, `image-registry.json`, `commercial-decisions.json`.
- `content/ops/swarm-runs/`, `swarm-logs/`, `overnight-logs/` — run artifacts.
- `tasks/content-ops/*.md` — exported per-task briefs.
- `data/research/content-ops/*.json` — research/proposal outputs (operators, location landings, itineraries). Spec for operators: `data/research/content-ops/_ENRICHMENT_SPEC.md` → see [[operator-verification-publishing]].
- Dashboard: `/admin/content-ops` (monitoring-only as of Jul 2026).

## Task structure

Each `task-queue.json` entry: `id`, `content_item_id`, `channel` (commercial | evergreen | dynamic), `content_type`, `route_or_slug`, `priority` (0–100 score: launch visibility 25 + commercial value 25 + search value 20 + quality risk 20 + freshness risk 10), `status`, `task_type` (research/…), `brief`, `acceptance_criteria[]`, `source_requirements[]`, `output_path` (usually `data/research/content-ops/<item-id>.json`).

Status lifecycle: `discovered → triaged → research_needed → researched → generated → qa_needed → reviewed → signed_off → published`, plus `refresh_due`, `blocked`, `archived`.

Standing rules baked into briefs: don't guess; cite a source URL for every factual claim; no AI-generated images for real places/operators/events; no live pricing/timetables unless verified against a current official source and dated; recommend a next status rather than self-publishing.

## Running a batch

1. `npm run audit:content` (refresh the gap audit — needs DB env).
2. `npm run content-ops:audit` then `npm run content-ops:report` — check the queue and blockers.
3. `npm run content-ops:swarm -- --dry-run` to preview selection; re-run without `--dry-run` to launch workers. Outputs land at each task's `output_path`; logs in `content/ops/swarm-runs/`.
4. Verify outputs (for operators: Opus verify pass per [[operator-verification-publishing]]). Apply approved changes to the DB / data files — research JSON is a *proposal*, not live content.
5. Re-run `content-ops:audit` + `report` to reflect new statuses.

## Verifying a batch (functional audit method, proven Jul 2026)

- `rm -rf .next` first — stale incremental cache can serve old rendered output.
- `npm run build` && `npm start` on a port, then crawl `href="/..."` from live pages (BFS) and check status codes. This catches links the launch gate 404s but the UI still renders. Last full crawl: 916 URLs, 0 broken.
- `npm run typecheck` and the test suite must pass before merge.

> [!warning] Open decision — markdown vs DB source of truth
> Pages render from the **database**, but `content/` holds ~227 markdown files with **no sync** — edits there never reach the live site. Founder decision pending: markdown becomes an authoring format (build md→DB sync) or research staging (archive after import; admin/DB is the only edit surface). Until decided, do not "fix" content by editing `content/*.md` and expect it to ship. Context: `audits/02-full-4-phase-audit.md`, STATUS.md open decision 1.

## Related

- [[operator-verification-publishing]] — the commercial-channel specialisation of this pipeline
- [[pseo-content-strategy]] — quality bar the outputs must meet
- Project note: [[content-expansion]]
