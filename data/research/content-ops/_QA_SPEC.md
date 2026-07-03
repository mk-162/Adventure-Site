# Launch-slice QA spec (read as a real visitor)

You are QA-ing ONE page of the Adventure Wales Snowdonia launch slice before it
goes live. Read the page's source content and judge it the way a visitor and a
search engine would. Report only real, actionable issues — not nitpicks.

## Context you need
- Combo/things-to-do pages render from `data/combo-pages/snowdonia--<activity>.json`
  via `src/app/[region]/[subpage]/page.tsx` + `src/lib/combo-data.ts`.
- Operator pages render from the DB via `src/app/directory/[slug]/page.tsx`.
- **Published operators (links to these are OK):** antur-stiniog, bala-adventure-watersports,
  mountainxperience, plas-y-brenin, snowdonia-watersports, zip-world.
- Any `operatorSlug` pointing to an operator NOT in that list links to a gated
  (draft) operator → the link will 404. `operatorSlug: null` is fine (no link).

## What to check (severity: BLOCKER / MAJOR / MINOR)
1. **Broken references** — `operatorSlug` values pointing to non-published operators
   (BLOCKER); internal links/slugs that won't resolve.
2. **Placeholder / unfinished** — TODO, lorem, "coming soon", empty required fields,
   `null`/`0`/`""` where real content is expected, obviously stubbed spots (BLOCKER/MAJOR).
3. **Images** — heroAlt present but no hero image source; referenced image paths that
   don't exist under `public/` (check with a quick file existence test) (MAJOR).
4. **Factual red flags** — internal contradictions, wrong region, impossible prices,
   claims that look invented (MAJOR).
5. **SEO basics** — metaTitle/metaDescription present, sensible length, not duplicated
   from another page (MINOR/MAJOR).
6. **Readability** — broken markdown, truncated sentences, duplicated paragraphs (MINOR).

## Output (return as your final text, nothing else)
Return a compact list:
```
PAGE: <name>
VERDICT: launch-ready | needs-fixes | blocked
- [SEVERITY] <issue> — <file:location or field> — <suggested fix>
```
If clean, say `VERDICT: launch-ready` with no issues. Be concrete; cite fields.
