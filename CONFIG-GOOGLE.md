# Configuration Google Analytics et Search Console

## 📊 Google Analytics 4 (GA4)

### Étape 1 : Créer un compte Google Analytics

1. Allez sur [https://analytics.google.com](https://analytics.google.com)
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Commencer la mesure"** ou **"Créer"**

### Étape 2 : Créer une propriété

1. **Nom du compte** : `RED-K MOTORS` (ou votre nom)
2. Cliquez sur **"Suivant"**
3. **Nom de la propriété** : `RED-K MOTORS Website`
4. **Fuseau horaire** : `(GMT+01:00) Paris`
5. **Devise** : `Euro (€)`
6. Cliquez sur **"Suivant"**

### Étape 3 : Informations sur votre entreprise

1. **Secteur** : `Automobile / Garage`
2. **Taille** : Sélectionnez la taille appropriée
3. **Objectifs** : Cochez ce qui vous intéresse (mesurer les conversions, comprendre les visiteurs, etc.)
4. Cliquez sur **"Créer"**

### Étape 4 : Accepter les conditions

1. Acceptez les conditions d'utilisation
2. Cliquez sur **"J'accepte"**

### Étape 5 : Récupérer votre ID de mesure

1. Dans la page d'accueil, vous verrez **"ID de mesure"** (format : `G-XXXXXXXXXX`)
2. **Copiez cet ID** (exemple : `G-ABC123XYZ`)

### Étape 6 : Ajouter l'ID dans votre site

1. Ouvrez tous les fichiers HTML du projet
2. Cherchez : `G-XXXXXXXXXX`
3. Remplacez par votre vrai ID (exemple : `G-ABC123XYZ`)
4. Sauvegardez tous les fichiers

**Fichiers à modifier :**
- `index.html`
- `contact.html`
- `mecanique.html`
- `carrosserie.html`
- `entretien.html`
- `pneumatiques.html`
- `location.html`
- `achat-revente.html`

---

## 🔍 Google Search Console

### Étape 1 : Accéder à Search Console

1. Allez sur [https://search.google.com/search-console](https://search.google.com/search-console)
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Ajouter une propriété"**

### Étape 2 : Ajouter votre site

1. Sélectionnez **"Préfixe d'URL"**
2. Entrez : `https://redk-motors.me`
3. Cliquez sur **"Continuer"**

### Étape 3 : Vérifier la propriété

1. Choisissez **"Balise meta"** comme méthode de vérification
2. **Copiez le code** qui ressemble à : `abc123def456ghi789jkl012mno345pq`
3. **IMPORTANT :** Notez ce code quelque part

### Étape 4 : Ajouter le code dans votre site

1. Ouvrez tous les fichiers HTML du projet
2. Cherchez cette ligne (actuellement commentée) :
   ```html
   <!-- <meta name="google-site-verification" content="VOTRE_CODE_DE_VERIFICATION" /> -->
   ```
3. **Décommentez-la** et remplacez `VOTRE_CODE_DE_VERIFICATION` par votre vrai code :
   ```html
   <meta name="google-site-verification" content="abc123def456ghi789jkl012mno345pq" />
   ```
4. Sauvegardez tous les fichiers

**Fichiers à modifier :**
- `index.html`
- `contact.html`
- `mecanique.html`
- `carrosserie.html`
- `entretien.html`
- `pneumatiques.html`
- `location.html`
- `achat-revente.html`

### Étape 5 : Vérifier dans Search Console

1. Retournez sur Google Search Console
2. Cliquez sur **"Vérifier"**
3. Attendez quelques secondes
4. Si c'est validé, vous verrez **"Propriété vérifiée"** ✅

### Étape 6 : Soumettre le sitemap

1. Dans Search Console, allez dans **"Sitemaps"** (menu de gauche)
2. Entrez : `https://redk-motors.me/sitemap.xml`
3. Cliquez sur **"Envoyer"**

---

## ✅ Vérification finale

### Google Analytics
- Attendez 24-48h après la mise en ligne
- Allez sur [analytics.google.com](https://analytics.google.com)
- Vérifiez que vous voyez des données dans **"Temps réel"**

### Google Search Console
- Vérifiez que votre propriété est bien vérifiée
- Le sitemap devrait être traité dans quelques jours
- Vous verrez les pages indexées dans **"Couverture"**

---

## 🚀 Après la configuration

1. **Commit et push** les fichiers modifiés sur GitHub
2. Attendez que GitHub Pages déploie les changements
3. Vérifiez que les scripts sont bien chargés (F12 → Console, pas d'erreurs)

---

## 📝 Notes importantes

- **Google Analytics** : Les données peuvent prendre 24-48h à apparaître
- **Search Console** : L'indexation peut prendre plusieurs jours/semaines
- **Sitemap** : Soumettez-le une fois, Google le mettra à jour automatiquement
- **HTTPS** : Assurez-vous que votre site est en HTTPS (GitHub Pages le fait automatiquement)

---

## 🆘 Besoin d'aide ?

Si vous avez des problèmes :
1. Vérifiez que les codes sont bien copiés (pas d'espaces)
2. Vérifiez que les fichiers sont bien sauvegardés
3. Vérifiez que le site est bien en ligne sur GitHub Pages
4. Attendez quelques minutes après le déploiement avant de vérifier

