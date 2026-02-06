# Adventure Wales Playbook

Operating playbooks for building Adventure Wales. These are the rules we follow.

## Contents

| Document | Purpose |
|----------|---------|
| [PSEO-PLAYBOOK.md](PSEO-PLAYBOOK.md) | Programmatic SEO patterns and quality standards |
| [PSEO-STRATEGY.md](PSEO-STRATEGY.md) | Page types, URL structure, implementation plan |
| [INTERNAL-LINKING.md](INTERNAL-LINKING.md) | Hub & spoke model, link rules by page type |
| [IMAGE-STRATEGY.md](IMAGE-STRATEGY.md) | How to source, license, and use images |
| [ULTIMATE-CONTENT-PLAN.md](ULTIMATE-CONTENT-PLAN.md) | Overall content architecture |

## The Golden Rules

1. **Every page must provide unique value** — not just swapped variables in a template
2. **Data defensibility** — proprietary > first-party > licensed > public
3. **Honest content** — include warnings, negatives, real talk
4. **Images are licensed or linked** — no copying copyrighted material

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
