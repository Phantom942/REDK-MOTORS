# Préprod — 2 tokens puis une commande

Supabase est **déjà** prêt. Il reste **GitHub** (secrets + PR) et **Cloudflare** (site `preprod.redkmotors.fr`).

## 1. Token GitHub (1 min)

1. https://github.com/settings/tokens → **Generate new token (classic)**
2. Cochez : **repo**, **workflow**
3. **Copier** le token (`ghp_…`)

Terminal Cursor :

```powershell
cd "C:\Users\phant\Desktop\M I L L T E K\PHANTOM EMPIRE\4- RED-K MOTORS\REDK-MOTORS"
npm run store:github-token
```

(Presse-papiers = token, puis Entrée.)

## 2. Token Cloudflare (1 min)

1. https://dash.cloudflare.com/profile/api-tokens → **Create Token**
2. Modèle **Edit Cloudflare Workers** ou custom avec :
   - Account → **Cloudflare Pages : Edit**
   - Zone **redkmotors.fr** → **DNS : Edit**, **Zone : Read**
3. **Copier** le token

```powershell
npm run store:cloudflare-token
```

## 3. Tout lancer

```powershell
npm run setup:preprod-remaining
```

Résultat attendu :

- Secrets Actions sur **Phantom942/REDK-MOTORS**
- PR **feat/marketplace-occasions** → **main**
- Déploiement **Pages** + CNAME **preprod** → site avec marketplace

## 4. Access (optionnel, dashboard)

Zero Trust → Access → protéger **preprod.redkmotors.fr** (votre email).

Ne commitez jamais `.github-setup.local`, `.cloudflare-setup.local`, `.env.preprod.local`.
