# ACTIVE TASK: Fix All Activity Images

**Status: IN PROGRESS**

## Hit List

Audit and fix images for all 23 activity types. Check hero + all variants (02-06).

| # | Activity Type | Priority | Status |
|---|---------------|----------|--------|
| 1 | mountain-biking | 🔴 HIGH | ❌ All wrong (confirmed) |
| 2 | rafting | 🔴 HIGH | ❌ Reported wrong |
| 3 | hiking | 🔴 HIGH | ⏳ Needs audit |
| 4 | surfing | 🔴 HIGH | ⏳ Needs audit |
| 5 | coasteering | 🟠 MED | ⏳ Needs audit |
| 6 | kayaking | 🟠 MED | ⏳ Needs audit |
| 7 | climbing | 🟠 MED | ⏳ Needs audit |
| 8 | caving | 🟠 MED | ⏳ Needs audit |
| 9 | wild-swimming | 🟠 MED | ⏳ Needs audit |
| 10 | zip-lining | 🟠 MED | ⏳ Needs audit |
| 11 | gorge-walking | 🟡 LOW | ⏳ Needs audit |
| 12 | paddleboarding | 🟡 LOW | ⏳ Needs audit |
| 13 | sea-kayaking | 🟡 LOW | ⏳ Needs audit |
| 14 | gorge-scrambling | 🟡 LOW | ⏳ Needs audit |
| 15 | high-ropes | 🟡 LOW | ⏳ Needs audit |
| 16 | archery | 🟡 LOW | ⏳ Needs audit |
| 17 | boat-tour | 🟡 LOW | ⏳ Needs audit |
| 18 | mine-exploration | 🟡 LOW | ⏳ Needs audit |
| 19 | wildlife-boat-tour | 🟡 LOW | ⏳ Needs audit |
| 20 | trail-running | 🟡 LOW | ⏳ Needs audit |
| 21 | hiking-scrambling | 🟡 LOW | ⏳ Needs audit |
| 22 | sup | 🟡 LOW | ⏳ Needs audit |
| 23 | windsurfing | 🟡 LOW | ⏳ Needs audit |

## Workflow Per Activity Type

### Step 1: Audit Current Images
```bash
ls ~/Adventure-Site/public/images/activities/{type}-*.jpg
```

For each image, use `image` tool:
```
What is in this image? 
1. Does it show {activity type}?
2. Is this Wales/UK?
3. Is it PRO quality (action shot, good composition)?
Answer: KEEP / REPLACE and explain.
```

### Step 2: Source Replacements

For images marked REPLACE:

**Search Flickr CC first (pro quality):**
```
https://www.flickr.com/search/?text={activity}+wales&license=4,5,9,10
```

**Search Geograph (accuracy):**
```bash
curl -s "https://api.geograph.org.uk/syndicator.php?key=e8894773ec&text={activity}&location={GRID_REF}&format=json"
```

**Grid refs:**
- Coed y Brenin: SH7227
- BikePark Wales: SO0509
- Snowdon: SH6054
- Pembrokeshire: SM7525
- Brecon Beacons: SO0121

### Step 3: Vision-Verify Replacement

Before downloading, verify with `image` tool:
```
Rate this for Adventure Wales:
1. ACTION: Someone doing the activity? 
2. WELSH: Could this be Wales/UK?
3. PRO: Magazine quality?
Answer: USE / SKIP
```

### Step 4: Download & Save
```bash
curl -L "{url}" -o ~/Adventure-Site/public/images/activities/{type}-{nn}-{hash}.jpg
```

### Step 5: Update Registry

Edit `src/components/cards/activity-card.tsx`:
```typescript
const activityImageVariants: Record<string, string[]> = {
  "{type}": ["02-{hash1}", "03-{hash2}", ...],
};
```

### Step 6: Log Attribution

Add to `public/images/attributions.json`

### Step 7: Commit
```bash
git add -A && git commit -m "images: fix {type} - replaced with verified Welsh pro shots" && git push
```

## Quality Gates

**Every image must pass ALL checks:**
- [ ] Shows correct activity (not a dog, not a flood)
- [ ] Is Wales/UK (not Minnesota, not Oregon)
- [ ] Is PRO quality (action, composition, lighting)
- [ ] Is ≥1200px wide
- [ ] Has attribution logged

**If ANY check fails → SKIP and try another image**

## API Keys

- Geograph: `e8894773ec`
- Unsplash: in `.env.local`
