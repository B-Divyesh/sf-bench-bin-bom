# Independent product verification 5 — PASS

Verified 2026-08-29 at 20:48 UTC from the clean candidate checkout.

- Candidate: `fa595ef418af301eebbf58dc8a0301750aa0c90d`
- Live URL: <https://bench-bin-bom.sociobot.in>
- Demo URL: <https://bench-bin-bom.sociobot.in/demo/?demo=1>
- Work order: `bench-bin-bom-verify-5`
- Artifact class: desktop app with a static browser demo
- Result: **PASS — release accepted.**

No release-blocking, serious, moderate, or minor product defects were found. The
previous deployment concern is resolved: the live footer identifies `fa595ef`,
and five candidate-built core files are byte-identical to the live files.

## Mandatory opening gates

### Claims gate — PASS

`.factory/claims.json` exists and contains 21 entries. After `npm ci` installed
64 locked packages with zero audit vulnerabilities, every declared command was
run separately and passed from the demo entry point. Every ID also occurs
exactly once as an `@claim:<id>` test tag.

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-demo` | `npm run test:e2e -- --grep '@claim:sample-demo'` | PASS |
| `sample-content` | `npm run test:e2e -- --grep '@claim:sample-content'` | PASS |
| `record-bin-locations` | `npm run test:e2e -- --grep '@claim:record-bin-locations'` | PASS |
| `bom-entry-notes` | `npm run test:e2e -- --grep '@claim:bom-entry-notes'` | PASS |
| `bom-allocation` | `npm run test:e2e -- --grep '@claim:bom-allocation'` | PASS |
| `csv-import-export` | `npm run test:e2e -- --grep '@claim:csv-import-export'` | PASS |
| `photo-limit` | `npm run test:e2e -- --grep '@claim:photo-limit'` | PASS |
| `free-limits` | `npm run test:e2e -- --grep '@claim:free-limits'` | PASS |
| `paid-limits` | `npm run test:e2e -- --grep '@claim:paid-limits'` | PASS |
| `license-daily` | `npm run test:e2e -- --grep '@claim:license-daily'` | PASS |
| `local-private` | `npm run test:e2e -- --grep '@claim:local-private'` | PASS |
| `offline-reload` | `npm run test:e2e -- --grep '@claim:offline-reload'` | PASS |
| `license-private` | `npm run test:e2e -- --grep '@claim:license-private'` | PASS |
| `free-core-features` | `npm run test:e2e -- --grep '@claim:free-core-features'` | PASS |
| `desktop-offline` | `npm run test:e2e -- --grep '@claim:desktop-offline'` | PASS |
| `price-copy` | `npm run test:e2e -- --grep '@claim:price-copy'` | PASS |
| `installer-checksum` | `npm run test:e2e -- --grep '@claim:installer-checksum'` | PASS |
| `release-cache` | `npm run test:e2e -- --grep '@claim:release-cache'` | PASS |
| `unsigned-installers` | `npm run test:e2e -- --grep '@claim:unsigned-installers'` | PASS |
| `release-artifacts` | `npm run test:e2e -- --grep '@claim:release-artifacts'` | PASS |
| `planning-only` | `npm run test:e2e -- --grep '@claim:planning-only'` | PASS |

The landing page, app copy, README, privacy page, and terms were cross-checked
against the registry. The user-relevant behavior statements are covered by the
21 registered tests; no new unlisted product claim was found.

### Cold first-read and one-click demo — PASS

A fresh live browser context, with no seeded storage, immediately showed:

- What it does: **“Check your parts before building.”**
- Who it is for: **“For makers and homelab builders who need to find shortages before starting.”**
- What to do first: **“Try it with sample data.”**
- What happens next: **“Opens an isolated sample bench and pull list.”**

The CTA opens `/demo/?demo=1` in one click. The resulting screen already has
three realistic stock records and a four-line weather-node BOM. Its persistent
banner says “Demo — sample data, nothing is saved” and provides **Reset demo**
and **Start for real**. The gate therefore passes on desktop and at 390×844.

Evidence: [cold desktop](verification-evidence-5/live-cold-desktop.png) and
[390 px landing](verification-evidence-5/live-mobile-390.png).

## Clean-checkout quality gates

| Check | Fresh result |
| --- | --- |
| `npm ci` | PASS — 64 packages, 0 vulnerabilities |
| `npm test` | PASS — 12/12 tests in 2 files |
| `npm run lint` | PASS — `tsc --noEmit` |
| `npm run build` | PASS — desktop WebView bundle in `dist/` |
| `npm run build:site` | PASS — deployable site in `dist/site/` |
| `npm run test:e2e` | PASS — 33/33 Chromium tests |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` | PASS — native and doc test targets |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | PASS |
| `CI=true npm run tauri build -- --bundles deb` | PASS — installable Debian package |

The first native attempt correctly reported that the disposable verifier image
lacked GLib/GTK/WebKit headers. After installing the exact packages listed in
the repository release workflow, the native tests, check, and production
package all passed. This was an environment prerequisite, not a product failure.

The locally built package is `bench-bin-bom` 0.1.2 for `amd64`, depends on
`libwebkit2gtk-4.1-0` and `libgtk-3-0`, and is 4,339,828 bytes. Its local hash is
`3a6f6379ddb23522aaab6d420e25c0b61ae8a84e6932a1f459930208429f9116`.

## Independent live job exercise — PASS

The smallest useful workflow was exercised against the live site in fresh
browser contexts:

- Opened the isolated sample with exactly three stock rows and four BOM rows.
- Entered a blank part name, saw the specific error without losing the dialog,
  corrected it, and saved two `Panel jack` parts in bin `D7`.
- Added a matching BOM line and observed `PULL: 2 from D7`.
- Confirmed ten M3 screws allocate only once across two six-item demand rows:
  six allocated to the first row, four to the second, and two short.
- Pasted a BOM row with substitute and build notes and confirmed both persisted
  after reload.
- Rejected CSV quantity `-5`, recovered with a quoted `10k, 1%` value, exported
  CSV, and inspected the downloaded row.
- Rejected a photo larger than 2 MB, replaced it with a small PNG, and confirmed
  a local `data:image/png;base64` record without an external request.
- Seeded the exact free boundaries and confirmed the 41st stock part and third
  build are rejected with recovery guidance.
- Invoked **Print pull list** and checked print media: the heading and all four
  rows remain, controls/navigation are removed, and the per-line electrical
  substitute warning remains.
- Requested a service-worker update, confirmed its active/controlled state,
  then reloaded the nested pull-list route offline with its data intact.

Evidence: [live pull list](verification-evidence-5/live-demo-pull.png).

## Accessibility, responsive behavior, and browser health — PASS

- The factory `verify-url.sh` passed live home and demo: HTTPS 200, title,
  `lang="en"`, exactly one H1, `main`, complete image alt text, labelled buttons,
  and zero console errors. Reports are under
  `verification-evidence-5/verify-live-{home,demo}/`.
- Independent live axe scans of home, desktop demo/pull list, and 390 px demo
  found **0 serious or critical violations** (and 0 total on the recorded home
  and desktop-demo runs).
- Keyboard-only Tab + Enter opened **Add a part**. Focus moved inside the modal,
  Escape closed it, and focus returned to the opener. Native modal navigation
  did not expose an actionable background control.
- The keyboard focus indicator is a visible solid 3 px
  `rgb(185, 93, 29)` outline.
- At 390×844 there is no horizontal overflow, all three first-screen facts fit,
  and every visible link, button, input, and textarea on home, demo, Privacy,
  and Terms measures at least 44×44 CSS px.
- At 200% root text size the desktop page has no horizontal overflow.
- With reduced motion enabled, the primary action transition duration is `0s`.
- All three lazy walkthrough images decode to their intended 760×475 dimensions
  when scrolled into view.
- Successful live flows produced zero console errors and zero page errors.

## Privacy, network, and response policy — PASS

The complete live demo workflow issued 12 requests, all to
`bench-bin-bom.sociobot.in`. No analytics, telemetry, third-party fonts, or
third-party scripts were requested. A cold landing additionally makes the
documented GitHub Releases API request to select an installer. Source review
found only that GitHub metadata call and the explicit Sociobot checkout/license
calls.

Live responses enforce CSP (including header-only `frame-ancestors 'none'`),
HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
Permissions-Policy, and Referrer-Policy. HTML uses
`public, must-revalidate, max-age=30`; hashed assets use one-year immutable
caching; `sw.js` uses `no-cache`. The designed unknown route returns HTTP 404.

The Sociobot license verifier was checked with a fresh invalid token. Requests
1–30 returned HTTP 200 invalid verdicts with `Cache-Control: no-store`.
Request 31 was the first HTTP 429 and included `Retry-After: 4`; requests 31–40
were all throttled. Observed allowance: **30 requests per burst per client**.

There is no product sign-in, so the Entra authority requirement is not
applicable. There is no product-owned backend, database, or health endpoint;
backend concurrency and persistence checks are likewise not applicable.

## Performance and asset budgets — PASS

Fresh live mobile Lighthouse 12.8.2:

- Performance 97
- Accessibility 100
- Best practices 100
- SEO 100
- FCP 0.9 s, LCP 1.1 s, CLS 0, Speed Index 1.1 s, TBT 210 ms

A separate Event Timing probe over four representative mobile interactions had
a worst duration of 64 ms. The landing ships about 1.5 kB gzip initial JS and
1.8 kB gzip CSS; the complete demo JS is 8.9 kB gzip and demo CSS is 2.9 kB
gzip. There are no font files. The hero WebP is 47,798 bytes. All are well below
the required 200 kB JS, 50 kB CSS, 120 kB fonts, and 300 kB hero budgets.

Evidence: [Lighthouse JSON](verification-evidence-5/lighthouse-live.json).

## Deployment and installer identity — PASS

The live footer reports `v0.1.2 · fa595ef`. SHA-256 comparisons match for:

| Candidate-built file | SHA-256 |
| --- | --- |
| `index.html` | `41f1287bf84fd34ceafe77d8de8cb380bb512f643ee874f9b89097ffd6078976` |
| `demo/index.html` | `dc2161d383ab12b6c4ad3524acaae2a144f26b3671e141ae940a14d6c104fc08` |
| `assets/main-DCwvasnU.js` | `12844c3d056992ca4f0933108e8edcbf45aa8e610784ea16fdb9a966c1d550df` |
| `assets/demo-BDTrJ632.js` | `ffd1bd33708fce670ea86acae8bc172db6154cb6300ac5401190b0be2abe3c9b` |
| `assets/style-B5WQthgY.css` | `676d44af5f34e0008a933da886604d84ed1d767358851e1a3edb5f67d7689680` |

Published release `v0.1.2` is neither draft nor prerelease. It contains Windows
MSI/setup EXE, Linux AppImage/DEB/RPM, macOS arm64/x64 DMGs, `SHA256SUMS`, and a
valid `latest.json` describing Windows, Linux, and both macOS architectures.
The freshly downloaded 4,339,828-byte Debian asset matches its published hash:
`f79ffad96729faf9cfbfce5279a98a6abae6aa6529f2dfbcb85962bdccb383e9`.
Desktop application source and package configuration are unchanged between the
`v0.1.2` tag source commit and this candidate; the later changes are site copy,
demo service-worker versioning, tests, and factory documentation.

The live OS-detected action resolves to the real Linux v0.1.2 AppImage. Both
served installer scripts contain SHA-256 verification, and the Windows script
uses `msiexec.exe`. Unsigned-package status is disclosed before download.
macOS and Windows artifacts were validated by release metadata and checksums,
not executed inside this Linux verifier.

## Route, documentation, and product-contract checks — PASS

Home, demo, Privacy, Terms, app deep links, installers, icons, social image,
robots, and sitemap return 200. Each page has its route-specific title, one H1,
and one main landmark. The unknown route returns the styled 404 with a home
path. External source/release links return 200; checkout returns 303 to the
hosted Dodo-backed checkout.

README, MIT LICENSE, `.factory/design.md`, `.factory/demo.md`, claims registry,
privacy, terms, release workflow, and installer scripts are present. The
paper-cut workbench visual system follows the recorded product-specific palette,
type, spacing, single-mode rationale, motion policy, and original-asset
provenance. The brief's non-goals remain explicit: the product does not order
parts or claim electrical compatibility. No missed AI feature is warranted for
this local parts-comparison job.

## Defects by severity

- Critical: none.
- Serious: none.
- Moderate: none.
- Minor: none.

## Final verdict

**PASS.** Candidate `fa595ef418af301eebbf58dc8a0301750aa0c90d` satisfies the
work order and researched brief, is deployed at the tested URL, and is ready for
release.
