/**
 * Opérations backup / restore KV (testables avec client simulé).
 *
 * Client attendu :
 *   kvGet(key) → string|null
 *   kvPut(key, value)
 *   kvDelete(key)
 *   listKeys(prefix) → string[]  (optionnel pour backup)
 */
const fs = require("fs");
const path = require("path");

function fileToKey(filename) {
  const base = filename.replace(/\.json$/, "");
  return base.replace("-", ":");
}

function keyToFile(key) {
  return `${key.replace(/:/g, "_")}.json`;
}

/**
 * Valide le manifest + tous les fichiers avant toute écriture.
 * @returns {{ plan: Array<{ key: string, action: 'put'|'delete', value?: string }> }}
 */
function validateRestoreBackup(backupDir) {
  if (!fs.existsSync(backupDir)) {
    throw new Error(`Dossier backup absent: ${backupDir}`);
  }

  const manifestPath = path.join(backupDir, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`manifest.json manquant dans ${backupDir}`);
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (err) {
    throw new Error(`manifest.json invalide: ${err.message}`);
  }

  if (!manifest || !Array.isArray(manifest.keys) || manifest.keys.length === 0) {
    throw new Error("manifest.keys vide ou absent");
  }

  const plan = [];
  const seen = new Set();

  for (let i = 0; i < manifest.keys.length; i++) {
    const entry = manifest.keys[i];
    if (!entry || typeof entry.key !== "string" || !entry.key) {
      throw new Error(`manifest.keys[${i}]: clé invalide`);
    }
    if (typeof entry.absent !== "boolean") {
      throw new Error(`manifest.keys[${i}] (${entry.key}): absent doit être boolean`);
    }
    if (seen.has(entry.key)) {
      throw new Error(`manifest: clé en double ${entry.key}`);
    }
    seen.add(entry.key);

    const file = path.join(backupDir, keyToFile(entry.key));
    if (!fs.existsSync(file)) {
      throw new Error(`Fichier manquant pour ${entry.key}: ${path.basename(file)}`);
    }

    const fileRaw = fs.readFileSync(file, "utf8");
    const trimmed = fileRaw.trim();

    if (entry.absent) {
      if (trimmed !== "null") {
        throw new Error(
          `${entry.key}: absent=true mais fichier ≠ "null" (${trimmed.slice(0, 40)})`,
        );
      }
      plan.push({ key: entry.key, action: "delete" });
    } else {
      if (trimmed === "null" || trimmed === "") {
        throw new Error(`${entry.key}: absent=false mais contenu vide/null`);
      }
      try {
        JSON.parse(trimmed);
      } catch (err) {
        throw new Error(`${entry.key}: JSON invalide — ${err.message}`);
      }
      if (typeof entry.bytes === "number" && entry.bytes > 0 && fileRaw.length !== entry.bytes) {
        throw new Error(
          `${entry.key}: taille fichier ${fileRaw.length} ≠ manifest.bytes ${entry.bytes}`,
        );
      }
      // Restaurer exactement le contenu sauvegardé (pas de trim)
      plan.push({ key: entry.key, action: "put", value: fileRaw });
    }
  }

  return { manifest, plan };
}

/**
 * Restaure selon le plan validé.
 * - put : valeur précédente
 * - delete : clé créée au déploiement alors qu'elle était absente
 */
async function runRestore(backupDir, kvClient, log = console.log) {
  const { plan } = validateRestoreBackup(backupDir);
  log(`Restore KV depuis ${backupDir} (${plan.length} opérations, validé)`);

  let putCount = 0;
  let deleteCount = 0;

  for (const step of plan) {
    if (step.action === "put") {
      await kvClient.kvPut(step.key, step.value);
      putCount += 1;
      log(`  RESTORED ${step.key} (${step.value.length} bytes)`);
    } else if (step.action === "delete") {
      await kvClient.kvDelete(step.key);
      deleteCount += 1;
      log(`  DELETED ${step.key} (était absent au backup)`);
    } else {
      throw new Error(`Action inconnue: ${step.action}`);
    }
  }

  log(`Restore KV OK (put=${putCount}, delete=${deleteCount})`);
  return { putCount, deleteCount, plan };
}

module.exports = {
  fileToKey,
  keyToFile,
  validateRestoreBackup,
  runRestore,
};
