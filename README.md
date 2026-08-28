# Bench Bin BOM

Bench Bin BOM is a local-first desktop app for makers and homelab builders who
want to compare a project BOM with the components already in their drawers. It
answers “can I start this build?” before a duplicate order or mid-build stop.

All stock, project data, and optional part photos stay in browser/WebView local
storage. CSV import/export keeps the record portable. Substitute notes are
planning prompts, not electrical safety advice.

## Run and test

```sh
npm install
npm run dev       # browser UI
npm test
npm run build     # desktop webview bundle → dist/
npm run build:site # static install site → dist/site/
npm run tauri dev # desktop shell (requires Rust + system WebKit deps on Linux)
```

`npm run build` is the reproducible desktop frontend build. The Tauri release
workflow produces unsigned macOS, Windows, and Linux installers after a `v*`
tag. macOS users may need right-click → Open; Windows SmartScreen may warn
until the publisher can sign releases.

## Install and deploy

The landing page reads the latest GitHub Release manifest and selects the
visitor’s platform. It also serves `/install.sh` and `/install.ps1`; both
verify a release SHA-256 before installation. For the static deployment,
publish `dist/site`.

The one-time Bench Pass uses Sociobot’s hosted checkout and a locally stored,
daily-verified license token. No payment provider or tracker is embedded.

## License

MIT. See [LICENSE](LICENSE).
