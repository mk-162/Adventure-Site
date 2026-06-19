# Adventure Wales Command Centre

## Purpose

Adventure Wales should operate as an AI-assisted local adventure media and commercial directory business, not as a static content site.

The Command Centre is the operating layer for:

- content research and QA
- operator/commercial classification
- premium listing sales lures
- sponsorship and ad inventory
- affiliate/service slot opportunities
- launch blockers and human decisions
- agent work routed through Hermes Kanban

## Existing commercial offer found in project notes

Source: `Brief.md` and Playbook strategy notes.

### Partner tiers

1. **Stub**
   - basic info
   - blurred/limited image treatment
   - claim CTA
   - no booking links
   - no premium visibility

2. **Claimed**
   - full info
   - verified/trust signals
   - photos
   - contact details
   - website link

3. **Premium**
   - everything in claimed
   - featured placements
   - itinerary placements
   - hero CTA slots
   - booking links
   - special offers
   - analytics later

### Advertising and sponsorship system

Available inventory from `Brief.md`:

- Homepage: hero banner, featured sponsor, newsletter sponsor, footer banner
- Region pages: hero banner, sidebar MPU, in-content slots, operator spotlight
- Activity listings: top banner, sidebar MPU, featured operator, bottom banner
- Itineraries: hero sponsor badge, day sponsor, accommodation partner, booking CTA
- Answer/FAQ pages: sidebar MPU, bottom banner
- Operator pages: no third-party ads; the operator owns their own page

Slot waterfall:

1. Direct campaign
2. Premium operator
3. Affiliate widget, e.g. Booking.com / GetYourGuide
4. Programmatic backfill, e.g. AdSense

### Service slot offer

Service types already defined:

- transfers
- accommodation
- rental
- lessons
- guides
- holidays
- experiences

Cascading scope:

1. location-specific
2. region-specific
3. activity-specific
4. global defaults

### Additional offer lines from Playbook strategy

- enhanced listing
- premium listing
- operator website build
- booking/onboarding support
- seasonal campaign/content package
- social content pack

## Operating model

Human role: MK makes commercial calls.

AI role: agents prepare evidence, options, drafts, and QA notes.

The system should reduce MK's work to a small daily decision queue:

- Strategic Anchor
- Premium Sales Lure
- Claimed / Basic Listing
- Remove / Block
- Needs Human Permission

## Hermes Kanban setup

Board: `adventure-wales`

Worker profiles:

- `awresearcher` — evidence gathering, source validation, image provenance, entity ambiguity checks
- `awcommercial` — operator classification, offer mapping, sales pipeline, sponsor/ad opportunity mapping
- `awbuilder` — dashboard/workflow implementation in the Next.js app and scripts
- `awreviewer` — QA, source checks, SEO/commercial risk review, build/typecheck verification

## Core workflows

### Workflow 1 — Research Intake

Trigger:

- new operator/event/content item
- `research_needed` status
- stale or weak evidence

Owner:

- `awresearcher`

Inputs:

- `content/ops/task-queue.json`
- task brief from `tasks/content-ops/`
- existing item record
- official/tourism/source URLs

Output:

- `data/research/content-ops/<content_item_id>.json`
- source URLs
- image licence/provenance notes
- recommended next status
- blockers

Acceptance gate:

- valid JSON
- at least two credible sources where possible
- no copied marketing copy
- image permissions clearly marked

### Workflow 2 — Commercial Classification

Trigger:

- research output exists
- item is commercial/operator
- `qa_needed` or `blocked` needs human/business decision

Owner:

- `awcommercial`

Classification options:

- `strategic_anchor`
- `premium_sales_lure`
- `claimed_basic`
- `stub_only`
- `remove_or_block`
- `needs_human_permission`

Output:

- `content/ops/commercial-decisions.json`
- recommended commercial tier
- rationale
- next action
- sales/outreach angle if applicable

Acceptance gate:

- big players are not treated like ordinary free listings
- ordinary operators do not receive premium value for free
- closed/ambiguous operators are blocked, not published
- Adventure Parc Snowdonia-style operational changes are explicitly flagged

### Workflow 3 — Premium Sales Lure Production

Trigger:

- commercial classification = `premium_sales_lure`

Owner:

- `awcommercial` for sales brief
- `awbuilder` for page/data implementation if approved
- `awreviewer` for gate

Output:

- premium preview copy
- image requirements
- offer/CTA structure
- outreach email draft
- dashboard status update

Acceptance gate:

- page preview is not silently published as a free premium listing
- image rights are recorded
- outreach angle is specific to the operator

### Workflow 4 — Strategic Anchor Production

Trigger:

- commercial classification = `strategic_anchor`

Owner:

- `awcommercial` sets rationale
- `awbuilder` implements source-safe content updates
- `awreviewer` checks risk

Output:

- strong public page or enhanced profile
- corrected claims
- clear reason this free treatment helps Adventure Wales

Acceptance gate:

- content improves site credibility
- no false availability claims
- no unsupported booking/pricing/timetable statements

### Workflow 5 — Sponsor / Ad Inventory Pipeline

Trigger:

- region/activity/itinerary has traffic potential
- relevant operator/service category exists
- affiliate or direct campaign opportunity is spotted

Owner:

- `awcommercial`

Output:

- slot opportunity record
- suggested sponsor/advertiser
- package type
- revenue estimate
- next outreach action

Acceptance gate:

- slot follows waterfall: direct > premium > affiliate > programmatic
- no competitor ad appears on an operator's own page
- commercial placement is relevant to user intent

### Workflow 6 — Review and Publish Gate

Trigger:

- any item moves toward public visibility or major commercial status change

Owner:

- `awreviewer`

Checks:

- sources
- image rights
- commercial tier correctness
- user usefulness
- SEO basics
- build/typecheck if code/data changed

Output:

- approve
- block with reason
- request specific fix

## Dashboard implications

The existing `/admin/content-ops` page is monitoring-only. It needs management actions:

- decision queue for MK
- commercial classification buttons
- evidence drawer from research JSON
- source/image/provenance status
- sponsor/ad opportunity pipeline
- Kanban card links
- next agent action buttons

## First command-centre cards

The initial Hermes Kanban board should contain cards for:

1. dashboard decision schema and data file
2. commercial review of launch-critical operators
3. blocked-operator resolution brief
4. sponsor/ad inventory opportunity model
5. dashboard UI implementation
6. reviewer gate and build verification
