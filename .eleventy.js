const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("cacheBust", (filePath) => {
    if (!filePath || typeof filePath !== "string") return filePath;
    const normalized = filePath.replace(/^\//, "");
    const fullPath = path.join(__dirname, normalized);
    if (!fs.existsSync(fullPath)) return filePath;
    try {
      const content = fs.readFileSync(fullPath);
      const hash = crypto.createHash("md5").update(content).digest("hex").slice(0, 8);
      const base = filePath.split("?")[0];
      return `${base}?v=${hash}`;
    } catch {
      return filePath;
    }
  });

  // Filtre JSON pour JSON-LD
  eleventyConfig.addFilter("json", (obj) => JSON.stringify(obj));

  // Filtre date pour sitemap (ISO YYYY-MM-DD) — pas de fallback, retourne vide si invalide
  eleventyConfig.addFilter("dateToIso", (date) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("formatFrNumber", (n) => {
    if (n == null || n === "" || isNaN(Number(n))) return "";
    return new Intl.NumberFormat("fr-FR").format(Number(n));
  });

  eleventyConfig.addFilter("encodeURIComponent", (str) =>
    encodeURIComponent(str == null ? "" : String(str))
  );

  // Collection blog triée par date décroissante
  eleventyConfig.addCollection("blog", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/blog/articles/*.njk")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  // Liste des tags uniques pour les pages par tag
  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const blogs = collectionApi.getFilteredByGlob("src/blog/articles/*.njk");
    const tags = new Set();
    for (const post of blogs) {
      if (post.data.tags) {
        for (const tag of post.data.tags) {
          tags.add(tag);
        }
      }
    }
    return Array.from(tags).sort();
  });

  // Collection sitemap : exclut 404, sitemap.xml, et pages avec sitemap.ignore
  eleventyConfig.addCollection("sitemap", function (collectionApi) {
    return collectionApi.getAll().filter((item) => {
      if (item.data.sitemap && item.data.sitemap.ignore === true) return false;
      if (item.data.eleventyExcludeFromCollections) return false;
      if (!item.url || item.url === "") return false;
      // Exclure 404
      if (item.url === "/404.html" || item.url.endsWith("/404.html")) return false;
      return true;
    });
  });

  // Copier les assets inchangés
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy(".nojekyll");
  eleventyConfig.addPassthroughCopy("_redirects");

  // Données globales accessibles partout
  eleventyConfig.addGlobalData("layout", "base.njk");
  eleventyConfig.addGlobalData("buildDate", () => new Date().toISOString().slice(0, 10));

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/",
  };
};
