# Adventure Wales — Strategy

## What This Is

A trip planning platform for outdoor adventures in Wales. Not a listings directory. Not a tourism board. A tool that helps people **plan, book, and enjoy** real trips.

## The Core Insight

Nobody books just one activity. They book a *trip*. A coasteering weekend includes finding somewhere to stay, somewhere to eat, something to do when it rains, and knowing how to get there. Most adventure sites list activities in isolation. We connect them into complete, bookable trips.

## Who It's For

### Primary: The Trip Planner
- Couples, friend groups, families planning a weekend or week away
- Know they want "something outdoorsy in Wales" but haven't committed to specifics
- Need the full picture: activities + accommodation + food + transport + local knowledge
- Decision stage: comparing options, checking prices, building confidence to book

### Secondary: The Activity Booker
- Already know what they want (e.g. "coasteering in Pembrokeshire")
- Looking for the right operator, the right price, the right date
- Need trust signals: reviews, ratings, accreditations, honest difficulty info
- Will book directly with operators — we connect them

### Tertiary: The Operator
- Welsh adventure businesses wanting visibility and bookings
- Need a platform that sends them qualified leads, not just traffic
- Free listing gets them found; paid listing gets them featured

## The USP: Intelligent Itineraries

The trip planner is the product. Everything else supports it.

An itinerary on Adventure Wales isn't a blog post — it's an interactive plan:
- **Activities** with real operators, real prices, real booking links
- **Accommodation** matched to the trip location and budget
- **Food & drink** — actual pubs, cafes, restaurants near the activities
- **Attractions & sightseeing** — castles, waterfalls, viewpoints, beaches
- **Transport** — how to get there, parking, car-free options
- **Weather** — what to expect, what to do if it rains
- **Local tips** — the stuff only locals know

A mountain biker visiting Wales for 3 days doesn't just need trail recommendations. They need to know where to wash their bike, where to get a decent coffee after, which pub does food late, and whether Castell Coch is worth a detour on the drive home.

**If it's not in our database, it can't go in an itinerary. So the database must contain everything a visitor might want to do, see, eat, or visit — not just adventure activities.**

## The Tier System

Everything in the database has a tier. The tier determines how prominently it appears, whether it gets its own landing page, and how much content investment it gets.

### Tier 1: Destination Draws
*The reasons people visit the area. What they Google. What they tell their friends about.*

These are the headline attractions — both businesses and natural landmarks:
- **Zip World** (business) — people travel to Snowdonia specifically for this
- **Snowdon** (landmark) — people travel to Wales specifically to climb it
- **Coasteering in Pembrokeshire** (activity category) — a destination activity
- **Pen y Fan** (landmark) — the iconic Brecon Beacons hike
- **Surf Snowdonia** (business) — people plan trips around it
- **Skomer Island puffins** (natural attraction) — seasonal destination draw

**Treatment**: Full, rich landing pages. Deep content. SEO priority. These pages must be genuinely best-in-class — better than Visit Wales, better than TripAdvisor. These are the pages that rank and drive traffic.

**Rule**: If someone Googles this thing + "Wales", we should be on page 1.

### Tier 2: Trip Enhancers
*Things that make a good trip great. People don't travel FOR these, but they're glad they found them.*

- **Castles** — Harlech, Conwy, Caernarfon (worth a detour)
- **Waterfalls** — Sgwd yr Eira, Pistyll Rhaeadr (afternoon activity)
- **Good pubs** — The Pen-y-Gwryd Hotel, The Stackpole Inn (adventure-friendly)
- **Cafes** — cyclist pit stops, post-hike coffee spots
- **Beaches** — for a rest day or afternoon
- **Scenic viewpoints** — photo ops, sunset spots
- **Local food experiences** — markets, farm shops, Welsh cakes

**Treatment**: Appear in itineraries, on region pages, and in "what else to do" sections. May get their own page if there's genuine search demand (e.g. "best pubs near Snowdon"), but don't create thin standalone pages just for the sake of it. Group them into useful lists instead.

**Rule**: These appear wherever a T1 activity is recommended. "After your coasteering session, the Stackpole Inn is a 5-minute walk."

### Tier 3: Practical Services
*Useful data that makes trip planning smooth. Nobody Googles these, but everyone needs them.*

- **Gear shops** — where to buy/rent if you forgot something
- **Bike washes** — essential for MTB trips
- **Outdoor stores** — for last-minute kit
- **Parking** — specific car parks, costs, alternatives
- **Transport** — bus stops, train stations, shuttle services
- **Medical** — nearest A&E, pharmacies (for remote areas)

**Treatment**: Data points within itineraries and region pages. Never standalone pages. "There's a bike wash at the Coed y Brenin car park" is a line item, not a landing page.

**Rule**: T3 never gets its own URL. It lives inside T1 and T2 content.

## SEO Strategy: Depth Over Breadth

### What We Build Landing Pages For
- **T1 attractions and activities** — rich, authoritative, best-in-class
- **Region + activity combos** — "coasteering in Pembrokeshire", "mountain biking Snowdonia"
- **Trip planning intent** — "weekend adventure Wales", "3 days in Snowdonia"
- **Genuine questions** — "is coasteering safe", "best time to climb Snowdon"

### What We DON'T Build Landing Pages For
- Individual T3 services (no page for a bike wash)
- Thin operator listings with no real content (that's spam)
- Activity types with no Welsh presence (no bungee jumping page if there's nothing to link to)
- Duplicate/near-duplicate pages that cannibalise each other

### Content Quality Bar
Every page must pass this test:
1. **Would a real person bookmark this?** If not, don't publish it.
2. **Does it contain information you can't get from the first Google result?** If not, what's the point?
3. **Does it help someone plan or book something?** If not, it's just content for content's sake.

## What Goes In The Database

### Activities (T1)
Coasteering, climbing, kayaking, surfing, mountain biking, hiking, caving, gorge walking, wild swimming, paddleboarding, horse riding, fishing, zip-lining, etc. Each linked to real operators with real prices.

### Attractions & Landmarks (T1 + T2)
Snowdon, castles, waterfalls, beaches, islands, parks. These need a `tier` field so we know which get landing pages and which are itinerary data.

### Operators (T1 + T2)
Adventure providers, accommodation, food & drink. Quality over quantity — a well-researched listing with 10 fields filled is worth more than 50 stubs.

### Accommodation (T2)
Hotels, hostels, B&Bs, campsites, glamping, bunkhouses — matched to regions and activities.

### Events (T1 + T2)
Races, festivals, competitions, seasonal activities.

### Services (T3)
Gear shops, bike washes, transport, parking — data only, no standalone pages.

## Content Philosophy

### Be Genuinely Useful
Every page should help someone make a decision or plan a trip. If it doesn't, it shouldn't exist.

### Be Honest
"This hike is hard and the weather will probably be terrible" is more useful than "enjoy stunning vistas in all seasons." People trust honesty. Honesty converts.

### Be Local
Generic tourism copy is worthless. Specific, local knowledge is the moat. "Park at the Storey Arms car park, arrive before 8am on weekends or you won't get a space" — that's the content that makes people bookmark the site.

### Be Complete
A half-built itinerary is worse than none. If we recommend a coasteering session in St Davids, we should also know where to eat lunch nearby, where to park, and what to do if the session gets cancelled due to weather.

## Revenue Model

1. **Operator Listings** (Free → Enhanced → Premium)
   - Free: basic listing, appear in directory
   - Enhanced (£9.99/mo): full profile, booking integration, itinerary placement
   - Premium (£29.99/mo): featured placement, priority in itineraries, lead notifications

2. **Affiliate Revenue**
   - Booking.com (accommodation)
   - Trainline (transport)
   - Gear affiliates (Amazon, specialist outdoor retailers)

3. **Enquiry Forwarding**
   - Users enquire about itineraries → leads forwarded to relevant operators
   - Premium operators get instant notification

## Competitive Position

| | Visit Wales | TripAdvisor | Adventure Wales |
|---|---|---|---|
| Activities listed | Generic | User-generated | Curated + verified |
| Trip planning | None | None | Core product |
| Booking | Links out | Links out | Direct + affiliate |
| Local knowledge | Surface level | Review-based | Expert + data-driven |
| Operator tools | None | Claim listing | Full dashboard |

## Technical Principles

- **Data over content**: A well-structured database entry is worth more than a blog post. Everything should be queryable, filterable, and composable into itineraries.
- **Real data only**: Every operator, activity, and POI must be verified against a real source. Track provenance (`data_source`, `last_verified_at`).
- **Progressive enhancement**: Start with what we have, make it useful, then make it better. A stub listing with a Google rating is better than no listing.

## What Success Looks Like

1. Someone Googles "weekend adventure Wales"
2. They land on an itinerary page
3. They customise it (swap activities, pick accommodation, add a castle visit)
4. They book 2-3 things directly through operator links
5. They come back and plan their next trip

The metric that matters: **trips planned and bookings made**, not page views.

---

*Last updated: February 2026*
