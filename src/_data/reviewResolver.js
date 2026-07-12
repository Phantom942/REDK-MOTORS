/**
 * Résolution des avis par page — filtre Eleventy resolvePageReviews.
 * Pas de fallback : seuls les auteurs listés dans reviewPages.js sont affichés.
 */
const reviewPages = require("./reviewPages.js");
const { resolveReviewKey } = require("./localSeoEnhancements.js");

function findByAuthor(pool, author) {
  return pool.find((r) => r.author === author);
}

function pickByAuthors(pool, authors, count) {
  const result = [];
  for (const author of authors) {
    if (result.length >= count) break;
    const review = findByAuthor(pool, author);
    if (review) result.push(review);
  }
  return result;
}

/**
 * @param {string} pageId — lpKey, "index", ou "prestation-{slug}"
 * @param {{ reviews: array }} googleReviewsData
 * @param {number} count — nombre max d'avis à afficher
 * @param {string[]} [overrideAuthors] — priorité sur reviewPages.js (usage interne)
 */
function resolvePageReviews(pageId, googleReviewsData, count = 2, overrideAuthors) {
  const pool = googleReviewsData?.reviews || [];
  if (!pool.length || !pageId) return [];

  let authors = overrideAuthors?.length ? overrideAuthors : reviewPages[pageId];
  if (!authors?.length) {
    const fallbackKey = resolveReviewKey(pageId);
    if (fallbackKey && fallbackKey !== pageId) {
      authors = reviewPages[fallbackKey];
    }
  }
  if (!authors?.length) return [];

  const limit = Math.min(count || authors.length, authors.length);
  return pickByAuthors(pool, authors, limit);
}

function hasPageReviews(pageId) {
  return Boolean(reviewPages[pageId]?.length);
}

module.exports = {
  resolvePageReviews,
  hasPageReviews,
};
