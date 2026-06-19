# Microcopy Generation Brief — For Content Agent

## Your Job

Generate local tips, hot tips, warnings, fun facts, and microcopy for Adventure Wales pages. Every snippet must be **specific, actionable, and something a local would actually say**. No generic tourism waffle.

---

## Source of Truth

Before generating anything, read:
- `plans/MICROCOPY-CONTENT-PLAN.md` — the full system plan + DB schema
- The relevant combo page JSON: `data/combo-pages/{region}--{activity}.json`
- The spots within that JSON — they give you specific locations to write about

---

## Content Types to Generate

| Type | Icon | What It Is | Example |
|------|------|-----------|---------|
| `local_tip` | 💡 | Insider knowledge | "The café at Pen-y-Pass closes at 4pm. Bring a flask for late summits." |
| `hot_tip` | 🔥 | Practical planning advice | "Book Zip World 2+ weeks ahead in July/August — sells out daily." |
| `warning` | ⚠️ | Safety / honest caution | "Crib Goch has no escape route once you're on it. Turn back at the pinnacles if conditions deteriorate." |
| `fun_fact` | 🎯 | Interesting / shareable | "Tryfan is the only mountain in Wales you can't walk up — every route requires hands." |
| `microcopy` | 📝 | UI text, section intros | "Not just the famous ones — the routes locals actually hike on their day off." |
| `quote` | 💬 | From a real source | "The finest ridge walk in England and Wales." — Lonely Planet on Crib Goch |

---

## Output Format

Output as a JSON array. Each object:

```json
{
  "type": "local_tip",
  "content": "Park at Nant Peris (free) and take the Sherpa bus to Pen-y-Pass — the car park fills by 7am in summer and costs £10.",
  "attribution": null,
  "region_slug": "snowdonia",
  "activity_type_slug": "hiking",
  "spot_slug": "snowdon-llanberis-path",
  "operator_slug": null,
  "page_type": "combo",
  "placement": "spot",
  "season": "summer",
  "priority": 80,
  "source": "OS Maps + local knowledge + parking signs"
}
```

### Field Rules

| Field | Required | Notes |
|-------|:--------:|-------|
| `type` | ✅ | One of: `local_tip`, `hot_tip`, `warning`, `fun_fact`, `microcopy`, `quote` |
| `content` | ✅ | The actual text. 1-3 sentences max. Be punchy. |
| `attribution` | Only for quotes | "— Lonely Planet", "— Local saying" |
| `region_slug` | If region-specific | Use exact slugs from DB: snowdonia, pembrokeshire, brecon-beacons, gower, anglesey, llyn-peninsula, south-wales, mid-wales, north-wales, wye-valley, carmarthenshire |
| `activity_type_slug` | If activity-specific | Use exact slugs: hiking, surfing, coasteering, climbing, mountain-biking, kayaking, sea-kayaking, zip-lining, wild-swimming, caving, gorge-walking, sup, trail-running, etc. |
| `spot_slug` | If spot-specific | Match the slug from the combo page JSON spots array |
| `operator_slug` | If operator-specific | Match the slug from the operators table |
| `page_type` | ✅ | `combo`, `best-list`, `activity`, `region`, `operator`, `itinerary`, or `any` |
| `placement` | ✅ | `hero`, `intro`, `sidebar`, `spot`, `footer`, `tooltip`, or `any` |
| `season` | ✅ | `spring`, `summer`, `autumn`, `winter`, or `all` |
| `priority` | ✅ | 1-100. Higher = show first. Use 80+ for critical safety warnings. |
| `source` | ✅ | Where you got the info. Be honest. |

---

## Quality Standards

### ✅ Good Snippets
- Specific: names a place, time, price, or measurement
- Actionable: tells you what to DO with the information
- Honest: includes downsides, not just positives
- Local: sounds like advice from someone who lives there
- Verified: the fact is checkable

### ❌ Bad Snippets
- "Bring appropriate clothing" — too vague
- "Wales has beautiful scenery" — says nothing
- "Book in advance during busy periods" — when? how far ahead?
- "Be careful on mountains" — of what? which mountains?

### The Test
Before including a snippet, ask: **"Would someone already standing at this location find this useful?"** If not, it's too vague.

---

## Research Process

For each region × activity combination:

1. **Read the combo page JSON** — understand the spots, the terrain, the operators
2. **Search for practical info:**
   - Parking: prices, capacity, fills-by times, alternatives
   - Weather: microclimate specifics, forecast sources
   - Tides: where relevant (coasteering, surfing, kayaking)
   - Gear: what's essential, what operators provide, where to hire locally
   - Phone signal: dead spots, which networks work
   - Toilets/facilities: where they are (seriously, people need to know)
   - Water: where to refill
3. **Search for local knowledge:**
   - Forum posts (UKClimbing, UKHillwalking, Surfline)
   - Recent TripAdvisor/Google reviews mentioning tips
   - Blog trip reports from the last 2 years
   - Local Facebook groups
4. **Search for fun facts:**
   - Wikipedia for history/geology
   - National park websites
   - Guidebooks (referenced, not copied)
5. **Verify everything** — don't state a price you haven't confirmed, a time you haven't checked

---

## Volume Targets

### Per Combo Page (minimum 6 snippets)
- 2 × `local_tip` (parking, timing, route choice)
- 1 × `hot_tip` (booking, gear, preparation)
- 1 × `warning` (safety, conditions, honest caution)
- 1 × `fun_fact` (history, geology, wildlife, records)
- 1 × `microcopy` (section intro or UI text)

### Per Spot (1-2 snippets)
- 1 × `local_tip` specific to that spot

### Per Region (3-5 general snippets)
- Tips that apply to the whole region regardless of activity

### Per Activity Type (3-5 general snippets)  
- Tips that apply to this activity regardless of region

---

## Delivery

### File Format
Save output as `data/snippets/{region}--{activity}.json` (one file per combo context) or `data/snippets/{region}.json` (for region-general snippets).

```json
{
  "context": {
    "region": "snowdonia",
    "activity": "hiking"
  },
  "generatedAt": "2026-02",
  "snippets": [
    { ... },
    { ... }
  ]
}
```

### Batch Delivery
Deliver in batches matching the combo pages:
1. First: all snippets for the 10 existing Tier 1 combo pages
2. Then: region-general snippets for all 12 regions
3. Then: activity-general snippets for all 18 activity types
4. Then: spot-specific snippets for key locations

---

## Examples — What Good Looks Like

### Snowdonia × Hiking

```json
[
  {
    "type": "local_tip",
    "content": "Pen-y-Pass car park (£10/day) fills by 7am in summer. Use the Sherpa'r Wyddfa bus from Nant Peris (free parking, £5 return bus) — it runs every 15 minutes from 7am.",
    "region_slug": "snowdonia",
    "activity_type_slug": "hiking",
    "spot_slug": null,
    "page_type": "combo",
    "placement": "intro",
    "season": "summer",
    "priority": 90,
    "source": "Gwynedd Council parking info + Sherpa bus timetable 2025"
  },
  {
    "type": "warning",
    "content": "Mountain rescue callouts in Snowdonia average 300+ per year. Most are from people underequipped or caught by weather. Always check MWIS (not BBC Weather) and carry a head torch, map, and spare layers — even in July.",
    "region_slug": "snowdonia",
    "activity_type_slug": "hiking",
    "spot_slug": null,
    "page_type": "combo",
    "placement": "sidebar",
    "season": "all",
    "priority": 85,
    "source": "Llanberis Mountain Rescue annual reports"
  },
  {
    "type": "fun_fact",
    "content": "Snowdon's summit café (Hafod Eryri) is the highest building in Wales and England at 1,085m. It was designed by Ray Hole Architects and opened in 2009 — replacing a building Prince Charles once called 'the highest slum in Wales'.",
    "region_slug": "snowdonia",
    "activity_type_slug": "hiking",
    "spot_slug": "snowdon-llanberis-path",
    "page_type": "any",
    "placement": "any",
    "season": "all",
    "priority": 60,
    "source": "Hafod Eryri Wikipedia + Prince Charles quote (1971)"
  },
  {
    "type": "hot_tip",
    "content": "Download the OS Maps app offline area for Snowdonia before you go. Phone signal is patchy to nonexistent on most mountain routes — EE has the best coverage but still drops out on Crib Goch and the Rhinogs.",
    "region_slug": "snowdonia",
    "activity_type_slug": "hiking",
    "page_type": "combo",
    "placement": "sidebar",
    "season": "all",
    "priority": 75,
    "source": "Ofcom coverage checker + personal experience"
  },
  {
    "type": "local_tip",
    "content": "Pete's Eats in Llanberis is the unofficial climbers' and hikers' canteen — enormous portions, expedition photos on every wall, and you'll overhear more route beta than any guidebook. Get the mega breakfast after a dawn summit.",
    "region_slug": "snowdonia",
    "activity_type_slug": "hiking",
    "spot_slug": null,
    "page_type": "combo",
    "placement": "footer",
    "season": "all",
    "priority": 65,
    "source": "Pete's Eats — local institution, Google 4.4★ (1,200+ reviews)"
  }
]
```

### Pembrokeshire × Surfing

```json
[
  {
    "type": "warning",
    "content": "Freshwater West has strong rip currents and NO lifeguard cover. If you're not an experienced surfer, go to Newgale (lifeguarded May-September) or Whitesands instead. If caught in a rip: don't fight it — swim parallel to shore.",
    "region_slug": "pembrokeshire",
    "activity_type_slug": "surfing",
    "spot_slug": "freshwater-west",
    "page_type": "any",
    "placement": "spot",
    "season": "all",
    "priority": 95,
    "source": "RNLI beach safety reports + Pembrokeshire Council"
  },
  {
    "type": "local_tip",
    "content": "Check Magic Seaweed for Pembrokeshire surf reports, not Surfline — the MSW data is more accurate for this coast. Best swell direction is WSW to W for Freshwater West, SW for Newgale.",
    "region_slug": "pembrokeshire",
    "activity_type_slug": "surfing",
    "page_type": "combo",
    "placement": "intro",
    "season": "all",
    "priority": 80,
    "source": "Magic Seaweed Pembrokeshire page + local surf school advice"
  }
]
```

---

## Remember

1. **Specificity is everything.** Vague tips are worse than no tips.
2. **Cite your sources.** Where did you learn this?
3. **Verify facts.** Don't guess prices, times, or distances.
4. **Be honest.** "This beach is overrated in August" is more valuable than "this beach is amazing."
5. **Think seasonally.** A summer tip is useless in winter. Tag accordingly.
6. **Think about WHO needs this.** A local tip for Crib Goch is useless to a family looking for easy walks.
