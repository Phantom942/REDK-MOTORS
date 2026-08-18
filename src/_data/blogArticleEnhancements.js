/** Données SEO centralisées par slug d'article (permalink /blog/{slug}/). */
module.exports = {
  "voyant-moteur-allume-que-faire": {
    directAnswer: {
      question: "Que faire quand le voyant moteur s'allume ?",
      answer:
        "Voyant orange fixe sans symptôme : roulez prudemment et prenez rendez-vous sous 48 h. Voyant clignotant ou voyant rouge (huile, température, frein) : arrêtez-vous et faites diagnostiquer le véhicule avant de reprendre la route.",
      facts: [
        { label: "Diagnostic valise", value: "50–100 € (devis avant travaux)" },
        { label: "Garage", value: "RED-K MOTORS · Ivry-sur-Seine (94)" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic auto" },
      { url: "/mecanique/", label: "Mécanique & réparations" },
      { url: "/contact/", label: "Prendre rendez-vous" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler avec le voyant moteur allumé ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si le voyant est orange et fixe, sans perte de puissance ni bruit, vous pouvez rouler prudemment sur de courtes distances. En cas de clignotement ou de voyant rouge, arrêtez-vous.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte un diagnostic voyant moteur ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Comptez en général 50 à 100 € pour un diagnostic électronique à la valise, devis écrit avant toute réparation chez RED-K MOTORS à Ivry-sur-Seine.",
          },
        },
        {
          "@type": "Question",
          name: "Quelles sont les causes les plus fréquentes ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sonde lambda, bougies usées, vanne EGR encrassée ou filtre à particules saturé sont parmi les causes les plus courantes sur les véhicules du quotidien.",
          },
        },
      ],
    },
  },
  "combien-coute-vidange-voiture": {
    directAnswer: {
      question: "Combien coûte une vidange voiture en 2026 ?",
      answer:
        "Pour une citadine ou berline courante, comptez environ 80 à 180 € (huile adaptée + filtre + main-d'œuvre). Le devis exact dépend du moteur, du volume d'huile et de la norme constructeur.",
      facts: [
        { label: "Fourchette indicative", value: "80–180 €" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/vidange/", label: "Prestation vidange" },
      { url: "/exemples/prix-vidange-moteur/", label: "Guide prix vidange" },
      { url: "/tarifs/", label: "Grille tarifaire" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Combien coûte une vidange chez un garage indépendant ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Un garage indépendant propose souvent une vidange entre 80 et 180 € pour un véhicule courant, huile et filtre inclus, selon le moteur.",
          },
        },
        {
          "@type": "Question",
          name: "À quelle fréquence faire une vidange ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En règle générale entre 10 000 et 30 000 km ou au moins une fois par an, selon le carnet d'entretien et votre usage (ville, autoroute).",
          },
        },
        {
          "@type": "Question",
          name: "Que comprend une vidange complète en 2026 ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Vidange huile moteur, remplacement filtre à huile, huile conforme constructeur, contrôle des niveaux et signalement des anomalies — devis écrit chez RED-K MOTORS à Ivry.",
          },
        },
      ],
    },
  },
  "prix-diagnostic-auto-94": {
    directAnswer: {
      question: "Quel est le prix d'un diagnostic auto dans le 94 ?",
      answer:
        "Un diagnostic électronique (valise OBD) coûte en général 50 à 100 € dans le Val-de-Marne. Le tarif varie selon la complexité, le temps d'analyse et les essais complémentaires.",
      facts: [
        { label: "Fourchette", value: "50–100 €" },
        { label: "Zone", value: "Ivry-sur-Seine et Val-de-Marne (94)" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic auto" },
      { url: "/tarifs/", label: "Tarifs garage" },
      { url: "/garage-ivry-sur-seine/", label: "Garage à Ivry" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Le diagnostic est-il remboursé si je fais réparer au garage ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le diagnostic peut être déduit de la facture de réparation si vous confiez les travaux à l'atelier — à préciser lors du devis.",
          },
        },
        {
          "@type": "Question",
          name: "Un code défaut suffit-il pour réparer ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non : le code indique une piste. Un mécanicien croise le défaut avec des mesures et des essais pour confirmer la cause réelle.",
          },
        },
      ],
    },
  },
  "plaquettes-frein-usure-signaux-a-ne-pas-ignorer": {
    directAnswer: {
      question: "Comment savoir si les plaquettes de frein sont usées ?",
      answer:
        "Grincement métallique, pédale molle, vibration au freinage ou distance allongée : ce sont les signaux d'alerte. Faites contrôler le freinage dès le premier bruit anormal.",
      facts: [
        { label: "Usure légale disque", value: "Épaisseur minimale constructeur" },
        { label: "Prestation", value: "Freinage · RED-K MOTORS Ivry" },
      ],
    },
    relatedLinks: [
      { url: "/freins/", label: "Freinage" },
      { url: "/pneumatiques/", label: "Pneus & freins" },
      { url: "/contact/", label: "Devis freinage" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on continuer à rouler avec des plaquettes usées ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non recommandé : l'usure accélère l'endommagement des disques et allonge la distance de freinage, avec un risque pour votre sécurité.",
          },
        },
      ],
    },
  },
  "quand-changer-pneus-usure-securite": {
    directAnswer: {
      question: "Quand faut-il changer ses pneus ?",
      answer:
        "Changez vos pneus dès que la profondeur de sculpture atteint 1,6 mm (limite légale), idéalement avant 3 mm pour la sécurité sur route mouillée. Remplacez aussi un pneu fissuré, hernie ou vieux de plus de 10 ans.",
      facts: [
        { label: "Limite légale", value: "1,6 mm de sculpture" },
        { label: "Conseil sécurité", value: "Changer avant 3 mm" },
      ],
    },
    relatedLinks: [
      { url: "/pneumatiques/", label: "Pneus & géométrie" },
      { url: "/freins/", label: "Freinage" },
      { url: "/contact/", label: "Montage pneus" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Comment mesurer l'usure des pneus ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Utilisez un témoin d'usure intégré au pneu ou une jauge de profondeur. Des sculptures irrégulières peuvent aussi indiquer un problème de géométrie.",
          },
        },
      ],
    },
  },
  "batterie-voiture-quand-changer": {
    directAnswer: {
      question: "Quand changer la batterie de voiture ?",
      answer:
        "Une batterie dure en moyenne 4 à 6 ans. Remplacez-la si le démarrage devient lent, si les feux faiblissent à l'arrêt ou après un contrôle montrant une capacité insuffisante.",
      facts: [
        { label: "Durée de vie moyenne", value: "4–6 ans" },
        { label: "Prestation", value: "Changement batterie · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Changement batterie" },
      { url: "/exemples/prix-batterie/", label: "Guide prix batterie" },
      { url: "/tarifs/", label: "Grille tarifaire" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pourquoi la batterie lâche-t-elle en hiver ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le froid réduit la capacité chimique de la batterie et le démarrage demande plus d'énergie. Une batterie déjà faible cède en premier.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte le changement de batterie à Ivry ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Comptez environ 120 à 280 € TTC (batterie + pose) sur une citadine, plus pour AGM/EFB Start-Stop. Devis gratuit avant remplacement.",
          },
        },
        {
          "@type": "Question",
          name: "Batterie ou alternateur : comment trancher ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Voyant batterie en roulant = plutôt alternateur. Démarrage qui peine à l'arrêt = plutôt batterie. Test de charge en atelier tranche en quelques minutes.",
          },
        },
      ],
    },
  },
  "garage-independant-vs-concessionnaire": {
    directAnswer: {
      question: "Garage indépendant ou concessionnaire : que choisir ?",
      answer: "Concession : expertise marque, rappels officiels. Indépendant : tarifs −20 à 40 %, multimarque, délais courts — garantie constructeur conservée si entretien conforme au carnet.",
      facts: [
        {
          label: "RED-K MOTORS",
          value: "Indépendant multimarque · Ivry",
        },
        {
          label: "Devis",
          value: "Gratuit avant travaux",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/garage-ivry-sur-seine/",
        label: "Garage à Ivry",
      },
      {
        url: "/blog/revision-garage-independant-garantie-constructeur/",
        label: "Garantie & indépendant",
      },
      {
        url: "/tarifs/",
        label: "Tarifs",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Un garage indépendant peut-il respecter le carnet d'entretien ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : pièces et fluides conformes, facture détaillée et tampon carnet. La garantie constructeur reste valide.",
          },
        },
        {
          "@type": "Question",
          name: "Les pièces équivalentes sont-elles fiables ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui si marques reconnues (Bosch, Valeo, Mann…) : mêmes équipementiers que l'origine, emballage différent.",
          },
        },
        {
          "@type": "Question",
          name: "Quand passer par la concession ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Rappels constructeur, mises à jour logicielles très spécifiques, ou véhicule encore sous extension garantie marque exigeante.",
          },
        },
      ],
    },
  },
  "controle-technique-2026-nouveautes": {
    directAnswer: {
      question: "Quelle est la liste des points de contrôle technique 2026 ?",
      answer:
        "Pollution/échappement (FAP), OBD/voyants, bruit, freinage, pneus, éclairage, direction/liaisons au sol et visibilité (pare-brise). Un pré-contrôle atelier limite les contre-visites.",
      facts: [
        { label: "Priorité diesel", value: "FAP + opacité + OBD" },
        { label: "Préparation", value: "Pré-CT 1–2 semaines avant" },
        { label: "Garage", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/prestations/pre-controle-technique/", label: "Pré-contrôle technique" },
      { url: "/blog/5-points-controle-avant-ct-ivry/", label: "5 checks avant le CT" },
      { url: "/blog/suppression-fap-controle-technique-2026/", label: "FAP et CT 2026" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Faut-il préparer sa voiture avant le contrôle technique ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : feux, pneus, freins, niveaux, voyants, échappement/FAP. Un pré-contrôle en atelier 1 à 2 semaines avant réduit le risque de contre-visite.",
          },
        },
        {
          "@type": "Question",
          name: "Un FAP retiré passe-t-il le CT 2026 ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non en principe : opacité, OBD et contrôle visuel font refuser un FAP supprimé ou modifié. Remise en conformité obligatoire.",
          },
        },
        {
          "@type": "Question",
          name: "Le bruit d'échappement est-il contrôlé en 2026 ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : mesure au ralenti et à l'accélération. Ligne modifiée ou silencieux percé entraînent souvent un refus.",
          },
        },
      ],
    },
  },
  "5-points-controle-avant-ct-ivry": {
    directAnswer: {
      question: "Que vérifier avant le contrôle technique à Ivry ?",
      answer:
        "Vérifiez en priorité les feux, le freinage (pédale, grincements, tirage), les pneus (≥ 1,6 mm, flancs intacts), les niveaux sans fuite visible et l'échappement (pas de voyant moteur ni fumée anormale). Ces cinq points couvrent la majorité des contre-visites.",
      facts: [
        { label: "Délai idéal", value: "Pré-CT 1–2 semaines avant" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/prestations/pre-controle-technique/", label: "Pré-contrôle technique" },
      { url: "/blog/controle-technique-2026-nouveautes/", label: "Liste points CT 2026" },
      { url: "/freins/", label: "Freinage" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Combien coûte une contre-visite ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le tarif est fixé par le centre agréé. Corriger les défauts majeurs avant le premier passage reste en général moins cher qu'une contre-visite + immobilisation.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on préparer le CT soi-même ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui pour les feux, niveaux et pneus visibles. Le réglage phares, freinage au banc et lecture OBD demandent l'atelier — pré-contrôle recommandé 1 à 2 semaines avant.",
          },
        },
        {
          "@type": "Question",
          name: "Voyant moteur allumé : CT refusé ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent oui si un défaut antipollution est actif. Faites un diagnostic valise à Ivry avant le passage au centre agréé.",
          },
        },
      ],
    },
  },
  "entretien-voiture-eviter-pannes-ivry": {
    directAnswer: {
      question: "Comment éviter les pannes avec un entretien régulier ?",
      answer: "Respectez vidanges, filtres, courroie de distribution, batterie et freinage selon le carnet. Un entretien préventif coûte toujours moins qu'une casse moteur ou boîte.",
      facts: [
        {
          label: "Horaires",
          value: "Lun–sam 9h–19h",
        },
        {
          label: "Adresse",
          value: "9 rue Michelet, Ivry-sur-Seine",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/entretien/",
        label: "Entretien & révision",
      },
      {
        url: "/blog/revision-kilometrage-usage-urbain-94/",
        label: "Révision usage urbain",
      },
      {
        url: "/contact/",
        label: "Planifier un entretien",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Quel entretien faire chaque année ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Minimum : vidange ou contrôle huile, filtres selon intervalle, niveaux, freins, pneus, batterie et éclairage.",
          },
        },
        {
          "@type": "Question",
          name: "L'usage urbain raccourcit-il les intervalles ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : trajets courts, embrayages répétés, FAP diesel et Start & Stop sollicitent plus que l'autoroute.",
          },
        },
        {
          "@type": "Question",
          name: "Carnet perdu : par où commencer ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Un bilan complet en atelier (vidange, filtres, distribution, freins) repart sur de bonnes bases avec facture détaillée.",
          },
        },
      ],
    },
  },
  "preparer-voiture-hiver-conseils": {
    directAnswer: {
      question: "Comment préparer sa voiture pour l'hiver ?",
      answer:
        "Vérifiez la batterie, les pneus (hiver ou 4 saisons adaptés), l'antigel, l'éclairage et les essuie-glaces. Un bilan hivernal en atelier prend environ une heure.",
      facts: [
        { label: "Saison", value: "Bilan recommandé avant les premières gelées" },
        { label: "Zone", value: "Ivry-sur-Seine · Paris sud" },
      ],
    },
    relatedLinks: [
      { url: "/pneumatiques/", label: "Pneus hiver / 4 saisons" },
      { url: "/entretien/", label: "Entretien" },
      { url: "/contact/", label: "Bilan hivernal" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pneus hiver obligatoires en Île-de-France ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Consultez la réglementation en vigueur pour votre zone. Même sans obligation locale, des pneus adaptés améliorent fortement l'adhérence par temps froid.",
          },
        },
      ],
    },
  },
  "climatisation-voiture-recharge-ivry": {
    directAnswer: {
      question: "Quand recharger la climatisation de voiture ?",
      answer:
        "Rechargez quand l'air est moins froid, qu'il y a une odeur d'humidité ou tous les 2 à 4 ans. Une recharge professionnelle inclut test d'étanchéité et gaz adapté au véhicule.",
      facts: [
        { label: "Signes", value: "Air tiède · mauvaise odeur · baisse de performance" },
        { label: "Garage", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/entretien/", label: "Entretien" },
      { url: "/exemples/prix-recharge-climatisation/", label: "Guide prix clim" },
      { url: "/tarifs/", label: "Grille tarifaire" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Une recharge de clim suffit-elle toujours ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non : une fuite ou un compresseur fatigué peut imposer une réparation. Le test d'étanchéité évite de regonfler un circuit défaillant.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte une recharge clim à Ivry en 2026 ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Comptez environ 80 à 200 € pour une recharge seule sur circuit étanche, plus si recherche de fuite ou fluide R1234yf. Devis avant intervention.",
          },
        },
        {
          "@type": "Question",
          name: "À quelle fréquence recharger la climatisation ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pas de règle fixe : contrôle si baisse de performance ou tous les 2 à 4 ans sur véhicule vieillissant. Le circuit étanche ne demande pas de recharge régulière.",
          },
        },
      ],
    },
  },
  "rayure-carrosserie-quand-reparer": {
    directAnswer: {
      question: "Faut-il réparer une rayure sur la carrosserie ?",
      answer:
        "Rayure profonde jusqu'au métal ou bosse : réparez vite pour éviter la rouille. Rayure légère sur vernis : souvent esthétique, mais un polissage ou retouche localisée protège la peinture.",
      facts: [
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
        { label: "Devis", value: "Gratuit · lun–sam 9h–19h" },
      ],
    },
    relatedLinks: [
      { url: "/carrosserie/", label: "Carrosserie" },
      { url: "/blog/debosselage-sans-peinture-dsp/", label: "Débosselage sans peinture" },
      { url: "/contact/", label: "Devis carrosserie" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Une rayure peut-elle rouiller ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, dès que le métal est exposé à l'humidité et au sel, surtout en hiver. Traitez une rayure jusqu'au métal sous deux semaines.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il passer par l'assurance pour une rayure ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Comparez le devis à votre franchise. Si la réparation coûte moins que la franchise, payer de sa poche évite souvent un sinistre.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on réparer une bosse sans repeindre ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, si la peinture n'est pas fissurée : le débosselage sans peinture (DSP) repousse la tôle sans retouche.",
          },
        },
      ],
    },
  },
  "revision-constructeur-que-comprend-vraiment-service": {
    directAnswer: {
      question: "Que comprend une révision constructeur ?",
      answer:
        "Vidange, filtres prévus au plan, contrôles sécurité et électroniques selon le kilométrage. Le détail exact est dans le carnet d'entretien — deux révisions de même nom n'incluent pas forcément les mêmes opérations.",
      facts: [
        { label: "Alternative", value: "Révision multimarque en garage indépendant" },
        { label: "Devis", value: "Écrit avant intervention · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/entretien/", label: "Entretien & révision" },
      { url: "/blog/revision-60000-km-checklist/", label: "Checklist 60 000 km" },
      { url: "/tarifs/", label: "Tarifs" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Une révision en garage indépendant conserve-t-elle la garantie ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, si l'entretien respecte le plan constructeur (pièces conformes, carnet tamponné, facture détaillée).",
          },
        },
        {
          "@type": "Question",
          name: "Quelle différence entre vidange et révision ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La vidange remplace huile et filtre à huile. La révision ajoute filtres, contrôles et opérations prévues au kilométrage du carnet.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte une révision constructeur ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent 150 à 350 € hors distribution sur une compacte. Le devis dépend des filtres et opérations prévues à l'échéance.",
          },
        },
      ],
    },
  },
  "courroie-distribution-quand-changer-94": {
    directAnswer: {
      question: "Quand changer la courroie de distribution ?",
      answer: "Suivez l'intervalle constructeur (souvent 60 000 à 180 000 km ou 5 à 10 ans). Ne repoussez pas : une courroie qui casse peut détruire le moteur sur de nombreux modèles.",
      facts: [
        {
          label: "Risque rupture",
          value: "Cas moteur possible",
        },
        {
          label: "Fourchette kit",
          value: "550 – 1 500 € selon moteur",
        },
        {
          label: "Atelier",
          value: "RED-K MOTORS · Ivry (94)",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/mecanique/",
        label: "Mécanique & distribution",
      },
      {
        url: "/blog/prix-kit-distribution-94/",
        label: "Prix kit distribution",
      },
      {
        url: "/contact/",
        label: "Devis distribution",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Chaîne ou courroie : même entretien ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non : une chaîne se contrôle au bruit et à l'allongement. Une courroie se remplace par intervalle km et années.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il changer la pompe à eau en même temps ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sur de nombreux moteurs, oui : même courroie, évite une dépose double. Le devis précise le périmètre du kit.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on rouler avec une distribution en retard ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "C'est un pari : la rupture est soudaine et sans voyant. Mieux vaut anticiper, surtout à l'achat d'une occasion sans factures.",
          },
        },
      ],
    },
  },
  "fumee-blanche-echappement-que-faire": {
    directAnswer: {
      question: "Que signifie une fumée blanche à l'échappement ?",
      answer:
        "Légère fumée blanche au démarrage par froid : souvent normale (condensation). Fumée blanche persistante, odeur sucrée ou surchauffe : faites diagnostiquer (joint de culasse, injecteurs, etc.).",
      facts: [
        { label: "Urgence", value: "Arrêt si surchauffe ou fumée dense à chaud" },
        { label: "Diagnostic", value: "50–100 € · Ivry-sur-Seine" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic auto" },
      { url: "/blog/fumee-bleue-echappement-causes/", label: "Fumée bleue échappement" },
      { url: "/blog/joint-culasse-signes-symptomes/", label: "Joint de culasse" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Fumée blanche le matin : est-ce grave ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En général non si elle disparaît après quelques minutes par temps froid. Si elle reste dense à moteur chaud, consultez un garage.",
          },
        },
        {
          "@type": "Question",
          name: "Fumée blanche et joint de culasse : comment savoir ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Signes associés : liquide de refroidissement qui baisse, huile laiteuse sur la jauge, surchauffe. Un test compression ou CO₂ dans le LDR confirme.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on rouler avec une fumée blanche persistante ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Limitez les trajets et faites diagnostiquer rapidement. Avec surchauffe ou voyant température : arrêt et remorquage.",
          },
        },
      ],
    },
  },
  "voiture-broute-acceleration-causes-94": {
    directAnswer: {
      question: "Pourquoi ma voiture broute à l'accélération ?",
      answer:
        "Causes fréquentes : bougies ou bobines, injecteurs encrassés, filtre à air/colmaté, turbo ou embrayage usé. Un diagnostic permet d'éviter de remplacer les mauvaises pièces.",
      facts: [
        { label: "Première étape", value: "Lecture codes défaut + essai route" },
        { label: "Garage", value: "RED-K MOTORS · Ivry-sur-Seine (94)" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic" },
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/blog/voyant-moteur-allume-que-faire/", label: "Voyant moteur" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler avec une voiture qui broute ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sur de courtes distances oui, mais un broutage persistant peut endommager le catalyseur ou l'embrayage. Faites diagnostiquer rapidement.",
          },
        },
        {
          "@type": "Question",
          name: "Le broutage peut-il venir du carburant ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Un carburant de mauvaise qualité peut provoquer des ratés, mais on vérifie d'abord allumage, admission et injection.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte un diagnostic broutage ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Comptez 50 à 100 € pour un diagnostic valise + essai route à Ivry — devis réparation séparé.",
          },
        },
      ],
    },
  },
  "liquide-frein-quand-changer": {
    directAnswer: {
      question: "À quelle fréquence changer le liquide de frein ?",
      answer:
        "En général tous les 2 ans ou 40 000 à 60 000 km (le premier critère atteint). Le liquide absorbe l'humidité même véhicule à l'arrêt — un niveau correct ne garantit pas un fluide sain.",
      facts: [
        { label: "Norme", value: "DOT 3, DOT 4 ou DOT 5.1 selon constructeur" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/freins/", label: "Freinage" },
      { url: "/entretien/", label: "Entretien" },
      { url: "/tarifs/", label: "Tarifs" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pourquoi purger le liquide de frein tous les 2 ans ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le liquide de frein est hygroscopique : il absorbe l'humidité, ce qui abaisse son point d'ébullition et peut provoquer une pédale spongieuse sous forte sollicitation.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on mélanger DOT 3 et DOT 4 ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "DOT 3 et DOT 4 (glycol) sont en général compatibles, mais respectez toujours la spécification du réservoir et du carnet d'entretien. Ne mélangez jamais avec du DOT 5 silicone.",
          },
        },
      ],
    },
  },
  "geometrie-roues-signes-mauvais-alignement": {
    directAnswer: {
      question: "Comment savoir si la géométrie est mauvaise ?",
      answer: "Voiture qui tire sur un côté, volant de travers à plat, pneus usés de façon irrégulière ou vibrations : faites contrôler parallélisme et géométrie, surtout après un choc.",
      facts: [
        {
          label: "Usure légale pneu",
          value: "1,6 mm minimum",
        },
        {
          label: "Prestation",
          value: "Géométrie · Ivry (94)",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/pneumatiques/",
        label: "Pneus & géométrie",
      },
      {
        url: "/blog/prix-geometrie-parallelisme-94/",
        label: "Prix géométrie 94",
      },
      {
        url: "/contact/",
        label: "Contrôle géométrie",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "À quelle fréquence faire la géométrie ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "À chaque changement de pneus, après choc à une roue, ou dès usure asymétrique — contrôle annuel prudent en usage urbain.",
          },
        },
        {
          "@type": "Question",
          name: "Parallélisme ou géométrie complète ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Parallélisme = réglage rapide des angles. Géométrie complète mesure carrossage, chasse et parallélisme sur banc.",
          },
        },
        {
          "@type": "Question",
          name: "Changer les pneus sans géométrie : risque ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si usure régulière et trajectoire droite, parfois non. Usure asymétrique ou volant de travers : géométrie obligatoire avant.",
          },
        },
      ],
    },
  },
  "amortisseurs-usures-symptomes": {
    directAnswer: {
      question: "Quels sont les signes d'usure d'un amortisseur voiture ?",
      answer:
        "Rebonds après un dos d'âne, plongée au freinage, claquements sur bosses, voiture qui flotte en virage, pneus usés en vagues, fuite d'huile sur l'amortisseur, ESP/ABS qui interviennent plus tôt.",
      facts: [
        { label: "Test maison", value: "1 rebond OK · 2+ = à contrôler" },
        { label: "Règle atelier", value: "Remplacement par paire (essieu)" },
        { label: "Garage", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/prestations/amortisseurs/", label: "Prestation amortisseurs" },
      { url: "/prestations/geometrie/", label: "Géométrie" },
      { url: "/contact/", label: "Diagnostic suspension" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Faut-il changer les amortisseurs par paire ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : au minimum les deux du même essieu (avant ou arrière) pour un comportement équilibré et une usure régulière des pneus.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il faire la géométrie après changement d'amortisseurs ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent oui sur le train avant, surtout si les pneus montraient déjà une usure irrégulière. Le devis le précise après contrôle.",
          },
        },
        {
          "@type": "Question",
          name: "Amortisseurs usés : danger au freinage ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : distance de freinage allongée et tenue de route dégradée, surtout sous la pluie. Un contrôle suspension est recommandé dès les premiers rebonds.",
          },
        },
      ],
    },
  },
  "filtre-habitacle-pollen-quand-changer": {
    directAnswer: {
      question: "Quand changer le filtre d'habitacle ?",
      answer: "En général tous les 15 000 à 30 000 km ou une fois par an. Un filtre encrassé réduit le débit clim/chauffage et laisse passer pollens et odeurs.",
      facts: [
        {
          label: "Signes",
          value: "Odeur moisi · air faible · buée lente",
        },
        {
          label: "Atelier",
          value: "Entretien clim · Ivry (94)",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/entretien/",
        label: "Entretien",
      },
      {
        url: "/blog/clim-odeur-moisi-que-faire/",
        label: "Clim odeur moisi",
      },
      {
        url: "/blog/climatisation-voiture-recharge-ivry/",
        label: "Recharge clim Ivry",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Filtre pollen et filtre habitacle : même chose ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : filtre qui nettoie l'air entrant. Versions charbon actif filtrent aussi mieux les odeurs.",
          },
        },
        {
          "@type": "Question",
          name: "Clim faible : filtre ou compresseur ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Commencez par le filtre : un élément colmaté réduit fortement le débit. Si le problème persiste, contrôle clim complet.",
          },
        },
        {
          "@type": "Question",
          name: "Changer le filtre aide-t-il contre les allergies ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : un filtre pollen neuf ou charbon actif retient bien mieux les allergènes qu'un filtre saturé depuis des années.",
          },
        },
      ],
    },
  },
  "embrayage-qui-patine-causes": {
    directAnswer: {
      question: "Pourquoi l'embrayage patine ?",
      answer: "Usure du disque, huile sur le volant, butée défaillante ou conduite agressive en côte : le moteur monte en régime sans que la voiture accélère proportionnellement.",
      facts: [
        {
          label: "Durée de vie",
          value: "120 000 – 180 000 km",
        },
        {
          label: "Atelier",
          value: "Mécanique · RED-K MOTORS",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/mecanique/",
        label: "Mécanique & réparations",
      },
      {
        url: "/blog/prix-changement-embrayage-94/",
        label: "Prix embrayage 94",
      },
      {
        url: "/contact/",
        label: "Devis embrayage",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler avec un embrayage qui patine ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sur courtes distances oui, mais chaque patinage use le disque et peut endommager le volant moteur. Planifiez la réparation.",
          },
        },
        {
          "@type": "Question",
          name: "Odeur de brûlé : embrayage ou freins ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les deux peuvent sentir le brûlé. Si l'odeur vient en accélération/côte, c'est l'embrayage. Au freinage, plutôt les freins.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il changer le volant moteur en même temps ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si le volant bi-masse est usé ou si le disque a patiné longtemps, oui. L'inspection avant devis évite les surprises.",
          },
        },
      ],
    },
  },
  "fap-dpf-encrasse-trajets-ville": {
    directAnswer: {
      question: "Pourquoi mon FAP s'encrasse en ville ?",
      answer: "Les trajets courts empêchent la régénération (passive ou active) de se terminer. Le filtre se colmate, le voyant moteur s'allume et la puissance baisse.",
      facts: [
        {
          label: "Conseil",
          value: "20–30 min à régime stable 1×/semaine",
        },
        {
          label: "Diagnostic",
          value: "Valise + colmatage · Ivry",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/diagnostic/",
        label: "Diagnostic diesel",
      },
      {
        url: "/blog/decalaminage-moteur-utile-ou-arnaque/",
        label: "Décalaminage moteur",
      },
      {
        url: "/blog/voyant-moteur-allume-que-faire/",
        label: "Voyant moteur",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on nettoyer un FAP sans le remplacer ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent oui si le colmatage est modéré : additif, régénération forcée ou nettoyage atelier. Au-delà d'un seuil, remplacement nécessaire.",
          },
        },
        {
          "@type": "Question",
          name: "Un trajet autoroute suffit-il à décolmater ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ça aide en prévention, mais un FAP déjà très chargé demande souvent une intervention atelier.",
          },
        },
        {
          "@type": "Question",
          name: "Voyant FAP et perte de puissance : urgence ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Roulez prudemment et consultez rapidement : continuer en mode dégradé peut endommager turbo et catalyseur.",
          },
        },
      ],
    },
  },
  "voyant-abs-allume-causes-conduite": {
    directAnswer: {
      question: "Que faire si le voyant ABS reste allumé ?",
      answer:
        "L'ABS est désactivé mais le freinage de base reste en principe actif. Évitez les freinages brusques, faites diagnostiquer la cause (capteur, fusible, liquide de frein, roulement).",
      facts: [
        { label: "Sécurité", value: "Freinage possible sans assistance ABS" },
        { label: "Diagnostic", value: "50–100 € · RED-K MOTORS Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/freins/", label: "Freinage" },
      { url: "/diagnostic/", label: "Diagnostic électronique" },
      { url: "/blog/voyant-moteur-allume-que-faire/", label: "Voyant moteur" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler avec le voyant ABS allumé ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui avec prudence : les freins fonctionnent sans antiblocage. Évitez sol glissant et freinages d'urgence.",
          },
        },
        {
          "@type": "Question",
          name: "Le voyant ABS et le voyant frein : même problème ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pas toujours. Le voyant frein peut signaler un niveau bas ; le voyant ABS concerne l'antiblocage. Un diagnostic valise identifie la cause.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte le remplacement d'un capteur ABS ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent 80 à 200 € pièce posée selon la roue et le modèle. Devis gratuit chez RED-K MOTORS à Ivry.",
          },
        },
      ],
    },
  },
  "revision-60000-km-checklist": {
    directAnswer: {
      question: "Que comprend une révision à 60 000 km ?",
      answer:
        "Vidange, filtres (huile, air, habitacle, carburant), contrôle freins, courroie distribution ou chaîne selon plan, liquides (frein, refroidissement) et points de sécurité. Le détail exact est dans le carnet constructeur.",
      facts: [
        { label: "Palier", value: "60 000 km — révision majeure fréquente" },
        { label: "Devis", value: "Gratuit · lun–sam 9h–19h · Ivry" },
      ],
    },
    relatedLinks: [
      { url: "/entretien/", label: "Entretien & révision" },
      { url: "/blog/revision-constructeur-que-comprend-vraiment-service/", label: "Révision constructeur" },
      { url: "/blog/courroie-distribution-quand-changer-94/", label: "Courroie distribution" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "60 000 km : faut-il changer la courroie de distribution ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Uniquement si l'intervalle constructeur le prévoit à ce kilométrage. Sur certains moteurs c'est 90 000 ou 120 000 km.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il changer les bougies à 60 000 km ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sur essence, souvent oui entre 60 000 et 100 000 km selon le type (iridium, platine). Vérifiez le carnet.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte une révision à 60 000 km ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Hors distribution : souvent 200 à 450 € sur compacte. Avec kit distribution : variable selon moteur — devis obligatoire.",
          },
        },
      ],
    },
  },
  "que-faire-apres-accident-carrosserie": {
    directAnswer: {
      question: "Que faire après un accrochage ou accident carrosserie ?",
      answer:
        "Sécurisez les lieux, constatez avec l'autre partie, photographiez les dégâts, déclarez à l'assurance sous 5 jours ouvrés, puis faites établir un devis carrosserie avant réparation.",
      facts: [
        { label: "Délai assurance", value: "5 jours ouvrés (déclaration sinistre)" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/carrosserie/", label: "Carrosserie & peinture" },
      { url: "/blog/rayure-carrosserie-quand-reparer/", label: "Rayure : quand réparer ?" },
      { url: "/contact/", label: "Devis carrosserie" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Faut-il passer par l'assurance pour une rayure légère ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pour un petit choc sans tiers ou sous la franchise, un devis atelier permet parfois de régler sans sinistre. Pour tout dégât avec tiers, le constat amiable et la déclaration restent obligatoires.",
          },
        },
      ],
    },
  },
  "freinage-mou-pedale-spongieuse": {
    directAnswer: {
      question: "Pourquoi la pédale de frein est molle ou spongieuse ?",
      answer: "Air dans le circuit, fuite, liquide usé, maître-cylindre fatigué ou disques voilés : la pédale manque de fermeté. Faites contrôler avant un long trajet.",
      facts: [
        {
          label: "Priorité",
          value: "Sécurité — diagnostic urgent",
        },
        {
          label: "Atelier",
          value: "9 rue Michelet · Ivry",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/freins/",
        label: "Freinage",
      },
      {
        url: "/blog/fuite-liquide-frein-reconnaitre/",
        label: "Fuite liquide frein",
      },
      {
        url: "/blog/liquide-frein-quand-changer/",
        label: "Liquide de frein",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pédale spongieuse : peut-on rouler ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non recommandé : le freinage peut devenir imprévisible. Faites remorquer si la pédale touche le plancher.",
          },
        },
        {
          "@type": "Question",
          name: "Une purge suffit-elle toujours ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si le liquide est usé ou s'il y a de l'air après une réparation, oui. Si le niveau baisse, cherchez la fuite d'abord.",
          },
        },
        {
          "@type": "Question",
          name: "À quelle fréquence purger le liquide de frein ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En général tous les 2 ans, car le liquide absorbe l'humidité et perd en efficacité sous forte sollicitation.",
          },
        },
      ],
    },
  },
  "bougies-allumage-quand-changer": {
    directAnswer: {
      question: "À quelle fréquence changer les bougies d'allumage ?",
      answer:
        "En général entre 30 000 et 60 000 km selon le moteur (essence, GPL). Des ratés au ralenti, une surconsommation ou un voyant moteur sont des signes d'usure : faites contrôler avant que le catalyseur ne souffre.",
      facts: [
        { label: "Intervalle courant", value: "30 000–60 000 km" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique & réparations" },
      { url: "/blog/voyant-moteur-allume-que-faire/", label: "Voyant moteur" },
      { url: "/entretien/", label: "Entretien véhicule" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler avec des bougies usées ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sur de courtes distances oui, mais l'allumage dégradé augmente la consommation, les ratés et peut endommager le catalyseur. Un remplacement préventif coûte moins qu'une réparation moteur.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte le remplacement des bougies ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Comptez environ 80 à 250 € selon le nombre de cylindres et l'accessibilité du moteur (4 cylindres en ligne vs V6). Devis gratuit chez RED-K MOTORS avant intervention.",
          },
        },
        {
          "@type": "Question",
          name: "Bougies iridium : faut-il attendre 120 000 km ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Suivez le carnet, mais en usage urbain (94) un contrôle visuel à chaque vidange est prudent. Ratés ou surconsommation = remplacement même avant l'échéance.",
          },
        },
      ],
    },
  },
  "courroie-accessoires-symptomes-usure": {
    directAnswer: {
      question: "Quels sont les symptômes d'une courroie d'accessoires usée ?",
      answer:
        "Grincement au démarrage ou à froid, courroie visible fissurée ou brillante, voyant batterie ou surchauffe : la courroie d'accessoires entraîne alternateur, pompe à eau et parfois la direction assistée.",
      facts: [
        { label: "Contrôle", value: "Visuel à chaque vidange" },
        { label: "Risque", value: "Rupture = surchauffe + batterie à plat" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/blog/courroie-distribution-quand-changer-94/", label: "Courroie de distribution" },
      { url: "/entretien/", label: "Entretien" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Courroie d'accessoires ou courroie de distribution : quelle différence ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La courroie d'accessoires entraîne l'alternateur et la pompe à eau (extérieur moteur). La courroie de distribution synchronise le moteur (intérieur) — sa rupture peut être catastrophique.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on rouler avec une courroie qui grince ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Un grincement signale une usure ou un mauvais tendeur. La courroie peut casser sans préavis : faites contrôler rapidement pour éviter une panne sur la route.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte le remplacement courroie accessoires ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent 150 à 350 € TTC (kit courroie + tendeur + galets) sur citadine/compacte. Variable selon motorisation et accessibilité — devis à Ivry.",
          },
        },
      ],
    },
  },
  "liquide-refroidissement-quand-verifier": {
    directAnswer: {
      question: "À quelle fréquence vérifier le liquide de refroidissement ?",
      answer:
        "Contrôle visuel du niveau au moins une fois par an et avant un long trajet. Remplacement du liquide en général tous les 2 à 5 ans selon le constructeur, ou si la couleur ou la concentration est anormale.",
      facts: [
        { label: "Contrôle niveau", value: "1×/an minimum" },
        { label: "Remplacement", value: "2–5 ans selon carnet" },
      ],
    },
    relatedLinks: [
      { url: "/entretien/", label: "Entretien" },
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/blog/fumee-blanche-echappement-que-faire/", label: "Fumée blanche échappement" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on compléter avec de l'eau du robinet ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En urgence et temporairement oui, mais le liquide de refroidissement contient des antigels et anticorrosion. Un mélange inadapté peut corroder le circuit — complétez avec le produit préconisé dès que possible.",
          },
        },
        {
          "@type": "Question",
          name: "Niveau bas de liquide de refroidissement : que faire ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Complétez à froid moteur, puis faites rechercher une fuite (durite, radiateur, pompe à eau). Une consommation régulière indique une fuite à corriger avant surchauffe.",
          },
        },
      ],
    },
  },
  "vanne-egr-encrassee-symptomes": {
    directAnswer: {
      question: "Quels symptômes indiquent une vanne EGR encrassée ?",
      answer:
        "Perte de puissance, ralenti instable, voyant moteur, fumée noire ou consommation accrue : la vanne EGR encrassée perturbe le mélange air-carburant, surtout en diesel et en usage urbain.",
      facts: [
        { label: "Usage à risque", value: "Trajets courts, ville" },
        { label: "Solution", value: "Nettoyage ou remplacement + diagnostic" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic auto" },
      { url: "/blog/fap-dpf-encrasse-trajets-ville/", label: "FAP encrassé" },
      { url: "/blog/voyant-moteur-allume-que-faire/", label: "Voyant moteur" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on nettoyer une vanne EGR soi-même ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Un nettoyage mécanique est possible sur certains modèles, mais le démontage peut être complexe et un mauvais remontage déclenche le voyant moteur. Un atelier dispose des outils et du recalibrage nécessaires.",
          },
        },
        {
          "@type": "Question",
          name: "Vanne EGR : nettoyage ou remplacement ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si l'encrassement est modéré, un nettoyage suffit souvent. Si la vanne est bloquée ou le moteur-stepper HS, le remplacement est préférable — le diagnostic valise la bonne décision.",
          },
        },
      ],
    },
  },
  "disques-frein-voiles-usure-signes": {
    directAnswer: {
      question: "Comment reconnaître un disque de frein voilé ?",
      answer: "Volant qui vibre au freinage, pédale qui pulse, bruits métalliques : signes typiques. Mesurez l'épaisseur : en dessous du minimum constructeur, remplacement obligatoire.",
      facts: [
        {
          label: "Durée de vie",
          value: "2–3 jeux de plaquettes",
        },
        {
          label: "Atelier",
          value: "Freinage · Ivry (94)",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/freins/",
        label: "Freinage",
      },
      {
        url: "/blog/plaquettes-frein-usure-signaux-a-ne-pas-ignorer/",
        label: "Plaquettes usées",
      },
      {
        url: "/blog/prix-changement-plaquettes-frein-94/",
        label: "Prix plaquettes 94",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rectifier un disque voilé ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Parfois si l'épaisseur restante le permet. Si trop fin ou fissuré, remplacement obligatoire par paire sur l'essieu.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il changer les plaquettes avec les disques ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : des plaquettes neuves sur disques neufs garantissent un freinage équilibré et évite une usure prématurée.",
          },
        },
        {
          "@type": "Question",
          name: "Vibration au freinage : disques ou géométrie ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Vibration au freinage seul oriente vers disques voilés. Volant de travers à plat = plutôt géométrie.",
          },
        },
      ],
    },
  },
  "batterie-start-stop-usure-prematuree": {
    directAnswer: {
      question: "Pourquoi la batterie s'use plus vite avec le Start-Stop ?",
      answer:
        "Le système Start-Stop sollicite fortement la batterie (AGM ou EFB). Trajets courts, climatisation au ralenti et charge insuffisante accélèrent l'usure : comptez souvent 3 à 5 ans au lieu de 5 à 7.",
      facts: [
        { label: "Type batterie", value: "AGM ou EFB obligatoire" },
        { label: "Durée indicative", value: "3–5 ans en usage urbain" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/blog/batterie-voiture-quand-changer/", label: "Batterie voiture" },
      { url: "/entretien/", label: "Entretien" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on mettre une batterie classique sur une voiture Start-Stop ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non recommandé : une batterie standard ne supporte pas les cycles de charge/décharge répétés. Le système Start-Stop peut se désactiver ou la batterie s'use en quelques mois.",
          },
        },
        {
          "@type": "Question",
          name: "Start-Stop désactivé : batterie en cause ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent oui. Le calculateur coupe le Start-Stop si la batterie est faible ou mal codée. Un test batterie/alternateur et parfois un codage après remplacement résolvent le problème.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il coder la batterie après remplacement Start-Stop ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sur de nombreux véhicules récents, oui : le BSI/calculateur doit enregistrer la nouvelle batterie pour gérer correctement la charge et le Start-Stop.",
          },
        },
      ],
    },
  },
  "pneus-ete-quand-passer-hiver-ile-de-france": {
    directAnswer: {
      question: "Quand passer aux pneus hiver en Île-de-France ?",
      answer:
        "Dès que les températures descendent régulièrement sous 7 °C, généralement entre novembre et mars. La loi Montagne ne s'applique pas au 94, mais les pneus hiver ou 4 saisons améliorent l'adhérence par temps froid et humide.",
      facts: [
        { label: "Seuil adhérence", value: "Sous 7 °C" },
        { label: "Période IDF", value: "Nov.–mars (selon météo)" },
      ],
    },
    relatedLinks: [
      { url: "/blog/quand-changer-pneus-usure-securite/", label: "Usure pneus" },
      { url: "/blog/preparer-voiture-hiver-conseils/", label: "Préparer sa voiture pour l'hiver" },
      { url: "/entretien/", label: "Entretien" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pneus 4 saisons ou pneus hiver en région parisienne ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les 4 saisons conviennent à un usage urbain modéré en IDF. Pour des trajets fréquents par temps froid ou sur routes humides, des pneus hiver restent plus performants sous 7 °C.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on garder des pneus été en hiver à Ivry-sur-Seine ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "C'est légal en plaine, mais l'adhérence baisse fortement par temps froid. En cas de gel ou de neige rare mais possible, le risque de perte de contrôle augmente.",
          },
        },
      ],
    },
  },
  "catalyseur-bouche-symptomes-causes": {
    directAnswer: {
      question: "Quels signes indiquent un catalyseur bouché ?",
      answer:
        "Perte de puissance, surconsommation, odeur d'œuf pourri, voyant moteur et bruit d'échappement étouffé : un catalyseur colmaté limite le débit des gaz et peut surchauffer le moteur.",
      facts: [
        { label: "Cause fréquente", value: "Mélange pauvre/riche, huile ou FAP amont" },
        { label: "Diagnostic", value: "Contre-pression échappement · valise" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic" },
      { url: "/blog/voyant-moteur-allume-que-faire/", label: "Voyant moteur" },
      { url: "/blog/bougies-allumage-quand-changer/", label: "Bougies d'allumage" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler avec un catalyseur bouché ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sur de courtes distances peut-être, mais la perte de puissance et la surchauffe peuvent endommager le moteur. Un catalyseur très colmaté peut aussi se déliter et bloquer complètement l'échappement.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte le remplacement d'un catalyseur ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "De 300 à plus de 1 500 € selon le véhicule (origine ou compatible). Un diagnostic préalable évite de remplacer un catalyseur encore sain — devis chez RED-K MOTORS à Ivry.",
          },
        },
        {
          "@type": "Question",
          name: "Catalyseur bouché : faut-il traiter la cause amont ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui impérativement : bougies, injecteurs, consommation d'huile ou ratés non corrigés encrassent le nouveau pot en quelques semaines.",
          },
        },
      ],
    },
  },
  "vidange-boite-automatique-quand-faire": {
    directAnswer: {
      question: "Faut-il vidanger une boîte automatique et à quelle fréquence ?",
      answer:
        "Selon le constructeur : certains préconisent « sealed for life », d'autres une vidange tous les 60 000 à 100 000 km. Huile foncée, à-coups ou patinage sont des signes qu'un contrôle s'impose.",
      facts: [
        { label: "Intervalle fréquent", value: "60 000–100 000 km (si prévu)" },
        { label: "Conseil", value: "Vérifier le carnet d'entretien" },
      ],
    },
    relatedLinks: [
      { url: "/entretien/", label: "Entretien" },
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/blog/combien-coute-vidange-voiture/", label: "Vidange moteur" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Vidange partielle ou vidange complète de boîte auto ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La vidange partielle (bouchon de vidange) remplace 40 à 60 % de l'huile. La vidange complète avec machine change davantage de fluide mais coûte plus cher — le constructeur indique la méthode adaptée.",
          },
        },
        {
          "@type": "Question",
          name: "Boîte automatique qui patine : vidange suffisante ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si l'huile est usée ou brûlée, une vidange peut améiorer le comportement. Si le patinage persiste, l'usure interne (embrayages, convertisseur) nécessite un diagnostic approfondi.",
          },
        },
      ],
    },
  },
  "turbo-compresseur-symptomes-panne": {
    directAnswer: {
      question: "Quels symptômes indiquent une panne de turbo ?",
      answer:
        "Perte de puissance, fumée bleue ou noire, sifflement anormal, consommation d'huile accrue ou voyant moteur : le turbo compresse les gaz d'échappement — une fuite d'huile ou de suralimentation doit être traitée vite.",
      facts: [
        { label: "Signe classique", value: "Sifflement + perte de puissance" },
        { label: "Prévention", value: "Laisser refroidir 1–2 min après conduite sportive" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic" },
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/blog/voyant-moteur-allume-que-faire/", label: "Voyant moteur" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler avec un turbo en panne ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le véhicule peut rouler en mode dégradé si le turbo ne fragmente pas. En cas de bruit de ferraille, fumée importante ou perte totale de puissance, arrêtez-vous pour éviter des dégâts moteur majeurs.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte le remplacement d'un turbo ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "De 800 à 2 500 € et plus selon le modèle (turbo neuf, reconditionné, main-d'œuvre). Un diagnostic confirme si le turbo ou une durite/alimentation en huile est en cause.",
          },
        },
      ],
    },
  },
  "suppression-fap-controle-technique-2026": {
    directAnswer: {
      question: "Peut-on passer le contrôle technique avec un FAP supprimé en 2026 ?",
      answer:
        "Non : un FAP retiré ou débridé entraîne en principe un refus au CT 2026 (opacimètre, OBD, contrôle visuel). Seules des solutions conformes — nettoyage, remplacement ou remise en état — permettent de repasser.",
      facts: [
        { label: "CT 2026", value: "OBD systématique + opacité renforcée diesel" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/blog/controle-technique-2026-nouveautes/", label: "Contrôle technique 2026" },
      { url: "/blog/fap-dpf-encrasse-trajets-ville/", label: "FAP encrassé" },
      { url: "/diagnostic/", label: "Diagnostic diesel" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "La suppression de FAP est-elle légale ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non. Modifier ou retirer le filtre à particules est une infraction : amende possible, refus au contrôle technique et véhicule non conforme.",
          },
        },
        {
          "@type": "Question",
          name: "Comment préparer un diesel au CT si le FAP est encrassé ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Faites diagnostiquer le taux de colmatage : nettoyage, régénération forcée ou remplacement du FAP selon l'état. Un pré-contrôle en garage évite la contre-visite.",
          },
        },
      ],
    },
  },
  "prix-changement-plaquettes-frein-94": {
    directAnswer: {
      question: "Combien coûte un changement de plaquettes de frein ?",
      answer:
        "Comptez en général 100 à 190 € pour plaquettes seules (un essieu), et 240 à 590 € si les disques doivent aussi être remplacés. Devis fermé après contrôle au véhicule.",
      facts: [
        { label: "Fourchette plaquettes", value: "100–190 €" },
        { label: "Garage", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/freins/", label: "Changement plaquettes frein" },
      { url: "/blog/plaquettes-frein-usure-signaux-a-ne-pas-ignorer/", label: "Signes plaquettes usées" },
      { url: "/blog/disques-frein-voiles-usure-signes/", label: "Disques voilés" },
      { url: "/tarifs/", label: "Grille tarifaire" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Combien coûte un changement de plaquettes de frein dans le 94 ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En 2026, comptez souvent 100 à 190 € pour plaquettes seules (un essieu) et 240 à 590 € si les disques doivent aussi être remplacés. Devis après mesure d'usure chez RED-K MOTORS à Ivry.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il changer les disques en même temps que les plaquettes ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui si les disques sont voilés, rayés ou sous l'épaisseur minimum constructeur. Changer les plaquettes seules sur disques abîmés accélère l'usure et dégrade le freinage.",
          },
        },
        {
          "@type": "Question",
          name: "Le devis plaquettes est-il gratuit à Ivry ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : RED-K MOTORS mesure l'usure devant vous et établit un devis ferme avant toute intervention, lun–sam 9h–19h.",
          },
        },
      ],
    },
  },
  "prix-recharge-climatisation-94": {
    directAnswer: {
      question: "Combien coûte une recharge climatisation voiture ?",
      answer:
        "Une recharge clim en atelier coûte en général 80 à 200 € selon le véhicule et le type de gaz. Diagnostic recommandé avant recharge si la clim ne refroidit plus.",
      facts: [
        { label: "Fourchette recharge", value: "80–200 €" },
        { label: "Garage", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/prestations/recharge-clim/", label: "Réparation climatisation" },
      { url: "/blog/compresseur-clim-mort-symptomes/", label: "Compresseur clim HS" },
      { url: "/blog/climatisation-voiture-recharge-ivry/", label: "Recharge clim Ivry" },
      { url: "/tarifs/", label: "Grille tarifaire" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Combien coûte une recharge climatisation en 2026 ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Une recharge clim en atelier coûte en général 80 à 200 € selon le véhicule et le fluide (R134a ou R1234yf). Si la clim perd du gaz, une recherche de fuite est nécessaire avant recharge.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on recharger la clim sans diagnostic ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non recommandé : une clim qui ne refroidit plus a presque toujours une fuite. Recharger sans réparer = gaz perdu en quelques semaines et argent jeté.",
          },
        },
        {
          "@type": "Question",
          name: "R134a ou R1234yf : impact sur le prix ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le R1234yf (véhicules récents) coûte plus cher que le R134a. Le devis précise le fluide adapté à votre modèle — RED-K MOTORS à Ivry-sur-Seine.",
          },
        },
      ],
    },
  },
  "prix-changement-pneus-94": {
    directAnswer: {
      question: "Combien coûte un changement de pneus ?",
      answer:
        "Montage et équilibrage de 4 pneus : 60 à 150 € en main-d'œuvre, hors prix des pneus (variable selon dimension et marque). Parallélisme : 80 à 160 € si nécessaire.",
      facts: [
        { label: "Montage 4 pneus", value: "60–150 €" },
        { label: "Garage", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/pneumatiques/", label: "Changement pneus" },
      { url: "/blog/quand-changer-pneus-usure-securite/", label: "Quand changer ses pneus" },
      { url: "/blog/prix-geometrie-parallelisme-94/", label: "Prix géométrie 94" },
      { url: "/tarifs/", label: "Grille tarifaire" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Combien coûte le montage de 4 pneus en 2026 ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Comptez en général 60 à 150 € pour montage et équilibrage de 4 pneus (hors prix des pneus). Fourchette indicative à Ivry — devis selon dimension et type de jante.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il faire la géométrie après un changement de pneus ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Recommandé si le volant tire, si les anciens pneus étaient usés en biais ou après un choc. Sinon, un contrôle visuel suffit parfois après montage simple.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on apporter ses propres pneus au garage ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui chez RED-K MOTORS : apportez vos pneus ou choisissez dans le stock. Montage, équilibrage et parallélisme sur RDV à Ivry-sur-Seine.",
          },
        },
      ],
    },
  },
  "fuite-huile-moteur-causes-que-faire": {
    directAnswer: {
      question: "Que faire en cas de fuite d'huile moteur ?",
      answer: "Contrôlez le niveau à froid. Petite tache + niveau stable : RDV garage sous 48 h. Voyant huile rouge ou niveau sous MIN : arrêt et remorquage.",
      facts: [
        {
          label: "Causes fréquentes",
          value: "Carter, cache-culbuteurs, joint spy",
        },
        {
          label: "Atelier",
          value: "RED-K MOTORS · Ivry",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/mecanique/",
        label: "Mécanique",
      },
      {
        url: "/vidange/",
        label: "Vidange",
      },
      {
        url: "/blog/consommation-huile-anormale-causes/",
        label: "Consommation huile",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Fuite d'huile ou consommation d'huile : différence ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Fuite = tache au sol, niveau baisse dehors. Consommation = huile brûlée (fumée bleue) sans tache externe.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on rouler avec une petite fuite ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Courte distance oui si niveau OK et pas de voyant. Vérifiez la jauge avant chaque trajet en attendant le garage.",
          },
        },
        {
          "@type": "Question",
          name: "Fuite après vidange : que faire ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Retournez immédiatement à l'atelier : bouchon mal serré, joint de filtre oublié — ne roulez pas avec une fuite nette.",
          },
        },
      ],
    },
  },
  "voiture-ne-demarre-pas-causes": {
    directAnswer: {
      question: "Pourquoi ma voiture ne démarre pas ?",
      answer:
        "Causes les plus fréquentes : batterie à plat ou en fin de vie, démarreur HS, alternateur qui ne recharge plus, carburant / allumage, ou antidémarrage. Observez si tout est silencieux, s'il y a un clic, ou si le moteur tourne sans prendre — cela oriente déjà le diagnostic.",
      facts: [
        { label: "Cause n°1", value: "Batterie (surtout Start & Stop)" },
        { label: "Garage", value: "RED-K MOTORS · Ivry-sur-Seine (94)" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic auto" },
      { url: "/mecanique/", label: "Mécanique & réparations" },
      { url: "/blog/batterie-voiture-quand-changer/", label: "Quand changer la batterie" },
      { url: "/contact/", label: "Prendre rendez-vous" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Voiture qui ne démarre pas : batterie ou démarreur ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Silence total ou voyants faibles : souvent batterie. Un clic unique répété avec voyants allumés oriente vers le démarreur ou une batterie trop faible pour lancer. Un test de capacité et d'intensité au garage évite de remplacer la mauvaise pièce.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on forcer le démarreur plusieurs fois ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non : des rafales longues font chauffer le démarreur et peuvent le griller. Faites une pause entre les essais, vérifiez le levier en P/N, et privilégiez un diagnostic à Ivry si ça ne part pas.",
          },
        },
        {
          "@type": "Question",
          name: "Le moteur tourne mais ne démarre pas : que faire ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le démarreur fonctionne : on regarde carburant, allumage (bougies/bobines), antidémarrage ou capteur critique. Une lecture OBD chez RED-K MOTORS à Ivry-sur-Seine cible la cause rapidement.",
          },
        },
      ],
    },
  },
  "fumee-bleue-echappement-causes": {
    directAnswer: {
      question: "Que signifie une fumée bleue à l'échappement ?",
      answer: "Huile moteur qui brûle dans les cylindres. Causes fréquentes : turbo, segments usés, guides de soupapes ou niveau d'huile trop haut.",
      facts: [
        {
          label: "Urgence",
          value: "Voyant huile rouge = arrêt",
        },
        {
          label: "Diagnostic",
          value: "50–100 € · Ivry",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/mecanique/",
        label: "Mécanique",
      },
      {
        url: "/blog/fumee-blanche-echappement-que-faire/",
        label: "Fumée blanche",
      },
      {
        url: "/blog/turbo-compresseur-symptomes-panne/",
        label: "Turbo HS",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Fumée bleue le matin : est-ce grave ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Légère et qui disparaît vite sur vieux moteur : parfois bénin. Persistante à chaud = contrôle nécessaire.",
          },
        },
        {
          "@type": "Question",
          name: "Turbo ou segments : comment savoir ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Diagnostic : jeu turbo, pression huile, compression, consommation. Ne remplacez pas à l'aveugle.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on rouler avec une fumée bleue ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Prudemment sur courte distance si niveau OK. Voyant huile ou consommation rapide : arrêt et remorquage.",
          },
        },
      ],
    },
  },
  "consommation-huile-anormale-causes": {
    directAnswer: {
      question: "Quand une consommation d'huile est-elle anormale ?",
      answer:
        "Mesurez en litres pour 1 000 km. Un plafond constructeur (souvent autour de 0,5 L / 1 000 km) n'est pas une consommation « normale » : dès ~0,2–0,3 L / 1 000 km, un contrôle s'impose (fuite externe ou huile brûlée). Un niveau sous le MIN est une urgence.",
      facts: [
        { label: "À mesurer", value: "Litres / 1 000 km entre deux contrôles" },
        { label: "Garage", value: "RED-K MOTORS · Ivry-sur-Seine (94)" },
      ],
    },
    relatedLinks: [
      { url: "/vidange/", label: "Vidange moteur" },
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/blog/fuite-huile-moteur-causes-que-faire/", label: "Fuite d'huile moteur" },
      { url: "/blog/fumee-bleue-echappement-causes/", label: "Fumée bleue" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Ajouter de l'huile entre deux vidanges est-il normal ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Une très légère consommation peut être tolérée selon le moteur. Si vous devez ajouter souvent (ex. > 0,2–0,3 L / 1 000 km), mesurez précisément et faites contrôler : fuite ou combustion d'huile.",
          },
        },
        {
          "@type": "Question",
          name: "Consommation d'huile sans tache au sol : que ça veut dire ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'huile part souvent dans la combustion (segments, guides, turbo) plutôt qu'en fuite externe. Une fumée bleue ou un niveau qui baisse sans flaque confirme cette piste.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on rouler avec un niveau d'huile bas ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non sous le MIN : risque de casse moteur. Faites l'appoint avec la bonne référence puis diagnostic rapidement chez RED-K MOTORS à Ivry.",
          },
        },
      ],
    },
  },
  "joint-culasse-signes-symptomes": {
    directAnswer: {
      question: "Quels sont les signes d'un joint de culasse HS ?",
      answer:
        "Surchauffe répétée, « mayonnaise » dans le vase d'expansion, perte de liquide sans fuite visible, fumée blanche dense à chaud ou gaz dans le circuit de refroidissement : faites diagnostiquer sans attendre.",
      facts: [
        { label: "Urgence", value: "Stopper si surchauffe / mayonnaise" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic auto" },
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/blog/surchauffe-moteur-que-faire/", label: "Surchauffe moteur" },
      { url: "/blog/fumee-blanche-echappement-que-faire/", label: "Fumée blanche" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler avec un joint de culasse suspect ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non recommandé : continuer peut voiler la culasse ou endommager le moteur. Arrêtez-vous en cas de surchauffe et faites remorquer ou diagnostiquer rapidement.",
          },
        },
        {
          "@type": "Question",
          name: "Mayonnaise dans le vase = joint de culasse forcément ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "C'est un signe fort d'émulsion huile/eau, souvent lié au joint de culasse, mais d'autres défauts existent. Un test de compression / gaz dans le circuit confirme chez le garage.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte un joint de culasse à Ivry ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le montant dépend du moteur (accès, culasse à rectifier ou non). Seul un devis après diagnostic est fiable — gratuit avant travaux chez RED-K MOTORS à Ivry-sur-Seine.",
          },
        },
      ],
    },
  },
  "roulement-roue-sifflement-symptomes": {
    directAnswer: {
      question: "Comment reconnaître un roulement de roue usé ?",
      answer:
        "Sifflement ou ronronnement qui augmente avec la vitesse et change en virage (charge d'un côté) : souvent un roulement. Ne confondez pas avec un pneu mal usé ou un frein qui frotte — un contrôle sous pont tranche.",
      facts: [
        { label: "Signe typique", value: "Bruit qui varie en virage" },
        { label: "Garage", value: "RED-K MOTORS · mécanique Ivry" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/pneumatiques/", label: "Pneus & géométrie" },
      { url: "/blog/geometrie-roues-signes-mauvais-alignement/", label: "Géométrie des roues" },
      { url: "/contact/", label: "Diagnostic train roulant" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler avec un roulement qui siffle ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sur de courtes distances uniquement. Un roulement qui casse peut bloquer la roue ou endommager le moyeu. Faites contrôler rapidement à Ivry.",
          },
        },
        {
          "@type": "Question",
          name: "Roulement ou pneu : comment distinguer ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Un pneu usé ou hernié fait souvent un bruit plus « régulier » ; un roulement change souvent d'intensité en virage. L'essai route et le contrôle au cric confirment.",
          },
        },
      ],
    },
  },
  "cardan-qui-claque-causes": {
    directAnswer: {
      question: "Pourquoi un cardan claque en tournant ?",
      answer:
        "Un clac-clac en braquant à fond ou en accélérant en courbe pointe souvent vers un joint de cardan (soufflet déchiré, graisse partie, jeu). Plus on attend, plus le risque de rupture en virage augmente.",
      facts: [
        { label: "Signe classique", value: "Clac en braquage serré" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique & réparations" },
      { url: "/pneumatiques/", label: "Géométrie" },
      { url: "/blog/embrayage-qui-patine-causes/", label: "Embrayage qui patine" },
      { url: "/contact/", label: "Devis cardan" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler avec un cardan qui claque ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Évitez les grands braquages et les accélérations fortes. Un joint HS peut se désagréger : planifiez le remplacement rapidement chez RED-K MOTORS.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il changer le cardan complet ou seulement le soufflet ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si le soufflet est déchiré depuis peu et le joint encore sain, un soufflet + graisse peut suffire. Dès qu'il y a du jeu ou du claquement, on remplace en général le joint ou le cardan complet.",
          },
        },
        {
          "@type": "Question",
          name: "Cardan ou silentbloc : même bruit ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non : le cardan claque surtout en braquage / accélération en courbe. Les silentblocs claquent plutôt sur bosses ou au freinage. Un essai sous pont différencie.",
          },
        },
      ],
    },
  },
  "volant-qui-vibre-causes": {
    directAnswer: {
      question: "Pourquoi le volant vibre-t-il ?",
      answer:
        "Vibration dès ~90 km/h : souvent pneus (équilibrage, hernie) ou jante. Vibration surtout au freinage : disques voilés. Volant de travers + usure en biais : géométrie. Un diagnostic train avant cible la cause.",
      facts: [
        { label: "À noter", value: "Vitesse / freinage / virage" },
        { label: "Garage", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/pneumatiques/", label: "Pneus & géométrie" },
      { url: "/freins/", label: "Freinage" },
      { url: "/blog/disques-frein-voiles-usure-signes/", label: "Disques voilés" },
      { url: "/blog/geometrie-roues-signes-mauvais-alignement/", label: "Mauvais alignement" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Volant qui vibre sur autoroute : que vérifier en premier ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Équilibrage et état des pneus (usure, hernie), puis jantes. Si le problème persiste, géométrie et silentblocs — contrôle pneus puis train avant en atelier.",
          },
        },
        {
          "@type": "Question",
          name: "Vibration uniquement au freinage : est-ce grave ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent des disques voilés ou usés. Le freinage reste possible mais moins efficace et moins confortable — faites contrôler les freins avant un long trajet.",
          },
        },
      ],
    },
  },
  "surchauffe-moteur-que-faire": {
    directAnswer: {
      question: "Que faire en cas de surchauffe moteur ?",
      answer:
        "Coupez la clim, mettez le chauffage à fond, arrêtez-vous dès que c'est sûr, coupez le moteur et laissez refroidir. N'ouvrez jamais le bouchon à chaud. Ensuite : niveau de liquide, fuite, thermostat, radiateur ou joint de culasse à diagnostiquer.",
      facts: [
        { label: "Urgence", value: "Stopper · ne pas ouvrir le circuit chaud" },
        { label: "Garage", value: "RED-K MOTORS · Ivry-sur-Seine (94)" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/diagnostic/", label: "Diagnostic" },
      { url: "/blog/liquide-refroidissement-quand-verifier/", label: "Liquide de refroidissement" },
      { url: "/blog/joint-culasse-signes-symptomes/", label: "Joint de culasse" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on compléter le liquide de refroidissement à chaud ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non : risque de brûlure grave. Attendez le refroidissement complet, puis complétez à froid avec le produit adapté et recherchez la cause de la perte.",
          },
        },
        {
          "@type": "Question",
          name: "Quelles causes de surchauffe sont les plus fréquentes ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Niveau bas / fuite, thermostat bloqué, radiateur ou ventilateur HS, pompe à eau, et parfois joint de culasse après une première surchauffe.",
          },
        },
        {
          "@type": "Question",
          name: "Reprendre la route après une surchauffe ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Uniquement si la température est redescendue, le niveau est correct et aucun voyant ne reste allumé — et seulement pour rejoindre un garage. En cas de doute, faites dépanner.",
          },
        },
      ],
    },
  },
  "alternateur-hs-symptomes": {
    directAnswer: {
      question: "Quels sont les symptômes d'un alternateur HS ?",
      answer:
        "Voyant batterie allumé, phares qui baissent au ralenti, accessoires qui coupent, démarrages de plus en plus difficiles après un boost : l'alternateur (ou sa courroie) ne recharge plus. Un test de tension moteur tournant confirme.",
      facts: [
        { label: "Signe fréquent", value: "Voyant batterie + tension trop basse" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/diagnostic/", label: "Diagnostic" },
      { url: "/blog/batterie-voiture-quand-changer/", label: "Batterie voiture" },
      { url: "/blog/courroie-accessoires-symptomes-usure/", label: "Courroie d'accessoires" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Batterie ou alternateur : comment savoir ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si la voiture démarre après un boost puis retombe en panne en roulant, l'alternateur (ou la courroie) est souvent en cause. Une batterie seule HS se vide surtout à l'arrêt. Le test de charge tranche.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on rouler avec le voyant batterie allumé ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Seulement pour rejoindre un garage proche : vous roulez sur la réserve de la batterie. Éteignez clim et accessoires non essentiels.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte le remplacement d'un alternateur ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent 350 à 750 € TTC (pièce + pose) sur citadine/compacte, variable selon motorisation. Contrôle courroie d'accessoires avant — devis à Ivry.",
          },
        },
      ],
    },
  },
  "pare-brise-fissure-controle-technique": {
    directAnswer: {
      question: "Un pare-brise fissuré passe-t-il le contrôle technique ?",
      answer:
        "Un impact dans le champ de vision du conducteur ou une fissure qui s'étend peut entraîner un défaut majeur / critique et un refus. Réparez l'impact ou remplacez le vitrage avant le CT pour éviter la contre-visite.",
      facts: [
        { label: "Zone sensible", value: "Champ de vision conducteur" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/pare-brise/", label: "Pare-brise" },
      { url: "/blog/5-points-controle-avant-ct-ivry/", label: "5 points avant le CT" },
      { url: "/blog/controle-technique-2026-nouveautes/", label: "CT 2026" },
      { url: "/contact/", label: "Devis vitrage" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Impact ou fissure : peut-on réparer sans changer le pare-brise ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Un petit impact hors zone critique se répare souvent. Dès qu'une fissure part, le remplacement est en général nécessaire. Un devis chez RED-K MOTORS à Ivry précise la solution.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il déclarer à l'assurance un impact pare-brise ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent oui selon votre contrat (bris de glace). Vérifiez franchise et bonus. L'atelier peut vous aider pour le devis assurance.",
          },
        },
        {
          "@type": "Question",
          name: "Combien de temps avant le CT pour réparer ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Dès que l'impact apparaît : une fissure peut s'étendre en quelques jours (choc thermique, nid-de-poule). Réparer avant le passage évite le refus.",
          },
        },
      ],
    },
  },
  "prix-kit-distribution-94": {
    directAnswer: {
      question: "Combien coûte un kit de distribution dans le 94 ?",
      answer:
        "Pour une voiture courante en 2026, comptez souvent 550 à 1 000 € (kit + main-d'œuvre), et plutôt 750 à 1 500 € si la pompe à eau est remplacée en même temps. Devis ferme après diagnostic chez RED-K MOTORS à Ivry.",
      facts: [
        { label: "Fourchette kit", value: "550–1 000 €" },
        { label: "Avec pompe à eau", value: "750–1 500 €" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/exemples/prix-courroie-distribution/", label: "Guide prix distribution" },
      { url: "/blog/courroie-distribution-quand-changer-94/", label: "Quand changer la distribution" },
      { url: "/tarifs/", label: "Grille tarifaire" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Faut-il changer la pompe à eau avec le kit distribution ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui sur de nombreux moteurs : la pompe est entraînée par la courroie et l'accès est le même. La changer en même temps évite une seconde immobilisation.",
          },
        },
        {
          "@type": "Question",
          name: "Pourquoi les prix varient-ils autant ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Accès moteur, qualité du kit, présence de la pompe à eau et temps de main-d'œuvre. Un diesel encombré coûte souvent plus qu'une citadine essence.",
          },
        },
        {
          "@type": "Question",
          name: "Le devis distribution est-il gratuit à Ivry ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui chez RED-K MOTORS : devis écrit avant travaux, après identification du moteur et du plan d'entretien constructeur.",
          },
        },
      ],
    },
  },
  "prix-changement-embrayage-94": {
    directAnswer: {
      question: "Combien coûte un changement d'embrayage dans le 94 ?",
      answer:
        "Kit d'embrayage (disque, mécanisme, butée + pose) : souvent 700 à 1 400 € en 2026. Avec volant bimasse : fréquemment 1 200 à 2 500 €. Fourchettes indicatives — devis après essai chez RED-K MOTORS à Ivry.",
      facts: [
        { label: "Kit seul", value: "700–1 400 €" },
        { label: "Avec bimasse", value: "1 200–2 500 €" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/exemples/prix-embrayage/", label: "Guide prix embrayage" },
      { url: "/blog/embrayage-qui-patine-causes/", label: "Embrayage qui patine" },
      { url: "/tarifs/", label: "Grille tarifaire" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Faut-il toujours changer le volant bimasse ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non : seulement s'il est fatigué (bruits, vibrations, jeu). Sur beaucoup de diesels, il est déjà usé au moment du kit — le devis isole clairement cette ligne.",
          },
        },
        {
          "@type": "Question",
          name: "Combien de temps pour changer un embrayage ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent une journée selon l'accès (traction, boîte, berceau). RED-K MOTORS à Ivry confirme le délai sur le devis.",
          },
        },
        {
          "@type": "Question",
          name: "Quels signes avant de changer l'embrayage ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Patine à l'accélération, point de patinage haut, odeur de brûlé, bruit au débrayage. Un essai route évite de confondre avec une commande hydraulique.",
          },
        },
      ],
    },
  },
  "prix-changement-batterie-94": {
    directAnswer: {
      question: "Combien coûte un changement de batterie ?",
      answer:
        "Batterie plomb classique posée : souvent 100 à 220 € en 2026. Start & Stop (EFB/AGM) : plutôt 180 à 400 € selon capacité et recalibrage. Devis gratuit chez RED-K MOTORS à Ivry-sur-Seine.",
      facts: [
        { label: "Classique", value: "100–220 €" },
        { label: "EFB / AGM", value: "180–400 €" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/exemples/prix-batterie/", label: "Guide prix batterie" },
      { url: "/blog/batterie-voiture-quand-changer/", label: "Quand changer la batterie" },
      { url: "/tarifs/", label: "Grille tarifaire" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pourquoi une batterie Start & Stop coûte-t-elle plus cher ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les technologies EFB/AGM supportent des cycles intensifs et nécessitent parfois un codage du calculateur. Une batterie classique n'est pas adaptée.",
          },
        },
        {
          "@type": "Question",
          name: "Le prix inclut-il la pose et le recyclage ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le devis précise pièce conforme, pose, contrôle de charge et reprise de l'ancienne batterie — comparez ce périmètre, pas seulement le prix magasin.",
          },
        },
      ],
    },
  },
  "prix-geometrie-parallelisme-94": {
    directAnswer: {
      question: "Combien coûte une géométrie ou un parallélisme dans le 94 ?",
      answer:
        "Parallélisme train avant : souvent 50 à 90 € en 2026. Géométrie plus complète (multi-axes) : plutôt 80 à 150 €. Hors pièces usées (rotules, silentblocs) parfois nécessaires avant réglage. Devis chez RED-K MOTORS à Ivry.",
      facts: [
        { label: "Parallélisme", value: "50–90 €" },
        { label: "Géométrie complète", value: "80–150 €" },
      ],
    },
    relatedLinks: [
      { url: "/pneumatiques/", label: "Pneus & géométrie" },
      { url: "/blog/geometrie-roues-signes-mauvais-alignement/", label: "Signes de mauvais alignement" },
      { url: "/blog/volant-qui-vibre-causes/", label: "Volant qui vibre" },
      { url: "/tarifs/", label: "Grille tarifaire" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Parallélisme et géométrie : quelle différence ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le parallélisme règle surtout l'ouverture/fermeture du train avant. La géométrie mesure et règle davantage d'angles (carrossage, chasse, etc.) selon le véhicule.",
          },
        },
        {
          "@type": "Question",
          name: "Quand faire une géométrie ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Après un choc (trottoir, nid-de-poule), au changement de pneus, ou si la voiture tire / les pneus s'usent en biais — fréquent en usage urbain autour d'Ivry.",
          },
        },
        {
          "@type": "Question",
          name: "Le réglage suffit-il si un silentbloc est HS ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non : une pièce de train usée empêche un réglage durable. Le devis isole d'abord les pièces à remplacer, puis la géométrie.",
          },
        },
      ],
    },
  },
  "prix-pre-controle-technique-ivry": {
    directAnswer: {
      question: "Combien coûte un pré-contrôle technique à Ivry ?",
      answer:
        "Un pré-CT en garage à Ivry / 94 se situe souvent entre 40 et 90 € en 2026 selon la profondeur du contrôle. Ce n'est pas le prix du CT officiel (centre agréé). L'intérêt : éviter la contre-visite et chiffrer les réparations.",
      facts: [
        { label: "Fourchette pré-CT", value: "40–90 €" },
        { label: "Garage", value: "RED-K MOTORS · Ivry-sur-Seine" },
      ],
    },
    relatedLinks: [
      { url: "/entretien/", label: "Entretien" },
      { url: "/blog/5-points-controle-avant-ct-ivry/", label: "5 points avant le CT" },
      { url: "/blog/controle-technique-2026-nouveautes/", label: "Nouveautés CT 2026" },
      { url: "/contact/", label: "Réserver un pré-CT" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pré-contrôle et contrôle technique : même chose ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non. Le pré-CT est un contrôle atelier pour détecter les défauts avant le passage officiel. Le CT est délivré uniquement par un centre agréé.",
          },
        },
        {
          "@type": "Question",
          name: "Le pré-CT évite-t-il toujours la contre-visite ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Il réduit fortement le risque en corrigeant freins, pneus, éclairage, pollution et niveaux avant le jour J. Aucun garage ne peut garantir le résultat du centre, mais la préparation change la donne.",
          },
        },
        {
          "@type": "Question",
          name: "Quand faire un pré-CT à Ivry ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Idéalement 1 à 2 semaines avant le rendez-vous au centre, pour laisser le temps aux réparations et au devis.",
          },
        },
      ],
    },
  },
  "adblue-voyant-panne-diesel": {
    directAnswer: {
      question: "Que faire si le voyant AdBlue s'allume ?",
      answer:
        "Complétez avec de l'AdBlue conforme ISO 22241 dès les premiers messages et respectez l'autonomie affichée. À niveau critique, de nombreux diesels Euro 6 refusent le redémarrage. Si le voyant persiste après appoint, un diagnostic SCR est nécessaire (pompe, capteur, qualité du produit).",
      facts: [
        { label: "Risque", value: "Refus de démarrage si niveau à zéro" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic diesel" },
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/blog/voyant-moteur-allume-que-faire/", label: "Voyant moteur" },
      { url: "/contact/", label: "Prendre rendez-vous" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler avec le voyant AdBlue allumé ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui tant que l'autonomie restante le permet, mais remplissez vite. À zéro, de nombreux diesels refusent le redémarrage après coupure moteur.",
          },
        },
        {
          "@type": "Question",
          name: "AdBlue plein mais voyant toujours allumé : pourquoi ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Qualité du produit, cristallisation, pompe, injecteur AdBlue ou capteur défaillant. Un diagnostic valise chez RED-K MOTORS à Ivry identifie le défaut.",
          },
        },
        {
          "@type": "Question",
          name: "N'importe quel AdBlue convient-il ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Utilisez un AdBlue conforme ISO 22241. Un produit dilué ou contaminé encrasse le système et peut coûter cher à réparer.",
          },
        },
      ],
    },
  },
  "filtre-gasoil-quand-changer": {
    directAnswer: {
      question: "Quand changer le filtre à gasoil ?",
      answer: "En général entre 20 000 et 60 000 km selon le carnet, ou plus tôt si perte de puissance, ratés ou démarrage difficile. Protège pompe HP et injecteurs.",
      facts: [
        {
          label: "Risque si négligé",
          value: "Pompe / injecteurs HS",
        },
        {
          label: "Atelier",
          value: "Entretien diesel · Ivry",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/entretien/",
        label: "Entretien & révision",
      },
      {
        url: "/blog/injecteurs-encrasses-symptomes/",
        label: "Injecteurs encrassés",
      },
      {
        url: "/contact/",
        label: "Rendez-vous",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Filtre gasoil encrassé : quels symptômes ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Perte de puissance, à-coups, calage à chaud, démarrage difficile — parfois voyant antipollution.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il purger après changement de filtre gasoil ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : purge indispensable pour chasser l'air. Sur diesels récents, un outil diagnostic peut amorcer la pompe.",
          },
        },
        {
          "@type": "Question",
          name: "Un filtre gasoil bas de gamme, est-ce risqué ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : mauvaise filtration = injecteurs et pompe HP exposés. Privilégiez qualité équivalente constructeur.",
          },
        },
      ],
    },
  },
  "injecteurs-encrasses-symptomes": {
    directAnswer: {
      question: "Quels sont les symptômes d'injecteurs encrassés ?",
      answer: "Ralenti irrégulier, ratés à l'accélération, perte de puissance, fumée noire (diesel), surconsommation et voyant moteur. Diagnostic avant remplacement.",
      facts: [
        {
          label: "Première étape",
          value: "Valise + test injection",
        },
        {
          label: "Atelier",
          value: "RED-K MOTORS · Ivry",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/diagnostic/",
        label: "Diagnostic auto",
      },
      {
        url: "/blog/filtre-gasoil-quand-changer/",
        label: "Filtre gasoil",
      },
      {
        url: "/blog/voiture-broute-acceleration-causes-94/",
        label: "Voiture qui broute",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Nettoyage ou remplacement des injecteurs ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nettoyage si encrassement modéré. Remplacement si fuite, hors tolérance ou usure mécanique — avec codage calculateur sur common rail.",
          },
        },
        {
          "@type": "Question",
          name: "Injecteurs encrassés ou bougies HS ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mêmes symptômes sur essence. Le diagnostic (codes défaut, paramètres live) évite de confondre.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on rouler avec des injecteurs encrassés ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Courte distance oui, mais ratés répétés encrassent catalyseur/FAP. Faites diagnostiquer rapidement.",
          },
        },
      ],
    },
  },
  "debosselage-sans-peinture-dsp": {
    directAnswer: {
      question: "Le débosselage sans peinture (DSP), c'est pour qui ?",
      answer: "Pour les bosses légères avec peinture intacte (portière, aile, grêle). Si le vernis est fissuré ou le pli trop vif, une réparation carrosserie classique s'impose.",
      facts: [
        {
          label: "Fourchette",
          value: "50 – 200 € / bosse selon accès",
        },
        {
          label: "Atelier",
          value: "Carrosserie · Ivry (94)",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/carrosserie/",
        label: "Carrosserie & peinture",
      },
      {
        url: "/blog/rayure-carrosserie-quand-reparer/",
        label: "Rayure : quand réparer",
      },
      {
        url: "/contact/",
        label: "Devis DSP",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Le DSP laisse-t-il des traces ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bien fait, le DSP est invisible : la peinture d'origine est conservée. Un polish léger peut finir le travail.",
          },
        },
        {
          "@type": "Question",
          name: "Toutes les bosses se prêtent au DSP ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non : pli tranchant, tôle étirée, peinture craquelée ou zone sans accès arrière limitent ou interdisent le DSP.",
          },
        },
        {
          "@type": "Question",
          name: "Le DSP est-il moins cher qu'une peinture ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En général oui : pas de cabine, pas de teinte. Le devis dépend du nombre d'impacts et de l'accessibilité.",
          },
        },
      ],
    },
  },
  "peinture-localisee-retouche-carrosserie": {
    directAnswer: {
      question: "Quand choisir une peinture localisée plutôt qu'une retouche stylo ?",
      answer:
        "Rayure profonde, éclat jusqu'au métal ou zone visible : une peinture localisée en cabine (teinte, vernis, lustrage) protège mieux qu'un stylo. Le stylo reste un dépannage esthétique provisoire.",
      facts: [
        { label: "Objectif", value: "Esthétique + protection anticorrosion" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/carrosserie/", label: "Carrosserie & peinture" },
      { url: "/prestations/peinture-localisee/", label: "Peinture localisée" },
      { url: "/blog/rayure-carrosserie-quand-reparer/", label: "Quand réparer une rayure" },
      { url: "/blog/debosselage-sans-peinture-dsp/", label: "Débosselage sans peinture" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peinture localisée ou panneau complet ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Selon la surface et la teinte (métallisée, nacrée). Une petite zone se traite en localisé ; un grand panneau ou un raccord difficile peut imposer une surface plus large.",
          },
        },
        {
          "@type": "Question",
          name: "Combien de temps pour une retouche peinture ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent 1 à 2 jours selon séchage et polissage. Le devis chez RED-K MOTORS précise le délai d'immobilisation.",
          },
        },
        {
          "@type": "Question",
          name: "Une rayure non traitée peut-elle rouiller ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui dès que le métal est exposé à l'humidité. Une peinture localisée referme la protection avant que la corrosion ne s'étende.",
          },
        },
      ],
    },
  },
  "silentblocs-triangles-suspension-usure": {
    directAnswer: {
      question: "Quels signes d'usure des silentblocs de triangles ?",
      answer:
        "Claquements sur bosses, direction imprécise, usure irrégulière des pneus, géométrie impossible à tenir : les silentblocs de triangles filtrent mal les chocs. Un contrôle sous pont confirme le jeu.",
      facts: [
        { label: "Usage urbain", value: "Nids-de-poule · accélère l'usure" },
        { label: "Garage", value: "Train avant · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/pneumatiques/", label: "Pneus & géométrie" },
      { url: "/blog/amortisseurs-usures-symptomes/", label: "Amortisseurs usés" },
      { url: "/blog/geometrie-roues-signes-mauvais-alignement/", label: "Géométrie" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Faut-il changer le triangle complet ou seulement le silentbloc ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Selon le modèle : certains silentblocs se pressent, d'autres sont solidaires du triangle. Le devis indique la solution la plus durable pour votre véhicule.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il refaire la géométrie après remplacement ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : le train avant a bougé. Une géométrie après travaux garantit usure pneus et tenue de route correctes.",
          },
        },
        {
          "@type": "Question",
          name: "Silentblocs usés : danger immédiat ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le véhicule reste souvent roulant, mais le comportement se dégrade et d'autres pièces (pneus, rotules) souffrent. Planifiez la réparation rapidement à Ivry.",
          },
        },
      ],
    },
  },
  "direction-assistee-dure-grincements": {
    directAnswer: {
      question: "Pourquoi la direction assistée est dure ou grince ?",
      answer: "Hydraulique : niveau bas, fuite, pompe ou courroie. Électrique : défaut EPS, batterie faible, capteur. Rotules usées ou pneus sous-gonflés durcissent aussi le volant.",
      facts: [
        {
          label: "Urgence",
          value: "Volant soudainement dur = prudence",
        },
        {
          label: "Atelier",
          value: "RED-K MOTORS · Ivry (94)",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/mecanique/",
        label: "Mécanique",
      },
      {
        url: "/diagnostic/",
        label: "Diagnostic OBD",
      },
      {
        url: "/blog/geometrie-roues-signes-mauvais-alignement/",
        label: "Géométrie roues",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Direction dure uniquement au parking : pourquoi ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'assistance est maximale à basse vitesse. Si le volant est dur au parking, la perte d'assistance est probable (pompe, EPS, liquide).",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on faire un appoint de liquide de direction ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Un appoint temporaire oui, mais cherchez la fuite : un niveau qui baisse révèle une fuite à traiter.",
          },
        },
        {
          "@type": "Question",
          name: "Grincement en braquant à fond : danger ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ne forcez pas en butée : vous usez pompe ou crémaillère. Faites contrôler niveau, courroie et fuites.",
          },
        },
      ],
    },
  },
  "clim-odeur-moisi-que-faire": {
    directAnswer: {
      question: "Que faire si la clim sent le moisi ?",
      answer:
        "Changez le filtre d'habitacle, faites un traitement antibactérien de l'évaporateur et vérifiez l'évacuation d'eau. L'odeur vient souvent de moisissures dans le circuit d'air, surtout après usage humidité / clim en ville.",
      facts: [
        { label: "Gestes utiles", value: "Filtre habitacle + traitement clim" },
        { label: "Garage", value: "Clim · RED-K MOTORS Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/reparation-climatisation-ivry/", label: "Réparation climatisation" },
      { url: "/blog/filtre-habitacle-pollen-quand-changer/", label: "Filtre d'habitacle" },
      { url: "/blog/climatisation-voiture-recharge-ivry/", label: "Recharge clim" },
      { url: "/blog/prix-recharge-climatisation-94/", label: "Prix recharge clim" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Une recharge de gaz enlève-t-elle l'odeur de moisi ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non : l'odeur vient de l'air et de l'évaporateur, pas du manque de gaz. Il faut nettoyer / traiter le circuit et changer le filtre habitacle.",
          },
        },
        {
          "@type": "Question",
          name: "Comment limiter le retour de l'odeur ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Coupez la clim quelques minutes avant d'arriver (sécher l'évaporateur), remplacez le filtre à l'échéance, et évitez de laisser l'habitacle très humide fermé.",
          },
        },
        {
          "@type": "Question",
          name: "L'odeur de moisi est-elle dangereuse ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Elle irrite surtout les voies respiratoires et le confort (allergies). Un traitement en atelier à Ivry restaure un air plus sain.",
          },
        },
      ],
    },
  },
  "perte-puissance-soudaine-causes": {
    directAnswer: {
      question: "Pourquoi une perte de puissance soudaine ?",
      answer:
        "Mode dégradé (voyant moteur), turbo, injection, FAP / antipollution, admission ou carburant : une chute brutale de puissance demande un diagnostic rapide. Réduisez la charge moteur et évitez l'autoroute jusqu'au garage.",
      facts: [
        { label: "Réflexe", value: "Noter voyants + conditions (froid, côte…)" },
        { label: "Diagnostic", value: "Valise · RED-K MOTORS Ivry" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic auto" },
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/blog/turbo-compresseur-symptomes-panne/", label: "Panne de turbo" },
      { url: "/blog/voyant-moteur-allume-que-faire/", label: "Voyant moteur" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on continuer à rouler en mode dégradé ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sur de courtes distances pour rejoindre l'atelier, oui, en roulant souple. Forcer peut endommager turbo, FAP ou catalyseur.",
          },
        },
        {
          "@type": "Question",
          name: "Perte de puissance sans voyant : possible ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui (filtre carburant, turbo qui commence à lâcher, embrayage qui patine). Un essai route et des mesures complémentaires complètent la valise.",
          },
        },
        {
          "@type": "Question",
          name: "Diesel urbain à Ivry : causes fréquentes ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "FAP / EGR encrassés, AdBlue, filtre à gasoil et turbo sont souvent en cause sur les trajets courts du Val-de-Marne. Le diagnostic isole la bonne piste.",
          },
        },
      ],
    },
  },
  "controle-antipollution-refuse-que-faire": {
    directAnswer: {
      question: "Que faire si le contrôle antipollution est refusé ?",
      answer:
        "Lisez le procès-verbal (opacité, OBD, défauts). Causes fréquentes : FAP, catalyseur, sondes, vanne EGR, fuite échappement. Réparez, puis contre-visite dans les délais. Un diagnostic avant évite de changer les mauvaises pièces.",
      facts: [
        { label: "Délai", value: "Contre-visite selon mention du PV" },
        { label: "Garage", value: "Préparation CT · Ivry-sur-Seine (94)" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic pollution" },
      { url: "/blog/fap-dpf-encrasse-trajets-ville/", label: "FAP encrassé" },
      { url: "/blog/catalyseur-bouche-symptomes-causes/", label: "Catalyseur bouché" },
      { url: "/blog/controle-technique-2026-nouveautes/", label: "CT 2026" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler après un refus antipollution ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui dans la limite de validité indiquée pour la contre-visite, mais le véhicule n'est plus en règle au-delà. Planifiez réparation + nouveau passage rapidement.",
          },
        },
        {
          "@type": "Question",
          name: "Un nettoyage FAP suffit-il pour repasser ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si le colmatage est la cause et que le filtre est récupérable, souvent oui. Si le FAP est détruit ou le calculateur modifié, le remplacement / remise en conformité s'impose.",
          },
        },
        {
          "@type": "Question",
          name: "Comment préparer la contre-visite à Ivry ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Apportez le PV chez RED-K MOTORS : on lit les codes, on traite la cause (FAP, sondes, échappement…), puis on vous oriente pour la contre-visite au centre.",
          },
        },
      ],
    },
  },
  "combien-temps-entre-deux-vidanges": {
    directAnswer: {
      question: "Combien de temps entre deux vidanges ?",
      answer:
        "En général, une vidange tous les 10 000 à 15 000 km ou une fois par an (selon ce qui arrive en premier). En ville et trajets courts, restez plutôt sur 10 000 km maximum même si le constructeur autorise plus.",
      facts: [
        { label: "Usage ville", value: "10 000 km ou 12 mois conseillés" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/vidange/", label: "Prestation vidange" },
      { url: "/blog/combien-coute-vidange-voiture/", label: "Prix vidange" },
      { url: "/contact/", label: "Prendre rendez-vous" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Combien de km entre deux vidanges ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Comptez en général 10 000 à 15 000 km, ou une fois par an. En usage urbain intensif, 10 000 km maximum est plus prudent.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il vidanger si je roule peu ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : l'huile vieillit avec le temps. Même en roulant peu, une vidange annuelle est recommandée.",
          },
        },
        {
          "@type": "Question",
          name: "Huile longue durée : peut-on dépasser l'intervalle km ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non sans limite : le constructeur indique souvent « X km ou Y ans ». En usage urbain 94, l'année arrive souvent en premier — ne dépassez pas 12 mois.",
          },
        },
      ],
    },
  },
  "revision-garage-independant-garantie-constructeur": {
    directAnswer: {
      question: "Faut-il faire la révision chez le concessionnaire pour garder la garantie ?",
      answer:
        "Non. Un garage indépendant peut réaliser l'entretien si les pièces et fluides sont conformes au plan constructeur et que le carnet est tamponné avec facture détaillée.",
      facts: [
        { label: "Obligation", value: "Respecter intervalles + normes constructeur" },
        { label: "Preuve", value: "Facture + carnet d'entretien tamponné" },
      ],
    },
    relatedLinks: [
      { url: "/entretien/", label: "Révision auto" },
      { url: "/blog/revision-constructeur-que-comprend-vraiment-service/", label: "Contenu d'une révision" },
      { url: "/contact/", label: "Prendre rendez-vous" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Un garage indépendant peut-il tamponner le carnet constructeur ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, si l'entretien respecte le plan constructeur (pièces conformes, fluides aux normes, opérations prévues au kilométrage).",
          },
        },
        {
          "@type": "Question",
          name: "Que risque-t-on en allant uniquement en concession ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Rien pour la garantie — mais le tarif est souvent plus élevé. Le libre entretien est un droit, pas une obligation d'aller en concession.",
          },
        },
      ],
    },
  },
  "batterie-morte-matin-que-faire": {
    directAnswer: {
      question: "Que faire si la batterie est morte le matin ?",
      answer:
        "Vérifiez qu'aucun équipement n'a été laissé allumé, serrez les câbles de batterie, puis tentez un démarrage assisté si vous savez le faire. Si la panne revient le lendemain, faites tester batterie et alternateur en atelier.",
      facts: [
        { label: "Durée de vie", value: "4–5 ans en moyenne" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/blog/voiture-ne-demarre-pas-causes/", label: "Voiture ne démarre pas" },
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/contact/", label: "Prendre rendez-vous" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Comment savoir si c'est la batterie ou l'alternateur ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si le voyant batterie s'allume en roulant, l'alternateur est suspect. Si le démarreur cliquette sans que le moteur tourne, c'est plutôt la batterie.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on rouler avec une batterie faible ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sur de courtes distances après un démarrage assisté, oui temporairement. Mais une batterie HS peut vous laisser en panne au prochain arrêt — faites-la tester rapidement.",
          },
        },
        {
          "@type": "Question",
          name: "Démarrage assisté : est-ce une solution durable ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non : si la voiture ne tient pas la charge le lendemain, batterie ou alternateur est en cause. Test en atelier avant achat d'une batterie neuve.",
          },
        },
      ],
    },
  },
  "bruit-anormal-voiture-que-faire": {
    directAnswer: {
      question: "Que faire si on entend un bruit anormal en roulant ?",
      answer:
        "Notez quand le bruit apparaît (vitesse, freinage, virage) et d'où il semble venir. Grincement au freinage = freins ; claquement sur dos d'âne = suspension ; sifflement constant = roulement. Si la direction ou le freinage est affecté, arrêtez-vous.",
      facts: [
        { label: "Urgence", value: "Freinage ou direction dégradés → arrêt immédiat" },
        { label: "Diagnostic", value: "Essai routier + inspection ciblée" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic auto" },
      { url: "/blog/roulement-roue-sifflement-symptomes/", label: "Bruit de roulement" },
      { url: "/contact/", label: "Prendre rendez-vous" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Un bruit de frein est-il dangereux ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Un grincement au freinage indique souvent des plaquettes usées ou des disques voilés. À faire contrôler rapidement : le freinage peut se dégrader.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il continuer à rouler avec un bruit de suspension ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si le bruit est léger et sans vibration, vous pouvez rouler prudemment pour vous rendre en atelier. Un claquement fort ou une direction qui tire impose l'arrêt.",
          },
        },
        {
          "@type": "Question",
          name: "Une vidéo du bruit aide-t-elle le diagnostic ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : 10 secondes en roulant sur route calme, avec note vitesse et conditions (freinage, virage), orientent l'essai routier chez RED-K MOTORS à Ivry.",
          },
        },
      ],
    },
  },
  "fuite-liquide-frein-reconnaitre": {
    directAnswer: {
      question: "Comment reconnaître une fuite de liquide de frein ?",
      answer: "Voyant frein, pédale molle, niveau bas dans le réservoir, tache claire à jaunâtre près d'une roue ou sous le capot. Ne roulez pas si le freinage semble incertain.",
      facts: [
        {
          label: "Urgence",
          value: "Sécurité — remorquage si doute",
        },
        {
          label: "Atelier",
          value: "Freinage · Ivry (94)",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/freins/",
        label: "Freinage",
      },
      {
        url: "/blog/freinage-mou-pedale-spongieuse/",
        label: "Pédale spongieuse",
      },
      {
        url: "/contact/",
        label: "Urgence freinage",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Liquide de frein vs huile moteur : comment distinguer ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Frein : clair à ambré, fluide, légère odeur chimique. Huile moteur : brun foncé, visqueuse.",
          },
        },
        {
          "@type": "Question",
          name: "Un appoint de liquide suffit-il ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non durablement : si le niveau baisse, il y a une fuite. Trouvez et réparez la cause, puis purgez.",
          },
        },
        {
          "@type": "Question",
          name: "Où regarder en premier ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Réservoir sous capot, flexibles près des roues, étriers, maître-cylindre et zone pédales.",
          },
        },
      ],
    },
  },
  "demarreur-hs-symptomes": {
    directAnswer: {
      question: "Comment savoir si le démarreur est HS ?",
      answer: "Clic sec sans que le moteur tourne, grincement au démarrage, moteur qui tourne lentement puis s'arrête : signes classiques. Vérifiez d'abord batterie et masse avant de condamner le démarreur.",
      facts: [
        {
          label: "Fourchette remplacement",
          value: "250 – 550 € citadine",
        },
        {
          label: "Atelier",
          value: "RED-K MOTORS · Ivry (94)",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/prestations/demarreur/",
        label: "Démarreur & batterie",
      },
      {
        url: "/blog/batterie-voiture-quand-changer/",
        label: "Batterie voiture",
      },
      {
        url: "/blog/voiture-ne-demarre-pas-causes/",
        label: "Voiture ne démarre pas",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Batterie ou démarreur : comment trancher ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Si le démarrage fonctionne avec un câble et que la batterie est chargée, orientez vers démarreur ou masse. Un test en atelier tranche en minutes.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on rouler avec un démarreur fatigué ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tant que ça démarre encore, oui sur courtes distances — mais la panne totale peut survenir du jour au lendemain.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte un démarreur neuf ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent 250 à 550 € TTC pièce + pose sur citadine/compacte, variable selon motorisation et accessibilité.",
          },
        },
      ],
    },
  },
  "compresseur-clim-mort-symptomes": {
    directAnswer: {
      question: "Comment savoir si le compresseur clim est mort ?",
      answer:
        "Air tiède malgré le minimum, bruit métallique à l'enclenchement, compresseur qui ne tourne pas ou clim qui se coupe : faites contrôler pressions et étanchéité avant toute recharge.",
      facts: [
        { label: "Recharge seule", value: "80–200 € (circuit étanche)" },
        { label: "Compresseur + recharge", value: "450–1 200 € (indicatif)" },
      ],
    },
    relatedLinks: [
      { url: "/reparation-climatisation-ivry/", label: "Réparation clim Ivry" },
      { url: "/blog/prix-recharge-climatisation-94/", label: "Prix recharge clim" },
      { url: "/contact/", label: "Prendre rendez-vous" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on recharger la clim si le compresseur est HS ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non : sans compresseur fonctionnel, le fluide ne refroidit pas. Il faut réparer ou remplacer le compresseur et corriger toute fuite avant recharge.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte le remplacement d'un compresseur de clim ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sur une voiture courante, comptez souvent 450 à 1 200 € TTC (compresseur + recharge), selon modèle et fluide R134a ou R1234yf. Un condenseur ou une fuite associée peut augmenter la facture.",
          },
        },
        {
          "@type": "Question",
          name: "Air tiède : compresseur ou simple recharge ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mesure des pressions haute/basse et test commande compresseur tranchent. Recharge sans diagnostic = gaspillage si le compresseur ne compresse plus ou si le circuit fuit.",
          },
        },
      ],
    },
  },
  "rotule-biellette-direction-quand-changer": {
    directAnswer: {
      question: "Quand changer une rotule de direction ?",
      answer:
        "Dès qu'un contrôle au pont montre un jeu supérieur aux tolérances, ou en cas de claquements en braquant et d'usure asymétrique des pneus. Une géométrie est recommandée après remplacement.",
      facts: [
        { label: "Fourchette rotule", value: "80–200 € / côté (indicatif)" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/prestations/rotule-direction/", label: "Rotule de direction" },
      { url: "/pneumatiques/", label: "Géométrie & pneus" },
      { url: "/blog/geometrie-roues-signes-mauvais-alignement/", label: "Signes mauvais alignement" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler avec une rotule de direction usée ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Un jeu léger peut sembler tolérable, mais l'usure accélère les pneus, dégrade la géométrie et peut provoquer une contre-visite au contrôle technique. Mieux vaut remplacer dès que le jeu dépasse les tolérances.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il faire une géométrie après changement de rotule ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, toute intervention sur le train avant (rotule, triangle, amortisseur) justifie un contrôle de géométrie. Sans réglage, les pneus s'usent en biais en quelques milliers de kilomètres.",
          },
        },
      ],
    },
  },
  "decalaminage-moteur-utile-ou-arnaque": {
    directAnswer: {
      question: "Le décalaminage moteur est-il utile ?",
      answer: "Utile en préventif ou si admission/EGR encrassés après diagnostic — pas comme forfait systématique. Inutile si FAP saturé, turbo HS ou injecteurs défaillants sans traiter la cause.",
      facts: [
        {
          label: "Fourchette",
          value: "80 – 250 € selon méthode",
        },
        {
          label: "Atelier",
          value: "RED-K MOTORS · Ivry",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/prestations/decalaminage-moteur/",
        label: "Décalaminage moteur",
      },
      {
        url: "/blog/fap-dpf-encrasse-trajets-ville/",
        label: "FAP encrassé",
      },
      {
        url: "/diagnostic/",
        label: "Diagnostic auto",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Le décalaminage réduit-il la consommation ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Parfois légèrement si l'encrassement était réel, mais aucune méthode ne garantit −30 %. Méfiez-vous des promesses miracles.",
          },
        },
        {
          "@type": "Question",
          name: "Hydrogène ou additif : lequel choisir ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cela dépend du niveau d'encrassement et du moteur. Un diagnostic préalable détermine la méthode adaptée.",
          },
        },
        {
          "@type": "Question",
          name: "Le décalaminage remplace-t-il un nettoyage FAP ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non : FAP saturé = traitement FAP dédié. Le décalaminage admission ne suffit pas à décolmater un filtre très chargé.",
          },
        },
      ],
    },
  },
  "crevaison-reparer-ou-changer-pneu": {
    directAnswer: {
      question: "Crevaison : réparer ou changer le pneu ?",
      answer: "Réparation possible si perforation dans la bande de roulement (≤ 6 mm), pneu non roulé à plat et usure suffisante. Flanc, herse ou runflat roulé à plat : changement obligatoire.",
      facts: [
        {
          label: "Réparation",
          value: "25 – 45 € indicatif",
        },
        {
          label: "Atelier",
          value: "RED-K MOTORS · Ivry (94)",
        },
      ],
    },
    relatedLinks: [
      {
        url: "/pneumatiques/",
        label: "Pneumatiques",
      },
      {
        url: "/prestations/reparation-crevaison/",
        label: "Réparation crevaison",
      },
      {
        url: "/blog/quand-changer-pneus-usure-securite/",
        label: "Usure des pneus",
      },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on réparer une crevaison sur le flanc ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non : la réparation sur flanc est interdite pour des raisons de sécurité. Le pneu doit être remplacé.",
          },
        },
        {
          "@type": "Question",
          name: "Un kit anti-crevaison suffit-il ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non durablement : la mousse dépanne pour rejoindre un garage. Faites contrôler le pneu en atelier ensuite.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte une réparation de crevaison ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Comptez souvent 25 à 45 € pour une réparation professionnelle avec contrôle, bien moins qu'un pneu neuf.",
          },
        },
      ],
    },
  },
  "voiture-occasion-checklist-achat": {
    directAnswer: {
      question: "Que vérifier avant d'acheter une voiture d'occasion ?",
      answer:
        "Carnet d'entretien, CT récent, distribution/courroie, freins et pneus, niveaux sans fuite, essai route 20–30 min et idéalement un contrôle pré-achat avec valise OBD.",
      facts: [
        { label: "Point critique", value: "Distribution si historique inconnu" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic & contrôle" },
      { url: "/blog/courroie-distribution-quand-changer-94/", label: "Courroie distribution" },
      { url: "/contact/", label: "Prendre rendez-vous" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Faut-il faire contrôler une voiture d'occasion avant achat ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Fortement recommandé. Un contrôle pré-achat (valise OBD, freins, pont, essai route) révèle distribution, FAP, freins ou fuites que l'annonce ne mentionne pas — et permet de renégocier ou d'éviter une mauvaise affaire.",
          },
        },
        {
          "@type": "Question",
          name: "Quel est le point le plus critique sur une occasion ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La distribution (courroie ou chaîne) si l'historique est inconnu au-delà de 100 000 km. Son remplacement peut représenter 800 à 1 500 € selon motorisation — à chiffrer avant de signer.",
          },
        },
      ],
    },
  },
  "revision-kilometrage-usage-urbain-94": {
    directAnswer: {
      question: "À quelle fréquence vidanger en usage urbain ?",
      answer:
        "En trajets courts (Ivry, Paris, 94), comptez souvent 10 000–15 000 km ou maximum 12 mois entre deux vidanges — même si le constructeur annonce plus en km.",
      facts: [
        { label: "Règle pratique", value: "12 mois max en urbain" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/vidange/", label: "Vidange moteur" },
      { url: "/revision-voiture-ivry/", label: "Révision Ivry" },
      { url: "/blog/combien-temps-entre-deux-vidanges/", label: "Entre deux vidanges" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "À quelle fréquence vidanger en usage urbain ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En trajets courts (ville, 94), prévoyez souvent une vidange tous les 10 000 à 15 000 km ou maximum 12 mois — même si le constructeur annonce une échéance plus longue en kilomètres.",
          },
        },
        {
          "@type": "Question",
          name: "Pourquoi l'huile s'use plus vite en ville ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le moteur reste longtemps à température partielle, ce qui favorise la condensation dans l'huile et l'encrassement. Start & Stop, embrayage et freinage répétés sollicitent aussi batterie, FAP (diesel) et plaquettes sans rouler beaucoup de km.",
          },
        },
      ],
    },
  },
};
