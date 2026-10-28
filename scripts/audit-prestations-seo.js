#!/usr/bin/env node
/** Vérifie meta keywords + slugs prestations (40 fiches). */
const prestationKeywords = require("../src/_data/prestationKeywords.js");
const { all } = require("../src/_data/prestations.js");

let failed = 0;

const slugs = all.map((p) => p.slug);
const kwSlugs = Object.keys(prestationKeywords);

for (const slug of slugs) {
  const kw = prestationKeywords[slug];
  if (!kw || kw.length < 20) {
    console.error(`✗ keywords manquants ou trop courts — ${slug}`);
    failed += 1;
  }
}

for (const slug of kwSlugs) {
  if (!slugs.includes(slug)) {
    console.error(`✗ keywords orphelin (slug inconnu) — ${slug}`);
    failed += 1;
  }
}

console.log(`Prestations : ${slugs.length} fiches, ${kwSlugs.length} jeux keywords`);

if (failed) {
  console.error(`audit-prestations-seo : ${failed} échec(s)`);
  process.exit(1);
}
console.log("audit-prestations-seo — OK");
