const SITE_URL = "https://redkmotors.fr";
const { modelServiceLinks } = require("../../_data/priceExamplesHub.js");

module.exports = {
  eleventyComputed: {
    title: (data) =>
      `Prix entretien ${data.modele.brand} ${data.modele.model} · exemples Ivry (94) | RED-K MOTORS`,
    description: (data) =>
      `Exemples de prix pour ${data.modele.brand} ${data.modele.model} (${data.modele.yearRange}) : vidange, freins, pneus, clim, distribution, embrayage, batterie, pare-brise. Comparatifs indicatifs à Ivry-sur-Seine.`,
    lastReviewed: () => "2026-07-13",
    pageKey: () => "exemple-modele-hub",
    seoOnly: () => true,
    hideFromSiteNav: () => true,
    hideServiceAreas: () => true,
    robots: () => "index, follow",
    serviceLinks: (data) => modelServiceLinks(data.modele.slug),
    breadcrumb: (data) => {
      const m = data.modele;
      const pageUrl = `${SITE_URL}/exemples/modeles/${m.slug}/`;
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Tarifs indicatifs", item: `${SITE_URL}/tarifs/` },
          { "@type": "ListItem", position: 3, name: "Guides prix", item: `${SITE_URL}/exemples/` },
          { "@type": "ListItem", position: 4, name: `${m.brand} ${m.model}`, item: pageUrl },
        ],
      };
    },
    itemListSchema: (data) => {
      const links = modelServiceLinks(data.modele.slug);
      const m = data.modele;
      const pageUrl = `${SITE_URL}/exemples/modeles/${m.slug}/`;
      return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Prix entretien ${m.brand} ${m.model}`,
        url: pageUrl,
        numberOfItems: links.length,
        itemListElement: links.map((link, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: link.hubLabel,
          url: `${SITE_URL}${link.url}`,
        })),
      };
    },
  },
};
