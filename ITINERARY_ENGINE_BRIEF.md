# Itinerary Engine — Build Brief

## Vision
The itinerary engine is Adventure Wales' USP. Hour-by-hour trip guides with route maps, wet weather alternatives, budget options, lunch spots, and one-click vendor outreach. Think "Google Maps meets travel guide meets booking platform."

## Phase A: Killer Itinerary Pages (Current Sprint)

### Page Template Requirements

**Hero Section:**
- Full-width region hero image
- Title, tagline, quick facts (duration, difficulty, cost range, best season, group type)
- Three toggle buttons: Standard | 🌧 Wet Weather | 💰 Budget
- [Make It Mine] [Share] [Save] CTAs

**Route Map:**
- Full-width interactive map showing all stops connected by route lines
- Day-colour-coded pins (Day 1 = blue, Day 2 = green, Day 3 = orange, etc.)
- Click pin → scrolls to that stop on the page
- Day selector tabs on the map
- Uses Leaflet + OpenStreetMap (already in stack)

**Hour-by-Hour Timeline (per day):**
```
09:00 ● [Activity Name]
       │ Duration · Price · Ages · Difficulty
       │ 🌧 Alt: [Indoor alternative]
       │ 💰 Alt: [Free/cheap alternative]
       │ [Book] [Map] [More Info]
       │
       ↓ 25min drive via A5
       
12:00 🍽 LUNCH: [Restaurant/Cafe Name]
       │ £8-15pp · "Local tip about this place"
       │ 💰 Alt: Packed lunch at [scenic spot]
       │
       ↓ 15min walk
       
14:00 ● [Next Activity]
       ...
       
17:00 🏠 CHECK IN: [Accommodation Name]
       │ £price/night · Type · Rating
       │ 💰 Alt: [Budget accommodation] (£cheaper)
```

**Cost Breakdown:**
- Side-by-side table: Standard vs Budget
- Categories: Activities, Accommodation, Food, Transport
- Total per person

**Supporting Sections:**
- Packing list (auto-generated from activity types)
- "Know Before You Go" (weather, parking, transport tips)
- Commercial partner cards with booking CTAs
- Related itineraries

### Three View Toggle
Same page, three versions:
1. **Standard** — recommended full-price experience
2. **🌧 Wet Weather** — indoor/covered alternatives, same schedule
3. **💰 Budget** — free/cheap swaps, budget accommodation & food

Toggle swaps the content inline, doesn't reload the page.

---

## Database Schema: `itinerary_stops`

Replaces basic `itinerary_items`. Each stop is a rich data object:

```sql
itinerary_stops
├── id (serial PK)
├── itinerary_id (FK → itineraries)
├── day_number (int)
├── order_index (int)
├── stop_type (enum: activity | food | accommodation | transport | freeform)
│
│  -- Timing
├── start_time (varchar 10) — "09:00"
├── duration (varchar 50) — "2 hours"
├── travel_to_next (varchar 100) — "25min drive via A5"
├── travel_mode (enum: drive | walk | cycle | bus | train | ferry | none)
│
│  -- Primary content
├── title (varchar 255)
├── description (text)
├── activity_id (FK → activities, nullable)
├── accommodation_id (FK → accommodation, nullable)
├── location_id (FK → locations, nullable)
├── operator_id (FK → operators, nullable)
├── cost_from (decimal)
├── cost_to (decimal)
│
│  -- Wet weather alternative
├── wet_alt_title (varchar 255)
├── wet_alt_description (text)
├── wet_alt_activity_id (FK → activities, nullable)
├── wet_alt_cost_from (decimal)
├── wet_alt_cost_to (decimal)
│
│  -- Budget alternative
├── budget_alt_title (varchar 255)
├── budget_alt_description (text)
├── budget_alt_activity_id (FK → activities, nullable)
├── budget_alt_cost_from (decimal)
├── budget_alt_cost_to (decimal)
│
│  -- Food stop details
├── food_name (varchar 255)
├── food_budget (varchar 50) — "£8-15pp"
├── food_link (text)
├── food_notes (text) — "Legendary climbers' cafe"
├── food_type (enum: breakfast | lunch | dinner | snack | pub)
│
│  -- Map
├── lat (decimal 10,7)
├── lng (decimal 10,7)
├── route_to_next_json (jsonb) — [[lat,lng], ...] polyline
│
├── created_at (timestamp)
└── updated_at (timestamp)
```

---

## Content Needed: Itinerary Stubs

We need **50+ itinerary stubs** covering the full range of Welsh adventures. Each stub needs enough metadata to be useful but doesn't need full day-by-day copy yet.

### Stub Format (JSON)
```json
{
  "slug": "snowdonia-adventure-weekend",
  "title": "Snowdonia Adventure Weekend",
  "tagline": "Three days of zip lines, summit hikes, and gorge scrambling",
  "region": "snowdonia",
  "days": 3,
  "difficulty": "moderate",
  "bestSeason": "May-September",
  "groupType": "families, friends",
  "priceFrom": 250,
  "priceTo": 450,
  "budgetPriceFrom": 80,
  "budgetPriceTo": 180,
  "highlights": ["Zip World", "Snowdon summit", "Gorge walking"],
  "activityTypes": ["zip-lining", "hiking", "gorge-walking"],
  "accommodationTypes": ["hostel", "b&b"],
  "stops": [
    {
      "day": 1,
      "time": "09:00",
      "type": "activity",
      "title": "Zip World Fforest Coaster",
      "duration": "2h",
      "cost": "£25-35pp",
      "wetAlt": "Bounce Below (underground trampolines)",
      "budgetAlt": "Walk to Swallow Falls (free)"
    },
    {
      "day": 1,
      "time": "12:30",
      "type": "food",
      "title": "Pete's Eats, Llanberis",
      "cost": "£8-15pp",
      "notes": "Legendary climbers' cafe",
      "budgetAlt": "Packed lunch at Padarn Lake"
    }
  ]
}
```

### Coverage Needed

**By Region:**
- Snowdonia: 12-15 itineraries
- Pembrokeshire: 8-10
- Brecon Beacons: 6-8
- Gower: 4-6
- Anglesey: 3-4
- Mid Wales: 3-4
- Wye Valley: 2-3
- North Wales Coast: 2-3
- South Wales Valleys: 2-3

**By Type:**
- Weekend breaks (2-3 days) — bulk of content
- Day trips (1 day)
- Week-long adventures (5-7 days)
- Activity-specific (MTB week, surf trip, walking week)
- Audience-specific (family, couples, solo, stag/hen, accessible)
- Seasonal (winter, rainy day specials, summer festivals)
- Budget tiers (under £50pp, under £100pp, luxury)

**By Unique Angle:**
- "48 Hours of Adrenaline"
- "Wales Without a Car" (public transport only)
- "Rainy Day Champions" (all-weather trips)
- "Dog-Friendly Adventure Weekend"
- "First-Timer's Wales Sampler"
- "Photography & Adventure"
- "Wild Camping & Wild Swimming"

### Research Tasks for Agents

For each itinerary stub, research agents should:

1. **Verify all activities exist and are currently operating** (check operator websites)
2. **Get current prices** (2025/2026 season)
3. **Find exact meeting points** with GPS coordinates
4. **Identify 2-3 lunch/food options** per day with prices and links
5. **Find wet weather alternatives** for every outdoor stop
6. **Find budget alternatives** for every paid stop
7. **Calculate realistic drive times** between stops
8. **Check accommodation availability** in the right locations
9. **Note any booking requirements** (advance booking, minimum group sizes, age restrictions)
10. **Seasonal availability** — which months each activity runs

### Output Format

Deliver as JSON files in `data/itineraries/` — one file per itinerary:
```
data/itineraries/snowdonia-adventure-weekend.json
data/itineraries/pembrokeshire-coasteering-break.json
...
```

---

## Phase B: User Features (Next)
- Magic link auth (email-based, no passwords)
- "Make It Mine" — fork any itinerary into editable copy
- Drag/drop stop reordering
- Save, name, share link
- Voting (upvote itineraries + rate individual stops)
- User dashboard showing saved/created trips

## Phase C: Commercial Engine (The Business)
- "Book This Trip" — bulk email all operators/accommodation in one click
- Operator dashboard showing incoming leads
- Lead tracking + conversion analytics
- Premium operator tiers (featured placement in itineraries)
- Commission tracking on completed bookings

---

## Tech Stack (existing)
- Next.js 16 + Tailwind CSS v4
- Vercel Postgres (Neon) + Drizzle ORM
- Leaflet + OpenStreetMap for maps
- 318 images already sourced
- 45 activities, 70 accommodation, 63 locations, 46 events in DB
- Tagging system with 52 tags
- All entities geocoded

