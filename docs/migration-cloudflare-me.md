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
| `_headers` | En-têtes cache + sécurité (copié dans `_site` au build) |

## Activer Cloudflare devant redkmotors.fr (obligatoire pour `_headers`)

GitHub Pages **n’applique pas** le fichier `_headers`. Sans proxy Cloudflare, les en-têtes cache et `Content-Type` de `ai.txt` ne sont pas servis.

### Étape 1 — Ajouter le site

1. Compte [Cloudflare Dashboard](https://dash.cloudflare.com) → **Add a site** → `redkmotors.fr`
2. Plan **Free** suffit
3. Cloudflare affiche 2 nameservers (ex. `ada.ns.cloudflare.com`)

### Étape 2 — Nameservers chez le registrar

1. Registrar du domaine `.fr` → remplacer les NS par ceux de Cloudflare
2. Attendre propagation (souvent 15 min – 24 h)
3. Statut Cloudflare : **Active**

### Étape 3 — DNS

| Type | Nom | Contenu | Proxy |
|---|---|---|---|
| CNAME | `@` ou apex | `phantom942.github.io` (ou user.github.io) | **Proxied** (orange) |
| CNAME | `www` | `redkmotors.fr` | **Proxied** |

> GitHub Pages : configurer aussi le domaine custom dans **Settings → Pages → Custom domain**.

### Étape 4 — SSL/TLS

- Mode : **Full (strict)**
- **Always Use HTTPS** : ON
- **Automatic HTTPS Rewrites** : ON

### Étape 5 — Vérifier les en-têtes

Après déploiement GitHub Pages + proxy actif :

```bash
curl -I https://redkmotors.fr/ai.txt
# Attendu : Content-Type: text/plain; charset=utf-8

curl -I https://redkmotors.fr/assets/fonts/manrope-latin-400-normal.woff2
# Attendu : Cache-Control: public, max-age=31536000, immutable
```

Si `Content-Type` reste incorrect, vérifier que `_headers` est bien dans `_site/` après `npm run build` et que le proxy orange est actif.

---

## Régénérer les exports redirects `.me`

```bash
npm run build
node scripts/export-cloudflare-me-redirects.js
# ou
npm run redirects:export-me
```

## Import Cloudflare — redirects redk-motors.me

### 1. Règle générique (catégorie A)

```
*redk-motors.me/*
→ https://redkmotors.fr/${uri.path}
Status: 301
```

**Rules → Redirect Rules → Create rule** (ou Bulk Redirects selon votre UI).

### 2. Bulk Redirects (catégories B + C)

1. **Bulk Redirects** → Create list → Import CSV
2. Fichier : `cloudflare-redirects-me-import.csv` (sans en-tête)
3. Associer la liste au domaine `redk-motors.me`

### 3. Bulk Redirects `.fr` (optionnel)

Importer `cloudflare-bulk-redirects.csv` si Cloudflare proxy aussi `redkmotors.fr` (URLs legacy `.html`, etc.).

## Vérification redirects

```bash
# Échantillon rapide (20 CSV + 10 cat. A)
bash check-redirects.sh --sample 20

# Contrôle complet (913+ URLs — long)
bash check-redirects.sh

# Test manuel
curl -I https://redk-motors.me/contact
# Attendu : HTTP/2 301 → https://redkmotors.fr/contact
```

## Checklist post-migration

- [x] Proxy orange actif sur `redkmotors.fr` et `www`
- [x] 301 `redk-motors.me` → `.fr` (règle + bulk)
- [ ] **Worker headers** — `npm run cf:deploy-headers` (cache 1 an + sécu, GitHub Pages ne lit pas `_headers`)
- [ ] `curl -I ai.txt` → `Cache-Control: max-age=86400`
- [ ] `curl -I /assets/fonts/*.woff2` → `immutable`
- [ ] SSL Full (strict), HTTPS forcé
- [x] Fonts self-hosted servies depuis `/assets/fonts/`

---

## Worker Cloudflare — en-têtes `_headers` sur GitHub Pages

GitHub Pages ignore `_headers`. Avec Cloudflare proxy actif, déployer le Worker :

```bash
npm run cf:deploy-headers
```

Fichiers : `workers/response-headers/` — injecte cache long `/assets/*`, sécu globale, `text/plain` pour ai.txt/llms.txt.

Vérification :

```bash
npm run verify:prod
```
