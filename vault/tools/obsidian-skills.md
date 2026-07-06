---
title: Obsidian Skills
status: reference
date: 2026-07-06
tags: [tools, obsidian]
---

# Tools: Obsidian Skills

Per the 162 Memory System, vault read/write should use the Obsidian skills when working
inside Obsidian contexts:

- `obsidian-markdown` — wikilinks, embeds, callouts, frontmatter conventions
- `obsidian-bases` — `.base` database views over notes
- `obsidian-cli` — vault operations from the command line
- `json-canvas` — `.canvas` visual maps

Install (if missing): `npx skills add https://github.com/kepano/obsidian-skills --yes --global`

For plain agent work in this repo, direct file reads/writes on `vault/` are fine — the
notes are standard markdown. Keep frontmatter (`title`, `status`, `date`, `tags`) and
`[[wikilinks]]` intact so the vault stays navigable in Obsidian.

Open the `vault/` folder as an Obsidian vault to browse/graph it.
