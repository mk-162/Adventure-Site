# Event Enhancement Batch 4: Heritage & Seasonal Events

Enhance these 10 Welsh heritage/seasonal events with accurate, verified data. **No AI images.**

## Events to Enhance

1. **st-davids-day-celebrations** - https://www.visitwales.com/info/history-heritage-and-traditions/st-davids-day-traditions-dydd-gwyl-dewi
2. **cadw-open-doors** - https://cadw.gov.wales/
3. **conwy-medieval-festival** - https://www.visitconwy.org.uk/
4. **caernarfon-investiture-anniversary** - https://cadw.gov.wales/visit/places-to-visit/caernarfon-castle
5. **barley-saturday** - https://www.discoverceredigion.wales/
6. **tregaron-harness-racing-festival** - https://www.discoverceredigion.wales/
7. **great-british-food-margam** - https://greatbritishfoodfestival.com/margam-park
8. **winter-solstice-bryn-celli-ddu** - https://cadw.gov.wales/
9. **national-trust-easter-wales** - https://www.nationaltrust.org.uk/easter-in-wales
10. **cadw-halloween-events** - https://cadw.gov.wales/

## Special Notes

- **Multi-location events** (Cadw Open Doors, NT Easter): Note "various locations" but pick a flagship site for coordinates
- **Annual dates** (St David's Day = March 1, Winter Solstice = Dec 21): Note these are fixed
- **Cadw events**: Check their What's On page for 2026 specifics

## For Each Event, Capture:

### 1. Coordinates
- Primary/flagship venue
- Note if multi-location

### 2. Hero Image (REQUIRED)
- Official tourism/heritage images
- **NO AI-generated images**
- Castles, historic sites, celebrations

### 3. Social Links
- Cadw social accounts for Cadw events
- National Trust Wales for NT events

### 4. Category
Use: `cultural`, `heritage`, or `family`

### 5. Dates
- Fixed annual dates where applicable
- "Multiple dates" for Easter/Halloween

## Output Format

Save each to `data/events/enhanced/{slug}.json`

## Commit When Done

```bash
git add data/events/enhanced/
git commit -m "enhance: heritage events batch 4 (10 events)"
```
