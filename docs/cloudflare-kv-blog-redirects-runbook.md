# Runbook — déploiement KV / Worker redirections blog

## Ordre obligatoire

1. Merger la PR GitHub (Pages build + HTML/sitemap/schémas)
2. Attendre le déploiement GitHub Pages (smoke Pages OK)
3. **Sauvegarder** les shards KV distants actuels
4. Régénérer les shards locaux depuis le code mergé
5. Uploader **tous** les shards générés (pas seulement `r:b` si d’autres ont changé)
6. Déployer le Worker si le JS a changé
7. Lancer `npm run verify:blog-redirects:prod` (échec si 404)
8. Search Console : inspection des nouvelles URL + suivi 404

## Prérequis

- `npx wrangler login` ou `CLOUDFLARE_API_TOKEN` avec droits Workers + KV
- Namespace id : `5d9807d363a24a089326f8d24f4f340c` (voir `workers/wrangler.toml`)

## Sauvegarde (rollback)

```bash
mkdir -p /tmp/redk-kv-backup-$(date +%Y%m%d)
cd workers
# Lister les clés r:*
npx wrangler kv key list --namespace-id=5d9807d363a24a089326f8d24f4f340c --remote | tee /tmp/redk-kv-backup-$(date +%Y%m%d)/keys.json

# Exporter chaque shard existant (exemple)
for key in r:a r:b r:c r:d r:f r:g r:j r:l r:r r:en r:eq r:ex0 r:ex1 r:ex2 r:ex3; do
  npx wrangler kv key get --namespace-id=5d9807d363a24a089326f8d24f4f340c "$key" --remote \
    > "/tmp/redk-kv-backup-$(date +%Y%m%d)/${key//:/_}.json" || true
done
```

Conserver ce dossier jusqu’à validation GSC (≥ 7 jours).

## Régénération + upload

```bash
npm ci
npm run build
npm run test:blog-migration
npm run redirects:kv-shards
# Inspecter workers/kv-shards/ avant upload
ls -la workers/kv-shards/

cd workers
# Upload CHAQUE fichier généré — ne pas omettre de shards
for f in kv-shards/r-*.json; do
  key=$(basename "$f" .json | sed 's/-/:/')
  echo "PUT $key ← $f"
  npx wrangler kv key put --namespace-id=5d9807d363a24a089326f8d24f340c "$key" --path="$f" --remote
done

# Si workers/redkmotors-fr-redirect-kv.js a changé :
npx wrangler deploy
```

## Vérification

```bash
npm run verify:blog-redirects:prod
# ou workflow GitHub : Verify blog redirects (prod)

curl -sI https://redkmotors.fr/blog/suppression-fap-controle-technique-2026/
# → 301 Location: https://redkmotors.fr/blog/articles/suppression-fap-controle-technique-2026/
```

## Rollback

```bash
BACKUP=/tmp/redk-kv-backup-YYYYMMDD
cd workers
for f in "$BACKUP"/r_*.json; do
  key=$(basename "$f" .json | sed 's/_/:/')
  npx wrangler kv key put --namespace-id=5d9807d363a24a089326f8d24f340c "$key" --path="$f" --remote
done
# Si besoin : redéployer l’ancien Worker depuis un commit précédent
git checkout <commit-avant> -- workers/redkmotors-fr-redirect-kv.js
npx wrangler deploy
```

## Interdits

- Écraser KV avec un shard partiel sans avoir régénéré depuis `npm run build`
- Déployer sans sauvegarde
- Remplacer les 301 HTTP par meta-refresh / JS
- Wildcard `/blog/*` → `/blog/articles/*`
