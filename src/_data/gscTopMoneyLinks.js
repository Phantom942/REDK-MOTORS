/**
 * Articles à fort volume GSC — liens money prioritaires (garage Ivry + prestation + contact).
 * Fusionnés en tête de relatedLinks via blog.11tydata.js.
 */
const GARAGE = {
  url: "/garage-ivry-sur-seine/",
  label: "Garage Ivry-sur-Seine — 9 rue Michelet (94)",
};
const CONTACT = { url: "/contact/", label: "Devis & RDV — lun–sam 9h–19h" };

/** @type {Record<string, { ctaLead: string, priority: Array<{url: string, label: string}> }>} */
module.exports = {
  "suppression-fap-controle-technique-2026": {
    ctaLead:
      "Diesel avant CT : diagnostic pollution, pré-contrôle ou remise en conformité FAP à Ivry — devis avant travaux.",
    priority: [GARAGE, { url: "/prestations/pre-controle-technique/", label: "Pré-contrôle technique" }, CONTACT],
  },
  "revision-60000-km-checklist": {
    ctaLead: "Révision 60 000 km selon carnet constructeur — chiffrage après inspection à Ivry-sur-Seine.",
    priority: [
      GARAGE,
      { url: "/prestations/revision-entretien/", label: "Révision constructeur (prestation)" },
      { url: "/entretien/", label: "Entretien & révision" },
      CONTACT,
    ],
  },
  "que-faire-apres-accident-carrosserie": {
    ctaLead: "Devis carrosserie après sinistre : photos, expertise et réparation à Ivry (94).",
    priority: [
      GARAGE,
      { url: "/carrosserie/", label: "Carrosserie & peinture" },
      { url: "/prestations/debosselage/", label: "Débosselage sans peinture" },
      CONTACT,
    ],
  },
  "geometrie-roues-signes-mauvais-alignement": {
    ctaLead: "Voiture qui tire ou pneus en biais : parallélisme et géométrie à Ivry — contrôle sur pont.",
    priority: [
      GARAGE,
      { url: "/prestations/geometrie/", label: "Géométrie / parallélisme" },
      { url: "/prestations/montage-equilibrage/", label: "Montage & équilibrage pneus" },
      CONTACT,
    ],
  },
  "combien-coute-vidange-voiture": {
    ctaLead: "Vidange moteur à Ivry : huile homologuée constructeur, filtre inclus — devis selon modèle.",
    priority: [
      GARAGE,
      { url: "/prestations/vidange-moteur/", label: "Vidange moteur (prestation)" },
      { url: "/vidange/", label: "Hub vidange" },
      CONTACT,
    ],
  },
  "garage-independant-vs-concessionnaire": {
    ctaLead: "Entretien multimarque à Ivry : révision conforme carnet, tarifs transparents — garantie constructeur préservée.",
    priority: [
      GARAGE,
      { url: "/entretien/", label: "Entretien & révision" },
      { url: "/tarifs/", label: "Grille tarifaire" },
      CONTACT,
    ],
  },
  "prix-recharge-climatisation-94": {
    ctaLead: "Clim qui ne refroidit plus : test d'étanchéité puis recharge à Ivry — pas de recharge « à l'aveugle ».",
    priority: [
      GARAGE,
      { url: "/reparation-climatisation-ivry/", label: "Réparation clim Ivry" },
      { url: "/prestations/recharge-clim/", label: "Recharge clim (prestation)" },
      CONTACT,
    ],
  },
  "amortisseurs-usures-symptomes": {
    ctaLead: "Suspension usée : contrôle amortisseurs et géométrie à Ivry — remplacement par essieu.",
    priority: [GARAGE, { url: "/prestations/amortisseurs/", label: "Remplacement amortisseurs" }, CONTACT],
  },
  "voyant-moteur-allume-que-faire": {
    ctaLead: "Voyant moteur allumé : valise diagnostic à Ivry — devis réparation après lecture des codes.",
    priority: [
      GARAGE,
      { url: "/prestations/diagnostic-voyant-moteur/", label: "Diagnostic voyant moteur" },
      { url: "/diagnostic/", label: "Diagnostic auto" },
      CONTACT,
    ],
  },
  "climatisation-voiture-recharge-ivry": {
    ctaLead: "Recharge climatisation à Ivry-sur-Seine : diagnostic circuit avant recharge gaz.",
    priority: [
      GARAGE,
      { url: "/reparation-climatisation-ivry/", label: "Page réparation clim" },
      { url: "/prestations/recharge-clim/", label: "Prestation recharge clim" },
      CONTACT,
    ],
  },
  "fumee-echappement-couleur-signification": {
    ctaLead: "Fumée anormale : diagnostic moteur à Ivry — ne pas attendre la panne.",
    priority: [GARAGE, { url: "/diagnostic/", label: "Diagnostic auto" }, CONTACT],
  },
};

module.exports.GARAGE_IVRY = GARAGE;
