# Adversarial first-read review 1 — FAIL

Reviewed 2026-08-29 UTC against <https://bench-bin-bom.sociobot.in> from fresh Chromium contexts at 390×844 and 1440×1000, plus the clean checkout at `c870cd0f0bb7627bebbf9a7cb6f326ec569ab208`.

## Verdict

**FAIL.** The core job, demo, accessibility smoke checks, routes, and declared claim tests pass. The review cannot pass while live claim-like copy has no matching `claims.json` entry/test, the 390 px header initially clips the Privacy link, and the required plain-language copy audit still has the defects below. No product code was changed in this review.

## Cold first read

Before scrolling, I understood the product as: a tool that compares the parts I have with a build list, for makers and homelab builders, so I can find shortages before starting. I would first click **“Try it with sample data”**, because the adjacent text says **“Opens a sample bench and pull list in your browser.”**

This passes the initial clarity gate on desktop and 390 px: headline, audience, primary action, and outcome are all visible. The mobile screen does not show all three required fact lines without scrolling; the price fact is cut off at the bottom (F-1-7).

## Findings

### Blocking

#### F-1-1 — Exact sample-content claim is not registered or tested

- **Location / quote:** landing preview, `site/index.html:59`: “The sample includes three stock items and a four-line weather-node BOM.”
- **Why:** This is a quantitative statement a visitor can rely on, but `.factory/claims.json` has no entry for the exact three-item/four-line sample. `@claim:sample-demo` checks that the demo exists and displays an ESP32; it does not assert these counts.
- **Concrete fix:** Add a `sample-content` claim and tagged test that opens `/demo/` from a fresh context and asserts exactly three stock records and four BOM rows, or change the sentence to a non-quantitative description that the existing demo claim proves.

#### F-1-2 — Bin-location workflow claim is not registered or tested

- **Location / quote:** landing walkthrough, `site/index.html:67`: “Add quantities and bin locations, or import CSV.”
- **Why:** CSV import is covered by `csv-import-export`, but recording and displaying bin locations is a separate promised workflow with no registry entry or observable claim test.
- **Concrete fix:** Add a `record-bin-locations` claim test that creates a part with a bin and confirms that bin appears in the stock and pull-list UI; otherwise reduce this sentence to the registered CSV promise.

#### F-1-3 — Build-entry and substitute-notes claim is not registered or tested

- **Location / quote:** landing walkthrough, `site/index.html:68`: “Paste the BOM and keep substitute notes beside each line.”
- **Why:** The claim registry tests allocation, but it does not prove that a pasted BOM or per-line substitute note is retained and shown. A first-time visitor could reasonably rely on both capabilities.
- **Concrete fix:** Add a `bom-entry-notes` claim and clean-demo test that pastes representative BOM data, saves a substitute note, reloads, and asserts both are visible; or remove the unsupported promise.

#### F-1-4 — Illustration-origin claim is neither testable nor useful landing copy

- **Location / quote:** landing figure caption, `site/index.html:52`: “Original generated illustration made for Bench Bin BOM.”
- **Why:** This provenance claim has no registry entry/test, and it does not tell a visitor how to use the product. The required design provenance belongs in the repository design record, not in the first-read landing flow.
- **Concrete fix:** Remove the caption, or replace it with useful artwork alt/caption copy such as “Sample bench and project pull list.” Do not add an unverifiable marketing-origin claim.

### Minor

#### F-1-5 — The external source link is not labelled as external

- **Location / quote:** landing footer, `site/index.html:101`: “Source” links to `github.com`.
- **Why:** A visitor cannot tell that this leaves the product site. The site-structure requirement says external links say so.
- **Concrete fix:** Rename it to “View source on GitHub (opens external site)” and provide the same information in the accessible name.

#### F-1-6 — Mobile header initially clips the Privacy navigation action

- **Location / evidence:** 390 px live header. The `Privacy` link begins at x=333.7 px and ends at x=421.3 px in a 390 px viewport; only “Pri” is initially visible. The nav is horizontally scrollable but gives no visible overflow cue.
- **Why:** Privacy is a required, primary navigation destination. A phone visitor can miss it even though the control remains reachable after an undiscoverable horizontal scroll.
- **Concrete fix:** Use a wrapping or menu navigation pattern at 390 px, or reduce/redistribute the four links so each complete 44 px target is visible initially.

#### F-1-7 — The third required hero fact is below the 390 px first screen

- **Location / evidence:** 390×844 cold screen. The hero action ends at y=645 px; the final fact, “Free for 40 parts and two builds. Bench Pass costs $12 once.”, extends below the viewport.
- **Why:** The required first-screen privacy, offline, and price facts are not all available before a mobile visitor scrolls.
- **Concrete fix:** Reduce the mobile hero type/spacing or compact the fact treatment so the full price line is visible with the headline, audience, and primary action.

#### F-1-8 — README uses unexplained framework jargon in its opening description

- **Location / quote:** `README.md:3`: “Bench Bin BOM is a Tauri desktop app for makers and homelab builders.”
- **Why:** “Tauri” does not help a maker decide what the tool does; it is an implementation detail on the most important README line.
- **Concrete fix:** “Bench Bin BOM is a desktop app for makers and homelab builders that checks a project parts list against parts in their drawers.” Put the Tauri implementation detail in a later developer section if needed.

#### F-1-9 — README demo sentence exceeds the 22-word maximum

- **Location / quote:** `README.md:10-12`, **25 words**: “It uses separate demo storage, never reads real app data, and is discarded when you leave by browser navigation, tab close, or Start for real.”
- **Why:** It combines storage isolation, read isolation, and three exit mechanisms. The long sentence is harder to verify on a first read.
- **Concrete fix:** “The demo uses separate storage and never reads real data. It is discarded when you leave or select Start for real.”

#### F-1-10 — README test-coverage sentence exceeds the 22-word maximum and uses internal jargon

- **Location / quote:** `README.md:35-37`, **27 words**: “The browser suite covers desktop, 390 px mobile, keyboard focus, axe, privacy, offline reload, response policy, legal routes, demo isolation, and every claim in the claim registry.”
- **Why:** “axe”, “response policy”, and “claim registry” are unexplained implementation terms, and the sentence is too long.
- **Concrete fix:** Split it into a short introduction followed by a bulleted list. For example: “The browser suite checks the public product on desktop and mobile. It checks keyboard use, accessibility, privacy, offline reload, legal pages, demo isolation, and each registered claim.”

#### F-1-11 — README uses CORS jargon that does not help the reader

- **Location / quote:** `README.md:49-50`: “The landing page reads the CORS-enabled GitHub Releases API and caches release metadata for one hour.”
- **Why:** “CORS-enabled” explains an implementation constraint rather than a useful outcome for a maker or installer.
- **Concrete fix:** “The landing page checks GitHub for the latest release and keeps that result for one hour.” The `release-cache` claim already covers the useful behavior.

#### F-1-12 — A landing heading is not self-explanatory out of context

- **Location / quote:** `site/index.html:65`: “Move from drawers to a pull list.”
- **Why:** This is a process metaphor, not a section name. In a screen-reader heading list, it does not explain that the section teaches the workflow.
- **Concrete fix:** Rename it “How to create a pull list from your parts.”

#### F-1-13 — The limitation heading has an unclear pronoun and fragment structure

- **Location / quote:** `site/index.html:75`: “It plans. You verify the hardware.”
- **Why:** “It” has no standalone referent in a heading list, and the two fragments make the product boundary less scannable.
- **Concrete fix:** Rename it “What Bench Bin BOM does not check.” Keep the following concrete boundary paragraph.

## Copy audit

Counts treat hyphenated terms and prices as one word. Headings, buttons, labels, navigation, and code samples are reviewed separately; the following table lists every complete sentence visible on the landing and every prose sentence in the README.

### Landing sentences

| Sentence | Words |
| --- | ---: |
| Opens a sample bench and pull list in your browser. | 10 |
| Your inventory stays on this device. | 6 |
| The desktop app works without an internet connection. | 8 |
| Free for 40 parts and two builds. | 7 |
| Bench Pass costs $12 once. | 5 |
| Original generated illustration made for Bench Bin BOM. | 8 |
| The sample includes three stock items and a four-line weather-node BOM. | 11 |
| Add quantities and bin locations, or import CSV. | 8 |
| Paste the BOM and keep substitute notes beside each line. | 10 |
| Each physical part is allocated once across the BOM. | 9 |
| It plans. | 2 |
| You verify the hardware. | 4 |
| Bench Bin BOM does not order parts or confirm electrical compatibility. | 11 |
| Check substitutions, ratings, pinouts, and fit yourself. | 7 |
| The free app holds 40 stock parts and two builds. | 10 |
| Bench Pass removes those limits. | 5 |
| CSV export, accessibility, and safety notes stay free. | 8 |
| Download the unsigned installer for your computer. | 7 |
| Your operating system may ask you to confirm it. | 9 |
| Finding the latest release… | 4 |
| Compare a project BOM with parts in your drawers. | 9 |
| Version 0.1.2. | 4 |
| The installer is unsigned. | 4 |

No landing sentence exceeds 22 words. The non-sentence headings/actions that need copy changes are recorded in F-1-5 and F-1-12 through F-1-13. “BOM” is used consistently for the project parts list, “part” for stock, “bin” for location, “pull list” for the checked list, and “Bench Pass” for the paid license.

### README sentences

| Sentence | Words |
| --- | ---: |
| Bench Bin BOM is a Tauri desktop app for makers and homelab builders. | 13 |
| It compares a project BOM with parts already stored in bench drawers. | 12 |
| Stock, projects, optional photos, and license details use local app storage. | 11 |
| There is no analytics or telemetry. | 6 |
| CSV import and export keep the stock list portable. | 9 |
| Each physical part is allocated once across duplicate BOM rows. | 10 |
| Try the isolated sample at https://bench-bin-bom.sociobot.in/demo/. | 9 |
| It uses separate demo storage, never reads real app data, and is discarded when you leave by browser navigation, tab close, or Start for real. | 25 |
| Free mode supports 40 stock parts and two builds. | 9 |
| Bench Pass costs US$12 once and removes those record limits. | 11 |
| It does not gate CSV export, accessibility, or safety notes. | 10 |
| The app reuses a verified license result for one day. | 10 |
| npm run build writes the desktop WebView bundle to dist/. | 10 |
| npm run build:site writes the complete deployable site to dist/site/. | 11 |
| The browser suite covers desktop, 390 px mobile, keyboard focus, axe, privacy, offline reload, response policy, legal routes, demo isolation, and every claim in the claim registry. | 27 |
| The desktop app keeps inventory and pull lists available without a network connection. | 13 |
| The web demo works offline after its first visit, including nested build routes. | 13 |
| Push a v* tag to run the Tauri release matrix for macOS arm64/x64, Windows, and Linux. | 16 |
| The release also publishes SHA256SUMS and latest.json. | 8 |
| Installers are unsigned, so macOS and Windows may ask for confirmation. | 11 |
| The landing page reads the CORS-enabled GitHub Releases API and caches release metadata for one hour. | 16 |
| If that lookup fails, it links to the release page. | 10 |
| /install.sh and /install.ps1 verify SHA-256 before installation. | 9 |
| The PowerShell path installs the published MSI with Windows Installer. | 10 |
| Deploy the static site with: | 5 |
| Core inventory use sends no data to third parties. | 9 |
| License verification sends only the saved token to Sociobot. | 9 |
| Substitute notes are planning prompts, not electrical advice; check ratings, pinouts, and fit. | 13 |
| See Privacy and Terms. | 4 |
| MIT. | 1 |
| See LICENSE. | 2 |

The two over-limit sentences are F-1-9 and F-1-10. The opening framework jargon is F-1-8; CORS jargon is F-1-11. No banned marketing adjectives were found.

## Demo, sandbox, and privacy checks

- **One-click demo:** PASS. The initial CTA opens `/demo/` in one click. The first app screen already contains realistic sample records including `ESP32 DevKit` and `M3 screw` rather than an empty shell.
- **Banner and reset:** PASS. The persistent banner says “Demo — sample data, nothing is saved,” provides **Reset demo** and **Start for real**, and the full browser suite verifies both reset and exit cleanup.
- **Isolation:** PASS. `@claim:sample-demo` seeds real storage, edits demo storage and a demo license, then uses browser Back and Start for real. It confirms real keys remain unchanged and `demo:bench-bin-bom:v1` / demo license keys are removed. The live direct `/demo/` context showed no real-data record.
- **Privacy / offline:** PASS for the registered statements. A fresh live demo flow recorded requests only to `bench-bin-bom.sociobot.in`; no third-party, analytics, or telemetry request appeared. A cold landing additionally requests the documented GitHub Releases API for download metadata. `@claim:offline-reload` reloads `/demo/builds` offline after service-worker control and finds the sample build.

## Claims and local verification

`.factory/claims.json` contains 18 entries. From this clean checkout after `npm ci`, I invoked every declared command in registry order; each passed. The complete suite also passed and exercised all 18 `@claim:` tests.

| Check | Result |
| --- | --- |
| 18 declared claim commands | PASS |
| `npm test` | PASS — 12 tests |
| `npm run lint` | PASS |
| `npm run build` | PASS — `dist/` produced |
| `npm run build:site` | PASS — `dist/site/` produced |
| `npm run test:e2e` | PASS — 27 Chromium tests |

No declared claim test failed. F-1-1 through F-1-4 are unlisted-claim findings, not failed registered tests.

## Structure and route checks

- **Metadata and skeleton:** PASS. Public routes use route-specific titles in the required pattern, one H1, `main`, descriptions, canonical/OG/Twitter metadata, favicon and Apple touch icon. The 404 is styled and returns HTTP 404 with a return-home action.
- **Routing:** PASS. `/`, `/demo/`, `/demo/builds`, `/privacy/`, `/terms/`, and static assets return 200; an unknown route returns 404. From the demo, navigating to Builds focused its H1 and set `Builds — Bench Bin BOM`; browser Back restored `/demo/` and focused its H1.
- **Links:** PASS except F-1-5. Internal links and the external checkout/repository targets responded successfully (checkout 303 to the hosted payment page; repository 200).
- **Visual identity:** PASS. The live paper-cut workbench treatment matches `.factory/design.md` and is distinct from a generic SaaS card/gradient template.
- **Console / responsive smoke:** PASS. No console/page errors and no document horizontal overflow in fresh desktop or 390 px contexts. F-1-6 is a navigation discoverability defect within a non-overflowing horizontally scrollable nav.

## History re-check

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. I read all earlier verifier reports and the prior handoff. Their former blockers were independently rechecked in current live code/tests: claim registry, one-click isolated demo, duplicate-BOM allocation, cancel behavior, quoted/validated CSV, photo limit, legal routes/404, complete site artifact, PowerShell checksum path, mobile app navigation, paid limit wording, offline nested reload, demo cleanup on Back, release manifest targets, and planning/electrical boundary. The current live tests and route checks confirm those earlier findings are fixed; none is repeated here.

## Missed leverage

No additional AI, sync, or import/export feature is required by the available product context. CSV import/export and the useful pull-list workflow are present. `.factory/brief.json` is not present, so there is no further researched feature requirement to verify. No runtime AI feature or embedded provider key was found.

## What would make this perfect

Register and test every remaining user-relevant landing claim (or remove it), make all header navigation visible at 390 px, keep all three hero facts within the initial mobile viewport, and apply the exact plain-language rewrites above. Then rerun this full review from a fresh browser context and clean checkout.
