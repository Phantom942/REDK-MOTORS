# Préproduction marketplace (isolée, non activée)

Document de préparation — **ne pas confondre avec la production** du site vitrine ni avec la base Supabase locale de développement.

## Objectifs

- Environnement **dédié** (projet Supabase + déploiement statique + domaine ou sous-domaine séparés).
- **Données et comptes de test** distincts des comptes réels et de la prod.
- **Accès restreint** (authentification HTTP basique, allowlist IP, ou VPN) — le `noindex` complète la discrétion SEO mais **ne protège pas** l’accès.
- **Emails** capturés ou routés vers des boîtes de test (pas d’envoi massif vers de vrais clients).
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
| **Tests locaux** | `cd marketplace` puis `npx supabase functions serve --env-file .env.local` — sert les fonctions sur la stack Docker locale. **Ce n’est pas un déploiement.** |
| **Préprod / prod** | `supabase functions deploy <nom>` (ou pipeline CI) vers le **projet Supabase cible**, avec secrets du projet (`SUPABASE_SERVICE_ROLE_KEY`, etc.) configurés dans le dashboard Supabase. |

Fonctions attendues côté parcours actuel : `process-listing-photo`, `serve-listing-photo`, `moderate-listing`, `admin-export`, `bootstrap-admin` (ponctuel).

### Anciennes fonctions `publish-listing-photos` et `purge-public-photos`

- Dans **ce dépôt**, elles existent encore pour répondre **410 Gone** si quelqu’un les invoque.
- **Sans objet** tant qu’elles n’ont **jamais été déployées** sur un projet Supabase distant (cas typique : uniquement local). Si un ancien déploiement existait, les supprimer côté projet : `supabase functions delete publish-listing-photos` (idem `purge-public-photos`).

## Déploiement site statique (préprod)

1. Créer le projet Supabase préprod, appliquer les migrations (`supabase db push` ou lien CI).
2. Déployer les Edge Functions vers ce projet.
3. Bootstrap admin une fois (`ADMIN_BOOTSTRAP.md`) avec un compte admin **préprod**.
4. Build Eleventy avec `marketplace.enabled: true`, URL et anon key **préprod** (variables d’environnement de build).
5. Publier `_site` sur l’hébergement préprod (même chaîne que le site vitrine, branche ou projet séparé).
6. Restreindre l’accès (basic auth Cloudflare, etc.) et ajouter `noindex` sur les routes marketplace si souhaité.

## Retour arrière

- **Front** : redeploy du commit ou artefact précédent ; remettre `marketplace.enabled: false` si coupure totale.
- **Backend** : migrations réversibles avec prudence ; en urgence, désactiver le flag site + révoquer les clés anon préprod dans le dashboard (rotation).
- **Données** : snapshot Supabase avant migration majeure (backup projet).

## Cache et retrait public

- `serve-listing-photo` : `Cache-Control: public, max-age=60` pour les photos **publiées**.
- Après retrait ou dépublication, la fonction renvoie **404** avec `Cache-Control: no-store`, mais les caches intermédiaires (navigateur, CDN) peuvent **continuer à servir une copie jusqu’à expiration du TTL** — en pratique jusqu’à ~60 s sur ce réglage, **plus long** si un CDN applique un TTL plus élevé ou ignore `no-store` sur d’anciennes réponses 200.
- **Ne pas promettre** un retrait visuel immédiat mondial sans purge CDN explicite (Cloudflare : purge par URL ou tag, selon architecture — coût et quotas à vérifier sur le compte concerné).

## Fiches annonces HTML (Worker / CDN)

Voir `LISTING_PAGES.md` : génération SSR/Worker optionnelle pour le catalogue public. Préprod doit utiliser le **même modèle de cache** que la prod cible pour valider les délais de retrait.

## Coûts

- Ne souscrire à un **plan payant** Supabase ou Cloudflare que si un besoin est identifié (volume storage photos, egress, backups, Workers payants).
- Les tarifs changent : consulter les grilles officielles au moment du go-live — **aucun montant ici n’est garanti**.

## Checklist avant ouverture préprod restreinte

- [ ] Projet Supabase préprod créé, migrations appliquées
- [ ] RLS + tests `npm run test:marketplace:local` passés contre une stack locale (référence), puis smoke test manuel préprod
- [ ] Edge Functions déployées sur le projet préprod
- [ ] Secrets CI séparés prod / préprod
- [ ] Comptes seed **préprod** distincts (`@test` ou domaine dédié)
- [ ] Restriction d’accès réseau / auth, plus noindex
- [ ] SMTP ou provider email de test configuré (confirmations, reset)
- [ ] Procédure de rollback documentée et testée (redeploy front)
