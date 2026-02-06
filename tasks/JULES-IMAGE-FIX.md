# Jules Task: Fix Activity Card Images

**Priority: HIGH**
**Skill Required: aw-image-sourcer**

## The Problem

Activity card images are wrong — Minnesota forests, Pacific Northwest trails, generic stock. The site cannot launch with these.

**Confirmed wrong:**
- `mountain-biking-hero.jpg` — Minnesota birch forest
- `mountain-biking-02-*.jpg` — Oregon/Washington PNW
- `white-water-rafting-*.jpg` — Grass hill (reported)

## Your Mission

Replace all non-Welsh activity images with verified Welsh alternatives.

## Before You Start

1. Read the skill: `~/clawd/skills/aw-image-sourcer/SKILL.md`
2. Understand the approved sources (Tier 1 = Visit Wales, Tier 2 = Flickr CC)
3. Understand the quality checklist

## Workflow

### Phase 1: Vision Audit (All Activity Types)

For each activity type, audit current images:

```bash
ls ~/Adventure-Site/public/images/activities/{type}-*.jpg
```

Activity types to audit:
1. mountain-biking ← START HERE (confirmed bad)
2. white-water-rafting ← PRIORITY (reported bad)  
3. hiking
4. surfing
5. kayaking
6. coasteering
7. caving
8. climbing
9. zip-lining
10. gorge-walking
11. paddleboarding
12. wild-swimming
13. rafting

**For each image, use the `image` tool:**

```
Analyze this image. Is this Wales/UK? Look for:
- Welsh indicators: slate rock, ferns, heather, grey skies, green valleys, UK vegetation
- Non-UK indicators: birch forests (PNW), red soil (Minnesota), palm trees, desert, American architecture

Answer ONLY: WELSH / NOT_WELSH / UNCERTAIN
If NOT_WELSH, explain what's wrong.
```

**Record results:**
```
| File | Verdict | Issue |
|------|---------|-------|
| mountain-biking-hero.jpg | NOT_WELSH | Minnesota birch forest |
| mountain-biking-02-*.jpg | NOT_WELSH | PNW Douglas fir |
| ... | ... | ... |
```

### Phase 2: Source Replacements

**For each BAD image, source a replacement:**

#### Step 1: Check Visit Wales Asset Library
- Go to https://assets.wales.com
- Search for the activity + region
- Download if suitable image found

#### Step 2: Search Flickr CC
```
https://www.flickr.com/search/?text={query}&license=4,5,9,10&orientation=landscape
```

**Use these queries per activity:**
- Mountain Biking: `coed y brenin mtb`, `bikepark wales`, `afan forest mountain biking`
- White Water Rafting: `wales rafting`, `tryweryn rafting`, `bala rafting`
- Hiking: `snowdon summit`, `pen y fan`, `cadair idris`
- Surfing: `rhossili surfing`, `llangennith surf`, `gower surf`
- Kayaking: `pembrokeshire sea kayaking`, `anglesey kayak`
- Coasteering: `pembrokeshire coasteering`, `st davids coast`
- Caving: `dan yr ogof`, `brecon beacons caving`

#### Step 3: Fallback to Unsplash/Pexels
Only if Tier 1/2 fail. **Must vision-verify every image.**

### Phase 3: Download & Verify

For each replacement image:

1. **Download:**
```bash
curl -L "{url}" -o ~/Adventure-Site/public/images/activities/{type}-{nn}-{hash}.jpg
```

2. **Check dimensions:**
```bash
identify ~/Adventure-Site/public/images/activities/{type}-{nn}-{hash}.jpg
```
Must be ≥1200px wide.

3. **Vision verify the downloaded image** — make sure it's actually Welsh.

4. **Compress if needed:**
```bash
convert input.jpg -quality 82 -resize "1200x800>" output.jpg
```
Target: <200KB for variants, <400KB for heroes.

### Phase 4: Update Variant Registry

Edit `src/components/cards/activity-card.tsx`:

Find the `activityImageVariants` object and update with new hashes:

```typescript
const activityImageVariants: Record<string, string[]> = {
  "mountain-biking": ["02-NEWHASH1", "03-NEWHASH2", "04-NEWHASH3", ...],
  // Replace old hashes with new ones
};
```

### Phase 5: Log Attributions

Add entries to `public/images/attributions.json`:

```json
{
  "images/activities/mountain-biking-02-abc12345.jpg": {
    "source": "flickr",
    "sourceUrl": "https://flickr.com/photos/...",
    "photographer": "Name",
    "licence": "CC BY 2.0",
    "downloadedAt": "2026-02-06",
    "verifiedWelsh": true
  }
}
```

### Phase 6: Commit

```bash
cd ~/Adventure-Site
git add -A
git commit -m "images: replace non-Welsh {type} images with verified Welsh alternatives

Sources: Visit Wales, Flickr CC
Verified: All images vision-checked for Welsh landscapes"
git push
```

## Quality Gates

**Do NOT proceed to next activity type until:**
- [ ] All images for current type vision-verified as Welsh
- [ ] All images ≥1200px wide
- [ ] All attributions logged
- [ ] Variant registry updated
- [ ] Committed and pushed

## Rejection Criteria

**REJECT any image that:**
- Is clearly not Wales/UK (wrong vegetation, architecture, geology)
- Is too low resolution (<1024px)
- Doesn't show the activity
- Has watermarks
- Is from a non-approved source
- Has unclear licensing

**When in doubt, skip it.** A missing image is better than a fake one.

## Success Criteria

Task complete when:
- [ ] All 13 activity types audited
- [ ] All non-Welsh images replaced
- [ ] All replacements vision-verified
- [ ] All attributions logged
- [ ] Deployed and live

## Notes

- Take your time. Quality over speed.
- One activity type per session is fine.
- If Visit Wales has it, use Visit Wales.
- If you can't find a good Welsh image, log it and move on — we'll source later.
- Check your work: run dev server and visually inspect the cards.
