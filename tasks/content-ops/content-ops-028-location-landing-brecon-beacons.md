# content-ops-028-location-landing-brecon-beacons

## Objective
Improve content item location-landing-brecon-beacons: Brecon Beacons.
Channel: evergreen. Content type: location_landing. Route/slug: /brecon-beacons.
Region: brecon-beacons.
Do not guess. Capture source URLs for every factual claim. Do not use AI-generated images. Return proposed file/data changes plus QA notes.

## Metadata

- Content item: location-landing-brecon-beacons
- Channel: evergreen
- Content type: location_landing
- Route/slug: /brecon-beacons
- Current status: research_needed
- Priority: 45
- Task type: research
- Recommended skill: directory-region-page
- Required output path: data/research/content-ops/location-landing-brecon-beacons.json

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
