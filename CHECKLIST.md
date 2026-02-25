# ✅ Checklist de préparation pour GitHub

## 📋 Fichiers créés/modifiés

- [x] `README.md` - Documentation du projet
- [x] `.gitignore` - Fichiers à ignorer par Git
- [x] `DEPLOY.md` - Guide de déploiement détaillé
- [x] `sitemap.xml` - Mis à jour avec date 2026
- [x] `robots.txt` - Présent et configuré
- [x] `.htaccess` - Présent (pour serveur Apache, ignoré par GitHub Pages)

## 📁 Structure des fichiers

```
✅ index.html
✅ mecanique.html
✅ carrosserie.html
✅ entretien.html
✅ pneumatiques.html
✅ contact.html
✅ achat-revente.html
✅ location.html
✅ processus.html
✅ assets/css/styles.css
✅ assets/js/main.js
✅ assets/img/
✅ assets/video/
✅ sitemap.xml
✅ robots.txt
```

## ⚠️ Actions à faire AVANT de pousser sur GitHub

### 1. Vérifier les URLs (si vous utilisez un domaine personnalisé)

✅ **Domaine configuré** : `https://redk-motors.me`

Toutes les URLs ont été mises à jour. Si vous devez modifier quelque chose, remplacez `https://redk-motors.me` dans :

- **sitemap.xml** (9 occurrences)
- **robots.txt** (ligne 5)
- **Tous les fichiers HTML** :
  - Balises `<link rel="canonical">`
  - Meta tags `og:url`
  - Meta tags `twitter:url`
  - Schema.org `url` et `sameAs`

### 2. Vérifier les chemins relatifs

Tous les chemins doivent être relatifs (commencent par `assets/` ou `./`), pas absolus.

### 3. Optimiser les médias (recommandé)

- Compresser les vidéos dans `assets/video/`
- Optimiser les images dans `assets/img/`

## 🚀 Commandes pour déployer

```bash
# 1. Aller dans le dossier du projet
cd "c:\Users\phant\Desktop\M I L L T E K\Projets\REDK-MOTORS"

# 2. Initialiser Git
git init

# 3. Ajouter tous les fichiers
git add .

# 4. Faire le premier commit
git commit -m "Initial commit - Site RED-K MOTORS"

# 5. Créer le repository sur GitHub, puis :
git remote add origin https://github.com/VOTRE-USERNAME/REDK-MOTORS.git

# 6. Pousser vers GitHub
git branch -M main
git push -u origin main
```

## 📝 Notes importantes

- GitHub Pages utilise HTTPS automatiquement
- Le fichier `.htaccess` sera ignoré (c'est normal, GitHub Pages ne l'utilise pas)
- Les chemins relatifs fonctionnent parfaitement avec GitHub Pages
- Le site sera accessible à : `https://VOTRE-USERNAME.github.io/REDK-MOTORS/`

## ✨ Fonctionnalités incluses

- ✅ Design responsive
- ✅ SEO optimisé
- ✅ Bouton WhatsApp flottant
- ✅ Bouton "back-to-top"
- ✅ Formulaire de contact
- ✅ Animations
- ✅ Accessibilité

## 🎯 Prêt pour le déploiement !

Tous les fichiers sont prêts. Suivez les instructions dans `DEPLOY.md` pour déployer sur GitHub Pages.

---

**Designed by PhantomDev** 👻

