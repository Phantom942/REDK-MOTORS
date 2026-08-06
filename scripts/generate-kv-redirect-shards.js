#!/usr/bin/env node
/**
 * Génère les shards KV pour le Worker redkmotors-fr-redirect (workers/kv-shards/).
 * Exclut les redirects identiques (évite boucles 301).
 *
 * Usage: node scripts/generate-kv-redirect-shards.js
 * Upload: npx wrangler kv key put --namespace-id=... "r:b" --path=workers/kv-shards/r-b.json --remote
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CSV = path.join(ROOT, "cloudflare-bulk-redirects-import.csv");
const OUT_DIR = path.join(ROOT, "workers", "kv-shards");

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
  if (!fs.existsSync(CSV)) {
    console.error("cloudflare-bulk-redirects-import.csv introuvable — lancer npm run build.");
    process.exit(1);
  }

  const exact = new Map();
  for (const { source, target } of parseCsv(fs.readFileSync(CSV, "utf8"))) {
    const sp = new URL(source).pathname;
    const tp = new URL(target).pathname;
    const htmlGuess = sp.endsWith(".html") ? sp.slice(0, -5) + "/" : null;
    if (htmlGuess === tp) continue;
    for (const key of pathKeys(sp)) {
      if (key === tp) continue;
      if (!exact.has(key)) exact.set(key, tp);
    }
  }

  const shards = {};
  for (const [p, target] of exact.entries()) {
    const bucket = p.charAt(1) || "_";
    if (!shards[bucket]) shards[bucket] = {};
    shards[bucket][p] = target;
  }

  // Split bucket "e" (/entretien, /equipe, /exemples…) en sous-clés
  if (shards.e) {
    const en = {};
    const eq = {};
    const ex = {};
    for (const [k, v] of Object.entries(shards.e)) {
      if (k.startsWith("/entretien")) en[k] = v;
      else if (k.startsWith("/equipe")) eq[k] = v;
      else ex[k] = v;
    }
    delete shards.e;
    if (Object.keys(en).length) shards.en = en;
    if (Object.keys(eq).length) shards.eq = eq;
    if (Object.keys(ex).length) {
      const entries = Object.entries(ex);
      const chunkSize = 320;
      for (let i = 0; i < entries.length; i += chunkSize) {
        const chunk = Object.fromEntries(entries.slice(i, i + chunkSize));
        shards[`ex${Math.floor(i / chunkSize)}`] = chunk;
      }
    }
  }

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const meta = {};
  for (const [bucket, data] of Object.entries(shards)) {
    const key = bucket.startsWith("ex") || bucket === "en" || bucket === "eq" ? `r:${bucket}` : `r:${bucket}`;
    const file = path.join(OUT_DIR, `${key.replace(":", "-")}.json`);
    fs.writeFileSync(file, JSON.stringify(data), "utf8");
    meta[key] = { file: path.relative(ROOT, file), entries: Object.keys(data).length };
  }

  console.log(JSON.stringify({ totalRedirects: exact.size, shards: meta }, null, 2));
}

main();
