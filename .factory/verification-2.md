# Independent product verification 2 — FAIL

Verified on 2026-08-29 UTC.

- Candidate: `a52257761ee0f1b8e5668dae72680821cb100b38`
- Live URL: <https://bench-bin-bom.sociobot.in>
- Work order: `bench-bin-bom-verify-2`
- Result: **FAIL — do not release**

The candidate passes its declared automated tests and the live deployment is
byte-for-byte consistent with a clean candidate site build. Independent use
still falsifies the offline and demo-isolation promises, and the printed pull
list omits the bin locations needed to pull parts. The detected macOS download
also gives Intel users the ARM installer. These are release-blocking findings.

## Mandatory opening gates

### Declared claims tests

`.factory/claims.json` exists. From the initially clean candidate checkout I
ran `npm ci`, then ran every `test` command separately, in registry order,
before broader repository inspection. All commands exited 0:

| Claim | Declared test result |
| --- | --- |
| `sample-demo` | PASS, 1 Playwright test |
| `bom-allocation` | PASS, 1 Playwright test |
| `csv-import-export` | PASS, 1 Playwright test |
| `photo-limit` | PASS, 1 Playwright test |
| `free-limits` | PASS, 1 Playwright test |
| `paid-limits` | PASS, 1 Playwright test |
| `license-daily` | PASS, 1 Playwright test |
| `local-private` | PASS, 1 Playwright test |
| `offline-reload` | PASS, 1 Playwright test |
| `price-copy` | PASS, 1 Playwright test |
| `installer-checksum` | PASS, 1 Playwright test |
| `release-cache` | PASS, 1 Playwright test |

Every registered ID occurs exactly once as `@claim:<id>` in
`tests/e2e/product.spec.ts`.

The registry result does not make the product acceptable. Independent tests
below show that the observable `offline-reload` and demo-isolation behavior is
false outside the narrow assertions used by those tests. The registry also
does not test the README/privacy claim that license verification sends only
the saved token, or the README claim that the native desktop app works
offline; `offline-reload` exercises only `/demo/` in Chromium.

### Cold first-read test

**PASS.** In a fresh live browser context, the initial screen says:

- What it does: “Check your parts before you start building.”
- For whom: makers and homelab builders avoiding project-stalling shortages.
- What to click: “Try it with sample data,” with the adjacent explanation
  “Opens a sample bench and pull list in your browser.”

The action opens `/demo/` in one click. At 390×844, the headline, audience,
action, and explanation are all visible without scrolling; the action ends at
586 px in the 844 px viewport. The first demo view is populated with three
realistic parts and a build rather than an empty shell.

## Release-blocking defects

### High

1. **Offline reload fails on normal app routes, contradicting the offline
   claim.** In a fresh context I opened `/demo/`, waited for service-worker
   control, navigated with the app to `/demo/builds`, set the context offline,
   and reloaded. The result was `Page not found — Bench Bin BOM` with H1
   `That page is not in this drawer`, not the Builds screen. The worker test
   reloads only `/demo/`, so it does not prove the stated app-wide behavior.
   `sw.js` falls back to `/404.html` for an uncached navigation instead of the
   demo shell.

2. **Demo mode is not isolated from real license data and is not discarded on
   exit.** On `/demo/about`, pasting an invalid license wrote
   `sb_license:bench-bin-bom` and `sb_license:bench-bin-bom:verdict` to the
   shared real namespace. Both keys remained after selecting **Start for
   real**. Separately, adding `Demo persistence probe`, selecting **Start for
   real**, and returning to `/demo/` showed the added part again; the
   `demo:bench-bin-bom:v1` key was retained. This contradicts the banner
   “Demo — sample data, nothing is saved” and the sandbox contract that demo
   actions never read or write real data and are discarded when leaving. The
   `sample-demo` test checks only that one real inventory key is unchanged.

3. **The project pull list does not include bin locations.** The sample stock
   records bins A1, A2, and C4, but none appears in the live pull-list rows or
   print layout. Rows show part, need, allocated quantity, and status only.
   With matching stock spread across bins, the app also does not say how many
   to pull from each bin. This misses the brief's product-specific job: use bin
   locations in a print-friendly project pull list.

4. **The detected macOS download is wrong for Intel Macs.** The v0.1.1
   release contains both `aarch64.dmg` and `x64.dmg`, but `latest.json` exposes
   only the ARM DMG. The landing code selects the first `.dmg` without an
   architecture check. A Chromium context with an Intel Mac user agent was
   offered
   `Bench.Bin.BOM_0.1.1_aarch64.dmg`, the same URL offered to Apple Silicon.
   Intel users therefore do not get an installable artifact from the primary
   detected-platform action.

5. **The strict claims contract is incomplete.** Material page/README claims
   lack matching registry assertions, including “license verification sends
   only the saved token to Sociobot,” “CSV export, accessibility, and safety
   notes stay free,” and the native desktop offline promise. More importantly,
   the listed offline and isolated-demo tests pass while the broader promises
   fail in direct use as documented above. Under the supplied claims contract,
   an unlisted or inadequately tested claim blocks release.

### Medium

1. **Whitespace-only required names are saved.** Entering three spaces as a
   part name closed the dialog and persisted a part whose trimmed `name` is
   empty. Entering three spaces as a build name created a build with an empty
   H1 and document title `— Bench Bin BOM`. Native `required` validation sees
   spaces as nonempty; the application trims only after validation and does
   not reject the empty result. The same construction is present for manual
   BOM-line names.

2. **Builds cannot be deleted.** There is no delete action or project-filtering
   code. A free user who reaches the two-build limit can only repurpose an old
   build line by line or clear all app data, including inventory. This makes
   the advertised two-build free mode a lifetime creation limit in practice.

3. **The deployed build identifier is `local`.** All live HTML and bundle
   bytes match a clean candidate build made without `GITHUB_SHA`, including
   the literal footer value `local`. The site therefore provides no traceable
   deployed commit even though the required footer calls for a build ID.
   Product source at release tag `v0.1.1` (`50d838d2…`) and the candidate is
   identical; their only Git diff is `.factory/handoff.md`.

4. **Some mobile/keyboard targets are under 44×44 CSS px.** At 390 px, the app
   footer Terms link measures 39×44 and the focused app skip link 180×40. The
   landing skip link measures 154×26 when rendered. Other tested controls meet
   the baseline and all have visible focus.

### Low

1. Legal and 404 documents have route-specific titles, canonical links on the
   legal pages, and favicons, but they omit the Open Graph/Twitter metadata and
   apple-touch icon required on every route by the supplied site-structure
   contract.

2. `scoop-bucket/bench-bin-bom.json` is invalid JSON, still says version
   0.1.0, points to the old release, and contains a placeholder hash. The lone
   winget file is likewise version 0.1.0 and is only a `defaultLocale`
   document, not a complete installable manifest set. These paths are not
   advertised on the current landing page, so the primary installers remain
   usable except for the macOS architecture defect above.

## Passing evidence

### Clean checkout, tests, and production builds

The initial tree was clean and `HEAD` was the requested candidate.

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 64 packages, 0 vulnerabilities |
| `npm test` | PASS; 10 tests in 2 files |
| `npm run lint` | PASS; TypeScript `--noEmit` |
| `npm run build` | PASS; desktop WebView bundle in `dist/` |
| `npm run build:site` | PASS; complete static site in `dist/site/` |
| `npm run test:e2e` | PASS; 19/19 Chromium tests |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | PASS after installing the exact Linux packages in the release workflow |
| `CI=true npm run tauri build -- --bundles deb` | PASS |

The fresh Debian package is 4,338,190 bytes, version 0.1.1, amd64, and declares
`libwebkit2gtk-4.1-0` and `libgtk-3-0`. Its SHA-256 is
`490c37a4fb3dd87300f46f58575f1e30a6175431868140dc4586cbe490ca15d0`.
The fresh native binary stayed running for eight seconds under Xvfb; only
headless DRI warnings were emitted.

### End-to-end functional exercise

In a fresh live demo context:

- A zero-quantity DHT22/AM2302 part in bin B7 saved and survived reload.
- The sample allocated ten M3 screws as 6 then 4, reporting the second line
  two short. It also reported the resistor line two short.
- A new Garage sensor build accepted a quoted-comma substitute note and
  produced one ready and one short line.
- A fractional manual BOM quantity was rejected by form validity.
- Print invoked successfully; print media hides chrome/actions and retains the
  BOM panel.
- The full flow made same-origin requests only, with no console errors, page
  errors, or failed responses.
- The prior cancellation, CSV quoting/negative quantity, photo-size, free
  limit, fake-license, daily-cache, price, and checksum regressions all passed
  the full repository suite.

### Accessibility, keyboard, mobile, and motion

- `verify-url.sh` passed `/` and `/demo/`: title, `lang=en`, one H1, main
  landmark, image alternatives, labelled buttons, and no browser errors.
- axe 4.11 found 0 total violations on live desktop landing, 390 px landing,
  390 px demo inventory, and 390 px sample pull list.
- Keyboard traversal reached the skip link, demo controls, navigation, add,
  import, export, edit, and legal actions. Focus uses a visible 3 px orange
  outline. Enter opens the Add part dialog, focus moves inside to Close, Escape
  closes it, and focus returns to Add a part.
- There was no horizontal overflow at 390 px, including at 200% root text
  size. All controls remained rendered. Reduced-motion emulation produced 0 s
  animation and transition durations.
- The touch-size exceptions are listed above.

### Performance, caching, and response policy

Fresh production payloads:

- Desktop app: 24.45 KB JS (8.43 KB gzip), 8.94 KB CSS (2.83 KB gzip).
- Landing: 1.54 KB JS plus 0.71 KB module helper; 4.67 KB CSS.
- Demo: 23.79 KB JS, 8.94 KB CSS.
- Hero WebP: 47,798 bytes. No web fonts are fetched.

Lighthouse 12.8.2 mobile on the live landing page: performance 99,
accessibility 100, best practices 100, SEO 100; FCP 1.09 s, LCP 1.17 s, TBT
113 ms, CLS 0, Speed Index 1.09 s.

Live HTML uses 30-second revalidation. Hashed JS/CSS/image responses use
`public, max-age=31536000, immutable`; `sw.js` uses `no-cache`. Responses
include HSTS, enforced CSP with frame denial, `X-Frame-Options: DENY`,
`nosniff`, Referrer-Policy, and Permissions-Policy. Unknown routes return the
designed document with HTTP 404.

The service worker registered at `/sw.js`, used cache
`bench-bin-bom-shell-v0.1.1`, and `registration.update()` completed without an
error. The nested-route offline defect remains as documented above.

### Privacy and server-side endpoint checks

- A fresh live landing visit requested only the site plus GitHub's releases
  API. A complete demo inventory/build flow requested only the product origin.
  No analytics, trackers, remote fonts, or remote scripts were observed.
- The license verifier returned HTTP 200 with
  `{valid:false, reason:"invalid"}` for an invalid token.
- A fresh 60-request burst after that initial request returned 29 additional
  HTTP 200 responses and 31 HTTP 429 responses. Every 429 had
  `Retry-After: 4`. The observed single-client burst allowance is therefore 30
  requests.
- The documented checkout endpoint returned HTTP 303 to a Dodo hosted checkout.
- Sign-in/Entra checks are not applicable; this product has no sign-in.
- There is no product-owned backend or persistence service to test.

### Deployment and installer evidence

- A clean `npm run build:site` produced 25 publicly served files. Every one,
  including landing, demo, legal, 404, service worker, installers, images,
  scripts, and styles, matched the live response byte for byte. The platform
  config was checked through its observed headers rather than as a public file.
- Candidate CI run `33258805070` completed successfully for candidate SHA
  `a52257761ee0f1b8e5668dae72680821cb100b38`.
- Release `v0.1.1` targets `50d838d25144e4306cd9b3b6776518fdbf25631d`
  and has Windows MSI/EXE, Linux AppImage/DEB/RPM, and macOS ARM/x64 assets.
- `latest.json` is valid. The 78,887,416-byte Linux AppImage downloaded from
  its listed URL and matched SHA-256
  `9ca61e94307df1a3a89bfa0c7dd45ddec00079e6f169ae8489eca7355933906c`.
  It extracted successfully and stayed running for eight seconds under Xvfb.
- The Windows and Linux detected-platform links point to the published MSI and
  AppImage. The Intel macOS failure is listed above.
- All discovered internal links returned 200; the purchase endpoint returned
  its expected redirect and the release asset resolved to 200.

## Release decision

**FAIL.** Passing repository tests, byte parity, performance, accessibility
scans, headers, and package checks do not override false offline/demo claims or
the missing bin information in the core pull-list workflow. Repair those
release blockers, the macOS architecture selection, and the claims coverage,
then verify again from a fresh checkout and browser profile.
