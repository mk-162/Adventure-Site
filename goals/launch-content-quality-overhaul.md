# Goal: Adventure Wales Launch Readiness + Content Quality Overhaul

## What
Get the Welsh adventure site production-ready for launch while establishing a sustainable editor workflow to fix ongoing content quality issues (wrong/outdated images, stale descriptions, poor UX on site, inconsistent data). Combine technical launch tasks (claim MVP, integrations) with a repeatable content editor process that MK or team can use ongoing. Use Claude Code via goal-driven handoff for execution.

## Current Problems (from user + plans)
- Site UX feels bad in places
- Many wrong or low-quality images
- Content is old/outdated in places
- No clear editor workflow for ongoing maintenance
- Launch blockers remain: Claim Your Listing MVP, Booking.com affiliate, weather, operator tools, monitoring

## How to execute
1. Read all existing plans (planning/README.md, plans/claim-listing-mvp.md, TODO.md, SNAGS.md, TASKS.md) and current goals.
2. Create editor workflow: design a simple CMS/editor process (TinaCMS? or Markdown + Git + image pipeline) for MK/team to update content, source correct images, and maintain freshness. Document in docs/EDITOR-WORKFLOW.md.
3. Implement Claim Your Listing MVP (self-service for operators) per plans/claim-listing-mvp.md.
4. Add high-priority integrations: Booking.com affiliate links + availability, Weather widget + activity alerts.
5. Fix image pipeline: replace wrong/placeholder images, add proper sourcing/attribution, optimise with Next/Image.
6. Close remaining SNAGS (21 left) and technical debt (Sentry, analytics, caching, a11y, CI/CD).
7. Set up editor tools: image sourcing script, content freshness checker, simple admin/editor UI if needed.
8. Create branch `goal/launch-content-overhaul`, implement in logical commits, push, open PR with summary.
9. Verify: run full build, test key flows (claim, search, itinerary, directory), check image quality on live preview.

## Success Criteria
- Claim flow live and functional (operators can claim)
- Booking.com and weather integrations working on relevant pages
- All critical images updated with proper sources and optimised
- Editor workflow documented and usable by non-dev (MK)
- Zero critical SNAGS remaining, monitoring in place
- Site feels polished and trustworthy for launch
- PR ready with clear demo instructions

## Constraints
- NO npm install / dependency changes unless explicitly approved
- Prefer existing stack (Next.js, Drizzle, Vercel)
- Content changes must be reviewable via Git
- Keep multi-tenant ready for future regions

## Deliverable PR
- Branch: goal/launch-content-overhaul
- Title: "Launch prep + content quality: claim MVP, integrations, editor workflow, image fixes"
- Full implementation + docs
- All src/ + content/ + docs/ changes included
- Ready for review and deploy