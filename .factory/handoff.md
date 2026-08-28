# Bench Bin BOM handoff

## Shipped

- Local-first Tauri 2 desktop app with bin locations, quantities, values,
  optional locally stored photos, editable notes, and CSV import/export.
- Project BOM cards with paste/import, ready/short status, substitute notes,
  print-friendly pull list, and a clear electrical-substitution safety note.
- Responsive 390px layout, keyboard-visible focus states, dialog labels/focus,
  empty/offline feedback, undo for deleted stock, and `/privacy` / `/terms`
  views in both app and landing site.
- A one-time Bench Pass integration using Sociobot checkout, local token
  capture/restore, optimistic offline state, and at-most-daily verification.
  Free is useful (40 parts, two builds); export and safety remain free.
- Static installer landing site in `dist/site`, OS-specific GitHub Release
  download selection, and checksum-verifying `install.sh` / `install.ps1`.
- Tauri GitHub Actions release workflow for macOS arm64/x86_64, Windows, and
  Linux packages, SHA256SUMS, and `latest.json` release manifest.

## Verification

Run from the repository root:

```sh
npm install
npm test                    # 2 unit tests passed
npm run build               # app bundle → dist/
npm run build:site          # landing site → dist/site/
cargo check --manifest-path src-tauri/Cargo.toml
```

All commands above passed on 2026-08-28. The production app bundle is 18.57 KB
of JavaScript (6.54 KB gzip), 7.65 KB CSS (2.54 KB gzip); its generated hero is
47 KB WebP. Playwright mobile smoke test passed: add a part, create a build,
add BOM demand, and observe the expected shortage. Axe found 0 serious or
critical issues on app and landing page. App console errors: 0.

## Known gaps

- No GitHub Release has been published from this disposable builder container,
  so the live landing page cannot yet resolve a real versioned installer. The
  workflow is ready: tag and push `v0.1.0` from the product repository, then
  its release assets and manifest become live.
- The landing page’s GitHub release request returns a benign 404 locally until
  that first release exists; it degrades to “downloads will appear” copy.
- Desktop installers are intentionally unsigned. The app does not implement
  an auto-updater, so no updater manifest is shipped.

## Needs operator action

- Push the commit and `v0.1.0` tag so GitHub Actions can create the first
  release. Confirm assets, `SHA256SUMS`, and `latest.json`, then deploy
  `dist/site`.
- Optional code-signing secrets for a signed release: `APPLE_CERTIFICATE`,
  `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`,
  `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD`. The current workflow does
  not require them and explicitly ships unsigned.
