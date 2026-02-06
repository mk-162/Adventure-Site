# Task: Gower Surf Breaks Research

## Objective
Research and document ALL surfable breaks on the Gower Peninsula.

## Output
Create/update: `content/spots/surfing/gower.csv`

## Breaks to Research
- Llangennith (main break)
- Llangennith (Diles Lake end)
- Rhossili
- Langland Bay
- Langland Reef
- Caswell Bay
- Oxwich Point
- Port Eynon Point
- Horton
- Broughton Bay
- Pete's Reef
- Hunts Bay

Search for others known to local surfers.

## CSV Schema

```csv
slug,name,region,lat,lon,break_type,wave_direction,best_wind,best_swell_direction,best_swell_size,best_tide,wave_size_min_ft,wave_size_max_ft,bottom_type,crowd_factor,skill_level,hazards,parking_lat,parking_lon,parking_cost,facilities,surf_schools,quality_score,tier,tags_audience,tags_conditions,description,source_urls
```

## Field Definitions

| Field | Type | Example |
|-------|------|---------|
| slug | string | `llangennith` |
| name | string | `Llangennith` |
| region | string | `gower` |
| break_type | enum | `beach-break`, `reef-break`, `point-break` |
| wave_direction | enum | `left`, `right`, `both` |
| best_wind | string | `E`, `NE`, `offshore-E-NE` |
| best_swell_direction | string | `W`, `SW`, `NW-W` |
| best_swell_size | string | `3-6ft`, `2-4ft` |
| best_tide | string | `all`, `low`, `mid`, `high`, `low-mid` |
| wave_size_min_ft | int | Minimum rideable size |
| wave_size_max_ft | int | Maximum holdable size |
| bottom_type | enum | `sand`, `rock`, `reef`, `cobble` |
| crowd_factor | int | 1-5 (1=empty, 5=packed) |
| skill_level | enum | `beginner`, `intermediate`, `advanced`, `all` |
| surf_schools | string | Names of operators running lessons here |

## Quality Scoring
Same rubric as beach tasks:
- Destination Worth (0-3)
- Experience Quality (0-3) — wave quality, consistency
- Uniqueness (0-2)
- Practical Quality (0-2) — parking, facilities

## Description Guidelines
For each break describe:
- Wave character (punchy, mellow, hollow, walling)
- Best conditions for each skill level
- Where to sit in the lineup
- Hazards specific to this break
- Crowd dynamics (busy times, localism)

**Good example:**
> "Llangennith is Gower's most consistent break - a 3-mile beach that picks up any swell going. The north end near Hillend is best for intermediates; beginners stick to the middle where the surf schools operate. Gets crowded on good weekends but the beach is long enough to spread out. Watch for rips on bigger days, especially near the stream outlets."

## Research Sources
- Magic Seaweed spot guides
- Surf Forecast
- Welsh Surfing Federation
- Local surf school websites
- UKSurfGuide

## Target
10-12 breaks with complete surf-specific data
