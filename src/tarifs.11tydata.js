const { buildOfferCatalogSchema } = require("./_data/pricingData.js");

module.exports = {
  eleventyComputed: {
    offerCatalogSchema: () => buildOfferCatalogSchema("https://redkmotors.fr"),
  },
};
