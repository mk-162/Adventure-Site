# France Site Component Patterns

Reference implementations from Ultimate France that should be ported to Adventure Wales.

## PlanYourTrip Component

The service grid that appears on activity/region pages. Shows contextual services with icons and links.

### Interface

```typescript
export interface TripService {
  id: string
  label: string
  description?: string
  href: string
  icon: 'accommodation' | 'holidays' | 'rental' | 'transfers' | 'guides' | 'equipment' | 'experiences'
  partnerSlug?: string
  featured?: boolean
  external?: boolean
}

interface PlanYourTripProps {
  services: TripService[]
  className?: string
  title?: string
  resort?: string
  region?: string
}
```

### Key Features

1. **Color-coded icons** - Each service type has distinct colors:
   - accommodation: emerald
   - holidays: violet
   - rental: orange (brand color)
   - transfers: sky blue
   - guides: amber
   - equipment: slate
   - experiences: rose

2. **Responsive grid** - Adapts based on service count:
   - 2 services: 2 columns
   - 3 services: 3 columns
   - 4+ services: 2 cols mobile, 4 cols desktop

3. **Featured highlight** - `featured: true` adds orange ring

4. **External links** - Shows external icon, opens in new tab with `rel="noopener noreferrer sponsored"`

### Implementation

```tsx
// Icon mapping
const iconMap = {
  accommodation: Home,
  holidays: Compass,
  rental: Bike,
  transfers: Car,
  guides: Users,
  equipment: Wrench,
  experiences: MapPin,
}

// Color mapping
const defaultColors = {
  accommodation: { bg: 'bg-emerald-50', icon: 'text-emerald-600', hover: 'hover:bg-emerald-100' },
  // ... etc
}
```

---

## PartnerCard Component

Displays business/operator cards with tier-based features.

### Interface

```typescript
interface PartnerCardProps {
  title: string
  category: string
  location: string
  tier: 'stub' | 'claimed' | 'premium'
  href: string
  image?: string
  rating?: number
  reviewCount?: number
  description?: string
  offers?: Array<{ title: string; discount: string }>
}
```

### Tier Behavior

**Stub (unclaimed):**
- Image is blurred with dark overlay
- Lock icon centered on image
- "Contact info unavailable" text
- "Claim Listing" CTA
- No rating, no description shown

**Claimed:**
- Full image visible
- Verified badge (shield icon + "Verified")
- Rating stars shown
- Description shown
- "View Details" CTA

**Premium:**
- Orange border (2px)
- Larger shadow
- "Premium Partner" badge
- Special offers section shown
- All claimed features

### Visual Treatment

```tsx
// Premium border
className={isPremium
  ? 'border-2 border-brand-orange shadow-lg hover:shadow-xl'
  : 'border border-gray-100 shadow-sm hover:shadow-md'
}

// Stub blur effect
className={isStub && 'filter blur-sm'}

// Stub overlay
{isStub && (
  <div className="absolute inset-0 bg-brand-slate/60 flex items-center justify-center">
    <Lock className="w-8 h-8 text-white" />
  </div>
)}
```

---

## Ad Components

### HeroBanner

Full-width banner ad with gradient overlay.

```tsx
<div className="relative w-full bg-brand-slate rounded-xl overflow-hidden mb-8">
  <div className="relative h-32 md:h-40 overflow-hidden">
    <Image src={ad.image} fill className="object-cover" />
    <div className="absolute inset-0 bg-gradient-to-r from-brand-slate/90 via-brand-slate/60 to-transparent" />

    <div className="absolute inset-0 flex items-center justify-between px-6 md:px-10">
      <div>
        <span className="text-[10px] font-bold uppercase text-brand-orange bg-brand-slate/50 backdrop-blur px-2 py-1 rounded">
          Sponsored
        </span>
        <h3 className="text-xl md:text-2xl font-display font-bold uppercase text-white">
          {ad.headline}
        </h3>
      </div>
      <Button className="bg-brand-orange">{ad.cta}</Button>
    </div>
  </div>
</div>
```

### SponsorBadge

Inline badge showing sponsor partnership.

```tsx
<div className="inline-flex items-center gap-3 bg-brand-slate/5 border border-brand-slate/10 rounded-lg px-4 py-2 mb-6">
  {sponsor.logo && <Image src={sponsor.logo} />}
  <span className="text-brand-slate/60">{tagline || 'In partnership with'}</span>
  <Link href={linkUrl} className="font-semibold">{sponsor.displayName}</Link>
</div>
```

---

## Services Configuration

Central config for service types.

```typescript
export const SERVICE_CONFIG: Record<ServiceType, {
  label: string
  pluralLabel: string
  icon: string
  description: string
}> = {
  transfers: {
    label: 'Transfers',
    pluralLabel: 'Transfer Companies',
    icon: 'Car',
    description: 'Airport shuttles and resort transport',
  },
  accommodation: {
    label: 'Accommodation',
    pluralLabel: 'Places to Stay',
    icon: 'Home',
    description: 'Hotels, chalets, and apartments',
  },
  rental: {
    label: 'Equipment Rental',
    pluralLabel: 'Rental Shops',
    icon: 'Wrench',
    description: 'Gear and equipment hire',
  },
  lessons: {
    label: 'Lessons',
    pluralLabel: 'Schools & Instructors',
    icon: 'GraduationCap',
    description: 'Schools, courses, and instruction',
  },
  guides: {
    label: 'Guides',
    pluralLabel: 'Guides & Leaders',
    icon: 'Users',
    description: 'Professional guides and tour leaders',
  },
  holidays: {
    label: 'Holidays',
    pluralLabel: 'Holiday Packages',
    icon: 'Compass',
    description: 'Package holidays and trips',
  },
  experiences: {
    label: 'Experiences',
    pluralLabel: 'Experiences',
    icon: 'Sparkles',
    description: 'Unique activities and adventures',
  },
}
```

---

## Service Link Generation

Smart linking based on context (cascading specificity).

```typescript
export function getServiceLink(
  serviceType: ServiceType,
  destination?: string,
  sport?: string
): string {
  if (destination && sport) {
    return `/services/${serviceType}/${destination}/${sport}`
  }
  if (destination) {
    return `/services/${serviceType}/${destination}`
  }
  return `/services/${serviceType}`
}
```

---

## Key Type Definitions

### AdSlot

```typescript
interface AdSlot {
  partnerSlug?: string
  image: string
  headline: string
  cta: string
  link: string
}
```

### SponsorConfig

```typescript
interface SponsorConfig {
  partnerSlug: string
  displayName?: string
  tagline?: string
  logo?: string
  landingPage?: string
  ctaText?: string
  ctaUrl?: string
  excludeOtherAds?: boolean
}
```

### PageAds

```typescript
interface PageAds {
  heroBanner?: AdSlot
  mpu?: AdSlot[]
  linkList?: LinkSlot[]
}
```

---

## Design Tokens

### Colors

```css
--brand-slate: #1e3a4c
--brand-orange: #f97316
--emerald-50: #ecfdf5
--emerald-600: #059669
--sky-50: #f0f9ff
--sky-600: #0284c7
--amber-50: #fffbeb
--amber-600: #d97706
--violet-50: #f5f3ff
--violet-600: #7c3aed
--rose-50: #fff1f2
--rose-600: #e11d48
```

### Typography

```css
.font-display: uppercase, bold, tracking-wider
.text-brand-slate: main heading color
.text-muted-foreground: secondary text
```

### Spacing

```css
Rounded corners: rounded-xl (12px)
Card padding: p-5
Section spacing: mb-6, mb-8
```
