# Internal Linking Strategy

*How pages connect to build authority and guide users through Adventure Wales*

---

## Why This Matters

Internal links do three things:
1. **Pass authority** — Link equity flows from strong pages to weaker ones
2. **Create topical clusters** — Google understands related content
3. **Guide users** — Keep people on site, moving deeper

For a pSEO site with 250+ pages, this is the difference between a content graveyard and a traffic machine.

---

## The Hub & Spoke Model

Every topic area has a **hub page** (broad, high-authority) with **spoke pages** (specific, long-tail) linking back.

```
                    ┌─────────────────┐
                    │   /mtb/         │  ← Hub (MTB in Wales)
                    │   High authority│
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ /snowdonia/   │   │ /trails/      │   │ /best/        │
│ mtb/          │   │ coed-y-brenin │   │ mtb-wales/    │
│ Region spoke  │   │ Profile spoke │   │ Curation spoke│
└───────────────┘   └───────────────┘   └───────────────┘
```

### Hub Pages (Build Authority Here)
- `/mtb/` — MTB in Wales overview
- `/surfing/` — Surfing in Wales overview
- `/coasteering/` — Coasteering overview
- `/snowdonia/` — Snowdonia region overview
- `/pembrokeshire/` — Pembrokeshire region overview

### Spoke Pages (Capture Long-Tail)
- Region + Activity: `/snowdonia/mtb/`
- Profiles: `/trails/coed-y-brenin/`
- Curation: `/best/mtb-trails-wales/`
- Operator: `/operators/mtb/`

---

## Link Rules by Page Type

### Activity Hub Pages (`/mtb/`, `/surfing/`)

**Must link to:**
- [ ] Every region + activity page (Snowdonia MTB, Pembrokeshire MTB)
- [ ] Top 3-5 spot profiles for that activity
- [ ] "Best of" curation page for that activity
- [ ] Operator directory for that activity

**Link format:**
```markdown
## Where to Ride

Wales has [11 trail centres](/best/mtb-trail-centres/) and hundreds of 
natural trails across five main regions:

- **[Snowdonia](/snowdonia/mtb/)** — The big mountains. Coed y Brenin, 
  Antur Stiniog, Penmachno.
- **[South Wales Valleys](/south-wales/mtb/)** — BikePark Wales, Afan, 
  Cwmcarn. Former coal country reborn.
```

---

### Region Hub Pages (`/snowdonia/`, `/pembrokeshire/`)

**Must link to:**
- [ ] Every activity available in that region
- [ ] Top spots/profiles in that region
- [ ] Nearby regions (geographic neighbours)
- [ ] Relevant "best of" pages

**Link format:**
```markdown
## Adventures in Snowdonia

- **[Mountain Biking](/snowdonia/mtb/)** — Coed y Brenin, Antur Stiniog, 
  and backcountry epics
- **[Hiking](/snowdonia/hiking/)** — Snowdon and the 3000ers
- **[Climbing](/snowdonia/climbing/)** — Llanberis Pass, Tremadog

Neighbouring regions: [Llŷn Peninsula](/llyn/) • [Mid Wales](/mid-wales/)
```

---

### Region + Activity Pages (`/snowdonia/mtb/`)

**Must link to:**
- [ ] Parent activity hub (`/mtb/`)
- [ ] Parent region hub (`/snowdonia/`)
- [ ] Every spot profile in this region + activity
- [ ] Operators serving this region + activity
- [ ] Related "best of" pages

**Link format:**
```markdown
## Trail Centres

### [Coed y Brenin](/trails/coed-y-brenin/)
The original. Eight trails from family-friendly to The Beast...
[Read full guide →](/trails/coed-y-brenin/)

### [Antur Stiniog](/trails/antur-stiniog/)
Gravity-focused. Uplift service means more runs, less climbing...
[Read full guide →](/trails/antur-stiniog/)
```

---

### Spot Profile Pages (`/trails/coed-y-brenin/`)

**Must link to:**
- [ ] Parent region + activity page (`/snowdonia/mtb/`)
- [ ] Activity hub (`/mtb/`)
- [ ] 2-3 related spots (nearby or similar difficulty)
- [ ] Operators who run sessions here
- [ ] Any "best of" lists this spot appears on

**Link format:**
```markdown
## Practical Info

**Location:** Snowdonia — [see all Snowdonia MTB →](/snowdonia/mtb/)

**Operators running sessions here:**
- [Beics Brenin](/operators/beics-brenin/) — guiding, skills coaching
- [MTB Wales](/operators/mtb-wales/) — multi-day tours

**Nearby alternatives:**
- [Antur Stiniog](/trails/antur-stiniog/) — 25 mins, gravity focus
- [Penmachno](/trails/penmachno/) — 20 mins, natural trails

*Featured in: [Best MTB Trail Centres](/best/mtb-trail-centres/)*
```

---

### "Best Of" Curation Pages (`/best/mtb-trails-wales/`)

**Must link to:**
- [ ] Every spot mentioned (profile page)
- [ ] Parent activity hub
- [ ] Related region pages
- [ ] Related curation pages (best beginner, best advanced)

**Link format:**
```markdown
## The List

### 1. [Coed y Brenin](/trails/coed-y-brenin/) — Best All-Rounder
The original Welsh trail centre and still the benchmark...

### 2. [BikePark Wales](/trails/bikepark-wales/) — Best for Gravity
35 trails, UK's only full-scale bike park...

---

**More lists:**
- [Best for Beginners](/best/beginner-mtb-wales/)
- [Best for Families](/best/family-mtb-wales/)
- [Best Trail Centres](/best/mtb-trail-centres/)
```

---

### Operator Pages (`/operators/mtb-wales/`)

**Must link to:**
- [ ] Every spot they operate at
- [ ] Region pages they serve
- [ ] Activity pages they serve
- [ ] Related operators (complementary, not competing)

---

## Contextual Linking Rules

### In Body Copy

**Do:**
- Link on first mention of a place/activity
- Use descriptive anchor text (`Coed y Brenin` not `click here`)
- Link where it helps the reader

**Don't:**
- Link the same page multiple times in one section
- Force links where they break reading flow
- Use exact-match keyword anchors repeatedly (looks spammy)

**Good:**
```markdown
The [Trans Cambrian Way](/routes/trans-cambrian/) crosses the 
Cambrian Mountains from Knighton to Machynlleth. Most riders 
take 3-4 days, though fit riders have done it in two.
```

**Bad:**
```markdown
If you want to do [mountain biking in Wales](/mtb/) then 
[Wales mountain biking](/mtb/) is great. [Click here](/mtb/) 
to learn more about [Welsh MTB trails](/mtb/).
```

---

### Standard Link Blocks

Every page should have these sections:

**1. Breadcrumb Trail (top)**
```
Home > MTB > Snowdonia > Coed y Brenin
```

**2. Related Content (bottom)**
```markdown
## Keep Exploring

**Nearby:** [Antur Stiniog](/trails/antur-stiniog/) • 
[Penmachno](/trails/penmachno/) • [Marin Trail](/trails/marin/)

**More MTB:** [All Wales MTB →](/mtb/) • 
[Best Trail Centres →](/best/mtb-trail-centres/)

**This Region:** [All Snowdonia Adventures →](/snowdonia/)
```

**3. Operator CTA (where relevant)**
```markdown
## Book a Session

- [Beics Brenin](/operators/beics-brenin/) — Local guides, skills coaching
- [MTB Wales](/operators/mtb-wales/) — Multi-day adventures
```

---

## Link Audit Checklist

Run this quarterly:

### Hub Pages
- [ ] Link to all child pages (regions, spots)
- [ ] No orphan children (pages with no hub link)
- [ ] Links are current (no dead pages)

### Spoke Pages  
- [ ] Every spoke links back to its hub
- [ ] Every spoke links to 2+ related spokes
- [ ] Operator links are current

### Curation Pages
- [ ] Every listed spot has a working profile link
- [ ] "More lists" section links to related curation

### Orphan Check
- [ ] No pages with zero internal links pointing to them
- [ ] No pages that link to nothing

---

## Link Density Guidelines

| Page Type | Target Internal Links |
|-----------|----------------------|
| Hub pages | 15-30 |
| Region + Activity | 10-20 |
| Spot profiles | 8-15 |
| Curation lists | 15-25 (every item + related) |
| Operator pages | 5-10 |

Too few = missed opportunity. Too many = diluted value and bad UX.

---

## Priority Linking Targets

These pages need the most internal links pointing to them:

1. **Activity hubs** — `/mtb/`, `/surfing/`, `/coasteering/`
2. **Region hubs** — `/snowdonia/`, `/pembrokeshire/`
3. **Money pages** — Operator directories
4. **Best content** — Top curation pages

When in doubt, add a link to a hub page.

---

## Technical Implementation

### Next.js Components

Create reusable link blocks:

```jsx
// components/RelatedSpots.jsx
// Pulls from spots database, shows nearby/similar

// components/Breadcrumbs.jsx
// Auto-generates from URL structure

// components/OperatorCTA.jsx
// Shows operators for a given spot/activity

// components/KeepExploring.jsx
// Standard footer links block
```

### Automated Link Suggestions

Build a script that:
1. Scans page content for place/activity mentions
2. Suggests internal links where none exist
3. Flags orphan pages
4. Reports link density per page

---

## Revision History

| Date | Change |
|------|--------|
| 2025-02-06 | Initial strategy |
