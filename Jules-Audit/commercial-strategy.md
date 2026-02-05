# Commercial Strategy Audit

**Agent:** Product Manager
**Date:** 2024-05-22

## Executive Summary
The commercial model is a hybrid of "Directory Listing" (SaaS) and "Affiliate/Lead Gen". The infrastructure supports this well with `billingTier`, `claimStatus`, and extensive ad slot configuration. The "Itinerary Engine" is the unique selling proposition (USP) that differentiates this from a generic directory like TripAdvisor. The key to revenue is converting "Stub" operators into "Premium" subscribers by demonstrating the value of high-intent traffic from these itineraries.

## Monetization Analysis

### 1. The Value Exchange
*   **For Operators**: They get visibility on high-quality, planned itineraries, not just a static list. The "Enquire All Vendors" button on itineraries is a powerful lead generation tool.
*   **For Users**: Free access to expert-planned trips.
*   **Gap**: Operators need to see *data*. A "Vendor Dashboard" showing "Appearances in Itineraries" and "Click-throughs" is essential to justify the Premium subscription.

### 2. CTA Prominence
*   **"Enquire All"**: This is positioned well on the Itinerary page.
*   **"Claim This Business"**: This flow needs to be aggressive on Stub profiles. It should be the primary visual element on an unclaimed profile.
*   **Booking**: Currently relies on `bookingUrl` (affiliate/direct).
    *   *Opportunity*: Deep integration with booking platforms (FareHarbor/Rezdy) to check availability directly would significantly increase conversion and affiliate revenue.

### 3. Competitor Benchmarking
*   **TripAdvisor**: Volume-based. Hard to stand out.
*   **Adventure Wales (Us)**: Curation-based.
*   **Advantage**: We can sell "Context". A provider isn't just listed; they are part of a *story* (Day 2 of the "Ultimate North Wales Weekend"). This context is worth a premium.

## Revenue-Driving Recommendations

### 1. "Itinerary Sponsorship"
Allow a Premium Operator to "Sponsor" a specific itinerary. Their branding appears on the PDF download and they get the "Featured Provider" slot for their activity type within that itinerary.

### 2. "Concierge Service" (High Ticket)
Offer a white-glove booking service for the entire itinerary. Users pay a flat fee (e.g., £50), and the platform handles all the bookings with the operators. This moves from "Lead Gen" to "Agency" model.

### 3. Dynamic "Service Slots"
The `service_slots` table is underutilized. dynamically inject "Car Hire" or "Travel Insurance" affiliate cards into the Itinerary Timeline based on the user's travel mode (e.g., if `travelMode` is 'drive', show Rentalcars.com).

### 4. B2B Data Product
Sell anonymized intent data to tourism boards. "People looking at Snowdonia are also looking at Pembrokeshire 40% of the time."
