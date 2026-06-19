# Content Brief - Adventure Wales

## Overview

Create compelling content for the Adventure Wales database. The site helps adventure travelers discover and book outdoor experiences across Wales.

**Tone:** Confident, practical, adventure-focused. Not salesy or generic. Write like an experienced local guide who knows the terrain.

**Audience:** Adventure travelers (25-55), mix of beginners and experienced. Planning trips to Wales for hiking, coasteering, mountain biking, etc.

---

## What Exists

Seed data in `data/wales/` CSVs:
- 84 activities (basic info, sparse descriptions)
- 70 operators (names, websites, sparse USPs)
- 63 locations (names, GPS, minimal descriptions)
- 70 accommodation (names, types, basic features)
- 47 events (names, dates, locations)
- 11 regions (names only)

---

## Content Needed

### 1. Region Descriptions (11 regions)

**File:** `content/regions/[slug].md`

Each region needs:

```markdown
---
slug: snowdonia
name: Snowdonia
tagline: "Wales' adventure capital"
---

# About Snowdonia

[2-3 paragraphs: what makes it special, landscape, vibe]

## Best For

- [Activity 1]
- [Activity 2]
- [Activity 3]

## Best Time to Visit

[1-2 paragraphs: seasons, weather, crowds]

## Getting There

[Transport options from major UK cities]

## Pro Tips

- [Insider tip 1]
- [Insider tip 2]
- [Insider tip 3]
```

**Regions:** snowdonia, pembrokeshire, brecon-beacons, anglesey, gower, llyn-peninsula, south-wales, north-wales, mid-wales, carmarthenshire, wye-valley

---

### 2. Activity Descriptions (84 activities)

**File:** `content/activities.csv` (update existing columns)

Add/enrich these columns:

| Column | What to Write |
|--------|---------------|
| `description` | 2-3 sentences: what it is, what makes it special, who it's for |
| `whats_included` | Comma-separated: "Professional guide, All equipment, Safety briefing" |
| `requirements` | Comma-separated: "Min age 10, Moderate fitness, Can swim 25m" |
| `highlights` | Comma-separated: "World's fastest zip line, 100mph speeds, Stunning quarry views" |

**Example:**

```
name: Velocity 2 Zip Line
description: Hurtle down the longest zip line in Europe at speeds up to 100mph. Suspended 500ft above Penrhyn Quarry, you'll experience a full minute of pure adrenaline with breathtaking views of Snowdonia. Perfect for thrill-seekers who want bragging rights.
whats_included: Safety briefing, All harness equipment, Practice zip line, Photos available to purchase
requirements: Min weight 25kg, Max weight 120kg, Min age 10, No experience needed
highlights: Europe's longest zip line, Speeds up to 100mph, Stunning quarry setting, 1 minute ride time
```

---

### 3. Operator Profiles (35 key operators)

**File:** `content/operators.csv` (update existing columns)

Focus on **claimed/primary operators** (activity providers, not secondary listings).

| Column | What to Write |
|--------|---------------|
| `description` | 2-3 paragraphs: who they are, history, what makes them special |
| `tagline` | One punchy line: "Pioneered coasteering since 1986" |
| `unique_selling_point` | Key differentiator in one sentence |
| `trust_signals` | JSON: years in business, certifications, awards |

**Example:**

```
name: TYF Adventure
tagline: Pioneering adventure since 1986
description: TYF literally invented coasteering in 1986 on the Pembrokeshire coast. As a certified B Corp, they combine world-class adventure with genuine environmental responsibility. Their guides know every rock, cave, and jump spot on the St Davids coastline, and their eco-lodge offers the perfect base for multi-day adventures.
unique_selling_point: The original coasteering company - invented the sport in 1986
trust_signals: {"years_in_business": 38, "certifications": ["B Corp", "AALA Licensed"], "awards": ["TripAdvisor Travellers Choice"], "review_count": 2000}
```

---

### 4. Itineraries (15 new itineraries)

**File:** `content/itineraries/[slug].md`

Create 15 curated multi-day trips:

```markdown
---
slug: snowdonia-adventure-weekend
title: "Snowdonia Adventure Weekend"
tagline: "Zip lines, mountain hiking, and gorge walking"
region: snowdonia
duration_days: 3
difficulty: moderate
best_season: "April to October"
price_estimate_from: 350
price_estimate_to: 450
---

# Snowdonia Adventure Weekend

[1 paragraph overview: who it's for, what to expect, highlights]

## Day 1: Arrival & Adrenaline

### Morning
**Activity:** Velocity 2 Zip Line
[2-3 sentences about why this activity, what to expect]

**Travel:** 20 min drive to Betws-y-Coed

### Afternoon  
**Activity:** Zip World Fforest
[2-3 sentences]

### Evening
**Stay:** Plas y Brenin
[1-2 sentences about the accommodation]

**Dinner suggestion:** The Stables Bar - hearty pub grub

---

## Day 2: Mountain Adventure

[Continue pattern...]

---

## Day 3: Water & Departure

[Continue pattern...]

---

## Estimated Costs

| Item | Cost |
|------|------|
| Activities | £180 |
| Accommodation (2 nights) | £120 |
| Food | £60 |
| Transport | £40 |
| **Total** | **£400** |

## Tips

- Book Velocity 2 at least 2 weeks ahead (sells out)
- [More practical tips]
```

**Itineraries to create:**

| Title | Region | Days | Difficulty |
|-------|--------|------|------------|
| Snowdonia Adventure Weekend | Snowdonia | 3 | Moderate |
| Pembrokeshire Coasteering Break | Pembrokeshire | 2 | Moderate |
| Family Adventure Week | Snowdonia | 5 | Easy |
| Mountain Biking Epic | Snowdonia + Mid Wales | 4 | Difficult |
| Coastal Wild Swimming | Pembrokeshire + Gower | 3 | Moderate |
| Summit Challenge | Snowdonia | 3 | Difficult |
| Beginner's Adventure Taster | Snowdonia | 2 | Easy |
| Adrenaline Junkie Weekend | Snowdonia | 2 | Difficult |
| Romantic Adventure Escape | Pembrokeshire | 3 | Easy |
| Solo Traveler Trail | Brecon Beacons | 4 | Moderate |
| Photography Adventure | Snowdonia | 3 | Easy |
| Winter Adventure | Snowdonia | 2 | Moderate |
| Caving & Climbing | Brecon Beacons | 2 | Difficult |
| Kayaking Explorer | Anglesey | 3 | Moderate |
| Multi-Sport Challenge | South Wales | 4 | Difficult |

---

### 5. FAQ/Answer Pages (30 SEO pages)

**File:** `content/answers/[slug].md`

SEO-optimized answer pages for common questions:

```markdown
---
slug: best-time-to-visit-snowdonia
question: "What is the Best Time to Visit Snowdonia?"
region: snowdonia
---

# What is the Best Time to Visit Snowdonia?

## Quick Answer

**April to October** offers the best weather for outdoor activities, with **May-June** and **September** being ideal for avoiding crowds while enjoying good conditions. Winter (November-March) suits experienced hikers and those seeking snow activities.

## Month-by-Month Breakdown

### Spring (March-May)
[2-3 sentences]

### Summer (June-August)
[2-3 sentences]

### Autumn (September-November)  
[2-3 sentences]

### Winter (December-February)
[2-3 sentences]

## Best Time for Specific Activities

| Activity | Best Months | Why |
|----------|-------------|-----|
| Hiking | May-Jun, Sep | Mild weather, fewer crowds |
| Zip lining | Apr-Oct | Operating season |
| Climbing | May-Sep | Dry rock conditions |

## Related Questions

- How many days do you need in Snowdonia?
- What should I pack for Snowdonia?
- Is Snowdonia good for beginners?
```

**FAQ topics to create:**

| Question | Region |
|----------|--------|
| Best time to visit Snowdonia? | snowdonia |
| Best time to visit Pembrokeshire? | pembrokeshire |
| How many days in Snowdonia? | snowdonia |
| What to pack for hiking in Wales? | general |
| Is coasteering safe? | pembrokeshire |
| Best mountain biking in Wales? | general |
| Where to stay in Snowdonia? | snowdonia |
| Can beginners climb Snowdon? | snowdonia |
| Best beaches in Pembrokeshire? | pembrokeshire |
| What is coasteering? | general |
| Best zip lines in Wales? | snowdonia |
| Surfing in Wales - where to go? | pembrokeshire |
| Camping in Snowdonia - wild or site? | snowdonia |
| Best walks in Brecon Beacons? | brecon-beacons |
| Anglesey vs Pembrokeshire? | general |
| Wales adventure holidays for families? | general |
| What to do in Wales when it rains? | general |
| Dog-friendly adventures in Wales? | general |
| Accessible adventures in Wales? | general |
| Budget adventure weekend in Wales? | general |
| Luxury adventure lodges in Wales? | general |
| Best caving in Wales? | brecon-beacons |
| Wild swimming spots in Wales? | general |
| Best running events in Wales? | general |
| Photography spots in Snowdonia? | snowdonia |
| Getting to Snowdonia without a car? | snowdonia |
| Snowdon routes compared | snowdonia |
| Adventure stag/hen do ideas | general |
| Corporate adventure activities | general |
| Winter activities in Wales | general |

---

## Research Tips

- **Operator info:** Check their websites, TripAdvisor, Google reviews
- **Activity details:** Use operator websites for accurate pricing, requirements
- **Locations:** Google Maps, AllTrails, outdoor forums for tips
- **Events:** Run Britain, British Triathlon calendars
- **Accommodation:** Booking.com, Hostelworld for features/prices

---

## Output Format

1. **CSVs** - For updating existing records (activities, operators)
2. **Markdown files** - For new content (regions, itineraries, answers)

Put all content in a `content/` folder:
```
content/
  regions/
    snowdonia.md
    pembrokeshire.md
    ...
  itineraries/
    snowdonia-adventure-weekend.md
    ...
  answers/
    best-time-to-visit-snowdonia.md
    ...
  activities.csv
  operators.csv
```

---

## Quality Checklist

- [ ] Factually accurate (verify prices, requirements, seasons)
- [ ] Specific, not generic ("speeds up to 100mph" not "very fast")
- [ ] Local knowledge feel (insider tips, lesser-known spots)
- [ ] Practical (transport, parking, what to bring)
- [ ] SEO-friendly (answer the question directly, then elaborate)
- [ ] Consistent tone (confident, friendly, expert)
