# Handoff — adversarial review 3

## Outcome

**FAIL.** Review-only work completed; no product code was changed. See `.factory/review-3.md`.

Two blocking registry-completeness findings remain:

- F-3-1: **“Opens secure Sociobot checkout.”** is an untested security/destination claim.
- F-3-2: **“Your operating system may ask you to confirm it.”** is an untested operating-system behavior claim, also repeated in the README.

## Verification performed

- Fresh live Chromium checks at 390×844 and 1440×1000, including the one-click `/demo/?demo=1` path.
- Live demo edit/reset/exit isolation check: demo data used `demo:bench-bin-bom:v1`, never altered the seeded real key, and was removed by **Start for real**. The direct demo flow made same-origin requests only.
- Live route, metadata, link, header, mobile, focus/back-navigation, 404, accessibility, and visual-identity checks.
- Axe on home, demo, Privacy, Terms, and 404: zero serious or critical issues.
- Clean clone `/tmp/bench-bin-review3-clean.uFkXB1`: all 23 commands in `.factory/claims.json` passed separately. `npm test` (12), `npm run lint`, `npm run build`, `npm run build:site`, and `npm run test:e2e` (35) also passed.

The sandbox’s default package install omits dev dependencies; `npm ci --include=dev` was used so the declared Playwright tests could run. This is not a product test failure.

## Next step

Remove or register/test the two promises above, then run the complete review again. All review-1 and review-2 findings were independently confirmed fixed.
