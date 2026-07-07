/**
 * Pages SEO « exemple concret » — /exemples/prix-…/
 * Générées modèle × prestation. Hors navigation site, indexées via sitemap.xml.
 * published: false sur une entrée manuelle = pas de page.
 */
const DATE = "2026-07-07";

const SEGMENT_MULT = {
  citadine: 1,
  compacte: 1.1,
  suv: 1.28,
  monospace: 1.22,
  premium: 1.45,
  utilitaire: 1.15,
};

/** @type {Array<{ slug: string, brand: string, model: string, yearRange: string, segment: keyof SEGMENT_MULT, tireSize?: string, motorNote?: string }>} */
const MODELS = [
  { slug: "renault-clio-4", brand: "Renault", model: "Clio 4", yearRange: "2012–2019", segment: "citadine", tireSize: "185/65 R15 ou 195/55 R16" },
  { slug: "renault-clio-5", brand: "Renault", model: "Clio 5", yearRange: "2019+", segment: "citadine", tireSize: "195/55 R16 ou 205/45 R17" },
  { slug: "renault-megane-4", brand: "Renault", model: "Mégane 4", yearRange: "2016–2023", segment: "compacte", tireSize: "205/55 R16 ou 225/45 R17" },
  { slug: "renault-captur", brand: "Renault", model: "Captur", yearRange: "2013+", segment: "suv", tireSize: "215/60 R17" },
  { slug: "renault-scenic", brand: "Renault", model: "Scenic", yearRange: "2016–2023", segment: "monospace", tireSize: "215/60 R16" },
  { slug: "peugeot-208", brand: "Peugeot", model: "208", yearRange: "2012–2019 · 2019+", segment: "citadine", tireSize: "185/65 R15 ou 195/55 R16" },
  { slug: "peugeot-208-puretech", brand: "Peugeot", model: "208 1.2 PureTech", yearRange: "2012–2019", segment: "citadine", motorNote: "motorisation PureTech : préconisations distribution spécifiques" },
  { slug: "peugeot-308", brand: "Peugeot", model: "308", yearRange: "2014–2021", segment: "compacte", tireSize: "205/55 R16" },
  { slug: "peugeot-2008", brand: "Peugeot", model: "2008", yearRange: "2013+", segment: "suv", tireSize: "215/60 R17" },
  { slug: "peugeot-3008", brand: "Peugeot", model: "3008", yearRange: "2016+", segment: "suv", tireSize: "225/60 R17 ou 235/55 R18" },
  { slug: "citroen-c3", brand: "Citroën", model: "C3", yearRange: "2016–2024", segment: "citadine", tireSize: "185/65 R15" },
  { slug: "citroen-c4", brand: "Citroën", model: "C4", yearRange: "2020+", segment: "compacte", tireSize: "205/55 R16" },
  { slug: "citroen-c3-aircross", brand: "Citroën", model: "C3 Aircross", yearRange: "2017+", segment: "suv", tireSize: "205/60 R16" },
  { slug: "volkswagen-golf-7", brand: "Volkswagen", model: "Golf 7", yearRange: "2012–2019", segment: "compacte", tireSize: "205/55 R16" },
  { slug: "volkswagen-golf-8", brand: "Volkswagen", model: "Golf 8", yearRange: "2020+", segment: "compacte", tireSize: "205/55 R16" },
  { slug: "volkswagen-polo", brand: "Volkswagen", model: "Polo", yearRange: "2017+", segment: "citadine", tireSize: "185/60 R15" },
  { slug: "volkswagen-tiguan", brand: "Volkswagen", model: "Tiguan", yearRange: "2016+", segment: "suv", tireSize: "235/55 R18" },
  { slug: "dacia-sandero", brand: "Dacia", model: "Sandero", yearRange: "2012+", segment: "citadine", tireSize: "185/65 R15" },
  { slug: "dacia-duster", brand: "Dacia", model: "Duster", yearRange: "2013+", segment: "suv", tireSize: "215/65 R16" },
  { slug: "toyota-yaris", brand: "Toyota", model: "Yaris", yearRange: "2011–2020 · hybride 2020+", segment: "citadine", tireSize: "185/60 R15" },
  { slug: "toyota-corolla", brand: "Toyota", model: "Corolla", yearRange: "2019+", segment: "compacte", tireSize: "205/55 R16" },
  { slug: "ford-fiesta", brand: "Ford", model: "Fiesta", yearRange: "2017–2023", segment: "citadine", tireSize: "185/60 R15" },
  { slug: "opel-corsa", brand: "Opel", model: "Corsa", yearRange: "2019+", segment: "citadine", tireSize: "195/55 R16" },
  { slug: "nissan-qashqai", brand: "Nissan", model: "Qashqai", yearRange: "2014–2021", segment: "suv", tireSize: "215/65 R16" },
  { slug: "bmw-serie-1", brand: "BMW", model: "Série 1", yearRange: "2019+", segment: "premium", tireSize: "225/45 R17" },
  { slug: "mercedes-classe-a", brand: "Mercedes", model: "Classe A", yearRange: "2018+", segment: "premium", tireSize: "225/45 R17" },
  { slug: "audi-a3", brand: "Audi", model: "A3", yearRange: "2012–2020", segment: "premium", tireSize: "205/55 R16" },
  { slug: "peugeot-partner", brand: "Peugeot", model: "Partner", yearRange: "2018+", segment: "utilitaire", tireSize: "215/65 R16" },
  { slug: "renault-kangoo", brand: "Renault", model: "Kangoo", yearRange: "2008–2021", segment: "utilitaire", tireSize: "195/65 R15" },
];

const SERVICES = {
  "pare-brise": {
    slugPart: "pare-brise",
    serviceKey: "pare-brise",
    serviceLabel: "remplacement de pare-brise",
    serviceUrl: "/pare-brise/",
    network: [470, 620],
    redkPrice: "devis après inspection à Ivry",
    redkHighlight: "jusqu'à 150 € + franchise offerte par RED-K MOTORS",
    redkNote:
      "Sur remplacement pare-brise : franchise bris de glace offerte + jusqu'à 150 € par l'atelier, avec accompagnement dossier assurance.",
    networkNote: "grand réseau ou constructeur, franchise souvent incluse au contrat",
    specifics: [
      "Capteur pluie, caméra ou athermique : le prix pièce varie selon finition.",
      "Réparation d'impact possible si l'éclat reste petit — photo WhatsApp pour avis rapide.",
      "Navette possible sur Ivry, Vitry, Villejuif et alentours du 94.",
    ],
  },
  distribution: {
    slugPart: "courroie-distribution",
    serviceKey: "distribution",
    serviceLabel: "changement de courroie de distribution",
    serviceUrl: "/mecanique/",
    network: [490, 780],
    redkPrice: "devis ferme après inspection",
    redkHighlight: "diagnostic offert à chaque intervention",
    redkNote: "Le montant dépend du moteur, du kit (courroie, galets, pompe à eau) et du temps atelier.",
    networkNote: "kit distribution + main-d'œuvre, pompe à eau souvent en option",
    specifics: [
      "Intervalle typique : 90 000 à 120 000 km ou 5 à 6 ans — consultez le carnet constructeur.",
      "Pompe à eau remplacée en même temps : souvent recommandé pour éviter une 2e intervention.",
      "Ne pas repousser : rupture de courroie = réparation moteur lourde.",
    ],
  },
  freinage: {
    slugPart: "plaquettes-frein",
    serviceKey: "freinage",
    serviceLabel: "changement de plaquettes de frein",
    serviceUrl: "/freins/",
    network: [135, 235],
    redkPrice: "100 à 190 € en général",
    redkHighlight: "contrôle usure gratuit avant devis",
    redkNote: "Disques usés ou voilés : le devis inclut leur remplacement si nécessaire.",
    networkNote: "plaquettes avant, pièces milieu de gamme, un essieu",
    specifics: [
      "Grincement, pédale molle ou voyant : diagnostic freinage avant travaux.",
      "Usure plus rapide à l'avant sur la majorité des citadines et compactes.",
    ],
  },
  vidange: {
    slugPart: "vidange-moteur",
    serviceKey: "vidange",
    serviceLabel: "vidange moteur",
    serviceUrl: "/vidange/",
    network: [85, 145],
    redkPrice: "devis selon huile homologuée constructeur",
    redkHighlight: "diagnostic offert à chaque intervention",
    redkNote: "Huile + filtre adaptés au carnet. Souvent réalisée le jour même sur rendez-vous.",
    networkNote: "huile constructeur + filtre, réseaux rapides",
    specifics: [
      "Intervalle courant : 10 000 à 15 000 km ou 1 an selon usage et motorisation.",
      "Contrôle des niveaux inclus (frein, lave-glace, refroidissement).",
    ],
  },
  pneus: {
    slugPart: "montage-pneus",
    serviceKey: "pneus",
    serviceLabel: "montage et équilibrage de pneus",
    serviceUrl: "/pneumatiques/",
    network: [70, 125],
    redkPrice: "60 à 150 € en général",
    redkHighlight: "devis au modèle et à la dimension",
    redkNote: "Apportez vos pneus ou choisissez dans notre stock selon arrivages.",
    networkNote: "montage 4 pneus + équilibrage, hors coût des pneus",
    specifics: [
      "Dimension fréquente sur ce modèle : voir fiche ou plaquette portière.",
      "Parallélisme recommandé si usure irrégulière ou volant qui tire.",
    ],
  },
  clim: {
    slugPart: "recharge-climatisation",
    serviceKey: "clim",
    serviceLabel: "recharge de climatisation",
    serviceUrl: "/entretien/",
    network: [75, 160],
    redkPrice: "devis après contrôle d'étanchéité",
    redkHighlight: "diagnostic offert à chaque intervention",
    redkNote: "Recharge seulement après contrôle — fuite ou compresseur à chiffrer séparément si besoin.",
    networkNote: "recharge gaz + contrôle basique, sans réparation fuite",
    specifics: [
      "Clim tiède, odeur ou bruit : diagnostic circuit avant recharge.",
      "Entretien clim conseillé avant l'été — créneaux rapides sur RDV.",
    ],
  },
  embrayage: {
    slugPart: "embrayage",
    serviceKey: "embrayage",
    serviceLabel: "remplacement d'embrayage",
    serviceUrl: "/mecanique/",
    network: [620, 1150],
    redkPrice: "devis ferme après inspection",
    redkHighlight: "diagnostic offert à chaque intervention",
    redkNote: "Kit embrayage + volant moteur bi-masse sur certains modèles : devis détaillé avant validation.",
    networkNote: "kit embrayage + main-d'œuvre importante",
    specifics: [
      "Patinage, odeur de brûlé ou pédale haute : contrôle rapide recommandé.",
      "Véhicules urbains et VTC : usure plus rapide si départs fréquents.",
    ],
  },
  batterie: {
    slugPart: "batterie",
    serviceKey: "batterie",
    serviceLabel: "changement de batterie",
    serviceUrl: "/mecanique/",
    network: [115, 230],
    redkPrice: "devis après test batterie / alternateur",
    redkHighlight: "diagnostic offert à chaque intervention",
    redkNote: "Test charge et démarrage sur place — pose batterie adaptée au véhicule (Start & Stop si équipé).",
    networkNote: "batterie milieu de gamme + pose",
    specifics: [
      "Start & Stop : batterie AGM ou EFB souvent obligatoire — ne pas sous-dimensionner.",
      "Voyant batterie ou démarrage lent : passez à l'atelier avant panne totale.",
    ],
  },
};

/** Surcharges manuelles (slug complet) — priorité sur la génération auto */
const OVERRIDES = {
  "prix-pare-brise-renault-clio-4": {
    networkPrice: "environ 580 €",
    networkNote: "chez un grand réseau, franchise bris de glace souvent incluse",
  },
  "prix-courroie-distribution-peugeot-208-puretech": {
    networkPrice: "environ 550 à 800 €",
    networkNote: "courroie humide ou kit selon motorisation PureTech",
    specifics: [
      "Les PureTech ont des préconisations spécifiques : ne pas appliquer un tarif « toutes motorisations ».",
      "Bruits métalliques ou voyant moteur : contrôle urgent avant tout long trajet.",
    ],
  },
};

function roundPrice(value) {
  return Math.round(value / 5) * 5;
}

function formatRange(min, max) {
  const lo = roundPrice(min);
  const hi = roundPrice(max);
  if (lo >= hi) return `environ ${lo} €`;
  return `environ ${lo} à ${hi} €`;
}

function buildSlug(service, model) {
  return `prix-${service.slugPart}-${model.slug}`;
}

function buildExample(model, serviceKey) {
  const service = SERVICES[serviceKey];
  const mult = SEGMENT_MULT[model.segment] || 1;
  const [netMin, netMax] = service.network;
  const slug = buildSlug(service, model);

  const specifics = [...service.specifics];
  if (model.tireSize && serviceKey === "pneus") {
    specifics[0] = `Dimension fréquente sur ${model.brand} ${model.model} : ${model.tireSize}.`;
  }
  if (model.motorNote && serviceKey === "distribution") {
    specifics.unshift(model.motorNote);
  }
  if (model.segment === "premium" && serviceKey === "freinage") {
    specifics.push("Marques premium : pièces frein souvent plus onéreuses — devis au modèle.");
  }
  if (model.segment === "suv" && serviceKey === "pare-brise") {
    specifics.push("SUV : vitrage plus grand, coût pièce souvent supérieur à une citadine.");
  }

  const base = {
    slug,
    serviceKey: service.serviceKey,
    serviceLabel: service.serviceLabel,
    serviceUrl: service.serviceUrl,
    brand: model.brand,
    model: model.model,
    yearRange: model.yearRange,
    networkPrice: formatRange(netMin * mult, netMax * mult),
    networkNote: service.networkNote,
    redkPrice: service.redkPrice,
    redkHighlight: service.redkHighlight,
    redkNote: service.redkNote,
    specifics,
    published: true,
    date: DATE,
  };

  const override = OVERRIDES[slug];
  return override ? { ...base, ...override } : base;
}

function buildTitle(ex) {
  return `Prix ${ex.serviceLabel} ${ex.brand} ${ex.model} · fourchette 2026`;
}

function buildDescription(ex) {
  return `Combien coûte un ${ex.serviceLabel} sur ${ex.brand} ${ex.model} ? Exemple concret, fourchette réseau vs RED-K MOTORS à Ivry (94). Devis gratuit · 06 48 74 56 68.`;
}

function buildQuery(ex) {
  return `Prix ${ex.serviceLabel} ${ex.brand} ${ex.model}`;
}

const serviceKeys = Object.keys(SERVICES);
const EXAMPLES = [];

for (const model of MODELS) {
  for (const serviceKey of serviceKeys) {
    EXAMPLES.push(buildExample(model, serviceKey));
  }
}

const slugSet = new Set();
for (const ex of EXAMPLES) {
  if (slugSet.has(ex.slug)) throw new Error(`Doublon slug exemple: ${ex.slug}`);
  slugSet.add(ex.slug);
}

const all = EXAMPLES.filter((ex) => ex.published).map((ex) => ({
  ...ex,
  title: buildTitle(ex),
  description: buildDescription(ex),
  searchQuery: buildQuery(ex),
}));

module.exports = { all, EXAMPLES, MODELS, SERVICES };
