# Handoff — adversarial review 4

## Outcome

**PASS.** Review 4 made no product-code changes. The complete record is `.factory/review-4.md`.

## What was verified

- Fresh live Chromium checks at 390×844 and 1440×1000 passed the cold-read gate. The direct demo showed sample stock, a pull location, and a shortage in the first mobile viewport.
- Each of the 24 declared claims was run separately from a clean clone and passed. The full browser suite passed 36 tests; `npm test` passed 12 tests; desktop and static-site builds passed.
- The demo banner, reset/exit isolation, same-origin demo request flow, service-worker offline reload, deep links, focus/back behavior, legal pages, metadata, headers, links, 404, and zero serious/critical axe issues were rechecked live.
- Every finding in reviews 1–3 and polish rounds 1–3 was confirmed fixed in both the current source and deployed product.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run build:site
npm run test:e2e
```

## Known gaps and next steps

No finding remains. Keep the claim tests and direct-demo first-screen checks current when product copy or behavior changes.
