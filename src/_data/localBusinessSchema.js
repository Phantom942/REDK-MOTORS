const localBusiness = require("./localBusiness.json");
const site = require("./site.json");
const team = require("./team.json");
const { all: prestationCatalog } = require("./prestations.js");

const SITE_URL = "https://redkmotors.fr";

const CORE_KNOWS_ABOUT = [
  "Diagnostic automobile",
  "Entretien et révision véhicule",
  "Freinage et plaquettes de frein",
  "Changement de pneus et géométrie",
  "Recharge et réparation climatisation",
  "Carrosserie et pare-brise",
  "Mécanique générale multimarque",
  "Garage Val-de-Marne (94)",
];

/** Schema LocalBusiness enrichi (GPS Google Maps + avis depuis site.json). */
module.exports = function localBusinessSchema() {
  const schema = JSON.parse(JSON.stringify(localBusiness.schema));
  const { latitude, longitude } = site.geo;

  schema.geo = {
    "@type": "GeoCoordinates",
    latitude,
    longitude,
  };

  const geoCircle = schema.areaServed.find((item) => item["@type"] === "GeoCircle");
  if (geoCircle?.geoMidpoint) {
    geoCircle.geoMidpoint.latitude = latitude;
    geoCircle.geoMidpoint.longitude = longitude;
  }

  schema.employee = {
    "@type": "Person",
    "@id": `${SITE_URL}/#${team.author.id}`,
    name: team.author.name,
    jobTitle: team.author.jobTitle,
    url: `${SITE_URL}/equipe/`,
  };

  schema.knowsAbout = [
    ...CORE_KNOWS_ABOUT,
    ...prestationCatalog.map((entry) => entry.name),
  ];

  // Pas d'aggregateRating / review JSON-LD : avis collectés sur Google
  // (balisage non conforme aux règles Google si recopié ici).

  const placeId = (process.env.GOOGLE_PLACES_PLACE_ID || site.googleReviews.placeId || "").trim();
  if (placeId) {
    schema.additionalProperty = [
      {
        "@type": "PropertyValue",
        name: "Google Place ID",
        value: placeId,
      },
    ];
    if (!schema.sameAs.includes(`https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(placeId)}`)) {
      schema.sameAs.push(`https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(placeId)}`);
    }
  }

  delete schema["@context"];

  return schema;
};
