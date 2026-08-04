/**
 * Règles noindex centralisées — utilisées par base.njk et .eleventy.js (sitemap).
 *
 * Stratégie : pages template / doorway en noindex, sauf whitelist de landings
 * commerciales différenciées (indexables + sitemap).
 *
 * Matching = startsWith(prefix) uniquement (jamais "contains") pour ne pas
 * noindexer un article blog du type /blog/voyant-abs-allume-…/
 *
 * Clusters money vs hubs (garder doorways faibles hors whitelist) :
 * - Freins : indexables = /freins/ (hub) + /changement-plaquettes-frein-94/ + /voyant-abs-allume-94/
 *   noindex volontaire : /bruit-frein-voiture-* (hors whitelist), /changement-plaquettes-frein-* (hors 94)
 * - Batterie : indexable = /changement-batterie-94/ ; noindex = /changement-batterie-* autres
 * - Vidange/révision : indexables = /vidange/, /entretien/, /revision-voiture-ivry/,
 *   /revision-auto-val-de-marne/, /vidange-rapide-ivry/ ;
 *   noindex : /revision-rapide-*, /revision-auto-* ville (Vitry, Choisy…), /vidange-rapide-* hors ivry
 * - Clim : indexables = /clim-voiture-ne-refroidit-plus-94/ + /reparation-climatisation-ivry/ ;
 *   noindex : /clim-voiture-ne-refroidit-plus-* autres, /reparation-climatisation-* hors ivry
 *
 * Garage-proche (~16) : stubs 301 → pages ville / money (voir garageProcheRedirects.js).
 * (seul vrai doublon ville money). Pas d'autre twin exact (pas de /creteil/, /vincennes/…).
 * Candidats futurs (si page ville money créée) : creteil, vincennes, saint-mande,
 * joinville-le-pont, choisy-le-roi, cachan, arcueil, gentilly — sinon laisser noindex.
 */
module.exports = {
  prefixes: [
    "/garage-proche-",
    "/garage-vtc-",
    "/garage-taxi-",
    "/garage-chauffeur-prive-",
    "/garage-voiture-uber-",
    "/mecanicien-rapide-",
    "/mecanique-rapide-",
    "/diagnostic-auto-",
    "/revision-auto-",
    "/blog/tag/",
    "/devis-garage-",
    "/garage-urgence-",
    "/garage-flotte-entreprise-",
    "/garage-pneus-freins-",
    "/entretien-vehicule-vtc-",
    "/entretien-preventif-vtc-",
    "/entretien-voiture-professionnelle-",
    "/entretien-taxi-",
    "/changement-batterie-",
    "/changement-plaquettes-frein-",
    "/perte-puissance-voiture-",
    "/voiture-ne-demarre-plus-",
    "/consommation-carburant-elevee-",
    "/tremblement-volant-autoroute-",
    "/bruit-frein-voiture-",
    "/clim-voiture-ne-refroidit-plus-",
    "/reparation-climatisation-",
    "/changement-pneus-",
    "/revision-voiture-",
    "/voyant-abs-allume-",
    "/diagnostic-voyant-moteur-",
    "/vidange-rapide-",
    "/revision-rapide-",
    "/reparation-auto-paris-sud/",
    "/carrosserie-peinture-ivry/",
    "/garage-ouvert-samedi-",
    "/lp-",
    "/liens",
  ],
  /**
   * Landings fortes à garder indexables malgré un préfixe noindex.
   * ~15 max — contenu différencié (éviter doorway).
   * Ne pas ajouter bruit-frein, revision-rapide, revision-auto-ville, garage-proche.
   */
  indexablePaths: [
    "/changement-batterie-94/",
    "/changement-plaquettes-frein-94/",
    "/clim-voiture-ne-refroidit-plus-94/",
    "/reparation-climatisation-ivry/",
    "/diagnostic-voyant-moteur-94/",
    "/garage-pneus-freins-94/",
    "/revision-voiture-ivry/",
    "/revision-auto-val-de-marne/",
    "/garage-ouvert-samedi-94/",
    "/devis-garage-94/",
    "/voyant-abs-allume-94/",
    "/voiture-ne-demarre-plus-94/",
    "/perte-puissance-voiture-94/",
    "/vidange-rapide-ivry/",
    "/reparation-auto-paris-sud/",
  ],

  /** true si l'URL doit être noindexée (hors whitelist). */
  shouldNoindex(url) {
    if (!url) return false;
    const path = String(url);
    if (this.indexablePaths.includes(path)) return false;
    return this.prefixes.some((prefix) => path.startsWith(prefix));
  },
};
