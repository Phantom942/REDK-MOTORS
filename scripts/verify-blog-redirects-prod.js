#!/usr/bin/env node
/**
 * Vérification HTTP production — anciennes URL blog → 301 → 200.
 * ÉCHEC si une URL prioritaire (ou --all) renvoie encore 404.
 *
 * Usage:
 *   node scripts/verify-blog-redirects-prod.js
 *   node scripts/verify-blog-redirects-prod.js --all
 *   VERIFY_BLOG_REDIRECTS_STRICT=1 node scripts/verify-blog-redirects-prod.js
 */
const {
  classifyArticles,
  getMigratedBlogRedirectPairs,
} = require("./lib/blog-article-redirects.js");

const SITE = process.env.SITE_URL || "https://redkmotors.fr";
const STRICT = process.env.VERIFY_BLOG_REDIRECTS_STRICT === "1" || process.argv.includes("--strict");
const ALL = process.argv.includes("--all");

const PRIORITY = [
  "suppression-fap-controle-technique-2026",
  "prix-recharge-climatisation-94",
  "revision-60000-km-checklist",
  "combien-coute-vidange-voiture",
];

async function head(url) {
  const res = await fetch(url, { method: "GET", redirect: "manual" });
  return {
    status: res.status,
    location: res.headers.get("location"),
  };
}

async function main() {
  const { migrated, kept } = classifyArticles();
  const pairs = new Map(getMigratedBlogRedirectPairs());
  const slugs = ALL ? migrated.map((m) => m.slug) : PRIORITY;

  let failed = 0;
  let warned = 0;
  let okNew = 0;
  let okOld = 0;
  let okKept = 0;

  const expectedOld = ALL ? migrated.length * 3 : PRIORITY.length * 3;
  console.log(
    `Vérification prod ${SITE} — migrated=${slugs.length} (old variants attendues=${expectedOld}), kept=${kept.length}, strict=${STRICT}`,
  );

  for (const slug of slugs) {
    const destPath = `/blog/articles/${slug}/`;
    const destUrl = `${SITE}${destPath}`;

    const neu = await head(destUrl);
    if (neu.status !== 200) {
      console.error(`❌ NEW ${destUrl} → ${neu.status} (attendu 200)`);
      failed += 1;
    } else {
      console.log(`✅ NEW ${destUrl} → 200`);
      okNew += 1;
    }

    for (const from of [`/blog/${slug}/`, `/blog/${slug}`, `/blog/${slug}.html`]) {
      const expect = pairs.get(from) || destPath;
      const oldUrl = `${SITE}${from}`;
      const res = await head(oldUrl);
      if (res.status === 301 && res.location) {
        const normalized = (
          res.location.startsWith("http") ? new URL(res.location).pathname : res.location
        ).replace(/\/?$/, "/");
        const expectNorm = expect.replace(/\/?$/, "/");
        if (normalized === expectNorm) {
          const hop2 = await head(`${SITE}${expect}`);
          if (hop2.status !== 200) {
            console.error(`❌ OLD ${oldUrl} → 301 ${normalized} mais cible → ${hop2.status}`);
            failed += 1;
          } else {
            console.log(`✅ OLD ${oldUrl} → 301 ${normalized} → 200`);
            okOld += 1;
          }
        } else {
          console.error(`❌ OLD ${oldUrl} → 301 Location=${res.location} (attendu ${expect})`);
          failed += 1;
        }
      } else if (res.status === 404) {
        // --strict ou prioritaire : échec. --all sans strict : warning hors PRIORITY.
        const msg = `OLD ${oldUrl} → 404 (KV Worker non à jour ?)`;
        if (STRICT || PRIORITY.includes(slug)) {
          console.error(`❌ ${msg}`);
          failed += 1;
        } else {
          console.warn(`⚠ ${msg}`);
          warned += 1;
        }
      } else {
        console.error(`❌ OLD ${oldUrl} → ${res.status} Location=${res.location}`);
        failed += 1;
      }
    }
  }

  for (const { permalink } of kept) {
    const url = `${SITE}${permalink}`;
    const res = await head(url);
    if (res.status !== 200) {
      console.error(`❌ KEPT ${url} → ${res.status}`);
      failed += 1;
    } else {
      console.log(`✅ KEPT ${url} → 200`);
      okKept += 1;
    }
  }

  console.log(
    `Résumé: NEW ${okNew}/${slugs.length} · OLD ${okOld}/${expectedOld} · KEPT ${okKept}/${kept.length}`,
  );

  if (failed) {
    console.error(`ÉCHEC verify-blog-redirects-prod: ${failed} erreur(s), ${warned} warning(s)`);
    process.exit(1);
  }
  console.log(`OK verify-blog-redirects-prod (${warned} warning(s) non bloquants)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
