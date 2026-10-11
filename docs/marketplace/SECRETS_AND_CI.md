# Secrets, variables et CI marketplace

**Ne jamais committer** de clés. Modèle local : `marketplace/.env.example` → copier en `.env` / `.env.local` (gitignore).

## GitHub Actions — secrets à créer (quand préprod validée)

### Build Eleventy préprod (`build:marketplace-preprod`)

| Secret | Usage |
|--------|--------|
| `MARKETPLACE_PREPROD_SUPABASE_URL` | `https://<ref>.supabase.co` |
| `MARKETPLACE_PREPROD_ANON_KEY` | Clé anon projet **préprod** |

Workflow manuel : `.github/workflows/marketplace-preprod-build.yml` (artifact `_site`, **pas** de déploiement auto).

### Smoke préprod (optionnel en CI)

| Secret | Usage |
|--------|--------|
| `MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF` | Ref projet (garde-fou script) |
| `MARKETPLACE_PRODUCTION_SUPABASE_PROJECT_REF` | Ref prod (refus si confondue) |
| `MARKETPLACE_PREPROD_TEST_VENDOR_EMAIL` | Compte recette |
| `MARKETPLACE_PREPROD_TEST_MODERATOR_EMAIL` | Compte recette |
| `MARKETPLACE_PREPROD_TEST_PASSWORD` | Mot de passe recette |

Variable de run (pas secret) : `MARKETPLACE_PREPROD_ALLOW_RUN=preprod-redkmotors-smoke`.

### Déploiement Supabase (depuis poste opérateur ou CI dédiée)

| Secret | Où |
|--------|-----|
| `SUPABASE_ACCESS_TOKEN` | CLI Supabase (dashboard account) |
| `MARKETPLACE_PREPROD_PROJECT_REF` | Ref projet préprod |

Confirmations **dans le script** (pas seulement le secret) :

- `MARKETPLACE_REMOTE_DEPLOY_CONFIRM=preprod-redkmotors-deploy`
- `MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF=<ref>`

### Production (plus tard — séparés)

| Secret | Usage |
|--------|--------|
| `MARKETPLACE_PROD_SUPABASE_URL` | Build prod marketplace |
| `MARKETPLACE_PROD_ANON_KEY` | Build prod |
| `MARKETPLACE_PRODUCTION_SUPABASE_PROJECT_REF` | Garde-fou scripts |

Tant que `site.json` a `"marketplace.enabled": false` et qu’aucun `MARKETPLACE_BUILD_ENABLE` prod n’est passé, **redkmotors.fr** reste vitrine sans backend actif.

## Supabase Dashboard (projet préprod)

Edge Function secrets (Functions → secrets) :

- `SUPABASE_SERVICE_ROLE_KEY`
- `MARKETPLACE_ADMIN_BOOTSTRAP_SECRET` (ponctuel)
- `MARKETPLACE_INTERNAL_SECRET` (si utilisé)
- `TURNSTILE_SECRET_KEY` (optionnel)

Auth → URL configuration :

- Site URL : `https://preprod.redkmotors.fr/`
- Redirect URLs : `https://preprod.redkmotors.fr/**`

SMTP : provider test (Mailtrap, Resend sandbox, etc.).

## Cloudflare (préprod — après accord)

Worker `marketplace-listing` :

- `SUPABASE_URL`, `SUPABASE_ANON_KEY` (préprod)
- `MARKETPLACE_ALLOW_INDEX=0`

Zero Trust Access : politique sur `preprod.redkmotors.fr` (+ bloquer URLs `*.pages.dev` non protégées — voir `PREPROD_PLAN.md`).

## Build local avec backend distant (debug rare)

```powershell
$env:MARKETPLACE_BUILD_TARGET="preprod"
$env:MARKETPLACE_BUILD_ENABLE="1"
$env:MARKETPLACE_SUPABASE_URL="https://<ref>.supabase.co"
$env:MARKETPLACE_SUPABASE_ANON_KEY="<anon>"
npm run build
```

Ou : `npm run build:marketplace-preprod` après export des variables ci-dessus.
