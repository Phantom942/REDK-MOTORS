#!/usr/bin/env node
/** Eleventy dev + overlay Supabase local (localhost uniquement). */
import { spawn, spawnSync } from "node:child_process";
import { loadSupabaseLocalEnv, repoRoot } from "./lib/marketplace-local-env.mjs";
import { assertLocalSupabaseUrl } from "./lib/marketplace-local-guard.mjs";

const loaded = loadSupabaseLocalEnv();
if (loaded.error || !loaded.url || !loaded.anonKey) {
  console.error("Supabase local requis : cd marketplace && npx supabase start");
  process.exit(1);
}
assertLocalSupabaseUrl(loaded.url, "dev marketplace");

const env = {
  ...process.env,
  MARKETPLACE_TEST_URL: loaded.url,
  MARKETPLACE_TEST_ANON_KEY: loaded.anonKey,
};

console.log("Eleventy + marketplace locale (enabled via src/_data/site.js si env présents)");
console.log(`  Supabase : ${loaded.url}`);

const bundle = spawnSync("node", ["scripts/bundle-marketplace.mjs"], { cwd: repoRoot, stdio: "inherit" });
if (bundle.status !== 0) process.exit(bundle.status ?? 1);

const child = spawn("npx", ["eleventy", "--serve"], { cwd: repoRoot, env, stdio: "inherit", shell: true });
child.on("exit", (code) => process.exit(code ?? 0));
