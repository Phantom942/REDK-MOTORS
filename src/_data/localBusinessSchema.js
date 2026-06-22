const localBusiness = require("./localBusiness.json");
const googleReviews = require("./googleReviews.json");
const site = require("./site.json");
const team = require("./team.json");

const SITE_URL = "https://redk-motors.me";

/** Schema LocalBusiness enrichi (GPS Google Maps + avis depuis site.json). */
module.exports = function localBusinessSchema() {
  const schema = JSON.parse(JSON.stringify(localBusiness.schema));
  const { latitude, longitude } = site.geo;
  const { rating, count } = site.googleReviews;

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

  schema.aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: rating,
    reviewCount: count,
    bestRating: 5,
    worstRating: 1,
  };

  schema.review = googleReviews.reviews.slice(0, 4).map((entry) => ({
    "@type": "Review",
    author: { "@type": "Person", name: entry.author },
    reviewRating: {
      "@type": "Rating",
      ratingValue: entry.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: entry.text,
    datePublished: entry.date || undefined,
  }));

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
