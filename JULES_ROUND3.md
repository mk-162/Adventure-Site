# Jules Round 3 — Partner Integrations & Weather

## Overview

We have partner integration plans ready. Jules needs to build the UI components and page integrations for:
1. Met Office weather widgets
2. Booking.com accommodation affiliate integration
3. Gear guide / product recommendation components
4. Itinerary page enhancements for new 54 itineraries

---

## Task 1: Weather Widget (Met Office DataPoint)

### 1.1 Weather API Route
```
Create src/app/api/weather/route.ts

- GET /api/weather?lat=52.9&lng=-3.9 → returns weather data
- Use Met Office DataPoint API (free): https://www.metoffice.gov.uk/datapoint
- If no API key available yet, create a mock/fallback that returns realistic Welsh weather data
- Cache responses for 30 minutes using simple in-memory cache
- Return: { current: { temp, feelsLike, windSpeed, humidity, icon, description }, forecast: [{ date, high, low, icon, rain%, description }] }
- Map Met Office weather codes to simple icons: sun, cloud, rain, storm, snow, fog, partly-cloudy
```

### 1.2 WeatherWidget Component
```
Create src/components/weather/WeatherWidget.tsx

Client component that fetches from /api/weather and displays:
- Current conditions: temperature, icon, description, wind speed
- 5-day forecast row: date, icon, high/low temps
- "Best for:" text suggesting activities based on weather
  - Sunny + calm → "Great day for coasteering, hiking, kayaking"
  - Rainy → "Perfect for indoor climbing, caving, museums"  
  - Windy → "Check with operators for water activities"
- Activity weather suitability icons

Design:
- Compact card design, fits in a sidebar or inline
- Brand colors: primary #1e3a4c, accent #f97316
- Weather icons: use emoji or lucide-react (Sun, Cloud, CloudRain, Wind, Snowflake, CloudFog)
- Responsive: horizontal on desktop, stacked on mobile

Props:
- lat: number
- lng: number  
- regionName: string
- compact?: boolean (for sidebar use)
```

### 1.3 ActivityWeatherAlert Component
```
Create src/components/weather/ActivityWeatherAlert.tsx

Shows a banner on activity pages with weather-relevant info:
- If rain forecast: "🌧️ Rain expected — consider the wet weather alternative"
- If high winds: "💨 High winds forecast — check with operator before booking water activities"
- If great weather: "☀️ Perfect conditions for outdoor activities this week!"
- If cold: "🧊 Cold snap — pack extra layers"

Props:
- lat: number
- lng: number
- activityType: string (e.g., "coasteering", "hiking")

Uses the /api/weather endpoint. Shows nothing if weather is neutral.
```

### 1.4 Integrate Weather Into Pages
```
Add WeatherWidget to:

1. src/app/[region]/page.tsx — Region hub pages
   - Add below hero section, above activities
   - Use region's lat/lng coordinates
   - Full size widget

2. src/app/itineraries/[slug]/page.tsx — Itinerary detail pages
   - Add compact weather widget in the sidebar (right column)
   - Use the itinerary region's coordinates

3. src/app/activities/[slug]/page.tsx — Activity detail pages
   - Add ActivityWeatherAlert banner below the hero
   - Use activity's lat/lng if available, otherwise region's
```

---

## Task 2: Booking.com Affiliate Widgets

### 2.1 BookingWidget Component
```
Create src/components/partners/BookingWidget.tsx

Shows a Booking.com search/affiliate widget for accommodation:

Two variants:
A) Search Widget — destination search box
   - Pre-filled destination (e.g., "Snowdonia, Wales")
   - Check-in / check-out date pickers
   - Guests selector
   - "Search Hotels" button → opens Booking.com with affiliate tag
   - Uses Booking.com affiliate deep link format:
     https://www.booking.com/searchresults.html?aid={AFFILIATE_ID}&dest_type=region&dest_id={DEST_ID}&checkin={date}&checkout={date}

B) Property Card — featured accommodation with affiliate link
   - Property image (from our DB or placeholder)
   - Name, rating, price range
   - "View on Booking.com" button with affiliate link
   - "Check Availability" CTA

Props:
- variant: "search" | "property"
- destination?: string
- affiliateId?: string (default from env: NEXT_PUBLIC_BOOKING_AFFILIATE_ID)
- propertyName?: string
- propertyUrl?: string
- className?: string

Design:
- Clean card with subtle Booking.com attribution ("Powered by Booking.com" small text)
- Brand aligned: our card style, not Booking.com's branding
- Orange CTA button matching our accent color
```

### 2.2 Integrate Into Accommodation Pages
```
Modify src/app/accommodation/[slug]/page.tsx

Add BookingWidget at the bottom of accommodation detail pages:
- If accommodation has a bookingUrl → show "property" variant linking to it
- Always show "search" variant for the region as fallback
- Add below the main content, above footer

Also modify src/app/[region]/where-to-stay/page.tsx:
- Add BookingWidget "search" variant at the top, pre-filled with region name
- "Can't find what you're looking for? Search more options on Booking.com"
```

---

## Task 3: Gear Guide Components

### 3.1 GearRecommendation Component
```
Create src/components/partners/GearRecommendation.tsx

Shows activity-specific gear recommendations:
- Title: "What to Bring" or "Essential Gear"
- List of gear items with:
  - Item name
  - Why you need it (one line)
  - Optional affiliate link (Amazon Associates)
  - Icon (from lucide-react)

Props:
- activityType: string
- items?: GearItem[] (override default recommendations)

Default gear lists by activity type:
- hiking: boots, waterproof jacket, backpack, water bottle, map
- coasteering: provided by operator (note this)
- surfing: wetsuit (often provided), sunscreen, towel
- climbing: helmet (often provided), shoes, chalk bag
- mountain-biking: helmet, gloves, padded shorts, repair kit
- kayaking: provided by operator, dry bag, sunscreen
- camping: tent, sleeping bag, mat, headtorch, stove

Design:
- Compact checklist style
- Each item has a checkbox icon (unchecked — for user to mentally tick)
- Small "Shop gear →" link at bottom (placeholder for now)
```

### 3.2 PackingList Component  
```
Create src/components/itinerary/PackingList.tsx

Displays the packing essentials from itinerary JSON data.
Currently the itinerary description contains packing info in markdown,
but the raw JSON has a structured `packingEssentials` array.

Props:
- items: string[]
- activityTypes?: string[] (to show gear-specific tips)

Design:
- Collapsible section: "📋 Packing List" header, expandable
- Checklist with toggle-able items
- "Based on activities in this itinerary"
- Print-friendly

Add to src/app/itineraries/[slug]/page.tsx below the ItineraryView
```

---

## Task 4: Itinerary Listing Page Upgrade

### 4.1 Upgrade Itinerary Cards
```
We now have 54+ itineraries in the DB. The listing page at src/app/itineraries/page.tsx 
needs to handle this volume well.

Modify src/components/itineraries/ItineraryDiscovery.tsx:
- Add region filter tabs (All, Snowdonia, Pembrokeshire, Brecon Beacons, etc.)
- Add difficulty filter (Easy, Moderate, Challenging)
- Add duration filter (Day Trip, Weekend, 3-5 Days, Week+)
- Add group type tags (Family, Couples, Solo, Friends, Stag/Hen)
- Show result count: "Showing 13 of 54 itineraries"
- Load more / pagination if >12 results

Modify src/components/cards/itinerary-card.tsx:
- Show region badge
- Show difficulty badge with color coding
- Show duration (X days)
- Show price range (From £X)
- Show highlights as small tags
```

### 4.2 Itinerary Static Params
```
Modify src/app/itineraries/[slug]/page.tsx

Currently generateStaticParams only returns "ultimate-north-wales-weekend".
Update to query ALL published itineraries from the DB:

export async function generateStaticParams() {
  const itineraries = await getAllItineraries(); // need this query
  return itineraries.map(i => ({ slug: i.slug }));
}

Add getAllItineraries() to src/lib/queries.ts if it doesn't exist.
This will generate static pages for all 54+ itineraries.
```

---

## Design System Reminder

- **Primary:** #1e3a4c (dark teal)
- **Accent:** #f97316 (orange)
- **Font:** System/Inter
- **Icons:** lucide-react
- **Framework:** Next.js 15, TypeScript, Tailwind CSS
- **DB:** Drizzle ORM + Vercel Postgres
- **Mobile-first** responsive design

## Build Verification

After each task, run:
```bash
npm run build
```
Ensure zero errors before moving to next task.
