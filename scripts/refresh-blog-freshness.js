/**
 * Rafraîchit la fraîcheur du blog :
 * - lastReviewed + dateModified (articleSchema) → date du jour
 * - supprime les paragraphes d'intro dupliqués (effet secondaire batch SEO+GEO)
 *
 * Usage : node scripts/refresh-blog-freshness.js [--dry-run] [--date=YYYY-MM-DD]
 */
const fs = require("fs");
const path = require("path");

const ARTICLES_DIR = path.join(__dirname, "../src/blog/articles");
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const dateArg = args.find((a) => a.startsWith("--date="));
const FRESH_DATE = dateArg ? dateArg.split("=")[1] : new Date().toISOString().slice(0, 10);

function stripBom(s) {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function overlapRatio(a, b) {
  const wa = new Set(a.toLowerCase().split(/\s+/).filter((w) => w.length > 4));
  const wb = b.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
  if (!wa.size || !wb.length) return 0;
  let hit = 0;
  for (const w of wb) if (wa.has(w)) hit++;
  return hit / Math.max(wa.size, wb.length);
}

function dedupeIntro(body) {
  return body.replace(/<section id="intro">\s*([\s\S]*?)<\/section>/g, (match, inner) => {
    const paras = [...inner.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1].trim());
    if (paras.length < 2) return match;
    const overlap = overlapRatio(stripHtml(paras[0]), stripHtml(paras[1]));
    if (overlap < 0.45) return match;
    return `<section id="intro">\n  <p>${paras[0]}</p>\n</section>`;
  });
}

function updateFrontMatter(fm) {
  let updated = fm;

  if (/lastReviewed:\s*"[^"]+"/.test(updated)) {
    updated = updated.replace(/lastReviewed:\s*"[^"]+"/, `lastReviewed: "${FRESH_DATE}"`);
  } else {
    updated = updated.replace(/(dateDisplay:[^\n]+\n)/, `$1lastReviewed: "${FRESH_DATE}"\n`);
  }

  updated = updated.replace(/dateModified:\s*"[^"]+"/, `dateModified: "${FRESH_DATE}"`);

  return updated;
}

function processFile(filePath) {
  const raw = stripBom(fs.readFileSync(filePath, "utf8"));
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---([\s\S]*)$/);
  if (!m) return { changed: false, reason: "no front matter" };

  const newFm = updateFrontMatter(m[1]);
  const newBody = dedupeIntro(m[2]);
  const changed = newFm !== m[1] || newBody !== m[2];

  if (changed && !DRY_RUN) {
    fs.writeFileSync(filePath, `---\n${newFm.trimEnd()}\n---${newBody}`, "utf8");
  }

  return {
    changed,
    deduped: newBody !== m[2],
    dateUpdated: newFm !== m[1],
  };
}

const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".njk"));
let changedCount = 0;
let dedupedCount = 0;

for (const file of files.sort()) {
  const result = processFile(path.join(ARTICLES_DIR, file));
  if (result.changed) {
    changedCount++;
    if (result.deduped) dedupedCount++;
    console.log(`✓ ${file}${result.deduped ? " (intro dédupliquée)" : ""}`);
  }
}

console.log(
  `\n${DRY_RUN ? "[dry-run] " : ""}${changedCount}/${files.length} articles mis à jour — date ${FRESH_DATE}, ${dedupedCount} intros nettoyées`
);
