/** FAQ JSON-LD auto-généré depuis `faqs`, citySeoContent ou landingPages. */
const landingPages = require("./_data/landingPages.js");
const citySeoContent = require("./_data/citySeoContent.js");

const SITE_URL = "https://redkmotors.fr";
const SKIP_BREADCRUMB_KEYS = new Set(["index", "404", "links", "merci"]);

function buildFaqSchemaFromItems(items) {
  if (!Array.isArray(items) || items.length === 0) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function defaultBreadcrumb(data) {
  if (data.breadcrumb) return data.breadcrumb;
  if (SKIP_BREADCRUMB_KEYS.has(data.pageKey)) return undefined;

  const rawUrl = data.page?.url;
  if (!rawUrl || rawUrl === "/" || rawUrl === "/index.html") return undefined;

  const pageUrl = `${SITE_URL}${String(rawUrl).replace("/index.html", "/")}`;
  const name = String(data.title || data.pageKey || "Page")
    .replace(/\s*[|—–-]\s*RED-K MOTORS.*$/i, "")
    .trim()
    .slice(0, 80);

  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: name || "Page",
        item: pageUrl,
      },
    ],
  };
}

module.exports = {
  eleventyComputed: {
    breadcrumb: (data) => defaultBreadcrumb(data),
    faqs: (data) => {
      if (Array.isArray(data.faqs) && data.faqs.length) return data.faqs;
      return citySeoContent[data.pageKey]?.faqs || [];
    },
    faqSchema: (data) => {
      if (data.faqSchema) {
        return data.faqSchema;
      }
      const cityFaqs = citySeoContent[data.pageKey]?.faqs;
      if (cityFaqs?.length) {
        return buildFaqSchemaFromItems(cityFaqs);
      }
      if (data.lpKey && landingPages[data.lpKey]?.faqs?.length) {
        return buildFaqSchemaFromItems(landingPages[data.lpKey].faqs);
      }
      if (data.lp?.faqs?.length) {
        return buildFaqSchemaFromItems(data.lp.faqs);
      }
      if (!Array.isArray(data.faqs) || data.faqs.length === 0) {
        return undefined;
      }
      return buildFaqSchemaFromItems(data.faqs);
    },
    hideServiceAreas: (data) => {
      if (data.hideServiceAreas === true) return true;
      if (data.lpKey || data.lp) return true;
      return data.hideServiceAreas;
    },
  },
};
