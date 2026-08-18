/** Audit SEO blog — checklist formation Blogging & SEO */
const fs = require("fs");
const path = require("path");
const blogKeywords = require("../src/_data/blogKeywords.js");

const ARTICLES_DIR = path.join(__dirname, "../src/blog/articles");
const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".njk"));

function stripBom(s) {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

function parseFrontMatter(raw) {
  const text = stripBom(raw);
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { fm: "", body: raw };
  return { fm: m[1], body: text.slice(m[0].length) };
}

function getField(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*"([^"]*)"`, "m"));
  return m ? m[1] : "";
}

const rows = [];
for (const f of files) {
  const slug = f.replace(".njk", "");
  const kw = blogKeywords[slug];
  const raw = stripBom(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8"));
  const { fm, body } = parseFrontMatter(raw);
  const title = getField(fm, "title");
  const desc = getField(fm, "description");
  const titleClean = title.replace(/\s*\|\s*RED-K MOTORS.*$/i, "").trim();
  rows.push({
    file: f,
    slug,
    hasKeywords: Boolean(kw?.primary && kw.secondary?.length >= 2 && kw.longTail?.length >= 1),
    hasIntent: Boolean(kw?.intent && kw?.contentFormat),
    hasCandidates: Boolean(kw?.candidateQueries?.length >= 5),
    titleLen: titleClean.length,
    descLen: desc.length,
    hasToc: body.includes("article-toc"),
    hasCta: body.includes("article-cta"),
    hasNote: body.includes("article-note"),
    hasTable: body.includes("<table"),
    bodyLen: body.trim().length,
    titleOk: titleClean.length > 0 && titleClean.length <= 60,
    descOk: desc.length > 0 && desc.length <= 155 && desc.length >= 80,
  });
}

console.log("Total articles:", rows.length);
console.log("Fiche mots-clés (principal+2 sec+longue traîne):", rows.filter((r) => r.hasKeywords).length);
console.log("Intention + format éditorial:", rows.filter((r) => r.hasIntent).length);
console.log("Requêtes candidates (≥5):", rows.filter((r) => r.hasCandidates).length);
console.log("Title > 60:", rows.filter((r) => !r.titleOk).length);
console.log("Meta hors 80-155:", rows.filter((r) => !r.descOk).length);
console.log("Sans article-note:", rows.filter((r) => !r.hasNote).length);

const missingKw = rows.filter((r) => !r.hasKeywords || !r.hasIntent || !r.hasCandidates);
if (missingKw.length) {
  console.log("\nFiches incomplètes:", missingKw.map((r) => r.slug).join(", "));
  process.exit(1);
}
