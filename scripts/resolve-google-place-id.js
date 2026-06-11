/**
 * Résout le Place ID Google (Places API New) pour RED-K MOTORS.
 *
 * Usage :
 *   set GOOGLE_PLACES_API_KEY=AIza...   (Windows)
 *   export GOOGLE_PLACES_API_KEY=AIza... (macOS/Linux)
 *   npm run google:place-id
 *
 * Met à jour src/_data/site.json → googleReviews.placeId
 * et affiche l'ID à copier dans le secret GitHub GOOGLE_PLACES_PLACE_ID.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const SITE_JSON = path.join(__dirname, '..', 'src', '_data', 'site.json');
const API_KEY = (process.env.GOOGLE_PLACES_API_KEY || '').trim();
const PLACE_QUERY = 'RED-K MOTORS, 9 rue Michelet, 94200 Ivry-sur-Seine, France';

async function searchPlaceId() {
  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.googleMapsUri',
    },
    body: JSON.stringify({
      textQuery: PLACE_QUERY,
      languageCode: 'fr',
      regionCode: 'FR',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error('Places searchText HTTP ' + response.status + ': ' + body.slice(0, 300));
  }

  const data = await response.json();
  if (!data.places || !data.places.length) {
    throw new Error('Aucun lieu trouvé pour : ' + PLACE_QUERY);
  }

  return data.places[0];
}

function updateSiteJson(placeId) {
  const site = JSON.parse(fs.readFileSync(SITE_JSON, 'utf8'));
  site.googleReviews.placeId = placeId;
  fs.writeFileSync(SITE_JSON, JSON.stringify(site, null, 2) + '\n', 'utf8');
}

async function main() {
  if (!API_KEY) {
    console.error('Erreur : définissez GOOGLE_PLACES_API_KEY (Places API New activée).');
    console.error('Exemple : npm run google:place-id');
    process.exit(1);
  }

  const place = await searchPlaceId();
  const placeId = place.id;

  console.log('Lieu trouvé :', place.displayName && place.displayName.text, '-', place.formattedAddress);
  console.log('Place ID    :', placeId);
  if (place.googleMapsUri) {
    console.log('Maps URI    :', place.googleMapsUri);
  }

  updateSiteJson(placeId);
  console.log('\nOK — site.json mis à jour (googleReviews.placeId).');
  console.log('Ajoutez aussi ce secret GitHub Actions : GOOGLE_PLACES_PLACE_ID=' + placeId);
}

main().catch(function(err) {
  console.error('Échec :', err.message);
  process.exit(1);
});
