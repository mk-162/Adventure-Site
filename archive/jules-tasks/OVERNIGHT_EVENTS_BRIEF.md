# OVERNIGHT EVENTS ENHANCEMENT

## Mission
Transform sparse event data into rich, bookable-quality content overnight.

## Current State
- ~100+ events in database (mostly sparse)
- Research files with 400+ events discovered
- Missing: coordinates, images, detailed descriptions

## Priority Order
1. **Batch 1**: County shows (10 events) - `/jules-tasks/EVENT_ENHANCE_BATCH_1.md`
2. **Batch 2**: Flagship races (15 events) - `/jules-tasks/EVENT_ENHANCE_BATCH_2.md`
3. **Batch 3**: Water sports events - `/jules-tasks/EVENT_ENHANCE_BATCH_3.md`
4. **Batch 4**: Major festivals - `/jules-tasks/EVENT_ENHANCE_BATCH_4.md`
5. **Batch 5**: Family/nature events - `/jules-tasks/EVENT_ENHANCE_BATCH_5.md`
6. **Batch 6**: Community events - `/jules-tasks/EVENT_ENHANCE_BATCH_6.md`

## For EVERY Event

### Required (No Exceptions)
1. **Exact coordinates** - Get from Google Maps, not town center, the ACTUAL venue
   ```json
   { "lat": 52.1495, "lng": -3.4088 }
   ```

2. **Hero image** - Real photo from:
   - Official event website
   - Event Facebook/Instagram
   - Visit Wales
   - Local authority
   - **NO AI IMAGES EVER**
   - Record source URL for attribution

3. **Rich description** - 100-200 words, Adventure Wales voice:
   - What makes it special
   - Who it's for
   - What to expect
   - Honest about difficulty/conditions

### Also Capture
- 2026 dates (or "TBC annually in [month]")
- Entry price range
- Official website
- Ticket/registration URL
- Social links (FB, Instagram, Twitter)
- Organizer name
- Category tag

## Output Location
Save each enhanced event to: `data/events/enhanced/{slug}.json`

```json
{
  "slug": "royal-welsh-show",
  "name": "Royal Welsh Show",
  "coordinates": { "lat": 52.1495, "lng": -3.4088 },
  "heroImage": {
    "url": "https://rwas.wales/path/to/image.jpg",
    "alt": "Crowds at Royal Welsh Show main ring",
    "source": "RWAS Official",
    "attribution": null
  },
  "description": "The Royal Welsh Show...",
  "dates2026": {
    "start": "2026-07-20",
    "end": "2026-07-23",
    "confirmed": true
  },
  "category": "festival",
  "type": "agricultural-show",
  "location": "Royal Welsh Showground, Llanelwedd",
  "website": "https://rwas.wales/royal-welsh-show/",
  "ticketUrl": "https://rwas.wales/tickets/",
  "registrationCost": "£25-35",
  "socialLinks": {
    "facebook": "https://facebook.com/royalwelshshow",
    "instagram": "https://instagram.com/royalwelsh"
  },
  "organizerName": "Royal Welsh Agricultural Society",
  "confidence": "high",
  "lastVerified": "2026-02-07",
  "sources": ["https://rwas.wales/royal-welsh-show/"]
}
```

## Quality Rules
- ❌ NO AI-generated images
- ❌ NO guessed coordinates
- ❌ NO unverified 2026 dates
- ✅ Cross-reference 2+ sources for facts
- ✅ Record all source URLs
- ✅ Test links work
- ✅ Note confidence level honestly

## After Each Batch
```bash
git add data/events/enhanced/
git commit -m "enhance: [batch name] - [N] events with coords/images"
git push origin main
```

## Success = 
- Every event has exact coordinates (venue, not town)
- Every event has a real hero image with source
- Every event has 100+ word description
- All data verified from official sources

---

Start with Batch 1 (County Shows), then proceed through each batch in order.
