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
    "/exemples/",
    "/vitry-sur-seine/",
    "/villejuif/",
    "/charenton-le-pont/",
    "/paris-13/",
    "/maisons-alfort/",
    "/kremlin-bicetre/",
    ...seoNoindex.indexablePaths,
  ],
};
