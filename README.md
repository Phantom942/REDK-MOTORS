# RED-K MOTORS - Site Web

Site web du garage automobile RED-K MOTORS, spécialisé en mécanique et carrosserie en Île-de-France.

## 🚗 À propos

RED-K MOTORS est un garage automobile situé à Ivry-sur-Seine, en Île-de-France, offrant des services de :
- Mécanique automobile
- Carrosserie et peinture
- Entretien et révision
- Pneumatiques et géométrie
- Achat et revente de véhicules
- Location de véhicules

## 📁 Structure du projet

```
REDK-MOTORS/
├── index.html              # Page d'accueil
├── mecanique.html          # Page mécanique
├── carrosserie.html        # Page carrosserie
├── entretien.html          # Page entretien
├── pneumatiques.html       # Page pneumatiques
├── contact.html            # Page contact
├── achat-revente.html      # Page achat/revente
├── location.html           # Page location
├── processus.html          # Page processus
├── assets/
│   ├── css/
│   │   └── styles.css      # Styles principaux
│   ├── js/
│   │   └── main.js         # JavaScript principal
│   ├── img/                # Images
│   └── video/              # Vidéos
├── sitemap.xml             # Sitemap pour SEO
├── robots.txt              # Robots.txt pour SEO
└── .htaccess               # Configuration Apache (optionnel)
```

## 🚀 Déploiement sur GitHub Pages

### Méthode 1 : Via l'interface GitHub

1. Créez un nouveau repository sur GitHub
2. Uploadez tous les fichiers du projet
3. Allez dans **Settings** > **Pages**
4. Sélectionnez la branche `main` (ou `master`)
5. Le site sera accessible à : `https://votre-username.github.io/REDK-MOTORS/`

### Méthode 2 : Via Git en ligne de commande

```bash
# Initialiser le repository
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit - Site RED-K MOTORS"

# Ajouter le remote GitHub
git remote add origin https://github.com/votre-username/REDK-MOTORS.git

# Pousser vers GitHub
git branch -M main
git push -u origin main
```

Ensuite, activez GitHub Pages dans les paramètres du repository.

## ⚙️ Configuration

### URLs du site

Si vous utilisez un nom de domaine personnalisé, mettez à jour :
- `sitemap.xml` : URLs configurées pour `https://redk-motors.me`
- `robots.txt` : Mettez à jour l'URL du sitemap
- Tous les fichiers HTML : Mettez à jour les URLs canoniques et Open Graph

### Variables importantes

- **Téléphone** : `07 51 21 32 55`
- **Email** : `contact@redk-motors.me`
- **Adresse** : `9 rue Michelet, 94200 Ivry-sur-Seine`

## 📱 Fonctionnalités

- ✅ Design responsive (mobile, tablette, desktop)
- ✅ SEO optimisé (meta tags, Schema.org, sitemap)
- ✅ Bouton WhatsApp flottant
- ✅ Formulaire de contact
- ✅ Animations et transitions
- ✅ Accessibilité (ARIA, skip links)

## 🛠️ Technologies utilisées

- HTML5
- CSS3 (Variables CSS, Flexbox, Grid)
- JavaScript (Vanilla)
- Schema.org (Structured Data)
- SVG pour les icônes

## 📝 Notes

- Le fichier `.htaccess` est pour les serveurs Apache. GitHub Pages ne l'utilise pas.
- Les vidéos doivent être optimisées pour le web (format MP4 recommandé).
- Assurez-vous que toutes les images sont optimisées.

## 📞 Contact

Pour toute question concernant le site :
- Email : contact@redk-motors.me
- Téléphone : 07 51 21 32 55

---

**Designed by PhantomDev** 👻

