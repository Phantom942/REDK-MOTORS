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
│   │   └── localBusiness.json
│   ├── _includes/
│   │   ├── base.njk       # Layout principal
│   │   ├── header.njk
│   │   ├── footer.njk
│   │   ├── hero-video.njk
│   │   └── hero-simple.njk
│   ├── index.njk
│   ├── mecanique.njk
│   ├── carrosserie.njk
│   ├── entretien.njk
│   ├── pneumatiques.njk
│   ├── achat-revente.njk
│   ├── location.njk
│   ├── contact.njk
│   ├── merci.njk
│   ├── confidentialite.njk
│   ├── cookies.njk
│   └── 404.njk
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

1. **Archiver les anciens HTML** (optionnel) :
   ```bash
   mkdir _legacy
   mv index.html mecanique.html carrosserie.html entretien.html pneumatiques.html achat-revente.html location.html contact.html merci.html confidentialite.html cookies.html 404.html processus.html _legacy/
   mv blog _legacy/
   ```

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

## Pages non migrées (à faire si besoin)

- `processus.html` → créer `src/processus.njk`
- `blog/*.html` → créer `src/blog/` avec collection Eleventy
