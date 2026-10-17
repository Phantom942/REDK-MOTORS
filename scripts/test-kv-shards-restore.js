#!/usr/bin/env node
/**
 * Tests restore KV avec API Cloudflare simulée (pas de réseau).
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const assert = require("assert");
const {
  keyToFile,
  validateRestoreBackup,
  runRestore,
} = require("./lib/kv-shards-ops.js");

function ok(msg) {
  console.log(`OK: ${msg}`);
}

function makeMockKv(initial = {}) {
  const store = new Map(Object.entries(initial));
  const ops = [];
  return {
    store,
    ops,
    async kvGet(key) {
      return store.has(key) ? store.get(key) : null;
    },
    async kvPut(key, value) {
      ops.push({ op: "put", key, value });
      store.set(key, value);
    },
    async kvDelete(key) {
      ops.push({ op: "delete", key });
      store.delete(key);
    },
  };
}

function writeBackup(dir, entries) {
  fs.mkdirSync(dir, { recursive: true });
  const manifest = {
    createdAt: new Date().toISOString(),
    accountId: "test",
    namespaceId: "test",
    keys: [],
  };
  for (const e of entries) {
    const file = path.join(dir, keyToFile(e.key));
    if (e.absent) {
      fs.writeFileSync(file, "null\n");
      manifest.keys.push({ key: e.key, bytes: 0, absent: true });
    } else {
      const body = typeof e.value === "string" ? e.value : JSON.stringify(e.value);
      fs.writeFileSync(file, body);
      manifest.keys.push({ key: e.key, bytes: body.length, absent: false });
    }
  }
  fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2));
  return manifest;
}

async function main() {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "kv-restore-"));

  // 1) Restauration d'une clé existante
  {
    const dir = path.join(tmpRoot, "restore-existing");
    const oldVal = JSON.stringify({ "/blog/old/": "/blog/articles/old/" });
    writeBackup(dir, [{ key: "r:b", absent: false, value: oldVal }]);

    const kv = makeMockKv({
      "r:b": JSON.stringify({ "/blog/old/": "/wrong/" }), // état post-deploy incorrect
    });

    const result = await runRestore(dir, kv, () => {});
    assert.strictEqual(result.putCount, 1);
    assert.strictEqual(result.deleteCount, 0);
    assert.strictEqual(kv.store.get("r:b"), oldVal);
    assert.deepStrictEqual(
      kv.ops.filter((o) => o.op === "put").map((o) => o.key),
      ["r:b"],
    );
    ok("restaure valeur précédente d’une clé existante");
  }

  // 2) Suppression d'une clé auparavant absente
  {
    const dir = path.join(tmpRoot, "delete-absent");
    writeBackup(dir, [
      { key: "r:b", absent: false, value: { keep: true } },
      { key: "r:z", absent: true },
    ]);

    const kv = makeMockKv({
      "r:b": JSON.stringify({ keep: true }),
      "r:z": JSON.stringify({ createdByDeploy: true }),
    });

    const result = await runRestore(dir, kv, () => {});
    assert.strictEqual(result.putCount, 1);
    assert.strictEqual(result.deleteCount, 1);
    assert.ok(kv.store.has("r:b"));
    assert.ok(!kv.store.has("r:z"), "r:z doit être supprimée");
    assert.ok(kv.ops.some((o) => o.op === "delete" && o.key === "r:z"));
    ok("supprime une clé absente au backup (créée au deploy)");
  }

  // 3) Échec si sauvegarde incomplète (fichier manquant) — aucune écriture
  {
    const dir = path.join(tmpRoot, "incomplete");
    writeBackup(dir, [
      { key: "r:a", absent: false, value: { a: 1 } },
      { key: "r:b", absent: false, value: { b: 1 } },
    ]);
    fs.unlinkSync(path.join(dir, keyToFile("r:b")));

    const kv = makeMockKv({ "r:a": "stale" });
    let threw = false;
    try {
      validateRestoreBackup(dir);
    } catch (err) {
      threw = true;
      assert.match(err.message, /Fichier manquant|r:b/);
    }
    assert.ok(threw, "validate doit échouer");

    threw = false;
    try {
      await runRestore(dir, kv, () => {});
    } catch (err) {
      threw = true;
      assert.match(err.message, /Fichier manquant|r:b/);
    }
    assert.ok(threw);
    assert.strictEqual(kv.ops.length, 0, "aucune écriture si backup incomplet");
    assert.strictEqual(kv.store.get("r:a"), "stale");
    ok("échec si backup incomplet — aucune écriture KV");
  }

  // 4) Échec manifest absent=true mais fichier non-null
  {
    const dir = path.join(tmpRoot, "bad-absent");
    writeBackup(dir, [{ key: "r:x", absent: true }]);
    fs.writeFileSync(path.join(dir, keyToFile("r:x")), JSON.stringify({ nope: 1 }));
    const kv = makeMockKv({ "r:x": "{}" });
    let threw = false;
    try {
      await runRestore(dir, kv, () => {});
    } catch (err) {
      threw = true;
      assert.match(err.message, /absent=true/);
    }
    assert.ok(threw);
    assert.strictEqual(kv.ops.length, 0);
    ok("échec si absent=true incohérent avec le fichier");
  }

  // 5) Idempotence DELETE (clé déjà absente côté store)
  {
    const dir = path.join(tmpRoot, "delete-idempotent");
    writeBackup(dir, [{ key: "r:new", absent: true }]);
    const kv = makeMockKv({}); // déjà absente
    const result = await runRestore(dir, kv, () => {});
    assert.strictEqual(result.deleteCount, 1);
    assert.ok(!kv.store.has("r:new"));
    ok("DELETE idempotent si clé déjà absente");
  }

  fs.rmSync(tmpRoot, { recursive: true, force: true });
  console.log("Tests restore KV (mock): OK");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
