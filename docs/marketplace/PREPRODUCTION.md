# Préproduction marketplace (isolée, non activée)

Document de préparation — **ne pas confondre** avec la production du site vitrine **https://redkmotors.fr/** ni avec la base Supabase locale.

**Proposition opérationnelle détaillée** : `PREPROD_PLAN.md` (sous-domaine `preprod.redkmotors.fr`, hébergement préprod, Workers, Auth, tests distants).  
**Runbook (Docker, données, CI)** : `OPERATIONS.md` · **Secrets** : `SECRETS_AND_CI.md`.

## Contexte infrastructure actuel

| Élément | Réalité aujourd’hui |
|---------|---------------------|
| **Domaine** | **redkmotors.fr** (sans tiret) |
| **Site vitrine** | **GitHub Pages** (+ proxy / Workers Cloudflare pour redirects et en-têtes — voir `workers/README.md`) |
| **Marketplace prod** | Non activée sur le domaine principal ; cible : **`/achat-revente/`** sous redkmotors.fr |
| **Préprod proposée** | **`preprod.redkmotors.fr`** — hébergement **distinct** (Cloudflare Pages recommandé dans `PREPROD_PLAN.md`), **pas** un remplacement de GitHub Pages pour la prod |

Cloudflare Pages peut servir **uniquement** la préprod ; ce n’est **pas** l’hébergeur actuel du site principal.

## Objectifs

- Environnement **dédié** (projet Supabase + déploiement statique + sous-domaine séparé).
- **Données et comptes de test** distincts des comptes réels et de la prod.
- **Accès restreint** via un mécanisme explicite (recommandation : **Cloudflare Zero Trust Access** sur `preprod.redkmotors.fr` — voir `PREPROD_PLAN.md`) ; le `noindex` complète la discrétion SEO mais **ne protège pas** l’accès.
- **Emails** capturés ou routés vers des boîtes de test.
- **Secrets** uniquement en CI / hébergeur — jamais dans le dépôt ni dans le bundle statique public.

## Séparation des variables

| Contexte | URL Supabase | Clé anon | Service role | Site Eleventy |
|----------|--------------|----------|--------------|---------------|
| Local dev | `127.0.0.1:54321` | `supabase status` | `.env.local` (gitignore) | `site.js` + `MARKETPLACE_TEST_*` |
| Préprod | Projet Supabase **préprod** | Secret CI → build | Edge Functions + scripts admin **uniquement** | `marketplace.enabled: true` + URL/clé anon préprod |
| Production | Projet Supabase **prod** | Secret CI distinct | Idem, rotation séparée | Même schéma, valeurs différentes |

Ne jamais réutiliser la service role en front. La clé anon est publique par design ; la sécurité repose sur RLS et policies.

## Edge Functions : local vs hébergé

| Usage | Commande / action |
|--------|-------------------|
| **Développement local** | `cd marketplace` puis `npx supabase functions serve --env-file .env.local` — stack Docker locale. **Ce n’est pas un déploiement.** |
| **Préprod / prod** | `supabase functions deploy <nom> --project-ref <ref>` (ou pipeline CI) vers le **projet Supabase cible**, secrets configurés dans le dashboard Supabase (`SUPABASE_SERVICE_ROLE_KEY`, etc.). |

Fonctions attendues côté parcours actuel : `process-listing-photo`, `serve-listing-photo`, `moderate-listing`, `admin-export`, `bootstrap-admin` (ponctuel).

### Anciennes fonctions `publish-listing-photos` et `purge-public-photos`

- Dans **ce dépôt**, elles existent encore pour répondre **410 Gone** si quelqu’un les invoque.
- **Sans objet** tant qu’elles n’ont **jamais été déployées** sur un projet Supabase distant. Si un ancien déploiement existait : `supabase functions delete publish-listing-photos` (idem `purge-public-photos`).

## Déploiement site statique (préprod)

1. Créer le projet Supabase préprod, appliquer les migrations (`supabase db push` ou CI).
2. **Déployer** les Edge Functions vers ce projet (CLI / CI — pas `functions serve`).
3. Bootstrap admin une fois (`ADMIN_BOOTSTRAP.md`) avec un compte admin **préprod**.
4. Build Eleventy avec `marketplace.enabled: true`, URL et anon key **préprod** (variables d’environnement de build).
5. Publier `_site` sur l’**hébergement préprod** (projet Cloudflare Pages ou autre, **séparé** de GitHub Pages prod).
6. Configurer protection d’accès + `noindex` marketplace ; Auth Supabase : Site URL `https://preprod.redkmotors.fr/`.

## Tests

| Script | Cible |
|--------|--------|
| `npm run test:marketplace:local` | **Local uniquement** — reset + seed — **ne jamais** pointer vers préprod |
| `npm run test:marketplace:e2e` | Local (runtime, sans reset orchestré) |
| `npm run test:marketplace:preprod` | Préprod Supabase autorisée — **sans reset** — voir `PREPROD_PLAN.md` |

Recette UI locale qualifiée dans **`RECETTE_QUALIFICATION.md`** (limites DataTransfer / approbation API).

## Retour arrière

- **Front** : redeploy du commit ou artefact précédent ; remettre `marketplace.enabled: false` si coupure totale.
- **Backend** : migrations réversibles avec prudence ; en urgence, désactiver le flag site + révoquer les clés anon préprod (rotation).
- **Données** : snapshot Supabase avant migration majeure (backup projet).

## Cache et retrait public

Comportement **nominal** (sans purge CDN manuelle à chaque retrait) :

| Ressource | Après retrait / dépublication | TTL cache configuré |
|-----------|------------------------------|---------------------|
| Photo (`serve-listing-photo`) | **404** + `Cache-Control: no-store` | Les anciens **200** avaient `public, max-age=60` → visibilité résiduelle **≤ ~60 s** sur caches respectueux |
| Fiche HTML (Worker SSR) | **404** + `no-store` | Idem **~60 s** sur HTML précédemment mis en cache |
| Copie déjà sur appareil visiteur | N/A | **Non réversible** — ne pas promettre effacement |

Un CDN intermédiaire **peut** prolonger un 200 si un TTL custom a été appliqué hors repo ; la config actuelle vise **60 s**. Purge CDN : **urgence seulement**, pas le flux standard vendeur/modération.

Voir aussi `PHOTOS.md` et `LISTING_PAGES.md`.

## Fiches annonces HTML (Worker / CDN)

Worker SSR sur `/achat-revente/vehicules/*` — préprod et prod cible partagent le même modèle de cache (60 s) pour valider les délais de retrait. Prod vitrine reste GitHub Pages ; le Worker intercepte uniquement le pattern fiches.

## Coûts

- Ne souscrire à un **plan payant** Supabase, Cloudflare ou email que si un besoin est identifié (storage photos, egress, backups, utilisateurs Access > free tier).
- Ordre de grandeur et services listés dans **`PREPROD_PLAN.md`** — revalider les grilles officielles au go-live.

## Checklist avant ouverture préprod restreinte

- [ ] Projet Supabase préprod créé, migrations appliquées
- [ ] RLS + `npm run test:marketplace:local` OK en local (référence), puis `npm run test:marketplace:preprod` sur préprod
- [ ] Edge Functions **déployées** (CLI) sur le projet préprod
- [ ] Secrets CI séparés prod / préprod
- [ ] Comptes recette **préprod** distincts (pas `@test.local`)
- [ ] Cloudflare Access (ou mécanisme retenu) + noindex ; callbacks Auth / images Supabase non bloqués
- [ ] SMTP ou provider email de test configuré
- [ ] Manipulations manuelles `RECETTE_QUALIFICATION.md` OK (local puis optionnel préprod)
- [ ] Procédure de rollback documentée (redeploy front)
