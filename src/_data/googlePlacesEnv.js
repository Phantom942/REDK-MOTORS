const site = require('./site.json');

/** Clés Google injectées au build (GitHub Secrets / local), sans commit de secrets. */
module.exports = {
  apiKey: (process.env.GOOGLE_PLACES_API_KEY || site.googleReviews.apiKey || '').trim(),
  placeId: (process.env.GOOGLE_PLACES_PLACE_ID || site.googleReviews.placeId || '').trim(),
};
