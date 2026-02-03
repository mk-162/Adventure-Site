# Pending Image Downloads

Rate limited on 2026-02-03. Unsplash free tier = 50 requests/hour.

## How to Continue

**Option 1: Bash scripts** (simpler)
```bash
./scripts/fetch-activities.sh   # skips existing
./scripts/fetch-regions.sh      # skips existing
```

**Option 2: Python script** (preview workflow, better quality)
```bash
source .venv/bin/activate
python scripts/fetch_unsplash_images.py --entity activities --limit 20
# Review reports/unsplash_preview_*.html
python scripts/fetch_unsplash_images.py --apply reports/unsplash_preview_XXXXXX.json
```

## Completed

### Regions (11/11) ✓
All done.

### Activities (12/~25)
- [x] zip-lining
- [x] coasteering
- [x] mountain-biking
- [x] hiking
- [x] climbing
- [x] kayaking
- [x] surfing
- [x] wild-swimming
- [x] caving
- [x] gorge-walking
- [x] paddleboarding
- [x] rafting

### Still Needed (rate limited)
- [ ] archery, high-ropes, abseiling
- [ ] horse-riding, sailing, paragliding
- [ ] kitesurfing, windsurfing
- [ ] canyoning, jet-ski, powerboating
- [ ] trail-running, toboggan
- [ ] mine-exploration, underground-trampolines
- [ ] wildlife-boat-tour

## Not Yet Started

- [ ] Itineraries (15)
- [ ] Operators (35)
- [ ] Accommodation (70)
- [ ] Events (47)
