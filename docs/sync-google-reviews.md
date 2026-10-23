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
sync-google-reviews: OK — note 4.9/5, 51 avis, 4 cartes exportées.
```

Le nombre **4** correspond à `site.googleReviews.maxReviews` (cartes affichées sur le site). Le **count** total vient de `userRatingCount` Google.

## GitHub Actions (optionnel)

Dans **Settings → Secrets → Actions**, ajouter :

- `GOOGLE_PLACES_API_KEY`

Puis dans `.github/workflows/deploy.yml`, avant le build :

```yaml
env:
  GOOGLE_PLACES_API_KEY: ${{ secrets.GOOGLE_PLACES_API_KEY }}
```

Sans secret, le déploiement continue avec les valeurs commitées dans le repo (ex. 51 avis manuels).

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
