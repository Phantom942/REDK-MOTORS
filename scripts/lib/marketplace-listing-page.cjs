/** Pont CJS (Eleventy) → module ESM partagé Worker / scripts. */
const path = require("path");
const { pathToFileURL } = require("url");

let modPromise;

function loadMod() {
  if (!modPromise) {
    modPromise = import(pathToFileURL(path.join(__dirname, "marketplace-listing-page.mjs")).href);
  }
  return modPromise;
}

module.exports.createListingDevMiddleware = function createListingDevMiddleware(getEnv) {
  return async function marketplaceListingMiddleware(req, res, next) {
    const m = await loadMod();
    return m.createListingDevMiddleware(getEnv)(req, res, next);
  };
};
