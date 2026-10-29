#!/usr/bin/env node
/**
 * Audit qualité code / build — utilisé en local et CI.
 * Échoue (exit 1) si une règle bloquante n'est pas respectée.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
let failed = 0;

function ok(msg) {
  console.log(`✓ ${msg}`);
}

function fail(msg) {
  console.error(`✗ ${msg}`);
  failed += 1;
}

function mustExist(relPath, label) {
  const full = path.join(root, relPath);
  if (fs.existsSync(full)) ok(`${label} — ${relPath}`);
  else fail(`${label} manquant — ${relPath}`);
}

console.log("=== Audit code RED-K MOTORS ===\n");

// npm audit (high+)
try {
  // Site statique : pas de runtime npm en prod — on audite les deps non-dev uniquement.
  execSync("npm audit --omit=dev --audit-level=high", { cwd: root, stdio: "pipe" });
  ok("npm audit (prod) — 0 vulnérabilité high/critical");
} catch (e) {
  fail("npm audit (prod) — vulnérabilités high/critical détectées");
  if (e.stdout) console.error(e.stdout.toString());
}

// Fonts self-hosted
mustExist("assets/css/fonts-local.css", "CSS fonts locales");
mustExist("assets/fonts/manrope-latin-400-normal.woff2", "Font Manrope 400");
mustExist("assets/fonts/space-grotesk-latin-700-normal.woff2", "Font Space Grotesk 700");
mustExist("assets/img/logo-redk-motors.webp", "Logo WebP");

const baseNjk = fs.readFileSync(path.join(root, "src/_includes/base.njk"), "utf8");
if (baseNjk.includes("fonts.googleapis.com")) {
  fail("Google Fonts encore référencé dans base.njk");
} else {
  ok("Google Fonts retiré de base.njk");
}

if (!baseNjk.includes("fonts-local.css")) {
  fail("fonts-local.css non chargé dans base.njk");
} else {
  ok("fonts-local.css chargé dans base.njk");
}

// _headers copié au build
mustExist("_headers", "Fichier _headers racine");

// Audits blog
for (const script of ["audit-blog-seo.js", "audit-blog-geo.js"]) {
  try {
    execSync(`node scripts/${script}`, { cwd: root, stdio: "inherit" });
    ok(`Blog — ${script}`);
  } catch {
    fail(`Blog — ${script} en échec`);
  }
}

// Audit exemples (noindex longue traîne)
try {
  execSync("node scripts/audit-exemples.js", { cwd: root, stdio: "inherit" });
  ok("Exemples — politique noindex");
} catch {
  fail("Exemples — audit en échec");
}

try {
  execSync("node scripts/audit-prestations-seo.js", { cwd: root, stdio: "inherit" });
  ok("Prestations — meta keywords");
} catch {
  fail("Prestations — audit SEO en échec");
}

try {
  execSync("node scripts/audit-page-keywords.js", { cwd: root, stdio: "inherit" });
  ok("PageKey — meta keywords indexables");
} catch {
  fail("PageKey — audit keywords en échec");
}

try {
  execSync("node scripts/audit-gsc-top-links.js", { cwd: root, stdio: "inherit" });
  ok("GSC top — maillage garage Ivry");
} catch {
  fail("GSC top — audit maillage en échec");
}

try {
  execSync("node scripts/audit-google-reviews-consistency.js", { cwd: root, stdio: "inherit" });
  ok("Avis Google — cohérence count/rating");
} catch {
  fail("Avis Google — cohérence en échec");
}

console.log("");
if (failed) {
  console.error(`Audit code : ${failed} échec(s)`);
  process.exit(1);
}
console.log("Audit code : OK");
