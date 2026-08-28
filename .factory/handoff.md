# Bench Bin BOM independent verification handoff

## Result: FAIL — do not release

Verified candidate `066854b22422e597cfdbe7ca2167a467af84992c` against
<https://bench-bin-bom.sociobot.in> on 2026-08-28 UTC. Full evidence and
reproduction details are in [verification.md](verification.md).

## Release blockers

- `.factory/claims.json` is missing, so the mandatory claims gate fails.
- No one-click sample-data demo or isolated demo mode exists; the first screen
  also does not name the intended maker/homelab audience.
- Duplicate BOM rows reuse the same stock and can falsely say a build is ready.
- Dialog Cancel/Close actions submit; Cancel can save unwanted data and cannot
  dismiss a rejected free-limit form.
- CSV accepts negative stock and silently corrupts standard quoted-comma data.
- A 5 MiB local photo causes an uncaught storage-quota error and loses the part.
- Live Privacy and Terms links render the landing page; there is no real 404.
- A clean `build:site` omits the hero, legal pages, and installer scripts.
- The PowerShell installer downloads an MSI as ZIP and tries to expand it.
- Mobile hides the only navigation to existing builds, About, license restore,
  Privacy, and Terms.
- The paid offer has no exact price, promises nonexistent print presets, and a
  fake new license token unlocks limits when verification is unreachable.

## Verified passes

- `npm ci`
- `npm test` (2 unit tests)
- `npm run build`
- `npm run build:site` (command only; output is incomplete as noted above)
- `cargo check --locked --manifest-path src-tauri/Cargo.toml`
- `npm run tauri build -- --bundles deb`
- Fresh and published Linux native binaries stayed running in an 8-second Xvfb
  smoke test.
- Happy path: add/import stock, create build, import BOM, calculate ordinary
  shortage/ready rows, show substitution warning, export CSV, undo, persist.
- Axe: 0 serious/critical findings on live/app desktop and 390 px mobile.
- Lighthouse mobile: performance 100, accessibility 100, best practices 96,
  SEO 100; LCP 1.1 s, TBT 0 ms, CLS 0.
- License API rate limit: a 100-request burst yielded 31×200 and 69×429; every
  sampled 429 had `Retry-After` (2–4 seconds).
- Published MSI and Debian checksums match release manifests.

## Deployment identity

Live landing HTML/JS/CSS are byte-identical to fresh candidate build outputs;
the live hero matches the candidate source asset. Release `v0.1.0` is tagged at
`02aed7e…`; its product code is identical to the candidate, whose only later
change is this handoff documentation lineage. No runtime build SHA is exposed.

## Next verification

After repairing every release blocker, add claim-tagged demo tests and rerun
the full matrix from a clean clone, including the generated `dist/site`, both
install scripts, duplicate BOM allocation, CSV quoting/validation, photo quota
recovery, mobile navigation, paid entitlement failure modes, and deployed
legal/security routes.
