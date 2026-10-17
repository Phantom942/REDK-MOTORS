# Worker Cloudflare — redirects redkmotors.fr

Gère les 301 internes sur `redkmotors.fr` (legacy `.html`, tags blog, garage-proche, LP Ads…).

## Fichiers

| Fichier | Rôle |
|---|---|
| `redkmotors-fr-redirect-kv.js` | Worker déployé (KV redirects + headers `_headers`) |
| `wrangler.toml` | Config Wrangler (routes + binding KV) |

## Régénérer les shards KV

```bash
npm run build
npm run test:blog-migration
npm run redirects:kv-shards
```

Les JSON sont écrits dans `workers/kv-shards/` (gitignored).  
Le shard **`r:b`** contient notamment les 301 `/blog/<slug>/` → `/blog/articles/<slug>/` (articles migrés uniquement).

Upload (exemple shard blog) :

```bash
cd workers
npx wrangler login
npx wrangler kv key put --namespace-id=5d9807d363a24a089326f8d24f4f340c "r:b" --path=kv-shards/r-b.json --remote
# … répéter pour chaque shard (r:a, r:c, r:en, r:ex0, …)
```

Table de contrôle migration blog : `blog-migration-redirects.csv` (généré au build).

## Déployer le Worker

```bash
cd workers
npx wrangler deploy
```

Le Worker lit d’abord le mapping KV (y compris les `.html`), puis seulement ensuite applique la normalisation générique `.html` → `/`. Ainsi `/blog/foo.html` peut faire **un seul** 301 vers `/blog/articles/foo/` si la clé est dans KV.

Ou via MCP Cloudflare / script :

```bash
npm run cf:deploy-headers   # CLOUDFLARE_API_TOKEN requis hors Cursor
```
