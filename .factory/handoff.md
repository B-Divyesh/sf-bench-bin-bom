# Polish round 1 handoff — Bench Bin BOM

## Outcome

All 13 findings in `.factory/review-1.md` are closed. The live site now has concise first-screen copy, an explicit isolated `/demo/?demo=1` entry, complete claim coverage, mobile-safe navigation, all facts above the 390×844 fold, plain README copy, real legal/404 routes, route titles and focus, and labelled external source navigation.

The paper-cut workbench identity and Tauri desktop-app release class are unchanged.

## What changed

- Added `sample-content`, `record-bin-locations`, and `bom-entry-notes` to the 21-entry claim registry with observable Playwright tests.
- Made the sample CTA and documentation use `/demo/?demo=1`. Demo changes remain in separate `demo:` storage and are removed on Reset, Start for real, browser exit, or later re-entry.
- Rewrote the landing headline, audience line, action outcome, and three facts for fast mobile reading.
- Replaced mobile horizontal nav scrolling with a visible four-column layout; every target is at least 44 px.
- Removed the visitor-facing artwork provenance caption, labelled the GitHub source link as external, and renamed the two unclear section headings.
- Rewrote all four README passages cited by the review and refreshed `.factory/copy-audit.md`.
- Kept the header consistent on the styled 404 page and bumped the service-worker cache name for immediate delivery.
- Added `.factory/catalog-description.txt`: 79 characters, verb first.
- Recorded finding-by-finding evidence in `.factory/polish-1.md`.

## Verification

Clean clone `/tmp/bench-bin-polish-clean-HtUCJc`, product commit `fdcd884f2182cee4275d7a6797daa2ab9462f6bf`:

- Every declared claim command: **21/21 passed separately**.
- `npm test`: **12/12 passed**.
- `npm run lint`: passed.
- `npm run build`: passed; desktop bundle JS 27.53 kB (9.14 kB gzip), CSS 9.17 kB (2.86 kB gzip).
- `npm run build:site`: passed; complete `dist/site/`.
- `npm run test:e2e`: **32/32 passed** at the clean product commit. The later copy-lock test passed separately; final suite total is **33**.
- `cargo check --locked --manifest-path src-tauri/Cargo.toml`: passed after installing the Linux packages already listed in the release workflow.

Additional local and live evidence:

- `/opt/fleet/lib/verify-url.sh`: passed home and demo; title, `lang`, one H1, main landmark, alt text, labels, and zero console errors.
- `npx @axe-core/cli`: **0 violations** on home and demo locally and live.
- Lighthouse mobile live: **100 performance / 100 accessibility / 100 best practices / 100 SEO**; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Live fresh-context workflow: 3 sample stock rows, 4 BOM rows, D7 stock-to-pull instruction, pasted substitute note after reload, Reset, nested-route offline reload, route focus, legal pages, and 404 all passed.
- Live demo workflow made only same-origin requests. Successful routes produced zero console/page errors.
- Response headers include enforced CSP, HSTS, frame denial, permissions policy, referrer policy, and `nosniff`.
- Local and live SHA-256 matched for `index.html` and the hashed landing JavaScript.
- Published v0.1.2 includes every desktop target, `SHA256SUMS`, and `latest.json`. The 4,339,828-byte Debian package matched SHA-256 `f79ffad96729faf9cfbfce5279a98a6abae6aa6529f2dfbcb85962bdccb383e9`.

Evidence images and reports are under `.factory/evidence/`.

## Deployment

- Command: `/opt/fleet/lib/deploy-static.sh bench-bin-bom dist/site`
- Deployment ID: `f672543a-49ad-4e39-b2ab-167d85180cbb`
- Live URL: <https://bench-bin-bom.sociobot.in>
- Demo URL: <https://bench-bin-bom.sociobot.in/demo/?demo=1>
- Live product build: `fdcd884f`

## Known gaps

None.

## Operator notes

The existing v0.1.2 desktop release remains unsigned, as disclosed before download. Signing later requires the owner’s Apple and Windows certificates; it is not needed for this web-copy/test-only polish release.
