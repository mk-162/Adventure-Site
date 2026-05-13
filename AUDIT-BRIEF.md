# Adventure Wales — Site Audit Brief

**Goal:** Comprehensive audit to identify errors, inconsistencies, broken patterns, and quality issues before content generation sprint.

---

## Audit Scope

### 1. Code Quality & Errors

**TypeScript/JavaScript:**
- [ ] TypeScript errors (`npx tsc --noEmit`)
- [ ] Unused imports/variables
- [ ] Missing type definitions
- [ ] `any` types that should be specific
- [ ] Console.logs left in production code
- [ ] Dead code / unused functions

**React/Next.js:**
- [ ] Client/Server component boundary issues
- [ ] Missing `await params` in dynamic routes
- [ ] Unused props
- [ ] Key prop issues in lists
- [ ] useEffect dependency warnings
- [ ] Hydration mismatches

**Build Issues:**
- [ ] Pages that fail to build
- [ ] Import resolution errors
- [ ] Missing dependencies

---

### 2. Data Layer Audit

**Schema Consistency:**
- [ ] Check `src/db/schema.ts` against actual usage
- [ ] Unused tables/columns
- [ ] Missing indexes for common queries
- [ ] Inconsistent naming (camelCase vs snake_case)

**Query Functions:**
- [ ] Check `src/lib/queries.ts` for:
  - Unused queries
  - Queries missing error handling
  - N+1 query problems
  - Missing relations that should be included
  - Inconsistent return types

**Data Files:**
- [ ] CSV validation in `content/spots/` folders
  - Missing required columns
  - Inconsistent headers
  - Empty/malformed rows
  - Duplicate slugs
- [ ] JSON validation in `content/` folders
  - Schema compliance
  - Missing required fields

---

### 3. Component Audit

**Card Components** (`src/components/cards/`):
- [ ] Prop types consistency
- [ ] Missing null checks for optional data
- [ ] Image handling (missing alt text, broken paths)
- [ ] Link targets (internal vs external handling)
- [ ] Responsive design issues

**Layout Components** (`src/components/layout/`):
- [ ] Header: Check navigation links validity
- [ ] Footer: Check link targets
- [ ] Responsive breakpoints

**UI Components** (`src/components/ui/`):
- [ ] Accessibility issues (ARIA labels, keyboard nav)
- [ ] Unused components
- [ ] Inconsistent variants

---

### 4. Route Audit

**Check all routes for:**
- [ ] 404s (links to non-existent pages)
- [ ] Dynamic route parameter validation
- [ ] Missing error boundaries
- [ ] Loading states
- [ ] Metadata (title, description, OG tags)
- [ ] Canonical URLs

**Pages to verify:**
- `/` (homepage)
- `/[region]` (e.g., `/snowdonia`)
- `/[region]/things-to-do`
- `/[region]/where-to-stay`
- `/activities/[slug]`
- `/directory`
- `/directory/[slug]` (if implemented)
- `/events`
- `/events/[slug]` (if implemented)
- `/itineraries` (if implemented)
- `/itineraries/[slug]` (if implemented)

---

### 5. Content Audit

**Markdown Files:**
- [ ] Frontmatter validation (required fields present)
- [ ] Broken internal links
- [ ] Broken image paths
- [ ] Duplicate slugs across content types

**CSV Data:**
- [ ] Validate all CSV files have consistent schemas
- [ ] Check for data quality:
  - Missing coordinates (lat/lon)
  - Missing required fields
  - Placeholder text ("Lorem ipsum", "TODO")
  - Broken external URLs

**Image Attributions:**
- [ ] Check `public/images/attributions.json` is valid
- [ ] Verify all images have attribution entries
- [ ] Check for missing image files referenced in attributions

---

### 6. Design System Audit

**Tailwind Classes:**
- [ ] Inconsistent spacing patterns
- [ ] Hardcoded colors (should use theme colors)
- [ ] Unused custom classes in `tailwind.config`
- [ ] Missing responsive breakpoints

**Color Usage:**
- [ ] Primary: `#1e3a4c` used consistently
- [ ] Accent: `#f97316` used consistently
- [ ] Check for stray hex codes not in theme

---

### 7. Performance Issues

**Images:**
- [ ] Missing `next/image` optimization
- [ ] Oversized images
- [ ] Missing width/height attributes
- [ ] Images without lazy loading

**Bundles:**
- [ ] Large dependencies imported unnecessarily
- [ ] Client components that should be server components
- [ ] Missing code splitting

---

### 8. SEO Audit

**Metadata:**
- [ ] Missing page titles
- [ ] Missing descriptions
- [ ] Duplicate meta descriptions
- [ ] Missing Open Graph tags
- [ ] Missing Twitter cards

**Structured Data:**
- [ ] Check for schema.org markup opportunities
- [ ] LocalBusiness schema for operators
- [ ] Event schema for events
- [ ] Place schema for spots

**URL Structure:**
- [ ] Inconsistent slug formatting
- [ ] Missing trailing slashes (if needed)
- [ ] Uppercase in slugs (should be lowercase)

---

### 9. Accessibility (A11y)

- [ ] Missing alt text on images
- [ ] Form inputs without labels
- [ ] Insufficient color contrast
- [ ] Missing focus states
- [ ] Keyboard navigation issues
- [ ] Missing ARIA labels where needed

---

### 10. Documentation Issues

- [ ] README.md outdated
- [ ] Missing or incorrect setup instructions
- [ ] Stale TODOs in code comments
- [ ] Design references that don't exist

---

## Output Format

For each issue found, provide:

```markdown
### [Category] Issue Title

**File:** `path/to/file.ts:123`

**Problem:**
[Clear description of what's wrong]

**Impact:**
- [ ] 🔴 Critical (breaks build/runtime)
- [ ] 🟡 Medium (quality/consistency issue)
- [ ] 🟢 Minor (cleanup/optimization)

**Fix:**
[Specific steps to fix OR code snippet]

**Related files:**
- `path/to/related/file.ts`
```

---

## Priority Levels

**🔴 Critical (P0):**
- Build failures
- Runtime errors
- Data corruption risks
- Security issues

**🟡 Medium (P1):**
- Inconsistent patterns
- Missing error handling
- Performance issues
- SEO problems

**🟢 Minor (P2):**
- Code cleanup
- Unused code
- Documentation gaps
- Stylistic inconsistencies

---

## Exclusions (Don't Report)

- Missing features documented in JULES.md (we know)
- Auth not implemented (documented as future work)
- Maps not implemented (documented as future work)
- Dev server issues with Vercel Postgres (known limitation)
- Placeholder Unsplash images (intentional for now)

---

## Testing Commands

```bash
# TypeScript check
npx tsc --noEmit

# Build test (ignore DATABASE_URL error)
npm run build

# Lint
npm run lint

# Check for unused dependencies
npx depcheck
```

---

## Context Files to Reference

- `STRATEGY.md` — Business strategy and content quality bar
- `playbook/PSEO-STRATEGY.md` — SEO patterns and page types
- `playbook/DATA-QUALITY.md` — Data quality standards
- `JULES.md` — What's already built and known issues
- `docs/PLATFORM_DESIGN.md` — Design spec

---

## Deliverable

Generate: `AUDIT-REPORT.md`

Group issues by category, prioritize by impact, provide actionable fixes.

**Target:** Find 20-50 meaningful issues across all categories.

---

**Last Updated:** 2026-05-09
