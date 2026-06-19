# Blocked / Ambiguous Operators Evidence Pack

Generated: 2026-06-04
Task: `t_cd975a5c` / `operator evidence pack`
Scope: Evidence synthesis only. No production pages edited.

## Executive recommendations

| Content item | Real-world status | Recommendation |
|---|---|---|
| `operator-snowdonia-mtb-days` | Identity ambiguous. No public operator found under exact name. Closest match is Snowdonia MTB Events, an event organiser rather than a general operator. | Keep blocked. Human-permission-only until internal source or operator confirmation identifies the intended business. If confirmed as Snowdonia MTB Events, rename/slug accordingly. |
| `operator-adventure-parc-snowdonia` | Real active venue, but materially changed. Current Adventure Parc is open; the old Surf Snowdonia artificial wave pool is not operating. | Strategic / QA-needed, not blocked. Publish only as current Adventure Parc activities/accommodation; urgently fix or block any surfing/surf-lagoon content. Images require operator permission. |
| `operator-adrenaline-mtb` | No verified Wales operator found. | Remove/archive unless internal commercial data proves existence. |
| `operator-black-mountain-activities` | Real business, but likely duplicate/mismatch with Black Mountain Adventure. | Block pending merge/redirect decision. Use `Black Mountain Adventure` as customer-facing canonical unless MK decides otherwise. |
| `operator-celtic-trail-shuttle` | No verified active business found. Likely invented/legacy/dormant service. | Remove/archive unless tourism/Sustrans/TIC confirms current operator. Human-permission-only if retained. |
| `operator-ciww` | Real operator, but duplicate of Cardiff International White Water canonical item. | Retire/redirect `/directory/ciww` to `/directory/cardiff-international-white-water`; no standalone page. |
| `operator-gaynor-lee-coaching` | Identity unverifiable as a Welsh adventure operator. Closest candidate is unrelated England-based GH Coaching Services. | Remove/archive unless internal source confirms a Welsh operator and gets permission. |
| `operator-gethin-woods-bike-park` | Real venue identity = BikePark Wales at Gethin Woodland Centre. Duplicate of strategic BikePark Wales entry. | Merge into `operator-bikepark-wales`; retire/redirect Gethin Woods slug unless needed as an alias. |
| `operator-gone-mountain-biking` | Only verified business is North Yorkshire / Dalby Forest, not Wales. | Remove/archive from Adventure Wales unless explicit Wales offering is confirmed. |

## Evidence by operator

### 1. Snowdonia MTB Days — `operator-snowdonia-mtb-days`

Current inventory status: `blocked`

Finding: content mismatch / unverified identity.

Evidence:
- Existing research file: `data/research/content-ops/operator-snowdonia-mtb-days.json`
- Exact-name searches in the existing research found no public operator trading as `Snowdonia MTB Days`.
- Guessed domains `snowdoniamtbdays.co.uk` and `snowdoniamtbdays.com` were unreachable in the existing research.
- Fresh direct source check: SiEntries event page `https://www.sientries.co.uk/event.php?elid=Y&event_id=14287` is live and titled `Snowdonia MTB Challenge`. Its meta description says: “We’re excited to announce the return of our mountain biking events in the breathtaking Snowdonia National Park...” This supports `Snowdonia MTB Events` / `Snowdonia MTB Challenge`, not the exact directory name `Snowdonia MTB Days`.
- Existing sources list closest candidates:
  - `https://www.facebook.com/snowdoniamtbevents/?locale=en_GB` — Snowdonia MTB Events candidate.
  - `https://www.facebook.com/mtbsnowdonia/` — MTB Snowdonia Guiding candidate.
  - `https://www.britishcycling.org.uk/events/details/156912/The-Snowdonia-MTB-Challenge` — event listing candidate.
  - `https://www.mbwales.com/agents/north-snowdonia/` — Mountain Bike Wales North Snowdonia page; existing research notes exact name not listed.
  - `https://www.visitwales.com/things-do/adventure-and-activities/cycling-and-mountain-biking/great-places-guided-mountain-bike-holiday` — Visit Wales guided MTB page; existing research notes exact name not listed.

Decision:
- Do not publish as `Snowdonia MTB Days`.
- Treat as human-permission-only: ask MK/internal data owner where this slug came from.
- If it means Snowdonia MTB Events, rename the operator to the real public name and classify as event organiser, not a generic MTB-days operator.
- If it means MTB Snowdonia Guiding, build a new verified listing for that business instead.

### 2. Adventure Parc Snowdonia — `operator-adventure-parc-snowdonia`

Current inventory status: `qa_needed`

Finding: real active venue, but old surf-lagoon content is now misleading.

Evidence:
- Existing research file: `data/research/content-ops/operator-adventure-parc-snowdonia.json`
- Fresh direct source check: official home page `https://www.adventureparc.co.uk/` is live. Title: `Adrenaline Indoors | Outdoor Fun | Adventure Parc in Snowdonia`. Meta description describes an activity centre with indoor/outdoor activities.
- Fresh direct source check: official plan page `https://www.adventureparc.co.uk/plan-your-visit/` explicitly says: “Unfortunately, the artificial Surf Snowdonia wave pool that was in operation under previous management is no longer open, but we have a host of adrenaline-fuelled indoor and outdoor activities you can try.”
- Fresh direct source check: official contact page `https://www.adventureparc.co.uk/contact-us/` is live and supports current trading.
- Fresh direct source check: North Wales Pioneer reopening article `https://www.northwalespioneer.co.uk/news/25504220.reimagined-adventure-parc-officially-opens-doors/` says the site was once home to the world’s first inland surf lagoon, closed suddenly in September 2023, Zip World later reopened it as Zip World Conwy then closed, and Interesting Hotels Group took ownership/reopened a reimagined Adventure Parc.
- Existing research flags `data/combo-pages/snowdonia--surfing.json` as high-risk because it describes the artificial wave lagoon in present tense.

Decision:
- Keep as strategic / QA-needed, not removed.
- Publish only if page copy describes the current offer: Adventure Pods, indoor action zones, soft play, pickleball, group activities, food/accommodation/spa context.
- Do not promote it as Surf Snowdonia or as a working artificial wave lagoon.
- Add a prominent editorial warning before publishing any Snowdonia surfing content: artificial lagoon closed; current venue is not a surf park.
- Images/logos remain human-permission-only because official site assets are copyright Interesting Hotels Group / Adventure Parc.

### 3. Adrenaline MTB — `operator-adrenaline-mtb`

Current inventory status: `blocked`

Finding: no verified Welsh business.

Evidence:
- Existing research file: `data/research/content-ops/operator-adrenaline-mtb.json`
- Existing research found no Visit Wales listing, TripAdvisor listing, MBWales operator entry, Google Business profile, UK company registration, website, phone, email, or Wales-based social profile for `Adrenaline MTB`.
- Existing research checked likely domains: `adrenalinemtb.co.uk`, `adrenaline-mtb.co.uk`, `adrenalinemtb.wales`, `adrenalinemtb.com`; all unreachable.
- Existing research found `https://www.facebook.com/adrenalinemtb/`, but identified it as Adrenaline MTB NZ Ltd, a New Zealand MTB parts retailer, not a Wales operator.

Decision:
- Remove/archive unless MK has an internal commercial source proving a Wales operator exists.
- Do not build a lure page; no verified identity, geography, contact, or image base.

### 4. Black Mountain Activities — `operator-black-mountain-activities`

Current inventory status: `blocked`

Finding: real operator, but likely duplicate/canonical-name issue.

Evidence:
- Existing research file: `data/research/content-ops/operator-black-mountain-activities.json`
- Official website: `https://www.blackmountain.co.uk`
- Companies House: `https://find-and-update.company-information.service.gov.uk/company/04659715` confirms `BLACK MOUNTAIN ACTIVITIES LIMITED`.
- HSE AALA listing: `https://aala.hse.gov.uk/aala/provider_detail.php?ref_no=R0704` confirms licensed provider status per existing research.
- Visit Wales listing: `https://www.visitwales.com/activity/activity/black-mountain-activities-529181`
- National Park / regional listing: `https://bannaubrycheiniog.org/businesses/black-mountain-adventure/`
- Existing research says the public trading/canonical brand is `Black Mountain Adventure`; `Black Mountain Activities` is the legal/company name and appears in some listings.
- Existing research flags a duplicate or near-duplicate directory item `/directory/black-mountain-adventure`.

Decision:
- Keep blocked until canonical slug decision.
- Recommended canonical display: `Black Mountain Adventure`, with legal name recorded as `BLACK MOUNTAIN ACTIVITIES LIMITED`.
- Merge/redirect `/directory/black-mountain-activities` to `/directory/black-mountain-adventure`, unless MK wants the legal-name slug for a specific SEO reason.
- Images/logos require direct permission.

### 5. Celtic Trail Cycle Shuttle — `operator-celtic-trail-shuttle`

Current inventory status: `blocked`

Finding: unverifiable operator.

Evidence:
- Existing research file: `data/research/content-ops/operator-celtic-trail-shuttle.json`
- Existing research searched Visit Wales, Visit Wales TravelTrade, Sustrans / Walk Wheel Cycle Trust Celtic Trail page, Epic Road Rides, Cycling UK forums, Drover Holidays, Walkalongway, tourism sources, and general web sources.
- No active website, contact details, address, logo, images, tourism listing, or social profile for `Celtic Trail Cycle Shuttle` / `Celtic Trail Shuttle` were found.
- Existing research found related but different businesses/services:
  - Drover Holidays: self-guided Celtic Trail cycling holidays with luggage transfer.
  - Walkalongway: luggage transfer, primarily walking-focused.
  - Sustrans / Walk Wheel Cycle Trust: route information, not an operator listing.

Decision:
- Remove/archive as likely legacy, invented, or dormant.
- If MK believes it is real, treat as human-permission-only and verify through Pembrokeshire/Carmarthenshire TICs or Sustrans Wales before publishing.
- Do not use generic Celtic Trail images on an operator listing unless the listing is reframed as route content, not a business profile.

### 6. CIWW — `operator-ciww`

Current inventory status: `blocked`

Finding: real operator, duplicate slug.

Evidence:
- Existing research file: `data/research/content-ops/operator-ciww.json`
- Existing canonical research file: `data/research/content-ops/operator-cardiff-international-white-water.json`
- Fresh direct source check: official website `https://www.ciww.com` is live. Title: `Cardiff International White Water: Family Friendly, Stag & Hen Parties, Team Building Paddlesport Activities In Cardiff`.
- Fresh direct source check: official page text includes `Call Us 029 2082 9970`, `Email info@ciww.com`, and `Cardiff International White Water Watkiss Way Cardiff Bay CF11 0SY`.
- Existing research says `operator-ciww` and `operator-cardiff-international-white-water` both represent the same physical operator.
- Existing research says duplicate originated from different internal CSV sources using different slug formats.

Decision:
- Do not create a standalone `/directory/ciww` page.
- Recommended canonical: `/directory/cardiff-international-white-water`.
- Redirect `/directory/ciww` to canonical if route can render live.
- Keep all content work against the canonical `operator-cardiff-international-white-water` item.

### 7. Gaynor Lee Coaching — `operator-gaynor-lee-coaching`

Current inventory status: `blocked`

Finding: unverified identity / likely data mismatch.

Evidence:
- Existing research file: `data/research/content-ops/operator-gaynor-lee-coaching.json`
- Existing research found no Welsh outdoor/adventure business under `Gaynor Lee Coaching` across web search, Companies House, Visit Wales portals, social media, Archery GB, or NGB sources.
- Closest candidate in existing research: GH Coaching Services at `https://ghcoachingservices.wixsite.com/my-site-1/about-gaynor`, operated by Gaynor Hutchison, based in Bedfordshire/Hertfordshire. Different surname, different geography, not confirmed as a Welsh operator.
- Existing Companies House/officer checks did not confirm a relevant active Welsh business.

Decision:
- Remove/archive unless internal source identifies a Wales-based operator.
- If retained, it is human-permission-only: confirm identity, Wales connection, activity type, contact details, and consent before any content/image work.

### 8. Gethin Woods Bike Park — `operator-gethin-woods-bike-park`

Current inventory status: `blocked`

Finding: real place, but duplicate of BikePark Wales.

Evidence:
- Existing research file: `data/research/content-ops/operator-gethin-woods-bike-park.json`
- Existing research identifies the real-world entity as BikePark Wales at Gethin Woodland Centre / Gethin Forest.
- Existing sources include:
  - `https://www.visitwales.com/activity/activity/bikepark-wales-529131`
  - `https://www.visitmerthyr.co.uk/things-to-do/attractions/bikepark-wales/`
  - `https://www.mbwales.com/agents/bikepark-wales/`
  - `https://www.breconbeaconstourism.org/business/bike-park-wales/`
  - `https://naturalresources.wales/about-us/news-and-blogs/news/future-forest-vision-for-gethin-forest-and-bikepark-wales-takes-root/?lang=en`
- Existing research says inventory already contains `operator-bikepark-wales` at `/directory/bikepark-wales`, tiered as strategic/launch priority.

Decision:
- Merge into `operator-bikepark-wales`.
- Retire or redirect `/directory/gethin-woods-bike-park` unless it is intentionally used as an alias for search demand.
- Do not publish as a separate operator; it would split authority and duplicate the same business.

### 9. Gone Mountain Biking — `operator-gone-mountain-biking`

Current inventory status: `blocked`

Finding: geography mismatch.

Evidence:
- Existing research file: `data/research/content-ops/operator-gone-mountain-biking.json`
- Existing research found only one public business under this name: `Gone Mountain Biking`, based in Pickering, North Yorkshire, England, operating around Dalby Forest / North York Moors.
- Existing research sources:
  - `https://www.gonemountainbiking.com/` — official domain, offline/ECONNREFUSED at research time.
  - `http://gonemountainbiking.blogspot.com/` — associated Blogspot, confirms Pickering / North Yorkshire focus and phone `01751 475111`.
  - `https://www.facebook.com/gonemountainbiking/`
  - `https://www.instagram.com/gonemountainbiking/`
  - `https://twitter.com/gonemtbing`
  - `https://www.mbwales.com/agents/` — not listed in Wales operator directory.
  - `https://www.visitwales.com/things-do/adventure-and-activities/cycling-and-mountain-biking/great-places-guided-mountain-bike-holiday` — not listed.

Decision:
- Remove/archive from Adventure Wales unless MK has explicit evidence that the North Yorkshire operator runs Wales trips.
- Do not publish North Yorkshire contact details on a Wales listing.
- Do not use generic Wales MTB imagery to mask the mismatch.

## Production action queue recommended from this evidence

1. Immediate editorial safety fix: block or rewrite Snowdonia surfing content that presents Adventure Parc / Surf Snowdonia lagoon as active.
2. Deduplicate canonical operators:
   - `operator-ciww` -> `operator-cardiff-international-white-water`
   - `operator-gethin-woods-bike-park` -> `operator-bikepark-wales`
   - `operator-black-mountain-activities` -> likely `operator-black-mountain-adventure`
3. Archive likely invalid/unverified items unless internal commercial source exists:
   - `operator-adrenaline-mtb`
   - `operator-celtic-trail-shuttle`
   - `operator-gaynor-lee-coaching`
   - `operator-gone-mountain-biking`
4. Human-permission-only identity checks:
   - `operator-snowdonia-mtb-days` — confirm whether intended operator is Snowdonia MTB Events, MTB Snowdonia Guiding, or another source.

## Source files consulted

- `content/ops/content-inventory.json`
- `data/research/content-ops/operator-snowdonia-mtb-days.json`
- `data/research/content-ops/operator-adventure-parc-snowdonia.json`
- `data/research/content-ops/operator-adrenaline-mtb.json`
- `data/research/content-ops/operator-black-mountain-activities.json`
- `data/research/content-ops/operator-celtic-trail-shuttle.json`
- `data/research/content-ops/operator-ciww.json`
- `data/research/content-ops/operator-gaynor-lee-coaching.json`
- `data/research/content-ops/operator-gethin-woods-bike-park.json`
- `data/research/content-ops/operator-gone-mountain-biking.json`

Fresh direct source checks performed via HTTP against official/operator/tourism/news URLs where needed. General web search was unavailable in this Hermes run because web tools are not configured, so this pack relies on existing research outputs plus direct source verification of listed URLs.
