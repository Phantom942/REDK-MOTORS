# Validation locale marketplace

## Où s’exécutent les commandes

Les scripts npm/`node` lancés depuis Cursor utilisent **PowerShell Windows** dans le dossier du repo.  
Docker n’est utilisable que si le binaire `docker` répond dans **ce même environnement** (PATH ou chemin complet Docker Desktop).

Vérification :

```powershell
& "C:\Program Files\Docker\Docker\resources\bin\docker.exe" info
```

WSL sans distribution installée ne fournit pas Docker à l’agent tant qu’aucune distro n’est configurée.

## Dispositif reproductible

| Étape | Commande |
|--------|----------|
| Démarrer stack | `cd marketplace` puis `npx supabase start` |
| Reset (local **uniquement**) | `$env:MARKETPLACE_ALLOW_DB_RESET=1; node ..\scripts\marketplace-local-reset.mjs` |
| Seed comptes + rôles | `node ..\scripts\marketplace-local-seed.mjs` |
| Edge functions | `npx supabase functions serve --env-file .env.local` (2e terminal) |
| RLS rapide | `npm run test:marketplace-live` |
| E2E runtime | `npm run test:marketplace:e2e` |
| Orchestrateur | `npm run test:marketplace:local` (vérifie Docker, start, reset, seed, live) |

Emails : **Inbucket** http://127.0.0.1:54324 — pas de SMTP production.

Les scripts **refusent** toute URL qui n’est pas `127.0.0.1` ou `localhost`.

## Anciennes Edge Functions déployées

Supprimer du repo ≠ retirer du projet Supabase distant. Après déploiement, exécuter côté projet :

```bash
supabase functions delete publish-listing-photos
supabase functions delete purge-public-photos
```

Les versions locales répondent **410 Gone** si encore servies.

## Cache photos publiques

`serve-listing-photo` envoie `Cache-Control: public, max-age=60`.  
Cela n’ garantit pas un retrait global sous 60 s si un CDN intermédiaire ignore ou allonge le TTL — documenter toute purge Cloudflare en prod. Les réponses **404** après retrait utilisent `Cache-Control: no-store`.
