# Extract full-duration high-quality stills from the Higgsfield 1080p hero master.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root 'hero_1080p.mp4'
$outDir = Join-Path $root 'public\frames'
$manifest = Join-Path $root 'src\heroFrames.ts'

function Find-Ffmpeg {
  $cmd = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $winget = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter 'ffmpeg.exe' -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName
  if ($winget) { return $winget }
  throw 'ffmpeg not found. Install Gyan.FFmpeg.Essentials or add ffmpeg to PATH.'
}

if (-not (Test-Path $src)) { throw "Missing master video: $src" }

$ffmpeg = Find-Ffmpeg
if (Test-Path $outDir) {
  $item = Get-Item $outDir -Force
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
    cmd /c "rmdir `"$outDir`""
  }
}
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
Get-ChildItem $outDir -Filter 'ezgif-frame-*.jpg' -ErrorAction SilentlyContinue | Remove-Item -Force

Write-Host "ffmpeg: $ffmpeg"
Write-Host "source: $src"
Write-Host "output: $outDir"

$tmpDir = Join-Path $root 'public\frames-tmp'
if (Test-Path $tmpDir) { Remove-Item -Recurse -Force $tmpDir }
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

# Native 1080p stills (1920x1080), no downscale — q:v 2 is near-max JPEG quality.
& $ffmpeg -y -i $src -q:v 2 (Join-Path $tmpDir 'hero-%04d.jpg')
if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed with exit $LASTEXITCODE" }

Get-ChildItem $outDir -Filter 'hero-*.jpg' -ErrorAction SilentlyContinue | Remove-Item -Force
Get-ChildItem $tmpDir -Filter 'hero-*.jpg' | Move-Item -Destination $outDir -Force
Remove-Item -Recurse -Force $tmpDir

$count = (Get-ChildItem $outDir -Filter 'hero-*.jpg').Count
if ($count -lt 2) { throw "Expected extracted frames, found $count" }

$ts = @(
  "export const HERO_FRAME_COUNT = $count"
  'export const HERO_FRAME_PAD = 4'
  "export const HERO_FRAME_VERSION = '1080p'"
  ''
  'export function heroFrameSrc(index: number): string {'
  "  const n = String(index + 1).padStart(HERO_FRAME_PAD, '0')"
  '  return `/frames/hero-${n}.jpg?v=${HERO_FRAME_VERSION}`'
  '}'
  ''
) -join "`n"
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($manifest, $ts, $utf8)
Write-Host "Wrote $count frames and $manifest"
