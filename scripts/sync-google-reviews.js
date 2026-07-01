/**
 * Synchronise les avis Google au build (CI / local) — jamais de clé API côté client.
 *
 * Env :
 *   GOOGLE_PLACES_API_KEY
 *   GOOGLE_PLACES_PLACE_ID (optionnel si déjà dans site.json)
 *
 * Met à jour src/_data/googleReviews.json et rating/count dans site.json.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE_JSON = path.join(ROOT, 'src', '_data', 'site.json');
const REVIEWS_JSON = path.join(ROOT, 'src', '_data', 'googleReviews.json');

const API_KEY = (process.env.GOOGLE_PLACES_API_KEY || '').trim();
const PLACE_ID_ENV = (process.env.GOOGLE_PLACES_PLACE_ID || '').trim();

function reviewText(review) {
  if (!review || !review.text) return '';
  if (typeof review.text === 'string') return review.text;
  return review.text.text || '';
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

  try {
    const place = await fetchPlaceReviews(placeId);
    const maxReviews = site.googleReviews.maxReviews || 4;
    const reviews = (place.reviews || []).slice(0, maxReviews).map((review) => {
      const entry = {
        author: (review.authorAttribution && review.authorAttribution.displayName) || "Client Google",
        rating: review.rating || 5,
        text: reviewText(review),
      };
      if (review.publishTime) {
        entry.date = review.publishTime.slice(0, 10);
      }
      return entry;
    });

    if (!reviews.length) {
      console.warn('sync-google-reviews: aucun avis retourné par l’API — fichiers conservés.');
      return;
    }

    const rating = place.rating || site.googleReviews.rating || 5;
    const count = place.userRatingCount || site.googleReviews.count || reviews.length;

    fs.writeFileSync(
      REVIEWS_JSON,
      JSON.stringify({ rating, count, reviews }, null, 2) + '\n',
      'utf8',
    );

    site.googleReviews.rating = rating;
    site.googleReviews.count = count;
    delete site.googleReviews.apiKey;
    fs.writeFileSync(SITE_JSON, JSON.stringify(site, null, 2) + '\n', 'utf8');

    console.log(
      `sync-google-reviews: OK — note ${rating}/5, ${count} avis, ${reviews.length} cartes exportées.`,
    );
  } catch (err) {
    console.warn('sync-google-reviews: échec —', err.message, '(avis statiques conservés)');
  }
}

main();
