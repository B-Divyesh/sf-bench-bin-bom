# Handoff — Bench Bin BOM

## Independent verification 6

**PASS — candidate `735ffeaa6ec51743541543bb4adadd9530d86afe` is accepted.**

Verified 2026-08-29 at <https://bench-bin-bom.sociobot.in>; the live footer
reports build `735ffeaa`, and freshly built candidate JS/CSS assets matched
the deployed assets byte-for-byte. See `.factory/verification-6.md` for exact
commands and evidence.

- All 23 demo-entry claim tests passed; the full suite passed 35/35 and unit
  tests passed 12/12.
- Type checks, desktop and site production builds, Rust check, and a
  production-equivalent Linux Tauri DEB build passed.
- Independent live workflow, mobile 390 px, keyboard/focus, reduced motion,
  offline nested reload, print layout, axe, console/page errors, privacy
  requests, headers/caching, rate limiting, and release artifacts passed.
- License verification allowance observed: 30 requests per burst; request 31
  returned 429 with `Retry-After: 3`.
- No release-blocking defects or known product gaps found.

The only local-environment note: bare Tauri packaging rejects this container's
`CI=1`; `CI=true` (the GitHub Actions production value) completes successfully.

---

## Outcome

**PASS.** Every finding in `.factory/review-1.md` and `.factory/review-2.md`, including reopened F-1-10, is fixed and mapped in `.factory/polish-2.md`. The product-specific paper-cut workbench identity and Tauri desktop deployment class are unchanged.

- Live site: <https://bench-bin-bom.sociobot.in>
- Isolated demo: <https://bench-bin-bom.sociobot.in/demo/?demo=1>
- Repair commit: `c50f59d0fbe41dbcaa35d1dd0a4e5193f5d1c5f9`
- Release commit: `081bc6c90a869cca4fb7229d738ebd9e0d3baf41` (`v0.1.3`)
- Static deployment: production from `main`; the live footer and cold check identify the deployed build.
- Desktop release: <https://github.com/B-Divyesh/sf-bench-bin-bom/releases/tag/v0.1.3>

## What changed

- Put a computed weather-node pull list on the first 390×844 demo screen. It shows a part, bin pull, and shortage before scrolling.
- Added a labelled CSV file chooser to the BOM dialog and retained paste input through the same parser.
- Added `bom-file-import` and `stock-shortage-check` to `.factory/claims.json`; all 23 claim entries have one matching tagged test.
- Kept demo data in its separate namespace with a persistent banner, Reset demo, and Start for real. Direct `?demo=1`, back navigation, reset, and exit preserve real data.
- Corrected the demo title, literal 404 H1, external checkout/download labels, first-use BOM expansion, mobile app navigation, and every reviewed wording issue.
- Removed unregistered README build-output and suite-coverage claims. Updated the copy audit and the verb-first catalog description.
- Released version 0.1.3 for Linux, Windows, macOS arm64, and macOS x64 with `SHA256SUMS` and `latest.json`.

## Clean-clone verification

Verified at release commit `081bc6c9` in `/tmp/bench-bin-polish2-final.bSEmKO` after `npm ci`:

| Check | Result |
| --- | --- |
| Every command in `.factory/claims.json`, run separately | PASS — 23/23 |
| `npm test` | PASS — 12/12 |
| `npm run lint` | PASS |
| `npm run build` | PASS — desktop `dist/` produced |
| `npm run build:site` | PASS — deployable `dist/site/` produced |
| `npm run test:e2e` | PASS — 35/35 Chromium tests |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | PASS |

The initial site JavaScript is about 1.85 KB raw; demo JavaScript is 28.41 KB raw. Site CSS is 5.24 KB raw; the demo CSS is 10.56 KB raw. The hero WebP is 48 KB. All remain below the product budgets.

## Live verification

- `/opt/fleet/lib/verify-url.sh` passed on Home, Demo, Privacy, and Terms: HTTP 200, route-specific title, `lang`, one H1, main landmark, alt text, labelled controls, and no console errors.
- `node scripts/verify-live.mjs` passed 21 cold checks. It verified the 390×844 first screen, one-click sample path, demo title/banner/isolation/reset/exit, CSV file import, complete mobile navigation, Privacy, Terms, a real HTTP 404, the 0.1.3 download link, and offline nested-route reload.
- Playwright axe scans found zero serious or critical issues on Home, Demo, Privacy, Terms, and 404.
- The live demo flow made no unexpected cross-origin requests. The landing only used its declared GitHub release lookup; license checks run only after an explicit license action.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.8 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Cold screenshots and raw reports are in `.factory/evidence/polish-2/`.

## Release verification

GitHub Actions run <https://github.com/B-Divyesh/sf-bench-bin-bom/actions/runs/33278132904> completed successfully for verify, Linux, Windows, macOS arm64, macOS x64, and manifest jobs. Release 0.1.3 contains 11 assets. Its `latest.json` names Linux, macOS, and Windows.

Downloaded `Bench.Bin.BOM_0.1.3_x64-setup.exe` and compared it with published `SHA256SUMS`:

```text
expected 32c8785415100151125cf940893ff90701bbf76b77129a38bec15ba989ce54b8
actual   32c8785415100151125cf940893ff90701bbf76b77129a38bec15ba989ce54b8
```

## How to verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run build:site
npm run test:e2e
cargo check --locked --manifest-path src-tauri/Cargo.toml
node scripts/verify-live.mjs
```

## Known gaps and operator action

No product or review gaps remain. Release installers are intentionally unsigned and the site discloses this before download. Code-signing certificates would be needed only if the operator later chooses to sign them.
