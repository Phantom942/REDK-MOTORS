/**
 * Blocs « réponse directe » — citabilité IA (GEO) sur les pages services.
 * Montants alignés sur /tarifs/ (indicatifs TTC, devis fermé au véhicule).
 */
module.exports = {
  diagnostic: {
    question: "Combien coûte un diagnostic auto à Ivry-sur-Seine ?",
    answer:
      "Chez RED-K MOTORS, un diagnostic avancé (valise multimarques) coûte entre 50 et 100 € TTC selon le véhicule et le temps d'analyse. Durée habituelle : 30 à 45 minutes. Devis gratuit avant toute réparation — rien n'est facturé sans votre accord.",
    price: "50–100 € TTC",
    duration: "30–45 min",
    booking: "RDV sous 48 h (créneaux express possibles)",
  },
  mecanique: {
    question: "Combien coûte une réparation mécanique à Ivry-sur-Seine ?",
    answer:
      "Les tarifs dépendent de la panne : diagnostic 50–100 €, kit distribution 450–990 €, embrayage 800–1 600 € (indicatifs TTC). RED-K MOTORS intervient sur toutes marques essence/diesel à Ivry — devis écrit gratuit avant travaux.",
    price: "Diagnostic dès 50 € · distribution 450–990 €",
    duration: "Diagnostic ~45 min · réparation selon devis",
    booking: "Contact direct avec l'atelier",
  },
  carrosserie: {
    question: "Combien coûte une réparation carrosserie à Ivry-sur-Seine ?",
    answer:
      "La carrosserie est chiffrée sur devis après inspection ou photos (rayure, pare-chocs, débosselage). RED-K MOTORS répare et peint selon références constructeur à Ivry — montant confirmé par écrit avant intervention.",
    price: "Sur devis (devis photo possible)",
    duration: "Selon étendue des travaux",
    booking: "Estimation rapide par WhatsApp ou au garage",
  },
  entretien: {
    question: "Combien coûte une révision auto à Ivry-sur-Seine ?",
    answer:
      "Une révision chez RED-K MOTORS coûte entre 130 et 400 € TTC selon le carnet constructeur ; vidange 70–150 € ; pré-contrôle technique 40 €. Carnet et garantie constructeur respectés quand c'est possible. Devis détaillé avant travaux.",
    price: "Révision 130–400 € · vidange 70–150 €",
    duration: "Révision : 1/2 journée · vidange 30–60 min",
    booking: "RDV révision sous 48 h",
  },
  freins: {
    question: "Combien coûte un changement de plaquettes de frein à Ivry ?",
    answer:
      "Chez RED-K MOTORS à Ivry-sur-Seine, comptez entre 100 et 190 € TTC pour des plaquettes (selon véhicule) et 240–590 € pour disques + plaquettes. Contrôle d'usure gratuit — on ne remplace que le nécessaire. Devis fermé au véhicule.",
    price: "Plaquettes 100–190 € · disques + plaquettes 240–590 €",
    duration: "~1 h / essieu (plaquettes) · restitution journée",
    booking: "Intervention rapide sur rendez-vous",
  },
  pneumatiques: {
    question: "Combien coûte un montage de pneus à Ivry-sur-Seine ?",
    answer:
      "Le montage de 4 pneus avec équilibrage coûte entre 60 et 150 € TTC (hors prix des pneus) chez RED-K MOTORS. Géométrie / parallélisme : 80–160 € indicatif. Stock été/hiver selon arrivages — devis au modèle avant pose.",
    price: "Montage 4 pneus 60–150 € · géométrie 80–160 €",
    duration: "Montage express · géométrie ~45 min",
    booking: "Appelez pour dispo et dimension",
  },
  vidange: {
    question: "Combien coûte une vidange à Ivry-sur-Seine ?",
    answer:
      "Une vidange moteur chez RED-K MOTORS coûte entre 70 et 150 € TTC (huile homologuée constructeur + filtre neuf + contrôle des niveaux). Durée : 30 minutes à 1 heure. Devis gratuit — aucune intervention sans validation.",
    price: "70–150 € TTC",
    duration: "30 min – 1 h",
    booking: "Créneau dans la journée possible",
  },
  pareBrise: {
    question: "Le pare-brise est-il pris en charge par l'assurance bris de glace ?",
    answer:
      "Oui, si votre contrat auto inclut la garantie bris de glace : le remplacement ou la réparation du vitrage est en général pris en charge par votre assureur (hors franchise éventuelle). RED-K MOTORS vous accompagne pour la déclaration de sinistre, le devis et les documents. Sans cette garantie, un devis gratuit vous est remis avant intervention.",
    priceLabel: "Garantie bris de glace",
    price: "Prise en charge par l'assurance si incluse au contrat",
    duration: "Réparation impact ~45 min · pose 2–3 h",
    booking: "RDV ou photo WhatsApp pour lancer le dossier",
    hideTarifsLink: true,
  },
};
