#!/usr/bin/env node
/**
 * Déploie workers/redkmotors-fr-redirect.js via API Cloudflare.
 * Nécessite CLOUDFLARE_API_TOKEN avec Workers Scripts:Edit
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ACCOUNT_ID = "82e31c401bb561864cba4a522774e8b8";
const SCRIPT = "redkmotors-fr-redirect";
const WORKER = path.join(ROOT, "workers", "redkmotors-fr-redirect.js");

const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) {
  console.error("CLOUDFLARE_API_TOKEN manquant");
  process.exit(1);
}

const script = fs.readFileSync(WORKER, "utf8");
const boundary = `----deploy${Date.now()}`;
const metadata = JSON.stringify({
  main_module: "worker.js",
  compatibility_date: "2026-07-01",
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

const putRes = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${SCRIPT}`,
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
console.log("Worker deployed:", SCRIPT);

const routes = [
  { pattern: "redkmotors.fr/*", zone_name: "redkmotors.fr" },
  { pattern: "www.redkmotors.fr/*", zone_name: "redkmotors.fr" },
];

for (const route of routes) {
  const routeRes = await fetch(
    `https://api.cloudflare.com/client/v4/zones/e84e09190b11b35c49380a53b1a6e2aa/workers/routes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pattern: route.pattern, script: SCRIPT }),
    },
  );
  const routeJson = await routeRes.json();
  console.log("Route", route.pattern, routeJson.success ? "OK" : routeJson.errors);
}
