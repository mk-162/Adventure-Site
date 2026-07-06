---
title: Image Sourcing & Attribution
status: active
date: 2026-07-06
tags: [workflow, images, adventure-wales]
---

# Image Sourcing

How images get onto Adventure Wales legally and credibly. Wrong-country/wrong-activity images were the fastest "this site is junk" signal pre-launch — several region heroes were literally Pacific Northwest / New Zealand. Treat image correctness as content QA, not decoration.

## Hard rules

- **No AI-generated images** for real places, operators, or events. Ever. (AI illustration only for clearly-marked generic atmosphere/placeholders.)
- Image must show the **right place and right activity** — a local should recognise "that's Tryfan". Region heroes must show that exact region.
- Licence must allow commercial use: CC0, CC BY, CC BY-SA, Unsplash/Pexels licences. **Avoid CC BY-NC** (site carries ads/sponsors).
- **Every image gets an entry in `public/images/attributions.json`** — no exceptions, even Unsplash. Fields: creator, creator_url, source, license, license_url, title, region, downloaded date.
- No hotlinking, no Google Maps screenshots, no cropped watermarks, no press images without permission.

## Primary tooling: the `generate-images` skill

Skill at `.claude/skills/generate-images/SKILL.md`. Two scripted sources (run inside `.venv`):

| Source | Script | Notes |
|---|---|---|
| **Openverse** (preferred) | `python scripts/fetch_openverse_images.py --entity {wales\|activities\|regions} [--limit N]` | No key, no rate limit, CC licences, auto-updates attributions.json, skips often-403 Wikimedia URLs |
| Unsplash (higher quality) | `python scripts/fetch_unsplash_images.py --entity … --limit N` then `--apply reports/unsplash_preview_*.json [--reject id1,id2]` | Needs `UNSPLASH_KEY` env, 50/hr; preview→approve→apply flow |

The skill downloads, sizes, stores under `public/images/`, and updates the right DB row for entity heroes.

## Storage & naming conventions

```
public/images/
  wales/          # general Welsh landscape library (e.g. snowdonia-wales-fd04b052.jpg)
  regions/        # region heroes, 1920x1080 (16:9)
  activities/     # activity heroes, 1200x800 (3:2), named {type}-hero.jpg
  operators/      # 1200x400 (3:1)
  accommodation/  # 1200x800
  itineraries/    # 1920x1080
  events/         # 1200x800
  combo/          # {region}-{activity}-hero.jpg, {region}-{activity}-{spot}.jpg
  attributions.json
```

Optimise before commit: min 1024px wide (heroes 1920), landscape orientation, <200KB spots / <400KB heroes, strip EXIF. Display credits with `src/components/ui/photo-credit.tsx`.

## Hero image fallback chain

Where a page gets its hero if the entity has none (logic in `src/lib/activity-images.ts`):

1. Entity's own hero field in the DB (operator / accommodation / region / event record; galleries in `imageGallery`).
2. Attraction-specific image (`src/data/attraction-images.ts`).
3. Activity-type hero `/images/activities/{type}-hero.jpg`, resolved via a slug-alias map (mtb→mountain-biking, canoe→kayaking, zip→zip-lining, walk→hiking, …).
4. Final default: `/images/activities/hiking-hero.jpg`.

So: a missing operator image degrades gracefully — better to leave it empty than publish a wrong or unlicensed one.

## Wider source list (when scripts don't find the shot)

Ranked from `docs/IMAGE-SOURCING-BRIEF.md`:

1. **Visit Wales asset library** (assets.wales.com) and national park press libraries (Eryri, Pembrokeshire Coast, Bannau Brycheiniog) — best heroes; check commercial T&Cs.
2. **Flickr CC** — best for specific named locations and action shots. Filter `&license=4,5,9,10` (BY, BY-SA, CC0, PDM). Search "{spot name}" not "{region}".
3. Unsplash / Pexels / Pixabay — atmosphere and gap-filling.
4. Wikimedia Commons / Geograph — THE shot of a specific named place; check licence per image.
5. Operator-supplied photos — the only good source for niche action shots (coasteering, gorge walking); **get written permission** (email fine). For commercial publications, use a link/source card, never copy the image.

## Quality checklist before using any image

- [ ] Actually the correct Welsh location? Right activity shown?
- [ ] Licence commercial-compatible, attribution recorded?
- [ ] ≥1024px, decent light, no watermark/logo, no identifiable faces without consent?

## Related

- [[pseo-content-strategy]] · [[operator-verification-publishing]] · [[content-expansion]]
