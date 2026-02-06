# Event Enhancement Batch 2: Food Festivals

Enhance these 12 Welsh food festivals with accurate, verified data. **No AI images.**

## Events to Enhance

1. **abergavenny-food-festival** - https://www.abergavennyfoodfestival.com/
2. **narberth-food-festival** - https://www.narberthfoodfestival.com/
3. **mold-food-drink-festival** - https://moldfoodfestival.co.uk/
4. **conwy-honey-fair** - https://www.conwybeekeepers.org.uk/
5. **cardiff-food-drink-festival** - https://www.visitcardiff.com/food-drink/
6. **caerphilly-food-drink-festival** - https://www.caerphillyfoodfestival.co.uk/
7. **cardigan-river-food-festival** - http://www.cardigan-food-festival.co.uk/
8. **llangollen-food-festival** - https://llangollenfoodfestival.com/
9. **lampeter-food-festival** - https://www.facebook.com/Lampeterfoodfestival/
10. **portmeirion-food-craft-fair** - https://portmeirion.wales/visit/whats-on/food-and-craft-fair
11. **brecon-beacons-food-festival** - https://breconbeaconsfoodfestival.co.uk/
12. **caerphilly-cheese-festival** - https://www.caerphillycheesefestival.co.uk/

## For Each Event, Capture:

### 1. Coordinates (REQUIRED)
- Get exact venue coordinates from Google Maps
- Town center is OK for street festivals
- Format: `{ lat: 52.1234, lng: -3.5678 }`

### 2. Hero Image (REQUIRED)
- Find official image from event website or Facebook
- **NO AI-generated images**
- Food stalls, crowds, local produce — real photos only
- Record source URL and attribution

### 3. Social Links
- Facebook page/event
- Instagram (many food festivals have active IG)
- Twitter/X

### 4. Category
All should be: `festival`

### 5. 2026 Dates
- Confirm dates if announced
- Note typical timing (e.g., "Third weekend of September")

### 6. Nearby Operators
- Check for nearby cafes, pubs, accommodation in AW directory
- List slugs for cross-linking

## Output Format

Save each to `data/events/enhanced/{slug}.json`

Same format as Batch 1.

## Quality Rules

- ❌ Don't use AI images
- ❌ Don't guess coordinates
- ✅ Check Facebook for most current info (many food festivals update there first)
- ✅ Note if event has been cancelled or location changed

## Commit When Done

```bash
git add data/events/enhanced/
git commit -m "enhance: food festivals batch 2 (12 events)"
```
