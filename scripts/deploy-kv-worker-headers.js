#!/usr/bin/env node
/**
 * Déploie workers/redkmotors-fr-redirect-kv.js (redirects KV + headers _headers).
 * Utilise CLOUDFLARE_API_TOKEN ou la connexion wrangler OAuth locale.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ACCOUNT_ID = "82e31c401bb561864cba4a522774e8b8";
const SCRIPT_NAME = "redkmotors-fr-redirect";
const WORKER = path.join(ROOT, "workers", "redkmotors-fr-redirect-kv.js");

const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) {
  console.error("CLOUDFLARE_API_TOKEN manquant — wrangler login ou secret GitHub");
  process.exit(1);
}

const script = fs.readFileSync(WORKER, "utf8");
const boundary = `----deploy${Date.now()}`;
const metadata = JSON.stringify({
  main_module: "worker.js",
  compatibility_date: "2026-07-01",
  bindings: [
    {
      type: "kv_namespace",
      name: "REDIRECTS",
      namespace_id: "5d9807d363a24a089326f8d24f4f340c",
    },
  ],
});

const body = [
  `--${boundary}`,
  'Content-Disposition: form-data; name="metadata"',
  "Content-Type: application/json",
  "",
  metadata,
  `--${boundary}`,
  'Content-Disposition: form-data; name="worker.js"; filename="worker.js"',
  "Content-Type: application/javascript+module",
  "",
  script,
  `--${boundary}--`,
].join("\r\n");

async function main() {
  const putRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${SCRIPT_NAME}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body,
    },
  );
  const putJson = await putRes.json();
  if (!putJson.success) {
    console.error("Deploy failed:", putJson.errors);
    process.exit(1);
  }
  console.log("Worker deployed:", SCRIPT_NAME, "(redirects KV + response headers)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
