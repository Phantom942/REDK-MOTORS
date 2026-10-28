#!/usr/bin/env node
/**
 * Crawl _site : liens internes absolus/relatifs → fichier HTML existant.
 * Usage : npm run build && npm run audit:links
 */
"use strict";

const fs = require("fs");
const path = require("path");

const SITE = "https://redkmotors.fr";
const siteDir = path.join(__dirname, "..", "_site");
const SKIP_EXT = /\.(pdf|zip|webp|png|jpe?g|gif|svg|ico|woff2?|css|js|xml|txt|mp4|webm)(\?|$)/i;

let failed = 0;
const broken = [];

function htmlFiles(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name.startsWith(".")) continue;
      htmlFiles(full, acc);
    } else if (ent.name.endsWith(".html")) acc.push(full);
  }
  return acc;
}

function resolveInternal(href) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return null;
  }
  if (href.startsWith("javascript:")) return null;

  let pathOnly = href;
  if (pathOnly.startsWith(SITE)) {
    pathOnly = pathOnly.slice(SITE.length);
  } else if (/^https?:\/\//i.test(pathOnly)) {
    return null;
  }

  pathOnly = pathOnly.split("#")[0].split("?")[0];
  if (!pathOnly || pathOnly === "") pathOnly = "/";
  if (!pathOnly.startsWith("/")) return null;
  if (SKIP_EXT.test(pathOnly)) return null;

  const relPath = pathOnly.replace(/^\//, "").split("/").join(path.sep);
  const directFile = path.join(siteDir, relPath);
  if (fs.existsSync(directFile) && !fs.statSync(directFile).isDirectory()) {
    return { ok: true };
  }
  const indexFile = path.join(
    siteDir,
    (pathOnly.endsWith("/") ? pathOnly : `${pathOnly}/`).replace(/^\//, "").split("/").join(path.sep),
    "index.html",
  );
  if (fs.existsSync(indexFile)) return { ok: true };
  return { ok: false, pathOnly };
}

function main() {
  if (!fs.existsSync(siteDir)) {
    console.error("✗ _site/ absent — lancer npm run build");
    process.exit(1);
  }

  const files = htmlFiles(siteDir);
  const hrefRe = /href\s*=\s*["']([^"']+)["']/gi;
  let checked = 0;

  for (const file of files) {
    const relPage = path.relative(siteDir, file).replace(/\\/g, "/");
    const html = fs.readFileSync(file, "utf8");
    let m;
    while ((m = hrefRe.exec(html)) !== null) {
      const href = m[1].trim();
      const result = resolveInternal(href);
      if (!result) continue;
      checked++;
      if (!result.ok) {
        broken.push({ from: relPage, href, path: result.pathOnly });
        failed++;
      }
    }
  }

  const uniq = new Map();
  for (const b of broken) {
    uniq.set(`${b.from}|${b.href}`, b);
  }

  if (uniq.size) {
    console.error(`✗ ${uniq.size} lien(s) interne(s) cassé(s) (échantillon 20):`);
    [...uniq.values()].slice(0, 20).forEach((b) => {
      console.error(`  ${b.from} → ${b.href}`);
    });
  } else {
    console.log(`✓ ${checked} liens internes vérifiés — 0 cassé`);
  }

  if (failed) {
    console.error("audit:links — échec");
    process.exit(1);
  }
  console.log("audit:links — OK");
}

main();
