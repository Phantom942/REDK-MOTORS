/**
 * URLs canoniques à utiliser directement dans Google Ads.
 * Les anciennes URLs /lp-* redirigent vers ces pages.
 */
module.exports = {
  primary: [
    {
      campaign: "Diagnostic / panne / voyant moteur",
      url: "/diagnostic/",
      absolute: "https://redk-motors.me/diagnostic/",
    },
    {
      campaign: "Freinage / plaquettes / disques",
      url: "/freins/",
      absolute: "https://redk-motors.me/freins/",
    },
    {
      campaign: "Révision / vidange / entretien",
      url: "/entretien/",
      absolute: "https://redk-motors.me/entretien/",
    },
    {
      campaign: "Carrosserie / chocs / peinture",
      url: "/carrosserie/",
      absolute: "https://redk-motors.me/carrosserie/",
    },
    {
      campaign: "Pare-brise / bris de glace",
      url: "/pare-brise/",
      absolute: "https://redk-motors.me/pare-brise/",
    },
    {
      campaign: "Mécanique générale",
      url: "/mecanique/",
      absolute: "https://redk-motors.me/mecanique/",
    },
    {
      campaign: "Pneus / géométrie",
      url: "/pneumatiques/",
      absolute: "https://redk-motors.me/pneumatiques/",
    },
    {
      campaign: "Vidange",
      url: "/vidange/",
      absolute: "https://redk-motors.me/vidange/",
    },
    {
      campaign: "Garage Ivry (générique)",
      url: "/",
      absolute: "https://redk-motors.me/",
    },
    {
      campaign: "Tarifs",
      url: "/tarifs/",
      absolute: "https://redk-motors.me/tarifs/",
    },
    {
      campaign: "Contact / devis",
      url: "/contact/",
      absolute: "https://redk-motors.me/contact/",
    },
  ],
  prestations: [
    { campaign: "Plaquettes & disques", url: "/prestations/plaquettes-disques/" },
    { campaign: "Diagnostic voyant moteur", url: "/prestations/diagnostic-voyant-moteur/" },
    { campaign: "Recherche de panne", url: "/prestations/recherche-de-panne/" },
    { campaign: "Révision entretien", url: "/prestations/revision-entretien/" },
    { campaign: "Vidange moteur", url: "/prestations/vidange-moteur/" },
    { campaign: "Débosselage", url: "/prestations/debosselage/" },
    { campaign: "Peinture localisée", url: "/prestations/peinture-localisee/" },
    { campaign: "Pare-brise vitrage", url: "/prestations/pare-brise-vitrage/" },
    { campaign: "Recharge clim", url: "/prestations/recharge-clim/" },
    { campaign: "Géométrie", url: "/prestations/geometrie/" },
    { campaign: "Montage pneus", url: "/prestations/montage-equilibrage/" },
    { campaign: "Embrayage", url: "/prestations/embrayage/" },
  ],
  legacyRedirects: {
    "/lp-diagnostic/": "/diagnostic/",
    "/lp-freinage/": "/freins/",
    "/lp-revision/": "/entretien/",
    "/lp-carrosserie/": "/carrosserie/",
  },
};
