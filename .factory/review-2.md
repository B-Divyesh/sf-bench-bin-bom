# Adversarial first-read review 2 — FAIL

Reviewed 2026-08-29 UTC against <https://bench-bin-bom.sociobot.in> from fresh
Chromium contexts at 390×844 and 1440×1000. The repository candidate is
`bbc89a11dbce7252ce59c46f8be905f774b0b5d0`; the live footer reports product
build `fa595ef4`.

## Verdict

**FAIL.** There are six blocking findings and nine minor findings. The cold
landing screen is clear, every registered claim test passes, and demo storage
is isolated. The review still fails because no realistic sample record appears
in the first mobile screen after entering the demo, a demo action promises a
file import that does not exist, three claim-like README/landing statements are
absent from the claim registry, and earlier finding F-1-10 remains half-fixed.

## Cold first read

Before scrolling, my answers were:

- **What does this do?** It compares parts on a workbench with the parts needed
  for a build, so shortages are visible before work starts.
- **For whom?** Makers and homelab builders.
- **What should I click first?** **Try it with sample data**. The adjacent text
  says it opens an isolated sample bench and pull list.

This passes at both widths. At 390×844, the complete header, headline,
audience sentence, primary action, action result, privacy fact, offline fact,
and price/limit fact are visible without scrolling. The last fact ends at
`y=599.4` in an 844 px viewport.

## Findings

### Blocking

#### F-2-1 — The first mobile demo screen does not show the sample data

- **Location / quote:** live `/demo/?demo=1` at 390×844, immediately after
  selecting **“Try it with sample data”**. The viewport shows the demo banner,
  app header, generic introduction, actions, and a decorative project-card
  illustration. The first real sample row, **“ESP32 DevKit”**, starts at
  `y=1019`; the stock panel starts at `y=929`.
- **Why:** The supplied demo contract requires the first post-click screen to
  already show the product being used with realistic sample data. A phone
  visitor sees only setup-like chrome and an illustration. The small “3” count
  in the header does not show what the sample contains or the result the tool
  produces. The current `@claim:sample-demo` assertion uses Playwright's
  `toBeVisible()`, which allows an element below the viewport and therefore
  misses this defect.
- **Concrete fix:** Make `/demo/?demo=1` open the sample weather-node pull list,
  or move a compact sample-stock/result panel above the decorative intro at
  390 px. Add a 390×844 test that asserts at least one named sample record and
  one useful result, such as a shortage or pull instruction, have bounding
  boxes inside the initial viewport.

#### F-2-2 — “Paste or import BOM” has no import control

- **Location / quote:** demo pull-list action **“Paste or import BOM”**. It opens
  **“Paste a BOM”** with one CSV textarea and no file input. Source:
  `src/main.ts:97,208-230`.
- **Why:** “Import” conventionally promises that a user can choose a file. The
  action only accepts pasted text. This is both a misleading result-naming
  button and missed leverage for a BOM tool whose users already have CSV files.
- **Concrete fix:** Add an accessible `.csv` file input that reads the selected
  file through the existing parser, while keeping paste as a fallback. Test a
  real fixture file in the isolated demo. If file import is intentionally out
  of scope, rename the action to **“Paste BOM rows”** everywhere.

#### F-2-3 — The core comparison claim is not registered

- **Location / quotes:** landing **“Check your parts before building”** and
  **“See stock, shortages, and duplicate demand”**; README: **“It checks a
  project BOM against parts already stored in bench drawers.”**
- **Why:** These are the product's central claim. `bom-allocation` proves a
  narrower allocation rule and does not list the hero or README opening in its
  `where` field. No claim entry expressly promises that recorded stock is
  compared with a project list and that shortages are shown.
- **Concrete fix:** Add a `stock-shortage-check` claim covering the hero,
  preview, and README. Its tagged test should create known stock and demand,
  then assert the ready quantity, pull location, and shortage shown to the
  user. Alternatively broaden `bom-allocation` and its `where` field so the
  registered wording exactly covers these sentences.

#### F-2-4 — Build-output statements are unlisted claims

- **Location / quotes:** README: **“npm run build writes the desktop WebView
  bundle to dist/.”** and **“npm run build:site writes the complete deployable
  site to dist/site/.”**
- **Why:** Both are observable promises in the audited README, but neither has
  a `.factory/claims.json` entry or a uniquely tagged claim test. Both commands
  passed during this review; that does not make the registry complete.
- **Concrete fix:** Register one build-output claim whose test runs both builds
  from a clean tree and asserts the stated artifacts, or replace these claims
  with command-only instructions and let the build output describe its target.

#### F-2-5 — The README's browser-suite coverage is an unlisted claim

- **Location / quotes:** README: **“The browser suite checks the public product
  on desktop and mobile.”** and **“It checks keyboard use, accessibility,
  privacy, offline reload, legal pages, demo isolation, response security, and
  each registered claim.”**
- **Why:** This is a detailed test-coverage promise with no matching claim
  entry/tag. The full suite passed in this review, but the claims registry does
  not require that coverage to stay true.
- **Concrete fix:** Prefer the direct instruction **“Run the browser checks
  with `npm run test:e2e`.”** If the coverage list must remain, register it and
  add one tagged meta-test that confirms the named checks and every registered
  claim tag are present and runnable.

#### F-1-10 — Prior README jargon finding is only half-fixed

- **Location / quote:** README: **“It checks keyboard use, accessibility,
  privacy, offline reload, legal pages, demo isolation, response security, and
  each registered claim.”**
- **Why:** Review 1 flagged unexplained test-internal jargon. The sentence is
  now under 22 words, but **“demo isolation,” “response security,”** and
  **“registered claim”** remain internal QA terms. The prior finding is
  therefore reopened with the same ID.
- **Concrete fix:** **“It checks keyboard use, accessibility, privacy, offline
  use, legal pages, and separation of demo data. It also checks web security
  rules and each documented product promise.”**

### Minor

#### F-2-6 — The demo route overwrites its required title

- **Location / quote:** live `/demo/?demo=1` ends with `<title>Bench stock —
  Bench Bin BOM</title>` although the static document starts with **“Demo —
  Bench Bin BOM.”** Source: `src/main.ts:112`.
- **Why:** The supplied site structure requires **“Demo — Product name”** for
  the demo route. The browser tab no longer identifies the sandbox after the
  app renders.
- **Concrete fix:** Use **“Demo — Bench Bin BOM”** for the demo inventory route.
  Keep specific titles such as **“Builds — Bench Bin BOM”** on nested routes and
  add a post-render title assertion.

#### F-2-7 — The 404 headline is a drawer metaphor

- **Location / quote:** live 404 and `site/404.html`: **“That page is not in
  this drawer.”**
- **Why:** The plain-words contract bans metaphor headings. In a heading list,
  this delays the literal fact that the page was not found.
- **Concrete fix:** Use **“Page not found”** as the h1. The following sentence
  can keep the instruction **“Check the address or return to the Bench Bin BOM
  home page.”**

#### F-2-8 — Two external actions are not labelled as external

- **Location / quotes:** landing **“Buy Bench Pass for $12”** links to
  `api.sociobot.in` and redirects to Dodo Checkout; **“Download for Linux”**
  links to a GitHub release asset. Neither visible label nor accessible name
  says that it leaves the site.
- **Why:** The supplied structure contract requires external links to say so.
  The source link follows this rule, but the paid and download actions do not.
- **Concrete fix:** Add adjacent plain text and accessible names such as
  **“Opens secure Sociobot checkout”** and **“Downloads from GitHub.”**

#### F-2-9 — “BOM” is not expanded on first use

- **Location / quotes:** landing **“The sample includes three stock items and a
  four-line weather-node BOM.”**; README **“It checks a project BOM against
  parts already stored in bench drawers.”**
- **Why:** “BOM” is domain shorthand. A cold reader can infer “parts list” from
  surrounding copy, but the page never confirms it.
- **Concrete fix:** Use **“The sample includes three stock items and a four-line
  weather-node parts list (BOM).”** On the README, use **“It checks a project
  parts list (BOM) against parts stored in your bench drawers.”**

#### F-2-10 — “Telemetry” is avoidable privacy jargon

- **Location / quote:** README: **“There is no analytics or telemetry.”**
- **Why:** “Telemetry” is implementation language, and “no analytics” is
  grammatically awkward. The reader needs the behavior, not two tracking terms.
- **Concrete fix:** **“The app does not track how you use it.”**

#### F-2-11 — “Desktop WebView bundle” is build-system jargon

- **Location / quote:** README: **“npm run build writes the desktop WebView
  bundle to dist/.”**
- **Why:** “WebView bundle” is not needed to locate the result and makes the
  build instruction harder to scan.
- **Concrete fix:** **“`npm run build` writes the desktop app files to
  `dist/`.”**

#### F-2-12 — “Tauri release matrix” is unexplained release jargon

- **Location / quote:** README: **“Push a v* tag to run the Tauri release
  matrix for macOS arm64/x64, Windows, and Linux.”**
- **Why:** “v* tag” and “release matrix” describe CI internals rather than the
  result. “Tauri” is not explained in the README.
- **Concrete fix:** **“Push a version tag such as `v0.1.3` to build installers
  for macOS, Windows, and Linux.”**

#### F-2-13 — “Try the real workflow” is a generic decorative label

- **Location / quote:** landing label above the product preview: **“Try the real
  workflow.”**
- **Why:** It could appear unchanged on any product and does not name what the
  section contains.
- **Concrete fix:** Replace it with **“Sample stock and project list”** or remove
  it because the following heading already names the content.

#### F-2-14 — “Clear boundaries” is a vague decorative label

- **Location / quote:** landing label above the limitation section: **“Clear
  boundaries.”**
- **Why:** It carries no product-specific information and duplicates the clear
  h2 below it.
- **Concrete fix:** Remove it, or use the literal label **“Limits.”**

## Copy audit

Counts use whitespace-separated words; a URL, path, price, or hyphenated term
counts as one word. No audited sentence exceeds 22 words, and no banned
marketing adjective appears.

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
| The sample includes three stock items and a four-line weather-node BOM. | 11 |
| Add quantities and bin locations, or import CSV. | 8 |
| Paste the BOM and keep substitute notes beside each line. | 10 |
| Each physical part is allocated once across the BOM. | 9 |
| Bench Bin BOM does not order parts or confirm electrical compatibility. | 11 |
| Check substitutions, ratings, pinouts, and fit yourself. | 7 |
| The free app holds 40 stock parts and two builds. | 10 |
| Bench Pass removes those limits. | 5 |
| CSV export, accessibility, and safety notes stay free. | 8 |
| Download the unsigned installer for your computer. | 7 |
| Your operating system may ask you to confirm it. | 9 |
| Finding the latest release… | 4 |
| Compare a project BOM with parts in your drawers. | 9 |
| Version 0.1.2. | 2 |
| The installer is unsigned. | 4 |

### README sentences

| Sentence | Words |
| --- | ---: |
| Bench Bin BOM is a desktop app for makers and homelab builders. | 12 |
| It checks a project BOM against parts already stored in bench drawers. | 12 |
| Stock, projects, optional photos, and license details use local app storage. | 11 |
| There is no analytics or telemetry. | 6 |
| CSV import and export keep the stock list portable. | 9 |
| Each physical part is allocated once across duplicate BOM rows. | 10 |
| Try the isolated sample at https://bench-bin-bom.sociobot.in/demo/?demo=1. | 6 |
| The demo uses separate storage and never reads real data. | 10 |
| It is discarded when you leave or select Start for real. | 11 |
| Free mode supports 40 stock parts and two builds. | 9 |
| Bench Pass costs US$12 once and removes those record limits. | 10 |
| It does not gate CSV export, accessibility, or safety notes. | 10 |
| The app reuses a verified license result for one day. | 10 |
| npm run build writes the desktop WebView bundle to dist/. | 10 |
| npm run build:site writes the complete deployable site to dist/site/. | 11 |
| The browser suite checks the public product on desktop and mobile. | 11 |
| It checks keyboard use, accessibility, privacy, offline reload, legal pages, demo isolation, response security, and each registered claim. | 18 |
| The desktop app keeps inventory and pull lists available without a network connection. | 13 |
| The web demo works offline after its first visit, including nested build routes. | 13 |
| Push a v* tag to run the Tauri release matrix for macOS arm64/x64, Windows, and Linux. | 16 |
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

### Headings, labels, actions, and terminology

- The landing h1 has five words, starts with a verb, and names the job.
- Landing h2s name the preview, workflow, limitation, price, and install
  sections. The two non-heading labels in F-2-13 and F-2-14 do not add useful
  information.
- README headings — **Price and limits**, **Run and verify**, **Package and
  deploy**, **Privacy and safety**, and **License** — make sense in isolation.
- Landing result actions pass: **Try it with sample data**, **Open the sample
  bench**, **Buy Bench Pass for $12**, and **Download for Linux**. F-2-8 covers
  the missing external-destination disclosure. The demo action in F-2-2 does
  not deliver its named import result.
- Terms are otherwise consistent: physical inventory is a **part**, storage is
  a **bin**, project requirements are a **BOM**, the checked result is a **pull
  list**, missing quantity is a **shortage**, and the paid license is **Bench
  Pass**. F-2-9 covers the undefined first use of BOM.

## Claim verification

Every command in `.factory/claims.json` was run separately from clean clone
`/tmp/bench-review2-clean.UhvxO0`. Results:

| Claim ID | Result |
| --- | --- |
| `sample-demo` | PASS |
| `sample-content` | PASS |
| `record-bin-locations` | PASS |
| `bom-entry-notes` | PASS |
| `bom-allocation` | PASS |
| `csv-import-export` | PASS |
| `photo-limit` | PASS |
| `free-limits` | PASS |
| `paid-limits` | PASS |
| `license-daily` | PASS |
| `local-private` | PASS |
| `offline-reload` | PASS |
| `license-private` | PASS |
| `free-core-features` | PASS |
| `desktop-offline` | PASS |
| `price-copy` | PASS |
| `installer-checksum` | PASS |
| `release-cache` | PASS |
| `unsigned-installers` | PASS |
| `release-artifacts` | PASS |
| `planning-only` | PASS |

The registered result is **21/21 PASS**. F-2-3 through F-2-5 list the
claim-like copy that has no registry coverage. Therefore the overall claims
audit is not complete even though every listed test passes.

## Demo and sandbox evidence

- The primary landing action reaches `/demo/?demo=1` in one click.
- The persistent banner says **“Demo — sample data, nothing is saved”** and
  includes **Reset demo** and **Start for real**.
- The sample contains three stock records and a four-line **Workshop weather
  node** BOM with realistic quantities, bin locations, a substitute, and a
  duplicate-demand shortage.
- A seeded real key containing **Private real part** remained byte-for-byte
  unchanged while a demo-only **Reset probe** was created.
- **Reset demo** removed the probe and restored three sample records.
- **Start for real** removed both demo local/session keys and preserved the real
  key.
- A fresh direct-demo request log contained only the document and three
  same-origin assets. There were no third-party requests.
- After service-worker control, `/demo/builds` reloaded offline with **Your
  builds** and **Workshop weather node** present. The request log had no failed
  requests.
- F-2-1 remains blocking because none of that realistic data is in the initial
  mobile viewport.

## Earlier findings checked from scratch

| Earlier ID | Live and code result |
| --- | --- |
| F-1-1 | Fixed: `sample-content` exists; live demo has exactly 3 stock rows and 4 BOM rows. |
| F-1-2 | Fixed: `record-bin-locations` exists; source and test cover bin D7 in stock and pull output. |
| F-1-3 | Fixed: `bom-entry-notes` exists; paste, persistence, substitute, and note are tested. |
| F-1-4 | Fixed: no landing `figcaption`; provenance remains only in the design record. |
| F-1-5 | Fixed for the cited source link: visible and accessible names identify GitHub as external. F-2-8 covers other external actions. |
| F-1-6 | Fixed: all four mobile nav targets are fully inside 390 px and are 44 px high. |
| F-1-7 | Fixed: the last required fact ends at y=599.4 in the 844 px first screen. |
| F-1-8 | Fixed: the README opening says “desktop app,” not Tauri. |
| F-1-9 | Fixed: demo isolation and discard behavior are two sentences of 10 and 11 words. |
| F-1-10 | **Half-fixed and reopened:** length passes, but replacement QA jargon remains. |
| F-1-11 | Fixed: the release sentence describes the useful one-hour behavior without CORS jargon. |
| F-1-12 | Fixed: h2 is “How to create a pull list from your parts.” |
| F-1-13 | Fixed: h2 is “What Bench Bin BOM does not check.” |

## Structure, routing, accessibility, and links

- `/`, `/demo/?demo=1`, `/demo/builds`, the sample build deep link,
  `/privacy/`, and `/terms/` returned 200. An unknown path returned the styled
  404 with HTTP 404.
- Home, Privacy, Terms, demo routes, and the 404 each have `lang="en"`, one h1,
  a main landmark, a description, canonical link, OG/Twitter metadata, product
  art, favicon, and 180×180 apple-touch icon. The social image is 1200×630.
- F-2-6 covers the wrong post-render demo title. F-2-7 covers the metaphorical
  404 h1.
- Demo deep links load directly. Back navigation from the sample build restored
  `/demo/builds`, focused **Your builds**, and set **Builds — Bench Bin BOM**.
- All crawled internal routes/assets returned their expected status. GitHub
  source/releases and the checkout endpoint resolved; no dead link was found.
- Header/footer navigation is consistent and every route exposes Privacy and
  Terms. F-2-8 covers external-destination labels.
- Live Playwright axe scans found zero violations on Home, Demo, Privacy, and
  Terms. `verify-url.sh` reported one h1, `lang`, main, alt text, labelled
  controls, and no console errors. The full local suite covers focus, keyboard,
  reduced motion, 200% text, and 390 px targets.
- The paper-cut workbench palette, serif/monospace pairing, square shadows,
  generated drawer art, and pull-card UI are product-specific rather than a
  generic centered SaaS template.
- The landing JavaScript is 0.91 kB gzip and demo JavaScript is 8.89 kB gzip,
  both well below the supplied limit.

## Other verification

- `npm test`: 12/12 passed.
- `npm run build`: passed and produced `dist/`.
- `npm run build:site`: passed and produced `dist/site/`.
- `npm run test:e2e`: 33/33 passed from the clean clone.
- Browser console and page-error logs were empty on cold home and demo flows.

## Missed leverage

F-2-2 is the missed-leverage finding: direct BOM file import is the obvious
next step already implied by the action label. Stock CSV export and paste-based
stock/BOM entry already exist. Cloud sync would conflict with the local-first
privacy position unless explicitly optional. An AI step is not expected for
deterministic quantity matching; adding one would be decorative unless a later
scope calls for opt-in extraction from unstructured documents through the
Sociobot gateway. No provider key or decorative AI feature is present.

## What would make this perfect

Put named sample records and a computed pull/shortage result in the first 390 px
demo viewport; either implement real CSV file import or stop promising it;
register or remove every unlisted claim; remove the remaining QA and build
jargon; restore the required demo title; replace the 404 metaphor; label every
external destination; define BOM on first use; and remove the two decorative
landing labels. Add regression assertions for the mobile demo viewport, the
demo title after render, claim-registry coverage, and file selection. A new
review should then rerun the full checklist from a fresh context and clean
clone.
