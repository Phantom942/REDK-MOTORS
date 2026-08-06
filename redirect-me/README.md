# redk-motors.me → redkmotors.fr

Mini-site de redirection de l’ancien domaine vers https://redkmotors.fr (chemins conservés 1:1).

Repo dédié typique : `Phantom942/redk-motors-me-redirect` (ou dossier `redirect-me/` de ce monorepo).

## Important — GitHub Pages ≠ 301 HTTP

`index.html` / `404.html` restent un **soft redirect** (meta refresh + JS) pour le fallback GitHub Pages.
Ce n’est **pas** un HTTP 301. Google peut continuer à montrer `.me` un temps dans les résultats.

Pour un **vrai 301 page à page** (path conservé), choisir une des options ci-dessous.

## Option A — Cloudflare Redirect Rules (recommandé)

1. Ajouter `redk-motors.me` à Cloudflare
2. Redirect Rules / Page Rules :
   - Source : `*redk-motors.me/*`
   - Destination : `https://redkmotors.fr/$1`
   - Status : **301 Permanent**
3. Même règle pour `www.redk-motors.me` si besoin

## Option B — Amen micro-hébergement + Apache

1. Activer le micro-hébergement Amen pour `redk-motors.me`
2. Déposer à la racine le fichier `.htaccess` de ce dossier
3. Copier aussi `robots.txt`

## Option C — Netlify

Pointer le domaine `.me` vers Netlify et déployer ce dossier : le fichier `_redirects` applique

```
/*    https://redkmotors.fr/:splat    301!
```

## Option D — Vercel

Déployer ce dossier avec le `vercel.json` fourni (host `redk-motors.me` / `www` → `https://redkmotors.fr/:path*`, permanent).

## Fichiers fournis

| Fichier | Rôle |
|---|---|
| `.htaccess` | 301 Apache / Amen |
| `_redirects` | 301 Netlify / Cloudflare Pages |
| `vercel.json` | 301 Vercel (par host) |
| `index.html` / `404.html` | Soft redirect fallback (GitHub Pages) |
| `robots.txt` | noindex pendant migration |
