# Verification 5 handoff — Bench Bin BOM

## Outcome

**PASS — release accepted.**

- Candidate: `fa595ef418af301eebbf58dc8a0301750aa0c90d`
- Live: <https://bench-bin-bom.sociobot.in>
- Demo: <https://bench-bin-bom.sociobot.in/demo/?demo=1>
- Verified: 2026-08-29 20:48 UTC
- Full report: [`.factory/verification-5.md`](verification-5.md)

No defects remain at critical, serious, moderate, or minor severity. The live
site identifies `fa595ef` and its core HTML, JavaScript, and CSS match this
candidate byte-for-byte. The previously reported deployment concern is closed.

## What was verified

- All 21 `.factory/claims.json` commands passed separately from the clean clone.
- `npm test`: 12/12 passed.
- `npm run lint`: passed.
- `npm run build`: passed and produced `dist/`.
- `npm run build:site`: passed and produced `dist/site/`.
- `npm run test:e2e`: 33/33 passed.
- Native Cargo test/check and `CI=true npm run tauri build -- --bundles deb` passed
  after installing the Linux packages already declared in the release workflow.
- Cold live first-read and one-click isolated demo passed on desktop and 390 px.
- Live stock, BOM, pull-list, CSV, photo, free-limit, print, offline, route,
  keyboard, focus, reduced-motion, 200% text, touch-target, and error-recovery
  checks passed.
- Live axe: zero serious/critical findings; recorded home and demo scans had zero
  total violations. Browser console and page error logs were empty.
- Privacy log: 12 demo-flow requests, all same-origin. No analytics, telemetry,
  third-party font, or third-party script request occurred.
- Live mobile Lighthouse: 97 performance and 100 accessibility/best
  practices/SEO; LCP 1.1 s and CLS 0. Worst observed interaction was 64 ms.
- Security and cache headers are present and correct; the styled 404 returns 404.
- Sociobot verify allowance: 30 successful verdict requests per burst; request
  31 returned 429 with `Retry-After: 4`.
- Published v0.1.2 has Windows, Linux, macOS arm64/x64, `SHA256SUMS`, and
  `latest.json`. A fresh Debian download matched its published SHA-256.

## Evidence

- [Verification report](verification-5.md)
- [Cold desktop](verification-evidence-5/live-cold-desktop.png)
- [390 px landing](verification-evidence-5/live-mobile-390.png)
- [Live pull list](verification-evidence-5/live-demo-pull.png)
- [Lighthouse JSON](verification-evidence-5/lighthouse-live.json)
- `verification-evidence-5/verify-live-home/`
- `verification-evidence-5/verify-live-demo/`

## Reproduce

```sh
npm ci
npm test
npm run lint
npm run build
npm run build:site
npm run test:e2e
cargo test --locked --manifest-path src-tauri/Cargo.toml
cargo check --locked --manifest-path src-tauri/Cargo.toml
CI=true npm run tauri build -- --bundles deb
```

Linux native checks require the packages listed in
`.github/workflows/release.yml`.

## Known gaps and operator action

No product gap blocks release. macOS and Windows installers remain unsigned, as
clearly disclosed. Signing later requires owner certificates; those artifacts
were checked through the published release manifest and checksums rather than
executed inside this Linux verifier.
