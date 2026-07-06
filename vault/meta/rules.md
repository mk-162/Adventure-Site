---
title: Vault Rules
status: active
date: 2026-07-06
tags: [meta, rules]
---

# Vault Rules

## Structure (162 convention)

- `meta/` — these rules
- `context/` — brand, strategy, market facts. Changes rarely; treat as authoritative.
- `projects/` — one note per active initiative. Frontmatter: `title`, `status` (active/paused/done), `priority`, `date`, `tags`. Body: Business Context, Key Links, Current Focus, Next Action.
- `workflows/` — SOPs. A workflow note must be executable by an agent with no session context: exact paths, exact commands, gotchas.
- `tools/` — documentation of scripts, skills, and commands.

## Reading discipline

1. Start every substantial task by reading `vault/README.md` and the relevant project note.
2. **Phoebe mode** (`Phoebe:` or `phi:` prefix in a request): answer ONLY from vault notes, cite the note (`[[note-name]]`), and say "not in the vault" rather than inferring.
3. Trust order on conflict: **code > vault > repo docs** (`plans/`, `playbook/`, `docs/` are verbose and partly stale). When you find a conflict, fix the vault note in the same session.

## Writing discipline

1. Update the project note's **Current Focus / Next Action** whenever you finish meaningful work — the next agent starts from there.
2. New durable learning (a gotcha, a decision, a verified fact) goes into the most specific existing note; create a new note only when none fits, and link it from `vault/README.md`.
3. Keep notes ≤ ~150 lines. When a note grows past that, split it and leave a stub link.
4. Convert relative dates to absolute (not "last week" — "2026-07-01").
5. Never store secrets in the vault (no passwords, API keys, connection strings). Reference env var *names* only.
6. Facts must carry provenance when they came from outside the repo: a source link or "verified against DB on <date>".

## Known gotchas (hard-won, do not re-learn)

- **Stale `.next` incremental cache** can serve old rendered output after a rebuild — `rm -rf .next` before verification builds.
- **`kill` on the npm wrapper does not kill `next-server`** — pkill the `next-server` process or the port stays held and you silently test a stale build.
- **Master `Operators.csv` is NOT publish-safe** — systematically wrong phone/email/ratings. See [[operator-verification-publishing]].
- **Launch gate leaks happen at link-generation sites, not routes** — routes 404 correctly; the bug class is UI that still emits the link. Filter every link source through `src/lib/launch.ts`. Verify with [[link-integrity-crawl]].
- The DB has all-Wales content published; **public visibility is code-gated**, not data-gated. Widening = edit `src/lib/launch.ts` (see [[launch-widening]]).
