#!/usr/bin/env node
/**
 * Backup / upload / restore des shards Cloudflare KV (redirections).
 * Nécessite CLOUDFLARE_API_TOKEN (Workers KV Storage Edit).
 *
 * Usage:
 *   node scripts/deploy-kv-shards.js --backup-only
 *   node scripts/deploy-kv-shards.js --upload-only
 *   node scripts/deploy-kv-shards.js --restore --dir workers/kv-backup
 *   node scripts/deploy-kv-shards.js   # backup puis upload (local interactif)
 *
 * Restore :
 *   - clé présente au backup → PUT valeur précédente
 *   - clé absente au backup → DELETE (supprime ce que le deploy a créé)
 */
const fs = require("fs");
const path = require("path");
const {
  fileToKey,
  keyToFile,
  runRestore: runRestoreOps,
} = require("./lib/kv-shards-ops.js");

const ROOT = path.join(__dirname, "..");
const ACCOUNT_ID = "82e31c401bb561864cba4a522774e8b8";
const NAMESPACE_ID = "5d9807d363a24a089326f8d24f4f340c";
const SHARDS_DIR = path.join(ROOT, "workers", "kv-shards");
const DEFAULT_BACKUP_DIR = path.join(ROOT, "workers", "kv-backup");

const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) {
  console.error("CLOUDFLARE_API_TOKEN manquant");
  process.exit(1);
}

const args = process.argv.slice(2);
const BACKUP_ONLY = args.includes("--backup-only");
const UPLOAD_ONLY = args.includes("--upload-only");
const RESTORE = args.includes("--restore");
const SKIP_BACKUP = args.includes("--skip-backup");

function argValue(flag) {
  const i = args.indexOf(flag);
  if (i === -1 || !args[i + 1]) return null;
  return args[i + 1];
}

const backupDir = path.resolve(argValue("--dir") || DEFAULT_BACKUP_DIR);

async function cfFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

async function listAllKeys(prefix = "r:") {
  const keys = [];
  let cursor = null;
  for (;;) {
    const u = new URL(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/keys`,
    );
    u.searchParams.set("limit", "1000");
    u.searchParams.set("prefix", prefix);
    if (cursor) u.searchParams.set("cursor", cursor);
    const res = await cfFetch(u.toString());
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(`LIST keys → ${res.status}: ${JSON.stringify(json.errors || json)}`);
    }
    for (const item of json.result || []) {
      keys.push(item.name);
    }
    cursor = json.result_info?.cursor;
    if (!cursor || (json.result || []).length === 0) break;
  }
  return keys.sort();
}

async function kvGet(key) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(key)}`;
  const res = await cfFetch(url);
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${key} → ${res.status}: ${text}`);
  }
  return await res.text();
}

async function kvPut(key, value) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(key)}`;
  const res = await cfFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: value,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(`PUT ${key} → ${res.status}: ${JSON.stringify(json.errors || json)}`);
  }
}

async function kvDelete(key) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(key)}`;
  const res = await cfFetch(url, { method: "DELETE" });
  // 404 = déjà absente → OK pour idempotence
  if (res.status === 404) return;
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(`DELETE ${key} → ${res.status}: ${JSON.stringify(json.errors || json)}`);
  }
}

const kvClient = { kvGet, kvPut, kvDelete, listKeys: listAllKeys };

function listLocalShardFiles() {
  if (!fs.existsSync(SHARDS_DIR)) {
    throw new Error(`Dossier absent: ${SHARDS_DIR} — lancer npm run redirects:kv-shards`);
  }
  const files = fs
    .readdirSync(SHARDS_DIR)
    .filter((f) => /^r-.+\.json$/.test(f))
    .sort();
  if (!files.length) throw new Error("Aucun shard r-*.json");
  return files;
}

async function runBackup() {
  if (fs.existsSync(backupDir)) {
    fs.rmSync(backupDir, { recursive: true, force: true });
  }
  fs.mkdirSync(backupDir, { recursive: true });

  console.log("Liste des clés KV distantes (préfixe r:)…");
  const remoteKeys = await listAllKeys("r:");
  console.log(`  ${remoteKeys.length} clé(s) distante(s)`);

  const localKeys = listLocalShardFiles().map(fileToKey);
  const allKeys = [...new Set([...remoteKeys, ...localKeys])].sort();

  const manifest = {
    createdAt: new Date().toISOString(),
    accountId: ACCOUNT_ID,
    namespaceId: NAMESPACE_ID,
    keys: [],
  };

  console.log(`Backup KV → ${backupDir} (${allKeys.length} clés)`);
  let ok = 0;
  let absent = 0;
  for (const key of allKeys) {
    const remote = await kvGet(key);
    const out = path.join(backupDir, keyToFile(key));
    if (remote == null) {
      fs.writeFileSync(out, "null\n");
      manifest.keys.push({ key, bytes: 0, absent: true });
      absent += 1;
      console.log(`  backup ${key}: (absent)`);
    } else {
      try {
        JSON.parse(remote);
      } catch {
        throw new Error(`Backup ${key}: contenu distant non-JSON`);
      }
      fs.writeFileSync(out, remote);
      manifest.keys.push({ key, bytes: remote.length, absent: false });
      ok += 1;
      console.log(`  backup ${key}: ${remote.length} bytes`);
    }
  }

  if (ok === 0 && remoteKeys.length > 0) {
    throw new Error("Backup vide alors que des clés distantes existent");
  }

  fs.writeFileSync(
    path.join(backupDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(backupDir, "RESTORE.md"),
    [
      "# Restore KV",
      "",
      "```bash",
      "export CLOUDFLARE_API_TOKEN=…",
      `node scripts/deploy-kv-shards.js --restore --dir ${path.relative(ROOT, backupDir)}`,
      "```",
      "",
      "Comportement :",
      "- clé présente au backup → restaure la valeur",
      "- clé absente au backup → DELETE la clé (annule une création post-deploy)",
      "",
      `Créé : ${manifest.createdAt}`,
      `Clés sauvegardées : ${ok} (+ ${absent} absentes)`,
      "",
    ].join("\n"),
  );

  console.log(`Backup OK: ${ok} valeur(s), ${absent} absente(s)`);
  console.log(`BACKUP_DIR=${backupDir}`);
  return backupDir;
}

async function runUpload() {
  const files = listLocalShardFiles();
  console.log("Upload", files.length, "shards…");
  for (const file of files) {
    const key = fileToKey(file);
    const value = fs.readFileSync(path.join(SHARDS_DIR, file), "utf8");
    JSON.parse(value);
    await kvPut(key, value);
    console.log(`  PUT ${key} ← ${file} (${value.length} bytes)`);
  }
  console.log("KV shards uploadés OK");
}

async function runRestore() {
  await runRestoreOps(backupDir, kvClient);
}

async function main() {
  if (SKIP_BACKUP && !UPLOAD_ONLY) {
    console.error("--skip-backup interdit hors --upload-only (CI : backup obligatoire)");
    process.exit(1);
  }

  if (RESTORE) {
    await runRestore();
    return;
  }
  if (BACKUP_ONLY) {
    await runBackup();
    return;
  }
  if (UPLOAD_ONLY) {
    await runUpload();
    return;
  }
  await runBackup();
  await runUpload();
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
