$ErrorActionPreference = 'Stop'
$repo = 'B-Divyesh/sf-bench-bin-bom'
$manifest = Invoke-RestMethod "https://github.com/$repo/releases/latest/download/latest.json"
$asset = $manifest.platforms.windows
if (-not $asset) { throw 'No Windows release found.' }
$target = Join-Path $env:LOCALAPPDATA 'BenchBinBOM'; New-Item -ItemType Directory -Force $target | Out-Null
$path = Join-Path $target 'bench-bin-bom.zip'; Invoke-WebRequest $asset.url -OutFile $path
if ((Get-FileHash $path -Algorithm SHA256).Hash.ToLower() -ne $asset.sha256.ToLower()) { throw 'Checksum verification failed.' }
Expand-Archive -Force $path $target
Write-Host "Verified and installed Bench Bin BOM in $target. The Windows build is unsigned; inspect the release if SmartScreen warns."
