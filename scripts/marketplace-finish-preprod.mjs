#!/usr/bin/env node
/**
 * Finalise préprod Supabase : Auth URLs, secrets Edge, comptes recette, bootstrap admin.
 * Lit .env.preprod.local + token .supabase-setup.local (ou SUPABASE_ACCESS_TOKEN).
 */
import crypto from "node:crypto";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyEnv, loadDotenvFile } from "./lib/load-dotenv-file.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const marketplaceDir = path.join(repoRoot, "marketplace");
const SITE_URL = "https://preprod.redkmotors.fr/";
const REDIRECTS = [
  "https://preprod.redkmotors.fr/**",
  "http://localhost:8080/**",
  "http://localhost:8081/**",
  "http://localhost:8083/**",
];

function req(name) {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Variable manquante : ${name}`);
  return v;
}

async function mgmt(method, urlPath, body) {
  const token = req("SUPABASE_ACCESS_TOKEN");
  const res = await fetch(`https://api.supabase.com/v1${urlPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  if (!res.ok) {
    throw new Error(`Mgmt ${urlPath} → ${res.status}: ${typeof json === "object" ? JSON.stringify(json) : text}`);
  }
  return json;
}

function appendEnvLines(filePath, lines) {
  const block = `\n# Ajouté finish-preprod ${new Date().toISOString()}\n${lines.join("\n")}\n`;
  fs.appendFileSync(filePath, block, "utf8");
}

function run(cmd, cwd = repoRoot) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit", env: process.env });
}

async function main() {
  if (process.env.MARKETPLACE_PREPROD_FINISH_CONFIRM !== "finish-preprod-redkmotors") {
    console.error("Refus : MARKETPLACE_PREPROD_FINISH_CONFIRM=finish-preprod-redkmotors");
    process.exit(2);
  }

  const envPath = path.join(repoRoot, ".env.preprod.local");
  applyEnv(loadDotenvFile(envPath));
  const tokenFile = path.join(repoRoot, ".supabase-setup.local");
  if (!process.env.SUPABASE_ACCESS_TOKEN && fs.existsSync(tokenFile)) {
    process.env.SUPABASE_ACCESS_TOKEN = fs.readFileSync(tokenFile, "utf8").trim();
  }

  const projectRef = req("MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF");
  const baseUrl = req("MARKETPLACE_PREPROD_SUPABASE_URL").replace(/\/$/, "");
  req("MARKETPLACE_PREPROD_ANON_KEY");
  req("SUPABASE_SERVICE_ROLE_KEY");

  console.log("1/5 Auth URLs (Management API)…");
  try {
    await mgmt("PATCH", `/projects/${projectRef}/config/auth`, {
      site_url: SITE_URL,
      uri_allow_list: REDIRECTS.join(","),
    });
    console.log("   OK site_url + redirect URLs");
  } catch (e) {
    console.warn("   Auth config:", e.message);
    console.warn("   → À faire à la main : Dashboard → Auth → URL Configuration");
  }

  let testPassword = process.env.MARKETPLACE_PREPROD_TEST_PASSWORD?.trim();
  if (!testPassword) {
    testPassword = `Preprod-Redk-${crypto.randomBytes(9).toString("base64url")}`;
    appendEnvLines(envPath, [
      "MARKETPLACE_PREPROD_TEST_PASSWORD=" + testPassword,
      "MARKETPLACE_PREPROD_TEST_VENDOR_EMAIL=mp-vendeur-a@recette.redkmotors.fr",
      "MARKETPLACE_PREPROD_TEST_MODERATOR_EMAIL=mp-moderateur@recette.redkmotors.fr",
    ]);
    applyEnv(loadDotenvFile(envPath));
    console.log("   Mot de passe recette généré → .env.preprod.local");
  }

  let bootstrapSecret = process.env.MARKETPLACE_ADMIN_BOOTSTRAP_SECRET?.trim();
  if (!bootstrapSecret) {
    bootstrapSecret = crypto.randomBytes(32).toString("base64url");
    appendEnvLines(envPath, [
      "# Secret bootstrap admin (rotation après usage recommandée)",
      "MARKETPLACE_ADMIN_BOOTSTRAP_SECRET=" + bootstrapSecret,
      "MARKETPLACE_BOOTSTRAP_ADMIN_EMAIL=mp-admin@recette.redkmotors.fr",
    ]);
  }

  console.log("2/5 Secrets Edge Functions…");
  const secretCmd =
    `npx supabase secrets set MARKETPLACE_ADMIN_BOOTSTRAP_SECRET=${bootstrapSecret} `
    + `MARKETPLACE_BOOTSTRAP_ADMIN_EMAIL=mp-admin@recette.redkmotors.fr `
    + `--project-ref ${projectRef}`;
  run(secretCmd, marketplaceDir);

  console.log("3/5 Comptes recette…");
  process.env.MARKETPLACE_PREPROD_ALLOW_RUN = "preprod-redkmotors-smoke";
  const seedOut = execSync("node scripts/marketplace-preprod-seed.mjs", {
    cwd: repoRoot,
    env: process.env,
    encoding: "utf8",
  });
  console.log(seedOut.trim());
  const adminLine = seedOut.trim().split("\n").pop();
  let adminUserId;
  try {
    adminUserId = JSON.parse(adminLine).adminUserId;
  } catch {
    throw new Error("Impossible de lire adminUserId depuis le seed");
  }

  console.log("4/5 Bootstrap admin (une fois)…");
  const anonKey = req("MARKETPLACE_PREPROD_ANON_KEY");
  const bootRes = await fetch(`${baseUrl}/functions/v1/bootstrap-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Bootstrap-Secret": bootstrapSecret,
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ userId: adminUserId }),
  });
  const bootBody = await bootRes.json().catch(() => ({}));
  if (!bootRes.ok && bootBody.error !== "admin_already_exists" && bootBody.error !== "bootstrap_disabled") {
    console.warn("   bootstrap function:", bootRes.status, JSON.stringify(bootBody));
    console.log("   fallback REST service_role…");
    const serviceKey = req("SUPABASE_SERVICE_ROLE_KEY");
    for (const role of ["admin", "moderator"]) {
      const r = await fetch(`${baseUrl}/rest/v1/user_roles`, {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ user_id: adminUserId, role, granted_by: adminUserId }),
      });
      if (!r.ok && r.status !== 409) throw new Error(await r.text());
    }
    console.log("   admin via REST OK");
  } else {
    console.log("   bootstrap:", bootBody.ok ? "OK" : bootBody.error ?? bootRes.status);
  }

  console.log("5/5 Build préprod local (vérif)…");
  process.env.MARKETPLACE_BUILD_TARGET = "preprod";
  process.env.MARKETPLACE_BUILD_ENABLE = "1";
  process.env.MARKETPLACE_SUPABASE_URL = baseUrl;
  process.env.MARKETPLACE_SUPABASE_ANON_KEY = process.env.MARKETPLACE_PREPROD_ANON_KEY;
  run("node scripts/marketplace-build-preprod.mjs", repoRoot);

  console.log(`
=== Préprod Supabase : terminé côté backend ===
Projet : ${baseUrl}
Site cible : ${SITE_URL}
Comptes : mp-*@recette.redkmotors.fr (mot de passe dans .env.preprod.local)

Reste manuel :
- GitHub : gh auth login puis npm run github:secrets-preprod
- Cloudflare Pages + DNS preprod.redkmotors.fr + Access (voir PREPROD_PLAN.md)
`);
}

main().catch((e) => {
  console.error("Échec :", e.message);
  process.exit(1);
});
