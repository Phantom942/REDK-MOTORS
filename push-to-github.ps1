# Script rapide pour pousser sur GitHub
# Exécutez ce script dans PowerShell : .\push-to-github.ps1

Write-Host "Configuration Git..." -ForegroundColor Yellow
git config user.name "Phantom942"
git config user.email "phantom942@users.noreply.github.com"

Write-Host "Ajout des fichiers (sans vidéos)..." -ForegroundColor Yellow
git add .gitignore .gitattributes .htaccess CNAME README.md robots.txt sitemap.xml
git add *.html
git add assets/css/* assets/js/* assets/img/*

Write-Host "Commit..." -ForegroundColor Yellow
git commit -m "Initial commit - Site RED-K MOTORS"

Write-Host "Push vers GitHub..." -ForegroundColor Yellow
git remote add origin https://github.com/Phantom942/REDK-MOTORS.git
git branch -M main
git push -u origin main

Write-Host "`n✅ Terminé ! Les vidéos peuvent être ajoutées après via Git LFS." -ForegroundColor Green

