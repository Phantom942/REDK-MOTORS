#!/usr/bin/env node
/**
 * Orchestrateur validation locale — refuse toute cible non localhost.
 */
import { execSync, spawnSync } from "node:child_process";
import { marketplaceDir } from "./lib/marketplace-local-env.mjs";
import { isLocalSupabaseUrl } from "./lib/marketplace-local-guard.mjs";

function checkDocker() {
  const paths = [
    process.env.DOCKER_EXE,
    "docker",
    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe",
  ].filter(Boolean);
  for (const p of paths) {
    const r = spawnSync(p, ["info"], { encoding: "utf8", shell: true });
    if (r.status === 0) return { ok: true, via: p };
  }
  return { ok: false };
}

function main() {
  console.log("=== Validation marketplace locale ===\n");
  console.log("Environnement agent : Windows PowerShell (répertoire projet).\n");

  const docker = checkDocker();
  if (!docker.ok) {
    console.log("BLOQUÉ — moteur Docker inaccessible depuis cet environnement.");
    console.log("Vérification chez vous (PowerShell) :");
    console.log('  & "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" info');
    console.log("Si « not found » : installer Docker Desktop, redémarrer, intégration WSL2 si proposée.");
    console.log("WSL : aucune distribution installée sur cette machine (wsl -e sh échoue).\n");
    process.exit(4);
  }
  console.log(`Docker OK (${docker.via})\n`);

  console.log("Démarrage Supabase local…");
  execSync("npx supabase start", { cwd: marketplaceDir, stdio: "inherit" });

  const status = execSync("npx supabase status -o env", { cwd: marketplaceDir, encoding: "utf8" });
  const apiLine = status.split("\n").find((l) => l.startsWith("API_URL="));
  const apiUrl = apiLine?.split("=")[1]?.replace(/"/g, "");
  if (!isLocalSupabaseUrl(apiUrl)) {
    console.error(`Refus : API_URL non locale (${apiUrl})`);
    process.exit(2);
  }

  console.log("\nReset DB (local confirmé)…");
  process.env.MARKETPLACE_ALLOW_DB_RESET = "1";
  execSync("node scripts/marketplace-local-reset.mjs", { stdio: "inherit", cwd: process.cwd() });

  console.log("\nSeed comptes test…");
  execSync("node scripts/marketplace-local-seed.mjs", { stdio: "inherit" });

  console.log("\nTests RLS rapides…");
  execSync("node scripts/marketplace-security-live.mjs", {
    stdio: "inherit",
    env: { ...process.env, ...parseEnv(status) },
  });

  console.log("\n⚠ Edge functions : dans un 2e terminal, exécuter depuis marketplace/ :");
  console.log("  npx supabase functions serve --env-file .env.local\n");
  console.log("Puis : npm run test:marketplace:e2e\n");
  console.log("(L’orchestrateur ne lance pas functions serve en arrière-plan pour éviter les états flous.)");
}

function parseEnv(text) {
  const env = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) {
      env[m[1]] = m[2].replace(/^"|"$/g, "");
      if (m[1] === "API_URL") env.MARKETPLACE_TEST_URL = env[m[1]];
      if (m[1] === "ANON_KEY") env.MARKETPLACE_TEST_ANON_KEY = env[m[1]];
      if (m[1] === "SERVICE_ROLE_KEY") env.MARKETPLACE_TEST_SERVICE_ROLE_KEY = env[m[1]];
    }
  }
  return env;
}

main();
