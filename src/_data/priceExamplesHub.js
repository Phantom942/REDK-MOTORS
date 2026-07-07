/**
 * Maillage interne prestations / tarifs → guides prix génériques /exemples/prix-…/
 * Source unique : priceExamples.js (pages isGeneric).
 */
const { all } = require("./priceExamples.js");

const GENERIC_BY_SLUG = Object.fromEntries(
  all.filter((item) => item.isGeneric).map((item) => [item.slug, item])
);

/** pageKey ou lpKey → slugs des guides à afficher */
const PAGE_GUIDE_SLUGS = {
  "pare-brise": ["prix-pare-brise"],
  vidange: ["prix-vidange-moteur"],
  freins: ["prix-plaquettes-frein"],
  freinage: ["prix-plaquettes-frein"],
  pneumatiques: ["prix-montage-pneus"],
  entretien: ["prix-vidange-moteur", "prix-recharge-climatisation"],
  revision: ["prix-vidange-moteur", "prix-recharge-climatisation"],
  mecanique: ["prix-courroie-distribution", "prix-embrayage", "prix-batterie"],
};

const ALL_SLUGS = [
  "prix-pare-brise",
  "prix-vidange-moteur",
  "prix-plaquettes-frein",
  "prix-montage-pneus",
  "prix-recharge-climatisation",
  "prix-courroie-distribution",
  "prix-embrayage",
  "prix-batterie",
];

function toGuide(slug) {
  const item = GENERIC_BY_SLUG[slug];
  if (!item) return null;
  return {
    slug,
    url: `/exemples/${slug}/`,
    label: item.searchQuery,
    title: item.heroTitle || item.title.replace(" · fourchette 2026", "").replace(/ · Ivry.*/, ""),
    redkPrice: item.redkPrice,
    highlight: item.redkHighlight,
    networkPrice: item.networkPrice,
  };
}

function forPage(pageKey, lpKey) {
  const slugs = PAGE_GUIDE_SLUGS[pageKey] || PAGE_GUIDE_SLUGS[lpKey] || [];
  return slugs.map(toGuide).filter(Boolean);
}

function allGuides() {
  return ALL_SLUGS.map(toGuide).filter(Boolean);
}

module.exports = {
  forPage,
  allGuides,
  PAGE_GUIDE_SLUGS,
};
