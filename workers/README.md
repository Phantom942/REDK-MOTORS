# Worker Cloudflare — redirects redkmotors.fr

Gère les 301 internes sur `redkmotors.fr` (legacy `.html`, tags blog, garage-proche, LP Ads…).

## Fichiers

| Fichier | Rôle |
|---|---|
| `redkmotors-fr-redirect-kv.js` | Worker déployé (KV + règle `.html`) |
| `wrangler.toml` | Config Wrangler (routes + binding KV) |

## Régénérer les shards KV

```bash
npm run build
npm run redirects:kv-shards
```

Les JSON sont écrits dans `workers/kv-shards/` (gitignored). Upload :

```bash
cd workers
npx wrangler login
npx wrangler kv key put --namespace-id=5d9807d363a24a089326f8d24f4f340c "r:b" --path=kv-shards/r-b.json --remote
# … répéter pour chaque shard (r:a, r:c, r:en, r:ex0, …)
```

## Déployer le Worker

```bash
cd workers
npx wrangler deploy
```

Ou via `scripts/deploy-fr-redirect-worker.mjs` (token API).
