# Adventure Wales — Daily Jules Content Improvement System

**Created:** 2026-05-22  
**Owner:** Hermes / Jules / MK  
**Repo:** `mk-162/Adventure-Site`  
**Active PR:** #105 `goal/launch-content-overhaul`

## Principle

We are not trying to make Adventure Wales launchable by hiding weak pages.

The strategy is to use Jules every day to fix the content corpus until the site is genuinely useful, credible, and commercially valuable.

Temporary hiding/noindexing is only a safety measure for pages that are factually wrong, legally risky, or actively misleading. It is not the main plan.

## What Happened To The Old 100 Jules Sessions Plan

The earlier Jules work did exist, but it stalled at the “manual task list” stage:

- `playbook/JULES-TASKS.md` contains strong research prompts.
- `jules-queue.json` currently has no pending work; all listed tasks are marked completed.
- The old API wrapper in `scripts/jules/jules_client.py` points at a guessed API endpoint and depends on `JULES_API_KEY`, so it is not the real operating path.
- The actual working tool is the authenticated Jules CLI: `jules new`, `jules remote list --session`, `jules remote pull --session ...`.
- The original audit session `2730327055973848465` is still `Awaiting User Feedback`, which means work was started but not converted into a daily production loop.
- Two recent Snowdonia/Eryri audit sessions completed, but they were one-off sessions, not a queue-driven daily campaign.

The fix is now in place: a daily runner that creates focused Jules sessions from the audit and content inventory.

## Daily Operating Model

### Daily target

Use up to **100 Jules sessions per day**.

The runner creates focused, verifiable tasks in this order:

1. Priority operator enrichment.
2. Activity × region combo page improvement.
3. Exact-location image sourcing and validation.
4. Event verification and refresh.
5. Remaining audit gaps from `content/content-gap-audit.json`.

### Runner

Script:

```bash
/home/minigeek/projects/Adventure-Site/scripts/jules/daily_jules_campaign.py
```

Wrapper:

```bash
/home/minigeek/.hermes/scripts/adventure-wales-daily-jules-campaign.sh
```

Manual run:

```bash
cd /home/minigeek/projects/Adventure-Site
python3 scripts/jules/daily_jules_campaign.py --limit 100
```

Dry run:

```bash
cd /home/minigeek/projects/Adventure-Site
python3 scripts/jules/daily_jules_campaign.py --limit 10 --dry-run
```

State file:

```bash
/home/minigeek/.hermes/state/adventure-wales-jules-campaign.json
```

## Task Standards

Every Jules task must have:

- One narrow target.
- A named output path.
- Source URL requirements.
- Clear acceptance criteria.
- Explicit “no guessing” rules.
- No AI image permission.
- No generic copy permission.

## Output Locations

Jules should write research/content outputs to:

```text
data/research/operators/
data/research/combo-improvements/
data/research/image-sourcing/
data/research/events/
```

This keeps raw research separate from published content until reviewed.

## Review And Merge Cadence

Every day:

1. Check Jules session list:

```bash
cd /home/minigeek/projects/Adventure-Site
jules remote list --session | head -80
```

2. Pull completed sessions one by one:

```bash
jules remote pull --session SESSION_ID
```

3. Review outputs before applying patches.
4. Apply only credible, sourced changes.
5. Run validation:

```bash
npm run typecheck
npm run build
```

6. Commit accepted work to PR #105.

## Acceptance Criteria For “Site Is Great”

The site is not “great” because pages exist. It is great when:

- Priority operator pages have verified names, descriptions, activities, media plans, source URLs, and commercial CTAs.
- Activity × region pages include real spots, real operators, travel/planning notes, and honest caveats.
- Region images show the actual region.
- Activity images show the actual activity where possible.
- No page feels like generic AI filler.
- No major public page has obviously wrong images.
- The directory/search experience helps users find real providers.
- Big-player pages are full enough to build audience trust.
- Stub listings remain minimal unless they are paid/premium lures or strategic big players.

## Commercial Rule

Do not accidentally give every operator a free premium listing.

Content treatment:

- **Strategic big players:** full public treatment because they build traffic and trust.
- **Premium lure prospects:** pre-built rich page can exist as an outreach asset and sales proof.
- **Ordinary unpaid operators:** minimal public stub unless/until they claim/pay.

The daily Jules system improves the evidence, research, images, and quality base. Publishing decisions still follow the pay-to-play model.

## First Batch

First live batch started on 2026-05-22 using the new runner. It began with priority operator fixes.

Initial priority operators include:

- Zip World
- Adventure Parc Snowdonia
- BikePark Wales
- Plas y Brenin
- Coed y Brenin NRW
- Antur Stiniog
- Beics Brenin
- Bala Watersports
- Bala Adventure Watersports
- Snowdonia Watersports

## Next Improvements

1. Add a daily pull/review script that collects completed session IDs and applies only reviewed outputs.
2. Add a dashboard report summarising submitted, completed, failed, and awaiting-feedback Jules sessions.
3. Convert accepted research JSON into final content patches.
4. Add CI checks for image provenance and source URL presence.
