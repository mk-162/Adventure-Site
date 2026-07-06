# Zip World

**Slug:** `zip-world`
**Site:** https://www.zipworld.co.uk
**Snowdonia base:** Penrhyn Quarry (Bethesda), Llechwedd Slate Caverns (Blaenau Ffestiniog), Zip World Fforest (Betws-y-Coed). Additional sites at Tower (Hirwaun, South Wales) and Rhyl (RibRide).
**Tier:** Premium (Tier-1 destination draw per `STRATEGY.md`)

---

## Why this operator matters

Zip World is the single highest-visibility commercial operator in Snowdonia and one of the named reasons international visitors come to Eryri. It anchors three combo pages on the site — zip-lining, underground trampolines, and (indirectly via the Caverns product) caving — and the directory listing for it is among the most-clicked operator pages.

The brand isn't a single venue: it's a portfolio of three distinct Snowdonia sites, each built on the post-industrial reuse of a historic slate quarry (the Slate Landscape of Northwest Wales was inscribed as a UNESCO World Heritage Site in 2021). Treating Zip World as one undifferentiated operator misses the whole story — the page needs the experience breakdown below.

## Experience breakdown — by site

### Penrhyn Quarry, Bethesda

The flagship site, built into the largest slate quarry in the world. Two headline products:

- **Velocity 2** — Europe's fastest zip line. Riders reach approximately 100mph (160km/h) on a 1.5km cable that flies over a flooded slate quarry. Booked in single or tandem ride slots; weight and weather restrictions apply (verify current limits with the operator). This is the "front cover" Zip World experience.
- **Quarry Karts** — gravity-powered, three-seat karts on a custom track through the quarry workings. Family-graded, runs alongside Velocity 2.

### Llechwedd Slate Caverns, Blaenau Ffestiniog

Built into and underneath the 1846 Llechwedd slate workings:

- **Bounce Below** — giant nets and trampolines suspended at multiple levels inside a 176-year-old chamber, lit with coloured floods. One of the most photographed adventure experiences in Wales and the anchor of the [underground trampolines combo](/snowdonia).
- **Caverns (the underground zip / rope-bridge circuit)** — a multi-element underground course through the cavern system: zip lines, rope bridges, drops and tunnels. Different product from Bounce Below; often booked together as a half-day.
- **Titan / Titan 2** — multi-zip course on the surface above Llechwedd. Riders fly across the slate quarry workings on long parallel cables.
- **Skyride** — currently listed as "permanently closed" on the operator site; flag for editor verification before any directory page mentions it.

### Zip World Fforest, Betws-y-Coed

The family / treetop site, set in mature forest near Betws-y-Coed:

- **Plummet 2** — vertical free-fall drop tower. Newer Fforest addition — verify current operational status.
- **Treetop Nets** — suspended forest-canopy nets, the family-graded sibling of Bounce Below.
- **Skyride / Tower Coaster / Forest Coaster** — additional smaller-scale family rides; verify the current product list against the operator's site (the Fforest product mix has moved year-on-year).

## Durable framing facts (safe to use without re-verification)

- World's largest slate quarry (Penrhyn) as the Velocity 2 venue
- Slate Landscape of Northwest Wales — UNESCO World Heritage Site inscribed 2021 (covers Llechwedd, Penrhyn, Dinorwig and the wider Gwynedd slate region)
- Llechwedd Slate Caverns — original 1846 workings, in continuous use as a heritage / adventure site since the 1970s
- "World's fastest zip line" is misleading per the current repo region data (`data/regions/snowdonia.ts`) — Velocity 2 is **Europe's fastest** at ~100mph. Use the European framing; the global claim has been overtaken.

## Verification flags (re-check before any launch copy)

- Current Velocity 2 weight limits and tandem availability
- Current Bounce Below height / age restrictions (changes have been made historically for safety)
- Whether Skyride is still permanently closed or has been replaced
- Current Fforest product list (the venue has expanded and contracted year-on-year)
- Pricing — moves seasonally and by site; never hard-code in the operator page

## Pairing notes

- **Itinerary anchor for the zip-lining combo** ([Zip Lining in Snowdonia](/snowdonia)) — Penrhyn is the morning Velocity 2 slot; Llechwedd is the afternoon underground product set.
- **Bounce Below + Llechwedd Deep Mine tour** makes a half-day for visitors who want some heritage with their adventure. The Deep Mine is run by the cavern operators, not Zip World — separate ticket.
- **Wet-weather backup** — most Zip World products run regardless of rain (Velocity 2 closes only in high wind / lightning), which makes Zip World the natural rainy-day alternative when the mountains are washed out.
- **Geography note** — the three Snowdonia sites are 30-45 minutes apart by car. Plan one site per half-day, not three in a day.

## Hero image / media brief

- **Cover image (hero)**: action shot on Velocity 2 with the slate quarry visible behind. Penrhyn Quarry is the most recognisable backdrop. Sourcing: prefer Zip World's own press library (licence required) over Openverse / Unsplash for an operator at this tier; flag for editor.
- **Gallery**: Bounce Below interior (the floodlit chamber shot), Caverns underground rope bridge, Quarry Karts in motion.
- **Logo**: existing Vercel Blob logo at `https://garbmipansiok1l0.public.blob.vercel-storage.com/operators/zip-world/logo.png` (verified present in `content/operators.csv`).

## Internal links that should reference this operator

- `/snowdonia/things-to-do/zip-lining` (already cites Zip World in intro)
- `/snowdonia/things-to-do/underground-trampolines` (already anchored on Bounce Below)
- `/snowdonia/things-to-do/caving` (Caverns + Bounce Below mentioned in intro and spots)
- `/snowdonia` region page (cited as Tier-1 draw)
