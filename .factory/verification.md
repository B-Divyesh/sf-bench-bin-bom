# Independent product verification — FAIL

Verified on 2026-08-28 UTC.

- Candidate: `066854b22422e597cfdbe7ca2167a467af84992c`
- Live URL: <https://bench-bin-bom.sociobot.in>
- Work order: `bench-bin-bom-verify-1`
- Result: **FAIL — do not release**

The happy-path BOM workflow works and the native package builds, but the
candidate fails both mandatory opening gates and has several independent
release-blocking defects in BOM correctness, cancellation, deployed legal
pages, site packaging, and Windows installation.

## Mandatory gates

### Claims gate — FAIL

The clean candidate checkout has no `.factory/claims.json`. Therefore there
were no listed claim commands to run, and the claims contract makes the
missing file release-blocking.

There are many unlisted claims in the landing page, app, and README, including
local-only storage, offline operation, CSV import/export, no telemetry, the
40-part/two-build limits, once-daily verification, and paid print presets.
There is no tagged claim test for any of them. The only repository tests are
two unit tests in `src/domain.test.ts`.

### Cold first-read and demo gate — FAIL

Cold first screen observed on the live desktop and 390 px mobile pages:

- What it does: compares a project BOM with parts in drawers.
- For whom: not stated; the page never names makers or homelab builders.
- What to click first: “Download for Linux” in this environment. The adjacent
  text gives a version and signing status, not what happens next.
- “Try it with sample data”: absent (0 matching actions).

`/demo` returns the ordinary landing page. There is no sample project, demo
banner, isolated demo storage, reset/start-real controls, screenshot
walkthrough, `.factory/demo.md`, or demo test entry point.

## Release-blocking defects

### Critical

1. **Duplicate BOM lines reuse the same stock and produce a false ready result.**
   With 10 M3 screws on hand and two BOM rows requiring 6 each, both rows say
   `Ready` and the project says `Ready to pull`, although total demand is 12
   and the actual shortage is 2. Stock is calculated independently for every
   row instead of being allocated across matching demand. This breaks the
   product's central job and can start a build with missing parts.

2. **The mandatory claim registry is absent.** See the claims gate above.

3. **There is no one-click sample-data demo.** See the demo gate above.

### High

1. **Cancel saves data instead of cancelling.** In Add part, entering
   `Must not save` and choosing `Cancel` closed the dialog and persisted that
   part. The close and cancel controls are submit buttons, and submit handlers
   do not inspect the submitter. At the 40-part/two-build limits, Cancel stays
   trapped in the modal; only Escape recovered in the test.

2. **CSV input can corrupt stock and shortage results.** An imported row with
   quantity `-5` was accepted and stored. A valid quoted value containing a
   comma (`Widget,"10k, 1%",2,A1,precision`) was silently stored as value `""`,
   quantity `1`, bin `2`, note `A1`. The parser splits on commas rather than
   parsing CSV and does not validate imported numeric boundaries.

3. **A normal large local photo fails with data loss and an uncaught error.**
   Selecting a 5 MiB JPEG caused
   `Setting the value of 'bench-bin-bom:v1' exceeded the quota`. The dialog
   closed, the part was not saved, local storage remained empty, and the user
   saw no recovery message. No file-size limit or quota handling is present.

4. **The deployed legal routes do not contain legal pages.** `/privacy/` and
   `/terms/` both return the 2,873-byte landing HTML with landing title and
   content. An arbitrary `/does-not-exist` path does the same, so there is no
   real 404. Users cannot read the linked privacy or purchase terms.

5. **A clean landing-site build is incomplete.** `npm run build:site` succeeds
   but `dist/site` contains only `index.html` plus one JS and one CSS file. It
   omits the referenced `/assets/bench-diorama.webp`, the privacy and terms
   pages, installer scripts, and other public files. A clean deployment of the
   documented artifact is broken. The currently live image matches the source
   file but is a stale/out-of-band file not produced in `dist/site`.

6. **The advertised Windows PowerShell installer cannot install its asset.**
   `latest.json` points Windows to an MSI. `install.ps1` downloads that MSI as
   `bench-bin-bom.zip` and calls `Expand-Archive`. The checksum-valid published
   asset is not a ZIP (`unzip -t` exit 9), so this one-line install path fails.

7. **Mobile navigation hides existing builds and paid/legal controls.** At
   390 px, `header nav` is `display:none` with no replacement menu. From the
   initial stock screen, an existing user cannot reach Builds or About; About
   is also the only in-app path to license restoration, Privacy, and Terms.

8. **The paid offer is incomplete and overclaims functionality.** Neither the
   landing page nor app states an exact price. Both promise paid “print layout
   presets,” but no preset UI or implementation exists anywhere in source.
   In addition, a newly captured, entirely fake token is treated as licensed
   when verification is unreachable: with 40 parts and the verification
   request aborted, `?license=totally-fake` allowed a 41st part.

### Medium

1. SPA navigation keeps the same document title and leaves focus on `BODY`.
   Navigating from stock to Builds left the title as
   `Bench Bin BOM — build from what you have`; the new H1 was not focused or
   announced. App navigation is hash-only.
2. Live responses have HSTS, `nosniff`, and a referrer policy, but no enforced
   CSP, frame policy, or permissions policy. Lighthouse specifically reports
   no enforcement CSP.
3. Hashed JS, CSS, and image assets use only
   `Cache-Control: public, must-revalidate, max-age=30`, not immutable
   long-lived caching.
4. `/favicon.ico`, `/robots.txt`, `/sitemap.xml`, and
   `/staticwebapp.config.json` return 404. The landing page also lacks
   canonical, Open Graph/Twitter, favicon, apple-touch icon, and theme-color
   metadata. The favicon 404 is logged to the browser console in Lighthouse.
5. Several live mobile links have 15 px high hit areas; the brand link is
   39 px high. These miss the 44 px touch-target baseline.
6. The landing script fetches GitHub release metadata on every load and does
   not implement the required one-hour local cache/fallback cache behavior.
7. `.factory/copy-audit.md` is absent. The visual thesis does not declare a
   single-mode exception, but no dark treatment exists.

## Passing evidence

### Clean checkout and builds

The checkout initially had no changes and resolved to the candidate hash.

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 62 packages, 0 vulnerabilities |
| `npm test` | PASS; 1 file, 2 tests |
| TypeScript check | PASS through both build scripts |
| `npm run build` | PASS; app bundle generated |
| `npm run build:site` | command PASS, but artifact completeness FAIL above |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | PASS after installing the same Linux system dependencies used by CI |
| `npm run tauri build -- --bundles deb` | PASS; fresh Debian bundle produced |
| Native launch smoke | PASS; fresh and published binaries remained running for 8 seconds under Xvfb; only headless DRI warnings |
| Lint | Not available; no lint script/configuration exists |
| Integration/E2E suite | Not available; browser checks below were verifier-authored |

### Functional browser exercise

In a fresh built-app state, the following passed:

- Required/negative manual part inputs were blocked by native validation.
- Added a 10k resistor (1/4W, quantity 6, bin A2) and imported two ESP32s.
- Recovered from a header-only CSV with the visible error
  `Add at least one valid row.`
- Created “Garage sensor” and imported three representative BOM rows.
- Correctly reported two shortages: resistor 2 short and reed switch 1 short;
  ESP32 was ready. Substitute and electrical-review notes were visible.
- Exported `bench-bin-parts.csv` with the correct header and two records.
- Remove/Undo restored a part, and two parts survived reload.
- Core flow made only same-origin requests and produced no console/page errors.
- Free-tier boundaries correctly rejected a 41st part and third build before
  the broken cancellation behavior described above.

### Accessibility and responsive behavior

- Playwright axe 4.11 found 0 serious/critical (and 0 total) violations on
  live desktop, live 390 px mobile, app desktop, and app mobile initial states.
- Keyboard Tab order reached the skip link, wordmark, navigation, download,
  purchase, and legal links with a visible 3 px focus outline.
- Reduced-motion emulation matched, with computed animation and transition
  durations of `0s`.
- No horizontal overflow occurred at 390 px.
- The landing and app each had `lang=en`, a title, one H1, and a main landmark
  on the tested initial views.

### Performance and bundle budgets

Fresh app build: 18.57 KB JS (6.54 KB gzip) and 7.65 KB CSS (2.54 KB gzip).
Live landing: 1.45 KB JS, 3.03 KB CSS, and 47,798-byte WebP. No remote fonts.

Lighthouse 12.8.2, mobile defaults, live URL:

- Performance 100
- Accessibility 100
- Best Practices 96
- SEO 100
- FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0, Speed Index 0.9 s

### Privacy, network, headers, and rate limiting

- Fresh core app use made same-origin requests only. No analytics/tracker was
  observed. The landing page additionally calls GitHub's releases API.
- The live landing rendered without console/page errors in the ordinary
  Playwright run; Lighthouse logged the favicon 404.
- A 100-request concurrent burst against the actual license verification
  endpoint returned 31 HTTP 200 and 69 HTTP 429 responses. The 429 responses
  included `Retry-After` values of 2–4 seconds. Rate limiting therefore passes,
  with an observed burst allowance of approximately 30 requests.
- A later single invalid-token request returned HTTP 200 and
  `{ "valid": false, "reason": "invalid", "expires_at": null }`.
- Sign-in/Entra validation is not applicable; the product has no sign-in.

### Deployment and release identity

- Fresh candidate `dist/site/index.html`, JS, and CSS SHA-256 hashes exactly
  match the corresponding live files. The live hero image SHA-256 exactly
  matches `public/assets/bench-diorama.webp`.
- The live site exposes no build/version commit identifier, so runtime identity
  is established by byte comparison, not an in-product build ID.
- Published tag `v0.1.0` resolves to `02aed7e439fa18b7e7f21578e6d3335adb709bf9`.
  Its tree differs from the candidate only in `.factory/handoff.md`, so product
  code is identical even though the release is not stamped with candidate SHA.
- Published Windows MSI SHA-256
  `c9e1c2322159f62319a55eb93e162b148bcf213fb9b2bb6fa533bc17ccb6ac0d`
  matches both `latest.json` and `SHA256SUMS`.
- Published Linux `.deb` SHA-256
  `bae73b35cdbf5eea2cb155e21cc50002c77ef0fb532e4a6aa35643de075885a9`
  matches `SHA256SUMS`; its package metadata declares WebKitGTK and GTK.

## Release decision

**FAIL.** The mandatory claims and demo gates alone require rejection. The
false-ready BOM result, cancel-that-saves behavior, broken clean site artifact,
missing deployed legal pages, and broken Windows installer independently make
the candidate unsafe to release. Reverify from a fresh clone after fixes; do
not treat the passing happy path, build, axe, or Lighthouse results as a waiver.
