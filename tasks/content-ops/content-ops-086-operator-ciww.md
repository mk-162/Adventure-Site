# content-ops-086-operator-ciww

## Objective
Improve content item operator-ciww: Ciww.
Channel: commercial. Content type: operator. Route/slug: /directory/ciww.
Commercial tier: unclassified_operator.
Known blocker: Operator "Cardiff International White Water" missing: no description, no cover image, no logo, no Google rating | Operator "Cardiff International White Water" missing: no description, no cover image, no logo, no Google rating.
Do not guess. Capture source URLs for every factual claim. Do not use AI-generated images. Return proposed file/data changes plus QA notes.

## Metadata

- Content item: operator-ciww
- Channel: commercial
- Content type: operator
- Route/slug: /directory/ciww
- Current status: blocked
- Priority: 34
- Task type: commercial_review
- Recommended skill: directory-premium-lure-model
- Required output path: data/research/content-ops/operator-ciww.json

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
