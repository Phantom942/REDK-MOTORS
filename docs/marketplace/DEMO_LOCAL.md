# Démonstration locale marketplace

Comptes seed (`marketplace-local-seed.mjs`) — **local uniquement**, mot de passe par défaut `TestMarketplace-Local-2026!`.

| Rôle | Email |
|------|--------|
| Vendeur A | `mp-vendeur-a@test.local` |
| Vendeur B | `mp-vendeur-b@test.local` |
| Modérateur | `mp-moderateur@test.local` |
| Admin | `mp-admin@test.local` |
| Staff garage | `mp-staff@test.local` |

## Démarrage

```bash
cd marketplace && npx supabase start
node scripts/marketplace-functions-serve.mjs start
npm run dev:marketplace-local
```

Eleventy : **http://localhost:8080** ou **8081** si 8080 est occupé (port affiché au lancement).

Mail de confirmation : **http://127.0.0.1:54324** (Inbucket).

## Parcours & URLs

| Zone | URL |
|------|-----|
| Catalogue + filtres | http://localhost:8081/achat-revente/vehicules/ |
| Fiche véhicule | http://localhost:8081/achat-revente/vehicules/{slug}/ (après publication seed ou E2E) |
| Déposer / modifier annonce | http://localhost:8081/achat-revente/publier/ |
| Compte vendeur | http://localhost:8081/achat-revente/compte/ |
| Modération / admin | http://localhost:8081/achat-revente/admin/ |

Pour une annonce publiée par les tests : lancer `npm run test:marketplace:e2e` puis récupérer un `slug` via Supabase Studio (http://127.0.0.1:54323) table `listings` status `published`.

## Arrêt functions

```bash
node scripts/marketplace-functions-serve.mjs stop
```

Logs horodatés : `.logs/marketplace-functions-serve-*.log`
