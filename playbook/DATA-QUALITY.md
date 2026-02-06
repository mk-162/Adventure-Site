# Data Quality & Prioritization

*How we separate signal from noise in a database of 400+ spots*

---

## The Problem

Capture everything → database fills with mediocre spots → pages become useless lists → users bounce → SEO tanks.

## The Solution

Every spot gets scored. Scores determine visibility. Cream floats.

---

## Quality Tier System

### Tier A — Feature Worthy (Top 10-15%)
- Gets full profile page
- Featured in "Best Of" lists
- Shown first in region/activity pages
- Rich content: 300+ word description, photos, operator links

**Criteria (score 8+):**
- Nationally/internationally significant
- Would travel specifically to visit
- Unique or exceptional in some way
- High visitor satisfaction

**Examples:** Rhossili, Coed y Brenin, Snowdon, Pembrokeshire Coast Path

### Tier B — Solid Options (50-60%)
- Listed on region/activity pages
- Brief profile (100-150 words)
- Included in filtered searches
- May appear in niche "Best Of" lists

**Criteria (score 5-7):**
- Good quality, worth visiting
- Serves local/regional demand
- Nothing wrong, nothing exceptional

**Examples:** Most trail centre blues, decent local beaches, standard coastal walks

### Tier C — Completeness (25-30%)
- Listed in searches only
- Minimal profile (50 words)
- Not promoted, but findable
- Exists for completeness/SEO long-tail

**Criteria (score 1-4):**
- Functional but unremarkable
- Very local interest only
- Limited facilities or access
- May have issues (crowded, polluted, difficult)

**Examples:** Small local beaches, urban parks, overgrown paths

---

## Scoring Rubric

Each spot scored 1-10 across these dimensions:

### 1. Destination Worth (0-3 points)
- **3** — People travel specifically for this
- **2** — Worth a detour if nearby  
- **1** — Convenient if you're local
- **0** — Only if nothing else available

### 2. Quality of Experience (0-3 points)
- **3** — Exceptional, memorable, best-in-class
- **2** — Good, enjoyable, reliable
- **1** — Acceptable, does the job
- **0** — Poor, disappointing, issues

### 3. Uniqueness (0-2 points)
- **2** — One of a kind, can't get this elsewhere
- **1** — Good but similar options exist
- **0** — Generic, interchangeable

### 4. Practical Quality (0-2 points)
- **2** — Great facilities, easy access, well-maintained
- **1** — Adequate facilities
- **0** — Poor access, no facilities, issues

**Total: 0-10 points**
- 8-10 = Tier A
- 5-7 = Tier B
- 1-4 = Tier C
- 0 = Don't include

---

## Tagging Taxonomy

### Primary Tags (Required)

**Activity Type:**
```
mtb, surfing, coasteering, hiking, climbing, 
wild-swimming, kayaking, paddleboarding, caving, beaches
```

**Region:**
```
snowdonia, pembrokeshire, gower, brecon-beacons, anglesey,
llyn-peninsula, ceredigion, carmarthenshire, north-wales-coast,
south-wales-valleys, mid-wales, wye-valley
```

### Audience Tags
```
family-friendly, beginner-friendly, advanced-only,
dog-friendly, accessible, pushchair-accessible
```

### Feature Tags
```
parking-free, parking-paid, toilets, cafe, showers,
lifeguards, hire-available, lessons-available,
camping-nearby, pub-nearby
```

### Condition Tags
```
all-year, summer-only, tide-dependent, weather-dependent,
crowds-low, crowds-high, permit-required
```

### Quality Tags
```
award-winning, blue-flag, featured, hidden-gem,
instagram-famous, locals-secret
```

---

## Data Capture Requirements

Every spot record MUST include:

### Required Fields
| Field | Purpose |
|-------|---------|
| `slug` | URL identifier |
| `name` | Display name |
| `region` | Primary region tag |
| `lat`, `lon` | Coordinates |
| `quality_score` | 1-10 score |
| `tier` | A/B/C derived from score |
| `description` | Unique text |

### Required Tags (at least one each)
| Tag Type | Minimum |
|----------|---------|
| Activity | 1 |
| Audience | 1 |

### Recommended Fields
| Field | Purpose |
|-------|---------|
| `parking_lat`, `parking_lon` | Where to park |
| `parking_cost` | Free/paid/amount |
| `facilities` | Comma-separated list |
| `hazards` | Safety warnings |
| `best_season` | When to visit |
| `source_urls` | Research sources |

---

## Display Rules

### Region/Activity Pages (`/snowdonia/mtb/`)
```
1. Show Tier A spots first (full cards)
2. Show Tier B spots below (compact list)
3. Tier C in expandable "More spots" section
4. Never show Tier C above Tier A/B
```

### "Best Of" Pages (`/best/beaches-wales/`)
```
1. Only include Tier A spots
2. Maximum 10-15 items
3. Ranked by quality_score
4. Include honorable mentions (top Tier B)
```

### Search Results
```
1. Default sort: quality_score desc
2. Allow filter by tier
3. Show tier badge on results
```

### Spot Profile Pages
```
Tier A: Full page, 300+ words, photos, operators, nearby
Tier B: Standard page, 150 words, basic info
Tier C: Minimal page, 50 words, or redirect to parent
```

---

## Quality Maintenance

### Initial Capture
- Jules captures with estimated scores based on research
- Flag low-confidence scores for review

### Ongoing
- User signals (clicks, time on page) adjust scores
- Reviews/ratings when available
- Seasonal re-scoring (beach ratings differ summer vs winter)
- Annual audit of Tier A spots (still deserving?)

### Promotion/Demotion
- Tier B → Tier A: Needs manual review + content upgrade
- Tier A → Tier B: If quality issues emerge
- Tier C → Archive: If truly not worth including

---

## CSV Schema Update

Add these fields to all spot CSVs:

```csv
slug,name,region,...,quality_score,tier,tags_audience,tags_features,tags_conditions,source_urls
```

Example:
```csv
rhossili,Rhossili Bay,gower,...,9,A,"family-friendly,dog-friendly","parking-paid,toilets,cafe","all-year,crowds-high","https://...,https://..."
```

---

## Revision History

| Date | Change |
|------|--------|
| 2025-02-06 | Initial quality framework |
