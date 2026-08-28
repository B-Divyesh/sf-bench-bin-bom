#!/usr/bin/env sh
set -eu
repo="B-Divyesh/sf-bench-bin-bom"
platform="linux"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
manifest="https://github.com/$repo/releases/latest/download/latest.json"
json="$(curl -fsSL "$manifest")"
url="$(printf %s "$json" | sed -n 's/.*"linux"[^{]*{[^}]*"url"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"
sha="$(printf %s "$json" | sed -n 's/.*"linux"[^{]*{[^}]*"sha256"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"
[ -n "$url" ] && [ -n "$sha" ] || { echo "No Linux release found." >&2; exit 1; }
curl -fsSL "$url" -o "$tmp/bench-bin-bom.AppImage"
echo "$sha  $tmp/bench-bin-bom.AppImage" | sha256sum -c -
install -d "$HOME/.local/bin"; install -m 755 "$tmp/bench-bin-bom.AppImage" "$HOME/.local/bin/bench-bin-bom"
echo "Installed Bench Bin BOM to $HOME/.local/bin/bench-bin-bom (add it to PATH if needed)."
