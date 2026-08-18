#!/usr/bin/env node
/**
 * Vérifie les en-têtes HTTP en production (Cloudflare + Worker headers).
 * Usage: node scripts/verify-prod-headers.js [baseUrl]
 */
const https = require("https");

const BASE = process.argv[2] || "https://redkmotors.fr";
let failed = 0;

function head(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { method: "HEAD" }, (res) => {
        res.resume();
        resolve({ status: res.statusCode, headers: res.headers });
      })
      .on("error", reject);
  });
}

function check(label, cond, detail = "") {
  if (cond) console.log(`✓ ${label}${detail ? ` — ${detail}` : ""}`);
  else {
    console.error(`✗ ${label}${detail ? ` — ${detail}` : ""}`);
    failed += 1;
  }
}

async function main() {
  console.log(`=== Vérif prod ${BASE} ===\n`);

  const ai = await head(`${BASE}/ai.txt`);
  check("ai.txt 200", ai.status === 200, String(ai.status));
  check("ai.txt text/plain", (ai.headers["content-type"] || "").includes("text/plain"));
  check("ai.txt cache 86400", (ai.headers["cache-control"] || "").includes("86400"));

  const font = await head(`${BASE}/assets/fonts/manrope-latin-400-normal.woff2`);
  check("font 200", font.status === 200);
  check("font cache immutable", (font.headers["cache-control"] || "").includes("immutable"));

  const home = await head(`${BASE}/`);
  check("X-Content-Type-Options", home.headers["x-content-type-options"] === "nosniff");
  check("X-Frame-Options", home.headers["x-frame-options"] === "SAMEORIGIN");
  check("Referrer-Policy", Boolean(home.headers["referrer-policy"]));
  check("CF actif", Boolean(home.headers["cf-ray"]));

  const me = await head("https://redk-motors.me/contact/");
  check("redk-motors.me 301", me.status === 301);
  check("redirect .fr", (me.headers.location || "").startsWith("https://redkmotors.fr/"));

  console.log("");
  if (failed) {
    console.error(`${failed} échec(s) — déployer le Worker : npm run cf:deploy-headers`);
    process.exit(1);
  }
  console.log("Prod headers : OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
