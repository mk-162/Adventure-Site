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

## Priority

1. Homepage CTA images (visible on main page)
2. About page images
3. Other misc images
