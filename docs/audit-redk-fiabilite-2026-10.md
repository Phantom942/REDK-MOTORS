# Rapport final — PR #14 RED-K MOTORS (29 octobre 2026)

**Branche :** `audit/redk-fiabilite-conversion-2026-10`  
**PR :** https://github.com/Phantom942/REDK-MOTORS/pull/14  
**Commit de référence initial relecture :** `69dbd5a`  
**Statut annoncé :** **TECHNIQUEMENT PRÊTE — VALIDATIONS PROPRIÉTAIRE RESTANTES**  
**Merge / déploiement :** **non effectués** (autorisation requise)  
**Contact :** formulaires retirés — **appel / WhatsApp uniquement** (demande propriétaire)

---

## 1. Corrections appliquées (ensemble de la PR)

- Centralisation avis Google **53 / 4,9** + `audit:google-reviews` + sync Places **sans écraser** le pool curaté (`test:sync-reviews`).
- Schema : suppression de `employee` Organization ; page équipe = Organization autonome ; `audit:schema`.
- Cookies consentement **6 mois** ; tracking UX (`contact-form-ux.js`) **hors** consentement Analytics ; `track.js` = GA4/GTM seulement.
- Formulaires particulier + Pro ; `/merci/` sans faux succès sur l’URL seule ; anti double-clic.
- Mentions légales : capital + président issus du **BODACC** ; médiation toujours manquante ; hébergement GitHub Pages + Cloudflare documentés séparément.
- Promesses Pro alignées sur : *priorité de planification selon disponibilités atelier*.
- Concours GTA VI : tirage 12/11 conservé ; remise clarifiée vs sortie officielle Rockstar **19/11/2026**.
- Docs : diagnostic e-mail, protocole FormSubmit `[TEST]`.

## 2. Problèmes résolus

| Problème | Résolution |
|----------|------------|
| Compteurs avis divergents | Source unique + tests |
| Schema employee invalide | Retrait + audit types |
| UX formulaire liée au consentement | `contact-form-ux.js` toujours chargé |
| Merci = succès URL | UI initiée / non confirmée |
| Sync Places écrasait témoignages | Fusion additive + test simulation |
| Mentions « à confirmer » ambiguës | BODACC publié ; médiation explicitement non conforme |
| Overpromises Pro / « immédiat » | Reformulations |

## 3. Tests exécutés

### GitHub Actions — run `40860953639` (commit `69dbd5a`) — **SUCCESS**

- Build Eleventy, audits code / sitemap / liens
- Conversion unit + Playwright (dont Pro)
- Google Reviews + Schema
- **GTM/GA4** : aucun hit avant consentement ; **1** `page_view` `G-BN0P1VLZR5` après consentement ; **1** après reload

*(L’échec GTM local antérieur était une limite réseau ; la CI fait foi.)*

### Suite locale finale (29 oct. 2026, post-finalisation)

| Commande | Résultat |
|----------|----------|
| `check:hours` | OK |
| `audit:google-reviews` | OK (53 / 4,9) |
| `audit:schema` | OK |
| `test:sync-reviews` | OK |
| `test:conversion-tracking` | OK |
| `build` | OK |
| `test:conversion-browser` | OK (Pro inclus) |
| `audit:sitemap` / `audit:links` / `audit:blog` / `audit:code` | OK |
| `test:blog-migration` | OK |
| `test:gtm-pageview` | **Échec local réseau** (scripts GTM distants non chargés) — **CI `69dbd5a` OK** avec 1× page_view `G-BN0P1VLZR5` |

## 4. État GitHub Actions

Sur PR (hors `main`) : job **build** vert ; **deploy / smoke / indexnow** skippés (normal hors merge main).

## 5. Informations administratives — sources

| Donnée | Valeur | Source | Date source |
|--------|--------|--------|-------------|
| Dénomination | RED-KMOTORS | BODACC / annonces | 2026 |
| SIREN / SIRET | 103462537 / …00012 | Identique site + BODACC | — |
| Adresse | 9 rue Michelet, 94200 Ivry | BODACC | — |
| Capital | **1 000 €** | BODACC A **20260073** (16/04/2026) ; annonce légale mesinfos.fr 99023 (31/03/2026) | 2026-04 / 2026-03 |
| Président / dir. publication | **Karim MOUSSAOUI** | Idem BODACC / annonce légale | 2026-04 |
| Immatriculation RCS | 13/04/2026 | BODACC | 2026-04-16 |
| Médiateur | **Non publié** | Aucune source | — |
| Hébergement fichiers | GitHub Pages | En-têtes `x-github-*` derrière CF | 2026-10-29 |
| DNS / CDN | Cloudflare | NS + `Server: cloudflare` | 2026-10-29 |

Extrait RNE INPI recommandé pour double contrôle propriétaire : https://registre.entreprises.gouv.fr/

## 6. Décisions propriétaire encore indispensables (liste unique)

1. **Médiateur de la consommation agréé** (nom, adresse, site, e-mail) — **bloquant réglementaire**.
2. Confirmer capital / président via extrait RNE/Kbis personnel (déjà publiés d’après BODACC).
3. Confirmer services : véhicule de remplacement ? restitution exceptionnelle ? (site = parking, pas de navette).
4. Valider tarifs affichés / offre pare-brise.
5. Valider remise lots GTA VI post-19/11 (texte préparé ; engagement tirage 12/11 inchangé).
6. Autoriser tests FormSubmit `[TEST]` + vérifier réception Gmail/spam.
7. Suivre `docs/email-deliverability-diagnostic-2026-10.md` (DKIM / envoi Gmail vs Securemail).

## 7. Non résolus / hors scope

- Attribution GA4 jusqu’à facture atelier (pas de CRM facturation connecté).
- Core Web Vitals Lighthouse terrain non rejoués ici (CI/build OK ; pas de score inventé).
- Marketplace / docs Messenger : **exclus**, non commités.

## 8. Préparation production

Statut : **TECHNIQUEMENT PRÊTE — VALIDATIONS PROPRIÉTAIRE RESTANTES**  
Fusion possible techniquement (CI verte, mergeable) ; conformité médiation **non** atteinte tant que le médiateur n’est pas publié.

## 9. Procédure de fusion (après votre OK)

1. Relire le diff PR #14.
2. Compléter le médiateur (commit follow-up ou issue post-merge).
3. `gh pr merge 14` (squash ou merge — votre choix) **uniquement sur votre ordre**.
4. Attendre Deploy GitHub Pages sur `main`.
5. Exécuter la checklist smoke ci-dessous.

## 10. Checklist smoke post-déploiement

- [ ] Accueil : 53 avis / 4,9 visibles, pas d’erreur console bloquante
- [ ] `/contact/` mobile + desktop : validation, UX sans cookies analytics
- [ ] `/professionnels/` : formulaire Pro, pas de POST réel sans `[TEST]`
- [ ] Cookies : refus → pas de GTM ; accept → 1 page_view
- [ ] Mentions : capital, président, hébergement ; médiation = manquante ou complétée
- [ ] WhatsApp / téléphone : clics OK
- [ ] Concours GTA : dates + mention remise post-sortie
- [ ] SEO : canonical homepage, sitemap accessible
- [ ] Après autorisation : FormSubmit `[TEST]` reçu dans `contact@`

---

## Annexes

- `docs/email-deliverability-diagnostic-2026-10.md`
- `docs/formsubmit-test-protocol.md`
- `docs/sync-google-reviews.md`
