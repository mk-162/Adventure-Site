# Project Status

**Adventure Wales** — adventure tourism site for Wales. Next.js 16 + Drizzle ORM on Neon Postgres. Pre-launch.

> **Agents: start at [`vault/README.md`](vault/README.md)** — the curated Obsidian memory vault
> (162-memory-system convention) with current project state, SOPs, and business context.
> It supersedes the older notes in `plans/`, `playbook/`, and `docs/` where they conflict.

## Where things stand

- **Content phase.** See `content/ops/status-report.md` for live numbers — 1,657 inventory items as of June 4, 2026.
- Snowdonia content batches in progress — see `goals/` for the current batch plans.
- Content is produced via the content-ops pipeline (audit → inventory → task generation → Claude worker swarm).

## Key commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the dev server (localhost:3000) |
| `npm run content-ops:audit` | Run the audit control plane, refresh the content inventory |
| `npm run content-ops:report` | Regenerate `content/ops/status-report.md` |
| `npm run content-ops:swarm` | Run the Claude worker swarm against the task queue |
| `npm run db:studio` | Open Drizzle Studio against the database |

Note: `content-ops:swarm` requires the Claude Code CLI to be installed.

## Key locations

- **Admin dashboard:** `/admin/content-ops` (content-ops command centre)
- **`audits/`** — June 2026 repo audit
- **`content/ops/`** — content inventory, task queue, status report
- **`goals/`** — current content batch plans
- **`archive/`** — historical planning docs (Feb 2026 era)

## Open decisions & future work

1. **Markdown ↔ database source of truth** (founder decision needed). Pages render from the DB, but `content/` holds 227 markdown files with no sync — edits there never reach the live site. Decide: markdown is either an authoring format (build a real markdown→DB sync, markdown wins conflicts) or research staging (archive after import; DB/admin is the only edit surface). Whichever wins, record it in `docs/CONTENT_SOURCES.md` and stop editing the other copies. Full context: `audits/02-full-4-phase-audit.md` (Open Question 1).
2. **JWT token revocation.** Logout only clears the cookie; issued tokens stay valid until expiry (admin 7d, operator 14d, user 30d). Before onboarding additional admins or paying operators, add a `tokenVersion` column checked at verification so sessions can be killed server-side. Context: `audits/03-remediation-log.md`.
3. `schema.ts` domain split (companion to the completed `queries.ts` split).
4. Mega activity hubs (hiking, surfing, caving, coasteering, mountain-biking, skydiving): extract shared sections only if they drift — deliberate composition, not forced templating.

## Strategy

For positioning, commercial model, and the multi-site roadmap, see [STRATEGY.md](STRATEGY.md).
