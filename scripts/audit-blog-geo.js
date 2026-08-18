const fs = require("fs");
const path = require("path");
const e = require("../src/_data/blogArticleEnhancements.js");
const p = path.join(__dirname, "../src/blog/articles");
const slugs = fs.readdirSync(p).filter((f) => f.endsWith(".njk")).map((f) => f.replace(".njk", ""));

const introMismatch = [];
const noDisclaimer = [];

for (const s of slugs) {
  const b = fs.readFileSync(path.join(p, `${s}.njk`), "utf8").split("---").slice(2).join("---");
  const da = e[s]?.directAnswer?.answer || "";
  const introM = b.match(/<section id="intro">\s*<p>([\s\S]*?)<\/p>/);
  if (!introM) introMismatch.push(`${s}: no intro`);
  else if (da && !introM[1].includes(da.slice(0, 40).replace(/\s+/g, " ").trim().slice(0, 25))) {
    introMismatch.push(s);
  }
  if (!/ne remplace pas un diagnostic|seul un contrôle|seul un diagnostic|Cette checklist ne remplace pas|symptômes décrits ici ne remplacent pas/i.test(b)) {
    noDisclaimer.push(s);
  }
}

console.log("Intro GEO:", slugs.length - introMismatch.length, "/", slugs.length);
if (introMismatch.length) console.log("Intro mismatch:", introMismatch.join(", "));
console.log("Disclaimer:", slugs.length - noDisclaimer.length, "/", slugs.length);
if (noDisclaimer.length) console.log("Sans disclaimer:", noDisclaimer.join(", "));
