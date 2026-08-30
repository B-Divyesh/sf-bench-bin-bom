# Adversarial first-read review 4 — PASS

Reviewed 2026-08-30 UTC against <https://bench-bin-bom.sociobot.in> in new Chromium contexts at 390×844 and 1440×1000. The independent checkout was a fresh local clone of commit `1f04274de9d738dfe27610aa1b5ed999cf27f23e`.

## Verdict

**PASS.** There are zero findings: no blocking, minor, unlisted-claim, or untested-claim item remains. No product code was changed during this review.

## Cold first read

Before scrolling, at both widths, I understood that this checks the parts in my drawers against a build parts list and shows shortages before I build; it is for makers and homelab builders; and I should click **Try it with sample data**. The adjacent result text is **“Opens an isolated sample bench and pull list.”** This passes the clarity gate.

At 390 px all four header links are complete 44px targets. The three facts are visible with the action: **“Inventory stays on this device.”**, **“The desktop app works offline.”**, and **“Free: 40 parts and two builds. Bench Pass: $12 once.”** Cold desktop and mobile consoles had no errors.

## Copy audit

Counts treat a URL, path, price, version, and hyphenated term as one word. This is a fresh audit of deployed landing text and current `README.md`. No sentence exceeds 22 words. No banned marketing adjective, unexplained jargon, inconsistent term, metaphor/mood heading, or non-result-naming product button was found; there is no copy finding or rewrite to make.

### Landing page sentences

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
| Checkout opens on an external site. | 6 |
| Download the unsigned installer for your computer. | 7 |
| Checking GitHub for the latest release. | 6 |
| Downloads open on GitHub. | 4 |
| Compare a project parts list with parts in your drawers. | 10 |
| Version 0.1.5. | 2 |
| The installer is unsigned. | 4 |
| Downloads from GitHub. | 3 |

The non-sentence labels also pass: **Desktop parts checker**, **Sample stock and project list**, **How it works**, **Bench Pass**, and **Desktop app** name their content. Result-naming actions are **Try it with sample data**, **Open the sample bench**, **Buy Bench Pass for $12**, and **See release downloads**. The first acronym use is **“parts list (BOM)”**. Terminology is consistent: part, bench stock, parts list/BOM, pull list, bin, shortage, and Bench Pass.

### README sentences

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
| Build the desktop app with `npm run build`. | 8 |
| Build the landing site with `npm run build:site`. | 8 |
| Run the browser checks with `npm run test:e2e`. | 8 |
| The desktop app keeps inventory and pull lists available without a network connection. | 13 |
| The web demo works offline after its first visit, including nested build routes. | 13 |
| Push a version tag such as `v0.1.5` to build installers for macOS, Windows, and Linux. | 16 |
| The release also publishes `SHA256SUMS` and `latest.json`. | 8 |
| Installers are unsigned. | 3 |
| The landing page checks GitHub for the latest release and keeps that result for one hour. | 16 |
| If that lookup fails, it links to the release page. | 10 |
| `/install.sh` and `/install.ps1` verify SHA-256 before installation. | 7 |
| The PowerShell path installs the published MSI with Windows Installer. | 10 |
| Deploy the static site with: | 5 |
| Core inventory use sends no data to third parties. | 9 |
| License verification sends only the saved token to Sociobot. | 9 |
| Substitute notes are planning prompts, not electrical advice; check ratings, pinouts, and fit. | 13 |
| See Privacy and Terms. | 4 |
| MIT. | 1 |
| See LICENSE. | 2 |

## Demo and sandbox

**PASS.** The landing action reaches `/demo/?demo=1` in one click. The first 390×844 demo screen has the persistent banner **“Demo — sample data, nothing is saved”**, **Reset demo**, and **Start for real**. It already shows **ESP32 DevKit** at y=574.6, **Pull 1 from A1** at y=598.6, and **2 short** at y=662.1.

A direct demo flow that opened the sample pull list and added/cancelled a BOM line made only same-origin requests and had no console error. `sample-demo` independently seeds real data, changes demo data and a demo license, tests Reset and Start for real, and confirms the real keys remain untouched while demo keys are discarded. `offline-reload` passes from a new context after service-worker control.

## Claims and clean-clone verification

`.factory/claims.json` has 24 entries. Each declared command was invoked separately from the clean clone and passed: `sample-demo`, `sample-content`, `record-bin-locations`, `bom-entry-notes`, `bom-file-import`, `stock-shortage-check`, `bom-allocation`, `csv-import-export`, `photo-limit`, `free-limits`, `paid-limits`, `license-daily`, `local-private`, `offline-reload`, `license-private`, `free-core-features`, `desktop-offline`, `price-copy`, `checkout-destination`, `installer-checksum`, `release-cache`, `unsigned-installers`, `release-artifacts`, and `planning-only`.

Every landing/README reliance statement maps to one or more of those entries: local storage/no tracking → `local-private`; offline use → `desktop-offline`/`offline-reload`; sample, stock, bin, CSV, and BOM workflows → `sample-content`, `record-bin-locations`, `csv-import-export`, `bom-file-import`, and `bom-entry-notes`; shortages and allocation → `stock-shortage-check`/`bom-allocation`; price and limits → `price-copy`, `free-limits`, `paid-limits`, and `free-core-features`; license privacy → `license-daily`/`license-private`; checkout → `checkout-destination`; release and installer text → `installer-checksum`, `release-cache`, `unsigned-installers`, and `release-artifacts`; and safety limits → `planning-only`. There is no unlisted claim.

| Check | Result |
| --- | --- |
| `npm test` | PASS — 12 tests |
| `npm run build` | PASS |
| `npm run build:site` | PASS |
| `npm run test:e2e` | PASS — 36 Chromium tests |

## Structure, accessibility, and links

**PASS.** Home, demo, Privacy, Terms, and unknown-path 404 have route-specific titles, one h1, one main landmark, plain meta descriptions, canonical URLs, Open Graph/Twitter metadata, favicon, and Apple-touch icon. The unknown path returns the styled **Page not found** page with HTTP 404. `robots.txt` and `sitemap.xml` return 200. Live responses include the CSP, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`, and `X-Frame-Options`.

Live 390px and desktop axe scans found zero serious or critical issues on home, demo, Privacy, Terms, and 404. Demo navigation moves focus to the new h1; browser Back restores the prior route and focuses its h1. Crawled demo deep links (`/demo/`, `/demo/builds`, `/demo/about`, the sample build, `/demo/privacy`, and `/demo/terms`) all return 200. The paper-cut workbench art, ink-and-paper palette, serif/monospace pairing, and pull-card layout match `.factory/design.md` and are distinct from a generic SaaS template.

## Earlier findings rechecked

Every prior review, polish document, and handoff was read. Each earlier finding was checked against live behavior, current source, and its regression test.

| Earlier ID | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: `sample-content` asserts three stock records and four BOM rows. |
| F-1-2 | Fixed: `record-bin-locations` proves a bin in stock and pull instructions. |
| F-1-3 | Fixed: `bom-entry-notes` proves pasted rows and notes persist. |
| F-1-4 | Fixed: visitor artwork-provenance copy is absent. |
| F-1-5 | Fixed: source identifies GitHub as external. |
| F-1-6 | Fixed: all four mobile header links fit. |
| F-1-7 | Fixed: all hero facts are in the cold mobile screen. |
| F-1-8 | Fixed: README has the plain desktop-app opening. |
| F-1-9 | Fixed: demo isolation/discard copy is short and split. |
| F-1-10 | Fixed: README has no QA-suite jargon. |
| F-1-11 | Fixed: release wording has no CORS jargon. |
| F-1-12 | Fixed: the workflow heading names the pull-list task. |
| F-1-13 | Fixed: the boundary heading is literal. |
| F-2-1 | Fixed: named sample data and result are above the demo fold. |
| F-2-2 | Fixed: a labelled BOM CSV-file chooser exists. |
| F-2-3 | Fixed: `stock-shortage-check` covers the central comparison. |
| F-2-4 | Fixed: README build-output claims were removed. |
| F-2-5 | Fixed: README suite-coverage claims were removed. |
| F-2-6 | Fixed: direct demo keeps `Demo — Bench Bin BOM`. |
| F-2-7 | Fixed: the 404 h1 is `Page not found`. |
| F-2-8 | Fixed: checkout and download disclose external destinations. |
| F-2-9 | Fixed: BOM expands to parts list on first use. |
| F-2-10 | Fixed: README says the app does not track use. |
| F-2-11 | Fixed: README has no WebView jargon. |
| F-2-12 | Fixed: README has no release-matrix jargon. |
| F-2-13 | Fixed: the generic workflow label is absent. |
| F-2-14 | Fixed: the vague boundary label is absent. |
| F-3-1 | Fixed: checkout says external site; redirect is tested. |
| F-3-2 | Fixed: the unsupported OS-prompt prediction is absent. |

## Missed leverage

No finding. There is no `.factory/brief.json` in this checkout to imply an additional capability. The useful deterministic extensions are present: CSV import/export, bin locations, substitute notes, computed pull list, and an isolated sample. An AI feature would be decorative for this deterministic comparison job. No runtime AI feature or provider key was found.

## What would make this perfect

Keep the direct sample URL, isolation, claim-to-test mapping, literal headings, and mobile first-screen checks current as the product changes. No product change is required from this review.

