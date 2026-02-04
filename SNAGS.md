# SNAGS.md — Quick Bug & Fix List

Drop anything you notice here. One line per snag. I'll fix and tick them off.

Format: `- [ ] what's wrong (page/url if helpful)`

## Open

### 404s Found (Site Audit 2026-02-06)
- [ ] `/for-operators` — 404! This is the operator sales page, was working before. Likely fell out of the Vercel build
- [ ] `/activities/camping` — 404, linked from homepage but no activity with that slug exists in DB
- [ ] `/activities/climbing` — 404, linked from homepage but no activity with that slug exists in DB
- [ ] `/activities/hiking` — 404, linked from homepage but no activity with that slug exists in DB
- [ ] `/activities/photography` — 404, linked from homepage but no activity with that slug exists in DB
- [ ] `/answers/best-adventures-brecon-Beacons` — 404 due to capital B in "Beacons" (case sensitivity)

### Notes from Audit
- ✅ 200+ URLs checked across all sections — regions, activities, itineraries, directory, accommodation, events, answers, journal, tags, search
- ✅ All 12 region pages + things-to-do + where-to-stay working
- ✅ All 54 itinerary pages working
- ✅ All 48 directory/operator pages working
- ✅ All 14 accommodation pages working
- ✅ All event pages working
- ✅ All answer pages working (except the case-sensitivity one)
- ✅ All journal pages working
- ✅ All tag pages working
- ✅ Invalid URLs correctly return 404

## Fixed
- [x] Surfing shows in Snowdonia search dropdown — activities now filtered by region
- [x] Date picker unnecessary — removed from search bar
- [x] Search results had no images — added fallback chain (activity type → region)
- [x] Gallery images broken on activity pages — stale file hashes fixed
- [x] All 54 itineraries missing hero images — populated from Unsplash + region fallback
- [x] 2 regions missing hero images (carmarthenshire, multi-region) — fixed
