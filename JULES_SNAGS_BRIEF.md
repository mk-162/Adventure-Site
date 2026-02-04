# Jules Task: Fix Site Snags — UI, 404s, and Missing Features

## CRITICAL RULES
- **DO NOT delete any existing files** unless explicitly told to
- **DO NOT modify** files outside the scope of this task
- **DO NOT remove** safety guards, null checks, or fallback values
- **DO NOT touch** data files, images, scripts, briefs, plans, or docs
- After building, run `npm run build` — it must pass clean

## Overview
Fix specific bugs and build small missing features from the site audit. Work through each section in order.

**Repo:** mk-162/Adventure-Site
**Stack:** Next.js 16, TypeScript, Tailwind, Drizzle ORM, Neon Postgres (via `@neondatabase/serverless`)
**Brand colours:** Primary `#1e3a4c`, Accent `#f97316`

---

## Task 1: Rename `/for-operators` → `/advertise`

The page at `src/app/for-operators/page.tsx` needs to move to `src/app/advertise/page.tsx`.

1. Move the file/folder from `src/app/for-operators/` to `src/app/advertise/`
2. Update **all internal links** across the codebase that point to `/for-operators` to now point to `/advertise`
   - Check: `src/components/layout/footer.tsx` (has `"/for-operators"`)
   - Check: `src/app/partners/page.tsx` (redirects to `/for-operators`)
   - Search the entire `src/` directory for any other references
3. Add a redirect from `/for-operators` to `/advertise` in `next.config.ts`:
   ```typescript
   // Add to the redirects array in next.config.ts
   { source: '/for-operators', destination: '/advertise', permanent: true },
   ```
4. Update metadata/title on the page if it says "For Operators" → "Advertise With Us" or "Grow Your Business"

---

## Task 2: Fix Empty State Guards on Region Pages

In `src/app/[region]/page.tsx`, several sections render even when they have no data. Wrap these sections in conditional checks so they only show when there's content:

- **Top Experiences** grid — only show if `activities.length > 0`
- **Where to Stay** section — only show if accommodation data exists
- **Things to Do** links — only show if activity types exist for this region

The pattern should be:
```tsx
{activities.length > 0 && (
  <section>
    {/* section content */}
  </section>
)}
```

Check the existing code — some guards may already be in place. Add any that are missing.

---

## Task 3: Fix Share Button on Directory Pages

The share button on `/directory/[slug]` pages doesn't work.

1. Check if `src/components/ui/ShareButton.tsx` exists — if so, fix it. If not, create it.
2. It should use the Web Share API with a clipboard fallback:
   ```typescript
   async function handleShare() {
     if (navigator.share) {
       await navigator.share({ title, url: window.location.href });
     } else {
       await navigator.clipboard.writeText(window.location.href);
       // Show "Link copied!" toast
     }
   }
   ```
3. Make sure the share button on `/directory/[slug]` pages uses this component and works.

---

## Task 4: Fix Heart/Favourite Button

The heart/save button on directory and activity pages doesn't work.

1. Make clicking the heart button show a login modal/prompt if the user is not authenticated
2. For now, just show a clean modal: "Sign in to save your favourites" with a link to `/auth/login`
3. Don't build the full favourites system — just the prompt-to-login UX

---

## Task 5: Email Capture (Homepage Footer)

The email signup field at the bottom of the homepage is invisible/broken.

1. Find the newsletter/email capture component on the homepage
2. Fix the styling so it's clearly visible — white or light input field with clear placeholder text
3. Make sure the form actually POSTs to an API route
4. Create `src/app/api/newsletter/route.ts`:
   - Accept `{ email }` in POST body
   - Validate email format
   - Store in a `newsletter_subscribers` table (create if it doesn't exist in schema)
   - Return success response
5. Add the table to `src/db/schema.ts`:
   ```typescript
   export const newsletterSubscribers = pgTable("newsletter_subscribers", {
     id: serial("id").primaryKey(),
     email: varchar("email", { length: 255 }).notNull().unique(),
     subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
     source: varchar("source", { length: 50 }).default("homepage"),
   });
   ```
6. Show a success message after submission: "Thanks! You're on the list."

---

## Task 6: Remove Non-Functional Elements

Remove these broken/placeholder UI elements that don't do anything yet:

1. **Cookie settings link** — if there's a "Cookie Settings" button/link anywhere that doesn't work, remove it. The `/cookies` page link in the footer should stay.
2. **"Quick Plan" widget** on Plan Your Visit page — remove if it exists and date functionality isn't ready
3. **"Local Tips" link** — remove if it links to a page with no content

Only remove links/buttons that go nowhere. Don't remove entire pages or sections.

---

## Task 7: Admin Improvements

1. In the admin layout (`src/app/admin/`), add a "← Back to site" link in the top-right corner that links to `/`
2. Check if admin area has password protection. If not, add a simple middleware check:
   - Check for an `ADMIN_SECRET` environment variable
   - Use basic auth or a simple token cookie
   - If no `ADMIN_SECRET` is set, allow access (dev mode)

---

## Task 8: Operator Directory Logo Fallback

On `/directory/[slug]` pages:

1. If an operator has no `logoUrl`, hide the logo container entirely (don't show the default square-with-letter placeholder)
2. Check for the "Premium Partner" badge — if it appears twice, remove the duplicate

---

## After Building

1. Run `npm run build` — must pass with zero errors
2. List all files you created or modified
3. Do NOT delete any files that weren't mentioned in this brief
