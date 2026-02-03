# Pending Image Downloads

## Scripts Available

**Openverse** (Creative Commons, no rate limits):
```bash
source .venv/bin/activate
python scripts/fetch_openverse_images.py --entity activities
python scripts/fetch_openverse_images.py --entity regions
```

**Unsplash** (higher quality, 50 req/hr limit):
```bash
python scripts/fetch_unsplash_images.py --entity activities
python scripts/fetch_unsplash_images.py --apply reports/unsplash_preview_XXXXXX.json
```

## Completed

### Regions (11/11) ✓

### Activities (23/~28) ✓
From Unsplash: zip-lining, coasteering, mountain-biking, hiking, climbing,
kayaking, surfing, wild-swimming, caving, gorge-walking, paddleboarding, rafting

From Openverse: archery, boat-tour, gorge-scrambling, high-ropes,
hiking-scrambling, mine-exploration, sea-kayaking, sup, trail-running,
wildlife-boat-tour, windsurfing

### Still Needed (~5)
- [ ] canyoning (Wikimedia 403)
- [ ] jet-ski (Wikimedia 403)
- [ ] kitesurfing (Wikimedia 403)
- [ ] powerboating (Wikimedia 403)
- [ ] sailing (Wikimedia 403)
- [ ] toboggan (Wikimedia 403)
- [ ] underground-trampolines (Wikimedia 403)

## Not Yet Started

- [ ] Itineraries (15)
- [ ] Operators (35)
- [ ] Accommodation (70)
- [ ] Events (47)
