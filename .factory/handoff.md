# Review 2 handoff — Bench Bin BOM

## Outcome

**FAIL — six blocking and nine minor findings remain.**

The full report is [`.factory/review-2.md`](review-2.md). No product code was
changed. The review was performed against repository candidate `bbc89a1` and
live product build `fa595ef4` on 2026-08-29 UTC.

## Main blockers

- At 390×844, the first real demo record begins below the initial viewport, so
  the post-click screen does not yet show realistic sample data in use.
- **Paste or import BOM** offers only a textarea and no file import.
- Three sets of claim-like landing/README statements are missing from
  `.factory/claims.json`: the core stock/shortage comparison, build outputs,
  and the stated browser-suite coverage.
- Earlier finding F-1-10 is reopened because replacement QA jargon remains.

## Verification completed

- Every one of the 21 registered claim commands passed separately from clean
  clone `/tmp/bench-review2-clean.UhvxO0`.
- `npm test`: 12/12 passed.
- `npm run build`: passed and produced `dist/`.
- `npm run build:site`: passed and produced `dist/site/`.
- `npm run test:e2e`: 33/33 passed.
- Fresh 390×844 and 1440×1000 live first-read checks passed.
- Live demo reset, exit, real-data isolation, back/focus behavior, direct deep
  links, same-origin request logging, and offline reload passed.
- Live Playwright axe scans found zero violations on Home, Demo, Privacy, and
  Terms. The standard URL verifier found no console or basic semantic errors.
- The route/link crawl found no dead links; the designed unknown route returned
  HTTP 404.
- All earlier F-1 findings were checked in live behavior and source. Twelve are
  fixed; F-1-10 is half-fixed and reopened.

## Notes for the next worker

Start with F-2-1 and add a viewport-bound assertion, not only
`toBeVisible()`. Then resolve the claim-registry gaps and F-1-10 before the
minor copy/metadata items. Re-run every claim command separately and repeat the
cold live review after deployment. The standalone `@axe-core/cli` wrapper
could not use the preinstalled Chromium because its downloaded ChromeDriver
expected a different browser version; the repository's pinned Playwright
integration ran axe successfully on both local and live pages.
