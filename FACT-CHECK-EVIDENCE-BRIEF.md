# Fact-Check Operations — Evidence Schema Agent Brief

## Objective
Implement **Phase 1 only**: durable, database-backed fact-check state. Work only in this isolated worktree/branch. Follow strict TDD: write/adjust a focused failing test first, run it to show the expected failure, implement minimally, then run the focused and relevant test suite.

## Scope
- Worktree: `/home/minigeek/projects/Adventure-Site-fact-check-evidence`
- Branch: `feat/fact-check-evidence-schema`
- Repo base: `952a2bf`

## Required deliverables
1. Drizzle schema + migration for:
   - `listing_evidence` — entity type/id, field, value, source URL/type, verifier, verified/recheck timestamps, verdict, notes.
   - `content_review_state` — stable `content_item_id`, lifecycle status, review actor/date, notes.
   - `ops_decisions` — durable version of the existing commercial-decision contract.
   - `email_suppression` — email, reason, created time.
2. Add a `verification_level` field to `operators`, compatible with current source and existing DB conventions.
3. Add triage fields to `operator_interest`: status, handled-by/date, next action.
4. Extract a typed reusable evidence/decision helper under `src/lib/content-ops/` only if it enables a testable, minimal contract. Do not build UI.
5. Add focused tests for the added schema/contract. Tests must prove at least: CSV seed is not a publishable verification source; evidence fields require a stable entity/field/source type; suppression has a global unique email identity.
6. Generate a migration only. **Never run `db:push`, `db:migrate` against any remote database, seed, deploy, or change production data.**

## Non-negotiable rules
- Existing Postgres is the sole database. No new service or dependency.
- Do not touch `scripts/content-ops/audit-control-plane.ts`, admin UI, email sender, launch allowlist, package files or unrelated files.
- Do not store campaign copy, recipient lists or PII in Git fixtures.
- Do not create any automated email sender, publish action or claim-acceptance behaviour.
- Preserve existing records/data; migration must be additive and reversible where feasible.
- Inspect both `src/db/schema.ts` and `drizzle/schema.ts`/existing migrations before deciding which schema source is canonical. Do not assume.

## Verification
Run the project's relevant test command(s), `npm run typecheck`, and `git diff --check`. Report every command/result, exact files changed, migration path and any source-schema ambiguity.

## Commit
Commit only your scoped changes with a conventional commit. Do not push.
