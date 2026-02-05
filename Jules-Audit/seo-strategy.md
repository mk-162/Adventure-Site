# SEO Strategy Audit

**Agent:** SEO Director
**Date:** 2024-05-22

## Executive Summary
The technical SEO foundation is robust, with a strong implementation of Structured Data (Schema.org) and a comprehensive dynamic sitemap. The hierarchical URL structure (`/region/activity`) supports strong topic clusters ("siloing"). The primary opportunity lies in expanding "Programmatic SEO" through the `guide_pages` entity to capture long-tail "Best X in Y" queries.

## Technical SEO Analysis

### 1. Schema.org Implementation
*   **Status**: **Excellent**
*   **Coverage**: The `JsonLd` component covers the core entities:
    *   `TouristAttraction` (Activities)
    *   `LodgingBusiness` (Accommodation)
    *   `Event` (with `eventAttendanceMode` and `eventStatus`)
    *   `FAQPage` (Answers)
    *   `TouristDestination` (Regions)
*   **Validation**: The schema correctly handles optional fields (e.g., prices, ratings), preventing validation errors when data is missing.

### 2. Crawlability & Indexation
*   **Sitemap**: `src/app/sitemap.ts` is fully dynamic, ensuring that as soon as an entity is `published`, it appears in the sitemap. Priorities are logically assigned (Regions > Activities > Directory).
*   **Robots.txt**: Correctly disallows `/admin` and `/api` to preserve crawl budget.
*   **Internal Linking**: The `SearchBar` logic directs users to specific silo pages (`/snowdonia/things-to-do/hiking`), which is excellent for distributing link equity to these category pages.

### 3. URL Structure
*   **Hierarchy**: The structure `/{region}/things-to-do/{activity}` is ideal. It creates clear parent-child relationships that search engines understand.
*   **Canonicalization**: Ensure that `/search?activity=hiking` canonializes to the nearest static page if possible, or sets `noindex` to avoid duplicate content issues with the static category pages.

## Content & Keywords

### 1. Topic Clusters
*   **Current State**: Regions act as the pillar pages.
*   **Gap**: "Best of" lists. The `guide_pages` table suggests this is planned. These pages (e.g., "Top 10 Surfing Spots in Pembrokeshire") are critical for capturing high-intent search traffic that isn't ready to book a specific operator yet.

### 2. Metadata
*   **Templates**: Default metadata in `layout.tsx` is well-written.
*   **Dynamic generation**: `generateMetadata` in `itineraries/[slug]/page.tsx` is basic (`Itinerary: {slug}`). It should be optimized to include the region and key activities (e.g., "3 Day Hiking Itinerary in Snowdonia | Adventure Wales").

## Recommendations
1.  **Optimize Dynamic Metadata**: Update `generateMetadata` functions across all dynamic pages to include richer, keyword-optimized titles and descriptions, not just the entity name.
2.  **Breadcrumb Schema**: Ensure `BreadcrumbList` schema is rendered on *every* page, matching the visual breadcrumbs.
3.  **LocalBusiness Schema**: For the Directory (`/directory/[slug]`), ensure `LocalBusiness` schema includes `priceRange` and `openingHours` if available, to trigger rich snippets in Maps results.
4.  **"Near Me" Optimization**: Ensure region pages mention surrounding major towns/cities in the copy to capture "near [City]" queries.
