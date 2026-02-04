# Microcopy & Local Content System — Plan

## The Problem

The pages are structurally good but editorially flat. They need personality, local knowledge, and the kind of content that makes someone think "these people actually know Wales." That means:

- **Microcopy** — punchy one-liners, tooltips, section intros that add character
- **Local tips** — insider knowledge tagged to specific locations/activities
- **Hot tips** — timely, practical advice ("book 3 weeks ahead in summer")
- **Warnings** — honest "don't do this if..." callouts
- **Fun facts** — engagement hooks that make pages shareable

This content should be **reusable across pages** — a tip about parking at Pen-y-Pass is relevant on the Snowdonia hiking combo page, the Crib Goch best-of entry, the Snowdon activity page, and the Snowdonia region page.

---

## Content Types

### 1. Local Tips (`local_tip`)
Insider knowledge a local would tell a friend.
- "The café at Pen-y-Pass closes at 4pm. Bring your own flask if you're doing a late summit."
- "Park at Nant Peris (free) and take the Sherpa bus up — Pen-y-Pass fills by 7am."
- "The coasteering at Abereiddy is best 2 hours either side of low tide."

### 2. Hot Tips (`hot_tip`)
Timely, practical advice for planning.
- "Book Zip World Velocity at least 2 weeks ahead in summer — it sells out."
- "Check the Mountain Weather Information Service, not BBC Weather — it's mountain-specific."
- "Freshwater West has no lifeguards. Swim between the flags at Newgale instead."

### 3. Warnings (`warning`)
Honest, potentially life-saving advice.
- "Crib Goch kills people every year. Don't attempt it in wind, rain, or if you're not a confident scrambler."
- "Rip currents at Freshwater West are serious. If caught, swim parallel to shore."
- "Mobile signal is patchy across most of Snowdonia. Download offline maps."

### 4. Fun Facts (`fun_fact`)
Shareable, interesting tidbits.
- "Coasteering was invented in Pembrokeshire in the 1980s by TYF Adventure."
- "Snowdon's summit café is the highest building in Wales at 1,085m."
- "The Gower Peninsula was the first place in the UK designated as an Area of Outstanding Natural Beauty."

### 5. Microcopy (`microcopy`)
Short contextual text for UI elements, section headers, buttons, empty states.
- Section intro: "Not just the famous ones — the routes locals actually hike."
- Empty state: "No events listed yet. Know of one? Let us know."
- CTA: "This operator hasn't claimed their listing yet. Are you them?"
- Tooltip: "Difficulty is based on the hardest section, not the average."

### 6. Quotes (`quote`)
From real people, guidebooks, or historical sources.
- "The finest ridge walk in Wales." — Lonely Planet on Crib Goch
- "If you haven't surfed Llangennith, you haven't surfed Wales." — Local saying

---

## Database Schema

### New Table: `content_snippets`

```sql
CREATE TABLE content_snippets (
  id SERIAL PRIMARY KEY,
  
  -- Content
  type VARCHAR(20) NOT NULL,          -- local_tip | hot_tip | warning | fun_fact | microcopy | quote
  content TEXT NOT NULL,               -- The actual text
  attribution VARCHAR(255),            -- Source/author (for quotes)
  
  -- Tagging (all optional — tag to whatever's relevant)
  region_slug VARCHAR(50),             -- Tag to a region (e.g. 'snowdonia')
  activity_type_slug VARCHAR(50),      -- Tag to an activity type (e.g. 'hiking')
  spot_slug VARCHAR(100),              -- Tag to a specific spot (e.g. 'crib-goch')
  operator_slug VARCHAR(100),          -- Tag to an operator
  page_type VARCHAR(30),               -- Where to show: 'combo' | 'best-list' | 'activity' | 'region' | 'operator' | 'itinerary' | 'any'
  placement VARCHAR(30),               -- Where on page: 'hero' | 'intro' | 'sidebar' | 'spot' | 'footer' | 'tooltip' | 'any'
  
  -- Metadata
  season VARCHAR(20),                  -- 'spring' | 'summer' | 'autumn' | 'winter' | 'all'
  priority INTEGER DEFAULT 50,         -- 1-100, higher = show first
  status VARCHAR(20) DEFAULT 'draft',  -- draft | published | archived
  
  -- Audit
  source VARCHAR(100),                 -- Where this info came from
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_snippets_region ON content_snippets(region_slug);
CREATE INDEX idx_snippets_activity ON content_snippets(activity_type_slug);
CREATE INDEX idx_snippets_type ON content_snippets(type);
CREATE INDEX idx_snippets_status ON content_snippets(status);
```

### How Tagging Works

A snippet can be tagged to **any combination** of region, activity type, spot, and operator. This makes it reusable:

| Tag Pattern | Appears On |
|-------------|-----------|
| `region=snowdonia` only | All Snowdonia pages |
| `activity_type=hiking` only | All hiking pages across Wales |
| `region=snowdonia` + `activity_type=hiking` | Snowdonia hiking combo page, best hikes in Snowdonia |
| `spot=crib-goch` | Anywhere Crib Goch appears (combo page spot, best-of entry) |
| `operator=zip-world` | Zip World's operator page |
| No tags + `page_type=any` | Randomly shown anywhere (generic Welsh tips) |

### Query Pattern

To get snippets for a combo page:
```sql
SELECT * FROM content_snippets 
WHERE status = 'published'
  AND (region_slug = $region OR region_slug IS NULL)
  AND (activity_type_slug = $activity OR activity_type_slug IS NULL)
  AND (page_type = 'combo' OR page_type = 'any')
ORDER BY 
  -- Most specific first
  (CASE WHEN region_slug IS NOT NULL AND activity_type_slug IS NOT NULL THEN 3
        WHEN region_slug IS NOT NULL OR activity_type_slug IS NOT NULL THEN 2
        ELSE 1 END) DESC,
  priority DESC
LIMIT 10;
```

---

## UI Components

### TipCard
A styled callout box that drops into any page:

```
┌─ 💡 Local Tip ──────────────────────────────┐
│ Park at Nant Peris (free) and take the       │
│ Sherpa bus up — Pen-y-Pass fills by 7am.     │
└──────────────────────────────────────────────┘
```

Variants by type:
- `local_tip` → 💡 yellow/amber accent
- `hot_tip` → 🔥 orange accent  
- `warning` → ⚠️ red accent
- `fun_fact` → 🎯 blue accent
- `quote` → 💬 slate/italic styling

### Sidebar Widget
A rotating "Did You Know?" widget for sidebars:
```
┌─ Did You Know? ─────────────┐
│ 🎯 Coasteering was invented │
│ in Pembrokeshire in the      │
│ 1980s by TYF Adventure.      │
└──────────────────────────────┘
```

### Inline Tooltip
For inline microcopy (hover/tap):
```
Difficulty: Expert ⓘ
  ↳ "Difficulty is based on the hardest section, not the average."
```

---

## Content Volume Targets

### Phase 1: Core Content (Tier 1 combo pages)
Per combo page: 5-8 snippets minimum
- 2-3 local tips
- 1-2 hot tips
- 1 warning
- 1-2 fun facts

**10 Tier 1 pages × 6 avg = 60 snippets**

### Phase 2: Region + Activity Type Coverage
Per region: 3-5 general snippets
Per activity type: 3-5 general snippets

**12 regions × 4 + 18 activity types × 4 = 120 snippets**

### Phase 3: Spot-Level Detail
Per named spot: 1-2 specific tips

**~80 spots across Tier 1 × 1.5 = 120 snippets**

### Phase 4: Operators & Microcopy
Operator-specific tips + UI microcopy

**~50 snippets**

**Total target: ~350 snippets** to start, growing over time.

---

## Generation Skill

A skill should generate these snippets in bulk, output as JSON, and include source attribution. See `briefs/MICROCOPY-GENERATION-BRIEF.md` for the agent brief.

---

## Integration Points

1. **Combo pages** — show 2-3 tips in sidebar, 1 warning in practical info section, fun facts in intro
2. **Best-of lists** — 1 tip per entry (in the insider tip field — these already exist)
3. **Region pages** — rotating fun facts in hero, local tips in sidebar
4. **Operator pages** — operator-specific tips if tagged
5. **Activity pages** — activity-type tips in sidebar
6. **Itinerary pages** — relevant tips per stop
7. **Homepage** — rotating "Did You Know?" widget

---

## Implementation Order

1. Add `content_snippets` table to schema
2. Build admin CRUD at `/admin/content/snippets`
3. Create `TipCard` and `SidebarWidget` components
4. Generate Phase 1 snippets (60) using the skill
5. Wire into combo pages
6. Generate Phase 2-4 snippets
7. Wire into remaining page types
