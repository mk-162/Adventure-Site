---
title: Scripts & Commands
status: active
date: 2026-07-06
tags: [tools, reference]
---

# Tools: Scripts & Commands

## npm scripts (package.json)

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (localhost:3000) |
| `npm run build` / `start` | Production build / serve (`rm -rf .next` first for verification builds) |
| `npm run typecheck` / `test` / `lint` | Quality gates ([[code-quality-gates]]) |
| `npm run db:generate` / `db:migrate` | Drizzle migrations (never `db:push`) |
| `npm run db:studio` | Drizzle Studio on the DB |
| `npm run content-ops:audit` / `report` / `tasks` / `swarm` / `links` | Content-ops pipeline ([[content-ops-pipeline]]) |
| `npm run db:import` / `db:import-itineraries` / `db:import-journal` | One-way content/data → DB imports |

## Ad-hoc DB access (no psql needed)

```bash
node -e "
require('dotenv').config({ path: '.env.local', quiet: true });
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
sql\`select slug, status from operators where status = 'published'\`.then(r => console.log(r));"
```
(Agents have also used `scripts/sql.cjs` where present.) Read-only by default;
mutations only with explicit intent — this is the **production** database.

## Admin

- Set/reset an admin password: `npx tsx scripts/set-admin-password.ts <email>`
- Admin UI: `/admin` (content), `/admin/content-ops` (pipeline command centre),
  `/admin/commercial/claims` (operator claim review queue)

## Environment

- Local env: `.env.local` (gitignored). Template + required-var docs: `.env.example`.
- Vercel CLI is linked to project `adventure-site`; `vercel env` manages prod vars.

## Claude Code skills available in this project

`generate-images` (Openverse/Unsplash sourcing — see [[image-sourcing]]),
`generate-faqs`, `generate-itineraries`, plus the Obsidian skills for this vault
([[obsidian-skills]]).
