const SITE_URL = "https://redkmotors.fr";
const { breadcrumbTrail } = require("../_data/priceExamplesHub.js");

function buildBreadcrumb(data) {
  const ex = data.exemple;
  if (!ex) return undefined;
  const trail = breadcrumbTrail(ex);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

function buildFaqSchema(data) {
  const ex = data.exemple;
  if (!ex) return undefined;
  const questionLabel = ex.isGeneric
    ? `Combien coûte un ${ex.serviceLabel} ?`
    : `Combien coûte un ${ex.serviceLabel} sur ${ex.brand} ${ex.model} ?`;
  const faqQuestion =
    ex.isGeneric && ex.searchQuery ? `Combien coûte ${ex.searchQuery.toLowerCase()} ?` : questionLabel;

  const priceAnswer = ex.isGeneric
    ? `Exemple à Ivry : ${ex.redkPrice}. ${ex.redkHighlight}. ${ex.redkNote} Ailleurs, en moyenne : ${ex.networkPrice} (${ex.networkNote}).`
    : `Exemple à Ivry pour ce modèle : ${ex.redkPrice}. ${ex.redkHighlight}. ${ex.redkNote} Ailleurs, en moyenne : ${ex.networkPrice} (${ex.networkNote}).`;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: faqQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: priceAnswer,
        },
      },
      {
        "@type": "Question",
        name: "Le diagnostic est-il offert ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui. À chaque intervention à l'atelier, RED-K MOTORS réalise un diagnostic sans frais supplémentaires : contrôle du véhicule, lecture des codes si besoin et explication avant validation du devis.",
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

function buildOfferSchema(data) {
  const ex = data.exemple;
  if (!ex) return undefined;
  const pageUrl = `${SITE_URL}/exemples/${ex.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: ex.searchQuery || ex.title,
    url: pageUrl,
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    seller: { "@id": `${SITE_URL}/#business` },
    itemOffered: {
      "@type": "Service",
      name: ex.serviceLabel,
      areaServed: { "@type": "City", name: "Ivry-sur-Seine" },
    },
    description: `Exemple indicatif RED-K MOTORS : ${ex.redkPrice}. ${ex.redkNote}`,
  };
}

module.exports = {
  eleventyComputed: {
    title: (data) => data.exemple?.title,
    description: (data) => data.exemple?.description,
    lastReviewed: (data) => data.exemple?.date,
    breadcrumb: (data) => buildBreadcrumb(data),
    breadcrumbTrail: (data) => (data.exemple ? breadcrumbTrail(data.exemple) : []),
    faqSchema: (data) => buildFaqSchema(data),
    articleSchema: (data) => buildArticleSchema(data),
    offerSchema: (data) => buildOfferSchema(data),
    pageKey: () => "exemple-prix",
    seoOnly: () => true,
    hideFromSiteNav: () => true,
    hideServiceAreas: () => true,
    robots: () => "index, follow",
    directAnswer: (data) => {
      const ex = data.exemple;
      if (!ex) return undefined;
      const questionLabel =
        ex.isGeneric && ex.searchQuery
          ? `Combien coûte ${ex.searchQuery.toLowerCase()} ?`
          : ex.isGeneric
            ? `Combien coûte un ${ex.serviceLabel} ?`
            : `Combien coûte un ${ex.serviceLabel} sur ${ex.brand} ${ex.model} ?`;
      const facts = [
        { label: "Exemple à Ivry", value: ex.redkPrice },
        { label: "Ailleurs (indicatif)", value: ex.networkPrice },
        { label: "Diagnostic", value: "Offert à chaque intervention" },
      ];
      if (ex.isGeneric) {
        facts.push({ label: "Véhicules", value: "Citadine à SUV" });
      } else {
        facts.push({ label: "Génération", value: ex.yearRange });
      }
      facts.push({ label: "Grille tarifs", value: "Voir /tarifs/" });
      return {
        question: questionLabel,
        answer: `Exemple à Ivry : ${ex.redkPrice} — ${ex.redkHighlight}. Ailleurs, en moyenne : ${ex.networkPrice}. Grille complète sur redkmotors.fr/tarifs/.`,
        facts,
      };
    },
    genericExemple: (data) => {
      const ex = data.exemple;
      if (!ex || ex.isGeneric) return undefined;
      const { all } = require("../_data/priceExamples.js");
      return all.find((item) => item.isGeneric && item.serviceKey === ex.serviceKey);
    },
    relatedExemples: (data) => {
      const ex = data.exemple;
      if (!ex) return [];
      const { all } = require("../_data/priceExamples.js");
      if (ex.isGeneric) {
        return all
          .filter((item) => !item.isGeneric && item.serviceKey === ex.serviceKey)
          .slice(0, 6);
      }
      return all
        .filter((item) => !item.isGeneric && item.slug !== ex.slug && item.serviceKey === ex.serviceKey)
        .slice(0, 3);
    },
  },
};
