# Critical Issues Summary ("Red Flags")

**Lead Auditor:** Jules
**Date:** 2024-05-22

The following table summarizes the most critical issues identified across the 8-point audit. These items represent significant risks to scalability, compliance, or user experience and should be prioritized for immediate remediation.

| ID | Category | Issue | Risk Level | Impact | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TECH-01** | Architecture | **Missing Foreign Key Indexes** | 🔴 Critical | Database CPU spikes and slow queries as data grows. | Add `index()` to all foreign keys in `schema.ts` immediately. |
| **PERF-01** | Core Web Vitals | **Unoptimized Images (`<img>` vs `next/image`)** | 🔴 Critical | Poor LCP scores, lower SEO ranking, high bandwidth costs. | Replace all operator logos and hero images with `next/image`. |
| **COMP-01** | Legal | **Undisclosed Sponsored Content** | 🔴 Critical | Violation of CAP Code/consumer protection laws. | Add explicit "Ad" or "Sponsored" badges to Premium listings. |
| **ACC-01** | Accessibility | **Color Contrast Failure** | 🟠 High | Primary Orange (`#f97316`) fails WCAG AA for text. | Darken primary text color to `#ea580c` (Orange-600). |
| **SEC-01** | Security | **Shared Admin Credentials** | 🟠 High | inability to audit changes; single point of failure. | Implement individual admin user sessions (`admin_users`). |
| **EDIT-01** | Trust | **Unverified AI Content** | 🟠 High | "Honest Guide" brand damage if AI hallucinates safety info. | Implement "Human Verified" workflow and badges. |
| **UX-01** | Usability | **Search Dropdown Reset** | 🟡 Medium | User confusion when "What" selection vanishes. | Add UI feedback when changing regions resets activity selection. |
| **TECH-02** | Performance | **Homepage Waterfall Fetch** | 🟡 Medium | Slow TTFB (Time to First Byte) under load. | Implement `unstable_cache` for homepage data queries. |

## Next Steps
1.  **Phase 1 (Week 1)**: Address TECH-01 and PERF-01 to ensure the platform foundation is stable.
2.  **Phase 2 (Week 2)**: Fix ACC-01 and COMP-01 to mitigate legal and inclusivity risks.
3.  **Phase 3 (Ongoing)**: Implement the Editorial verification workflow (EDIT-01).
