# Jules Data Gathering Mission

*Parallel tasks for comprehensive Wales adventure database*

---

## Image Sources Brief

### Primary Sources (CC Licensed - Safe for Commercial Use)

| Source | URL | License | Best For |
|--------|-----|---------|----------|
| **Wikimedia Commons** | commons.wikimedia.org | CC-BY-SA / Public Domain | Wales-specific, coordinates included |
| **Geograph UK** | geograph.org.uk | CC-BY-SA 2.0 | Excellent Wales coverage, GPS tagged |
| **Unsplash** | unsplash.com | Unsplash License (free commercial) | High quality, less Wales-specific |
| **Pixabay** | pixabay.com | Pixabay License (free commercial) | Mixed quality, some Wales |
| **Flickr CC** | flickr.com/creativecommons | Various CC | Search by location, check license |

### Wikimedia Wales Categories
```
commons.wikimedia.org/wiki/Category:Beaches_of_Wales
commons.wikimedia.org/wiki/Category:Mountains_of_Wales
commons.wikimedia.org/wiki/Category:Surfing_in_Wales
commons.wikimedia.org/wiki/Category:Hiking_in_Wales
commons.wikimedia.org/wiki/Category:Snowdonia
commons.wikimedia.org/wiki/Category:Pembrokeshire
commons.wikimedia.org/wiki/Category:Gower_Peninsula
```

### Geograph Search
```
geograph.org.uk/search.php?q=rhossili+beach
geograph.org.uk/search.php?q=snowdon+summit
geograph.org.uk/search.php?q=pembrokeshire+coast
```

### Image Data to Capture
For each image found:
```csv
spot_slug,image_url,source,license,author,attribution_text,resolution,description
```

---

## Task Breakdown

### Phase 1: Spot Data (18 parallel tasks)

---

#### TASK 1.1: Pembrokeshire Beaches
```
Research ALL beaches in Pembrokeshire, Wales.

Include: Barafundle, Broad Haven, Freshwater West, Marloes Sands, 
Whitesands, Newgale, Tenby North, Tenby South, Saundersfoot, Amroth,
Manorbier, Stackpole Quay, Newport Sands, Poppit Sands, Mwnt, plus
any others found.

For each beach capture:
- slug, name, region (pembrokeshire)
- lat, lon (beach centre)
- parking_lat, parking_lon, parking_cost
- beach_type (sand/pebble/mixed)
- length_m
- facilities (toilets,cafe,showers,shop)
- blue_flag (true/false)
- lifeguards, lifeguard_season
- dog_rules
- water_sports available
- rock_pools (true/false)
- family_friendly (1-5)
- best_season
- hazards
- quality_score (1-10 using rubric)
- tier (A/B/C)
- tags_audience
- tags_features
- description (100-150 words, unique, specific)
- source_urls

Quality Rubric:
- Destination Worth (0-3): Would people travel for this?
- Experience Quality (0-3): How good is it?
- Uniqueness (0-2): One of a kind?
- Practical Quality (0-2): Facilities, access?

Output: CSV file
Target: 15-20 beaches
```

---

#### TASK 1.2: Gower Beaches
```
Research ALL beaches on the Gower Peninsula, Wales.

Include: Rhossili, Three Cliffs Bay, Oxwich, Caswell, Langland,
Pobbles, Tor Bay, Port Eynon, Horton, Llangennith, Broughton Bay,
Whiteford Sands, plus any others found.

[Same fields and rubric as Task 1.1]

Output: CSV file
Target: 12-15 beaches
```

---

#### TASK 1.3: Llŷn Peninsula Beaches
```
Research ALL beaches on the Llŷn Peninsula, Wales.

Include: Abersoch, Porth Neigwl (Hell's Mouth), Aberdaron, 
Porthdinllaen, Morfa Nefyn, Nefyn, Pwllheli, Criccieth, 
Porth Oer (Whistling Sands), plus any others found.

[Same fields and rubric as Task 1.1]

Output: CSV file
Target: 12-15 beaches
```

---

#### TASK 1.4: Anglesey Beaches
```
Research ALL notable beaches on Anglesey, Wales.

Include: Newborough, Llanddwyn, Rhosneigr, Trearddur Bay,
Benllech, Red Wharf Bay, Church Bay, Cable Bay, Porth Dafarch,
plus any others found.

[Same fields and rubric as Task 1.1]

Output: CSV file
Target: 10-12 beaches
```

---

#### TASK 1.5: Ceredigion & Carmarthenshire Beaches
```
Research ALL notable beaches in Ceredigion and Carmarthenshire.

Include: Aberystwyth, Borth, Clarach, Llangrannog, Penbryn,
Tresaith, Aberporth, New Quay, Llansteffan, Pendine Sands,
Cefn Sidan, plus any others found.

[Same fields and rubric as Task 1.1]

Output: CSV file
Target: 12-15 beaches
```

---

#### TASK 1.6: Snowdonia Coast Beaches
```
Research ALL notable beaches along Snowdonia's coast.

Include: Harlech, Barmouth, Fairbourne, Tywyn, Aberdovey,
Morfa Bychan (Black Rock Sands), Criccieth, plus any others.

[Same fields and rubric as Task 1.1]

Output: CSV file
Target: 8-10 beaches
```

---

#### TASK 2.1: Gower Surf Breaks
```
Research ALL surfable breaks on the Gower Peninsula.

Include: Llangennith, Rhossili, Langland, Caswell, 
Oxwich, Port Eynon, Horton, Broughton, plus any others.

For each break capture:
- slug, name, region
- lat, lon
- break_type (beach-break/reef/point)
- wave_direction (left/right/both)
- best_wind
- best_swell_direction
- best_swell_size
- best_tide
- wave_size_min_ft, wave_size_max_ft
- bottom_type
- crowd_factor (1-5)
- skill_level (beginner/intermediate/advanced)
- hazards
- parking_lat, parking_lon, parking_cost
- facilities
- surf_schools (operator names)
- quality_score (1-10)
- tier
- description (100-150 words with wave character, local knowledge)
- source_urls

Output: CSV file
Target: 10-12 breaks
```

---

#### TASK 2.2: Pembrokeshire Surf Breaks
```
Research ALL surfable breaks in Pembrokeshire.

Include: Freshwater West, Newgale, Whitesands, Broad Haven,
Manorbier, West Angle, Dale, plus any others.

[Same fields as Task 2.1]

Output: CSV file
Target: 8-10 breaks
```

---

#### TASK 2.3: Llŷn & North Wales Surf Breaks
```
Research ALL surfable breaks on Llŷn Peninsula and North Wales.

Include: Hell's Mouth (Porth Neigwl), Abersoch, Porth Ceiriad,
Aberdaron, Criccieth, Rhosneigr, plus any others.

[Same fields as Task 2.1]

Output: CSV file
Target: 8-10 breaks
```

---

#### TASK 2.4: South Wales Surf Breaks
```
Research ALL surfable breaks in South Wales.

Include: Rest Bay Porthcawl, Coney Beach, Ogmore, 
Llantwit Major, Southerndown, Barry, plus any others.

[Same fields as Task 2.1]

Output: CSV file
Target: 6-8 breaks
```

---

#### TASK 3.1: Snowdonia Summit Hikes
```
Research ALL notable summit routes in Snowdonia.

Include all routes up: Snowdon (6 paths), Tryfan, Glyderau,
Carneddau, Cadair Idris, Cnicht, Moel Siabod, Rhinogs,
Y Garn, Elidir Fawr, plus other significant peaks.

For each route capture:
- slug, name, region
- lat_start, lon_start, lat_end, lon_end
- distance_km
- ascent_m, descent_m
- route_type (circular/linear/out-and-back)
- time_hours_min, time_hours_max
- terrain (mountain/rocky/grassy/scramble)
- difficulty (easy/moderate/challenging/strenuous/extreme)
- waymarked (yes/partial/no)
- os_map
- parking_lat, parking_lon, parking_cost
- facilities_start
- dog_friendly
- best_season
- hazards (specific: exposure, navigation, scrambling)
- highlights
- quality_score (1-10)
- tier
- description (100-150 words with insider knowledge)
- source_urls

Output: CSV file
Target: 25-30 routes
```

---

#### TASK 3.2: Brecon Beacons Hikes
```
Research ALL notable hiking routes in Brecon Beacons.

Include: Pen y Fan (all routes), Corn Du, Fan y Big, 
Cribyn, Fan Brycheiniog, Fan Fawr, Waterfall Country walks,
Sugar Loaf, Skirrid, Black Mountain, plus others.

[Same fields as Task 3.1]

Output: CSV file
Target: 20-25 routes
```

---

#### TASK 3.3: Coastal Path Walks
```
Research notable SECTIONS of Welsh coastal paths.

Include best sections of: Pembrokeshire Coast Path,
Llŷn Peninsula coast, Anglesey Coast Path, Gower walks,
Ceredigion coast. Each as a separate day-walk.

[Same fields as Task 3.1]
Capture terrain as: coastal

Output: CSV file
Target: 15-20 walks
```

---

#### TASK 3.4: Waterfall & Woodland Walks
```
Research ALL notable waterfall walks and woodland walks in Wales.

Include: Sgwd yr Eira, Sgwd Clun-Gwyn, Four Waterfalls Walk,
Pistyll Rhaeadr, Swallow Falls, Fairy Glen, Aber Falls,
Cenarth Falls, plus forest walks in Coed y Brenin, Beddgelert,
Gregynog, etc.

[Same fields as Task 3.1]

Output: CSV file
Target: 15-20 walks
```

---

#### TASK 4.1: Wild Swimming - Lakes
```
Research ALL notable wild swimming lakes in Wales.

Include: Llyn Idwal, Llyn Ogwen, Llyn Padarn, Llyn Gwynant,
Llyn Dinas, Llyn Cau, Llyn y Fan Fach, Llyn y Fan Fawr,
Tal-y-Llyn, Llyn Tegid (Bala), plus smaller tarns.

For each spot capture:
- slug, name, region
- lat, lon
- water_type (lake)
- depth_m (approximate)
- water_quality (excellent/good/moderate/variable)
- temperature_summer_c, temperature_winter_c
- access_difficulty (easy/moderate/scramble/hike-required)
- entry_type (gradual/jumping/rocky)
- parking_lat, parking_lon, parking_cost
- facilities
- family_friendly (1-5)
- dog_friendly
- best_time
- hazards
- quality_score (1-10)
- tier
- description (100-150 words)
- source_urls

Output: CSV file
Target: 15-20 spots
```

---

#### TASK 4.2: Wild Swimming - Rivers & Waterfalls
```
Research ALL notable river and waterfall swimming spots in Wales.

Include: Fairy Glen, Horseshoe Falls, River Wye spots,
Afon Glaslyn pools, Afon Dwyryd, Pont y Pair pools,
waterfall pools in Brecon Beacons, plus any others.

[Same fields as Task 4.1]
water_type: river / waterfall-pool

Output: CSV file
Target: 15-18 spots
```

---

#### TASK 4.3: Wild Swimming - Sea & Tidal Pools
```
Research ALL notable sea swimming and tidal pool spots in Wales.

Include: Blue Lagoon Abereiddy, Dancing Beggars Gower,
tidal pools, sheltered coves for sea swimming, 
plus notable open-water sea swimming spots.

[Same fields as Task 4.1]
water_type: sea-pool / tidal-pool / sea

Output: CSV file
Target: 10-12 spots
```

---

#### TASK 5.1: Coasteering Spots
```
Research ALL notable coasteering locations in Wales.

Include: Pembrokeshire (Abereiddy, St Davids, Stackpole),
Gower (Rhossili, Worms Head), Anglesey (South Stack, Rhoscolyn),
Llŷn Peninsula spots, plus any others.

For each spot capture:
- slug, name, region
- lat, lon
- jump_max_m
- best_tide
- swell_limit
- water_temp_summer, water_temp_winter
- difficulty (beginner/intermediate/advanced)
- hazards
- parking_lat, parking_lon
- facilities
- operators (who runs sessions here)
- quality_score (1-10)
- tier
- description
- source_urls

Output: CSV file
Target: 15-18 spots
```

---

#### TASK 5.2: Climbing Crags
```
Research ALL notable climbing crags in Wales.

Include: Llanberis Pass, Tremadog, Gogarth, Cloggy,
Pen Trwyn (Orme), Llangollen limestone, Gower sea cliffs,
Pembrokeshire, plus any others.

For each crag capture:
- slug, name, region
- lat, lon
- rock_type
- aspect (N/S/E/W)
- routes_count (approximate)
- grade_range (e.g., "Diff to E7")
- style (trad/sport/bouldering/mixed)
- approach_mins
- rain_dry_hours (how long to dry after rain)
- parking_lat, parking_lon
- facilities
- quality_score (1-10)
- tier
- description
- source_urls

Output: CSV file
Target: 15-20 crags
```

---

### Phase 2: Image Sourcing (6 parallel tasks)

---

#### TASK IMG-1: Beach Images - Pembrokeshire & Gower
```
Find Creative Commons licensed images for Pembrokeshire and Gower beaches.

Search:
- commons.wikimedia.org/wiki/Category:Beaches_of_Pembrokeshire
- commons.wikimedia.org/wiki/Category:Gower_Peninsula
- geograph.org.uk (search each beach name)

For each image capture:
- spot_slug (matching our beach slugs)
- image_url (full resolution)
- thumbnail_url (if available)
- source (wikimedia/geograph/flickr/unsplash)
- license (CC-BY-SA-4.0, CC-BY-2.0, Public Domain, etc.)
- author
- attribution_text (ready to use)
- resolution (WxH)
- description

Priority: Find 2-3 images per Tier A beach, 1-2 per Tier B.

Output: CSV file
Target: 50-70 images
```

---

#### TASK IMG-2: Beach Images - North Wales
```
Find Creative Commons licensed images for Llŷn, Anglesey, 
and Snowdonia coast beaches.

[Same approach as IMG-1]

Output: CSV file
Target: 40-50 images
```

---

#### TASK IMG-3: Mountain & Hiking Images
```
Find Creative Commons licensed images for Welsh mountains and hiking trails.

Search:
- commons.wikimedia.org/wiki/Category:Mountains_of_Wales
- commons.wikimedia.org/wiki/Category:Snowdonia
- commons.wikimedia.org/wiki/Category:Brecon_Beacons
- geograph.org.uk (search peak names)

Priority: Summit views, trail scenes, dramatic landscapes.
Find 2-3 images per major peak/trail.

Output: CSV file
Target: 60-80 images
```

---

#### TASK IMG-4: Surfing & Water Sports Images
```
Find Creative Commons licensed images for Welsh surf spots and water sports.

Search:
- commons.wikimedia.org/wiki/Category:Surfing_in_Wales
- flickr.com/creativecommons (search: wales surfing, gower surf)
- geograph.org.uk

Include: Surfing action shots, beach scenes at surf spots,
kayaking, paddleboarding, coasteering.

Output: CSV file
Target: 30-40 images
```

---

#### TASK IMG-5: Wild Swimming Images
```
Find Creative Commons licensed images for Welsh wild swimming spots.

Search:
- commons.wikimedia.org (search lake names)
- geograph.org.uk (search: swimming, wild swimming, lakes)
- flickr.com/creativecommons

Include: Lake scenes, river pools, waterfall pools, Blue Lagoon.

Output: CSV file
Target: 30-40 images
```

---

#### TASK IMG-6: Activity & Lifestyle Images
```
Find Creative Commons licensed ACTIVITY images - people doing adventures.

Search across sources for:
- Mountain biking action
- Hiking/walking groups
- Climbing
- Coasteering groups
- Families on beaches
- Camping/adventure lifestyle

These are for hero images, headers, and general adventure content.

Output: CSV file
Target: 40-50 images
```

---

## Execution Notes

### For Jules

1. **Run Phase 1 tasks in parallel** - Each task is independent
2. **Validate coordinates** - Plot on map before submitting
3. **No duplicate slugs** - Check across all outputs
4. **Score honestly** - Don't inflate, use rubric strictly
5. **Cite sources** - Include URLs for verification

### After Jules Completes

1. Merge CSVs into `content/spots/` structure
2. Validate data quality
3. Run image download script
4. Build attribution page
5. Connect to page templates

---

## Output Structure

Jules delivers to:
```
/jules-output/
├── beaches/
│   ├── pembrokeshire.csv
│   ├── gower.csv
│   ├── llyn.csv
│   ├── anglesey.csv
│   ├── ceredigion.csv
│   └── snowdonia-coast.csv
├── surfing/
│   ├── gower.csv
│   ├── pembrokeshire.csv
│   ├── llyn-north.csv
│   └── south-wales.csv
├── hiking/
│   ├── snowdonia-summits.csv
│   ├── brecon-beacons.csv
│   ├── coastal-walks.csv
│   └── waterfalls-woodland.csv
├── swimming/
│   ├── lakes.csv
│   ├── rivers-waterfalls.csv
│   └── sea-tidal.csv
├── activities/
│   ├── coasteering.csv
│   └── climbing.csv
└── images/
    ├── beaches-south.csv
    ├── beaches-north.csv
    ├── mountains.csv
    ├── surfing.csv
    ├── swimming.csv
    └── lifestyle.csv
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Total spots | 200+ |
| Tier A spots | 40-50 |
| Tier B spots | 100-120 |
| Unique descriptions | 100% |
| Coordinates verified | 100% |
| Images sourced | 250+ |
| Images with attribution | 100% |
