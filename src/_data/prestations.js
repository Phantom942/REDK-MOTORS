const reviewPages = require("./reviewPages.js");
const seoEnhance = require("./prestationSeoEnhancements.js");

const TARIFS_FAQ =
  "Consultez notre grille tarifaire sur redkmotors.fr/tarifs/ — devis fermé après inspection.";

const PROCESS_STEPS = [
  { title: "Contactez-nous", desc: "Téléphone, WhatsApp ou formulaire — réponse en journée." },
  { title: "Devis clair", desc: "Inspection, explication et chiffrage avant travaux." },
  { title: "Intervention validée", desc: "On intervient uniquement après votre accord." },
];

const DIAGNOSTIC_ONLY_SLUGS = new Set([
  "diagnostic-voyant-moteur",
  "diagnostic-electronique",
  "diagnostic-securite",
  "recherche-de-panne",
  "diagnostic-abs",
]);

const CATEGORY_HUB = {
  "Prestations fréquentes": "/entretien/",
  Moteur: "/mecanique/",
  Suspension: "/mecanique/",
  "Pneus / Roues": "/pneumatiques/",
  "Batterie, alternateur, démarreur": "/mecanique/",
  Freinage: "/freins/",
  Transmission: "/mecanique/",
  Climatisation: "/entretien/",
  Carrosserie: "/carrosserie/",
};

/** Accroches optimisées Google Ads (slug → champs hero) */
const AD_OVERRIDES = {
  "plaquettes-disques": {
    heroTitle: "Plaquettes & Disques de Frein à Ivry — Devis Gratuit",
    heroKicker: "Freinage · Sécurité · 94",
    heroDesc:
      "Grincement, pédale molle ou voyant ABS ? Contrôle usure et devis ferme avant toute intervention.",
    trustNote: "Aucun changement abusif. Usure mesurée devant vous.",
    symptoms: [
      "Grincement au freinage",
      "Pédale molle",
      "Vibrations au volant",
      "Distance d'arrêt allongée",
    ],
  },
  "diagnostic-voyant-moteur": {
    heroTitle: "Voyant Moteur Allumé à Ivry ? Diagnostic Rapide",
    heroKicker: "Urgence · Valise multimarques",
    heroDesc:
      "Ne roulez pas en doute : lecture des codes, explication claire et devis avant réparation.",
    prestaHubTitle: "Décrivez vos symptômes pour une estimation rapide",
    prestaHubSubtitle: "Plaque + symptômes — on vous rappelle avec une première estimation.",
  },
  "recherche-de-panne": {
    heroTitle: "Voiture en Panne à Ivry ? Recherche de Panne Rapide",
    heroKicker: "Urgence · Toutes marques",
    heroDesc: "Identification de la cause en atelier, devis clair — rien sans votre accord.",
    prestaHubTitle: "Décrivez vos symptômes pour une estimation rapide",
    prestaHubSubtitle: "Indiquez plaque et symptômes — rappel en journée.",
  },
  "revision-entretien": {
    heroTitle: "Révision Constructeur à Ivry — Carnet Respecté",
    heroKicker: "Entretien · Garantie préservée",
    heroDesc: "Révision selon préconisations constructeur. Pièces adaptées et devis gratuit.",
  },
  "vidange-moteur": {
    heroTitle: "Révision et Vidange à Ivry",
    heroKicker: "Huile homologuée · Filtre neuf",
    heroDesc: "Vidange avec huile adaptée à votre carnet. Contrôle des niveaux inclus.",
  },
  debosselage: {
    heroTitle: "Débosselage sans Peinture à Ivry",
    heroKicker: "Carrosserie · Devis photo",
    heroDesc: "Enfoncement ou impact léger ? Devis sur photo WhatsApp — restauration soignée.",
    whatsappCtaText: "Envoyez une photo de l'enfoncement pour une estimation rapide.",
  },
  "peinture-localisee": {
    heroTitle: "Peinture Localisée à Ivry — Teinte Constructeur",
    heroKicker: "Carrosserie · Retouches",
    heroDesc: "Rayure ou éclat de peinture ? Retouche discrète, teinte d'origine.",
    whatsappCtaText: "Photo de la zone à peindre → estimation WhatsApp en quelques minutes.",
  },
  "pare-brise-vitrage": {
    heroTitle: "Pare-Brise & Vitrage à Ivry — Bris de Glace",
    heroKicker: "Assurance · Navette possible",
    heroDesc: "Impact ou vitrage cassé ? Dossier assurance accompagné, intervention rapide.",
  },
  "recharge-clim": {
    heroTitle: "Recharge Climatisation à Ivry",
    heroKicker: "Clim · Confort été",
    heroDesc: "Air tiède ou odeur ? Recharge gaz, contrôle étanchéité, devis avant travaux.",
  },
  geometrie: {
    heroTitle: "Géométrie & Parallélisme à Ivry",
    heroKicker: "Pneus · Tenue de route",
    heroDesc: "Volant qui tire ou usure irrégulière ? Réglage géométrie précis sur RDV.",
  },
  "montage-equilibrage": {
    heroTitle: "Montage & Équilibrage Pneus à Ivry",
    heroKicker: "Pneus · Rapide sur RDV",
    heroDesc: "Montage, équilibrage et contrôle pression. Stock été/hiver selon arrivages.",
  },
  embrayage: {
    heroTitle: "Embrayage à Ivry — Diagnostic & Remplacement",
    heroKicker: "Transmission · Devis ferme",
    heroDesc: "Pédale haute, patinage ou bruit ? Diagnostic puis devis avant remplacement.",
  },
  "distribution-injection": {
    heroTitle: "Distribution à Ivry — Kit Courroie & Pose",
    heroKicker: "Moteur · Prévention panne",
    heroDesc: "Kit distribution : diagnostic, devis ferme et pièces adaptées au véhicule avant remplacement.",
  },
  injecteurs: {
    heroTitle: "Injecteurs à Ivry — Diagnostic & Remplacement",
    heroKicker: "Moteur · Injection",
    heroDesc: "Ratés, fumée ou perte de puissance ? Diagnostic injecteurs puis devis avant nettoyage ou remplacement.",
  },
  "decalaminage-moteur": {
    heroTitle: "Décalaminage Moteur à Ivry",
    heroKicker: "Moteur · Forfait",
    heroDesc: "Perte de puissance ou fumée ? Décalaminage pour retrouver des performances optimales.",
  },
  "vanne-egr": {
    heroTitle: "Vanne EGR à Ivry — Nettoyage & Remplacement",
    heroKicker: "Moteur · Antipollution",
    heroDesc: "Voyant moteur, fumée ou perte de puissance diesel ? Contrôle vanne EGR et devis avant intervention.",
  },
  "courroie-accessoires": {
    heroTitle: "Courroie d'Accessoires à Ivry",
    heroKicker: "Moteur · Prévention",
    heroDesc: "Grincement au démarrage ou courroie fissurée ? Contrôle et remplacement de la courroie d'accessoires.",
  },
  "changement-bougies": {
    heroTitle: "Changement des Bougies à Ivry",
    heroKicker: "Entretien · Allumage",
    heroDesc: "Démarrages difficiles ou ratés ? Remplacement des bougies d'allumage selon préconisations constructeur.",
  },
  "filtre-habitacle": {
    heroTitle: "Filtre d'Habitacle à Ivry",
    heroKicker: "Entretien · Air habitacle",
    heroDesc: "Odeur, buée ou air saturé ? Remplacement du filtre d'habitacle (pollen / charbon actif).",
  },
  "liquide-refroidissement": {
    heroTitle: "Liquide de Refroidissement à Ivry",
    heroKicker: "Entretien · Forfait",
    heroDesc: "Niveau bas, surchauffe ou liquide usé ? Contrôle circuit et remplacement du liquide de refroidissement.",
  },
  "diagnostic-securite": {
    heroTitle: "Diagnostic Sécurité (Check-up) à Ivry",
    heroKicker: "Entretien · Sécurité",
    heroDesc: "Check-up freins, pneus, éclairage, niveaux et points de sécurité — avant long trajet ou CT.",
  },
  "diagnostic-electronique": {
    heroTitle: "Diagnostic Électronique à Ivry",
    heroKicker: "Valise multimarques · Devis",
    heroDesc: "Lecture OBD, identification des codes défaut et devis clair avant toute réparation.",
  },
  amortisseurs: {
    heroTitle: "Amortisseurs à Ivry — Suspension & Confort",
    heroKicker: "Suspension · Sécurité",
    heroDesc: "Sauts, bruits ou tenue de route dégradée ? Contrôle suspension et devis avant remplacement.",
  },
  "kit-roulement-arriere": {
    heroTitle: "Kit Roulement Arrière à Ivry",
    heroKicker: "Suspension · Roues",
    heroDesc: "Sifflement ou ronronnement qui augmente avec la vitesse ? Contrôle et remplacement du roulement arrière.",
  },
  "rotule-direction": {
    heroTitle: "Rotule de Direction à Ivry",
    heroKicker: "Direction · Sécurité",
    heroDesc: "Jeu au volant, bruit en braquant ou usure irrégulière des pneus ? Contrôle rotules et devis.",
  },
  "pre-controle-technique": {
    heroTitle: "Pré-Contrôle Technique à Ivry",
    heroKicker: "CT · Mise en conformité",
    heroDesc: "Anticipez le contrôle technique : points de contrôle et devis pour corriger avant le CT.",
  },
  "purge-liquide-frein": {
    heroTitle: "Liquide de Freins à Ivry — Purge & Remplacement",
    heroKicker: "Freinage · Forfait",
    heroDesc: "Liquide de frein usé ou pédale spongieuse ? Purge complète du circuit avec devis avant intervention.",
  },
  demarreur: {
    heroTitle: "Démarreur à Ivry — Diagnostic & Remplacement",
    heroKicker: "Démarrage · Électricité",
    heroDesc: "Clic au démarrage ou moteur qui ne tourne pas ? Test démarreur, batterie et circuit de charge.",
  },
  "diagnostic-abs": {
    heroTitle: "Voyant ABS Allumé à Ivry ? Diagnostic Freinage",
    heroKicker: "Freinage · Électronique",
    heroDesc: "Voyant ABS ou ESP : lecture des codes, identification de la cause, devis avant réparation.",
  },
  "remplacement-batterie": {
    heroTitle: "Batterie Auto à Ivry — Test & Remplacement",
    heroKicker: "Démarrage · Rapide",
    heroDesc: "Voiture qui ne démarre plus ? Test batterie et alternateur, remplacement sur place si besoin.",
  },
  "controle-alternateur": {
    heroTitle: "Alternateur à Ivry — Test & Remplacement",
    heroKicker: "Charge · Électricité",
    heroDesc: "Voyant batterie, phares faibles ou batterie qui se décharge ? Test alternateur et devis avant remplacement.",
  },
  cardans: {
    heroTitle: "Cardan à Ivry — Cliquetis & Vibrations",
    heroKicker: "Transmission · Sécurité",
    heroDesc: "Claquement en braquant ou vibration à l'accélération ? Contrôle cardan et devis ferme.",
  },
  "retouches-finitions": {
    heroTitle: "Retouches & Finitions Carrosserie à Ivry",
    heroKicker: "Esthétique · Finitions",
    heroDesc: "Rayures légères, micro-rayures ou finitions : polissage et retouches pour un rendu propre.",
    whatsappCtaText: "Photo de la zone concernée → estimation WhatsApp rapide.",
  },
  "desinfection-circuit-clim": {
    heroTitle: "Désinfection Climatisation à Ivry",
    heroKicker: "Clim · Hygiène",
    heroDesc: "Odeur dans l'habitacle ? Désinfection du circuit clim pour un air sain.",
  },
  "reparation-crevaison": {
    heroTitle: "Réparation Crevaison à Ivry",
    heroKicker: "Pneus · Urgence",
    heroDesc: "Crevaison ou objet dans le pneu ? Réparation ou remplacement selon l'état du pneu.",
  },
};

const categories = [
  {
    key: "frequentes",
    title: "Prestations fréquentes",
    services: [
      { slug: "revision-entretien", name: "Révision constructeur" },
      { slug: "vidange-moteur", name: "Révision et vidange" },
      { slug: "diagnostic-electronique", name: "Diagnostic électronique" },
      { slug: "diagnostic-securite", name: "Diagnostic Sécurité (Check-up)" },
      { slug: "changement-bougies", name: "Changement des bougies" },
      { slug: "filtre-habitacle", name: "Filtre d'habitacle" },
      { slug: "liquide-refroidissement", name: "Liquide de refroidissement" },
      { slug: "pre-controle-technique", name: "Pré-contrôle technique" },
    ],
  },
  {
    key: "moteur",
    title: "Moteur",
    services: [
      { slug: "recherche-de-panne", name: "Recherche de panne" },
      { slug: "distribution-injection", name: "Distribution" },
      { slug: "injecteurs", name: "Injecteurs" },
      { slug: "vanne-egr", name: "Vanne EGR" },
      { slug: "courroie-accessoires", name: "Courroie d'accessoires" },
      { slug: "diagnostic-voyant-moteur", name: "Diagnostic voyant moteur" },
      { slug: "decalaminage-moteur", name: "Décalaminage" },
    ],
  },
  {
    key: "suspension",
    title: "Suspension",
    services: [
      { slug: "amortisseurs", name: "Amortisseurs" },
      { slug: "coupelles-triangles", name: "Coupelles et triangles" },
      { slug: "kit-roulement-arriere", name: "Kit de roulement arrière" },
      { slug: "rotule-direction", name: "Rotule de direction" },
      { slug: "geometrie", name: "Géométrie (parallélisme)" },
    ],
  },
  {
    key: "pneus",
    title: "Pneus / Roues",
    services: [
      { slug: "montage-equilibrage", name: "Montage et équilibrage" },
      { slug: "permutation-pneus", name: "Permutation pneus" },
      { slug: "reparation-crevaison", name: "Réparation crevaison" },
    ],
  },
  {
    key: "batterie",
    title: "Batterie, alternateur, démarreur",
    services: [
      { slug: "test-batterie", name: "Test batterie" },
      { slug: "remplacement-batterie", name: "Batterie" },
      { slug: "controle-alternateur", name: "Alternateur" },
      { slug: "demarreur", name: "Démarreur" },
    ],
  },
  {
    key: "freinage",
    title: "Freinage",
    services: [
      { slug: "plaquettes-disques", name: "Freinage" },
      { slug: "purge-liquide-frein", name: "Liquide de freins" },
      { slug: "diagnostic-abs", name: "Diagnostic ABS" },
    ],
  },
  {
    key: "transmission",
    title: "Transmission",
    services: [
      { slug: "embrayage", name: "Embrayage" },
      { slug: "cardans", name: "Cardan" },
      { slug: "vidange-boite", name: "Vidange de boîte" },
    ],
  },
  {
    key: "climatisation",
    title: "Climatisation",
    services: [
      { slug: "recharge-clim", name: "Recharge clim" },
      { slug: "desinfection-circuit-clim", name: "Désinfection circuit clim" },
      { slug: "controle-compresseur", name: "Contrôle compresseur" },
    ],
  },
  {
    key: "carrosserie",
    title: "Carrosserie",
    services: [
      { slug: "debosselage", name: "Débosselage" },
      { slug: "peinture-localisee", name: "Peinture localisée" },
      { slug: "pare-brise-vitrage", name: "Pare-brise et vitrage" },
      { slug: "retouches-finitions", name: "Retouches et finitions" },
    ],
  },
];

/** Texte SEO discret par prestation (corps de page, pas les titres). */
const SEO_CONTENT = {
  "revision-entretien": {
    seoTitle: "Révision constructeur",
    seoParagraphs: [
      "Révision selon le carnet constructeur : filtres, niveaux, points de sécurité et contrôles d'usure.",
      "Entretien périodique à Ivry (94) — devis écrit avant travaux, carnet tamponné quand c'est possible. Garantie constructeur préservée si pièces et fluides conformes.",
    ],
    seoFooter: "Planifiez votre révision par téléphone ou WhatsApp.",
  },
  "vidange-moteur": {
    seoTitle: "Révision et vidange",
    seoParagraphs: [
      "Vidange avec huile homologuée constructeur et filtre neuf. Contrôle des niveaux inclus.",
      "Souvent réalisée le jour même sur rendez-vous à Ivry-sur-Seine.",
    ],
    seoFooter: "Huile adaptée à votre carnet — devis avant travaux.",
  },
  "diagnostic-electronique": {
    seoTitle: "Diagnostic électronique",
    seoParagraphs: [
      "Lecture OBD multimarques : identification des codes défaut, explication claire et devis avant réparation.",
      "Indispensable dès qu'un voyant s'allume ou qu'un comportement anormal apparaît.",
    ],
  },
  "diagnostic-securite": {
    seoTitle: "Diagnostic Sécurité (Check-up)",
    seoParagraphs: [
      "Check-up freins, pneus, éclairage, niveaux, direction et points de sécurité avant long trajet ou contrôle technique.",
      "Rapport clair des points à corriger + devis si intervention nécessaire.",
    ],
  },
  "changement-bougies": {
    seoTitle: "Changement des bougies",
    seoParagraphs: [
      "Remplacement des bougies d'allumage selon préconisations constructeur (intervalle ou symptômes).",
      "Démarrages difficiles, ratés ou surconsommation : un contrôle rapide tranche.",
    ],
  },
  "filtre-habitacle": {
    seoTitle: "Filtre d'habitacle",
    seoParagraphs: [
      "Filtre pollen ou charbon actif saturé : odeurs, buée, air moins frais dans l'habitacle.",
      "Remplacement rapide, idéal en entretien périodique ou avant la saison des pollens.",
    ],
  },
  "liquide-refroidissement": {
    seoTitle: "Liquide de refroidissement",
    seoParagraphs: [
      "Niveau bas, liquide usé ou risque de surchauffe : contrôle du circuit et remplacement forfaitaire du liquide de refroidissement.",
      "Ne jamais ouvrir le vase d'expansion à chaud.",
    ],
  },
  "pre-controle-technique": {
    seoTitle: "Pré-contrôle technique",
    seoParagraphs: [
      "Avant le contrôle technique : vérification freins, éclairage, pneus, niveaux et points de rejet fréquents.",
      "Corrections chiffrées au devis pour passer le CT sereinement.",
    ],
  },
  "recherche-de-panne": {
    seoTitle: "Recherche de panne",
    seoParagraphs: [
      "Voiture en panne ou comportement anormal : diagnostic en atelier pour identifier la cause réelle.",
      "Devis clair avant réparation — pas de remplacement inutile.",
    ],
    seoFooter: "Décrivez vos symptômes par téléphone pour orienter le premier contrôle.",
  },
  "diagnostic-voyant-moteur": {
    seoTitle: "Voyant moteur allumé",
    seoParagraphs: [
      "Lecture des codes défaut, explication en langage clair et devis avant intervention.",
      "Voyant orange ou rouge : ne roulez pas en doute — passez à l'atelier.",
    ],
  },
  "distribution-injection": {
    seoTitle: "Distribution",
    seoParagraphs: [
      "Kit distribution (courroie ou chaîne selon moteur) : diagnostic et devis ferme avant remplacement.",
      "Respectez l'intervalle constructeur — une rupture peut endommager le moteur.",
    ],
  },
  injecteurs: {
    seoTitle: "Injecteurs",
    seoParagraphs: [
      "Injecteurs encrassés ou défaillants : ratés, fumée, perte de puissance ou surconsommation.",
      "Diagnostic valise puis nettoyage ou remplacement selon l'état — devis avant travaux.",
    ],
  },
  "vanne-egr": {
    seoTitle: "Vanne EGR",
    seoParagraphs: [
      "Vanne EGR encrassée (surtout diesel urbain) : perte de puissance, fumée, voyant moteur.",
      "Nettoyage ou remplacement après diagnostic — devis ferme à Ivry-sur-Seine.",
    ],
  },
  "courroie-accessoires": {
    seoTitle: "Courroie d'accessoires",
    seoParagraphs: [
      "La courroie d'accessoires entraîne alternateur, pompe à eau et parfois la direction assistée.",
      "Grincement, fissures ou brillance : contrôle et remplacement préventif recommandé.",
    ],
  },
  "decalaminage-moteur": {
    seoTitle: "Décalaminage",
    seoParagraphs: [
      "Perte de puissance, fumée ou surconsommation : décalaminage pour retrouver des performances.",
      "Intervention forfaitaire après diagnostic moteur et validation du devis.",
    ],
  },
  amortisseurs: {
    seoTitle: "Amortisseurs et suspension",
    seoParagraphs: [
      "Sauts, bruits de suspension ou tenue de route dégradée : contrôle amortisseurs et silent-blocs.",
      "Remplacement sur devis ferme après inspection.",
    ],
  },
  "coupelles-triangles": {
    seoTitle: "Coupelles et triangles",
    seoParagraphs: [
      "Claquements en négociant un dos-d'âne ou usure des coupelles : contrôle train avant et arrière.",
      "Pièces adaptées au véhicule, devis avant travaux.",
    ],
  },
  "kit-roulement-arriere": {
    seoTitle: "Kit de roulement arrière",
    seoParagraphs: [
      "Sifflement ou ronronnement qui augmente avec la vitesse et change en virage : souvent un roulement arrière.",
      "Remplacement du kit roulement après contrôle sous pont — devis avant pose.",
    ],
  },
  "rotule-direction": {
    seoTitle: "Rotule de direction",
    seoParagraphs: [
      "Jeu au volant, bruit en braquant ou usure irrégulière des pneus : contrôle des rotules de direction.",
      "Pièce de sécurité — remplacement recommandé dès le premier jeu constaté.",
    ],
  },
  "permutation-pneus": {
    seoTitle: "Permutation des pneus",
    seoParagraphs: [
      "Rotation été/hiver ou avant/arrière pour uniformiser l'usure et prolonger la durée de vie des pneus.",
      "Contrôle pression et état de la bande de roulement inclus.",
    ],
  },
  "reparation-crevaison": {
    seoTitle: "Réparation de crevaison",
    seoParagraphs: [
      "Objet dans le pneu ou crevaison lente : réparation si le pneu le permet, sinon remplacement.",
      "Intervention rapide sur rendez-vous à Ivry-sur-Seine.",
    ],
  },
  "test-batterie": {
    seoTitle: "Test batterie et démarrage",
    seoParagraphs: [
      "Contrôle batterie, démarreur et alternateur. Voiture qui ne démarre plus : diagnostic sur place.",
    ],
    seoFooter: "Remplacement batterie possible le jour même selon stock.",
  },
  "controle-alternateur": {
    seoTitle: "Alternateur",
    seoParagraphs: [
      "Batterie qui se décharge, voyant batterie ou éclairage faible : test alternateur et circuit de charge.",
      "Devis avant remplacement de l'alternateur.",
    ],
  },
  demarreur: {
    seoTitle: "Démarreur",
    seoParagraphs: [
      "Clic au démarrage, démarreur qui tourne dans le vide ou silence total : test démarreur et batterie.",
      "Remplacement sur devis après confirmation du diagnostic.",
    ],
  },
  "purge-liquide-frein": {
    seoTitle: "Liquide de freins",
    seoParagraphs: [
      "Liquide de frein usé ou pédale spongieuse : purge complète du circuit pour retrouver un freinage efficace.",
      "Forfait selon préconisations constructeur.",
    ],
  },
  "diagnostic-abs": {
    seoTitle: "Voyant ABS ou ESP",
    seoParagraphs: [
      "Voyant ABS allumé : lecture des codes, contrôle capteurs et circuit de freinage.",
      "Devis avant remplacement de pièce.",
    ],
  },
  embrayage: {
    seoTitle: "Embrayage",
    seoParagraphs: [
      "Pédale haute, patinage ou bruit à l'embrayage : diagnostic puis devis pour kit embrayage si nécessaire.",
    ],
  },
  cardans: {
    seoTitle: "Cardan",
    seoParagraphs: [
      "Claquement en braquant ou vibration à l'accélération : contrôle cardan et soufflets.",
    ],
  },
  "vidange-boite": {
    seoTitle: "Vidange boîte de vitesses",
    seoParagraphs: [
      "Vidange boîte manuelle ou automatique selon préconisations — huile adaptée au véhicule.",
      "Entretien préventif pour préserver la transmission.",
    ],
  },
  "desinfection-circuit-clim": {
    seoTitle: "Désinfection climatisation",
    seoParagraphs: [
      "Odeur dans l'habitacle ou air vicié : désinfection du circuit clim pour un air sain.",
      "Complément utile après recharge climatisation.",
    ],
  },
  "controle-compresseur": {
    seoTitle: "Contrôle compresseur clim",
    seoParagraphs: [
      "Clim qui ne refroidit plus : contrôle compresseur, pression et étanchéité avant recharge ou réparation.",
    ],
  },
  debosselage: {
    seoTitle: "Débosselage sans peinture",
    seoParagraphs: [
      "Enfoncement ou impact léger : débosselage pour restaurer la carrosserie sans repeindre toute la zone.",
      "Devis sur photo WhatsApp possible.",
    ],
  },
  "peinture-localisee": {
    seoTitle: "Peinture localisée",
    seoParagraphs: [
      "Rayure, éclat ou retouche : peinture à la teinte constructeur pour un rendu discret.",
    ],
    seoFooter: "Envoyez une photo de la zone pour une première estimation.",
  },
  "pare-brise-vitrage": {
    seoTitle: "Pare-brise et vitrage",
    seoParagraphs: [
      "Impact, fissure ou bris de glace : remplacement pare-brise avec accompagnement assurance si applicable.",
      "Navette possible selon disponibilité.",
    ],
  },
  "retouches-finitions": {
    seoTitle: "Retouches carrosserie",
    seoParagraphs: [
      "Micro-rayures, finitions et polissage pour redonner un aspect propre à la carrosserie.",
    ],
  },
  "plaquettes-disques": {
    seoTitle: "Freinage — plaquettes et disques",
    seoParagraphs: [
      "Changement de plaquettes de frein et disques sur devis ferme, après mesure d'usure à l'atelier — sans remplacement abusif.",
      "Grincement, pédale molle ou voyant ABS : contrôle gratuit avant intervention.",
    ],
    seoFooter: "Freinage à Ivry-sur-Seine (94) — lun–sam 9h–19h.",
  },
  "recharge-clim": {
    seoTitle: "Climatisation auto",
    seoParagraphs: [
      "Recharge climatisation après contrôle d'étanchéité. Clim qui ne refroidit plus, air tiède ou odeur : diagnostic avant recharge.",
      "Réparation climatisation (fuite, compresseur) chiffrée au devis après inspection du circuit.",
    ],
    seoFooter: "Pensez à la clim avant l'été — créneau sur rendez-vous.",
  },
  "montage-equilibrage": {
    seoTitle: "Montage et changement de pneus",
    seoParagraphs: [
      "Changement de pneus été ou hiver, montage et équilibrage. Apportez vos pneus ou choisissez dans notre stock selon arrivages.",
      "Contrôle pression et usure inclus — parallélisme disponible si le volant tire.",
    ],
    seoFooter: "Appelez avec la dimension de vos pneus pour réserver un créneau.",
  },
  "remplacement-batterie": {
    seoTitle: "Batterie auto",
    seoParagraphs: [
      "Test batterie et alternateur, changement batterie voiture sur place si nécessaire. Voiture qui ne démarre plus : passez à l'atelier.",
    ],
  },
  geometrie: {
    seoTitle: "Géométrie (parallélisme)",
    seoParagraphs: [
      "Réglage parallélisme et géométrie des roues. Usure irrégulière des pneus ou volant qui tire : contrôle recommandé.",
    ],
  },
};

function buildLp(service, category) {
  const ad = AD_OVERRIDES[service.slug] || {};
  const seo = SEO_CONTENT[service.slug] || {
    seoParagraphs: [
      `${service.name} à Ivry-sur-Seine (94) : inspection au véhicule, devis écrit et intervention uniquement après votre accord.`,
    ],
  };
  const extraParagraphs = seoEnhance.extraSeoParagraphs[service.slug] || [];
  const extraFaqs = seoEnhance.extraFaqs[service.slug] || [];
  const hubUrl = CATEGORY_HUB[category] || "/prestations/";
  const videoSrc = category === "Carrosserie" ? "carrosserie.mp4" : "mecanique.mp4";

  return {
    heroTitle: ad.heroTitle || `${service.name} à Ivry-sur-Seine`,
    heroKicker: ad.heroKicker || `${category} · Devis gratuit · Lun–sam 9h–19h`,
    heroDesc:
      ad.heroDesc ||
      `${service.name} à Ivry : diagnostic, devis clair et intervention validée avant travaux.`,
    heroCtaLabel: "Appeler le 06.48.74.56.68",
    videoSrc,
    symptoms: ad.symptoms || seoEnhance.symptoms[service.slug],
    trustNote: ad.trustNote,
    whatsappCtaText: ad.whatsappCtaText,
    prestaHubTitle: ad.prestaHubTitle,
    prestaHubSubtitle: ad.prestaHubSubtitle,
    highlights: ad.highlights || [
      `Diagnostic complet pour ${service.name.toLowerCase()}`,
      "Devis détaillé et transparent",
      "Pièces adaptées au véhicule",
      "Contrôle final avant restitution",
    ],
    tarifsTeaserLead: `Tarifs indicatifs pour ${service.name.toLowerCase()} et prestations associées.`,
    processSteps: PROCESS_STEPS,
    showReviews: Boolean(reviewPages[`prestation-${service.slug}`]),
    reviewCount: reviewPages[`prestation-${service.slug}`]?.length || 0,
    showDiagnosticInterventionOffer: !DIAGNOSTIC_ONLY_SLUGS.has(service.slug),
    servicesTitle: "Pages associées",
    services: [
      { title: "Service principal", url: hubUrl },
      { title: "Toutes nos prestations", url: "/prestations/" },
      { title: "Tarifs indicatifs", url: "/tarifs/" },
    ],
    faqs: [
      {
        question: `Quand faut-il prévoir ${service.name.toLowerCase()} ?`,
        answer:
          "Signes d'usure, voyant ou comportement anormal : un contrôle rapide permet de confirmer le besoin.",
      },
      {
        question: `Combien coûte ${service.name.toLowerCase()} ?`,
        answer: TARIFS_FAQ,
      },
      {
        question: "Comment prendre rendez-vous ?",
        answer: "06 48 74 56 68, WhatsApp ou formulaire contact. Réponse en journée lun–sam 9h–19h.",
      },
      ...extraFaqs,
    ],
    seoProblems: seo.seoProblems || seoEnhance.seoProblems[service.slug],
    seoParagraphs: [...(seo.seoParagraphs || []), ...extraParagraphs],
    seoTitle: seo.seoTitle,
    seoFooter: seo.seoFooter,
  };
}

function buildService(service, category) {
  const summary = `${service.name} à Ivry-sur-Seine : devis clair et intervention validée avant travaux. ☎ 06 48 74 56 68.`;
  const lp = buildLp(service, category);

  return {
    ...service,
    category,
    summary,
    lead: lp.heroDesc,
    bullets: lp.highlights,
    process: [
      "Vérification du véhicule et des besoins",
      "Chiffrage puis validation client",
      "Intervention en atelier",
      "Restitution avec compte-rendu",
    ],
    faq: lp.faqs.map((item) => ({ q: item.question, a: item.answer })),
    lp,
  };
}

const all = categories.flatMap((category) =>
  category.services.map((service) => buildService(service, category.title))
);

module.exports = {
  categories,
  all,
};
