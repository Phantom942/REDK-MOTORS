$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

$envPath = Join-Path $RepoRoot ".env.preprod.local"
if (-not (Test-Path -LiteralPath $envPath)) {
  throw "Lancez d abord: npm run create:supabase-preprod"
}

Get-Content -LiteralPath $envPath | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith("#")) { return }
  $i = $line.IndexOf("=")
  if ($i -lt 1) { return }
  $k = $line.Substring(0, $i).Trim()
  $v = $line.Substring($i + 1).Trim()
  Set-Item -Path "env:$k" -Value $v
}

$tokenFile = Join-Path $RepoRoot ".supabase-setup.local"
if (-not $env:SUPABASE_ACCESS_TOKEN -and (Test-Path -LiteralPath $tokenFile)) {
  $env:SUPABASE_ACCESS_TOKEN = (Get-Content -LiteralPath $tokenFile -Raw).Trim()
}

$env:MARKETPLACE_PREPROD_FINISH_CONFIRM = "finish-preprod-redkmotors"
node scripts/marketplace-finish-preprod.mjs
exit $LASTEXITCODE
