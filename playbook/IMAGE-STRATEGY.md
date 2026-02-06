# Adventure Wales: Image Sourcing Strategy

## The Problem
We need thousands of images. We can't photograph everything ourselves. We need a legal, ethical, scalable approach.

---

## Tiered Image Strategy

### Tier 1: Creative Commons (Primary)
**Use for:** Hero images, main content, anything prominent

**Sources:**
- Wikimedia Commons (CC-BY-SA, CC0)
- Geograph UK (CC-BY-SA) — best for Welsh locations
- Unsplash (free license)
- Flickr CC (various CC licenses)

**Process:**
1. Download full resolution
2. Store locally in `/public/images/`
3. Record in `attributions.json`
4. Display credit on page or in image caption

**Legal:** ✅ Clear rights, proper attribution

---

### Tier 2: Embed/oEmbed (Secondary)
**Use for:** Social proof, user content, videos

**Sources:**
- Instagram embeds (official embed code)
- YouTube embeds
- Strava embeds (routes/activities)
- Twitter/X embeds

**Process:**
1. Use official embed code
2. Content stays on source platform
3. Auto-updates if source changes
4. Respects platform ToS

**Legal:** ✅ Using official embed APIs

---

### Tier 3: Link Cards (For Commercial Sources)
**Use for:** Magazine articles, commercial photography, news

**How it works:**
Instead of showing the image, show a **link card** that drives traffic:

```html
<div class="source-card">
  <div class="source-meta">
    <img src="/icons/mbr-logo.png" class="source-logo">
    <span class="source-name">MBR Magazine</span>
  </div>
  <h4>Trail Centre Guide: Afan Argoed</h4>
  <p>Full photo gallery and trail guide on MBR</p>
  <a href="https://mbr.com/..." class="source-link">
    View on MBR →
  </a>
</div>
```

**Benefits:**
- No copyright issues (we're just linking)
- Drives traffic to source (they like this)
- Builds relationships with publishers
- Professional appearance

**Legal:** ✅ Just linking, no content copying

---

### Tier 4: Permission-Based (For Key Images)
**Use for:** Hero shots, featured content, where specific image is essential

**Process:**
1. Email photographer/publication
2. Request permission for specific use
3. Offer credit + link
4. Document permission received
5. Use with agreed attribution

**Template email:**
```
Subject: Image use request - Adventure Wales

Hi [Name],

I'm building Adventure Wales (adventurewales.co.uk), a guide to 
outdoor adventures in Wales.

I'd love to feature your image of [description] on our [page type] 
page. We would provide full credit linking to [your site/profile].

Would you be open to this? Happy to discuss any requirements.

Best,
[Name]
```

**Legal:** ✅ Explicit permission

---

### Tier 5: AI-Generated (Placeholder/Atmosphere)
**Use for:** Generic atmosphere shots, placeholders, icons

**Tools:**
- Ideogram/Midjourney for illustrations
- Clearly mark as "illustrated" not photo
- Never misrepresent as real location photo

**Legal:** ✅ We own the output

---

## What NOT To Do

❌ **Hotlink** from other sites (bandwidth theft, images break)
❌ **Download without permission** from commercial sites (copyright infringement)
❌ **Screenshot** from Google Maps/Street View (license violation)
❌ **Use** press images without permission
❌ **Crop out** watermarks or credits
❌ **Claim** AI images are real photos

---

## Implementation: Source Cards Component

For Tier 3 (commercial sources), build a `<SourceCard>` component:

```tsx
interface SourceCard {
  source: string;        // "MBR Magazine"
  sourceLogo: string;    // "/icons/mbr.png"
  title: string;         // "Afan Argoed Trail Guide"
  description: string;   // "Photos and full guide"
  url: string;           // "https://mbr.com/..."
  type: "article" | "gallery" | "video";
}
```

Display as:
```
┌─────────────────────────────────────────┐
│ 🔗 MBR Magazine                         │
│                                         │
│ Trail Centre Guide: Afan Argoed         │
│ Photos, maps and full trail breakdown   │
│                                         │
│ [View on MBR →]                         │
└─────────────────────────────────────────┘
```

This:
- Acknowledges the source exists
- Drives traffic to them (good relationship)
- Avoids any copyright issues
- Looks professional

---

## Database: Image Sources

Track all external sources we reference:

```csv
slug,name,type,logo,base_url,contact_email,relationship,notes
mbr,MBR Magazine,publisher,/icons/mbr.png,https://mbr.com,editorial@mbr.com,none,UK MTB magazine
singletrack,Singletrack Magazine,publisher,/icons/singletrack.png,https://singletrackworld.com,,none,
visit-wales,Visit Wales,tourism,/icons/visit-wales.png,https://visitwales.com,,official,May have image library
nrw,Natural Resources Wales,government,/icons/nrw.png,https://naturalresources.wales,,official,Trail centre operator
```

---

## Priority Actions

### Immediate
1. ✅ Continue using Gallery Harvester for CC images
2. Build `<SourceCard>` component for commercial references
3. Create `/icons/` with publisher logos

### Short-term
4. Email 5-10 key photographers for permission
5. Contact Visit Wales about image library access
6. Set up Instagram/YouTube embed templates

### Long-term
7. Commission original photography for hero images
8. Build user-submitted photo feature
9. Partner with local photographers

---

## Attribution Display

### For CC images (on page):
```
📷 Photo: Jeremy Bolwell / CC BY-SA 2.0
```

### For CC images (in lightbox/full view):
```
Photo by Jeremy Bolwell
Licensed under Creative Commons BY-SA 2.0
Source: Geograph.org.uk
```

### For embedded content:
```
[Instagram/YouTube embed handles its own attribution]
```

### For source cards:
```
Content from MBR Magazine — View original →
```

---

## The MBR Example

For that Afan Argoed image from MBR:

**Option A (Bad):** Download and use it ❌

**Option B (OK):** Embed the Pinterest pin
```html
<iframe src="https://assets.pinterest.com/ext/embed.html?id=336784878395943053" 
        width="345" height="745"></iframe>
```

**Option C (Better):** Source card linking to MBR
```html
<SourceCard 
  source="MBR Magazine"
  title="Trail Centre Guide: Afan Argoed"
  description="Full photo gallery and trail guide"
  url="https://mbr.com/trail-centre-guide-afan-argoed"
/>
```

**Option D (Best):** Email MBR, ask permission, get approved, use with credit

---

## Summary

| Content Type | Strategy |
|--------------|----------|
| Location photos | CC images (Geograph, Wikimedia) |
| Action shots | Permission-based or Source Cards |
| Magazine content | Source Cards (link, don't copy) |
| Social content | Official embeds |
| Placeholders | AI-generated (marked as such) |
| Hero images | Commission or permission-based |
