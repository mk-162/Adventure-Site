# EVENT RESEARCH MEGA BRIEF

## Mission
Deep-dive research to enrich ALL Welsh adventure events with comprehensive, accurate, decision-useful data. Every event should have enough detail that someone can decide whether to enter and what to expect.

---

## Current State
- ~104 events in database
- Many have sparse data: just name, date, location
- Missing: prices, distances, difficulty ratings, what's included, registration deadlines, course maps, previous results, photos

---

## Target Data Fields (per event)

### Core Identity
| Field | Description | Example |
|-------|-------------|---------|
| `name` | Official event name | "Snowdonia Marathon Eryri" |
| `slug` | URL-safe identifier | "snowdonia-marathon-eryri" |
| `type` | Event category | "Trail Running", "MTB Enduro", "Triathlon", "Festival", "Sportive" |
| `category` | Broader category | "race", "festival", "workshop", "family", "competition", "social" |
| `tags` | Searchable tags array | ["trail", "mountain", "marathon", "eryri", "snowdonia"] |

### Dates & Schedule
| Field | Description | Example |
|-------|-------------|---------|
| `dateStart` | Event start date/time | "2026-10-25T09:00:00Z" |
| `dateEnd` | Event end date (if multi-day) | "2026-10-26T18:00:00Z" |
| `monthTypical` | If date varies yearly | "October (TBC)" |
| `isRecurring` | Annual/regular event? | true |
| `recurringSchedule` | Pattern | "Last Saturday of October annually" |
| `registrationOpens` | When entries open | "2026-01-15" |
| `registrationCloses` | Entry deadline | "2026-10-20" |

### Location
| Field | Description | Example |
|-------|-------------|---------|
| `location` | Venue/start point | "Llanberis, Snowdonia" |
| `lat` | Latitude | 53.1191 |
| `lng` | Longitude | -4.1286 |
| `regionId` | Link to regions table | (Snowdonia region ID) |
| `startPoint` | Exact start | "Royal Victoria Hotel car park" |
| `finishPoint` | If different from start | "Same as start" |
| `courseMapUrl` | Link to route/course map | "https://..." |

### Pricing & Entry
| Field | Description | Example |
|-------|-------------|---------|
| `registrationCost` | Entry fee (or range) | "£45-65" |
| `earlyBirdPrice` | Discounted early price | "£40 before June 1" |
| `capacity` | Max entries | 2000 |
| `spotsRemaining` | If available | 342 |
| `ageRange` | Age restrictions | "18+" or "all-ages" |
| `minimumAge` | If specific | 16 |

### Event Details
| Field | Description | Example |
|-------|-------------|---------|
| `description` | Full event description | 2-3 paragraphs, honest tone |
| `distance` | Race distance(s) | "26.2 miles" or "10K / Half / Full" |
| `elevation` | Total climb | "1,500m+" |
| `difficulty` | Our rating | "advanced" |
| `difficultyNotes` | Context | "Technical trails, significant elevation, mountain weather risk" |
| `cutoffTime` | Time limit | "8 hours" |
| `aidStations` | Support info | "5 aid stations with water, gels, medical" |
| `whatIncluded` | Entry includes | ["Medal", "T-shirt", "Post-race food", "Race photos"] |
| `whatToBring` | Required kit | ["Waterproof jacket", "Map", "Whistle", "Emergency food"] |

### Media
| Field | Description | Example |
|-------|-------------|---------|
| `heroImage` | Main event image | High-quality action shot |
| `imageGallery` | Additional images | Array of URLs |
| `videoUrl` | Promo/highlights video | YouTube/Vimeo link |
| `courseProfileImage` | Elevation profile | Image URL |

### Links & Sources
| Field | Description | Example |
|-------|-------------|---------|
| `website` | Official event website | "https://snowdoniamarathon.co.uk" |
| `ticketUrl` | Direct registration link | Entry system URL |
| `facebookUrl` | Event FB page | |
| `instagramHandle` | Instagram | @snowdoniamarathon |
| `stravaSegment` | If applicable | Segment URL |
| `externalSource` | Where we found it | "eventbrite", "runbritain", "manual" |
| `externalId` | ID in source system | |

### Operator/Organizer
| Field | Description | Example |
|-------|-------------|---------|
| `organizerName` | Who runs it | "Always Aim High Events" |
| `organizerWebsite` | Their site | |
| `organizerContact` | Email/phone | |
| `operatorId` | Link to operators table | (if they're a listed operator) |

### Historical Data
| Field | Description | Example |
|-------|-------------|---------|
| `firstYear` | When event started | 1982 |
| `previousWinnerMale` | Last year's winner | "Name - 2:45:32" |
| `previousWinnerFemale` | Last year's winner | "Name - 3:12:18" |
| `averageFinishers` | Typical field size | "1,200 finishers" |
| `resultsUrl` | Link to past results | |

---

## Research Sources (Priority Order)

### Primary Sources (Most Reliable)
1. **Official event websites** — Always check first
2. **Registration platforms** — Eventbrite, SiEntries, Entry Central, Sports Entries
3. **Governing body calendars:**
   - Run Britain (running events)
   - British Triathlon (tri events)
   - British Cycling (cycling events)
   - Trail Running Association
4. **Visit Wales events calendar**
5. **Local authority events listings**

### Secondary Sources
6. **Event Facebook pages** — Often have latest updates
7. **Strava segments/routes** — For course data
8. **Previous year race reports** — Blogs, YouTube, running clubs
9. **Race review sites:**
   - mud-and-mountains.com
   - racechecker.com
   - findmyrace.com
10. **Running/cycling club websites** — Local intel

### Data Verification
- **Cross-reference minimum 2 sources** for prices/dates
- **Check event social media** for most recent updates
- **Look for "2026" in URLs/content** to ensure current year data
- **Note source confidence** if data is uncertain

---

## Research Process (Per Event)

### Step 1: Find Official Source
```
Search: "{event name} 2026 official"
Search: "{event name} registration entries"
Search: "{event name} site:eventbrite.co.uk OR site:sientries.co.uk"
```

### Step 2: Extract Core Data
- Date(s) and time
- Location (get exact start point)
- Entry fee(s)
- Distance(s) offered
- Registration status

### Step 3: Dig Deeper
- Course map/route
- Elevation profile
- Aid station info
- Kit requirements
- Historical results

### Step 4: Find Media
- Official photos from previous years
- YouTube highlight videos
- Course flythrough videos

### Step 5: Verify & Cross-Reference
- Check 2nd source confirms key facts
- Note any discrepancies
- Flag if 2026 dates not confirmed

---

## Quality Standards

### Description Writing
Write in Adventure Wales voice:
- **Honest** — Don't oversell. If it's brutal, say so.
- **Decision-useful** — Help people decide if it's for them
- **Specific** — "1,500m of climbing" not "hilly"
- **Local insight** — Weather tips, parking, nearby cafes

**Example:**
> "The Snowdonia Marathon isn't just a marathon — it's a mountain adventure that happens to be 26.2 miles. Starting and finishing in Llanberis, you'll tackle the Llanberis Pass, drop down to Nant Peris, and loop around the base of Snowdon. With 1,500m of climbing and unpredictable mountain weather, this is NOT a PB course. It's for runners who want a proper challenge and don't mind walking the steep bits. The views are worth every painful step, and the atmosphere in Llanberis at the finish is incredible."

### Required Minimums (Flag if missing)
Every event MUST have:
- [ ] Accurate 2026 date (or "TBC" if not announced)
- [ ] Specific location with coordinates
- [ ] Entry price or "Free"
- [ ] Official website or registration link
- [ ] Event type classification
- [ ] 2-3 sentence description minimum

### Nice to Have (Prioritize)
- [ ] Distance/route details
- [ ] Difficulty rating
- [ ] Hero image
- [ ] Course map
- [ ] What's included

---

## Welsh Event Categories to Cover

### Running
- Trail marathons & ultras
- Fell races
- Road races (10K, half, full)
- Parkruns (mention but don't list individually)
- Cross country

### Cycling
- Sportives
- MTB enduros
- Downhill races
- Gravel events
- Time trials

### Triathlon & Multi-Sport
- Sprint/Olympic/70.3/Ironman
- Swimrun events
- Adventure races
- Duathlons

### Water Sports
- Open water swimming races
- SUP races
- Kayak/canoe events
- Surfing competitions

### Outdoor & Adventure
- Hiking festivals
- Adventure festivals (e.g., Llangollen)
- Outdoor cinema events
- Climbing competitions

### Family & Community
- Charity walks
- Fun runs
- Family adventure days
- Beach events

---

## Output Format

### For Each Event, Provide:

```json
{
  "name": "Event Name",
  "slug": "event-name",
  "status": "published",
  "confidence": "high|medium|low",
  "lastResearched": "2026-02-06",
  "sources": ["https://...", "https://..."],
  
  "type": "Trail Running",
  "category": "race",
  "tags": ["trail", "ultra", "snowdonia"],
  
  "dateStart": "2026-10-25T09:00:00Z",
  "dateEnd": null,
  "monthTypical": "October",
  "isRecurring": true,
  
  "location": "Llanberis, Snowdonia",
  "lat": 53.1191,
  "lng": -4.1286,
  "regionSlug": "snowdonia",
  
  "registrationCost": "£55",
  "capacity": 2000,
  "difficulty": "advanced",
  "ageRange": "18+",
  
  "distance": "26.2 miles",
  "elevation": "1,500m",
  "cutoffTime": "8 hours",
  
  "description": "...",
  
  "website": "https://...",
  "ticketUrl": "https://...",
  "heroImage": "https://...",
  
  "organizerName": "...",
  
  "notes": "2026 date confirmed. Registration opens Jan 15."
}
```

---

## Priority Events (Research First)

### Flagship Events (Must be complete)
1. Snowdonia Marathon Eryri
2. Dragon Ride / L'Etape Wales
3. Wales Coast Path Ultra
4. Red Bull Hardline (if running)
5. Aberystwyth & Borth Triathlon
6. Snowman Triathlon
7. Man vs Mountain
8. Welsh 1000m Peaks Race
9. Coed y Brenin Enduro
10. Cardiff Half Marathon

### High-Profile Events
- Any event with 500+ participants
- Events featured on national calendars
- Events by major organizers (Always Aim High, etc.)

### Regional Anchors
- At least 3 quality events per region
- Cover all activity types per region

---

## Flags for Human Review

Mark events for review if:
- 🟡 Date not confirmed for 2026
- 🟡 Price unclear or variable
- 🟡 Event may be cancelled/postponed
- 🔴 Cannot find official source
- 🔴 Conflicting information between sources
- 🔴 Event appears discontinued

---

## Success Metrics

After research complete:
- [ ] 100% of events have confirmed location + coordinates
- [ ] 95%+ have 2026 dates (or explicit "TBC")
- [ ] 90%+ have entry price
- [ ] 80%+ have description (3+ sentences)
- [ ] 70%+ have hero image
- [ ] 50%+ have difficulty rating
- [ ] All flagship events 100% complete

---

## Deliverables

1. **events-enriched.json** — Full dataset in importable format
2. **events-audit.md** — Summary of data quality + gaps
3. **events-flagged.md** — Events needing human review
4. **events-new.md** — Any new events discovered during research

---

## Notes

- Focus on **2026 events** — Skip historical data for cancelled events
- **Wales-based only** — Events must be in Wales or cross the border (e.g., start in England, finish in Wales)
- **Adventure/outdoor focus** — Skip purely spectator events, galas, etc.
- **Update existing** before adding new — Prioritize enriching current data
- When in doubt, **less is more** — Better to have accurate sparse data than wrong detailed data
