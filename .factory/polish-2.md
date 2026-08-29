# Polish round 2 — cumulative finding closure

Candidate `fa595ef418af301eebbf58dc8a0301750aa0c90d` and review commit `1155f01cda40d9030fcd553ace05baeaf4731026` were repaired in `c50f59d` and released as `v0.1.3` from `081bc6c`. I read `.factory/review-1.md`, `.factory/polish-1.md`, and `.factory/review-2.md`; every recorded finding was rechecked from a clean clone and on the deployed site.

Live product: <https://bench-bin-bom.sociobot.in>  
Direct isolated demo: <https://bench-bin-bom.sociobot.in/demo/?demo=1>  
Release: <https://github.com/B-Divyesh/sf-bench-bin-bom/releases/tag/v0.1.3>

## Review 1 findings

| Finding | Change made | Automated evidence | Screenshot and cold live check |
| --- | --- | --- | --- |
| F-1-1 | Kept the `sample-content` registry entry and exact three-stock/four-row assertion. | `@claim:sample-content` passed independently and in the 35-test clean-clone suite. | [`live-cold-demo-390.png`](evidence/polish-2/live-cold-demo-390.png); direct demo contains the exact sample counts. |
| F-1-2 | Kept bin capture and pull-instruction display covered as a product promise. | `@claim:record-bin-locations` creates bin D7 and proves it in stock and the pull result. | [`live-demo/screenshot-desktop.png`](evidence/polish-2/live-demo/screenshot-desktop.png); live demo shows bin A1 in the pull result. |
| F-1-3 | Kept pasted BOM rows, substitute notes, persistence, and reload coverage. | `@claim:bom-entry-notes` passed independently from the clean clone. | [`live-demo/screenshot-desktop.png`](evidence/polish-2/live-demo/screenshot-desktop.png); `/demo/?demo=1` retains the sample substitute note. |
| F-1-4 | Visitor-facing illustration-provenance copy remains removed; provenance stays in `.factory/design.md`. | `reviewed landing and README copy stays plain and self-explanatory` asserts no `figcaption`. | [`live-home/screenshot-desktop.png`](evidence/polish-2/live-home/screenshot-desktop.png); no provenance marketing appears live. |
| F-1-5 | Source link names GitHub and its external destination in visible and accessible copy. | `public navigation, legal links, titles, focus, and 404 remain real routes`. | [`live-home/screenshot-desktop.png`](evidence/polish-2/live-home/screenshot-desktop.png); live footer says “View source on GitHub (external)”. |
| F-1-6 | Mobile site navigation uses a complete four-column grid; app navigation now also fits Bench stock, Builds, and About at 390 px. | `390 px landing keeps complete navigation...` plus `scripts/verify-live.mjs` bounding-box checks for every demo nav item. | [`live-home/screenshot-mobile.png`](evidence/polish-2/live-home/screenshot-mobile.png) and [`live-cold-demo-390.png`](evidence/polish-2/live-cold-demo-390.png). |
| F-1-7 | Compact first-screen spacing keeps all three privacy/offline/price facts above 844 px. | `390 px landing keeps complete navigation and all first-screen facts in view` measures the price fact. | [`live-home/screenshot-mobile.png`](evidence/polish-2/live-home/screenshot-mobile.png); cold live check passed. |
| F-1-8 | README opens with the job and audience; implementation details are not used as product explanation. | `reviewed landing and README copy stays plain and self-explanatory`. | [`readme-github.png`](evidence/polish-2/readme-github.png); current GitHub README checked cold. |
| F-1-9 | Demo storage and discard behavior use two short sentences. | Reviewed-copy test plus `.factory/copy-audit.md`; all sentences are at most 22 words. | [`readme-github.png`](evidence/polish-2/readme-github.png); live demo reset and exit passed. |
| F-1-10 | Removed the remaining QA coverage list and jargon. README now says only “Run the browser checks with `npm run test:e2e`.” | Reviewed-copy test rejects the old phrases; copy audit has no banned or overlong wording. | [`readme-github.png`](evidence/polish-2/readme-github.png); current README checked cold. |
| F-1-11 | Kept plain release-cache wording without CORS terminology. | `@claim:release-cache` passed and verifies one-hour cache plus fallback. | [`live-home/screenshot-desktop.png`](evidence/polish-2/live-home/screenshot-desktop.png); live lookup resolved release 0.1.3 without errors. |
| F-1-12 | Kept the literal heading “How to create a pull list from your parts.” | Reviewed-copy test asserts the heading. | [`live-home/screenshot-desktop.png`](evidence/polish-2/live-home/screenshot-desktop.png); exact heading is live. |
| F-1-13 | Kept the literal heading “What Bench Bin BOM does not check.” | Reviewed-copy and `@claim:planning-only` tests passed. | [`live-home/screenshot-desktop.png`](evidence/polish-2/live-home/screenshot-desktop.png); exact heading and limits are live. |

## Review 2 findings

| Finding | Change made | Automated evidence | Screenshot and cold live check |
| --- | --- | --- | --- |
| F-2-1 | The direct demo now leads with a compact computed weather-node pull list above stock. It shows a named part, bin pull, and shortage before decorative content. | The 390×844 mobile test and `scripts/verify-live.mjs` assert `ESP32 DevKit`, `Pull 1 from A1`, and `2 short` are inside the initial viewport. | [`live-cold-demo-390.png`](evidence/polish-2/live-cold-demo-390.png); direct demo passed cold at 390×844. |
| F-2-2 | Added a labelled `.csv` file chooser to the BOM dialog while retaining paste input and the existing CSV parser. | `@claim:bom-file-import` uploads an in-memory CSV and asserts the imported row; live verifier imports and resets `JST socket`. | [`live-demo/screenshot-desktop.png`](evidence/polish-2/live-demo/screenshot-desktop.png); live file import passed. |
| F-2-3 | Registered `stock-shortage-check` for the hero, preview, and README claim. | `@claim:stock-shortage-check` creates exact stock/demand and asserts ready quantity, pull location, and shortage. | [`live-cold-demo-390.png`](evidence/polish-2/live-cold-demo-390.png); live demo displays pull and shortage results. |
| F-2-4 | Replaced README output promises with direct build commands and short run instructions. | Reviewed-copy test rejects the former `writes ... dist` claims; `npm run build` and `npm run build:site` both passed from the clean clone. | [`readme-github.png`](evidence/polish-2/readme-github.png); current README contains no unregistered output promise. |
| F-2-5 | Removed the detailed browser-suite coverage promise and kept the runnable command only. | Reviewed-copy test rejects the old coverage sentences; every registered claim command still passed separately. | [`readme-github.png`](evidence/polish-2/readme-github.png); no unlisted coverage claim remains. |
| F-1-10 (reopened) | Removed “demo isolation,” “response security,” and “registered claim” from reader-facing README prose. | Reviewed-copy test and `.factory/copy-audit.md`. | [`readme-github.png`](evidence/polish-2/readme-github.png); current README checked cold. |
| F-2-6 | The demo inventory route preserves `Demo — Bench Bin BOM`; nested routes retain their own titles. | Mobile route test and `scripts/verify-live.mjs` assert the final post-render title. | [`live-demo/verify.json`](evidence/polish-2/live-demo/verify.json); direct live demo title checked. |
| F-2-7 | Changed the 404 H1 to “Page not found.” | Public-route test asserts HTTP 404, title, and literal H1; live verifier repeats it. | [`live-404.html`](evidence/polish-2/live-404.html); <https://bench-bin-bom.sociobot.in/missing-polish-2-check> returned 404. |
| F-2-8 | Checkout copy says it opens secure Sociobot checkout; download text and accessible name say GitHub. | Public-link test and `scripts/verify-live.mjs` assert both external destinations. | [`live-home/screenshot-desktop.png`](evidence/polish-2/live-home/screenshot-desktop.png); live actions resolve to Sociobot and release 0.1.3 on GitHub. |
| F-2-9 | Expanded the first landing and README use to “parts list (BOM)”. | Reviewed-copy test asserts the expansion. | [`live-home/screenshot-desktop.png`](evidence/polish-2/live-home/screenshot-desktop.png) and [`readme-github.png`](evidence/polish-2/readme-github.png). |
| F-2-10 | Replaced “analytics or telemetry” with “The app does not track how you use it.” | Reviewed-copy test rejects the old wording. | [`readme-github.png`](evidence/polish-2/readme-github.png); current wording checked cold. |
| F-2-11 | Replaced “desktop WebView bundle” with the direct command “Build the desktop app with `npm run build`.” | Reviewed-copy test rejects `WebView bundle`; clean-clone build passed. | [`readme-github.png`](evidence/polish-2/readme-github.png). |
| F-2-12 | Replaced CI jargon with “Push a version tag such as `v0.1.3` to build installers...” | Reviewed-copy test rejects “release matrix”; release workflow completed successfully for four targets. | [`release-verification.json`](evidence/polish-2/release-verification.json) and [`readme-github.png`](evidence/polish-2/readme-github.png). |
| F-2-13 | Removed “Try the real workflow”; the preview heading directly names stock and shortage checking. | Reviewed-copy test asserts the generic label is absent. | [`live-home/screenshot-desktop.png`](evidence/polish-2/live-home/screenshot-desktop.png); phrase is absent live. |
| F-2-14 | Removed “Clear boundaries”; the section begins with the literal product-limit heading. | Reviewed-copy test asserts the generic label is absent. | [`live-home/screenshot-desktop.png`](evidence/polish-2/live-home/screenshot-desktop.png); phrase is absent live. |

## Acceptance evidence

- Clean clone `/tmp/bench-bin-polish2-final.bSEmKO` at `081bc6c`: all 23 claim commands passed individually; 12 unit tests, lint, both production builds, all 35 Chromium tests, and `cargo check --locked` passed.
- Live semantic verifier: `/`, `/demo/?demo=1`, `/privacy/`, and `/terms/` passed title, language, H1, main, alt, button-label, and console checks. The designed unknown route returned HTTP 404.
- Live Playwright verifier: 21 cold checks passed with zero console/page errors, zero serious or critical axe violations, isolated reset/exit behavior, file import, mobile bounds, legal routes, current release link, and an offline nested demo reload.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, TBT 0 ms, CLS 0. Evidence: [`lighthouse-live.json`](evidence/polish-2/lighthouse-live.json).
- Release workflow: all verify/platform/manifest jobs passed. `latest.json` reports Linux, macOS, and Windows; a downloaded Windows installer matched the published SHA-256. Evidence: [`release-verification.json`](evidence/polish-2/release-verification.json).

No review finding remains unresolved.
