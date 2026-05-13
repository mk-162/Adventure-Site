# Robust Welsh Site — Claude Code Goal Brief

**Goal:** Create a robust and working version of the Welsh adventure site.

**Outcome wanted:** Adventure Wales should be safe to deploy, technically stable, and operationally maintainable. This means: admin/auth/API routes are locked down, critical bugs are fixed, env/config is explicit, build/type/lint gates pass, and there is enough test coverage to prevent regressions on the important flows.

## Source audit documents

Use these repo-local audit documents as the starting evidence:

- `audit/claude-output-ADV-12.json` — Claude technical risk audit output
- `docs/ERROR-AUDIT.md` — comprehensive error/security/type audit
- `docs/SITE_STRUCTURE_AUDIT.md` — route/SEO architecture audit
- `AUDIT-BRIEF.md` — original site audit scope
- `JULES-AUDIT-SESSION.md` — Jules audit tracker

Canonical Playbook copies are in GitHub at:

- `workspace/adventure-wales/technical-audits/README.md`
- `workspace/adventure-wales/technical-audits/claude-technical-risk-audit-ADV-12.md`
- `workspace/adventure-wales/technical-audits/comprehensive-error-audit.md`
- `workspace/adventure-wales/technical-audits/site-structure-audit.md`

## Required planning output

Create a careful, phased development plan in:

`docs/plans/2026-05-12-robust-welsh-site-development-plan.md`

The plan must be suitable for implementation by Claude Code in later passes. Do **not** implement code changes yet unless explicitly instructed.

## Plan requirements

The plan must include:

1. **Current risk summary**
   - Separate genuine production blockers from cleanup/technical debt.
   - Note which older audit items already appear partially fixed.

2. **Phased roadmap**
   - Phase 0: confirm baseline and branch hygiene.
   - Phase 1: critical security/auth/env hardening.
   - Phase 2: build/type/lint reliability.
   - Phase 3: API validation and data integrity.
   - Phase 4: test coverage and CI gates.
   - Phase 5: route/SEO architecture cleanup.
   - Phase 6: performance/accessibility polish.

3. **Task breakdown**
   - Bite-sized tasks.
   - Exact files to inspect/modify.
   - Acceptance criteria per task.
   - Commands to run after each phase.
   - Commit strategy.

4. **Safety rules**
   - Do not read or print secrets.
   - Do not commit `.env` files.
   - Do not push directly to production.
   - Prefer feature branches and small commits.
   - Keep external behaviour stable unless a route is intentionally redirected.

5. **Verification commands**
   - Typecheck.
   - Lint.
   - Build.
   - Tests, once added.
   - Basic smoke checks for critical routes.

6. **Definition of done**
   - A precise checklist that says when the Welsh site can be considered robust enough for deployment.

## Known critical findings to prioritise

From `audit/claude-output-ADV-12.json`:

- Admin panel can open if `ADMIN_PASSWORD` is missing.
- JWT fallback uses `dev-secret` in middleware/admin auth.
- `/api/mcp` appears unauthenticated.
- Dynamic CMS API accepts unvalidated request bodies.
- Login/magic-link flow has no rate limiting.
- No tests.
- No CI pipeline.
- `.env.example` is incomplete.
- `next.config.js` and `next.config.ts` both exist.
- Security headers are missing.

From `docs/ERROR-AUDIT.md`:

- `/api/admin/*` protection was critical; current middleware appears to include it, but verify properly.
- `/api/upload` had no auth; current route has a weak check and must be verified/fixed.
- `DATABASE_URL` guard now appears present; verify.
- Search/schema mismatches and TypeScript issues may still exist; re-run checks.
- Missing error boundaries and rate limiting remain likely gaps.

## Tone of the plan

Practical, careful, and implementation-ready. Avoid vague advice. Make it possible to execute phase-by-phase without losing control of the codebase.
