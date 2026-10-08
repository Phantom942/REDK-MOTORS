#!/usr/bin/env node
/** Vérifie le HTML servi : 2 pills navbar, pas de doublon dans bar-links. */
import assert from "node:assert/strict";

const base = process.env.HEADER_CHECK_URL ?? "http://localhost:8082";

const paths = ["/", "/achat-revente/vehicules/", "/achat-revente/compte/"];

for (const path of paths) {
  const url = `${base.replace(/\/$/, "")}${path}`;
  const res = await fetch(url);
  assert.equal(res.status, 200, `${url} status`);
  const html = await res.text();
  const start = html.indexOf('<ul class="main-nav__bar-links">');
  assert.ok(start >= 0, `${path}: bar-links introuvable`);
  const tel = html.indexOf('<a href="tel:', start);
  const slice = html.slice(start, tel);
  let depth = 0;
  let topLevel = 0;
  const re = /<\/?ul\b|<li class="main-nav__bar-item/gi;
  let match;
  while ((match = re.exec(slice))) {
    const token = match[0].toLowerCase();
    if (token.startsWith("<li")) {
      if (depth === 1) topLevel += 1;
    } else if (token === "<ul") {
      depth += 1;
    } else if (token === "</ul") {
      depth -= 1;
    }
  }
  assert.equal(topLevel, 2, `${path}: attendu 2 entrées bar (Nos services + Espace Pro), got ${topLevel}`);
  const headers = (html.match(/<header class="main-header"/g) ?? []).length;
  assert.equal(headers, 1, `${path}: un seul header`);
}

console.log("OK header HTML:", paths.join(", "));
