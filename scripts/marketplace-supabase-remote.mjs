#!/usr/bin/env node
/**
 * Déploiement Supabase DISTANT (migrations + Edge Functions).
 * Refuse localhost et refuse si ref ≠ MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF.
 * Ne crée pas de projet — link + push + deploy uniquement.
 *
 * Usage (préprod, depuis la racine du repo) :
 *   MARKETPLACE_REMOTE_DEPLOY_CONFIRM=preprod-redkmotors-deploy
 *   MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF=xxxxxxxx
 *   SUPABASE_ACCESS_TOKEN=...
 *   npm run marketplace:supabase:push:preprod
 *   npm run marketplace:supabase:functions:preprod
 */
import { execSync } from "node:child_process";
import { parseSupabaseProjectRef } from "./lib/marketplace-preprod-guard.mjs";
import { isLocalSupabaseUrl } from "./lib/marketplace-local-guard.mjs";
import { marketplaceDir } from "./lib/marketplace-local-env.mjs";

const FUNCTIONS = [
  "process-listing-photo",
  "serve-listing-photo",
  "moderate-listing",
  "admin-export",
  "bootstrap-admin",
];

function assertDeployAllowed() {
  if (process.env.MARKETPLACE_REMOTE_DEPLOY_CONFIRM !== "preprod-redkmotors-deploy") {
    throw new Error(
      "Refus : définir MARKETPLACE_REMOTE_DEPLOY_CONFIRM=preprod-redkmotors-deploy",
    );
  }
  const allowedRef = process.env.MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF?.trim();
  if (!allowedRef) {
    throw new Error("Refus : MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF requis.");
  }
  const prodRef = process.env.MARKETPLACE_PRODUCTION_SUPABASE_PROJECT_REF?.trim();
  if (prodRef && prodRef === allowedRef) {
    throw new Error("Refus : ref préprod = ref production déclarée.");
  }
  const linkedUrl = process.env.MARKETPLACE_PREPROD_SUPABASE_URL?.replace(/\/$/, "");
  if (linkedUrl) {
    if (isLocalSupabaseUrl(linkedUrl)) {
      throw new Error("Refus : MARKETPLACE_PREPROD_SUPABASE_URL ne doit pas être locale.");
    }
    const ref = parseSupabaseProjectRef(linkedUrl);
    if (ref !== allowedRef) {
      throw new Error(`Refus : URL Supabase ref ${ref} ≠ autorisée ${allowedRef}.`);
    }
  }
  if (!process.env.SUPABASE_ACCESS_TOKEN) {
    throw new Error("Refus : SUPABASE_ACCESS_TOKEN requis pour supabase link/deploy.");
  }
  return allowedRef;
}

function run(cmd, cwd = marketplaceDir) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit", env: process.env });
}

const mode = process.argv[2] || "help";

try {
  const projectRef = assertDeployAllowed();

  if (mode === "link") {
    run(`npx supabase link --project-ref ${projectRef}`);
    process.exit(0);
  }

  if (mode === "push") {
    run(`npx supabase db push --linked`);
    process.exit(0);
  }

  if (mode === "functions") {
    for (const fn of FUNCTIONS) {
      run(`npx supabase functions deploy ${fn} --project-ref ${projectRef}`);
    }
    process.exit(0);
  }

  if (mode === "all") {
    run(`npx supabase link --project-ref ${projectRef}`);
    run(`npx supabase db push --linked`);
    for (const fn of FUNCTIONS) {
      run(`npx supabase functions deploy ${fn} --project-ref ${projectRef}`);
    }
    process.exit(0);
  }

  console.log(`Usage: node scripts/marketplace-supabase-remote.mjs <link|push|functions|all>

Prérequis env :
  MARKETPLACE_REMOTE_DEPLOY_CONFIRM=preprod-redkmotors-deploy
  MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF=<ref>
  SUPABASE_ACCESS_TOKEN=<token>
  MARKETPLACE_PREPROD_SUPABASE_URL (optionnel, vérif ref)
  MARKETPLACE_PRODUCTION_SUPABASE_PROJECT_REF (garde-fou)`);
  process.exit(mode === "help" ? 0 : 1);
} catch (e) {
  console.error("NON EXÉCUTÉ :", e.message);
  process.exit(2);
}
