# Crée le projet Supabase préprod — à lancer dans VOTRE PowerShell (pas dans le chat)
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

Write-Host @"

=== Création projet Supabase préprod ===
1. Ouvrez : https://supabase.com/dashboard/account/tokens
2. Generate new token → copiez sbp_...

"@ -ForegroundColor Cyan

$TokenFile = Join-Path $RepoRoot ".supabase-setup.local"
if (-not $env:SUPABASE_ACCESS_TOKEN -and (Test-Path -LiteralPath $TokenFile)) {
  $fileToken = (Get-Content -LiteralPath $TokenFile -Raw).Trim()
  if ($fileToken -match '^sbp_[^\s]+$') {
    $env:SUPABASE_ACCESS_TOKEN = $fileToken
    Write-Host "Token lu depuis .supabase-setup.local" -ForegroundColor DarkGray
  }
}
if (-not $env:SUPABASE_ACCESS_TOKEN) {
  $clip = Get-Clipboard -ErrorAction SilentlyContinue
  if ($clip) { $clip = $clip.Trim() }
  if ($clip -match '^sbp_[^\s]+$') {
    $env:SUPABASE_ACCESS_TOKEN = $clip
    Write-Host "Token pris depuis le presse-papiers." -ForegroundColor DarkGray
  } elseif ($clip -match '(sbp_[A-Za-z0-9_-]+)') {
    $env:SUPABASE_ACCESS_TOKEN = $Matches[1]
    Write-Host "Token extrait du presse-papiers." -ForegroundColor DarkGray
  }
}
if (-not $env:SUPABASE_ACCESS_TOKEN) {
  $env:SUPABASE_ACCESS_TOKEN = Read-Host "Collez SUPABASE_ACCESS_TOKEN (sbp_...)"
}

$env:MARKETPLACE_PREPROD_SETUP_CONFIRM = "create-preprod-redkmotors"

Write-Host "`nLancement (org détectée automatiquement si possible)…`n" -ForegroundColor Cyan
node scripts/marketplace-setup-preprod.mjs

if ($LASTEXITCODE -eq 0) {
  Write-Host "`nOK - voir .env.preprod.local (ne pas committer)." -ForegroundColor Green
  Write-Host "Ensuite: Auth / Site URL https://preprod.redkmotors.fr/ dans le dashboard Supabase." -ForegroundColor Yellow
} else {
  exit $LASTEXITCODE
}
