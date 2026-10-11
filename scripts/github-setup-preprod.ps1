# Secrets GitHub + PR (PAT dans .github-setup.local ou GH_TOKEN)
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

$tokenFile = Join-Path $RepoRoot ".github-setup.local"
if (Test-Path -LiteralPath $tokenFile) {
  $env:GH_TOKEN = (Get-Content -LiteralPath $tokenFile -Raw).Trim()
}
if (-not $env:GH_TOKEN) {
  throw "Token manquant. Copiez un PAT GitHub puis: npm run store:github-token"
}

gh auth status 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Utilisation du PAT via GH_TOKEN (sans gh auth login)." -ForegroundColor DarkGray
}

& (Join-Path $RepoRoot "scripts\set-github-preprod-secrets.ps1")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$existing = gh pr list --head feat/marketplace-occasions --json url --jq ".[0].url" 2>$null
if ($existing) {
  Write-Host "PR: $existing" -ForegroundColor Green
  exit 0
}

gh pr create --base main --head feat/marketplace-occasions `
  --title "feat(marketplace): occasions, preprod Supabase et CI" `
  --body "## Summary`n- Marketplace occasions (Eleventy + Supabase)`n- Scripts preprod, CI, build preprod`n`n## Test plan`n- [ ] CI marketplace-validation`n- [ ] Workflow preprod build (PREPROD-OK)`n- [ ] Smoke: npm run test:marketplace:preprod"
