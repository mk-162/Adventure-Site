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

### Image Requirements
- **Minimum resolution: 1024px** on shortest edge
- **Target: 10 images per spot** (for cherry-picking)
- Prefer landscape orientation for heroes
- Mix of: wide establishing shots, detail shots, action if available

### Image Data to Capture
For each image found:
```csv
spot_slug,image_url,source,license,author,attribution_text,width,height,orientation,description
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

### Phase 2: Operators & Providers (8 parallel tasks)

---

#### TASK OP-1: MTB Operators & Guides
```
Research ALL mountain biking operators, guides, and tour companies in Wales.

Include: Guided rides, skills coaching, uplift services, multi-day tours,
bike hire with guiding, women's MTB groups, youth coaching.

For each operator capture:
- slug, name
- type (guide/coaching/tours/uplift/hire/club)
- region_base
- regions_served (comma-separated)
- activities (mtb, gravel, ebike, etc.)
- address, lat, lon
- phone, email, website
- social_instagram, social_facebook
- price_from (lowest session price)
- booking_url
- spots_served (comma-separated spot slugs where they operate)
- description (100-150 words - what makes them good)
- specialties (e.g., "women's coaching", "kids", "advanced skills")
- quality_score (1-10: reputation, reviews, professionalism)
- source_urls

Output: CSV file
Target: 30-40 operators
```

---

#### TASK OP-2: Surf Schools & Coaches
```
Research ALL surf schools, SUP schools, and coaching in Wales.

Include: Surf lessons, SUP hire/lessons, surf camps, 
kids programs, adaptive surfing.

[Same fields as OP-1]
activities: surfing, sup, bodyboarding, etc.

Output: CSV file
Target: 25-35 operators
```

---

#### TASK OP-3: Coasteering & Adventure Operators
```
Research ALL coasteering, gorge walking, and multi-activity 
adventure operators in Wales.

Include: Coasteering, gorge walking, canyoning, 
multi-activity days, stag/hen adventures.

[Same fields as OP-1]

Output: CSV file
Target: 20-30 operators
```

---

#### TASK OP-4: Climbing & Mountaineering Guides
```
Research ALL climbing instructors, mountaineering guides, 
and outdoor education providers in Wales.

Include: Rock climbing instruction, mountaineering,
winter skills, navigation courses, ML/MIA training.

[Same fields as OP-1]

Output: CSV file
Target: 25-35 operators
```

---

#### TASK OP-5: Kayak, Canoe & Paddlesport Operators
```
Research ALL kayaking, canoeing, and paddlesport 
operators in Wales.

Include: Sea kayaking, river kayaking, canoe tours,
white water, sit-on-top hire, guided trips.

[Same fields as OP-1]

Output: CSV file
Target: 20-30 operators
```

---

#### TASK OP-6: Walking & Hiking Guides
```
Research ALL walking guides, hiking tour companies,
and outdoor leaders in Wales.

Include: Guided walks, mountain leaders, navigation courses,
multi-day treks, themed walks (photography, wildlife, history).

[Same fields as OP-1]

Output: CSV file
Target: 20-30 operators
```

---

#### TASK OP-7: Equipment Hire
```
Research ALL outdoor equipment hire businesses in Wales.

Include: Bike hire, wetsuit hire, kayak hire, camping gear,
climbing gear, SUP hire (standalone, not attached to schools).

For each capture:
- slug, name
- type (bike-hire/wetsuit-hire/kayak-hire/camping/multi)
- region
- address, lat, lon
- phone, email, website
- equipment_types (comma-separated)
- price_examples (e.g., "MTB £40/day, E-bike £60/day")
- booking_required (yes/no/recommended)
- delivery_available (yes/no)
- description
- source_urls

Output: CSV file
Target: 40-50 hire locations
```

---

#### TASK OP-8: Outdoor Centres & Multi-Activity Providers
```
Research ALL outdoor education centres and multi-activity 
providers in Wales.

Include: PGL-style centres, school trip providers, 
corporate team building, youth centres, 
residential adventure centres.

[Same fields as OP-1]
Add: residential (yes/no), group_size_min, group_size_max

Output: CSV file
Target: 25-35 centres
```

---

### Phase 3: Accommodation (5 parallel tasks)

---

#### TASK ACC-1: Campsites Near Adventure Spots
```
Research ALL campsites near major adventure spots in Wales.

Priority: Sites within 10 mins of trail centres, beaches, 
mountains, surf spots.

For each capture:
- slug, name
- type (campsite/glamping/wild-camping-tolerated)
- region
- address, lat, lon
- phone, email, website
- booking_url
- price_from (per night)
- facilities (showers,toilets,shop,cafe,wifi,electric-hookup)
- tent_pitches (yes/no/number)
- campervan_ok (yes/no)
- dogs_allowed (yes/no/on-lead)
- near_spots (comma-separated spot slugs within 15 min drive)
- open_season (all-year/Mar-Oct/etc)
- description (what makes it good for adventurers)
- quality_score (1-10)
- source_urls

Output: CSV file
Target: 60-80 campsites
```

---

#### TASK ACC-2: Hostels & Bunkhouses
```
Research ALL hostels, bunkhouses, and bothies in Wales.

Include: YHA hostels, independent hostels, climbing huts,
bunkhouses, mountain bothies.

For each capture:
- slug, name
- type (yha-hostel/indie-hostel/bunkhouse/bothy/climbing-hut)
- region
- address, lat, lon
- phone, email, website
- booking_url
- price_from (dorm bed)
- private_rooms (yes/no)
- self_catering (yes/no)
- meals_available (yes/no)
- drying_room (yes/no)
- bike_storage (yes/no)
- near_spots (comma-separated)
- open_season
- description
- quality_score
- source_urls

Output: CSV file
Target: 40-60 hostels/bunkhouses
```

---

#### TASK ACC-3: Adventure-Friendly B&Bs & Hotels
```
Research B&Bs and small hotels that actively cater to 
adventure travelers in Wales.

Criteria: Bike storage, drying rooms, early breakfast,
packed lunches, gear wash, near adventure spots.

For each capture:
- slug, name
- type (b&b/guesthouse/inn/small-hotel)
- region
- address, lat, lon
- phone, email, website
- booking_url
- price_from (per room)
- adventure_friendly_features (comma-separated)
- near_spots
- description
- quality_score
- source_urls

Output: CSV file
Target: 40-50 properties
```

---

#### TASK ACC-4: Glamping & Unique Stays
```
Research glamping sites and unique accommodation for 
adventure travelers in Wales.

Include: Safari tents, yurts, pods, treehouses, 
shepherds huts, converted barns near adventure spots.

[Same fields as ACC-1, adjust type field]

Output: CSV file
Target: 30-40 sites
```

---

#### TASK ACC-5: Camping Pods & Micro-Lodges
```
Research camping pods and micro-lodges at or near 
adventure destinations in Wales.

Include: Trail centre pods, beach pods, mountain pods.

[Same fields as ACC-1]

Output: CSV file
Target: 25-35 sites
```

---

### Phase 4: Food & Drink (4 parallel tasks)

---

#### TASK FOOD-1: Post-Adventure Cafes
```
Research the BEST cafes near adventure spots in Wales.

The ones people go to after a ride/hike/surf.
Include: Trail centre cafes, beach cafes, mountain cafes.

For each capture:
- slug, name
- type (cafe/coffee-shop/beach-cafe/trail-cafe)
- region
- address, lat, lon
- phone, website
- google_maps_url
- near_spots (which adventure spots is this the go-to for)
- specialty (what they're known for - "massive portions", "best coffee")
- vegan_options (yes/no/good)
- dog_friendly (yes/no/outside-only)
- outdoor_seating (yes/no)
- bike_parking (yes/no)
- hours (if known)
- price_range (£/££/£££)
- description (why adventurers love it)
- quality_score
- source_urls

Output: CSV file
Target: 80-100 cafes
```

---

#### TASK FOOD-2: Post-Adventure Pubs
```
Research the BEST pubs near adventure spots in Wales.

The ones with good food, local ales, muddy boots welcome.

For each capture:
- slug, name
- type (pub/inn/gastropub)
- region
- address, lat, lon
- phone, website
- google_maps_url
- near_spots
- food_served (yes/no/times)
- real_ale (yes/no)
- dog_friendly
- outdoor_seating
- accommodation (yes/no - if rooms above)
- known_for
- description
- quality_score
- source_urls

Output: CSV file
Target: 60-80 pubs
```

---

#### TASK FOOD-3: Beach & Surf Cafes
```
Research ALL cafes and food spots at or near Welsh beaches.

Include: Beach kiosks, surf cafes, ice cream spots, 
fish & chips near beaches.

[Same fields as FOOD-1]

Output: CSV file
Target: 50-60 spots
```

---

#### TASK FOOD-4: Mountain & Remote Refreshments
```
Research refreshment stops accessible during adventures.

Include: Summit cafes, remote tea rooms, mountain railway cafes,
seasonal vans at popular spots.

[Same fields as FOOD-1]
Add: seasonal (yes/no/months)

Output: CSV file
Target: 30-40 spots
```

---

### Phase 5: Transport & Access (4 parallel tasks)

---

#### TASK TRANS-1: Train Stations for Adventures
```
Research train stations useful for accessing adventure spots.

For each capture:
- slug, name
- region
- lat, lon
- line (Cambrian, Heart of Wales, Valley Lines, etc.)
- operator (TfW, etc.)
- nearby_spots (within 30 min - bus, taxi, or bike)
- bike_spaces (number or "reservable")
- taxi_rank (yes/no)
- bus_connections (route numbers)
- car_park (yes/no/spaces)
- adventure_notes (e.g., "Perfect for Mawddach Trail", "Buses to Snowdon")
- source_urls

Focus on: Stations actually useful for adventure access, not all stations.

Output: CSV file
Target: 40-50 stations
```

---

#### TASK TRANS-2: Bus Routes for Adventures
```
Research bus routes that access adventure destinations.

For each capture:
- route_number
- operator
- route_name (e.g., "Snowdon Sherpa")
- region
- key_stops (comma-separated)
- spots_served (adventure spots accessible)
- frequency (hourly/2-hourly/etc)
- seasonal (yes/no/months)
- bikes_allowed (yes/no/sometimes)
- sunday_service (yes/no)
- useful_for (what adventures this enables)
- timetable_url
- source_urls

Focus on: Routes that actually help access adventure spots.

Output: CSV file
Target: 30-40 routes
```

---

#### TASK TRANS-3: Parking Deep-Dive
```
Research DETAILED parking information for top adventure spots.

For each capture:
- spot_slug (matching existing spots)
- parking_name (if named, e.g., "Pen y Pass", "Stackpole Quay")
- lat, lon
- spaces (number or estimate)
- cost (free/£X per day/pay-and-display)
- payment_method (cash/card/app)
- app_name (if applicable - JustPark, RingGo, etc.)
- height_limit (for vans)
- overnight_allowed (yes/no/tolerated)
- fills_by (e.g., "9am summer weekends")
- overflow_option (where to go when full)
- notes (practical tips)
- source_urls

Target: Top 100 spots with detailed parking info
```

---

#### TASK TRANS-4: Taxi & Transfer Services
```
Research taxi and transfer services useful for adventurers.

Include: Station pickups, trailhead drops, gear-friendly taxis,
minibus services for groups.

For each capture:
- name
- region
- phone, website
- booking_method (call/app/online)
- vehicle_types (car/estate/minibus/4x4)
- bikes_carried (number)
- kayaks_ok (yes/no)
- muddy_gear_ok (yes/no)
- areas_covered
- airport_transfers (yes/no)
- approximate_rates
- notes
- source_urls

Output: CSV file
Target: 40-50 services
```

---

### Phase 6: Events & Calendar (3 parallel tasks)

---

#### TASK EVENT-1: Annual Races & Competitions
```
Research ALL annual adventure races and competitions in Wales.

Include: MTB races, fell runs, triathlons, swim events,
cycling sportives, adventure races, ultra events.

For each capture:
- slug, name
- type (mtb-race/fell-run/triathlon/sportive/ultra/adventure-race/swim)
- region
- spot_slug (main venue/location)
- date_typical (e.g., "3rd weekend September")
- date_2025, date_2026 (if known)
- distance_options (e.g., "10km, 25km, 50km")
- entry_price_from
- entry_closes
- participants (typical numbers)
- website
- organizer
- description
- quality_score (how well-regarded is this event)
- source_urls

Output: CSV file
Target: 60-80 events
```

---

#### TASK EVENT-2: Festivals & Gatherings
```
Research ALL outdoor/adventure festivals in Wales.

Include: Adventure festivals, bike festivals, surf festivals,
outdoor film nights, camping festivals with adventure focus.

For each capture:
- slug, name
- type (festival/gathering/expo/show)
- region
- location
- date_typical
- duration_days
- camping_included (yes/no/optional)
- ticket_price_from
- website
- description
- activities (what can you do there)
- source_urls

Output: CSV file
Target: 25-35 events
```

---

#### TASK EVENT-3: Regular Clubs & Groups
```
Research regular adventure clubs and group meetups in Wales.

Include: MTB clubs, running clubs, hiking groups, 
swimming groups, climbing clubs.

For each capture:
- slug, name
- type (club/group/meetup)
- activity
- region_base
- meeting_frequency (weekly/monthly/etc)
- meeting_day (if regular)
- open_to_visitors (yes/no)
- membership_required (yes/no/optional)
- membership_cost
- website, social_links
- contact
- description
- skill_level (all/beginner/intermediate/advanced)
- source_urls

Output: CSV file
Target: 50-70 clubs
```

---

### Phase 7: Practical Info (4 parallel tasks)

---

#### TASK INFO-1: Webcams & Conditions Sources
```
Research webcams and live conditions sources for Welsh 
adventure locations.

For each capture:
- spot_slug (or area if general)
- type (webcam/surf-forecast/weather-station/snow-report)
- name
- url
- what_it_shows (e.g., "beach and waves", "summit view", "car park")
- update_frequency (live/hourly/etc)
- reliability (1-5)
- source

Also capture forecast sources:
- Magic Seaweed spot IDs
- Windguru spot IDs
- Mountain Weather Info links
- Met Office location links

Output: CSV file
Target: 80-100 sources
```

---

#### TASK INFO-2: Emergency & Safety Info
```
Research emergency and safety information for adventure areas.

For each capture:
- region
- mountain_rescue_team
- lifeboat_station (if coastal)
- coastguard_sector
- nearest_hospital
- nearest_minor_injuries
- phone_signal_notes (known dead spots)
- what3words for key locations
- safety_notes

Also capture:
- Beach hazard information
- Known mountain hazards
- Tide information sources

Output: CSV file
Target: Cover all 10 regions
```

---

#### TASK INFO-3: Wildlife Spotting
```
Research wildlife spotting opportunities at adventure locations.

For each capture:
- spot_slug (or create new for dedicated wildlife spots)
- species (dolphins/seals/puffins/red-kites/ospreys/etc)
- best_season
- best_time (dawn/dusk/etc)
- reliability (1-5 - how likely to see)
- viewing_spot_lat, viewing_spot_lon
- notes (tips for spotting)
- source_urls

Focus on: Dolphins Cardigan Bay, seals Pembrokeshire, 
puffins Skomer, red kites Mid Wales, ospreys, rare birds.

Output: CSV file
Target: 40-50 wildlife spots
```

---

#### TASK INFO-4: Local History & Legends
```
Research interesting history and legends for adventure locations.

For each capture:
- spot_slug
- story_title
- story_type (legend/history/folklore/literary)
- summary (100-200 words)
- connection_to_spot
- source_urls

Include: Myths, famous events, literary connections,
historical significance that makes spots more interesting.

Output: CSV file
Target: 60-80 stories
```

---

### Phase 8: Routes & GPX (3 parallel tasks)

---

#### TASK GPX-1: MTB Route Sources
```
Research where to find GPX files for Welsh MTB routes.

For each route capture:
- spot_slug (trail/route)
- gpx_source (komoot/strava/trailforks/official/other)
- gpx_url (direct link if possible)
- source_quality (official/user-verified/user-uploaded)
- last_verified_date
- notes

Also capture: General sources for Wales MTB GPX files.

Output: CSV file
Target: Cover all MTB trails in database
```

---

#### TASK GPX-2: Hiking Route Sources
```
Research where to find GPX files for Welsh hiking routes.

[Same approach as GPX-1]

Include: OS Maps routes, Komoot, Outdooractive, 
walking organization routes.

Output: CSV file
Target: Cover all hiking trails in database
```

---

#### TASK GPX-3: Cycling & Road Route Sources
```
Research road cycling and gravel routes in Wales.

Capture both routes and GPX sources.

For new routes capture:
- slug, name
- type (road/gravel/mixed)
- region
- start_lat, start_lon
- distance_km
- ascent_m
- difficulty
- highlights
- gpx_url
- source_urls

Output: CSV file
Target: 30-40 routes
```

---

### Phase 9: Image Sourcing (6 parallel tasks)

---

#### TASK IMG-1: Beach Images - Pembrokeshire & Gower
```
Find Creative Commons licensed images for Pembrokeshire and Gower beaches.

REQUIREMENTS:
- Minimum resolution: 1024px on shortest edge
- Target: 10 images per beach (for cherry-picking best ones)
- Mix of: aerial/wide shots, beach-level views, detail shots, people if available
- Prefer landscape orientation

Search:
- commons.wikimedia.org/wiki/Category:Beaches_of_Pembrokeshire
- commons.wikimedia.org/wiki/Category:Gower_Peninsula
- geograph.org.uk (search each beach name)
- flickr.com/creativecommons (search beach names)

For each image capture:
- spot_slug (matching our beach slugs)
- image_url (full resolution direct link)
- source (wikimedia/geograph/flickr/unsplash)
- license (CC-BY-SA-4.0, CC-BY-2.0, Public Domain, etc.)
- author
- attribution_text (ready to use, formatted)
- width (pixels)
- height (pixels)
- orientation (landscape/portrait/square)
- description (what's in the image)

Skip images under 1024px on shortest edge.

Output: CSV file
Beaches covered: ~30
Target: 300 images (10 per beach)
```

---

#### TASK IMG-2: Beach Images - North Wales
```
Find Creative Commons licensed images for Llŷn, Anglesey, 
and Snowdonia coast beaches.

REQUIREMENTS:
- Minimum resolution: 1024px on shortest edge
- Target: 10 images per beach
- Mix of shots, prefer landscape orientation

[Same fields and approach as IMG-1]

Output: CSV file
Beaches covered: ~35
Target: 350 images (10 per beach)
```

---

#### TASK IMG-3: Mountain & Hiking Images
```
Find Creative Commons licensed images for Welsh mountains and hiking trails.

REQUIREMENTS:
- Minimum resolution: 1024px on shortest edge
- Target: 10 images per trail/peak
- Mix of: summit views, trail scenes, dramatic landscapes, walkers on paths
- Prefer landscape orientation

Search:
- commons.wikimedia.org/wiki/Category:Mountains_of_Wales
- commons.wikimedia.org/wiki/Category:Snowdonia
- commons.wikimedia.org/wiki/Category:Brecon_Beacons
- geograph.org.uk (search peak names, trail names)

[Same fields as IMG-1]

Output: CSV file
Trails/peaks covered: ~75
Target: 750 images (10 per location)
```

---

#### TASK IMG-4: Surfing & Water Sports Images
```
Find Creative Commons licensed images for Welsh surf spots and water sports.

REQUIREMENTS:
- Minimum resolution: 1024px on shortest edge
- Target: 10 images per surf break
- Include: Surfing action, wave shots, beach scenes, kayaking, SUP, coasteering
- Action shots highly valued

Search:
- commons.wikimedia.org/wiki/Category:Surfing_in_Wales
- flickr.com/creativecommons (search: wales surfing, gower surf, llangennith)
- geograph.org.uk
- unsplash.com (for generic surf action if needed)

[Same fields as IMG-1]

Output: CSV file
Breaks covered: ~35
Target: 350 images (10 per break)
```

---

#### TASK IMG-5: Wild Swimming Images
```
Find Creative Commons licensed images for Welsh wild swimming spots.

REQUIREMENTS:
- Minimum resolution: 1024px on shortest edge
- Target: 10 images per swimming spot
- Include: Lake scenes, river pools, waterfall pools, people swimming if available
- Blue Lagoon Abereiddy is high priority

Search:
- commons.wikimedia.org (search lake names: Llyn Idwal, Llyn Padarn, etc.)
- geograph.org.uk (search: lake names, waterfall names)
- flickr.com/creativecommons

[Same fields as IMG-1]

Output: CSV file
Spots covered: ~45
Target: 450 images (10 per spot)
```

---

#### TASK IMG-6: Activity & Lifestyle Images
```
Find Creative Commons licensed ACTIVITY images - people doing adventures.

REQUIREMENTS:
- Minimum resolution: 1024px on shortest edge
- These are GENERIC activity shots, not location-specific
- For hero images, headers, category pages
- Prefer images showing people actively engaged

Search across sources for:
- Mountain biking action (Wales preferred, UK acceptable)
- Hiking/walking groups on mountains
- Rock climbing action
- Coasteering groups jumping/swimming
- Families on beaches
- Camping/adventure lifestyle
- Kayaking/paddleboarding

Tag each image with activity type for easy filtering.

[Same fields as IMG-1, add: activity_type field]

Output: CSV file
Target: 100 images (mix across all activity types)
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
├── spots/
│   ├── beaches/
│   │   ├── pembrokeshire.csv
│   │   ├── gower.csv
│   │   ├── llyn.csv
│   │   ├── anglesey.csv
│   │   ├── ceredigion.csv
│   │   └── snowdonia-coast.csv
│   ├── surfing/
│   │   ├── gower.csv
│   │   ├── pembrokeshire.csv
│   │   ├── llyn-north.csv
│   │   └── south-wales.csv
│   ├── hiking/
│   │   ├── snowdonia-summits.csv
│   │   ├── brecon-beacons.csv
│   │   ├── coastal-walks.csv
│   │   └── waterfalls-woodland.csv
│   ├── swimming/
│   │   ├── lakes.csv
│   │   ├── rivers-waterfalls.csv
│   │   └── sea-tidal.csv
│   └── activities/
│       ├── coasteering.csv
│       └── climbing.csv
├── operators/
│   ├── mtb.csv
│   ├── surf.csv
│   ├── coasteering.csv
│   ├── climbing.csv
│   ├── kayak.csv
│   ├── walking.csv
│   ├── hire.csv
│   └── centres.csv
├── accommodation/
│   ├── campsites.csv
│   ├── hostels.csv
│   ├── b&bs.csv
│   ├── glamping.csv
│   └── pods.csv
├── food/
│   ├── cafes.csv
│   ├── pubs.csv
│   ├── beach-cafes.csv
│   └── mountain-cafes.csv
├── transport/
│   ├── trains.csv
│   ├── buses.csv
│   ├── parking.csv
│   └── taxis.csv
├── events/
│   ├── races.csv
│   ├── festivals.csv
│   └── clubs.csv
├── info/
│   ├── webcams.csv
│   ├── emergency.csv
│   ├── wildlife.csv
│   └── legends.csv
├── routes/
│   ├── mtb-gpx.csv
│   ├── hiking-gpx.csv
│   └── cycling.csv
└── images/
    ├── beaches-south.csv
    ├── beaches-north.csv
    ├── mountains.csv
    ├── surfing.csv
    ├── swimming.csv
    └── lifestyle.csv
```

---

---

### Phase 10: Ongoing Improvement (Daily Rotation)

These tasks run on rotation to continuously improve data quality.

---

#### TASK DAILY-1: Verify & Enrich Tier A Spots
```
Take 5 Tier A spots from the database. For each:

1. Verify all coordinates are accurate (check Google Maps)
2. Verify contact info is current (websites, phones)
3. Find any missing data fields
4. Check for new operators serving this spot
5. Find any new images (min 1024px)
6. Check for recent reviews/trip reports for new info
7. Update description if new info found

Output: Updates CSV with changes
Run: Daily, rotating through all Tier A spots
```

---

#### TASK DAILY-2: Find Missing Spots
```
Look for adventure spots we may have missed in [REGION].

Search for:
- Beaches not in our database
- Trails not covered
- Swimming spots
- New climbing areas
- Hidden gems mentioned in blogs/forums

Cross-reference with: Local tourism sites, hiking blogs,
TripAdvisor, Google Maps, AllTrails, UKClimbing.

Output: New spots CSV
Run: Daily, rotating through regions
```

---

#### TASK DAILY-3: Operator Updates
```
Verify and update operator information.

For 10 operators:
1. Check website is live
2. Verify phone/email
3. Check for price changes
4. Look for new services
5. Check reviews for quality signals
6. Verify spots served

Output: Updates CSV
Run: Daily, rotating through all operators
```

---

#### TASK DAILY-4: Event Calendar Updates
```
Check for new events and update dates.

1. Search for newly announced events
2. Update dates for known annual events
3. Check for cancelled/changed events
4. Find entry prices and deadlines
5. Add any new events found

Output: Events updates CSV
Run: Weekly focus, monthly full sweep
```

---

#### TASK DAILY-5: New Image Search
```
Search for new CC images for spots with <10 images.

Priority: Tier A spots first, then Tier B.
Minimum: 1024px shortest edge.

Output: New images CSV
Run: Daily, rotating through spots
```

---

#### TASK DAILY-6: Content Gap Analysis
```
Analyze what competitors have that we don't.

Check: Visit Wales, mbwales, specific operator sites.

Look for:
- Spots they feature that we're missing
- Info they have that we don't
- Better descriptions/angles
- Features we should add

Output: Gap analysis report
Run: Weekly
```

---

#### TASK DAILY-7: Seasonal Updates
```
Update seasonal information based on current month.

- Which spots are in season now?
- What events are coming up?
- Seasonal warnings to add?
- Operator seasonal hours?
- Beach lifeguard schedules?

Output: Seasonal updates CSV
Run: Monthly
```

---

#### TASK DAILY-8: Review Mining
```
Mine TripAdvisor, Google Reviews for insights on spots.

For each spot, extract:
- Common praise (what people love)
- Common complaints (what to warn about)
- Practical tips from reviews
- Quality signals (is it getting better/worse?)

Output: Review insights CSV
Run: Daily, rotating through spots
```

---

## Daily Task Allocation

With 100 tasks/day available, suggested allocation:

### Initial Build (Weeks 1-2)
| Phase | Tasks | Days |
|-------|-------|------|
| Phase 1: Spots | 18 | 1 |
| Phase 2: Operators | 8 | 1 |
| Phase 3: Accommodation | 5 | 1 |
| Phase 4: Food & Drink | 4 | 1 |
| Phase 5: Transport | 4 | 1 |
| Phase 6: Events | 3 | 1 |
| Phase 7: Practical | 4 | 1 |
| Phase 8: GPX | 3 | 1 |
| Phase 9: Images | 6 | 2-3 |
| **Total Initial** | **55** | **~10 days** |

### Ongoing (After Initial Build)
Daily mix of:
- 10-20 verification tasks (DAILY-1, DAILY-3)
- 10-20 enrichment tasks (DAILY-2, DAILY-5)
- 5-10 update tasks (DAILY-4, DAILY-7)
- 5-10 analysis tasks (DAILY-6, DAILY-8)

---

## Success Metrics

### Spots & Content
| Metric | Target |
|--------|--------|
| Total adventure spots | 250+ |
| Tier A spots | 40-50 |
| Tier B spots | 120-150 |
| Unique descriptions | 100% |
| Coordinates verified | 100% |

### Operators & Services
| Metric | Target |
|--------|--------|
| Operators/providers | 200+ |
| Accommodation | 200+ |
| Cafes & pubs | 150+ |
| Equipment hire | 50+ |

### Practical Data
| Metric | Target |
|--------|--------|
| Transport links | 100+ |
| Events calendar | 100+ |
| Webcams/conditions | 80+ |
| Wildlife spots | 40+ |

### Images
| Metric | Target |
|--------|--------|
| Total images | 2,500+ |
| Images per spot | 10 |
| Minimum resolution | 1024px |
| Full attribution | 100% |

### Ongoing Quality
| Metric | Target |
|--------|--------|
| Tier A spots verified | Monthly |
| Operator info checked | Quarterly |
| Event dates updated | Monthly |
| New spots added | Weekly |
