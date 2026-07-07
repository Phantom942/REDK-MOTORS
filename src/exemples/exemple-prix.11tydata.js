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
  const questionLabel = ex.isGeneric
    ? `Combien coûte un ${ex.serviceLabel} ?`
    : `Combien coûte un ${ex.serviceLabel} sur ${ex.brand} ${ex.model} ?`;
  const faqQuestion =
    ex.isGeneric && ex.searchQuery ? `Combien coûte ${ex.searchQuery.toLowerCase()} ?` : questionLabel;

  const priceAnswer = ex.isGeneric
    ? `En réseau : ${ex.networkPrice} (${ex.networkNote}). Chez RED-K MOTORS à Ivry : ${ex.redkPrice}. ${ex.redkHighlight}. ${ex.redkNote}`
    : `En réseau : ${ex.networkPrice} (${ex.networkNote}). Chez RED-K MOTORS à Ivry : ${ex.redkPrice}. ${ex.redkHighlight}. ${ex.redkNote}`;

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
      const questionLabel =
        ex.isGeneric && ex.searchQuery
          ? `Combien coûte ${ex.searchQuery.toLowerCase()} ?`
          : ex.isGeneric
            ? `Combien coûte un ${ex.serviceLabel} ?`
            : `Combien coûte un ${ex.serviceLabel} sur ${ex.brand} ${ex.model} ?`;
      const facts = [
        { label: "Réseau", value: ex.networkPrice },
        { label: "RED-K MOTORS", value: ex.redkPrice },
        { label: "Diagnostic", value: "Offert à chaque intervention" },
      ];
      if (ex.isGeneric) {
        facts.push({ label: "Véhicules", value: "Citadine à SUV" });
      } else {
        facts.push({ label: "Génération", value: ex.yearRange });
      }
      return {
        question: questionLabel,
        answer: `Fourchette réseau : ${ex.networkPrice}. Chez RED-K MOTORS à Ivry-sur-Seine : ${ex.redkPrice} — ${ex.redkHighlight}.`,
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
