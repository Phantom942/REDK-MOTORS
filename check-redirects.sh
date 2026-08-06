#!/usr/bin/env bash
# Vérifie les redirections 301 redk-motors.me → redkmotors.fr
# Usage:
#   ./check-redirects.sh                          # CSV complet + catégorie A
#   ./check-redirects.sh --sample 20              # 20 URLs aléatoires du CSV + 10 cat. A
#   ./check-redirects.sh cloudflare-redirects-me.csv category-a-urls.txt
set -euo pipefail

CSV="${1:-cloudflare-redirects-me.csv}"
A_LIST="${2:-category-a-urls.txt}"
SAMPLE=0
ERR=0

if [[ "${1:-}" == "--sample" ]]; then
  SAMPLE="${2:-20}"
  CSV="cloudflare-redirects-me.csv"
  A_LIST="category-a-urls.txt"
fi

check_url() {
  local src="$1"
  local expected="$2"
  local out code final hops

  if ! out=$(curl -sIL -w "\n%{http_code} %{url_effective} %{num_redirects}" "$src" 2>/dev/null | tail -1); then
    echo "SOURCE: $src"
    echo "  ERREUR: curl a échoué"
    echo
    ERR=1
    return
  fi

  code=$(echo "$out" | awk '{print $1}')
  final=$(echo "$out" | awk '{print $2}')
  hops=$(echo "$out" | awk '{print $3}')

  echo "SOURCE: $src"
  echo "  HTTP: $code | FINAL: $final | SAUTS: $hops"

  if [[ "$code" != "301" ]]; then
    echo "  ERREUR: code HTTP attendu 301, reçu $code"
    ERR=1
  fi
  if [[ "$final" != "$expected" ]]; then
    echo "  ERREUR: destination attendue $expected"
    ERR=1
  fi
  if [[ "$hops" -gt 1 ]]; then
    echo "  ERREUR: plus d'un saut de redirection ($hops)"
    ERR=1
  fi
  if [[ "$code" == "200" ]]; then
    echo "  ERREUR: réponse 200 — stub GitHub Pages encore servi"
    ERR=1
  fi
  echo
}

pick_sample_lines() {
  local file="$1" count="$2" skip_header="${3:-1}"
  local total
  total=$(wc -l < "$file" | tr -d ' ')
  total=$((total - skip_header))
  if (( count >= total )); then
    tail -n +$((skip_header + 1)) "$file"
    return
  fi
  tail -n +$((skip_header + 1)) "$file" | shuf | head -n "$count"
}

if [[ ! -f "$CSV" ]]; then
  echo "Fichier introuvable: $CSV — lancer: node scripts/export-cloudflare-me-redirects.js" >&2
  exit 1
fi

if (( SAMPLE > 0 )); then
  echo "=== Échantillon CSV ($SAMPLE lignes) ==="
  while IFS=, read -r src dst _rest; do
    [[ -z "$src" ]] && continue
    check_url "$src" "$dst"
  done < <(pick_sample_lines "$CSV" "$SAMPLE")
else
  echo "=== Redirections explicites ($CSV) ==="
  while IFS=, read -r src dst _rest; do
    [[ "$src" == "source_url" ]] && continue
    [[ -z "$src" ]] && continue
    check_url "$src" "$dst"
  done < "$CSV"
fi

if [[ -f "$A_LIST" ]]; then
  echo "=== Chemins identiques (catégorie A) ==="
  if (( SAMPLE > 0 )); then
    while IFS= read -r path || [[ -n "$path" ]]; do
      [[ -z "$path" || "$path" =~ ^# ]] && continue
      src="https://redk-motors.me${path}"
      expected="https://redkmotors.fr${path}"
      check_url "$src" "$expected"
    done < <(grep -v '^#' "$A_LIST" | grep -v '^$' | shuf | head -n 10)
  else
    while IFS= read -r path || [[ -n "$path" ]]; do
      [[ -z "$path" || "$path" =~ ^# ]] && continue
      src="https://redk-motors.me${path}"
      expected="https://redkmotors.fr${path}"
      check_url "$src" "$expected"
    done < "$A_LIST"
  fi
else
  echo "Avertissement: $A_LIST introuvable — catégorie A non testée" >&2
fi

if [[ "$ERR" -eq 0 ]]; then
  echo "OK: toutes les redirections vérifiées sont conformes."
else
  echo "ÉCHEC: au moins une redirection est incorrecte." >&2
fi

exit "$ERR"
