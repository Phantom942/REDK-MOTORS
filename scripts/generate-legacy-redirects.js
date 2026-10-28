/**
 * Anciennes URLs (.html, LP Ads, garage-proche, tags…) → destinations canoniques.
 *
 * IMPORTANT — GitHub Pages (hébergeur actuel de redkmotors.fr) n'applique pas
 * _redirects / vercel.json. On NE génère PLUS de stubs HTML meta-refresh+noindex
 * (nuisibles SEO). Les pages canoniques du site .fr restent intactes.
 *
 * Ce script :
 * 1. Collecte les paires from→to
 * 2. Écrit cloudflare-bulk-redirects.csv (import Bulk Redirects Cloudflare)
 * 3. Vérifie que _redirects / vercel.json restent alignés (avertissement seulement)
 *
 * Pour de vrais HTTP 301 sur le .fr : mettre Cloudflare (proxy orange) devant
 * redkmotors.fr et importer cloudflare-bulk-redirects.csv.
 * Pour le .me : utiliser redirects-map.csv / le même bulk (hôte .me → destination .fr).
 */
const fs = require("fs");
const path = require("path");

const adLandingUrls = require("../src/_data/adLandingUrls.js");
const garageProcheRedirects = require("../src/_data/garageProcheRedirects.js");
const blogTagRedirects = require("../src/_data/blogTagRedirects.js");
const blogSlugRenames = require("../src/_data/blogSlugRenames.js");
const {
  classifyArticles,
  getMigratedBlogRedirectPairs,
} = require("./lib/blog-article-redirects.js");

const SITE_URL = "https://redkmotors.fr";
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "_site");
const ARTICLES_DIR = path.join(ROOT, "src", "blog", "articles");
const BULK_CSV = path.join(OUT_DIR, "cloudflare-bulk-redirects.csv");
const ROOT_BULK_CSV = path.join(ROOT, "cloudflare-bulk-redirects.csv");
const ROOT_BULK_IMPORT_CSV = path.join(ROOT, "cloudflare-bulk-redirects-import.csv");
const ROOT_MAP_CSV = path.join(ROOT, "redirects-map.csv");
const BLOG_MIGRATION_CSV = path.join(ROOT, "blog-migration-redirects.csv");

/** @type {Array<[string, string]>} from → to (chemins absolus site) */
const STATIC_REDIRECTS = [
  ["/mecanique.html", "/mecanique/"],
  ["/carrosserie.html", "/carrosserie/"],
  ["/entretien.html", "/entretien/"],
  ["/pneumatiques.html", "/pneumatiques/"],
  ["/achat-revente.html", "/achat-revente/"],
  ["/location.html", "/location/"],
  ["/contact.html", "/contact/"],
  ["/processus.html", "/processus/"],
  ["/confidentialite.html", "/confidentialite/"],
  ["/cookies.html", "/cookies/"],
  ["/mentions-legales.html", "/mentions-legales/"],
  // Ne PAS mapper /blog/<slug>.html → /blog/<slug>/ pour les articles migrés :
  // collectBlogArticleRedirects() gère /blog/<slug>/ → /blog/articles/<slug>/.
  ["/blog/tag/mecanique/confidentialite.html", "/confidentialite/"],
  ["/liens/", "/links/"],
  ["/liens", "/links/"],
  ["/blog/tag/freinage/", "/blog/tag/freins/"],
  ["/blog/tag/freinage", "/blog/tag/freins/"],
  ["/blog/tag/pneus/", "/blog/tag/pneumatiques/"],
  ["/blog/tag/pneus", "/blog/tag/pneumatiques/"],
  ...garageProcheRedirects.flatMap(({ from, to }) => {
    const noSlash = from.endsWith("/") ? from.slice(0, -1) : from;
    return [
      [from, to],
      [noSlash, to],
    ];
  }),
  ...blogTagRedirects.flatMap(({ from, to }) => {
    const noSlash = from.endsWith("/") ? from.slice(0, -1) : from;
    return [
      [from, to],
      [noSlash, to],
    ];
  }),
  ["/revision/", "/entretien/"],
  ["/revision", "/entretien/"],
];

function collectLpRedirects() {
  const redirects = [];
  for (const [from, to] of Object.entries(adLandingUrls.legacyRedirects || {})) {
    redirects.push([from, to]);
    if (from.endsWith("/")) {
      redirects.push([from.slice(0, -1), to]);
    } else {
      redirects.push([`${from}/`, to]);
    }
  }
  return redirects;
}

function collectBlogSlugRenameRedirects() {
  const pairs = [];
  for (const { oldSlug, to } of blogSlugRenames) {
    pairs.push([`/blog/${oldSlug}/`, to]);
    pairs.push([`/blog/${oldSlug}`, to]);
    pairs.push([`/blog/${oldSlug}.html`, to]);
    pairs.push([`/blog/articles/${oldSlug}/`, to]);
    pairs.push([`/blog/articles/${oldSlug}`, to]);
    pairs.push([`/blog/articles/${oldSlug}.html`, to]);
  }
  return pairs;
}

function collectBlogArticleRedirects() {
  const redirects = [];
  const { kept, migrated } = classifyArticles();

  // Articles encore légitimes sous /blog/<slug>/ : seulement .html → slash
  for (const { permalink } of kept) {
    redirects.push([`${permalink.slice(0, -1)}.html`, permalink]);
  }

  // Articles migrés sous /blog/articles/<slug>/ : anciennes URL → nouvelle
  redirects.push(...getMigratedBlogRedirectPairs());

  // .html sous le nouveau chemin → slash (au cas où)
  for (const { newPath } of migrated) {
    redirects.push([`${newPath.slice(0, -1)}.html`, newPath]);
  }

  return redirects;
}

function writeBlogMigrationTable(pairs) {
  const lines = ["old_url,new_url,note"];
  const seen = new Set();
  for (const [from, to] of pairs) {
    if (!from.startsWith("/blog/") || !to.startsWith("/blog/articles/")) continue;
    if (from.includes("/articles/") || from.includes("/tag/") || from.includes("/page/")) continue;
    const key = `${from}|${to}`;
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push(
      [
        `${SITE_URL}${from}`,
        `${SITE_URL}${to}`,
        "article migré /blog/<slug>/ → /blog/articles/<slug>/",
      ]
        .map(csvEscape)
        .join(","),
    );
  }
  fs.writeFileSync(BLOG_MIGRATION_CSV, `${lines.join("\n")}\n`, "utf8");
  return lines.length - 1;
}

/**
 * Slash manquant pour dossiers déjà buildés.
 * Ne crée PAS de stub HTML : GitHub Pages gère souvent /foo → /foo/ pour les dossiers.
 * On les garde dans le bulk Cloudflare pour un 301 explicite.
 */
function collectDirectoryRedirects() {
  const redirects = [];
  const skip = new Set(["assets"]);

  function walk(absDir, urlPrefix) {
    let hasIndex = false;
    try {
      hasIndex = fs.existsSync(path.join(absDir, "index.html"));
    } catch {
      return;
    }

    if (hasIndex && urlPrefix) {
      const indexPath = path.join(absDir, "index.html");
      try {
        const text = fs.readFileSync(indexPath, "utf8");
        // Ignorer d'anciens stubs s'il en reste en cache local
        if (text.includes('http-equiv="refresh"') && text.includes("noindex")) {
          return;
        }
      } catch {
        /* ignore */
      }
      redirects.push([urlPrefix, `${urlPrefix}/`]);
    }

    let entries;
    try {
      entries = fs.readdirSync(absDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory() || skip.has(entry.name) || entry.name.startsWith(".")) continue;
      walk(path.join(absDir, entry.name), `${urlPrefix}/${entry.name}`);
    }
  }

  walk(OUT_DIR, "");
  return redirects;
}

function assertNoRedirectConflicts(pairs) {
  const byFrom = new Map();
  for (const [from, to] of pairs) {
    if (byFrom.has(from) && byFrom.get(from) !== to) {
      throw new Error(`Conflit redirect: ${from} → ${byFrom.get(from)} vs ${to}`);
    }
    byFrom.set(from, to);
  }

  // Pas de boucle directe A→B→A
  for (const [from, to] of pairs) {
    if (byFrom.get(to) === from) {
      throw new Error(`Boucle redirect: ${from} ⇄ ${to}`);
    }
  }

  // Ne jamais rediriger une page encore valide /blog/<kept>/
  const { kept } = classifyArticles();
  for (const { permalink, slug } of kept) {
    if (byFrom.has(permalink) && byFrom.get(permalink) !== permalink) {
      throw new Error(`Redirect écrase article conservé: ${permalink}`);
    }
    const noSlash = `/blog/${slug}`;
    if (byFrom.has(noSlash) && !byFrom.get(noSlash).startsWith(`/blog/${slug}`)) {
      // slashless → slash OK ; slashless → articles NOT OK for kept
      if (byFrom.get(noSlash).includes("/articles/")) {
        throw new Error(`Redirect migre à tort un article conservé: ${noSlash}`);
      }
    }
  }
}

function collectAll() {
  const blogRedirects = collectBlogArticleRedirects();
  const lpRedirects = collectLpRedirects();
  const directoryRedirects = collectDirectoryRedirects();
  // Blog migration AVANT directory redirects pour ne pas écraser
  // /blog/<slug> → /blog/<slug>/ (identitaire) au détriment de → /blog/articles/<slug>/
  const slugRenames = collectBlogSlugRenameRedirects();
  const all = [...STATIC_REDIRECTS, ...lpRedirects, ...blogRedirects, ...slugRenames, ...directoryRedirects];
  const seen = new Set();
  const pairs = [];

  for (const [from, to] of all) {
    if (!from || from === "/" || from === to) continue;
    if (seen.has(from)) continue;
    seen.add(from);
    pairs.push([from, to]);
  }

  assertNoRedirectConflicts(pairs);
  return { pairs, blogRedirects, lpRedirects, directoryRedirects };
}

function csvEscape(value) {
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCloudflareBulk(pairs) {
  // Format Bulk Redirects Cloudflare : source_url, target_url, status_code, preserve_query_string, ...
  const header =
    "source_url,target_url,status_code,preserve_query_string,subpath_matching,preserve_path_suffix";
  const lines = [header];
  const importLines = [];
  for (const [from, to] of pairs) {
    const source = `${SITE_URL}${from}`;
    const target = `${SITE_URL}${to}`;
    const row = [source, target, "301", "TRUE", "FALSE", "FALSE"].map(csvEscape).join(",");
    lines.push(row);
    importLines.push(row);
  }
  const withHeader = `${lines.join("\n")}\n`;
  fs.writeFileSync(BULK_CSV, withHeader, "utf8");
  fs.writeFileSync(ROOT_BULK_CSV, withHeader, "utf8");
  fs.writeFileSync(ROOT_BULK_IMPORT_CSV, `${importLines.join("\n")}\n`, "utf8");
}

function writeRootMap(pairs) {
  const lines = ["source,destination,note"];
  for (const [from, to] of pairs) {
    let note = "legacy → canonique";
    if (from.endsWith(".html")) note = "legacy .html → trailing slash";
    else if (from.startsWith("/lp-")) note = "landing Ads legacy";
    else if (from.startsWith("/garage-proche-")) note = "garage-proche → page ville/money";
    else if (from.startsWith("/blog/tag/")) note = "tag blog orphelin → indexable";
    else if (to.startsWith("/blog/articles/") && from.startsWith("/blog/")) {
      note = "article migré /blog/<slug>/ → /blog/articles/<slug>/";
    } else if (from.startsWith("/blog/") && from.endsWith(".html")) note = "article blog .html → slash";
    else if (!from.endsWith("/") && to === `${from}/`) note = "sans slash → avec slash";
    lines.push(
      [
        `https://redk-motors.me${from}`,
        `${SITE_URL}${to}`,
        note,
      ]
        .map(csvEscape)
        .join(","),
    );
  }
  fs.writeFileSync(ROOT_MAP_CSV, `${lines.join("\n")}\n`, "utf8");
  // Copie aussi dans _site pour téléchargement éventuel
  fs.copyFileSync(ROOT_MAP_CSV, path.join(OUT_DIR, "redirects-map.csv"));
}

function assertNoSoftRedirectStubs() {
  let stubCount = 0;
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "assets" || entry.name.startsWith(".")) continue;
        walk(full);
        continue;
      }
      if (!entry.name.endsWith(".html")) continue;
      const text = fs.readFileSync(full, "utf8");
      if (
        text.includes('http-equiv="refresh"') &&
        text.includes("noindex") &&
        text.includes("Redirection")
      ) {
        stubCount += 1;
      }
    }
  }
  walk(OUT_DIR);
  if (stubCount > 0) {
    console.error(
      `generate-legacy-redirects: ${stubCount} stubs soft-redirect+noindex encore présents dans _site — échec.`,
    );
    process.exit(1);
  }
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error("generate-legacy-redirects: _site/ introuvable — lancer eleventy d'abord.");
    process.exit(1);
  }

  const { pairs, blogRedirects, lpRedirects, directoryRedirects } = collectAll();
  writeCloudflareBulk(pairs);
  writeRootMap(pairs);
  const blogMigrationCount = writeBlogMigrationTable(pairs);
  assertNoSoftRedirectStubs();

  const { kept, migrated } = classifyArticles();
  console.log(
    `generate-legacy-redirects: 0 stub HTML écrit (soft-redirect désactivé). ` +
      `${pairs.length} règles exportées → cloudflare-bulk-redirects.csv ` +
      `(${blogRedirects.length} blog, ${lpRedirects.length} lp-*, ${directoryRedirects.length} dossiers). ` +
      `Migration blog: ${migrated.length} articles → /blog/articles/ (${blogMigrationCount} URL sources), ` +
      `${kept.length} conservés sous /blog/<slug>/.`,
  );
}

main();
