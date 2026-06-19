# Task: Snowdonia Summit Hikes Research

## Objective
Research and document ALL notable summit routes and mountain hikes in Snowdonia National Park.

## Output
Create/update: `content/spots/hiking/snowdonia.csv`

## Routes to Research

### Snowdon (all 6 main routes)
- Llanberis Path
- Pyg Track
- Miners' Track
- Watkin Path
- Snowdon Ranger Path
- Rhyd Ddu Path

### Other Major Peaks
- Tryfan (North Ridge, Heather Terrace)
- Glyder Fach & Glyder Fawr (Ogwen routes)
- Y Garn
- Pen yr Ole Wen
- Carnedd Dafydd & Carnedd Llewelyn (Carneddau)
- Cadair Idris (Minffordd, Pony Path, Llanfihangel)
- Crib Goch (full traverse)
- Cnicht
- Moel Siabod
- Rhinog Fawr & Rhinog Fach
- Moelwyn Mawr
- Arenig Fawr
- Aran Fawddwy
- Elidir Fawr

### Classic Rounds
- Snowdon Horseshoe
- Glyderau Horseshoe
- Carneddau Traverse
- Nantlle Ridge

## CSV Schema

```csv
slug,name,region,lat_start,lon_start,lat_summit,lon_summit,distance_km,ascent_m,descent_m,route_type,time_hours_min,time_hours_max,terrain,difficulty,waymarked,scramble_grade,os_map,parking_lat,parking_lon,parking_cost,facilities_start,dog_friendly,best_season,hazards,highlights,quality_score,tier,tags_audience,tags_features,tags_conditions,description,source_urls
```

## Field Definitions

| Field | Type | Example |
|-------|------|---------|
| route_type | enum | `circular`, `linear`, `out-and-back` |
| difficulty | enum | `easy`, `moderate`, `challenging`, `strenuous`, `extreme` |
| terrain | string | `mountain,rocky,grassy,scramble,scree` |
| waymarked | string | `yes`, `partial`, `no` |
| scramble_grade | string | `none`, `Grade 1`, `Grade 2`, `Grade 3` |
| os_map | string | `OL17`, `OL18` |
| highlights | string | `summit-views,lake,ridge-walk,scrambling` |

## Difficulty Criteria

- **Easy:** Clear paths, no scrambling, <500m ascent
- **Moderate:** Some rough ground, 500-800m ascent
- **Challenging:** Steep sections, navigation needed, 800m+ ascent
- **Strenuous:** Full day, serious ascent, exposure possible
- **Extreme:** Scrambling, route-finding, mountain experience essential

## Quality Scoring
- Destination Worth: Would people travel for this route specifically?
- Experience Quality: Views, sense of achievement, enjoyment
- Uniqueness: Is this route special?
- Practical Quality: Parking, waymarking, path condition

## Description Guidelines
For each route describe:
- Character of the route (what to expect)
- Key challenges or crux sections
- Navigation notes if tricky
- Best and worst conditions
- Honest assessment of who it's suitable for

**Good example:**
> "The Pyg Track is Snowdon's most popular route and the best balance of scenery vs effort. Starts at Pen y Pass (arrive before 8am or park in Llanberis and bus up). Rocky path throughout, but no scrambling unless you divert to Crib Goch. The stretch past Llyn Llydaw is stunning. Summit can be grim in cloud - if the train's running, conditions are usually OK."

## Research Sources
- BMC hill walking pages
- Walk Highlands
- OS Maps route database
- UK Hill Walking forums
- Mountain Training Foundation

## Target
25-35 routes covering all major peaks and classic routes
