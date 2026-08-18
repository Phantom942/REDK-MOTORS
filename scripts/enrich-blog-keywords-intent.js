/**
 * Enrichit blogKeywords.js : intention de recherche + requêtes candidates (formation SEO).
 * node scripts/enrich-blog-keywords-intent.js
 */
const fs = require("fs");
const path = require("path");

const blogKeywords = require("../src/_data/blogKeywords.js");

/** @type {Record<string, 'informational'|'commercial'|'transactional'|'navigational'>} */
const INTENT_OVERRIDE = {
  "climatisation-voiture-recharge-ivry": "transactional",
  "prix-pre-controle-technique-ivry": "transactional",
  "entretien-voiture-eviter-pannes-ivry": "transactional",
  "garage-independant-vs-concessionnaire": "commercial",
};

function inferIntent(slug) {
  if (INTENT_OVERRIDE[slug]) return INTENT_OVERRIDE[slug];
  if (/^prix-/.test(slug) || slug.startsWith("combien-coute")) return "commercial";
  if (/-ivry/.test(slug) && /prix-|pre-controle|recharge/.test(slug)) return "transactional";
  if (/checklist|revision-|5-points|preparer-/.test(slug)) return "informational";
  return "informational";
}

function contentFormatFor(intent) {
  const map = {
    informational: "Guide pratique — symptômes, causes, que faire, retour atelier",
    commercial: "Comparatif & fourchettes — critères de prix, inclus/exclus, devis",
    transactional: "Prestation locale — prise de RDV, zone Ivry/94, devis gratuit",
    navigational: "Page ressource — orientation vers service ou page pilier",
  };
  return map[intent] || map.informational;
}

function questionVariants(primary, secondary) {
  const p = primary.trim();
  const out = [];
  if (/^(prix|combien)/i.test(p) || p.includes("prix")) {
    out.push(`combien coûte ${p.replace(/^prix\s/i, "")}`);
    out.push(`${p} 2026`);
  } else if (p.includes("que faire") || p.includes("quand")) {
    out.push(p.endsWith("?") ? p : `${p} ?`);
  } else if (p.includes("symptômes") || p.includes("signes")) {
    out.push(`comment reconnaître ${p.replace(/\s*symptômes?/i, "")}`);
    out.push(`${p} causes`);
  } else {
    out.push(`${p} : que faire`);
    out.push(`comment ${p}`);
  }
  if (secondary[0]) out.push(`${secondary[0]} ${p.split(" ").slice(0, 3).join(" ")}`);
  return out;
}

function buildCandidateQueries(kw, slug) {
  const base = [kw.primary, kw.secondary[0], kw.secondary[1], kw.longTail[0], kw.longTail[1]];
  const variants = questionVariants(kw.primary, kw.secondary);
  const local =
    slug.includes("94") || slug.includes("ivry")
      ? [`${kw.primary} Ivry-sur-Seine`, `${kw.primary} Val-de-Marne`]
      : [`${kw.primary} garage`, `${kw.primary} 94`];

  const seen = new Set();
  const merged = [];
  for (const q of [...base, ...variants, ...local]) {
    const n = q.toLowerCase().trim();
    if (!n || seen.has(n)) continue;
    seen.add(n);
    merged.push(q.trim());
    if (merged.length >= 8) break;
  }
  return merged;
}

const enriched = {};
for (const [slug, kw] of Object.entries(blogKeywords)) {
  const intent = inferIntent(slug);
  enriched[slug] = {
    ...kw,
    intent,
    contentFormat: contentFormatFor(intent),
    candidateQueries: buildCandidateQueries(kw, slug),
  };
}

let js = `/**
 * Fiche SEO par article — formation Blogging & SEO (Qualiopi).
 * - intent : informationnelle | commerciale | transactionnelle | navigationnelle
 * - primary + 2 secondary + longue traîne
 * - candidateQueries : requêtes élargies (PAA, variantes, local)
 * - contentFormat : format éditorial aligné sur l'intention
 */
module.exports = {\n`;

for (const slug of Object.keys(enriched).sort()) {
  const k = enriched[slug];
  js += `  "${slug}": {\n`;
  js += `    intent: ${JSON.stringify(k.intent)},\n`;
  js += `    contentFormat: ${JSON.stringify(k.contentFormat)},\n`;
  js += `    primary: ${JSON.stringify(k.primary)},\n`;
  js += `    secondary: [${k.secondary.map((s) => JSON.stringify(s)).join(", ")}],\n`;
  js += `    longTail: [${k.longTail.map((s) => JSON.stringify(s)).join(", ")}],\n`;
  js += `    candidateQueries: [\n`;
  for (const q of k.candidateQueries) {
    js += `      ${JSON.stringify(q)},\n`;
  }
  js += `    ],\n`;
  js += `  },\n`;
}
js += "};\n";

const target = path.join(__dirname, "../src/_data/blogKeywords.js");
fs.writeFileSync(target, js, "utf8");
console.log("Enrichi:", Object.keys(enriched).length, "articles →", target);
