# Compliance & Trust Audit

**Agent:** Compliance Officer
**Date:** 2024-05-22

## Executive Summary
The platform demonstrates a "Privacy by Design" approach with passwordless authentication (Magic Links) and minimal user data collection for browsing. However, as an advertising platform, strict adherence to the UK CAP Code (Committee of Advertising Practice) regarding "Advertorial" content is required. The "Honest Guide" claim effectively constitutes a binding promise to the consumer, making any undisclosed paid placement a significant legal risk.

## Data Privacy (GDPR/UK GDPR)

### 1. Data Collection & Storage
*   **Cookie Banner**: Present in `layout.tsx`. Must ensure it strictly blocks non-essential cookies (Analytics, Pixel tracking) until consent is granted. A simple "OK" banner is no longer compliant; explicit "Accept/Reject" is needed.
*   **Newsletter**: `newsletter_subscribers` table stores emails. Ensure a clear "Unsubscribe" link is included in every email sent (via Resend).
*   **Operator Data**: Collecting IPs during "Claim" (`operator_claims`) is legitimate interest for fraud prevention, but should be retained only as long as necessary.

### 2. Authentication Security
*   **Admin Access**: The `middleware.ts` uses a basic `admin_token` cookie. While functional, it lacks session invalidation on the server side (stateless JWT vs Database Session).
*   **Magic Links**: The `magic_links` table is a secure pattern, avoiding password storage risks. Ensure tokens have short expiry times (e.g., 15 minutes).

## Consumer Protection & Trust

### 1. Advertising Transparency (CAP Code)
*   **Sponsored Content**: The `is_promoted` flag in the database must visually translate to a "Sponsored" or "Ad" label on the frontend.
    *   *Risk*: If a "Premium" operator appears at the top of a "Best of" list without a label, it violates consumer protection laws.
    *   *Remediation*: Ensure the `Badge` component has a specific variant for "Sponsored" that is legally compliant (clear and prominent).

### 2. The "Honest Guide" Promise
*   **Liability**: By calling itself an "Honest Guide", the platform assumes a higher duty of care. If an activity is rated "Easy" but is actually dangerous, and a user is injured, the platform could be liable for negligence if the rating was AI-generated without verification.
*   **Disclaimer**: A clear Terms of Service disclaimer regarding "Assumption of Risk" must be visible on every Itinerary and Activity page.

## Recommendations
1.  **Strict "Sponsored" Labeling**: Audit all lists (Regions, Activities) to ensure paid placements are explicitly labeled.
2.  **Disclaimer Footer**: Add a permanent disclaimer to the footer of all Itinerary pages: "Activities involve risk. Information is for guidance only. Verify conditions locally."
3.  **Cookie Control**: Upgrade the Cookie Banner to a granular consent manager (Marketing vs Essential).
4.  **Admin Security**: Move from a shared `ADMIN_PASSWORD` to individual admin user accounts (`admin_users` table) to enable audit logs of who changed what content.
