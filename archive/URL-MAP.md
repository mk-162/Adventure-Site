# Adventure Wales URL Map & Gap Analysis

*What we have, what we need, what's missing*

---

## URL Structure

```
adventurewales.co.uk/
│
├── /[activity]/                    # Activity hubs
│   └── e.g. /mountain-biking/, /surfing/, /coasteering/
│
├── /[region]/                      # Region hubs  
│   └── e.g. /snowdonia/, /pembrokeshire/, /gower/
│
├── /[region]/[activity]/           # Region + Activity (pSEO)
│   └── e.g. /snowdonia/mountain-biking/, /gower/surfing/
│
├── /spots/[activity]/[slug]/       # Individual spots
│   └── e.g. /spots/mtb/coed-y-brenin/, /spots/beaches/rhossili/
│
├── /best/[topic]/                  # Curation pages
│   └── e.g. /best/beaches-wales/, /best/mtb-trails/
│
├── /operators/                     # Operator directory
│   └── /operators/[slug]/          # Individual operators
│
├── /guides/                        # How-to content
│   └── /guides/[slug]/
│
├── /itineraries/                   # Multi-day trip plans
│   └── /itineraries/[slug]/
│
└── /blog/                          # News, stories, updates
    └── /blog/[slug]/
```

---

## Current State

### Activities (Hubs)

| Activity | URL | Status | Hub Page |
|----------|-----|--------|----------|
| Mountain Biking | `/mountain-biking/` | ✅ Exists | Has page |
| Surfing | `/surfing/` | ✅ Exists | Has page |
| Coasteering | `/coasteering/` | ✅ Exists | Has page |
| Hiking | `/hiking/` | ✅ Exists | Has page |
| Climbing | `/climbing/` | ❌ Missing | Need page |
| Wild Swimming | `/wild-swimming/` | ❌ Missing | Need page |
| Kayaking | `/kayaking/` | ❌ Missing | Need page |
| Paddleboarding | `/paddleboarding/` | ❌ Missing | Need page |
| Caving | `/caving/` | ❌ Missing | Need page |

### Regions (Hubs)

| Region | URL | Status | Data |
|--------|-----|--------|------|
| Snowdonia | `/snowdonia/` | ❌ Missing | Need page |
| Pembrokeshire | `/pembrokeshire/` | ❌ Missing | Need page |
| Gower | `/gower/` | ❌ Missing | Need page |
| Brecon Beacons | `/brecon-beacons/` | ❌ Missing | Need page |
| Anglesey | `/anglesey/` | ❌ Missing | Need page |
| Llŷn Peninsula | `/llyn-peninsula/` | ❌ Missing | Need page |
| North Wales Coast | `/north-wales-coast/` | ❌ Missing | Need page |
| Ceredigion | `/ceredigion/` | ❌ Missing | Need page |
| South Wales Valleys | `/south-wales-valleys/` | ❌ Missing | Need page |
| Carmarthenshire | `/carmarthenshire/` | ❌ Missing | Need page |

---

## Spots Database

### Current Counts

| Activity | Spots in DB | Target | Gap |
|----------|-------------|--------|-----|
| MTB Centres | 11 | 15 | -4 |
| MTB Trails | 32 | 100+ | -68 |
| MTB Routes | 5 | 20 | -15 |
| Surf Breaks | 15 | 40 | -25 |
| Beaches | 15 | 60 | -45 |
| Hiking Trails | 15 | 80 | -65 |
| Climbing Crags | 12 | 30 | -18 |
| Coasteering Spots | 9 | 20 | -11 |
| Wild Swimming | 12 | 40 | -28 |
| **TOTAL** | **126** | **405** | **-279** |

### MTB Centres (11 in DB)

| Name | Slug | Region | Status |
|------|------|--------|--------|
| Coed y Brenin | coed-y-brenin | Snowdonia | ✅ In DB |
| BikePark Wales | bikepark-wales | South Wales | ✅ In DB |
| Antur Stiniog | antur-stiniog | Snowdonia | ✅ In DB |
| Afan Forest | afan-forest | South Wales | ✅ In DB |
| Cwmcarn | cwmcarn | South Wales | ✅ In DB |
| Llandegla | llandegla | North Wales | ✅ In DB |
| Gwydir Forest | gwydir-forest | Snowdonia | ✅ In DB |
| Dyfi Bike Park | dyfi-bike-park | Mid Wales | ✅ In DB |
| Nant yr Arian | nant-yr-arian | Ceredigion | ❓ Check |
| Brechfa | brechfa | Carmarthenshire | ❓ Check |
| Crychan | crychan | Brecon | ❓ Check |

### Beaches (15 in DB, need ~60)

| Name | Region | In DB |
|------|--------|-------|
| Rhossili | Gower | ✅ |
| Barafundle | Pembrokeshire | ✅ |
| Broad Haven | Pembrokeshire | ✅ |
| Freshwater West | Pembrokeshire | ✅ |
| Caswell | Gower | ✅ |
| Langland | Gower | ✅ |
| Three Cliffs | Gower | ❌ |
| Oxwich | Gower | ❌ |
| Tenby North | Pembrokeshire | ❌ |
| Tenby South | Pembrokeshire | ❌ |
| Whitesands | Pembrokeshire | ❌ |
| Newgale | Pembrokeshire | ❌ |
| Marloes Sands | Pembrokeshire | ❌ |
| Mwnt | Ceredigion | ❌ |
| Llangrannog | Ceredigion | ❌ |
| Abersoch | Llŷn | ❌ |
| Porthdinllaen | Llŷn | ❌ |
| Aberdaron | Llŷn | ❌ |
| Harlech | Snowdonia | ❌ |
| Barmouth | Snowdonia | ❌ |
| ... | ... | ❌ |

### Surf Breaks (15 in DB, need ~40)

| Name | Region | In DB |
|------|--------|-------|
| Llangennith | Gower | ✅ |
| Freshwater West | Pembrokeshire | ✅ |
| Caswell | Gower | ✅ |
| Langland | Gower | ✅ |
| Rest Bay | South Wales | ❌ |
| Porthcawl | South Wales | ❌ |
| Newgale | Pembrokeshire | ❌ |
| Whitesands | Pembrokeshire | ❌ |
| Abersoch | Llŷn | ❌ |
| Hell's Mouth | Llŷn | ❌ |
| Aberdaron | Llŷn | ❌ |
| ... | ... | ❌ |

### Hiking Trails (15 in DB, need ~80)

| Name | Region | In DB |
|------|--------|-------|
| Snowdon (Llanberis) | Snowdonia | ✅ |
| Snowdon (Pyg) | Snowdonia | ✅ |
| Cadair Idris | Snowdonia | ✅ |
| Pen y Fan | Brecon Beacons | ✅ |
| Crib Goch | Snowdonia | ✅ |
| Tryfan | Snowdonia | ❌ |
| Glyder Fach | Snowdonia | ❌ |
| Y Garn | Snowdonia | ❌ |
| Carneddau | Snowdonia | ❌ |
| Fan Brycheiniog | Brecon Beacons | ❌ |
| Sugar Loaf | Brecon Beacons | ❌ |
| Pembrokeshire Coast Path | Pembrokeshire | ❌ |
| Gower Way | Gower | ❌ |
| ... | ... | ❌ |

---

## Region × Activity Matrix

Which combinations need pages:

| Region | MTB | Surf | Coast | Hike | Climb | Swim | Kayak |
|--------|-----|------|-------|------|-------|------|-------|
| Snowdonia | 🔴 | ⚪ | ⚪ | 🔴 | 🔴 | 🔴 | 🔴 |
| Pembrokeshire | ⚪ | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |
| Gower | ⚪ | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |
| Brecon Beacons | 🔴 | ⚪ | ⚪ | 🔴 | ⚪ | 🔴 | 🔴 |
| Anglesey | ⚪ | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |
| Llŷn Peninsula | ⚪ | 🔴 | 🔴 | 🔴 | ⚪ | 🔴 | 🔴 |
| South Wales | 🔴 | 🔴 | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ |
| North Wales Coast | ⚪ | 🔴 | ⚪ | ⚪ | ⚪ | 🔴 | ⚪ |
| Ceredigion | 🔴 | 🔴 | 🔴 | 🔴 | ⚪ | 🔴 | 🔴 |

🔴 = Priority (activity is strong in region)
⚪ = Low priority or N/A

**Priority pages needed: ~35 Region×Activity combinations**

---

## "Best Of" Curation Pages

| Page | URL | Status |
|------|-----|--------|
| Best Beaches Wales | `/best/beaches-wales/` | ❌ |
| Best Surf Spots Wales | `/best/surf-spots-wales/` | ❌ |
| Best MTB Trails Wales | `/best/mtb-trails-wales/` | ❌ |
| Best Hikes Wales | `/best/hikes-wales/` | ❌ |
| Best Wild Swimming Wales | `/best/wild-swimming-wales/` | ❌ |
| Best Family Beaches | `/best/family-beaches/` | ❌ |
| Best Dog-Friendly Beaches | `/best/dog-friendly-beaches/` | ❌ |
| Best Beginner Surf Spots | `/best/beginner-surf-spots/` | ❌ |
| Best Beginner MTB Trails | `/best/beginner-mtb-trails/` | ❌ |
| Best Coastal Walks | `/best/coastal-walks/` | ❌ |
| Best Waterfall Walks | `/best/waterfall-walks/` | ❌ |
| Best Secret Beaches | `/best/secret-beaches/` | ❌ |

**Target: 25-30 curation pages**

---

## Gap Summary

| Category | Have | Need | Gap |
|----------|------|------|-----|
| Activity hub pages | 4 | 9 | 5 |
| Region hub pages | 0 | 10 | 10 |
| Region×Activity pages | 0 | 35 | 35 |
| Spot profiles | 126 | 400 | 274 |
| Curation pages | 0 | 25 | 25 |
| **TOTAL PAGES** | **130** | **479** | **349** |

---

## Jules Task Briefs

Ready-to-go research tasks for Jules:

### Task 1: Complete Beach Database
```
Research and document every notable beach in Wales.

For each beach, capture:
- Name, slug, region
- Coordinates (lat, lon)
- Parking coordinates and cost
- Beach type (sand, pebble, mixed)
- Length (metres)
- Facilities (toilets, cafe, lifeguards, showers)
- Blue Flag status
- Dog rules (seasonal restrictions)
- Water sports available
- Rock pools (yes/no)
- Family friendly rating (1-5)
- Best season
- Hazards and warnings
- Unique description (100-150 words)

Target: 60 beaches total
Priority regions: Pembrokeshire, Gower, Llŷn, Anglesey, Ceredigion

Output: CSV file matching content/spots/beaches/beaches.csv schema
```

### Task 2: Complete Surf Breaks Database
```
Research every surfable break in Wales.

For each break, capture:
- Name, slug, region
- Coordinates
- Break type (beach, reef, point)
- Wave direction, best wind, best swell direction
- Best tide
- Wave size range (min-max ft)
- Bottom type (sand, rock, reef)
- Crowd factor (1-5)
- Skill level (beginner, intermediate, advanced)
- Parking and access
- Hazards
- Local surf school operators
- Description (100-150 words)

Target: 40 breaks
Priority: Gower, Pembrokeshire, Llŷn, South Wales coast

Output: CSV matching content/spots/surfing/breaks.csv schema
```

### Task 3: Complete Hiking Trails Database
```
Research notable hiking trails in Wales.

For each trail, capture:
- Name, slug, region
- Start/end coordinates
- Distance (km), ascent (m)
- Route type (circular, linear, out-and-back)
- Time (hours)
- Terrain type
- Waymarked (yes/no)
- Difficulty grade
- OS map reference
- Parking
- Facilities at start
- Dog friendly
- Best season
- Hazards
- Description (100-150 words)

Target: 80 trails
Include: All Snowdonia summits, Brecon Beacons peaks, coastal paths, waterfall walks

Output: CSV matching content/spots/hiking/trails.csv schema
```

### Task 4: Wild Swimming Spots
```
Research wild swimming locations in Wales.

For each spot, capture:
- Name, slug, region
- Coordinates
- Water type (lake, river, sea, waterfall pool)
- Depth (metres)
- Water quality rating
- Temperature (summer average)
- Access difficulty
- Parking
- Facilities
- Family friendly
- Dog friendly
- Best season
- Hazards
- Description (100-150 words)

Target: 40 spots
Include: Lakes, rivers, waterfalls, tidal pools, sea swimming spots

Output: CSV matching content/spots/wild-swimming/spots.csv schema
```

### Task 5: Kayaking & Paddleboarding Spots
```
Research kayaking and paddleboarding locations in Wales.

For each spot, capture:
- Name, slug, region
- Coordinates
- Water type (sea, lake, river, estuary)
- Difficulty (flat water, moving water, whitewater grade)
- Best for (kayak, SUP, canoe)
- Launch point coordinates
- Parking
- Hire available (yes/no + operators)
- Best conditions
- Hazards
- Description (100-150 words)

Target: 30 spots

Output: New CSV at content/spots/kayaking/spots.csv
```

---

## Next Steps

1. ✅ URL map created
2. → Pick first Jules task (recommend: Beaches - most complete starting data)
3. → Set up Jules with task brief
4. → Validate output and merge to database
5. → Repeat for other activities
