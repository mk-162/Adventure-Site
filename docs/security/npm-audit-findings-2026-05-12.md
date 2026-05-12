# npm audit findings — 2026-05-12

`npm run audit:prod` currently fails. No fixes were applied because dependency upgrades/package installs require explicit approval.

## High-risk production findings

- `drizzle-orm <0.45.2`
  - Advisory: SQL injection via improperly escaped SQL identifiers.
  - Suggested fixed version from npm audit: `0.45.2`.
  - Current pinned version: `0.45.1`.

- `next 16.1.6`
  - Multiple advisories, including request smuggling, image/cache DoS, SSRF/websocket upgrade issues, middleware/proxy bypasses, cache poisoning, and XSS scenarios.
  - Suggested fixed version from npm audit: `16.2.6`.
  - Current pinned version: `16.1.6`.

- `undici <=6.23.0`
  - Multiple advisories, including WebSocket parser crash, request/response smuggling, memory consumption, and CRLF injection.
  - Suggested fix from npm audit: `npm audit fix`.

## Moderate findings

- `resend 6.9.1` via `mailparser` and `nodemailer`.
  - Suggested fixed version from npm audit: `resend@6.12.3`.

- `postcss <8.5.10`, currently nested under Next.
  - Expected to resolve via the Next upgrade path.

## Recommended approval batch

When dependency updates are approved, upgrade only the specific packages needed and use exact versions with scripts disabled:

```bash
npm install --ignore-scripts --audit drizzle-orm@0.45.2 next@16.2.6 resend@6.12.3
npm audit --omit=dev --audit-level=high
npm run typecheck
npm run lint
OPENAI_API_KEY=dummy npm run build
```

Do not run `npm audit fix --force` blindly.
