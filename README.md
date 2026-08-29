# Bench Bin BOM

Bench Bin BOM is a Tauri desktop app for makers and homelab builders. It
compares a project BOM with parts already stored in bench drawers.

Stock, projects, optional photos, and license details use local app storage.
There is no analytics or telemetry. CSV import and export keep the stock list
portable. Each physical part is allocated once across duplicate BOM rows.

Try the isolated sample at <https://bench-bin-bom.sociobot.in/demo/>. It uses
separate demo storage, never reads real app data, and is discarded when you
select **Start for real**.

## Price and limits

Free mode supports 40 stock parts and two builds. Bench Pass costs US$12 once
and removes those record limits. It does not gate CSV export, accessibility, or
safety notes. The app reuses a verified license result for one day.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run build:site
npm run test:e2e
cargo check --locked --manifest-path src-tauri/Cargo.toml
npm run tauri build -- --bundles deb
```

`npm run build` writes the desktop WebView bundle to `dist/`.
`npm run build:site` writes the complete deployable site to `dist/site/`.
The browser suite covers desktop, 390 px mobile, keyboard focus, axe,
privacy, offline reload, response policy, legal routes, demo isolation, and
every claim in [the claim registry](.factory/claims.json).

The desktop app keeps inventory and pull lists available without a network
connection. The web demo works offline after its first visit, including nested
build routes.

## Package and deploy

Push a `v*` tag to run the Tauri release matrix for macOS arm64/x64, Windows,
and Linux. The release also publishes `SHA256SUMS` and `latest.json`.
Installers are unsigned, so macOS and Windows may ask for confirmation.

The landing page reads the CORS-enabled GitHub Releases API and caches release
metadata for one hour. If that lookup fails, it links to the release page.
`/install.sh` and `/install.ps1` verify SHA-256 before installation. The
PowerShell path installs the published MSI with Windows Installer.

Deploy the static site with:

```sh
/opt/fleet/lib/deploy-static.sh bench-bin-bom dist/site
```

## Privacy and safety

Core inventory use sends no data to third parties. License verification sends
only the saved token to Sociobot. Substitute notes are planning prompts, not
electrical advice; check ratings, pinouts, and fit.

See [Privacy](https://bench-bin-bom.sociobot.in/privacy/) and
[Terms](https://bench-bin-bom.sociobot.in/terms/).

## License

MIT. See [LICENSE](LICENSE).
