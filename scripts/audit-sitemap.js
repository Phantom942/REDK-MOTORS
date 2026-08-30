#!/usr/bin/env node
/**
 * Vérifie la cohérence robots.txt + sitemaps après build.
 * Usage : npm run build && npm run audit:sitemap
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const siteDir = path.join(root, "_site");
const indexableTags = require("../src/_data/indexableTags.json");

let failed = 0;
function check(ok, msg) {
  if (!ok) {
    console.error(`✗ ${msg}`);
    failed++;
    return;
  }
  console.log(`✓ ${msg}`);
}

function parseLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

function read(rel) {
  const p = path.join(siteDir, rel);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf8");
}

function countArticles() {
  const dir = path.join(root, "src/blog/articles");
  return fs.readdirSync(dir).filter((f) => f.endsWith(".njk")).length;
}

function main() {
  const robots = read("robots.txt");
  const indexXml = read("sitemap.xml");
  const pagesXml = read("sitemap-pages.xml");
  const blogXml = read("sitemap-blog.xml");
  const exemplesXml = read("sitemap-exemples.xml");

  check(!!robots, "robots.txt présent dans _site");
  check(!!indexXml, "sitemap.xml présent");
  check(!!pagesXml, "sitemap-pages.xml présent");
  check(!!blogXml, "sitemap-blog.xml présent");
  check(!!exemplesXml, "sitemap-exemples.xml présent");

  if (robots) {
    check(/Sitemap: https:\/\/redkmotors\.fr\/sitemap\.xml/.test(robots), "robots.txt → sitemap index");
    check(/Sitemap: https:\/\/redkmotors\.fr\/sitemap-blog\.xml/.test(robots), "robots.txt → sitemap-blog");
    check(/Disallow: \/blog\/page\//.test(robots), "robots.txt bloque pagination blog");
  }

  if (indexXml) {
    const subs = parseLocs(indexXml);
    check(subs.length === 3, `sitemap index = 3 sous-sitemaps (${subs.length})`);
    check(subs.includes("https://redkmotors.fr/sitemap-pages.xml"), "index inclut sitemap-pages");
    check(subs.includes("https://redkmotors.fr/sitemap-blog.xml"), "index inclut sitemap-blog");
    check(subs.includes("https://redkmotors.fr/sitemap-exemples.xml"), "index inclut sitemap-exemples");
  }

  const articleCount = countArticles();
  const expectedBlogUrls = 1 + articleCount + indexableTags.length;

  if (blogXml) {
    const blogLocs = parseLocs(blogXml);
    check(blogLocs.length === expectedBlogUrls, `sitemap-blog = ${expectedBlogUrls} URLs (${blogLocs.length})`);
    check(!blogLocs.some((u) => u.includes("/blog/page/")), "sitemap-blog sans pagination");
    check(blogLocs.includes("https://redkmotors.fr/blog/"), "sitemap-blog inclut /blog/");
  }

  if (pagesXml) {
    const pageLocs = parseLocs(pagesXml);
    check(pageLocs.length >= 80, `sitemap-pages ≥ 80 URLs (${pageLocs.length})`);
    check(!pageLocs.some((u) => u.includes("/blog/")), "sitemap-pages sans URLs blog");
    check(!pageLocs.some((u) => u.includes("/exemples/")), "sitemap-pages sans URLs exemples");
  }

  if (exemplesXml) {
    const exLocs = parseLocs(exemplesXml);
    check(exLocs.length >= 8, `sitemap-exemples ≥ 8 URLs (${exLocs.length})`);
  }

  if (failed > 0) {
    console.error(`\naudit:sitemap — ${failed} échec(s)`);
    process.exit(1);
  }
  console.log("\naudit:sitemap — OK");
}

main();
