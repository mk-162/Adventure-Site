# Adventure Wales: Ultimate Content Model

Reference: [Ultimate France](https://www.ultimatefrance.com) — the gold standard for adventure destination SEO.

## What Makes Ultimate France Rank

1. **Activity mega-pages** — Every surf spot, ski resort, climbing crag listed on one comprehensive page
2. **Consistent spot cards** — Each location has: lat/long, conditions, access, photos, nearest town
3. **Deep individual pages** — /surfing/hossegor links to a full dedicated page
4. **Heavy internal linking** — Activities ↔ Regions ↔ Operators ↔ Accommodation
5. **Honest local knowledge** — "the water's not the cleanest", "can get crowded"
6. **Partner integrations** — Equipment rental, guides, accommodation woven in naturally

## The Transformation

### Phase 1: Restructure Activity Pages

Current format:
```
# Surfing in Wales
[narrative essay with 5-10 spots mentioned in prose]
```

New format (Ultimate France style):
```
# Surfing in Wales

## The Best Surf Spots on the Welsh Coast
[intro paragraph]

## Gower Peninsula
### Llangennith (Rhossili End)
- **Spot type:** Beach break
- **Wave size:** 0.5 - 3m
- **Best conditions:** SW swell, E wind
- **Best tide:** All tides
- **Difficulty:** Beginner to Advanced
- **Coordinates:** 51.5845, -4.2934
- **Nearest town:** Llangennith (1km)
- **Access:** Beach car park £5/day, 200m walk
[Photo]
[2-3 paragraph description with honest local knowledge]
[Read More →]

### Langland Bay
[same format]
...

## Pembrokeshire
### Whitesands Bay
[same format]
...
```

### Phase 2: Create Individual Spot Pages

For every location mentioned on the activity mega-page:
- `/surfing/gower/llangennith`
- `/surfing/pembrokeshire/whitesands`
- `/mountain-biking/snowdonia/marin-trail`

These pages go deeper:
- Full conditions guide
- Nearby operators
- Equipment rental
- Accommodation nearby
- Related activities
- User tips/comments

### Phase 3: Data-Drive Everything

Create structured data for every spot:

```csv
slug,name,region,activity,lat,lon,difficulty,best_conditions,nearest_town,parking,access_notes
llangennith,Llangennith Beach,gower,surfing,51.5845,-4.2934,beginner-advanced,SW swell E wind,Llangennith,£5/day,200m walk from car park
```

This enables:
- Automatic map generation
- Consistent card rendering
- API for future apps
- Easy updates

---

## Priority Activities (Build First)

Based on search volume and Welsh reputation:

1. **Surfing** — Gower + Pembrokeshire are world-class
2. **Mountain Biking** — Snowdonia trails are legendary
3. **Coasteering** — Wales invented it (Pembrokeshire)
4. **Hiking** — Snowdon, Coast Path, Beacons
5. **Climbing** — Snowdonia is UK climbing heartland
6. **Wild Swimming** — Trending, Wales has endless spots

---

## Surfing Mega-Page Spots to Include

### Gower Peninsula (10+ spots)
- Llangennith / Rhossili North End
- Rhossili Bay (main)
- Broughton Bay
- Port Eynon
- Oxwich Bay
- Langland Bay
- Caswell Bay
- Mumbles

### Pembrokeshire (10+ spots)
- Whitesands Bay
- Freshwater West
- Manorbier
- Tenby South Beach
- Broad Haven
- Newgale
- Abereiddy

### North Wales (5+ spots)
- Hells Mouth (Porth Neigwl)
- Abersoch area
- Rhosneigr
- Porth Oer

---

## Mountain Biking Mega-Page Structure

### Trail Centres
- Coed y Brenin (6 trails)
- BikePark Wales (20+ trails)
- Afan Forest (6 trails)
- Cwmcarn (2 trails)
- Nant yr Arian (4 trails)
- Gwydir Mawr
- Penmachno

### Natural Trails
- Marin Trail, Snowdonia
- Snowdon Ranger descent
- Cambrian Way sections
- Trans Cambrian

Each trail needs:
- Length, elevation, grade
- Trail type (XC, enduro, downhill)
- Surface conditions
- Parking/facilities
- Bike wash
- Nearest bike shop/rental

---

## Template: Spot Data Card

```markdown
### Spot Name

| | |
|---|---|
| **Type** | Beach break / Trail centre / Crag |
| **Difficulty** | Beginner / Intermediate / Advanced |
| **Coordinates** | 51.5845, -4.2934 |
| **Best conditions** | SW swell, E wind / Dry, Oct-Apr |
| **Nearest town** | Town (Xkm) |
| **Parking** | Location, £X/day |
| **Facilities** | Café, toilets, showers |

[Photo with credit]

[2-3 paragraphs of honest, local-knowledge description]

**What to know:**
- Insider tip 1
- Insider tip 2
- Hazard/warning if relevant

[Nearby operators →](/region/operators)
[Equipment rental →](/rentals/activity)
```

---

## Implementation Order

### Week 1: Surfing
1. Research all Welsh surf spots (30+)
2. Gather coordinates, conditions data
3. Source photos
4. Write spot descriptions with local knowledge
5. Build mega-page
6. Create individual spot pages for top 10

### Week 2: Mountain Biking
1. Research all trail centres + natural trails
2. Gather trail data (length, grade, surface)
3. Source photos
4. Write descriptions
5. Build mega-page
6. Individual pages for each trail centre

### Week 3: Coasteering + Wild Swimming
[same process]

### Week 4: Hiking + Climbing
[same process]

---

## Content Quality Bar

Every spot description must include:
1. **What makes it special** — Why come here specifically?
2. **Who it's best for** — Skill level, family-friendly, etc.
3. **Honest downsides** — Crowds, parking issues, water quality
4. **Practical details** — Access, parking cost, facilities
5. **Best time to visit** — Season, tide, weather conditions
6. **Local tip** — Something only regulars would know

---

## Technical Implementation

### New Content Types Needed

1. `spots.csv` — Master database of all locations
2. `/spots/[activity]/[region]/[slug].md` — Individual spot pages
3. Updated activity category pages in Ultimate France format
4. Schema markup for LocalBusiness + Place

### Component Updates

- Spot card component with map integration
- Activity mega-page template
- Photo gallery per spot
- Related operators sidebar

---

## Success Metrics

Compare to Ultimate France rankings:
- "surfing south west france" → Page 1
- "ski resorts french alps" → Page 1
- "hiking french alps" → Page 1

Target for Adventure Wales:
- "surfing wales" → Page 1
- "mountain biking wales" → Page 1
- "coasteering wales" → Page 1
- "hiking snowdonia" → Page 1
- "climbing wales" → Page 1

Current rankings: [check and document baseline]
