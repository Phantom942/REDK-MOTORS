# RED-K MOTORS — Architecture Eleventy

## Structure finale

```
REDK-MOTORS/
├── .eleventy.js           # Config Eleventy
├── .github/
│   └── workflows/
│       └── deploy.yml     # Déploiement GitHub Pages
├── assets/                # Inchangé (CSS, JS, vidéos, images)
├── favicon.svg
├── package.json
├── src/
│   ├── _data/
│   │   ├── site.json      # Données globales (nav, contact, etc.)
│   │   ├── localBusiness.json
│   │   └── tagNames.json  # Libellés des tags du blog
│   ├── _includes/
│   │   ├── base.njk           # Layout principal
│   │   ├── header.njk
│   │   ├── footer.njk
│   │   ├── hero-video.njk
│   │   ├── hero-simple.njk
│   │   ├── blog-article.njk   # Structure article blog
│   │   └── layout-blog-post.njk
│   ├── index.njk
│   ├── mecanique.njk
│   ├── carrosserie.njk
│   ├── entretien.njk
│   ├── pneumatiques.njk
│   ├── achat-revente.njk
│   ├── location.njk
│   ├── contact.njk
│   ├── merci.njk
│   ├── processus.njk
│   ├── confidentialite.njk
│   ├── cookies.njk
│   ├── 404.njk
│   └── blog/
│       ├── index.njk          # Index blog avec pagination
│       ├── tag.njk            # Pages par tag (/blog/tag/nom-tag/)
│       └── articles/          # Articles (collection blog)
│           ├── 5-points-controle-avant-ct-ivry.njk
│           ├── quand-changer-pneus-usure-securite.njk
│           ├── entretien-voiture-eviter-pannes-ivry.njk
│           ├── voyant-moteur-allume-que-faire.njk
│           ├── rayure-carrosserie-quand-reparer.njk
│           └── preparer-voiture-hiver-conseils.njk
└── _site/                 # Output build (généré)
```

## Commandes

```bash
npm install
npm run build      # Génère _site/
npm run serve      # Dev local + live reload
```

## Déploiement GitHub Pages

### 1. Activer GitHub Pages

- Repo → **Settings** → **Pages**
- **Source** : GitHub Actions
- Le workflow `deploy.yml` s'exécute à chaque push sur `main`

### 2. Première migration

1. **Les anciens HTML ont été supprimés** (nettoyage post-migration). Le blog est désormais une collection Eleventy dans `src/blog/`.

2. **Commit et push** :
   ```bash
   git add .
   git commit -m "refactor: migration Eleventy"
   git push origin main
   ```

### 3. URLs générées

| Ancien              | Nouveau (pretty URLs) |
|---------------------|------------------------|
| /index.html         | /                      |
| /mecanique.html     | /mecanique/            |
| /contact.html       | /contact/              |
| /merci.html         | /merci/                |
| /confidentialite.html | /confidentialite/   |
| /cookies.html       | /cookies/              |
| /404.html           | /404.html (inchangé pour GitHub) |

## Changements principaux

- **Pas de duplication** : header, footer, meta, scripts centralisés
- **Données globales** : `site.json` pour nav, contact, GTM
- **SEO préservé** : JSON-LD, breadcrumbs, meta dynamiques
- **Chemins** : `/assets/...` pour compatibilité root
- **Design** : identique, CSS/JS inchangés

## Blog (collection Eleventy)

- **Index** : `/blog/` — liste des articles triés par date décroissante
- **Articles** : `/blog/slug/` — URLs propres (ex. `/blog/5-points-controle-avant-ct-ivry/`)
- **Tags** : `/blog/tag/nom-tag/` — filtrage par tag (conseils-auto, mecanique, etc.)
- **JSON-LD** : chaque article inclut un `BlogPosting` pour le SEO
