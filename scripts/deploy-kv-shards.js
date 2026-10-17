#!/usr/bin/env node
/**
 * Upload des shards workers/kv-shards/r-*.json vers Cloudflare KV.
 * Nécessite CLOUDFLARE_API_TOKEN (Workers KV Storage Edit).
 *
 * Usage:
 *   npm run redirects:kv-shards && node scripts/deploy-kv-shards.js
 *   node scripts/deploy-kv-shards.js --backup-only
 *   node scripts/deploy-kv-shards.js --skip-backup
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ACCOUNT_ID = "82e31c401bb561864cba4a522774e8b8";
const NAMESPACE_ID = "5d9807d363a24a089326f8d24f4f340c";
const SHARDS_DIR = path.join(ROOT, "workers", "kv-shards");

const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) {
  console.error("CLOUDFLARE_API_TOKEN manquant");
  process.exit(1);
}

const BACKUP_ONLY = process.argv.includes("--backup-only");
const SKIP_BACKUP = process.argv.includes("--skip-backup");

function fileToKey(filename) {
  // r-b.json → r:b ; r-ex0.json → r:ex0 ; r-en.json → r:en
  const base = filename.replace(/\.json$/, "");
  return base.replace("-", ":");
}

async function kvGet(key) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${key} → ${res.status}: ${text}`);
  }
  return await res.text();
}

async function kvPut(key, value) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: value,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(`PUT ${key} → ${res.status}: ${JSON.stringify(json.errors || json)}`);
  }
}

async function main() {
  if (!fs.existsSync(SHARDS_DIR)) {
    console.error("Dossier absent:", SHARDS_DIR, "— lancer npm run redirects:kv-shards");
    process.exit(1);
  }

  const files = fs
    .readdirSync(SHARDS_DIR)
    .filter((f) => /^r-.+\.json$/.test(f))
    .sort();

  if (!files.length) {
    console.error("Aucun shard r-*.json");
    process.exit(1);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupDir = path.join(ROOT, "workers", `kv-backup-${stamp}`);

  if (!SKIP_BACKUP) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log("Backup KV →", backupDir);
    for (const file of files) {
      const key = fileToKey(file);
      try {
        const remote = await kvGet(key);
        const out = path.join(backupDir, `${key.replace(/:/g, "_")}.json`);
        if (remote == null) {
          fs.writeFileSync(out, "null\n");
          console.log(`  backup ${key}: (absent)`);
        } else {
          fs.writeFileSync(out, remote);
          console.log(`  backup ${key}: ${remote.length} bytes`);
        }
      } catch (err) {
        console.error(`  backup ${key} ÉCHEC:`, err.message);
        process.exit(1);
      }
    }
    console.log("Backup OK — conserver jusqu’à validation GSC (≥ 7 j)");
  }

  if (BACKUP_ONLY) {
    console.log("Mode --backup-only : pas d’upload");
    return;
  }

  console.log("Upload", files.length, "shards…");
  for (const file of files) {
    const key = fileToKey(file);
    const value = fs.readFileSync(path.join(SHARDS_DIR, file), "utf8");
    // sanity: must be JSON object
    JSON.parse(value);
    await kvPut(key, value);
    console.log(`  PUT ${key} ← ${file} (${value.length} bytes)`);
  }
  console.log("KV shards uploadés OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
