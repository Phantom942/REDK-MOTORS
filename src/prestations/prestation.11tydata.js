const SITE_URL = "https://redkmotors.fr";
const site = require("../_data/site.json");

function buildDirectAnswer(data) {
  const prestation = data.prestation;
  if (!prestation) return undefined;
  const rating = Number(site.googleReviews?.rating);
  const ratingLabel = Number.isFinite(rating) ? rating.toFixed(1).replace(".", ",") : "4,9";
  const count = site.googleReviews?.count ?? 0;
  const detail = (prestation.lp?.heroDesc || prestation.summary || "").trim();
  return {
    question: `${prestation.name} à Ivry-sur-Seine : où le faire ?`,
    answer: `${detail} Chez RED-K MOTORS, ${site.addressFull}. Téléphone ${site.phoneDisplayCompact}. Note Google ${ratingLabel}/5 (${count} avis). ${site.openingHours}, fermé le dimanche. Parking pour déposer le véhicule. Devis écrit avant travaux.`,
    facts: [
      { label: "Atelier", value: site.addressFull },
      { label: "Téléphone", value: site.phoneDisplayCompact },
      { label: "Note Google", value: `${ratingLabel}/5 · ${count} avis` },
    ],
  };
}

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
  const faqs = data.prestation?.lp?.faqs;
  if (!faqs?.length) return undefined;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
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
      { "@type": "City", name: "Charenton-le-Pont" },
      { "@type": "City", name: "Alfortville" },
      { "@type": "AdministrativeArea", name: "Paris 13e arrondissement" },
      { "@type": "AdministrativeArea", name: "Val-de-Marne" },
    ],
    description: prestation.lp?.heroDesc || prestation.summary,
    url: `${SITE_URL}/prestations/${prestation.slug}/`,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      description: "Devis gratuit avant intervention — tarif selon diagnostic",
    },
  };
}

module.exports = {
  eleventyComputed: {
    lastReviewed: () => "2026-10-28",
    breadcrumb: (data) => buildBreadcrumb(data),
    faqSchema: (data) => buildFaqSchema(data),
    localServiceSchema: (data) => buildServiceSchema(data),
    lp: (data) => data.prestation?.lp,
    directAnswer: (data) => buildDirectAnswer(data),
    lpPageId: (data) => (data.prestation ? `prestation-${data.prestation.slug}` : undefined),
    hideServiceAreas: () => true,
    hasHeroVideo: () => true,
  },
};
