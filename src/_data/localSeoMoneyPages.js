/**
 * Liens vers pages money depuis les pages SEO longue traîne.
 * Toujours un nombre pair (grille 2 colonnes).
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

/** Listes à 4 liens (pair) — contact/tarifs en complément si besoin. */
const BY_PAGE_KEY = {
  voyant94Seo: ["diagnostic", "mecanique", "tarifs", "contact"],
  abs94Seo: ["freins", "diagnostic", "tarifs", "contact"],
  demarrage94Seo: ["diagnostic", "mecanique", "tarifs", "contact"],
  tremblementVolant94Seo: ["pneumatiques", "freins", "mecanique", "tarifs"],
  revisionRapide94Seo: ["entretien", "vidange", "tarifs", "contact"],
  revision94Seo: ["entretien", "vidange", "tarifs", "contact"],
  pertePuissance94Seo: ["diagnostic", "mecanique", "entretien", "tarifs"],
  urgence94Seo: ["diagnostic", "mecanique", "tarifs", "contact"],
  pneusFreins94Seo: ["freins", "pneumatiques", "tarifs", "contact"],
  pneusIvrySeo: ["pneumatiques", "montagePneus", "tarifs", "contact"],
  garageSamedi94Seo: ["entretien", "diagnostic", "ivry", "contact"],
  flotte94Seo: ["pro", "entretien", "tarifs", "contact"],
  pro94Seo: ["pro", "entretien", "tarifs", "contact"],
  entretienVtc94Seo: ["pro", "entretien", "vidange", "tarifs"],
  preventifVtc94Seo: ["pro", "entretien", "diagnostic", "tarifs"],
  devisGarage94Seo: ["contact", "tarifs", "diagnostic", "entretien"],
  conso94Seo: ["diagnostic", "entretien", "mecanique", "tarifs"],
  clim94Seo: ["rechargeClim", "entretien", "tarifs", "contact"],
  climIvrySeo: ["rechargeClim", "entretien", "tarifs", "contact"],
  plaquettes94Seo: ["freins", "plaquettes", "tarifs", "contact"],
  batterie94Seo: ["mecanique", "diagnostic", "tarifs", "contact"],
  diagnostic94Seo: ["diagnostic", "mecanique", "ivry", "tarifs"],
  diagnosticVitrySeo: ["diagnostic", "ivry", "tarifs", "contact"],
  diagnosticChoisySeo: ["diagnostic", "ivry", "tarifs", "contact"],
  bruitFrein94Seo: ["freins", "plaquettes", "tarifs", "contact"],
};

const DEFAULT_KEYS = ["diagnostic", "entretien", "tarifs", "contact"];
const PAD_KEYS = ["tarifs", "contact", "entretien", "diagnostic"];

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
  for (const key of PAD_KEYS) {
    if (result.length % 2 === 0 && result.length >= 2) break;
    const page = PAGES[key];
    if (page && !seen.has(page.url)) {
      seen.add(page.url);
      result.push(page);
    }
  }
  if (result.length % 2 === 1) result.pop();
  return result;
}

module.exports = {
  PAGES,
  resolveMoneyPages,
};
