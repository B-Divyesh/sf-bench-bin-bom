# Polish round 1 — finding closure

Candidate `27b544eaf3164cbd5aedb8f9bb6381a3f079857f` was repaired in product commit `fdcd884f2182cee4275d7a6797daa2ab9462f6bf`. I read every matching history file; `.factory/review-1.md` is the only `review-*.md`, and no earlier `polish-*.md` existed.

## Finding map

| Finding | Change made | Automated evidence | Screenshot | Cold live evidence |
| --- | --- | --- | --- | --- |
| F-1-1 | Registered `sample-content` and asserted exactly three stock rows and four BOM rows from the isolated demo. | `@claim:sample-content the isolated demo has exactly three stock records and four BOM rows` | [demo](evidence/polish-1-demo.png) | [demo query](https://bench-bin-bom.sociobot.in/demo/?demo=1): 3 stock rows and 4 BOM rows |
| F-1-2 | Registered `record-bin-locations`; the test creates bin D7 and proves it appears in stock and the pull instruction. | `@claim:record-bin-locations a saved bin appears in stock and in its pull instruction` | [demo](evidence/polish-1-demo.png) | [demo query](https://bench-bin-bom.sociobot.in/demo/?demo=1): live probe showed `PULL: 2 from D7` |
| F-1-3 | Registered `bom-entry-notes`; the test pastes a BOM line with substitute/build notes and proves both survive reload. | `@claim:bom-entry-notes pasted BOM substitute notes persist beside the saved line` | [demo](evidence/polish-1-demo.png) | [demo query](https://bench-bin-bom.sociobot.in/demo/?demo=1): pasted notes remained after a live reload |
| F-1-4 | Removed the provenance caption from visitor copy; provenance remains in `.factory/design.md`. | `reviewed landing and README copy stays plain and self-explanatory` asserts zero `figcaption` elements | [mobile first screen](evidence/polish-1-mobile-first-screen.png) | [home](https://bench-bin-bom.sociobot.in/): no provenance caption |
| F-1-5 | Renamed Source to “View source on GitHub (external)” and added the full accessible name. | `public navigation, legal links, titles, focus, and 404 remain real routes` | [home verification](evidence/live-home/screenshot-desktop.png) | [home](https://bench-bin-bom.sociobot.in/): accessible external label present |
| F-1-6 | Replaced horizontal-scroll navigation with a four-column mobile grid and shorter destination labels. | `390 px landing keeps complete navigation and all first-screen facts in view` checks every nav box is inside 390 px and at least 44 px tall | [390×844 first screen](evidence/polish-1-mobile-first-screen.png) | [home](https://bench-bin-bom.sociobot.in/): Demo, Steps, Install, and Privacy fully visible |
| F-1-7 | Shortened first-screen copy and tightened mobile type/spacing while retaining the paper-cut design. | `390 px landing keeps complete navigation and all first-screen facts in view` checks the price fact ends above 844 px | [390×844 first screen](evidence/polish-1-mobile-first-screen.png) | [home](https://bench-bin-bom.sociobot.in/): all three facts visible before scrolling |
| F-1-8 | Rewrote the README opening as a plain desktop-app job statement; Tauri remains only in developer/release context. | `reviewed landing and README copy stays plain and self-explanatory` | [home verification](evidence/live-home/screenshot-desktop.png) | [README](https://github.com/B-Divyesh/sf-bench-bin-bom#readme): opening names the job and audience |
| F-1-9 | Split the demo isolation/discard wording into two short sentences. | `reviewed landing and README copy stays plain and self-explanatory`; `.factory/copy-audit.md` records 10- and 11-word sentences | [demo](evidence/polish-1-demo.png) | [demo query](https://bench-bin-bom.sociobot.in/demo/?demo=1): banner, Reset demo, and Start for real verified |
| F-1-10 | Replaced the overlong jargon list with two short sentences using “accessibility” and “registered claim.” | `reviewed landing and README copy stays plain and self-explanatory`; copy audit maximum is 18 words | [home verification](evidence/live-home/screenshot-desktop.png) | [home](https://bench-bin-bom.sociobot.in/): related browser checks passed live |
| F-1-11 | Replaced CORS jargon with the useful one-hour GitHub release-result behavior. | `@claim:release-cache landing release lookup uses its one-hour cache and calm fallback` plus the reviewed-copy test | [home verification](evidence/live-home/screenshot-desktop.png) | [home](https://bench-bin-bom.sociobot.in/): v0.1.2 release resolved without console errors |
| F-1-12 | Renamed the walkthrough heading to “How to create a pull list from your parts.” | `reviewed landing and README copy stays plain and self-explanatory` | [home verification](evidence/live-home/screenshot-desktop.png) | [home](https://bench-bin-bom.sociobot.in/): exact heading present |
| F-1-13 | Renamed the boundary heading to “What Bench Bin BOM does not check.” | `reviewed landing and README copy stays plain and self-explanatory` | [home verification](evidence/live-home/screenshot-desktop.png) | [home](https://bench-bin-bom.sociobot.in/): exact heading present |

## Cumulative regression evidence

- The registry now has 21 claims, and every `@claim:<id>` tag appears exactly once.
- From clean clone `/tmp/bench-bin-polish-clean-HtUCJc` at `fdcd884f`, all 21 declared claim commands passed separately.
- That clean clone also passed 12 unit tests, lint, both production builds, 32 browser tests, and `cargo check --locked`.
- The added copy-regression test passed at `abafb2e`; the final full suite has 33 browser tests.
- Local and live axe CLI runs found 0 violations on home and demo. The Playwright suite also checks keyboard focus, dialogs, 200% text, reduced motion, and serious/critical axe findings.
- Live demo request logging found same-origin requests only. Offline reload of the nested Builds route passed.
- Live route checks returned 200 for home, demo, Privacy, and Terms; an unknown path returned 404 with the designed page.
- Live Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- The deployed `index.html` and hashed landing JavaScript exactly matched `dist/site` by SHA-256.

## Deployment

Static deployment `f672543a-49ad-4e39-b2ab-167d85180cbb` succeeded. The live footer reported product build `fdcd884f`. Cold checks used fresh Chromium storage at 390×844 and the exact URL <https://bench-bin-bom.sociobot.in/demo/?demo=1>.

All F-1-1 through F-1-13 are resolved. No severity remains open.
