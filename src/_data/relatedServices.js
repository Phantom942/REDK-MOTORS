/**
 * Maillage interne automatique — liens contextuels par page.
 */
const PAGES = {
  home: { title: "Accueil", url: "/" },
  ivry: { title: "Garage Ivry-sur-Seine", url: "/garage-ivry-sur-seine/" },
  diagnostic: { title: "Diagnostic auto", url: "/diagnostic/" },
  mecanique: { title: "Mécanique générale", url: "/mecanique/" },
  entretien: { title: "Entretien & révision", url: "/entretien/" },
  vidange: { title: "Vidange", url: "/vidange/" },
  freins: { title: "Freinage", url: "/freins/" },
  pneumatiques: { title: "Pneus & géométrie", url: "/pneumatiques/" },
  carrosserie: { title: "Carrosserie", url: "/carrosserie/" },
  pareBrise: { title: "Pare-brise", url: "/pare-brise/" },
  tarifs: { title: "Tarifs indicatifs", url: "/tarifs/" },
  contact: { title: "Contact & RDV", url: "/contact/" },
  prestations: { title: "Toutes les prestations", url: "/prestations/" },
  blog: { title: "Conseils auto (blog)", url: "/blog/" },
  pro: { title: "Espace Pro", url: "/professionnels/" },
  rechargeClim: { title: "Recharge climatisation", url: "/prestations/recharge-clim/" },
  montagePneus: { title: "Montage & équilibrage pneus", url: "/prestations/montage-equilibrage/" },
  plaquettes: { title: "Plaquettes & disques", url: "/prestations/plaquettes-disques/" },
  distribution: { title: "Courroie de distribution", url: "/prestations/distribution-injection/" },
  voyantMoteur: { title: "Diagnostic voyant moteur", url: "/prestations/diagnostic-voyant-moteur/" },
  revisionPresta: { title: "Révision & entretien", url: "/prestations/revision-entretien/" },
  vidangePresta: { title: "Vidange moteur", url: "/prestations/vidange-moteur/" },
  geometrie: { title: "Géométrie & parallélisme", url: "/prestations/geometrie/" },
  embrayage: { title: "Embrayage", url: "/prestations/embrayage/" },
  batterie: { title: "Batterie auto", url: "/prestations/remplacement-batterie/" },
  pareBrisePresta: { title: "Pare-brise & vitrage", url: "/prestations/pare-brise-vitrage/" },
  vitry: { title: "Garage proche Vitry", url: "/vitry-sur-seine/" },
  villejuif: { title: "Garage proche Villejuif", url: "/villejuif/" },
  paris13: { title: "Garage proche Paris 13", url: "/paris-13/" },
  samedi: { title: "Garage ouvert le samedi", url: "/garage-ouvert-samedi-94/" },
};

const BY_PAGE = {
  index: ["diagnostic", "entretien", "freins", "pneumatiques", "carrosserie", "tarifs", "contact", "ivry"],
  diagnostic: ["mecanique", "voyantMoteur", "entretien", "tarifs", "contact", "vitry"],
  freinage: ["plaquettes", "pneumatiques", "diagnostic", "tarifs", "contact"],
  revision: ["vidange", "vidangePresta", "rechargeClim", "revisionPresta", "tarifs", "contact"],
  carrosserie: ["pareBrise", "pareBrisePresta", "tarifs", "contact", "ivry"],
  mecanique: ["diagnostic", "distribution", "embrayage", "freins", "tarifs", "contact"],
  "pare-brise": ["pareBrisePresta", "carrosserie", "tarifs", "contact", "ivry"],
  pneumatiques: ["montagePneus", "geometrie", "freins", "tarifs", "contact"],
  vidange: ["vidangePresta", "entretien", "revisionPresta", "tarifs", "contact"],
  prestations: ["diagnostic", "entretien", "freins", "pneumatiques", "tarifs", "contact"],
  garageIvry: ["diagnostic", "entretien", "freins", "pneumatiques", "tarifs", "contact", "vitry", "villejuif"],
  revision94Seo: ["entretien", "vidange", "diagnostic", "tarifs", "contact", "ivry"],
};

const PRESTATION_BY_SLUG = {
  "revision-entretien": ["entretien", "vidangePresta", "rechargeClim", "tarifs"],
  "vidange-moteur": ["vidange", "entretien", "revisionPresta", "tarifs"],
  "pre-controle-technique": ["entretien", "diagnostic", "freins", "tarifs"],
  "recherche-de-panne": ["diagnostic", "mecanique", "tarifs", "contact"],
  "distribution-injection": ["mecanique", "diagnostic", "tarifs", "contact"],
  "diagnostic-voyant-moteur": ["diagnostic", "mecanique", "tarifs", "contact"],
  "decalaminage-moteur": ["mecanique", "diagnostic", "tarifs"],
  amortisseurs: ["mecanique", "geometrie", "pneumatiques", "tarifs"],
  "coupelles-triangles": ["mecanique", "geometrie", "tarifs"],
  geometrie: ["pneumatiques", "montagePneus", "freins", "tarifs"],
  "montage-equilibrage": ["pneumatiques", "geometrie", "freins", "tarifs"],
  "permutation-pneus": ["pneumatiques", "montagePneus", "geometrie", "tarifs"],
  "reparation-crevaison": ["pneumatiques", "montagePneus", "tarifs", "contact"],
  "test-batterie": ["batterie", "diagnostic", "mecanique", "tarifs"],
  "remplacement-batterie": ["batterie", "diagnostic", "tarifs", "contact"],
  "controle-alternateur": ["batterie", "diagnostic", "mecanique", "tarifs"],
  "plaquettes-disques": ["freins", "pneumatiques", "tarifs", "contact"],
  "purge-liquide-frein": ["freins", "plaquettes", "tarifs"],
  "diagnostic-abs": ["freins", "diagnostic", "tarifs"],
  embrayage: ["mecanique", "diagnostic", "tarifs", "contact"],
  cardans: ["mecanique", "geometrie", "tarifs"],
  "vidange-boite": ["mecanique", "entretien", "tarifs"],
  "recharge-clim": ["entretien", "revisionPresta", "tarifs", "contact"],
  "desinfection-circuit-clim": ["rechargeClim", "entretien", "tarifs"],
  "controle-compresseur": ["rechargeClim", "diagnostic", "tarifs"],
  debosselage: ["carrosserie", "pareBrisePresta", "tarifs", "contact"],
  "peinture-localisee": ["carrosserie", "tarifs", "contact"],
  "pare-brise-vitrage": ["pareBrise", "carrosserie", "tarifs", "contact"],
  "retouches-finitions": ["carrosserie", "tarifs", "contact"],
};

const CITY_PAGES = ["vitry", "villejuif", "paris13", "alfortville", "maisonsAlfort", "kremlin", "charenton", "garageIvry"];

function resolveKeys(pageId) {
  if (!pageId) return BY_PAGE.index;
  if (BY_PAGE[pageId]) return BY_PAGE[pageId];
  if (pageId === "garage-ivry") return BY_PAGE.garageIvry;
  if (pageId.startsWith("prestation-")) {
    const slug = pageId.replace(/^prestation-/, "");
    return PRESTATION_BY_SLUG[slug] || ["prestations", "tarifs", "contact"];
  }
  if (["vitry-sur-seine", "villejuif", "paris-13", "alfortville", "maisons-alfort", "kremlin-bicetre", "charenton-le-pont"].includes(pageId)) {
    return ["diagnostic", "entretien", "freins", "pneumatiques", "tarifs", "contact", "ivry"];
  }
  return BY_PAGE.index;
}

function resolveRelated(pageId) {
  const keys = resolveKeys(pageId);
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
  resolveRelated,
};
