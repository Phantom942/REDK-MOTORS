# Une commande : tokens presse-papiers -> GitHub secrets + PR + Cloudflare Pages
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

Write-Host @"

=== Fin mise en place preprod ===
Etape A : copiez PAT GitHub (repo + workflow) -> npm run store:github-token
Etape B : copiez API Token Cloudflare (Pages Edit + DNS Edit) -> npm run store:cloudflare-token
Puis relancez: npm run setup:preprod-remaining

"@ -ForegroundColor Cyan

$gh = Join-Path $RepoRoot ".github-setup.local"
$cf = Join-Path $RepoRoot ".cloudflare-setup.local"

if (-not (Test-Path -LiteralPath $gh)) {
  Write-Host "Manquant: .github-setup.local (npm run store:github-token)" -ForegroundColor Yellow
  exit 2
}
if (-not (Test-Path -LiteralPath $cf)) {
  Write-Host "Manquant: .cloudflare-setup.local (npm run store:cloudflare-token)" -ForegroundColor Yellow
  exit 2
}

Write-Host "`n--- GitHub ---" -ForegroundColor Cyan
& (Join-Path $RepoRoot "scripts\github-setup-preprod.ps1")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`n--- Cloudflare Pages ---" -ForegroundColor Cyan
& (Join-Path $RepoRoot "scripts\deploy-cloudflare-preprod.ps1")
exit $LASTEXITCODE
