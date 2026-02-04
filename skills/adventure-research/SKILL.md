---
name: adventure-research
description: Research and populate Welsh adventure operator business data for Adventure Wales directory. Use when gathering operator details, services, pricing, sessions, and contact info from the web.
---

# Adventure Wales Business Research Agent

Research Welsh adventure operators and output structured JSON to populate the Adventure Wales directory.

## Project Context

- **Repo**: `/home/minigeek/Adventure-Site`
- **Stack**: Next.js 16, Drizzle ORM, Neon Postgres
- **Schema**: `src/db/schema.ts` — operators, activities, activityTypes tables
- **Live site**: https://adventure-site-lyart.vercel.app

## Data Model

### Operator Fields (operators table)
```
name, slug, type (primary|secondary), category, website, email, phone,
address, lat, lng, description, tagline, logoUrl, coverImage,
googleRating, reviewCount, tripadvisorUrl, priceRange (£|££|£££|££££),
uniqueSellingPoint, claimStatus (stub), trustSignals (JSONB),
serviceTypes (text[]), regions (text[]), activityTypes (text[])
```

### Activity Fields (activities table)
```
regionId, operatorId, activityTypeId, name, slug, description,
meetingPoint, lat, lng, priceFrom, priceTo, duration, difficulty,
minAge, season, bookingUrl, sourceUrl, status
```

### Service Details (JSONB — stored in operator trustSignals or future serviceDetails field)
Category-specific structured data. See templates below.

## Operator Categories & Research Templates

### activity_provider (Coasteering, Climbing, Kayaking, etc.)
```json
{
  "sessions": [
    { "name": "Half Day Coasteering", "duration": "3h", "times": ["09:30", "14:00"], "groupSizeMin": 4, "groupSizeMax": 12, "priceAdult": 55, "priceChild": 45, "pricePrivate": null }
  ],
  "qualifications": ["AALA Licensed", "BCU Qualified", "MTA Qualified"],
  "equipmentIncluded": ["wetsuit", "helmet", "buoyancy aid"],
  "whatToBring": ["swimwear", "towel", "old trainers"],
  "minAge": 8,
  "fitnessLevel": "moderate",
  "seasons": { "open": "Apr-Oct", "peak": "Jun-Sep" },
  "meetingPoint": "Car park, SA70 7TL",
  "parkingInfo": "Free parking on site",
  "bookingRequired": true,
  "bookingUrl": "https://...",
  "cancellationPolicy": "48h notice for full refund"
}
```

### gear_rental (Bike Hire, Equipment Rental)
```json
{
  "hireItems": [
    { "type": "Mountain Bike", "halfDay": 25, "fullDay": 40, "weekly": 150, "deposit": 50 },
    { "type": "E-Bike", "halfDay": 40, "fullDay": 60, "weekly": 250, "deposit": 100 }
  ],
  "includes": ["helmet", "lock", "repair kit"],
  "deliveryAvailable": true,
  "deliveryArea": "Within 10 miles",
  "sizesAvailable": "XS to XL, kids bikes available",
  "openingHours": { "mon-fri": "09:00-17:30", "sat-sun": "08:00-18:00" }
}
```

### accommodation
Already has its own table — skip unless adding operator-level detail.

### food_drink
```json
{
  "cuisine": ["Welsh", "Pub Food", "Vegetarian Options"],
  "openingHours": { "mon-fri": "12:00-21:00", "sat-sun": "10:00-22:00" },
  "priceRange": "££",
  "dietaryOptions": ["vegetarian", "vegan", "gluten-free"],
  "dogFriendly": true,
  "outdoorSeating": true
}
```

### transport
```json
{
  "services": ["shuttle", "bike transport", "airport transfer"],
  "routes": ["Snowdon Sherpa", "Coastal Bus"],
  "pricing": { "single": 5, "day": 12, "weekly": 35 },
  "schedule": "Hourly 08:00-18:00 (Apr-Oct)"
}
```

## Research Process

For each operator:

1. **Search the web** for the operator name + "Wales" + activity type
2. **Visit their website** — extract:
   - Contact details (phone, email, address)
   - Activity/service list with pricing
   - Session times, durations, group sizes
   - Qualifications and safety credentials
   - Booking URL
   - What's included / what to bring
3. **Check Google Maps** (via Apify if available) for:
   - Google rating + review count
   - Verified address + coordinates
   - Opening hours
   - DO NOT copy Google review text
4. **Check TripAdvisor** for:
   - TripAdvisor URL only (store as link)
   - DO NOT use their Content API or copy reviews
5. **Output structured JSON** matching the templates above

## Data Quality Rules

- **Prices must be current** — check the operator's actual website, not cached/old data
- **Don't fabricate data** — if a field isn't available, leave it null
- **Use GBP (£)** for all pricing
- **Coordinates** — use decimal degrees (e.g., 51.8781, -5.2797)
- **Slugs** — lowercase, hyphenated (e.g., "coasteering-classic")
- **Descriptions** — write original copy, don't plagiarise operator websites

## Legal Boundaries

### ✅ Safe to Do
- Visit operator websites and extract their public business info
- Record Google rating as a number + link to Maps page
- Store TripAdvisor URL as a link-out
- Research qualifications, accreditations from public sources
- Write original descriptions based on research

### ❌ Do Not
- Copy Google review text verbatim
- Copy TripAdvisor review text verbatim
- Use Google Maps Content API data displayed on the site
- Copy operator website copy word-for-word (paraphrase instead)
- Store personal data (individual reviewer names, emails)

## Output Format

Output one JSON file per operator batch:
```json
{
  "operators": [
    {
      "name": "Celtic Quest Coasteering",
      "slug": "celtic-quest-coasteering",
      "category": "activity_provider",
      "website": "https://celticquestcoasteering.com",
      "email": "info@celticquestcoasteering.com",
      "phone": "01348 837337",
      "address": "Abereiddy, Pembrokeshire, SA62 6DT",
      "lat": 51.9327,
      "lng": -5.2032,
      "description": "...",
      "tagline": "...",
      "googleRating": 5.0,
      "reviewCount": 245,
      "tripadvisorUrl": "https://tripadvisor.com/...",
      "priceRange": "££",
      "uniqueSellingPoint": "...",
      "regions": ["pembrokeshire"],
      "activityTypes": ["coasteering"],
      "serviceTypes": ["coasteering", "guided-walks"],
      "trustSignals": { "aala": true, "yearsExperience": 15 },
      "serviceDetails": { ... }
    }
  ],
  "activities": [
    {
      "operatorSlug": "celtic-quest-coasteering",
      "name": "Coasteering Classic",
      "slug": "coasteering-classic",
      "activityType": "coasteering",
      "region": "pembrokeshire",
      "description": "...",
      "priceFrom": 55,
      "priceTo": 55,
      "duration": "3 hours",
      "difficulty": "moderate",
      "minAge": 8,
      "season": "Apr-Oct",
      "bookingUrl": "https://..."
    }
  ]
}
```

## Existing Operators to Research

Check the current database state:
```bash
cd /home/minigeek/Adventure-Site
# List current operators
npx tsx -e "..." # (needs POSTGRES_URL — run on Vercel or with .env.local)
```

Or check the directory page: https://adventure-site-lyart.vercel.app/directory

## Apify Integration (Optional)

If using Apify for Google Maps data:
- Use the Google Maps Scraper actor for business details
- Use only: name, address, coordinates, rating, reviewCount, phone, website, openingHours
- DO NOT extract or store review text
- Cost: ~$0.60 per 1,000 results
- Docs: https://apify.com/compass/crawler-google-places
