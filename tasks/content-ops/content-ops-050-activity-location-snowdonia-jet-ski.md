# content-ops-050-activity-location-snowdonia-jet-ski

## Objective
Improve content item activity-location-snowdonia-jet-ski: Snowdonia / Jet Ski.
Channel: evergreen. Content type: activity_location. Route/slug: /snowdonia/things-to-do/jet-ski.
Region: snowdonia.
Activity: jet-ski.
Known blocker: Combo page has no enrichment data file.
Do not guess. Capture source URLs for every factual claim. Do not use AI-generated images. Return proposed file/data changes plus QA notes.

## Metadata

- Content item: activity-location-snowdonia-jet-ski
- Channel: evergreen
- Content type: activity_location
- Route/slug: /snowdonia/things-to-do/jet-ski
- Current status: qa_needed
- Priority: 41
- Task type: qa
- Recommended skill: directory-activity-region-page
- Required output path: data/research/content-ops/activity-location-snowdonia-jet-ski.json

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
