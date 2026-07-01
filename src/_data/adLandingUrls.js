/**
 * URLs canoniques à utiliser directement dans Google Ads.
 * Les anciennes URLs /lp-* redirigent vers ces pages.
 */
module.exports = {
  primary: [
    {
      campaign: "Diagnostic auto / voyant moteur / panne",
      url: "/diagnostic/",
      absolute: "https://redk-motors.me/diagnostic/",
    },
    {
      campaign: "Changement plaquettes frein / freinage",
      url: "/freins/",
      absolute: "https://redk-motors.me/freins/",
    },
    {
      campaign: "Révision voiture / vidange / entretien",
      url: "/entretien/",
      absolute: "https://redk-motors.me/entretien/",
    },
    {
      campaign: "Réparation carrosserie",
      url: "/carrosserie/",
      absolute: "https://redk-motors.me/carrosserie/",
    },
    {
      campaign: "Remplacement pare-brise / bris de glace",
      url: "/pare-brise/",
      absolute: "https://redk-motors.me/pare-brise/",
    },
    {
      campaign: "Réparation auto / mécanique",
      url: "/mecanique/",
      absolute: "https://redk-motors.me/mecanique/",
    },
    {
      campaign: "Changement pneus / montage / parallélisme",
      url: "/pneumatiques/",
      absolute: "https://redk-motors.me/pneumatiques/",
    },
    {
      campaign: "Vidange voiture",
      url: "/vidange/",
      absolute: "https://redk-motors.me/vidange/",
    },
    {
      campaign: "Garage Ivry (générique)",
      url: "/",
      absolute: "https://redk-motors.me/",
    },
    {
      campaign: "Tarifs / prix garage",
      url: "/tarifs/",
      absolute: "https://redk-motors.me/tarifs/",
    },
    {
      campaign: "Contact / devis",
      url: "/contact/",
      absolute: "https://redk-motors.me/contact/",
    },
  ],
  longTailAds: [
    { campaign: "Réparation climatisation Ivry", url: "/reparation-climatisation-ivry/" },
    { campaign: "Changement pneus Ivry", url: "/changement-pneus-ivry/" },
    { campaign: "Révision voiture Ivry", url: "/revision-voiture-ivry/" },
    { campaign: "Changement plaquettes frein 94", url: "/changement-plaquettes-frein-94/" },
    { campaign: "Clim ne refroidit plus 94", url: "/clim-voiture-ne-refroidit-plus-94/" },
    { campaign: "Voiture ne démarre plus 94", url: "/voiture-ne-demarre-plus-94/" },
  ],
  prestations: [
    { campaign: "Changement plaquettes frein", url: "/prestations/plaquettes-disques/" },
    { campaign: "Diagnostic voyant moteur", url: "/prestations/diagnostic-voyant-moteur/" },
    { campaign: "Recherche de panne", url: "/prestations/recherche-de-panne/" },
    { campaign: "Révision voiture", url: "/prestations/revision-entretien/" },
    { campaign: "Vidange voiture", url: "/prestations/vidange-moteur/" },
    { campaign: "Débosselage", url: "/prestations/debosselage/" },
    { campaign: "Peinture localisée", url: "/prestations/peinture-localisee/" },
    { campaign: "Remplacement pare-brise", url: "/prestations/pare-brise-vitrage/" },
    { campaign: "Réparation climatisation", url: "/prestations/recharge-clim/" },
    { campaign: "Parallélisme", url: "/prestations/geometrie/" },
    { campaign: "Changement pneus", url: "/prestations/montage-equilibrage/" },
    { campaign: "Changement courroie distribution", url: "/prestations/distribution-injection/" },
    { campaign: "Changement batterie voiture", url: "/prestations/remplacement-batterie/" },
    { campaign: "Embrayage", url: "/prestations/embrayage/" },
  ],
  legacyRedirects: {
    "/lp-diagnostic/": "/diagnostic/",
    "/lp-freinage/": "/freins/",
    "/lp-revision/": "/entretien/",
    "/lp-carrosserie/": "/carrosserie/",
  },
};
