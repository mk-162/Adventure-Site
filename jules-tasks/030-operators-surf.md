# Task: Surf Schools & Operators Research

## Objective
Research and document ALL surf schools, SUP operators, and surf coaching businesses in Wales.

## Output
Create/update: `content/operators/surf.csv`

## Operators to Find
Search for all surf-related businesses across:
- Gower Peninsula (Llangennith, Caswell, Langland)
- Pembrokeshire (Newgale, Freshwater West, Whitesands)
- Llŷn Peninsula (Hell's Mouth, Abersoch)
- South Wales (Porthcawl, Rest Bay)
- Anglesey (Rhosneigr)

Include:
- Surf schools (lessons, camps)
- SUP schools and hire
- Surf coaching (performance)
- Surf hire only
- Surf camps/holidays
- Adaptive/accessible surfing

## CSV Schema

```csv
slug,name,type,region_base,regions_served,activities,address,lat,lon,phone,email,website,instagram,facebook,price_lesson_from,price_hire_from,booking_url,spots_served,group_max,min_age,wetsuit_included,board_included,specialties,established_year,qualifications,description,quality_score,tier,source_urls
```

## Field Definitions

| Field | Type | Example |
|-------|------|---------|
| slug | string | `llangennith-surf-school` |
| type | string | `surf-school`, `sup-school`, `hire`, `coaching`, `camp` |
| regions_served | string | Comma-separated regions they operate in |
| activities | string | `surfing,sup,bodyboarding,coasteering` |
| price_lesson_from | string | `£35` (lowest lesson price) |
| price_hire_from | string | `£15/2hrs` (lowest hire price) |
| spots_served | string | Beach slugs where they operate |
| specialties | string | `kids,women-only,adaptive,performance,camps` |
| qualifications | string | `ISA,Surfing England,BSUPA` |

## Quality Scoring

Score 1-10 based on:
- **Reputation (0-4):** Reviews, longevity, qualifications
- **Offering (0-3):** Range of services, equipment quality
- **Accessibility (0-3):** Booking ease, communication, flexibility

Tier A = Established, excellent reviews, broad offering
Tier B = Solid operator, good reviews
Tier C = Basic or new, limited info

## Research Approach

1. Google search: "surf school [location] wales"
2. Check TripAdvisor activities
3. Instagram/Facebook for active operators
4. Surf school aggregators (Surfing England directory)
5. Local tourism sites

## Data to Verify
- [ ] Website is live and current
- [ ] Phone number is valid format
- [ ] Address plots correctly
- [ ] Prices are current (check website)
- [ ] Social links work

## Description Guidelines
Write 80-120 words covering:
- What they're known for
- Who they suit best
- Any standout features
- Honest assessment

**Good example:**
> "Llangennith Surf School has been running lessons from the beach since 2003 - one of Gower's longest-established schools. They operate from the main beach car park with equipment storage on-site. Lessons run on the gentler middle section of the beach, away from the more advanced north end. Good for families and beginners. Group sizes can be large in summer (up to 8:1) - book private if you want more attention."

## Target
25-35 operators across all Welsh surf regions
