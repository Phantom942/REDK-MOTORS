#!/usr/bin/env node
/**
 * Déploie _site sur Cloudflare Pages (Direct Upload) + domaine preprod.redkmotors.fr
 * Token : CLOUDFLARE_API_TOKEN env ou .cloudflare-setup.local (gitignore)
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDotenvFile } from "./lib/load-dotenv-file.mjs";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim() || "82e31c401bb561864cba4a522774e8b8";
const zoneId = process.env.CLOUDFLARE_ZONE_ID?.trim() || "e84e09190b11b35c49380a53b1a6e2aa";
const projectName = "redk-motors-marketplace-preprod";
const hostname = "preprod.redkmotors.fr";

function token() {
  const f = path.join(repoRoot, ".cloudflare-setup.local");
  if (!process.env.CLOUDFLARE_API_TOKEN && fs.existsSync(f)) {
    process.env.CLOUDFLARE_API_TOKEN = fs.readFileSync(f, "utf8").trim();
  }
  const t = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!t) throw new Error("CLOUDFLARE_API_TOKEN manquant — npm run store:cloudflare-token");
  return t;
}

async function cf(method, apiPath, body, query) {
  const q = query ? `?${new URLSearchParams(query)}` : "";
  const res = await fetch(`https://api.cloudflare.com/client/v4${apiPath}${q}`, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(`${method} ${apiPath}: ${JSON.stringify(json.errors ?? json)}`);
  }
  return json.result;
}

async function ensureProject() {
  const list = await cf("GET", `/accounts/${accountId}/pages/projects`);
  let p = list?.find((x) => x.name === projectName);
  if (!p) {
    p = await cf("POST", `/accounts/${accountId}/pages/projects`, {
      name: projectName,
      production_branch: "main",
    });
    console.log("Projet Pages créé:", p.subdomain);
  } else {
    console.log("Projet Pages existant:", p.subdomain);
  }
  return p;
}

async function deployDirectUpload() {
  const siteDir = path.join(repoRoot, "_site");
  if (!fs.existsSync(siteDir)) {
    throw new Error("_site absent — lancez npm run build:marketplace-preprod");
  }
  const form = new FormData();
  const manifest = {};
  const files = [];

  function walk(dir, prefix = "") {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const rel = prefix ? `${prefix}/${name}` : name;
      if (fs.statSync(full).isDirectory()) walk(full, rel);
      else files.push({ rel: rel.replace(/\\/g, "/"), full });
    }
  }
  walk(siteDir);

  for (const { rel, full } of files) {
    const buf = fs.readFileSync(full);
    manifest[`/${rel}`] = hashFile(buf);
    form.append(rel, new Blob([buf]), rel);
  }
  form.append("manifest", JSON.stringify(manifest));

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token()}` },
      body: form,
    },
  );
  const json = await res.json();
  if (!json.success) throw new Error(`deploy: ${JSON.stringify(json.errors)}`);
  console.log("Déploiement Pages:", json.result?.url ?? json.result?.id);
  return json.result;
}

function hashFile(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

async function ensureCustomDomain(pagesSubdomain) {
  try {
    await cf("POST", `/accounts/${accountId}/pages/projects/${projectName}/domains`, {
      name: hostname,
    });
    console.log("Domaine Pages ajouté:", hostname);
  } catch (e) {
    if (String(e.message).includes("already") || String(e.message).includes("1061")) {
      console.log("Domaine déjà configuré:", hostname);
    } else {
      console.warn("Domaine Pages:", e.message);
    }
  }

  const target = `${projectName}.pages.dev`;
  const records = await cf("GET", `/zones/${zoneId}/dns_records`, null, {
    type: "CNAME",
    name: hostname,
  });
  const hit = records?.find((r) => r.name === hostname || r.name === `${hostname}.`);
  if (!hit) {
    await cf("POST", `/zones/${zoneId}/dns_records`, {
      type: "CNAME",
      name: "preprod",
      content: target,
      proxied: true,
      ttl: 1,
    });
    console.log("DNS CNAME preprod →", target);
  } else {
    console.log("DNS CNAME existant:", hit.content);
  }
}

async function main() {
  if (process.env.CLOUDFLARE_PREPROD_DEPLOY_CONFIRM !== "deploy-preprod-redkmotors") {
    console.error("Refus : CLOUDFLARE_PREPROD_DEPLOY_CONFIRM=deploy-preprod-redkmotors");
    process.exit(2);
  }
  applyEnv(loadDotenvFile(path.join(repoRoot, ".env.preprod.local")));
  const project = await ensureProject();
  await deployDirectUpload();
  await ensureCustomDomain(project.subdomain);
  console.log(`\nSite cible (après propagation DNS): https://${hostname}/achat-revente/`);
}

function applyEnv(map) {
  for (const [k, v] of Object.entries(map)) {
    if (v) process.env[k] ??= v;
  }
}

main().catch((e) => {
  console.error("Échec:", e.message);
  process.exit(1);
});
