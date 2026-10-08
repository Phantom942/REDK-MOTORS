# Confidentialité des vues publiques (`listings_public`)

## Cause de l’alerte « moderation_notes_internal » (2026-04-08)

Le test live `marketplace-security-test.mjs` échouait alors que la vue **n’expose pas** la colonne `moderation_notes_internal`.

### Vérifications effectuées

1. **Définition PostgreSQL effective** (local) : `listings_public` ne sélectionne que des champs catalogue (identifiant, slug, véhicule, prix, contact vendeur, dates). Pas de `moderation_notes_internal` ni `registration_fingerprint`.

2. **API PostgREST** :
   - `GET /rest/v1/listings_public?select=*` → lignes sans champ interne.
   - `GET ...?select=id,moderation_notes_internal` → **HTTP 400**, corps JSON :
     `"column listings_public.moderation_notes_internal does not exist"`.

3. **Heuristique défectueuse** : l’ancien test considérait un échec si la **chaîne** `moderation_notes_internal` apparaissait dans le corps de réponse. Or PostgREST inclut ce nom dans le **message d’erreur** lorsqu’on demande une colonne absente — ce qui prouve justement le refus, pas une fuite.

### Contrôle corrigé

Le test comportemental exige :

- statut **400** (ou équivalent) pour une projection explicite du champ interne ;
- pour `select=*`, aucune clé `moderation_notes_internal` dans les objets JSON retournés ;
- le vendeur ne peut pas lire `moderation_notes_internal` via `listings` en REST client (RLS + colonnes modérateur).

Les notes internes restent accessibles aux modérateurs via `listings` (policy `is_moderator`), jamais via `listings_public`.
