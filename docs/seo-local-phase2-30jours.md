# Phase 2 — SEO local & conversions (suivi 30 jours)

Période de référence GSC fournie : **17 juil. → 14 oct. 2026**  
(469 clics / 53 255 impressions / ~74 % mobile). MCP Search Console non connecté — données = extraction fournie.

## Pages de cette itération

| Page | Intention | Leviers |
|---|---|---|
| `/` | Hub marque + devis | Title/H1 différenciés vs page garage |
| `/garage-ivry-sur-seine/` | Requête « garage ivry » | Adresse dans title, page locale dédiée |
| `/vitry-sur-seine/` | Zone Vitry → atelier Ivry | CTR (0 clic / 449 imp.) + clarté « pas de succursale » |
| `/villejuif/` | Zone Villejuif → atelier Ivry | Idem (0 clic / 160 imp.) |
| `/prestations/recharge-clim/` | Clim commerciale | Copy + maillage guide prix |
| `/diagnostic/` | Voyant / panne | Title/meta plus clairs |
| `/blog/articles/prix-recharge-climatisation-94/` | Info → devis | Lien prestation au milieu + CTA bas |

## Indicateurs à suivre (séparément)

1. **Clics organiques totaux** (GSC)
2. **Clics non-marque** (exclure « red-k », « redk motors », etc.)
3. **Requêtes locales** : garage ivry / ivry-sur-seine / vitry / villejuif
4. **CTR & impressions** des 7 URLs ci-dessus
5. **Positions moyennes** (indicatif seulement — volatiles post-migration)
6. **GTM / dataLayer** (après consentement analytics) :
   - `click_call` — intention d’appel (**≠** client confirmé)
   - `click_whatsapp`
   - `click_rdv` — clic vers `/contact/`
   - `form_submit_contact` — submit formulaire (validation HTML OK)
   - `form_submit_success` — arrivée `/merci/?source=form` (**formulaire envoyé**)
7. **Devis qualifiés** — hors site (atelier / CRM manuel), si disponible

Comparer J0 (publication) → J+14 → J+30. Tenir compte de la migration blog récente et de la saisonnalité (clim, CT…).

## Confirmation humaine requise

### Horaires
- **Code / site** : Lun–sam 9h–19h (`site.json` + schema Monday–Saturday).
- **« Mardi–samedi »** : aucune occurrence dans le dépôt ; si la fiche Google Business Profile affiche autre chose, **aligner GBP ou le site après confirmation propriétaire**.
- Places API non disponible dans cet environnement pour lecture live des horaires GBP.

### Affirmations commerciales (conservées avec prudence)
- Navette : « selon disponibilité » (non garantie).
- Délais « sous 48 h » réduits / remplacés par « sur rendez-vous » sur Vitry/Villejuif dans cette PR.

## Checklist Google Business Profile (manuel)

- [ ] Nom exact cohérent avec le site
- [ ] Adresse : 9 rue Michelet, 94200 Ivry-sur-Seine
- [ ] Téléphone : 06 48 74 56 68
- [ ] Site : https://redkmotors.fr
- [ ] Horaires = source officielle confirmée
- [ ] Catégorie principale : Garage automobile / Réparation auto
- [ ] Prestations listées (clim, freins, diagnostic…)
- [ ] Photos atelier réelles (pas inventées)
- [ ] Réponses aux avis — sans faux avis

## Hors scope cette PR

- Cloudflare KV / Worker / redirections 301
- Marketplace / Supabase
- Nouveaux articles ou pages villes
- Tarifs fictifs
