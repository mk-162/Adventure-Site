# UX & Usability Audit

**Agent:** UX Lead
**Date:** 2024-05-22

## Executive Summary
The platform offers a clean, content-first experience with a strong focus on discovery. The "Itinerary Engine" is a standout feature, providing rich, interactive planning tools. However, the primary Search interface relies on standard browser controls which may limit scalability and visual integration on mobile devices. The "Information Architecture" is logical, pivoting around Regions and Activities.

## User Journey Audit

### 1. Search & Discovery
*   **Search Bar**: The `SearchBar` component uses native `<select>` elements.
    *   *Observation*: While accessible, standard selects offer poor UX for long lists (e.g., the "What" dropdown). On mobile, the native picker is functional but disconnects the user from the app branding.
    *   *Friction*: Changing the "Where" selection silently resets the "What" selection if the activity isn't available. While logically correct, this lack of feedback can confuse users who wonder where their selection went.
*   **Weekend Widget**: The `ThisWeekendWidget` is an excellent dynamic feature that reduces friction for spontaneous travelers.

### 2. Itinerary Experience
*   **Visual Hierarchy**: The hero section clearly communicates duration, difficulty, and seasonality.
*   **Interactive Map**: The integration of a map alongside the timeline is crucial for spatial understanding.
*   **Mobile Experience**: The sticky bottom bar on mobile (`ItineraryDetailPage`) is a "Green Pattern", ensuring the primary CTA ("Enquire" or "Share") is always accessible without blocking content.

### 3. Navigation & IA
*   **Breadcrumbs**: Correctly implemented on deep pages (Itinerary Detail), helping users maintain context.
*   **Taxonomy**: The split between "Things to Do" (Activities) and "Where to Stay" (Accommodation) is standard and effective. Grouping activities by "Water", "Mountain", etc., in the search bar helps scanability.

## "Dark Patterns" & Friction

*   **None Detected**: The interface avoids deceptive patterns. "Trusted Partners" are clearly labeled, and costs are estimated transparently (`priceEstimateFrom`).
*   **Friction Point**: The "Enquire All Vendors" functionality implies a bulk action. Users might be hesitant to spam multiple businesses. Clearer copy ensuring them they can review the list before sending would build trust.

## Mobile Responsiveness
*   **Touch Targets**: The "Search" button in `SearchBar` is full-width on mobile, which is excellent.
*   **Grid Layouts**: The `RegionsGrid` and `ActivitiesRow` adapt to mobile viewports (likely using `grid-cols-1` or `grid-cols-2`).
*   **Maps**: Map interaction on mobile can be tricky (scroll trapping). Ensure "two-finger drag" is enabled or the map captures touch events correctly to prevent getting stuck while scrolling the page.

## Recommendations
1.  **Upgrade Search UI**: Replace native `<select>` with a custom command-palette style picker (like `cmdk` or Radix UI Select) to allow searching within the dropdown and better visual grouping.
2.  **Feedback Loops**: Add a toast notification or subtle animation when the "What" field is auto-reset by the "Where" selection.
3.  **Map Gestures**: Verify that map components on mobile do not hijack page scrolling.
4.  **Empty States**: Ensure search results pages have helpful "No results found" states with alternative suggestions (e.g., "Try a different region").
