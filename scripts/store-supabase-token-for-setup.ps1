# Enregistre le token Supabase depuis le presse-papiers (fichier gitignore, usage local uniquement)
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$OutFile = Join-Path $RepoRoot ".supabase-setup.local"

$clip = Get-Clipboard -ErrorAction SilentlyContinue
if (-not $clip) {
  throw "Presse-papiers vide. Copiez d abord le token sbp_... depuis Supabase."
}
$clip = $clip.Trim()
if ($clip -match '^sbp_[^\s]+$') {
  $token = $clip
} elseif ($clip -match '(sbp_[A-Za-z0-9_-]+)') {
  $token = $Matches[1]
} else {
  throw "Aucun token sbp_... dans le presse-papiers."
}

Set-Content -Path $OutFile -Value $token -Encoding Ascii -NoNewline
Write-Host "Token enregistre dans .supabase-setup.local (gitignore). Lancez: npm run create:supabase-preprod" -ForegroundColor Green
