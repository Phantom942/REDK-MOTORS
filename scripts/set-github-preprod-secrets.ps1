# Pousse les secrets GitHub Actions depuis .env.preprod.local (gh auth login requis)
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot
$EnvFile = Join-Path $RepoRoot ".env.preprod.local"
if (-not (Test-Path -LiteralPath $EnvFile)) {
  throw "Fichier manquant: .env.preprod.local - lancez create:supabase-preprod"
}

$map = @{}
Get-Content -LiteralPath $EnvFile | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith("#")) { return }
  $i = $line.IndexOf("=")
  if ($i -lt 1) { return }
  $k = $line.Substring(0, $i).Trim()
  $v = $line.Substring($i + 1).Trim()
  $map[$k] = $v
}

function Set-GhSecret($name, $value) {
  if (-not $value) { Write-Host "Skip $name (vide)" -ForegroundColor Yellow; return }
  Write-Host "Secret $name ..." -ForegroundColor Cyan
  $value | gh secret set $name
}

$tokenFile = Join-Path $RepoRoot ".github-setup.local"
if (Test-Path -LiteralPath $tokenFile) {
  $env:GH_TOKEN = (Get-Content -LiteralPath $tokenFile -Raw).Trim()
}
if (-not $env:GH_TOKEN) {
  gh auth status | Out-Null
} else {
  Write-Host "GH_TOKEN charge depuis .github-setup.local" -ForegroundColor DarkGray
}

Set-GhSecret "MARKETPLACE_PREPROD_SUPABASE_URL" $map["MARKETPLACE_PREPROD_SUPABASE_URL"]
Set-GhSecret "MARKETPLACE_PREPROD_ANON_KEY" $map["MARKETPLACE_PREPROD_ANON_KEY"]
Set-GhSecret "MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF" $map["MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF"]
Set-GhSecret "MARKETPLACE_PREPROD_TEST_VENDOR_EMAIL" $map["MARKETPLACE_PREPROD_TEST_VENDOR_EMAIL"]
Set-GhSecret "MARKETPLACE_PREPROD_TEST_MODERATOR_EMAIL" $map["MARKETPLACE_PREPROD_TEST_MODERATOR_EMAIL"]
Set-GhSecret "MARKETPLACE_PREPROD_TEST_PASSWORD" $map["MARKETPLACE_PREPROD_TEST_PASSWORD"]

Write-Host "`nOK secrets GitHub (repo courant)." -ForegroundColor Green
