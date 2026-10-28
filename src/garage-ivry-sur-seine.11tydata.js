const citySeoContent = require("./_data/citySeoContent.js");
const site = require("./_data/site.json");

const SITE_URL = "https://redkmotors.fr";
const reviews = site.googleReviews || {};

function buildFaqSchema(faqs) {
  if (!faqs?.length) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

module.exports = {
  eleventyComputed: {
    keywords: () =>
      "garage ivry, garage ivry-sur-seine, garage 94200, mécanicien ivry, garage automobile ivry, réparation auto ivry, garage val-de-marne",
    directAnswer: () => ({
      question: "Où trouver un garage à Ivry-sur-Seine (94200) ?",
      answer: `RED-K MOTORS est un garage automobile multimarque au 9 rue Michelet, 94200 Ivry-sur-Seine : mécanique, diagnostic, freins, pneus, clim et carrosserie. Note Google ${reviews.rating}/5 (${reviews.count} avis). Devis écrit gratuit · lun–sam 9h–19h.`,
      facts: [
        { label: "Adresse", value: "9 rue Michelet, 94200 Ivry-sur-Seine" },
        { label: "Téléphone", value: site.phoneDisplayCompact || site.phoneDisplay },
        { label: "Avis Google", value: `${reviews.rating}/5 · ${reviews.count} avis` },
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
    faqSchema: () => buildFaqSchema(citySeoContent["garage-ivry"]?.faqs),
    localServiceSchema: () => ({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Garage automobile — réparation et entretien",
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: { "@type": "City", name: "Ivry-sur-Seine" },
      description: `Garage Ivry-sur-Seine : RED-K MOTORS, 9 rue Michelet (94200). Mécanique, diagnostic, freins, pneus, clim, carrosserie. ${reviews.rating}/5 Google (${reviews.count} avis).`,
    }),
  },
};
