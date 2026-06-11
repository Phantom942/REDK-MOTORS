const localBusiness = require("./localBusiness.json");
const site = require("./site.json");

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

  schema.aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: String(rating),
    reviewCount: String(count),
    bestRating: "5",
    worstRating: "1",
  };

  return schema;
};
