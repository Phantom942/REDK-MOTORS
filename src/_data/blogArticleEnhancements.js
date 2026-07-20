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
        { label: "Chez RED-K MOTORS", value: "Devis gratuit · lun–sam 9h–19h" },
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
            text: "Chez RED-K MOTORS, le diagnostic peut être déduit de la facture de réparation si vous confiez les travaux à l'atelier — demandez-le lors du devis.",
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
      ],
    },
  },
  "garage-independant-vs-concessionnaire": {
    directAnswer: {
      question: "Garage indépendant ou concessionnaire : que choisir ?",
      answer:
        "Le concessionnaire convient pour la garantie constructeur stricte. Un garage indépendant multimarque offre souvent de meilleurs tarifs, plus de flexibilité et un interlocuteur unique pour l'entretien courant.",
      facts: [
        { label: "RED-K MOTORS", value: "Garage indépendant · toutes marques" },
        { label: "Devis", value: "Gratuit avant travaux" },
      ],
    },
    relatedLinks: [
      { url: "/garage-ivry-sur-seine/", label: "Notre garage à Ivry" },
      { url: "/processus/", label: "Comment ça se passe" },
      { url: "/tarifs/", label: "Tarifs" },
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
            text: "Oui, à condition d'utiliser des pièces et fluides conformes aux préconisations constructeur et de tamponner le carnet d'entretien.",
          },
        },
      ],
    },
  },
  "controle-technique-2026-nouveautes": {
    directAnswer: {
      question: "Quelles nouveautés pour le contrôle technique en 2026 ?",
      answer:
        "Le CT renforce le contrôle pollution, le bruit et l'électronique embarquée (ADAS, freinage). Un entretien préalable (éclairage, pneus, freins, niveaux) limite les contre-visites.",
      facts: [
        { label: "Préparation CT", value: "Contrôle pré-CT en atelier" },
        { label: "Garage", value: "RED-K MOTORS · 94" },
      ],
    },
    relatedLinks: [
      { url: "/entretien/", label: "Entretien & révision" },
      { url: "/blog/5-points-controle-avant-ct-ivry/", label: "5 points avant le CT" },
      { url: "/contact/", label: "Contrôle pré-CT" },
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
            text: "Oui : vérifiez éclairage, pneus, freins, essuie-glaces et niveaux. Un passage atelier avant le CT réduit le risque de contre-visite.",
          },
        },
      ],
    },
  },
  "5-points-controle-avant-ct-ivry": {
    directAnswer: {
      question: "Que vérifier avant le contrôle technique à Ivry ?",
      answer:
        "Contrôlez les feux, l'état des pneus, le freinage, les niveaux et l'échappement. Ces cinq points représentent une large part des refus au CT.",
      facts: [
        { label: "Local", value: "Centres CT proches d'Ivry-sur-Seine" },
        { label: "Aide atelier", value: "RED-K MOTORS · devis gratuit" },
      ],
    },
    relatedLinks: [
      { url: "/pneumatiques/", label: "Pneus" },
      { url: "/freins/", label: "Freinage" },
      { url: "/entretien/", label: "Révision" },
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
            text: "Le tarif est fixé par le centre agréé. Éviter la contre-visite en corrigeant les défauts majeurs avant le premier passage est le plus économique.",
          },
        },
      ],
    },
  },
  "entretien-voiture-eviter-pannes-ivry": {
    directAnswer: {
      question: "Comment éviter les pannes avec un entretien régulier ?",
      answer:
        "Respectez vidanges, filtres, courroie de distribution, batterie et freinage selon le carnet. Un entretien préventif coûte toujours moins qu'une casse moteur ou boîte.",
      facts: [
        { label: "Horaires", value: "Lun–sam 9h–19h" },
        { label: "Adresse", value: "9 rue Michelet, Ivry-sur-Seine" },
      ],
    },
    relatedLinks: [
      { url: "/entretien/", label: "Entretien & révision" },
      { url: "/prestations/", label: "Toutes nos prestations" },
      { url: "/contact/", label: "Planifier un entretien" },
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
            text: "Au minimum : vidange ou contrôle huile, filtres selon intervalle, niveaux, freins, pneus, batterie et éclairage.",
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
      ],
    },
  },
  "rayure-carrosserie-quand-reparer": {
    directAnswer: {
      question: "Faut-il réparer une rayure sur la carrosserie ?",
      answer:
        "Rayure profonde jusqu'au métal ou bosse : réparez vite pour éviter la rouille. Rayure légère sur vernis : souvent esthétique, mais un polissage ou retouche localisée protège la peinture.",
      facts: [
        { label: "Atelier", value: "Carrosserie & peinture · Ivry" },
        { label: "Devis", value: "Gratuit" },
      ],
    },
    relatedLinks: [
      { url: "/carrosserie/", label: "Carrosserie" },
      { url: "/prestations/peinture-localisee/", label: "Peinture localisée" },
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
            text: "Oui, dès que la couche de protection est entamée et que le métal est exposé à l'humidité, surtout en hiver ou près de la mer.",
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
        { label: "Devis", value: "Écrit avant intervention" },
      ],
    },
    relatedLinks: [
      { url: "/entretien/", label: "Entretien & révision" },
      { url: "/tarifs/", label: "Tarifs" },
      { url: "/processus/", label: "Déroulement en atelier" },
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
            text: "En dehors de la période de garantie constructeur, oui. Pendant la garantie, vérifiez les conditions du constructeur ; un entretien conforme au carnet est en général accepté.",
          },
        },
      ],
    },
  },
  "courroie-distribution-quand-changer-94": {
    directAnswer: {
      question: "Quand changer la courroie de distribution ?",
      answer:
        "Suivez l'intervalle constructeur (souvent 100 000 à 160 000 km ou 5 à 10 ans). Ne repoussez pas : une courroie qui casse peut détruire le moteur sur de nombreux modèles.",
      facts: [
        { label: "Risque", value: "Cas moteur possible si rupture" },
        { label: "Prestation", value: "Distribution · RED-K MOTORS 94" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/exemples/prix-courroie-distribution/", label: "Guide prix distribution" },
      { url: "/tarifs/", label: "Grille tarifaire" },
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
            text: "Non : une chaîne est lubrifiée en continu et dure souvent plus longtemps, mais elle se contrôle au bruit et à l'allongement. Une courroie se remplace par intervalle.",
          },
        },
      ],
    },
  },
  "fumee-blanche-echappement-que-faire": {
    directAnswer: {
      question: "Que signifie une fumée blanche à l'échappement ?",
      answer:
        "Légère fumée blanche au démarrage par froid : souvent normale (condensation). Fumée blanche persistante, odeur de sucre ou surchauffe : faites diagnostiquer (joint de culasse, injecteurs, etc.).",
      facts: [
        { label: "Urgence", value: "Arrêt si surchauffe ou grosse fumée continue" },
        { label: "Diagnostic", value: "50–100 € · Ivry-sur-Seine" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic auto" },
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/contact/", label: "Prendre rendez-vous" },
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
            text: "En général non si elle disparaît après quelques minutes de roulage par temps froid. Si elle reste dense à chaud, consultez un garage.",
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
        { label: "Garage", value: "RED-K MOTORS · multimarque" },
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
          name: "Le broutage peut-il venir du carburant ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Un carburant de mauvaise qualité ou un mauvais mélange peut provoquer des ratés, mais on vérifie d'abord allumage, admission et injection.",
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
        { label: "Atelier", value: "Purge frein · RED-K MOTORS Ivry" },
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
      answer:
        "Voiture qui tire sur un côté, volant de travers à plat, pneus usés de façon irrégulière ou vibrations : faites contrôler parallélisme et géométrie, surtout après un trottoir ou un choc.",
      facts: [
        { label: "Usure légale pneu", value: "1,6 mm minimum (témoin d'usure)" },
        { label: "Prestation", value: "Géométrie · Ivry-sur-Seine (94)" },
      ],
    },
    relatedLinks: [
      { url: "/pneumatiques/", label: "Pneus & géométrie" },
      { url: "/blog/quand-changer-pneus-usure-securite/", label: "Usure des pneus" },
      { url: "/contact/", label: "Contrôle géométrie" },
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
            text: "Lors d'un changement de pneus, après un choc à une roue, ou dès les premiers signes d'usure asymétrique — pas de calendrier fixe, mais un contrôle annuel est prudent en usage urbain.",
          },
        },
      ],
    },
  },
  "amortisseurs-usures-symptomes": {
    directAnswer: {
      question: "Quels sont les signes d'amortisseurs usés ?",
      answer:
        "Rebonds excessifs, freinage instable, aquaplaning plus fréquent, usure en « vague » des pneus ou bruits de claquement : les amortisseurs fatigués dégradent freinage et tenue de route.",
      facts: [
        { label: "Contrôle", value: "Lors de chaque révision ou changement pneus" },
        { label: "Garage", value: "RED-K MOTORS · mécanique" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/pneumatiques/", label: "Pneus" },
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
            text: "Oui, on remplace au minimum par essieu (avant ou arrière) pour garder un comportement équilibré et une usure régulière des pneus.",
          },
        },
      ],
    },
  },
  "filtre-habitacle-pollen-quand-changer": {
    directAnswer: {
      question: "Quand changer le filtre d'habitacle ?",
      answer:
        "En général tous les 15 000 à 30 000 km ou une fois par an, selon le carnet. Un filtre encrassé réduit le débit de clim/chauffage et laisse passer pollens et poussières.",
      facts: [
        { label: "Signes", value: "Odeur moisi · air faible · buée lente" },
        { label: "Prestation", value: "Entretien clim · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/entretien/", label: "Entretien" },
      { url: "/blog/climatisation-voiture-recharge-ivry/", label: "Recharge clim" },
      { url: "/contact/", label: "Rendez-vous" },
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
            text: "Oui, il s'agit du filtre qui nettoie l'air entrant dans l'habitacle. Les versions « charbon actif » filtrent aussi mieux les odeurs.",
          },
        },
      ],
    },
  },
  "embrayage-qui-patine-causes": {
    directAnswer: {
      question: "Pourquoi l'embrayage patine ?",
      answer:
        "Usure du disque, huile ou graisse sur le volant, ressort faible ou conduite agressive en côte : le moteur monte en régime sans que la voiture accélère proportionnellement.",
      facts: [
        { label: "Urgence", value: "Limiter les accélérations · diagnostic rapide" },
        { label: "Atelier", value: "Mécanique · RED-K MOTORS" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique & réparations" },
      { url: "/exemples/prix-embrayage/", label: "Guide prix embrayage" },
      { url: "/tarifs/", label: "Grille tarifaire" },
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
            text: "Sur de courtes distances oui, mais chaque patinage use davantage le disque et peut endommager le volant moteur. Mieux vaut planifier la réparation rapidement.",
          },
        },
      ],
    },
  },
  "fap-dpf-encrasse-trajets-ville": {
    directAnswer: {
      question: "Pourquoi mon FAP s'encrasse en ville ?",
      answer:
        "Les trajets courts empêchent la régénération (passive ou active) de se terminer. Le filtre se colmate, le voyant moteur s'allume et la puissance baisse.",
      facts: [
        { label: "Conseil", value: "20–30 min à régime stable 1×/semaine si usage urbain" },
        { label: "Diagnostic", value: "Valise + mesure colmatage · Ivry" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic diesel" },
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/blog/voyant-moteur-allume-que-faire/", label: "Voyant moteur" },
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
            text: "Souvent oui si le colmatage est modéré : nettoyage par additif, régénération forcée ou décalaminage en atelier. Au-delà d'un certain seuil, le remplacement devient nécessaire.",
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
        { label: "Diagnostic", value: "50–100 € · RED-K MOTORS 94" },
      ],
    },
    relatedLinks: [
      { url: "/freins/", label: "Freinage" },
      { url: "/diagnostic/", label: "Diagnostic électronique" },
      { url: "/diagnostic-voyant-moteur-94/", label: "Voyant moteur & diagnostic" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Le voyant ABS et le voyant frein : même problème ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pas toujours. Le voyant frein peut signaler un niveau bas ou le frein à main ; le voyant ABS concerne le système antiblocage. Un diagnostic valise identifie la cause exacte.",
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
        { label: "Devis", value: "Gratuit · lun–sam 9h–19h" },
      ],
    },
    relatedLinks: [
      { url: "/entretien/", label: "Entretien & révision" },
      { url: "/blog/revision-constructeur-que-comprend-vraiment-service/", label: "Révision constructeur" },
      { url: "/tarifs/", label: "Tarifs" },
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
            text: "Uniquement si l'intervalle constructeur le prévoit à ce kilométrage. Sur certains moteurs c'est 90 000 ou 120 000 km — vérifiez le carnet avant d'intervenir.",
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
        { label: "Atelier", value: "Carrosserie RED-K MOTORS · Ivry" },
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
      answer:
        "Air dans le circuit, liquide de frein usé, fuite, étrier grippé ou disques voilés : la pédale manque de fermeté. Faites contrôler le freinage avant de reprendre la route longue distance.",
      facts: [
        { label: "Priorité", value: "Sécurité — diagnostic freinage urgent" },
        { label: "Atelier", value: "RED-K MOTORS · 9 rue Michelet Ivry" },
      ],
    },
    relatedLinks: [
      { url: "/freins/", label: "Freinage" },
      { url: "/blog/liquide-frein-quand-changer/", label: "Liquide de frein" },
      { url: "/blog/plaquettes-frein-usure-signaux-a-ne-pas-ignorer/", label: "Plaquettes usées" },
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
            text: "Seulement sur de très courtes distances pour rejoindre un garage. Une pédale qui s'enfonce anormalement indique un défaut de freinage à corriger immédiatement.",
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
        { label: "Atelier", value: "RED-K MOTORS · Ivry-sur-Seine (94)" },
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
      question: "Comment reconnaître des disques de frein voilés ou usés ?",
      answer:
        "Volant ou pédale qui vibre au freinage, bruit métallique, traces bleues ou rainures profondes : les disques voilés ou sous l'épaisseur minimale doivent être remplacés, souvent avec les plaquettes.",
      facts: [
        { label: "Signe fréquent", value: "Vibration au freinage" },
        { label: "Sécurité", value: "Contrôle freinage avant long trajet" },
      ],
    },
    relatedLinks: [
      { url: "/freins/", label: "Freinage" },
      { url: "/blog/plaquettes-frein-usure-signaux-a-ne-pas-ignorer/", label: "Plaquettes usées" },
      { url: "/blog/freinage-mou-pedale-spongieuse/", label: "Pédale spongieuse" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rectifier des disques voilés ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le rectifiage est possible si l'épaisseur reste au-dessus du minimum constructeur. Au-delà, ou si les disques sont trop usés, le remplacement est obligatoire pour garantir l'efficacité du freinage.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il changer les disques et les plaquettes en même temps ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Lors d'un remplacement de disques, des plaquettes neuves sont recommandées pour un contact uniforme. À l'inverse, des plaquettes neuves sur disques très usés accélèrent l'usure.",
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
        { label: "Atelier diesel", value: "RED-K MOTORS · Ivry-sur-Seine (94)" },
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
      { url: "/exemples/prix-plaquettes-frein/", label: "Guide prix freins" },
      { url: "/tarifs/", label: "Grille tarifaire" },
    ],
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
      { url: "/exemples/prix-recharge-climatisation/", label: "Guide prix clim" },
      { url: "/tarifs/", label: "Grille tarifaire" },
    ],
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
      { url: "/exemples/prix-montage-pneus/", label: "Guide prix pneus" },
      { url: "/tarifs/", label: "Grille tarifaire" },
    ],
  },
  "fuite-huile-moteur-causes-que-faire": {
    directAnswer: {
      question: "Que faire en cas de fuite d'huile moteur ?",
      answer:
        "Contrôlez le niveau à froid. Petite tache sans voyant rouge : roulez prudemment et prenez rendez-vous. Voyant huile rouge, niveau sous le MIN ou flaque qui grossit : arrêtez-vous et faites diagnostiquer avant de reprendre la route.",
      facts: [
        { label: "Urgence", value: "Voyant rouge / niveau trop bas = stop" },
        { label: "Garage", value: "RED-K MOTORS · Ivry-sur-Seine (94)" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique & réparations" },
      { url: "/vidange/", label: "Vidange moteur" },
      { url: "/blog/combien-coute-vidange-voiture/", label: "Prix d'une vidange" },
      { url: "/contact/", label: "Prendre rendez-vous" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler avec une fuite d'huile ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui uniquement si la fuite est légère, le niveau reste correct et aucun voyant rouge n'est allumé. Surveillez le niveau et faites localiser la fuite rapidement. En cas de doute, ne prenez pas le risque.",
          },
        },
        {
          "@type": "Question",
          name: "Quelles sont les causes d'une tache d'huile sous la voiture ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les causes fréquentes sont le joint de carter, le joint de cache-culbuteurs, un joint spy, un filtre à huile mal monté ou une fuite liée au turbo / durites d'huile.",
          },
        },
        {
          "@type": "Question",
          name: "Combien coûte la réparation d'une fuite d'huile ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le prix dépend de la pièce : un joint de cache-culbuteurs coûte nettement moins cher qu'un joint spy arrière. Chez RED-K MOTORS à Ivry, le devis est gratuit avant intervention.",
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
      answer:
        "La fumée bleue indique en général que le moteur brûle de l'huile (segments, guides de soupapes, turbo, ou joint). Ce n'est pas de la condensation : faites diagnostiquer avant une casse moteur ou un catalyseur / FAP encrassé.",
      facts: [
        { label: "Signification", value: "Huile brûlée dans la combustion" },
        { label: "Atelier", value: "Diagnostic · RED-K MOTORS Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic auto" },
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/blog/consommation-huile-anormale-causes/", label: "Consommation d'huile anormale" },
      { url: "/blog/fumee-blanche-echappement-que-faire/", label: "Fumée blanche à l'échappement" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Fumée bleue ou fumée blanche : quelle différence ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La fumée bleue pointe vers l'huile brûlée. La fumée blanche dense (surtout à chaud) peut indiquer du liquide de refroidissement (joint de culasse). Une légère fumée blanche au démarrage froid est souvent de la condensation.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on rouler avec une fumée bleue ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sur de très courtes distances seulement, en surveillant le niveau d'huile. Une surconsommation peut provoquer un grippage moteur. Prenez rendez-vous rapidement chez RED-K MOTORS à Ivry.",
          },
        },
        {
          "@type": "Question",
          name: "Le turbo peut-il causer une fumée bleue ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : un joint de turbo usé laisse passer l'huile dans l'admission ou l'échappement. Le diagnostic croise niveau d'huile, bruit de sifflement et pression de suralimentation.",
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
        { label: "Atelier", value: "Diagnostic moteur · Ivry (94)" },
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
        { label: "Atelier", value: "Train avant · Ivry-sur-Seine (94)" },
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
            text: "Équilibrage et état des pneus (usure, hernie), puis jantes. Si le problème persiste, géométrie et silentblocs. Chez RED-K MOTORS à Ivry, on enchaîne contrôle pneus puis train avant.",
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
        { label: "Atelier", value: "Circuit de charge · Ivry (94)" },
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
        { label: "Atelier", value: "Pare-brise · RED-K MOTORS Ivry" },
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
        "Pour une voiture courante en 2026, comptez souvent 450 à 900 € (kit + main-d'œuvre), et plutôt 650 à 1 400 € si la pompe à eau est remplacée en même temps. Devis ferme après diagnostic chez RED-K MOTORS à Ivry.",
      facts: [
        { label: "Fourchette kit", value: "450–900 €" },
        { label: "Avec pompe à eau", value: "650–1 400 €" },
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
            text: "Chez RED-K MOTORS, le devis précise pièce conforme, pose, contrôle de charge et reprise de l'ancienne batterie — comparez ce périmètre, pas seulement le prix magasin.",
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
        "Complétez avec de l'AdBlue conforme dès que possible et respectez l'autonomie affichée. Niveau trop bas, qualité médiocre ou panne de pompe / capteur peut immobiliser le diesel Euro 6. Ne videz pas le réservoir jusqu'à la panne.",
      facts: [
        { label: "Risque", value: "Immobilisation si niveau critique" },
        { label: "Atelier diesel", value: "RED-K MOTORS · Ivry (94)" },
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
      answer:
        "Suivez l'intervalle constructeur (souvent 20 000 à 40 000 km selon modèles) ou plus tôt si démarrages difficiles, perte de puissance, à-coups diesel. Un filtre saturé protège mal la pompe HP et les injecteurs.",
      facts: [
        { label: "Intervalle courant", value: "Selon carnet (souvent 20–40 000 km)" },
        { label: "Garage", value: "Diesel · RED-K MOTORS Ivry" },
      ],
    },
    relatedLinks: [
      { url: "/entretien/", label: "Entretien" },
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/blog/injecteurs-encrasses-symptomes/", label: "Injecteurs encrassés" },
      { url: "/vidange/", label: "Vidange" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Quels symptômes d'un filtre à gasoil colmaté ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Démarrages difficiles à froid, trous à l'accélération, perte de puissance, parfois voyant moteur. Le garage vérifie aussi la présence d'eau dans le filtre.",
          },
        },
        {
          "@type": "Question",
          name: "Faut-il purger le circuit après changement ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui sur de nombreux diesels : un circuit mal purgé empêche le démarrage. L'atelier dispose de la procédure adaptée au véhicule.",
          },
        },
      ],
    },
  },
  "injecteurs-encrasses-symptomes": {
    directAnswer: {
      question: "Quels sont les symptômes d'injecteurs encrassés ?",
      answer:
        "Ratés, ralenti instable, fumée noire, surconsommation, perte de puissance ou broutage : l'injection ne dose plus correctement. Un diagnostic évite de remplacer des injecteurs alors qu'un filtre, une EGR ou des bougies suffisent.",
      facts: [
        { label: "Usage à risque", value: "Ville, trajets courts, gasoil médiocre" },
        { label: "Atelier", value: "Diagnostic injection · Ivry (94)" },
      ],
    },
    relatedLinks: [
      { url: "/diagnostic/", label: "Diagnostic auto" },
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/blog/filtre-gasoil-quand-changer/", label: "Filtre à gasoil" },
      { url: "/blog/voiture-broute-acceleration-causes-94/", label: "Voiture qui broute" },
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
            text: "Un encrassement modéré se traite parfois par nettoyage / additif / banc. Des injecteurs HS (fuite, débit hors tolérance) se remplacent. Le diagnostic valise et les mesures décident.",
          },
        },
        {
          "@type": "Question",
          name: "Les injecteurs encrassés allument-ils le voyant moteur ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent oui (ratés, mélange incorrect), mais pas toujours. Une perte de puissance sans voyant mérite aussi un contrôle à Ivry.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on confondre avec une vanne EGR ou un FAP ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui : symptômes proches sur diesel urbain. C'est pourquoi on commence par lecture OBD, filtres et antipollution avant de changer les injecteurs.",
          },
        },
      ],
    },
  },
  "debosselage-sans-peinture-dsp": {
    directAnswer: {
      question: "Quand le débosselage sans peinture (DSP) est-il possible ?",
      answer:
        "Bosses légères (grêle, coup de portière) sans peinture écaillée ni pli marqué : le DSP repousse la tôle depuis l'intérieur. Rayure jusqu'au métal, pli vif ou peinture fissurée : carrosserie / peinture classique.",
      facts: [
        { label: "Idéal pour", value: "Bosses sans atteinte du vernis" },
        { label: "Atelier", value: "Carrosserie · RED-K MOTORS Ivry" },
      ],
    },
    relatedLinks: [
      { url: "/carrosserie/", label: "Carrosserie" },
      { url: "/blog/rayure-carrosserie-quand-reparer/", label: "Rayure carrosserie" },
      { url: "/blog/peinture-localisee-retouche-carrosserie/", label: "Peinture localisée" },
      { url: "/contact/", label: "Devis DSP" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Le DSP est-il moins cher qu'une peinture ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Souvent oui, car on ne repeint pas le panneau. Le devis dépend du nombre et de l'accès aux bosses. RED-K MOTORS à Ivry chiffre après inspection.",
          },
        },
        {
          "@type": "Question",
          name: "Le DSP laisse-t-il des traces ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bien réalisé, le résultat est très discret. Sur aluminium ou zones très tendues, les limites sont expliquées avant intervention.",
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
        { label: "Atelier", value: "Peinture · Ivry-sur-Seine (94)" },
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
      answer:
        "Niveau d'huile de direction bas (hydraulique), courroie qui glisse, pompe fatiguée, ou assistance électrique en défaut : une direction dure ou qui grince se contrôle avant qu'elle ne bloque. Arrêtez-vous si le braquage devient très difficile.",
      facts: [
        { label: "Urgence", value: "Direction très dure = stop prudent" },
        { label: "Atelier", value: "RED-K MOTORS · Ivry-sur-Seine" },
      ],
    },
    relatedLinks: [
      { url: "/mecanique/", label: "Mécanique" },
      { url: "/diagnostic/", label: "Diagnostic" },
      { url: "/blog/courroie-accessoires-symptomes-usure/", label: "Courroie d'accessoires" },
      { url: "/contact/", label: "Prendre rendez-vous" },
    ],
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Peut-on rouler avec une direction qui grince ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sur de courtes distances pour rejoindre le garage, en évitant les manœuvres forcées. Un manque de fluide ou une pompe qui lâche peut faire perdre l'assistance.",
          },
        },
        {
          "@type": "Question",
          name: "Direction électrique et hydraulique : mêmes causes ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non. L'hydraulique dépend du fluide, de la pompe et de la courroie. L'électrique dépend de l'alimentation, du calculateur et du moteur d'assistance — la valise est souvent nécessaire.",
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
};
