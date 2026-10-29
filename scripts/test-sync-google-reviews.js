#!/usr/bin/env node
/**
 * Simule une réponse Places différente et vérifie que le pool curaté /
 * reviewPages.js n'est pas détruit, et que count/rating restent cohérents.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const {
  applyPlacesPayload,
  normalizeAuthor,
  requiredAuthorsFromReviewPages,
} = require('./sync-google-reviews.js');

function ok(msg) {
  console.log(`OK: ${msg}`);
}

const existing = JSON.parse(
  fs.readFileSync(path.join(root, 'src/_data/googleReviews.json'), 'utf8'),
);
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/_data/site.json'), 'utf8'));

assert.strictEqual(existing.count, 53);
assert.strictEqual(existing.rating, 4.9);
assert.strictEqual(site.googleReviews.count, 53);
assert.strictEqual(site.googleReviews.rating, 4.9);
ok('référence actuelle 53 / 4.9 alignée site + googleReviews.json');

const required = requiredAuthorsFromReviewPages();
assert.ok(required.length > 5, 'reviewPages doit lister des auteurs');
for (const author of required) {
  const found = existing.reviews.some(
    (r) => normalizeAuthor(r.author) === normalizeAuthor(author),
  );
  assert.ok(found, `auteur curaté manquant dans le pool: ${author}`);
}
ok(`tous les auteurs reviewPages (${required.length}) présents dans le pool`);

const fakePlace = {
  rating: 4.8,
  userRatingCount: 61,
  reviews: [
    {
      authorAttribution: { displayName: 'API Fake One' },
      rating: 5,
      text: { text: 'Avis API fictif 1' },
      publishTime: '2026-10-01T12:00:00Z',
    },
    {
      authorAttribution: { displayName: 'API Fake Two' },
      rating: 4,
      text: { text: 'Avis API fictif 2' },
      publishTime: '2026-10-02T12:00:00Z',
    },
    {
      authorAttribution: { displayName: 'Moove City' },
      rating: 5,
      text: { text: 'Texte API différent pour auteur déjà curaté' },
      publishTime: '2026-10-03T12:00:00Z',
    },
  ],
};

const merged = applyPlacesPayload(existing, fakePlace, { requiredAuthors: required });

assert.strictEqual(merged.count, 61);
assert.strictEqual(merged.rating, 4.8);
ok('note/volume API appliqués (61 / 4.8) sans toucher au pool destructivement');

for (const author of existing.reviews.map((r) => r.author)) {
  assert.ok(
    merged.reviews.some((r) => normalizeAuthor(r.author) === normalizeAuthor(author)),
    `avis curaté disparu: ${author}`,
  );
}
ok('aucun avis curaté effacé');

const moove = merged.reviews.find((r) => normalizeAuthor(r.author) === normalizeAuthor('Moove City'));
assert.ok(moove);
assert.notStrictEqual(
  moove.text,
  'Texte API différent pour auteur déjà curaté',
  'texte curaté Moove City doit être conservé (pas écrasé par API)',
);
ok('auteur déjà curaté : texte témoignage conservé');

assert.ok(
  merged.reviews.some((r) => r.author === 'API Fake One'),
  'nouveaux auteurs API peuvent être ajoutés',
);
assert.ok(merged.appended >= 2);
ok(`nouveaux avis API ajoutés (+${merged.appended})`);

for (const author of required) {
  assert.ok(
    merged.reviews.some((r) => normalizeAuthor(r.author) === normalizeAuthor(author)),
    `reviewPages cassé pour ${author}`,
  );
}
ok('reviewPages toujours satisfait après sync simulée');

assert.throws(
  () =>
    applyPlacesPayload(
      { rating: 5, count: 1, reviews: [{ author: 'Seul', rating: 5, text: 'x' }] },
      { rating: 5, userRatingCount: 2, reviews: [] },
      { requiredAuthors: ['Moove City'] },
    ),
  /manquants/,
);
ok('échec explicite si auteurs témoignages manquants');

console.log('Tests sync Google reviews: OK');
