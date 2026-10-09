# Ce dont l’agent / l’automate a besoin de vous

Tout le **code**, **scripts**, **CI** et **recette locale** sont prêts.  
Les étapes **cloud** exigent des **secrets** que seul vous possédez (ne les coller **pas** dans le chat — utilisez le terminal ou GitHub Secrets).

---

## Déjà fait sans vous

- Branche **`feat/marketplace-occasions`** poussée sur GitHub
- Workflows : `marketplace-validation.yml`, `marketplace-preprod-build.yml`
- Local : `npm run setup:marketplace-local` + E2E 19/19 (quand Docker tourne)
- Cloudflare : zone **redkmotors.fr** visible (lecture seule)

---

## 1. GitHub — ouvrir la PR (30 s)

**Action :** ouvrir et créer la PR  
https://github.com/Phantom942/REDK-MOTORS/compare/main...feat/marketplace-occasions?expand=1  

**Optionnel (pour l’agent en CLI) :** `gh auth login` ou variable **`GH_TOKEN`** (classic, scope `repo`).

---

## 2. Supabase — projet préprod (5 min)

**À fournir** (dans **votre** PowerShell, pas dans le chat) :

| Variable | Où la trouver |
|----------|----------------|
| **`SUPABASE_ACCESS_TOKEN`** | [Account → Access Tokens](https://supabase.com/dashboard/account/tokens) (`sbp_…`) |
| **`SUPABASE_ORG_ID`** | Dashboard → **Organization Settings** |

**Commande :**

```powershell
cd "…\REDK-MOTORS"
$env:SUPABASE_ACCESS_TOKEN = "sbp_…"   # coller ici localement
$env:SUPABASE_ORG_ID = "…"
$env:MARKETPLACE_PREPROD_SETUP_CONFIRM = "create-preprod-redkmotors"
npm run setup:marketplace-preprod
```

**Résultat attendu :** projet cloud + `.env.preprod.local` + migrations + Edge Functions.

Ensuite dans le **dashboard Supabase** (projet créé) :

- **Auth → URL** : Site `https://preprod.redkmotors.fr/` (même si DNS pas encore prêt)
- **SMTP** : Mailtrap / Resend sandbox pour emails test
- **Bootstrap admin** : `docs/marketplace/ADMIN_BOOTSTRAP.md`

---

## 3. GitHub Secrets — build préprod (5 min)

Repo → **Settings → Secrets and variables → Actions** → New repository secret :

| Secret | Source |
|--------|--------|
| `MARKETPLACE_PREPROD_SUPABASE_URL` | `.env.preprod.local` |
| `MARKETPLACE_PREPROD_ANON_KEY` | idem |
| `MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF` | idem (ref projet) |
| `MARKETPLACE_PRODUCTION_SUPABASE_PROJECT_REF` | vide ou ref prod future (garde-fou) |

Puis **Actions → Marketplace preprod build (artifact) → Run workflow** → saisir **`PREPROD-OK`**.

---

## 4. Cloudflare — Pages + domaine (10–15 min)

Le token Cursor actuel **ne peut pas créer** de projet Pages (droits insuffisants).

**Option A — Dashboard (recommandé)**

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create**
2. Connecter **GitHub** → repo `Phantom942/REDK-MOTORS`, branche **`feat/marketplace-occasions`**
3. Build :
   - Command : `npm ci && npm run bundle:marketplace && npm run build`
   - Output : `_site`
4. **Environment variables** (production) :
   - `MARKETPLACE_BUILD_ENABLE` = `1`
   - `MARKETPLACE_BUILD_TARGET` = `preprod`
   - `MARKETPLACE_SUPABASE_URL` = (préprod)
   - `MARKETPLACE_SUPABASE_ANON_KEY` = (préprod)
   - `MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF` = (ref)
5. **Custom domain** : `preprod.redkmotors.fr`
6. **Zero Trust → Access** : protéger `preprod.redkmotors.fr` (emails recette)

**Option B — Token API pour l’agent**

Créer un token : **My Profile → API Tokens** → template **Edit Cloudflare Workers** + permissions **Account → Cloudflare Pages → Edit**.

Donner le token **uniquement** via variable d’environnement locale `CLOUDFLARE_API_TOKEN` (ne pas committer). L’agent pourra alors créer le projet via API.

---

## 5. Recette manuelle locale (15 min, vous)

Mot de passe : `TestMarketplace-Local-2026!`

1. **3 vraies photos** — `mp-vendeur-a@test.local` → `/achat-revente/publier/`
2. **Valider dépôt-vente** — staff → admin dépôt-vente → mod → **Valider**

Répondre **OK/KO** à l’agent après coup.

---

## Ordre recommandé

1. PR GitHub  
2. `npm run setup:marketplace-preprod`  
3. Secrets GitHub + workflow build artifact  
4. Cloudflare Pages + Access  
5. Smoke : `npm run test:marketplace:preprod` (avec vars de `.env.preprod.local`)  
6. Essais manuels local  

---

## Ce que vous pouvez me dire dans le chat (sans secrets)

- « PR créée »  
- « Supabase script terminé » ou copie **uniquement** la **ref projet** (ex. `abcd1234…`), pas les clés  
- « Pages branchée »  
- Résultats essais manuels OK/KO  
