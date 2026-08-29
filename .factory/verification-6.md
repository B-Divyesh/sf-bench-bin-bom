# Independent verification 6 — Bench Bin BOM

**Decision: PASS**

Verified 2026-08-29 from clean checkout commit
`735ffeaa6ec51743541543bb4adadd9530d86afe` against
<https://bench-bin-bom.sociobot.in>. The live footer reports build
`735ffeaa`; fresh local production assets matched the four deployed JS/CSS
assets byte-for-byte.

## Cold first read

The first screen says: “Check your parts before building,” names “makers and
homelab builders,” and tells the visitor to click **Try it with sample data**.
The adjacent sentence says it opens an isolated sample bench and pull list.
It also shows the local-storage, offline, and price facts without scrolling at
390×844. This passes the plain-words and one-click demo gates.

## Mandatory claims

`.factory/claims.json` exists. I installed with `npm ci` and ran every tagged
claim test from the demo entry point; the aggregate run selected 23 tests and
passed in 1.2 minutes. All claim IDs passed:

| Claim IDs | Result |
| --- | --- |
| `sample-demo`, `sample-content`, `record-bin-locations`, `bom-entry-notes`, `bom-file-import`, `stock-shortage-check`, `bom-allocation` | PASS |
| `csv-import-export`, `photo-limit`, `free-limits`, `paid-limits`, `license-daily`, `local-private`, `offline-reload` | PASS |
| `license-private`, `free-core-features`, `desktop-offline`, `price-copy`, `installer-checksum`, `release-cache` | PASS |
| `unsigned-installers`, `release-artifacts`, `planning-only` | PASS |

No unregistered product promise was found in the landing page or README.

## Local quality and desktop package

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 65 packages, 0 vulnerabilities |
| `npm test` | PASS — 12 tests |
| `npm run lint` | PASS |
| `npm run build` | PASS — desktop JS 29.08 KB raw / 9.58 KB gzip; CSS 10.56 KB raw / 3.09 KB gzip |
| `npm run build:site` | PASS — landing JS 1.85 KB raw / 0.98 KB gzip; demo JS 28.41 KB raw / 9.32 KB gzip; CSS 5.24 KB raw / 1.77 KB gzip |
| `npm run test:e2e` | PASS — 35 Chromium tests |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | PASS |
| `CI=true npm run tauri build -- --bundles deb` | PASS — `Bench Bin BOM_0.1.3_amd64.deb`; package metadata is `bench-bin-bom`, version `0.1.3`, amd64 |

The initial static-product JS and CSS budgets pass. Lighthouse mobile on the
live home measured Performance 95, Accessibility 100, Best Practices 100,
SEO 100, FCP 1.0 s, LCP 1.1 s, and CLS 0.

The unmodified local `npm run tauri build -- --bundles deb` initially failed
only because this factory container supplies `CI=1`, while Tauri 2.11 accepts
only boolean `CI=true|false`. The production-equivalent GitHub Actions value
`CI=true` completed the exact package build. This is not a candidate release
failure; the release workflow uses GitHub Actions and its published v0.1.3
assets are present.

## Independent product exercise

In a fresh live demo I confirmed three seeded stock records and the persistent
demo banner. I added `QA panel jack` (`PJ-301M`, quantity 2, bin `D7`), added
a matching BOM demand of 3, and observed **Pull: 2 from D7**, **2 allocated**,
and **1 short**. A negative-quantity CSV was rejected with a visible recovery
message. CSV export downloaded `bench-bin-parts.csv`. The sample's duplicate
M3 demand, file BOM import, substitute notes, photo-size limit, free limits,
license boundary, and demo reset/exit isolation all pass in the independent
claim and full-suite coverage.

The pull-list print media view hides navigation/actions, retains all four BOM
rows and their pull locations, and retains per-line substitute warnings.

## Browser, privacy, and deployment checks

- `/opt/fleet/lib/verify-url.sh` passed for home, demo, privacy, and terms:
  HTTP 200, route titles, `lang=en`, one H1, main landmark, image alt text,
  labelled controls, and no console errors.
- Direct Playwright axe scans found zero serious or critical findings on home,
  demo, privacy, terms, and the designed HTTP 404 page.
- Keyboard starts on the visible “Skip to content” link with a 3 px solid
  focus outline. Reduced-motion mode has no transitions or animations.
  At 390 px there is no horizontal overflow and the sample action is a 50 px
  tall control.
- The service worker controls the demo, `registration.update()` completes,
  and `/demo/builds` reloads offline with “Workshop weather node” and all four
  BOM rows.
- A cold landing makes same-origin requests plus only the declared
  `api.github.com` release lookup. A complete demo workflow makes no
  third-party request. A browser license check uses only
  `GET /api/v1/products/bench-bin-bom/verify?license=<token>` to
  `api.sociobot.in`; no inventory or project data is sent.
- Live responses enforce HSTS, CSP including `frame-ancestors 'none'`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and
  `Permissions-Policy`. HTML revalidates at 30 seconds; hashed assets are
  one-year immutable; `sw.js` is `no-cache`; unknown routes return real HTTP
  404.
- A fresh single-client invalid-license burst returned 30 HTTP 200 invalid
  verdicts. Request 31 was the first HTTP 429 with `Retry-After: 3` (requests
  31–35 remained throttled). Observed allowance: **30 requests per burst**.

## Release assets

GitHub release `v0.1.3` exposes Windows MSI/EXE, Linux AppImage/DEB/RPM, and
both macOS arm64 and x64 DMG/app archives, plus `SHA256SUMS` and valid
`latest.json`. I downloaded `Bench.Bin.BOM_0.1.3_amd64.deb`; its published and
observed SHA-256 are both
`394cf234947076d454c384211123c810e1ccfdda9bbb19d6663e35f384a1853b`.
The landing correctly discloses that installers are unsigned before download.

## Defects by severity

None found. The product has no sign-in and no product-owned backend, so Entra
tenant, backend persistence, and concurrency checks are not applicable.
