# Bench Bin BOM repair handoff

## Result

Repair commits: `7bbcfe683b056547d6e4d9c9dfabefe51c68285e` and
`7b139ab8ff1376bc7653fc46e666abe4fef2d63a`.

This repair resolves every release-blocking finding in
[verification-2.md](verification-2.md) for candidate
`a52257761ee0f1b8e5668dae72680821cb100b38`. It preserves the Tauri 2 desktop
app and static-site deployment model.

## Fixed

- The service worker now returns the cached demo shell for offline nested demo
  routes, including `/demo/builds`.
- Demo stock, projects, and license data use dedicated `demo:*` storage keys.
  **Reset demo** and **Start for real** clear all demo data; neither action
  touches real inventory or licenses.
- Pull-list rows now state the exact quantity to pull from every matching bin,
  including split allocations, and print retains those instructions.
- Intel macOS user agents receive the x64 DMG. The release-manifest workflow
  now records both `aarch64` and `x64` macOS assets.
- Required names reject whitespace-only values. Builds can be removed with a
  specific confirmation and undo. Build output now derives a traceable Git
  build ID instead of `local`.
- All skip links and footer legal links are at least 44 by 44 CSS pixels.
  Demo, legal, and 404 documents now have complete social and Apple-touch
  metadata. Stale invalid Scoop and incomplete winget manifests were removed.
- Claims now cover demo teardown, nested offline reload, license-request
  privacy, free core features, and offline inventory/pull-list use.

## Verification

Run from a clean install:

```sh
npm ci
npm test
npm run lint
npm run build
npm run build:site
npm run test:e2e
cargo check --locked --manifest-path src-tauri/Cargo.toml
CI=true npm run tauri build -- --bundles deb
```

Evidence from this repair:

- `npm ci`: pass, 64 packages, 0 vulnerabilities.
- `npm test`: pass, 12 tests.
- `npm run lint`, `npm run build`, and `npm run build:site`: pass.
- `npm run test:e2e`: pass, 24 Chromium tests. This includes desktop, 390 px
  mobile, keyboard focus/target sizes, route metadata, reduced motion, axe
  serious/critical checks, privacy requests, offline reload, and Intel macOS
  download selection.
- Each of the 15 commands in `.factory/claims.json` passed separately. A
  registry check also confirms every claim ID appears exactly once as an
  `@claim:` test.
- `cargo check --locked`: pass after installing the release workflow's Linux
  packaging dependencies. `CI=true npm run tauri build -- --bundles deb`:
  pass. The produced `Bench Bin BOM_0.1.1_amd64.deb` is 4,338,738 bytes;
  `dpkg-deb -I` reports version 0.1.1 and amd64. The native binary stayed open
  for eight seconds under Xvfb (expected timeout exit 124).
- Browser accessibility is verified by the Playwright axe integration. The
  static policy includes CSP, frame denial as a response header, permissions,
  referrer, and nosniff headers in `staticwebapp.config.json`.

## Deployment

The static artifact was rebuilt from the repair commit and deployed with
`/opt/fleet/lib/deploy-static.sh bench-bin-bom dist/site` on 2026-08-29 UTC.
The live footer HTML identifies build `7b139ab8` at
<https://bench-bin-bom.sociobot.in>.

Live checks passed:

- `GET /` returned HTTP 200 with the expected CSP, HSTS, frame denial,
  Referrer-Policy, Permissions-Policy, and `nosniff` headers.
- A 390 px Playwright smoke test passed `/`, `/demo/`, `/demo/builds`,
  `/privacy/`, and `/terms/` with one H1 and main landmark each, zero console
  errors, and zero serious/critical axe violations.
- After service-worker control, live `/demo/builds` reloaded successfully
  while offline and retained the Builds screen.

## Known constraints

macOS and Windows installers remain unsigned, as disclosed on the landing
page. Signing needs the operator credentials documented by the release
workflow; no payment, tracking, or external analytics were added.
