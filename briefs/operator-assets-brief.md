# Operator Assets Brief
**Task:** Collect logos, hero images, and photos for all 46 Adventure Wales operators
**Output:** Download to `public/images/operators/` with consistent naming

---

## What We Need Per Operator

### 1. Logo (Priority: HIGH)
- **Format:** PNG with transparent background preferred, JPG acceptable
- **Size:** At least 200x200px, ideally square or landscape
- **Naming:** `{operator-slug}-logo.png`
- **Source:** Operator's website (usually in header, footer, or about page)
- **Fallback:** If no logo found, skip — don't create placeholder

### 2. Hero/Cover Image (Priority: HIGH)
- **Format:** JPG
- **Size:** At least 1200x600px, landscape orientation
- **Naming:** `{operator-slug}-hero.jpg`
- **Source:** Best photo from operator's website, Google Business, or social media
- **Criteria:** Action shot or scenic with their branding/location visible. Must look professional.

### 3. Gallery Images (Priority: MEDIUM)
- **Format:** JPG
- **Count:** Up to 4 per operator
- **Size:** At least 800x600px
- **Naming:** `{operator-slug}-gallery-01.jpg` through `{operator-slug}-gallery-04.jpg`
- **Source:** Operator website, Google Business photos, social media
- **Criteria:** Varied — activities in action, location shots, group shots, equipment

---

## Operator List

### Tier 1 — Premium (8 operators)
| Slug | Name | Website |
|------|------|---------|
| zip-world | Zip World | https://www.zipworld.co.uk |
| tyf-adventure | TYF Adventure | https://www.tyf.com |
| plas-y-brenin | Plas y Brenin | https://www.pyb.co.uk |
| adventure-britain | Adventure Britain | https://www.adventurebritain.com |
| bikepark-wales | BikePark Wales | https://www.bikeparkwales.com |
| snowdonia-mountain-guides | Snowdonia Mountain Guides | https://www.snowdoniamountainguides.co.uk |
| muuk-adventures | MUUK Adventures | https://www.muukadventures.co.uk |
| plas-menai | Plas Menai | https://www.plasmenai.co.uk |

### Tier 2 — Claimed (27 operators)
| Slug | Name | Website |
|------|------|---------|
| aberadventures | AberAdventures | https://www.aberadventures.co.uk |
| abersoch-sailing-school | Abersoch Sailing School | https://www.abersochsailingschool.co.uk |
| abersoch-watersports | Abersoch Watersports | https://www.abersochwatersports.co.uk |
| activity-pembrokeshire | Activity Pembrokeshire | https://www.activitypembrokeshire.wales |
| adventures-wales | Adventures Wales | https://www.adventureswales.co.uk |
| anglesey-adventures | Anglesey Adventures | https://www.angleseyadventures.com |
| antur-stiniog | Antur Stiniog | https://www.anturstiniog.com |
| black-mountain-adventure | Black Mountain Adventure | https://www.visitmidwales.co.uk |
| coed-y-brenin-nrw | Coed y Brenin (NRW) | https://naturalresources.wales |
| funsport-rhosneigr | Funsport Rhosneigr | https://www.funsportonline.co.uk |
| gecko-surf | Gecko Surf | https://www.geckosurf.co.uk |
| gower-activity-centres | Gower Activity Centres | https://www.goweractivitycentres.co.uk |
| hell-s-mouth-surf-school | Hell's Mouth Surf School | https://www.hellsmouthsurfschool.co.uk |
| llangennith-surf-school | Llangennith Surf School | https://www.llangennithsurf.co.uk |
| llangorse-multi-activity-centre | Llangorse Multi Activity Centre | https://www.llangorse.com |
| ll-n-adventures | Llŷn Adventures | https://www.llynadventures.co.uk |
| meadow-springs | Meadow Springs | https://www.visitmidwales.co.uk |
| mountainxperience | MountainXperience | https://www.mountainxperience.uk |
| one-planet-adventure-llandegla | One Planet Adventure (Llandegla) | https://www.oneplanetadventure.co.uk |
| outer-reef-surf-school | Outer Reef Surf School | https://www.outerreefsurfschool.com |
| oxwich-watersports | Oxwich Watersports | https://www.oxwichwatersports.co.uk |
| preseli-venture | Preseli Venture | https://www.preseliventure.co.uk |
| pro-kitesurfing | Pro Kitesurfing | https://www.prokitesurfing.co.uk |
| quest-adventure | Quest Adventure | https://www.questadventure.co.uk |
| rip-n-rock | Rip N Rock | https://www.ripnrock.co.uk |
| sealyham-activity-centre | Sealyham Activity Centre | https://www.sealyham.com |
| tenby-adventure | Tenby Adventure | https://www.visitpembrokeshire.com |

### Tier 3 — Stubs (11 operators)
| Slug | Name | Website |
|------|------|---------|
| beics-betws | Beics Betws | (needs research) |
| ma-simes-surf-hut | Ma Simes Surf Hut | (needs research) |
| paddles-and-pedals | Paddles & Pedals | (needs research) |
| summit-to-sea-hire | Summit to Sea Hire | (needs research) |
| pinnacle-cafe | The Pinnacle Café | (needs research) |
| pen-y-gwryd-hotel | The Pen-y-Gwryd Hotel | (needs research) |
| stackpole-inn | The Stackpole Inn | (needs research) |
| snowdon-sherpa | Snowdon Sherpa | (needs research) |
| celtic-trail-shuttle | Celtic Trail Cycle Shuttle | (needs research) |
| pembrokeshire-coastal-bus | Pembrokeshire Coastal Bus | (needs research) |
| caffi-caban | Caffi Caban | (needs research) |

---

## Output Structure
```
public/images/operators/
├── zip-world-logo.png
├── zip-world-hero.jpg
├── zip-world-gallery-01.jpg
├── zip-world-gallery-02.jpg
├── tyf-adventure-logo.png
├── tyf-adventure-hero.jpg
└── ...
```

## After Download
The DB needs updating to reference the images:
- `operators.logo_url` → `/images/operators/{slug}-logo.png`
- `operators.cover_image` → `/images/operators/{slug}-hero.jpg`

## Priority Order
1. **Tier 1 first** (8 premium operators) — these are featured most prominently
2. **Tier 2 next** (27 claimed operators)
3. **Tier 3 last** (11 stubs — may not have good assets)

## Rules
- Only use images that are publicly available on the operator's own channels
- Don't use stock photos or AI-generated images for operator logos
- If a website is down or has no usable images, note it in a skip list
- Optimise images: max 500KB per logo, max 1MB per hero/gallery image
- Strip EXIF data for privacy
