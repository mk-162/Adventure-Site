# Jules Task: Fix Wrong Activity Images

## Priority: HIGH

## Problem
Activity card images were bulk-downloaded without location filtering. Many show **North American landscapes** (Pacific Northwest, Upper Midwest) instead of **Wales/UK**.

Examples confirmed wrong:
- `mountain-biking-hero.jpg` — Minnesota/Wisconsin birch forest, not Welsh
- `mountain-biking-02-*.jpg` — Oregon/Washington PNW forest
- `white-water-rafting-*.jpg` — Reported as grass hill (needs verification)

## Your Mission

Audit each activity type's images using vision, identify non-Welsh images, and replace them with Welsh-specific alternatives from Unsplash.

## Workflow

### Phase 1: Vision Audit

For each activity type, use the `image` tool to analyze the current images:

```
Activity types to audit:
1. mountain-biking (CONFIRMED BAD)
2. white-water-rafting (REPORTED BAD)
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
```

For each type, check:
- `public/images/activities/{type}-hero.jpg`
- `public/images/activities/{type}-02-*.jpg` through `{type}-06-*.jpg`

Use this prompt template:
```
Analyze this image. Is this Wales/UK? Look for:
- Welsh indicators: slate rock, ferns, heather, grey skies, green valleys, UK vegetation
- Non-UK indicators: birch forests (PNW), red soil (Minnesota), palm trees, desert, American architecture

Answer: WELSH / NOT_WELSH / UNCERTAIN
```

### Phase 2: Source Replacements

For each BAD image, source a Welsh alternative from Unsplash.

**API call:**
```bash
curl -s "https://api.unsplash.com/search/photos?query={QUERY}&per_page=10&orientation=landscape" \
  -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY"
```

**Effective queries by activity type:**

| Activity | Queries to try |
|----------|---------------|
| mountain-biking | `wales mountain biking`, `coed y brenin mtb`, `bikepark wales`, `snowdonia cycling` |
| white-water-rafting | `wales rafting`, `uk white water`, `welsh river rapids` |
| hiking | `snowdon hiking`, `brecon beacons walking`, `wales coast path` |
| surfing | `gower surfing`, `pembrokeshire surf`, `rhossili beach` |
| kayaking | `pembrokeshire kayaking`, `wales sea kayak`, `anglesey paddling` |
| coasteering | `pembrokeshire coasteering`, `wales cliff jumping`, `welsh coast adventure` |

**Rate limit:** 50 requests/hour. Space requests, batch by type.

### Phase 3: Download & Save

```bash
# Download image (use urls.regular from API response)
curl -L "{unsplash_url}&w=1200&q=80" -o public/images/activities/{type}-{nn}-{newhash}.jpg

# newhash = first 8 chars of the photo ID from Unsplash
```

### Phase 4: Update Variant Registry

Edit `src/components/cards/activity-card.tsx`:

```typescript
const activityImageVariants: Record<string, string[]> = {
  "mountain-biking": ["02-NEWHASH1", "03-NEWHASH2", ...],
  // Replace old hashes with new ones
};
```

### Phase 5: Commit

```bash
git add -A
git commit -m "images: replace non-Welsh {type} images with Welsh alternatives"
git push
```

## Validation

After fixing, verify by:
1. Running dev server
2. Navigating to `/activities/type/{type}`
3. Visual check that cards show Welsh landscapes

## Success Criteria

- [ ] All hero images for main activity types are Welsh/UK
- [ ] Variant images show variety but all Welsh/UK
- [ ] No obviously American landscapes (birch forests, red soil, palm trees)
- [ ] Changes committed and deployed

## Notes

- If Unsplash has no Welsh-specific results, try `UK {activity}` or `British {activity}`
- Prioritize images that show the ACTIVITY happening, not just landscapes
- When uncertain, err on the side of replacing — a generic UK forest is better than Minnesota
- Keep track of which images you've verified as OK to avoid re-auditing

## Unsplash API Key

Located in `.env.local`:
```
UNSPLASH_ACCESS_KEY=BBqUqpMUJJiKvawiCURPSnrHJmcoajR6ULDyMKzuLu4
```
