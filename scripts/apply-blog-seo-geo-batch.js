/**
 * Applique la méthode SEO + GEO sur tous les articles blog :
 * - intro GEO (réponse directe dès la 1re phrase)
 * - disclaimer diagnostic en conclusion
 * - H2 conclusion → « Quand passer à l'atelier »
 * - fiche mots-clés (contentFormat, longTail string)
 * - facts atelier harmonisés
 */
const fs = require("fs");
const path = require("path");
const blogKeywords = require("../src/_data/blogKeywords.js");
const enhancements = require("../src/_data/blogArticleEnhancements.js");

const ARTICLES_DIR = path.join(__dirname, "../src/blog/articles");
const SKIP = new Set([]); // idempotent — tout le catalogue

function stripBom(s) {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

function parseFrontMatter(raw) {
  const text = stripBom(raw);
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  return { fm: m[1], body: text.slice(m[0].length) };
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function overlapRatio(a, b) {
  const wa = new Set(a.toLowerCase().split(/\s+/).filter((w) => w.length > 4));
  const wb = b.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
  if (!wa.size || !wb.length) return 0;
  let hit = 0;
  for (const w of wb) if (wa.has(w)) hit++;
  return hit / Math.max(wa.size, wb.length);
}

function inferContentFormat(slug, kw) {
  if (slug.startsWith("prix-")) return "Comparatif prix — fourchette et facteurs";
  if (slug.includes("checklist") || slug.includes("points-")) return "Checklist pratique";
  if (slug.includes("symptom") || slug.includes("signes") || slug.includes("voyant") || slug.includes("bruit") || slug.includes("fumee") || slug.includes("fuite"))
    return "Guide symptômes — signes, causes, que faire";
  if (slug.includes("quand-changer") || slug.includes("quand-") || slug.includes("combien-temps"))
    return "Guide entretien — fréquence et critères";
  if (slug.includes("vs-") || slug.includes("compar")) return "Comparatif — avantages et limites";
  if (kw.intent === "commercial") return "Guide prix — fourchette et prestation";
  return "Guide pratique — causes, que faire, retour atelier";
}

const DISCLAIMER =
  "Les éléments décrits ici ne remplacent pas un diagnostic professionnel : seul un contrôle en atelier confirme l'origine exacte de la panne ou l'état des organes concernés.";

function hasDisclaimer(text) {
  return /ne remplace pas un diagnostic|seul un (contrôle|diagnostic|mécanicien|passage)/i.test(text);
}

function buildGeoIntro(da, originalHtml, slug) {
  const answer = da.answer.trim();
  let prudence = "";
  const diagnosticSlugs =
    /symptom|voyant|bruit|fumee|fuite|panne|hs|patine|vibre|surchauffe|ne-demarre|broate|perte-puissance|encrasse|bouche|mou-|dure-|sifflement|claque|anormal|refuse|checklist-achat/i;
  if (diagnosticSlugs.test(slug) && !/ne remplace pas|seul un diagnostic/i.test(answer)) {
    prudence =
      " Ces signes orientent vers les causes les plus fréquentes, mais seul un contrôle en atelier confirme le diagnostic.";
  }

  const origMatch = originalHtml.match(/<section id="intro">\s*([\s\S]*?)<\/section>/);
  if (origMatch) {
    const origInner = origMatch[1];
    const paras = [...origInner.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1].trim());
    const firstOrig = paras[0] || "";
    const restParas = paras.slice(1);
    let secondBlock = "";
    if (firstOrig && overlapRatio(answer, firstOrig) < 0.45) {
      secondBlock = `\n  <p>${firstOrig}</p>`;
    } else if (restParas.length) {
      secondBlock = restParas.map((p) => `\n  <p>${p}</p>`).join("");
    }
    const newIntro = `<section id="intro">
  <p>${answer}${prudence}</p>${secondBlock}
</section>`;
    return originalHtml.replace(/<section id="intro">\s*[\s\S]*?<\/section>/, newIntro);
  }

  // Pas de section intro : premier <p> avant le sommaire
  const leadMatch = originalHtml.match(/^(\s*)<p>([\s\S]*?)<\/p>(\s*<nav class="article-toc")/);
  if (leadMatch) {
    const firstOrig = leadMatch[2].trim();
    let secondBlock = "";
    if (firstOrig && overlapRatio(answer, firstOrig) < 0.45) {
      secondBlock = `\n  <p>${firstOrig}</p>`;
    }
    const newIntro = `<section id="intro">
  <p>${answer}${prudence}</p>${secondBlock}
</section>

`;
    return originalHtml.replace(
      /^(\s*)<p>[\s\S]*?<\/p>(\s*<nav class="article-toc")/,
      newIntro + "$2"
    );
  }

  return null;
}

function fixConclusion(body) {
  let out = body;

  out = out.replace(
    /(<section id="conclusion">\s*)<h2>\d+\.\s*Conclusion<\/h2>/gi,
    "$1<h2>5. Quand passer à l'atelier</h2>"
  );
  out = out.replace(
    /(<section id="conclusion">\s*)<h2>Conclusion<\/h2>/gi,
    "$1<h2>Quand passer à l'atelier</h2>"
  );

  if (!hasDisclaimer(out)) {
    const sectionIds = ["conclusion", "suite", "garage", "diagnostic", "devis", "redk-motors"];
    let injected = false;
    for (const id of sectionIds) {
      const re = new RegExp(`(<section id="${id}">)([\\s\\S]*?)(<\\/section>)`);
      const m = out.match(re);
      if (m) {
        out = out.replace(re, `$1$2  <p>${DISCLAIMER}</p>\n$3`);
        injected = true;
        break;
      }
    }
    if (!injected) {
      const ctaIdx = out.indexOf('<div class="article-cta">');
      if (ctaIdx > -1) {
        out =
          out.slice(0, ctaIdx) +
          `<section id="conclusion">\n  <h2>Quand passer à l'atelier</h2>\n  <p>${DISCLAIMER}</p>\n  <p><strong>RED-K MOTORS</strong>, 9 rue Michelet, Ivry-sur-Seine (94) — lun–sam 9h–19h. <a href="/contact/">Prendre rendez-vous</a> pour un diagnostic ou un devis avant travaux.</p>\n</section>\n\n` +
          out.slice(ctaIdx);
      }
    }
  }

  return out;
}

function injectMissingBlogLinks(body, relatedLinks) {
  if (!Array.isArray(relatedLinks)) return body;
  const blogLinks = relatedLinks.filter((l) => l.url.startsWith("/blog/"));
  let out = body;
  for (const link of blogLinks.slice(0, 2)) {
    if (out.includes(link.url)) continue;
    const anchor = link.label.toLowerCase();
    const insert = ` Voir aussi <a href="${link.url}">${link.label.toLowerCase()}</a>.`;
    if (out.includes('id="conclusion"')) {
      out = out.replace(
        /(<section id="conclusion">[\s\S]*?<p>)([^<]+)(<\/p>\s*(?:<p>|$))/,
        (m, pre, content, post) => {
          if (content.includes(link.url)) return m;
          return `${pre}${content.replace(/\.\s*$/, "")}${insert}${post}`;
        }
      );
      break;
    }
  }
  return out;
}

function normalizeKeywordsEntry(slug, kw) {
  const longTail = Array.isArray(kw.longTail) ? kw.longTail[0] : kw.longTail;
  return {
    ...kw,
    contentFormat: inferContentFormat(slug, kw),
    longTail: longTail || kw.primary,
    candidateQueries: (kw.candidateQueries || [])
      .filter((q, i, arr) => arr.indexOf(q) === i)
      .slice(0, 8),
  };
}

function normalizeEnhancement(slug, enh) {
  if (!enh?.directAnswer) return enh;
  const facts = (enh.directAnswer.facts || []).map((f) => {
    if (f.label === "Atelier" || f.label === "Atelier diesel") {
      return { ...f, value: "RED-K MOTORS · Ivry (94)" };
    }
    return f;
  });
  return { ...enh, directAnswer: { ...enh.directAnswer, facts } };
}

function serializeKeywordsFile(obj) {
  const lines = ["/** Fiches mots-clés blog — 1 principal + 2 secondaires + longue traîne */", "module.exports = {"];
  for (const slug of Object.keys(obj).sort()) {
    const k = obj[slug];
    lines.push(`  "${slug}": {`);
    lines.push(`    intent: "${k.intent}",`);
    lines.push(`    contentFormat: ${JSON.stringify(k.contentFormat)},`);
    lines.push(`    primary: ${JSON.stringify(k.primary)},`);
    lines.push(`    secondary: ${JSON.stringify(k.secondary)},`);
    lines.push(`    longTail: ${JSON.stringify(k.longTail)},`);
    lines.push(`    candidateQueries: [`);
    for (const q of k.candidateQueries) lines.push(`      ${JSON.stringify(q)},`);
    lines.push(`    ],`);
    lines.push(`  },`);
  }
  lines.push("};", "");
  return lines.join("\n");
}

// --- Main ---
let articleUpdates = 0;
const report = [];

for (const file of fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".njk")).sort()) {
  const slug = file.replace(".njk", "");
  if (SKIP.has(slug)) continue;

  const kw = blogKeywords[slug];
  const enh = enhancements[slug];
  if (!kw || !enh?.directAnswer) {
    report.push({ slug, status: "SKIP", reason: "missing kw or directAnswer" });
    continue;
  }

  const filePath = path.join(ARTICLES_DIR, file);
  const parsed = parseFrontMatter(fs.readFileSync(filePath, "utf8"));
  if (!parsed) continue;

  let { fm, body } = parsed;
  let changed = false;

  const newIntroBody = buildGeoIntro(enh.directAnswer, body, slug);
  if (newIntroBody && newIntroBody !== body) {
    body = newIntroBody;
    changed = true;
  }

  const fixedBody = fixConclusion(body);
  if (fixedBody !== body) {
    body = fixedBody;
    changed = true;
  }

  const linkedBody = injectMissingBlogLinks(body, enh.relatedLinks);
  if (linkedBody !== body) {
    body = linkedBody;
    changed = true;
  }

  blogKeywords[slug] = normalizeKeywordsEntry(slug, kw);
  enhancements[slug] = normalizeEnhancement(slug, enh);

  if (changed) {
    fs.writeFileSync(filePath, `---\n${fm}\n---${body}`, "utf8");
    articleUpdates++;
    report.push({ slug, status: "UPDATED" });
  } else {
    report.push({ slug, status: "keywords-only" });
  }
}

// Rewrite blogKeywords.js in place (patch entries only via eval-safe approach)
const kwPath = path.join(__dirname, "../src/_data/blogKeywords.js");
let kwSrc = fs.readFileSync(kwPath, "utf8");
for (const slug of Object.keys(blogKeywords)) {
  const k = blogKeywords[slug];
  const blockRe = new RegExp(`("${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*\\{)[\\s\\S]*?(\\n  \\},)`);
  const newBlock = `"${slug}": {
    intent: "${k.intent}",
    contentFormat: ${JSON.stringify(k.contentFormat)},
    primary: ${JSON.stringify(k.primary)},
    secondary: ${JSON.stringify(k.secondary)},
    longTail: ${JSON.stringify(k.longTail)},
    candidateQueries: [
${k.candidateQueries.map((q) => `      ${JSON.stringify(q)},`).join("\n")}
    ],
  },`;
  if (blockRe.test(kwSrc)) {
    kwSrc = kwSrc.replace(blockRe, newBlock);
  }
}

fs.writeFileSync(kwPath, kwSrc, "utf8");

// Patch enhancements facts in JS file (simple replace for Atelier values)
const enhPath = path.join(__dirname, "../src/_data/blogArticleEnhancements.js");
let enhSrc = fs.readFileSync(enhPath, "utf8");
enhSrc = enhSrc.replace(
  /\{ label: "Atelier(?: diesel)?", value: "[^"]*" \}/g,
  '{ label: "Atelier", value: "RED-K MOTORS · Ivry (94)" }'
);
fs.writeFileSync(enhPath, enhSrc, "utf8");

console.log("Articles body mis à jour:", articleUpdates);
console.log("Total traités:", report.length);
const updated = report.filter((r) => r.status === "UPDATED").length;
console.log("UPDATED:", updated);
if (report.some((r) => r.status === "SKIP")) {
  console.log("SKIPPED:", report.filter((r) => r.status === "SKIP").map((r) => r.slug).join(", "));
}
