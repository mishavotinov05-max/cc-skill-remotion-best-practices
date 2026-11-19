# NOXARGENT STUDIO — one-click setup for Windows. Run: right-click -> "Run with PowerShell"
$ErrorActionPreference = 'Stop'
function Refresh-Path { $env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User') }
function Has($c) { [bool](Get-Command $c -ErrorAction SilentlyContinue) }

# 1. Python 3.9+ and FFmpeg
$py = $null
foreach ($c in 'py','python') { if (Has $c) { $v = & $c -c "import sys;print(sys.version_info>=(3,9))" 2>$null; if ($v -eq 'True') { $py = $c; break } } }
if (-not $py) { winget install -e --id Python.Python.3.12 --accept-package-agreements --accept-source-agreements; Refresh-Path; $py = if (Has 'py') { 'py' } else { 'python' } }
if (-not (Has 'ffmpeg')) { winget install -e --id Gyan.FFmpeg --accept-package-agreements --accept-source-agreements; Refresh-Path }

# 2. Libraries
& $py -m pip install --upgrade pip
& $py -m pip install pillow numpy opencv-python faster-whisper

# 3. Work folder on the Desktop (works with OneDrive-redirected Desktop too)
$desktop = [Environment]::GetFolderPath('Desktop')
$studio = Join-Path $desktop 'NOXARGENT_STUDIO'
New-Item -ItemType Directory -Force -Path $studio | Out-Null
Copy-Item (Join-Path $PSScriptRoot 'test_scene.py') $studio -Force

# 4. Test render
& $py (Join-Path $studio 'test_scene.py') (Join-Path $desktop 'test.mp4')
Write-Host "Done. Python/FFmpeg/libraries installed, test.mp4 is on your Desktop."
