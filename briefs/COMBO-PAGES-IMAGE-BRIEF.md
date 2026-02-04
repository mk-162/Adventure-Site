# Image Brief — Activity + Region Combo Pages & Best-Of Lists

> **For:** Image sourcing agent  
> **Project:** Adventure Wales (`/home/minigeek/Adventure-Site`)  
> **Date:** February 2026  
> **Priority:** Tier 1 combo pages first, then Tier 1 best-of lists

---

## 1. What You're Supplying Images For

Two types of pages, both needing dedicated image sets:

### A) Combo Pages (Activity + Region hubs)
URL: `/{region}/things-to-do/{activity}`  
Example: `/snowdonia/things-to-do/hiking`

**Per page:**
| Image Type | Count | Dimensions | Max Size | Purpose |
|-----------|-------|------------|----------|---------|
| Hero | 1 | 1920×1080 | 400KB | Full-width header, the money shot |
| Spot/route images | 5–10 | 1200×800 | 200KB | One per featured spot in the guide |
| Gallery images | 6–10 | 1200×800 | 200KB | Mixed content grid |

### B) Best-Of List Pages
URL: `/{region}/best-{activity}`  
Example: `/snowdonia/best-hikes`

**Per page:**
| Image Type | Count | Dimensions | Max Size | Purpose |
|-----------|-------|------------|----------|---------|
| Hero | 1 | 1920×1080 | 400KB | The #1 pick in all its glory |
| Entry images | 7–15 | 1200×800 | 200KB | One per ranked entry |

---

## 2. Tier 1 — Do These First (10 Combos + 10 Best-Of Lists)

### Combo Pages

| # | File slug | Region | Activity | Hero image path |
|---|----------|--------|----------|----------------|
| 1 | `snowdonia--hiking` | Snowdonia | Hiking | `/images/combo/snowdonia-hiking-hero.jpg` |
| 2 | `pembrokeshire--surfing` | Pembrokeshire | Surfing | `/images/combo/pembrokeshire-surfing-hero.jpg` |
| 3 | `pembrokeshire--coasteering` | Pembrokeshire | Coasteering | `/images/combo/pembrokeshire-coasteering-hero.jpg` |
| 4 | `snowdonia--climbing` | Snowdonia | Climbing | `/images/combo/snowdonia-climbing-hero.jpg` |
| 5 | `gower--surfing` | Gower | Surfing | `/images/combo/gower-surfing-hero.jpg` |
| 6 | `snowdonia--zip-lining` | Snowdonia | Zip Lining | `/images/combo/snowdonia-zip-lining-hero.jpg` |
| 7 | `brecon-beacons--hiking` | Brecon Beacons | Hiking | `/images/combo/brecon-beacons-hiking-hero.jpg` |
| 8 | `snowdonia--mountain-biking` | Snowdonia | Mountain Biking | `/images/combo/snowdonia-mountain-biking-hero.jpg` |
| 9 | `pembrokeshire--kayaking` | Pembrokeshire | Kayaking | `/images/combo/pembrokeshire-kayaking-hero.jpg` |
| 10 | `snowdonia--gorge-walking` | Snowdonia | Gorge Walking | `/images/combo/snowdonia-gorge-walking-hero.jpg` |

### Best-Of Lists

| # | File slug | Hero image path |
|---|----------|----------------|
| 1 | `snowdonia--best-hikes` | `/images/best-lists/snowdonia-best-hikes-hero.jpg` |
| 2 | `snowdonia--best-walks` | `/images/best-lists/snowdonia-best-walks-hero.jpg` |
| 3 | `pembrokeshire--best-beaches` | `/images/best-lists/pembrokeshire-best-beaches-hero.jpg` |
| 4 | `pembrokeshire--best-surf-spots` | `/images/best-lists/pembrokeshire-best-surf-spots-hero.jpg` |
| 5 | `brecon-beacons--best-walks` | `/images/best-lists/brecon-beacons-best-walks-hero.jpg` |
| 6 | `snowdonia--best-scrambles` | `/images/best-lists/snowdonia-best-scrambles-hero.jpg` |
| 7 | `gower--best-beaches` | `/images/best-lists/gower-best-beaches-hero.jpg` |
| 8 | `pembrokeshire--best-coasteering` | `/images/best-lists/pembrokeshire-best-coasteering-hero.jpg` |
| 9 | `snowdonia--best-mountain-bike-trails` | `/images/best-lists/snowdonia-best-mountain-bike-trails-hero.jpg` |
| 10 | `anglesey--best-beaches` | `/images/best-lists/anglesey-best-beaches-hero.jpg` |

**Estimated total for Tier 1: ~290 images** (10 combo pages × ~17 avg + 10 best-of lists × ~12 avg)

---

## 3. File Naming & Folder Structure

All images go under `public/images/` in the repo.

### Combo Pages
```
public/images/combo/
  {region}-{activity}-hero.jpg                    ← hero
  {region}-{activity}-{spot-slug}.jpg             ← per spot
  {region}-{activity}-{nn}-{8char-hash}.jpg       ← gallery
```

**Examples:**
```
snowdonia-hiking-hero.jpg
snowdonia-hiking-llanberis-path.jpg
snowdonia-hiking-crib-goch.jpg
snowdonia-hiking-tryfan-north-ridge.jpg
snowdonia-hiking-01-a3f8b2c1.jpg          ← gallery
snowdonia-hiking-02-7d4e9f32.jpg          ← gallery
```

### Best-Of Lists
```
public/images/best-lists/
  {region}-best-{slug}-hero.jpg                   ← hero
  {region}-best-{slug}-{entry-slug}.jpg           ← per ranked entry
```

**Examples:**
```
snowdonia-best-hikes-hero.jpg
snowdonia-best-hikes-crib-goch.jpg
snowdonia-best-hikes-tryfan.jpg
snowdonia-best-hikes-cwm-idwal.jpg
```

### Hash Generation (for gallery images)
First 8 characters of the MD5 hash of the downloaded file content:
```bash
md5sum file.jpg | cut -c1-8
```

### File Format
- **Always JPEG** (`.jpg`)
- Convert PNG/WebP to JPEG before saving
- Strip EXIF metadata (privacy + file size)
- Quality: 80-85% JPEG compression

---

## 4. Image Sources — Ranked by Priority

Use these sources **in this order**. Exhaust higher tiers before falling to lower ones.

### Tier 1: Official Welsh Tourism Libraries (FREE, highest quality)

#### 🥇 Visit Wales Brand Hub
- **URL:** https://assets.wales.com
- **Also:** https://www.wales.com/media-centre
- **What:** 30,000+ professionally shot images of Wales
- **Licence:** Free for tourism promotion use
- **How to use:** Browse by region/activity, download direct
- **Best for:** Hero images, dramatic landscapes
- **Attribution:** Credit "© Visit Wales" or "© Crown Copyright (Visit Wales)" — check each download's specific terms

#### 🥈 Eryri (Snowdonia) National Park Image Library
- **URL:** https://authority.eryri.gov.wales/information/press-and-media/image-library/
- **What:** Official Snowdonia imagery
- **Licence:** Free for press/promotional use — contact for commercial
- **Best for:** All Snowdonia combo pages
- **Attribution:** "© Eryri National Park Authority" or as specified per image

#### 🥉 Pembrokeshire Coast National Park
- **URL:** https://www.pembrokeshirecoast.wales/media/
- **What:** Coastal path, beaches, coasteering, cliff imagery
- **Licence:** Press/promotional use
- **Best for:** All Pembrokeshire combo pages
- **Attribution:** "© Pembrokeshire Coast National Park Authority"

#### Brecon Beacons (Bannau Brycheiniog) National Park
- **URL:** https://www.bannaubrycheiniog.org/press/
- **What:** Pen y Fan, waterfalls, walking routes
- **Licence:** Press/promotional use
- **Attribution:** "© Bannau Brycheiniog National Park Authority"

#### Southern Wales Tourism
- **URL:** https://www.southernwales.com/en/media/
- **What:** South Wales landscapes, valleys, MTB, heritage
- **Licence:** Free image library
- **Attribution:** "© Southern Wales Tourism"

---

### Tier 2: Creative Commons Photo Libraries (FREE, attribution required)

#### Flickr — Creative Commons
- **URL:** https://www.flickr.com/search/?license=4,5,9,10
- **Excellent for Wales** — huge pool of CC adventure photography
- **ONLY use these licence types:**
  - `CC BY 2.0` (licence id 4) — use with credit ✅
  - `CC BY-SA 2.0` (licence id 5) — use with credit, share alike ✅
  - `CC0 / Public Domain` (licence id 9/10) — no credit needed ✅
- **DO NOT USE:** `CC BY-NC` (licence id 2) — non-commercial only ❌
- **Search URL format:** `https://www.flickr.com/search/?text=QUERY&license=4,5,9,10`
- **Key Flickr groups to mine:**
  - [Mountain Biking North Wales](https://www.flickr.com/groups/mbnw/)
  - [Snowdonia Photography](https://www.flickr.com/groups/snowdonia/)
  - [Pembrokeshire Photos](https://www.flickr.com/groups/pembrokeshirephotos/)
  - [Walking in Wales](https://www.flickr.com/groups/walkinginwales/)
- **Attribution format:** "Photo by {Name} / Flickr / CC BY 2.0"

**Flickr search terms per combo (use these exactly):**

| Combo | Search Terms |
|-------|-------------|
| Hiking Snowdonia | `snowdon hiking`, `tryfan`, `crib goch`, `cadair idris`, `cwm idwal`, `pen yr ole wen` |
| Surfing Pembrokeshire | `freshwater west surfing`, `newgale surf`, `manorbier beach`, `whitesands bay` |
| Coasteering Pembrokeshire | `coasteering pembrokeshire`, `st davids coasteering`, `cliff jumping wales`, `abereiddy` |
| Climbing Snowdonia | `tryfan climbing`, `idwal slabs`, `snowdonia rock climbing`, `llanberis pass climbing` |
| Surfing Gower | `llangennith surfing`, `rhossili bay surf`, `gower surf`, `langland bay` |
| Zip Lining Snowdonia | `zip world`, `velocity zip line`, `penrhyn quarry zip` |
| Hiking Brecon Beacons | `pen y fan`, `brecon beacons walking`, `fan y big`, `sugar loaf mountain wales` |
| MTB Snowdonia | `coed y brenin MTB`, `antur stiniog`, `mountain biking snowdonia` |
| Kayaking Pembrokeshire | `sea kayaking pembrokeshire`, `ramsey island kayak`, `blue lagoon abereiddy` |
| Gorge Walking Snowdonia | `gorge walking wales`, `canyoning snowdonia`, `ogwen valley gorge` |

#### Unsplash
- **URL:** https://unsplash.com
- **Licence:** Unsplash Licence — free commercial use, no attribution legally required (but we credit anyway)
- **Best for:** Landscape/atmosphere shots to fill gaps
- **Search:** "snowdonia", "pembrokeshire coast", "gower beach", "wales hiking", "welsh mountains"
- **Attribution format:** "Photo by {Name} on Unsplash"
- **Note:** We have an API key in the repo scripts (`UNSPLASH_ACCESS_KEY`)

#### Pexels
- **URL:** https://www.pexels.com
- **Licence:** Pexels Licence — free commercial use
- **Best for:** Activity action shots, general Welsh landscapes
- **Attribution format:** "Photo by {Name} on Pexels"

#### Wikimedia Commons
- **URL:** https://commons.wikimedia.org
- **Key categories:**
  - [Snowdonia](https://commons.wikimedia.org/wiki/Category:Snowdonia)
  - [Pembrokeshire](https://commons.wikimedia.org/wiki/Category:Pembrokeshire)
  - [Gower Peninsula](https://commons.wikimedia.org/wiki/Category:Gower_Peninsula)
  - [Brecon Beacons](https://commons.wikimedia.org/wiki/Category:Brecon_Beacons)
- **Licence:** Varies per image — **check each one individually**
- **Best for:** Specific named locations (summits, specific beaches, paths)
- **Attribution:** Follow the specific licence terms on each image page

---

### Tier 3: Operator / Press Sources (permission needed)

#### Adventure Operator Websites & Social Media
- Contact operators and ask: "Can we feature your images on our guide page with credit and link?"
- Most say yes — it's free promotion
- **Best for:** Action shots of specific activities (coasteering jumps, gorge walking groups, guided climbs)
- **MUST get written permission** (email is fine, screenshot and save)
- **Attribution:** "© {Operator Name}" + link to their site

#### National Park Press Offices
- Email press offices for high-res images not on their public library
- Provide context: "Welsh adventure tourism guide site"
- Usually respond within a week

---

### ❌ Sources NOT To Use

| Source | Why Not |
|--------|---------|
| Google Images (direct) | Copyright infringement — no licence |
| Instagram (downloading) | Against ToS, no commercial licence |
| Pinterest | Aggregator, not a licence source |
| AI-generated images of specific real locations | They get details wrong — a local will spot it instantly |
| Any image with watermarks | Obviously |
| CC BY-NC licensed images | Non-commercial only — our site has ads/sponsors |
| Images where you can't verify the licence | If in doubt, don't use it |

---

## 5. Legal Requirements — Read This Carefully

### The Rules

1. **Every single image on the site must have a clear, verifiable licence for commercial use.** No exceptions.
2. **Every image must be tracked in `public/images/attributions.json`.** No unattributed images.
3. **Credit must match what the licence requires.** CC BY = must credit photographer. Unsplash = should credit (not legally required but we do it anyway). Visit Wales = credit per their terms.
4. **Keep proof of licence.** For each image, record the source URL where the licence was visible at time of download.
5. **No people's faces without consent** (or licence covering model releases). Prefer images where faces aren't identifiable, or use officially released press/tourism images which have model consent baked in.
6. **No brand logos or trademarks** visible unless it's an operator's own image being used with permission.

### Licence Quick Reference

| Licence | Commercial Use? | Attribution Required? | Share Alike? |
|---------|:--------------:|:--------------------:|:-----------:|
| CC0 / Public Domain | ✅ | ❌ | ❌ |
| CC BY 2.0 / 4.0 | ✅ | ✅ | ❌ |
| CC BY-SA 2.0 / 4.0 | ✅ | ✅ | ✅ (derivatives) |
| Unsplash Licence | ✅ | ❌ (we do anyway) | ❌ |
| Pexels Licence | ✅ | ❌ (we do anyway) | ❌ |
| CC BY-NC (any) | ❌ | — | — |
| All Rights Reserved | ❌ | — | — |
| Visit Wales / NP Press | ✅ (promotional) | ✅ (per their terms) | Check |
| Operator supplied | ✅ (with permission) | ✅ | — |

### What "Attribution Required" Means In Practice

For images displayed on the site, attribution is shown:
- In a credits/attribution page (linked from footer)
- In image alt text or caption where appropriate
- In `attributions.json` (always)

---

## 6. Attribution Tracking — attributions.json

**Every image you add MUST have an entry in `public/images/attributions.json`.** The file already exists with ~200+ entries. Append to it.

### Schema

```json
{
  "images/combo/snowdonia-hiking-hero.jpg": {
    "source": "flickr",
    "photographer": "John Smith",
    "photographerUrl": "https://www.flickr.com/photos/johnsmith/",
    "originalUrl": "https://www.flickr.com/photos/johnsmith/12345678/",
    "licence": "CC BY 2.0",
    "licenceUrl": "https://creativecommons.org/licenses/by/2.0/",
    "description": "Hikers on the Llanberis Path with Snowdon summit ahead",
    "location": "Snowdon, Snowdonia",
    "activity": "hiking",
    "region": "snowdonia",
    "pageType": "combo",
    "imageRole": "hero",
    "downloadedAt": "2026-02"
  }
}
```

### Required Fields

| Field | Type | Description | Required |
|-------|------|-------------|:--------:|
| `source` | string | `"flickr"`, `"unsplash"`, `"pexels"`, `"wikimedia"`, `"visit-wales"`, `"national-park"`, `"operator"`, `"openverse"` | ✅ |
| `photographer` | string | Name of photographer | ✅ |
| `photographerUrl` | string | Link to photographer's profile/page | ✅ (if available) |
| `originalUrl` | string | Direct URL to the original image page (NOT the raw file) | ✅ |
| `licence` | string | Exact licence name: `"CC BY 2.0"`, `"CC BY-SA 2.0"`, `"CC0"`, `"Unsplash Licence"`, `"Pexels Licence"`, `"Visit Wales Press"`, `"Operator Permission"` | ✅ |
| `licenceUrl` | string | URL to the licence text | ✅ (if CC) |
| `description` | string | What the image shows — be specific | ✅ |
| `location` | string | Where in Wales this was taken | ✅ |
| `activity` | string | Activity type slug | ✅ |
| `region` | string | Region slug | ✅ |
| `pageType` | string | `"combo"` or `"best-list"` | ✅ |
| `imageRole` | string | `"hero"`, `"spot"`, `"gallery"`, `"entry"` | ✅ |
| `downloadedAt` | string | `"YYYY-MM"` | ✅ |
| `operatorPermission` | string | Email/date of permission (only for operator images) | If applicable |

### Key Rules
- The JSON key is the **relative path** from `public/` — e.g. `"images/combo/snowdonia-hiking-hero.jpg"` (no leading slash, no `public/` prefix)
- Keep the file valid JSON at all times
- Append new entries; don't delete existing ones
- If replacing an image, update the existing entry

---

## 7. Image Quality Standards

### Must Have
- [ ] **Actually Wales** — a local should recognise the location
- [ ] **Correct location** — if it says "Snowdonia", it must BE Snowdonia. Arizona balloons are banned.
- [ ] **High resolution** — minimum 1200px wide, prefer 1920px+ for heroes
- [ ] **Good light** — golden hour, dramatic clouds, clear action. NOT flat grey overcast unless it suits the mood.
- [ ] **People doing the activity** — action shots where possible, not just empty landscapes
- [ ] **Landscape orientation** — all images must be landscape (wider than tall)
- [ ] **Works with text overlay** — hero images need dark areas or natural gradients for title text

### Avoid
- [ ] Generic stock photos of random mountains/beaches
- [ ] Watermarked images
- [ ] Low resolution or heavily compressed source files
- [ ] AI-generated images of specific real Welsh locations (they get details wrong)
- [ ] Overly processed/HDR images that look fake
- [ ] Portrait/vertical orientation (doesn't fit the layout)
- [ ] Images where people's faces are clearly identifiable (unless from a press/tourism library with model release)

### Style Guide
The site has an outdoor adventure aesthetic:
- **Dramatic but natural** — moody skies, golden light, real Welsh weather
- **Active, not static** — people climbing, paddling, riding, walking
- **Welsh character** — slate, ferns, waterfalls, rugged coastline, green valleys
- **Seasonal variety** — don't make everything look like July. Show autumn colour, winter drama, spring green
- **Honest** — Wales has grey days. A few atmospheric misty shots are fine. Just don't make it ALL grey.

---

## 8. Image Processing Pipeline

Before adding any image to the repo:

### Step 1: Verify
- [ ] Correct location (cross-reference with Google Maps/Street View if unsure)
- [ ] Licence is commercially safe
- [ ] Resolution is sufficient

### Step 2: Process
```bash
# Resize hero images to 1920×1080
convert input.jpg -resize 1920x1080^ -gravity center -extent 1920x1080 -quality 82 -strip output.jpg

# Resize spot/gallery/entry images to 1200×800
convert input.jpg -resize 1200x800^ -gravity center -extent 1200x800 -quality 82 -strip output.jpg
```

Key flags:
- `-quality 82` — good balance of quality vs file size
- `-strip` — removes all EXIF/metadata (privacy)
- `-resize WxH^` — resize to fill, then `-extent WxH` crops to exact dimensions

### Step 3: Check file size
- Heroes: should be under 400KB
- Spots/gallery/entries: should be under 200KB
- If over, reduce quality to 75 and re-export

### Step 4: Generate hash (gallery images only)
```bash
HASH=$(md5sum output.jpg | cut -c1-8)
mv output.jpg snowdonia-hiking-01-${HASH}.jpg
```

### Step 5: Add attribution entry
Add the entry to `public/images/attributions.json` before committing.

### Step 6: Commit
```bash
git add public/images/combo/ public/images/best-lists/ public/images/attributions.json
git commit -m "feat(images): add {region}-{activity} combo page images"
```

---

## 9. Existing Scripts You Can Use

The repo has Python scripts for automated fetching:

### Openverse (Creative Commons, no rate limits)
```bash
cd /home/minigeek/Adventure-Site
source .venv/bin/activate
python scripts/fetch_openverse_images.py --entity activities
```

### Unsplash (higher quality, 50 req/hr)
```bash
python scripts/fetch_unsplash_images.py --preview --entity activities
# Review the HTML report, then:
python scripts/fetch_unsplash_images.py --apply reports/unsplash_preview_XXXXXX.json
```

These scripts auto-update `attributions.json` and handle resizing. **Adapt them for combo page images** — they currently target activity hero images, not combo pages.

### Flickr API (if automating)
```
GET https://api.flickr.com/services/rest/?method=flickr.photos.search
  &api_key=YOUR_KEY
  &text=snowdonia+hiking
  &license=4,5,9,10
  &sort=relevance
  &media=photos
  &content_type=1
  &extras=url_l,url_o,license,owner_name,geo
  &per_page=50
  &format=json
  &nojsoncallback=1
```

Free API key: https://www.flickr.com/services/apps/create/apply/

---

## 10. Search Strategy Per Combo Page

For each combo page, search sources in this order:

### Step 1: Visit Wales Asset Library
Search for the region + activity. Download any hero-quality images.

### Step 2: National Park Press Library
Check the relevant park's media page (Eryri for Snowdonia, Pembrokeshire Coast for Pembs, Bannau Brycheiniog for Brecon).

### Step 3: Flickr CC Search
Use the specific search terms from the table in Section 4. Filter by `licence=4,5,9,10`.

### Step 4: Unsplash / Pexels
Fill gaps with landscape/atmosphere shots.

### Step 5: Wikimedia Commons
For specific named locations where you need THE shot of that exact place.

### Step 6: Operator Outreach (last resort for action shots)
Email operators. Template:

> Subject: Image use request — Adventure Wales guide
>
> Hi {Name},
>
> We're building Adventure Wales (adventurewales.co.uk), a comprehensive guide to outdoor adventures in Wales. We're creating an in-depth guide page for {activity} in {region} and would love to feature some of your fantastic images.
>
> We'd credit you fully with your business name, logo, and a direct link to your website. It's great exposure to our growing audience of adventure seekers.
>
> Would you be happy for us to use 2-3 images from your website/social media? We can send specific ones we'd like to use for your approval.
>
> Many thanks,
> Adventure Wales Team

---

## 11. Per-Spot Image Guidance (Tier 1 Combos)

### 1. Snowdonia — Hiking
| Spot | What to shoot/find |
|------|--------------------|
| Snowdon Llanberis Path | Hikers on wide path with summit visible ahead |
| Crib Goch | Knife-edge ridge with exposure visible, scrambler in frame |
| Tryfan North Ridge | Rocky scramble, distinctive jagged profile of Tryfan |
| Cadair Idris | Llyn Cau crater lake or summit ridge |
| Cwm Idwal | Devil's Kitchen, ice-scratched slabs, cwm lake |
| Y Garn | Ridge walk, views back to Ogwen Valley |
| Snowdon Horseshoe | Wide panorama of the horseshoe ridge from Crib Goch to Lliwedd |
| Nantlle Ridge | Quiet ridge with views of Snowdon |

### 2. Pembrokeshire — Surfing
| Spot | What to shoot/find |
|------|--------------------|
| Freshwater West | Big open beach with waves, surfers in water |
| Newgale | Long beach with pebble bank, surf school vibes |
| Manorbier | Castle in background, surfers in foreground |
| Whitesands Bay | St Davids headland visible, clean waves |
| Broadhaven South | Dramatic cliffs framing the surf |

### 3. Pembrokeshire — Coasteering
| Spot | What to shoot/find |
|------|--------------------|
| Abereiddy Blue Lagoon | Flooded quarry, cliff jumpers |
| St Davids Head | Group on rocks, Atlantic backdrop |
| Stackpole | Dramatic sea arches, swimmers |
| Porthgain | Harbour area, cliff traversing |

### 4. Snowdonia — Climbing
| Spot | What to shoot/find |
|------|--------------------|
| Tryfan | Climber on distinctive rock, valley below |
| Idwal Slabs | Trad climbing, wide angle showing the full slab |
| Llanberis Pass | Multi-pitch on the pass walls |
| Clogwyn Du'r Arddu (Cloggy) | Big cliff, exposed climbing |

### 5. Gower — Surfing
| Spot | What to shoot/find |
|------|--------------------|
| Llangennith | Classic surf beach, Worm's Head in background |
| Rhossili Bay | Aerial/high angle showing full sweep of beach |
| Langland Bay | Smaller bay, surfers, accessible feel |
| Caswell Bay | Family-friendly surf scene |

### 6–10: Use the same approach — find the 5-10 key spots listed in the content brief (`docs/ACTIVITY-REGION-PAGES-BRIEF.md`) and source an image that unmistakably shows THAT specific place.

---

## 12. Gallery Image Mix

For each combo page's 6-10 gallery images, aim for this mix:

| Type | Count | Example |
|------|-------|---------|
| Wide landscape | 2 | Panoramic view of the region showing the activity's terrain |
| Action shot | 2 | People actively doing the thing — climbing, paddling, riding |
| Detail/texture | 1-2 | Gear close-up, rock texture, wave detail, trail surface |
| Atmospheric/moody | 1 | Misty mountains, sunset, dramatic weather |
| Seasonal contrast | 1 | Winter snow, autumn colour, spring wildflowers |
| People/social | 1 | Group enjoying the activity, summit celebration, post-activity pub |

---

## 13. Delivery Checklist Per Combo Page

For each combo, deliver:

- [ ] Hero image at correct path and dimensions
- [ ] 5-10 spot images, one per featured spot, at correct paths
- [ ] 6-10 gallery images at correct paths with hashes
- [ ] Every image has an entry in `attributions.json`
- [ ] Every attribution has: source, photographer, originalUrl, licence, licenceUrl, description, location
- [ ] All images are JPEG, landscape orientation, EXIF stripped
- [ ] All heroes ≤400KB, all others ≤200KB
- [ ] No watermarks, no identifiable unconsented faces, no CC-NC images
- [ ] Files committed to git with descriptive commit message

### Quality Spot-Check (Do This For Every Image)
1. ✅ Is this actually the correct location in Wales?
2. ✅ Is the licence commercially safe?
3. ✅ Is the attribution recorded?
4. ✅ Is it landscape orientation?
5. ✅ Does it show the right activity?
6. ✅ Is it visually compelling (not just "adequate")?
7. ✅ No watermarks, logos, or brand marks?

---

## 14. Priority Order

```
Phase 1: Tier 1 combo page heroes (10 images) ← START HERE
Phase 2: Tier 1 combo page spot images (~70 images)
Phase 3: Tier 1 combo page gallery images (~80 images)
Phase 4: Tier 1 best-of list heroes (10 images)
Phase 5: Tier 1 best-of list entry images (~120 images)
Phase 6: Tier 2 combo pages + best-of lists
Phase 7: Tier 3 pages
```

Get the 10 hero images first. They're the most visible and set the tone for everything else. Then work through spots and galleries systematically, one combo at a time.

---

## 15. What Already Exists (Don't Duplicate)

The repo already has:
- `public/images/regions/` — 11 region hero images (Unsplash sourced)
- `public/images/activities/` — ~23 activity hero images (Openverse + Unsplash)
- `public/images/wales/` — 110 Welsh landscape photos
- `public/images/journal/` — 128 journal post heroes

**You can reuse/adapt existing images** if they fit a combo page's needs (e.g. a Snowdonia region hero could work as a gallery image for a Snowdonia combo page). But combo page heroes and spot images should ideally be unique — don't just copy the generic region hero.

Check `public/images/attributions.json` before sourcing — we may already have a usable image of a specific location.

---

## 16. Questions to Ask Yourself Before Adding Any Image

1. If I showed this to someone from Llanberis / St Davids / Swansea, would they recognise the location?
2. Would I use this image as the hero on a page I'm trying to rank #1 on Google?
3. Can I prove this image is legally cleared for commercial use?
4. Have I recorded the attribution?
5. Does this image make someone want to go do this activity in Wales?

If any answer is "no", find a better image.

---

*Brief created by Sudo ⚡ — February 2026*
*Reference docs: `docs/ACTIVITY-REGION-PAGES-BRIEF.md`, `docs/IMAGE-SOURCING-BRIEF.md`, `IMAGE_BRIEF.md`*
