# Bench Bin BOM

Bench Bin BOM is a desktop app for makers and homelab builders. It checks a
project parts list (BOM) against parts stored in your bench drawers.

Stock, projects, optional photos, and license details use local app storage.
The app does not track how you use it. CSV import and export keep the stock
list portable. Each physical part is allocated once across duplicate BOM rows.

Try the isolated sample at <https://bench-bin-bom.sociobot.in/demo/?demo=1>.
The demo uses separate storage and never reads real data. It is discarded when
you leave or select **Start for real**.

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

Build the desktop app with `npm run build`. Build the landing site with
`npm run build:site`. Run the browser checks with `npm run test:e2e`.

The desktop app keeps inventory and pull lists available without a network
connection. The web demo works offline after its first visit, including nested
build routes.

## Package and deploy

Push a version tag such as `v0.1.3` to build installers for macOS, Windows, and
Linux. The release also publishes `SHA256SUMS` and `latest.json`.
Installers are unsigned.

The landing page checks GitHub for the latest release and keeps that result for
one hour. If that lookup fails, it links to the release page.
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
