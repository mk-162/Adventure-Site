# Technical Architecture Audit

**Agent:** Technical Architect
**Date:** 2024-05-22

## Executive Summary
The codebase is built on a modern stack (Next.js 16, React 19, Drizzle ORM), which offers excellent developer experience and performance potential. However, the current architecture prioritizes rapid development over scalability. The database schema lacks critical indexes for foreign keys, and the data fetching strategy on high-traffic pages (Homepage) fetches entire datasets without pagination, posing a significant risk as content volume grows to 100k+ listings.

## Codebase Health & Technical Debt

### 1. Database Schema & Scalability
*   **Missing Indexes**: The Drizzle schema (`src/db/schema.ts`) defines numerous foreign key relationships (e.g., `activities.regionId`, `activities.operatorId`) but explicitly defined indexes are largely absent. In Postgres, foreign keys are not automatically indexed. This will cause full table scans during joins, degrading performance significantly as the dataset grows.
    *   *Risk*: High
    *   *Remediation*: Add `index()` definitions to all foreign key columns in `schema.ts`.
*   **JSONB Overuse**: Fields like `imageGallery` in `events` and `trustSignals` in `operators` use `jsonb`. While flexible, this makes deep querying (e.g., "find all events with X tag in gallery") inefficient and harder to validate type safety at the DB level.
    *   *Risk*: Medium
*   **Text Arrays**: Some tables use `text[]` (e.g., `tags` in `events`). While standard in Postgres, junction tables (like `activityTags`) are used elsewhere. Inconsistent patterns (Arrays vs Junction Tables) increase maintenance cognitive load.

### 2. Data Fetching Strategy
*   **Homepage "Waterfall"**: `src/app/page.tsx` uses a massive `Promise.all` to fetch regions, activities, events, operators, and itineraries simultaneously. Currently, it limits some queries (e.g., `.limit(10)`), but it fetches *all* regions.
*   **Lack of Caching Layer**: Direct DB calls in Server Components are fast now, but with 100k listings, a caching layer (Redis or `unstable_cache`) will be essential to prevent database saturation.

### 3. Dependencies
*   **Bleeding Edge**: The project uses `next: 16.1.6` and `react: 19.2.3`. Being on bleeding-edge versions can introduce subtle bugs or compatibility issues with third-party libraries (e.g., `react-quill` requiring `--legacy-peer-deps`).

## Security (OWASP Top 10)

*   **Broken Access Control**: The `middleware.ts` implementation protects `/admin` routes correctly. However, reliance on a single `ADMIN_PASSWORD` or `ADMIN_SECRET` environment variable for all admin access is fragile. It lacks granular role-based access control (RBAC) despite an `admin_role` enum existing in the schema.
*   **Injection Flaws**: Drizzle ORM provides good protection against SQL injection by default.
*   **Sensitive Data**: `magic_links` and `operator_sessions` tables handle authentication. Ensure `token` columns are hashed if they are long-lived, though they appear to be short-lived magic links.

## Risk Matrix

| Risk | Impact | Probability | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Database Slowdowns** | High | High | Implement DB indexes immediately. |
| **Homepage Timeout** | High | Medium | Implement aggressive caching and lazy loading for "below the fold" content. |
| **Dependency Breakage** | Medium | Medium | Lock dependencies and avoid "canary" releases for production stability. |
| **Single Admin Credential** | High | Low | Implement multi-user admin auth with unique credentials. |

## Recommendations
1.  **Immediate**: Run a migration to add indexes to all foreign key columns in `src/db/schema.ts`.
2.  **Short-term**: Refactor `getHomePageData` to use `unstable_cache` to cache results for 1-5 minutes.
3.  **Long-term**: Move from `text[]` arrays to standardized Junction Tables for all many-to-many relationships to ensure referential integrity.
