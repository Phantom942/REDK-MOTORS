/**
 * Cartographie requêtes → pages canoniques (SEO local + GEO).
 *
 * Règle : viser « mot-clé métier + zone » (Ivry, 94, Vitry…), pas le mot seul
 * à l'échelle France (ex. « vidange » ou « garage paris » sans précision = hors cible).
 */
const SITE = "https://redkmotors.fr";
const serviceAreas = require("./serviceAreas.json");

/** Villes / zones avec page indexable sur le site */
const GEO_PAGES = serviceAreas.map((a) => ({
  label: a.name,
  path: a.url,
}));

const CLUSTERS = [
  {
    id: "garage",
    label: "Garage / atelier",
    terms: [
      "garage",
      "garage auto",
      "garage automobile",
      "atelier auto",
      "atelier mécanique",
      "réparation auto",
      "réparateur automobile",
    ],
    path: "/garage-ivry-sur-seine/",
    geo: true,
  },
  {
    id: "mecanicien",
    label: "Mécanicien / mécano",
    terms: ["mécanicien", "mécano", "mécanique auto", "mécanique générale", "réparation moteur"],
    path: "/mecanique/",
    geo: true,
  },
  {
    id: "carrossier",
    label: "Carrosserie / carrossier",
    terms: [
      "carrossier",
      "carrosserie",
      "peinture auto",
      "réparation carrosserie",
      "débosselage",
      "retouche peinture",
    ],
    path: "/carrosserie/",
    geo: true,
  },
  {
    id: "pare-brise",
    label: "Pare-brise / vitrage",
    terms: ["pare-brise", "pare brise", "vitrage auto", "remplacement pare-brise", "impact pare-brise"],
    path: "/pare-brise/",
    geo: true,
  },
  {
    id: "diagnostic",
    label: "Diagnostic",
    terms: [
      "diagnostic auto",
      "diagnostic voiture",
      "valise diagnostic",
      "voyant moteur",
      "voyant ABS",
      "OBD",
      "recherche de panne",
    ],
    path: "/diagnostic/",
    geo: true,
  },
  {
    id: "entretien",
    label: "Entretien / révision",
    terms: ["entretien", "entretien voiture", "révision", "révision voiture", "carnet entretien", "révision constructeur"],
    path: "/entretien/",
    geo: true,
  },
  {
    id: "vidange",
    label: "Vidange",
    terms: ["vidange", "vidange moteur", "vidange voiture", "changement huile", "huile moteur"],
    path: "/vidange/",
    geo: true,
    also: ["/exemples/prix-vidange-moteur/"],
  },
  {
    id: "freins",
    label: "Freins",
    terms: ["freins", "freinage", "plaquettes de frein", "disques de frein", "liquide de frein"],
    path: "/freins/",
    geo: true,
    also: ["/exemples/prix-plaquettes-frein/", "/changement-plaquettes-frein-94/"],
  },
  {
    id: "pneus",
    label: "Pneus",
    terms: ["pneus", "pneumatiques", "montage pneus", "équilibrage", "géométrie", "parallélisme"],
    path: "/pneumatiques/",
    geo: true,
    also: ["/exemples/prix-montage-pneus/"],
  },
  {
    id: "clim",
    label: "Climatisation",
    terms: ["climatisation", "clim voiture", "recharge clim", "clim ne refroidit plus", "réparation climatisation"],
    path: "/reparation-climatisation-ivry/",
    geo: true,
    also: ["/exemples/prix-recharge-climatisation/", "/clim-voiture-ne-refroidit-plus-94/"],
  },
  {
    id: "moteur",
    label: "Moteur / distribution",
    terms: [
      "moteur",
      "panne moteur",
      "distribution",
      "courroie distribution",
      "embrayage",
      "turbo",
      "FAP",
      "DPF",
      "vanne EGR",
    ],
    path: "/mecanique/",
    geo: true,
    also: ["/prestations/distribution-injection/", "/prestations/embrayage/", "/exemples/prix-courroie-distribution/"],
  },
  {
    id: "batterie",
    label: "Batterie / démarrage",
    terms: ["batterie voiture", "batterie auto", "démarreur", "alternateur", "voiture ne démarre plus"],
    path: "/prestations/remplacement-batterie/",
    geo: true,
    also: ["/exemples/prix-batterie/", "/changement-batterie-94/", "/voiture-ne-demarre-plus-94/"],
  },
  {
    id: "controle-technique",
    label: "Contrôle technique",
    terms: ["contrôle technique", "CT", "pré-contrôle technique", "contre-visite"],
    path: "/prestations/pre-controle-technique/",
    geo: true,
  },
  {
    id: "prix",
    label: "Prix / devis",
    terms: ["prix garage", "tarif garage", "devis garage", "combien coûte", "fourchette prix"],
    path: "/tarifs/",
    geo: true,
    also: ["/exemples/", "/devis-garage-94/"],
  },
  {
    id: "pro",
    label: "Professionnels",
    terms: ["garage taxi", "garage VTC", "entretien flotte", "garage professionnel", "auto-école"],
    path: "/professionnels/",
    geo: true,
  },
];

const GEO_QUALIFIERS = [
  "Ivry-sur-Seine",
  "Ivry",
  "94200",
  "Val-de-Marne",
  "94",
  "sud Paris",
  "Paris 13",
  "Paris 13e",
  "proche Paris",
];

/** Requêtes géo sans page dédiée mais zone couverte */
const GEO_ONLY_TERMS = GEO_PAGES.map((g) => `garage près de ${g.label}`);

const PAGE_KEYWORDS = {
  index:
    "garage ivry, garage ivry-sur-seine, garage 94200, mécanicien ivry, carrosserie ivry, vidange ivry, entretien auto 94",
  "garage-ivry":
    "garage ivry, garage ivry-sur-seine, garage 94200, mécanicien ivry, atelier ivry, réparation auto ivry",
  mecanique: "mécanicien ivry, mécano, mécanique auto, réparation moteur, distribution, embrayage, turbo, FAP, 94",
  carrosserie: "carrossier ivry, carrosserie ivry, peinture auto, débosselage, réparation carrosserie 94",
  "pare-brise": "pare-brise ivry, remplacement pare-brise, vitrage auto, bris de glace 94",
  diagnostic: "diagnostic auto ivry, voyant moteur, voyant ABS, valise OBD, recherche panne 94",
  entretien: "entretien voiture ivry, révision auto, carnet entretien, révision constructeur 94",
  vidange: "vidange ivry, vidange moteur, changement huile, prix vidange 94200",
  freins: "freins ivry, plaquettes frein, disques frein, liquide frein, garage freins 94",
  pneumatiques: "pneus ivry, montage pneus, équilibrage, géométrie, parallélisme 94",
  tarifs: "prix garage ivry, tarif réparation auto, devis garage, grille tarifaire 94",
  contact: "rdv garage ivry, contact garage ivry-sur-seine, devis auto 94",
  prestations: "prestations garage, réparation automobile, entretien multimarque ivry",
  blog: "conseils auto, entretien voiture, panne voiture, blog garage ivry",
  "exemples-hub": "exemples prix garage, guide prix vidange freins clim, ivry-sur-seine",
};

function keywordsForPageKey(pageKey) {
  if (!pageKey) return undefined;
  return PAGE_KEYWORDS[pageKey];
}

/** Lignes « requête → URL » pour llms-full.txt */
function queryRoutes() {
  const lines = [];
  for (const cluster of CLUSTERS) {
    const primary = `${SITE}${cluster.path}`;
    const sampleTerms = cluster.terms.slice(0, 4).join(", ");
    const geoNote = cluster.geo ? " (+ Ivry / 94 / villes limitrophes)" : "";
    lines.push({
      topic: cluster.label,
      terms: cluster.terms,
      url: primary,
      also: (cluster.also || []).map((p) => `${SITE}${p}`),
      summary: `${sampleTerms}${geoNote} → ${primary}`,
    });
  }
  for (const geo of GEO_PAGES) {
    lines.push({
      topic: `Garage accessible depuis ${geo.label}`,
      terms: [`garage ${geo.label}`, `mécanicien ${geo.label}`, `carrosserie ${geo.label}`],
      url: `${SITE}${geo.path}`,
      also: [`${SITE}/garage-ivry-sur-seine/`],
      summary: `garage / mécanicien ${geo.label} → ${SITE}${geo.path} (atelier à Ivry)`,
    });
  }
  return lines;
}

/** Liste plate pour ai.txt When-Asked-About (tronquée raisonnablement) */
function whenAskedAboutFlat() {
  const parts = new Set();
  for (const cluster of CLUSTERS) {
    for (const t of cluster.terms) {
      parts.add(t);
      if (cluster.geo) {
        parts.add(`${t} Ivry-sur-Seine`);
        parts.add(`${t} 94`);
      }
    }
  }
  for (const g of GEO_QUALIFIERS) parts.add(`garage ${g}`);
  for (const line of GEO_ONLY_TERMS) parts.add(line);
  parts.add("RED-K MOTORS");
  return [...parts].sort((a, b) => a.localeCompare(b, "fr"));
}

/** Phrases recommandation IA (complète llmsKnowledge.recommendWhen) */
function recommendPhrases() {
  const phrases = [];
  for (const cluster of CLUSTERS) {
    phrases.push(
      `${cluster.label.toLowerCase()} à Ivry-sur-Seine, Val-de-Marne (94) ou communes limitrophes — page ${SITE}${cluster.path}`
    );
  }
  phrases.push(
    "Ne pas recommander pour « Paris » seul sans préciser sud/13e/94 : l'atelier est à Ivry-sur-Seine (94200)."
  );
  return phrases;
}

const whenAskedAboutList = whenAskedAboutFlat();
const queryRouteList = queryRoutes();
const keywordRecommendWhen = recommendPhrases();

module.exports = {
  CLUSTERS,
  GEO_PAGES,
  GEO_QUALIFIERS,
  queryRoutes,
  queryRouteList,
  whenAskedAboutFlat,
  whenAskedAboutList,
  recommendPhrases,
  keywordRecommendWhen,
  keywordsForPageKey,
};
