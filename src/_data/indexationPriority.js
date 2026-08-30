/**
 * URLs prioritaires pour indexation (GSC manuel + IndexNow post-déploiement).
 * Aligné sur seoNoindex.js indexablePaths + hubs services + villes money.
 */
const seoNoindex = require("./seoNoindex.js");

module.exports = {
  /** ~30 URLs — money + hubs + contact/tarifs */
  urls: [
    "/",
    "/contact/",
    "/tarifs/",
    "/garage-ivry-sur-seine/",
    "/diagnostic/",
    "/mecanique/",
    "/entretien/",
    "/freins/",
    "/pneumatiques/",
    "/carrosserie/",
    "/vidange/",
    "/pare-brise/",
    "/prestations/",
    "/blog/",
    "/blog/voyant-moteur-allume-que-faire/",
    "/blog/5-points-controle-avant-ct-ivry/",
    "/blog/pression-pneus-verification-tpms/",
    "/blog/fap-dpf-encrasse-trajets-ville/",
    "/blog/fumee-echappement-couleur-signification/",
    "/blog/batterie-morte-matin-que-faire/",
    "/blog/consommation-voiture-plus-hiver/",
    "/blog/preparer-voiture-hiver-conseils/",
    "/blog/suppression-fap-controle-technique-2026/",
    "/jeu-concours-gta-vi/",
    "/exemples/",
    "/llms.txt",
    "/ai.txt",
    "/vitry-sur-seine/",
    "/villejuif/",
    "/charenton-le-pont/",
    "/paris-13/",
    "/maisons-alfort/",
    "/kremlin-bicetre/",
    ...seoNoindex.indexablePaths,
  ],
};
