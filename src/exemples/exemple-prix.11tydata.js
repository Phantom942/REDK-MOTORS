const SITE_URL = "https://redk-motors.me";

function buildBreadcrumb(data) {
  const ex = data.exemple;
  if (!ex) return undefined;
  const pageUrl = `${SITE_URL}/exemples/${ex.slug}/`;
  return {
    "@context": "https://schema.org",
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
        name: ex.title.replace(" · fourchette 2026", ""),
        item: pageUrl,
      },
    ],
  };
}

function buildFaqSchema(data) {
  const ex = data.exemple;
  if (!ex) return undefined;
  const modelLabel = `${ex.brand} ${ex.model}`;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Combien coûte un ${ex.serviceLabel} sur ${modelLabel} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `En réseau : ${ex.networkPrice} (${ex.networkNote}). Chez RED-K MOTORS à Ivry : ${ex.redkPrice}. ${ex.redkNote}`,
        },
      },
      {
        "@type": "Question",
        name: "Le devis est-il gratuit ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui. Inspection au véhicule et devis ferme avant toute intervention — lun–sam 9h–19h, 9 rue Michelet, Ivry-sur-Seine.",
        },
      },
    ],
  };
}

function buildArticleSchema(data) {
  const ex = data.exemple;
  if (!ex) return undefined;
  const pageUrl = `${SITE_URL}/exemples/${ex.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ex.title,
    description: ex.description,
    datePublished: ex.date,
    dateModified: ex.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    author: { "@type": "Organization", name: "RED-K MOTORS", url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#business` },
  };
}

module.exports = {
  eleventyComputed: {
    title: (data) => data.exemple?.title,
    description: (data) => data.exemple?.description,
    lastReviewed: (data) => data.exemple?.date,
    breadcrumb: (data) => buildBreadcrumb(data),
    faqSchema: (data) => buildFaqSchema(data),
    articleSchema: (data) => buildArticleSchema(data),
    pageKey: () => "exemple-prix",
    seoOnly: () => true,
    hideFromSiteNav: () => true,
    hideServiceAreas: () => true,
    robots: () => "index, follow",
    directAnswer: (data) => {
      const ex = data.exemple;
      if (!ex) return undefined;
      const modelLabel = `${ex.brand} ${ex.model}`;
      return {
        question: `Combien coûte un ${ex.serviceLabel} sur ${modelLabel} ?`,
        answer: `Fourchette réseau : ${ex.networkPrice}. Chez RED-K MOTORS à Ivry-sur-Seine : ${ex.redkPrice} — ${ex.redkHighlight}.`,
        facts: [
          { label: "Réseau", value: ex.networkPrice },
          { label: "RED-K MOTORS", value: ex.redkPrice },
          { label: "Génération", value: ex.yearRange },
        ],
      };
    },
    relatedExemples: (data) => {
      const ex = data.exemple;
      if (!ex) return [];
      const { all } = require("../_data/priceExamples.js");
      return all
        .filter((item) => item.slug !== ex.slug && item.serviceKey === ex.serviceKey)
        .slice(0, 3);
    },
  },
};
