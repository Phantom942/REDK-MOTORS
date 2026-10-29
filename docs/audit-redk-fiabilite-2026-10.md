# Audit RED-K MOTORS — fiabilité & conversion (29 oct. 2026)

Branche : `audit/redk-fiabilite-conversion-2026-10`  
PR : https://github.com/Phantom942/REDK-MOTORS/pull/14  
Référence prod (avant PR) : `7a6d3d7`

## Phase 0 — État

| Élément | Constat |
|--------|---------|
| Stack | Eleventy 3 + Nunjucks, GitHub Pages, Cloudflare headers/KV |
| Tracking | GTM `GTM-NTC72X2G`, cookies.js (consent), conversion-funnel.js + **contact-form-ux.js** (hors consentement) |
| Formulaire | FormSubmit → `contact@redkmotors.fr`, `_next` → `/merci/?source=form` |
| Avis | `site.json` + `googleReviews.json` = **4,9 / 53** (référence propriétaire) |
| Non commités exclus | `marketplace/`, docs Messenger / Facebook internes |

## Relecture PR #14 — corrections complémentaires

### 1. JSON-LD
- `employee` **supprimé** de `localBusinessSchema.js` (Organization n’est pas un type valide pour `employee`).
- Pas de `department` (aucun département juridique confirmé).
- `/equipe/` : `teamOrganizationSchema` = Organization autonome + `parentOrganization`.
- Nouveau : `npm run audit:schema` (types sémantiques, pas seulement JSON).

### 2. Formulaires / consentement
- UX bouton / statut / jeton pending → `contact-form-ux.js` (toujours chargé).
- GA4/GTM → `track.js` uniquement avec consentement Analytics.
- Restauration bouton : `pageshow` / `pagehide` / timeout 15 s / `restoreAll()`.

### 3. Page `/merci/`
- UI distincte : **demande initiée** (jeton session) vs **envoi non confirmé** (`source=form` seul).
- Jamais de faux succès sur le seul paramètre URL.
- Events analytics inchangés : redirect / success / unverified ; livraison e-mail non mesurable.

### 4. Tests Playwright Pro
- Étendus dans `test:conversion-browser` : `/professionnels/`, mobile, avec/sans consentement, `form_submit_pro`, absence PII, restore après échec simulé (pas de POST FormSubmit réel).

### 5. Sync avis Google
- Pool curaté **préservé** ; API met à jour `rating`/`count` et peut ajouter de nouveaux auteurs.
- `npm run test:sync-reviews` simule Places (61 / 4,8) sans casser `reviewPages.js`.

### 6. Mentions légales
- Bannière : champs manquants ≠ conformité achevée.
- Section dédiée « à fournir par le propriétaire » : capital, directeur publication, médiateur, hébergement effectif.
- Hébergement GitHub Pages / Cloudflare présenté comme **hypothèse technique à confirmer**.

## Résultats de validation (locaux, 29 oct. 2026)

| Contrôle | Résultat |
|----------|----------|
| `npm run build` | OK (777 fichiers) |
| `npm run test:conversion-tracking` | OK |
| `npm run test:conversion-browser` | OK (dont Pro) |
| `npm run test:sync-reviews` | OK |
| `npm run audit:google-reviews` | OK — 53 / 4,9 |
| `npm run audit:schema` | OK |
| `npm run audit:sitemap` | OK |
| `npm run audit:links` | OK — 0 lien cassé |
| `npm run test:blog-migration` | OK |
| `npm run check:hours` | OK |
| `npm run test:gtm-pageview` | **PARTIEL** — pré-consentement OK ; hits GA4 absents en local (réseau / GTM distant) |
| `npm run audit:code` | OK |
| `npm run audit:blog` | OK |

### Notes
- `test:gtm-pageview` : aucun script/mesure avant consentement = OK ; après consentement, le chargement distant GTM/GA4 n’a pas produit de `page_view` dans cet environnement (blocage réseau probable). À revalider en CI ou navigateur réel connecté.
- `audit:code` : OK (prod npm audit high/critical = 0, schema, avis, sync, SEO internes).

## Décisions propriétaire (toujours requises)

1. Médiateur de la consommation agréé (nom, adresse, site, e-mail).
2. Capital social + directeur / responsable de la publication.
3. Confirmation écrite de la chaîne d’hébergement (GitHub Pages + Cloudflare).
4. Services réels : véhicule de remplacement / restitution exceptionnelle.
5. Validation tarifs & concours GTA VI si toujours actif.
6. Autorisation tests FormSubmit prod avec sujet `[TEST]`.

## Impact

Tracking et UX formulaires plus honnêtes ; schema valide ; sync avis sans casser les témoignages. **Aucun gain commercial chiffré inventé.** Pas de merge / deploy sans validation propriétaire.
