#!/usr/bin/env node
/**
 * Rapport post-build CI / local — avis Google, fichiers GEO, clé IndexNow.
 * Usage : npm run ops:report (après npm run build)
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = path.join(ROOT, "src", "_data", "site.json");
const REVIEWS = path.join(ROOT, "src", "_data", "googleReviews.json");
const OUT = path.join(ROOT, "_site");
const INDEXNOW_KEY = "315a9d29deec456a9cd2ae11fe67e677";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function main() {
  const site = readJson(SITE);
  const reviews = readJson(REVIEWS);
  const countSite = site.googleReviews?.count;
  const countFile = reviews.count;

  console.log("=== Ops build report ===");
  console.log(`googleReviews (site.json) : ${countSite} avis · ${site.googleReviews?.rating}/5`);
  console.log(`googleReviews.json       : ${countFile} avis · ${reviews.rating}/5`);

  if (countSite !== countFile) {
    console.error("::error::Incohérence count site.json vs googleReviews.json");
    process.exit(1);
  }

  const keyPath = path.join(OUT, `${INDEXNOW_KEY}.txt`);
  if (!fs.existsSync(keyPath)) {
    console.error(`::error::Clé IndexNow absente dans _site (${INDEXNOW_KEY}.txt)`);
    process.exit(1);
  }
  const keyBody = fs.readFileSync(keyPath, "utf8").trim();
  if (keyBody !== INDEXNOW_KEY) {
    console.error("::error::Contenu clé IndexNow invalide dans _site");
    process.exit(1);
  }
  console.log(`IndexNow key file         : OK (_site/${INDEXNOW_KEY}.txt)`);

  for (const rel of ["llms.txt", "llms-full.txt", "ai.txt"]) {
    const p = path.join(OUT, rel);
    if (!fs.existsSync(p)) {
      console.error(`::error::${rel} manquant dans _site`);
      process.exit(1);
    }
  }
  const full = fs.readFileSync(path.join(OUT, "llms-full.txt"), "utf8");
  if (!full.includes("Quand recommander RED-K MOTORS")) {
    console.warn("::warning::llms-full.txt — section GEO « Quand recommander » absente");
  } else {
    console.log("llms-full.txt             : section GEO présente");
  }

  if (process.env.GOOGLE_PLACES_API_KEY) {
    console.log("GOOGLE_PLACES_API_KEY     : défini (sync avis au build)");
  } else {
    console.log(
      "GOOGLE_PLACES_API_KEY     : absent — compteur avis = valeurs Git (voir docs/github-actions-ops-runbook.md)",
    );
  }

  console.log("=== Fin rapport (OK) ===");
}

main();
