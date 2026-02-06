# Adventure Wales Playbook

Operating playbooks for building Adventure Wales. These are the rules we follow.

## Contents

| Document | Purpose |
|----------|---------|
| [PSEO-PLAYBOOK.md](PSEO-PLAYBOOK.md) | Programmatic SEO patterns and quality standards |
| [PSEO-STRATEGY.md](PSEO-STRATEGY.md) | Page types, URL structure, implementation plan |
| [INTERNAL-LINKING.md](INTERNAL-LINKING.md) | Hub & spoke model, link rules by page type |
| [IMAGE-STRATEGY.md](IMAGE-STRATEGY.md) | How to source, license, and use images |
| [DATA-QUALITY.md](DATA-QUALITY.md) | Scoring rubric, tiers, tagging taxonomy |
| [JULES-TASKS.md](JULES-TASKS.md) | Research task prompts for Jules |
| [CONTENT-WORKFLOW.md](CONTENT-WORKFLOW.md) | How research becomes quality pages |
| [ULTIMATE-CONTENT-PLAN.md](ULTIMATE-CONTENT-PLAN.md) | Overall content architecture |

## The Golden Rules

1. **Every page must provide unique value** — not just swapped variables in a template
2. **Data defensibility** — proprietary > first-party > licensed > public
3. **Honest content** — include warnings, negatives, real talk
4. **Images are licensed or linked** — no copying copyrighted material
5. **Quality scores everything** — every spot scored 1-10, tiered A/B/C, cream floats

## Quick Reference

### Page Patterns
- `/[region]/[activity]/` — Locations (MTB in Snowdonia)
- `/operators/[activity]/` — Directory (coasteering operators)
- `/trails/[slug]/` — Profiles (coed-y-brenin)
- `/best/[topic]/` — Curation (best beaches wales)
- `/for/[persona]/` — Personas (family adventures)

### Spots Database
All spot data lives in `/content/spots/` with activity-specific CSVs.

### Image Sources (Safe)
- Wikimedia Commons (CC)
- Geograph (CC)
- Unsplash (free license)
- Source Cards for commercial content (link, don't copy)

### Internal Linking
- **Hub & Spoke** — Activity/region hubs link to all children, children link back
- **Every page needs:** Breadcrumbs, related content block, operator CTA (where relevant)
- **Link density:** Hubs 15-30, profiles 8-15, curation 15-25
- **Anchor text:** Descriptive, natural, not keyword-stuffed

### Quality Tiers
| Score | Tier | Treatment |
|-------|------|-----------|
| 8-10 | A | Full profile, featured in "Best Of", shown first |
| 5-7 | B | Listed on pages, brief profile |
| 1-4 | C | Search only, minimal profile |

### Scoring Rubric (0-10)
- **Destination Worth (0-3):** Would people travel for this?
- **Experience Quality (0-3):** How good is it actually?
- **Uniqueness (0-2):** Can you get this elsewhere?
- **Practical Quality (0-2):** Facilities, access, maintenance?
