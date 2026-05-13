# Content Management Systems — Visual Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADVENTURE WALES CONTENT SYSTEMS              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐        ┌──────────────────────┐
│   FILE-BASED (GIT)   │        │   DATABASE (PG)      │
│  Editorial/SEO-First │        │  Dynamic/User-Gen    │
└──────────────────────┘        └──────────────────────┘
          │                                  │
          │                                  │
    ┌─────┴─────────────┐          ┌────────┴──────────────┐
    │                   │          │                       │
    ▼                   ▼          ▼                       ▼

┌─────────────┐   ┌─────────────┐   ┌──────────┐   ┌──────────┐
│  CONTENT    │   │   DATA      │   │ OPERATORS│   │ ANALYTICS│
│  (MD)       │   │   (CSV/JSON)│   │ (Tables) │   │ (Tables) │
└─────────────┘   └─────────────┘   └──────────┘   └──────────┘

═══════════════════════════════════════════════════════════════════
                     FILE-BASED CONTENT TYPES
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  1. ACTIVITY MEGA PAGES (10)                                    │
│  ────────────────────────────────────────────────────────────── │
│  📁 content/activities/[slug].md                                │
│  🤖 Generator: mega-page-builder                                │
│  📊 Sources: CSV spots + DB operators                           │
│  🎯 SEO Target: "[activity] wales"                              │
│  ────────────────────────────────────────────────────────────── │
│  • coasteering.md     • hiking.md        • wild-swimming.md     │
│  • mountain-biking.md • surfing.md       • caving.md            │
│  • climbing.md        • kayaking.md      • zip-lining.md        │
│  • gorge-walking.md                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  2. REGION PAGES (11)                                           │
│  ────────────────────────────────────────────────────────────── │
│  📁 content/regions/[slug].md                                   │
│  🤖 Generator: aw-deep-research + aw-content-writer             │
│  📊 Sources: DB activities + transport files                    │
│  🎯 SEO Target: "things to do [region]"                         │
│  ────────────────────────────────────────────────────────────── │
│  • snowdonia.md       • brecon-beacons.md  • mid-wales.md       │
│  • pembrokeshire.md   • anglesey.md        • carmarthenshire.md │
│  • gower.md           • llyn-peninsula.md  • wye-valley.md      │
│  • south-wales.md     • north-wales.md                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  3. SPOT PROFILES (170 CSV → 50 MD featured)                    │
│  ────────────────────────────────────────────────────────────── │
│  📁 CSV: content/spots/[activity]/*.csv (bulk data)             │
│  📁 MD:  content/spots/[activity]/[slug].md (Tier 1 only)       │
│  🤖 Generator: adventure-research (CSV) + aw-content-writer (MD)│
│  📊 Tiers: A (8-10) = MD | B (5-7) = CSV | C (1-4) = CSV       │
│  ────────────────────────────────────────────────────────────── │
│  Tier 1 Examples:                                               │
│  • rhossili-bay.md (surfing)    • coed-y-brenin.md (MTB)        │
│  • snowdon.md (hiking)          • blue-lagoon.md (coasteering)  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  4. ITINERARIES (55 JSON stubs → 10+ MD featured)              │
│  ────────────────────────────────────────────────────────────── │
│  📁 JSON: data/itineraries/[slug].json (structured data)        │
│  📁 MD:   content/itineraries/[slug].md (editorial)             │
│  🤖 Generator: generate-itineraries (JSON) + aw-content-writer  │
│  📊 JSON = timeline/costs | MD = narrative + local knowledge    │
│  ────────────────────────────────────────────────────────────── │
│  Coverage by region:                                            │
│  • Snowdonia: 13      • Gower: 5           • Wye Valley: 3      │
│  • Pembrokeshire: 9   • Anglesey: 4        • Multi-region: 5    │
│  • Brecon Beacons: 7  • Mid Wales: 3                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  5. FAQs / ANSWER ENGINE (105+)                                 │
│  ────────────────────────────────────────────────────────────── │
│  📁 content/answers/[slug].md                                   │
│  🤖 Generator: generate-faqs (Python + Gemini + web research)   │
│  📊 Count: 55 region + 50 activity + ongoing                    │
│  🎯 SEO Target: Question keywords + featured snippets           │
│  ────────────────────────────────────────────────────────────── │
│  Patterns:                                                      │
│  • best-adventures-snowdonia.md                                 │
│  • fitness-required-coasteering.md                              │
│  • snowdonia-families-kids.md                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  6. EDITORIAL GUIDES (11 current → 30+ target)                  │
│  ────────────────────────────────────────────────────────────── │
│  📁 content/guides/[slug].md                                    │
│  🤖 Generator: aw-content-writer                                │
│  📊 Types: How-to, Seasonal, Buyer's, Local knowledge           │
│  ────────────────────────────────────────────────────────────── │
│  Examples:                                                      │
│  • first-coasteering-session.md                                 │
│  • best-adventures-by-season.md                                 │
│  • wild-camping-packing-guide.md                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  7. TRANSPORT GUIDES (11 — one per region)                      │
│  ────────────────────────────────────────────────────────────── │
│  📁 content/transport/[region].md                               │
│  🤖 Generator: aw-deep-research                                 │
│  📊 Content: Car, train, bus, car-free, group options           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  8. SAFETY GUIDES (9 current → 10 target)                       │
│  ────────────────────────────────────────────────────────────── │
│  📁 content/safety/[topic].md                                   │
│  🤖 Generator: aw-content-writer                                │
│  📊 Topics: Mountain, water, weather, cycling, beach, etc.      │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
                     DATABASE-DRIVEN CONTENT
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  9. OPERATOR PROFILES (50+ → Database)                          │
│  ────────────────────────────────────────────────────────────── │
│  🗄️ Table: operators                                            │
│  🤖 Research: adventure-research skill                          │
│  📊 Tiers: Stub (free) | Claimed | Enhanced (£10) | Premium (£30│
│  🎯 Claim system: operator_claims, operator_interest tables     │
│  ────────────────────────────────────────────────────────────── │
│  Admin: /admin/operators                                        │
│  Portal: /dashboard/operator/[id]                               │
│  Public: /directory/[slug]                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  10. EVENTS CALENDAR (Database + featured MD)                   │
│  ────────────────────────────────────────────────────────────── │
│  🗄️ Table: events                                               │
│  📁 Featured: content/events/[slug].md                          │
│  🤖 Generator: aw-event-enhancer                                │
│  📊 Types: Races, festivals, competitions, seasonal             │
│  ────────────────────────────────────────────────────────────── │
│  Admin: /admin/events                                           │
│  Public: /events, /events/[slug]                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  11. ACCOMMODATION (Database + CSV import)                      │
│  ────────────────────────────────────────────────────────────── │
│  🗄️ Table: accommodation                                        │
│  📁 Import: content/accommodation/*.csv                         │
│  🤖 Research: aw-deep-research                                  │
│  📊 Links: Booking.com affiliate                                │
│  ────────────────────────────────────────────────────────────── │
│  Admin: /admin/accommodation                                    │
│  Public: /[region]/where-to-stay                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  12. FOOD & DRINK (Via operators table)                         │
│  ────────────────────────────────────────────────────────────── │
│  🗄️ Table: operators (category = food_drink)                   │
│  📊 Types: Pubs, cafes, restaurants, farm shops                 │
│  🎯 Adventure-friendly focus                                    │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
                         WORKFLOW OVERVIEW
═══════════════════════════════════════════════════════════════════

┌────────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   RESEARCH │────▶│ GENERATE │────▶│   QA     │────▶│ PUBLISH  │
└────────────┘     └──────────┘     └──────────┘     └──────────┘
      │                  │                 │                │
      ▼                  ▼                 ▼                ▼
 AI Skills       Python Scripts      Manual        Git Push
 Web Search      AI Generation       Review        Deploy
 Gemini API      Templates          Testing       Build

═══════════════════════════════════════════════════════════════════
                      AUTOMATION SCRIPTS
═══════════════════════════════════════════════════════════════════

✅ EXISTING:
├── scripts/generate-itineraries.py    → 55 JSON itinerary stubs
├── scripts/generate-faqs.py           → 105 FAQ articles
├── scripts/fetch_openverse_images.py  → CC-licensed images
└── scripts/fetch_unsplash_images.py   → High-quality images

🔄 PLANNED:
├── scripts/validate-csv.py            → Check spot CSV schemas
├── scripts/score-content.py           → Completeness scoring
├── scripts/refresh-checker.py         → Flag stale content
├── scripts/link-checker.py            → Find broken links
├── scripts/image-optimizer.py         → Compress/convert images
├── scripts/seo-auditor.py             → Metadata/schema checks
└── scripts/sync-spots-db.py           → CSV → Database sync

═══════════════════════════════════════════════════════════════════
                      CONTENT STATUS FLOW
═══════════════════════════════════════════════════════════════════

   ┌───────┐     ┌────────┐     ┌───────────┐     ┌──────────┐
   │ DRAFT │────▶│ REVIEW │────▶│ PUBLISHED │────▶│ ARCHIVED │
   └───────┘     └────────┘     └───────────┘     └──────────┘
       │                              │                  ▲
       │                              │                  │
       └──────────────┐               │                  │
                      ▼               ▼                  │
                  AI Generate    Manual Edit         Outdated
                  Research       QA Check            (6+ months)

═══════════════════════════════════════════════════════════════════
                        QUALITY SCORING
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  Tier A (8-10) → Full content, featured, own URLs              │
│  Tier B (5-7)  → Listed content, spot cards, grouped           │
│  Tier C (1-4)  → Search only, minimal visibility               │
│                                                                 │
│  Scoring factors:                                               │
│  • Destination worth (0-3)                                      │
│  • Experience quality (0-3)                                     │
│  • Uniqueness (0-2)                                             │
│  • Practical quality (0-2)                                      │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
                      MAINTENANCE SCHEDULE
═══════════════════════════════════════════════════════════════════

📅 QUARTERLY:
   • Update prices, availability, contacts
   • Refresh top-performing content
   • Run CSV validation
   • Check broken links

📅 BIANNUALLY:
   • Review underperforming content
   • Update seasonal information
   • Rewrite weak pages
   • Image optimization pass

📅 ANNUALLY:
   • Strategic content audit
   • Archive stale content
   • Regenerate itinerary JSONs
   • Full SEO review
   • Scoring recalibration

═══════════════════════════════════════════════════════════════════

```

**Quick Reference:**
- **263 total files** in content/
- **27 database tables** in schema
- **12 content systems** defined
- **8 automation scripts** (4 exist, 4 planned)
- **100 Jules sessions/day** available for tasks

**Last Updated:** 2026-05-09
