# npm Supply-Chain Safety Policy

This project treats package installation as a high-risk operation.

## Defaults

- Use `npm ci`, not `npm install`, for project setup and CI.
- Run installs with scripts disabled: `npm ci --ignore-scripts --audit`.
- Keep `ignore-scripts=true` in `.npmrc` so preinstall/postinstall scripts are opt-in, not automatic.
- Keep `save-exact=true` in `.npmrc` and pin direct dependency versions exactly in `package.json`.
- Commit `package-lock.json` and do not regenerate it casually.

## Adding or updating a dependency

Do not add, install, upgrade, or regenerate dependencies without explicit approval.

If a dependency change is approved:

```bash
npm install --ignore-scripts --audit <package>@<exact-version>
npm run audit:prod
npm run typecheck
npm run lint
OPENAI_API_KEY=dummy npm run build
```

Before accepting the package, check:

- exact version requested, not a floating range
- maintainer and release history
- release age / recent unusual publishing activity
- GitHub repo activity and issue history
- known advisories from npm audit, GitHub Dependabot, Snyk, or equivalent

## CI policy

CI uses:

```bash
npm ci --ignore-scripts --audit
npm run audit:prod
```

This enforces the lockfile and blocks lifecycle scripts during dependency install.

## Release-age cooldown

The desired policy is a 60-day minimum release age for newly published packages.
The local npm version currently reports `min-release-age` as unsupported/undefined, so this is documented but not enabled in `.npmrc` yet.

Once the runner npm version supports it, add:

```ini
min-release-age=60
```
