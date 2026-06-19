# Event Enhancement Batch 3: Cultural & Music Festivals

Enhance these 10 Welsh cultural events with accurate, verified data. **No AI images.**

## Events to Enhance

1. **hay-festival** - https://www.hayfestival.com/
2. **llangollen-international-eisteddfod** - https://international-eisteddfod.co.uk/
3. **festival-no6** - https://festivalnumber6.com/
4. **fishguard-folk-festival** - https://www.fishguardfolkfestival.co.uk/
5. **beaumaris-festival** - https://www.beaumarisfestival.org/
6. **wonderwool-wales** - https://wonderwoolwales.co.uk/
7. **hay-festival-winter-weekend** - https://www.hayfestival.com/winter-weekend/
8. **beyond-the-border** - https://www.beyondtheborder.com/
9. **national-eisteddfod** - https://eisteddfod.wales/
10. **urdd-eisteddfod** - https://www.urdd.cymru/en/eisteddfod/

## For Each Event, Capture:

### 1. Coordinates (REQUIRED)
- Get exact venue coordinates
- Note: National/Urdd Eisteddfod moves annually — get 2026 location

### 2. Hero Image (REQUIRED)
- Official press images preferred
- **NO AI-generated images**
- Capture atmosphere — performances, crowds, venues

### 3. Social Links
- Facebook, Instagram, Twitter, YouTube
- These are major festivals — most have active social

### 4. Category
Use: `cultural` or `festival`

### 5. 2026 Dates & Location
- National Eisteddfod 2026: Llantwd, North Pembrokeshire
- Urdd 2026: Anglesey
- Verify others

### 6. Ticket Info
- Note if tickets required and typical price range
- Link to booking page

## Output Format

Save each to `data/events/enhanced/{slug}.json`

## Commit When Done

```bash
git add data/events/enhanced/
git commit -m "enhance: cultural festivals batch 3 (10 events)"
```
