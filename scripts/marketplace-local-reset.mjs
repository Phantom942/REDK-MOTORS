#!/usr/bin/env node
/**
 * db reset UNIQUEMENT sur Supabase local (double garde).
 * Usage : MARKETPLACE_ALLOW_DB_RESET=1 node scripts/marketplace-local-reset.mjs
 */
import { execSync } from "node:child_process";
import { requireLocalEnv, marketplaceDir } from "./lib/marketplace-local-env.mjs";

if (process.env.MARKETPLACE_ALLOW_DB_RESET !== "1") {
  console.error("Refus : définir MARKETPLACE_ALLOW_DB_RESET=1 pour confirmer (base locale uniquement).");
  process.exit(2);
}

const { baseUrl } = requireLocalEnv();
console.log(`Reset migrations sur base locale : ${baseUrl}`);

execSync("npx supabase db reset", {
  cwd: marketplaceDir,
  stdio: "inherit",
});

console.log("Reset terminé.");
