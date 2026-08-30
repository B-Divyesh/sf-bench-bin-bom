# Independent verification 7 — Bench Bin BOM

**Decision: PASS**

Verified on 2026-08-30 from clean checkout commit
`3076522ba89801cf0446a4d5bcf9af176b6cd1d1` against
<https://bench-bin-bom.sociobot.in>. The live footer identifies build
`3076522b`. Freshly generated candidate `index.html` and `demo/index.html`
matched the deployed HTML byte-for-byte; every deployed landing and demo
JS/CSS/image asset had the same SHA-256 as the candidate build.

## Cold first read

The cold landing page says **“Check your parts before building.”** It says it
is for “makers and homelab builders” who need to find shortages before
starting. Its first task action is **“Try it with sample data”** and the
adjacent text says it opens an isolated sample bench and pull list. The first
screen also gives the local-data, offline, and price facts. This passes the
plain-words and one-click-demo acceptance gates at desktop and 390×844.

## Mandatory claims

`.factory/claims.json` exists and lists 24 claims. After `npm ci`, I ran every
listed command separately through the Playwright demo entry point; all passed.
`npx playwright test --list --grep '@claim:'` found exactly one test for each
of the 24 IDs, and the full browser suite subsequently passed with no failed
tests.

| Claim IDs | Result |
| --- | --- |
| `sample-demo`, `sample-content`, `record-bin-locations`, `bom-entry-notes`, `bom-file-import`, `stock-shortage-check`, `bom-allocation` | PASS |
| `csv-import-export`, `photo-limit`, `free-limits`, `paid-limits`, `license-daily`, `local-private`, `offline-reload` | PASS |
| `license-private`, `free-core-features`, `desktop-offline`, `price-copy`, `checkout-destination`, `installer-checksum`, `release-cache` | PASS |
| `unsigned-installers`, `release-artifacts`, `planning-only` | PASS |

The landing and README promises correspond to this registry. No unlisted
material product claim was found.

## Clean-build and package evidence

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 65 packages installed; 0 audit vulnerabilities |
| `npm test` | PASS — 12 tests |
| `npm run lint` | PASS |
| `npm run build` | PASS — JS 29.07 KB raw / 9.58 KB gzip; CSS 10.56 KB raw / 3.09 KB gzip |
| `npm run build:site` | PASS — landing JS 1.85 KB raw / 0.98 KB gzip; demo JS 28.40 KB raw / 9.33 KB gzip |
| `npm run test:e2e` | PASS — 36 Chromium tests; no last-failed tests |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | PASS |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` | PASS — 0 Rust tests, 0 failures |
| `CI=true npm run tauri build -- --bundles deb` | PASS — `Bench Bin BOM_0.1.5_amd64.deb` (4,340,108 bytes) |

The disposable QA image initially lacked GTK/GLib development packages; I
installed the standard Linux Tauri build dependencies before the Rust checks.
It also exports `CI=1`, which Tauri 2.11 rejects as a non-boolean `--ci`
value. The unmodified command succeeds with `CI=true`, the value used by
GitHub Actions; this is a harness compatibility note, not a candidate product
failure.

## Independent product exercise

On the live site I entered `/demo/?demo=1`, confirmed the persistent “Demo —
sample data, nothing is saved” banner and the three stock records/four-line
weather-node BOM, imported a real CSV BOM file (`JST socket, 2-pin, 2`),
confirmed it appeared in the pull-list flow, reset the demo, and left with
**Start for real**. Real seeded local storage remained unchanged. The claim
tests independently cover normal allocation, duplicate-demand allocation,
quoted CSV import/export, negative-quantity recovery, oversized-photo
rejection, limits and paid-limit removal, saved substitute notes, print pull
lists, and offline operation.

## Browser, accessibility, privacy, and deployment

- `scripts/verify-live.mjs` passed 21 live checks: 390px first-screen facts,
  one-click demo, isolation/reset, BOM file import, legal routes, 404, no
  console/page errors, axe, and offline nested `/demo/builds` reload.
- `/opt/fleet/lib/verify-url.sh` passed for `/` and `/demo/?demo=1`: HTTP 200,
  title, `lang=en`, exactly one H1, main landmark, alt text, labelled controls,
  and no console errors.
- Direct axe scans found zero serious or critical findings on home, demo,
  privacy, terms, and 404. The full suite exercises keyboard-only navigation,
  visible focus, 390px layout, text resize, and reduced motion. Visual review
  found no mobile horizontal clipping; deferred walkthrough images load after
  scrolling with no failed request.
- A cold landing made same-origin requests plus its declared GitHub release
  metadata lookup. A complete direct demo flow made no third-party request.
  Inventory/project data stayed in local storage. License verification is the
  only Sociobot request and sends only `license=<token>`.
- Live headers include HSTS, CSP with `frame-ancestors 'none'`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and
  `Permissions-Policy`. HTML uses `max-age=30`; hashed assets are one-year
  immutable; `sw.js` is `no-cache`.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 80 ms, CLS 0.

## Rate limit and releases

A fresh sequential 36-request invalid-license check to
`GET /api/v1/products/bench-bin-bom/verify` received 30 HTTP 200 invalid
verdicts, then six HTTP 429s. The first 429 was request 31 and every 429 had
`Retry-After: 4`. Observed allowance: **30 requests per client burst**.

GitHub release `v0.1.5` has Windows MSI/EXE, Linux AppImage/DEB/RPM, both
macOS arm64/x64 DMG/app artifacts, `SHA256SUMS`, and valid `latest.json`. I
downloaded `Bench.Bin.BOM_0.1.5_amd64.deb`; `sha256sum -c SHA256SUMS` returned
`OK`. Its Debian metadata is `bench-bin-bom` version `0.1.5`, amd64. The site
correctly discloses unsigned installers before download.

## Defects by severity

None found. This desktop app has no sign-in and no product-owned backend, so
Entra tenant, backend persistence/concurrency, library/CLI consumer, and PWA
update checks are not applicable. The web demo service worker's offline reload
was tested because it is an explicit claim.
