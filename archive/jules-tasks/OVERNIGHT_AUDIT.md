# Overnight Audit Tasks for Jules

## Task 1: Missing Activity Hub Pages

Research and create content for missing activity hub pages. Check the database for activities that don't have hub pages yet.

### Activities to Research
Query the database for all activity types, then check which ones return 404:
- kayaking
- canoeing
- paddleboarding / SUP
- wild-swimming
- gorge-walking
- rock-climbing
- bouldering
- paragliding
- hang-gliding
- horse-riding
- fishing
- sailing
- kitesurfing
- windsurfing

For each missing activity, research:
1. Best spots in Wales
2. Operators offering this activity
3. Difficulty levels
4. Best seasons
5. What equipment is needed

Output: Create content briefs for each missing hub page.

---

## Task 2: Event Discovery - More Events

Current: ~100 events in database
Target: 400+ events

Research these sources for new Welsh events:
1. **Run Britain** - running events calendar
2. **British Triathlon** - tri events
3. **British Cycling** - sportives, races
4. **BLDSA** - open water swimming
5. **Trail Running Association**
6. **Visit Wales events calendar**
7. **Local authority events pages**
8. **Eventbrite Wales**

For each event found, capture:
- Name, slug
- 2026 dates (or typical month)
- Location with coordinates
- Category (race, festival, family, cultural)
- Website
- Price range
- Brief description

Output: `data/research/events-discovered-overnight.json`

---

## Task 3: Operator Enrichment

Many operators in the database are sparse. Research and enrich:
1. Accurate contact details
2. Full list of activities offered
3. Pricing information
4. Social media links
5. Customer reviews summary
6. Unique selling points

Priority: Operators with `claimStatus = 'stub'`

Output: `data/research/operators-enriched.json`

---

## Task 4: Combo Page Content

Many activity+region combo pages are thin. Research content for:
- South Wales + Mountain Biking
- Pembrokeshire + Kayaking
- Snowdonia + Wild Swimming
- Gower + Surfing
- Anglesey + Coasteering

For each, find:
- Best 5 spots
- Local operators
- Insider tips
- Weather considerations
- Transport/parking info

Output: Detailed content files in `data/combo-pages/`
