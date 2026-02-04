# Adventure Wales — Operator Research Brief

## What Exists
- **35 operators** in the database with basic info (name, website, phone, email, address, category, activity types)
- **45 activities** with pricing and booking URLs
- All data is skeleton-level — needs enriching

## What Needs Researching Per Operator

### Must Have (Priority 1)
| Field | Current State | Action |
|-------|--------------|--------|
| Lat/lng coordinates | 0/35 populated | Look up from address or Google Maps |
| Real Google rating | Placeholder 4.5s | Get actual rating from Google |
| Review count | 0/35 | Get from Google |
| Proper description | 27-45 char stubs | Write 150-300 word original description |
| Tagline | 0/35 | Write punchy one-liner |
| Trust signals | 0/35 | Check AALA, qualifications, B Corp, years est. |

### Should Have (Priority 2)
| Field | Current State | Action |
|-------|--------------|--------|
| Service details (JSONB) | None | Sessions, group sizes, equipment, what to bring |
| Activity pricing | 44/45 have basic | Verify current, add child/group rates |
| TripAdvisor URL | 0/35 | Find and store link |
| Opening hours/seasons | None | Research from website |
| Meeting points | None | Research from website |

### Nice to Have (Priority 3)
| Field | Current State | Action |
|-------|--------------|--------|
| Logo URL | 0/35 | Find or note for later |
| Cover image | 0/35 | Note for image generation |
| Cancellation policy | None | Check booking pages |

## Research Order
1. **Tier 1 — 8 premium operators** (these show prominently on the site)
2. **Tier 2 — 27 claimed operators** (fill in order of region coverage)

## Hit List File
See `operator-hitlist.json` — full list with IDs, names, websites, regions, activity types.

## Output
Produce one JSON file per batch (5-10 operators) matching the format in SKILL.md.
Save to: `/home/minigeek/Adventure-Site/data/research/batch-{n}.json`
