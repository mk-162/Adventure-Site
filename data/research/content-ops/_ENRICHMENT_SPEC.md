# Operator Enrichment Spec (Snowdonia launch slice)

You are enriching ONE real Welsh adventure-tourism operator for the Adventure Wales
directory. This data will be published on public pages about a real, named business,
so **accuracy is non-negotiable** — a wrong phone number, price, or website is a
liability. When unsure, mark it unknown rather than guessing.

## Your job
1. Start from the seed data you were given (may contain errors — verify everything).
2. Use web search/fetch to confirm identity and fields against the operator's OWN
   website first, then corroborate with Visit Wales / Go North Wales / TripAdvisor /
   Companies House where possible.
3. Write a proposal JSON to the exact path you were given.
4. Return a 4-line summary: identityConfidence, fields verified, fields still missing,
   and any red flags (placeholder data, region mismatch, closed business, name change).

## Output JSON shape (follow this exactly)
{
  "_meta": {
    "slug": "<slug>",
    "route": "/directory/<slug>",
    "contentType": "operator",
    "researchedAt": "2026-07-03",
    "recommendedNextStatus": "published" | "review" | "research_needed",
    "identityConfidence": "HIGH" | "MEDIUM" | "LOW",
    "identityConfidenceReason": "<how identity was confirmed + which sources>",
    "redFlags": ["<placeholder phone>", "<operates outside Snowdonia>", ...]
  },
  "proposedOperatorData": {
    "name": "...", "slug": "...", "website": "...",
    "tagline": "<short, specific>",
    "description": "<2-3 tight paragraphs, factual, no marketing fluff>",
    "uniqueSellingPoint": "...",
    "contact": { "phone": "...", "email": "...", "address": "..." },
    "lat": <num|null>, "lng": <num|null>,
    "priceRange": "...", "googleRating": <num|null>, "reviewCount": <num|null>,
    "activityTypes": ["..."], "regions": ["snowdonia", ...],
    "tripadvisorUrl": "...|null"
  },
  "fieldSources": {
    "<field>": "<source URL + one-line note on how confirmed>"
  }
}

## Rules
- Every non-obvious field in fieldSources must cite a URL.
- recommendedNextStatus = "published" ONLY if identityConfidence is HIGH and
  name+website+phone+at-least-one-activity are all confirmed. Otherwise "review".
- If the operator does not actually serve Snowdonia, say so in redFlags and set
  regions to where it really operates.
- Do NOT invent Google ratings — only report a rating you can source.
