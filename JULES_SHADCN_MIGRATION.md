# Jules Brief: shadcn/ui Migration

## Mission
Migrate all 124 custom components to shadcn/ui while maintaining visual consistency and functionality.

**Timeline**: 200 sessions (100 today, 100 tomorrow)
**Approach**: Batch migration with automated testing

---

## Phase 1: Foundation (Sessions 1-10)

### Session 1: Setup shadcn/ui
```bash
npx shadcn@latest init
```
Config options:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**
- Tailwind config: **tailwind.config.ts**
- Components directory: **src/components/ui**
- Utils: **src/lib/utils.ts** (already exists - merge)
- React Server Components: **Yes**
- TypeScript: **Yes**

### Session 2: Install Core Components
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add textarea
```

### Session 3: Install Advanced Components
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add popover
npx shadcn@latest add tabs
npx shadcn@latest add accordion
npx shadcn@latest add alert
npx shadcn@latest add separator
npx shadcn@latest add skeleton
npx shadcn@latest add tooltip
```

### Session 4: Design Token Mapping
Create `src/lib/design-tokens.ts`:
```typescript
// Map existing Adventure Wales colors to shadcn theme
export const colors = {
  primary: '#1e3a4c',      // Teal
  accent: '#f97316',       // Orange
  background: '#ffffff',
  foreground: '#1e3a4c',
  muted: '#f1f5f9',
  border: '#e2e8f0',
}
```

Update `tailwind.config.ts` to use shadcn + Adventure Wales brand:
- Keep existing `#1e3a4c` and `#f97316`
- Map to shadcn CSS variables
- Preserve all custom utilities

### Sessions 5-10: Backup & Audit
- Create backup branch: `git checkout -b pre-shadcn-backup`
- Document all 124 components (name, props, usage count)
- Identify high-risk components (heavily customized)
- Create component migration checklist

---

## Phase 2: Core UI Migration (Sessions 11-60)

### Migration Pattern (for each component):
1. **Backup original** → rename to `ComponentName.legacy.tsx`
2. **Replace with shadcn** → use shadcn component as base
3. **Apply brand styling** → add Adventure Wales colors/variants
4. **Test props/API** → ensure existing usage still works
5. **Update imports** → find/replace across codebase
6. **Visual QA** → screenshot before/after

### Batch 1: Primitive Components (Sessions 11-20)
**Priority**: These are used everywhere

| Component | File | Sessions | Notes |
|-----------|------|----------|-------|
| Button | `ui/button.tsx` | 2 | Already custom - map variants to shadcn |
| Card | `ui/card.tsx` | 1 | Simple replacement |
| Badge | `ui/badge.tsx` | 1 | Simple replacement |
| Skeleton | `ui/Skeleton.tsx` | 1 | Already exists in shadcn |

**Testing**: Run build after each component
```bash
npm run build
```

### Batch 2: Form Components (Sessions 21-35)
| Component | File | Sessions | Strategy |
|-----------|------|----------|----------|
| Input | *create new* | 2 | Add shadcn Input |
| Select | *create new* | 2 | Add shadcn Select |
| Checkbox | *create new* | 1 | Add shadcn Checkbox |
| Textarea | *create new* | 2 | Add shadcn Textarea |
| Label | *create new* | 1 | Add shadcn Label |

**Find usage**: Search for `<input`, `<select`, `<textarea` in all `.tsx` files
**Replace**: Swap with shadcn equivalents
**Test**: Check forms in `/contact`, `/auth`, `/admin`

### Batch 3: Navigation Components (Sessions 36-50)
| Component | File | Sessions | Notes |
|-----------|------|----------|-------|
| Breadcrumbs | `ui/Breadcrumbs.tsx` | 2 | Rebuild with shadcn primitives |
| Pagination | `ui/Pagination.tsx` | 2 | Use shadcn button variants |
| SiteSearch | `ui/SiteSearch.tsx` | 4 | Complex - use Dialog + Input |

**Keep logic**: Don't change search/nav logic, just UI layer

### Batch 4: Feedback Components (Sessions 51-60)
| Component | File | Sessions | Notes |
|-----------|------|----------|-------|
| CookieBanner | `ui/CookieBanner.tsx` | 2 | Use Alert variant |
| ShareButton | `ui/ShareButton.tsx` | 2 | Use Popover + Button |
| FavoriteButton | `ui/FavoriteButton.tsx` | 3 | Keep state logic, restyle button |
| VerifiedBadge | `ui/VerifiedBadge.tsx` | 2 | Use Badge with custom styling |

---

## Phase 3: Domain Components (Sessions 61-140)

### Batch 5: Card Variants (Sessions 61-80)
**Directory**: `src/components/cards/`

| Component | Sessions | Strategy |
|-----------|----------|----------|
| ActivityCard | 3 | Rebuild with Card + Badge + Button |
| OperatorCard | 3 | Rebuild with Card + Badge |
| AccommodationCard | 3 | Rebuild with Card + Badge |
| EventCard | 2 | Rebuild with Card + Badge |
| RegionCard | 2 | Rebuild with Card |
| JournalCard | 2 | Rebuild with Card |
| ComboCard | 3 | Rebuild with Card + multiple Badges |
| ItineraryCard | 3 | Rebuild with Card + Timeline |

**Pattern for all cards**:
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ActivityCard({ activity, region, operator }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        {/* Image */}
      </CardHeader>
      <CardContent>
        <Badge>{activity.type}</Badge>
        <CardTitle>{activity.name}</CardTitle>
        <CardDescription>{activity.description}</CardDescription>
        <Button>Learn More</Button>
      </CardContent>
    </Card>
  )
}
```

### Batch 6: Layout Components (Sessions 81-95)
**Directory**: `src/components/layout/`

| Component | Sessions | Notes |
|-----------|----------|-------|
| footer.tsx | 3 | Keep structure, use shadcn Button for links |
| header.tsx | 5 | Complex - nav, mobile menu, search - use Sheet + DropdownMenu |

### Batch 7: Feature Components (Sessions 96-120)
**Directories**: `activities/`, `itinerary/`, `events/`, etc.

For each feature component:
1. Identify UI primitives used (buttons, cards, badges)
2. Replace with shadcn equivalents
3. Keep business logic untouched
4. Test the feature page

**High-complexity components** (3-5 sessions each):
- `comments/CommentsSection.tsx` - use Textarea + Button + Card
- `itinerary/ItineraryBuilder.tsx` - use Tabs + Accordion + Card
- `maps/MapView.tsx` - keep as-is (not shadcn territory)
- `weather/WeatherWidget.tsx` - use Card + Skeleton

**Low-complexity components** (1-2 sessions each):
- Simple containers, wrappers, display components
- Just swap primitives

### Batch 8: Admin Components (Sessions 121-140)
**Directory**: `src/components/admin/`

Lower priority - these are internal tools
- Use shadcn Table, Form, Dialog components
- Focus on functionality over polish

---

## Phase 4: QA & Polish (Sessions 141-180)

### Visual Regression Testing (Sessions 141-160)
For each major page type:
1. Take screenshot (before migration - from backup branch)
2. Take screenshot (after migration - current)
3. Compare side-by-side
4. Fix visual discrepancies

**Pages to test**:
- `/` (Homepage)
- `/snowdonia` (Region Hub)
- `/snowdonia/things-to-do` (Activity Listing)
- `/activities/zip-lining-snowdonia` (Activity Detail)
- `/directory` (Operator Directory)
- `/directory/zip-world` (Operator Profile)
- `/events` (Events Calendar)
- `/itineraries` (Itineraries Listing)

### Responsive Testing (Sessions 161-170)
Test all pages at:
- Mobile (375px)
- Tablet (768px)
- Desktop (1440px)

Common issues:
- Button sizes too small on mobile
- Card grids breaking
- Nav overflow

### Accessibility Audit (Sessions 171-180)
- Run axe DevTools on all pages
- Fix aria-labels
- Fix keyboard navigation
- Fix focus states
- Test with screen reader

---

## Phase 5: Performance & Cleanup (Sessions 181-200)

### Bundle Size Analysis (Sessions 181-185)
```bash
npm run build
# Check .next/analyze (if enabled)
# Ensure shadcn didn't bloat bundle
```

### Remove Legacy Code (Sessions 186-195)
- Delete all `*.legacy.tsx` backups
- Remove unused Tailwind utilities
- Clean up old design tokens
- Update JULES.md with new component patterns

### Documentation (Sessions 196-200)
Create `docs/SHADCN_MIGRATION.md`:
- Component replacement map
- New styling conventions
- Brand customization guide
- Common patterns for future components

Update `JULES.md`:
- New component import paths
- shadcn-based code examples
- Updated styling conventions

---

## Success Criteria

✅ All 124 components migrated to shadcn
✅ All 114 pages render correctly
✅ Build succeeds with no errors
✅ Visual parity with original design
✅ Accessibility scores maintained/improved
✅ Bundle size ≤ 10% increase
✅ No console errors/warnings
✅ Responsive at all breakpoints

---

## Rollback Plan

If migration fails catastrophically:
```bash
git checkout pre-shadcn-backup
git checkout -b main-rollback
git push origin main-rollback
```

Keep backup branch for at least 2 weeks post-migration.

---

## Session Allocation Summary

| Phase | Sessions | Focus |
|-------|----------|-------|
| Foundation | 1-10 | Setup, install, config |
| Core UI | 11-60 | Primitives, forms, nav, feedback |
| Domain Components | 61-140 | Cards, features, admin |
| QA & Polish | 141-180 | Testing, accessibility, responsive |
| Performance & Cleanup | 181-200 | Optimization, docs, cleanup |

**Total**: 200 sessions
**Estimated Duration**: 2 days (100/day)

---

## How Jules Should Work

**Each session**:
1. Read this brief + locate target component
2. Perform migration step
3. Run `npm run build` to verify
4. Log result in `jules-queue.json` (completed/failed)
5. If blocked, log issue and move to next task

**Coordination**:
- Sessions 1-100: Run today (foundation + core UI + start domain)
- Sessions 101-200: Run tomorrow (finish domain + QA + cleanup)

**Communication**:
- Create `SHADCN_MIGRATION_LOG.md` with session-by-session notes
- Flag any blockers immediately
- Screenshot visual differences for human review

---

## Questions for MK (if any)

❓ Any specific shadcn variants/customizations needed?
❓ OK to temporarily break dev server during migration? (Will work in build mode)
❓ Any pages we can skip/deprioritize?

---

**Ready to execute. Waiting for spawn command.**
