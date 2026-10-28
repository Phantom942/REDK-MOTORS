/**
 * Texte SEO unique par page ville indexable — FAQ, highlights et accroches locales.
 */
const site = require("./site.json");
const googleReviewCount = site.googleReviews?.count ?? 0;

module.exports = {
  "garage-ivry": {
    seoTitle: "Garage Ivry-sur-Seine — adresse & accès (94200)",
    seoParagraphs: [
      `Vous cherchez un garage à Ivry ou Ivry-sur-Seine ? RED-K MOTORS est un garage automobile multimarque au 9 rue Michelet, 94200. Note Google 4,9/5 (${googleReviewCount} avis). Lun–sam 9h–19h · 06 48 74 56 68 · parking dépôt sur place.`,
      "Diagnostic OBD, vidange, freins, pneus/géométrie, clim, distribution, embrayage, carrosserie, pare-brise. Devis écrit avant travaux.",
      "Point d'accès pour Vitry, Villejuif, Paris 13, Charenton, Maisons-Alfort. Multimarque essence/diesel. RDV recommandé.",
    ],
    seoFooter: "Plan et formulaire : redkmotors.fr/contact/ — WhatsApp pour photos et premier avis.",
    heroDesc:
      "Atelier au 9 rue Michelet, 94200 Ivry-sur-Seine. Diagnostic, freins, pneus, clim, carrosserie — devis écrit avant travaux. Parking pour dépôt de véhicule sur place.",
    introHeading: "Garage Ivry — adresse & accès",
    introText:
      "L'atelier RED-K MOTORS est votre garage à Ivry-sur-Seine : 9 rue Michelet, 94200, au cœur de la ville. Parking pour dépôt de véhicule sur place. Vous parlez directement avec l'équipe atelier pour le devis et le suivi — pas de centre d'appels.",
    highlights: [
      "Adresse : 9 rue Michelet, 94200",
      "Parking pour dépôt de véhicule sur place",
      "Devis écrit avant toute intervention",
      "Lun–sam 9h–19h — fermé dimanche",
    ],
    faqs: [
      {
        question: "Quel garage choisir à Ivry-sur-Seine ?",
        answer:
          "RED-K MOTORS, 9 rue Michelet (94200) : garage multimarque avec diagnostic, freins, pneus, clim et carrosserie. Environ 4,9/5 sur Google, devis écrit avant travaux, parking dépôt sur place. RDV : 06 48 74 56 68 ou redkmotors.fr/contact/.",
      },
      {
        question: "Quels sont vos horaires à Ivry ?",
        answer:
          "Lundi au samedi, 9h–19h, sans coupure. Fermé le dimanche. RDV conseillé pour garantir un créneau.",
      },
      {
        question: "Y a-t-il un parking pour déposer le véhicule ?",
        answer:
          "Oui — parking pour dépôt de véhicule sur place au 9 rue Michelet. Stationnement possible aussi dans les rues adjacentes.",
      },
      {
        question: "Comment obtenir un devis ?",
        answer:
          "Par téléphone (06 48 74 56 68), WhatsApp ou formulaire contact. Pour la carrosserie, une photo suffit souvent pour une première estimation.",
      },
      {
        question: "Quels moyens de paiement acceptez-vous ?",
        answer:
          "Carte bancaire, espèces et virement. Autres modalités éventuelles : à confirmer avec l'atelier.",
      },
      {
        question: "Où voir vos avis Google et comment laisser le vôtre ?",
        answer:
          "La fiche Google Maps « RED-K MOTORS » au 9 rue Michelet regroupe nos avis clients. Vous pouvez aussi passer par redkmotors.fr/links/ pour l'itinéraire ou laisser un avis après votre passage.",
      },
      {
        question: "Proposez-vous mécanique, diagnostic et carrosserie au même endroit ?",
        answer:
          "Oui — garage multimarque au 9 rue Michelet : diagnostic valise, entretien, freins, pneus, clim, carrosserie et pare-brise. Devis écrit avant travaux.",
      },
    ],
  },
  vitry: {
    seoTitle: "Garage à Ivry, accessible depuis Vitry-sur-Seine",
    seoParagraphs: [
      "RED-K MOTORS n'a pas d'atelier à Vitry : le garage est à Ivry-sur-Seine (9 rue Michelet). Depuis Vitry (Mairie, Stalingrad, bords de Seine), le trajet dépend du trafic et du quartier.",
      "Révision, freins, diagnostic et carrosserie — devis écrit avant travaux.",
      "Plaquettes, pneus, recharge clim : chiffrage après inspection du véhicule, pas au téléphone.",
    ],
    seoFooter: "Plan et RDV : redkmotors.fr/contact/ — WhatsApp pour photos.",
    heroDesc:
      "Atelier unique à Ivry, accessible depuis Vitry. Entretien, freins, diagnostic — devis expliqué avant intervention.",
    introHeading: "Depuis Vitry-sur-Seine",
    introText:
      "Vous roulez souvent entre Vitry et Paris sud ? L'atelier est à Ivry : même équipe, même adresse — pas une succursale Vitry.",
    highlights: [
      "Atelier à Ivry (pas de site Vitry)",
      "Parking pour dépôt de véhicule sur place",
      "Devis écrit avant toute intervention",
      "Lun–sam 9h–19h",
    ],
    faqs: [
      {
        question: "Avez-vous un garage à Vitry ?",
        answer:
          "Non. L'atelier est au 9 rue Michelet à Ivry-sur-Seine. Le temps de trajet depuis Vitry dépend du quartier et du trafic.",
      },
      {
        question: "Puis-je déposer la voiture le matin avant le travail ?",
        answer:
          "Oui, sur RDV. Parking pour dépôt de véhicule sur place à Ivry (9 rue Michelet). Modalités du créneau à confirmer au téléphone.",
      },
      {
        question: "Intervenez-vous sur les véhicules récents (Start-Stop, AdBlue) ?",
        answer:
          "Oui — batterie AGM/EFB, FAP, vanne EGR : on lit les codes et on chiffre après contrôle, pas au téléphone.",
      },
      {
        question: "Comment vous joindre depuis Vitry ?",
        answer: "06 48 74 56 68 ou WhatsApp. Plan et formulaire sur redkmotors.fr/contact/.",
      },
    ],
  },
  "vitry-sur-seine": {
    seoTitle: "Garage Ivry proche Vitry-sur-Seine",
    seoParagraphs: [
      "Pas de succursale à Vitry : l'atelier RED-K MOTORS est à Ivry-sur-Seine. Depuis Mairie, Stalingrad, Les Malassis ou les bords de Seine, l'accès se fait vers le 9 rue Michelet à Ivry.",
      "Révision, freins, diagnostic diesel (FAP, EGR, AdBlue), carrosserie et pare-brise : même équipe qu'à Ivry-centre.",
      "Dépôt sur RDV — parking pour dépôt de véhicule sur place à Ivry. Rappel avant validation des travaux.",
    ],
    seoFooter: "Itinéraire via Ivry-centre — créneau sur rendez-vous.",
    heroDesc:
      "Depuis Vitry, direction l'atelier Ivry (9 rue Michelet). Entretien, freins, diagnostic — devis avant intervention.",
    introHeading: "Vitry-sur-Seine → atelier Ivry",
    introText:
      "Si vous cherchez un garage sans traverser Paris intra-muros, l'adresse rue Michelet à Ivry est un point d'accès pratique : atelier indépendant, parking pour dépôt de véhicule sur place, suivi direct avec l'équipe.",
    highlights: [
      "Adresse unique : 9 rue Michelet, Ivry",
      "Parking pour dépôt de véhicule sur place",
      "Devis écrit — aucune pièce sans accord",
      "Lun–sam 9h–19h",
    ],
    faqs: [
      {
        question: "Pourquoi aller à Ivry plutôt qu'un garage à Vitry ?",
        answer:
          "C'est notre atelier unique : même équipe, devis détaillé avant travaux, pas de centre d'appels. Vous parlez directement au mécanicien.",
      },
      {
        question: "Intervenez-vous sur les véhicules récents (Start-Stop, AdBlue) ?",
        answer:
          "Oui — batterie AGM/EFB, FAP, vanne EGR : lecture codes et chiffrage après contrôle physique, pas au téléphone.",
      },
      {
        question: "Puis-je déposer la voiture avant le travail ?",
        answer:
          "Oui, sur RDV. Parking pour dépôt de véhicule sur place au 9 rue Michelet. Les modalités du créneau se confirment au téléphone.",
      },
      {
        question: "Comment vous joindre depuis Vitry ?",
        answer: "06 48 74 56 68 ou WhatsApp (photos de voyants, pare-brise). Plan sur redkmotors.fr/contact/.",
      },
    ],
  },
  villejuif: {
    seoTitle: "Garage à Ivry, accessible depuis Villejuif",
    seoParagraphs: [
      "RED-K MOTORS n'a pas d'atelier à Villejuif : le garage est à Ivry-sur-Seine (9 rue Michelet). Depuis Louis Aragon, L'Yvette ou le centre, le trajet reste court sans passer par Paris.",
      "Voyant moteur, freins ou révision : valise multimarques et explication claire avant réparation.",
      "Particuliers et professionnels — créneau sur rendez-vous.",
    ],
    seoFooter: "Garage à Ivry, lun–sam 9h–19h — RDV recommandé.",
    heroDesc:
      "Atelier unique à Ivry, accessible depuis Villejuif. Mécanique, entretien, freins — devis avant travaux.",
    introHeading: "Depuis Villejuif",
    introText:
      "Beaucoup de clients viennent de Villejuif pour un suivi atelier direct. Pas de franchise ni d'antenne Villejuif : même adresse, même équipe qu'à Ivry.",
    highlights: [
      "Atelier à Ivry (pas de site Villejuif)",
      "Parking pour dépôt de véhicule sur place",
      "Valise multimarques",
      "Devis détaillé avant validation",
    ],
    faqs: [
      {
        question: "Avez-vous un garage à Villejuif ?",
        answer:
          "Non. L'atelier unique est au 9 rue Michelet à Ivry-sur-Seine. Depuis Villejuif, le trajet est en général de quelques minutes selon le quartier et le trafic.",
      },
      {
        question: "Le garage est-il vraiment plus proche qu'un concessionnaire ?",
        answer:
          "Pour Villejuif, souvent oui : quelques minutes jusqu'à Ivry-centre, sans entrer dans Paris. Parking pour dépôt de véhicule sur place — pratique pour déposer le véhicule le matin sur RDV.",
      },
      {
        question: "Faites-vous la révision sans perdre la garantie ?",
        answer:
          "On suit le carnet constructeur et on note les interventions. Pièces adaptées au véhicule — on vous dit ce qui est obligatoire vs ce qui peut attendre.",
      },
      {
        question: "Comment prendre rendez-vous depuis Villejuif ?",
        answer: "Téléphone, WhatsApp ou formulaire contact. Réponse en général dans la journée ouvrée.",
      },
    ],
  },
  paris13: {
    seoTitle: "Garage proche Paris 13e",
    seoParagraphs: [
      "Limitrophe du 13e : atelier Ivry accessible depuis Nation, Porte de Choisy ou Porte d'Ivry sans rentrer dans Paris.",
      "Pneus, freins, clim, pare-brise : prestations complètes avec pièces adaptées au modèle.",
      "Devis écrit — pas d'intervention sans votre accord.",
    ],
    seoFooter: "Accès périph' ou Ivry-centre — lun–sam 9h–19h.",
    heroDesc:
      "Sud du 13e : l'atelier est à Ivry, à deux pas du périph'. Entretien, freins, diagnostic sans galère de stationnement parisien.",
    introHeading: "Depuis Paris 13e",
    introText:
      "Stationner un véhicule en réparation dans Paris coûte cher et prend du temps. Beaucoup de conducteurs du 13e passent par Ivry : même métro ( ligne 7 ), moins de stress pour récupérer la voiture.",
    highlights: [
      "Accès depuis Porte d'Ivry / Choisy",
      "Pas de surcoût « intra-muros »",
      "Pare-brise et carrosserie sur devis photo",
      "Lun–sam 9h–19h",
    ],
    faqs: [
      {
        question: "Comment venir depuis le 13e sans voiture ?",
        answer:
          "Métro ligne 7 jusqu'à Ivry — l'atelier est à quelques minutes à pied du 9 rue Michelet. On peut aussi convenir d'un créneau dépôt/reprise.",
      },
      {
        question: "Travaillez-vous sur les petites citadines du quotidien parisien ?",
        answer:
          "Oui — Clio, 208, Polo, Sandero… entretien courant et diagnostic. On adapte le devis au modèle, pas un forfait générique.",
      },
      {
        question: "Puis-je envoyer des photos pour un devis carrosserie ?",
        answer: "Oui par WhatsApp — rayure, pare-chocs ou impact pare-brise. Réponse en journée en général.",
      },
      {
        question: "Quels délais pour une révision ?",
        answer:
          "Souvent sous 48 h sur RDV. Vidange express possible le jour même selon charge atelier.",
      },
    ],
  },
  charenton: {
    seoTitle: "Garage proche Charenton-le-Pont",
    seoParagraphs: [
      "Depuis Charenton (Bercy 2, port ou centre), Ivry est à quelques minutes. Carrosserie, mécanique et entretien.",
      "Réparation clim, vidange et diagnostic électronique pour particuliers et pros du secteur.",
    ],
    heroDesc:
      "Entre Charenton et Ivry : atelier accessible en quelques minutes. Mécanique, carrosserie, entretien — devis clair avant travaux.",
    introHeading: "Depuis Charenton-le-Pont",
    introText:
      "Proche de Bercy et du bois de Vincennes, Charenton est bien placé pour déposer un véhicule à Ivry plutôt que dans un garage parisien saturé. On connaît bien les trajets domicile-travail du secteur.",
    highlights: [
      "Accès rapide depuis Charenton / Bercy",
      "Carrosserie : devis photo WhatsApp",
      "Clim et freins — contrôle avant remplacement",
      "Lun–sam 9h–19h",
    ],
    faqs: [
      {
        question: "Combien de temps depuis Charenton ?",
        answer:
          "Souvent 5 à 15 minutes selon l'heure et si vous passez par Ivry-centre ou le port.",
      },
      {
        question: "Faites-vous la carrosserie après un accrochage parking ?",
        answer:
          "Oui — débosselage, peinture localisée, pare-brise. Devis sur photo possible avant de déplacer le véhicule.",
      },
      {
        question: "Proposez-vous un diagnostic avant réparation ?",
        answer:
          "Toujours. On vous explique ce qu'on a trouvé et le prix avant de commander une pièce.",
      },
      {
        question: "Comment obtenir un créneau ?",
        answer: "06 48 74 56 68 ou WhatsApp. Formulaire contact pour les demandes détaillées.",
      },
    ],
  },
  alfortville: {
    seoTitle: "Garage proche Alfortville (~10 min)",
    seoParagraphs: [
      "Pont d'Ivry ou quai Jean Compagnon : comptez environ 10 minutes depuis Alfortville.",
      "Freinage, pneumatiques, distribution et carrosserie — carnet respecté quand c'est possible.",
    ],
    heroDesc:
      "Depuis Alfortville, comptez une dizaine de minutes jusqu'à l'atelier Ivry. Freins, entretien, diagnostic.",
    introHeading: "Depuis Alfortville",
    introText:
      "Alfortville et Ivry se rejoignent facilement par le pont ou les quais. Pratique pour une vidange ou un contrôle frein sans traverser tout le 94.",
    highlights: [
      "~10 min depuis Alfortville",
      "Distribution et embrayage sur devis ferme",
      "Montage pneus été/hiver sur RDV",
      "Lun–sam 9h–19h",
    ],
    faqs: [
      {
        question: "Quel itinéraire le plus simple depuis Alfortville ?",
        answer:
          "Souvent le pont d'Ivry ou le long des quais — GPS vers 9 rue Michelet, 94200 Ivry-sur-Seine.",
      },
      {
        question: "Faites-vous les courroies de distribution ?",
        answer:
          "Oui, kit complet selon moteur. On vérifie l'échéance carnet avant de chiffrer — surtout sur les PureTech ou HDi très présents dans le secteur.",
      },
      {
        question: "Puis-je attendre sur place pendant une vidange ?",
        answer:
          "Oui si le créneau le permet (30 min à 1 h en général). Sinon, dépose le matin et récupération en fin de journée.",
      },
      {
        question: "Comment vous contacter ?",
        answer: "06 48 74 56 68 · WhatsApp · redkmotors.fr/contact/",
      },
    ],
  },
  "maisons-alfort": {
    seoTitle: "Garage proche Maisons-Alfort",
    seoParagraphs: [
      "Conducteurs de Maisons-Alfort : entretien et réparation à Ivry, commune voisine.",
      "Devis écrit — intervention uniquement après votre accord.",
    ],
    heroDesc:
      "Maisons-Alfort et Ivry sont voisins : entretien, freins et diagnostic sans aller loin.",
    introHeading: "Depuis Maisons-Alfort",
    introText:
      "Beaucoup de familles et de pendulaires du secteur passent par notre atelier pour l'entretien annuel ou un freinage avant les vacances. Même interlocuteur du devis à la restitution.",
    highlights: [
      "Commune limitrophe — trajet court",
      "Révision carnet et vidange",
      "Contrôle freins avant long trajet",
      "Lun–sam 9h–19h",
    ],
    faqs: [
      {
        question: "Le garage est-il accessible en transport ?",
        answer:
          "Oui — métro ligne 8 (Maisons-Alfort / Créteil) puis correspondance vers Ivry. En voiture, quelques minutes.",
      },
      {
        question: "Préparez-vous les véhicules avant les départs en vacances ?",
        answer:
          "Freins, pneus, niveaux, clim : on fait un check ciblé sur RDV. Devis si une pièce est à prévoir.",
      },
      {
        question: "Travaillez-vous sur les monospaces familiales ?",
        answer: "Oui — Scenic, 5008, Touran, etc. Devis selon motorisation et carnet.",
      },
      {
        question: "Comment obtenir un devis ?",
        answer: "Téléphone ou WhatsApp en décrivant le symptôme — on vous oriente vers le bon créneau.",
      },
    ],
  },
  "kremlin-bicetre": {
    seoTitle: "Garage proche Kremlin-Bicêtre",
    seoParagraphs: [
      "Atelier multimarque accessible depuis Kremlin-Bicêtre : diagnostic, freins, vidange et pneus.",
      "Essence et diesel — flottes VTC et particuliers.",
    ],
    heroDesc:
      "Depuis Kremlin-Bicêtre, l'atelier Ivry est proche (métro ligne 7 / bus). Entretien et réparation multimarque.",
    introHeading: "Depuis Kremlin-Bicêtre",
    introText:
      "Entre hôpital, université et zones d'activité, le secteur roule beaucoup. On voit souvent des véhicules de fonction et des VTC pour l'entretien rapide entre deux services.",
    highlights: [
      "Proche métro ligne 7",
      "VTC et particuliers",
      "Diagnostic valise multimarques",
      "Lun–sam 9h–19h",
    ],
    faqs: [
      {
        question: "Acceptez-vous les véhicules VTC du secteur ?",
        answer:
          "Oui — entretien courant, freins, pneus. Créneaux adaptés si vous roulez beaucoup.",
      },
      {
        question: "Mon voyant s'allume en route : puis-je passer sans RDV ?",
        answer:
          "Appelez d'abord — on vous dit si on peut vous prendre dans la journée ou le lendemain.",
      },
      {
        question: "Faites-vous les pneus et la géométrie ?",
        answer:
          "Montage, équilibrage, parallélisme si le volant tire ou si les pneus s'usent de travers.",
      },
      {
        question: "Où est l'atelier exactement ?",
        answer: "9 rue Michelet, 94200 Ivry-sur-Seine — plan sur redkmotors.fr/contact/.",
      },
    ],
  },
  revision94Seo: {
    seoTitle: "Garage dans le Val-de-Marne (94)",
    seoParagraphs: [
      "Révision, entretien, diagnostic et réparations courantes pour tout le 94. Atelier basé à Ivry-sur-Seine, 9 rue Michelet.",
      "Vidange, filtres, freinage, climatisation : devis clair et compte-rendu après intervention.",
    ],
    seoFooter: "Recherche « garage 94 » ou « révision Val-de-Marne » : RED-K MOTORS vous répond en journée.",
    highlights: [
      "Atelier central dans le 94 (Ivry)",
      "Révision carnet ou entretien ciblé",
      "Devis avant travaux",
      "Lun–sam 9h–19h",
    ],
  },
};
