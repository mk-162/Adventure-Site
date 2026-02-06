# Event Enhancement Batch 1: County Shows

Enhance these 10 Welsh events with accurate, verified data. **No AI images.**

## Events to Enhance

1. **royal-welsh-show** - https://rwas.wales/royal-welsh-show/
2. **anglesey-county-show** - https://www.angleseyshow.org.uk/
3. **pembrokeshire-county-show** - https://www.pembsshow.org/
4. **aberystwyth-ceredigion-show** - https://sioeaberystwythshow.co.uk/
5. **brecon-county-show** - https://www.breconcountyshow.co.uk/
6. **cardigan-county-show** - https://cardigancountyshow.org.uk/
7. **usk-show** - https://www.uskshow.co.uk/
8. **vale-of-glamorgan-show** - https://www.valeshow.co.uk/
9. **chepstow-show** - https://www.chepstowshow.co.uk/
10. **royal-welsh-winter-fair** - https://rwas.wales/winter-fair/

## For Each Event, Capture:

### 1. Coordinates (REQUIRED)
- Get exact venue coordinates from Google Maps
- Not town center — the actual showground/venue
- Format: `{ lat: 52.1234, lng: -3.5678 }`

### 2. Hero Image (REQUIRED)
- Find official image from event website or Facebook
- **NO AI-generated images**
- Record source URL and attribution
- Prefer action shots showing the event atmosphere

### 3. Social Links
- Facebook page/event
- Instagram
- Twitter/X
- YouTube (if they have past event videos)

### 4. Category
Assign one: `festival`, `family`, `cultural`, `competition`, `race`, `workshop`, `social`

### 5. 2026 Dates
- Confirm dates for 2026 if announced
- Note if recurring (e.g., "Last week of July annually")

### 6. Nearby Operators
- List any Adventure Wales operators within 15km
- Check `/directory` for nearby businesses

## Output Format

Save each to `data/events/enhanced/{slug}.json`:

```json
{
  "slug": "royal-welsh-show",
  "coordinates": { "lat": 52.1495, "lng": -3.4088 },
  "heroImage": {
    "url": "https://rwas.wales/...",
    "alt": "Crowds at Royal Welsh Show main ring",
    "source": "Official RWAS website",
    "attribution": null
  },
  "socialLinks": {
    "facebook": "https://facebook.com/royalwelshshow",
    "instagram": "https://instagram.com/royalwelsh",
    "twitter": null,
    "youtube": null
  },
  "category": "festival",
  "dates2026": {
    "start": "2026-07-20",
    "end": "2026-07-23",
    "confirmed": true
  },
  "isRecurring": true,
  "recurringSchedule": "Third week of July annually",
  "nearbyOperators": ["mid-wales-adventures"],
  "lastVerified": "2026-02-07",
  "sourceUrls": ["https://rwas.wales/royal-welsh-show/"],
  "confidence": "high"
}
```

## Quality Rules

- ❌ Don't use AI images
- ❌ Don't guess coordinates — verify on Google Maps
- ❌ Don't include unverified dates
- ✅ Note confidence level honestly
- ✅ Record all source URLs
- ✅ Test social links work

## Commit When Done

```bash
git add data/events/enhanced/
git commit -m "enhance: county shows batch 1 (10 events)"
```
