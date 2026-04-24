// Source unique NAP + config site - dérivé de localBusiness
const localBusiness = require("./localBusiness.json");
const schema = localBusiness.schema;

module.exports = function () {
  return {
    site: {
      name: schema.name,
      url: schema.url,
      description: schema.description,
      locale: "fr_FR",
      phone: schema.telephone,
      phoneDisplay: "06.48.74.56.68", // Format affichage FR
      email: schema.email,
      address: schema.address.streetAddress,
      postalCode: schema.address.postalCode,
      city: schema.address.addressLocality,
      addressFull: `${schema.address.streetAddress}, ${schema.address.postalCode} ${schema.address.addressLocality}`,
      openingHours: "Lun-Sam 10h-20h",
      ogImage: `${schema.url}/assets/img/og-brand.png`,
      gtmId: "GTM-NTC72X2G",
      nav: [
        { key: "index", title: "Accueil", url: "/" },
        { key: "tarifs", title: "Tarifs", url: "/tarifs/" },
        { key: "mecanique", title: "Mécanique", url: "/mecanique/" },
        { key: "carrosserie", title: "Carrosserie", url: "/carrosserie/" },
        { key: "entretien", title: "Entretien", url: "/entretien/" },
        { key: "pneumatiques", title: "Pneumatiques", url: "/pneumatiques/" },
        { key: "diagnostic", title: "Diagnostic", url: "/diagnostic/" },
        { key: "achat-revente", title: "Achat & revente", url: "/achat-revente/" },
        { key: "location", title: "Location", url: "/location/" },
        { key: "contact", title: "Contact", url: "/contact/" },
        { key: "blog", title: "Blog", url: "/blog/" },
      ],
      sitelinksHints: [
        { "@type": "ListItem", position: 1, name: "Contact", url: `${schema.url}/contact/` },
        { "@type": "ListItem", position: 2, name: "Tarifs", url: `${schema.url}/tarifs/` },
        { "@type": "ListItem", position: 3, name: "Diagnostic", url: `${schema.url}/diagnostic/` },
        { "@type": "ListItem", position: 4, name: "Mécanique", url: `${schema.url}/mecanique/` },
        { "@type": "ListItem", position: 5, name: "Carrosserie", url: `${schema.url}/carrosserie/` },
      ],
    },
  };
};
