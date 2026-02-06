# Mountain Biking Mega Page — Full Redesign Brief

**Current Score: 5/10**
**Target Score: 10/10**

---

## What's Wrong With The Current Page

### Layout Issues
- **Single column design** — wastes space, misses opportunity for sidebar content
- **No visual hierarchy** — walls of text, no breathing room
- **Activities grid is pointless** — pulling generic activities from DB adds no value
- **Missing imagery** — text-heavy, no hero shots, no trail photos, no action images

### Content Gaps
- **No individual trail centre pages** — every centre needs its own deep-dive page
- **No trail-by-trail breakdown** — just listing centres, not the actual trails
- **Missing practical info** — parking costs, opening hours, contact details
- **No video content** — YouTube embeds would add massive value
- **No accommodation tie-in** — where do MTB'ers stay?
- **No itineraries** — multi-day MTB trip planning
- **No blog content** — gear guides, best-of lists, seasonal tips
- **No events section** — races, enduros, festivals

### Missing Features
- **No interactive map** — trail centres plotted with filters
- **No comparison tools** — which centre is best for beginners?
- **No booking integration** — bike hire, uplift passes
- **No social proof** — reviews, Strava segments, rider quotes

---

## What The Best Sites Do Well

### BikeRadar / MBR Magazine Style
✅ **Per-trail breakdown** — every trail listed with:
- Grade colour
- Distance
- Estimated time
- Description
- Key features

✅ **Facilities checklist** — cafe, bike wash, hire, showers, shop

✅ **"How to get there"** — postcode, directions

✅ **"What to ride"** — bike recommendations for the terrain

✅ **"Sleeping and eating"** — accommodation + pub recommendations

✅ **"Best of the rest"** — nearby alternatives

### Beics Brenin (Coed y Brenin official site)
✅ **Individual trail pages** — each trail has its own page with:
- Downloadable PDF map
- Detailed description
- Tips and warnings
- Photos

✅ **Grading explainer table** — what each colour means, who it suits

✅ **Skills area mention** — "try before you commit" approach

### Wild Blighty
✅ **Regional focus** — breaks down by area (North Wales, etc.)
✅ **Insider tips** — "take cash for parking"
✅ **Facilities lists** — parking, cafe, toilets, hire, shop
✅ **Links to deeper guides** — each centre has its own full guide page
✅ **Natural riding options** — not just trail centres

### Trailforks / Komoot
✅ **User-generated content** — photos, reviews, Strava data
✅ **Difficulty ratings** — crowd-sourced accuracy
✅ **Conditions reports** — "wet but rideable"
✅ **Segment data** — climb stats, descent profiles

---

## New Page Structure

### Main Hub Page: `/mountain-biking`

**Layout: 2-column on desktop**

```
┌─────────────────────────────────────────────────────────┐
│ HERO: Full-width stunning MTB action shot              │
│ Title: "Mountain Biking in Wales"                      │
│ Stats bar: 10 Centres | 200+ Trails | 3 Bike Parks     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────┬───────────────────────┐
│ MAIN CONTENT (2/3 width)        │ SIDEBAR (1/3 width)   │
│                                 │                       │
│ [Introduction - 3 paragraphs]   │ ┌─────────────────┐   │
│                                 │ │ Quick Links     │   │
│ [Interactive Map of all         │ │ • Trail Centres │   │
│  trail centres with filters]    │ │ • Bike Parks    │   │
│                                 │ │ • Natural Rides │   │
│ [Trail Centre Grid - cards      │ │ • Bike Hire     │   │
│  with photos, key stats,        │ └─────────────────┘   │
│  "View Guide" buttons]          │                       │
│                                 │ ┌─────────────────┐   │
│ [Grading Guide section]         │ │ Featured        │   │
│                                 │ │ Itinerary       │   │
│ [Season Guide section]          │ │ "MTB Weekend    │   │
│                                 │ │  in Snowdonia"  │   │
│ [Video Section - YouTube        │ └─────────────────┘   │
│  embeds of best Welsh MTB]      │                       │
│                                 │ ┌─────────────────┐   │
│ [MTB Events Calendar]           │ │ Where to Stay   │   │
│                                 │ │ • YHA Dolgellau │   │
│ [Related Blog Posts grid]       │ │ • Old Skool MTB │   │
│                                 │ │ • Plas Curig    │   │
│ [FAQs - expandable]             │ └─────────────────┘   │
│                                 │                       │
│                                 │ ┌─────────────────┐   │
│                                 │ │ Latest Blog     │   │
│                                 │ │ Posts           │   │
│                                 │ └─────────────────┘   │
│                                 │                       │
│                                 │ ┌─────────────────┐   │
│                                 │ │ Bike Hire       │   │
│                                 │ │ Partners        │   │
│                                 │ └─────────────────┘   │
└─────────────────────────────────┴───────────────────────┘
```

### Individual Trail Centre Pages: `/mountain-biking/[centre-slug]`

**Create these pages:**
1. `/mountain-biking/bikepark-wales`
2. `/mountain-biking/coed-y-brenin`
3. `/mountain-biking/antur-stiniog`
4. `/mountain-biking/afan-forest-park`
5. `/mountain-biking/coed-llandegla`
6. `/mountain-biking/cwmcarn`
7. `/mountain-biking/nant-yr-arian`
8. `/mountain-biking/brechfa`
9. `/mountain-biking/dyfi-bike-park`
10. `/mountain-biking/revolution-bike-park`

**Each page includes:**

```
┌─────────────────────────────────────────────────────────┐
│ HERO: Centre-specific image gallery (swipeable)        │
│ Title: "Coed y Brenin Trail Guide"                     │
│ Subtitle: "The UK's first purpose-built trail centre"  │
│ Stats: 8 trails | Free parking | Cafe | Bike Hire      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────┬───────────────────────┐
│ MAIN CONTENT                    │ SIDEBAR               │
│                                 │                       │
│ [Overview - 2-3 paragraphs]     │ ┌─────────────────┐   │
│                                 │ │ At a Glance     │   │
│ ┌─────────────────────────────┐ │ │ 📍 Dolgellau    │   │
│ │ IMAGE GRID (2x3)            │ │ │ 🅿️ £5/day       │   │
│ │ [photo] [photo] [photo]     │ │ │ ☕ Cafe: Yes    │   │
│ │ [photo] [photo] [photo]     │ │ │ 🚿 Showers: Yes │   │
│ └─────────────────────────────┘ │ │ 🔧 Bike Hire    │   │
│                                 │ │ 📞 01onal...    │   │
│ [FACILITIES TABLE]              │ │ 🌐 Website      │   │
│ ✓ Cafe  ✓ Bike Wash  ✓ Hire   │ └─────────────────┘   │
│ ✓ Shop  ✓ Showers  ✓ Toilets  │                       │
│                                 │ ┌─────────────────┐   │
│ [TRAIL LIST - expandable]       │ │ Getting There   │   │
│ ┌─────────────────────────────┐ │ │ [Mini Map]      │   │
│ │ 🟢 Yr Afon | 10.8km | 1-3h  │ │ │ Postcode:       │   │
│ │    Novice-friendly...       │ │ │ LL40 2HZ        │   │
│ ├─────────────────────────────┤ │ │ [Get Directions]│   │
│ │ 🔵 MinorTaur | 12km | 1-2h  │ │ └─────────────────┘   │
│ │    Perfect intro to MTB...  │ │                       │
│ ├─────────────────────────────┤ │ ┌─────────────────┐   │
│ │ 🔴 Dragon's Back | 31km     │ │ │ Where to Stay   │   │
│ │    Classic XC challenge...  │ │ │ Near Coed y     │   │
│ ├─────────────────────────────┤ │ │ Brenin          │   │
│ │ ⚫ The Beast | 38km | 3-5h  │ │ │ [Accomm cards]  │   │
│ │    CYB's ultimate test...   │ │ └─────────────────┘   │
│ └─────────────────────────────┘ │                       │
│                                 │ ┌─────────────────┐   │
│ [GRADING GUIDE for this centre] │ │ Nearby Rides    │   │
│                                 │ │ • Antur Stiniog │   │
│ [INSIDER TIPS]                  │ │ • Penmachno     │   │
│ "Arrive by 8am in summer..."    │ │ • Gwydir Mawr   │   │
│                                 │ └─────────────────┘   │
│ [VIDEO SECTION]                 │                       │
│ YouTube embeds of this centre   │ ┌─────────────────┐   │
│                                 │ │ Best Time to    │   │
│ [WEATHER WIDGET]                │ │ Visit           │   │
│                                 │ │ [Season chart]  │   │
│ [RELATED ITINERARIES]           │ └─────────────────┘   │
│ "Snowdonia MTB Weekend"         │                       │
│                                 │                       │
│ [USER REVIEWS / SOCIAL PROOF]   │                       │
│                                 │                       │
│ [FAQs specific to this centre]  │                       │
└─────────────────────────────────┴───────────────────────┘
```

---

## Image Requirements

### Hero Images Needed
| Image | Description | Source |
|-------|-------------|--------|
| `mtb-hero-main.jpg` | Epic Welsh MTB action shot - rider on ridge | Visit Wales / Unsplash |
| `bikepark-wales-hero.jpg` | Rider hitting jump at BPW | BPW press kit |
| `coed-y-brenin-hero.jpg` | Classic CYB singletrack | NRW / Visit Wales |
| `antur-stiniog-hero.jpg` | Slate quarry descent | Antur Stiniog press |
| `afan-hero.jpg` | Forest singletrack | NRW |
| `llandegla-hero.jpg` | Boardwalk drop | One Planet Adventure |

### Trail Centre Gallery Images (6 per centre)
Each centre needs:
1. Entrance/visitor centre
2. Trail action shot
3. Scenic vista from trail
4. Cafe/facilities
5. Bike wash/parking area
6. Signature feature (jump, rock garden, etc.)

### Trail-Specific Images
- Downloadable trail maps (PDF from official sources)
- Elevation profile graphics
- Key feature photos

---

## Content To Create

### New Data Structure
Expand `mountain-biking.ts` to include:

```typescript
interface TrailCentre {
  // Current fields...
  
  // NEW: Individual trails
  trails: Trail[];
  
  // NEW: Gallery
  gallery: {
    images: { src: string; alt: string; caption?: string }[];
    videos: { platform: 'youtube' | 'vimeo'; id: string; title: string }[];
  };
  
  // NEW: Practical info
  practical: {
    parkingCost: string;
    openingHours: string;
    contact: { phone?: string; email?: string };
    postcode: string;
    coordinates: { lat: number; lng: number };
    nearestTown: string;
    driveTimeFromM4?: string;
  };
  
  // NEW: Facilities (boolean flags)
  facilities: {
    cafe: boolean;
    bikeWash: boolean;
    bikeHire: boolean;
    shop: boolean;
    showers: boolean;
    toilets: boolean;
    uplift: boolean;
    skillsArea: boolean;
    camping: boolean;
  };
  
  // NEW: Related content
  related: {
    itineraries: string[];  // slugs
    accommodation: string[]; // slugs
    blogPosts: string[];    // slugs
    nearbyRides: string[];  // other centre slugs
  };
}

interface Trail {
  name: string;
  slug: string;
  grade: 'green' | 'blue' | 'red' | 'black' | 'pro';
  distance: string;
  duration: string;
  elevation?: string;
  description: string;
  features: string[];
  tips?: string;
  mapPdf?: string;
}
```

### Blog Posts To Write
1. "Best Trail Centre for Beginners in Wales"
2. "Bike Hire Guide: Where to Rent in Wales"
3. "MTB Accommodation: Bike-Friendly Places to Stay"
4. "Wet Weather Riding: Which Trails Drain Best"
5. "Family MTB: Kid-Friendly Trails in Wales"
6. "The Complete Guide to BikePark Wales Trails"
7. "Coed y Brenin: A First-Timer's Guide"
8. "Natural Riding in Wales: Beyond the Trail Centres"
9. "MTB Events Calendar: Races & Festivals 2026"
10. "E-Bike Trails: Where to Ride Electric in Wales"

### Itineraries To Create
1. "Snowdonia MTB Weekend" (CYB + Antur Stiniog + natural)
2. "South Wales Bike Park Tour" (BPW + Afan + Cwmcarn)
3. "Family MTB Holiday" (Llandegla + beginner-friendly)
4. "5-Day Wales MTB Epic" (hit all major centres)

### Accommodation To Feature
- Old Skool MTB Accommodation (Dolgellau)
- YHA Dolgellau
- Plas Curig (Snowdonia)
- Afan Lodge
- The Bike Shed (Brecon)

---

## Video Content To Embed

### YouTube Videos to Curate
| Video | Centre | Why |
|-------|--------|-----|
| GMBN "Riding Every Trail at BPW" | BikePark Wales | Comprehensive |
| Olly Wilkins 12-hour challenge | BikePark Wales | Entertainment |
| Rachel Atherton home trails | Wales | Star power |
| MBR Coed y Brenin guide | Coed y Brenin | Authoritative |
| Antur Stiniog GoPro run | Antur Stiniog | POV experience |
| Danny MacAskill Wales | Various | Viral, inspirational |

---

## Technical Implementation

### New Routes Needed
```
/mountain-biking                    → Main hub (redesigned)
/mountain-biking/[centre-slug]      → Individual centre guide
/mountain-biking/trails             → All trails searchable
/mountain-biking/natural            → Non-trail-centre riding
/mountain-biking/events             → Races & festivals
```

### New Components Needed
```
TrailCentreCard.tsx        → Card for hub page grid
TrailCentreHero.tsx        → Gallery hero for centre pages
TrailList.tsx              → Expandable trail list
FacilitiesTable.tsx        → Icons + labels grid
GradingGuide.tsx           → Visual grade explainer (EXISTS)
CentreMap.tsx              → Single centre location map
VideoGallery.tsx           → YouTube embed grid
AccommodationSidebar.tsx   → Nearby stays widget
WeatherWidget.tsx          → Current conditions
```

### Data Files Needed
```
/data/trail-centres/bikepark-wales.ts
/data/trail-centres/coed-y-brenin.ts
/data/trail-centres/antur-stiniog.ts
... (one per centre)
```

---

## Priority Actions

### Phase 1: Content & Data (Week 1)
- [ ] Expand trail centre data with full trail lists
- [ ] Add practical info (parking, hours, contact)
- [ ] Source 6 images per trail centre
- [ ] Write detailed descriptions for each centre
- [ ] Add facilities data

### Phase 2: Individual Centre Pages (Week 2)
- [ ] Build `/mountain-biking/[centre-slug]` template
- [ ] Create image galleries
- [ ] Add downloadable trail maps
- [ ] Embed YouTube videos
- [ ] Add accommodation sidebar

### Phase 3: Hub Page Redesign (Week 3)
- [ ] Convert to 2-column layout
- [ ] Add interactive map
- [ ] Redesign trail centre cards
- [ ] Add sidebar widgets (itineraries, accommodation, blog)
- [ ] Remove pointless activities grid
- [ ] Add video section

### Phase 4: Supporting Content (Week 4)
- [ ] Write 3-5 blog posts
- [ ] Create 2 MTB itineraries
- [ ] Add MTB events to calendar
- [ ] Link accommodation with "MTB-friendly" tags

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Time on page | ~2 min | 5+ min |
| Scroll depth | 40% | 70%+ |
| Click to trail centre page | N/A | 30% |
| Click to accommodation | N/A | 10% |
| Click to itinerary | N/A | 15% |
| Backlinks | Few | 20+ |
| Keyword ranking "MTB Wales" | ? | Top 5 |

---

## Reference Sites

Study these for inspiration:
- **BikeRadar trail guides** — content depth, trail breakdowns
- **Beics Brenin** — official source, trail maps, grading
- **Wild Blighty** — tone, insider tips, structure
- **MBR Magazine** — authority, photography, recommendations
- **Trailforks** — data richness, user content
- **MBUK** — magazine-style editorial

---

## The 10/10 Standard

Before considering the page complete:

- [ ] Every trail centre has its own page with 6+ images
- [ ] Every trail at each centre is listed with grade/distance/time
- [ ] Interactive map shows all centres with filters
- [ ] Accommodation sidebar with 3+ bike-friendly options
- [ ] At least 5 related blog posts
- [ ] At least 2 MTB-specific itineraries
- [ ] Video embeds (3+ YouTube videos)
- [ ] Facilities clearly shown with icons
- [ ] Parking costs and directions for every centre
- [ ] Season guide shows month-by-month conditions
- [ ] FAQs answer the top 10 Google questions
- [ ] Social proof (reviews, Strava, quotes)
- [ ] Mobile experience is excellent
- [ ] Page loads fast despite images
- [ ] Schema markup for all trail centres
