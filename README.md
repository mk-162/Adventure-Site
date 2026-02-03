# Adventure Network

Multi-tenant adventure tourism platform. First site: **Adventure Wales**.

## Documentation

- **[Platform Design](docs/PLATFORM_DESIGN.md)** - Complete architecture, database schema, 12 page templates, and Jules spec
- **[France Component Patterns](docs/FRANCE_COMPONENT_PATTERNS.md)** - Reference implementations from Ultimate France

## Seed Data

Wales seed data in `data/wales/`:

| File | Records | Description |
|------|---------|-------------|
| Activities.csv | 78 | Activities and experiences |
| Operators.csv | 36 | Business directory |
| Locations.csv | 64 | POIs with GPS coordinates |
| Accommodation.csv | 71 | Places to stay |
| Events.csv | 48 | Races and events |
| Transport.csv | 64 | Getting there options |
| Commercial Partners.csv | - | Advertising partners |

## Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, Radix UI, Leaflet maps
- **Backend**: Vercel Postgres, Drizzle ORM
- **Content Pipeline**: Gemini 2.0 Flash, Perplexity API

## Architecture Highlights

- **Multi-tenant**: Single codebase, `site_id` scoping, custom domains
- **Partner Tiers**: stub → claimed → premium
- **Ad System**: Direct → Premium operators → Affiliate → Programmatic
- **Service Slots**: Cascading config (global → activity_type → region → location)
- **Status Workflow**: draft → review → published → archived
- **27 database tables**: Core content + commercial + admin

## Getting Started

```bash
npm run dev     # Start dev server at localhost:3000
npm run build   # Production build
```

See [Platform Design](docs/PLATFORM_DESIGN.md) for:
1. Jules scaffolding prompt (complete database schema)
2. Google Stitch prompts (12 mobile-first page templates)
3. CSV import scripts
4. Geocoding scripts
