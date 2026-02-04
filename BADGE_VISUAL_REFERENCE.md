# Verified Badge Visual Reference

## Badge Variants

### Claimed Operator (Green Shield)
```
┌─────────────────────────────────────┐
│ 🛡️ ✓ INDEPENDENT VERIFIED OPERATOR │ (LG - Full text)
└─────────────────────────────────────┘
Color: Emerald green (#10b981)
Background: Gradient from emerald-50 to green-50
Border: emerald-500/30

┌────────────────┐
│ 🛡️ ✓ Verified  │ (MD - Short label)
└────────────────┘

┌────┐
│ 🛡️✓ │ (SM - Icon only)
└────┘
```

### Premium Operator (Orange Shield)
```
┌─────────────────────────────────────┐
│ 🛡️ ⭐ PREMIUM VERIFIED PARTNER      │ (LG - Full text)
└─────────────────────────────────────┘
Color: Brand orange (#f97316)
Background: Gradient from orange/10 to amber-500/10
Border: orange/30
Star accent: Yes

┌──────────────────────┐
│ 🛡️ ⭐ Premium Partner │ (MD - Short label)
└──────────────────────┘

┌────┐
│ 🛡️✓ │ (SM - Icon only, no star)
└────┘
```

### Stub Operator
```
(No badge shown)
```

---

## Implementation Examples

### 1. Operator Card (Featured)
```
┌────────────────────────────────────────────┐
│  [LOGO]                       [Featured]   │
│  Adventure Operator Name                   │
│  🛡️ ⭐ PREMIUM VERIFIED PARTNER            │
│  "Best coasteering in North Wales"        │
│                                            │
│  ⭐ 4.9 (1,234) • ££-£££                   │
│  Coasteering • Kayaking • +2 more          │
└────────────────────────────────────────────┘
```

### 2. Operator Card (Default/Compact)
```
┌────────────────────────────────────────┐
│ [LOGO]  Adventure Operator Name  🛡️✓ →│
│         📍 Snowdonia                    │
│         ⭐ 4.9 • ££                     │
└────────────────────────────────────────┘
```

### 3. Operator Profile Page

#### Verification Banner (Premium)
```
┌─────────────────────────────────────────────────────┐
│  ✓ This operator has been independently verified by │
│    Adventure Wales                                   │
└─────────────────────────────────────────────────────┘
Background: Orange gradient (#f97316/10 to amber-500/10)
```

#### Verification Banner (Claimed)
```
┌─────────────────────────────────────────────────────┐
│  ✓ This operator has been independently verified by │
│    Adventure Wales                                   │
└─────────────────────────────────────────────────────┘
Background: Emerald gradient (emerald-50 to green-50)
```

#### Hero Section
```
  [OPERATOR LOGO]

  Adventure Operator Name  🛡️ ⭐ PREMIUM VERIFIED PARTNER
  "The best outdoor adventures in Wales"
  📍 Snowdonia, North Wales  •  ⭐ 4.9 (1,234 reviews)
```

### 4. Activity Card
```
┌─────────────────────────┐
│  [Activity Hero Image]  │
│                         │
│  Coasteering Adventure  │
│  by Operator Name  🛡️✓  │
│  📍 Pembrokeshire       │
│  ⏱️ 3 hours    From £45 │
└─────────────────────────┘
```

### 5. Itinerary Timeline
```
Day 01
  │
  ├─ 09:00
  │  ┌──────────────────────────────────┐
  │  │ Coasteering Session  🛡️✓         │
  │  │ by Adventure Wales               │
  │  │ 3 hours • £55                    │
  │  │                                  │
  │  │ Experience the best coasteering │
  │  │ in North Wales...                │
  │  │                                  │
  │  │ [Book Now] [Map]                 │
  │  └──────────────────────────────────┘
```

---

## Color Specifications

### Claimed (Green)
- **Background**: `bg-gradient-to-r from-emerald-50 to-green-50`
- **Border**: `border-emerald-500/30`
- **Text**: `text-emerald-700`
- **Icon**: `text-emerald-600`
- **Shadow**: `shadow-emerald-500/5`

### Premium (Orange)
- **Background**: `bg-gradient-to-r from-[#f97316]/10 to-amber-500/10`
- **Border**: `border-[#f97316]/30`
- **Text**: `text-[#f97316]`
- **Icon**: `text-[#f97316]`
- **Shadow**: `shadow-[#f97316]/5`

---

## Size Specifications

### Small (SM)
- **Height**: `h-5` (20px)
- **Icon**: `w-3 h-3` (12px)
- **Padding**: `px-2 py-0.5`
- **Gap**: `gap-1`
- **Text**: None (icon only)

### Medium (MD)
- **Height**: `h-6` (24px)
- **Icon**: `w-4 h-4` (16px)
- **Padding**: `px-2.5 py-1`
- **Gap**: `gap-1.5`
- **Text**: `text-xs` (12px)
- **Label**: "Verified" / "Premium Partner"

### Large (LG)
- **Height**: `h-8` (32px)
- **Icon**: `w-5 h-5` (20px)
- **Padding**: `px-4 py-1.5`
- **Gap**: `gap-2`
- **Text**: `text-sm` (14px)
- **Label**: "INDEPENDENT VERIFIED OPERATOR" / "PREMIUM VERIFIED PARTNER"

---

## Usage Guidelines

### When to use each size:

**SM (Small)**
- Compact operator cards
- Activity cards (with operator name)
- Itinerary timeline stops
- Mobile views where space is limited
- Badge as supporting element

**MD (Medium)**
- Directory listings
- Search results
- Sidebar components
- Operator cards (default variant)
- Badge as secondary element

**LG (Large)**
- Operator profile hero section
- Featured operator cards
- Marketing materials
- Banner sections
- Badge as primary trust signal

---

## Accessibility

- All badges have proper `title` attributes for tooltips
- Color contrast ratios meet WCAG AA standards
- Icons paired with text labels (except SM size where space is constrained)
- Badge information available to screen readers

---

## Technical Notes

### Component Props
```typescript
interface VerifiedBadgeProps {
  claimStatus: "stub" | "claimed" | "premium";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}
```

### Example Usage
```tsx
// Large badge with label (operator profile)
<VerifiedBadge claimStatus={operator.claimStatus} size="lg" />

// Small icon-only badge (activity card)
<VerifiedBadge 
  claimStatus={operator.claimStatus} 
  size="sm" 
  showLabel={false} 
/>

// Medium badge with label (operator card)
<VerifiedBadge claimStatus="premium" size="md" />

// Convenience exports
<VerifiedBadgeSm claimStatus="claimed" />
<VerifiedBadgeMd claimStatus="premium" />
<VerifiedBadgeLg claimStatus="claimed" />
```

### Conditional Rendering
The badge returns `null` when `claimStatus="stub"`, so you can safely use it everywhere without additional conditionals:

```tsx
{/* Always show, automatically hidden for stub operators */}
<VerifiedBadge claimStatus={operator.claimStatus} />
```

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

All modern browsers with CSS Grid and Flexbox support.
