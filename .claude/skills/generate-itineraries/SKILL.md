# Generate Itinerary Stubs

Generate structured JSON itinerary stubs for the Adventure Wales itinerary engine.

## Environment

Requires `GEMINI_API_KEY` environment variable.

## Usage

```
python scripts/generate-itineraries.py --type all
python scripts/generate-itineraries.py --type region:snowdonia
python scripts/generate-itineraries.py --type single:snowdonia-adventure-weekend
python scripts/generate-itineraries.py --type all --dry-run
python scripts/generate-itineraries.py --type all --force   # overwrite existing
```

## Coverage (55 itineraries)

| Region | Count | Types |
|--------|-------|-------|
| Snowdonia | 13 | Weekend, family, MTB, summits, zip world, carfree, rainy, wild camp, dog |
| Pembrokeshire | 9 | Coasteering, swimming, surf, islands, stag/hen, winter, family |
| Brecon Beacons | 7 | Caves, waterfalls, dark sky, bike+hike, gorge, family |
| Gower | 5 | Surf, family, couples, wild swim, day trip |
| Anglesey | 4 | Kayaking, kitesurfing, coastal path, family |
| Mid Wales | 3 | MTB, river, off-grid |
| Wye Valley | 3 | Canoe+climb, family, autumn |
| North Wales | 3 | Family, adrenaline day, budget |
| South Wales | 3 | Multi-sport, bikepark, day trip |
| Multi-region | 5 | Grand tour, carfree, adrenaline 48h, first-timer, budget |

## Output Format

JSON files in `data/itineraries/{slug}.json` with full stop-by-stop structure including:
- Hour-by-hour timeline per day
- GPS coordinates for every stop
- Wet weather alternatives for outdoor activities
- Budget alternatives for every paid stop
- Real food stops with prices
- Cost breakdown (standard vs budget)
- Know before you go section
