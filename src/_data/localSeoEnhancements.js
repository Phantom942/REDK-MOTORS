/**
 * Enrichissements UI/SEO pour pages local-seo-page.njk (~66 pages).
 * Fusionne citySeoContent, catégories thématiques et overrides par pageKey.
 */
const citySeoContent = require("./citySeoContent.js");

const PROCESS_HIGHLIGHTS = [
  "Devis gratuit avant intervention",
  "Atelier à Ivry-sur-Seine (94)",
  "Essence et diesel, toutes marques",
  "Lun–sam 9h–19h — réponse en journée",
];

const CATEGORIES = {
  freinage: {
    reviewKey: "freinage",
    symptoms: [
      "Voyant ABS ou frein allumé",
      "Grincement au freinage",
      "Pédale molle ou spongieuse",
      "Vibrations au freinage",
      "Distance d'arrêt allongée",
    ],
    seoTitle: "Freinage et diagnostic ABS à Ivry-sur-Seine",
    seoParagraphs: [
      "Plaquettes, disques, liquide de frein et diagnostic ABS : contrôle usure réel avant tout remplacement. Devis écrit gratuit à l'atelier RED-K MOTORS, 9 rue Michelet.",
      "Conducteurs du Val-de-Marne : intervention sur rendez-vous, souvent sous 48 h.",
    ],
    seoProblems: [
      { text: "Plaquettes usées", url: "/blog/plaquettes-frein-usure-signaux-a-ne-pas-ignorer/" },
      { text: "Voyant ABS", url: "/blog/voyant-abs-allume-causes-conduite/" },
      { text: "Pédale molle", url: "/blog/freinage-mou-pedale-spongieuse/" },
      { text: "Changement plaquettes 94", url: "/blog/prix-changement-plaquettes-frein-94/" },
    ],
    highlights: PROCESS_HIGHLIGHTS,
  },
  diagnostic: {
    reviewKey: "diagnostic",
    symptoms: [
      "Voyant moteur orange ou rouge",
      "Mode dégradé ou perte de puissance",
      "Voiture qui ne démarre plus",
      "Ratés ou à-coups à l'accélération",
      "Codes défaut turbo / EGR / FAP",
    ],
    seoTitle: "Diagnostic auto à Ivry-sur-Seine",
    seoParagraphs: [
      "Lecture valise multimarques, recherche de panne et explication claire avant réparation. Voyant moteur, panne électronique ou mécanique : devis écrit gratuit.",
      "Atelier accessible depuis Vitry, Villejuif, Paris 13 et tout le 94 — lun–sam 9h–19h.",
    ],
    seoProblems: [
      { text: "Voyant moteur", url: "/blog/voyant-moteur-allume-que-faire/" },
      { text: "Prix diagnostic 94", url: "/blog/prix-diagnostic-auto-94/" },
      { text: "Turbo en panne", url: "/blog/turbo-compresseur-symptomes-panne/" },
      { text: "Vanne EGR", url: "/blog/vanne-egr-encrassee-symptomes/" },
    ],
    highlights: PROCESS_HIGHLIGHTS,
  },
  revision: {
    reviewKey: "revision",
    symptoms: [
      "Vidange à échéance ou voyant entretien",
      "Huile moteur sombre ou niveau bas",
      "Climatisation faible ou odeur",
      "Filtres air / habitacle à changer",
      "Préparation contrôle technique",
    ],
    seoTitle: "Révision et entretien à Ivry-sur-Seine",
    seoParagraphs: [
      "Révision selon carnet constructeur, vidange, filtres et recharge climatisation. Pièces adaptées au véhicule, devis clair avant travaux.",
      "Garage du Val-de-Marne : créneau souvent disponible sous 48 h sur rendez-vous.",
    ],
    seoProblems: [
      { text: "Révision 60 000 km", url: "/blog/revision-60000-km-checklist/" },
      { text: "Vidange moteur", url: "/blog/combien-coute-vidange-voiture/" },
      { text: "Recharge clim", url: "/blog/climatisation-voiture-recharge-ivry/" },
    ],
    highlights: PROCESS_HIGHLIGHTS,
  },
  pneumatiques: {
    reviewKey: "pneumatiques",
    symptoms: [
      "Usure irrégulière des pneus",
      "Volant qui tire à gauche ou droite",
      "Vibrations à haute vitesse",
      "Pneus été / hiver à monter",
      "Crevaison ou clou",
    ],
    seoTitle: "Pneus et géométrie à Ivry-sur-Seine",
    seoParagraphs: [
      "Montage, équilibrage, permutation et parallélisme. Stock été/hiver selon arrivages ou montage de vos pneus.",
      "Contrôle usure et pression inclus — devis au modèle avant intervention.",
    ],
    seoProblems: [
      { text: "Quand changer les pneus", url: "/blog/quand-changer-pneus-usure-securite/" },
      { text: "Géométrie des roues", url: "/blog/geometrie-roues-signes-mauvais-alignement/" },
      { text: "Prix pneus 94", url: "/blog/prix-changement-pneus-94/" },
    ],
    highlights: PROCESS_HIGHLIGHTS,
  },
  vidange: {
    reviewKey: "vidange",
    symptoms: [
      "Vidange prévue au carnet",
      "Huile noire ou consommation d'huile",
      "Voyant entretien ou huile",
      "Moteur bruyant au démarrage",
    ],
    seoTitle: "Vidange moteur à Ivry-sur-Seine",
    seoParagraphs: [
      "Huile homologuée constructeur, filtre neuf et contrôle des niveaux. Intervention souvent le jour même sur rendez-vous.",
      "Complément idéal d'une révision ou préparation contrôle technique.",
    ],
    seoProblems: [
      { text: "Combien coûte une vidange", url: "/blog/combien-coute-vidange-voiture/" },
    ],
    highlights: PROCESS_HIGHLIGHTS,
  },
  carrosserie: {
    reviewKey: "carrosserie",
    symptoms: [
      "Rayure ou enfoncement carrosserie",
      "Peinture écaillée ou ternie",
      "Impact pare-brise ou vitre fissurée",
      "Dégâts après accrochage",
    ],
    seoTitle: "Carrosserie et peinture à Ivry-sur-Seine",
    seoParagraphs: [
      "Débosselage, peinture localisée, retouches et pare-brise. Devis sur photo WhatsApp en quelques minutes.",
      "Documents pour dossier assurance — intervention après validation du devis.",
    ],
    seoProblems: [
      { text: "Rayure carrosserie", url: "/blog/rayure-carrosserie-quand-reparer/" },
      { text: "Après un accident", url: "/blog/que-faire-apres-accident-carrosserie/" },
    ],
    highlights: PROCESS_HIGHLIGHTS,
  },
  clim: {
    reviewKey: "revision",
    symptoms: [
      "Climatisation ne refroidit plus",
      "Odeur moisi à la ventilation",
      "Bruit anormal clim allumée",
      "Recharge clim à faire",
    ],
    seoTitle: "Climatisation auto à Ivry-sur-Seine",
    seoParagraphs: [
      "Diagnostic du circuit clim, recherche de fuite et recharge. Contrôle compresseur et pression avant intervention.",
      "Devis gratuit — recharge climatisation sur rendez-vous à l'atelier du 94.",
    ],
    seoProblems: [
      { text: "Recharge clim Ivry", url: "/blog/climatisation-voiture-recharge-ivry/" },
      { text: "Prix recharge clim 94", url: "/blog/prix-recharge-climatisation-94/" },
    ],
    highlights: PROCESS_HIGHLIGHTS,
  },
  mecanique: {
    reviewKey: "mecanique",
    symptoms: [
      "Perte de puissance à l'accélération",
      "Voiture qui broute ou cale",
      "Bruit moteur anormal",
      "Surconsommation de carburant",
      "Batterie faible ou démarrage difficile",
      "Volant qui tremble à l'autoroute",
    ],
    seoTitle: "Mécanique générale à Ivry-sur-Seine",
    seoParagraphs: [
      "Distribution, embrayage, turbo, EGR, FAP, suspension et recherche de panne. Diagnostic préalable et devis écrit avant réparation.",
      "Atelier multimarque essence et diesel — flottes et particuliers.",
    ],
    seoProblems: [
      { text: "Perte de puissance", url: "/blog/voiture-broute-acceleration-causes-94/" },
      { text: "Turbo", url: "/blog/turbo-compresseur-symptomes-panne/" },
      { text: "Batterie voiture", url: "/blog/batterie-voiture-quand-changer/" },
    ],
    highlights: PROCESS_HIGHLIGHTS,
  },
  fleet: {
    reviewKey: "revision",
    symptoms: [
      "Entretien régulier flotte VTC / taxi",
      "Révision avant contrôle technique",
      "Pneus et freins à usure rapide",
      "Diagnostic voyant sans immobilisation longue",
    ],
    seoTitle: "Garage VTC, taxi et flottes à Ivry",
    seoParagraphs: [
      "Entretien préventif, révision et réparations courantes pour VTC, taxis et flottes entreprise. Créneaux adaptés à votre activité.",
      "Devis transparent, suivi clair — atelier à Ivry-sur-Seine, accessible depuis Paris sud et le 94.",
    ],
    highlights: [
      "Flottes VTC et taxis acceptées",
      "Entretien préventif planifié",
      "Devis avant intervention",
      "Lun–sam 9h–19h",
    ],
  },
  garageProximity: {
    reviewKey: "mecanique",
    seoTitle: "Garage automobile à Ivry-sur-Seine (94)",
    seoParagraphs: [
      "RED-K MOTORS accueille les conducteurs de votre secteur : révision, freinage, diagnostic, pneus, climatisation et carrosserie. Devis gratuit avant travaux.",
      "9 rue Michelet, Ivry-sur-Seine — accès rapide, créneau souvent sous 48 h sur rendez-vous.",
    ],
    seoProblems: [
      { text: "Toutes les prestations", url: "/prestations/" },
      { text: "Tarifs indicatifs", url: "/tarifs/" },
      { text: "Diagnostic auto", url: "/diagnostic/" },
      { text: "Freinage", url: "/freins/" },
    ],
    highlights: PROCESS_HIGHLIGHTS,
  },
  conversion: {
    reviewKey: "mecanique",
    seoTitle: "Garage RED-K MOTORS — Ivry-sur-Seine (94)",
    seoParagraphs: [
      "Devis gratuit, diagnostic et réparations multimarques. Ouvert lun–sam 9h–19h — réponse rapide par téléphone ou WhatsApp.",
      "Atelier 9 rue Michelet : entretien, freinage, mécanique, pneus et carrosserie.",
    ],
    highlights: PROCESS_HIGHLIGHTS,
  },
  generic: {
    reviewKey: "mecanique",
    seoTitle: "Garage automobile à Ivry-sur-Seine",
    seoParagraphs: [
      "Entretien, diagnostic et réparation auto toutes marques. Devis écrit gratuit avant toute intervention à l'atelier RED-K MOTORS.",
    ],
    highlights: PROCESS_HIGHLIGHTS,
  },
};

/** Overrides ciblés (symptômes plus précis que la catégorie). */
const PAGE_OVERRIDES = {
  abs94Seo: {
    symptoms: [
      "Voyant ABS orange fixe",
      "Pédale de frein qui pulse",
      "Freinage moins efficace par temps humide",
      "Bruit au ralenti lié à la pompe ABS",
    ],
  },
  voyant94Seo: {
    symptoms: [
      "Voyant moteur orange ou rouge",
      "Perte de puissance soudaine",
      "Consommation anormale",
      "Ratés à froid ou à chaud",
    ],
  },
  bruitFrein94Seo: {
    symptoms: [
      "Grincement métallique au freinage",
      "Sifflement à basse vitesse",
      "Vibrations dans le volant",
      "Pédale qui tremble",
    ],
  },
  clim94Seo: {
    symptoms: [
      "Air tiède malgré clim au max",
      "Odeur moisi à la ventilation",
      "Clim qui s'arrête en ville",
      "Buée ou manque de débit d'air",
    ],
  },
  demarrage94Seo: {
    symptoms: [
      "Moteur ne tourne pas ou faiblement",
      "Cliquetis au démarrage",
      "Démarrage puis calage",
      "Voyants multiples allumés",
    ],
  },
  tremblementVolant94Seo: {
    symptoms: [
      "Volant qui tremble à 90–130 km/h",
      "Vibrations après changement de pneus",
      "Tirage à gauche ou droite",
      "Usure inégale des pneus",
    ],
  },
};

function detectCategory(pageKey) {
  if (!pageKey) return "generic";
  if (/^(abs|bruitFrein|plaquettes)/i.test(pageKey)) return "freinage";
  if (pageKey === "pneusFreins94Seo") return "freinage";
  if (/^garage.*Seo$/i.test(pageKey)) return "garageProximity";
  if (/^(voyant|diagnostic)/i.test(pageKey)) return "diagnostic";
  if (/^clim/i.test(pageKey)) return "clim";
  if (/^revision/i.test(pageKey)) return "revision";
  if (/^pneus/i.test(pageKey)) return "pneumatiques";
  if (/^vidange/i.test(pageKey)) return "vidange";
  if (/^carrosserie/i.test(pageKey)) return "carrosserie";
  if (/^(vtc|taxi|uber|flotte|preventifVtc|entretienVtc|entretienTaxi|chauffeur|pro94|garageTaxi|garageVtc)/i.test(pageKey)) {
    return "fleet";
  }
  if (/^(demarrage|pertePuissance|conso|tremblement|batterie|mecanicien|mecanique)/i.test(pageKey)) return "mecanique";
  if (/^(devis|urgence|garageSamedi|reparationParis)/i.test(pageKey)) return "conversion";
  return "generic";
}

function resolve(pageKey) {
  if (!pageKey) return null;

  const category = detectCategory(pageKey);
  const base = { ...(CATEGORIES[category] || CATEGORIES.generic) };
  const city = citySeoContent[pageKey];
  const overrides = PAGE_OVERRIDES[pageKey] || {};

  const merged = { ...base, ...(city || {}), ...overrides };

  if (city?.seoParagraphs?.length) {
    merged.symptoms = overrides.symptoms || city.symptoms || base.symptoms;
    merged.seoProblems = city.seoProblems?.length ? city.seoProblems : base.seoProblems;
    merged.highlights = city.highlights?.length ? city.highlights : base.highlights;
  }

  return merged;
}

function resolveReviewKey(pageKey) {
  const category = detectCategory(pageKey);
  return CATEGORIES[category]?.reviewKey || "mecanique";
}

module.exports = {
  resolve,
  resolveReviewKey,
  detectCategory,
};
