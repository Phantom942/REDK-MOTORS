#!/usr/bin/env node
/** Inspecte l’état Docker Supabase local (OOMKilled, exit code) — diagnostic exit 137. */
import { spawnSync } from "node:child_process";

const container = "supabase_edge_runtime_redk-motors-marketplace";

function docker(args) {
  const r = spawnSync("docker", args, { encoding: "utf8", shell: true });
  return { status: r.status, stdout: (r.stdout ?? "").trim(), stderr: (r.stderr ?? "").trim() };
}

const exists = docker(["ps", "-a", "--filter", `name=${container}`, "--format", "{{.Names}}"]);
if (!exists.stdout.includes(container)) {
  console.log(`Conteneur ${container} : introuvable (Supabase arrêté ou reset en cours).`);
  process.exit(0);
}

const inspect = docker(["inspect", container, "--format", "{{json .State}}"]);

if (inspect.status !== 0) {
  console.log(`Conteneur ${container} : introuvable ou Docker arrêté.`);
  console.log(inspect.stderr || inspect.stdout);
  process.exit(0);
}

let state;
try {
  state = JSON.parse(inspect.stdout);
} catch {
  console.log("État conteneur (brut):", inspect.stdout);
  process.exit(0);
}

console.log("=== Diagnostic Edge Runtime local ===\n");
console.log(`Conteneur : ${container}`);
console.log(`Running   : ${state.Running}`);
console.log(`ExitCode  : ${state.ExitCode}`);
console.log(`OOMKilled : ${state.OOMKilled}`);
console.log(`Error     : ${state.Error || "—"}`);
console.log(`StartedAt : ${state.StartedAt}`);
console.log(`FinishedAt: ${state.FinishedAt}`);

if (state.OOMKilled === true) {
  console.log("\n→ Cause confirmée : OOMKilled (mémoire Docker insuffisante).");
} else if (state.ExitCode === 137) {
  console.log("\n→ Exit 137 sans OOMKilled : arrêt SIGKILL (hypothèse : conflit d’instances, redémarrage Docker, ou kill manuel).");
} else if (state.ExitCode !== 0 && !state.Running) {
  console.log(`\n→ Arrêt anormal (code ${state.ExitCode}) — voir logs Supabase / .logs/marketplace-functions-serve-*.log`);
}

const logs = docker(["logs", "--tail", "30", container]);
if (logs.stdout) {
  console.log("\n--- Dernières lignes docker logs ---\n");
  console.log(logs.stdout);
}
