const site = require("./_data/site.json");
const reviews = site.googleReviews || {};
const ratingLabel = String(reviews.rating ?? "4.9").replace(".", ",");
const reviewCount = reviews.count ?? 0;

module.exports = {
  eleventyComputed: {
    description: () =>
      `Diagnostic valise à Ivry-sur-Seine (94) : voyant moteur, turbo, EGR, FAP. Codes expliqués, devis écrit · ${ratingLabel}/5 (${reviewCount} avis Google) · ☎ 06 48 74 56 68.`,
  },
};
