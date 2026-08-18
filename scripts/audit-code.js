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
  execSync("npm audit --audit-level=high", { cwd: root, stdio: "pipe" });
  ok("npm audit — 0 vulnérabilité high/critical");
} catch (e) {
  fail("npm audit — vulnérabilités high/critical détectées");
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

console.log("");
if (failed) {
  console.error(`Audit code : ${failed} échec(s)`);
  process.exit(1);
}
console.log("Audit code : OK");
