#!/usr/bin/env node
/**
 * Tests unitaires — migration blog /blog/<slug>/ → /blog/articles/<slug>/
 * Sans déploiement. Usage: node scripts/test-blog-migration-redirects.js
 */
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const ROOT = path.join(__dirname, "..");
const {
  classifyArticles,
  getMigratedBlogRedirectPairs,
  getKeptBlogSlugs,
  getMigratedBlogSlugs,
} = require("./lib/blog-article-redirects.js");

const SITE = "https://redkmotors.fr";
const PRIORITY = [
  "suppression-fap-controle-technique-2026",
  "prix-recharge-climatisation-94",
  "revision-60000-km-checklist",
  "combien-coute-vidange-voiture",
];

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

function main() {
  const { kept, migrated } = classifyArticles();
  const pairs = getMigratedBlogRedirectPairs();
  const keptSlugs = getKeptBlogSlugs();
  const migratedSlugs = getMigratedBlogSlugs();
  const byFrom = new Map(pairs);

  assert.ok(migrated.length >= 70, `attendu ~78 migrés, got ${migrated.length}`);
  assert.ok(kept.length >= 10, `attendu ~11 conservés, got ${kept.length}`);
  ok(`classify: ${migrated.length} migrés, ${kept.length} conservés`);

  for (const slug of PRIORITY) {
    assert.ok(migratedSlugs.has(slug), `prioritaire non migré: ${slug}`);
    const dest = `/blog/articles/${slug}/`;
    assert.strictEqual(byFrom.get(`/blog/${slug}/`), dest);
    assert.strictEqual(byFrom.get(`/blog/${slug}`), dest);
    assert.strictEqual(byFrom.get(`/blog/${slug}.html`), dest);
  }
  ok(`4 slugs prioritaires mappés → /blog/articles/…`);

  for (const { slug, permalink } of kept) {
    assert.ok(!migratedSlugs.has(slug), `conservé aussi marqué migré: ${slug}`);
    assert.ok(!byFrom.has(permalink) || byFrom.get(permalink) === permalink);
    // Ne doit PAS pointer vers /blog/articles/
    for (const from of [`/blog/${slug}/`, `/blog/${slug}`, `/blog/${slug}.html`]) {
      if (byFrom.has(from) && String(byFrom.get(from)).includes("/articles/")) {
        fail(`article conservé redirigé vers articles: ${from}`);
      }
    }
  }
  ok(`articles conservés non écrasés par la migration`);

  // Pas de wildcard /blog/ → /blog/articles/
  assert.ok(!byFrom.has("/blog/"));
  assert.ok(!byFrom.has("/blog"));
  ok(`pas de wildcard /blog/`);

  // CSV générés après build (optionnel si absents)
  const bulkImport = path.join(ROOT, "cloudflare-bulk-redirects-import.csv");
  const migrationCsv = path.join(ROOT, "blog-migration-redirects.csv");
  if (fs.existsSync(bulkImport)) {
    const text = fs.readFileSync(bulkImport, "utf8");
    for (const slug of PRIORITY) {
      const needle = `${SITE}/blog/${slug}/,${SITE}/blog/articles/${slug}/`;
      assert.ok(text.includes(needle), `CSV import manque: ${needle}`);
    }
    // Ne doit pas contenir kept → articles
    for (const slug of keptSlugs) {
      const bad = `${SITE}/blog/${slug}/,${SITE}/blog/articles/${slug}/`;
      assert.ok(!text.includes(bad), `CSV migre un conservé: ${slug}`);
    }
    ok(`cloudflare-bulk-redirects-import.csv cohérent`);
  } else {
    console.log("SKIP: cloudflare-bulk-redirects-import.csv absent (lancer npm run build)");
  }

  if (fs.existsSync(migrationCsv)) {
    const text = fs.readFileSync(migrationCsv, "utf8");
    for (const slug of PRIORITY) {
      assert.ok(text.includes(`/blog/${slug}/`));
      assert.ok(text.includes(`/blog/articles/${slug}/`));
    }
    ok(`blog-migration-redirects.csv présent`);
  }

  // HTML build : schema / canonical (si _site existe)
  const siteDir = path.join(ROOT, "_site");
  if (fs.existsSync(siteDir)) {
    for (const slug of PRIORITY) {
      const htmlPath = path.join(siteDir, "blog", "articles", slug, "index.html");
      assert.ok(fs.existsSync(htmlPath), `page build absente: ${htmlPath}`);
      const html = fs.readFileSync(htmlPath, "utf8");
      const canonical = `${SITE}/blog/articles/${slug}/`;
      assert.ok(
        html.includes(`rel="canonical" href="${canonical}"`) ||
          html.includes(`rel="canonical" href='${canonical}'`),
        `canonical manquant pour ${slug}`,
      );
      assert.ok(html.includes(`"@id":"${canonical}"`) || html.includes(`"@id": "${canonical}"`), `JSON-LD @id manquant ${slug}`);
      assert.ok(!html.includes(`"@id":"${SITE}/blog/${slug}/"`), `ancien @id encore présent ${slug}`);
      assert.ok(!/noindex/i.test(html.match(/<meta name="robots"[^>]*>/i)?.[0] || ""), `noindex inattendu ${slug}`);
    }
    ok(`HTML build: canonical + JSON-LD OK pour prioritaires`);

    // Pages conservées toujours en 200 path
    for (const { slug } of kept.slice(0, 3)) {
      const htmlPath = path.join(siteDir, "blog", slug, "index.html");
      assert.ok(fs.existsSync(htmlPath), `conservé absent du build: ${slug}`);
    }
    ok(`articles conservés toujours générés sous /blog/<slug>/`);
  } else {
    console.log("SKIP: _site/ absent (lancer npm run build)");
  }

  if (process.exitCode) {
    console.error("Tests migration blog: ÉCHEC");
    process.exit(1);
  }
  console.log("Tests migration blog: OK");
}

main();
