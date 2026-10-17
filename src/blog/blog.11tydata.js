const team = require("../_data/team.json");
const enhancements = require("../_data/blogArticleEnhancements.js");
const blogKeywords = require("../_data/blogKeywords.js");

const SITE_URL = "https://redkmotors.fr";
const LOGO_URL = `${SITE_URL}/assets/img/logo-redk-motors.png`;
const OG_DEFAULT = `${SITE_URL}/assets/img/og-brand.png`;

function normalizePagePath(url) {
  if (!url || typeof url !== "string") return "";
  return url.replace(/\/index\.html$/, "/");
}

function slugFromPath(urlPath) {
  if (!urlPath || typeof urlPath !== "string") return "";
  const articles = urlPath.match(/\/blog\/articles\/([^/]+)\/?$/);
  if (articles) return articles[1];
  const match = urlPath.match(/\/blog\/([^/]+)\/?$/);
  if (!match) return "";
  const slug = match[1];
  if (slug === "articles" || slug === "tag" || slug === "page") return "";
  return slug;
}

function slugFromData(data) {
  return (
    slugFromPath(data.permalink) ||
    slugFromPath(normalizePagePath(data.page?.url)) ||
    data.page?.fileSlug ||
    ""
  );
}

function canonicalFromData(data) {
  const pagePath = normalizePagePath(data.page?.url);
  if (pagePath) return `${SITE_URL}${pagePath}`;
  if (data.permalink) {
    const p = data.permalink.endsWith("/") ? data.permalink : `${data.permalink}/`;
    return `${SITE_URL}${p}`;
  }
  const slug = slugFromData(data);
  return slug ? `${SITE_URL}/blog/articles/${slug}/` : SITE_URL;
}

function pickEnhancement(data) {
  const slug = slugFromData(data);
  return enhancements[slug] || {};
}

function pickKeywords(data) {
  const slug = slugFromData(data);
  return blogKeywords[slug] || null;
}

function keywordsToSchemaString(kw) {
  if (!kw) return undefined;
  const candidates = Array.isArray(kw.candidateQueries) ? kw.candidateQueries.slice(0, 3) : [];
  return [kw.primary, ...kw.secondary, ...kw.longTail, ...candidates].join(", ");
}

module.exports = {
  eleventyComputed: {
    ogImage: (data) => data.ogImage || OG_DEFAULT,
    lastReviewed: (data) => data.lastReviewed || data.date,
    seoKeywords: (data) => pickKeywords(data),
    directAnswer: (data) => data.directAnswer || pickEnhancement(data).directAnswer,
    directAnswerSchema: (data) => {
      if (data.directAnswerSchema) return data.directAnswerSchema;
      const da = data.directAnswer || pickEnhancement(data).directAnswer;
      if (!da) return undefined;
      const factText = Array.isArray(da.facts)
        ? da.facts.map((f) => `${f.label} : ${f.value}`).join(". ")
        : "";
      return {
        "@context": "https://schema.org",
        "@type": "Question",
        name: da.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: factText ? `${da.answer} ${factText}`.trim() : da.answer,
        },
      };
    },
    relatedLinks: (data) => data.relatedLinks || pickEnhancement(data).relatedLinks,
    faqSchema: (data) => {
      if (data.faqSchema) return data.faqSchema;
      const extra = pickEnhancement(data).faqSchema;
      return extra || undefined;
    },
    breadcrumb: (data) => {
      if (!data.breadcrumb) return undefined;
      const bc = JSON.parse(JSON.stringify(data.breadcrumb));
      const canonical = canonicalFromData(data);
      const items = bc.itemListElement;
      if (Array.isArray(items) && items.length) {
        items[items.length - 1].item = canonical;
      }
      return bc;
    },
    articleSchema: (data) => {
      if (!data.articleSchema) return undefined;

      const schema = JSON.parse(JSON.stringify(data.articleSchema));
      const reviewed = data.lastReviewed || data.date;
      const kwString = keywordsToSchemaString(pickKeywords(data));
      const canonical = canonicalFromData(data);

      if (kwString) {
        schema.keywords = kwString;
      }

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
      schema.mainEntityOfPage = {
        "@type": "WebPage",
        "@id": canonical,
      };
      schema.url = canonical;
      return schema;
    },
  },
};
