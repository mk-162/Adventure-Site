# Adventure Wales: Programmatic SEO Playbook

How to apply the 12 pSEO playbooks to dominate Welsh adventure search.

---

## Our Assets

| Asset | Type | Defensibility |
|-------|------|---------------|
| Operator database (50+) | First-party | High |
| Trail/spot data | First-party | High |
| Region expertise | First-party | High |
| Activity knowledge | First-party | Medium |
| Event data | Aggregated | Medium |
| Photos | Licensed/CC | Low |

---

## Playbooks That Apply

### ✅ 1. LOCATIONS (Primary)

**Pattern**: "[activity] in [location]"

**Target searches**:
- "mountain biking in snowdonia"
- "coasteering in pembrokeshire"
- "surfing in gower"
- "hiking near brecon beacons"
- "climbing in wales"

**Page matrix**:

| Activities (15) | × | Regions (10) | = | 150 pages |
|-----------------|---|--------------|---|-----------|
| surfing | | snowdonia | | |
| mountain biking | | pembrokeshire | | |
| coasteering | | gower | | |
| hiking | | brecon beacons | | |
| climbing | | anglesey | | |
| kayaking | | llyn peninsula | | |
| caving | | north wales | | |
| gorge walking | | mid wales | | |
| wild swimming | | south wales | | |
| ... | | ... | | |

**URL structure**: `/[region]/[activity]/`
- `/snowdonia/mountain-biking/`
- `/pembrokeshire/coasteering/`
- `/gower/surfing/`

**Unique value per page**:
- Local operators who run sessions
- Specific spots/trails in that region
- Best time to visit for that activity
- Local conditions/tips
- Nearby accommodation
- Getting there from major cities

**NOT just**: "Mountain biking is great. Snowdonia is in Wales. Here's a list."

---

### ✅ 2. DIRECTORY (Primary)

**Pattern**: "[activity] operators" / "[activity] providers"

**Target searches**:
- "coasteering providers wales"
- "mountain bike guides snowdonia"
- "surf schools pembrokeshire"
- "climbing instructors wales"

**Page types**:

**A) Activity directories**:
- `/operators/coasteering/` — All coasteering operators
- `/operators/mountain-biking/` — All MTB operators
- `/operators/climbing/` — All climbing operators

**B) Region directories**:
- `/snowdonia/operators/` — All operators in Snowdonia
- `/pembrokeshire/operators/` — All operators in Pembrokeshire

**C) Combined (Locations + Directory)**:
- `/pembrokeshire/coasteering/operators/` — Coasteering operators in Pembrokeshire

**Unique value**:
- Rich operator profiles (not just names)
- Ratings, reviews, trust signals
- Price ranges
- What they specialise in
- Direct booking links
- Honest recommendations

---

### ✅ 3. CURATION (Primary)

**Pattern**: "best [activity] in [location]" / "top [spots] in wales"

**Target searches**:
- "best mountain biking in wales"
- "best beaches in pembrokeshire"
- "best surf spots gower"
- "best hiking trails snowdonia"
- "best coasteering wales"
- "top 10 mtb trails uk"

**URL structure**: `/best/[thing]/` or `/[region]/best-[thing]/`
- `/best/mountain-biking-wales/`
- `/gower/best-beaches/`
- `/snowdonia/best-hikes/`

**Unique value**:
- Genuine rankings based on criteria
- Personal experience/testing
- Updated regularly (show date)
- Not just "everything is great"
- Clear "best for X" recommendations

---

### ✅ 4. PROFILES (Secondary)

**Pattern**: "[trail/spot name]" / "[operator name]"

**Target searches**:
- "coed y brenin trails"
- "bikepark wales"
- "rhossili bay"
- "three cliffs bay"
- "TYF adventure"
- "trans cambrian way"

**Page types**:

**A) Trail/Spot profiles**:
- `/trails/coed-y-brenin/` — Everything about this trail centre
- `/beaches/rhossili-bay/` — Everything about this beach
- `/routes/trans-cambrian-way/` — Everything about this route

**B) Operator profiles**:
- `/operators/tyf-adventure/` — Full operator profile
- `/operators/bikepark-wales/` — Full operator profile

**Unique value**:
- Comprehensive single-source information
- More than Wikipedia
- Practical details (parking, costs, conditions)
- Related operators/activities
- User tips

---

### ✅ 5. PERSONAS (Secondary)

**Pattern**: "[activity] for [audience]"

**Target searches**:
- "family adventures wales"
- "adventure holidays for beginners"
- "extreme sports wales"
- "kids activities snowdonia"
- "romantic getaway wales adventure"
- "stag do activities wales"

**URL structure**: `/for/[persona]/`
- `/for/families/`
- `/for/beginners/`
- `/for/couples/`
- `/for/groups/`
- `/for/adrenaline-junkies/`

**Unique value**:
- Curated activities for that audience
- Operators who specialise in that persona
- Itinerary suggestions
- Honest "skip this if you're X" advice

---

### ✅ 6. GLOSSARY (Supporting)

**Pattern**: "what is [term]"

**Target searches**:
- "what is coasteering"
- "what is gorge walking"
- "what is wild swimming"
- "mtb trail grades explained"

**URL structure**: `/learn/[term]/`
- `/learn/coasteering/`
- `/learn/trail-grades/`
- `/learn/wild-swimming/`

**Unique value**:
- Clear definitions
- What to expect
- Who it's for / not for
- Where to try it in Wales
- Links to operators

---

### ⚠️ 7. COMPARISONS (Tertiary)

**Pattern**: "[X] vs [Y]"

**Potential searches**:
- "bikepark wales vs antur stiniog"
- "gower vs pembrokeshire beaches"
- "snowdonia vs brecon beacons hiking"

**URL structure**: `/compare/[x]-vs-[y]/`

**Caution**: Only create if there's genuine search demand. Don't force it.

---

### ❌ NOT APPLICABLE

| Playbook | Why Not |
|----------|---------|
| Templates | We don't offer downloadable templates |
| Conversions | No unit/format conversion use case |
| Integrations | No product integrations |
| Translations | Welsh possible, but low priority |

---

## Implementation Priority

### Phase 1: Foundation (Now)

1. **Activity × Region pages** (Locations playbook)
   - 150 pages covering all combinations
   - Each with unique local content
   
2. **Trail centre mega-pages** (Profiles playbook)
   - 10 major trail centres
   - Each 10-15KB of unique content

### Phase 2: Depth

3. **Operator directory pages** (Directory playbook)
   - By activity
   - By region
   - Combined

4. **"Best of" curation pages** (Curation playbook)
   - Best activities per region
   - Best spots per activity

### Phase 3: Expansion

5. **Individual spot/trail pages** (Profiles playbook)
   - 100+ beaches, trails, crags
   
6. **Persona pages** (Personas playbook)
   - Families, beginners, groups, etc.

7. **Educational content** (Glossary playbook)
   - What is X pages
   - How to guides

---

## URL Architecture

```
adventurewales.co.uk/
├── /[region]/                        # Region hub
│   ├── /[region]/[activity]/         # Activity in region (LOCATIONS)
│   ├── /[region]/best-[thing]/       # Best of in region (CURATION)
│   └── /[region]/operators/          # Operators in region (DIRECTORY)
├── /activities/
│   └── /activities/[activity]/       # Activity hub
├── /operators/
│   ├── /operators/[activity]/        # Operators by activity (DIRECTORY)
│   └── /operators/[slug]/            # Individual operator (PROFILES)
├── /trails/
│   └── /trails/[slug]/               # Trail centre pages (PROFILES)
├── /beaches/
│   └── /beaches/[slug]/              # Beach pages (PROFILES)
├── /routes/
│   └── /routes/[slug]/               # Multi-day routes (PROFILES)
├── /best/
│   └── /best/[topic]/                # Best of lists (CURATION)
├── /for/
│   └── /for/[persona]/               # Persona pages (PERSONAS)
└── /learn/
    └── /learn/[term]/                # Glossary (GLOSSARY)
```

---

## Data Requirements

### For Locations Pages

Each Activity × Region page needs:
- 3-5 specific spots/trails in that region
- 2-4 operators who run sessions
- Best time to visit
- Typical conditions
- Getting there info
- 300+ words unique intro
- 2-3 photos

### For Directory Pages

Each operator listing needs:
- Name, location, website
- Activities offered
- Price range
- Rating/reviews
- Trust signals (certifications, years in business)
- Unique 100+ word description
- Photo

### For Profile Pages

Each trail/spot/route needs:
- Full data (distance, grade, facilities, etc.)
- 500+ words unique description
- 3-5 photos
- Related operators
- Related spots
- Practical info (parking, access, conditions)

---

## Quality Checklist

Before publishing any pSEO page:

- [ ] **Unique intro** — Not template text with variables swapped
- [ ] **Genuine value** — Would a real person find this useful?
- [ ] **Local specificity** — Contains info specific to this location
- [ ] **Operator links** — Connected to real businesses
- [ ] **Internal links** — Connected to related pages
- [ ] **Schema markup** — LocalBusiness, Place, or appropriate type
- [ ] **Unique meta** — Title and description not duplicated
- [ ] **Images** — At least 1 relevant, attributed image

---

## Avoiding Penalties

### Thin Content
**Bad**: "Surfing in Gower is great. Gower has waves. Book a surf lesson in Gower."
**Good**: "Llangennith at the north end of Rhossili Bay is Gower's surf epicentre — a 3-mile beach that picks up any swell going and works on all tides..."

### Keyword Stuffing
**Bad**: "Mountain biking Wales mountain biking Welsh mountain biking trails Wales MTB"
**Good**: Natural language that happens to include the target phrase once or twice.

### Doorway Pages
**Bad**: 50 nearly identical pages for "surfing in [town]" with no unique content
**Good**: Fewer, richer pages for regions with genuine differentiation

### Duplicate Content
**Bad**: Same operator description on every page they appear
**Good**: Contextual mention on each page, full profile on their dedicated page

---

## Measurement

### Track per page type:
- Indexation rate
- Ranking positions
- Organic traffic
- Time on page
- Bounce rate
- Conversion (clicks to operators)

### Warning signs:
- Pages not indexing → too thin
- Rankings dropping → quality issues
- High bounce → not matching intent
- Manual action → penalty territory
