/**
 * Liens vers pages money depuis les pages SEO longue traîne (noindex).
 */
const PAGES = {
  diagnostic: { title: "Diagnostic auto", url: "/diagnostic/" },
  mecanique: { title: "Mécanique générale", url: "/mecanique/" },
  entretien: { title: "Entretien & révision", url: "/entretien/" },
  vidange: { title: "Vidange", url: "/vidange/" },
  freins: { title: "Freinage", url: "/freins/" },
  pneumatiques: { title: "Pneus & géométrie", url: "/pneumatiques/" },
  carrosserie: { title: "Carrosserie", url: "/carrosserie/" },
  pareBrise: { title: "Pare-brise", url: "/pare-brise/" },
  rechargeClim: { title: "Recharge climatisation", url: "/prestations/recharge-clim/" },
  montagePneus: { title: "Montage & équilibrage pneus", url: "/prestations/montage-equilibrage/" },
  plaquettes: { title: "Plaquettes & disques", url: "/prestations/plaquettes-disques/" },
  tarifs: { title: "Tarifs indicatifs", url: "/tarifs/" },
  contact: { title: "Contact & devis", url: "/contact/" },
  ivry: { title: "Garage Ivry-sur-Seine", url: "/garage-ivry-sur-seine/" },
  pro: { title: "Espace Pro (VTC, flottes)", url: "/professionnels/" },
};

const BY_PAGE_KEY = {
  voyant94Seo: ["diagnostic", "mecanique", "tarifs"],
  abs94Seo: ["freins", "diagnostic", "tarifs"],
  demarrage94Seo: ["diagnostic", "mecanique", "contact"],
  tremblementVolant94Seo: ["pneumatiques", "freins", "mecanique"],
  revisionRapide94Seo: ["entretien", "vidange", "tarifs"],
  revisionIvrySeo: ["entretien", "vidange", "tarifs"],
  pertePuissance94Seo: ["diagnostic", "mecanique", "entretien"],
  urgence94Seo: ["diagnostic", "contact", "mecanique"],
  pneusFreins94Seo: ["freins", "pneumatiques", "tarifs"],
  pneusIvrySeo: ["pneumatiques", "montagePneus", "tarifs"],
  garageSamedi94Seo: ["entretien", "diagnostic", "ivry"],
  flotte94Seo: ["pro", "entretien", "contact"],
  pro94Seo: ["pro", "entretien", "tarifs"],
  entretienVtc94Seo: ["pro", "entretien", "vidange"],
  preventifVtc94Seo: ["pro", "entretien", "diagnostic"],
  devisGarage94Seo: ["contact", "tarifs", "diagnostic"],
  conso94Seo: ["diagnostic", "entretien", "mecanique"],
  clim94Seo: ["rechargeClim", "entretien", "tarifs"],
  climIvrySeo: ["rechargeClim", "entretien", "contact"],
  plaquettes94Seo: ["freins", "plaquettes", "tarifs"],
  batterie94Seo: ["mecanique", "diagnostic", "contact"],
  diagnostic94Seo: ["diagnostic", "mecanique", "ivry"],
  diagnosticVitrySeo: ["diagnostic", "ivry", "tarifs"],
  diagnosticChoisySeo: ["diagnostic", "ivry", "contact"],
  bruitFrein94Seo: ["freins", "plaquettes", "tarifs"],
};

const DEFAULT_KEYS = ["diagnostic", "entretien", "tarifs", "contact"];

function resolveMoneyPages(pageKey) {
  const keys = BY_PAGE_KEY[pageKey] || DEFAULT_KEYS;
  const seen = new Set();
  const result = [];
  for (const key of keys) {
    const page = PAGES[key];
    if (page && !seen.has(page.url)) {
      seen.add(page.url);
      result.push(page);
    }
  }
  return result;
}

module.exports = {
  PAGES,
  resolveMoneyPages,
};
