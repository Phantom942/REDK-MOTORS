# 🚀 Instructions Rapides - Upload GitHub

## Option 1 : Via l'interface GitHub (RECOMMANDÉ - 2 minutes)

1. Allez sur : https://github.com/Phantom942/REDK-MOTORS
2. Cliquez sur **"Add file"** > **"Upload files"**
3. Glissez-déposez TOUS les fichiers du dossier REDK-MOTORS
4. Cliquez sur **"Commit changes"**
5. ✅ C'est fait !

## Option 2 : Via le script PowerShell

1. Ouvrez PowerShell dans le dossier REDK-MOTORS
2. Exécutez : `.\push-to-github.ps1`
3. Attendez la fin

## Option 3 : Commandes manuelles

```powershell
git config user.name "Phantom942"
git config user.email "votre-email@example.com"
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Phantom942/REDK-MOTORS.git
git branch -M main
git push -u origin main
```

## ⚠️ Note sur les vidéos

Les vidéos peuvent être ajoutées après via Git LFS ou uploadées séparément.

---

**L'option 1 (interface web) est la plus rapide !** 🎯

