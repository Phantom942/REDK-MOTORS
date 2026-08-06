# Migration Cloudflare — redk-motors.me → redkmotors.fr

## Fichiers

| Fichier | Rôle |
|---|---|
| `redirects-map.csv` | Table source (913 entrées) — généré par `npm run build` via `scripts/generate-legacy-redirects.js` |
| `cloudflare-redirects-me.csv` | Export avec en-tête (lecture humaine / scripts) |
| `cloudflare-redirects-me-import.csv` | **Import Cloudflare** (sans en-tête — obligatoire) |
| `cloudflare-bulk-redirects.csv` | Import Bulk Redirects Cloudflare (domaine `.fr`, legacy `.html` etc.) |
| `category-a-urls.txt` | Paths identiques — couverts par la règle générique CF |
| `check-redirects.sh` | Vérification curl des 301 |

## Régénérer les exports

```bash
npm run build
node scripts/export-cloudflare-me-redirects.js
```

## Import Cloudflare

### 1. Règle générique (catégorie A)

```
*redk-motors.me/*
→ https://redkmotors.fr/${uri.path}
Status: 301
```

### 2. Bulk Redirects (catégories B + C)

Importer `cloudflare-redirects-me-import.csv` dans **Bulk Redirects** (domaine `redk-motors.me`).

### 3. Bulk Redirects `.fr` (optionnel)

Importer `cloudflare-bulk-redirects.csv` si Cloudflare proxy aussi `redkmotors.fr`.

## Vérification

```bash
# Échantillon rapide (20 CSV + 10 cat. A)
bash check-redirects.sh --sample 20

# Contrôle complet (913+ URLs — long)
bash check-redirects.sh
```
