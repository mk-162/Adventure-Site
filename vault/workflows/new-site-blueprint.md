---
title: New Adventure Site Blueprint (multi-site roadmap)
status: reference
date: 2026-07-06
tags: [workflow, multisite, future, adventure-wales]
---

# New Adventure Site Blueprint

**Future work — not in motion.** The repeatable recipe for standing up a sibling site (Adventure Scotland, Adventure Lake District, …) on the same platform. Full detail: `docs/HOW-TO-BUILD-NEW-ADVENTURE-SITES.md` + `docs/MULTISITE-PLAYBOOK.md`. This note captures the concept and the step order.

## The concept

The platform is multi-tenant: every table has `siteId`. A new destination = a new `sites` row + a domain + seeded regions/activities + the same content pyramid, built with the same skills and pipeline that run Adventure Wales. The value is the *process* (research → curate → write → verify), not the code.

## Hard-won lessons baked in (from Wales)

- Build a **trip-planning tool, not a directory**. Content layer first, operators after — Wales's mistake was operator pages before the "I'm interested in surfing" content existed.
- **Depth beats breadth**; thin content trains users not to return.
- Tier everything: T1 destination draws (rich pages), T2 trip enhancers (in itineraries/region pages), T3 practical services (data only, no URL).
- **Forum-first research is mandatory** (Singletrack, UKClimbing, Walkhighlands, etc.) — official sites tell you what businesses want known; forums tell you what you need to know.
- Real photos only; postcodes (postcodes.io) are the source of truth for coordinates, not map estimates.
- Local experts are the moat — AI can't say "the main car park floods in winter".
- And from launch (not in the original doc): **gate the launch surface in code** and verify operators before publishing — see [[content-expansion]] and [[operator-verification-publishing]].

## The 10 phases (in order, don't skip)

1. **Foundation** (2–3 days) — territory, domain, brand; research 8–15 regions and 15–25 activity types; competitor + keyword analysis. Output `docs/sites/{slug}/SITE-BRIEF.md`. Only build combos with search volume.
2. **Database & infra** (1–2 hrs) — insert `sites` row, seed regions/activities (status draft), point domain at Vercel.
3. **Region research** (3–5 days, one AI sub-agent per region) — transport (verify every bus route/train station), 10–30 adventure-friendly stays, insider tips, month-by-month timing, spot discovery with lat/lng + parking. Output `docs/sites/{slug}/research/{region}.json`.
4. **Operator discovery** (3–5 days) — per combo with demand: name/website/contact/prices/ratings/booking platform/certifications; geocode via postcodes.io; verify sites live (HTTP 200), dedupe, flag defunct.
5. **Pillar content** (5–10 days) — build the pyramid top-down: activity pillar pages → region×activity combo pages (2,000+ words, tiered first-timer/regular tips) → best-of lists → operator/experience pages. Per page: deep research → write → images → data assembly.
6. **Image sourcing** (2–3 days) — per [[image-sourcing]].
7. **Local expert program** (ongoing) — recruit locals per region; credit + links in exchange for tips and review.
8. **Hub integration** (2–3 days) — wire region pages, destinations page, homepage to the new content; internal linking per [[pseo-content-strategy]].
9. **Review, QA & launch** (2–3 days) — content checklist, technical QA, data completeness, then go live (gated, small, honest).
10. **Ongoing maintenance** — weekly/monthly/quarterly refresh cadence via the [[content-ops-pipeline]].

## When to pick this up

After Adventure Wales is deployed, earning traffic, and the content-ops pipeline is proven on real refresh cycles. Multi-site before a single working site is the classic trap this project already fell into once.
