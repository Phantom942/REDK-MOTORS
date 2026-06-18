/**
 * GitHub Pages ne lit pas _redirects ni vercel.json.
 * Génère des fichiers HTML statiques aux anciennes URLs (.html) avec
 * canonical + meta refresh + JS pour que Google et les visiteurs atteignent la bonne page.
 */
const fs = require("fs");
const path = require("path");

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

function writeRedirect(fromPath, toPath) {
  const filePath = path.join(OUT_DIR, fromPath.replace(/^\//, ""));
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

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error("generate-legacy-redirects: _site/ introuvable — lancer eleventy d'abord.");
    process.exit(1);
  }

  const blogRedirects = collectBlogArticleRedirects();
  const all = [...STATIC_REDIRECTS, ...blogRedirects];
  const seen = new Set();

  for (const [from, to] of all) {
    if (seen.has(from)) continue;
    seen.add(from);
    writeRedirect(from, to);
  }

  console.log(`generate-legacy-redirects: ${seen.size} fichiers créés (${blogRedirects.length} articles blog).`);
}

main();
