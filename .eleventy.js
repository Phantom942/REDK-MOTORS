module.exports = function (eleventyConfig) {
  // Filtre JSON pour JSON-LD
  eleventyConfig.addFilter("json", (obj) => JSON.stringify(obj));

  // Copier les assets inchangés
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("blog");
  eleventyConfig.addPassthroughCopy("sitemap.xml");

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
