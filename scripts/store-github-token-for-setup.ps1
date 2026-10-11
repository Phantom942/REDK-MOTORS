$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$OutFile = Join-Path $RepoRoot ".github-setup.local"

$clip = Get-Clipboard -ErrorAction SilentlyContinue
if (-not $clip) { throw "Presse-papiers vide. Copiez un PAT GitHub (ghp_ ou github_pat_)." }
$clip = $clip.Trim()
if ($clip -notmatch '^(ghp_|github_pat_)') { throw "Token GitHub non reconnu dans le presse-papiers." }

Set-Content -Path $OutFile -Value $clip -Encoding Ascii -NoNewline
Write-Host "Token GitHub enregistre (.github-setup.local). Lancez: npm run github:setup-preprod" -ForegroundColor Green
