$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$OutFile = Join-Path $RepoRoot ".cloudflare-setup.local"

$clip = Get-Clipboard -ErrorAction SilentlyContinue
if (-not $clip) { throw "Presse-papiers vide. Copiez un API Token Cloudflare (Pages:Edit, DNS:Edit, Zone:Read)." }
$clip = $clip.Trim()
if ($clip.Length -lt 20) { throw "Token Cloudflare trop court." }

Set-Content -Path $OutFile -Value $clip -Encoding Ascii -NoNewline
Write-Host "Token Cloudflare enregistre (.cloudflare-setup.local). Lancez: npm run deploy:cloudflare-preprod" -ForegroundColor Green
