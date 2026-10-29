# Synchroniser les avis Google (build / local)

Le script `scripts/sync-google-reviews.js` met à jour :

- `src/_data/googleReviews.json` (note, nombre d’avis, jusqu’à N extraits)  
- `src/_data/site.json` → `googleReviews.rating` et `googleReviews.count`

Il est exécuté **automatiquement** au début de `npm run build`. Sans clé API, le build conserve les fichiers statiques (comportement silencieux).

## Prérequis Google Cloud

1. Projet Google Cloud avec **Places API (New)** activée.  
2. Clé API restreinte (IP CI + votre IP dev, ou secret GitHub uniquement).  
3. **Ne jamais** commiter la clé ni l’exposer côté navigateur.

Place ID RED-K MOTORS (déjà dans `site.json`) :

```text
ChIJd1Lv-zdz5kcRFt1G98zTvOY
```

## Variables d’environnement

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `GOOGLE_PLACES_API_KEY` | Oui pour sync | Clé serveur Places API (New) |
| `GOOGLE_PLACES_PLACE_ID` | Non | Surcharge le Place ID de `site.json` |

## Commandes

```powershell
cd "REDK-MOTORS"
$env:GOOGLE_PLACES_API_KEY = "VOTRE_CLE"
npm run google:reviews
```

Ou build complet :

```powershell
$env:GOOGLE_PLACES_API_KEY = "VOTRE_CLE"
npm run build
```

Sortie attendue :

```text
sync-google-reviews: OK — note 4.9/5, 53 avis (pool curaté N cartes, +K nouveaux).
```

**Important :** le pool d’avis de `googleReviews.json` (auteurs utilisés par `reviewPages.js` pour les témoignages) n’est **jamais remplacé** par le slice API. La sync met à jour `rating` / `count` et peut **ajouter** de nouveaux auteurs absents du pool ; les textes déjà sélectionnés sont conservés.

Test de non-régression : `npm run test:sync-reviews`.

## GitHub Actions (optionnel)

Le workflow **Deploy to GitHub Pages** injecte déjà :

- `GOOGLE_PLACES_API_KEY`
- `GOOGLE_PLACES_PLACE_ID`

### Ajouter les secrets (une fois)

1. Ouvrir le dépôt GitHub → **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret** :
   - Nom : `GOOGLE_PLACES_API_KEY` — valeur : clé API **serveur** (Places API New), jamais une clé « navigateur ».
   - (Optionnel) `GOOGLE_PLACES_PLACE_ID` = `ChIJd1Lv-zdz5kcRFt1G98zTvOY` si vous devez surcharger `site.json`.
3. Relancer un workflow **Deploy** : le job build exécute `sync-google-reviews.js` avant Eleventy.
4. Contrôle : dans les logs du build, chercher `sync-google-reviews: OK` ; sinon le message « pas de GOOGLE_PLACES_API_KEY » (build OK, données statiques).

Sans secret, le déploiement continue avec les valeurs commitées dans le repo (ex. 53 avis manuels).  
Runbook complet : **`docs/github-actions-ops-runbook.md`**. Checklist propriétaire : **`docs/checklist-proprietaire-seo-ops.md`**.

Après build CI : `scripts/ops-build-report.js` vérifie cohérence count + fichiers GEO + clé IndexNow.

## Dépannage

| Message | Cause probable |
|---------|----------------|
| `pas de GOOGLE_PLACES_API_KEY` | Normal — pas de sync |
| `HTTP 403` | API non activée ou clé restreinte incorrecte |
| `HTTP 404` | Place ID invalide |
| `aucun avis retourné` | Field mask / quota — vérifier console Google |

## Mise à jour manuelle (sans API)

Éditer directement :

- `src/_data/site.json` → `googleReviews.count`, `googleReviews.rating`  
- `src/_data/googleReviews.json` → mêmes champs + tableau `reviews` pour les citations affichées

Puis commit + déploiement.
