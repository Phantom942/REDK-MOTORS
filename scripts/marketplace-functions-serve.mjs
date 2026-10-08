#!/usr/bin/env node
/**
 * Démarre supabase functions serve — une instance, log horodaté, arrêt propre.
 * Usage : node scripts/marketplace-functions-serve.mjs start|stop|status
 */
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { marketplaceDir, repoRoot } from "./lib/marketplace-local-env.mjs";

const LOCK = path.join(repoRoot, ".marketplace-functions-serve.lock.json");
const LOG_DIR = path.join(repoRoot, ".logs");

function readLock() {
  try {
    return JSON.parse(fs.readFileSync(LOCK, "utf8"));
  } catch {
    return null;
  }
}

function writeLock(data) {
  fs.writeFileSync(LOCK, JSON.stringify(data, null, 2));
}

function clearLock() {
  try {
    fs.unlinkSync(LOCK);
  } catch {
    /* absent */
  }
}

function isAlive(pid) {
  if (!pid || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function stopExisting(reason = "restart") {
  const lock = readLock();
  if (!lock?.pid) return;
  if (!isAlive(lock.pid)) {
    clearLock();
    return;
  }
  console.log(`Arrêt functions serve (pid ${lock.pid}, raison: ${reason})…`);
  try {
    if (process.platform === "win32") {
      spawnSync("taskkill", ["/PID", String(lock.pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      process.kill(lock.pid, "SIGTERM");
    }
  } catch {
    /* déjà mort */
  }
  clearLock();
}

function start() {
  const envFile = path.join(marketplaceDir, ".env.local");
  if (!fs.existsSync(envFile)) {
    console.error("marketplace/.env.local requis");
    process.exit(1);
  }

  stopExisting("nouveau start");

  fs.mkdirSync(LOG_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const logPath = path.join(LOG_DIR, `marketplace-functions-serve-${stamp}.log`);
  fs.appendFileSync(logPath, `--- start ${new Date().toISOString()} ---\n`);

  let pid;

  if (process.platform === "win32") {
    const wd = marketplaceDir.replace(/'/g, "''");
    const logEsc = logPath.replace(/'/g, "''");
    const ps = spawnSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        `$p = Start-Process -WindowStyle Hidden -PassThru -FilePath cmd.exe -ArgumentList '/c','npx supabase functions serve --env-file .env.local >> "${logEsc}" 2>&1' -WorkingDirectory '${wd}'; Write-Output $p.Id`,
      ],
      { encoding: "utf8" },
    );
    pid = Number(String(ps.stdout ?? "").trim().split("\n").pop());
    if (!pid) {
      console.error(ps.stderr || "Impossible de démarrer functions serve (Windows)");
      process.exit(1);
    }
  } else {
    const logFd = fs.openSync(logPath, "a");
    const child = spawn("npx", ["supabase", "functions", "serve", "--env-file", ".env.local"], {
      cwd: marketplaceDir,
      detached: true,
      stdio: ["ignore", logFd, logFd],
      shell: false,
    });
    child.unref();
    pid = child.pid;
    child.on("exit", (code, signal) => {
      const lock = readLock();
      if (lock?.pid !== child.pid) return;
      if (lock.intentionalStop) {
        console.log(`functions serve arrêté volontairement (code ${code ?? signal})`);
      } else {
        console.error(`functions serve terminé (code ${code ?? signal}) — voir ${logPath}`);
      }
      clearLock();
    });
  }

  writeLock({
    pid,
    startedAt: new Date().toISOString(),
    logPath,
    intentionalStop: false,
  });

  console.log(`functions serve démarré (pid ${pid})`);
  console.log(`Log : ${logPath}`);
}

function stop() {
  const lock = readLock();
  if (lock) {
    writeLock({ ...lock, intentionalStop: true });
  }
  stopExisting("stop explicite");
  console.log("functions serve arrêté.");
}

function status() {
  const lock = readLock();
  if (!lock) {
    console.log("Aucune instance enregistrée.");
    return;
  }
  const alive = isAlive(lock.pid);
  console.log(JSON.stringify({ ...lock, alive }, null, 2));
}

const cmd = process.argv[2] || "start";
if (cmd === "start") start();
else if (cmd === "stop") stop();
else if (cmd === "status") status();
else {
  console.error("Usage: marketplace-functions-serve.mjs start|stop|status");
  process.exit(1);
}
