---
title: Business Model
status: active
date: 2026-07-06
tags: [context, revenue, business]
---

# Business Model

## Revenue streams (designed)

1. **Operator subscriptions** — Free listing → Enhanced £9.99/mo (full profile, booking
   integration, itinerary placement) → Premium £29.99/mo (featured placement, priority in
   itineraries, lead notifications). Stripe checkout/portal/webhooks are built.
2. **Affiliate revenue** — Booking.com (accommodation; needs `BOOKING_AFFILIATE_ID`),
   transport and gear affiliates (not yet wired).
3. **Enquiry forwarding** — itinerary enquiries → leads to relevant operators; premium
   operators get instant notification. (Dashboard "Enquiries" is currently a **mock** —
   the feature does not exist yet.)

## Current commercial state (2026-07-06, pre-launch)

- **Billing is deliberately dark**: no `STRIPE_*` env vars in any environment; UI degrades
  gracefully (503s / disabled upgrade buttons). Before enabling, fix the items in
  [[launch-readiness]] Phase 5 (price-ID env split, priceId allowlist, API-version pin,
  webhook tests).
- **Trials are inert**: `trialExpiresAt` is never written by any code path; trial badges
  reference dead logic. Wire or strip before marketing trials.
- **Ads subsystem exists but can't serve** direct campaigns (admin campaign UI links to
  pages that don't exist); house/spotlight slots work.
- 18 published operators, 0 paying. First commercial motion post-launch: convert verified
  operators to Enhanced via the claim → dashboard → upgrade path.
- Lead capture that DOES work today: `/advertise` → `/api/operator-interest` (operator
  interest table), newsletter capture, event submissions.

## Pricing reality check

See [[growth-playbook]] for researched benchmarks on directory subscription conversion
and affiliate EPCs, and the 90-day post-launch plan.

## Multi-site ambition

The long game is a repeatable engine for sibling sites (Adventure Scotland, etc.) —
see [[new-site-blueprint]]. Wales must prove the model first: the metric is trips
planned and bookings made ([[brand]]).
