# Independent product verification 3 — FAIL

Verified on 2026-08-29 UTC.

- Candidate: `882c057ae4a14bdc6e38e511aa674610069ddebb`
- Live URL: <https://bench-bin-bom.sociobot.in>
- Work order: `bench-bin-bom-verify-3`
- Artifact class: desktop app
- Result: **FAIL — do not release**

The candidate source and deployed web experience are substantially repaired.
The site passes its first-read gate, all post-install repository tests, the
core BOM workflow, accessibility scans, privacy checks, offline reload,
performance budgets, response policy checks, and byte-for-byte deployment
comparison. It is still not releasable for two independent reasons:

1. The downloadable desktop release is built from pre-repair commit
   `50d838d`, not this candidate. Users who select the primary Linux, Windows,
   or macOS download receive the older product.
2. The declared `sample-demo` claim is false for an ordinary exit. Demo edits
   survive browser Back/navigation away and appear when the visitor re-enters.

## Mandatory opening gates

### Claims gate — FAIL

`.factory/claims.json` exists with 15 entries. Before repository inspection, I
ran every listed command from the initially clean checkout. Because dependencies
had not yet been installed, all 15 invocations stopped at runner startup with
`ERR_MODULE_NOT_FOUND: Cannot find package 'playwright'`. After the documented
clean-install prerequisite (`npm ci`), I reran every command individually in
registry order. All 15 then exited 0:

| Claim ID | Post-install command result |
| --- | --- |
| `sample-demo` | PASS, 1 Playwright test |
| `bom-allocation` | PASS, 1 Playwright test |
| `csv-import-export` | PASS, 1 Playwright test |
| `photo-limit` | PASS, 1 Playwright test |
| `free-limits` | PASS, 1 Playwright test |
| `paid-limits` | PASS, 1 Playwright test |
| `license-daily` | PASS, 1 Playwright test |
| `local-private` | PASS, 1 Playwright test |
| `offline-reload` | PASS, 1 Playwright test |
| `license-private` | PASS, 1 Playwright test |
| `free-core-features` | PASS, 1 Playwright test |
| `desktop-offline` | PASS, 1 Playwright test |
| `price-copy` | PASS, 1 Playwright test |
| `installer-checksum` | PASS, 1 Playwright test |
| `release-cache` | PASS, 1 Playwright test |

Every registry ID occurs exactly once as `@claim:<id>` in
`tests/e2e/product.spec.ts`, with no extra claim tags.

The claims gate nevertheless fails on independent observable evidence. The
registry says sample data “is discarded when you leave.” In a fresh live
browser context I entered through the landing CTA, added a part named
`SHOULD BE DISCARDED ON LEAVE`, used browser Back to return to `/`, and entered
the demo again through the same CTA. The part was still visible and
`demo:bench-bin-bom:v1` still contained it. The declared test only exercises
the explicit **Start for real** button; it does not exercise browser Back,
direct navigation, tab close, or later re-entry. This also conflicts with the
banner “Demo — sample data, nothing is saved.”

### Cold first-read and one-click demo — PASS

Fresh desktop and 390 px contexts showed, in the first viewport:

- What: “Check your parts before you start building.”
- Who: “For makers and homelab builders who want to catch shortages before a
  project stalls.”
- First action: “Try it with sample data,” with the adjacent explanation
  “Opens a sample bench and pull list in your browser.”

The action is one click from the landing page. On 390×844, the heading,
audience sentence, action, and action explanation were all visible without
horizontal overflow.

## Findings

### High — published desktop downloads do not contain the candidate repairs

The live landing page currently selects assets from GitHub release `v0.1.1`.
GitHub reports that release targets
`50d838d25144e4306cd9b3b6776518fdbf25631d`; the candidate is
`882c057ae4a14bdc6e38e511aa674610069ddebb`. The product diff between them is
not documentation-only: 18 product/workflow files changed with 254 insertions
and 57 deletions. Among the missing release changes are exact pull-bin
instructions, printable pull locations, demo/license teardown, build removal,
blank-name validation, nested-route offline recovery, Intel macOS selection,
and traceable build IDs.

Fresh evidence:

- Candidate local Debian package:
  `bc145e0899d62b8b5aa77d5201e8a2b3266eed6f0b136782a596e6d3bc3db52c`,
  4,338,704 bytes.
- Published `v0.1.1` Debian package:
  `4d1322a9c9d10660f4d383ba69f9a38b75cef460bc7c4be04756617b33e200e7`,
  4,339,340 bytes.
- Published AppImage checksum matches its manifest
  (`9ca61e94307df1a3a89bfa0c7dd45ddec00079e6f169ae8489eca7355933906c`)
  and the AppImage launches, but it is still the stale `50d838d` build.
- Candidate CI run `33262345165` passed, but no release is attached to the
  candidate or its repair commits.

This is release-blocking for a desktop-app product: a fresh local candidate
build does not help a visitor whose primary download installs the old product.

### High — demo edits survive ordinary exit and re-entry

The browser-Back reproduction above returned
`persistedAfterLeave: 1` and `demoStorageContainsEdit: true`. The explicit
**Start for real** and **Reset demo** paths do clear demo data and preserve the
real namespace, but ordinary leaving does not. This falsifies the registered
claim and the supplied demo-sandbox contract.

### Medium — published `latest.json` cannot describe both macOS builds

The release contains both `aarch64.dmg` and `x64.dmg`, but its published
`latest.json` has only one flat `platforms.macos` entry pointing to the ARM
DMG. The candidate workflow has been changed to emit separate `aarch64` and
`x64` entries, but that workflow has not produced a new release. The landing
page avoids the defect by reading the GitHub Releases API directly; consumers
of the required manifest do not.

### Medium — claim registry does not cover every visitor-facing claim

The literal claims contract also finds statements with no matching registry
entry, including that installers are unsigned, that a tag publishes all
platform artifacts plus `SHA256SUMS`/`latest.json`, and that the product does
not order parts or confirm electrical compatibility. These facts were checked
where possible during this review, but they are not individually registered
and tagged as required.

### Low — build undo reports the wrong object

Removing “Workshop weather node” produced “Workshop weather node removed.
Undo” and removed the card. Selecting **Undo** restored the build correctly,
but the live region/toast said “Part restored.” This is incorrect confirmation
for a keyboard or screen-reader user.

## Clean checkout and production gates

The checkout was clean and `HEAD` exactly matched the requested candidate.

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 64 packages, 0 vulnerabilities |
| `npm test` | PASS; 12 tests in 2 files |
| `npm run lint` | PASS; TypeScript `--noEmit` |
| `npm run build` | PASS; desktop WebView bundle in `dist/` |
| `npm run build:site` | PASS; complete static site in `dist/site/` |
| `npm run test:e2e` | PASS; 24/24 Chromium tests |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | PASS after installing the release workflow's Linux system packages |
| `CI=true npm run tauri build -- --bundles deb` | PASS |
| Native candidate launch | PASS; remained running for 8 seconds under Xvfb, expected timeout 124 |

The fresh package reports package `bench-bin-bom`, version `0.1.1`, amd64,
with `libwebkit2gtk-4.1-0` and `libgtk-3-0` dependencies.

## Independent end-to-end exercise

Across fresh live contexts, the following passed:

- The demo opened in one click with three stock records and the sample weather
  node build, and it did not read a seeded real-data sentinel.
- Imported zero-quantity stock and multiple bins; rejected a negative CSV
  quantity, kept the dialog open, then recovered with quoted comma fields.
- Allocated six M3 screws from C4 for the first line, then four from C4 and two
  from D2 for the second line without reusing stock.
- Kept the resistor shortage at two and showed substitute/electrical-review
  guidance.
- Created a second build, imported ready/short rows and quoted substitute text,
  rejected a zero needed quantity, then saved after correction.
- Print media retained part/bin pull instructions and hid app controls.
- Removed and restored a build; the restoration worked despite the low-severity
  message defect above.
- Exported a CSV with the correct header and quoted comma fields.
- **Reset demo** removed edits and preserved the real namespace.
- **Start for real** removed demo stock/license keys and preserved real data.
- Invalid, empty, over-limit, large-photo, fake-license, paid-limit, and
  cancellation cases also pass the full repository suite.

## Accessibility, responsive behavior, and routing

- `/opt/fleet/lib/verify-url.sh` passed `/` and `/demo/`. Both have a title,
  `lang=en`, one H1, a main landmark, alt text, labelled buttons, and zero
  browser errors.
- Playwright axe 4.11 found 0 violations (therefore 0 serious/critical) on the
  live desktop pull list and 390 px pull list, both at normal size and 200%
  root text size.
- Keyboard-only checks reached the 179.8×44 px skip link with a visible 3 px
  focus outline. Enter opened Add part, dialog focus moved to Close, Escape
  closed it, and focus returned to Add a part.
- Reduced-motion emulation produced a maximum computed animation/transition
  duration of 0 seconds.
- At 390 px and 200% text, document overflow was 0 and no visible interactive
  target measured below 44×44 CSS pixels.
- Landing, demo, legal, 404, nested builds, nested pull list, and demo legal
  deep links returned the expected title, one H1, and main landmark. All
  discovered links/fragments resolved; checkout and asset links returned their
  expected redirects.
- An unknown URL returned the designed 404 document with HTTP 404.

## Privacy, endpoint policy, and offline behavior

- A cold landing load requested only the product origin plus the documented
  GitHub Releases API. The complete demo workflow requested only the product
  origin. No analytics, trackers, remote fonts, remote scripts, console errors,
  page errors, or failed requests were observed.
- The live license verifier returned `{valid:false, reason:"invalid"}` for an
  invalid token. With an `Origin` header it returned the matching
  `Access-Control-Allow-Origin` and `Cache-Control: no-store`.
- A fresh 50-request single-client burst to license verification returned 30
  HTTP 200 responses and 20 HTTP 429 responses. Every 429 had
  `Retry-After: 4`. Observed allowance: 30 requests per burst.
- Checkout returned HTTP 303 to the hosted Dodo checkout.
- Sign-in/Entra checks are not applicable; the product has no sign-in.
- There is no product-owned backend or remote persistence boundary.
- The live service worker updated successfully, controlled the page, and used
  cache `bench-bin-bom-shell-v0.1.2`. A deep pull-list route reloaded offline
  with the sample project and all four BOM rows intact.

## Deployment identity, response policy, and performance

- A fresh candidate `npm run build:site` produced 25 public files. All 25
  matched the corresponding live responses byte for byte; the live footer
  reports build `882c057a`.
- HTML uses `public, must-revalidate, max-age=30`; hashed assets use
  `public, max-age=31536000, immutable`; `sw.js` uses `no-cache`.
- Responses include HSTS, enforced CSP with `frame-ancestors 'none'`,
  `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, and Permissions-Policy.
- Candidate desktop bundle: 25,906-byte JS (8,759 gzip) and 9,165-byte CSS
  (2,857 gzip).
- Site demo bundle: 25,241-byte JS (8,494 gzip) and 9,165-byte CSS (2,857
  gzip). Landing JS is 1,671 bytes plus a 711-byte helper. There are no fonts.
- Hero WebP: 47,798 bytes.
- Lighthouse 12.8.2 mobile: performance 100, accessibility 100, best practices
  100, SEO 100; FCP 1.1 s, LCP 1.1 s, TBT 0 ms, CLS 0, Speed Index 1.1 s;
  no console errors.

## Release decision

**FAIL.** The web deployment is healthy and matches the candidate, but this is
a desktop-app product and every advertised desktop download still installs a
pre-repair build. Independently, the ordinary browser-exit path falsifies the
registered demo-discard claim. Publish candidate-equivalent desktop artifacts,
regenerate `latest.json` with both macOS architectures, and make every exit
from demo mode discard its namespace (with a test that uses browser Back or
direct navigation) before re-verification.
