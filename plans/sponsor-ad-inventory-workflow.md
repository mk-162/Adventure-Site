# Adventure Wales Sponsor + Ad Inventory Workflow

Date: 2026-06-04
Source: `Brief.md` commercial system, `Jules-Audit/commercial-strategy.md`, `plans/claim-listing-mvp.md`, `content/operators.csv`, `content/commercial-partners.csv`, `plans/ready_to_integrate_partners.csv`, `content/ops/content-inventory.csv`.

Note: Playbook MCP lookup was attempted first as required for 162 work, but `mcporter call playbook...` returned `Unknown MCP server 'playbook'`. This workflow uses the local Adventure Wales repo evidence instead.

## 1. Commercial model in one line

Adventure Wales should sell context, not banner space.

The valuable inventory is not generic impressions. It is high-intent placement inside region pages, activity pages, itineraries, operator profiles, answer pages, service grids, and trip-planning journeys where a visitor is already deciding what to book, where to stay, how to travel, what to hire, and who to trust.

## 2. Inventory waterfall

Every monetisable slot should use the same priority order:

1. Direct campaign
   - Highest value.
   - Sold to a named advertiser/sponsor for a fixed page, region, activity, slot, or season.
   - Examples: Zip World sponsors Snowdonia zip-lining; Cotswold Outdoor sponsors hiking kit guides.

2. Premium operator rotation
   - For paid/premium local operators.
   - Rotates by region + activity relevance where no direct campaign is booked.
   - Examples: premium operator spotlight after 3rd activity card; itinerary day sponsor.

3. Affiliate widget/link
   - For commercially useful support services where a direct local sponsor is not yet signed.
   - Examples: Booking.com accommodation, Trainline rail, Rentalcars/Discover Cars car hire, GetYourGuide/Viator experiences, Cotswold/Snow+Rock/Amazon gear.

4. Programmatic backfill
   - Lowest value.
   - Only fills remnant display slots where relevance is weak or unsold.
   - Do not use on operator pages or premium sponsored sections.

5. No monetisation
   - Use when trust matters more than revenue.
   - Examples: safety advice, emergency info, source/reference sections, paid operator profile pages.

## 3. Page slot matrix

| Page type | Primary slots | Best commercial use | Fallback | Notes |
|---|---|---|---|---|
| Homepage | `hero_banner`, `featured_sponsor`, `newsletter_sponsor`, `footer_banner` | One broad Wales-wide launch sponsor, newsletter sponsor, seasonal brand campaign | Affiliate hero/search modules; programmatic footer only | Keep homepage premium. Avoid clutter. One major sponsor max above fold. |
| Region hub | `hero_banner`, `sidebar_mpu`, `in_content_1`, `in_content_2`, `operator_spotlight`, service grid | Region sponsor, local operator spotlight, accommodation/transport/service slots | Premium operator rotation, Booking.com/Trainline/Rentalcars widgets, programmatic MPU | Highest direct sales page type after itineraries because user intent is broad but local. |
| Activity listing | `top_banner`, `sidebar_mpu`, `featured_operator` after 3rd card, `bottom_banner`, service grid | Activity-specific sponsor or premium operator rotation | Affiliate gear/products/activity widgets; programmatic bottom only | Best for operator acquisition: “you can own the featured slot on this page.” |
| Single itinerary | `hero_sponsor_badge`, `day_sponsor`, `accommodation_partner`, `booking_cta`, PDF/email sponsor | Itinerary sponsorship, day-by-day operator placements, full-trip package partners | Accommodation, car hire, rail, activity affiliate CTAs | Most valuable context. Sell as “part of a planned trip,” not as an ad. |
| Single activity/experience | Booking card, similar experiences, operator info, offers | Operator’s own booking/offer only; upgrade prompts if stub/claimed | None, except internal similar-experience links | No third-party ads. Their page should convert or claim/upgrade. |
| Operator directory | `featured_partners`, claim CTA every 10 listings, category sponsor | Premium partner rotation, claim funnel, category sponsor | None or low-key programmatic after pagination | Useful for acquisition; do not dilute featured partners with generic ads. |
| Operator profile - stub | Claim banner, blurred/limited images, “upgrade to unlock bookings” | Claim listing CTA | None | This is a sales asset, not ad inventory. Push claim/upgrade. |
| Operator profile - claimed | Verified badge, contact links, limited offers | Premium upgrade CTA | None | Claimed is trust + conversion baseline. Do not show competitor ads. |
| Operator profile - premium | Offers, booking links, itinerary appearances, analytics promise | Operator’s own direct conversion | None | Premium page is ad-free. If we sell competitor ads here, we undermine the paid tier. |
| Accommodation listing | Featured property, booking partner strip, map/list cards | Accommodation sponsor or premium local stays | Booking.com/Vrbo/Expedia widgets | Strong affiliate page. Also a good target for local accommodation groups. |
| Events page | Featured event, event category sponsor, newsletter sponsor | Event sponsor, organiser upgrade, gear/transport sponsor | Ticketing/transport affiliate; programmatic bottom only | Time-sensitive inventory. Sell by season/month. |
| Answer/FAQ page | `sidebar_mpu`, `bottom_banner`, related itinerary CTA, service/gear link block | Topic-specific affiliate/direct sponsor | Programmatic sidebar/bottom | Keep answer clean. Monetise after quick answer, not before it. |
| Trip planner | Step-based service prompts, generated itinerary booking CTA, save/share email sponsor | High-value direct packages, concierge, transport/accommodation/activity partners | Affiliate widgets where no direct sponsor exists | Long-term highest value because the user reveals intent. Requires approval before aggressive monetisation. |
| Guide/editorial page | In-content sponsor, gear/service block, related itinerary CTA | Gear, insurance, travel, activity platform sponsors | Affiliate products; programmatic bottom | Needs editorial labelling: “Partner pick” / “Sponsored.” |

## 4. Slot setup rules by table

Use the existing commercial schema from `Brief.md` like this:

### `operators`
- `claim_status = stub`: minimal listing, no booking link, strong “claim this listing” CTA.
- `claim_status = claimed`: verified, contact/website visible, normal directory inclusion, no featured placements.
- `claim_status = premium`: eligible for featured placements, itinerary inclusion, hero CTA slots, offers, and analytics reporting.

### `ad_slots`
- Defines what slots exist by page type.
- Use `min_priority` as the lowest acceptable fill:
  - `direct`: only sold direct campaigns. Leave empty otherwise.
  - `affiliate`: direct or affiliate only. No low-quality programmatic.
  - `programmatic`: can backfill if unsold.
  - `none`: slot disabled for trust-sensitive pages.

### `page_ads`
- Use for page-specific display placements: hero banners, MPUs, link lists.
- Good for fixed direct campaigns and curated affiliate modules.

### `page_sponsors`
- Use when a page or itinerary has a named sponsor.
- If `exclude_other_ads = true`, suppress all competing inventory on that page.
- Use this for premium direct sponsorships where exclusivity is part of the value.

### `service_slots`
- Use as the practical monetisation layer.
- Configure in this cascade:
  1. location-specific
  2. region-specific
  3. activity-specific
  4. global default
- Service types: transfers, accommodation, rental, lessons, guides, holidays, experiences.
- Most commercial pages should show 3-6 contextually useful service slots, not a random ad stack.

## 5. Direct vs premium vs affiliate vs backfill rules

### Use direct campaigns when:
- The page has clear commercial intent and enough traffic or strategic value to justify outreach.
- The buyer can own a context: region, activity, itinerary, event season, or guide topic.
- The placement could be sold as exclusivity or “featured partner” rather than a generic ad.
- Examples:
  - Snowdonia region sponsor.
  - Mountain biking in Snowdonia sponsor.
  - 3-Day Snowdonia Adventure Weekend itinerary sponsor.
  - Events & Races newsletter sponsor.

### Use premium operator rotation when:
- The slot naturally points to a local operator.
- Multiple premium partners could be relevant and fairness/coverage matters.
- The page is activity or region-specific.
- Examples:
  - Featured operator after 3rd activity card.
  - Local operators sidebar on region pages.
  - Day sponsor on itinerary pages.

### Use affiliate widgets when:
- The user needs a supporting service but there is no signed direct sponsor yet.
- The service has good API/feed coverage and low integration friction.
- The page is practical planning content: accommodation, transport, car hire, gear, booking platforms, attractions.
- Examples:
  - Booking.com on accommodation pages.
  - Trainline on “getting there” sections.
  - Rentalcars/Discover Cars on road trip itineraries.
  - GetYourGuide/Viator on activity discovery pages.
  - Cotswold Outdoor/Snow+Rock/Amazon on gear guides.

### Use programmatic backfill when:
- The slot is display-only and would otherwise be empty.
- The page is not sponsorable yet.
- The placement is below primary content and cannot damage trust.
- Never make programmatic the main commercial plan. It is remnant revenue only.

### Use no ads when:
- The page is a paid operator’s own profile.
- The content is safety-critical.
- The placement would show competitor services beside a paid partner.
- The user is at a sensitive conversion point where an ad could reduce booking/claim conversion.

## 6. Likely first 20 sponsor/ad opportunities

These are the first commercial opportunities to validate because they combine existing content/data, obvious buyer fit, and high-intent page context.

| # | Opportunity | Type | Target page/context | Why first | First action |
|---|---|---|---|---|---|
| 1 | Zip World | Direct sponsor / premium operator | Snowdonia zip-lining, Snowdonia region, itinerary adventure weekend | Existing operator data, major brand, strong reviews, iconic activity | Treat as strategic big player; build/QA premium profile before outreach. |
| 2 | TYF Adventure | Direct sponsor / premium operator | Pembrokeshire coasteering, sea kayaking, surfing, operator profile | B Corp, coasteering origin story, high trust | Build premium lure page; pitch “own Pembrokeshire coasteering context.” |
| 3 | Preseli Venture | Premium operator + accommodation/service slots | Pembrokeshire coasteering/surfing/kayaking, eco-accommodation | Combines activities + stays, good fit for itineraries | Offer premium operator + accommodation partner placement. |
| 4 | Plas y Brenin | Direct sponsor / education partner | Snowdonia climbing, kayaking, hill walking, courses | National Outdoor Centre, training authority | Pitch skills/course placement rather than casual day-trip booking. |
| 5 | Adventure Britain | Premium operator | Brecon Beacons/Gower canyoning, caving, gorge walking, groups | Broad activities, groups/corporate angle | Build region/activity package placement. |
| 6 | BikePark Wales | Direct sponsor / premium operator | Brecon Beacons MTB, MTB guides, bike hire/coaching | UK’s largest bike park, strong brand | Pitch MTB hub sponsorship and featured operator treatment. |
| 7 | Coed y Brenin / NRW | Strategic content partner | Snowdonia mountain biking, trail running, walking | Foundational MTB centre; likely not classic paid sponsor | Treat as authority content partner; use to build credibility. |
| 8 | Beics Brenin | Direct sponsor / service slot | Coed y Brenin / Snowdonia mountain biking, bike hire | Existing research task and MTB service relevance | Pitch bike hire/service slot on MTB pages. |
| 9 | Antur Stiniog | Premium operator / direct sponsor | Snowdonia MTB/downhill, bike hire | Launch-priority operator already in task queue | Build premium page; pitch featured MTB operator. |
| 10 | Snowdonia Watersports | Premium operator / service slot | Snowdonia kayaking, SUP, Bala/Llyn Padarn water content | Existing research output; service coverage | Pitch water activity partner slot once QA clears missing fields. |
| 11 | Bala Watersports | Premium operator / service slot | Bala/Snowdonia kayaking, sailing, watersports | Existing research output, AALA evidence | Pitch watersports featured placement and activity page rotation. |
| 12 | Adventure Parc Snowdonia | Strategic big player / direct sponsor | Surfing, accommodation, Snowdonia region | Launch-visible strategic operator but status needs commercial review | MK decision required due closure/rebrand uncertainty before outreach. |
| 13 | Snowdonia Mountain Guides | Premium operator | Snowdonia hiking, scrambling, guiding service slots | Operator task exists; strong guide service fit | Build/QA lure profile; pitch guide service placement. |
| 14 | Booking.com | Affiliate accommodation feed | Where-to-stay pages, itinerary accommodation partners | Priority “start here” affiliate; easy integration | Apply/activate affiliate account; add as default accommodation fallback. |
| 15 | GetYourGuide | Affiliate activity feed | Activity pages, experience widgets, itinerary alternatives | Strong API/feed and base commission | Apply/activate; use as activity fallback where local direct missing. |
| 16 | Viator | Affiliate activity backup | Activity pages and attraction widgets | TripAdvisor trust, broad inventory | Apply as backup/alternative to GetYourGuide. |
| 17 | Trainline | Affiliate transport | Getting-there sections, itinerary transport steps | Wales travel planning needs practical rail options | Add rail service slot for car-free itineraries and region hubs. |
| 18 | Rentalcars.com / Discover Cars | Affiliate car hire | Itineraries, road-trip content, region hubs | Wales adventure travel often requires car access | Use Rentalcars via Booking first; Discover Cars as higher-commission comparison. |
| 19 | Cotswold Outdoor / Snow+Rock | Direct or affiliate gear | Hiking, climbing, camping, gear guides, answer pages | Strong fit for outdoor kit recommendations | Start affiliate; later pitch direct seasonal gear sponsor. |
| 20 | Wetsuit Outlet / Surfdome | Affiliate gear | Surfing, coasteering, SUP, kayaking pages | Specific product fit for water activities | Add to water-sport gear/service slots. |

## 7. Outreach workflow

### Phase 1 — prepare sellable inventory
1. Pick 5 launch pages where commercial context is obvious:
   - Snowdonia region hub
   - Snowdonia mountain biking
   - Snowdonia zip-lining
   - Pembrokeshire coasteering
   - 3-Day Snowdonia Adventure Weekend itinerary
2. For each page, define:
   - available slots
   - allowed fill type
   - buyer categories
   - exclusivity rule
   - fallback if unsold
3. Mark every slot with one of: `direct_only`, `direct_or_premium`, `affiliate_ok`, `programmatic_ok`, `disabled`.
4. QA the top operator profiles linked to those pages before outreach.
5. Create a one-page media sheet for each sponsorable context.

### Phase 2 — build lure assets
1. For local operators, build premium-quality pages before outreach.
2. Keep ordinary unpaid operators as stubs unless they are strategic big players or launch-critical.
3. Capture source URLs, image provenance, claims, contact details, and commercial-review notes.
4. Show operators the page as “we’ve built this, here’s where it can appear, here’s what premium unlocks.”

### Phase 3 — launch affiliate baseline
1. Apply for Booking.com, GetYourGuide, Viator, Trainline, Rentalcars/Discover Cars, Cotswold Outdoor/Snow+Rock, Wetsuit Outlet/Surfdome.
2. Add affiliate widgets only where useful to the user.
3. Track click positions by page type and service type.
4. Use affiliate click data to identify direct sponsorship prospects.

### Phase 4 — sell direct campaigns
1. Start with high-context offers, not generic banners:
   - “Own the featured operator slot on Snowdonia mountain biking.”
   - “Sponsor the 3-Day Snowdonia Adventure Weekend itinerary.”
   - “Be the accommodation partner for Snowdonia adventure weekends.”
2. Offer 30-90 day launch packages while traffic is still being proven.
3. Include screenshots/mockups and the premium page link.
4. Record status in the commercial control plane: `New → Research → Page Built → Emailed → Replied → Paid / Declined`.

## 8. Suggested launch package structure

### Claimed listing
- Free/low friction.
- Verified badge.
- Contact details and website visible.
- Basic photos.
- No featured placements.
- Purpose: convert stubs into a reachable operator base.

### Premium partner
- Paid monthly/annual partner tier.
- Full profile.
- Booking links.
- Special offers.
- Featured placement eligibility.
- Itinerary inclusion.
- Basic analytics in future: appearances, clicks, leads.

### Direct campaign / sponsorship
- Fixed campaign package.
- Sold by context, season, or page group.
- Can include exclusivity.
- Can include sponsor badge, hero/banner, newsletter placement, itinerary PDF/email placement, and service slot.

### Affiliate baseline
- Always-on fallback for practical user needs.
- Used to monetise gaps before local direct sponsors sign.
- Should be clearly labelled and never displace local paid partners.

### Programmatic backfill
- Remnant only.
- Use carefully, below primary content.
- Do not allow it to make Adventure Wales feel like a generic ad site.

## 9. What MK needs to approve before outreach

1. Commercial positioning
   - Confirm the sell is “high-intent adventure planning context,” not display advertising.

2. Pricing and packages
   - Claimed listing price: free or low-cost?
   - Premium partner price: use existing `£29/month` from `Brief.md` claim page, or revise upward for launch?
   - Direct campaign pricing: fixed monthly, seasonal, or sponsor-by-page package?

3. Tier rules
   - Which unpaid operators can receive a full premium lure page before paying?
   - Which “big players” get strategic treatment without immediate outreach?
   - Whether secondary operators can ever become premium, or only primary activity providers.

4. Exclusivity policy
   - Can one sponsor own a page/activity/region?
   - If yes, for how long and at what premium?
   - Should `page_sponsors.exclude_other_ads` be used for sponsor pages by default?

5. Outreach sequence
   - Approve the first 10 local operator targets.
   - Decide whether MK wants to contact big players manually first or let the system send standard lure emails.

6. Affiliate programme applications
   - Confirm who owns affiliate accounts and where IDs/keys live.
   - All keys/IDs must go in `.env`, not docs or committed files.

7. Labelling and trust rules
   - Decide exact labels: “Featured Partner,” “Sponsored,” “Partner Pick,” “Affiliate link.”
   - Agree no competitor ads on paid operator pages.

8. Data and reporting promise
   - Approve what can be promised now versus later.
   - Safe now: “featured placement” and “click tracking if implemented.”
   - Do not promise dashboard analytics until built.

9. Lead handling
   - Decide whether bookings go direct to operators, affiliate partners, or an Adventure Wales enquiry form.
   - Decide whether “concierge service” is in or out for MVP.

10. Commercial review owner
   - Name who signs off sponsor placement, affiliate placement, operator tier upgrades, and page exclusivity before they go live.

## 10. Immediate next actions

1. Create `content/ops/commercial-inventory.csv` with one row per slot:
   - page_type
   - page_slug
   - slot_name
   - slot_group
   - allowed_fill_types
   - current_fill_type
   - current_partner
   - fallback_partner
   - exclusivity_allowed
   - sponsor_value_score
   - status
   - owner
   - notes

2. Create a first-batch sponsor sheet with the 20 opportunities above.

3. QA the top 10 local operator pages before outreach.

4. Apply for affiliate programmes in this order:
   - Booking.com
   - GetYourGuide
   - Viator
   - Trainline
   - Rentalcars.com / Discover Cars
   - Cotswold Outdoor / Snow+Rock
   - Wetsuit Outlet / Surfdome

5. Build one sponsor pitch template per route type:
   - Region sponsor
   - Activity sponsor
   - Itinerary sponsor
   - Premium operator upgrade
   - Service slot partner

## 11. Quality gates

Before any sponsor/ad goes live:
- Slot has a defined owner and fill type.
- Sponsor does not conflict with the page’s primary operator or trust promise.
- Page content and image provenance are QA’d.
- Affiliate links are labelled.
- Direct sponsor exclusivity is recorded.
- No secrets, API keys, affiliate IDs, or private credentials are committed.
- User value is clear: the placement helps the visitor plan, book, travel, stay, hire, learn, or compare.
