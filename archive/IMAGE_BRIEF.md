# Image Brief - Adventure Wales

## Overview

Images needed for all content entities. This brief covers requirements, sourcing, and naming conventions.

---

## Image Requirements by Entity

### Regions (11 images)
**Field:** `heroImage`
**Size:** 1920x1080px (16:9)
**Style:** Epic landscape shots showcasing the region's character

| Region | Image Description |
|--------|-------------------|
| snowdonia | Dramatic mountain vista with moody clouds, Snowdon visible |
| pembrokeshire | Rugged coastline, cliffs, blue sea, maybe kayakers |
| brecon-beacons | Rolling green hills, reservoir, big sky |
| anglesey | Coastal path, lighthouse or beach, Celtic vibe |
| gower | Golden beach, dramatic cliffs, surfers |
| llyn-peninsula | Remote coastal scenery, hidden coves |
| south-wales | Valleys, industrial heritage meets nature |
| north-wales | Slate quarries, adventure park aerial |
| mid-wales | Wild open moorland, reservoirs, isolation |
| carmarthenshire | Green countryside, castles, gentle adventures |
| wye-valley | River gorge, forest canopy, autumn colors |

---

### Activities (84 images)
**Field:** `heroImage`
**Size:** 1200x800px (3:2)
**Style:** Action shots showing the activity in progress

**Priority activities (hero content):**
- Zip lining — person mid-flight, speed blur, quarry backdrop
- Coasteering — jumping into water, group on rocks
- Mountain biking — rider on trail, dust/mud spray
- Hiking — summit views, silhouettes on ridgeline
- Climbing — climber on rock face, ropes visible
- Kayaking — paddler in dramatic scenery
- Surfing — wave action, Pembrokeshire coast
- Wild swimming — swimmer in lake/sea, scenic backdrop
- Caving — helmet lights, underground features
- Gorge walking — people in wetsuit, waterfall

**General activities:** Match the activity type, show real people doing it, Welsh landscape visible where possible.

---

### Accommodation (70 images)
**Field:** `heroImage`
**Size:** 1200x800px (3:2)
**Style:** Exterior or hero interior shot

| Type | Image Description |
|------|-------------------|
| hostel | Common room with backpackers, mountain view windows |
| bunkhouse | Rustic exterior, walking boots at door |
| campsite | Tent with mountain backdrop, morning mist |
| glamping | Yurt/pod exterior at dusk, fairy lights |
| hotel | Exterior or lobby, adventure-friendly vibe |
| b&b | Cozy cottage exterior, Welsh countryside |
| self-catering | Cottage with gear drying outside |

---

### Operators (35 images)
**Field:** `coverImage`
**Size:** 1200x400px (3:1 banner)
**Style:** Team in action or scenic shot of their location

Focus on claimed/premium operators. Show:
- Guides with customers
- Equipment/vehicles branded
- Their signature activity location

---

### Itineraries (15 images)
**Field:** `heroImage`
**Size:** 1920x1080px (16:9)
**Style:** Composite feel — the "mood" of the trip

| Itinerary | Image Description |
|-----------|-------------------|
| Snowdonia Adventure Weekend | Zip line or mountain action |
| Pembrokeshire Coasteering Break | Coasteering jump shot |
| Family Adventure Week | Family hiking, kids visible |
| Mountain Biking Epic | Trail riding action |
| Coastal Wild Swimming | Swimmer in scenic cove |
| Summit Challenge | Summit cairn, cloudy peaks |
| Beginner's Adventure Taster | Friendly group activity |
| Adrenaline Junkie Weekend | Extreme action composite |
| Romantic Adventure Escape | Couple on beach/sunset |
| Solo Traveler Trail | Single hiker, epic scenery |
| Photography Adventure | Photographer with tripod, golden hour |
| Winter Adventure | Snow on mountains, winter gear |
| Caving & Climbing | Underground or rock face |
| Kayaking Explorer | Sea kayak, coastal scenery |
| Multi-Sport Challenge | Collage or transition shot |

---

### Events (47 images)
**Field:** `heroImage`
**Size:** 1200x800px (3:2)
**Style:** Event in action or start line energy

| Event Type | Image Description |
|------------|-------------------|
| Trail running | Pack of runners on trail |
| Triathlon | Swim/bike/run transition |
| Cycling sportive | Peloton on mountain road |
| Walking festival | Group on scenic path |
| Climbing comp | Climber on competition wall |

---

### Transport (minimal)
No hero images needed — icon-based UI.

---

### Commercial Partners / Advertisers
**Field:** `imageUrl`
**Size:** 600x400px (3:2) for standard, 1200x300px for banners
**Style:** Product/service focused, professional

---

## Sourcing Options

### 1. Stock Images (Quick)
- **Unsplash** — Free, good quality landscapes
- **Pexels** — Free, varied activities
- **Adobe Stock** — Paid, premium adventure content
- **Alamy** — Paid, strong UK/Wales coverage

**Search tips:**
- "Wales hiking" / "Snowdonia adventure"
- "Coasteering Pembrokeshire"
- "Mountain biking Wales"
- Add "action" or "lifestyle" for people shots

### 2. AI Generation (Fast, custom)
- **Midjourney** — Best for landscapes, moody shots
- **DALL-E / GPT-4o** — Good for specific compositions
- **Ideogram** — Good for text-free action shots

**Prompt pattern:**
```
[Activity] in [Location], [time of day], [weather], 
professional adventure photography, 35mm lens, 
dynamic composition, real people, Welsh landscape visible
```

### 3. Operator Supplied (Authentic)
Contact operators directly for permission to use their photos. Best for:
- Specific activities
- Branded operator content
- Authentic local feel

### 4. Commission (Premium)
Hire adventure photographer for custom shoot. Expensive but unique.

---

## File Naming Convention

```
[entity]-[slug]-[variant].jpg

Examples:
region-snowdonia-hero.jpg
activity-velocity-zip-line-hero.jpg
operator-tyf-adventure-cover.jpg
itinerary-family-adventure-week-hero.jpg
accommodation-plas-y-brenin-hero.jpg
```

---

## Folder Structure

```
public/images/
  regions/
  activities/
  accommodation/
  operators/
  itineraries/
  events/
  ads/
```

---

## Quality Checklist

- [ ] Correct aspect ratio for entity type
- [ ] High resolution (min 72dpi web, ideally 150dpi)
- [ ] Welsh location visible/recognizable where possible
- [ ] People in action (not posed stock feel)
- [ ] Consistent color grading (outdoor/adventure tone)
- [ ] No watermarks or stock artifacts
- [ ] Proper licensing/rights secured

---

## Priority Order

1. **Regions** (11) — Homepage, navigation, everywhere
2. **Top Activities** (20) — Most popular/featured
3. **Itineraries** (15) — Key conversion content
4. **Premium Operators** (10) — Claimed listings
5. **Remaining Activities** (64)
6. **Accommodation** (70)
7. **Events** (47)
8. **Remaining Operators** (25)

---

## Notes

- Currently using Unsplash placeholder URLs in seed data
- Need to replace with final images before launch
- Consider lazy loading for accommodation/activity grids
- Hero images should work with text overlay (dark areas or gradients)
