# Runbook — déploiement KV / Worker redirections blog

## Ordre obligatoire

1. Merger la PR GitHub (Pages build + HTML/sitemap/schémas)
2. Attendre le déploiement GitHub Pages (smoke Pages OK)
3. Lancer **manuellement** le workflow [Deploy blog redirects KV](https://github.com/Phantom942/REDK-MOTORS/actions/workflows/deploy-blog-redirects-kv.yml)
   - `mode=deploy`
   - `deploy_worker=true`
4. Le workflow :
   - build + `test:blog-migration`
   - **backup KV obligatoire** (échec = stop)
   - **publie l’artefact** `kv-backup-<run_id>` **avant** tout upload
   - upload shards + deploy Worker
   - `verify-blog-redirects-prod.js --all --strict` (234 anciennes + 78 nouvelles + 11 conservés)
5. Search Console : inspection des nouvelles URL + suivi 404

**Pas de déclenchement automatique sur push.**

## Prérequis

- Secret GitHub Actions `CLOUDFLARE_API_TOKEN` :
  - Workers Scripts:Edit
  - Workers KV Storage:Edit
- Namespace id : `5d9807d363a24a089326f8d24f4f340c` (voir `workers/wrangler.toml`)

## Rollback (fiable)

### Via GitHub Actions (préféré)

1. Noter le `run_id` du déploiement (URL du run, ou message d’échec « Rollback… rollback_run_id=… »)
2. Actions → **Deploy blog redirects KV** → Run workflow
   - `mode=rollback`
   - `rollback_run_id=<run_id>`
3. Le job télécharge l’artefact `kv-backup-<run_id>` et restaure toutes les clés.

### Via CLI local

```bash
# Télécharger l’artefact depuis le run (UI GitHub → Artifacts)
# ou depuis un backup local workers/kv-backup/

export CLOUDFLARE_API_TOKEN=…   # ne pas coller le token dans un chat
node scripts/deploy-kv-shards.js --restore --dir workers/kv-backup

# Si le Worker JS a changé et pose problème :
git checkout <commit-avant> -- workers/redkmotors-fr-redirect-kv.js
npm run cf:deploy-headers
```

Conserver l’artefact ≥ 7 jours (rétention workflow = 30 jours).

## CLI local (deploy)

```bash
npm ci
npm run build
npm run test:blog-migration
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
