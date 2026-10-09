#!/usr/bin/env node
/**
 * Provisioning préprod Supabase (création projet + migrations + functions).
 * Nécessite compte Supabase : https://supabase.com/dashboard/account/tokens
 *
 * Usage :
 *   set SUPABASE_ACCESS_TOKEN=sbp_...
 *   set SUPABASE_ORG_ID=...          (dashboard org settings)
 *   set MARKETPLACE_PREPROD_SETUP_CONFIRM=create-preprod-redkmotors
 *   node scripts/marketplace-setup-preprod.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const marketplaceDir = path.join(repoRoot, "marketplace");
const PROJECT_NAME = "redk-motors-marketplace-preprod";
const REGION = process.env.SUPABASE_REGION || "eu-west-1";

function req(name) {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Variable manquante : ${name}`);
  return v;
}

async function api(method, urlPath, body) {
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
    throw new Error(`API ${urlPath} → ${res.status}: ${typeof json === "object" ? JSON.stringify(json) : text}`);
  }
  return json;
}

function run(cmd, cwd = marketplaceDir) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit", env: process.env });
}

async function main() {
  console.log("Marketplace — setup préprod Supabase\n");

  if (process.env.MARKETPLACE_PREPROD_SETUP_CONFIRM !== "create-preprod-redkmotors") {
    console.error(
      "Refus : définir MARKETPLACE_PREPROD_SETUP_CONFIRM=create-preprod-redkmotors pour créer un projet cloud.",
    );
    process.exit(2);
  }

  const orgId = req("SUPABASE_ORG_ID");
  let projectRef = process.env.MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF?.trim();

  if (!projectRef) {
    console.log(`Création projet « ${PROJECT_NAME} » (org ${orgId}, ${REGION})…`);
    const created = await api("POST", "/projects", {
      organization_id: orgId,
      name: PROJECT_NAME,
      region: REGION,
      db_pass: process.env.SUPABASE_DB_PASSWORD || undefined,
    });
    projectRef = created.ref ?? created.id;
    if (!projectRef) throw new Error("Réponse création projet sans ref");
    console.log(`Projet créé : ref=${projectRef}`);
    console.log("Attente initialisation (~2 min)…");
    await new Promise((r) => setTimeout(r, 120_000));
  } else {
    console.log(`Réutilisation projet existant ref=${projectRef}`);
  }

  const keys = await api("GET", `/projects/${projectRef}/api-keys`);
  const anon = keys.find((k) => k.name === "anon" || k.api_key?.includes("anon"))?.api_key
    ?? keys.find((k) => k.name === "anon")?.api_key;
  const service = keys.find((k) => k.name === "service_role")?.api_key;
  const url = `https://${projectRef}.supabase.co`;

  const envLines = [
    `# Généré ${new Date().toISOString()} — NE PAS COMMITTER`,
    `MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF=${projectRef}`,
    `MARKETPLACE_PREPROD_SUPABASE_URL=${url}`,
    `MARKETPLACE_PREPROD_ANON_KEY=${anon ?? ""}`,
    `SUPABASE_SERVICE_ROLE_KEY=${service ?? ""}`,
    "",
  ];
  const outPath = path.join(repoRoot, ".env.preprod.local");
  fs.writeFileSync(outPath, envLines.join("\n"), "utf8");
  console.log(`\nÉcrit ${outPath} (gitignore).`);

  process.env.MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF = projectRef;
  process.env.MARKETPLACE_REMOTE_DEPLOY_CONFIRM = "preprod-redkmotors-deploy";
  process.env.MARKETPLACE_PREPROD_SUPABASE_URL = url;

  run(`npx supabase link --project-ref ${projectRef}`);
  run("npx supabase db push --linked");

  const functions = [
    "process-listing-photo",
    "serve-listing-photo",
    "moderate-listing",
    "admin-export",
    "bootstrap-admin",
  ];
  for (const fn of functions) {
    run(`npx supabase functions deploy ${fn} --project-ref ${projectRef}`);
  }

  console.log(`
=== Prochaines étapes (manuel) ===
1. Dashboard Supabase → Auth → URL : Site https://preprod.redkmotors.fr/ (quand DNS prêt)
2. SMTP test pour emails Auth
3. Secrets GitHub (voir docs/marketplace/SECRETS_AND_CI.md)
4. bootstrap-admin : docs/marketplace/ADMIN_BOOTSTRAP.md
5. Cloudflare Pages + Access : docs/marketplace/PREPROD_PLAN.md
6. Smoke : charger .env.preprod.local puis npm run test:marketplace:preprod

Projet : ${url}
`);
}

main().catch((e) => {
  console.error("Échec :", e.message);
  process.exit(1);
});
