# Mise en place — ordre d’exécution

## A. Local (aujourd’hui, sans cloud)

PowerShell, à la racine du repo :

```powershell
.\scripts\setup-marketplace-local.ps1
```

Puis **2ᵉ terminal** :

```powershell
npm run dev:marketplace-local
```

Ouvrir l’URL `[11ty] Server at http://localhost:…/` → `/achat-revente/compte/`  
Mot de passe : `TestMarketplace-Local-2026!`

Recette manuelle : `RECETTE_QUALIFICATION.md`.

---

## B. Préprod Supabase (votre accord + token)

1. Créer un **Access Token** : [Supabase Account → Tokens](https://supabase.com/dashboard/account/tokens)
2. **Org ID** : Dashboard → Organization Settings
3. PowerShell :

```powershell
$env:SUPABASE_ACCESS_TOKEN="sbp_..."
$env:SUPABASE_ORG_ID="..."
$env:MARKETPLACE_PREPROD_SETUP_CONFIRM="create-preprod-redkmotors"
node scripts/marketplace-setup-preprod.mjs
```

→ Crée le projet (si absent), écrit `.env.preprod.local`, migrations, Edge Functions.

4. Configurer Auth URL + SMTP dans le dashboard Supabase.
5. Copier les valeurs de `.env.preprod.local` vers **GitHub Secrets** (`SECRETS_AND_CI.md`).

---

## C. Site préprod + protection

Sans automatisation dans ce repo (comptes Cloudflare requis) :

1. Projet **Cloudflare Pages** → déployer l’artifact du workflow **Marketplace preprod build** (`PREPROD-OK`)
2. Custom domain `preprod.redkmotors.fr` (DNS **après** validation)
3. **Zero Trust Access** sur ce hostname (`PREPROD_PLAN.md`)
4. Worker `marketplace-listing` sur `/achat-revente/vehicules/*`

---

## D. CI GitHub

Branche poussée : **`feat/marketplace-occasions`** →  
https://github.com/Phantom942/REDK-MOTORS/compare/main...feat/marketplace-occasions?expand=1

(Ouvrir le lien → **Create pull request**. `gh auth login` seulement si vous voulez la CLI.)

- **Marketplace validation** : se lance sur push/PR
- **Preprod build** : Actions → manuel → saisir `PREPROD-OK`

---

## E. Production marketplace (plus tard)

Projet Supabase **prod** séparé, `MARKETPLACE_BUILD_TARGET=production`, Worker sur `redkmotors.fr`, `site.json` ou build enable — **uniquement** après recette préprod OK.
