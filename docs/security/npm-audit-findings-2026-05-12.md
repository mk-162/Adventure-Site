# npm audit findings — 2026-05-12

The approved production dependency security batch has been applied with scripts disabled and exact versions.

## Applied fixes

Installed with:

```bash
npm install --ignore-scripts --audit drizzle-orm@0.45.2 next@16.2.6 resend@6.12.3
npm pkg set overrides.undici=6.24.0 overrides.postcss=8.5.10
npm install --ignore-scripts --audit
```

## Resolved production findings

- `drizzle-orm <0.45.2`
  - Fixed by pinning `drizzle-orm@0.45.2`.

- `next 16.1.6`
  - Fixed by pinning `next@16.2.6`.

- `resend 6.9.1` / `mailparser` / `nodemailer`
  - Fixed by pinning `resend@6.12.3`.

- `undici <=6.23.0`
  - Fixed by npm override to `undici@6.24.0` for `@vercel/blob`.

- `postcss <8.5.10`
  - Fixed by npm override to `postcss@8.5.10` for Next/Tailwind/shadcn transitive usage.

## Current production status

```bash
npm run audit:prod
# found 0 vulnerabilities
```

## Remaining dev-only advisories

`npm run audit:all` still reports dev/tooling advisories in packages such as `ajv`, `brace-expansion`, `esbuild`, `express-rate-limit`, `fast-uri`, `flatted`, `hono`, `ip-address`, `minimatch`, `path-to-regexp`, and `picomatch`.

These are outside the production audit gate and mostly sit in development tooling chains. Do not use `npm audit fix --force`; it proposes breaking downgrades such as `drizzle-kit@0.18.1`.

## Verification

- `npm config get ignore-scripts` → `true`
- `npm config get save-exact` → `true`
- Direct dependency specs are exact.
- `npm run audit:prod` → pass, 0 vulnerabilities.
- `npm run typecheck` → pass.
- `npm run lint` → pass with existing 623-warning ratchet.
- `OPENAI_API_KEY=dummy npm run build` → pass.
