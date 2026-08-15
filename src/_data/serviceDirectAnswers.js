/**
 * Blocs « réponse directe » — citabilité IA (GEO) sur les pages services.
 * Montants alignés sur /tarifs/ (indicatifs TTC, devis fermé au véhicule).
 */
module.exports = {
  diagnostic: {
    question: "Combien coûte un diagnostic auto à Ivry-sur-Seine ?",
    answer:
      "Comptez en général 50 à 100 € TTC pour un diagnostic valise multimarques (30 à 45 min selon le véhicule). Le montant exact est confirmé au devis — rien n'est facturé sans votre accord.",
    price: "50–100 € TTC",
    duration: "30–45 min",
    booking: "RDV sous 48 h (créneaux express possibles)",
  },
  mecanique: {
    question: "Combien coûte une réparation mécanique à Ivry-sur-Seine ?",
    answer:
      "Tout dépend de la panne : diagnostic 50–100 €, kit distribution 450–990 €, embrayage 800–1 600 € (fourchettes indicatives TTC). L'atelier intervient sur toutes marques essence/diesel — devis écrit avant travaux.",
    price: "Diagnostic dès 50 € · distribution 450–990 €",
    duration: "Diagnostic ~45 min · réparation selon devis",
    booking: "Contact direct avec l'atelier",
  },
  carrosserie: {
    question: "Combien coûte une réparation carrosserie à Ivry-sur-Seine ?",
    answer:
      "La carrosserie se chiffre après inspection ou photos (rayure, pare-chocs, débosselage). Montant confirmé par écrit avant intervention — estimation rapide possible par WhatsApp.",
    price: "Sur devis (devis photo possible)",
    duration: "Selon étendue des travaux",
    booking: "Estimation rapide par WhatsApp ou au garage",
  },
  entretien: {
    question: "Combien coûte une révision auto à Ivry-sur-Seine ?",
    answer:
      "Une révision tourne souvent entre 130 et 400 € TTC selon le carnet ; vidange 70–150 € ; pré-contrôle technique 40 €. Points et pièces adaptés au modèle — devis détaillé avant travaux.",
    price: "Révision 130–400 € · vidange 70–150 €",
    duration: "Révision : 1/2 journée · vidange 30–60 min",
    booking: "RDV révision sous 48 h",
  },
  freins: {
    question: "Combien coûte un changement de plaquettes de frein à Ivry ?",
    answer:
      "Pour des plaquettes : comptez 100 à 190 € TTC selon véhicule ; disques + plaquettes 240–590 €. L'usure est mesurée avant remplacement — on ne change que le nécessaire.",
    price: "Plaquettes 100–190 € · disques + plaquettes 240–590 €",
    duration: "~1 h / essieu (plaquettes) · restitution journée",
    booking: "Intervention rapide sur rendez-vous",
  },
  pneumatiques: {
    question: "Combien coûte un montage de pneus à Ivry-sur-Seine ?",
    answer:
      "Montage de 4 pneus avec équilibrage : 60 à 150 € TTC (hors prix des pneus). Géométrie / parallélisme : 80–160 € indicatif. Devis au modèle avant pose.",
    price: "Montage 4 pneus 60–150 € · géométrie 80–160 €",
    duration: "Montage express · géométrie ~45 min",
    booking: "Appelez pour dispo et dimension",
  },
  vidange: {
    question: "Combien coûte une vidange à Ivry-sur-Seine ?",
    answer:
      "Une vidange moteur : 70 à 150 € TTC (huile homologuée + filtre neuf + contrôle niveaux). Durée habituelle 30 min à 1 h. Devis avant intervention.",
    price: "70–150 € TTC",
    duration: "30 min – 1 h",
    booking: "Créneau dans la journée possible",
  },
  pareBrise: {
    question: "Le pare-brise est-il pris en charge par l'assurance bris de glace à Ivry ?",
    answer:
      "Oui, si votre contrat inclut la garantie bris de glace. L'atelier accompagne la déclaration et propose jusqu'à 150 € + franchise offerte sur remplacement (conditions au devis). Sans garantie, devis avant travaux. Navette possible sur Ivry, Vitry, Villejuif.",
    priceLabel: "Offre atelier",
    price: "Jusqu'à 150 € + franchise offerte",
    duration: "Impact ~45 min · pose 2–3 h",
    booking: "Appel ou photo WhatsApp pour lancer le dossier",
    hideTarifsLink: true,
  },
};
