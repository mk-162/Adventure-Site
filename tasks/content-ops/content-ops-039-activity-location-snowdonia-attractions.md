# content-ops-039-activity-location-snowdonia-attractions

## Objective
Improve content item activity-location-snowdonia-attractions: Snowdonia / Attractions.
Channel: evergreen. Content type: activity_location. Route/slug: /snowdonia/things-to-do/attractions.
Region: snowdonia.
Activity: attractions.
Known blocker: Combo page has no enrichment data file.
Do not guess. Capture source URLs for every factual claim. Do not use AI-generated images. Return proposed file/data changes plus QA notes.

## Metadata

- Content item: activity-location-snowdonia-attractions
- Channel: evergreen
- Content type: activity_location
- Route/slug: /snowdonia/things-to-do/attractions
- Current status: qa_needed
- Priority: 41
- Task type: qa
- Recommended skill: directory-activity-region-page
- Required output path: data/research/content-ops/activity-location-snowdonia-attractions.json

## Source Requirements

- Prefer official operator, local authority, event organiser, NRW/National Park, or recognised tourism sources.
- Avoid live pricing/timetable claims unless checked against a current official source and dated.
- No AI-generated images for real places, operators, or events.

## Acceptance Criteria

- Source URLs are included for factual claims.
- Image recommendations include provenance/licence notes or explicitly say image remains blocked.
- Commercial tier rules are respected; ordinary unpaid operators are not upgraded into free premium pages.
- The output recommends the next status: researched, qa_needed, reviewed, blocked, or signed_off.

## Output Contract

Return JSON or markdown containing:

- Proposed changes or researched facts.
- Source URLs used.
- Image provenance or image blocker note.
- Claims needing human review.
- Recommended next status.

Do not publish, deploy, or make commercial promises.
