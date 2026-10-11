$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

$tokenFile = Join-Path $RepoRoot ".cloudflare-setup.local"
if (Test-Path -LiteralPath $tokenFile) {
  $env:CLOUDFLARE_API_TOKEN = (Get-Content -LiteralPath $tokenFile -Raw).Trim()
}
if (-not $env:CLOUDFLARE_API_TOKEN) {
  throw "Token Cloudflare manquant. npm run store:cloudflare-token"
}
$env:CLOUDFLARE_ACCOUNT_ID = "82e31c401bb561864cba4a522774e8b8"

$envPath = Join-Path $RepoRoot ".env.preprod.local"
if (-not (Test-Path "_site") -and (Test-Path -LiteralPath $envPath)) {
  Get-Content -LiteralPath $envPath | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) { return }
    $i = $line.IndexOf("=")
    if ($i -lt 1) { return }
    Set-Item -Path ("env:" + $line.Substring(0, $i).Trim()) -Value $line.Substring($i + 1).Trim()
  }
  $env:MARKETPLACE_BUILD_TARGET = "preprod"
  $env:MARKETPLACE_BUILD_ENABLE = "1"
  $env:MARKETPLACE_SUPABASE_URL = $env:MARKETPLACE_PREPROD_SUPABASE_URL
  $env:MARKETPLACE_SUPABASE_ANON_KEY = $env:MARKETPLACE_PREPROD_ANON_KEY
  Write-Host "Build _site..." -ForegroundColor Cyan
  npm run build:marketplace-preprod
}

Write-Host "Deploiement Wrangler Pages..." -ForegroundColor Cyan
npx wrangler pages deploy _site --project-name=redk-motors-marketplace-preprod --branch=main --commit-dirty=true
Write-Host "`nhttps://preprod.redkmotors.fr/achat-revente/" -ForegroundColor Green
exit $LASTEXITCODE
