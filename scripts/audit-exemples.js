#!/usr/bin/env node
/**
 * Audit politique /exemples/ — 32 indexables, 508 noindex thin.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const priceExamples = require("../src/_data/priceExamples.js");
const priceExamplesHub = require("../src/_data/priceExamplesHub.js");

const all = priceExamples.all || [];
const generic = all.filter((e) => e.isGeneric);
const thin = all.filter((e) => !e.isGeneric);
const modelHubs = priceExamples.MODELS || [];
const indexableHubs = priceExamplesHub.indexableModelHubs();

let failed = 0;
function check(cond, msg) {
  if (cond) console.log(`✓ ${msg}`);
  else {
    console.error(`✗ ${msg}`);
    failed += 1;
  }
}

console.log("=== Audit exemples ===\n");
check(all.length === 480, `480 pages prix (${all.length})`);
check(generic.length === 8, `8 guides génériques indexables (${generic.length})`);
check(thin.length === 472, `472 pages modèle thin (${thin.length})`);
check(indexableHubs.length === 23, `23 hubs modèles whitelist (${indexableHubs.length})`);
check(modelHubs.length === 59, `59 hubs modèles total (${modelHubs.length})`);

const sitemapPath = path.join(root, "_site/sitemap-exemples.xml");
if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  const count = (xml.match(/<loc>/g) || []).length;
  const expected = 1 + 8 + 23; // hub + generic + indexable model hubs
  check(count === expected, `sitemap-exemples.xml = ${expected} URLs (${count})`);
} else {
  console.log("⚠ _site/sitemap-exemples.xml absent — lancer npm run build");
}

console.log("");
if (failed) process.exit(1);
console.log("Audit exemples : OK");
