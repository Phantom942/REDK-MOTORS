/**
 * GitHub Pages ne lit pas _redirects ni vercel.json.
 * Génère des fichiers HTML statiques aux anciennes URLs (.html) avec
 * canonical + meta refresh + JS pour que Google et les visiteurs atteignent la bonne page.
 */
const fs = require("fs");
const path = require("path");

const adLandingUrls = require("../src/_data/adLandingUrls.js");

const SITE_URL = "https://redk-motors.me";
const OUT_DIR = path.join(__dirname, "..", "_site");
const ARTICLES_DIR = path.join(__dirname, "..", "src", "blog", "articles");

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
];

function redirectHtml(target) {
  const canonical = `${SITE_URL}${target}`;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Redirection…</title>
  <link rel="canonical" href="${canonical}">
  <meta http-equiv="refresh" content="0;url=${target}">
  <meta name="robots" content="noindex, follow">
  <script>location.replace(${JSON.stringify(target)});</script>
</head>
<body>
  <p>Redirection en cours… <a href="${target}">Continuer</a>.</p>
</body>
</html>`;
}

function toOutputRelativePath(fromPath) {
  const relative = fromPath.replace(/^\//, "");
  if (fromPath.endsWith("/")) {
    return path.join(relative, "index.html");
  }
  if (!relative.endsWith(".html")) {
    return `${relative}.html`;
  }
  return relative;
}

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

function writeRedirect(fromPath, toPath) {
  const filePath = path.join(OUT_DIR, toOutputRelativePath(fromPath));
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, redirectHtml(toPath), "utf8");
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

/** Dossiers _site avec index.html → stub sans slash (ex. /entretien → /entretien/). */
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

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error("generate-legacy-redirects: _site/ introuvable — lancer eleventy d'abord.");
    process.exit(1);
  }

  const blogRedirects = collectBlogArticleRedirects();
  const lpRedirects = collectLpRedirects();
  const directoryRedirects = collectDirectoryRedirects();
  const all = [...STATIC_REDIRECTS, ...lpRedirects, ...blogRedirects, ...directoryRedirects];
  const seen = new Set();
  let written = 0;

  for (const [from, to] of all) {
    if (seen.has(from)) continue;
    seen.add(from);

    const outRel = toOutputRelativePath(from);
    if (outRel === "index.html") continue;

    const outAbs = path.join(OUT_DIR, outRel);
    if (fs.existsSync(outAbs)) {
      const stat = fs.statSync(outAbs);
      if (stat.size > 2048) continue;
    }

    writeRedirect(from, to);
    written += 1;
  }

  console.log(
    `generate-legacy-redirects: ${written} fichiers créés (${blogRedirects.length} articles blog, ${lpRedirects.length} lp-*, ${directoryRedirects.length} dossiers).`,
  );
}

main();
