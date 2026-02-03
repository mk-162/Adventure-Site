---
name: generate-images
description: Use when generating images for Adventure Wales - fetching from Openverse (preferred) or Unsplash, downloading Welsh landscapes, activities, or entity hero images
---

# Generate Images for Adventure Wales

Two image sources available:

| Source | License | Rate Limit | Quality | Script |
|--------|---------|------------|---------|--------|
| **Openverse** (preferred) | CC0/BY/BY-SA | None | Good | `fetch_openverse_images.py` |
| Unsplash | Unsplash License | 50/hour | Higher | `fetch_unsplash_images.py` |

## Quick Start

```bash
source .venv/bin/activate

# Welsh landscape library (coastline, forests, lakes, mountains)
python scripts/fetch_openverse_images.py --entity wales --limit 50

# Activity images (5+ per type)
python scripts/fetch_openverse_images.py --entity activities

# Region hero images
python scripts/fetch_openverse_images.py --entity regions
```

## Current Image Library

```
public/images/
  wales/           # 110 Welsh landscapes (mountains, coast, forest, lakes)
  activities/      # 82 activity images (6 per type)
  regions/         # 11 region hero images
  attributions.json  # Full metadata for all images
```

## Openverse Script (Preferred)

`scripts/fetch_openverse_images.py` - No API key needed, no rate limits.

```bash
# Activities
python scripts/fetch_openverse_images.py --entity activities --limit 50

# Regions
python scripts/fetch_openverse_images.py --entity regions

# Welsh landscapes (builds general library)
python scripts/fetch_openverse_images.py --entity wales --limit 100
```

Features:
- CC licensed images (CC0, CC BY, CC BY-SA)
- Full metadata capture (creator, tags, dimensions)
- Welsh region detection from image metadata
- Skips Wikimedia URLs (often 403 blocked)
- Auto-updates `attributions.json`

## Unsplash Script (Higher Quality)

`scripts/fetch_unsplash_images.py` - Better quality but rate limited.

```bash
# Preview mode (generates HTML review page)
python scripts/fetch_unsplash_images.py --entity activities --limit 10

# Apply approved images from preview
python scripts/fetch_unsplash_images.py --apply reports/unsplash_preview_XXXXXX.json

# Reject specific images
python scripts/fetch_unsplash_images.py --apply manifest.json --reject id1,id2
```

API Key (already configured):
```
BBqUqpMUJJiKvawiCURPSnrHJmcoajR6ULDyMKzuLu4
```

## Entity Specifications

| Entity | Size | Aspect | Directory |
|--------|------|--------|-----------|
| regions | 1920x1080 | 16:9 | `regions/` |
| activities | 1200x800 | 3:2 | `activities/` |
| wales (library) | 1024+ | landscape | `wales/` |
| accommodation | 1200x800 | 3:2 | `accommodation/` |
| operators | 1200x400 | 3:1 | `operators/` |
| itineraries | 1920x1080 | 16:9 | `itineraries/` |
| events | 1200x800 | 3:2 | `events/` |

## Attribution Tracking

All images tracked in `public/images/attributions.json`:

```json
{
  "images/wales/snowdonia-wales-fd04b052.jpg": {
    "creator": "Ben124.",
    "creator_url": "https://flickr.com/...",
    "source": "https://flickr.com/photos/...",
    "license": "BY",
    "license_url": "https://creativecommons.org/licenses/by/4.0/",
    "title": "Snowdonia National Park",
    "tags": ["snowdonia", "wales", "mountain"],
    "width": 1024,
    "height": 471,
    "category": "landscape",
    "region": "snowdonia",
    "downloaded": "2026-02-03"
  }
}
```

## PhotoCredit Component

Display attribution using `src/components/ui/photo-credit.tsx`:

```tsx
import { PhotoCredit } from "@/components/ui/photo-credit";

// Overlay on image
<div className="relative">
  <Image src={...} />
  <PhotoCredit
    photographer="Ben124."
    photographerUrl="https://flickr.com/..."
    position="bottom-left"
  />
</div>

// Below image
<PhotoCredit photographer="Ben124." variant="below" />
```

## Search Query Patterns

### Welsh Landscapes
```
"snowdonia wales", "welsh mountains", "pembrokeshire coast",
"brecon beacons", "welsh forest", "wales lake", "cardigan bay"
```

### Activities (action-focused)
```
"coasteering cliff jumping", "mountain biking trail",
"rock climbing outdoor", "sea kayaking coast",
"white water rafting", "hiking mountain summit"
```

## Bash Scripts (Legacy)

Simple bash scripts also available:

```bash
./scripts/fetch-regions.sh     # All 11 regions
./scripts/fetch-activities.sh  # Activity hero images
```

## Quality Checklist

- [x] Welsh location recognizable where possible
- [x] Landscape orientation (aspect > 1.3)
- [x] Minimum 1024px width
- [x] CC or Unsplash licensed
- [x] Full attribution in attributions.json
- [x] Region mapping where detectable
