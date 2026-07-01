const reviewPages = require("./reviewPages.js");

const TARIFS_FAQ =
  "Consultez notre grille tarifaire sur redk-motors.me/tarifs/ — devis fermé après inspection.";

const PROCESS_STEPS = [
  { title: "Contactez-nous", desc: "Téléphone, WhatsApp ou formulaire — réponse en journée." },
  { title: "Devis clair", desc: "Inspection, explication et chiffrage avant travaux." },
  { title: "Intervention validée", desc: "On intervient uniquement après votre accord." },
];

const CATEGORY_HUB = {
  "Prestations fréquentes": "/entretien/",
  Moteur: "/mecanique/",
  Suspension: "/mecanique/",
  "Pneus / Roues": "/pneumatiques/",
  "Batterie, alternateur, demarreur": "/mecanique/",
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
    heroTitle: "Révision & Entretien à Ivry — Carnet Constructeur",
    heroKicker: "Entretien · Garantie préservée",
    heroDesc: "Révision selon préconisations constructeur. Pièces adaptées et devis gratuit.",
  },
  "vidange-moteur": {
    heroTitle: "Vidange Moteur à Ivry — Rapide & Constructeur",
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
    heroTitle: "Kit Distribution à Ivry — Courroie & Injection",
    heroKicker: "Moteur · Prévention panne",
    heroDesc: "Distribution, courroie ou injecteurs : diagnostic, devis ferme, pièces adaptées au véhicule.",
  },
  "decalaminage-moteur": {
    heroTitle: "Décalaminage Moteur à Ivry",
    heroKicker: "Moteur · Performance",
    heroDesc: "Perte de puissance ou fumée ? Décalaminage pour retrouver des performances optimales.",
  },
  amortisseurs: {
    heroTitle: "Amortisseurs à Ivry — Suspension & Confort",
    heroKicker: "Suspension · Sécurité",
    heroDesc: "Sauts, bruits ou tenue de route dégradée ? Contrôle suspension et devis avant remplacement.",
  },
  "pre-controle-technique": {
    heroTitle: "Pré-Contrôle Technique à Ivry",
    heroKicker: "CT · Mise en conformité",
    heroDesc: "Anticipez le contrôle technique : points de contrôle et devis pour corriger avant le CT.",
  },
  "purge-liquide-frein": {
    heroTitle: "Purge Liquide de Frein à Ivry",
    heroKicker: "Freinage · Sécurité",
    heroDesc: "Liquide de frein usé ou pédale spongieuse ? Purge complète du circuit avec devis avant intervention.",
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
  cardans: {
    heroTitle: "Cardans à Ivry — Cliquetis & Vibrations",
    heroKicker: "Transmission · Sécurité",
    heroDesc: "Claquement en braquant ou vibration à l'accélération ? Contrôle cardans et devis ferme.",
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
      { slug: "revision-entretien", name: "Révision et entretien" },
      { slug: "vidange-moteur", name: "Vidange moteur" },
      { slug: "pre-controle-technique", name: "Pré-contrôle technique" },
    ],
  },
  {
    key: "moteur",
    title: "Moteur",
    services: [
      { slug: "recherche-de-panne", name: "Recherche de panne" },
      { slug: "distribution-injection", name: "Distribution et injection" },
      { slug: "diagnostic-voyant-moteur", name: "Diagnostic voyant moteur" },
      { slug: "decalaminage-moteur", name: "Decalaminage moteur" },
    ],
  },
  {
    key: "suspension",
    title: "Suspension",
    services: [
      { slug: "amortisseurs", name: "Amortisseurs" },
      { slug: "coupelles-triangles", name: "Coupelles et triangles" },
      { slug: "geometrie", name: "Geometrie" },
    ],
  },
  {
    key: "pneus",
    title: "Pneus / Roues",
    services: [
      { slug: "montage-equilibrage", name: "Montage et equilibrage" },
      { slug: "permutation-pneus", name: "Permutation pneus" },
      { slug: "reparation-crevaison", name: "Reparation crevaison" },
    ],
  },
  {
    key: "batterie",
    title: "Batterie, alternateur, demarreur",
    services: [
      { slug: "test-batterie", name: "Test batterie" },
      { slug: "remplacement-batterie", name: "Remplacement batterie" },
      { slug: "controle-alternateur", name: "Controle alternateur" },
    ],
  },
  {
    key: "freinage",
    title: "Freinage",
    services: [
      { slug: "plaquettes-disques", name: "Plaquettes et disques" },
      { slug: "purge-liquide-frein", name: "Purge liquide de frein" },
      { slug: "diagnostic-abs", name: "Diagnostic ABS" },
    ],
  },
  {
    key: "transmission",
    title: "Transmission",
    services: [
      { slug: "embrayage", name: "Embrayage" },
      { slug: "cardans", name: "Cardans" },
      { slug: "vidange-boite", name: "Vidange de boite" },
    ],
  },
  {
    key: "climatisation",
    title: "Climatisation",
    services: [
      { slug: "recharge-clim", name: "Recharge clim" },
      { slug: "desinfection-circuit-clim", name: "Desinfection circuit clim" },
      { slug: "controle-compresseur", name: "Controle compresseur" },
    ],
  },
  {
    key: "carrosserie",
    title: "Carrosserie",
    services: [
      { slug: "debosselage", name: "Debosselage" },
      { slug: "peinture-localisee", name: "Peinture localisee" },
      { slug: "pare-brise-vitrage", name: "Pare-brise et vitrage" },
      { slug: "retouches-finitions", name: "Retouches et finitions" },
    ],
  },
];

function buildLp(service, category) {
  const ad = AD_OVERRIDES[service.slug] || {};
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
    symptoms: ad.symptoms,
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
    ],
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
