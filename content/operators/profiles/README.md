# Operator Profiles — Editorial Source of Truth

Markdown briefs for Tier-1 / Tier-2 operators that need richer page content than the seed CSV can carry.

## Why this folder exists

Operator pages at `/directory/<slug>` are rendered from the `operators` database table. The seed source for that table is `content/operators.csv` — fine for short blurbs, but too constrained for the kind of experience breakdowns and durable framing the launch-priority operators need (Velocity 2 vs Titan, Bounce Below vs Caverns, course catalogues, 1953 Everest training-base heritage, etc).

This folder holds the **long-form editorial copy** for those operators. It's the canonical source a researcher or editor pulls from when:

- Re-seeding the database with richer `description` / `tagline` / `unique_selling_point` fields
- Building an enrichment overlay layer (similar to `data/combo-pages/*.json` for combos)
- Drafting outreach copy for operator claim flows

Each file is one operator, named by slug (`zip-world.md`, `plas-y-brenin.md`, etc).

## What goes in a profile

- **Hero positioning** — the one-line elevator pitch and why this operator matters for Adventure Wales
- **Experience breakdown** — distinct named products / sites / sessions (NOT a pricing sheet)
- **Heritage / context** — durable facts (founding year, awards, location story) that don't go stale
- **Pairing notes** — how this operator fits the wider Snowdonia / Wales itinerary
- **Verification flags** — anything an editor needs to check against the operator's own website before launch

## What does NOT go here

- Live pricing — moves too often, gets stale, undermines trust
- Current-year timetables / opening hours — verify direct with operator
- AI-generated photos of real businesses — never (per `docs/EDITOR-WORKFLOW.md`)
- Third-party reviews quoted as fact — paraphrase the consensus instead

## Current profiles

| Slug | Tier | Priority | Notes |
| --- | --- | --- | --- |
| `zip-world.md` | Premium | P0 | Velocity 2 / Titan 2 / Caverns / Fforest portfolio |
| `adventure-parc-snowdonia.md` | Tier 1 | P0 | UK's only inland surf lagoon at this scale |
| `plas-y-brenin.md` | Tier 1 | P1 | National Outdoor Centre — course-led, not drop-in |
| `coed-y-brenin-nrw.md` | Tier 2 | P1 | UK's first purpose-built MTB centre (1996) |
| `pen-y-gwryd-hotel.md` | Tier 2 | P1 | 1953 Everest training-base heritage |
