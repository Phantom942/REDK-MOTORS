/**
 * Contenu des landing pages — services + Google Ads.
 * URLs campagnes : adLandingUrls.js
 */
const TARIFS_FAQ =
  "Consultez notre grille tarifaire sur redk-motors.me/tarifs/ — devis fermé après inspection au véhicule.";

const PROCESS_STEPS = [
  { title: "Contactez-nous", desc: "Téléphone, WhatsApp ou formulaire — réponse en journée lun–sam 9h–19h." },
  { title: "Devis clair", desc: "Inspection au véhicule, explication et chiffrage avant toute intervention." },
  { title: "Intervention validée", desc: "Les travaux démarrent uniquement après votre accord." },
];

const CTA = "Appeler le 06.48.74.56.68";

module.exports = {
  diagnostic: {
    videoSrc: "mecanique.mp4",
    heroKicker: "Urgence · Ivry-sur-Seine (94)",
    heroTitle: "Voyant Allumé ou Voiture en Panne à Ivry ? Diagnostic Rapide",
    heroDesc:
      "Ne prenez pas le risque d'aggraver la panne. Nos experts identifient le problème en moins de 45 minutes et vous remettent un devis clair avant toute réparation.",
    heroCtaLabel: CTA,
    reviewCount: 2,
    highlights: [
      "Diagnostic valise multimarques",
      "Résultat expliqué clairement",
      "Devis écrit avant réparation",
      "Réparation possible sur place",
    ],
    prestaHubTitle: "Décrivez vos symptômes pour une estimation rapide",
    prestaHubSubtitle: "Indiquez votre plaque et vos symptômes — on vous rappelle avec une première estimation.",
    processSteps: PROCESS_STEPS,
    services: [
      { title: "Lecture codes défaut OBD", url: "/prestations/diagnostic-voyant-moteur/" },
      { title: "Recherche de panne", url: "/prestations/recherche-de-panne/" },
      { title: "Mécanique après diagnostic", url: "/mecanique/" },
      { title: "Entretien préventif", url: "/entretien/" },
    ],
    faqs: [
      { question: "Combien coûte un diagnostic ?", answer: TARIFS_FAQ },
      { question: "Faut-il prendre rendez-vous ?", answer: "Recommandé pour garantir un créneau. Appel ou WhatsApp — souvent le jour même." },
      { question: "Réparez-vous après le diagnostic ?", answer: "Oui, sur devis validé par vous — pas de remplacement « au hasard »." },
    ],
  },
  freinage: {
    videoSrc: "mecanique.mp4",
    heroKicker: "Sécurité · Freinage Ivry (94)",
    heroTitle: "Freins qui Grincent ou Vibrations ? Diagnostic Freinage à Ivry",
    heroDesc:
      "Ne jouez pas avec votre sécurité. Contrôle usure, devis 100% gratuit et ferme avant toute intervention.",
    heroCtaLabel: CTA,
    symptoms: [
      "Grincement ou sifflement au freinage",
      "Pédale de frein molle",
      "Vibrations dans le volant",
      "Distance d'arrêt anormalement longue",
    ],
    trustNote:
      "Aucun changement abusif. Nous mesurons l'usure réelle de vos disques et plaquettes devant vous.",
    highlights: [
      "Contrôle usure gratuit",
      "Plaquettes et disques toutes marques",
      "Devis ferme avant travaux",
      "Intervention rapide sur RDV",
    ],
    tarifsTeaserLead: "Plaquettes, disques, purge liquide de frein… Montants indicatifs sur notre grille tarifaire.",
    processSteps: PROCESS_STEPS,
    services: [
      { title: "Plaquettes & disques", url: "/prestations/plaquettes-disques/" },
      { title: "Purge liquide de frein", url: "/prestations/purge-liquide-frein/" },
      { title: "Diagnostic ABS", url: "/prestations/diagnostic-abs/" },
      { title: "Pneus & géométrie", url: "/pneumatiques/" },
    ],
    faqs: [
      { question: "Comment savoir si mes freins sont usés ?", answer: "Grincement, pédale molle ou voyant : passez à l'atelier pour un contrôle gratuit." },
      { question: "Combien coûte un changement de plaquettes ?", answer: TARIFS_FAQ },
      { question: "Intervention rapide ?", answer: "Oui, souvent le jour même sur rendez-vous." },
    ],
  },
  revision: {
    videoSrc: "mecanique.mp4",
    heroKicker: "Entretien · Ivry-sur-Seine (94)",
    heroTitle: "Révision & Vidange à Ivry : Préservez votre Garantie Constructeur",
    heroDesc:
      "Entretien rapide selon carnet constructeur. Pièces certifiées et devis gratuit avant intervention.",
    heroCtaLabel: CTA,
    reviewCount: 2,
    highlights: [
      "Carnet d'entretien respecté",
      "Huiles et filtres adaptés au véhicule",
      "Vidange souvent le jour même",
      "Devis gratuit et transparent",
    ],
    tarifsTeaserLead: "Vidange, révision, filtres, climatisation… Consultez nos tarifs indicatifs avant votre RDV.",
    processSteps: PROCESS_STEPS,
    services: [
      { title: "Révision & entretien", url: "/prestations/revision-entretien/" },
      { title: "Vidange moteur", url: "/prestations/vidange-moteur/" },
      { title: "Recharge climatisation", url: "/prestations/recharge-clim/" },
      { title: "Pré-contrôle technique", url: "/prestations/pre-controle-technique/" },
    ],
    faqs: [
      { question: "Respectez-vous le carnet d'entretien ?", answer: "Oui — préconisations constructeur et pièces adaptées quand c'est possible." },
      { question: "Combien coûte une révision ?", answer: TARIFS_FAQ },
      { question: "Comment prendre RDV ?", answer: "06 48 74 56 68, WhatsApp ou contact. Créneau sous 48 h en général." },
    ],
  },
  carrosserie: {
    videoSrc: "carrosserie.mp4",
    heroKicker: "Chocs & sinistres · Ivry (94)",
    heroTitle: "Carrosserie & Pare-Brise à Ivry : Devis Rapide sur Photo",
    heroDesc:
      "Rayure, enfoncement ou impact sur votre vitrage ? Nous redonnons à votre véhicule son aspect d'origine. Prise en charge toutes assurances.",
    heroCtaLabel: CTA,
    whatsappCtaText:
      "Envoyez la photo de vos dégâts par WhatsApp pour une estimation en quelques minutes",
    highlights: [
      "Devis sur photo WhatsApp",
      "Débosselage, peinture, finitions",
      "Teinte constructeur",
      "Documents pour dossier assurance",
    ],
    tarifsTeaserLead: "Carrosserie sur devis — voir aussi nos tarifs mécanique et entretien sur la grille complète.",
    processSteps: PROCESS_STEPS,
    services: [
      { title: "Débosselage sans peinture", url: "/prestations/debosselage/" },
      { title: "Peinture localisée", url: "/prestations/peinture-localisee/" },
      { title: "Pare-brise & vitrage", url: "/prestations/pare-brise-vitrage/" },
      { title: "Retouches & finitions", url: "/prestations/retouches-finitions/" },
    ],
    faqs: [
      { question: "Puis-je envoyer des photos pour un devis ?", answer: "Oui — WhatsApp ou email. On vous répond avec une estimation ou un RDV atelier." },
      { question: "Travaillez-vous avec les assurances ?", answer: "Agrément en cours. On réalise les travaux et vous fournit les documents pour votre dossier." },
      { question: "Quel délai pour une réparation ?", answer: "Annoncé au devis — débosselage rapide, peinture selon disponibilité atelier." },
    ],
  },
  mecanique: {
    videoSrc: "mecanique.mp4",
    heroKicker: "Toutes marques · Devis avant travaux",
    heroTitle: "Garage Mécanique à Ivry — Panne, Distribution, Embrayage",
    heroDesc:
      "Panne, bruit moteur ou perte de puissance ? On identifie la cause, on chiffre, on répare. Essence et diesel, particuliers et pros.",
    heroCtaLabel: CTA,
    highlights: [
      "Diagnostic puis devis écrit",
      "Distribution, embrayage, suspension",
      "Toutes marques essence/diesel",
      "Flottes et professionnels acceptés",
    ],
    processSteps: PROCESS_STEPS,
    services: [
      { title: "Recherche de panne", url: "/prestations/recherche-de-panne/" },
      { title: "Distribution & injection", url: "/prestations/distribution-injection/" },
      { title: "Embrayage", url: "/prestations/embrayage/" },
      { title: "Freinage & suspension", url: "/freins/" },
    ],
    faqs: [
      { question: "Proposez-vous un devis avant les réparations ?", answer: "Oui. Devis écrit gratuit — aucune intervention sans votre validation." },
      { question: "Intervenez-vous sur toutes les marques ?", answer: "Oui, essence et diesel, particuliers et professionnels." },
      { question: "Comment prendre rendez-vous ?", answer: "Par téléphone au 06 48 74 56 68, WhatsApp ou formulaire contact. Lun–sam 9h–19h." },
    ],
  },
  "pare-brise": {
    videoSrc: "carrosserie.mp4",
    heroKicker: "Assurance · Navette possible",
    heroTitle: "Pare-Brise à Ivry — Impact, Bris de Glace & Remplacement",
    heroDesc:
      "Impact ou vitrage fissuré ? Dossier assurance bris de glace accompagné. Navette possible sur Ivry, Vitry et alentours.",
    heroCtaLabel: CTA,
    whatsappCtaText: "Envoyez une photo de l'impact — on vous répond avec la marche à suivre.",
    highlights: [
      "Réparation d'impact ~45 min",
      "Remplacement pare-brise",
      "Dossier assurance bris de glace",
      "Navette à domicile sur le 94",
    ],
    processSteps: PROCESS_STEPS,
    services: [
      { title: "Pare-brise & vitrage", url: "/prestations/pare-brise-vitrage/" },
      { title: "Carrosserie", url: "/carrosserie/" },
      { title: "Débosselage", url: "/prestations/debosselage/" },
      { title: "Peinture localisée", url: "/prestations/peinture-localisee/" },
    ],
    faqs: [
      { question: "L'assurance bris de glace couvre-t-elle le pare-brise ?", answer: "Oui si la garantie figure sur votre contrat. On vous aide pour la déclaration et le devis." },
      { question: "Proposez-vous une navette ?", answer: "Oui — récupération et restitution à domicile sur Ivry, Vitry, Villejuif et alentours." },
      { question: "Puis-je envoyer une photo ?", answer: "Oui par WhatsApp pour lancer le dossier rapidement." },
    ],
  },
  pneumatiques: {
    videoSrc: "mecanique.mp4",
    heroKicker: "Montage · Équilibrage · Parallélisme",
    heroTitle: "Pneus & Géométrie à Ivry — Montage Rapide sur RDV",
    heroDesc:
      "Montage, équilibrage et parallélisme. Stock été/hiver selon arrivages — ou montage de vos pneus. Devis au modèle.",
    heroCtaLabel: CTA,
    highlights: [
      "Montage et équilibrage",
      "Géométrie / parallélisme",
      "Permutation et réparation crevaison",
      "Contrôle usure et pression",
    ],
    processSteps: PROCESS_STEPS,
    services: [
      { title: "Montage & équilibrage", url: "/prestations/montage-equilibrage/" },
      { title: "Géométrie", url: "/prestations/geometrie/" },
      { title: "Permutation pneus", url: "/prestations/permutation-pneus/" },
      { title: "Freinage", url: "/freins/" },
    ],
    faqs: [
      { question: "Fournissez-vous les pneus ?", answer: "Oui — plusieurs marques selon stock. Apportez les vôtres : montage possible." },
      { question: "Combien de temps pour un montage ?", answer: "En général dans la journée sur RDV." },
      { question: "Comment réserver ?", answer: "Appelez avec la dimension de vos pneus : 06 48 74 56 68." },
    ],
  },
  vidange: {
    videoSrc: "mecanique.mp4",
    heroKicker: "Huile constructeur · Filtre neuf",
    heroTitle: "Vidange à Ivry — Rapide, Huile Homologuée Constructeur",
    heroDesc:
      "Vidange moteur avec huile adaptée à votre carnet et contrôle des niveaux. Souvent le jour même sur rendez-vous.",
    heroCtaLabel: CTA,
    highlights: [
      "Huile homologuée constructeur",
      "Filtre à huile neuf",
      "Contrôle niveaux inclus",
      "30 min à 1 h en général",
    ],
    processSteps: PROCESS_STEPS,
    services: [
      { title: "Vidange moteur", url: "/prestations/vidange-moteur/" },
      { title: "Révision complète", url: "/prestations/revision-entretien/" },
      { title: "Filtres air & habitacle", url: "/entretien/" },
      { title: "Diagnostic pré-vidange", url: "/diagnostic/" },
    ],
    faqs: [
      { question: "Quelle huile utilisez-vous ?", answer: "Huile homologuée constructeur selon votre carnet d'entretien." },
      { question: "Combien de temps sans voiture ?", answer: "Comptez 30 minutes à 1 heure en général." },
      { question: "Faut-il un rendez-vous ?", answer: "Recommandé — créneau possible dans la journée. 06 48 74 56 68." },
    ],
  },
};
