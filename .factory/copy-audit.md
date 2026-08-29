# Copy audit — polish round 1

Audited 2026-08-29. Counts treat hyphenated terms, URLs, and prices as one word. No sentence exceeds 22 words. No banned marketing word appears. Headings, actions, and navigation labels were also read out of context; each names its destination or result.

## Landing page

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
| The installer is unsigned. | 4 |

## README

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
| /install.sh and /install.ps1 verify SHA-256 before installation. | 9 |
| The PowerShell path installs the published MSI with Windows Installer. | 10 |
| Deploy the static site with: | 5 |
| Core inventory use sends no data to third parties. | 9 |
| License verification sends only the saved token to Sociobot. | 9 |
| Substitute notes are planning prompts, not electrical advice; check ratings, pinouts, and fit. | 13 |
| See Privacy and Terms. | 4 |
| MIT. | 1 |
| See LICENSE. | 2 |

## Terminology

| Concept | One term used |
| --- | --- |
| Physical inventory item | part |
| Stored inventory list | bench stock |
| Project requirements | BOM |
| Checked project list | pull list |
| Paid license | Bench Pass |
| Storage location | bin |
| Missing quantity | shortage |

The first screen reads aloud in one breath: check parts before building, for makers and homelab builders, then try isolated sample data.
