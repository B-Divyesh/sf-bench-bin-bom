# Handoff — polish round 3

## Outcome

**PASS.** The complete cumulative review set is closed. The repair is in
`c865d1529bd26e76855c3dc513705d8f2b759d5f`; v0.1.4 is
`9d26ef1139098aae886ebda57c136b31c2f20a61` and is tagged `v0.1.4`.

F-3-1 now names only a factual external checkout and has the registered
`checkout-destination` redirect test. F-3-2's unsupported operating-system
prediction was removed from landing, desktop About, README, installer output,
and future release text. The tested unsigned disclosure remains.

## What changed

- Added the 24th claim and unique Playwright test for the non-purchasing
  Sociobot-to-Dodo checkout redirect.
- Kept the direct `?demo=1` sandbox, persistent banner, reset, exit cleanup,
  sample-first mobile screen, real CSV file import, legal routes, and 404
  regression coverage from prior rounds.
- Released the desktop app as v0.1.4 so the download resolves to a binary with
  the repaired About copy; local Debian package verified as `bench-bin-bom`
  v0.1.4 amd64 (4,340,280 bytes).
- Updated the catalog description to a 75-character verb-first sentence.

## Exact verification

- Clean clone: `/tmp/bench-bin-bom-polish3-clean.RScCc6/repo` at
  `9d26ef1139098aae886ebda57c136b31c2f20a61`; `npm ci --include=dev` completed
  with 64 packages and zero vulnerabilities.
- Every one of the 24 commands declared in `.factory/claims.json` passed
  separately from that clone, including `@claim:checkout-destination`.
- Same clean clone: `npm test` passed 12 tests; `npm run lint`, `npm run build`,
  `npm run build:site`, and `npm run test:e2e` passed. The browser suite has 36
  Chromium tests covering axe, keyboard, 390 px layout, demo isolation, privacy,
  offline reload, legal routes, titles, focus, and 404 behavior.
- Release worktree: `cargo test --locked --manifest-path src-tauri/Cargo.toml`,
  `cargo check --locked --manifest-path src-tauri/Cargo.toml`, and
  `CI=true npm run tauri build -- --bundles deb` passed.
- Release workflow: <https://github.com/B-Divyesh/sf-bench-bin-bom/actions/runs/33281762050>.
- Static deployment and cold live recheck are recorded in `.factory/polish-3.md`.

## Run and deploy

```sh
npm ci --include=dev
npm test
npm run lint
npm run build
npm run build:site
npm run test:e2e
cargo check --locked --manifest-path src-tauri/Cargo.toml
/opt/fleet/lib/deploy-static.sh bench-bin-bom dist/site
```

## Known gaps and operator action

None. The desktop installers are intentionally unsigned. No signing credentials
are configured or required for this release.
