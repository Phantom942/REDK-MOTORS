# Audit NAP & schéma — RED-K MOTORS (20 oct. 2026)

Contexte utilisateur : fiche Google **Publiée**, **46 avis**, trouvable sur recherche marque **RED-K MOTORS**.

## NAP (Name · Address · Phone)

| Élément | Valeur canonique (`site.json`) | Statut repo |
|---------|--------------------------------|-------------|
| Nom | RED-K MOTORS | OK — `site.name`, `localBusiness.json`, mentions légales |
| Rue | 9 rue Michelet | OK — blog, villes, équipe, schema |
| CP / ville | 94200 Ivry-sur-Seine | OK |
| Téléphone affiché | 06 48 74 56 68 | OK — `phoneDisplayCompact` |
| Téléphone `tel:` | +33648745668 | OK — `site.phone` |
| E-mail | contact@redkmotors.fr | OK |
| Horaires | Lun–sam 9h–19h | OK — texte + `openingHoursSchema` |
| URL | https://redkmotors.fr | OK |

### Écarts mineurs (acceptables)

- **Google Maps** affiche parfois **« Red-K Motors »** (casse) dans l’URL / Knowledge Graph ; le nom officiel reste **RED-K MOTORS**. Ne pas créer de second profil pour corriger la casse.
- **legalName** schema : `RED-KMOTORS` (forme légale) ≠ nom commercial — normal pour SIRET.

### Avis Google (site)

- `googleReviews.count` : **46**  
- `googleReviews.rating` : **4.9**  
- `placeId` : `ChIJd1Lv-zdz5kcRFt1G98zTvOY`  
- Pas de `aggregateRating` / `review` en JSON-LD (choix conforme aux consignes Google — avis hébergés sur Google).

## Schéma LocalBusiness

| Champ | Source | Cohérent |
|-------|--------|----------|
| `@type` | AutoRepair, AutomotiveBusiness, LocalBusiness | Oui |
| GPS | 48.80768, 2.37737 | Oui — aligné `site.geo` |
| `hasMap` / `sameAs` | URL Maps + réseaux | Oui |
| Place ID | injecté dans `localBusinessSchema.js` | Oui |
| `openingHoursSpecification` | 09:00–19:00 lun–sam | Oui |
| `areaServed` | Ivry, Vitry, Villejuif, 94, rayon 15 km | Oui |
| `hasOfferCatalog` | Mécanique, carrosserie, entretien, pneus | Oui — aligné prestations |

## Pages locales (rôles SEO)

| URL | Rôle |
|-----|------|
| `/` | Hub « garage Ivry » |
| `/garage-ivry-sur-seine/` | Adresse / accès / NAP renforcé |
| `/vitry-sur-seine/`, `/villejuif/`, etc. | Atelier unique à Ivry — pas de fausses succursales |

## Actions site réalisées (lot oct. 2026)

1. Compteur avis **46** dans `site.json` + `googleReviews.json`.  
2. CTA **Maps / avis / fiche** sur `/garage-ivry-sur-seine/`.  
3. Lien **Laisser un avis Google** sur `/links/`.  
4. Pack contenu fiche : `docs/google-business-profile-pack.md`.  
5. Doc sync API : `docs/sync-google-reviews.md`.

## Actions restantes (hors repo — vous)

1. Coller **services + posts + photos** dans Google Business (voir pack).  
2. Test Maps : `garage ivry sur seine` → **Plus d’établissements** → position RED-K.  
3. Search Console : requêtes marque vs génériques (export manuel).  
4. (Optionnel) Secret CI `GOOGLE_PLACES_API_KEY` pour sync avis au build — voir doc sync.

## Références code

- `src/_data/site.json` — source de vérité NAP + `googleReviews`  
- `src/_data/localBusiness.json` + `localBusinessSchema.js` — JSON-LD  
- `scripts/sync-google-reviews.js` — sync note / count / extraits avis  
