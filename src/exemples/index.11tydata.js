const SITE_URL = "https://redkmotors.fr";
const { allGuides } = require("../_data/priceExamplesHub.js");

module.exports = {
  eleventyComputed: {
    itemListSchema: () => {
      const guides = allGuides();
      return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Guides prix RED-K MOTORS",
        url: `${SITE_URL}/exemples/`,
        numberOfItems: guides.length,
        itemListElement: guides.map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: g.hubLabel,
          url: `${SITE_URL}${g.url}`,
        })),
      };
    },
  },
};
