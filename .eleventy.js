const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const indexableTags = JSON.parse(
  fs.readFileSync(path.join(__dirname, "src/_data/indexableTags.json"), "utf8")
);

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

  eleventyConfig.addFilter("pageFaqs", (faqs, faqSchema, limit = 3) => {
    if (Array.isArray(faqs) && faqs.length) {
      return faqs.slice(0, limit);
    }
    const entities = faqSchema?.mainEntity;
    if (!Array.isArray(entities) || !entities.length) {
      return [];
    }
    return entities.slice(0, limit).map((item) => ({
      question: item.name,
      answer: item.acceptedAnswer?.text || "",
    }));
  });

  eleventyConfig.addFilter("urlencode", (value) => encodeURIComponent(String(value ?? "")));

  const { resolvePageReviews } = require("./src/_data/reviewResolver.js");
  eleventyConfig.addFilter("resolvePageReviews", (pageId, googleReviews, count, overrideAuthors) => {
    return resolvePageReviews(pageId, googleReviews, count || 2, overrideAuthors);
  });

  // Filtre date pour sitemap (ISO YYYY-MM-DD) — pas de fallback, retourne vide si invalide
  eleventyConfig.addFilter("dateToIso", (date) => {
    if (!date) return "";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  });

  // Collection blog triée par date décroissante (hors brouillons)
  eleventyConfig.addCollection("blog", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob(["src/blog/articles/*.njk", "src/blog/drafts/*.njk"])
      .filter((item) => !item.data.draft)
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  // Brouillons : pas de page générée
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      if (data.draft) return false;
      return data.permalink;
    },
    faqSchema: (data) => {
      if (data.faqSchema) return data.faqSchema;
      if (!data.profil?.faqs) return undefined;
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.profil.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      };
    },
    keywords: (data) => {
      if (data.profil?.keywords) return data.profil.keywords;
      return data.keywords;
    },
    itemListSchema: (data) => {
      if (data.pageKey !== "professionnels") return data.itemListSchema;
      const profiles = data.professionnels?.profiles || [];
      const base = data.site?.url || "https://redk-motors.me";
      return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Espace Pro RED-K MOTORS — profils professionnels",
        itemListElement: profiles.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.navTitle,
          url: `${base}/professionnels/${p.slug}/`,
        })),
      };
    },
    localServiceSchema: (data) => {
      const base = data.site?.url || "https://redk-motors.me";
      const areaServed = [
        { "@type": "City", name: "Ivry-sur-Seine" },
        { "@type": "City", name: "Vitry-sur-Seine" },
        { "@type": "City", name: "Villejuif" },
        { "@type": "AdministrativeArea", name: "Paris 13e arrondissement" },
        { "@type": "AdministrativeArea", name: "Val-de-Marne" },
      ];

      if (data.profil) {
        const p = data.profil;
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${base}/professionnels/${p.slug}/#service`,
          name: p.navTitle,
          serviceType: p.serviceType,
          url: `${base}/professionnels/${p.slug}/`,
          description: p.description,
          provider: { "@id": `${base}/#business` },
          areaServed,
          audience: {
            "@type": "BusinessAudience",
            audienceType: p.audienceType || "Professionnels du transport et des services",
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "EUR",
            description: "Devis pro gratuit — tarifs préférentiels sur demande",
            url: `${base}/contact/`,
          },
        };
      }

      if (data.pageKey === "professionnels" && data.localServiceSchema) {
        return {
          ...data.localServiceSchema,
          "@id": `${base}/professionnels/#service`,
          name: "Espace Pro — entretien véhicules professionnels",
          url: `${base}/professionnels/`,
          areaServed,
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Taxis, VTC, livreurs, flottes, auto-écoles et professionnels routiers",
          },
        };
      }

      return data.localServiceSchema;
    },
  });

  // Liste des tags uniques pour les pages par tag
  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const blogs = collectionApi
      .getFilteredByGlob(["src/blog/articles/*.njk", "src/blog/drafts/*.njk"])
      .filter((item) => !item.data.draft);
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
    const excludedPrefixes = [
      "/garage-proche-",
      "/garage-vtc-",
      "/garage-taxi-",
      "/garage-chauffeur-prive-",
      "/garage-voiture-uber-",
      "/mecanicien-rapide-",
      "/mecanique-rapide-",
      "/diagnostic-auto-",
      "/revision-auto-",
      "/blog/tag/",
      "/devis-garage-",
      "/garage-urgence-",
      "/garage-flotte-entreprise-",
      "/garage-pneus-freins-",
      "/entretien-vehicule-vtc-",
      "/entretien-preventif-vtc-",
      "/entretien-voiture-professionnelle-",
      "/entretien-taxi-",
      "/changement-batterie-",
      "/changement-plaquettes-frein-",
      "/perte-puissance-voiture-",
      "/voiture-ne-demarre-plus-",
      "/consommation-carburant-elevee-",
      "/tremblement-volant-autoroute-",
      "/bruit-frein-voiture-",
      "/clim-voiture-ne-refroidit-plus-",
      "/voyant-abs-allume-",
      "/diagnostic-voyant-moteur-",
      "/vidange-rapide-",
      "/revision-rapide-",
      "/reparation-auto-paris-sud/",
      "/carrosserie-peinture-ivry/",
      "/lp-",
    ];

    return collectionApi.getAll().filter((item) => {
      if (item.data.sitemap && item.data.sitemap.ignore === true) return false;
      if (item.data.eleventyExcludeFromCollections) return false;
      if (!item.url || item.url === "") return false;
      // Exclure les URLs explicitement noindex de la sitemap
      if (typeof item.data.robots === "string" && item.data.robots.toLowerCase().includes("noindex")) return false;
      // Cohérence avec base.njk : exclure les familles d'URLs noindex
      if (excludedPrefixes.some((prefix) => item.url.includes(prefix))) {
        // Pages tag indexables : garder dans la sitemap
        if (item.url.startsWith("/blog/tag/")) {
          const tagSlug = item.url.replace(/^\/blog\/tag\//, "").replace(/\/$/, "");
          if (indexableTags.includes(tagSlug)) return true;
        }
        return false;
      }
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
