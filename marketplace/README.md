# Marketplace véhicules — RED-K MOTORS

Espace annonces (particuliers + dépôt-vente garage) branché sur le site statique Eleventy (GitHub Pages) via **Supabase** (auth, PostgreSQL, storage) et **Edge Functions** (logique serveur, modération, exports).

## Pourquoi cette stack

| Besoin | Solution |
|--------|----------|
| Comptes, email, reset MDP | Supabase Auth |
| Annonces, modération, consentements | PostgreSQL + RLS |
| Photos privées / publiques | Storage buckets + policies |
| Secrets admin, export CSV, transitions de statut | Edge Functions (service role) |
| Site vitrine existant | Eleventy inchangé ; pages `/achat-revente/*` + JS |
| SEO fiches véhicule | Pages HTML générées au publish (webhook → CI) **ou** Worker SSR (phase 2) |

**Coûts indicatifs (2026)** : Supabase Free tier suffit pour lancer (limites auth/storage/API) ; passage Pro si trafic ou stockage photos élevé. Aucun service payant activé par le code sans configuration explicite.

## Prérequis externes (bloquant pour prod)

1. Projet Supabase créé par le client (région EU recommandée).
2. SMTP / templates email Supabase (confirm, reset) — pas d’envoi vers de vrais emails en dev sans config.
3. Variables d’environnement (voir `.env.example`) — **jamais** commitées.
4. Premier administrateur : voir `docs/marketplace/ADMIN_BOOTSTRAP.md`.
5. Turnstile (Cloudflare) optionnel mais recommandé pour inscription / soumission.

## Démarrage local

**Windows :** Docker Desktop obligatoire pour `supabase start`. CLI installable via `winget install Supabase.CLI` ou `npx supabase` (CLI seul ne suffit pas sans Docker).

Emails de test : Inbucket sur `http://127.0.0.1:54324` après `supabase start` — pas de SMTP production.

```bash
cd marketplace
cp .env.example .env   # remplir localement, ne pas committer

supabase start         # Docker requis
# db reset UNIQUEMENT si l'URL projet = 127.0.0.1 / localhost
supabase db reset
supabase functions serve

# Tests (depuis la racine du repo)
npm run test:marketplace-security
npm run test:marketplace-live   # variables MARKETPLACE_TEST_* — localhost only
```

Le site Eleventy consomme uniquement la **clé anon** + URL projet (publiques). Toute opération sensible passe par Edge Functions.

## Lancement production

- Tant que `site.marketplace.enabled` est `false` dans `src/_data/site.json` : pages marketplace en **noindex**, service « bientôt disponible » conservé sur la landing actuelle.
- **Ne pas** retirer le `noindex` de `/achat-revente/` sans annonces réelles modérées.
- Déploiement branche `feat/marketplace-occasions` : **interdit sur `main` sans accord explicite** du client.

## Retour arrière

- Désactiver le flag `marketplace.enabled`.
- Retirer les routes Worker marketplace (si déployées).
- Les données Supabase restent ; export possible avant suppression projet.
