# Bench Bin BOM repair handoff

## Result

All release-blocking findings from verifier report commit `e33771b` for
candidate `066854b` are repaired in version 0.1.1. The desktop artifact
remains Tauri 2, and the deployment remains a static site.

## Repairs

- BOM stock is allocated once, in row order. Ten M3 screws across two six-item
  rows now produce allocations of six and four, with a shortage of two.
- Every dialog Close and Cancel control is a non-submit button. Limit errors no
  longer trap cancellation.
- CSV uses a quoted-field parser. It preserves embedded commas and escaped
  quotes, and rejects negative, fractional, missing, or out-of-range counts.
- Photos are limited to 2 MB before reading. Storage quota failures keep the
  form open and provide a recovery action without mutating in-memory state.
- `.factory/claims.json` lists 12 claims. Each has exactly one tagged browser
  test against the isolated sample entry point.
- `/demo/` loads a shipped sample in `demo:bench-bin-bom:v1`, never reads
  `bench-bin-bom:v1`, and includes Reset demo and Start for real controls.
- Privacy, Terms, and 404 are real static documents. The complete site build
  includes all imagery, icons, installers, metadata, service worker, legal
  routes, robots, sitemap, and Static Web Apps policy.
- The PowerShell installer verifies the MSI checksum and invokes
  `msiexec.exe`; it no longer treats the MSI as a ZIP.
- Mobile keeps Bench stock, Builds, and About visible with 44 px targets.
- Bench Pass states the verified US$12 one-time price. The removed
  print-presets claim had no implementation. Fresh or unverified tokens never
  unlock limits when verification fails; only a cached valid verdict is
  optimistic offline evidence.
- App navigation now uses History API URLs, per-route titles, H1 focus, and a
  polite route announcement.
- Static response policy adds enforced CSP, frame denial, permissions policy,
  immutable asset caching, and no-cache service-worker updates. Release lookup
  uses a one-hour local cache with a release-page fallback.
- The single warm-paper color treatment is now an explicit design exception.
  The landing page includes complete metadata and an original three-frame
  product walkthrough.

## Local verification

Run from a clean checkout:

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

Evidence recorded on 2026-08-29 UTC:

- `npm ci`: 64 packages, 0 vulnerabilities.
- Unit tests: 10 passed across two files.
- Browser/integration tests: 19 passed in Chromium 1.58.2. This includes all 12
  claim tags, desktop and 390 px mobile, keyboard focus, 200% text, reduced
  motion, axe, dialog focus/cancel, offline reload, privacy request capture,
  route titles/focus, installer checks, and console-error checks.
- Type/lint: `tsc --noEmit` passed.
- Desktop app build: 24.45 KB JS (8.43 KB gzip) and 8.94 KB CSS
  (2.83 KB gzip).
- Static landing build: 1.54 KB landing JS plus 0.71 KB module helper; 4.67 KB
  landing CSS. Demo JS is 23.79 KB and demo CSS is 8.94 KB. Hero WebP is
  47,798 bytes.
- `cargo check --locked`: passed.
- Tauri Debian build: `Bench Bin BOM_0.1.1_amd64.deb`, 4,338,326 bytes;
  package metadata declares WebKitGTK and GTK dependencies.
- Native executable stayed running through an eight-second Xvfb smoke test;
  only expected headless DRI warnings were emitted.
- Local `verify-url.sh`: title, language, one H1, main, image alternatives,
  and console checks passed; load measured 666 ms.
- Lighthouse 12.8.2 mobile: performance 99, accessibility 100, best practices
  100, SEO 100; FCP 0.91 s, LCP 2.26 s, TBT 0 ms, CLS 0.
- JSON, workflow/winget YAML, shell syntax, referenced site assets, and
  `git diff --check` passed.

## Release and deployment

Released and deployed on 2026-08-29 UTC:

- Static deployment: <https://bench-bin-bom.sociobot.in>, managed TLS ready,
  HTTP 200, runtime build identity `50d838d2`.
- Product-quality workflow `33258445513`: passed.
- Release workflow `33258450183`: passed its clean verify gate, Windows,
  Linux, macOS arm64, macOS x64, and manifest jobs.
- GitHub release: <https://github.com/B-Divyesh/sf-bench-bin-bom/releases/tag/v0.1.1>.
  It includes MSI and EXE, AppImage, DEB, RPM, arm64 and x64 DMGs, app
  archives, `SHA256SUMS`, and `latest.json`.
- Downloaded release assets passed `sha256sum -c SHA256SUMS`: Windows MSI
  `d225ef4ef56e9aafeac26f1c1bc6ba07121ec2e0c1d254089509a6c6ebef425f`,
  Linux AppImage
  `9ca61e94307df1a3a89bfa0c7dd45ddec00079e6f169ae8489eca7355933906c`,
  Linux DEB
  `4d1322a9c9d10660f4d383ba69f9a38b75cef460bc7c4be04756617b33e200e7`,
  arm64 DMG
  `8545cd75b471e113050f6e7e76d9d2d90b1fdcfba15d6a5e1a5794f8b0de6662`,
  and x64 DMG
  `b00f8dff81d43478fb93dd28352aa7b8a492f8abc0ad61e346d8facd48956862`.
  `latest.json` reports version 0.1.1 and the same selected Windows, Linux,
  and macOS digests.
- A fresh live Linux visit resolved its detected-platform button to the real
  v0.1.1 AppImage and rendered `Version 0.1.1. The installer is unsigned.`
  without console errors.
- Live `/`, `/demo/`, `/demo/builds`, `/privacy/`, and `/terms/` return 200.
  An unknown path returns the designed 404 document with HTTP 404.
- Live response checks confirm the enforced CSP and frame denial,
  `Permissions-Policy`, `Referrer-Policy`, `nosniff`, HSTS, and one-year
  immutable asset caching. The service worker is served with `no-cache`.
- Live `verify-url.sh` passed on `/` and `/demo/` with no browser errors.
  A desktop and 390 px browser run found zero serious or critical axe issues,
  visible keyboard skip focus, no overflow at 200% text, all mobile navigation
  targets at least 44 px, no third-party demo requests, and a successful
  offline demo reload.
- Live Lighthouse 12.8.2 mobile: performance 100, accessibility 100, best
  practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Live landing, demo, legal, 404, installer, robots, sitemap, and product-image
  bytes match the clean `dist/site` build exactly.

## Known gaps

- macOS and Windows packages are intentionally unsigned. The app has no native
  auto-updater, so it does not ship an updater manifest.

## Needs operator action

- To sign a future release, configure `APPLE_CERTIFICATE`,
  `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`,
  `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD`, then add signing steps to
  the workflow. Version 0.1.1 does not require these secrets.
