# Récapitulatif SEO / cohérence RED-K MOTORS

Branche : `cursor/seo-coherence-redkmotors-b227`  
Source de vérité appliquée : `https://redkmotors.fr` · Lun–sam 09:00–19:00 · `tel:+33648745668`

## Fichiers modifiés (principaux)

| Zone | Fichiers |
|---|---|
| Source de vérité | `src/_data/site.json`, `src/_data/localBusiness.json`, `src/_data/localBusinessSchema.js` |
| JSON-LD | `src/_includes/base.njk`, `.eleventy.js` (filtre `jsonLdNode`), `src/src.11tydata.js`, `src/prestations/prestation.11tydata.js` |
| Téléphone | pages villes + `landingPages.js` + `interventionDiagnosticOffer.js` (plus de `06.48.74.56.68`) |
| Services hub | `mecanique`, `carrosserie`, `vidange`, `entretien`, `diagnostic`, `freins`, `pneumatiques`, `pare-brise` (`areaServed` étendu) |
| Indexation | `robots.txt` (+ Claude-User, Claude-SearchBot), `src/llms.txt.njk` |
| Redirections `.me` | `redirect-me/.htaccess`, `_redirects`, `vercel.json`, `README.md` |
| Alt | `src/links.njk` |

## Corrections appliquées

1. **Horaires schema** : `opens`/`closes` → `09:00` / `19:00` (plus de `9:00`).
2. **Téléphone** : `phoneDisplay` = `+33 6 48 74 56 68` ; `tel:` = `+33648745668` ; affichage compact UI = `06 48 74 56 68` ; suppression du format à points.
3. **Email / domaine live** : déjà corrects (`contact@redkmotors.fr`, `redkmotors.fr`) — rien à corriger dans le contenu indexable.
4. **JSON-LD** :
   - un seul bloc `@graph` par page ;
   - `AutoRepair` / LocalBusiness conservé ;
   - **suppression de `aggregateRating` et `review`** (avis Google → non conforme si recopiés) ;
   - `Service` + `FAQPage` + `BreadcrumbList` fusionnés dans le même `@graph` ;
   - breadcrumb par défaut pour les pages internes sans fil d’Ariane explicite ;
   - `areaServed` prestations + hubs aligné sur la zone (Ivry, Vitry, Villejuif, Charenton, Alfortville, Paris 13e, Val-de-Marne).
5. **Canonical / OG** : `og:url` aligné sur le même chemin que `<link rel="canonical">`.
6. **robots.txt** : autorisations explicites Claude-User + Claude-SearchBot (Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Perplexity*, Google-Extended, Applebot-Extended déjà présents).
7. **llms.txt** : zone + liste des services avec URLs canoniques.
8. **Sitemap** : généré au build depuis les collections Eleventy (pages / blog / exemples), URLs absolues `redkmotors.fr`, exclusion noindex via `collections.sitemap` — inchangé structurellement, toujours valide après build.
9. **Vidéos** : déjà `preload="none"` + `poster` dans `hero-video.njk`.
10. **Redirections 301 `.me`** : fichiers serveur prêts (Apache / Netlify / Vercel). Le soft redirect GitHub Pages est conservé en fallback.

## Actions restantes hors code

### Critique — 301 `redk-motors.me`

GitHub Pages **ne peut pas** servir de vrais 301. Il faut activer l’une des options documentées dans `redirect-me/README.md` :

- **Cloudflare Redirect Rules** (recommandé) : `*redk-motors.me/*` → `https://redkmotors.fr/$1` en 301  
- **Amen** micro-hébergement + `.htaccess`  
- **Netlify** (`_redirects`) ou **Vercel** (`vercel.json`)

Puis dans **Google Search Console** (propriété `.me` et `.fr`) : inspection + demande de prise en compte des redirections / changement d’adresse si applicable.

### Search Console / indexation

- Resoumettre `https://redkmotors.fr/sitemap.xml`
- Vérifier couverture (exclure éventuelles URLs encore en soft-redirect `.me`)
- Surveiller « pages avec redirection » / « page exemple »

### Fiche Google Business

- Horaires : lun–sam 9h–19h, fermé dimanche  
- Téléphone / site / adresse alignés sur la source de vérité  
- Ne pas compter sur le JSON-LD pour les étoiles (avis uniquement sur Google)

### Réseaux sociaux / sameAs

- Vérifier que Facebook, Instagram, TikTok, YouTube, Snapchat pointent bien vers les URLs déjà en `sameAs`
- Bio / horaires / lien site = `redkmotors.fr`

### Suivi contenu (optionnel, non bloquant)

- ~150 titles / meta descriptions hors fenêtre idéale 50–60 / 140–160 caractères (surtout blog) — à retoucher progressivement **sans** changer le fond commercial
- Unifier les libellés d’horaires affichés (`Lun–sam 9h–19h` vs `Lundi - Samedi : 9h00 - 19h00` footer) si tu veux une formulation unique partout

## Build

`npm run build` OK après ces changements.
