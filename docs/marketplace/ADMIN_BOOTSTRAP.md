# Création du premier administrateur (procédure opérateur)

**Un visiteur du site ne peut pas devenir admin.** La promotion ne se fait pas via le JWT de l’appelant.

## Étapes

1. Créer l’utilisateur cible dans **Supabase Auth** (Dashboard → Authentication) ou via inscription contrôlée sur un environnement de staging.
2. Confirmer l’email de cet utilisateur.
3. Définir les secrets Edge Function :
   - `MARKETPLACE_ADMIN_BOOTSTRAP_SECRET` (long, aléatoire)
   - optionnel : `MARKETPLACE_BOOTSTRAP_ADMIN_EMAIL` (email exact autorisé)
4. Appeler **une seule fois** la function `bootstrap-admin` :

```bash
curl -X POST "https://<project>.supabase.co/functions/v1/bootstrap-admin" \
  -H "Content-Type: application/json" \
  -H "X-Bootstrap-Secret: <secret>" \
  -d '{"userId":"<uuid-utilisateur-cible>"}'
```

5. La function désactive ensuite `admin_bootstrap_enabled` dans `platform_settings`.
6. **Rotationner** `MARKETPLACE_ADMIN_BOOTSTRAP_SECRET` après usage.

## Alternative sans Edge Function

Insertion SQL one-shot en local/staging (service role) :

```sql
insert into public.user_roles (user_id, role, granted_by)
values ('<uuid>', 'admin', '<uuid>'),
       ('<uuid>', 'moderator', '<uuid>');
```
