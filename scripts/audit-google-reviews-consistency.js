#!/usr/bin/env node
/**
 * Vérifie que note + compteur d'avis Google sont cohérents
 * entre site.json, googleReviews.json et les chaînes affichées
 * (pas de compteurs obsolètes 42 / 45 / 51 en dur hors sync).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/_data/site.json'), 'utf8'));
const reviews = JSON.parse(fs.readFileSync(path.join(root, 'src/_data/googleReviews.json'), 'utf8'));

const EXPECTED_COUNT = site.googleReviews?.count;
const EXPECTED_RATING = site.googleReviews?.rating;
let failed = 0;

function ok(msg) {
  console.log(`✓ ${msg}`);
}
function fail(msg) {
  console.error(`✗ ${msg}`);
  failed += 1;
}

if (!EXPECTED_COUNT || !EXPECTED_RATING) {
  fail('site.googleReviews.count / rating manquants');
  process.exit(1);
}

if (reviews.count !== EXPECTED_COUNT) {
  fail(`googleReviews.json count=${reviews.count} ≠ site.json count=${EXPECTED_COUNT}`);
} else {
  ok(`count aligné : ${EXPECTED_COUNT}`);
}

if (Number(reviews.rating) !== Number(EXPECTED_RATING)) {
  fail(`googleReviews.json rating=${reviews.rating} ≠ site.json rating=${EXPECTED_RATING}`);
} else {
  ok(`rating aligné : ${EXPECTED_RATING}`);
}

const staleCounts = [42, 45, 51];
const scanRoots = [
  path.join(root, 'src'),
  path.join(root, 'assets'),
];
const skipNames = new Set(['googleReviews.json', 'node_modules']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipNames.has(entry.name) || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(njk|js|json|html|md|txt)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const files = scanRoots.flatMap((d) => (fs.existsSync(d) ? walk(d) : []));
const ratingLabel = String(EXPECTED_RATING).replace('.', ',');

for (const file of files) {
  const rel = path.relative(root, file);
  // Fichiers de données source : seuls count/rating JSON font foi
  if (rel.replace(/\\/g, '/') === 'src/_data/site.json') continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const stale of staleCounts) {
    const re = new RegExp(`\\b${stale}\\s*avis\\b`, 'i');
    if (re.test(text)) {
      fail(`${rel} contient encore « ${stale} avis » (obsolète ; référence = ${EXPECTED_COUNT})`);
    }
  }
}

ok(`Aucun compteur obsolète 42/45/51 avis (référence propriétaire/site = ${EXPECTED_COUNT}, note ${ratingLabel}/5)`);

if (failed) {
  console.error(`\nAudit avis Google : ${failed} échec(s)`);
  process.exit(1);
}
console.log('\nAudit avis Google : OK');
