import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertLocalSupabaseUrl } from "./marketplace-local-guard.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.join(__dirname, "..", "..");
export const marketplaceDir = path.join(repoRoot, "marketplace");

/** Parse `supabase status -o env` depuis marketplace/ */
export function loadSupabaseLocalEnv() {
  const fromFile = process.env.MARKETPLACE_LOCAL_ENV_FILE;
  if (fromFile && fs.existsSync(fromFile)) {
    return parseEnvFile(fs.readFileSync(fromFile, "utf8"));
  }

  try {
    const out = execSync("npx supabase status -o env", {
      cwd: marketplaceDir,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return parseEnvFile(out);
  } catch (e) {
    return { error: e.stderr?.toString() || e.message };
  }
}

function parseEnvFile(text) {
  const env = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
  const url = env.API_URL || env.SUPABASE_URL;
  const anon = env.ANON_KEY || env.SUPABASE_ANON_KEY;
  const service = env.SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, anonKey: anon, serviceKey: service, raw: env };
}

export function requireLocalEnv() {
  const loaded = loadSupabaseLocalEnv();
  if (loaded.error) {
    throw new Error(`Supabase local indisponible : ${loaded.error}`);
  }
  const url = assertLocalSupabaseUrl(loaded.url, "chargement env");
  if (!loaded.anonKey || !loaded.serviceKey) {
    throw new Error("Clés anon/service introuvables — lancez `supabase start` depuis marketplace/");
  }
  return { baseUrl: url, anonKey: loaded.anonKey, serviceKey: loaded.serviceKey };
}
