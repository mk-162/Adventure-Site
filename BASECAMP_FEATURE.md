# Basecamp Feature Implementation

## Overview
The Basecamp feature allows users to select their accommodation as their "basecamp" — all travel times and routes in the itinerary recalculate relative to it.

## Files Created

### 1. `/src/lib/travel-utils.ts` (NEW)
Utility functions for distance and travel time calculations:
- `calculateDistance()` - Haversine formula for distance between coordinates
- `calculateDrivingTime()` - Converts distance to driving time (30mph avg)
- `formatDistance()` - Formats distance for display

### 2. `/src/components/itinerary/BasecampPicker.tsx` (NEW)
Modal component for selecting accommodation as basecamp:
- Displays accommodation options with distance to first activity
- Shows price range and type
- Sorts by proximity
- Mobile-responsive modal design

## Files Modified

### 3. `/src/components/itinerary/ItineraryView.tsx`
- Added basecamp state management
- Added accommodations prop
- Shows "Select Your Basecamp" prompt when no basecamp selected
- Shows selected basecamp banner with "Change" button
- Passes basecamp to TimelineDay and ItineraryMap
- Renders BasecampPicker modal

### 4. `/src/components/itinerary/TimelineDay.tsx`
- Added basecamp prop
- Calculates travel time FROM basecamp to first stop of day
- Calculates travel time BACK TO basecamp from last stop of day
- Shows "From Basecamp" indicator at start of day
- Shows "Return to Basecamp" indicator at end of day
- Uses orange accent color (#f97316) for basecamp elements

### 5. `/src/components/itinerary/ItineraryMap.tsx`
- Added basecamp prop
- Shows basecamp as special home icon (🏠)
- Draws dashed orange lines from basecamp to first/last stops of each day
- Basecamp marker has distinctive styling

### 6. `/src/app/itineraries/[slug]/page.tsx`
- Imports `getAccommodation` query
- Fetches accommodation for the itinerary's region
- Passes accommodation data to ItineraryView

## Design Features

### Colors
- Primary: `#1e3a4c` (dark blue-grey)
- Accent/Basecamp: `#f97316` (orange)

### Icons
- Home icon for basecamp
- MapPin for location indicators
- Car for travel time indicators

### UX Flow
1. User sees prompt: "📍 Select your basecamp to see personalised travel times"
2. Clicks prompt → BasecampPicker modal opens
3. Selects accommodation → Modal closes, basecamp banner appears
4. Timeline updates with travel times from/to basecamp
5. Map shows basecamp with dashed connecting lines
6. User can click "Change" to pick different basecamp

## Technical Notes

### Distance Calculation
- Uses Haversine formula for lat/lng distance
- Assumes 30mph average speed (48.28 km/h)
- Suitable for Welsh roads with hills and rural areas

### Accommodation Query
- Queries by `regionId` to show relevant options
- Filters for published status only
- Returns: name, type, lat/lng, priceFrom, priceTo, slug

### Responsive Design
- Modal full-screen on mobile, centered on desktop
- Basecamp prompt shows on all viewports
- Travel indicators visible on both mobile and desktop

## Future Enhancements (Not Implemented)
- Save basecamp selection to localStorage
- Show accommodation details/booking link
- Filter accommodations by type
- Calculate actual driving routes (Google Maps API)
- Show elevation gain to activities
- Suggest optimal basecamp based on itinerary

## Testing Checklist
- ✓ Components created
- ✓ TypeScript types defined
- ✓ Imports updated
- ✓ Props passed correctly
- ✓ Existing functionality preserved (Standard/Wet/Budget toggles)
- □ Build verification (build interrupted - needs retry)
- □ Visual test in browser
- □ Mobile responsiveness
- □ Map rendering with basecamp
- □ Travel time calculations accurate

## Known Issues
- Build was interrupted during testing - needs clean build verification
- No real accommodation data in DB yet (will use mock or empty state)

## Browser Compatibility
- Modern browsers with ES6+ support
- Leaflet map library compatible
- Next.js 15 SSR compatible
