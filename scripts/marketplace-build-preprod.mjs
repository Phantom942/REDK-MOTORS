#!/usr/bin/env node
/**
 * Build Eleventy avec marketplace activé (préprod ou prod explicite).
 * Refuse sans MARKETPLACE_BUILD_ENABLE=1 et URL Supabase non locale.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { isLocalSupabaseUrl } from "./lib/marketplace-local-guard.mjs";
import { parseSupabaseProjectRef } from "./lib/marketplace-preprod-guard.mjs";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const target = process.env.MARKETPLACE_BUILD_TARGET || "preprod";
if (process.env.MARKETPLACE_BUILD_ENABLE !== "1") {
  console.error("Refus : MARKETPLACE_BUILD_ENABLE=1 requis.");
  process.exit(2);
}

const url = process.env.MARKETPLACE_SUPABASE_URL?.replace(/\/$/, "");
const anon = process.env.MARKETPLACE_SUPABASE_ANON_KEY;
if (!url || !anon) {
  console.error("Refus : MARKETPLACE_SUPABASE_URL et MARKETPLACE_SUPABASE_ANON_KEY requis.");
  process.exit(2);
}
if (isLocalSupabaseUrl(url)) {
  console.error("Refus : utiliser dev:marketplace-local pour localhost.");
  process.exit(2);
}

const allowedRef = process.env.MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF?.trim();
const ref = parseSupabaseProjectRef(url);
if (target === "preprod" && allowedRef && ref !== allowedRef) {
  console.error(`Refus : ref URL ${ref} ≠ MARKETPLACE_PREPROD_ALLOWED_PROJECT_REF.`);
  process.exit(2);
}

console.log(`Build marketplace — cible ${target}, Supabase ${ref ?? url}`);

const r = spawnSync("npm", ["run", "build"], {
  cwd: repoRoot,
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    MARKETPLACE_BUILD_TARGET: target,
    MARKETPLACE_BUILD_ENABLE: "1",
    MARKETPLACE_SUPABASE_URL: url,
    MARKETPLACE_SUPABASE_ANON_KEY: anon,
  },
});
process.exit(r.status ?? 1);
