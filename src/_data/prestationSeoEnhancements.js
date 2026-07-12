/**
 * Symptômes, problèmes SEO et paragraphes enrichis par prestation / hub.
 * Fusionnés dans prestations.js (buildLp) et landingPages.js.
 */
module.exports = {
  symptoms: {
    "revision-entretien": [
      "Voyant entretien ou révision due",
      "Huile moteur noire ou niveau bas",
      "Filtres encrassés",
      "Préparation contrôle technique",
    ],
    "vidange-moteur": [
      "Huile moteur noire ou odeur brûlé",
      "Voyant pression huile",
      "Moteur bruyant au démarrage",
      "Kilométrage entretien dépassé",
    ],
    "pre-controle-technique": [
      "Contrôle technique refusé",
      "Voyant moteur avant le CT",
      "Freins ou éclairage défaillants",
      "Fuite ou niveaux bas signalés",
    ],
    "recherche-de-panne": [
      "Voiture ne démarre plus",
      "Perte de puissance soudaine",
      "Bruit moteur anormal",
      "Voyant moteur ou ABS allumé",
      "Turbo ou vanne EGR suspectée",
    ],
    "distribution-injection": [
      "Bruit de claquement moteur",
      "Courroie distribution usée",
      "Calage distribution à prévoir",
      "Injecteurs encrassés ou défaillants",
      "Fumée noire à l'échappement",
    ],
    "diagnostic-voyant-moteur": [
      "Voyant moteur orange ou rouge",
      "Mode dégradé activé",
      "Consommation anormale",
      "Ratés à l'accélération",
      "Codes défaut turbo / EGR / FAP",
    ],
    "decalaminage-moteur": [
      "Perte de puissance progressive",
      "Fumée à l'échappement",
      "Moteur qui broute",
      "Surconsommation en ville",
      "Vanne EGR ou FAP encrassés",
    ],
    amortisseurs: [
      "Sauts sur dos-d'âne",
      "Tenue de route floue",
      "Bruits de suspension",
      "Usure pneus irrégulière",
    ],
    "coupelles-triangles": [
      "Claquement en négociation",
      "Jeu dans la direction",
      "Usure pneu intérieur",
      "Direction imprécise",
    ],
    geometrie: [
      "Volant qui tire à gauche ou droite",
      "Usure pneus en bordure",
      "Direction qui vibre",
      "Après choc ou trottoir",
    ],
    "montage-equilibrage": [
      "Vibrations à haute vitesse",
      "Pneu crevé ou hernie",
      "Changement saison été/hiver",
      "Usure rapide des pneus",
    ],
    "permutation-pneus": [
      "Usure différente avant/arrière",
      "Passage été/hiver",
      "Pneus qui sifflent en courbe",
    ],
    "reparation-crevaison": [
      "Pneu qui se dégonfle lentement",
      "Clou ou vis dans le pneu",
      "Pression basse récurrente",
    ],
    "test-batterie": [
      "Démarrage difficile à froid",
      "Clic au contact sans démarrage",
      "Éclairage faible",
      "Voyant batterie allumé",
    ],
    "remplacement-batterie": [
      "Voiture ne démarre plus",
      "Batterie Start-Stop faible",
      "Démarrage lent après immobilisation",
    ],
    "controle-alternateur": [
      "Batterie qui se décharge en roulant",
      "Voyant batterie au tableau de bord",
      "Phares qui faiblissent",
    ],
    "plaquettes-disques": [
      "Grincement au freinage",
      "Pédale molle ou spongieuse",
      "Vibrations au freinage",
      "Distance d'arrêt allongée",
    ],
    "purge-liquide-frein": [
      "Pédale spongieuse",
      "Liquide de frein foncé",
      "Freinage moins efficace",
    ],
    "diagnostic-abs": [
      "Voyant ABS ou ESP allumé",
      "Freinage qui pulse anormalement",
      "ABS actif sur route sèche",
    ],
    embrayage: [
      "Embrayage qui patine",
      "Pédale d'embrayage haute",
      "Grincement à la pédale",
      "Difficulté à passer les vitesses",
    ],
    cardans: [
      "Claquement en braquant",
      "Vibration à l'accélération",
      "Soufflet cardan fendu",
    ],
    "vidange-boite": [
      "Passages de vitesses difficiles",
      "Boîte automatique qui patine",
      "Bruits en rétrogradant",
      "À-coups en conduite",
    ],
    "recharge-clim": [
      "Clim qui ne refroidit plus",
      "Air tiède malgré le froid max",
      "Odeur dans l'habitacle",
      "Clim faible en été",
    ],
    "desinfection-circuit-clim": [
      "Odeur moisi à la clim",
      "Allergies ou air vicié",
      "Après longue période sans clim",
    ],
    "controle-compresseur": [
      "Compresseur clim silencieux",
      "Clim coupée automatiquement",
      "Bruit compresseur au démarrage",
    ],
    debosselage: [
      "Enfoncement portière ou aile",
      "Impact parking sans peinture arrachée",
      "Bosses de grêle",
    ],
    "peinture-localisee": [
      "Rayure profonde visible",
      "Éclat de peinture",
      "Rouille superficielle",
    ],
    "pare-brise-vitrage": [
      "Impact pare-brise",
      "Fissure qui progresse",
      "Bris de glace ou vitre cassée",
    ],
    "retouches-finitions": [
      "Micro-rayures carrosserie",
      "Peinture ternie ou oxydée",
      "Traces de frottement",
    ],
  },

  seoProblems: {
    "recherche-de-panne": [
      { text: "Turbo ou compresseur en panne", url: "/blog/turbo-compresseur-symptomes-panne/" },
      { text: "Vanne EGR encrassée", url: "/blog/vanne-egr-encrassee-symptomes/" },
      { text: "FAP / DPF saturé", url: "/blog/fap-dpf-encrasse-trajets-ville/" },
      { text: "Voyant moteur allumé", url: "/blog/voyant-moteur-allume-que-faire/" },
      { text: "Voiture qui broute à l'accélération", url: "/blog/voiture-broute-acceleration-causes-94/" },
      { text: "Perte de puissance moteur", url: "/mecanique/" },
    ],
    "diagnostic-voyant-moteur": [
      { text: "Codes défaut turbo", url: "/blog/turbo-compresseur-symptomes-panne/" },
      { text: "Défaut vanne EGR", url: "/blog/vanne-egr-encrassee-symptomes/" },
      { text: "Encrassement FAP / DPF", url: "/blog/fap-dpf-encrasse-trajets-ville/" },
      { text: "Catalyseur bouche", url: "/blog/catalyseur-bouche-symptomes-causes/" },
      { text: "Sonde lambda ou injection", url: "/prestations/distribution-injection/" },
    ],
    "decalaminage-moteur": [
      { text: "Vanne EGR encrassée (trajets urbains)", url: "/blog/vanne-egr-encrassee-symptomes/" },
      { text: "FAP saturé en conduite ville", url: "/blog/fap-dpf-encrasse-trajets-ville/" },
      { text: "Turbo encrassé ou grippé", url: "/blog/turbo-compresseur-symptomes-panne/" },
      { text: "Surconsommation et fumée noire", url: "/blog/voiture-broute-acceleration-causes-94/" },
    ],
    "distribution-injection": [
      { text: "Courroie distribution à changer", url: "/blog/courroie-distribution-quand-changer-94/" },
      { text: "Courroie accessoires usée", url: "/blog/courroie-accessoires-symptomes-usure/" },
      { text: "Injecteurs encrassés", url: "/prestations/distribution-injection/" },
      { text: "Perte de puissance moteur", url: "/mecanique/" },
    ],
    embrayage: [
      { text: "Embrayage qui patine en côte", url: "/blog/embrayage-qui-patine-causes/" },
      { text: "Pédale d'embrayage dure ou haute", url: "/prestations/embrayage/" },
      { text: "Bruits à la débrayage", url: "/prestations/embrayage/" },
    ],
    "revision-entretien": [
      { text: "Filtre habitacle / pollen", url: "/blog/filtre-habitacle-pollen-quand-changer/" },
      { text: "Liquide de refroidissement", url: "/blog/liquide-refroidissement-quand-verifier/" },
      { text: "Bougies d'allumage", url: "/blog/bougies-allumage-quand-changer/" },
      { text: "Préparation contrôle technique", url: "/blog/5-points-controle-avant-ct-ivry/" },
    ],
    "vidange-moteur": [
      { text: "Huile moteur usée ou noire", url: "/blog/combien-coute-vidange-voiture/" },
      { text: "Filtre à huile encrassé", url: "/prestations/vidange-moteur/" },
      { text: "Consommation d'huile anormale", url: "/prestations/recherche-de-panne/" },
    ],
    "plaquettes-disques": [
      { text: "Plaquettes usées ou bruyantes", url: "/blog/plaquettes-frein-usure-signaux-a-ne-pas-ignorer/" },
      { text: "Disques voilés ou rayés", url: "/blog/disques-frein-voiles-usure-signes/" },
      { text: "Pédale de frein molle", url: "/blog/freinage-mou-pedale-spongieuse/" },
    ],
    "diagnostic-abs": [
      { text: "Voyant ABS allumé", url: "/blog/voyant-abs-allume-causes-conduite/" },
      { text: "Capteur ABS ou roulement défaillant", url: "/prestations/diagnostic-abs/" },
    ],
    "recharge-clim": [
      { text: "Clim ne refroidit plus", url: "/blog/climatisation-voiture-recharge-ivry/" },
      { text: "Fuite de gaz climatisation", url: "/prestations/controle-compresseur/" },
      { text: "Odeur moisi au démarrage clim", url: "/prestations/desinfection-circuit-clim/" },
    ],
    "remplacement-batterie": [
      { text: "Batterie Start-Stop faible", url: "/blog/batterie-start-stop-usure-prematuree/" },
      { text: "Quand changer la batterie", url: "/blog/batterie-voiture-quand-changer/" },
    ],
    "vidange-boite": [
      { text: "Vidange boîte automatique", url: "/blog/vidange-boite-automatique-quand-faire/" },
      { text: "Passages de vitesses difficiles", url: "/prestations/vidange-boite/" },
    ],
    amortisseurs: [
      { text: "Amortisseurs usés", url: "/blog/amortisseurs-usures-symptomes/" },
      { text: "Géométrie à refaire après choc", url: "/prestations/geometrie/" },
    ],
    geometrie: [
      { text: "Mauvais alignement des roues", url: "/blog/geometrie-roues-signes-mauvais-alignement/" },
      { text: "Volant qui tremble en autoroute", url: "/prestations/geometrie/" },
    ],
    "montage-equilibrage": [
      { text: "Usure pneus anormale", url: "/blog/quand-changer-pneus-usure-securite/" },
      { text: "Pneus été / hiver : quand changer", url: "/blog/pneus-ete-quand-passer-hiver-ile-de-france/" },
    ],
  },

  extraSeoParagraphs: {
    "recherche-de-panne": [
      "Nous investigons les pannes mécaniques et électroniques les plus courantes en diesel et essence : turbo, vanne EGR, FAP, injecteurs, allumage, capteurs et fuites. Diagnostic en atelier à Ivry-sur-Seine (94) avant tout devis.",
    ],
    "diagnostic-voyant-moteur": [
      "Le voyant moteur peut signaler un défaut turbo, une vanne EGR, un FAP colmaté, une sonde ou un problème d'injection. Lecture OBD, contrôle mécanique et explication claire avant réparation.",
    ],
    "decalaminage-moteur": [
      "Le décalaminage complète souvent un entretien ciblé lorsque la vanne EGR, le turbo ou le FAP sont encrassés par des trajets urbains répétés.",
    ],
    "distribution-injection": [
      "Une courroie de distribution fatiguée ou des injecteurs défaillants peuvent provoquer bruit moteur, fumée, surconsommation ou calage — contrôle recommandé avant casse.",
    ],
    embrayage: [
      "Un embrayage usé patine en charge, use prématurément le volant moteur et fatigue la boîte — diagnostic avant remplacement du kit.",
    ],
    "revision-entretien": [
      "Entretien préventif : filtres, bougies, courroie accessoires, liquides et contrôle des points liés au turbo, à l'EGR et au FAP selon le kilométrage et l'usage.",
    ],
  },

  extraFaqs: {
    "recherche-de-panne": [
      {
        question: "Diagnostiquez-vous turbo, vanne EGR et FAP ?",
        answer:
          "Oui — recherche de panne mécanique et électronique en atelier, avec devis détaillé avant démontage ou remplacement.",
      },
    ],
    "diagnostic-voyant-moteur": [
      {
        question: "Le voyant moteur peut-il venir du turbo ou de l'EGR ?",
        answer:
          "Oui, c'est fréquent sur diesel. Nous lisons les codes défaut et vérifions les organes concernés avant de chiffrer la réparation.",
      },
    ],
    "decalaminage-moteur": [
      {
        question: "Le décalaminage suffit-il si le FAP est saturé ?",
        answer:
          "Pas toujours — selon le niveau d'encrassement, une régénération, un nettoyage ou le remplacement du FAP peut être nécessaire après diagnostic.",
      },
    ],
  },

  /** Enrichissement des hubs landingPages (lpKey) */
  hubs: {
    mecanique: {
      symptoms: [
        "Turbo ou compresseur bruyant",
        "Vanne EGR encrassée",
        "FAP / DPF colmaté",
        "Perte de puissance",
        "Embrayage qui patine",
        "Courroie distribution",
        "Voyant moteur allumé",
        "Surconsommation carburant",
      ],
      seoProblems: [
        { text: "Turbo en panne — sifflement ou fumée bleue", url: "/blog/turbo-compresseur-symptomes-panne/" },
        { text: "Vanne EGR encrassée", url: "/blog/vanne-egr-encrassee-symptomes/" },
        { text: "FAP saturé (trajets ville)", url: "/blog/fap-dpf-encrasse-trajets-ville/" },
        { text: "Courroie de distribution", url: "/blog/courroie-distribution-quand-changer-94/" },
        { text: "Embrayage qui patine", url: "/blog/embrayage-qui-patine-causes/" },
        { text: "Voiture qui broute", url: "/blog/voiture-broute-acceleration-causes-94/" },
        { text: "Voyant moteur", url: "/blog/voyant-moteur-allume-que-faire/" },
        { text: "Catalyseur bouche", url: "/blog/catalyseur-bouche-symptomes-causes/" },
      ],
      extraSeoParagraphs: [
        "Atelier mécanique multimarque à Ivry-sur-Seine : nous traitons turbo, vanne EGR, FAP, injecteurs, distribution, embrayage, boîte automatique, suspension et recherche de panne — toujours avec devis écrit avant travaux.",
      ],
      extraFaqs: [
        {
          question: "Intervenez-vous sur turbo, EGR et FAP ?",
          answer:
            "Oui — diagnostic complet en atelier, identification de la cause (encrassement, fuite, capteur, usure) et devis avant réparation.",
        },
      ],
    },
    diagnostic: {
      symptoms: [
        "Voyant moteur orange ou rouge",
        "Voiture en mode dégradé",
        "Perte de puissance",
        "Codes défaut turbo / EGR",
        "Ratés ou à-coups",
        "Voiture qui ne démarre plus",
      ],
      seoProblems: [
        { text: "Voyant moteur allumé", url: "/blog/voyant-moteur-allume-que-faire/" },
        { text: "Diagnostic turbo", url: "/blog/turbo-compresseur-symptomes-panne/" },
        { text: "Défaut vanne EGR", url: "/blog/vanne-egr-encrassee-symptomes/" },
        { text: "Problème FAP / DPF", url: "/blog/fap-dpf-encrasse-trajets-ville/" },
        { text: "Voyant ABS", url: "/blog/voyant-abs-allume-causes-conduite/" },
        { text: "Prix diagnostic auto 94", url: "/blog/prix-diagnostic-auto-94/" },
      ],
      extraSeoParagraphs: [
        "Diagnostic valise multimarques + contrôle mécanique : nous identifions les causes fréquentes (turbo, EGR, FAP, injecteurs, allumage, capteurs) et vous remettons un devis clair avant toute réparation.",
      ],
    },
    freinage: {
      seoProblems: [
        { text: "Plaquettes usées", url: "/blog/plaquettes-frein-usure-signaux-a-ne-pas-ignorer/" },
        { text: "Disques voilés", url: "/blog/disques-frein-voiles-usure-signes/" },
        { text: "Pédale molle", url: "/blog/freinage-mou-pedale-spongieuse/" },
        { text: "Voyant ABS", url: "/blog/voyant-abs-allume-causes-conduite/" },
      ],
    },
    revision: {
      symptoms: [
        "Vidange ou révision à échéance",
        "Voyant entretien ou huile",
        "Climatisation faible",
        "Filtres à remplacer",
        "Préparation contrôle technique",
      ],
      seoProblems: [
        { text: "Révision 60 000 km", url: "/blog/revision-60000-km-checklist/" },
        { text: "Vidange moteur", url: "/blog/combien-coute-vidange-voiture/" },
        { text: "Filtre habitacle", url: "/blog/filtre-habitacle-pollen-quand-changer/" },
        { text: "Contrôle avant CT", url: "/blog/5-points-controle-avant-ct-ivry/" },
        { text: "Recharge climatisation", url: "/blog/climatisation-voiture-recharge-ivry/" },
      ],
    },
    pneumatiques: {
      symptoms: [
        "Usure irrégulière des pneus",
        "Volant qui tire",
        "Vibrations à haute vitesse",
        "Pneus été / hiver à monter",
      ],
      seoProblems: [
        { text: "Usure pneus anormale", url: "/blog/quand-changer-pneus-usure-securite/" },
        { text: "Géométrie / parallélisme", url: "/blog/geometrie-roues-signes-mauvais-alignement/" },
        { text: "Pneus été / hiver", url: "/blog/pneus-ete-quand-passer-hiver-ile-de-france/" },
      ],
    },
    carrosserie: {
      symptoms: [
        "Rayure ou enfoncement",
        "Peinture écaillée",
        "Impact pare-brise",
        "Dégâts après accrochage",
      ],
      seoProblems: [
        { text: "Rayure carrosserie", url: "/blog/rayure-carrosserie-quand-reparer/" },
        { text: "Après un accident", url: "/blog/que-faire-apres-accident-carrosserie/" },
      ],
    },
    vidange: {
      symptoms: [
        "Vidange prévue au carnet",
        "Huile sombre ou consommation",
        "Voyant entretien",
        "Moteur bruyant au démarrage",
      ],
      seoProblems: [
        { text: "Combien coûte une vidange", url: "/blog/combien-coute-vidange-voiture/" },
      ],
    },
    "pare-brise": {
      symptoms: [
        "Impact ou éclat sur le pare-brise",
        "Fissure qui progresse",
        "Vitre latérale cassée",
        "Buée ou infiltration d'eau",
      ],
    },
  },
};
