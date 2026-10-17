#!/usr/bin/env node
/**
 * Tests exhaustifs — migration blog /blog/<slug>/ → /blog/articles/<slug>/
 * Pré-déploiement (pas de réseau prod requis pour le cœur des assertions).
 *
 * Usage: node scripts/test-blog-migration-redirects.js
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

const CRITICAL_PATHS = [
  "/",
  "/blog/",
  "/blog/tag/",
  "/contact/",
  "/tarifs/",
  "/mecanique/",
  "/carrosserie/",
  "/entretien/",
  "/pneumatiques/",
  "/diagnostic/",
  "/prestations/",
  "/exemples/",
  "/achat-revente/",
  "/location/",
  "/garage-ivry-sur-seine/",
  "/links/",
];

function ok(msg) {
  console.log(`OK: ${msg}`);
}

function loadBulkPairs() {
  const bulkImport = path.join(ROOT, "cloudflare-bulk-redirects-import.csv");
  const bulkFull = path.join(ROOT, "cloudflare-bulk-redirects.csv");
  const file = fs.existsSync(bulkImport) ? bulkImport : bulkFull;
  if (!fs.existsSync(file)) return null;
  const map = new Map();
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("source_url")) continue;
    const [source, target] = line.split(",");
    if (!source?.startsWith("http") || !target?.startsWith("http")) continue;
    map.set(new URL(source).pathname, new URL(target).pathname);
  }
  return map;
}

function assertNoCycles(map) {
  for (const [from, to] of map.entries()) {
    assert.notStrictEqual(from, to, `identité inutile: ${from}`);
    if (map.has(to)) {
      const next = map.get(to);
      assert.notStrictEqual(next, from, `boucle ${from} ⇄ ${to}`);
      // Chaîne A→B→C : autorisée seulement si B n'est pas une page canonique d'article
      // Pour la migration blog, la cible ne doit PAS être une source de redirect blog
      if (to.startsWith("/blog/") && from.startsWith("/blog/") && !from.includes("/articles/")) {
        assert.ok(
          !to.match(/^\/blog\/[^/]+\/$/) || to.includes("/articles/"),
          `chaîne suspecte ${from} → ${to} → ${next}`,
        );
      }
    }
  }
}

function scanLeftoverOldLinks(migratedSlugs) {
  const hits = [];
  const roots = [path.join(ROOT, "src")];
  const skipNames = new Set([
    "blog-migration-redirects.csv",
    "cloudflare-bulk-redirects.csv",
    "redirects-map.csv",
  ]);

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === "_site") continue;
        walk(full);
        continue;
      }
      if (skipNames.has(entry.name)) continue;
      if (!/\.(njk|js|json|md|html|txt)$/.test(entry.name)) continue;
      const text = fs.readFileSync(full, "utf8");
      for (const slug of migratedSlugs) {
        const re = new RegExp(`(?<!/articles)/blog/${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/`, "g");
        let m;
        while ((m = re.exec(text))) {
          // Ignore docs that intentionally document old→new
          if (full.includes("docs/blog-migration")) continue;
          if (full.includes("scripts/test-blog-migration")) continue;
          if (full.includes("scripts/lib/blog-article-redirects")) continue;
          if (full.includes("scripts/verify-blog-redirects-prod")) continue;
          if (full.includes("generate-legacy-redirects")) continue;
          hits.push(`${path.relative(ROOT, full)}: ${m[0]}`);
        }
      }
    }
  }
  for (const root of roots) walk(root);
  return hits;
}

function main() {
  const { kept, migrated } = classifyArticles();
  const pairs = getMigratedBlogRedirectPairs();
  const keptSlugs = getKeptBlogSlugs();
  const migratedSlugs = getMigratedBlogSlugs();
  const byFrom = new Map(pairs);

  assert.strictEqual(migrated.length, 78, `migrés: attendu 78, got ${migrated.length}`);
  assert.strictEqual(kept.length, 11, `conservés: attendu 11, got ${kept.length}`);
  assert.strictEqual(pairs.length, 78 * 3, `variantes: attendu ${78 * 3}, got ${pairs.length}`);
  ok(`classify exact: 78 migrés, 11 conservés, ${pairs.length} variantes`);

  // Chaque migré : 3 variantes → même destination canonique
  for (const { slug, newPath } of migrated) {
    assert.strictEqual(newPath, `/blog/articles/${slug}/`);
    assert.strictEqual(byFrom.get(`/blog/${slug}/`), newPath);
    assert.strictEqual(byFrom.get(`/blog/${slug}`), newPath);
    assert.strictEqual(byFrom.get(`/blog/${slug}.html`), newPath);
    // La destination canonique ne doit PAS être une source
    assert.ok(!byFrom.has(newPath), `canonique redirigée: ${newPath}`);
  }
  ok(`78×3 variantes → destinations exactes, canoniques non redirigées`);

  for (const slug of PRIORITY) {
    assert.ok(migratedSlugs.has(slug), `prioritaire absent: ${slug}`);
  }
  ok(`4 slugs prioritaires inclus`);

  for (const { slug, permalink } of kept) {
    assert.ok(!migratedSlugs.has(slug));
    assert.strictEqual(permalink, `/blog/${slug}/`);
    for (const from of [`/blog/${slug}/`, `/blog/${slug}`, `/blog/${slug}.html`]) {
      const dest = byFrom.get(from);
      assert.ok(!dest || !String(dest).includes("/articles/"), `conservé migré à tort: ${from}→${dest}`);
    }
    // Page build attendue sous /blog/<slug>/
  }
  ok(`11 articles conservés non migrés`);

  assert.ok(!byFrom.has("/blog/"));
  assert.ok(!byFrom.has("/blog"));
  assert.ok(!byFrom.has("/blog/tag/"));
  assert.ok(!byFrom.has("/blog/articles/"));
  for (const p of CRITICAL_PATHS) {
    assert.ok(!byFrom.has(p) || byFrom.get(p) === p, `chemin critique redirigé: ${p}→${byFrom.get(p)}`);
  }
  ok(`pas de wildcard /blog/* ; chemins critiques intacts`);

  assertNoCycles(byFrom);
  ok(`pas de boucle dans les paires migration`);

  const leftover = scanLeftoverOldLinks(migratedSlugs);
  assert.strictEqual(leftover.length, 0, `liens internes anciens restants:\n${leftover.slice(0, 20).join("\n")}`);
  ok(`aucun lien interne src/ vers anciennes URL migrées`);

  const bulk = loadBulkPairs();
  if (bulk) {
    for (const [from, to] of pairs) {
      assert.strictEqual(bulk.get(from), to, `bulk CSV diverge: ${from}`);
    }
    for (const slug of keptSlugs) {
      const bad = bulk.get(`/blog/${slug}/`);
      assert.ok(!bad || !bad.includes("/articles/"), `bulk migre un conservé: ${slug}`);
    }
    // Pas de collision : une source blog migration ne pointe pas vers une page critique
    for (const [from, to] of pairs) {
      assert.ok(to.startsWith("/blog/articles/"), `cible non articles: ${from}→${to}`);
    }
    assertNoCycles(bulk);
    ok(`CSV bulk cohérent avec les ${pairs.length} paires migration`);
  } else {
    console.log("SKIP: CSV bulk absent (lancer npm run build)");
  }

  const migrationCsv = path.join(ROOT, "blog-migration-redirects.csv");
  if (fs.existsSync(migrationCsv)) {
    const lines = fs.readFileSync(migrationCsv, "utf8").trim().split(/\n/);
    // header + 234 lines ideally (some generators may only list unique notes)
    assert.ok(lines.length >= 200, `blog-migration-redirects.csv trop court: ${lines.length}`);
    ok(`blog-migration-redirects.csv (${lines.length - 1} lignes data)`);
  }

  const siteDir = path.join(ROOT, "_site");
  if (fs.existsSync(siteDir)) {
    for (const { slug, newPath } of migrated) {
      const htmlPath = path.join(siteDir, "blog", "articles", slug, "index.html");
      assert.ok(fs.existsSync(htmlPath), `build manquant: ${htmlPath}`);
      // Ancien chemin ne doit PAS exister comme page
      const oldPath = path.join(siteDir, "blog", slug, "index.html");
      assert.ok(!fs.existsSync(oldPath), `ancienne page encore générée: /blog/${slug}/`);
    }
    for (const { slug } of kept) {
      const htmlPath = path.join(siteDir, "blog", slug, "index.html");
      assert.ok(fs.existsSync(htmlPath), `conservé absent: /blog/${slug}/`);
      const wrong = path.join(siteDir, "blog", "articles", slug, "index.html");
      assert.ok(!fs.existsSync(wrong), `conservé aussi sous articles: ${slug}`);
    }

    for (const slug of PRIORITY) {
      const html = fs.readFileSync(
        path.join(siteDir, "blog", "articles", slug, "index.html"),
        "utf8",
      );
      const canonical = `${SITE}/blog/articles/${slug}/`;
      assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `canonical ${slug}`);
      assert.ok(
        html.includes(`"@id":"${canonical}"`) || html.includes(`"@id": "${canonical}"`),
        `JSON-LD @id ${slug}`,
      );
      assert.ok(!html.includes(`"${SITE}/blog/${slug}/"`), `ancienne URL encore dans HTML ${slug}`);
      const robots = html.match(/<meta name="robots" content="([^"]*)"/i);
      assert.ok(robots, `meta robots manquant ${slug}`);
      assert.ok(!/noindex/i.test(robots[1]), `noindex ${slug}: ${robots[1]}`);
      assert.ok(/BlogPosting/i.test(html), `BlogPosting manquant ${slug}`);
      assert.ok(/BreadcrumbList/i.test(html), `BreadcrumbList manquant ${slug}`);
    }
    ok(`HTML: 78 migrés sans ancien path, 11 conservés, SEO prioritaires OK`);

    const sitemapBlog = path.join(siteDir, "sitemap-blog.xml");
    assert.ok(fs.existsSync(sitemapBlog), "sitemap-blog.xml absent");
    const sm = fs.readFileSync(sitemapBlog, "utf8");
    for (const { slug } of migrated) {
      assert.ok(sm.includes(`/blog/articles/${slug}/`), `sitemap manque ${slug}`);
      assert.ok(!sm.includes(`${SITE}/blog/${slug}/<`), `sitemap contient ancien path ${slug}`);
      // Avoid false positive: /blog/articles/slug contains /blog/slug as substring? 
      // Check exact loc
      assert.ok(
        !sm.includes(`<loc>${SITE}/blog/${slug}/</loc>`),
        `sitemap loc ancienne: ${slug}`,
      );
    }
    for (const { slug } of kept) {
      assert.ok(sm.includes(`<loc>${SITE}/blog/${slug}/</loc>`), `sitemap conservé manquant ${slug}`);
    }
    ok(`sitemap-blog.xml cohérent migrés/conservés`);
  } else {
    console.log("SKIP: _site/ absent (lancer npm run build)");
  }

  // Simulation Worker : KV hit avant .html
  const fakeKv = Object.fromEntries(pairs);
  function simulateWorker(pathname, search = "") {
    if (fakeKv[pathname]) {
      return { status: 301, location: `${SITE}${fakeKv[pathname]}${search}` };
    }
    if (pathname.endsWith(".html")) {
      const slashPath = `${pathname.slice(0, -5)}/`;
      if (fakeKv[slashPath]) {
        return { status: 301, location: `${SITE}${fakeKv[slashPath]}${search}` };
      }
      return { status: 301, location: `${SITE}${slashPath}${search}` };
    }
    return { status: 200, location: null };
  }
  for (const slug of PRIORITY) {
    const dest = `${SITE}/blog/articles/${slug}/`;
    for (const from of [`/blog/${slug}/`, `/blog/${slug}`, `/blog/${slug}.html`]) {
      const res = simulateWorker(from, "?utm=test");
      assert.strictEqual(res.status, 301);
      assert.strictEqual(res.location, `${dest}?utm=test`);
    }
    // Un seul saut : la destination ne redirige pas
    const finalHop = simulateWorker(`/blog/articles/${slug}/`);
    assert.strictEqual(finalHop.status, 200);
  }
  ok(`simulation Worker: 301 unique + query query pour prioritaires`);

  console.log("Tests migration blog: OK");
}

main();
