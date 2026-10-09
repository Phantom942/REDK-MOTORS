# Qualification de la recette locale (point de reprise `95cb499`)

Ce document distingue ce qui a été **prouvé automatiquement ou par contournement outil** de ce qui exige encore une **manipulation humaine** avant préproduction.

## Limites connues de la recette agent / navigateur

### Upload photos — `DataTransfer` ≠ sélecteur natif

| Validé | Non validé comme UX réelle |
|--------|----------------------------|
| Handler `change` sur `#mp-photo-upload input`, traitement `listing-form.js`, Edge `process-listing-photo`, miniatures, ordre, persistance après rechargement | Ouverture du **dialogue système « Ajouter des photos »**, choix de **fichiers réels** (HEIC, gros JPEG, plusieurs extensions), comportement mobile |

L’injection `DataTransfer` + événement `change` exerce le **même code applicatif** que la sélection de fichiers, mais **pas** la pile OS / navigateur (permissions, formats refusés côté picker, annulation utilisateur).

### Modération dépôt-vente — API ≠ panel admin

| Validé | Non validé comme UX réelle |
|--------|----------------------------|
| Soumission UI staff → brouillon → page publier → soumission « Annonce soumise… » ; approbation via Edge `moderate-listing` (même backend que le bouton) ; fiche publique dépôt-vente (badge + coords garage) | Clic **Valider** dans le panel `/achat-revente/admin/` sur une annonce **dépôt-vente** en file d’attente |

Le parcours **particulier** (Megane) a bien validé **Refuser sans motif** (formulaire invalide) et **Valider** en UI modérateur.

---

## Vérifications manuelles restantes (≈ 15 min)

Prérequis : `npm run dev:marketplace-local`, functions serve, comptes seed (`DEMO_LOCAL.md`), mot de passe `TestMarketplace-Local-2026!`.

### A. Trois vraies photos via le bouton

1. Connexion **vendeur A** (`mp-vendeur-a@test.local`).
2. Créer un **nouveau brouillon** ou ouvrir un brouillon vide : `/achat-revente/publier/` (sans réutiliser les annonces déjà publiées en recette).
3. Cliquer **Ajouter des photos** et choisir **3 fichiers réels** depuis le disque (idéalement formats variés : JPEG + un fichier « limite » si disponible).
4. Contrôler : miniatures visibles, absence de message d’erreur bloquant, ordre (monter/descendre), **rechargement F5** → photos toujours là.
5. (Optionnel) Soumettre ou laisser en brouillon ; noter l’**ID** dans l’URL `?id=…`.

**Bug à signaler** : tout échec uniquement avec le picker natif (alors que DataTransfer passait) → ouvrir un ticket / correctif ciblé, sans nouvelle fonctionnalité.

### B. Approuver un dépôt-vente depuis le panel

1. Connexion **staff** (`mp-staff@test.local`) → `/achat-revente/admin/?view=consignment`.
2. Créer un brouillon dépôt-vente (formulaire admin) ou reprendre un brouillon **non publié** en `pending_review`.
3. Compléter photos + soumission sur `/achat-revente/publier/?id=…` (3 photos réelles de préférence, cf. A).
4. Connexion **modérateur** (`mp-moderateur@test.local`) → admin, file **En attente**.
5. Ouvrir la fiche, cliquer **Valider** (sans contourner par script/API).
6. Vérifier message de succès, slug, fiche publique : badge **Dépôt-vente Red-K Motors**, téléphone et adresse garage.

Cocher mentalement : **A** et **B** = recette UI « complète » pour le jalon suivant (préprod).

---

## Annonces déjà utilisées en recette (référence)

| ID | Slug | Remarque |
|----|------|----------|
| `8ef47f93-9237-482c-884d-85475b7a7fc7` | `renault-megane-2019` | Particulier — Valider UI OK |
| `6a98c04e-a6bc-4018-9fce-ab1bdfb7a5e6` | `peugeot-3008-2020` | Dépôt-vente — approbation **API**, pas clic panel |

Ne pas confondre avec les tests **préproduction distants** (`test:marketplace:preprod`) : voir `PREPROD_PLAN.md`.
