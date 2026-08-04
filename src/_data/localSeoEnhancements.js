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

/** Overrides ciblés (symptômes + textes uniques pour landings whitelist). */
const PAGE_OVERRIDES = {
  abs94Seo: {
    symptoms: [
      "Voyant ABS orange fixe",
      "Pédale de frein qui pulse",
      "Freinage moins efficace par temps humide",
      "Bruit au ralenti lié à la pompe ABS",
    ],
    seoTitle: "Voyant ABS allumé — diagnostic freinage à Ivry (94)",
    seoParagraphs: [
      "Un voyant ABS ne veut pas toujours dire « freins HS », mais il signale un défaut de capteur, de connectique ou de l'unité hydraulique. On lit les codes, on contrôle les roues et on vous explique ce qui est urgent avant le prochain trajet.",
      "À Ivry-sur-Seine, le diagnostic ABS est souvent réalisable sous 48 h sur rendez-vous — devis écrit avant toute pièce.",
    ],
    seoProblems: [
      { text: "Voyant ABS : causes", url: "/blog/voyant-abs-allume-causes-conduite/" },
      { text: "Pédale spongieuse", url: "/blog/freinage-mou-pedale-spongieuse/" },
      { text: "Prix plaquettes 94", url: "/blog/prix-changement-plaquettes-frein-94/" },
    ],
  },
  voyant94Seo: {
    symptoms: [
      "Voyant moteur orange ou rouge",
      "Perte de puissance soudaine",
      "Consommation anormale",
      "Ratés à froid ou à chaud",
    ],
    seoTitle: "Voyant moteur allumé — diagnostic OBD à Ivry-sur-Seine",
    seoParagraphs: [
      "Voyant moteur fixe ou clignotant : on branche la valise multimarques, on isole le défaut (sonde, turbo, EGR, FAP, allumage…) et on priorise ce qui bloque réellement le véhicule.",
      "Pas de « boîte noire » : vous repartez avec un diagnostic clair et un devis avant réparation, atelier 9 rue Michelet.",
    ],
    seoProblems: [
      { text: "Que faire si voyant moteur", url: "/blog/voyant-moteur-allume-que-faire/" },
      { text: "Prix diagnostic 94", url: "/blog/prix-diagnostic-auto-94/" },
      { text: "Perte de puissance", url: "/blog/perte-puissance-soudaine-causes/" },
    ],
  },
  bruitFrein94Seo: {
    symptoms: [
      "Grincement métallique au freinage",
      "Sifflement à basse vitesse",
      "Vibrations dans le volant",
      "Pédale qui tremble",
    ],
    // Page noindex (doorway) — texte distinct du hub /freins/ et de /changement-plaquettes-frein-94/
    seoTitle: "Bruit au freinage — diagnostic plaquettes & disques (94)",
    seoParagraphs: [
      "Grincement, sifflement ou frottement métallique : on écoute le type de bruit, on mesure l'usure plaquettes/disques et on contrôle le liquide avant de proposer un devis.",
      "Objectif : distinguer usure normale, disque rayé ou autre cause — atelier Ivry, sans forfait opaque.",
    ],
    seoProblems: [
      { text: "Signaux d'usure plaquettes", url: "/blog/plaquettes-frein-usure-signaux-a-ne-pas-ignorer/" },
      { text: "Hub freinage Ivry", url: "/freins/" },
      { text: "Changement plaquettes 94", url: "/changement-plaquettes-frein-94/" },
    ],
  },
  clim94Seo: {
    // Money symptôme « ne refroidit plus » ≠ /reparation-climatisation-ivry/ (réparation circuit) ≠ prestation recharge
    symptoms: [
      "Air tiède malgré clim au max",
      "Odeur moisi à la ventilation",
      "Clim qui s'arrête en ville",
      "Buée ou manque de débit d'air",
    ],
    seoTitle: "Clim qui ne refroidit plus — diagnostic avant recharge (94)",
    seoParagraphs: [
      "Air tiède, odeur ou clim qui coupe : on mesure les pressions, on cherche une fuite éventuelle et on recharge uniquement si le circuit est sain. Évite de « remplir à l'aveugle ».",
      "Page symptômes 94 — pour une réparation de circuit (compresseur, fuite), voir aussi réparation clim Ivry.",
    ],
    seoProblems: [
      { text: "Réparation clim Ivry", url: "/reparation-climatisation-ivry/" },
      { text: "Recharge clim prestation", url: "/prestations/recharge-clim/" },
      { text: "Prix recharge clim", url: "/blog/prix-recharge-climatisation-94/" },
      { text: "Odeur moisi clim", url: "/blog/clim-odeur-moisi-que-faire/" },
    ],
  },
  climIvrySeo: {
    seoTitle: "Réparation circuit clim à Ivry — fuite & compresseur",
    seoParagraphs: [
      "Atelier clim : test d'étanchéité, contrôle compresseur, recharge et désinfection si besoin. On distingue recharge simple et vraie réparation de circuit.",
      "Conducteurs d'Ivry, Vitry, Villejuif et Paris sud : créneau souvent disponible en semaine et le samedi.",
    ],
    seoProblems: [
      { text: "Symptôme clim tiède 94", url: "/clim-voiture-ne-refroidit-plus-94/" },
      { text: "Guide recharge clim", url: "/blog/climatisation-voiture-recharge-ivry/" },
      { text: "Exemple de prix clim", url: "/exemples/prix-recharge-climatisation/" },
    ],
  },
  demarrage94Seo: {
    symptoms: [
      "Moteur ne tourne pas ou faiblement",
      "Cliquetis au démarrage",
      "Démarrage puis calage",
      "Voyants multiples allumés",
    ],
    seoTitle: "Voiture qui ne démarre plus — diagnostic démarrage 94",
    seoParagraphs: [
      "Batterie, alternateur, démarreur, antivol ou panne électronique : on teste dans l'ordre pour éviter de changer une pièce inutile. Diagnostic clair avant devis.",
      "Urgences démarrage à Ivry-sur-Seine sur rendez-vous — lun–sam 9h–19h.",
    ],
    seoProblems: [
      { text: "Causes demarrage", url: "/blog/voiture-ne-demarre-pas-causes/" },
      { text: "Batterie à changer", url: "/blog/batterie-voiture-quand-changer/" },
      { text: "Changement batterie 94", url: "/changement-batterie-94/" },
    ],
  },
  tremblementVolant94Seo: {
    symptoms: [
      "Volant qui tremble à 90–130 km/h",
      "Vibrations après changement de pneus",
      "Tirage à gauche ou droite",
      "Usure inégale des pneus",
    ],
    seoTitle: "Volant qui tremble — équilibrage & géométrie 94",
    seoParagraphs: [
      "Tremblement sur autoroute : on contrôle équilibrage, géométrie et état des pneus avant de parler freins ou suspension. Cause fréquente après un montage ou un choc de trottoir.",
      "Diagnostic vibrations à Ivry — devis avant réglage ou remplacement.",
    ],
    seoProblems: [
      { text: "Géométrie des roues", url: "/blog/geometrie-roues-signes-mauvais-alignement/" },
      { text: "Montage pneus", url: "/prestations/montage-equilibrage/" },
      { text: "Hub pneumatiques", url: "/pneumatiques/" },
    ],
  },
  batterie94Seo: {
    // Money batterie ≠ hub démarrage (/voiture-ne-demarre-plus-94/) ≠ prestation /prestations/remplacement-batterie/
    seoTitle: "Changement de batterie voiture à Ivry (94)",
    seoParagraphs: [
      "Démarrage lent, cliquetis ou voyants au contact : on teste la batterie et le circuit de charge avant de remplacer. Une batterie neuve sur un alternateur HS ne règle rien.",
      "Pose adaptée au véhicule (y compris start & stop quand compatible) — devis avant intervention à l'atelier RED-K MOTORS.",
    ],
    seoProblems: [
      { text: "Quand changer la batterie", url: "/blog/batterie-voiture-quand-changer/" },
      { text: "Prix batterie 94", url: "/blog/prix-changement-batterie-94/" },
      { text: "Prestation batterie atelier", url: "/prestations/remplacement-batterie/" },
      { text: "Voiture qui ne démarre pas", url: "/blog/voiture-ne-demarre-pas-causes/" },
    ],
  },
  plaquettes94Seo: {
    // Money plaquettes ≠ hub symptômes /freins/ ≠ prestation /prestations/plaquettes-disques/
    seoTitle: "Changement plaquettes de frein à Ivry-sur-Seine",
    seoParagraphs: [
      "Grincement, voyant frein ou course de pédale allongée : contrôle plaquettes, disques et liquide. On remplace ce qui est hors cote — pas de forfait opaque.",
      "Freinage sécurisé pour trajets urbains 94 / Paris sud — devis écrit, contrôle ABS si voyant associé. Pour le diagnostic freinage général, voir aussi le hub freins.",
    ],
    seoProblems: [
      { text: "Signaux d'usure plaquettes", url: "/blog/plaquettes-frein-usure-signaux-a-ne-pas-ignorer/" },
      { text: "Prix plaquettes 94", url: "/blog/prix-changement-plaquettes-frein-94/" },
      { text: "Hub freinage Ivry", url: "/freins/" },
      { text: "Exemple prix plaquettes", url: "/exemples/prix-plaquettes-frein/" },
    ],
  },
  pneusFreins94Seo: {
    seoTitle: "Garage pneus et freins dans le Val-de-Marne (94)",
    seoParagraphs: [
      "Deux postes sécurité réunis : montage / équilibrage pneus et freinage (plaquettes, disques, géométrie si besoin). Contrôle croisé usure pour éviter les mauvaises surprises au CT.",
      "Stock selon arrivages ou montage de vos pneus — devis au modèle avant pose, atelier Ivry.",
    ],
    seoProblems: [
      { text: "Quand changer les pneus", url: "/blog/quand-changer-pneus-usure-securite/" },
      { text: "Prix pneus 94", url: "/blog/prix-changement-pneus-94/" },
      { text: "Freinage", url: "/freins/" },
    ],
  },
  revisionIvrySeo: {
    // Money révision Ivry ≠ hub /entretien/ (révision+clim+CT) ≠ /vidange/ ≠ /vidange-rapide-ivry/
    seoTitle: "Révision voiture à Ivry-sur-Seine — carnet respecté",
    seoParagraphs: [
      "Révision selon préconisations constructeur : vidange, filtres, niveaux, points de sécurité. On vous dit ce qui est dû maintenant et ce qui peut attendre — distinct d'une simple vidange express.",
      "Idéal avant long trajet ou contrôle technique — créneaux lun–sam à Ivry.",
    ],
    seoProblems: [
      { text: "Checklist 60 000 km", url: "/blog/revision-60000-km-checklist/" },
      { text: "Hub entretien Ivry", url: "/entretien/" },
      { text: "Vidange seule", url: "/vidange/" },
      { text: "Tarifs indicatifs", url: "/tarifs/" },
    ],
  },
  revision94Seo: {
    // Angle « garage 94 / Val-de-Marne » — pas un clone de /revision-voiture-ivry/
    seoTitle: "Garage Val-de-Marne (94) — entretien & révision à Ivry",
    seoParagraphs: [
      "Pour les conducteurs du 94 : révision complète ou entretien courant avec pièces adaptées. Devis avant travaux, pas de surprise en fin d'intervention.",
      "Accès simple depuis Vitry, Villejuif, Charenton, Alfortville — même atelier, même exigence. Page zone 94, complémentaire à la révision Ivry locale.",
    ],
  },
  revisionRapide94Seo: {
    // Doorway noindex — texte distinct des landings indexables
    seoTitle: "Révision express 94 — créneau atelier Ivry",
    seoParagraphs: [
      "Créneau révision express selon charge atelier : points carnet prioritaires, devis avant travaux. Pour la révision complète indexable, voir /revision-voiture-ivry/.",
    ],
  },
  garageSamedi94Seo: {
    seoTitle: "Garage ouvert le samedi dans le 94 — Ivry-sur-Seine",
    seoParagraphs: [
      "Pas de semaine libre ? On reçoit aussi le samedi (9h–19h) pour diagnostic, freins, vidange, pneus et devis. Réservation conseillée pour garder un créneau.",
      "Atelier RED-K MOTORS, 9 rue Michelet — idéal pour les actifs de Paris sud et du Val-de-Marne.",
    ],
  },
  devisGarage94Seo: {
    seoTitle: "Devis garage 94 — gratuit et détaillé",
    seoParagraphs: [
      "Demandez un devis clair : pièces, main-d'œuvre, délai. On ne démarre les travaux qu'après votre validation. Photo WhatsApp possible pour une première estimation carrosserie.",
      "Devis gratuit à Ivry-sur-Seine — téléphone, WhatsApp ou formulaire contact.",
    ],
    seoProblems: [
      { text: "Contact & RDV", url: "/contact/" },
      { text: "Tarifs indicatifs", url: "/tarifs/" },
    ],
  },
  pertePuissance94Seo: {
    seoTitle: "Perte de puissance voiture — causes & diagnostic 94",
    seoParagraphs: [
      "Mode dégradé, turbo, filtre à carburant, sonde ou FAP : on mesure avant de remplacer. Objectif = retrouver la puissance sans pièces inutiles.",
      "Diagnostic perte de puissance à Ivry — rapport clair + devis réparation.",
    ],
    seoProblems: [
      { text: "Causes perte de puissance", url: "/blog/perte-puissance-soudaine-causes/" },
      { text: "Turbo", url: "/blog/turbo-compresseur-symptomes-panne/" },
      { text: "FAP encrassé", url: "/blog/fap-dpf-encrasse-trajets-ville/" },
    ],
  },
  vidangeRapideIvrySeo: {
    // Money « express » ≠ hub /vidange/ (service) ≠ /revision-voiture-ivry/ (carnet complet)
    seoTitle: "Vidange express à Ivry — huile & filtre le jour même",
    seoParagraphs: [
      "Créneau vidange rapide : huile homologuée, filtre neuf, contrôle des niveaux. Souvent le jour même sur rendez-vous — sans remplacer une révision complète au carnet.",
      "Si d'autres points d'usure apparaissent, on vous oriente vers révision ou pré-CT — atelier Ivry-sur-Seine.",
    ],
    seoProblems: [
      { text: "Hub vidange Ivry", url: "/vidange/" },
      { text: "Prix vidange", url: "/blog/combien-coute-vidange-voiture/" },
      { text: "Révision constructeur", url: "/revision-voiture-ivry/" },
      { text: "Exemple prix vidange", url: "/exemples/prix-vidange-moteur/" },
    ],
  },
  reparationParisSudSeo: {
    seoTitle: "Réparation auto Paris sud — atelier à Ivry",
    seoParagraphs: [
      "Depuis Paris 13, 14, 15 ou le sud de la capitale : atelier accessible pour mécanique, freinage, diagnostic et entretien. Même exigence qu'en centre-ville, sans la galère logistique.",
      "Devis gratuit, créneaux lun–sam — 9 rue Michelet, Ivry-sur-Seine.",
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
