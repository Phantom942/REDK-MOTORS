/**
 * Maillage interne prestations / tarifs → guides prix génériques /exemples/prix-…/
 */
const { all } = require("./priceExamples.js");

const GENERIC_BY_SLUG = Object.fromEntries(
  all.filter((item) => item.isGeneric).map((item) => [item.slug, item])
);

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

const CATALOG_GROUPS = [
  {
    id: "entretien",
    label: "Entretien courant",
    slugs: ["prix-vidange-moteur", "prix-recharge-climatisation", "prix-montage-pneus"],
  },
  {
    id: "securite",
    label: "Sécurité & visibilité",
    slugs: ["prix-plaquettes-frein", "prix-pare-brise"],
  },
  {
    id: "mecanique",
    label: "Mécanique",
    slugs: ["prix-courroie-distribution", "prix-embrayage", "prix-batterie"],
  },
];

const HUB_LABELS = {
  "remplacement de pare-brise": "Pare-brise",
  "changement de courroie de distribution": "Courroie de distribution",
  "changement de plaquettes de frein": "Plaquettes de frein",
  "vidange moteur": "Vidange moteur",
  "montage et équilibrage de pneus": "Montage pneus",
  "recharge de climatisation": "Recharge clim",
  "remplacement d'embrayage": "Embrayage",
  "changement de batterie": "Batterie",
};

/** Accroche, argument RED-K et CTA uniques par guide */
const GUIDE_META = {
  "prix-pare-brise": {
    hook: "Impact ou fissure : capteur, caméra ou vitrage athermique font grimper la facture.",
    usp: "150 € + franchise offerte",
    cta: "Guide pare-brise complet",
  },
  "prix-vidange-moteur": {
    hook: "Huile noire ou voyant : le moteur encaisse en silence quand on repousse.",
    usp: "Huile constructeur · souvent le jour même",
    cta: "Fourchette vidange",
  },
  "prix-plaquettes-frein": {
    hook: "Grincement, vibration ou pédale molle : la distance de freinage s'allonge.",
    usp: "100 à 190 € en général",
    cta: "Prix freins détaillés",
  },
  "prix-montage-pneus": {
    hook: "Volant qui tire ou usure d'un seul côté : ne montez pas au hasard.",
    usp: "60 à 150 € le montage",
    cta: "Guide montage pneus",
  },
  "prix-recharge-climatisation": {
    hook: "Air tiède ou odeur de moisi : une recharge sans contrôle peut fuir en 3 mois.",
    usp: "40 € après contrôle d'étanchéité",
    cta: "Recharge clim 40 €",
  },
  "prix-courroie-distribution": {
    hook: "Bruit métallique ou courroie en retard : la casse moteur coûte bien plus cher.",
    usp: "Kit courroie + galets chiffrés avant travaux",
    cta: "Prix distribution",
  },
  "prix-embrayage": {
    hook: "Patinage en côte ou odeur de brûlé : l'immobilisation arrive sans prévenir.",
    usp: "Devis détaillé avant démontage",
    cta: "Fourchette embrayage",
  },
  "prix-batterie": {
    hook: "Démarrage lent ou voyant batterie : la panne totale est souvent le lendemain.",
    usp: "Test batterie / alternateur sur place",
    cta: "Prix batterie",
  },
};

/** Titres de section propres à chaque page prestation */
const PAGE_HUB = {
  "pare-brise": {
    kicker: "Guide prix",
    title: "Quel budget pour votre pare-brise ?",
    lead: "Fourchette réseau, offre RED-K et points de vigilance — diagnostic offert à l'intervention.",
  },
  vidange: {
    kicker: "Guide prix",
    title: "Prix vidange : réseau vs RED-K MOTORS",
    lead: "Huile constructeur, contrôle des niveaux et devis ferme avant travaux.",
  },
  freins: {
    kicker: "Guide prix",
    title: "Plaquettes de frein : combien prévoir ?",
    lead: "Symptômes, fourchette grand réseau et tarif atelier à Ivry.",
  },
  freinage: {
    kicker: "Guide prix",
    title: "Plaquettes de frein : combien prévoir ?",
    lead: "Symptômes, fourchette grand réseau et tarif atelier à Ivry.",
  },
  pneumatiques: {
    kicker: "Guide prix",
    title: "Montage pneus : le vrai coût atelier",
    lead: "Équilibrage, dimension et parallélisme — comparatif avant RDV.",
  },
  entretien: {
    kicker: "Guides entretien",
    title: "Vidange & clim : les deux entretiens les plus demandés",
    lead: "Un guide par sujet — pas la même fourchette, pas le même risque si vous attendez.",
  },
  revision: {
    kicker: "Guides entretien",
    title: "Vidange & clim : les deux entretiens les plus demandés",
    lead: "Un guide par sujet — pas la même fourchette, pas le même risque si vous attendez.",
  },
  mecanique: {
    kicker: "Guides atelier",
    title: "Mécanique lourde : 3 budgets à anticiper",
    lead: "Distribution, embrayage, batterie — chaque guide traite un symptôme différent.",
  },
};

const TARIFS_HUB = {
  kicker: "Guides détaillés",
  title: "Exemples concrets par prestation",
  lead: "Complément de la grille ci-dessus — symptômes, comparatif réseau et offre RED-K. Diagnostic offert à chaque intervention.",
};

function hubLabelFromService(serviceLabel) {
  return (
    HUB_LABELS[serviceLabel] ||
    serviceLabel.charAt(0).toUpperCase() + serviceLabel.slice(1)
  );
}

function hubRedkLine(redkPrice) {
  if (/^devis/i.test(redkPrice)) return "Devis gratuit";
  return redkPrice;
}

function enrichGuide(slug) {
  const item = GENERIC_BY_SLUG[slug];
  const meta = GUIDE_META[slug];
  if (!item || !meta) return null;
  return {
    slug,
    url: `/exemples/${slug}/`,
    hubLabel: hubLabelFromService(item.serviceLabel),
    hubRedkLine: hubRedkLine(item.redkPrice),
    networkPrice: item.networkPrice,
    hook: meta.hook,
    usp: meta.usp,
    cta: meta.cta,
  };
}

function forPage(pageKey, lpKey) {
  const slugs = PAGE_GUIDE_SLUGS[pageKey] || PAGE_GUIDE_SLUGS[lpKey] || [];
  return slugs.map(enrichGuide).filter(Boolean);
}

function forPageWithMeta(pageKey, lpKey) {
  const guides = forPage(pageKey, lpKey);
  const pageMeta = PAGE_HUB[pageKey] || PAGE_HUB[lpKey] || {};
  return {
    guides,
    kicker: pageMeta.kicker,
    title: pageMeta.title,
    lead: pageMeta.lead,
    layout: guides.length === 1 ? "feature" : "cards",
  };
}

function allGuides() {
  return ALL_SLUGS.map(enrichGuide).filter(Boolean);
}

function catalogGroups() {
  return CATALOG_GROUPS.map((group) => ({
    ...group,
    guides: group.slugs.map(enrichGuide).filter(Boolean),
  })).filter((group) => group.guides.length);
}

module.exports = {
  forPage,
  forPageWithMeta,
  allGuides,
  catalogGroups,
  PAGE_GUIDE_SLUGS,
  TARIFS_HUB,
};
