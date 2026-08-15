const team = require("../_data/team.json");
const enhancements = require("../_data/blogArticleEnhancements.js");

const SITE_URL = "https://redkmotors.fr";
const LOGO_URL = `${SITE_URL}/assets/img/logo-redk-motors.png`;
const OG_DEFAULT = `${SITE_URL}/assets/img/og-brand.png`;

function slugFromPermalink(permalink) {
  if (!permalink || typeof permalink !== "string") return "";
  const match = permalink.match(/\/blog\/([^/]+)\/?$/);
  return match ? match[1] : "";
}

function pickEnhancement(data) {
  const slug = slugFromPermalink(data.permalink);
  return enhancements[slug] || {};
}

module.exports = {
  eleventyComputed: {
    ogImage: (data) => data.ogImage || OG_DEFAULT,
    lastReviewed: (data) => data.lastReviewed || data.date,
    directAnswer: (data) => data.directAnswer || pickEnhancement(data).directAnswer,
    relatedLinks: (data) => data.relatedLinks || pickEnhancement(data).relatedLinks,
    faqSchema: (data) => {
      if (data.faqSchema) return data.faqSchema;
      const extra = pickEnhancement(data).faqSchema;
      return extra || undefined;
    },
    articleSchema: (data) => {
      if (!data.articleSchema) return undefined;

      const schema = JSON.parse(JSON.stringify(data.articleSchema));
      const reviewed = data.lastReviewed || data.date;

      schema.author = {
        "@type": "Person",
        "@id": `${SITE_URL}/#${team.author.id}`,
        name: team.author.name,
        jobTitle: team.author.jobTitle,
        url: `${SITE_URL}/equipe/`,
        worksFor: { "@id": `${SITE_URL}/#business` },
      };
      schema.publisher = {
        "@type": "Organization",
        name: "RED-K MOTORS",
        logo: {
          "@type": "ImageObject",
          url: LOGO_URL,
        },
      };
      schema.image = data.ogImage || OG_DEFAULT;
      schema.dateModified = reviewed;
      return schema;
    },
  },
};
