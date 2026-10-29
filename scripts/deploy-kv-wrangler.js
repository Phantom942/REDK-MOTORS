#!/usr/bin/env node
/**
 * Génère les shards KV, les pousse via Wrangler OAuth (sans CLOUDFLARE_API_TOKEN), puis déploie le Worker.
 *
 * Prérequis : `npx wrangler login` (compte avec accès KV + Workers).
 *
 * Usage:
 *   node scripts/deploy-kv-wrangler.js
 *   node scripts/deploy-kv-wrangler.js --skip-deploy   # upload KV seulement
 *   node scripts/deploy-kv-wrangler.js --dry-run
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { fileToKey } = require("./lib/kv-shards-ops.js");

const ROOT = path.join(__dirname, "..");
const SHARDS_DIR = path.join(ROOT, "workers", "kv-shards");
const WORKERS_DIR = path.join(ROOT, "workers");
const NAMESPACE_ID = "5d9807d363a24a089326f8d24f4f340c";

const args = process.argv.slice(2);
const SKIP_DEPLOY = args.includes("--skip-deploy");
const DRY_RUN = args.includes("--dry-run");

function run(cmd, cmdArgs, opts = {}) {
  const cwd = opts.cwd || ROOT;
  if (DRY_RUN) {
    console.log(`[dry-run] ${cmd} ${cmdArgs.join(" ")} (cwd=${cwd})`);
    return { status: 0 };
  }
  const r = spawnSync(cmd, cmdArgs, { cwd, stdio: "inherit", shell: process.platform === "win32" });
  if (r.error) throw r.error;
  return r;
}

function main() {
  console.log("deploy-kv-wrangler: génération des shards…");
  const gen = run(process.execPath, [path.join(__dirname, "generate-kv-redirect-shards.js")]);
  if (gen.status !== 0) process.exit(gen.status || 1);

  if (!fs.existsSync(SHARDS_DIR)) {
    console.error("workers/kv-shards/ absent après génération");
    process.exit(1);
  }

  const files = fs.readdirSync(SHARDS_DIR).filter((f) => f.endsWith(".json")).sort();
  if (files.length === 0) {
    console.error("Aucun shard JSON dans workers/kv-shards/");
    process.exit(1);
  }

  console.log(`deploy-kv-wrangler: upload ${files.length} clés KV (--remote)…`);
  for (const file of files) {
    const key = fileToKey(file);
    const filePath = path.join(SHARDS_DIR, file);
    const wranglerArgs = [
      "wrangler",
      "kv",
      "key",
      "put",
      key,
      `--namespace-id=${NAMESPACE_ID}`,
      `--path=${filePath}`,
      "--remote",
    ];
    const up = run("npx", wranglerArgs, { cwd: ROOT });
    if (up.status !== 0) {
      console.error(`Échec upload ${key}`);
      process.exit(up.status || 1);
    }
  }

  if (SKIP_DEPLOY) {
    console.log("deploy-kv-wrangler: terminé (upload seulement).");
    return;
  }

  console.log("deploy-kv-wrangler: déploiement Worker redkmotors-fr-redirect…");
  const dep = run("npx", ["wrangler", "deploy"], { cwd: WORKERS_DIR });
  if (dep.status !== 0) process.exit(dep.status || 1);

  console.log("deploy-kv-wrangler: OK — lancer npm run verify:blog-redirects:prod:all --strict si besoin.");
}

main();
