/**
 * Règles noindex centralisées — utilisées par base.njk et .eleventy.js (sitemap).
 * Les pages SEO locale / presta (batterie, freins, clim, etc.) sont indexables.
 */
module.exports = {
  prefixes: [
    "/blog/tag/",
    "/lp-",
  ],
  /** URLs indexables malgré un prefix noindex. */
  indexablePaths: ["/revision-auto-val-de-marne/"],
};
