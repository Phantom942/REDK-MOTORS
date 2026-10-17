# Phase 2 — SEO local & conversions (suivi 30 jours)

Période de référence GSC fournie : **17 juil. → 14 oct. 2026**  
(469 clics / 53 255 impressions / ~74 % mobile).

## MCP Google Search Console

**Indisponible** dans l’environnement agent (aucun namespace MCP GSC / Search Console dans le catalogue dynamique).  
Aucune nouvelle extraction automatisée. Travaillez avec l’export manuel fourni ou branchez un MCP / API Search Console.

## Positionnement pages (anti-cannibalisation)

| Page | Rôle | Title / H1 |
|---|---|---|
| `/` | Hub commercial déjà positionné sur « garage Ivry » | Conserve **« Garage automobile … Ivry-sur-Seine »** dans title + H1 |
| `/garage-ivry-sur-seine/` | Intention locale précise (adresse / accès) | Title + H1 centrés **9 rue Michelet** |

Canonical : chaque page pointe vers sa propre URL. Maillage : accueil → page garage (adresse & accès).

## Funnel dataLayer (après consentement analytics)

| Event | Signification | Ce que ce n’est **pas** |
|---|---|---|
| `form_submit_attempt_blocked` | Submit bloqué (validation HTML/JS) | — |
| `form_submit_contact` | Submit **valide** côté client → POST FormSubmit démarré (+ jeton session) | Preuve que FormSubmit a accepté / livré l’e-mail |
| `form_submit_redirect` | Page `/merci/?source=form` affichée **avec** jeton (redirection `_next`) | Livraison e-mail FormSubmit |
| `form_submit_success` | Jeton session one-shot consommé + consentement = meilleur proxy « POST accepté / redirect `_next` » | Confirmation e-mail FormSubmit, devis atelier, lead qualifié |
| `form_submit_redirect_unverified` | `/merci/?source=form` **sans** jeton (URL manuelle / session perdue) | Succès formulaire |

**Distinction explicite :** la redirection de succès (`_next` → `/merci/?source=form`) ≠ livraison e-mail confirmée par FormSubmit. FormSubmit ne expose pas de callback client de livraison ; seuls redirect + jeton session sont mesurables.

Pas de PII dans les payloads (`event`, `page_key`, `location`, `cta_position` uniquement).

### Sécurisation tracking (PR #10)

1. `conversion-funnel.js` est toujours chargé **avant** `track.js` (chaîne `onload` dans `cookies.js`, y compris injection post-consentement).
2. `loadAnalytics()` est **idempotente** (pas de scripts / listeners dupliqués ; réactivation après retrait sans rechargement).
3. Consentement analytics **re-vérifié à chaque event** (`hasConsent` + `__REDK_ANALYTICS_DISABLED__`), y compris après retrait.

Tests : `npm run test:conversion-tracking` (unit) · `npm run test:conversion-browser` (Playwright, après `npm run build`).

## Contrôles GitHub Actions disponibles

Workflows **actifs** sur le dépôt (API Actions) :

| Workflow | Fichier | Ce qu’il couvre | Tracking / GTM |
|---|---|---|---|
| Deploy to GitHub Pages | `.github/workflows/deploy.yml` | `audit:code`, `audit:exemples`, build, `test:blog-migration`, `test:conversion-tracking`, `test:conversion-browser`, deploy Pages, smoke prod | Unit + browser dataLayer **oui** ; tags GTM/GA4 UI **non** |
| Verify blog redirects (prod) | `.github/workflows/verify-blog-redirects.yml` | 301 blog en prod (KV) | Non |
| Deploy blog redirects KV | `.github/workflows/deploy-blog-redirects-kv.yml` | Upload shards KV | Non |
| Cloudflare response headers | `.github/workflows/cloudflare-headers.yml` | Headers Worker | Non |
| Marketplace validation (local) | `.github/workflows/marketplace-validation.yml` | Marketplace (hors scope SEO) | Non |
| pages-build-deployment | (dynamique GitHub Pages) | Build Pages legacy | Non |

Permissions agent : `workflow_dispatch` / secrets Actions souvent en **403** — lancer manuellement les workflows sensibles depuis l’UI GitHub si besoin.

## GTM → GA4 (intervention manuelle obligatoire)

Le site pousse vers `dataLayer` (`GTM-NTC72X2G`). La configuration des **tags/triggers GA4 dans l’UI GTM** n’est **pas** vérifiable depuis cet agent (pas d’accès console GTM / GA4). CI ne peut que vérifier les pushes `dataLayer` locaux.

À contrôler manuellement dans GTM Preview + GA4 DebugView :

- [ ] Trigger Custom Event `form_submit_contact`
- [ ] Trigger Custom Event `form_submit_redirect`
- [ ] Trigger Custom Event `form_submit_success`
- [ ] Trigger Custom Event `form_submit_redirect_unverified` (debug / qualité)
- [ ] Trigger Custom Event `form_submit_attempt_blocked` (optionnel debug)
- [ ] Aucun paramètre email / téléphone / nom dans les tags
- [ ] Consent Mode / balise conditionnée au consentement analytics
- [ ] Distinguer dans les rapports GA4 : `form_submit_redirect` (page succès) vs `form_submit_success` (jeton) — **ne pas** interpréter comme e-mail livré

## Indicateurs 30 jours

1. Clics organiques totaux (GSC)
2. Clics non-marque
3. Requêtes locales (garage ivry, vitry, villejuif)
4. CTR des URLs optimisées
5. Positions moyennes (indicatif)
6. Events GTM ci-dessus
7. Devis qualifiés atelier (hors site)

## Confirmations commerciales (propriétaire — 17 oct. 2026)

| Sujet | État code |
|---|---|
| Horaires | Lun–sam 9h–19h, **fermé dimanche** (conservé + explicité FAQ / schema) |
| Parking dépôt véhicule | **Oui** — mention « Parking pour dépôt de véhicule sur place » réintroduite (pages, FAQ, JSON-LD `amenityFeature`) |
| Navette | **Non** — toutes mentions supprimées (y compris « selon disponibilité ») |
| Délais « sous 48 h » | Évités sur pages villes touchées — confirmer avant engagement |
| Paiement plusieurs fois | Formulé « à confirmer avec l’atelier » |

## Hors scope

Cloudflare KV / Worker / 301 · marketplace · nouveaux contenus massifs
