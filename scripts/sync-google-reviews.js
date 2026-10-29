/**
 * Synchronise note + volume d'avis Google au build (CI / local) — jamais de clé API côté client.
 *
 * Env :
 *   GOOGLE_PLACES_API_KEY
 *   GOOGLE_PLACES_PLACE_ID (optionnel si déjà dans site.json)
 *
 * Met à jour rating/count dans site.json et googleReviews.json.
 * Les avis sélectionnés pour les blocs témoignages (pool + reviewPages.js)
 * ne sont JAMAIS écrasés par le slice API.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE_JSON = path.join(ROOT, 'src', '_data', 'site.json');
const REVIEWS_JSON = path.join(ROOT, 'src', '_data', 'googleReviews.json');
const REVIEW_PAGES = path.join(ROOT, 'src', '_data', 'reviewPages.js');

const API_KEY = (process.env.GOOGLE_PLACES_API_KEY || '').trim();
const PLACE_ID_ENV = (process.env.GOOGLE_PLACES_PLACE_ID || '').trim();

function reviewText(review) {
  if (!review || !review.text) return '';
  if (typeof review.text === 'string') return review.text;
  return review.text.text || '';
}

function normalizeAuthor(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function requiredAuthorsFromReviewPages() {
  try {
    const map = require(REVIEW_PAGES);
    const authors = new Set();
    for (const list of Object.values(map)) {
      for (const a of list || []) authors.add(a);
    }
    return [...authors];
  } catch {
    return [];
  }
}

/**
 * Applique une réponse Places (réelle ou simulée) sans détruire le pool curaté.
 * @returns {{ rating: number, count: number, reviews: object[], preservedAuthors: string[], appended: number }}
 */
function applyPlacesPayload(existingReviewsFile, place, options = {}) {
  const existing = existingReviewsFile && typeof existingReviewsFile === 'object'
    ? existingReviewsFile
    : { rating: 4.9, count: 53, reviews: [] };

  const curated = Array.isArray(existing.reviews) ? existing.reviews.slice() : [];
  if (!curated.length && !options.allowEmptyCurated) {
    throw new Error('sync-google-reviews: pool d’avis curaté vide — refus d’écraser.');
  }

  const byAuthor = new Map();
  for (const r of curated) {
    byAuthor.set(normalizeAuthor(r.author), r);
  }

  const apiReviews = (place.reviews || []).map((review) => {
    const entry = {
      author: (review.authorAttribution && review.authorAttribution.displayName) || 'Client Google',
      rating: review.rating || 5,
      text: reviewText(review),
    };
    if (review.publishTime) {
      entry.date = String(review.publishTime).slice(0, 10);
    }
    return entry;
  });

  let appended = 0;
  for (const r of apiReviews) {
    const key = normalizeAuthor(r.author);
    if (!key || byAuthor.has(key)) continue;
    byAuthor.set(key, r);
    appended += 1;
  }

  const merged = [...byAuthor.values()];
  const required = options.requiredAuthors || requiredAuthorsFromReviewPages();
  const missing = required.filter((a) => !byAuthor.has(normalizeAuthor(a)));
  if (missing.length) {
    throw new Error(
      `sync-google-reviews: auteurs témoignages manquants après fusion — ${missing.join(', ')}`,
    );
  }

  const rating =
    typeof place.rating === 'number'
      ? place.rating
      : existing.rating != null
        ? existing.rating
        : 4.9;
  const count =
    typeof place.userRatingCount === 'number'
      ? place.userRatingCount
      : existing.count != null
        ? existing.count
        : merged.length;

  return {
    rating,
    count,
    reviews: merged,
    preservedAuthors: curated.map((r) => r.author),
    appended,
  };
}

function writeSyncedFiles(site, reviewsPayload) {
  const { rating, count, reviews } = reviewsPayload;

  fs.writeFileSync(
    REVIEWS_JSON,
    JSON.stringify({ rating, count, reviews }, null, 2) + '\n',
    'utf8',
  );

  site.googleReviews.rating = rating;
  site.googleReviews.count = count;
  delete site.googleReviews.apiKey;
  const ratingLabel = String(rating).replace('.', ',');
  if (typeof site.description === 'string') {
    site.description = site.description.replace(
      /[\d,]+\/5\s*·\s*\d+\s*avis Google/,
      `${ratingLabel}/5 · ${count} avis Google`,
    );
  }
  fs.writeFileSync(SITE_JSON, JSON.stringify(site, null, 2) + '\n', 'utf8');
}

async function fetchPlaceReviews(placeId) {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'reviews,rating,userRatingCount,displayName',
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`place details HTTP ${response.status}: ${body.slice(0, 300)}`);
  }

  return response.json();
}

async function main() {
  if (!API_KEY) {
    console.log('sync-google-reviews: pas de GOOGLE_PLACES_API_KEY — avis statiques conservés.');
    return;
  }

  const site = JSON.parse(fs.readFileSync(SITE_JSON, 'utf8'));
  const placeId = PLACE_ID_ENV || (site.googleReviews.placeId || '').trim();
  if (!placeId) {
    console.warn('sync-google-reviews: Place ID manquant — avis statiques conservés.');
    return;
  }

  const existingReviews = JSON.parse(fs.readFileSync(REVIEWS_JSON, 'utf8'));

  try {
    const place = await fetchPlaceReviews(placeId);
    if (!(place.reviews || []).length && place.userRatingCount == null && place.rating == null) {
      console.warn('sync-google-reviews: réponse API vide — fichiers conservés.');
      return;
    }

    const payload = applyPlacesPayload(existingReviews, place);
    writeSyncedFiles(site, payload);

    console.log(
      `sync-google-reviews: OK — note ${payload.rating}/5, ${payload.count} avis (pool curaté ${payload.reviews.length} cartes, +${payload.appended} nouveaux).`,
    );
  } catch (err) {
    console.warn('sync-google-reviews: échec —', err.message, '(avis statiques conservés)');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  applyPlacesPayload,
  normalizeAuthor,
  requiredAuthorsFromReviewPages,
  reviewText,
};
