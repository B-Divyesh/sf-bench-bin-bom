# Adversarial first-read review 3 — FAIL

Reviewed 2026-08-29 UTC against <https://bench-bin-bom.sociobot.in> from fresh Chromium contexts at 390×844 and 1440×1000. The clean clone was `2732829c1361e16ed7591139e5eaef29aca7499f`; the deployed footer reports build `735ffeaa`.

## Verdict

**FAIL.** The cold first read, real one-click demo, all 23 registered claims, isolation, routes, accessibility, and every earlier finding pass. Two user-facing promises in the landing purchase/install copy are not listed in `.factory/claims.json` and have no tagged observable test. The claims contract requires every reliance claim to be registered and tested; the review cannot pass with either remaining.

## Cold first read

Before scrolling, at both tested widths:

- **What it does:** Checks the parts in my drawers against a project parts list and shows shortages before I build.
- **For whom:** Makers and homelab builders.
- **What to click first:** **Try it with sample data**. The adjacent text says **“Opens an isolated sample bench and pull list.”**

This passes the clarity gate. At 390×844, all four navigation targets are fully visible, the action is visible, and the last required fact ends at y=599.4. The first demo screen shows **“ESP32 DevKit”** (y=574.6), **“Pull 1 from A1”** (y=598.6), and **“2 short”** (y=662.1), all within the initial viewport.

## Findings

### Blocking

#### F-3-1 — The landing makes an untested security promise about checkout

- **Location / quote:** landing purchase section, `site/index.html:83`: **“Opens secure Sociobot checkout.”** The CTA accessible name also says **“opens secure Sociobot checkout.”**
- **Why:** `.factory/claims.json` has no claim for checkout security or destination. `@claim:price-copy` proves only that the price is shown; it does not verify this promise. A first-time buyer is specifically being asked to rely on the word “secure.” The current link redirects from `api.sociobot.in` to `checkout.dodopayments.com`, so the wording also does not plainly identify the final payment site.
- **Concrete fix:** Remove the untestable security adjective and say **“Opens checkout on an external site.”** If provider naming is needed, say **“Opens Dodo checkout through Sociobot (external).”** Add a `checkout-destination` claim with a non-purchasing redirect test, or keep the shorter non-security disclosure.

#### F-3-2 — The landing makes an untested operating-system behavior promise

- **Location / quote:** landing install section, `site/index.html:89`: **“Your operating system may ask you to confirm it.”**
- **Why:** This is a claim about installer behavior on a visitor’s device. `@claim:unsigned-installers` only checks that unsigned status is disclosed; it does not test a macOS, Windows, or Linux confirmation prompt. The README repeats the same promise. A visitor deciding whether to install cannot tell what has actually been verified.
- **Concrete fix:** Keep the registered, factual disclosure: **“The installer is unsigned.”** Remove the operating-system prediction from landing and README unless a platform-specific claim test is added.

## Copy audit

Counts use whitespace-separated words; hyphenated terms, paths, URLs, and prices count as one word. No sentence exceeds 22 words. No banned marketing adjective, unexplained first-use BOM acronym, mood heading, or non-result-naming product button was found. F-3-1 and F-3-2 are the two unlisted claim flags.

### Landing page

| Sentence | Words |
| --- | ---: |
| Check your parts before building. | 5 |
| For makers and homelab builders who need to find shortages before starting. | 12 |
| Opens an isolated sample bench and pull list. | 8 |
| Inventory stays on this device. | 5 |
| The desktop app works offline. | 5 |
| Free: 40 parts and two builds. | 6 |
| Bench Pass: $12 once. | 4 |
| The sample includes three stock items and a four-line weather-node parts list (BOM). | 13 |
| Add quantities and bin locations, or import CSV. | 8 |
| Paste the BOM and keep substitute notes beside each line. | 10 |
| Each physical part is allocated once across the BOM. | 9 |
| Bench Bin BOM does not order parts or confirm electrical compatibility. | 11 |
| Check substitutions, ratings, pinouts, and fit yourself. | 7 |
| The free app holds 40 stock parts and two builds. | 10 |
| Bench Pass removes those limits. | 5 |
| CSV export, accessibility, and safety notes stay free. | 8 |
| Opens secure Sociobot checkout. | 4 |
| Download the unsigned installer for your computer. | 7 |
| Your operating system may ask you to confirm it. | 9 |
| Checking GitHub for the latest release. | 6 |
| Downloads open on GitHub. | 4 |
| Compare a project parts list with parts in your drawers. | 10 |
| Version 0.1.3. | 2 |
| The installer is unsigned. | 4 |
| Downloads from GitHub. | 3 |

### README

| Sentence | Words |
| --- | ---: |
| Bench Bin BOM is a desktop app for makers and homelab builders. | 12 |
| It checks a project parts list (BOM) against parts stored in your bench drawers. | 14 |
| Stock, projects, optional photos, and license details use local app storage. | 11 |
| The app does not track how you use it. | 9 |
| CSV import and export keep the stock list portable. | 9 |
| Each physical part is allocated once across duplicate BOM rows. | 10 |
| Try the isolated sample at https://bench-bin-bom.sociobot.in/demo/?demo=1. | 6 |
| The demo uses separate storage and never reads real data. | 10 |
| It is discarded when you leave or select Start for real. | 11 |
| Free mode supports 40 stock parts and two builds. | 9 |
| Bench Pass costs US$12 once and removes those record limits. | 10 |
| It does not gate CSV export, accessibility, or safety notes. | 10 |
| The app reuses a verified license result for one day. | 10 |
| Build the desktop app with npm run build. | 8 |
| Build the landing site with npm run build:site. | 8 |
| Run the browser checks with npm run test:e2e. | 8 |
| The desktop app keeps inventory and pull lists available without a network connection. | 13 |
| The web demo works offline after its first visit, including nested build routes. | 13 |
| Push a version tag such as v0.1.3 to build installers for macOS, Windows, and Linux. | 16 |
| The release also publishes SHA256SUMS and latest.json. | 8 |
| Installers are unsigned, so macOS and Windows may ask for confirmation. | 11 |
| The landing page checks GitHub for the latest release and keeps that result for one hour. | 16 |
| If that lookup fails, it links to the release page. | 10 |
| /install.sh and /install.ps1 verify SHA-256 before installation. | 7 |
| The PowerShell path installs the published MSI with Windows Installer. | 10 |
| Deploy the static site with: | 5 |
| Core inventory use sends no data to third parties. | 9 |
| License verification sends only the saved token to Sociobot. | 9 |
| Substitute notes are planning prompts, not electrical advice; check ratings, pinouts, and fit. | 13 |
| See Privacy and Terms. | 4 |
| MIT. | 1 |
| See LICENSE. | 2 |

Terminology is consistent: **part** for physical inventory, **bench stock** for its list, **parts list (BOM)** for project requirements, **pull list** for the checked result, **bin** for a location, **shortage** for missing quantity, and **Bench Pass** for the paid license.

## Demo, sandbox, and privacy

- **One click and useful first screen:** PASS. The first CTA opens `/demo/?demo=1`; the mobile first screen already shows realistic stock, a pull instruction, and a shortage.
- **Demo controls:** PASS. The persistent banner says **“Demo — sample data, nothing is saved”** and offers **Reset demo** and **Start for real**.
- **Isolation:** PASS. With a seeded real key, a live demo edit wrote only `demo:bench-bin-bom:v1`. **Start for real** removed that demo key and retained the real key unchanged. Reset restores sample content.
- **Privacy:** PASS for registered data claims. A fresh demo edit flow requested only `https://bench-bin-bom.sociobot.in`; no analytics, telemetry, or third-party request occurred. A cold landing also requests the disclosed GitHub release lookup.
- **Offline:** PASS. `@claim:offline-reload` reloads `/demo/builds` offline after service-worker control and finds the sample build.

## Claims and clean-clone verification

After `npm ci --include=dev` in `/tmp/bench-bin-review3-clean.uFkXB1` (this sandbox otherwise omits dev dependencies), each declared command in `.factory/claims.json` was invoked individually. All **23/23** passed: `sample-demo`, `sample-content`, `record-bin-locations`, `bom-entry-notes`, `bom-file-import`, `stock-shortage-check`, `bom-allocation`, `csv-import-export`, `photo-limit`, `free-limits`, `paid-limits`, `license-daily`, `local-private`, `offline-reload`, `license-private`, `free-core-features`, `desktop-offline`, `price-copy`, `installer-checksum`, `release-cache`, `unsigned-installers`, `release-artifacts`, and `planning-only`.

The complete local quality run also passed: `npm test` (12 tests), `npm run lint`, `npm run build`, `npm run build:site`, and `npm run test:e2e` (35 Chromium tests). No declared claim test failed. F-3-1 and F-3-2 are registry-completeness defects, not failed registered tests.

## Structure, routes, links, and identity

- PASS: Home, demo, deep demo Builds, Privacy, Terms, and unknown 404 routes have the expected route titles, one h1, one main landmark, descriptions, canonical URLs, Open Graph data, favicon, and Apple touch icon. The unknown path returns the designed `Page not found` page with HTTP 404.
- PASS: Demo navigation changes focus to the incoming h1; Back restores it. Desktop and mobile checks have no page errors. The browser naturally reports the HTTP 404 navigation itself as a failed 404 resource, which is not an application console error.
- PASS: All internal links, release asset, source repository, checkout redirect, robots, sitemap, icons, and social image responded successfully. The checkout chain resolves to Dodo and the current Linux asset resolves to GitHub Releases.
- PASS: Axe reported zero serious or critical violations on home, demo, Privacy, Terms, and 404. The mobile visual treatment is product-specific paper-cut workbench design, not a generic SaaS template.

## Earlier findings rechecked from scratch

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 | Fixed: `sample-content` and its exact three-part/four-line test exist. |
| F-1-2 | Fixed: bin capture and pull locations are covered by `record-bin-locations`. |
| F-1-3 | Fixed: pasted BOM rows and substitute notes are covered by `bom-entry-notes`. |
| F-1-4 | Fixed: no landing provenance caption remains. |
| F-1-5 | Fixed: the source link visibly identifies GitHub as external. |
| F-1-6 | Fixed: all four landing navigation links fit at 390 px. |
| F-1-7 | Fixed: every hero fact is inside the first 390×844 screen. |
| F-1-8 | Fixed: README opens with the plain desktop-app job statement. |
| F-1-9 | Fixed: demo storage/discard copy is split into short sentences. |
| F-1-10 | Fixed: the README no longer carries QA-suite jargon or coverage claims. |
| F-1-11 | Fixed: release cache wording contains no CORS jargon. |
| F-1-12 | Fixed: the workflow heading names the pull-list task. |
| F-1-13 | Fixed: the limitations heading names the product boundary. |
| F-2-1 | Fixed: the direct mobile demo starts with named sample results in view. |
| F-2-2 | Fixed: the BOM dialog has a labelled CSV file input. |
| F-2-3 | Fixed: `stock-shortage-check` covers the central comparison promise. |
| F-2-4 | Fixed: README build-output claims were removed. |
| F-2-5 | Fixed: README suite-coverage claims were removed. |
| F-2-6 | Fixed: direct demo retains `Demo — Bench Bin BOM`. |
| F-2-7 | Fixed: the 404 h1 is `Page not found`. |
| F-2-8 | Fixed: purchase and download copy identifies the external service/destination. |
| F-2-9 | Fixed: first use expands BOM to parts list. |
| F-2-10 | Fixed: README says the app does not track use. |
| F-2-11 | Fixed: README has no WebView build jargon. |
| F-2-12 | Fixed: README has no release-matrix jargon. |
| F-2-13 | Fixed: `Try the real workflow` is absent. |
| F-2-14 | Fixed: `Clear boundaries` is absent. |

## Missed leverage

No omitted AI, sync, or import/export feature is implied by the available scope. The local comparison job already includes the useful CSV import/export and sample pull-list workflow. No runtime AI feature or provider key was found.

## What would make this perfect

Remove the two untested promises or register narrow, observable tests for them. Then repeat the complete claims and live first-read review; there is no other finding in this pass.
