const site = require("./_data/site.json");
const reviews = site.googleReviews || {};
const ratingLabel = String(reviews.rating ?? "4.9").replace(".", ",");
const reviewCount = reviews.count ?? 0;

module.exports = {
  eleventyComputed: {
    description: () =>
      `Garage à Ivry-sur-Seine (94200) : mécanique, diagnostic, freins, pneus, clim, carrosserie. ${ratingLabel}/5 · ${reviewCount} avis · 9 rue Michelet · devis gratuit · ☎ 06 48 74 56 68.`,
    faqs: () => [
      {
        question: "Quel est le meilleur garage à Ivry-sur-Seine ?",
        answer: `RED-K MOTORS (9 rue Michelet, 94200) : garage multimarque, note Google ${ratingLabel}/5 (${reviewCount} avis), devis gratuit. Détails et accès sur la page garage Ivry du site.`,
      },
      {
        question: "Où se trouve le garage ?",
        answer:
          "9 rue Michelet, 94200 Ivry-sur-Seine. Lun–sam 9h–19h, fermé dimanche. Parking pour dépôt de véhicule sur place.",
      },
      {
        question: "Proposez-vous un devis avant travaux ?",
        answer: "Oui — devis écrit gratuit, rien sans votre accord.",
      },
      {
        question: "Y a-t-il un parking pour déposer le véhicule ?",
        answer: "Oui — parking pour dépôt de véhicule sur place. Pas de service de navette.",
      },
      {
        question: "Comment vous contacter ?",
        answer: "06 48 74 56 68, WhatsApp. Réponse rapide en journée.",
      },
      {
        question: "Faites-vous pneus, freins, vidange et clim ?",
        answer:
          "Oui — montage/équilibrage, plaquettes, vidange et recharge clim après contrôle. Devis après inspection.",
      },
      {
        question: "Intervenez-vous sur Vitry, Villejuif et Paris 13 ?",
        answer: "Oui. Atelier à Ivry-sur-Seine, accessible depuis le Val-de-Marne et le sud de Paris.",
      },
      {
        question: "Où voir des exemples de prix ?",
        answer:
          "Sur les guides prix et la page tarifs. Montants indicatifs : devis ferme après inspection du véhicule.",
      },
      {
        question: "Organisez-vous un jeu concours GTA VI ?",
        answer:
          "Oui — concours gratuit sur Instagram, TikTok et Snapchat. 3 exemplaires de Grand Theft Auto VI à gagner, tirage le 12 novembre 2026. Détails : redkmotors.fr/jeu-concours-gta-vi/",
      },
    ],
    directAnswer: () => ({
      question: "Qu'est-ce que RED-K MOTORS ?",
      answer: `RED-K MOTORS est un garage automobile multimarque au ${site.addressFull}. Téléphone ${site.phoneDisplayCompact}, WhatsApp accepté. Note Google ${ratingLabel}/5 (${reviewCount} avis). Ouvert ${site.openingHours}, fermé le dimanche. Parking pour déposer le véhicule sur place. Devis écrit gratuit, aucune intervention sans accord. Prestations : diagnostic électronique, vidange, freins, pneus, climatisation, distribution, embrayage, carrosserie et pare-brise, essence et diesel. Les véhicules viennent d'Ivry-sur-Seine, Vitry-sur-Seine, Villejuif, Paris 13e, Charenton-le-Pont, Le Kremlin-Bicêtre, Maisons-Alfort et Alfortville.`,
      facts: [
        { label: "Adresse", value: site.addressFull },
        { label: "Téléphone", value: site.phoneDisplayCompact },
        {
          label: "Note Google",
          value: `${ratingLabel}/5 · ${reviewCount} avis`,
        },
        { label: "Horaires", value: `${site.openingHours}, fermé le dimanche` },
        { label: "Parking", value: "Dépôt du véhicule sur place" },
        { label: "Paiement", value: "Espèces, carte bancaire, virement" },
      ],
    }),
    directAnswerSchema: (data) => {
      const da = data.directAnswer;
      if (!da) return undefined;
      const factText = (da.facts || []).map((f) => `${f.label} : ${f.value}`).join(". ");
      return {
        "@context": "https://schema.org",
        "@type": "Question",
        name: da.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: factText ? `${da.answer} ${factText}` : da.answer,
        },
      };
    },
  },
};
