const team = require("../_data/team.json");

const SITE_URL = "https://redk-motors.me";
const LOGO_URL = `${SITE_URL}/assets/img/logo-redk-motors.png`;

module.exports = {
  eleventyComputed: {
    articleSchema: (data) => {
      if (!data.articleSchema) return undefined;

      const schema = JSON.parse(JSON.stringify(data.articleSchema));
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
      schema.image = data.ogImage || `${SITE_URL}/assets/img/og-brand.png`;
      return schema;
    },
  },
};
