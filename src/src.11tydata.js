/** FAQ JSON-LD auto-généré depuis `faqs` ou landingPages. */
const landingPages = require("./_data/landingPages.js");

module.exports = {
  eleventyComputed: {
    faqSchema: (data) => {
      if (data.faqSchema) {
        return data.faqSchema;
      }
      if (data.lpKey && landingPages[data.lpKey]?.faqs?.length) {
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: landingPages[data.lpKey].faqs.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        };
      }
      if (data.lp?.faqs?.length) {
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.lp.faqs.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        };
      }
      if (!Array.isArray(data.faqs) || data.faqs.length === 0) {
        return undefined;
      }
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      };
    },
    hideServiceAreas: (data) => {
      if (data.hideServiceAreas === true) return true;
      if (data.lpKey || data.lp) return true;
      return data.hideServiceAreas;
    },
  },
};
