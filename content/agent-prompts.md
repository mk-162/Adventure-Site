# Agent Task Prompts

Copy-paste these into sub-agent sessions.

---

## Research & write: Stag & Hen in South Wales

```
You are researching "Stag & Hen in South Wales" for Adventure Wales.

Read the deep research skill at /home/minigeek/clawd/skills/aw-deep-research/SKILL.md — follow it exactly.

Research this combo using forum-first approach:
1. Search relevant forums for real user experiences
2. Find 3-5 insider tips for first-timers AND regulars
3. Research specific operators, pricing, and reviews
4. Write a 1,500-2,500 word editorial that passes the "would a local bookmark this?" test
5. Include honest assessments (what's great AND what's not)

Output the enrichment data as JSON to: data/combo-pages/south-wales--stag-hen.json
Follow the ComboPageData TypeScript interface in src/lib/combo-data.ts.

Commit when done: git add -A && git commit -m "research: Stag & Hen in South Wales combo page"
```

---

## Research & write: Stag & Hen in Brecon Beacons

```
You are researching "Stag & Hen in Brecon Beacons" for Adventure Wales.

Read the deep research skill at /home/minigeek/clawd/skills/aw-deep-research/SKILL.md — follow it exactly.

Research this combo using forum-first approach:
1. Search relevant forums for real user experiences
2. Find 3-5 insider tips for first-timers AND regulars
3. Research specific operators, pricing, and reviews
4. Write a 1,500-2,500 word editorial that passes the "would a local bookmark this?" test
5. Include honest assessments (what's great AND what's not)

Output the enrichment data as JSON to: data/combo-pages/brecon-beacons--stag-hen.json
Follow the ComboPageData TypeScript interface in src/lib/combo-data.ts.

Commit when done: git add -A && git commit -m "research: Stag & Hen in Brecon Beacons combo page"
```

---

## Write article: The Ultimate Guide to a Stag Weekend in Wales (2026)

```
Write a journal article for Adventure Wales: "The Ultimate Guide to a Stag Weekend in Wales (2026)"

Read the content writer skill at /home/minigeek/clawd/skills/aw-content-writer/SKILL.md.

Requirements:
- 1,500-2,500 words
- UK English, conversational but informative tone
- Real operator names, real prices, real places
- Include internal links to existing AW pages where relevant
- Schema-ready FAQ section at the end
- Comprehensive guide covering Cardiff, Brecon Beacons, Snowdonia, and Pembrokeshire. Activities, accommodation, nightlife, costs, planning tips.

Output as markdown to: content/articles/stag-weekend-wales-guide-2026.md
Then import to database using the journal import script.
```

---

## Write article: The Ultimate Guide to a Hen Weekend in Wales (2026)

```
Write a journal article for Adventure Wales: "The Ultimate Guide to a Hen Weekend in Wales (2026)"

Read the content writer skill at /home/minigeek/clawd/skills/aw-content-writer/SKILL.md.

Requirements:
- 1,500-2,500 words
- UK English, conversational but informative tone
- Real operator names, real prices, real places
- Include internal links to existing AW pages where relevant
- Schema-ready FAQ section at the end
- Adventure hen parties, spa weekends, city breaks, and coastal retreats. Activities, accommodation, planning tips, themed ideas.

Output as markdown to: content/articles/hen-weekend-wales-guide-2026.md
Then import to database using the journal import script.
```

---

## Write FAQ: How much does a stag weekend in Wales cost?

```
Write an FAQ answer for Adventure Wales: "How much does a stag weekend in Wales cost?"

300-500 words. Include:
- Direct, useful answer in the first paragraph
- Specific prices, operators, locations
- Internal links to relevant AW pages
- End with a call-to-action

Output to: content/answers/stag-weekend-wales-cost.md
```

---

## Write FAQ: Best adventure activities for hen parties in Wales

```
Write an FAQ answer for Adventure Wales: "Best adventure activities for hen parties in Wales"

300-500 words. Include:
- Direct, useful answer in the first paragraph
- Specific prices, operators, locations
- Internal links to relevant AW pages
- End with a call-to-action

Output to: content/answers/best-hen-party-activities-wales.md
```

---

## Enrich operator: adventures-wales

```
Research and enrich the operator at /directory/adventures-wales on Adventure Wales.

Current issues: Operator "Adventures Wales" missing: no cover image, no logo, no phone, no email

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/adventures-wales.json
```

---

## Enrich operator: afan-forest-park

```
Research and enrich the operator at /directory/afan-forest-park on Adventure Wales.

Current issues: Operator "Afan Forest Park" missing: no cover image, no logo, no phone, no email

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/afan-forest-park.json
```

---

## Enrich operator: celtic-trail-shuttle

```
Research and enrich the operator at /directory/celtic-trail-shuttle on Adventure Wales.

Current issues: Operator "Celtic Trail Cycle Shuttle" missing: no cover image, no logo, no coordinates, no Google rating

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/celtic-trail-shuttle.json
```

---

## Enrich operator: cwmcarn-forest

```
Research and enrich the operator at /directory/cwmcarn-forest on Adventure Wales.

Current issues: Operator "Cwmcarn Forest" missing: no cover image, no logo, no phone, no email

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/cwmcarn-forest.json
```

---

## Enrich operator: gethin-woods-bike-park

```
Research and enrich the operator at /directory/gethin-woods-bike-park on Adventure Wales.

Current issues: Operator "Gethin Woods (Bike Park Merthyr)" missing: no cover image, no logo, no phone, no email

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/gethin-woods-bike-park.json
```

---

## Enrich operator: gigrin-farm

```
Research and enrich the operator at /directory/gigrin-farm on Adventure Wales.

Current issues: Operator "Gigrin Farm Red Kite Feeding" missing: no cover image, no logo, no phone, no email

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/gigrin-farm.json
```

---

## Enrich operator: grange-trekking-centre

```
Research and enrich the operator at /directory/grange-trekking-centre on Adventure Wales.

Current issues: Operator "Grange Trekking Centre" missing: no cover image, no logo, no phone, no email

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/grange-trekking-centre.json
```

---

## Enrich operator: heatherton-world-of-activities

```
Research and enrich the operator at /directory/heatherton-world-of-activities on Adventure Wales.

Current issues: Operator "Heatherton World of Activities" missing: no cover image, no logo, no phone, no email

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/heatherton-world-of-activities.json
```

---

## Enrich operator: hells-mouth-surf-school

```
Research and enrich the operator at /directory/hells-mouth-surf-school on Adventure Wales.

Current issues: Operator "Hell's Mouth Surf School" missing: no cover image, no logo, no phone, no email

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/hells-mouth-surf-school.json
```

---

## Enrich operator: hell-s-mouth-surf-school

```
Research and enrich the operator at /directory/hell-s-mouth-surf-school on Adventure Wales.

Current issues: Operator "Hell's Mouth Surf School" missing: no description, no cover image, no logo, no coordinates

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/hell-s-mouth-surf-school.json
```

---

## Enrich operator: llandysul-angling-association

```
Research and enrich the operator at /directory/llandysul-angling-association on Adventure Wales.

Current issues: Operator "Llandysul Angling Association" missing: no cover image, no logo, no phone, no email, no Google rating

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/llandysul-angling-association.json
```

---

## Enrich operator: ll-n-adventures

```
Research and enrich the operator at /directory/ll-n-adventures on Adventure Wales.

Current issues: Operator "Llŷn Adventures" missing: no description, no cover image, no logo, no coordinates

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/ll-n-adventures.json
```

---

## Enrich operator: llyn-adventures

```
Research and enrich the operator at /directory/llyn-adventures on Adventure Wales.

Current issues: Operator "Llŷn Adventures" missing: no cover image, no logo, no phone, no email

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/llyn-adventures.json
```

---

## Enrich operator: ma-simes-surf-hut

```
Research and enrich the operator at /directory/ma-simes-surf-hut on Adventure Wales.

Current issues: Operator "Ma Simes Surf Hut" missing: no cover image, no logo, no coordinates, no Google rating

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/ma-simes-surf-hut.json
```

---

## Enrich operator: paddles-and-pedals

```
Research and enrich the operator at /directory/paddles-and-pedals on Adventure Wales.

Current issues: Operator "Paddles & Pedals" missing: no cover image, no logo, no coordinates, no Google rating

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/paddles-and-pedals.json
```

---

## Enrich operator: pembrokeshire-coastal-bus

```
Research and enrich the operator at /directory/pembrokeshire-coastal-bus on Adventure Wales.

Current issues: Operator "Pembrokeshire Coastal Bus" missing: no cover image, no logo, no coordinates, no Google rating

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/pembrokeshire-coastal-bus.json
```

---

## Enrich operator: taskforce-paintball

```
Research and enrich the operator at /directory/taskforce-paintball on Adventure Wales.

Current issues: Operator "Taskforce Paintball" missing: no cover image, no logo, no phone, no email

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/taskforce-paintball.json
```

---

## Enrich operator: the-fishing-passport

```
Research and enrich the operator at /directory/the-fishing-passport on Adventure Wales.

Current issues: Operator "The Fishing Passport" missing: no cover image, no logo, no coordinates, no phone, no email, no Google rating

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/the-fishing-passport.json
```

---

## Enrich operator: pen-y-gwryd-hotel

```
Research and enrich the operator at /directory/pen-y-gwryd-hotel on Adventure Wales.

Current issues: Operator "The Pen-y-Gwryd Hotel" missing: no cover image, no logo, no coordinates, no Google rating

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/pen-y-gwryd-hotel.json
```

---

## Enrich operator: pinnacle-cafe

```
Research and enrich the operator at /directory/pinnacle-cafe on Adventure Wales.

Current issues: Operator "The Pinnacle Café" missing: no cover image, no logo, no coordinates, no Google rating

Use the adventure research skill at /home/minigeek/clawd/skills/adventure-research/SKILL.md.

Research their website, Google reviews, TripAdvisor, and forums. Fill all missing fields.
Output research data to: data/research/operators/pinnacle-cafe.json
```

---

## Research & write: Stag & Hen in Snowdonia

```
You are researching "Stag & Hen in Snowdonia" for Adventure Wales.

Read the deep research skill at /home/minigeek/clawd/skills/aw-deep-research/SKILL.md — follow it exactly.

Research this combo using forum-first approach:
1. Search relevant forums for real user experiences
2. Find 3-5 insider tips for first-timers AND regulars
3. Research specific operators, pricing, and reviews
4. Write a 1,500-2,500 word editorial that passes the "would a local bookmark this?" test
5. Include honest assessments (what's great AND what's not)

Output the enrichment data as JSON to: data/combo-pages/snowdonia--stag-hen.json
Follow the ComboPageData TypeScript interface in src/lib/combo-data.ts.

Commit when done: git add -A && git commit -m "research: Stag & Hen in Snowdonia combo page"
```

---

## Research & write: Stag & Hen in Pembrokeshire

```
You are researching "Stag & Hen in Pembrokeshire" for Adventure Wales.

Read the deep research skill at /home/minigeek/clawd/skills/aw-deep-research/SKILL.md — follow it exactly.

Research this combo using forum-first approach:
1. Search relevant forums for real user experiences
2. Find 3-5 insider tips for first-timers AND regulars
3. Research specific operators, pricing, and reviews
4. Write a 1,500-2,500 word editorial that passes the "would a local bookmark this?" test
5. Include honest assessments (what's great AND what's not)

Output the enrichment data as JSON to: data/combo-pages/pembrokeshire--stag-hen.json
Follow the ComboPageData TypeScript interface in src/lib/combo-data.ts.

Commit when done: git add -A && git commit -m "research: Stag & Hen in Pembrokeshire combo page"
```

---

## Research & write: Stag & Hen in Gower

```
You are researching "Stag & Hen in Gower" for Adventure Wales.

Read the deep research skill at /home/minigeek/clawd/skills/aw-deep-research/SKILL.md — follow it exactly.

Research this combo using forum-first approach:
1. Search relevant forums for real user experiences
2. Find 3-5 insider tips for first-timers AND regulars
3. Research specific operators, pricing, and reviews
4. Write a 1,500-2,500 word editorial that passes the "would a local bookmark this?" test
5. Include honest assessments (what's great AND what's not)

Output the enrichment data as JSON to: data/combo-pages/gower--stag-hen.json
Follow the ComboPageData TypeScript interface in src/lib/combo-data.ts.

Commit when done: git add -A && git commit -m "research: Stag & Hen in Gower combo page"
```

---

## Research & write: Sea Kayaking in Pembrokeshire

```
You are researching "Sea Kayaking in Pembrokeshire" for Adventure Wales.

Read the deep research skill at /home/minigeek/clawd/skills/aw-deep-research/SKILL.md — follow it exactly.

Research this combo using forum-first approach:
1. Search relevant forums for real user experiences
2. Find 3-5 insider tips for first-timers AND regulars
3. Research specific operators, pricing, and reviews
4. Write a 1,500-2,500 word editorial that passes the "would a local bookmark this?" test
5. Include honest assessments (what's great AND what's not)

Output the enrichment data as JSON to: data/combo-pages/pembrokeshire--sea-kayaking.json
Follow the ComboPageData TypeScript interface in src/lib/combo-data.ts.

Commit when done: git add -A && git commit -m "research: Sea Kayaking in Pembrokeshire combo page"
```

---

## Research & write: Canyoning in Snowdonia

```
You are researching "Canyoning in Snowdonia" for Adventure Wales.

Read the deep research skill at /home/minigeek/clawd/skills/aw-deep-research/SKILL.md — follow it exactly.

Research this combo using forum-first approach:
1. Search relevant forums for real user experiences
2. Find 3-5 insider tips for first-timers AND regulars
3. Research specific operators, pricing, and reviews
4. Write a 1,500-2,500 word editorial that passes the "would a local bookmark this?" test
5. Include honest assessments (what's great AND what's not)

Output the enrichment data as JSON to: data/combo-pages/snowdonia--canyoning.json
Follow the ComboPageData TypeScript interface in src/lib/combo-data.ts.

Commit when done: git add -A && git commit -m "research: Canyoning in Snowdonia combo page"
```

---

## Write article: 10 Adventure Activities for Your Stag/Hen Do in Wales

```
Write a journal article for Adventure Wales: "10 Adventure Activities for Your Stag/Hen Do in Wales"

Read the content writer skill at /home/minigeek/clawd/skills/aw-content-writer/SKILL.md.

Requirements:
- 1,500-2,500 words
- UK English, conversational but informative tone
- Real operator names, real prices, real places
- Include internal links to existing AW pages where relevant
- Schema-ready FAQ section at the end
- Ranked list of the best group adventure activities with operator recommendations, pricing, and group size info.

Output as markdown to: content/articles/adventure-activities-stag-hen-wales.md
Then import to database using the journal import script.
```

---

## Write article: Cardiff vs Snowdonia: Where Should You Plan Your Stag/Hen?

```
Write a journal article for Adventure Wales: "Cardiff vs Snowdonia: Where Should You Plan Your Stag/Hen?"

Read the content writer skill at /home/minigeek/clawd/skills/aw-content-writer/SKILL.md.

Requirements:
- 1,500-2,500 words
- UK English, conversational but informative tone
- Real operator names, real prices, real places
- Include internal links to existing AW pages where relevant
- Schema-ready FAQ section at the end
- Comparison guide: city nightlife + activities vs mountain adventure + lodges. Pros, cons, costs, sample itineraries.

Output as markdown to: content/articles/cardiff-vs-snowdonia-stag-hen.md
Then import to database using the journal import script.
```

---

## Write FAQ: Can you do outdoor activities in Wales in winter?

```
Write an FAQ answer for Adventure Wales: "Can you do outdoor activities in Wales in winter?"

300-500 words. Include:
- Direct, useful answer in the first paragraph
- Specific prices, operators, locations
- Internal links to relevant AW pages
- End with a call-to-action

Output to: content/answers/outdoor-activities-wales-winter.md
```

---

## Write FAQ: Best group accommodation in Wales for stag and hen parties

```
Write an FAQ answer for Adventure Wales: "Best group accommodation in Wales for stag and hen parties"

300-500 words. Include:
- Direct, useful answer in the first paragraph
- Specific prices, operators, locations
- Internal links to relevant AW pages
- End with a call-to-action

Output to: content/answers/group-accommodation-wales-stag-hen.md
```

---

## Write FAQ: Best nightlife in Cardiff for stag parties

```
Write an FAQ answer for Adventure Wales: "Best nightlife in Cardiff for stag parties"

300-500 words. Include:
- Direct, useful answer in the first paragraph
- Specific prices, operators, locations
- Internal links to relevant AW pages
- End with a call-to-action

Output to: content/answers/cardiff-nightlife-stag-parties.md
```

---

## Research & write: Horse Riding in Mid Wales

```
You are researching "Horse Riding in Mid Wales" for Adventure Wales.

Read the deep research skill at /home/minigeek/clawd/skills/aw-deep-research/SKILL.md — follow it exactly.

Research this combo using forum-first approach:
1. Search relevant forums for real user experiences
2. Find 3-5 insider tips for first-timers AND regulars
3. Research specific operators, pricing, and reviews
4. Write a 1,500-2,500 word editorial that passes the "would a local bookmark this?" test
5. Include honest assessments (what's great AND what's not)

Output the enrichment data as JSON to: data/combo-pages/mid-wales--horse-riding.json
Follow the ComboPageData TypeScript interface in src/lib/combo-data.ts.

Commit when done: git add -A && git commit -m "research: Horse Riding in Mid Wales combo page"
```

---

## Research & write: Fishing in Carmarthenshire

```
You are researching "Fishing in Carmarthenshire" for Adventure Wales.

Read the deep research skill at /home/minigeek/clawd/skills/aw-deep-research/SKILL.md — follow it exactly.

Research this combo using forum-first approach:
1. Search relevant forums for real user experiences
2. Find 3-5 insider tips for first-timers AND regulars
3. Research specific operators, pricing, and reviews
4. Write a 1,500-2,500 word editorial that passes the "would a local bookmark this?" test
5. Include honest assessments (what's great AND what's not)

Output the enrichment data as JSON to: data/combo-pages/carmarthenshire--fishing.json
Follow the ComboPageData TypeScript interface in src/lib/combo-data.ts.

Commit when done: git add -A && git commit -m "research: Fishing in Carmarthenshire combo page"
```

---

## Research & write: Wildlife in Pembrokeshire

```
You are researching "Wildlife in Pembrokeshire" for Adventure Wales.

Read the deep research skill at /home/minigeek/clawd/skills/aw-deep-research/SKILL.md — follow it exactly.

Research this combo using forum-first approach:
1. Search relevant forums for real user experiences
2. Find 3-5 insider tips for first-timers AND regulars
3. Research specific operators, pricing, and reviews
4. Write a 1,500-2,500 word editorial that passes the "would a local bookmark this?" test
5. Include honest assessments (what's great AND what's not)

Output the enrichment data as JSON to: data/combo-pages/pembrokeshire--wildlife.json
Follow the ComboPageData TypeScript interface in src/lib/combo-data.ts.

Commit when done: git add -A && git commit -m "research: Wildlife in Pembrokeshire combo page"
```

---

## Write article: Wales Castle Trail: 10 Castles You Can't Miss

```
Write a journal article for Adventure Wales: "Wales Castle Trail: 10 Castles You Can't Miss"

Read the content writer skill at /home/minigeek/clawd/skills/aw-content-writer/SKILL.md.

Requirements:
- 1,500-2,500 words
- UK English, conversational but informative tone
- Real operator names, real prices, real places
- Include internal links to existing AW pages where relevant
- Schema-ready FAQ section at the end
- Curated castle route linking to nearby adventure activities. Cross-sell adventure + heritage.

Output as markdown to: content/articles/wales-castle-trail.md
Then import to database using the journal import script.
```

---

## Write article: Rainy Day Adventures in Wales: 15 Indoor & Sheltered Activities

```
Write a journal article for Adventure Wales: "Rainy Day Adventures in Wales: 15 Indoor & Sheltered Activities"

Read the content writer skill at /home/minigeek/clawd/skills/aw-content-writer/SKILL.md.

Requirements:
- 1,500-2,500 words
- UK English, conversational but informative tone
- Real operator names, real prices, real places
- Include internal links to existing AW pages where relevant
- Schema-ready FAQ section at the end
- Weather backup plans that are actually fun. Underground trampolines, caving, indoor surf, climbing walls, museums.

Output as markdown to: content/articles/rainy-day-adventures-wales.md
Then import to database using the journal import script.
```

---

## Write FAQ: What castles can you visit in Wales?

```
Write an FAQ answer for Adventure Wales: "What castles can you visit in Wales?"

300-500 words. Include:
- Direct, useful answer in the first paragraph
- Specific prices, operators, locations
- Internal links to relevant AW pages
- End with a call-to-action

Output to: content/answers/castles-to-visit-wales.md
```

---

## Write FAQ: Best free things to do in Wales

```
Write an FAQ answer for Adventure Wales: "Best free things to do in Wales"

300-500 words. Include:
- Direct, useful answer in the first paragraph
- Specific prices, operators, locations
- Internal links to relevant AW pages
- End with a call-to-action

Output to: content/answers/free-things-to-do-wales.md
```

---

## Write FAQ: Is Wales good for a family adventure holiday?

```
Write an FAQ answer for Adventure Wales: "Is Wales good for a family adventure holiday?"

300-500 words. Include:
- Direct, useful answer in the first paragraph
- Specific prices, operators, locations
- Internal links to relevant AW pages
- End with a call-to-action

Output to: content/answers/wales-family-adventure-holiday.md
```

