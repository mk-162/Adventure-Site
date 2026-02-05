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

## What Goes In The Database

### Adventure Activities (core)
Coasteering, climbing, kayaking, surfing, mountain biking, hiking, caving, gorge walking, wild swimming, paddleboarding, horse riding, fishing, zip-lining, etc.

### Points of Interest (essential for trip planning)
- **Heritage & Culture**: Castles, ruins, historic houses, museums, galleries
- **Natural Landmarks**: Waterfalls, viewpoints, scenic walks, lakes, beaches
- **Food & Drink**: Pubs, restaurants, cafes — especially adventure-friendly ones (dog-friendly, muddy boots welcome, drying rooms, bike racks)
- **Attractions**: Adventure parks, gardens, markets, craft centres
- **Practical**: Bike washes, gear shops, outdoor stores, pharmacies near remote areas

### Accommodation
Hotels, hostels, B&Bs, campsites, glamping, bunkhouses — matched to regions and activities.

### Events
Races, festivals, competitions, seasonal activities.

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
