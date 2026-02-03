---
name: generate-images
description: Use when generating hero images for Adventure Wales content entities - regions, activities, accommodation, operators, itineraries, or events
---

# Generate Images for Adventure Wales

Batch-fetch images from Unsplash API and download to `public/images/`.

## Unsplash API Key

```
BBqUqpMUJJiKvawiCURPSnrHJmcoajR6ULDyMKzuLu4
```

## Entity Specifications

| Entity | Size | Aspect | Field |
|--------|------|--------|-------|
| regions | 1920x1080 | 16:9 | heroImage |
| activities | 1200x800 | 3:2 | heroImage |
| accommodation | 1200x800 | 3:2 | heroImage |
| operators | 1200x400 | 3:1 | coverImage |
| itineraries | 1920x1080 | 16:9 | heroImage |
| events | 1200x800 | 3:2 | heroImage |

## Workflow

1. **Identify entities needing images** - Check content files in `content/` and data CSVs in `data/wales/`
2. **Build search queries** - Use entity name + context (region, activity type, "Wales" keyword)
3. **Fetch from Unsplash** - Use search API, select best match
4. **Download and resize** - Save to `public/images/{entity-type}/{slug}-hero.jpg`
5. **Track attribution** - Log photographer credits for compliance

## API Usage

### Search endpoint
```bash
curl "https://api.unsplash.com/search/photos?query=QUERY&per_page=5" \
  -H "Authorization: Client-ID BBqUqpMUJJiKvawiCURPSnrHJmcoajR6ULDyMKzuLu4"
```

### Response structure
- `results[].urls.regular` - 1080w image (good for most uses)
- `results[].urls.full` - Full resolution
- `results[].user.name` - Photographer name (REQUIRED for attribution)
- `results[].links.html` - Photo page URL

### Download with resize
Use Unsplash's dynamic resizing:
```
{urls.raw}&w=1920&h=1080&fit=crop&crop=entropy
```

## Search Query Patterns

### Regions
```
"snowdonia mountain landscape dramatic"
"pembrokeshire coast cliffs ocean"
"brecon beacons hills reservoir"
```

### Activities (add action keywords)
```
"zip line adventure quarry"
"coasteering jumping water cliffs"
"mountain biking trail wales"
"hiking summit ridge"
```

### Accommodation
```
"hostel common room mountain view"
"camping tent mountain mist"
"glamping yurt night lights"
```

## File Naming Convention

```
public/images/
  regions/{slug}-hero.jpg        # region-snowdonia-hero.jpg
  activities/{slug}-hero.jpg     # activity-coasteering-hero.jpg
  accommodation/{slug}-hero.jpg
  operators/{slug}-cover.jpg
  itineraries/{slug}-hero.jpg
  events/{slug}-hero.jpg
```

## Attribution (REQUIRED)

Unsplash requires visible credit. Two options:

### Option 1: On-image credit (preferred for hero images)
Display photographer name as overlay text on the image.

### Option 2: Credits page
Link to `/credits` page from footer. Maintain `public/images/attributions.json`:

```json
{
  "regions/snowdonia-hero.jpg": {
    "photographer": "John Smith",
    "photographer_url": "https://unsplash.com/@johnsmith",
    "photo_url": "https://unsplash.com/photos/xxx",
    "downloaded": "2026-02-03"
  }
}
```

### Attribution format (Unsplash guidelines)
```
Photo by [Photographer Name] on Unsplash
```

Where both "Photographer Name" and "Unsplash" are clickable links.

### Triggering download attribution
Per Unsplash API guidelines, trigger the download endpoint when using an image:
```bash
curl "https://api.unsplash.com/photos/{id}/download" \
  -H "Authorization: Client-ID $API_KEY"
```

### PhotoCredit Component
Use the `<PhotoCredit>` component from `src/components/ui/photo-credit.tsx`:

```tsx
import { PhotoCredit } from "@/components/ui/photo-credit";

// Overlay on image (for hero images)
<div className="relative">
  <Image src={...} />
  <PhotoCredit
    photographer="John Smith"
    photographerUrl="https://unsplash.com/@johnsmith"
    photoUrl="https://unsplash.com/photos/xxx"
    position="bottom-left"  // or bottom-right, top-left, top-right
  />
</div>

// Below image (for cards)
<PhotoCredit
  photographer="John Smith"
  variant="below"
/>
```

## Batch Processing Script

Use `scripts/fetch-images.sh` for bulk downloads:

```bash
# Download all region images
./scripts/fetch-images.sh regions

# Download activity type images
./scripts/fetch-images.sh activities

# Download everything
./scripts/fetch-images.sh all

# Single image with custom query
./scripts/fetch-images.sh single "hiking wales summit" public/images/activities/hiking-hero.jpg 1200 800
```

The script:
- Searches Unsplash with provided query
- Downloads and resizes to spec
- Triggers download attribution (Unsplash requirement)
- Updates `public/images/attributions.json` automatically

## Priority Order

1. Regions (11) - Used everywhere
2. Top Activities (20) - Featured content
3. Itineraries (15) - Conversion pages
4. Premium Operators (10)
5. Remaining Activities
6. Accommodation
7. Events
8. Other Operators

## Quality Checklist

- [ ] Welsh location recognizable where possible
- [ ] Works with text overlay (dark areas or gradient-friendly)
- [ ] People in action, not posed stock feel
- [ ] No watermarks
- [ ] Attribution logged
