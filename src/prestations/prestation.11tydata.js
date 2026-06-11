const SITE_URL = "https://redk-motors.me";

function buildBreadcrumb(data) {
  const prestation = data.prestation;
  if (!prestation) return undefined;

  const pageUrl = `${SITE_URL}/prestations/${prestation.slug}/`;
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
        name: "Prestations",
        item: `${SITE_URL}/prestations/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: prestation.name,
        item: pageUrl,
      },
    ],
  };
}

function buildFaqSchema(data) {
  const faq = data.prestation?.faq;
  if (!faq?.length) return undefined;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

function buildServiceSchema(data) {
  const prestation = data.prestation;
  if (!prestation) return undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: prestation.name,
    serviceType: prestation.name,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: [
      { "@type": "City", name: "Ivry-sur-Seine" },
      { "@type": "City", name: "Vitry-sur-Seine" },
      { "@type": "City", name: "Villejuif" },
      { "@type": "AdministrativeArea", name: "Paris 13e arrondissement" },
    ],
    description: prestation.summary,
    url: `${SITE_URL}/prestations/${prestation.slug}/`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: "Devis gratuit avant intervention",
    },
  };
}

module.exports = {
  eleventyComputed: {
    breadcrumb: (data) => buildBreadcrumb(data),
    faqSchema: (data) => buildFaqSchema(data),
    localServiceSchema: (data) => buildServiceSchema(data),
  },
};
