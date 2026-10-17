# Runbook — déploiement KV / Worker redirections blog

## Ordre obligatoire

1. Merger la PR GitHub (Pages build + HTML/sitemap/schémas)
2. Attendre le déploiement GitHub Pages (smoke Pages OK)
3. Lancer **manuellement** le workflow [Deploy blog redirects KV](https://github.com/Phantom942/REDK-MOTORS/actions/workflows/deploy-blog-redirects-kv.yml)
   - `mode=deploy`
   - `deploy_worker=true`
4. Le workflow :
   - build + `test:blog-migration` + `test:kv-restore`
   - **backup KV obligatoire** (échec = stop)
   - **publie l’artefact** `kv-backup-<run_id>` **avant** tout upload
   - upload shards + deploy Worker
   - `verify-blog-redirects-prod.js --all --strict` avec **retries** (propagation CF)
5. Search Console : inspection des nouvelles URL + suivi 404

**Pas de déclenchement automatique sur push.**  
**Concurrency** : un seul run `deploy-blog-redirects-kv` à la fois (`cancel-in-progress: false`).

## Prérequis

- Secret GitHub Actions `CLOUDFLARE_API_TOKEN` :
  - Workers Scripts:Edit
  - Workers KV Storage:Edit
- Namespace id : `5d9807d363a24a089326f8d24f4f340c` (voir `workers/wrangler.toml`)

## Rollback KV (fiable)

### Comportement restore

Pour chaque entrée du `manifest.json` :

| État au backup | Action restore |
|---|---|
| `absent: false` | `PUT` de la valeur exacte sauvegardée |
| `absent: true` | `DELETE` de la clé (annule une création post-deploy) |

Validation **intégrale** du manifest + fichiers **avant** toute écriture. Sauvegarde incomplète → échec, aucune mutation KV.

### Via GitHub Actions (préféré)

1. Noter le `run_id` du déploiement (URL du run, ou message d’échec « Rollback… rollback_run_id=… »)
2. Actions → **Deploy blog redirects KV** → Run workflow
   - `mode=rollback`
   - `rollback_run_id=<run_id>`
3. Le job télécharge l’artefact `kv-backup-<run_id>` et restaure / supprime les clés.

### Via CLI local

```bash
# Télécharger l’artefact depuis le run (UI GitHub → Artifacts)
# ou depuis un backup local workers/kv-backup/

export CLOUDFLARE_API_TOKEN=…   # ne pas coller le token dans un chat
node scripts/deploy-kv-shards.js --restore --dir workers/kv-backup
```

Conserver l’artefact ≥ 7 jours (rétention workflow = 30 jours).

## Rollback Worker JavaScript

Le workflow KV restaure **uniquement** le namespace KV. Si `workers/redkmotors-fr-redirect-kv.js` a été modifié et déployé (`deploy_worker=true`), un rollback KV **ne** ramène **pas** l’ancien script Worker.

### Procédure Worker

1. Identifier le commit **avant** le déploiement du nouveau Worker :
   ```bash
   git log --oneline -- workers/redkmotors-fr-redirect-kv.js
   ```
2. Restaurer le fichier puis redéployer :
   ```bash
   git checkout <commit-avant> -- workers/redkmotors-fr-redirect-kv.js
   export CLOUDFLARE_API_TOKEN=…
   npm run cf:deploy-headers
   ```
3. Ordre recommandé en incident :
   1. Rollback **KV** (`mode=rollback`) pour rétablir les mappings
   2. Rollback **Worker JS** si le comportement du script est en cause
   3. Vérifier une URL prioritaire : `curl -sI https://redkmotors.fr/blog/<slug>/`

### Note

Ne pas mélanger un Worker neuf avec un KV ancien (ou l’inverse) sans vérifier : le Worker actuel lit le KV **avant** la normalisation `.html` ; un Worker antérieur peut se comporter différemment.

## CLI local (deploy)

```bash
npm ci
npm run build
npm run test:blog-migration
npm run test:kv-restore
npm run redirects:kv-shards

# 1) Backup seul
node scripts/deploy-kv-shards.js --backup-only --dir workers/kv-backup
# Copier/archiver workers/kv-backup/ avant la suite

# 2) Upload
node scripts/deploy-kv-shards.js --upload-only

# 3) Worker
npm run cf:deploy-headers

# 4) Verify exhaustif
npm run verify:blog-redirects:prod:all
```

## Interdits

- Déclencher l’upload sans backup + artefact
- Écraser KV avec un shard partiel
- Remplacer les 301 HTTP par meta-refresh / JS
- Wildcard `/blog/*` → `/blog/articles/*`
- Deux déploiements KV simultanés (évité par `concurrency`)
