const site = require("./_data/site.json");
const reviews = site.googleReviews || {};

module.exports = {
  eleventyComputed: {
    directAnswer: () => ({
      question: "Quel garage à Ivry-sur-Seine pour réparer sa voiture ?",
      answer:
        "RED-K MOTORS, garage multimarque au 9 rue Michelet (94200) : diagnostic, freins, pneus, clim, carrosserie. Devis écrit gratuit avant travaux.",
      facts: [
        {
          label: "Note Google",
          value: `${reviews.rating}/5 · ${reviews.count} avis`,
        },
        { label: "Horaires", value: site.openingHours },
        { label: "Page locale", value: "redkmotors.fr/garage-ivry-sur-seine/" },
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
