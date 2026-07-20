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
  exemples: { title: "Guides prix détaillés", url: "/exemples/" },
  prixVidange: { title: "Exemple prix vidange", url: "/exemples/prix-vidange-moteur/" },
  prixFreins: { title: "Exemple prix plaquettes frein", url: "/exemples/prix-plaquettes-frein/" },
  prixPneus: { title: "Exemple prix montage pneus", url: "/exemples/prix-montage-pneus/" },
  prixClim: { title: "Exemple prix recharge clim", url: "/exemples/prix-recharge-climatisation/" },
  prixDistribution: { title: "Exemple prix courroie distribution", url: "/exemples/prix-courroie-distribution/" },
  prixBatterie: { title: "Exemple prix batterie", url: "/exemples/prix-batterie/" },
  prixEmbrayage: { title: "Exemple prix embrayage", url: "/exemples/prix-embrayage/" },
  prixPareBrise: { title: "Exemple prix pare-brise", url: "/exemples/prix-pare-brise/" },
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
  debosselage: { title: "Débosselage sans peinture", url: "/prestations/debosselage/" },
  peintureLocalisee: { title: "Peinture localisée", url: "/prestations/peinture-localisee/" },
  vitry: { title: "Garage proche Vitry", url: "/vitry-sur-seine/" },
  villejuif: { title: "Garage proche Villejuif", url: "/villejuif/" },
  paris13: { title: "Garage proche Paris 13", url: "/paris-13/" },
  samedi: { title: "Garage ouvert le samedi", url: "/garage-ouvert-samedi-94/" },
};

const BY_PAGE = {
  index: [
    "exemples",
    "prixVidange",
    "prixFreins",
    "diagnostic",
    "entretien",
    "tarifs",
    "blog",
    "contact",
    "ivry",
  ],
  contact: [
    "exemples",
    "tarifs",
    "diagnostic",
    "prixVidange",
    "prixFreins",
    "blog",
  ],
  diagnostic: ["mecanique", "voyantMoteur", "entretien", "exemples", "tarifs", "contact", "vitry"],
  freinage: ["plaquettes", "pneumatiques", "prixFreins", "tarifs", "contact"],
  revision: ["vidange", "vidangePresta", "prixVidange", "rechargeClim", "tarifs", "contact"],
  carrosserie: ["pareBrise", "prixPareBrise", "debosselage", "tarifs", "contact"],
  mecanique: ["diagnostic", "distribution", "prixDistribution", "embrayage", "tarifs", "contact"],
  "pare-brise": ["debosselage", "prixPareBrise", "carrosserie", "tarifs", "contact"],
  pneumatiques: ["montagePneus", "prixPneus", "geometrie", "freins", "tarifs"],
  vidange: ["vidangePresta", "prixVidange", "entretien", "tarifs", "contact"],
  prestations: ["diagnostic", "entretien", "exemples", "tarifs", "contact"],
  garageIvry: ["diagnostic", "entretien", "exemples", "tarifs", "contact", "vitry"],
  revision94Seo: ["entretien", "vidange", "prixVidange", "tarifs", "contact", "ivry"],
};

const PRESTATION_BY_SLUG = {
  "revision-entretien": ["entretien", "vidangePresta", "prixVidange", "tarifs"],
  "vidange-moteur": ["vidange", "prixVidange", "entretien", "tarifs"],
  "pre-controle-technique": ["entretien", "diagnostic", "freins", "tarifs"],
  "recherche-de-panne": ["diagnostic", "mecanique", "tarifs", "contact"],
  "distribution-injection": ["mecanique", "prixDistribution", "diagnostic", "tarifs"],
  "diagnostic-voyant-moteur": ["diagnostic", "mecanique", "tarifs", "contact"],
  "decalaminage-moteur": ["mecanique", "diagnostic", "tarifs"],
  amortisseurs: ["mecanique", "geometrie", "pneumatiques", "tarifs"],
  "coupelles-triangles": ["mecanique", "geometrie", "tarifs"],
  geometrie: ["pneumatiques", "montagePneus", "freins", "tarifs"],
  "montage-equilibrage": ["pneumatiques", "prixPneus", "geometrie", "tarifs"],
  "permutation-pneus": ["pneumatiques", "montagePneus", "geometrie", "tarifs"],
  "reparation-crevaison": ["pneumatiques", "montagePneus", "tarifs", "contact"],
  "test-batterie": ["batterie", "prixBatterie", "diagnostic", "tarifs"],
  "remplacement-batterie": ["batterie", "prixBatterie", "tarifs", "contact"],
  "controle-alternateur": ["batterie", "diagnostic", "mecanique", "tarifs"],
  "plaquettes-disques": ["freins", "prixFreins", "pneumatiques", "tarifs"],
  "purge-liquide-frein": ["freins", "plaquettes", "tarifs"],
  "diagnostic-abs": ["freins", "diagnostic", "tarifs"],
  embrayage: ["mecanique", "prixEmbrayage", "diagnostic", "tarifs"],
  cardans: ["mecanique", "geometrie", "tarifs"],
  "vidange-boite": ["mecanique", "entretien", "tarifs"],
  "recharge-clim": ["entretien", "prixClim", "revisionPresta", "tarifs"],
  "desinfection-circuit-clim": ["rechargeClim", "prixClim", "entretien", "tarifs"],
  "controle-compresseur": ["rechargeClim", "diagnostic", "tarifs"],
  debosselage: ["carrosserie", "pareBrisePresta", "tarifs", "contact"],
  "peinture-localisee": ["carrosserie", "tarifs", "contact"],
  "pare-brise-vitrage": ["pareBrise", "prixPareBrise", "carrosserie", "tarifs"],
  "retouches-finitions": ["carrosserie", "tarifs", "contact"],
};

const CITY_PAGES = ["vitry", "villejuif", "paris13", "alfortville", "maisonsAlfort", "kremlin", "charenton", "garageIvry"];

/** Pages pare-brise traitées comme équivalentes pour le maillage (évite les boucles). */
const RELATED_CLUSTERS = [["/pare-brise/", "/prestations/pare-brise-vitrage/"]];

function normalizePath(url) {
  if (!url) return "";
  let path = String(url).trim().split("?")[0].split("#")[0];
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/index\.html$/, "");
  if (!path.endsWith("/")) path += "/";
  return path;
}

function clusterOf(path) {
  const normalized = normalizePath(path);
  return RELATED_CLUSTERS.find((cluster) => cluster.some((entry) => normalizePath(entry) === normalized));
}

function isSameOrSiblingPage(currentUrl, targetUrl) {
  const current = normalizePath(currentUrl);
  const target = normalizePath(targetUrl);
  if (!current || !target) return false;
  if (current === target) return true;
  const cluster = clusterOf(current);
  return Boolean(cluster && cluster.some((entry) => normalizePath(entry) === target));
}

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

/** Max 6 liens = grille 3×2 (desktop) ou 2×3 (tablette) sans case vide. */
const RELATED_MAX = 6;

function resolveRelated(pageId, currentUrl) {
  const keys = resolveKeys(pageId);
  const seen = new Set();
  const result = [];
  for (const key of keys) {
    const page = PAGES[key];
    if (!page || seen.has(page.url)) continue;
    if (isSameOrSiblingPage(currentUrl, page.url)) continue;
    seen.add(page.url);
    result.push(page);
    if (result.length >= RELATED_MAX) break;
  }
  return result;
}

module.exports = {
  PAGES,
  isSameOrSiblingPage,
  resolveRelated,
};
