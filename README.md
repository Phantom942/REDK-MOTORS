# RED-K MOTORS

Garage automobile à Ivry-sur-Seine (mécanique, carrosserie, entretien, pneumatiques, location).

- **Contact** : 06 48 74 56 68 | contact@redk-motors.me
- **Site** : redk-motors.me
- **Hébergement** : GitHub Pages (workflow `.github/workflows/deploy.yml`)
- **Snapchat** : RedkMotors

## Dépôt (organisation)

| Élément | Rôle |
|--------|------|
| `src/` | Pages et gabarits Eleventy (`.njk`) |
| `assets/` | CSS, JS, images, vidéos servis tels quels |
| `scripts/` | Build (`minify.js`), favicons, image OG |
| `_site/` | **Généré** par `npm run build` — ne pas versionner |
| `node_modules/` | Dépendances npm — **ne pas versionner** |

Fichiers optionnels pour d’autres hébergeurs (le site principal est sur GitHub Pages) :

- `vercel.json` — en-têtes et redirections si déploiement Vercel
- `netlify.toml` — build Netlify ; les redirections Netlify sont dans `_redirects` (copié dans `_site`)

Dossiers **ignorés par Git** (travail local, hors site web) : `print/`, `prospection/` — ne pas les supprimer s’ils vous servent (cartes, prospection).

## Commandes

- `npm install` — une fois
- `npm run dev` — prévisualisation locale
- `npm run build` — production dans `_site/`
