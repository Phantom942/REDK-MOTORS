#!/usr/bin/env node
/**
 * Vérifie que les pageKey indexables ont des meta keywords.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { keywordsForPageKey } = require("../src/_data/seoKeywordClusters.js");
const { all: prestations } = require("../src/_data/prestations.js");
const professionnels = require("../src/_data/professionnels.js");
const profiles = professionnels.profiles || [];

const ARTICLES_DIR = path.join(__dirname, "../src/blog/articles");

/** pageKeys attendus sur pages indexables (hors blog article = keywords front matter). */
function expectedPageKeys() {
  const keys = new Set([
    "index",
    "garage-ivry",
    "diagnostic",
    "mecanique",
    "entretien",
    "freins",
    "pneumatiques",
    "vidange",
    "carrosserie",
    "pare-brise",
    "tarifs",
    "contact",
    "prestations",
    "blog",
    "exemples-hub",
    "links",
    "climIvrySeo",
    "vitry",
    "villejuif",
    "paris13",
    "alfortville",
    "maisonsAlfort",
    "kremlinBicetre",
    "charenton",
    "professionnels",
    "exemple-prix",
    "exemple-modele-hub",
    "abs94Seo",
    "clim94Seo",
    "batterie94Seo",
    "plaquettes94Seo",
    "revision94Seo",
    "revisionIvrySeo",
    "vidangeRapideIvrySeo",
    "voyant94Seo",
    "devisGarage94Seo",
    "garageSamedi94Seo",
    "reparationParisSudSeo",
    "demarrage94Seo",
    "pertePuissance94Seo",
    "pneusFreins94Seo",
    "pneusIvrySeo",
    "diagnostic94Seo",
  ]);

  for (const p of prestations) keys.add(`prestation-${p.slug}`);
  for (const p of profiles) keys.add(p.key);

  return keys;
}

function articleHasKeywords(file) {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
  return /^\s*keywords:\s*"/m.test(raw) || /profil:\s*\n[\s\S]*?keywords:/m.test(raw);
}

let failed = 0;

for (const key of expectedPageKeys()) {
  const kw = keywordsForPageKey(key);
  if (!kw || kw.length < 15) {
    console.error(`✗ keywords manquants — pageKey ${key}`);
    failed++;
  }
}

const articles = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".njk"));
const missingArticleKw = articles.filter((f) => !articleHasKeywords(f));
if (missingArticleKw.length) {
  console.error(`✗ articles sans keywords: ${missingArticleKw.join(", ")}`);
  failed += missingArticleKw.length;
}

console.log(
  `pageKey indexables: ${expectedPageKeys().size}, articles: ${articles.length}, sans kw: ${missingArticleKw.length}`,
);

if (failed) {
  console.error(`audit-page-keywords : ${failed} échec(s)`);
  process.exit(1);
}
console.log("audit-page-keywords — OK");
