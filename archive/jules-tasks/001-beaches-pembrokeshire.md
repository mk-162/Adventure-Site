# Task: Pembrokeshire Beaches Research

## Objective
Research and document ALL notable beaches in Pembrokeshire, Wales. This is raw data gathering for Adventure Wales - quality content will be crafted from this research later.

## Output
Create/update: `content/spots/beaches/pembrokeshire.csv`

## Beaches to Research
Include but not limited to:
- Barafundle Bay
- Broad Haven (north & south)
- Freshwater West
- Marloes Sands
- Whitesands (St Davids)
- Newgale
- Tenby North Beach
- Tenby South Beach (Castle Beach)
- Saundersfoot
- Amroth
- Manorbier
- Stackpole Quay
- Newport Sands (Parrog)
- Poppit Sands
- Abereiddy (Blue Lagoon area)
- Abermawr
- Druidston Haven
- Little Haven
- Musselwick Sands
- West Angle Bay
- Lydstep Haven

Search for others not on this list.

## CSV Schema

```csv
slug,name,region,lat,lon,parking_lat,parking_lon,parking_cost,beach_type,length_m,facilities,blue_flag,lifeguards,lifeguard_season,dog_rules,water_sports,rock_pools,family_friendly,best_season,hazards,quality_score,tier,tags_audience,tags_features,tags_conditions,description,source_urls
```

## Field Definitions

| Field | Type | Example |
|-------|------|---------|
| slug | string | `barafundle-bay` |
| name | string | `Barafundle Bay` |
| region | string | `pembrokeshire` |
| lat, lon | float | `51.6283, -4.9142` |
| parking_lat, parking_lon | float | Nearest car park |
| parking_cost | string | `free`, `£5/day`, `NT members free` |
| beach_type | enum | `sand`, `pebble`, `mixed`, `rocky` |
| length_m | int | Beach length in metres |
| facilities | string | Comma-separated: `toilets,cafe,showers` |
| blue_flag | boolean | `true` or `false` |
| lifeguards | boolean | `true` or `false` |
| lifeguard_season | string | `May-Sep`, `Jul-Aug`, `none` |
| dog_rules | string | `allowed`, `seasonal-ban-May-Sep`, `banned` |
| water_sports | string | `surfing,kayaking,swimming,coasteering` |
| rock_pools | boolean | `true` or `false` |
| family_friendly | int | 1-5 rating |
| best_season | string | `all-year`, `summer`, `spring-autumn` |
| hazards | string | `strong-currents,rips,submerged-rocks,tides` |
| quality_score | int | 1-10 (see rubric below) |
| tier | string | `A`, `B`, or `C` |
| tags_audience | string | `family-friendly,dog-friendly,accessible` |
| tags_features | string | `parking-free,toilets,cafe,rock-pools` |
| tags_conditions | string | `all-year,tide-dependent,crowds-high` |
| description | string | 100-150 words, unique, specific |
| source_urls | string | Research sources, comma-separated |

## Quality Scoring Rubric

Score each beach 1-10:

**Destination Worth (0-3 points)**
- 3 = People travel specifically for this beach
- 2 = Worth a detour if in the area
- 1 = Convenient if local
- 0 = Only if nothing else available

**Quality of Experience (0-3 points)**
- 3 = Exceptional - stunning scenery, pristine
- 2 = Good - enjoyable, clean, pleasant
- 1 = Acceptable - functional
- 0 = Poor - issues with litter, water quality

**Uniqueness (0-2 points)**
- 2 = One of a kind
- 1 = Nice but similar options exist
- 0 = Generic, interchangeable

**Practical Quality (0-2 points)**
- 2 = Excellent facilities, easy parking
- 1 = Basic facilities
- 0 = No facilities, difficult access

**Tier Assignment:**
- Score 8-10 = Tier A
- Score 5-7 = Tier B
- Score 1-4 = Tier C

## Description Guidelines

Each description should be:
- **Specific** - mention actual features, not generic praise
- **Practical** - include tips that help planning
- **Honest** - mention downsides and warnings
- **Unique** - don't copy from other sources

**Good example:**
> "Barafundle Bay requires a 15-minute walk from Stackpole Quay car park, and that's exactly why it stays special. No cars, no ice cream vans, no crowds even in August. Golden sand, Caribbean-clear water on calm days. Gets busy by 11am in summer - arrive early or stay late. No facilities at beach; use Stackpole Quay before walking."

**Bad example:**
> "Beautiful beach with golden sand and clear water. Great for families. Lovely views."

## Research Sources
- Visit Pembrokeshire official site
- Pembrokeshire Coast National Park
- Blue Flag database
- TripAdvisor reviews (for practical insights)
- Google Maps (verify coordinates, parking)
- Local council beach pages

## Verification Checklist
Before submitting:
- [ ] All coordinates plot correctly on map
- [ ] No duplicate slugs
- [ ] All required fields populated
- [ ] Descriptions are unique (not copied)
- [ ] Scores follow rubric honestly
- [ ] Source URLs are valid

## Target
15-25 beaches with complete, verified data
