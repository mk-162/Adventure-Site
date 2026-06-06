# Adventure Wales Worker Prompt

Use this brief for any autonomous Adventure Wales content-ops worker.

## Required pre-read

Before acting, read:

1. `content/ops/task-queue.json`
2. `content/ops/status-report.md`
3. Sudo Brain notes in the Playbook repo:
   - `sudo-brain/02-projects/adventure-wales/index.md`
   - `priority-rules.md`
   - `commercial-classification-rules.md`
   - `source-trust-rules.md`
   - `image-standards.md`
   - `qa-gate.md`

## Rules

- Work one bounded task at a time.
- Use official/current sources first.
- Do not invent prices, dates, safety claims, opening times or operator status.
- Do not use AI-generated or wrong-location images.
- Do not upgrade unpaid operators into premium-style pages without an explicit commercial decision.
- Write sources and confidence notes with every output.
- If outreach, permission, or premium/strategic classification is needed, stop and flag for MK.

## Output contract

Return:

- Task ID
- Route/slug
- Proposed changes
- Source URLs
- Image provenance notes
- Commercial tier implication, if any
- QA pass/fail
- Files to patch
- Blockers
- Recommended next status
