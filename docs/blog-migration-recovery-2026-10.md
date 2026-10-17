# Récupération SEO — migration blog `/blog/<slug>/` → `/blog/articles/<slug>/`

Date : 2026-10-17  
Branche : `cursor/blog-redirect-recovery-b227`  
**Aucun déploiement KV / production dans cette PR** — validation explicite requise.

## Diagnostic (confirmé)

| Hypothèse | Résultat |
|---|---|
| `collectBlogArticleRedirects()` cherche `permalink: /blog/<slug>/` | **Vrai** — les 78 articles migrés n’ont plus ce permalink → **0 règle** de migration générée |
| Anciennes URL GSC en 404 | **Confirmé** live pour FAP, recharge clim, révision 60k, vidange |
| Nouvelles URL sous `/blog/articles/` | **200** |
| 11 articles restent volontairement sous `/blog/<slug>/` | **Conservés** (permalink explicite) — non redirigés |

Baisse de trafic 15/09–14/10 : **hypothèse** (saisonnalité clim + SERP + 404 possibles). Non présentée comme cause unique.

## Table exacte

- Générée au build : `blog-migration-redirects.csv` (234 URL sources = 78 × 3 variantes)
- Intégrée à `cloudflare-bulk-redirects.csv` / `cloudflare-bulk-redirects-import.csv`
- Logique maintenable : `scripts/lib/blog-article-redirects.js`

Exemples prioritaires :

| old | new |
|---|---|
| `/blog/suppression-fap-controle-technique-2026/` | `/blog/articles/suppression-fap-controle-technique-2026/` |
| `/blog/prix-recharge-climatisation-94/` | `/blog/articles/prix-recharge-climatisation-94/` |
| `/blog/revision-60000-km-checklist/` | `/blog/articles/revision-60000-km-checklist/` |
| `/blog/combien-coute-vidange-voiture/` | `/blog/articles/combien-coute-vidange-voiture/` |

Pas de wildcard `/blog/*` → `/blog/articles/*`.

## Changements code

1. **Redirects** — `scripts/generate-legacy-redirects.js` + lib blog
2. **Worker** — lookup KV **avant** normalisation `.html` (301 unique)
3. **JSON-LD / fil d’Ariane** — `src/blog/blog.11tydata.js` dérive `@id` / dernier crumb de `page.url`
4. **Liens internes** — chemins `/blog/<slug>/` des articles migrés → `/blog/articles/<slug>/`
5. **Tests** — `npm run test:blog-migration` (+ étape CI build)
6. **Smoke prod** — 4 nouvelles URL 200 ; 4 anciennes 301 (sinon warning KV)

## Sitemap

`sitemap-blog.xml` utilise `collections.blog` → `post.url` (chemins `/blog/articles/…` pour les migrés). Pas d’URL 404 dans le sitemap généré.

## Après merge — commandes KV (manuel)

```bash
npm ci
npm run build
npm run test:blog-migration
npm run redirects:kv-shards
cd workers
npx wrangler kv key put --namespace-id=5d9807d363a24a089326f8d24f4f340c "r:b" --path=kv-shards/r-b.json --remote
# puis les autres shards listés par redirects:kv-shards
npx wrangler deploy
```

Vérification :

```bash
curl -sI https://redkmotors.fr/blog/suppression-fap-controle-technique-2026/
# → 301 Location: https://redkmotors.fr/blog/articles/suppression-fap-controle-technique-2026/
curl -sI https://redkmotors.fr/blog/articles/suppression-fap-controle-technique-2026/
# → 200
```

## Checklist production

- [ ] Merge PR GitHub Pages
- [ ] Upload shards KV + deploy Worker
- [ ] curl -sI / -sIL sur les 4 slugs prioritaires
- [ ] Search Console : inspection des nouvelles URL + suivi 404 anciennes
- [ ] Resoumettre `sitemap-blog.xml`
- [ ] Conserver les 301 ≥ 1 an

## Anomalies restantes (hors P0)

- Photos / preuves locales GBP → P1 manuel
- Uniformiser horaires/avis affichés vs fiche Google → P1
- Contenu éditorial P2 après consolidation des 301
- GA4 / événements conversion → P3
