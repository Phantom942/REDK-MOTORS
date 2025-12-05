# Guide de Configuration Google pour RED-K MOTORS

## 📊 Google Analytics 4 (GA4)

### Étape 1 : Créer un compte Google Analytics
1. Allez sur [https://analytics.google.com](https://analytics.google.com)
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Commencer la mesure"** ou **"Créer"**

### Étape 2 : Créer une propriété
1. Donnez un nom à votre compte (ex: "RED-K MOTORS")
2. Cliquez sur **"Suivant"**
3. **Nom de la propriété** : `RED-K MOTORS`
4. **Fuseau horaire** : `(GMT+01:00) Paris`
5. **Devise** : `Euro (€)`
6. Cliquez sur **"Suivant"**

### Étape 3 : Informations sur votre entreprise
1. **Secteur d'activité** : `Automobile`
2. **Taille de l'entreprise** : Choisissez selon votre taille
3. Cliquez sur **"Créer"**
4. Acceptez les conditions d'utilisation

### Étape 4 : Configurer le flux de données Web
1. Sélectionnez **"Web"**
2. **URL du site Web** : `https://redk-motors.me`
3. **Nom du flux** : `RED-K MOTORS Website`
4. Cliquez sur **"Créer un flux"**

### Étape 5 : Récupérer votre ID de mesure
1. Sur la page du flux de données, vous verrez **"ID de mesure"**
2. Il ressemble à : `G-XXXXXXXXXX` (ex: `G-ABC123XYZ`)
3. **Copiez cet ID**

### Étape 6 : Ajouter l'ID dans le site
1. Ouvrez tous les fichiers HTML du projet
2. Cherchez `G-XXXXXXXXXX` dans le code
3. Remplacez par votre vrai ID de mesure (ex: `G-ABC123XYZ`)
4. Sauvegardez tous les fichiers
5. Uploadez sur GitHub

---

## 🔍 Google Search Console

### Étape 1 : Accéder à Google Search Console
1. Allez sur [https://search.google.com/search-console](https://search.google.com/search-console)
2. Connectez-vous avec votre compte Google

### Étape 2 : Ajouter une propriété
1. Cliquez sur **"Ajouter une propriété"**
2. Sélectionnez **"Préfixe d'URL"**
3. Entrez : `https://redk-motors.me`
4. Cliquez sur **"Continuer"**

### Étape 3 : Vérifier la propriété
1. Choisissez **"Balise meta"** comme méthode de vérification
2. **Copiez le code de vérification** (il ressemble à : `abc123xyz456...`)
3. Ouvrez tous les fichiers HTML du projet
4. Cherchez cette ligne (actuellement commentée) :
   ```html
   <!-- <meta name="google-site-verification" content="VOTRE_CODE_DE_VERIFICATION" /> -->
   ```
5. **Décommentez-la** et remplacez `VOTRE_CODE_DE_VERIFICATION` par votre code :
   ```html
   <meta name="google-site-verification" content="abc123xyz456..." />
   ```
6. Sauvegardez tous les fichiers
7. Uploadez sur GitHub
8. Revenez sur Google Search Console et cliquez sur **"Vérifier"**

### Étape 4 : Soumettre le sitemap
1. Une fois vérifié, allez dans **"Sitemaps"** (menu de gauche)
2. Entrez : `sitemap.xml`
3. Cliquez sur **"Envoyer"**

---

## ✅ Vérification

### Google Analytics
- Attendez 24-48h après l'upload
- Allez dans Google Analytics → **Rapports** → **Temps réel**
- Visitez votre site, vous devriez voir votre visite apparaître

### Google Search Console
- Allez dans **Couverture** (menu de gauche)
- Après quelques jours, vous verrez les pages indexées
- Vérifiez qu'il n'y a pas d'erreurs

---

## 🚀 Après la configuration

Une fois les codes ajoutés :
1. Commitez les changements : `git add *.html`
2. Commit : `git commit -m "Add Google Analytics and Search Console"`
3. Push : `git push origin main`
4. Attendez quelques minutes que GitHub Pages se mette à jour

---

## 📝 Notes importantes

- **Google Analytics** : Les données peuvent prendre 24-48h à apparaître
- **Google Search Console** : L'indexation peut prendre plusieurs jours/semaines
- Assurez-vous que le site est bien en ligne avant de vérifier
- Vérifiez que les codes sont bien présents dans le code source de votre site (clic droit → Afficher le code source)

---

## 🆘 Besoin d'aide ?

Si vous avez des problèmes :
1. Vérifiez que les codes sont bien dans tous les fichiers HTML
2. Vérifiez que le site est bien en ligne
3. Utilisez l'outil de vérification de Google Search Console
4. Vérifiez la console du navigateur (F12) pour les erreurs

