# Démarre la stack marketplace locale (Windows) — Docker + Supabase + Functions + Eleventy
# Usage : .\scripts\setup-marketplace-local.ps1
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

$Docker = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
if (-not (Test-Path $Docker)) { $Docker = "docker" }

Write-Host "`n=== 1/4 Docker ===" -ForegroundColor Cyan
& $Docker info *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Docker Desktop n'est pas démarré. Lancez-le puis relancez ce script." -ForegroundColor Red
  exit 1
}

Write-Host "`n=== 2/4 Supabase local ===" -ForegroundColor Cyan
Set-Location (Join-Path $RepoRoot "marketplace")
npx supabase start
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`n=== 3/4 Seed comptes (si besoin) ===" -ForegroundColor Cyan
Set-Location $RepoRoot
node scripts/marketplace-local-seed.mjs

Write-Host "`n=== 4/4 Edge Functions + Eleventy ===" -ForegroundColor Cyan
node scripts/marketplace-functions-serve.mjs start
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host @"

Stack locale prête.
  - Ouvrez un NOUVEAU terminal et lancez : npm run dev:marketplace-local
  - Puis le lien affiché [11ty] Server at http://localhost:XXXX/
  - Compte : http://localhost:XXXX/achat-revente/compte/
  - Mot de passe seed : TestMarketplace-Local-2026!

"@ -ForegroundColor Green
