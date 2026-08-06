#!/usr/bin/env node
/**
 * Worker compact : règle .html générique + map exacte pour cas spéciaux.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CSV = path.join(ROOT, "cloudflare-bulk-redirects-import.csv");
const OUT = path.join(ROOT, "workers", "redkmotors-fr-redirect.js");

function parseCsv(text) {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => {
      const [source, target] = line.split(",");
      return { source, target };
    })
    .filter((r) => r.source?.startsWith("http"));
}

function pathKeys(p) {
  const keys = new Set([p]);
  if (p.endsWith("/") && p.length > 1) keys.add(p.slice(0, -1));
  else if (!p.endsWith("/")) keys.add(`${p}/`);
  return [...keys];
}

function main() {
  const rows = parseCsv(fs.readFileSync(CSV, "utf8"));
  const exact = new Map();

  for (const { source, target } of rows) {
    const sp = new URL(source).pathname;
    const tp = new URL(target).pathname;
    const htmlGuess = sp.endsWith(".html") ? sp.slice(0, -5) + "/" : null;
    if (htmlGuess === tp) continue;
    for (const key of pathKeys(sp)) {
      if (key === tp) continue;
      if (!exact.has(key)) exact.set(key, tp);
    }
  }

  const entries = [...exact.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${JSON.stringify(k)}:${JSON.stringify(v)}`)
    .join(",");

  const code = `export default {
  fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const targetPath = EXACT[path];
    if (targetPath) {
      const dest = new URL(targetPath, "https://redkmotors.fr");
      dest.search = url.search;
      return Response.redirect(dest.toString(), 301);
    }
    if (path.endsWith(".html")) {
      const dest = new URL(path.slice(0, -5) + "/" + url.search, "https://redkmotors.fr");
      return Response.redirect(dest.toString(), 301);
    }
    return fetch(request);
  },
};

const EXACT = {${entries}};
`;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, code, "utf8");
  console.log(
    JSON.stringify({
      output: OUT,
      exactEntries: exact.size,
      bytes: Buffer.byteLength(code),
    }),
  );
}

main();
