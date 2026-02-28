module.exports = function (eleventyConfig) {
  // Filtre JSON pour JSON-LD
  eleventyConfig.addFilter("json", (obj) => JSON.stringify(obj));

  // Filtre date pour sitemap (ISO YYYY-MM-DD)
  eleventyConfig.addFilter("dateToIso", (date) => {
    if (!date) return new Date().toISOString().slice(0, 10);
    const d = new Date(date);
    return isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
  });

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
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy(".nojekyll");

  // Données globales accessibles partout
  eleventyConfig.addGlobalData("layout", "base.njk");

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
