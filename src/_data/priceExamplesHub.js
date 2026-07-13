/**
 * Maillage interne prestations / tarifs → guides prix génériques /exemples/prix-…/
 */
const { all, MODELS, SERVICES } = require("./priceExamples.js");

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

/**
 * Exemples de prix affichés dans les hubs — alignés grille /tarifs/
 * redkExample = fourchette ou montant indicatif atelier Ivry
 * elsewhereExample = comparaison grand réseau (optionnelle, en petit)
 */
const GUIDE_META = {
  "prix-pare-brise": {
    hook: "Impact ou fissure : capteur, caméra ou vitrage athermique font grimper la facture.",
    redkExample: "Offre 150 € + franchise offerte",
    cta: "Exemple pare-brise détaillé",
  },
  "prix-vidange-moteur": {
    hook: "Huile noire ou voyant : le moteur encaisse en silence quand on repousse.",
    redkExample: "70 à 150 €",
    cta: "Exemple vidange détaillé",
  },
  "prix-plaquettes-frein": {
    hook: "Grincement, vibration ou pédale molle : la distance de freinage s'allonge.",
    redkExample: "100 à 190 €",
    cta: "Exemple freins détaillé",
  },
  "prix-montage-pneus": {
    hook: "Volant qui tire ou usure d'un seul côté : ne montez pas au hasard.",
    redkExample: "60 à 150 €",
    cta: "Exemple pneus détaillé",
  },
  "prix-recharge-climatisation": {
    hook: "Air tiède ou odeur de moisi : une recharge sans contrôle peut fuir en 3 mois.",
    redkExample: "40 €",
    cta: "Exemple clim détaillé",
  },
  "prix-courroie-distribution": {
    hook: "Bruit métallique ou courroie en retard : la casse moteur coûte bien plus cher.",
    redkExample: "450 à 990 €",
    cta: "Exemple distribution détaillé",
  },
  "prix-embrayage": {
    hook: "Patinage en côte ou odeur de brûlé : l'immobilisation arrive sans prévenir.",
    redkExample: "800 à 1 600 €",
    cta: "Exemple embrayage détaillé",
  },
  "prix-batterie": {
    hook: "Démarrage lent ou voyant batterie : la panne totale est souvent le lendemain.",
    redkExample: "120 à 250 €",
    cta: "Exemple batterie détaillé",
  },
};

const PAGE_HUB = {
  "pare-brise": {
    kicker: "Exemple de prix",
    title: "Combien coûte un pare-brise ?",
    lead: "Fourchette indicative et offre atelier — le guide détaille aussi les prix ailleurs.",
  },
  vidange: {
    kicker: "Exemple de prix",
    title: "Combien coûte une vidange ?",
    lead: "Fourchette indicative à Ivry — détail par modèle dans le guide.",
  },
  freins: {
    kicker: "Exemple de prix",
    title: "Combien coûtent des plaquettes de frein ?",
    lead: "Montants indicatifs TTC — le guide compare aussi le grand réseau.",
  },
  freinage: {
    kicker: "Exemple de prix",
    title: "Combien coûtent des plaquettes de frein ?",
    lead: "Montants indicatifs TTC — le guide compare aussi le grand réseau.",
  },
  pneumatiques: {
    kicker: "Exemple de prix",
    title: "Combien coûte un montage de pneus ?",
    lead: "Fourchette montage + équilibrage — hors coût des pneus.",
  },
  entretien: {
    kicker: "Exemples de prix",
    title: "Vidange & clim : combien prévoir ?",
    lead: "Deux fourchettes différentes — exemples indicatifs à Ivry.",
  },
  revision: {
    kicker: "Exemples de prix",
    title: "Vidange & clim : combien prévoir ?",
    lead: "Deux fourchettes différentes — exemples indicatifs à Ivry.",
  },
  mecanique: {
    kicker: "Exemples de prix",
    title: "Distribution, embrayage, batterie : combien ça coûte ?",
    lead: "Trois fourchettes indicatives — le guide détaille symptômes et comparatif.",
  },
};

const TARIFS_HUB = {
  kicker: "Exemples détaillés",
  title: "Un exemple de prix par prestation",
  lead: "Fourchettes indicatives RED-K MOTORS à Ivry. Chaque lien ouvre un comparatif complet avec d'autres enseignes.",
};

const EXAMPLES_HUB = {
  kicker: "Guides prix",
  title: "Exemples de prix par prestation et par modèle",
  lead: "Comparatifs indicatifs RED-K MOTORS vs grand réseau — citadine, compacte ou SUV. Chaque guide détaille symptômes, fourchette et devis à Ivry-sur-Seine.",
};

/** serviceKey (priceExamples) → slug guide générique */
const SERVICE_GUIDE_SLUG = {
  "pare-brise": "prix-pare-brise",
  vidange: "prix-vidange-moteur",
  freinage: "prix-plaquettes-frein",
  pneus: "prix-montage-pneus",
  clim: "prix-recharge-climatisation",
  distribution: "prix-courroie-distribution",
  embrayage: "prix-embrayage",
  batterie: "prix-batterie",
};

/** Modèles les plus recherchés pour le hub /exemples/ */
const POPULAR_MODEL_SLUGS = [
  "peugeot-208",
  "renault-clio-4",
  "renault-clio-5",
  "volkswagen-golf-7",
  "dacia-sandero",
  "citroen-c3",
  "peugeot-3008",
  "renault-captur",
  "toyota-yaris",
  "volkswagen-polo",
  "peugeot-2008",
  "dacia-duster",
];

function hubLabelFromService(serviceLabel) {
  return (
    HUB_LABELS[serviceLabel] ||
    serviceLabel.charAt(0).toUpperCase() + serviceLabel.slice(1)
  );
}

function enrichGuide(slug) {
  const item = GENERIC_BY_SLUG[slug];
  const meta = GUIDE_META[slug];
  if (!item || !meta) return null;
  return {
    slug,
    url: `/exemples/${slug}/`,
    hubLabel: hubLabelFromService(item.serviceLabel),
    redkExample: meta.redkExample,
    elsewhereExample: item.networkPrice,
    hook: meta.hook,
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

function guideSlugForService(serviceKey) {
  return SERVICE_GUIDE_SLUG[serviceKey] || null;
}

function genericGuideForService(serviceKey) {
  const slug = guideSlugForService(serviceKey);
  return slug ? GENERIC_BY_SLUG[slug] : null;
}

function breadcrumbTrail(exemple) {
  if (!exemple) return [];
  const trail = [
    { label: "Accueil", url: "/" },
    { label: "Tarifs indicatifs", url: "/tarifs/" },
  ];
  const generic = genericGuideForService(exemple.serviceKey);
  if (!exemple.isGeneric && generic) {
    trail.push({
      label: generic.searchQuery || hubLabelFromService(exemple.serviceLabel),
      url: `/exemples/${generic.slug}/`,
    });
    trail.push({
      label: `${exemple.brand} ${exemple.model}`,
      url: `/exemples/${exemple.slug}/`,
      current: true,
    });
    return trail;
  }
  trail.push({
    label: exemple.searchQuery || hubLabelFromService(exemple.serviceLabel),
    url: `/exemples/${exemple.slug}/`,
    current: true,
  });
  return trail;
}

function popularModelExamples(serviceKey = "vidange") {
  const svc = Object.values(SERVICES).find((s) => s.serviceKey === serviceKey);
  if (!svc) return [];
  const modelBySlug = Object.fromEntries(MODELS.map((m) => [m.slug, m]));
  return POPULAR_MODEL_SLUGS.map((modelSlug) => {
    const model = modelBySlug[modelSlug];
    if (!model) return null;
    const slug = `prix-${svc.slugPart}-${modelSlug}`;
    const item = all.find((ex) => ex.slug === slug);
    if (!item) return null;
    return {
      brand: model.brand,
      model: model.model,
      yearRange: model.yearRange,
      url: `/exemples/${slug}/`,
      serviceLabel: svc.serviceLabel,
    };
  }).filter(Boolean);
}

function modelExampleUrl(modelSlug, serviceKey = "vidange") {
  const svc = Object.values(SERVICES).find((s) => s.serviceKey === serviceKey);
  if (!svc) return null;
  return `/exemples/prix-${svc.slugPart}-${modelSlug}/`;
}

function modelServiceLinks(modelSlug) {
  const model = MODELS.find((m) => m.slug === modelSlug);
  if (!model) return [];
  return Object.keys(SERVICES).map((serviceKey) => {
    const service = SERVICES[serviceKey];
    const slug = `prix-${service.slugPart}-${modelSlug}`;
    const item = all.find((ex) => ex.slug === slug);
    if (!item) return null;
    return {
      slug,
      url: `/exemples/${slug}/`,
      hubLabel: hubLabelFromService(service.serviceLabel),
      serviceLabel: service.serviceLabel,
      redkPrice: service.redkPrice,
    };
  }).filter(Boolean);
}

function popularModelHubs() {
  const modelBySlug = Object.fromEntries(MODELS.map((m) => [m.slug, m]));
  return POPULAR_MODEL_SLUGS.map((slug) => {
    const model = modelBySlug[slug];
    if (!model) return null;
    return {
      slug,
      brand: model.brand,
      model: model.model,
      yearRange: model.yearRange,
      url: `/exemples/modeles/${slug}/`,
    };
  }).filter(Boolean);
}

module.exports = {
  forPage,
  forPageWithMeta,
  allGuides,
  catalogGroups,
  breadcrumbTrail,
  guideSlugForService,
  genericGuideForService,
  popularModelExamples,
  modelExampleUrl,
  modelServiceLinks,
  popularModelHubs,
  PAGE_GUIDE_SLUGS,
  TARIFS_HUB,
  EXAMPLES_HUB,
  POPULAR_MODEL_SLUGS,
};
