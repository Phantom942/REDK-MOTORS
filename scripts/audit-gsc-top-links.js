#!/usr/bin/env node
/**
 * Vérifie que chaque slug GSC top a /garage-ivry-sur-seine/ dans sa liste priority.
 */
const gsc = require("../src/_data/gscTopMoneyLinks.js");

let failed = 0;
for (const [slug, cfg] of Object.entries(gsc)) {
  if (slug === "GARAGE_IVRY") continue;
  const urls = (cfg.priority || []).map((l) => l.url);
  if (!urls.includes("/garage-ivry-sur-seine/")) {
    console.error(`audit-gsc-top-links: ${slug} — lien garage Ivry manquant`);
    failed++;
  }
  if (!cfg.ctaLead || cfg.ctaLead.length < 20) {
    console.error(`audit-gsc-top-links: ${slug} — ctaLead trop court ou absent`);
    failed++;
  }
}

if (failed) {
  console.error(`audit-gsc-top-links: ${failed} problème(s)`);
  process.exit(1);
}

console.log(`audit-gsc-top-links: OK — ${Object.keys(gsc).length - 1} articles GSC top.`);
