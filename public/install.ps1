$ErrorActionPreference = 'Stop'
$repo = 'B-Divyesh/sf-bench-bin-bom'
$manifest = Invoke-RestMethod "https://github.com/$repo/releases/latest/download/latest.json"
$asset = $manifest.platforms.windows
if (-not $asset) { throw 'No Windows release found.' }
$target = Join-Path $env:LOCALAPPDATA 'BenchBinBOM'; New-Item -ItemType Directory -Force $target | Out-Null
$path = Join-Path $target 'bench-bin-bom.msi'; Invoke-WebRequest $asset.url -OutFile $path
if ((Get-FileHash $path -Algorithm SHA256).Hash.ToLower() -ne $asset.sha256.ToLower()) { throw 'Checksum verification failed.' }
$process = Start-Process msiexec.exe -ArgumentList @('/i', $path, '/passive', '/norestart') -Wait -PassThru
if ($process.ExitCode -ne 0) { throw "Windows Installer failed with exit code $($process.ExitCode)." }
Write-Host 'Verified the checksum and installed Bench Bin BOM. The Windows build is unsigned.'
