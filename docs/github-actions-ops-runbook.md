# Runbook ops — GitHub Actions, IndexNow, avis Google

Guide pour **lot ops** : CI deploy, secrets, réindexation, vérifs locales.

## Workflow principal

Fichier : `.github/workflows/deploy.yml`  
Déclenchement : **push sur `main`**, PR (build seulement), ou **workflow_dispatch**.

| Job | Quand | Rôle |
|-----|--------|------|
| **build** | Toujours | audit, build, tests GTM/conversions |
| **deploy** | push `main` | GitHub Pages |
| **smoke-test** | après deploy | prod URLs, llms, robots, cookies GTM |
| **indexnow** | après smoke | ping Bing/Yandex etc. (continue-on-error) |

---

## Secrets GitHub (Settings → Secrets and variables → Actions)

| Secret | Obligatoire | Effet |
|--------|-------------|--------|
| `GOOGLE_PLACES_API_KEY` | Non | Au **build**, `scripts/sync-google-reviews.js` met à jour note + count + extraits avis |
| `GOOGLE_PLACES_PLACE_ID` | Non | Surcharge `ChIJ…` dans `site.json` si besoin |

Sans `GOOGLE_PLACES_API_KEY` : le build garde les valeurs **commitées** (`site.json` / `googleReviews.json`).  
Après changement manuel du compteur (ex. 51 avis), **commit + push `main`**.

### Créer la clé Places API

1. [Google Cloud Console](https://console.cloud.google.com/) → activer **Places API (New)**.  
2. Clé API → restrictions **IP** (IP sortante GitHub Actions change — préférer **aucune restriction IP** + restriction **API** Places only, ou accepter sync **locale** uniquement).  
3. Coller dans GitHub secret `GOOGLE_PLACES_API_KEY`.

Place ID RED-K : `ChIJd1Lv-zdz5kcRFt1G98zTvOY` (déjà dans `site.json`).

---

## IndexNow (réindexation rapide)

- Clé publique : fichier `315a9d29deec456a9cd2ae11fe67e677.txt` à la racine (copié dans `_site` au build).  
- Prod : https://redkmotors.fr/315a9d29deec456a9cd2ae11fe67e677.txt  

**Automatique** : job `indexnow` après chaque deploy `main` (priorité + sitemap complet).  
**Manuel** (après grosse modif SEO) :

```powershell
cd REDK-MOTORS
npm run build
npm run indexnow:priority
npm run indexnow:ping
```

Ou tout-en-un : `npm run post-deploy` (IndexNow + `verify:prod`).

URLs prioritaires : `src/_data/indexationPriority.js` (garage Ivry, diagnostic, llms, ai.txt, etc.).

---

## Commandes locales

| Commande | Usage |
|----------|--------|
| `npm run ops:check` | Vérif prod (IndexNow, GEO, garage) + liste secrets |
| `npm run ops:report` | Après `npm run build` — cohérence avis + fichiers `_site` |
| `npm run google:reviews` | Sync avis si `GOOGLE_PLACES_API_KEY` en env |
| `npm run post-deploy` | IndexNow + headers prod |

---

## GTM / GA4 (hors CI)

Le workflow teste **dataLayer** et **page_view GA4** (Playwright).  
Les **tags GTM** (formulaires, conversions) restent dans l’UI Google Tag Manager.  
Checklist : `docs/seo-local-phase2-30jours.md` section GTM.

---

## Après chaque deploy réussi

1. Actions → dernier **Deploy to GitHub Pages** → jobs verts (build, deploy, smoke, indexnow).  
2. Si **indexnow** jaune : ouvrir le log ; souvent sitemap pas encore propagé — relancer `workflow_dispatch` ou `npm run post-deploy`.  
3. Optionnel : `npm run ops:check` depuis ta machine.  
4. Search Console : inspection URL sur `/garage-ivry-sur-seine/` ou `/llms-full.txt` si grosse modif GEO.

---

## Sécurité

- Ne jamais committer `.github-setup.local` (PAT). Template : `.github-setup.local.example`.  
- Révoquer tout PAT exposé.  
- Ne pas committer `GOOGLE_PLACES_API_KEY`.

Voir aussi : `docs/sync-google-reviews.md`, `docs/seo-geo-monitoring-mensuel.md`.
