# Marketplace — opérations (local, préprod, prod)

Guide unique pour **où sont les données**, **à quoi sert Docker**, et **ce qui est automatisé**.  
Rien ici ne crée de compte cloud : exécution après votre accord (`PREPROD_PLAN.md`).

## Rôles des environnements

| | Local (recette) | Préprod | Production |
|---|-----------------|---------|------------|
| **Site** | `http://localhost:8080` (Eleventy) | `https://preprod.redkmotors.fr` (à créer) | `https://redkmotors.fr/achat-revente/` (GH Pages) |
| **Base + Auth + Storage** | Docker (`127.0.0.1:54321`) | Projet Supabase **dédié** | Projet Supabase **prod** séparé |
| **Docker Desktop** | **Oui** (obligatoire) | Non (cloud Supabase) | Non |
| **Comptes** | `@test.local` (seed) | `@recette…` | Vrais utilisateurs |
| **Emails** | Mailpit `http://127.0.0.1:54324` | SMTP test / sandbox | SMTP prod |

## Docker Desktop — à quoi ça sert ?

Sur **votre PC uniquement** :

1. `cd marketplace && npx supabase start` → Postgres, Auth, Storage, API locales.
2. `node scripts/marketplace-functions-serve.mjs start` → Edge Functions en dev (upload photos, modération, etc.).
3. `npm run dev:marketplace-local` → site + JS branchés sur cette base.

**Les clients finaux ne passent jamais par Docker.** En ligne, tout est sur **Supabase hébergé**.

### Démarrage local (checklist)

```powershell
# 1. Docker Desktop ouvert (icône verte)
cd "…\REDK-MOTORS\marketplace"
npx supabase start

cd ..
node scripts/marketplace-functions-serve.mjs start
npm run dev:marketplace-local
# Lire : [11ty] Server at http://localhost:XXXX/
```

Comptes : `docs/marketplace/DEMO_LOCAL.md` — mot de passe seed `TestMarketplace-Local-2026!`.

## Où sont les données utilisateur ?

| Donnée | Stockage |
|--------|----------|
| Email / mot de passe | **Supabase Auth** (table auth, gérée par Supabase) |
| Profil (nom, tél, ville) | PostgreSQL `profiles` |
| Annonces, statuts, modération | PostgreSQL `listings`, versions, RPC |
| Consentements marketing | PostgreSQL `consent_records` |
| Fichiers photo | **Storage** bucket privé + métadonnées `listing_photos` |
| Rôles admin / mod / staff | PostgreSQL `user_roles` |

Le site statique (GitHub Pages) **n’héberge pas** la base : il charge le JS avec l’URL + clé **anon** Supabase.

## Gestion automatique — ce qui existe déjà

| Processus | Comportement |
|-----------|--------------|
| Inscription / connexion / reset | Supabase Auth (+ emails quand SMTP configuré) |
| Déposer annonce → photos → soumettre | Front + RPC + Edge `process-listing-photo` |
| File modération Valider / Refuser | Panel admin + Edge `moderate-listing` |
| Retrait / vendu | RPC côté vendeur |
| Dépôt-vente garage | RPC `create_consignment_listing` + même pipeline |
| Photos publiques | Edge `serve-listing-photo` (404 si non publié) |
| Export CSV admin | Edge `admin-export` |

**Humain requis** : modération des annonces (pas de publication auto sans validation).

## Gestion automatique — à brancher (préprod / prod)

| Étape | Outil prévu | Doc / script |
|--------|-------------|--------------|
| Tests PR / manuel CI | GitHub Actions `marketplace-validation.yml` | `.github/workflows/` |
| Build site marketplace activé | `npm run build:marketplace-preprod` | `SECRETS_AND_CI.md` |
| Migrations BDD distantes | `npm run marketplace:supabase:push:preprod` | `scripts/marketplace-supabase-remote.mjs` |
| Déploiement Edge Functions | `npm run marketplace:supabase:functions:preprod` | idem |
| Smoke distant (sans reset) | `npm run test:marketplace:preprod` | `PREPROD_PLAN.md` |
| Premier admin | `bootstrap-admin` une fois | `ADMIN_BOOTSTRAP.md` |
| Site préprod | Cloudflare Pages (projet séparé) | `PREPROD_PLAN.md` |
| Fiches SEO sans rebuild | Worker `marketplace-listing` | `LISTING_PAGES.md` |

## Tests — ne pas confondre

| Commande | Cible | Reset base ? |
|----------|--------|--------------|
| `npm run test:marketplace:local` | **localhost** | **Oui** |
| `npm run test:marketplace:e2e` | localhost | Non |
| `npm run test:marketplace:preprod` | Supabase préprod autorisé | **Non** |

## Recette humaine restante (local)

Voir `RECETTE_QUALIFICATION.md` :

1. Trois **vraies** photos via « Ajouter des photos ».
2. **Valider** un dépôt-vente depuis le panel modération.

## Documents liés

- `PREPROD_PLAN.md` — architecture `preprod.redkmotors.fr`
- `PREPRODUCTION.md` — principes et checklist
- `SECRETS_AND_CI.md` — secrets GitHub / Supabase / Cloudflare
- `LOCAL_VALIDATION.md` — orchestrateur tests locaux
- `marketplace/README.md` — stack technique
