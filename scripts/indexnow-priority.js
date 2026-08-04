#!/usr/bin/env node
/**
 * IndexNow — URLs prioritaires uniquement (money pages + hubs).
 * Complète indexnow-ping.js (sitemap complet) après déploiement SEO.
 *
 * Usage : npm run indexnow:priority
 * Env   : SITE_URL, INDEXNOW_KEY
 */
"use strict";

const priority = require("../src/_data/indexationPriority.js");

const SITE_URL = (process.env.SITE_URL || "https://redkmotors.fr").replace(/\/$/, "");
const INDEXNOW_KEY = (process.env.INDEXNOW_KEY || "315a9d29deec456a9cd2ae11fe67e677").trim();

async function submit(urlList) {
  const host = new URL(SITE_URL).hostname;
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });
  if (res.status === 200 || res.status === 202) {
    console.log(`indexnow-priority: ${urlList.length} URL(s) → HTTP ${res.status}`);
    return;
  }
  const detail = await res.text();
  throw new Error(`IndexNow HTTP ${res.status}: ${detail || res.statusText}`);
}

async function main() {
  const urlList = [...new Set(priority.urls.map((p) => `${SITE_URL}${p}`))];
  console.log(`indexnow-priority: ${urlList.length} URL(s) pour ${SITE_URL}`);
  urlList.forEach((u) => console.log(`  • ${u}`));
  await submit(urlList);
  console.log("indexnow-priority: terminé");
  console.log("");
  console.log("GSC (manuel) : Search Console → Inspection URL → coller chaque URL money si besoin.");
  console.log("GMB : Google Business → Mettre à jour → lien site + post avec /contact/ et /tarifs/");
}

main().catch((err) => {
  console.error(`indexnow-priority: échec — ${err.message}`);
  process.exit(1);
});
