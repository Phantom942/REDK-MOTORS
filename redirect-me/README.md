# redk-motors.me → redkmotors.fr

Mini-site GitHub Pages : redirige l’ancien domaine vers https://redkmotors.fr (chemins conservés).

Repo dédié : `Phantom942/redk-motors-me-redirect`

## Limite GitHub Pages

Le redirect dans `index.html` / `404.html` est un **soft redirect** (meta refresh + JS). Ce n’est **pas** un HTTP 301. Google peut donc continuer à montrer `.me` un temps dans les résultats.

## Vrai 301 (recommandé)

Si le DNS de `redk-motors.me` passe par **Cloudflare** (ou un reverse proxy) :

1. Règle Redirect Rules / Page Rules : `*redk-motors.me/*` → `https://redkmotors.fr/$1`
2. Status : **301 Permanent Redirect**
3. Conserver le path (`$1` / `${uri}`)

Sinon, un hébergeur avec headers custom (Netlify `_redirects`, Cloudflare Workers, nginx) peut servir le 301 ; GitHub Pages seul ne le permet pas.
