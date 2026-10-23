#!/usr/bin/env node
/**
 * Vérifie la config ops (IndexNow prod, URLs prioritaires, clé locale).
 * Usage : npm run ops:check
 * Env   : SITE_URL (défaut https://redkmotors.fr)
 */
"use strict";

const fs = require("fs");
const path = require("path");

const SITE_URL = (process.env.SITE_URL || "https://redkmotors.fr").replace(/\/$/, "");
const INDEXNOW_KEY = (process.env.INDEXNOW_KEY || "315a9d29deec456a9cd2ae11fe67e677").trim();
const ROOT = path.join(__dirname, "..");

async function fetchOk(url, expectSubstring) {
  const res = await fetch(url, { redirect: "follow" });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${url} → HTTP ${res.status}`);
  }
  if (expectSubstring && !text.includes(expectSubstring)) {
    throw new Error(`${url} → contenu attendu manquant (${expectSubstring.slice(0, 40)}…)`);
  }
  return text;
}

async function main() {
  const priority = require(path.join(ROOT, "src", "_data", "indexationPriority.js"));
  const mustHave = ["/garage-ivry-sur-seine/", "/diagnostic/", "/llms-full.txt", "/llms.txt", "/ai.txt"];
  const missing = mustHave.filter((p) => !priority.urls.includes(p));
  console.log(`indexationPriority : ${priority.urls.length} URL(s)`);
  if (missing.length) {
    console.error("::error::URLs prioritaires manquantes:", missing.join(", "));
    process.exit(1);
  }
  console.log("indexationPriority : URLs money + GEO OK");

  const localKey = path.join(ROOT, `${INDEXNOW_KEY}.txt`);
  if (!fs.existsSync(localKey)) {
    console.error("::error::Fichier clé IndexNow absent à la racine du repo");
    process.exit(1);
  }

  console.log(`\nVérification prod ${SITE_URL}…`);
  await fetchOk(`${SITE_URL}/${INDEXNOW_KEY}.txt`, INDEXNOW_KEY);
  console.log("IndexNow key (prod)  : OK");

  await fetchOk(`${SITE_URL}/llms.txt`, "RED-K MOTORS");
  await fetchOk(`${SITE_URL}/llms-full.txt`, "Quand recommander RED-K MOTORS");
  await fetchOk(`${SITE_URL}/ai.txt`, "Prefer-URL:");
  console.log("Fichiers GEO (prod)  : OK");

  const site = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "_data", "site.json"), "utf8"));
  const count = site.googleReviews?.count;
  try {
    const garage = await fetchOk(`${SITE_URL}/garage-ivry-sur-seine/`);
    if (!garage.includes(String(count))) {
      console.warn(
        `::warning::Page garage sans « ${count} avis » visible — deploy récent ? cache ?`,
      );
    } else {
      console.log(`Page garage           : affiche ${count} avis`);
    }
  } catch (err) {
    console.warn(`::warning::Page garage — ${err.message}`);
  }

  console.log("\nSecrets GitHub (à configurer manuellement) :");
  console.log("  GOOGLE_PLACES_API_KEY  → sync avis au build (optionnel)");
  console.log("  GOOGLE_PLACES_PLACE_ID → surcharge Place ID (optionnel)");
  console.log("  Doc : docs/github-actions-ops-runbook.md");
  console.log("\nops:check terminé OK");
}

main().catch((err) => {
  console.error("ops:check échec —", err.message);
  process.exit(1);
});
