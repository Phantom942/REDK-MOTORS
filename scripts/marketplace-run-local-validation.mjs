#!/usr/bin/env node
/**
 * Orchestrateur validation locale — base vierge → migrations → seed → functions → tests.
 */
import { execSync, spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { marketplaceDir, repoRoot } from "./lib/marketplace-local-env.mjs";
import { isLocalSupabaseUrl } from "./lib/marketplace-local-guard.mjs";

const FUNCTIONS_LOG = path.join(repoRoot, ".marketplace-functions-serve.log");

function step(name, fn) {
  console.log(`\n▶ ${name}`);
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (e) {
    console.error(`✗ ${name} — ${e.message}`);
    process.exit(typeof e.code === "number" ? e.code : 1);
  }
}

function checkDocker() {
  const paths = [
    process.env.DOCKER_EXE,
    "docker",
    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe",
  ].filter(Boolean);
  for (const p of paths) {
    const r = spawnSync(p, ["info"], { encoding: "utf8", shell: true });
    if (r.status === 0) return p;
  }
  throw new Error("Docker inaccessible — démarrer Docker Desktop");
}

function parseEnv(text) {
  const env = { ...process.env };
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) {
      const val = m[2].replace(/^"|"$/g, "");
      env[m[1]] = val;
      if (m[1] === "API_URL") env.MARKETPLACE_TEST_URL = val;
      if (m[1] === "ANON_KEY") env.MARKETPLACE_TEST_ANON_KEY = val;
      if (m[1] === "SERVICE_ROLE_KEY") env.MARKETPLACE_TEST_SERVICE_ROLE_KEY = val;
    }
  }
  env.MARKETPLACE_TEST_USER_A_EMAIL = env.MARKETPLACE_TEST_USER_A_EMAIL || "mp-vendeur-a@test.local";
  env.MARKETPLACE_TEST_USER_A_PASSWORD = env.MARKETPLACE_TEST_USER_A_PASSWORD || "TestMarketplace-Local-2026!";
  env.MARKETPLACE_TEST_USER_B_EMAIL = env.MARKETPLACE_TEST_USER_B_EMAIL || "mp-vendeur-b@test.local";
  env.MARKETPLACE_TEST_USER_B_PASSWORD = env.MARKETPLACE_TEST_USER_B_PASSWORD || "TestMarketplace-Local-2026!";
  env.MARKETPLACE_TEST_MOD_EMAIL = env.MARKETPLACE_TEST_MOD_EMAIL || "mp-moderateur@test.local";
  env.MARKETPLACE_TEST_MOD_PASSWORD = env.MARKETPLACE_TEST_USER_A_PASSWORD;
  env.MARKETPLACE_TEST_ADMIN_EMAIL = env.MARKETPLACE_TEST_ADMIN_EMAIL || "mp-admin@test.local";
  env.MARKETPLACE_TEST_ADMIN_PASSWORD = env.MARKETPLACE_TEST_USER_A_PASSWORD;
  env.MARKETPLACE_TEST_STAFF_EMAIL = env.MARKETPLACE_TEST_STAFF_EMAIL || "mp-staff@test.local";
  env.MARKETPLACE_TEST_STAFF_PASSWORD = env.MARKETPLACE_TEST_USER_A_PASSWORD;
  return env;
}

async function waitForFunctions(baseUrl, timeoutMs = 120000) {
  await new Promise((r) => setTimeout(r, 5000));
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(`${baseUrl}/functions/v1/process-listing-photo`, { method: "POST" });
      if (r.status === 401 || r.status === 400 || r.status === 405) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("Edge functions non joignables — voir " + FUNCTIONS_LOG);
}

function startFunctionsServe() {
  const envFile = path.join(marketplaceDir, ".env.local");
  if (!fs.existsSync(envFile)) {
    throw new Error("marketplace/.env.local manquant pour functions serve");
  }
  fs.writeFileSync(FUNCTIONS_LOG, "--- functions serve ---\n");
  if (process.platform === "win32") {
    spawnSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        `Start-Process -WindowStyle Hidden -FilePath npx -ArgumentList 'supabase','functions','serve','--env-file','.env.local' -WorkingDirectory '${marketplaceDir.replace(/'/g, "''")}' -RedirectStandardOutput '${FUNCTIONS_LOG.replace(/'/g, "''")}' -RedirectStandardError '${FUNCTIONS_LOG.replace(/'/g, "''")}'`,
      ],
      { stdio: "ignore" },
    );
  } else {
    const out = fs.openSync(FUNCTIONS_LOG, "a");
    const child = spawn("npx", ["supabase", "functions", "serve", "--env-file", ".env.local"], {
      cwd: marketplaceDir,
      detached: true,
      stdio: ["ignore", out, out],
    });
    child.unref();
  }
}

function runNode(script, env) {
  execSync(`node scripts/${script}`, { cwd: repoRoot, stdio: "inherit", env });
}

async function main() {
  console.log("=== Validation marketplace locale (parcours complet) ===\n");

  step("Docker", () => {
    const via = checkDocker();
    console.log(`  moteur OK (${via})`);
  });

  step("Supabase start", () => {
    execSync("npx supabase start", { cwd: marketplaceDir, stdio: "inherit" });
  });

  const status = execSync("npx supabase status -o env", { cwd: marketplaceDir, encoding: "utf8" });
  const apiUrl = status.match(/^API_URL=(.*)$/m)?.[1]?.replace(/"/g, "");
  if (!isLocalSupabaseUrl(apiUrl)) {
    throw new Error(`Refus reset : API_URL non locale (${apiUrl})`);
  }
  const testEnv = parseEnv(status);

  step("Reset DB (garde localhost)", () => {
    execSync("node scripts/marketplace-local-reset.mjs", {
      cwd: repoRoot,
      stdio: "inherit",
      env: { ...testEnv, MARKETPLACE_ALLOW_DB_RESET: "1" },
    });
  });

  step("Seed comptes", () => {
    execSync("node scripts/marketplace-local-seed.mjs", { cwd: repoRoot, stdio: "inherit", env: testEnv });
  });

  step("Edge functions serve", () => {
    fs.writeFileSync(FUNCTIONS_LOG, "--- functions serve ---\n");
    startFunctionsServe();
  });

  await stepAsync("Attente functions", () => waitForFunctions(testEnv.MARKETPLACE_TEST_URL));

  step("Tests sécurité (statique + live privacy)", () => {
    runNode("marketplace-security-test.mjs", testEnv);
  });

  step("Tests RLS live", () => {
    runNode("marketplace-security-live.mjs", testEnv);
  });

  step("E2E cœur", () => {
    runNode("marketplace-e2e.mjs", testEnv);
  });

  step("E2E étendu", () => {
    runNode("marketplace-e2e-extended.mjs", testEnv);
  });

  step("E2E admin / staff", () => {
    runNode("marketplace-e2e-admin.mjs", testEnv);
  });

  console.log("\n=== Validation locale terminée avec succès ===");
  console.log(`Log functions : ${FUNCTIONS_LOG}`);
}

async function stepAsync(name, fn) {
  console.log(`\n▶ ${name}`);
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (e) {
    console.error(`✗ ${name} — ${e.message}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
