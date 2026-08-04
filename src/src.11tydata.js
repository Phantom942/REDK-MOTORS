/** FAQ JSON-LD auto-généré depuis `faqs` ou landingPages + meta CTR. */
const landingPages = require("./_data/landingPages.js");

const PHONE_CTA = "☎ 06 48 74 56 68";
const SKIP_PHONE_KEYS = new Set(["cookies", "confidentialite", "merci", "404", "links"]);

function withPhoneCta(text, pageKey) {
  if (!text || typeof text !== "string") return text;
  if (SKIP_PHONE_KEYS.has(pageKey)) return text;
  const clean = text.replace(/\s+/g, " ").trim();
  if (/06\s*48\s*74|☎/i.test(clean)) return clean;
  return `${clean.replace(/\.$/, "")} · ${PHONE_CTA}.`;
}

module.exports = {
  eleventyComputed: {
    description: (data) => withPhoneCta(data.description, data.pageKey),
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
