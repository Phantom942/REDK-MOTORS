# Assistant mise en place complète — exécuter dans PowerShell interactif
# Usage : .\scripts\setup-all-interactive.ps1
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

Write-Host "`n=== Étape 1/4 — Local (Docker + Supabase) ===" -ForegroundColor Cyan
& (Join-Path $RepoRoot "scripts\setup-marketplace-local.ps1")

Write-Host "`n=== Étape 2/4 — GitHub (push déjà fait ?) ===" -ForegroundColor Cyan
Write-Host "Si gh n'est pas connecté : gh auth login"
Write-Host "PR : https://github.com/Phantom942/REDK-MOTORS/compare/main...feat/marketplace-occasions?expand=1"

Write-Host "`n=== Étape 3/4 — Supabase préprod (cloud) ===" -ForegroundColor Cyan
if (-not $env:SUPABASE_ACCESS_TOKEN) {
  Write-Host "Créez un token : https://supabase.com/dashboard/account/tokens"
  $env:SUPABASE_ACCESS_TOKEN = Read-Host "Collez SUPABASE_ACCESS_TOKEN (sbp_...)"
}
if (-not $env:SUPABASE_ORG_ID) {
  Write-Host "Org ID : Supabase Dashboard → Organization Settings"
  $env:SUPABASE_ORG_ID = Read-Host "Collez SUPABASE_ORG_ID"
}
$env:MARKETPLACE_PREPROD_SETUP_CONFIRM = "create-preprod-redkmotors"
node scripts/marketplace-setup-preprod.mjs

Write-Host "`n=== Étape 4/4 — Secrets GitHub ===" -ForegroundColor Cyan
Write-Host @"
Dans GitHub → Settings → Secrets → Actions, ajoutez depuis .env.preprod.local :
  MARKETPLACE_PREPROD_SUPABASE_URL
  MARKETPLACE_PREPROD_ANON_KEY
  MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF

Puis Actions → Marketplace preprod build → Run workflow → PREPROD-OK

Cloudflare Pages + preprod.redkmotors.fr : docs/marketplace/PREPROD_PLAN.md
"@ -ForegroundColor Yellow

Write-Host "`nTerminé. Lancez npm run dev:marketplace-local dans un autre terminal." -ForegroundColor Green
