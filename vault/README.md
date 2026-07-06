---
title: Adventure Wales Vault
status: active
date: 2026-07-06
tags: [index]
---

# Adventure Wales — Agent Memory Vault

Long-term structured memory for AI agents working on Adventure Wales, following the
[162 Memory System](https://github.com/mk-162/162-memory-system) convention. Read
[[rules]] first. In deterministic ("Phoebe") mode, answer **only** from these notes
and cite them.

## Map

- **meta/** — [[rules]] — how to use and maintain this vault
- **context/** — immutable-ish facts: [[brand]], [[site-facts]], [[business-model]], [[market]], [[competitors]], [[growth-playbook]]
- **projects/** — one note per active initiative: [[launch-readiness]], [[content-expansion]]
- **workflows/** — SOPs: [[link-integrity-crawl]], [[launch-widening]], [[code-quality-gates]], [[operator-verification-publishing]], [[content-ops-pipeline]], [[pseo-content-strategy]], [[image-sourcing]], [[new-site-blueprint]]
- **tools/** — [[scripts-and-commands]], [[obsidian-skills]]

## Where the vault fits

| Layer | Purpose | Location |
|-------|---------|----------|
| Session memory | Working context for the current task | agent runtime |
| **This vault** | Durable project knowledge, SOPs, business context | `vault/` |
| Repo docs | Deep historical detail (verbose, partly stale) | `audits/`, `plans/`, `playbook/`, `docs/`, `goals/` |

The vault is the curated layer. When it conflicts with older repo docs, the vault wins;
when it conflicts with the code, the code wins — then fix the vault note.
