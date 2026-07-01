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
    heroKicker: "Diagnostic auto · Ivry-sur-Seine (94)",
    heroTitle: "Diagnostic Auto à Ivry — Voyant Moteur & Panne",
    heroDesc:
      "Voyant allumé, voiture en panne ou bruit suspect ? Diagnostic valise en moins de 45 minutes, devis clair avant toute réparation.",
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
      { title: "Diagnostic voyant moteur", url: "/prestations/diagnostic-voyant-moteur/" },
      { title: "Recherche de panne", url: "/prestations/recherche-de-panne/" },
      { title: "Réparation auto", url: "/mecanique/" },
      { title: "Entretien & révision", url: "/entretien/" },
    ],
    faqs: [
      { question: "Combien coûte un diagnostic auto ?", answer: TARIFS_FAQ },
      { question: "Où faire un diagnostic auto à Ivry ?", answer: "RED-K MOTORS, 9 rue Michelet — lun–sam 9h–19h. Appel ou WhatsApp, souvent le jour même." },
      { question: "Réparez-vous après le diagnostic ?", answer: "Oui, sur devis validé par vous — pas de remplacement « au hasard »." },
    ],
  },
  freinage: {
    videoSrc: "mecanique.mp4",
    heroKicker: "Changement plaquettes · Ivry (94)",
    heroTitle: "Changement Plaquettes de Frein à Ivry",
    heroDesc:
      "Freins qui grincent, pédale molle ou voyant ABS ? Contrôle usure gratuit, changement plaquettes et disques sur devis ferme.",
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
      "Changement plaquettes et disques",
      "Devis ferme avant travaux",
      "Intervention rapide sur RDV",
    ],
    tarifsTeaserLead: "Plaquettes, disques, purge liquide de frein… Montants indicatifs sur notre grille tarifaire.",
    processSteps: PROCESS_STEPS,
    services: [
      { title: "Changement plaquettes de frein", url: "/prestations/plaquettes-disques/" },
      { title: "Purge liquide de frein", url: "/prestations/purge-liquide-frein/" },
      { title: "Diagnostic ABS", url: "/prestations/diagnostic-abs/" },
      { title: "Changement pneus", url: "/pneumatiques/" },
    ],
    faqs: [
      { question: "Combien coûte un changement de plaquettes de frein ?", answer: TARIFS_FAQ },
      { question: "Comment savoir si mes freins sont usés ?", answer: "Grincement, pédale molle ou voyant : passez à l'atelier pour un contrôle gratuit." },
      { question: "Intervention rapide ?", answer: "Oui, souvent le jour même sur rendez-vous — 06 48 74 56 68." },
    ],
  },
  revision: {
    videoSrc: "mecanique.mp4",
    heroKicker: "Révision voiture · Ivry (94)",
    heroTitle: "Révision Voiture & Vidange à Ivry",
    heroDesc:
      "Révision, vidange, filtres et réparation climatisation. Carnet constructeur respecté, devis gratuit avant intervention.",
    heroCtaLabel: CTA,
    reviewCount: 2,
    highlights: [
      "Révision selon carnet constructeur",
      "Vidange huile homologuée",
      "Réparation & recharge clim",
      "Devis gratuit et transparent",
    ],
    tarifsTeaserLead: "Vidange, révision, climatisation… Consultez nos tarifs indicatifs avant votre RDV.",
    processSteps: PROCESS_STEPS,
    services: [
      { title: "Révision voiture", url: "/prestations/revision-entretien/" },
      { title: "Vidange moteur", url: "/prestations/vidange-moteur/" },
      { title: "Réparation climatisation", url: "/prestations/recharge-clim/" },
      { title: "Préparation contrôle technique", url: "/prestations/pre-controle-technique/" },
    ],
    faqs: [
      { question: "Combien coûte une révision voiture ?", answer: TARIFS_FAQ },
      { question: "Faites-vous la réparation climatisation ?", answer: "Oui — diagnostic, recharge et réparation clim. Devis après contrôle du circuit." },
      { question: "Comment prendre RDV ?", answer: "06 48 74 56 68, WhatsApp ou contact. Créneau sous 48 h en général." },
    ],
  },
  carrosserie: {
    videoSrc: "carrosserie.mp4",
    heroKicker: "Réparation carrosserie · Ivry (94)",
    heroTitle: "Réparation Carrosserie à Ivry — Devis sur Photo",
    heroDesc:
      "Rayure, bosse ou choc ? Débosselage, peinture et retouches. Envoyez une photo par WhatsApp pour un devis rapide.",
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
      { question: "Puis-je envoyer des photos pour un devis carrosserie ?", answer: "Oui — WhatsApp ou email. On vous répond avec une estimation ou un RDV atelier." },
      { question: "Travaillez-vous avec les assurances ?", answer: "Agrément en cours. On réalise les travaux et vous fournit les documents pour votre dossier." },
      { question: "Quel délai pour une réparation ?", answer: "Annoncé au devis — débosselage rapide, peinture selon disponibilité atelier." },
    ],
  },
  mecanique: {
    videoSrc: "mecanique.mp4",
    heroKicker: "Réparation auto · Ivry (94)",
    heroTitle: "Réparation Auto à Ivry — Mécanique Générale",
    heroDesc:
      "Panne, embrayage, distribution ou perte de puissance ? Diagnostic, devis écrit et réparation toutes marques essence/diesel.",
    heroCtaLabel: CTA,
    highlights: [
      "Diagnostic puis devis écrit",
      "Changement courroie distribution",
      "Embrayage & transmission",
      "Toutes marques essence/diesel",
    ],
    processSteps: PROCESS_STEPS,
    services: [
      { title: "Recherche de panne", url: "/prestations/recherche-de-panne/" },
      { title: "Changement courroie distribution", url: "/prestations/distribution-injection/" },
      { title: "Embrayage", url: "/prestations/embrayage/" },
      { title: "Changement plaquettes frein", url: "/freins/" },
    ],
    faqs: [
      { question: "Où réparer ma voiture à Ivry ?", answer: "RED-K MOTORS, 9 rue Michelet — mécanique générale, devis gratuit avant travaux." },
      { question: "Intervenez-vous sur toutes les marques ?", answer: "Oui, essence et diesel, particuliers et professionnels." },
      { question: "Comment prendre rendez-vous ?", answer: "06 48 74 56 68, WhatsApp ou formulaire contact. Lun–sam 9h–19h." },
    ],
  },
  "pare-brise": {
    videoSrc: "carrosserie.mp4",
    heroKicker: "Remplacement pare-brise · Ivry (94)",
    heroTitle: "Remplacement Pare-Brise à Ivry — Bris de Glace",
    heroDesc:
      "Impact ou vitrage fissuré ? Réparation ou remplacement pare-brise. Dossier assurance bris de glace accompagné.",
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
      { question: "Combien coûte un remplacement pare-brise ?", answer: TARIFS_FAQ + " Prise en charge assurance bris de glace si votre contrat le prévoit." },
      { question: "Proposez-vous une navette ?", answer: "Oui — récupération et restitution à domicile sur Ivry, Vitry, Villejuif et alentours." },
      { question: "Puis-je envoyer une photo ?", answer: "Oui par WhatsApp pour lancer le dossier rapidement." },
    ],
  },
  pneumatiques: {
    videoSrc: "mecanique.mp4",
    heroKicker: "Changement pneus · Ivry (94)",
    heroTitle: "Changement de Pneus à Ivry — Montage & Équilibrage",
    heroDesc:
      "Changement pneus été ou hiver, montage, équilibrage et parallélisme. Apportez les vôtres ou choisissez dans notre stock.",
    heroCtaLabel: CTA,
    highlights: [
      "Changement et montage pneus",
      "Équilibrage inclus",
      "Parallélisme / géométrie",
      "Réparation crevaison",
    ],
    processSteps: PROCESS_STEPS,
    services: [
      { title: "Changement pneus", url: "/prestations/montage-equilibrage/" },
      { title: "Parallélisme", url: "/prestations/geometrie/" },
      { title: "Permutation pneus", url: "/prestations/permutation-pneus/" },
      { title: "Changement plaquettes frein", url: "/freins/" },
    ],
    faqs: [
      { question: "Combien coûte un changement de pneus ?", answer: TARIFS_FAQ },
      { question: "Fournissez-vous les pneus ?", answer: "Oui — plusieurs marques selon stock. Apportez les vôtres : montage possible." },
      { question: "Comment réserver ?", answer: "Appelez avec la dimension de vos pneus : 06 48 74 56 68." },
    ],
  },
  vidange: {
    videoSrc: "mecanique.mp4",
    heroKicker: "Vidange voiture · Ivry (94)",
    heroTitle: "Vidange Voiture à Ivry — Rapide sur RDV",
    heroDesc:
      "Vidange moteur avec huile homologuée constructeur et filtre neuf. Contrôle des niveaux inclus — souvent le jour même.",
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
      { title: "Révision voiture", url: "/prestations/revision-entretien/" },
      { title: "Réparation climatisation", url: "/prestations/recharge-clim/" },
      { title: "Diagnostic auto", url: "/diagnostic/" },
    ],
    faqs: [
      { question: "Combien coûte une vidange voiture ?", answer: TARIFS_FAQ },
      { question: "Quelle huile utilisez-vous ?", answer: "Huile homologuée constructeur selon votre carnet d'entretien." },
      { question: "Faut-il un rendez-vous ?", answer: "Recommandé — créneau possible dans la journée. 06 48 74 56 68." },
    ],
  },
};
