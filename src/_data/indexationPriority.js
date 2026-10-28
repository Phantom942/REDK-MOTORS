/**
 * URLs prioritaires pour indexation (GSC manuel + IndexNow post-déploiement).
 * Money pages, GEO, guides prix, hubs modèles populaires, articles à fort volume.
 */
const seoNoindex = require("./seoNoindex.js");
const priceExamplesHub = require("./priceExamplesHub.js");

const guidePaths = priceExamplesHub.allGuides().map((g) => g.url);

const popularModelHubPaths = priceExamplesHub.indexableModelHubs().slice(0, 8).map((h) => h.url);

module.exports = {
  /** URLs pingées à chaque deploy (IndexNow) — ordre ≈ importance business */
  urls: [
    "/",
    "/garage-ivry-sur-seine/",
    "/contact/",
    "/tarifs/",
    "/links/",
    "/diagnostic/",
    "/mecanique/",
    "/entretien/",
    "/freins/",
    "/pneumatiques/",
    "/carrosserie/",
    "/vidange/",
    "/pare-brise/",
    "/prestations/",
    "/prestations/recharge-clim/",
    "/prestations/amortisseurs/",
    "/prestations/plaquettes-disques/",
    "/prestations/diagnostic-voyant-moteur/",
    "/prestations/vidange-moteur/",
    "/prestations/remplacement-batterie/",
    "/prestations/pre-controle-technique/",
    "/prestations/geometrie/",
    "/prestations/montage-equilibrage/",
    "/exemples/",
    ...guidePaths,
    ...popularModelHubPaths,
    "/blog/",
    "/blog/articles/voyant-moteur-allume-que-faire/",
    "/blog/articles/amortisseurs-usures-symptomes/",
    "/blog/articles/revision-constructeur-que-comprend-vraiment-service/",
    "/blog/articles/climatisation-voiture-recharge-ivry/",
    "/blog/articles/revision-60000-km-checklist/",
    "/reparation-climatisation-ivry/",
    "/blog/articles/combien-coute-vidange-voiture/",
    "/blog/articles/prix-diagnostic-auto-94/",
    "/blog/articles/prix-changement-plaquettes-frein-94/",
    "/blog/articles/prix-recharge-climatisation-94/",
    "/blog/articles/5-points-controle-avant-ct-ivry/",
    "/blog/articles/pression-pneus-verification-tpms/",
    "/blog/articles/fap-dpf-encrasse-trajets-ville/",
    "/blog/articles/fumee-echappement-couleur-signification/",
    "/blog/articles/batterie-morte-matin-que-faire/",
    "/blog/articles/consommation-voiture-plus-hiver/",
    "/blog/articles/preparer-voiture-hiver-conseils/",
    "/blog/articles/suppression-fap-controle-technique-2026/",
    "/blog/articles/garage-independant-vs-concessionnaire/",
    "/jeu-concours-gta-vi/",
    "/llms.txt",
    "/llms-full.txt",
    "/ai.txt",
    "/vitry-sur-seine/",
    "/villejuif/",
    "/charenton-le-pont/",
    "/paris-13/",
    "/maisons-alfort/",
    "/kremlin-bicetre/",
    "/alfortville/",
    "/professionnels/",
    "/professionnels/taxis-vtc/",
    ...seoNoindex.indexablePaths,
  ],
};
