# Jules Research Tasks

*Best-in-class prompts for comprehensive, quality-scored data capture*

---

## How to Use

1. Copy the task prompt below
2. Paste into Jules with the context files attached
3. Let it run
4. Validate output against schema
5. Merge to database

**Attach to each task:**
- `playbook/DATA-QUALITY.md` (scoring rubric)
- Existing CSV as reference (if available)
- `playbook/PSEO-PLAYBOOK.md` (content standards)

---

## Task 1: Wales Beach Database

```markdown
# Task: Build Comprehensive Wales Beach Database

## Objective
Research and document every notable beach in Wales. Create a complete, 
quality-scored database that powers Adventure Wales beach pages.

## Quality Standards

Every beach MUST be scored 1-10 using this rubric:

### Destination Worth (0-3 points)
- 3 = People travel specifically for this beach (Rhossili, Barafundle)
- 2 = Worth a detour if in the area
- 1 = Convenient if local
- 0 = Only if nothing else available

### Quality of Experience (0-3 points)  
- 3 = Exceptional - stunning scenery, pristine conditions
- 2 = Good - enjoyable, clean, pleasant
- 1 = Acceptable - functional
- 0 = Poor - issues with litter, water quality, access

### Uniqueness (0-2 points)
- 2 = One of a kind (Blue Lagoon Abereiddy, Three Cliffs)
- 1 = Nice but similar options exist
- 0 = Generic, interchangeable

### Practical Quality (0-2 points)
- 2 = Excellent facilities, easy parking, well-maintained
- 1 = Basic facilities
- 0 = No facilities, difficult access

**Tier Assignment:**
- Score 8-10 = Tier A (feature worthy)
- Score 5-7 = Tier B (solid option)
- Score 1-4 = Tier C (completeness only)
- Score 0 = Don't include

## Output Schema

CSV with these columns:

```csv
slug,name,region,lat,lon,parking_lat,parking_lon,parking_cost,beach_type,length_m,facilities,blue_flag,lifeguards,lifeguard_season,dog_rules,water_sports,rock_pools,family_friendly,best_season,hazards,quality_score,tier,tags_audience,tags_features,tags_conditions,description,source_urls
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| slug | string | URL-safe identifier (lowercase, hyphens) |
| name | string | Display name |
| region | enum | gower, pembrokeshire, llyn-peninsula, anglesey, ceredigion, snowdonia-coast, carmarthenshire, south-wales |
| lat, lon | float | Beach coordinates (centre point) |
| parking_lat, parking_lon | float | Nearest parking coordinates |
| parking_cost | string | "free", "£X/day", "£X/hour" |
| beach_type | enum | sand, pebble, mixed, rocky |
| length_m | int | Beach length in metres |
| facilities | string | Comma-separated: toilets,cafe,showers,shop,restaurant |
| blue_flag | boolean | true/false |
| lifeguards | boolean | true/false |
| lifeguard_season | string | "May-Sep", "Jul-Aug", "none" |
| dog_rules | string | "allowed", "seasonal-ban-May-Sep", "banned" |
| water_sports | string | Comma-separated: surfing,kayaking,sup,swimming,bodyboarding |
| rock_pools | boolean | true/false |
| family_friendly | int | 1-5 rating |
| best_season | string | "all-year", "summer", "spring-autumn" |
| hazards | string | Comma-separated warnings |
| quality_score | int | 1-10 per rubric |
| tier | enum | A, B, C |
| tags_audience | string | Comma-separated: family-friendly,dog-friendly,beginner-friendly,accessible |
| tags_features | string | Comma-separated: parking-free,toilets,cafe,etc |
| tags_conditions | string | Comma-separated: all-year,crowds-high,tide-dependent,etc |
| description | string | 100-200 words, unique, specific, honest |
| source_urls | string | Comma-separated research sources |

## Research Approach

1. Start with known quality beaches (Visit Wales, Blue Flag list)
2. Work through each region systematically
3. Cross-reference multiple sources
4. Verify coordinates with Google Maps
5. Check for recent reviews (TripAdvisor, Google) for current conditions
6. Note seasonal variations

## Regions to Cover

| Region | Priority | Notes |
|--------|----------|-------|
| Pembrokeshire | High | Most beaches, highest quality |
| Gower | High | Famous beaches, surf spots |
| Llŷn Peninsula | High | Underrated, beautiful |
| Anglesey | Medium | Good variety |
| Ceredigion | Medium | Quieter, dolphin-watching |
| Snowdonia coast | Medium | Harlech, Barmouth area |
| South Wales | Low | Urban beaches, fewer |
| Carmarthenshire | Low | Estuary areas |

## Description Guidelines

Each description should:
- Open with what makes this beach distinctive
- Include practical "insider" info (best parking, quiet spots)
- Mention any warnings or downsides honestly
- Be specific, not generic ("golden sand stretching..." is lazy)
- Include seasonal notes if relevant

**Good example:**
"Barafundle Bay requires a 15-minute walk from Stackpole Quay car park, 
and that's exactly why it stays special. No cars, no ice cream vans, no 
crowds even in August. The sand is golden, the water Caribbean-clear on 
calm days. Gets busy by 11am in summer - arrive early or stay late. 
No facilities at the beach; use Stackpole Quay before you walk."

**Bad example:**
"Beautiful beach with golden sand and clear water. Great for families. 
Lovely views. Recommended."

## Target Output

- Minimum 50 beaches
- All Tier A beaches in Wales (expect ~10-15)
- Comprehensive Tier B coverage (expect ~25-30)
- Selected Tier C for completeness (expect ~10-15)

## Quality Checks

Before submitting, verify:
- [ ] All coordinates are valid and accurate
- [ ] No duplicate slugs
- [ ] All required fields populated
- [ ] Scores match rubric (not inflated)
- [ ] Descriptions are unique (no copy-paste)
- [ ] Source URLs are real
- [ ] Tier matches score
```

---

## Task 2: Wales Surf Breaks Database

```markdown
# Task: Build Comprehensive Wales Surf Breaks Database

## Objective
Research and document every surfable break in Wales. Create a quality-scored 
database for surfers of all levels.

## Quality Standards

Score 1-10 using rubric:

### Destination Worth (0-3)
- 3 = Destination break, people travel specifically (Llangennith, Freshwater West)
- 2 = Worth a detour
- 1 = Convenient local option
- 0 = Rarely worth surfing

### Quality of Experience (0-3)
- 3 = Exceptional waves, consistent, fun
- 2 = Good waves, reliable
- 1 = Average, inconsistent
- 0 = Poor quality waves

### Uniqueness (0-2)
- 2 = Unique setup, rare wave type
- 1 = Good but similar breaks exist
- 0 = Generic beach break

### Practical Quality (0-2)
- 2 = Easy parking, good access, amenities
- 1 = Adequate
- 0 = Difficult access, no facilities

## Output Schema

```csv
slug,name,region,lat,lon,break_type,wave_direction,best_wind,best_swell_direction,best_swell_size,best_tide,wave_size_min_ft,wave_size_max_ft,bottom_type,crowd_factor,skill_level,hazards,parking_lat,parking_lon,parking_cost,facilities,surf_schools,quality_score,tier,tags_audience,tags_conditions,description,source_urls
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| break_type | enum | beach-break, reef-break, point-break, river-mouth |
| wave_direction | enum | left, right, both |
| best_wind | string | "E", "NE", "offshore-E-NE" |
| best_swell_direction | string | "W", "SW", "NW-W" |
| best_swell_size | string | "3-6ft", "2-4ft" |
| best_tide | string | "all", "low", "mid", "high", "low-mid", "mid-high" |
| wave_size_min_ft | int | Minimum rideable size |
| wave_size_max_ft | int | Maximum holdable size |
| bottom_type | enum | sand, rock, reef, cobble |
| crowd_factor | int | 1-5 (1=empty, 5=packed) |
| skill_level | enum | beginner, beginner-intermediate, intermediate, intermediate-advanced, advanced |
| surf_schools | string | Comma-separated operator names |

## Research Sources

- Magic Seaweed (spot guides)
- Surf Forecast
- UK Surf Guide
- Local surf school websites
- Stormrider guides

## Regions

| Region | Priority | Expected breaks |
|--------|----------|-----------------|
| Gower | High | 10-12 (Llangennith, Langland, Caswell, etc.) |
| Pembrokeshire | High | 8-10 (Freshwater West, Newgale, Whitesands) |
| Llŷn Peninsula | High | 5-8 (Hell's Mouth, Abersoch, Porth Neigwl) |
| South Wales | Medium | 3-5 (Rest Bay, Porthcawl) |
| Anglesey | Low | 2-3 |

## Description Guidelines

- Wave character (punchy, mellow, hollow, walling)
- Best conditions for each level
- Hazards specific to this break
- Local knowledge (where to sit, avoid, etc.)
- Crowd dynamics

**Target: 35-40 breaks**
```

---

## Task 3: Wales Hiking Trails Database

```markdown
# Task: Build Comprehensive Wales Hiking Trails Database

## Objective
Document every notable hiking trail in Wales - from summit routes to 
coastal walks to waterfall trails.

## Quality Standards

Score 1-10:

### Destination Worth (0-3)
- 3 = Bucket list hike (Snowdon, Crib Goch, Pembrokeshire Coast Path)
- 2 = Worth travelling for
- 1 = Good local walk
- 0 = Unremarkable

### Quality of Experience (0-3)
- 3 = Exceptional scenery, memorable, rewarding
- 2 = Good views, enjoyable
- 1 = Pleasant enough
- 0 = Boring, uninteresting

### Uniqueness (0-2)
- 2 = One of a kind experience
- 1 = Good but similar hikes exist
- 0 = Generic

### Practical Quality (0-2)
- 2 = Well-marked, good paths, easy parking
- 1 = Adequate navigation, some rough sections
- 0 = Poor paths, navigation difficult, access issues

## Output Schema

```csv
slug,name,region,lat_start,lon_start,lat_end,lon_end,distance_km,ascent_m,descent_m,route_type,time_hours_min,time_hours_max,terrain,difficulty,waymarked,os_map,parking_lat,parking_lon,parking_cost,facilities_start,dog_friendly,best_season,hazards,highlights,quality_score,tier,tags_audience,tags_features,tags_conditions,description,source_urls
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| route_type | enum | circular, linear, out-and-back |
| difficulty | enum | easy, moderate, challenging, strenuous, extreme |
| terrain | string | Comma-separated: mountain,coastal,woodland,moorland,riverside |
| waymarked | string | "yes", "partial", "no" |
| os_map | string | "OL17", "OL12", etc. |
| highlights | string | Key features: "summit views,waterfall,lake,ridge walk" |

## Categories to Cover

1. **Summit routes** - All major Welsh peaks
2. **Coastal walks** - Pembrokeshire, Llŷn, Anglesey, Gower
3. **Waterfall walks** - Brecon Beacons, Snowdonia
4. **Ridge walks** - Snowdonia horseshoes, Brecon ridges
5. **Lake circuits** - Llyn Idwal, Llyn Ogwen, etc.
6. **Long-distance sections** - Notable sections of national trails

## Snowdonia Must-Haves

- All 6 Snowdon routes
- Crib Goch
- Tryfan (all routes)
- Glyders circuit
- Carneddau horseshoe
- Cadair Idris (all routes)
- Cnicht
- Moel Siabod
- Rhinogs

## Brecon Must-Haves

- Pen y Fan (all routes)
- Corn Du
- Fan y Big
- Fan Brycheiniog
- Waterfall Country walks
- Sugar Loaf
- Skirrid

**Target: 70-80 trails**
```

---

## Task 4: Wales Wild Swimming Database

```markdown
# Task: Build Comprehensive Wales Wild Swimming Database

## Objective
Document wild swimming spots - lakes, rivers, waterfalls, sea pools, 
and coastal swimming locations.

## Quality Standards

Score 1-10:

### Destination Worth (0-3)
- 3 = Iconic swimming spot (Blue Lagoon, Fairy Glen)
- 2 = Worth seeking out
- 1 = Nice if passing
- 0 = Unremarkable

### Quality of Experience (0-3)
- 3 = Exceptional - clear water, beautiful setting, magical
- 2 = Good - clean, pleasant, refreshing
- 1 = Fine - does the job
- 0 = Poor - murky, dirty, unappealing

### Uniqueness (0-2)
- 2 = One of a kind
- 1 = Good but similar exist
- 0 = Generic

### Practical Quality (0-2)
- 2 = Easy access, safe entry/exit, parking nearby
- 1 = Requires effort but manageable
- 0 = Difficult access, hazards

## Output Schema

```csv
slug,name,region,lat,lon,water_type,depth_m,water_quality,temperature_summer_c,temperature_winter_c,access_difficulty,entry_type,parking_lat,parking_lon,parking_cost,facilities,family_friendly,dog_friendly,best_time,hazards,quality_score,tier,tags_audience,tags_features,tags_conditions,description,source_urls
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| water_type | enum | lake,river,waterfall-pool,sea-pool,tidal-pool,reservoir,quarry |
| access_difficulty | enum | easy,moderate,scramble,hike-required |
| entry_type | string | "gradual,jumping,steps,rocky" |
| water_quality | enum | excellent,good,moderate,variable |

## Categories

1. **Mountain lakes** - Llyn Idwal, Llyn Ogwen, etc.
2. **River pools** - Fairy Glen, Horseshoe Falls
3. **Waterfall pools** - Sgwd yr Eira, etc.
4. **Quarry lakes** - Blue Lagoon Abereiddy
5. **Sea pools** - Tidal pools, coves
6. **Reservoirs** - Where swimming permitted

**Target: 35-40 spots**
```

---

## Validation Checklist

After each Jules task, verify:

### Data Quality
- [ ] All coordinates plot correctly on map
- [ ] No duplicate slugs
- [ ] Regions match our defined list
- [ ] Scores follow rubric (check outliers)
- [ ] Tier matches score

### Content Quality
- [ ] Descriptions are unique (run plagiarism check)
- [ ] Descriptions are specific, not generic
- [ ] Local knowledge included where possible
- [ ] Hazards documented
- [ ] Honest about downsides

### Completeness
- [ ] All known Tier A spots included
- [ ] Geographic coverage even
- [ ] No obvious gaps

---

## Revision History

| Date | Change |
|------|--------|
| 2025-02-06 | Initial task briefs |
