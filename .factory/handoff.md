# Review 1 handoff — Bench Bin BOM

## What was done

Completed the requested adversarial first-read review of the live product at desktop and 390 px, plus a clean local verification pass. No product code was modified. The review is recorded in [review-1.md](review-1.md).

## Verification

- Fresh live Chromium cold reads at 390×844 and 1440×1000.
- One-click `/demo/` flow, persistent demo banner, populated sample, Reset, Start for real, real/demo storage isolation, and live request logging.
- Every command listed in `.factory/claims.json` (18/18) passed after `npm ci`.
- `npm test` (12 tests), `npm run lint`, `npm run build`, `npm run build:site`, and `npm run test:e2e` (27 tests) passed.
- Live route, metadata, deep-link/back/focus, 404, link, console, privacy, and offline checks completed.

## Result and next steps

**FAIL.** The core workflow and registered claims pass. Remaining work is documented as F-1-1 through F-1-13: four unlisted live claims, a clipped mobile Privacy nav action, the third hero fact below the first mobile screen, two overlong README sentences, jargon, two unclear headings, and an external link without an external label.

Resolve every finding in `review-1.md`, add or amend claim tests where required, then repeat the whole review from a clean checkout and fresh live browser contexts.
