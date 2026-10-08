# Checklist tests marketplace (à exécuter sur Supabase local + staging)

## Automatisé (repo)

```bash
npm run test:marketplace-security
```

Analyse statique des migrations + bootstrap edge. Pour les scénarios live, définir (projet **de test uniquement**) :

- `MARKETPLACE_TEST_URL` — ex. `http://127.0.0.1:54321`
- `MARKETPLACE_TEST_ANON_KEY`
- `MARKETPLACE_TEST_USER_A_EMAIL` / `MARKETPLACE_TEST_USER_A_PASSWORD`

Puis relancer la commande ci-dessus.

## Manuel

1. Visiteur anon : `select * from listings` → refus ; `listings_public` → OK publiées uniquement.
2. User A ne peut pas `select` listing draft de User B.
3. User ne peut pas `update listings set status='published'`.
4. User ne peut pas `insert user_roles` admin.
5. Annonce `pending_review` absente de `listings_public` et URL slug non servie.
6. Photos bucket private : URL signée requise ; anon → 403.
7. `submit_listing_for_review` incrémente version ; modération sur mauvaise version → 409 (edge).
8. Consentements : insert sans case cochée par défaut au signup (UI) + trace `consent_records`.
9. Export CSV : edge admin only, journalisation.
10. `npm run build` site Eleventy : OK avec `marketplace.enabled: false`.
