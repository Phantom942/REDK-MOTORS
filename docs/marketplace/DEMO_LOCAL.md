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
node scripts/marketplace-functions-serve.mjs start   # attend la sonde HTTP
npm run bundle:marketplace                           # inclus dans dev:marketplace-local
npm run dev:marketplace-local
```

Eleventy : **http://localhost:8080** (ou **8081/8082** si le port est pris — lire la ligne `[11ty] Server at …`).

Mot de passe seed : `TestMarketplace-Local-2026!`

### Catalogue masqué (cause identifiée)

1. **`#marketplace-root` avait l’attribut HTML `hidden`** jusqu’à exécution JS → zone invisible si le script ne finissait pas.
2. **Import `@supabase/supabase-js` via esm.sh** dans `client.js` + import dynamique dans le catalogue → échec possible (réseau, CSP, outil embarqué) **sans message visible**.
3. **Corrections** : bundle local `marketplace.bundle.js` (esbuild, v. **2.49.1**), états chargement / vide / erreur + `<noscript>`, plus de dépendance esm.sh côté navigateur.

Mail de confirmation : **http://127.0.0.1:54324** (Inbucket).

## Parcours & URLs

| Zone | URL |
|------|-----|
| Catalogue + filtres | http://localhost:8082/achat-revente/vehicules/ |
| Fiche véhicule | http://localhost:8082/achat-revente/vehicules/{slug}/ |
| Déposer / modifier annonce | http://localhost:8082/achat-revente/publier/ |
| Compte vendeur | http://localhost:8082/achat-revente/compte/ |
| Modération / admin | http://localhost:8082/achat-revente/admin/ |
| Mail confirmation (Inbucket) | http://127.0.0.1:54324 |

Pour une annonce publiée par les tests : lancer `npm run test:marketplace:e2e` puis récupérer un `slug` via Supabase Studio (http://127.0.0.1:54323) table `listings` status `published`.

## Arrêt functions

```bash
node scripts/marketplace-functions-serve.mjs stop
```

Logs horodatés : `.logs/marketplace-functions-serve-*.log`
