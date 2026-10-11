# Fiches véhicules marketplace — architecture

## Décision

| Option | Retrait sans rebuild GH Pages | SEO (HTML complet) | Alignement infra |
|--------|------------------------------|--------------------|------------------|
| HTML statique Eleventy (une page par slug) | Non — retrait = rebuild | Oui | GitHub Pages seul |
| **Worker Cloudflare sur `/achat-revente/vehicules/*`** | **Oui** — RPC Supabase + cache 60 s | **Oui** (SSR) | Déjà Workers (redirects, headers) |

**Choix retenu : Worker SSR** + middleware identique en dev Eleventy (`MARKETPLACE_TEST_URL`).

Coût : plan Workers existant (pas de service payant supplémentaire tant que le trafic reste modéré). Secrets à configurer au déploiement : `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `MARKETPLACE_ALLOW_INDEX=0` jusqu’à lancement.

**Sans objet actuellement** : aucun Worker « marketplace-listing » déployé en production (seuls redirects/headers documentés dans `workers/README.md`).

## URLs

- Catalogue : `/achat-revente/vehicules/` (noindex, filtres query string non indexés)
- Fiche : `/achat-revente/vehicules/{slug}/` — slug stable tant que l’annonce est publiée ; retirée / vendue / refusée → **404** (texte et coordonnées absents de `listings_public` et RPC)

## Données

- RPC `get_public_listing_by_slug` — description complète + photos via `listing_public_photos`
- RPC `list_published_listing_sitemap_rows` — alimente `sitemap-marketplace.xml` (`npm run marketplace:sitemap`)

## Fichiers

- Rendu HTML partagé : `scripts/lib/marketplace-listing-page.mjs`
- Worker (non déployé par défaut) : `workers/marketplace-listing/`
- Dev local : middleware dans `.eleventy.js` quand `dev:marketplace-local`

## Indexation

Tant que `MARKETPLACE_ALLOW_INDEX !== 1` : `noindex, follow` sur les fiches SSR et pas de lien public vers `sitemap-marketplace.xml` dans `robots.txt`.
