# Accessibility Audit (WCAG 2.1 AA)

**Agent:** Accessibility Consultant
**Date:** 2024-05-22

## Executive Summary
The application demonstrates a good baseline understanding of accessibility, particularly with keyboard navigation styles (focus rings) and semantic HTML structure. However, the heavy reliance on complex interactive widgets (Maps, Itinerary Toggles) requires rigorous ARIA testing. The color palette generally meets contrast ratios, but some "muted" text styles risk falling below the 4.5:1 threshold.

## WCAG Compliance Analysis

### 1. Keyboard Navigation & Focus
*   **Focus Indicators**: The `Button` component explicitly includes `focus:ring-2 focus:ring-offset-2`. This is a "Pass" for SC 2.4.7 (Focus Visible).
*   **Skip Links**: I did not observe a "Skip to Main Content" link in `layout.tsx`. This is a "Fail" for SC 2.4.1 (Bypass Blocks) and crucial for keyboard users to bypass the complex navigation and search bar.

### 2. Semantic HTML & ARIA
*   **Icons**: Lucide icons are used extensively. Ensure they are either treated as decorative (`aria-hidden="true"`) or have screen-reader-only labels if they are interactive buttons without text (e.g., the "Share" icon button).
*   **Search Bar**: The `SearchBar` uses semantic `<label>` elements, but they are styled with `mb-2.5`, creating a visual gap. Ensure the `for` / `id` association is programmatic, not just visual.

### 3. Color Contrast
*   **Brand Orange**: The primary action color `#f97316` (Tailwind `orange-500`) on white has a contrast ratio of ~3.0:1, which **fails** WCAG AA for normal text (requires 4.5:1). It passes for "Large Text" (bold 18px+).
    *   *Risk*: High. Button text and links using this orange are difficult for users with low vision to read.
    *   *Remediation*: Switch to `orange-600` (`#ea580c`) for text, which offers better contrast.
*   **Gray Text**: `text-slate-500` on white is ~4.5:1, which is borderline but acceptable.

### 4. Interactive Components (Maps & Tabs)
*   **Itinerary Toggles**: The "Standard / Wet Weather / Budget" toggle in `ItineraryView` must behave like a Radio Group or Tab List for screen readers. If it's just `div`s with `onClick`, it's inaccessible.
*   **Maps**: Leaflet maps are notoriously difficult for screen readers. Ensure there is a textual alternative (the "Timeline" view) that contains all the same information. The current design appears to provide this duality, which is excellent.

## Recommendations
1.  **Add "Skip to Content" Link**: Insert this as the first child of `<body>` in `layout.tsx`.
2.  **Darken Primary Color**: Change text and button backgrounds from `orange-500` to `orange-600` to meet contrast requirements.
3.  **Audit Icon Buttons**: Review all "Icon Only" buttons (Share, Favorite) to ensure they have `aria-label` or `sr-only` text.
4.  **Form Labels**: Verify `htmlFor` attributes on all labels in the Search Bar match the `id` of their inputs.
