# Audit RED-K MOTORS — fiabilité & conversion (29 oct. 2026)

Branche : `audit/redk-fiabilite-conversion-2026-10`  
Référence prod déployée (avant PR) : `7a6d3d7` (GitHub Pages OK)

## Phase 0 — État

| Élément | Constat |
|--------|---------|
| Stack | Eleventy 3 + Nunjucks, GitHub Pages, Cloudflare headers/KV |
| Tracking | GTM `GTM-NTC72X2G`, cookies.js (consent), conversion-funnel.js |
| Formulaire | FormSubmit → `contact@redkmotors.fr`, `_next` → `/merci/?source=form` |
| Avis | `site.json` + `googleReviews.json` = **4,9 / 53** (référence propriétaire) |
| Non commités exclus | `marketplace/`, docs Messenger / Facebook internes |

## Classification

### Problèmes confirmés (corrigés sur cette branche)

1. **Compteurs avis en dur** (metas / FAQ / highlights) pouvaient diverger après sync API → centralisation + test `audit:google-reviews`.
2. **Schema `employee` en `Person`** pour une équipe collective → corrigé en `Organization`.
3. **Promesses auto-écoles / taxi** trop absolues → reformulées (planning selon dispo atelier, double commande cas par cas).
4. **Durée cookie consent 365 j** → 180 j (recommandation CNIL choix consentement) + politique cookies alignée.
5. **Formulaire contact** trop mince pour qualifier un devis → champs véhicule + UX submit.
6. **Parcours Pro** sans formulaire dédié → formulaire Pro + tracking `form_submit_pro`.
7. **Mentions légales** : hébergeur / médiation / capital / directeur incomplets → sections ajoutées **sans invention**.
8. **Confidentialité** : champs formulaires, FormSubmit, transferts, conservation choix cookies 6 mois.

### Risques probables

- FormSubmit : page merci ≠ e-mail livré — suivi amélioré, pas de preuve SMTP côté client.
- Sync Places API en CI remplace les extraits d’avis (max 4) et peut casser `reviewPages.js` si la clé API est active — fallback manuel 53 conservé sans clé.
- Cannibalisation SEO pages villes / LP (hors scope immédiat P0).

### Améliorations recommandées (non bloquantes)

- Photos atelier réelles, RDV en ligne créneaux, LSA Google.
- AggregateRating JSON-LD : **ne pas** réintroduire (règles Google).
- Plan fidélisation (rappels entretien) : nécessitent base légale + source données atelier — voir checklist métier.

### Validation humaine requise

Voir « Décisions propriétaire » ci-dessous.

## Référence avis

**53 avis · 4,9/5** — confirmé propriétaire + fichiers data au 2026-10-29.  
Toute valeur API Places plus récente authentifiée peut remplacer ce couple **après sync documentée** ; jamais d’estimation ni d’annuaire secondaire.

Script : `npm run audit:google-reviews` (aussi dans `audit:code`).

## Décisions propriétaire (à fournir)

1. **Médiateur de la consommation** : nom, adresse, site, e-mail officiels.
2. **Capital social** et **directeur / responsable de la publication**.
3. Confirmation **hébergeur** (GitHub Pages + Cloudflare) OK pour affichage légal.
4. Services réels : véhicule de remplacement ? récupération / restitution exceptionnelle ? (site = parking dépôt, pas de navette).
5. Validation des **tarifs** affichés et offres pare-brise.
6. Concours GTA VI : dates / règlement / validation juridique si toujours actif.
7. Autorisation avant envoi de messages de test FormSubmit en production (sujet `[TEST]`).

## Checklist métier hors site (à vérifier au garage)

- Affichage tarifs TTC, devis / OR, pièces économie circulaire, garanties
- Médiateur affiché en atelier et docs commerciaux
- Capacité utilitaires / conditions priorité pro
- Traitement réclamations, rappels entretien (process manuel actuel)

## Impact commercial attendu (qualitatif)

- Moins d’incohérences avis / promesses → confiance
- Formulaires mieux qualifiés (véhicule + Pro séparé) → moins d’allers-retours téléphone
- Tracking plus honnête → décisions pub / SEO sur des contacts réels, pas des faux positifs merci

Aucun gain chiffré inventé.
