# EVENT DISCOVERY MEGA BRIEF

## Mission
**Find and catalog EVERY adventure/outdoor event in Wales for 2026.** We currently have ~100 events. There should be 500+. Your job is to discover, verify, and structure data for all Welsh outdoor events.

---

## Current Gap
| What we have | What exists | Gap |
|--------------|-------------|-----|
| ~100 events | 500-1000+ events | Missing 80%+ |

We're missing:
- Most local running clubs' races
- Charity walks and fun runs
- Smaller MTB events
- Open water swimming races
- Adventure festivals
- Outdoor fitness events
- Climbing competitions
- Kayak/canoe races
- Beach events
- Community outdoor events

---

## Discovery Sources (MUST CHECK ALL)

### 1. Running Events
| Source | URL | What to find |
|--------|-----|--------------|
| **Run Britain** | runbritain.com/events | All registered UK races |
| **parkrun** | parkrun.org.uk | Weekly parkruns (list locations only, not individual dates) |
| **Fell Runners Association** | fellrunner.org.uk | Fell races calendar |
| **Trail Running Association** | tra-uk.org | Trail races |
| **Welsh Athletics** | welshathletics.org | Track & road events |
| **Powers Running** | powersrunning.co.uk | Welsh running events organiser |
| **Always Aim High** | alwaysaimhighevents.com | Major Welsh events |
| **Coed y Brenin events** | beicsbrenin.co.uk | Trail running at CyB |

### 2. Cycling Events
| Source | URL | What to find |
|--------|-----|--------------|
| **British Cycling** | britishcycling.org.uk/events | All BC-sanctioned events |
| **Welsh Cycling** | welshcycling.co.uk | Wales-specific cycling |
| **Sportive.com** | sportive.com | Sportive calendar |
| **UK Cycling Events** | ukcyclingevents.co.uk | Comprehensive list |
| **Velo Wales** | velowales.com | Welsh sportives |
| **BikePark Wales events** | bikeparkwales.com | Uplift days, races |
| **Antur Stiniog** | anturstiniog.com | DH events |
| **Dyfi Bike Park** | dyfibikepark.co.uk | Enduro events |

### 3. Triathlon & Multi-Sport
| Source | URL | What to find |
|--------|-----|--------------|
| **British Triathlon** | britishtriathlon.org | All tri events |
| **Triathlon Wales** | triathlon.wales | Welsh tri calendar |
| **Activity Wales Events** | activitywalesevents.com | Multi-sport organiser |
| **Sandman Triathlon** | sandmantriathlon.co.uk | Iconic Welsh tri |
| **Snowman Triathlon** | snowmantriathlon.co.uk | Llanberis tri |

### 4. Water Sports
| Source | URL | What to find |
|--------|-----|--------------|
| **BLDSA** | bldsa.org.uk | Open water swimming |
| **Outdoor Swimming Society** | outdoorswimmingsociety.com | Wild swim events |
| **Welsh Canoe Association** | canoewales.com | Paddle events |
| **British SUP** | britishsup.co.uk | SUP races |
| **Welsh Surfing Federation** | welshsurfingfederation.co.uk | Surf comps |
| **Swim the Lakes events** | swimthelakes.co.uk | OW swim events |

### 5. Outdoor Festivals & Adventure
| Source | URL | What to find |
|--------|-----|--------------|
| **Llangollen International** | llangollen.net | Adventure activities |
| **Adventure Parc Snowdonia** | adventureparcsnowdonia.com | Events calendar |
| **Plas y Brenin** | pyb.co.uk | National centre events |
| **Outdoor Wales** | outdoorwales.com | Listings |
| **Visit Wales Events** | visitwales.com/things-do/events | Official tourism |

### 6. Local Authority / Regional
| Source | URL | Notes |
|--------|-----|-------|
| **Snowdonia NPA** | eryri.llyw.cymru | Park events |
| **Brecon Beacons NPA** | breconbeacons.org | Park events |
| **Pembrokeshire Coast NPA** | pembrokeshirecoast.wales | Coastal events |
| **Local council event listings** | Various | Search each county |
| **Eventbrite Wales** | eventbrite.co.uk (filter Wales + Outdoor) | Many smaller events |
| **Facebook Events** | Search "Wales running 2026" etc | Community events |

### 7. Charity Events
| Source | URL | What to find |
|--------|-----|--------------|
| **Wales Air Ambulance** | walesairambulance.com/events | Charity runs/walks |
| **Macmillan** | macmillan.org.uk/events | Mighty Hikes etc |
| **Cancer Research UK** | raceforlife.cancerresearchuk.org | Race for Life |
| **British Heart Foundation** | bhf.org.uk/events | Challenge events |
| **Tŷ Hafan** | tyhafan.org | Welsh children's hospice events |

---

## Event Categories to Discover

### Running (expect 150+ events)
- [ ] Trail marathons & ultras
- [ ] Fell races (Welsh Fell Runners calendar)
- [ ] Road races (10K, half, full marathons)
- [ ] Fun runs (5K, colour runs, charity)
- [ ] Cross country (Welsh league)
- [ ] Obstacle/mud runs
- [ ] Night runs

### Cycling (expect 80+ events)
- [ ] Road sportives
- [ ] MTB enduros
- [ ] Downhill races
- [ ] Gravel events
- [ ] Time trials
- [ ] Criteriums
- [ ] Cyclocross
- [ ] BMX events

### Triathlon & Multi-Sport (expect 40+ events)
- [ ] Sprint triathlons
- [ ] Olympic distance
- [ ] 70.3 / Ironman
- [ ] Aquathlon / Duathlon
- [ ] Swimrun events
- [ ] Adventure races

### Water Sports (expect 30+ events)
- [ ] Open water swim races
- [ ] SUP races
- [ ] Kayak/canoe events
- [ ] Surf competitions
- [ ] Rowing regattas

### Outdoor & Adventure (expect 50+ events)
- [ ] Hiking festivals
- [ ] Adventure festivals
- [ ] Climbing comps
- [ ] Orienteering
- [ ] Outdoor fitness (CrossFit, bootcamp events)
- [ ] Beach events

### Family & Community (expect 100+ events)
- [ ] Charity walks
- [ ] Park runs (list as single entry with locations)
- [ ] Community fun runs
- [ ] Beach clean-up events
- [ ] Family adventure days
- [ ] School holiday activities

---

## Data Structure (per event)

### Minimum Required Fields
```json
{
  "name": "Event Name",
  "slug": "event-name-2026",
  "type": "Trail Running | MTB Enduro | Triathlon | etc",
  "category": "race | festival | community | charity",
  
  "dateStart": "2026-06-15T09:00:00Z",
  "dateEnd": null,
  "monthTypical": "June",
  
  "location": "Coed y Brenin, Dolgellau",
  "regionSlug": "snowdonia",
  "lat": 52.795,
  "lng": -3.873,
  
  "website": "https://...",
  "registrationCost": "£35",
  
  "description": "2-3 sentences",
  
  "source": "runbritain.com",
  "sourceUrl": "https://...",
  "confidence": "high | medium | low"
}
```

### Nice to Have
- `distance` — "26.2 miles", "Sprint/Olympic/Full"
- `elevation` — "1,500m climb"
- `difficulty` — "beginner | intermediate | advanced | elite"
- `capacity` — Max entries
- `ticketUrl` — Direct registration link
- `heroImage` — Event photo URL
- `organizerName` — Who runs it

---

## Research Process

### Phase 1: Mass Discovery (Days 1-2)
1. Go through EVERY source listed above
2. Extract ALL Welsh events for 2026
3. Create initial list with basic data (name, date, location, source)
4. Don't worry about completeness yet — volume first

### Phase 2: Deduplication (Day 3)
1. Sort by event name
2. Identify duplicates (same event on multiple platforms)
3. Merge data from multiple sources
4. Mark primary source for each event

### Phase 3: Enrichment (Days 4-5)
1. For each event, visit official website
2. Fill in missing fields
3. Get accurate pricing, distances, descriptions
4. Capture lat/lng coordinates

### Phase 4: Verification (Day 6)
1. Verify dates are 2026 (not historical)
2. Confirm events are still running
3. Flag uncertain data
4. Quality check descriptions

---

## Output Deliverables

### 1. events-discovered.json
Complete dataset of ALL discovered events in importable format.

### 2. events-by-category.md
Summary breakdown:
```
## Running Events: 156 found
- Trail races: 45
- Road races: 62
- Fell races: 28
- Fun runs: 21

## Cycling Events: 84 found
...
```

### 3. events-sources.md
List of all sources checked with event counts:
```
| Source | Events Found | Notes |
|--------|--------------|-------|
| Run Britain | 87 | Good coverage |
| British Cycling | 42 | Missing local events |
...
```

### 4. events-flagged.md
Events needing human review:
- Date uncertain
- May be cancelled
- Duplicate unclear
- Location ambiguous

---

## Quality Targets

| Metric | Target |
|--------|--------|
| Total events discovered | 400+ |
| Events with confirmed dates | 70%+ |
| Events with website link | 90%+ |
| Events with price info | 60%+ |
| Events with coordinates | 80%+ |
| Events with description | 50%+ |

---

## Important Notes

### Wales Only
Event must be **in Wales** or start/finish in Wales. Border events OK if significant Welsh portion.

### 2026 Focus
Only 2026 events. If 2026 dates not announced yet but event is annual, include with "TBC" date and note.

### Adventure/Outdoor Focus
Skip:
- Indoor events (gym classes, etc.)
- Spectator-only events
- Pure competition without participation (watching rugby)
- Urban walking tours

Include:
- Any participatory outdoor physical activity
- Nature-based events
- Adventure sports
- Active charity events

### Recurring Events
For recurring events (like parkrun), create ONE entry with note about frequency, not 52 separate entries.

---

## Example Search Queries

```
"trail race wales 2026"
"cycling sportive wales 2026"
"triathlon wales 2026 entries"
"charity walk snowdonia 2026"
"MTB enduro wales 2026"
"open water swimming wales 2026"
"adventure race pembrokeshire 2026"
site:eventbrite.co.uk wales running 2026
site:runbritain.com wales
site:britishcycling.org.uk wales 2026
```

---

## Success = 400+ Quality Events

Current: ~100 events
Target: 400+ events with:
- Accurate dates (or TBC if not announced)
- Working website links
- Correct locations with coordinates
- Proper categorization
- Brief but useful descriptions

Go find them all. 🏴󠁧󠁢󠁷󠁬󠁳󠁿
