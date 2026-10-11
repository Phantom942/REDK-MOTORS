import fs from "node:fs";
import path from "node:path";

/** Parse un fichier .env simple (KEY=value, # commentaires). */
export function loadDotenvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"'))
      || (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

export function applyEnv(map) {
  for (const [k, v] of Object.entries(map)) {
    if (v !== undefined && v !== "") process.env[k] ??= v;
  }
}

export function repoRootFromImportMeta(importMetaUrl) {
  return path.join(path.dirname(new URL(importMetaUrl).pathname.replace(/^\/([A-Z]:)/, "$1")), "..", "..");
}
