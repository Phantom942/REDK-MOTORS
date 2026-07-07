/**
 * Pages SEO « exemple concret » — /exemples/prix-…/
 * 8 pages génériques (par prestation) + générées modèle × prestation.
 * Hors navigation site, indexées via sitemap.xml.
 * published: false sur une entrée manuelle = pas de page.
 */
const DATE = "2026-07-07";

const DIAGNOSTIC_OFFERT = "diagnostic offert à chaque intervention";

/** Copy SEO + psycho émotionnel — pages génériques uniquement */
const GENERIC_SEO = {
  "pare-brise": {
    title: "Prix pare-brise voiture 2026 · fourchette & devis Ivry (94)",
    metaDescription:
      "Prix pare-brise voiture : impact, fissure ou remplacement complet ? Fourchette réseau vs RED-K MOTORS à Ivry — diagnostic offert, franchise offerte, jusqu'à 150 €. Devis gratuit · 06 48 74 56 68.",
    searchQuery: "Prix pare-brise voiture",
    heroTitle: "Prix pare-brise voiture : combien ça coûte vraiment ?",
    problemTitle: "Impact, éclat ou fissure : la mauvaise surprise arrive souvent au devis",
    problemLead:
      "Un pare-brise abîmé, c'est une contrainte immédiate : contrôle technique refusé, visibilité réduite, propagation de la fissure sous les nids-de-poule. Et la facture grimpe vite dès qu'il y a capteur de pluie, caméra ou vitrage athermique.",
    painPoints: [
      "Peur d'une facture à 500 € ou plus sans solution claire",
      "Doute : réparer l'impact ou tout remplacer ?",
      "Stress assurance : franchise, dossier, immobilisation du véhicule",
      "Peur d'attendre des semaines sans vitre de rechange",
    ],
    solutionTitle: "Chez RED-K MOTORS : on clarifie avant de facturer",
    solutionLead:
      "Photo WhatsApp pour un premier avis, inspection sur place et devis ferme. Sur remplacement : franchise bris de glace offerte + jusqu'à 150 € par l'atelier, avec accompagnement dossier assurance. Diagnostic offert à chaque passage.",
  },
  distribution: {
    title: "Prix courroie de distribution 2026 · fourchette Ivry-sur-Seine (94)",
    metaDescription:
      "Prix courroie de distribution : retarder, c'est risquer la casse moteur. Fourchette réseau vs RED-K MOTORS à Ivry — diagnostic offert, devis ferme avant travaux. 06 48 74 56 68.",
    searchQuery: "Prix courroie de distribution",
    heroTitle: "Prix courroie de distribution : le coût de l'attente est bien plus élevé",
    problemTitle: "Courroie en retard : une réparation qui peut tout faire basculer",
    problemLead:
      "La distribution, c'est la réparation qu'on repousse… jusqu'au jour où le moteur lâche. Bruit métallique, voyant, perte de puissance : chaque kilomètre en plus peut transformer un entretien planifié en facture catastrophe.",
    painPoints: [
      "Angoisse d'une casse moteur et d'une immobilisation longue",
      "Devis flous : courroie seule, kit complet, pompe à eau en option ?",
      "Peur de payer trop chez le concessionnaire",
      "Incertitude sur l'intervalle réel (km, années, type de courroie)",
    ],
    solutionTitle: "Anticipez : diagnostic offert, devis détaillé, zéro surprise",
    solutionLead:
      "On vérifie l'état réel, on explique ce qui doit partir (courroie, galets, pompe à eau) et on chiffre avant validation. Diagnostic offert à chaque intervention — vous décidez en connaissance de cause.",
  },
  freinage: {
    title: "Prix plaquettes de frein 2026 · fourchette Ivry (94)",
    metaDescription:
      "Prix plaquettes de frein : grincement, pédale molle ou distance de freinage allongée ? Fourchette réseau vs RED-K MOTORS — diagnostic offert, devis avant travaux. Ivry (94) · 06 48 74 56 68.",
    searchQuery: "Prix plaquettes de frein",
    heroTitle: "Prix plaquettes de frein : votre sécurité ne devrait pas attendre le CT",
    problemTitle: "Freins qui grincent ou qui tirent : le risque est réel, pas théorique",
    problemLead:
      "Des plaquettes usées, ce n'est pas qu'un bruit gênant — c'est une distance de freinage qui s'allonge, des disques à abîmer et parfois un refus au contrôle technique. Reporter, c'est jouer avec la sécurité de votre famille.",
    painPoints: [
      "Grincement, vibration ou voyant frein qui inquiète",
      "Peur de la facture disques + plaquettes sans explication",
      "Doute : avant, arrière, ou les deux ?",
      "Stress avant un long trajet ou le contrôle technique",
    ],
    solutionTitle: "Contrôle rapide, diagnostic offert, devis clair",
    solutionLead:
      "On mesure l'usure, on vous montre ce qui est urgent et ce qui peut attendre. Diagnostic offert à chaque intervention — vous repartez avec un devis ferme, sans travaux cachés.",
  },
  vidange: {
    title: "Prix vidange moteur 2026 · fourchette Ivry-sur-Seine (94)",
    metaDescription:
      "Prix vidange moteur : huile usée = moteur qui vieillit plus vite. Fourchette réseau vs RED-K MOTORS à Ivry — huile homologuée constructeur, diagnostic offert. Devis gratuit · 06 48 74 56 68.",
    searchQuery: "Prix vidange moteur",
    heroTitle: "Prix vidange moteur : l'entretien qu'on oublie… jusqu'à la panne",
    problemTitle: "Vidange repoussée : votre moteur encaisse en silence",
    problemLead:
      "Huile noire, niveau bas, voyant qui clignote : une vidange ratée ou tardive use le moteur de l'intérieur. Ce n'est pas spectaculaire aujourd'hui — c'est coûteux demain.",
    painPoints: [
      "Voyant huile ou odeur de brûlé qui stresse",
      "Peur de mettre la mauvaise huile ou de « surpayer pour rien »",
      "Doute sur l'intervalle (10 000 km ? 15 000 ? 1 an ?)",
      "Manque de temps pour trouver un garage de confiance",
    ],
    solutionTitle: "Vidange le jour même possible — diagnostic offert inclus",
    solutionLead:
      "Huile et filtre adaptés au carnet constructeur, contrôle des niveaux inclus. Diagnostic offert à chaque intervention : on repère les petits problèmes avant qu'ils deviennent gros.",
  },
  pneus: {
    title: "Prix montage pneus 2026 · équilibrage Ivry (94)",
    metaDescription:
      "Prix montage et équilibrage pneus : usure irrégulière, volant qui tire, crevaison ? Fourchette réseau vs RED-K MOTORS à Ivry — diagnostic offert. Devis au modèle · 06 48 74 56 68.",
    searchQuery: "Prix montage pneus",
    heroTitle: "Prix montage pneus : rouler sur du doute, c'est rouler en danger",
    problemTitle: "Pneus usés ou mal montés : l'accrochage ne pardonne pas",
    problemLead:
      "Usure irrégulière, aquaplaning, crevaison sur autoroute : des pneus en mauvais état ou mal équilibrés, c'est la sécurité de toute la famille qui baisse — surtout sous la pluie ou à haute vitesse.",
    painPoints: [
      "Volant qui tire ou vibrations à 110 km/h",
      "Usure rapide d'un seul côté — parallélisme ?",
      "Hésitation entre racheter 2 ou 4 pneus",
      "Peur du mauvais montage ou de pneus inadaptés",
    ],
    solutionTitle: "Montage propre, équilibrage précis, diagnostic offert",
    solutionLead:
      "On vérifie l'usure et la dimension, on monte et équilibre correctement. Diagnostic offert à chaque intervention — parallélisme recommandé si besoin, expliqué avant devis.",
  },
  clim: {
    title: "Prix recharge clim voiture · 40 € · Ivry-sur-Seine (94)",
    metaDescription:
      "Prix recharge climatisation voiture : air tiède, mauvaise odeur, clim morte avant l'été ? RED-K MOTORS à Ivry : recharge 40 €, diagnostic offert, contrôle d'étanchéité avant intervention. 06 48 74 56 68.",
    searchQuery: "Prix recharge climatisation voiture",
    heroTitle: "Prix recharge clim voiture : 40 € — avant que la chaleur vous rattrape",
    problemTitle: "Clim tiède en été : inconfort, fatigue au volant, trajets subis",
    problemLead:
      "Air tiède, odeur de moisi, buée qui revient : une climatisation défaillante transforme chaque trajet en corvée. Et une recharge « au hasard » sans contrôle peut masquer une fuite — pour repayer dans 3 mois.",
    painPoints: [
      "Confort zéro dès les premières grosses chaleurs",
      "Odeur désagréable à chaque démarrage",
      "Peur de payer une recharge inutile si le gaz fuit",
      "Attente interminable en pleine canicule",
    ],
    solutionTitle: "Recharge clim 40 € — après contrôle, diagnostic offert",
    solutionLead:
      "Contrôle du circuit avant recharge. Si tout est OK : 40 €. Fuite ou compresseur : on vous l'explique clairement avant tout travaux supplémentaire. Diagnostic offert à chaque intervention.",
  },
  embrayage: {
    title: "Prix embrayage voiture 2026 · fourchette Ivry (94)",
    metaDescription:
      "Prix embrayage : patinage, odeur de brûlé, pédale haute ? Fourchette réseau vs RED-K MOTORS à Ivry — diagnostic offert, devis ferme avant démontage. 06 48 74 56 68.",
    searchQuery: "Prix embrayage voiture",
    heroTitle: "Prix embrayage : patinage aujourd'hui, immobilisation demain",
    problemTitle: "Embrayage qui patine : la panne arrive toujours au pire moment",
    problemLead:
      "Pédale haute, odeur de brûlé, patinage en côte : l'embrayage lâche souvent sans prévenir. Continuer à rouler, c'est risquer de rester sur le bas-côté — ou d'abîmer le volant moteur bi-masse.",
    painPoints: [
      "Peur de caler en circulation ou sur un rond-point",
      "Facture floue : kit embrayage, volant moteur, main-d'œuvre ?",
      "Stress pour les pros (taxi, VTC) : chaque heure d'arrêt coûte",
      "Incertitude : réparer maintenant ou attendre ?",
    ],
    solutionTitle: "Diagnostic offert, devis détaillé avant le démontage",
    solutionLead:
      "On confirme l'usure, on chiffre kit + main-d'œuvre (volant bi-masse si nécessaire) et on valide avec vous avant d'ouvrir la boîte. Diagnostic offert à chaque intervention.",
  },
  batterie: {
    title: "Prix batterie voiture 2026 · fourchette Ivry-sur-Seine (94)",
    metaDescription:
      "Prix batterie voiture : démarrage lent, voyant, panne un matin de froid ? Fourchette réseau vs RED-K MOTORS — test batterie/alternateur, diagnostic offert. Ivry (94) · 06 48 74 56 68.",
    searchQuery: "Prix batterie voiture",
    heroTitle: "Prix batterie voiture : le matin où elle ne démarre plus, c'est trop tard",
    problemTitle: "Démarrage lent ou voyant batterie : la panne totale approche",
    problemLead:
      "Un matin de grand froid, un voyant qui s'allume, un démarreur qui peine : la batterie lâche rarement « au bon moment ». Start & Stop mal dimensionné = panne en chaîne.",
    painPoints: [
      "Peur de rester bloqué au parking ou devant le travail",
      "Doute batterie vs alternateur vs démarreur",
      "Start & Stop : quelle batterie AGM ou EFB choisir ?",
      "Peur de payer une batterie inutile si c'est l'alternateur",
    ],
    solutionTitle: "Test sur place, diagnostic offert, pose adaptée",
    solutionLead:
      "On teste charge et démarrage avant de remplacer quoi que ce soit. Batterie adaptée au véhicule (AGM/EFB si Start & Stop). Diagnostic offert à chaque intervention.",
  },
};

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
  { slug: "renault-twingo-3", brand: "Renault", model: "Twingo 3", yearRange: "2014–2024", segment: "citadine", tireSize: "185/55 R15" },
  { slug: "renault-zoe", brand: "Renault", model: "Zoé", yearRange: "2012–2024", segment: "citadine", tireSize: "185/65 R15" },
  { slug: "renault-megane-3", brand: "Renault", model: "Mégane 3", yearRange: "2008–2016", segment: "compacte", tireSize: "205/55 R16" },
  { slug: "renault-arkana", brand: "Renault", model: "Arkana", yearRange: "2021+", segment: "suv", tireSize: "215/60 R17" },
  { slug: "peugeot-207", brand: "Peugeot", model: "207", yearRange: "2006–2014", segment: "citadine", tireSize: "185/65 R15" },
  { slug: "peugeot-307", brand: "Peugeot", model: "307", yearRange: "2008–2014", segment: "compacte", tireSize: "195/65 R15" },
  { slug: "peugeot-508", brand: "Peugeot", model: "508", yearRange: "2018+", segment: "compacte", tireSize: "215/55 R17" },
  { slug: "peugeot-108", brand: "Peugeot", model: "108", yearRange: "2014–2021", segment: "citadine", tireSize: "165/65 R14" },
  { slug: "peugeot-rifter", brand: "Peugeot", model: "Rifter", yearRange: "2018+", segment: "monospace", tireSize: "215/60 R16" },
  { slug: "citroen-c5-aircross", brand: "Citroën", model: "C5 Aircross", yearRange: "2017+", segment: "suv", tireSize: "225/60 R17" },
  { slug: "citroen-berlingo", brand: "Citroën", model: "Berlingo", yearRange: "2018+", segment: "monospace", tireSize: "215/60 R16" },
  { slug: "citroen-c1", brand: "Citroën", model: "C1", yearRange: "2014–2021", segment: "citadine", tireSize: "165/65 R14" },
  { slug: "volkswagen-passat", brand: "Volkswagen", model: "Passat", yearRange: "2015–2023", segment: "compacte", tireSize: "215/55 R17" },
  { slug: "volkswagen-t-roc", brand: "Volkswagen", model: "T-Roc", yearRange: "2017+", segment: "suv", tireSize: "215/60 R17" },
  { slug: "volkswagen-touran", brand: "Volkswagen", model: "Touran", yearRange: "2015–2022", segment: "monospace", tireSize: "215/60 R16" },
  { slug: "dacia-logan", brand: "Dacia", model: "Logan", yearRange: "2012+", segment: "citadine", tireSize: "185/65 R15" },
  { slug: "fiat-500", brand: "Fiat", model: "500", yearRange: "2007–2023", segment: "citadine", tireSize: "175/65 R14" },
  { slug: "hyundai-i20", brand: "Hyundai", model: "i20", yearRange: "2014+", segment: "citadine", tireSize: "185/60 R15" },
  { slug: "hyundai-tucson", brand: "Hyundai", model: "Tucson", yearRange: "2015+", segment: "suv", tireSize: "225/60 R17" },
  { slug: "ford-focus", brand: "Ford", model: "Focus", yearRange: "2011–2018", segment: "compacte", tireSize: "205/55 R16" },
  { slug: "ford-puma", brand: "Ford", model: "Puma", yearRange: "2019+", segment: "suv", tireSize: "215/60 R17" },
  { slug: "nissan-juke", brand: "Nissan", model: "Juke", yearRange: "2019+", segment: "suv", tireSize: "215/60 R17" },
  { slug: "nissan-micra", brand: "Nissan", model: "Micra", yearRange: "2017–2023", segment: "citadine", tireSize: "185/60 R15" },
  { slug: "toyota-c-hr", brand: "Toyota", model: "C-HR", yearRange: "2016+", segment: "suv", tireSize: "215/60 R17" },
  { slug: "toyota-rav4", brand: "Toyota", model: "RAV4", yearRange: "2019+", segment: "suv", tireSize: "225/65 R17" },
  { slug: "bmw-serie-3", brand: "BMW", model: "Série 3", yearRange: "2019+", segment: "premium", tireSize: "225/45 R18" },
  { slug: "mercedes-classe-c", brand: "Mercedes", model: "Classe C", yearRange: "2014–2021", segment: "premium", tireSize: "225/50 R17" },
  { slug: "seat-ibiza", brand: "Seat", model: "Ibiza", yearRange: "2017+", segment: "citadine", tireSize: "195/55 R16" },
  { slug: "skoda-octavia", brand: "Skoda", model: "Octavia", yearRange: "2013–2020", segment: "compacte", tireSize: "205/55 R16" },
  { slug: "kia-sportage", brand: "Kia", model: "Sportage", yearRange: "2016+", segment: "suv", tireSize: "225/60 R17" },
];

const SERVICES = {
  "pare-brise": {
    slugPart: "pare-brise",
    serviceKey: "pare-brise",
    serviceLabel: "remplacement de pare-brise",
    serviceUrl: "/pare-brise/",
    network: [470, 620],
    redkPrice: "devis après inspection à Ivry",
    redkHighlight: `${DIAGNOSTIC_OFFERT} · jusqu'à 150 € + franchise offerte`,
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
    redkHighlight: DIAGNOSTIC_OFFERT,
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
    redkHighlight: DIAGNOSTIC_OFFERT,
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
    redkHighlight: DIAGNOSTIC_OFFERT,
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
    redkHighlight: DIAGNOSTIC_OFFERT,
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
    redkPrice: "40 €",
    redkHighlight: DIAGNOSTIC_OFFERT,
    redkNote:
      "Recharge 40 € après contrôle d'étanchéité. Fuite ou compresseur : chiffré séparément, expliqué avant validation.",
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
    redkHighlight: DIAGNOSTIC_OFFERT,
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
    redkHighlight: DIAGNOSTIC_OFFERT,
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

function buildGenericExample(serviceKey) {
  const service = SERVICES[serviceKey];
  const [netMin, netMax] = service.network;
  const slug = `prix-${service.slugPart}`;

  const specifics = service.specifics.map((point) =>
    point.includes("ce modèle") || point.includes("Dimension fréquente")
      ? point
          .replace("Dimension fréquente sur ce modèle : voir fiche ou plaquette portière.", "Dimension des pneus : voir plaquette portière ou carte grise.")
          .replace(/sur ce modèle/i, "selon le véhicule")
      : point
  );
  if (serviceKey === "pare-brise") {
    specifics.push("Citadine, compacte ou SUV : le coût pièce et la main-d'œuvre varient fortement.");
  }
  if (serviceKey === "distribution") {
    specifics.push("Essence, diesel ou hybride : intervalle et type de courroie à vérifier au carnet.");
  }

  const seo = GENERIC_SEO[serviceKey];

  return {
    slug,
    isGeneric: true,
    serviceKey: service.serviceKey,
    serviceLabel: service.serviceLabel,
    serviceUrl: service.serviceUrl,
    brand: "Tous véhicules",
    model: "citadine à SUV",
    yearRange: "essence, diesel et hybride",
    networkPrice: formatRange(netMin * 0.9, netMax * 1.35),
    networkNote: `${service.networkNote} — fourchette selon segment (citadine, compacte, SUV, premium)`,
    redkPrice: service.redkPrice,
    redkHighlight: service.redkHighlight,
    redkNote: service.redkNote,
    specifics,
    published: true,
    date: DATE,
    ...seo,
  };
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
    isGeneric: false,
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
  if (ex.isGeneric && ex.title) {
    return ex.title;
  }
  if (ex.isGeneric) {
    return `Prix ${ex.serviceLabel} · fourchette 2026`;
  }
  return `Prix ${ex.serviceLabel} ${ex.brand} ${ex.model} · fourchette 2026`;
}

function buildDescription(ex) {
  if (ex.isGeneric && ex.metaDescription) {
    return ex.metaDescription;
  }
  if (ex.isGeneric) {
    return `Combien coûte un ${ex.serviceLabel} ? Exemple concret citadine, compacte ou SUV — fourchette réseau vs RED-K MOTORS à Ivry (94). Devis gratuit · 06 48 74 56 68.`;
  }
  return `Combien coûte un ${ex.serviceLabel} sur ${ex.brand} ${ex.model} ? Exemple concret, fourchette réseau vs RED-K MOTORS à Ivry (94). Devis gratuit · 06 48 74 56 68.`;
}

function buildQuery(ex) {
  if (ex.isGeneric && ex.searchQuery) {
    return ex.searchQuery;
  }
  if (ex.isGeneric) {
    return `Prix ${ex.serviceLabel}`;
  }
  return `Prix ${ex.serviceLabel} ${ex.brand} ${ex.model}`;
}

const serviceKeys = Object.keys(SERVICES);
const EXAMPLES = [];

for (const serviceKey of serviceKeys) {
  EXAMPLES.push(buildGenericExample(serviceKey));
}

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
