const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "blog", "articles");
const map = {
  "revision-auto": "revision",
  tarifs: "conseils-auto",
  plaquettes: "freins",
  climatisation: "entretien",
  embrayage: "mecanique",
  suspension: "mecanique",
  "ivry-sur-seine": "conseils-auto",
  reparation: "mecanique",
  pollution: "moteur",
  allumage: "moteur",
  refroidissement: "moteur",
  courroie: "mecanique",
  turbo: "moteur",
  electricite: "diagnostic",
  "boite-automatique": "entretien",
  batterie: "mecanique",
  diesel: "moteur",
  pneus: "pneumatiques",
  freinage: "freins",
};

let changed = 0;
for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith(".njk")) continue;
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, "utf8");
  const m = content.match(/^tags:\s*\[(.*)\]/m);
  if (!m) continue;
  const tags = m[1]
    .split(",")
    .map((t) => t.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
  const orig = tags.join("|");
  const normalized = [...new Set(tags.map((t) => map[t] || t))];
  const newLine = `tags: [${normalized.map((t) => `"${t}"`).join(", ")}]`;
  const newContent = content.replace(/^tags:\s*\[.*\]/m, newLine);
  if (newContent !== content) {
    fs.writeFileSync(fp, newContent);
    changed += 1;
    console.log(`${file}: ${orig} -> ${normalized.join(", ")}`);
  }
}
console.log(`Updated ${changed} files`);
