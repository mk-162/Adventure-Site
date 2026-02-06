# TASK: Site-Wide Image Audit

**Status: QUEUED**

## The Problem

Random images across the site showing USA, Poland, Alps instead of Wales.

## Homepage Hero (5 images)
✅ All 5 verified Welsh — Snowdon, Pembrokeshire coast, Welsh hills, etc.

## Homepage CTA/Newsletter Section
**ALL WRONG:**

| File | Shows | Status |
|------|-------|--------|
| homepage-cta-01-*.jpg | C&O Canal, Maryland USA | ❌ REPLACE |
| homepage-cta-02-*.jpg | Map of Poland | ❌ REPLACE |
| homepage-cta-03-*.jpg | Rocky Mountains, Colorado | ❌ REPLACE |
| homepage-cta-04-*.jpg | ⏳ Needs check | AUDIT |
| homepage-cta-05-*.jpg | ⏳ Needs check | AUDIT |

## Other Misc Images to Audit

| Folder/Type | Count | Notes |
|-------------|-------|-------|
| about-mission-* | 5 | Check for Welsh relevance |
| about-team-* | 5 | Generic OK if people shots |
| accessible-adventure-* | 5 | Should be Welsh |
| contact-help-* | 5 | Generic OK |
| seasonal-* | ? | Should be Welsh seasons |
| events-* | ? | Should be Welsh events |

## Workflow

### Step 1: Audit Each Image
```
Is this Wales/UK?
If not, what does it show?
Answer: WELSH / NOT_WELSH
```

### Step 2: Replace Non-Welsh

For CTA/promo sections, find inspiring Welsh adventure images:
- Coasteering action
- Mountain summit views  
- Surfing at Gower
- MTB through forest

### Step 3: Update Code If Needed

Check which component uses the image:
```bash
grep -r "filename" src/
```

## Itinerary Thumbnails (Homepage)

**Problem:** Itineraries on homepage have no dedicated images — falling back to region heroes which may be wrong or missing.

**Fix options:**
1. Add `heroImage` to each itinerary in DB
2. Create `/images/itineraries/{slug}-hero.jpg` for each
3. Use combo images (activity+region) as fallback

**Itineraries to image:**
- snowdonia-adventure-weekend
- pembrokeshire-coasteering-break
- family-adventure-week
- (check full list in DB)

Each itinerary image should:
- Show the main activity of that itinerary
- Be recognisably in the right region
- Be pro quality action shot

## Priority

1. Homepage CTA images (visible on main page)
2. **Itinerary thumbnails** (visible on homepage)
3. About page images
4. Other misc images
