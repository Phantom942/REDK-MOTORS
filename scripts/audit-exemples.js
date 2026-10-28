#!/usr/bin/env node
/**
 * Audit /exemples/ — index, follow sur 480 fiches + 59 hubs ;
 * sitemaps en 2 niveaux (core + fiches) pour limiter le risque SEO.
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

function parseLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

function countUrlsFromSitemapFiles(baseDir, relPaths) {
  let total = 0;
  for (const rel of relPaths) {
    const p = path.join(baseDir, rel);
    if (!fs.existsSync(p)) return null;
    const xml = fs.readFileSync(p, "utf8");
    total += parseLocs(xml).length;
  }
  return total;
}

console.log("=== Audit exemples ===\n");
check(all.length === 480, `480 pages prix (${all.length})`);
check(generic.length === 8, `8 guides génériques (${generic.length})`);
check(thin.length === 472, `472 fiches modèle (${thin.length})`);
check(indexableHubs.length === 23, `23 hubs modèles prioritaires (${indexableHubs.length})`);
check(modelHubs.length === 59, `59 hubs modèles total (${modelHubs.length})`);

const siteDir = path.join(root, "_site");
const indexPath = path.join(siteDir, "sitemap-exemples.xml");
if (fs.existsSync(indexPath)) {
  const indexXml = fs.readFileSync(indexPath, "utf8");
  check(indexXml.includes("<sitemapindex"), "sitemap-exemples.xml = index (core + fiches)");
  const coreCount = countUrlsFromSitemapFiles(siteDir, ["sitemap-exemples-core.xml"]);
  const fichesCount = countUrlsFromSitemapFiles(siteDir, ["sitemap-exemples-fiches.xml"]);
  const expectedCore = 1 + 8 + modelHubs.length;
  const expectedFiches = thin.length;
  const expectedTotal = expectedCore + expectedFiches;
  if (coreCount != null) check(coreCount === expectedCore, `sitemap-exemples-core = ${expectedCore} URLs (${coreCount})`);
  if (fichesCount != null) check(fichesCount === expectedFiches, `sitemap-exemples-fiches = ${expectedFiches} URLs (${fichesCount})`);
  if (coreCount != null && fichesCount != null) {
    check(coreCount + fichesCount === expectedTotal, `total sitemap exemples = ${expectedTotal} URLs`);
  }
} else {
  console.log("⚠ _site/sitemap-exemples.xml absent — lancer npm run build");
}

console.log("");
if (failed) process.exit(1);
console.log("Audit exemples : OK");
