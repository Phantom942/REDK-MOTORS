/** FAQ JSON-LD auto-généré depuis le tableau `faqs` (pages local-seo, etc.). */
module.exports = {
  eleventyComputed: {
    faqSchema: (data) => {
      if (data.faqSchema) {
        return data.faqSchema;
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
  },
};
