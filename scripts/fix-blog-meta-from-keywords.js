/** Aligne title (≤60) et description (80–155 + CTA) depuis blogKeywords.js */
const fs = require("fs");
const path = require("path");
const blogKeywords = require("../src/_data/blogKeywords.js");

const ARTICLES_DIR = path.join(__dirname, "../src/blog/articles");
const CTA = "Devis gratuit · Ivry (94)";

function stripBom(s) {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

function parseFrontMatter(raw) {
  const text = stripBom(raw);
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  return { fm: m[1], body: text.slice(m[0].length), fullMatch: m[0] };
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function titleFromPrimary(primary) {
  const base = capitalize(primary);
  const suffix = " | RED-K MOTORS";
  if (base.length + suffix.length <= 60) return base + suffix;
  const trimmed = base.slice(0, 60 - suffix.length).replace(/\s+\S*$/, "");
  return trimmed + suffix;
}

function descFromKeywords(kw) {
  let desc = capitalize(kw.primary) + " · " + kw.secondary[0] + ". " + CTA;
  if (desc.length > 155) desc = capitalize(kw.primary) + ". " + CTA;
  if (desc.length > 155) desc = desc.slice(0, 152).replace(/\s+\S*$/, "") + "…";
  if (desc.length < 80) {
    desc = capitalize(kw.primary) + " — " + kw.longTail[0] + ". " + CTA;
    if (desc.length > 155) desc = desc.slice(0, 152).replace(/\s+\S*$/, "") + "…";
  }
  return desc;
}

function getField(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*"([^"]*)"`, "m"));
  return m ? m[1] : "";
}

function setField(fm, key, value) {
  const re = new RegExp(`^${key}:\\s*"[^"]*"`, "m");
  if (re.test(fm)) return fm.replace(re, `${key}: "${value}"`);
  return fm;
}

let fixed = 0;
let bomStripped = 0;

for (const file of fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".njk"))) {
  const slug = file.replace(".njk", "");
  const kw = blogKeywords[slug];
  if (!kw) continue;

  const filePath = path.join(ARTICLES_DIR, file);
  let raw = fs.readFileSync(filePath, "utf8");
  const hadBom = raw.charCodeAt(0) === 0xfeff;
  const parsed = parseFrontMatter(raw);
  if (!parsed) {
    console.warn("SKIP (no FM):", slug);
    continue;
  }

  let { fm, body, fullMatch } = parsed;
  const title = getField(fm, "title");
  const desc = getField(fm, "description");
  const titleClean = title.replace(/\s*\|\s*RED-K MOTORS.*$/i, "").trim();
  const needsTitle = titleClean.length === 0 || titleClean.length > 60;
  const needsDesc = desc.length === 0 || desc.length > 155 || desc.length < 80;

  if (needsTitle) fm = setField(fm, "title", titleFromPrimary(kw.primary));
  if (needsDesc) fm = setField(fm, "description", descFromKeywords(kw));

  const headline = getField(fm, "title").replace(/\s*\|\s*RED-K MOTORS.*$/i, "").trim();
  if (/^  headline: "/m.test(fm)) {
    fm = fm.replace(/^  headline: ".*"$/m, `  headline: "${headline}"`);
  }
  const newDesc = getField(fm, "description");
  fm = fm.replace(/(articleSchema:[\s\S]*?^  description: ")[^"]*(")/m, `$1${newDesc}$2`);

  if (needsTitle || needsDesc || hadBom) {
    raw = `---\n${fm}\n---${body}`;
    fs.writeFileSync(filePath, raw, "utf8");
    fixed++;
    if (hadBom) bomStripped++;
    console.log("OK", slug, needsTitle ? "title" : "", needsDesc ? "desc" : "", hadBom ? "bom" : "");
  }
}

console.log("\nCorrigés:", fixed, "| BOM retirés:", bomStripped);
