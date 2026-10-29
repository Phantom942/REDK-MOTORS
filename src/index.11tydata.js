const site = require("./_data/site.json");
const reviews = site.googleReviews || {};

module.exports = {
  eleventyComputed: {
    directAnswer: () => ({
      question: "Qu'est-ce que RED-K MOTORS ?",
      answer: `RED-K MOTORS est un garage automobile multimarque au ${site.addressFull}. Téléphone ${site.phoneDisplayCompact}, WhatsApp accepté. Note Google ${String(reviews.rating).replace(".", ",")}/5 (${reviews.count} avis). Ouvert ${site.openingHours}, fermé le dimanche. Parking pour déposer le véhicule sur place. Devis écrit gratuit, aucune intervention sans accord. Prestations : diagnostic électronique, vidange, freins, pneus, climatisation, distribution, embrayage, carrosserie et pare-brise, essence et diesel. Les véhicules viennent d'Ivry-sur-Seine, Vitry-sur-Seine, Villejuif, Paris 13e, Charenton-le-Pont, Le Kremlin-Bicêtre, Maisons-Alfort et Alfortville.`,
      facts: [
        { label: "Adresse", value: site.addressFull },
        { label: "Téléphone", value: site.phoneDisplayCompact },
        {
          label: "Note Google",
          value: `${String(reviews.rating).replace(".", ",")}/5 · ${reviews.count} avis`,
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
