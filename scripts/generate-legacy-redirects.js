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

const SITE_URL = "https://redkmotors.fr";
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "_site");
const ARTICLES_DIR = path.join(ROOT, "src", "blog", "articles");
const BULK_CSV = path.join(OUT_DIR, "cloudflare-bulk-redirects.csv");
const ROOT_MAP_CSV = path.join(ROOT, "redirects-map.csv");

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
  ["/blog/5-points-controle-avant-ct-ivry.html", "/blog/5-points-controle-avant-ct-ivry/"],
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

function collectBlogArticleRedirects() {
  const redirects = [];
  if (!fs.existsSync(ARTICLES_DIR)) return redirects;

  for (const file of fs.readdirSync(ARTICLES_DIR)) {
    if (!file.endsWith(".njk")) continue;
    const content = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
    const match = content.match(/permalink:\s*(\/blog\/[^/\s]+\/)/);
    if (!match) continue;
    const canonical = match[1];
    redirects.push([`${canonical.slice(0, -1)}.html`, canonical]);
  }
  return redirects;
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

function collectAll() {
  const blogRedirects = collectBlogArticleRedirects();
  const lpRedirects = collectLpRedirects();
  const directoryRedirects = collectDirectoryRedirects();
  const all = [...STATIC_REDIRECTS, ...lpRedirects, ...blogRedirects, ...directoryRedirects];
  const seen = new Set();
  const pairs = [];

  for (const [from, to] of all) {
    if (!from || from === "/" || from === to) continue;
    if (seen.has(from)) continue;
    seen.add(from);
    pairs.push([from, to]);
  }

  return { pairs, blogRedirects, lpRedirects, directoryRedirects };
}

function csvEscape(value) {
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCloudflareBulk(pairs) {
  // Format Bulk Redirects Cloudflare : source_url, target_url, status_code, preserve_query_string, ...
  const lines = [
    "source_url,target_url,status_code,preserve_query_string,subpath_matching,preserve_path_suffix",
  ];
  for (const [from, to] of pairs) {
    const source = `${SITE_URL}${from}`;
    const target = `${SITE_URL}${to}`;
    lines.push(
      [source, target, "301", "TRUE", "FALSE", "FALSE"].map(csvEscape).join(","),
    );
  }
  fs.writeFileSync(BULK_CSV, `${lines.join("\n")}\n`, "utf8");
}

function writeRootMap(pairs) {
  const lines = ["source,destination,note"];
  for (const [from, to] of pairs) {
    let note = "legacy → canonique";
    if (from.endsWith(".html")) note = "legacy .html → trailing slash";
    else if (from.startsWith("/lp-")) note = "landing Ads legacy";
    else if (from.startsWith("/garage-proche-")) note = "garage-proche → page ville/money";
    else if (from.startsWith("/blog/tag/")) note = "tag blog orphelin → indexable";
    else if (from.startsWith("/blog/") && from.endsWith(".html")) note = "article blog .html → slash";
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
  assertNoSoftRedirectStubs();

  console.log(
    `generate-legacy-redirects: 0 stub HTML écrit (soft-redirect désactivé). ` +
      `${pairs.length} règles exportées → cloudflare-bulk-redirects.csv ` +
      `(${blogRedirects.length} articles, ${lpRedirects.length} lp-*, ${directoryRedirects.length} dossiers).`,
  );
}

main();
