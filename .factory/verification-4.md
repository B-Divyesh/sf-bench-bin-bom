# Independent product verification 4 — PASS

Verified 2026-08-29 UTC from a clean checkout.

- Candidate: `5d9f6cd418a2e469c27784256baa3e6f51e411ef`
- Live URL: <https://bench-bin-bom.sociobot.in>
- Work order: `bench-bin-bom-verify-4`
- Artifact class: desktop app
- Result: **PASS — release accepted.**

There are no release-blocking defects. The candidate is a documentation-only
successor of release-source commit `86e8906`; its only product-adjacent diff is
the prior handoff. The live static deployment identifies build `5d9f6cd4` and
is byte-identical to this candidate's generated landing/demo HTML and hashed
JS/CSS assets. The published v0.1.2 desktop binaries contain the corresponding
product source.

## Mandatory opening gates

### Claims gate — PASS

`.factory/claims.json` exists and contains 18 entries. After `npm ci` (64
packages installed; 0 vulnerabilities), I ran every declared command,
individually, in registry order from the product's demo entry point. All
completed successfully; Playwright's final run record is `passed` with no
failed tests.

| Claim ID | Exact declared command result |
| --- | --- |
| `sample-demo` | PASS — `npm run test:e2e -- --grep '@claim:sample-demo'` |
| `bom-allocation` | PASS — `npm run test:e2e -- --grep '@claim:bom-allocation'` |
| `csv-import-export` | PASS — `npm run test:e2e -- --grep '@claim:csv-import-export'` |
| `photo-limit` | PASS — `npm run test:e2e -- --grep '@claim:photo-limit'` |
| `free-limits` | PASS — `npm run test:e2e -- --grep '@claim:free-limits'` |
| `paid-limits` | PASS — `npm run test:e2e -- --grep '@claim:paid-limits'` |
| `license-daily` | PASS — `npm run test:e2e -- --grep '@claim:license-daily'` |
| `local-private` | PASS — `npm run test:e2e -- --grep '@claim:local-private'` |
| `offline-reload` | PASS — `npm run test:e2e -- --grep '@claim:offline-reload'` |
| `license-private` | PASS — `npm run test:e2e -- --grep '@claim:license-private'` |
| `free-core-features` | PASS — `npm run test:e2e -- --grep '@claim:free-core-features'` |
| `desktop-offline` | PASS — `npm run test:e2e -- --grep '@claim:desktop-offline'` |
| `price-copy` | PASS — `npm run test:e2e -- --grep '@claim:price-copy'` |
| `installer-checksum` | PASS — `npm run test:e2e -- --grep '@claim:installer-checksum'` |
| `release-cache` | PASS — `npm run test:e2e -- --grep '@claim:release-cache'` |
| `unsigned-installers` | PASS — `npm run test:e2e -- --grep '@claim:unsigned-installers'` |
| `release-artifacts` | PASS — `npm run test:e2e -- --grep '@claim:release-artifacts'` |
| `planning-only` | PASS — `npm run test:e2e -- --grep '@claim:planning-only'` |

The complete unfiltered browser suite also passed: **27/27**. This includes the
ordinary browser-Back demo-exit reproduction added after verification 3: the
demo namespace is discarded, a later re-entry starts from shipped sample data,
and real storage remains separate.

### Cold first-read and one-click demo — PASS

Fresh live load, before interaction, plainly says:

- **What:** “Check your parts before you start building.”
- **For whom:** makers and homelab builders catching shortages before a project stalls.
- **What to click first:** “Try it with sample data,” with “Opens a sample bench and pull list in your browser.”

The CTA is present in the initial desktop and 390 px mobile screens and opens
`/demo/` in one click. The visible demo banner says “Demo — sample data,
nothing is saved,” with Reset demo and Start for real controls.

## Repository and native-build gates — PASS

| Command | Evidence |
| --- | --- |
| `npm test` | PASS — 12 tests in 2 files |
| `npm run lint` | PASS — `tsc --noEmit` |
| `npm run build` | PASS — app `dist/`; JS 27.53 kB (9.14 kB gzip), CSS 9.17 kB (2.86 kB gzip) |
| `npm run build:site` | PASS — complete `dist/site/` |
| `npm run test:e2e` | PASS — 27 Chromium tests |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | PASS |
| `CI=true npm run tauri build -- --bundles deb` | PASS — produced `Bench Bin BOM_0.1.2_amd64.deb` |

The native check initially correctly reported missing verifier-image GTK/WebKit
development headers. I installed the exact Linux dependencies named by
`.github/workflows/release.yml` and reran it successfully. The production
package reports `bench-bin-bom` version `0.1.2`, `amd64`, and dependencies
`libwebkit2gtk-4.1-0, libgtk-3-0`; local package SHA-256:
`9d8821a33fa357e7f382da96ef63aead06e0105879f42df87cd4e0cb5d603085`.

## Independent live product exercise — PASS

In fresh live Chromium contexts I verified the smallest useful job end to end:

- Sample bench contains ESP32 stock and the weather-node build. A new part
  saved locally, an invalid negative CSV quantity showed an in-dialog recovery
  error, and the dialog remained open.
- The sample pull list shows the two shortage lines and the explicit safety
  note: “Substitutes need your review.” It allocates stock once across duplicate
  BOM demand, as covered by the claim test.
- Free limits, invalid/blank forms, oversized local-photo rejection, CSV
  quoted-comma import/export, removal/undo, and restored-license boundaries all
  pass in the complete suite.
- The service worker controls `/demo/`; after first load, `/demo/builds`
  reloaded offline and showed “Your builds” plus “Workshop weather node.”

## Browser quality, accessibility, and privacy — PASS

- Live desktop and 390x844 mobile checks showed no horizontal overflow. Mobile
  landing body text is 17 px; the primary CTA measured 271x50 CSS px.
- Keyboard focus is visible: a live pull-list button produced a solid 3 px
  `rgb(185, 93, 29)` outline. Repository keyboard/dialog/skip-link tests pass.
- Live axe-core scans of landing and demo produced **zero serious or critical
  violations**. All checked public routes had a title, exactly one H1, and a
  main landmark, with no console or page errors.
- With `prefers-reduced-motion: reduce`, no computed animation or transition
  durations remained. No third-party fonts or scripts load.
- A cold landing requested only the product origin plus documented GitHub
  Releases API metadata. The full demo workflow requested only the product
  origin; no analytics or telemetry requests were observed.
- Live response headers include HSTS, CSP with `frame-ancestors 'none'`,
  `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, Referrer-Policy,
  and Permissions-Policy. HTML uses `max-age=30`, hashed JS/CSS use one-year
  immutable caching, and `sw.js` is `no-cache`.

## Deployment and desktop-release identity — PASS

Candidate build versus live SHA-256 comparisons all matched for `index.html`,
`demo/index.html`, `assets/main-B4h9hDbw.js`, `assets/demo-B8we9S2f.js`, and
`assets/style-CAMLQJzq.css`. The footer reports `v0.1.2 · 5d9f6cd4`.

GitHub release `v0.1.2` is published (not draft/prerelease) with Windows MSI
and setup EXE, Linux AppImage/DEB/RPM, macOS `aarch64` and `x64` DMGs,
`SHA256SUMS`, and valid `latest.json`. A freshly downloaded published Debian
asset verified successfully against `SHA256SUMS`. The manifest names Windows,
Linux, macOS `aarch64`, and macOS `x64` URLs and hashes. Installers are
disclosed as unsigned before download.

## Endpoint allowance — PASS

The only product server-side call is Sociobot license verification; sign-in is
not applicable. With a fresh invalid test token, 40 sequential requests from
one client yielded **30 HTTP 200** invalid-verdict responses and **10 HTTP
429** responses. Request 31 was the first throttle and included
`Retry-After: 3`; the 200 verifier response used `Cache-Control: no-store`.
Observed allowance: **30 requests per burst**.

## Defects by severity

None observed.
