# Overnight Research Tasks - February 6, 2026

## Mission
Make every Adventure Wales landing page amazing with deep research from Perplexity + Brave Search.

## Tools Available
- **Perplexity API**: (key stored in .env - do not commit keys to repo) (stored in .env)
- **Research utils**: scripts/research-utils.ts
- **Brave Search**: via web_search tool
- **NO image generation** - text content only

## Task 1: Region Pages (11 pages)
Regions to enrich:
- snowdonia, pembrokeshire, brecon-beacons, gower, anglesey
- north-wales, south-wales, mid-wales, wye-valley
- llyn-peninsula, carmarthenshire

For each region, research and update:
- Hero content / introduction
- Key stats and facts
- "Best for" activities list
- Transport & getting there
- Insider tips / local knowledge
- Seasonal guide
- Top experiences / highlights
- FAQs

## Task 2: Activity Hub Pages (priority activities)
Create hub pages like /mountain-biking for:
- /surfing - Big in Wales (Gower, Pembrokeshire, Llŷn)
- /hiking - Massive (Snowdon, Coast Path, Brecon)
- /coasteering - Wales invented it
- /climbing - Snowdonia is legendary
- /kayaking - Sea and river
- /wild-swimming - Growing trend
- /caving - Brecon Beacons caves

Each hub needs:
- Data file: src/data/activity-hubs/[activity].ts
- Page: src/app/[activity]/page.tsx
- Components as needed
- Deep research for every section

## Task 3: Combo Page Enrichment (35 pages)
Existing combo pages need deeper content:
- Better introduction text
- More specific spots with details
- Real local operator names
- Genuine FAQs
- Insider tips
- Transport specifics

## Task 4: Events Expansion
Research and add 50+ family/kids/cultural events:
- Agricultural shows (Royal Welsh, County Shows)
- Food festivals (Abergavenny, etc)
- Christmas markets
- Halloween events
- National Trust Wales events
- Cadw heritage events
- Music festivals
- Family fun days

## Research Guidelines
1. Use Perplexity for comprehensive research queries
2. Use Brave Search for specific facts (prices, hours, etc)
3. Cite sources where useful
4. Be specific - real place names, distances, prices
5. Write like a local, not a tourist board
6. Include genuine insider tips
7. Don't generate images - text only

## Success Criteria
- Every page should feel like it was written by someone who lives there
- Specific, actionable information (not vague platitudes)
- Real operator names, real prices, real tips
- Content that would make a local say "yeah, that's right"
