# AW Launch-Critical Operator Commercial Review

Kanban task: `t_a4e38da4`
Date: 2026-06-04

## Basis

This classification uses the commercial model documented in:

- `Brief.md` — stub / claimed / premium tiers, ad slot waterfall, service slot model.
- `docs/ADVENTURE-WALES-COMMAND-CENTRE.md` — commercial classification workflow and acceptance gates.
- `STRATEGY.md` and `plans/content-overhaul-priority-queue.md` — Tier 1 destination-draw rules and launch blocker priority.
- Existing research JSON where present under `data/research/content-ops/`.
- Existing operator seed data in `content/operators.csv` where research JSON is not yet present.

Commercial rule applied: big destination draws can receive strong public pages because they make Adventure Wales credible; ordinary operators should not receive premium value for free. Sales lures should be built for operators where Adventure Wales can plausibly sell premium visibility, a service slot, or a campaign package.

## Executive recommendation

1. Treat Zip World, BikePark Wales, Plas y Brenin, Antur Stiniog, and Coed y Brenin / NRW as strategic anchors.
2. Treat Bala Watersports, Beics Brenin, and Snowdonia Watersports as premium sales lures.
3. Keep Adventure Parc Snowdonia and Snowdonia Adventures out of automatic publish until human/QA blockers are resolved.
4. Block or remove Snowdonia MTB Days until the real-world operator identity is confirmed.

## Operator classifications

| Operator | Recommendation | Revenue angle | Rationale | Next action |
|---|---|---|---|---|
| Adventure Parc Snowdonia | `needs_human_permission` | Future sponsor slot / campaign-content package / potentially premium listing once positioning is settled | Strategically important because it anchors the Snowdonia surfing/inland-wave story, but research flags material operational change: the surf lagoon is not currently an active product and the Snowdonia surfing combo page may be misleading. Images are also commercially copyrighted with no approved free alternative found. | MK/editor decision: whether to reposition as a reimagined multi-activity adventure hub and pause/redirect the surfing page until factual copy and image permission are resolved. |
| Bala Watersports | `premium_sales_lure` | Premium listing + Llyn Tegid/Bala watersports sponsor/service slot + activity-page featured operator | Strong private/operator-style commercial prospect: family-run watersports and multi-activity centre, official sources and AALA record identified, broad activity mix across watersports and land-based activities. Good fit for a personalised premium preview page. | Build premium lure profile; include verified trust signals; do not silently publish as full free premium. |
| Beics Brenin | `premium_sales_lure` | Rental service slot + enhanced listing + Coed y Brenin MTB itinerary/service-slot partner | Commercially useful private shop/hire/skills operator attached to Coed y Brenin, which is a strategic anchor. This is exactly where the service-slot model works: public anchor page stays editorial; private operator gets a paid rental/hire visibility offer. | Build lure around bike hire, servicing, coaching, and Coed y Brenin trail proximity. Resolve postcode/email/image QA before outreach. |
| Snowdonia Adventures | `needs_human_permission` | Conditional premium listing / guided-activity service slot / operator website-build or content cleanup package | Potentially valuable guided-activity operator, but research has unresolved blockers: unverified phone, no licensed image/logo, and directorship/operational confirmation needed. Publishing a premium-looking page risks wrong contact data. | Human/operator confirmation before classifying as `premium_sales_lure`. If confirmed active, move to lure. If not, block. |
| Snowdonia MTB Days | `remove_or_block` | No commercial action | Research found no verifiable operator trading under this name. Possible confusion with Snowdonia MTB Events or MTB Snowdonia Guiding, but no confirmed match. | Keep blocked; remove from launch-critical set unless MK can identify the intended business from internal records. |
| Snowdonia Watersports | `premium_sales_lure` | Premium listing + Llyn Padarn kit-hire/rental service slot + kayak/SUP featured operator | Strong commercial fit: family-run Llyn Padarn kayak/SUP hire and retail operator, with official sources, Visit Wales evidence, AALA context, and clear user-intent alignment for rentals. | Build premium sales lure; lead with kit hire, self-guided caveat, Llyn Padarn location, and family-friendly rental intent. |
| Zip World | `strategic_anchor` | Strategic sponsor slot / multi-location premium package / campaign-content package, not a standard cold lure | Tier 1 destination draw per `STRATEGY.md`; people travel to Wales specifically for it. Adventure Wales needs a best-in-class page for credibility and SEO. Existing CSV has enough seed data but research JSON is missing; current blocker is media/cover image. | Build strong editorial anchor page and multi-site experience breakdown. Do not gate core page behind payment; upsell sponsorship/multi-location campaign after traffic proof. |
| BikePark Wales | `strategic_anchor` | South Wales MTB sponsor slot + campaign/content package + multi-page featured operator package | Launch-critical Welsh MTB destination even though not Snowdonia. Existing CSV positions it as the UK’s largest bike park with trails, coaching, and hire. It should anchor MTB coverage and future South Wales monetisation. | Build/complete anchor listing with media. Commercial follow-up should be sponsor/campaign package, not a basic premium lure. |
| Plas y Brenin | `strategic_anchor` | Skills-course campaign package / guide-course service slot / editorial partnership | National Outdoor Centre status makes it an authority anchor. It is not a normal day-trip operator; it validates training, mountaineering, kayaking, climbing, and instructor-course content. | Build high-trust editorial/operator page; commercial ask should be partnership/campaign, not ordinary directory upsell. |
| Antur Stiniog | `strategic_anchor` | MTB sponsor slot + enhanced listing + Snowdonia MTB itinerary placement | Listed in the launch T1 operator media list and important for Snowdonia downhill MTB. It can carry MTB credibility alongside Coed y Brenin and Beics Brenin. | Complete anchor-quality page with media; later offer paid featured placements on Snowdonia MTB pages/itineraries. |
| Coed y Brenin / NRW | `strategic_anchor` | No direct operator sales; monetise adjacent service slots via Beics Brenin/accommodation/gear partners | Public/NRW-managed destination and UK-first MTB trail-centre heritage make it a strategic content anchor. Treat as editorial infrastructure, not a sales target. | Publish/complete as authority anchor. Use Beics Brenin and nearby stays/food as paid service-slot opportunities around it. |

## Recommended commercial-decision queue

Priority order for MK/commercial review:

1. Adventure Parc Snowdonia — decide public positioning and fix/hold Snowdonia surfing content.
2. Snowdonia MTB Days — confirm intended entity or remove/block.
3. Snowdonia Adventures — confirm active contact details and image route.
4. Bala Watersports — approve lure build.
5. Snowdonia Watersports — approve lure build.
6. Beics Brenin — approve lure build after image/postcode QA.
7. Strategic anchors — assign media/source-safe anchor-page completion: Zip World, BikePark Wales, Plas y Brenin, Antur Stiniog, Coed y Brenin / NRW.

## Suggested implementation shape

If this moves into `content/ops/commercial-decisions.json`, use one record per operator with:

```json
{
  "contentItemId": "operator-bala-watersports",
  "classification": "premium_sales_lure",
  "revenueAngle": ["premium listing", "service slot", "sponsor slot"],
  "rationale": "...",
  "nextAction": "...",
  "humanReviewRequired": false
}
```

Do not auto-publish premium pages for `premium_sales_lure` operators. Build previews, record image/source provenance, then use them as outreach assets.
