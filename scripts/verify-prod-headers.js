#!/usr/bin/env node
/**
 * Vérifie les en-têtes HTTP en production (Cloudflare Worker).
 * Usage: node scripts/verify-prod-headers.js [baseUrl]
 */
const https = require("https");

const BASE = process.argv[2] || "https://redkmotors.fr";
const BUST = `v=${Date.now()}`;
let failed = 0;

function head(urlStr) {
  const url = new URL(urlStr);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: url.hostname,
        path: `${url.pathname}${url.search}`,
        method: "HEAD",
        headers: { "Cache-Control": "no-cache" },
      },
      (res) => {
        res.resume();
        resolve({ status: res.statusCode, headers: res.headers });
      },
    );
    req.on("error", reject);
    req.end();
  });
}

function check(label, cond, detail = "") {
  if (cond) console.log(`✓ ${label}${detail ? ` — ${detail}` : ""}`);
  else {
    console.error(`✗ ${label}${detail ? ` — ${detail}` : ""}`);
    failed += 1;
  }
}

function hasSec(h) {
  return h["x-content-type-options"] === "nosniff" && h["referrer-policy"];
}

async function main() {
  console.log(`=== Vérif prod ${BASE} ===\n`);

  const home = await head(`${BASE}/?${BUST}`);
  check("home 200", home.status === 200);
  check("headers sécu home", hasSec(home.headers));
  check("CF actif", Boolean(home.headers["cf-ray"]));

  const ai = await head(`${BASE}/ai.txt?${BUST}`);
  check("ai.txt 200", ai.status === 200);
  check("ai.txt text/plain", (ai.headers["content-type"] || "").includes("text/plain"));
  check("ai.txt headers sécu", hasSec(ai.headers));
  check("ai.txt cache 86400", (ai.headers["cache-control"] || "").includes("86400"));

  const font = await head(`${BASE}/assets/fonts/manrope-latin-400-normal.woff2?${BUST}`);
  check("font 200", font.status === 200);
  check("font cache immutable", (font.headers["cache-control"] || "").includes("immutable"));
  check("font headers sécu", hasSec(font.headers));

  const me = await head("https://redk-motors.me/contact/");
  check("redk-motors.me 301", me.status === 301);
  check("redirect .fr", (me.headers.location || "").startsWith("https://redkmotors.fr/"));

  console.log("");
  if (failed) {
    console.error(`${failed} échec(s)`);
    process.exit(1);
  }
  console.log("Prod headers : OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
