# Performance & Web Vitals Audit

**Agent:** Performance Engineer
**Date:** 2024-05-22

## Executive Summary
The application leverages Next.js 16's server-side capabilities effectively, but the frontend delivery of media assets is unoptimized. The widespread use of standard `<img>` tags and CSS background images instead of the `next/image` component is a critical "Red Flag" for Core Web Vitals, specifically Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS).

## Core Web Vitals Analysis

### 1. LCP (Largest Contentful Paint)
*   **Hero Images**: The Itinerary page uses a CSS background image (`style={{ backgroundImage: ... }}`). Browsers cannot prioritize loading these images as effectively as `<img>` tags with `fetchpriority="high"`.
    *   *Impact*: Slower LCP on the most important landing pages.
    *   *Fix*: Switch to `next/image` with `fill` and `priority` props.
*   **Operator Logos**: The homepage renders operator logos using standard `<img>` tags.
    *   *Impact*: No automatic format conversion (WebP/AVIF) or resizing. Users load full-resolution images even for 48x48px thumbnails.

### 2. CLS (Cumulative Layout Shift)
*   **Unsized Images**: The `<img>` tags observed in `page.tsx` generally lack explicit `width` and `height` attributes (relies on CSS classes). If CSS loads late or images load before CSS, layout shifts will occur.
*   **Map Loading**: Leaflet maps often cause layout shifts when initializing. Ensure the map container has a fixed height enforced by CSS before the JS loads.

### 3. TTI (Time to Interactive)
*   **Bundle Size**: The extensive use of client-side interactivity in `ItineraryView` (toggles, maps) means a larger JS bundle.
*   **Mitigation**: Continue using dynamic imports (`next/dynamic`) for heavy components like `ItineraryMap` and `RichTextEditor`.

## Caching & CDN Strategy
*   **Static Assets**: Vercel serves build assets globally.
*   **Dynamic Content**: The `getHomePageData` function runs on every request.
    *   *Recommendation*: Implement `unstable_cache` (Next.js Cache API) for database queries with a revalidation tag (e.g., `revalidateTag('content')`). This allows serving a "static" version of the database content that regenerates only when content changes.
*   **Image CDN**: Since images seem to be stored as URLs in the DB, ensure these URLs point to an image CDN (like Vercel Blob, Cloudinary, or Imgix) that handles on-the-fly transformations. Serving raw images from an S3 bucket is inefficient.

## Recommendations
1.  **Migrate to `next/image`**: Systematically replace all `<img>` tags with `next/image`. This requires configuring `remotePatterns` in `next.config.ts` to allow the external image domains.
2.  **Optimize Hero Sections**: Refactor the Itinerary Hero to use `next/image` with `priority` instead of a background div.
3.  **Database Caching**: Wrap heavy database queries in `unstable_cache`.
4.  **Font Optimization**: `next/font` is already in use (`layout.tsx`), which is excellent for preventing layout shifts caused by font loading (FOUT/FOIT).
