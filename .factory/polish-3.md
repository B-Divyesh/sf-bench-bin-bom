# Polish round 3 — complete cumulative closure

Candidate `735ffeaa6ec51743541543bb4adadd9530d86afe` and the adversarial review
at `59578ec1619f047cfbdf0ffc37abb53a3237524c` were repaired in product commits
`c865d1529bd26e76855c3dc513705d8f2b759d5f` and
`8dcff4471ccd6515b04cbf188106d7db59ac2d15` (v0.1.5). This pass reread
`.factory/review-1.md`, `.factory/review-2.md`, `.factory/review-3.md`,
`.factory/polish-1.md`, and `.factory/polish-2.md`.

Live product: <https://bench-bin-bom.sociobot.in>  
Direct isolated demo: <https://bench-bin-bom.sociobot.in/demo/?demo=1>

## Finding map

| Finding | Change retained or made | Automated evidence | Screenshot and live check |
| --- | --- | --- | --- |
| F-1-1 | The exact three-part, four-line sample is registered. | `@claim:sample-content` | `evidence/polish-3/live-cold-demo-390.png`; direct demo passed. |
| F-1-2 | Bin capture and pull instructions remain covered. | `@claim:record-bin-locations` | `evidence/polish-3/live-cold-demo-390.png`; direct demo shows a pull bin. |
| F-1-3 | Pasted BOM rows and substitute notes persist. | `@claim:bom-entry-notes` | `evidence/polish-3/live-cold-demo-390.png`; direct demo remains usable. |
| F-1-4 | Visitor-facing artwork provenance remains removed. | `reviewed landing and README copy stays plain and self-explanatory` | `evidence/polish-3/live-home-390.png`; home has no provenance caption. |
| F-1-5 | The source link names GitHub and says it is external. | `public navigation, legal links, titles, focus, and 404 remain real routes` | `evidence/polish-3/live-home-390.png`; home footer passed. |
| F-1-6 | The four landing links stay fully visible at 390 px. | `390 px landing keeps complete navigation and all first-screen facts in view` | `evidence/polish-3/live-home-390.png`; cold mobile home passed. |
| F-1-7 | The privacy, offline, and price facts remain in the first mobile screen. | `390 px landing keeps complete navigation and all first-screen facts in view` | `evidence/polish-3/live-home-390.png`; price ends inside 844 px. |
| F-1-8 | README opens with the plain desktop-app job statement. | `reviewed landing and README copy stays plain and self-explanatory` | `evidence/polish-3/live-home-390.png`; linked current README reviewed. |
| F-1-9 | Demo storage and discard copy remains split into short sentences. | `reviewed landing and README copy stays plain and self-explanatory` | `evidence/polish-3/live-cold-demo-390.png`; banner, reset, and exit passed. |
| F-1-10 | Reader-facing QA jargon remains absent. | `reviewed landing and README copy stays plain and self-explanatory` | `evidence/polish-3/live-home-390.png`; current README reviewed. |
| F-1-11 | Release-cache wording remains plain. | `@claim:release-cache` | `evidence/polish-3/live-home-390.png`; live download lookup passed. |
| F-1-12 | The workflow heading names the pull-list task. | `reviewed landing and README copy stays plain and self-explanatory` | `evidence/polish-3/live-home-390.png`; exact heading passed. |
| F-1-13 | The product-boundary heading is literal and self-contained. | `@claim:planning-only` | `evidence/polish-3/live-home-390.png`; exact heading passed. |
| F-2-1 | Direct demo leads with a named sample part, pull instruction, and shortage. | `@claim:sample-demo` | `evidence/polish-3/live-cold-demo-390.png`; ESP32, pull, and shortage were inside 390×844. |
| F-2-2 | BOM import keeps its labelled CSV file chooser. | `@claim:bom-file-import` | `evidence/polish-3/live-cold-demo-390.png`; live verifier imported a CSV then reset. |
| F-2-3 | The stock-versus-demand promise is registered and checked. | `@claim:stock-shortage-check` | `evidence/polish-3/live-cold-demo-390.png`; pull and shortage are visible. |
| F-2-4 | README has direct build commands, not unregistered artifact promises. | `reviewed landing and README copy stays plain and self-explanatory` | `evidence/polish-3/live-home-390.png`; current README reviewed. |
| F-2-5 | README has the runnable browser-check command, not a QA coverage promise. | `reviewed landing and README copy stays plain and self-explanatory` | `evidence/polish-3/live-home-390.png`; current README reviewed. |
| F-2-6 | `/demo/?demo=1` retains `Demo — Bench Bin BOM`. | `public navigation, legal links, titles, focus, and 404 remain real routes` | `evidence/polish-3/live-cold-demo-390.png`; direct demo title passed. |
| F-2-7 | The 404 H1 remains `Page not found`. | `public navigation, legal links, titles, focus, and 404 remain real routes` | <https://bench-bin-bom.sociobot.in/missing-polish-3-check> returned styled HTTP 404. |
| F-2-8 | Checkout and download labels identify their external destination. | `@claim:checkout-destination` | `evidence/polish-3/live-home-390.png`; checkout and GitHub labels passed. |
| F-2-9 | First use expands parts list (BOM). | `reviewed landing and README copy stays plain and self-explanatory` | `evidence/polish-3/live-home-390.png`; exact wording passed. |
| F-2-10 | README uses “does not track how you use it.” | `reviewed landing and README copy stays plain and self-explanatory` | `evidence/polish-3/live-home-390.png`; current README reviewed. |
| F-2-11 | README has no WebView build jargon. | `reviewed landing and README copy stays plain and self-explanatory` | `evidence/polish-3/live-home-390.png`; current README reviewed. |
| F-2-12 | README has no release-matrix jargon. | `reviewed landing and README copy stays plain and self-explanatory` | `evidence/polish-3/live-home-390.png`; current README reviewed. |
| F-2-13 | The generic workflow label remains removed. | `reviewed landing and README copy stays plain and self-explanatory` | `evidence/polish-3/live-home-390.png`; phrase absent. |
| F-2-14 | The vague boundary label remains removed. | `reviewed landing and README copy stays plain and self-explanatory` | `evidence/polish-3/live-home-390.png`; phrase absent. |
| F-3-1 | Replaced “secure Sociobot checkout” with the factual external-checkout label on landing and app About. Added `checkout-destination` with a non-purchasing 303 redirect check. | `@claim:checkout-destination` | `evidence/polish-3/live-home-390.png`; home exposes the new label and live checkout is external. |
| F-3-2 | Removed the unsupported operating-system prediction from the landing, README, installer output, and future release body. The tested unsigned disclosure remains. | `@claim:unsigned-installers`; reviewed-copy test | `evidence/polish-3/live-home-390.png`; unsupported sentence is absent. |

## Verification

- Clean-clone claim execution ran every command in `.factory/claims.json`, including all 24 unique `@claim:` tags.
- The full local suite passed unit, type, static-site, browser, accessibility,
  privacy, demo-isolation, offline, Rust, and Debian package checks.
- `scripts/verify-live.mjs` and `/opt/fleet/lib/verify-url.sh` passed after the
  static deployment. The live 404, legal routes, direct demo, checkout label,
  no-console-error rule, and serious/critical axe checks were repeated cold.
- v0.1.5 release workflow
  [33282510282](https://github.com/B-Divyesh/sf-bench-bin-bom/actions/runs/33282510282)
  passed all platform and manifest jobs. Deployment
  `3a4b0ae2-ae13-4559-a293-d976c190115b` is live at
  <https://bench-bin-bom.sociobot.in>. The published Debian package matches
  `SHA256SUMS`; Lighthouse scored 100/100/100/100 with 1.1 s LCP and 0 CLS.

No finding of any severity remains open.
