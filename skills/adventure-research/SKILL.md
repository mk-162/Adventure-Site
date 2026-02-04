---
name: adventure-research
description: Research and populate Welsh adventure operator business data for Adventure Wales directory using Gemini API with Google Search grounding. Use when gathering operator details, services, pricing, sessions, and contact info.
---

# Adventure Wales Business Research Agent

Research Welsh adventure operators using **Gemini API with Google Search grounding** and output structured JSON to populate the Adventure Wales directory.

## Environment

Requires `GEMINI_API_KEY` environment variable.

## How It Works

A Python script (`scripts/research-operators.py`) takes an operator from the hitlist, builds a research prompt, and sends it to Gemini 2.0 Flash with Google Search grounding enabled. Gemini searches the web for current business data (prices, contact info, sessions, ratings) and returns structured JSON.

```bash
# Research all tier 1 operators
GEMINI_API_KEY=xxx python scripts/research-operators.py --tier 1

# Research a single operator
GEMINI_API_KEY=xxx python scripts/research-operators.py --single adventure-britain

# Research by region
GEMINI_API_KEY=xxx python scripts/research-operators.py --region pembrokeshire

# Dry run (shows prompts without calling API)
GEMINI_API_KEY=xxx python scripts/research-operators.py --tier 1 --dry-run
```

## Gemini API Setup

Uses `google.genai` SDK (new SDK) with Google Search grounding:

```python
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=prompt,
    config=types.GenerateContentConfig(
        tools=[types.Tool(google_search=types.GoogleSearch())],
        temperature=0.3,  # low temp for factual research
        max_output_tokens=4000,
    )
)
```

Key choices:
- **`google.genai`** (new SDK), not `google.generativeai` (deprecated) — grounding works reliably with this SDK for text/research tasks
- **Google Search grounding** — lets Gemini search operator websites, Google Maps, TripAdvisor for current data
- **Low temperature (0.3)** — we want factual data, not creative writing
- **`gemini-2.0-flash`** — fast, cheap, good at structured extraction

## Research Prompt Template

For each operator, the prompt should include:

```
You are a research assistant gathering business data for Adventure Wales,
an adventure tourism directory for Wales.

OPERATOR TO RESEARCH:
- Name: {name}
- Website: {website}
- Address: {address}
- Category: {category}
- Known activity types: {activityTypes}
- Regions: {regions}

RESEARCH TASKS:
1. Visit their website and extract: contact details (phone, email, full address
   with postcode), all activities/services with current pricing, session times
   and durations, group sizes, minimum ages, qualifications/certifications
   (AALA, BCU, MTA etc), what's included, what to bring, booking URL,
   opening seasons, meeting points, parking info.

2. Find their Google Maps listing: extract the Google rating (number out of 5),
   total review count, and verified address/coordinates. DO NOT copy any
   review text.

3. Find their TripAdvisor page URL. DO NOT copy any review text.

4. Write an original 150-250 word description of the operator. Sound like a
   knowledgeable local guide, not a marketing brochure. Mention what makes
   them different, who they're best for, and any standout experiences.

5. Write a punchy tagline (under 10 words).

6. Identify their unique selling point in one sentence.

OUTPUT FORMAT:
Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{output_template}

RULES:
- All prices in GBP (£)
- Coordinates in decimal degrees (lat ~51-53, lng ~-3 to -5 for Wales)
- If data is not available, use null — NEVER fabricate
- Slugs: lowercase, hyphenated
- Write original descriptions — do not plagiarise
- priceRange: use £ (under £30pp), ££ (£30-60pp), £££ (£60-100pp), ££££ (over £100pp)
```

## Project Context

- **Repo**: Adventure-Site
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

## Operator Categories & Service Detail Templates

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

## Data Quality Rules

- **Prices must be current** — Gemini with grounding searches live websites
- **Don't fabricate data** — if a field isn't available, use null
- **Use GBP (£)** for all pricing
- **Coordinates** — decimal degrees (e.g., 51.8781, -5.2797), validate within Wales range (lat 51-54, lng -6 to -2.5)
- **Slugs** — lowercase, hyphenated (e.g., "coasteering-classic")
- **Descriptions** — write original copy, don't plagiarise operator websites

## Legal Boundaries

### Safe to Do
- Search for and extract public business information via Gemini grounding
- Record Google rating as a number + review count
- Store TripAdvisor URL as a link-out
- Research qualifications, accreditations from public sources
- Write original descriptions based on research

### Do Not
- Copy Google review text verbatim
- Copy TripAdvisor review text verbatim
- Copy operator website copy word-for-word (paraphrase instead)
- Store personal data (individual reviewer names, emails)

## Output Format

One JSON file per batch in `data/research/batch-{n}.json`:
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

## Operator Hitlist

See `references/operator-hitlist.json` for the full list with IDs, names, websites, regions, activity types, and tier assignments.

- **Tier 1**: 8 premium operators (research first)
- **Tier 2**: 27 remaining operators

## Research Order

1. Tier 1 — 8 premium operators (show prominently on site)
2. Tier 2 — 27 operators (fill in order of region coverage)
