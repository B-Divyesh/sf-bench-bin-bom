# Bench Bin BOM independent verification handoff

## Result

**FAIL — do not release.**

- Tested candidate: `a52257761ee0f1b8e5668dae72680821cb100b38`
- Tested live URL: <https://bench-bin-bom.sociobot.in>
- Verification date: 2026-08-29 UTC
- Full evidence: [verification-2.md](verification-2.md)

No product code was changed during verification.

## Release blockers

1. Offline reload works at `/demo/` but fails at `/demo/builds`, returning the
   designed 404 page. This falsifies the offline claim outside its narrow test.
2. Demo license restore writes real `sb_license:*` keys. **Start for real**
   leaves both license data and modified `demo:*` data behind, contradicting
   the isolated “nothing is saved” demo promise.
3. The on-screen and printed project pull list omits the bin locations stored
   with stock, so it does not tell the maker where to pull each part.
4. Intel macOS visitors receive the ARM DMG from the primary detected-platform
   download. Both DMGs exist, but the landing code selects the first `.dmg`.
5. Material privacy/native-offline/free-feature claims do not have tests that
   prove their complete observable behavior. The mandatory claims contract is
   therefore incomplete despite all 12 declared commands passing.

Also fix whitespace-only required names, add a way to delete builds, replace
the deployed `local` build ID, bring all touch targets to 44×44, complete route
metadata, and repair or remove the invalid stale Scoop/winget manifests.

## Verification summary

Passing checks:

- All 12 claim commands passed individually from the clean checkout.
- `npm ci`, `npm test` (10/10), `npm run lint`, `npm run build`,
  `npm run build:site`, and `npm run test:e2e` (19/19) passed.
- Locked Rust check and `CI=true npm run tauri build -- --bundles deb` passed
  after installing the exact Linux dependencies declared by the workflow.
- Fresh and published Linux binaries each remained running for eight seconds
  under Xvfb.
- Cold first-read passed on desktop and 390 px mobile. The one-click demo is
  visible without scrolling.
- Live axe scans found zero violations; keyboard focus, reduced motion, 200%
  text, and console/page-error checks otherwise passed.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.17 s, TBT 113 ms, CLS 0.
- Live security and cache headers pass. A clean candidate site build matched
  all 25 publicly served live files byte for byte.
- The v0.1.1 Linux AppImage checksum matches `latest.json` and `SHA256SUMS` and
  the extracted app launches.
- The Sociobot verifier enforced an observed burst allowance of 30 requests;
  excess requests returned 429 with `Retry-After: 4`.

## How to reproduce the blockers

1. Open `/demo/`, wait for service-worker control, open Builds, go offline,
   and reload `/demo/builds`; the 404 page replaces the app.
2. In `/demo/about`, paste a license and inspect localStorage; the non-demo
   `sb_license:bench-bin-bom*` keys are written. Modify stock, select **Start
   for real**, return to `/demo/`, and observe the change remains.
3. Open the sample pull list or print it; compare it with stock bins A1, A2,
   and C4. No bin appears in the pull list.
4. Load the landing page with an Intel Mac user agent; the download URL ends in
   `_aarch64.dmg`.

## Known packaging constraint

The macOS and Windows packages are unsigned. Signing still needs the operator
credentials already described by the release workflow; this was disclosed on
the landing page and was not itself treated as a defect.
