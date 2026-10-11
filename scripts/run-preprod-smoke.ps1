$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot
$envPath = Join-Path $RepoRoot ".env.preprod.local"
if (-not (Test-Path -LiteralPath $envPath)) { throw ".env.preprod.local manquant" }
Get-Content -LiteralPath $envPath | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith("#")) { return }
  $i = $line.IndexOf("=")
  if ($i -lt 1) { return }
  Set-Item -Path ("env:" + $line.Substring(0, $i).Trim()) -Value $line.Substring($i + 1).Trim()
}
$env:MARKETPLACE_PREPROD_ALLOW_RUN = "preprod-redkmotors-smoke"
node scripts/marketplace-preprod-smoke.mjs
exit $LASTEXITCODE
