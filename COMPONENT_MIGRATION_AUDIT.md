# Component Migration Audit

**Date:** 2025-02-15
**Total Components:** 138
**Target:** Migrate to shadcn/ui base components

---

## Migration Status Legend

- ✅ **Completed** - Fully migrated to shadcn
- 🔄 **In Progress** - Partially migrated
- 📝 **Planned** - Scheduled for migration
- ⚠️ **High Risk** - Complex, needs careful migration
- ⏭️ **Skip** - Keep as-is (no shadcn equivalent needed)

---

## Phase 1: Foundation & Setup (Sessions 1-10)

### ✅ Completed
- [x] shadcn/ui initialization
- [x] Core components installed (button, card, badge, input, label, select, checkbox, radio-group, textarea)
- [x] Advanced components (dialog, dropdown-menu, popover, tabs, accordion, alert, separator, tooltip)
- [x] Design tokens created
- [x] Badge extended with `accent` variant and `size` prop

---

## Phase 2: Core UI Components (Sessions 11-60)

### Primitive Components (Sessions 11-20)

| Component | Path | Status | Complexity | Notes |
|-----------|------|--------|------------|-------|
| Button | `ui/button.tsx` | ✅ | Low | shadcn installed, needs variant check |
| Card | `ui/card.tsx` | ✅ | Low | shadcn installed |
| Badge | `ui/badge.tsx` | ✅ | Low | Extended with accent variant + size |
| Skeleton | `ui/Skeleton.tsx` | 📝 | Low | Replace with shadcn skeleton |

### Form Components (Sessions 21-35)

| Component | Path | Status | Complexity | Notes |
|-----------|------|--------|------------|-------|
| Input | `ui/input.tsx` | ✅ | Low | shadcn installed |
| Select | `ui/select.tsx` | ✅ | Low | shadcn installed |
| Checkbox | `ui/checkbox.tsx` | ✅ | Low | shadcn installed |
| Textarea | `ui/textarea.tsx` | ✅ | Low | shadcn installed |
| Label | `ui/label.tsx` | ✅ | Low | shadcn installed |
| Radio Group | `ui/radio-group.tsx` | ✅ | Low | shadcn installed |

### Navigation Components (Sessions 36-50)

| Component | Path | Status | Complexity | Notes |
|-----------|------|--------|------------|-------|
| Breadcrumbs | `ui/Breadcrumbs.tsx` | 📝 | Medium | Rebuild with shadcn primitives |
| Pagination | `ui/Pagination.tsx` | 📝 | Medium | Use shadcn button variants |
| SiteSearch | `ui/SiteSearch.tsx` | ⚠️ | High | Complex - use Dialog + Input |

### Feedback Components (Sessions 51-60)

| Component | Path | Status | Complexity | Notes |
|-----------|------|--------|------------|-------|
| CookieBanner | `ui/CookieBanner.tsx` | 📝 | Medium | Use Alert variant |
| ShareButton | `ui/ShareButton.tsx` | 📝 | Medium | Use Popover + Button |
| FavoriteButton | `ui/FavoriteButton.tsx` | 📝 | Medium | Keep state logic, restyle button |
| FavouriteButton | `ui/FavouriteButton.tsx` | 📝 | Medium | Duplicate - merge with FavoriteButton |
| VerifiedBadge | `ui/VerifiedBadge.tsx` | 📝 | Low | Use Badge with custom styling |

---

## Phase 3: Domain Components (Sessions 61-140)

### Card Variants (Sessions 61-80)

| Component | Path | Status | Complexity | Notes |
|-----------|------|--------|------------|-------|
| ActivityCard | `cards/activity-card.tsx` | 📝 | Medium | Rebuild with Card + Badge + Button |
| OperatorCard | `cards/operator-card.tsx` | 📝 | Medium | Rebuild with Card + Badge |
| AccommodationCard | `cards/accommodation-card.tsx` | 📝 | Medium | Rebuild with Card + Badge |
| EventCard | `cards/event-card.tsx` | 📝 | Medium | Rebuild with Card + Badge |
| RegionCard | `cards/region-card.tsx` | 📝 | Low | Rebuild with Card |
| ItineraryCard | `cards/itinerary-card.tsx` | 📝 | Medium | Rebuild with Card + Timeline |
| ComboSpotCard | `combo/ComboSpotCard.tsx` | 📝 | Medium | Rebuild with Card + multiple Badges |
| CoasteeringSpotCard | `coasteering/CoasteeringSpotCard.tsx` | 📝 | Low | Rebuild with Card |
| ShowCaveCard | `caving/ShowCaveCard.tsx` | 📝 | Low | Rebuild with Card |
| AdventureCaveCard | `caving/AdventureCaveCard.tsx` | 📝 | Low | Rebuild with Card |
| EventGridCard | `events/EventGridCard.tsx` | 📝 | Low | Rebuild with Card |
| VoiceTipCard | `voice-tips/VoiceTipCard.tsx` | 📝 | Medium | Rebuild with Card + audio player |
| BestOfCard | `content/BestOfCard.tsx` | 📝 | Low | Rebuild with Card |

### Layout Components (Sessions 81-95)

| Component | Path | Status | Complexity | Notes |
|-----------|------|--------|------------|-------|
| Footer | `layout/footer.tsx` | 📝 | Medium | Keep structure, use shadcn Button for links |
| Header | `layout/header.tsx` | ⚠️ | High | Complex - nav, mobile menu, search - use Sheet + DropdownMenu |

### Feature Components - Itinerary (Sessions 96-110)

| Component | Path | Status | Complexity | Notes |
|-----------|------|--------|------------|-------|
| CustomStopForm | `itinerary/CustomStopForm.tsx` | 📝 | Medium | Use shadcn Form components |
| ItineraryPrintButton | `itinerary/ItineraryPrintButton.tsx` | 📝 | Low | Use Button |
| CostBreakdown | `itinerary/CostBreakdown.tsx` | 📝 | Medium | Use Card + Table |
| ItineraryMap | `itinerary/ItineraryMap.tsx` | ⏭️ | High | Keep as-is (map library) |
| TimelineDay | `itinerary/TimelineDay.tsx` | 📝 | Medium | Use Card + Timeline pattern |
| TripNotes | `itinerary/TripNotes.tsx` | 📝 | Low | Use Textarea |
| EnquireAllVendors | `itinerary/EnquireAllVendors.tsx` | 📝 | Medium | Use Dialog + Form |
| ItineraryView | `itinerary/ItineraryView.tsx` | 📝 | Medium | Use Tabs |
| ThingsToBook | `itinerary/ThingsToBook.tsx` | 📝 | Medium | Use Card + Checklist |
| ItinerarySocialShare | `itinerary/ItinerarySocialShare.tsx` | 📝 | Low | Use Popover + Button |
| ItineraryQuickNav | `itinerary/ItineraryQuickNav.tsx` | 📝 | Low | Use sticky nav pattern |
| ItineraryFactSheet | `itinerary/ItineraryFactSheet.tsx` | 📝 | Low | Use Card |
| BasecampPicker | `itinerary/BasecampPicker.tsx` | 📝 | Medium | Use Select |

### Feature Components - Comments (Sessions 111-115)

| Component | Path | Status | Complexity | Notes |
|-----------|------|--------|------------|-------|
| CommentsSection | `comments/CommentsSection.tsx` | 📝 | High | Use Textarea + Button + Card |
| VoiceRecorder | `comments/VoiceRecorder.tsx` | ⏭️ | High | Keep as-is (audio recording) |
| CommentList | `comments/CommentList.tsx` | 📝 | Medium | Use Card for each comment |

### Feature Components - Events (Sessions 116-120)

| Component | Path | Status | Complexity | Notes |
|-----------|------|--------|------------|-------|
| AddToCalendarButton | `events/AddToCalendarButton.tsx` | 📝 | Medium | Use DropdownMenu |
| EventCalendar | `events/EventCalendar.tsx` | ⚠️ | High | Complex calendar UI |
| EventsList | `events/EventsList.tsx` | 📝 | Low | Use Card grid |
| SaveEventButton | `events/SaveEventButton.tsx` | 📝 | Low | Use Button |
| ShareEventButton | `events/ShareEventButton.tsx` | 📝 | Low | Use Popover + Button |
| ThisWeekendWidget | `events/ThisWeekendWidget.tsx` | 📝 | Medium | Use Card |

### Admin Components (Sessions 121-140)

| Component | Path | Status | Complexity | Notes |
|-----------|------|--------|------------|-------|
| ImageUpload | `admin/ImageUpload.tsx` | 📝 | Medium | Use shadcn Form + Input |

### Filter Components (Sessions 141-150)

| Component | Path | Status | Complexity | Notes |
|-----------|------|--------|------------|-------|
| AccommodationFilters | `accommodation/AccommodationFilters.tsx` | 📝 | Medium | Use Select + Checkbox |
| ActivityFilters | `activities/ActivityFilters.tsx` | 📝 | Medium | Use Select + Checkbox |
| DirectoryFilters | `directory/DirectoryFilters.tsx` | 📝 | Medium | Use Select + Checkbox |

---

## Components to Keep As-Is (No Migration Needed)

### Maps & Geolocation
- `ui/MapView.tsx` - Leaflet integration
- `ui/ItineraryMap.tsx` - Map component
- `ui/RegionMap.tsx` - Regional map
- `maps/AccommodationLocationMap.tsx`
- `maps/ActivityLocationMap.tsx`
- `itinerary/ItineraryMap.tsx`

### Media & Embeds
- `ui/VideoEmbed.tsx` - Video player
- `ui/FallbackImage.tsx` - Image fallback
- `ui/photo-credit.tsx` - Image credits
- `comments/VoiceRecorder.tsx` - Audio recording

### Analytics & Tracking
- `ui/ViewTracker.tsx` - Analytics tracking
- `seo/JsonLd.tsx` - SEO schema

### Specialized Widgets
- `weather/ClimateChart.tsx` - Chart.js integration
- `weather/WeatherWidget.tsx` - Weather API
- `voice-tips/AudioWaveform.tsx` - Audio visualization

---

## High-Risk Components (Require Extra Care)

1. **Header** (`layout/header.tsx`) - Complex navigation, mobile menu, search
2. **SiteSearch** (`ui/SiteSearch.tsx`) - Search functionality + UI
3. **EventCalendar** (`events/EventCalendar.tsx`) - Calendar grid logic
4. **CommentsSection** (`comments/CommentsSection.tsx`) - Complex state management

---

## Component Count Summary

- **Total Components:** 138
- **shadcn Base (Completed):** 15
- **Domain Components to Migrate:** ~60
- **Keep As-Is (No Migration):** ~30
- **Remaining to Migrate:** ~33

---

## Next Steps

1. ✅ Complete Primitive Components migration
2. 📝 Migrate Card variants (activity, operator, accommodation, etc.)
3. 📝 Migrate Layout components (header, footer)
4. 📝 Migrate Feature components (itinerary, events, filters)
5. 📝 QA & visual regression testing
6. 📝 Performance audit & cleanup
