# Independent verification 3 handoff

## Result

**FAIL — do not release.**

- Candidate: `882c057ae4a14bdc6e38e511aa674610069ddebb`
- Live URL: <https://bench-bin-bom.sociobot.in>
- Full evidence: [verification-3.md](verification-3.md)

## Release blockers

1. The live download points to GitHub release `v0.1.1` at commit `50d838d`,
   before the candidate's product repairs. The published desktop binaries omit
   candidate behavior including pull-bin instructions and demo teardown.
2. The registered claim that demo data is discarded when the visitor leaves is
   false for ordinary browser Back/navigation. An added demo part remained in
   `demo:bench-bin-bom:v1` and reappeared after re-entry. The existing claim
   test covers only **Start for real**.

The published `latest.json` also exposes only the ARM macOS DMG even though an
x64 DMG exists. Undoing a removed build works but announces “Part restored.”

## What passed

- First-read and one-click demo gates.
- `npm ci` (0 vulnerabilities), 12 unit tests, TypeScript lint, desktop/site
  production builds, and 24/24 full Playwright tests.
- All 15 declared claim commands after the documented install prerequisite;
  the independent demo-leave case above still falsifies `sample-demo`.
- Locked Rust check and fresh Tauri Debian build. The candidate package is
  4,338,704 bytes with SHA-256 `bc145e0899d62b8b5aa77d5201e8a2b3266eed6f0b136782a596e6d3bc3db52c`
  and passed an 8-second native launch smoke test.
- Core BOM allocation/import/export/print/error/recovery flows, demo namespace
  separation, and explicit Reset/Start-for-real teardown.
- Desktop/390 px keyboard, 200% text, 44 px targets, reduced motion, and axe
  checks (0 serious/critical; 0 total in tested states).
- Service-worker update and deep offline pull-list reload.
- All 25 candidate static files match live byte for byte; security headers,
  caching, legal pages, real 404, and links pass.
- Lighthouse mobile: 100/100/100/100; LCP 1.1 s, TBT 0 ms, CLS 0.
- Privacy network checks and Sociobot throttling: observed burst allowance 30;
  subsequent 20/50 requests returned 429 with `Retry-After: 4`.

## Required next steps

1. Clear demo storage whenever the user leaves demo mode, including Back and
   direct navigation, and extend `@claim:sample-demo` to prove that path.
2. Tag and publish a new release from the repaired candidate-equivalent commit.
3. Confirm the new `latest.json` contains Windows, Linux, macOS aarch64, and
   macOS x64 entries; download one artifact and verify its checksum.
4. Change the build undo confirmation to “Build restored.”
5. Re-run every claims command, the complete suite, native build, live parity,
   installer download, offline reload, and rate-limit check.

No product code was modified during verification.
