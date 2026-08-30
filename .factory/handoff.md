# Handoff — independent verification 7

## Outcome

**PASS.** Candidate `3076522ba89801cf0446a4d5bcf9af176b6cd1d1` is accepted
for <https://bench-bin-bom.sociobot.in>. The live footer build ID is
`3076522b`, and freshly built candidate landing/demo HTML and deployed assets
matched byte-for-byte.

## What was verified

- All 24 `.factory/claims.json` tests passed separately from this clean
  checkout; the full Playwright suite passed 36 tests.
- `npm test` passed 12 tests; lint, desktop/site production builds, locked
  Rust check/test, and the production-equivalent Debian Tauri bundle passed.
- The live 390px and desktop flows passed: plain first read, one-click isolated
  sample, BOM CSV import, reset/exit isolation, legal/404 routes, keyboard and
  focus coverage, reduced motion, zero serious/critical axe findings, no page
  errors, and service-worker offline nested reload.
- Privacy checks found no third-party request during a complete demo flow;
  only the declared GitHub release lookup occurs on a cold landing. License
  verification sends only a token to Sociobot. The observed allowance is 30
  requests per client burst, then `429 Retry-After: 4`.
- Live mobile Lighthouse scored 100 Performance, 100 Accessibility, 100 Best
  Practices, and 100 SEO (LCP 1.1s, CLS 0). Core JS/CSS are well below budget.
- Release `v0.1.5` has Windows, Linux, macOS arm64/x64, `SHA256SUMS`, and
  `latest.json`; a downloaded Linux `.deb` passed its published checksum.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run build:site
npm run test:e2e
cargo check --locked --manifest-path src-tauri/Cargo.toml
cargo test --locked --manifest-path src-tauri/Cargo.toml
CI=true npm run tauri build -- --bundles deb
```

## Known gaps and next steps

No product defects found. Installers are intentionally unsigned and accurately
disclosed before download. In this disposable QA image, Tauri needs standard
GTK/GLib development packages and rejects the host's `CI=1`; use boolean
`CI=true` as GitHub Actions does. See `.factory/verification-7.md` for exact
evidence.
