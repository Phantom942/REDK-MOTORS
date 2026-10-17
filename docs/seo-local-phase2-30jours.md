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

| Event | Signification |
|---|---|
| `form_submit_attempt_blocked` | Submit bloqué (validation HTML/JS) |
| `form_submit_contact` | Submit **valide** → envoi FormSubmit (tentative confirmée côté client) |
| `form_submit_success` | `/merci/?source=form` **+** jeton session one-shot **+** consentement |

**≠** client atelier confirmé. Pas de PII dans les payloads (`event`, `page_key`, `location`, `cta_position` uniquement).

### GTM → GA4

Le site pousse vers `dataLayer` (`GTM-NTC72X2G`). La configuration des **tags/triggers GA4 dans l’UI GTM** n’est **pas** vérifiable depuis cet agent (pas d’accès console GTM). À contrôler manuellement :

- [ ] Trigger Custom Event `form_submit_contact`
- [ ] Trigger Custom Event `form_submit_success`
- [ ] Trigger Custom Event `form_submit_attempt_blocked` (optionnel debug)
- [ ] Aucun paramètre email / téléphone / nom
- [ ] Consent Mode / balise conditionnée au consentement

## Indicateurs 30 jours

1. Clics organiques totaux (GSC)
2. Clics non-marque
3. Requêtes locales (garage ivry, vitry, villejuif)
4. CTR des URLs optimisées
5. Positions moyennes (indicatif)
6. Events GTM ci-dessus
7. Devis qualifiés atelier (hors site)

## Confirmations humaines requises

| Sujet | État code | Action |
|---|---|---|
| Horaires | Lun–sam 9h–19h (inchangé) | Confirmer vs GBP si divergence |
| Navette | **Retirée** des textes Vitry/Villejuif/Ivry de cette PR | Ne réintroduire qu’après validation |
| Parking / dépôt sur place | **Retiré** des highlights Ivry | Confirmer avant republication |
| Délais « sous 48 h » | Évités sur pages villes touchées | Confirmer avant tout engagement |
| Paiement plusieurs fois | Formulé « à confirmer avec l’atelier » | Valider politique réelle |

## Hors scope

Cloudflare KV / Worker / 301 · marketplace · nouveaux contenus massifs
