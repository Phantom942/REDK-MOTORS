#!/usr/bin/env node
/**
 * Exporte redirects-map.csv → cloudflare-redirects-me.csv (Bulk Redirects Cloudflare)
 * et category-a-urls.txt (paths identiques .me → .fr, règle générique CF).
 *
 * Usage: node scripts/export-cloudflare-me-redirects.js
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = path.join(__dirname, "..");
const MAP_CSV = path.join(ROOT, "redirects-map.csv");
const OUT_ME = path.join(ROOT, "cloudflare-redirects-me.csv");
const OUT_A = path.join(ROOT, "category-a-urls.txt");
const FR = "https://redkmotors.fr";
const ME = "https://redk-motors.me";

function csvEscape(value) {
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function parseMap(csv) {
  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const i = line.indexOf(",");
      const j = line.indexOf(",", i + 1);
      return {
        source: line.slice(0, i).trim(),
        dest: line.slice(i + 1, j > -1 ? j : undefined).trim(),
        note: j > -1 ? line.slice(j + 1).trim() : "",
      };
    })
    .filter((r) => r.source && r.dest);
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
          return resolve(fetch(new URL(res.headers.location, url).href));
        }
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

async function frSitemapPaths() {
  const [pages, blog, exemples] = await Promise.all([
    fetch(`${FR}/sitemap-pages.xml`),
    fetch(`${FR}/sitemap-blog.xml`),
    fetch(`${FR}/sitemap-exemples.xml`),
  ]);
  const paths = new Set();
  for (const xml of [pages, blog, exemples]) {
    for (const m of xml.matchAll(/<loc>https:\/\/redkmotors\.fr([^<]*)<\/loc>/g)) {
      const p = m[1] || "/";
      paths.add(p.endsWith("/") || p === "/" ? p : `${p}/`);
    }
  }
  return [...paths].sort();
}

function writeMeCsv(rows) {
  const lines = [
    "source_url,target_url,status_code,preserve_query_string,subpath_matching,preserve_path_suffix",
  ];
  for (const { source, dest } of rows) {
    lines.push(
      [source, dest, "301", "TRUE", "FALSE", "FALSE"].map(csvEscape).join(","),
    );
  }
  fs.writeFileSync(OUT_ME, `${lines.join("\n")}\n`, "utf8");
}

function writeCategoryA(sitemapPaths, explicitSources) {
  const categoryA = sitemapPaths.filter((p) => {
    const src = `${ME}${p === "/" ? "/" : p}`;
    return !explicitSources.has(src);
  });
  const body =
    "# Paths couverts par la règle générique Cloudflare (*redk-motors.me/* → redkmotors.fr${uri.path})\n" +
    categoryA.join("\n") +
    "\n";
  fs.writeFileSync(OUT_A, body, "utf8");
  return categoryA.length;
}

async function main() {
  if (!fs.existsSync(MAP_CSV)) {
    console.error("redirects-map.csv introuvable — lancer npm run build d'abord.");
    process.exit(1);
  }

  const rows = parseMap(fs.readFileSync(MAP_CSV, "utf8"));
  const seen = new Set();
  const unique = rows.filter((r) => {
    if (seen.has(r.source)) return false;
    seen.add(r.source);
    return true;
  });

  // Exclure sources où le path est strictement identique (règle générique suffit)
  const explicit = unique.filter((r) => {
    try {
      return new URL(r.source).pathname !== new URL(r.dest).pathname;
    } catch {
      return true;
    }
  });

  writeMeCsv(explicit);

  const explicitSources = new Set(explicit.map((r) => r.source));
  const sitemapPaths = await frSitemapPaths();
  const categoryACount = writeCategoryA(sitemapPaths, explicitSources);

  console.log(
    JSON.stringify(
      {
        redirectsMapTotal: unique.length,
        cloudflareMeCsv: explicit.length,
        categoryAPaths: categoryACount,
        outputs: [path.basename(OUT_ME), path.basename(OUT_A)],
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
