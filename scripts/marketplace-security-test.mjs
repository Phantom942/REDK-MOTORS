#!/usr/bin/env node
/**
 * Tests sécurité marketplace — analyse statique des migrations + scénarios live optionnels.
 * Live : Supabase local ou projet de test isolé (jamais prod).
 *
 * Variables (live) :
 *   MARKETPLACE_TEST_URL, MARKETPLACE_TEST_ANON_KEY,
 *   MARKETPLACE_TEST_USER_A_EMAIL/PASSWORD,
 *   MARKETPLACE_TEST_USER_B_EMAIL/PASSWORD
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const migDir = path.join(root, "marketplace", "supabase", "migrations");

const REQUIRED_SNIPPETS = [
  { file: /20400_security/, needle: "publish_via_moderation_only", label: "Bloc publication directe" },
  { file: /20400_security/, needle: "listings_public", label: "Vue listings_public" },
  { file: /20400_security/, needle: "revoke all on public.listings from anon", label: "Revoke anon listings" },
  { file: /20400_security/, needle: "begin_edit_published_listing", label: "Ré-modération après edit publié" },
  { file: /20600_moderation/, needle: "stale_version", label: "Approbation version stale" },
  { file: /20100_marketplace_rls/, needle: "user_roles_no_write", label: "RLS user_roles sans écriture" },
  { file: /20700_column_guards/, needle: "account_status_locked", label: "Garde account_status profil" },
  { file: /20700_column_guards/, needle: "registration_fingerprint_locked", label: "Garde empreinte immat" },
  { file: /20900_photos/, needle: "min_photos_required", label: "Soumission min photos" },
  { file: /20900_photos/, needle: "listing_public_photos", label: "Vue photos publiques sans privé" },
  { file: /20900_photos/, needle: "published_photo_locked", label: "Photo publiée non supprimable" },
  { file: /21000_edit/, needle: "listing_photos_insert_owner", label: "Insert photo direct client retiré" },
  { file: /21100_photos_server/, needle: "register_verified_listing_photo", label: "RPC photo vérifiée service" },
  { file: /21100_photos_server/, needle: "server_verified", label: "Flag server_verified" },
  { file: /21100_photos_server/, needle: "private_owner_upload", label: "Upload storage direct retiré" },
  { file: /21200_consents/, needle: "sync_consents_from_auth_metadata", label: "Consentements depuis métadonnées Auth" },
  { file: /21400_consents/, needle: "jsonb_bool_strict", label: "Consentements booléen JSON strict" },
  { file: /21400_consents/, needle: "drop function if exists public.register_listing_photo", label: "RPC register_listing_photo supprimée" },
];

function readMigrations() {
  if (!fs.existsSync(migDir)) {
    console.error("Dossier migrations introuvable:", migDir);
    process.exit(1);
  }
  return fs
    .readdirSync(migDir)
    .filter((f) => f.endsWith(".sql"))
    .map((f) => ({ name: f, text: fs.readFileSync(path.join(migDir, f), "utf8") }));
}

function runStatic(migrations) {
  let failed = 0;
  for (const { file, needle, label } of REQUIRED_SNIPPETS) {
    const hit = migrations.some((m) => file.test(m.name) && m.text.includes(needle));
    if (hit) {
      console.log(`  OK  ${label}`);
    } else {
      console.log(`  FAIL ${label} (${needle})`);
      failed++;
    }
  }
  const bootstrap = fs.readFileSync(
    path.join(root, "marketplace", "supabase", "functions", "bootstrap-admin", "index.ts"),
    "utf8",
  );
  if (bootstrap.includes("userId") && !bootstrap.includes("auth.getUser()") && bootstrap.includes("X-Bootstrap-Secret")) {
    console.log("  OK  Bootstrap admin opérateur (secret + userId cible)");
  } else {
    console.log("  FAIL Bootstrap admin — vérifier index.ts");
    failed++;
  }
  return failed;
}

async function supabaseAuth(baseUrl, anonKey, email, password) {
  const res = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "auth_failed");
  return data;
}

async function rest(baseUrl, anonKey, token, method, table, query = "", body) {
  const res = await fetch(`${baseUrl}/rest/v1/${table}${query}`, {
    method,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: method === "POST" ? "return=representation" : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  return { ok: res.ok, status: res.status, json };
}

async function runLive() {
  const baseUrl = process.env.MARKETPLACE_TEST_URL?.replace(/\/$/, "");
  const anonKey = process.env.MARKETPLACE_TEST_ANON_KEY;
  const emailA = process.env.MARKETPLACE_TEST_USER_A_EMAIL;
  const passA = process.env.MARKETPLACE_TEST_USER_A_PASSWORD;
  if (!baseUrl || !anonKey || !emailA || !passA) {
    console.log("\nLive RLS : NON EXÉCUTÉ — prérequis manquants.");
    console.log("  - Docker Desktop + Supabase CLI (supabase start depuis marketplace/)");
    console.log("  - supabase db reset UNIQUEMENT si l'URL est localhost / 127.0.0.1");
    console.log("  - Variables MARKETPLACE_TEST_URL, MARKETPLACE_TEST_ANON_KEY, USER_A/B (comptes de test)");
    console.log("  Les checks statiques ne remplacent pas une validation RLS live.");
    return 0;
  }

  if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/.test(baseUrl)) {
    console.log("\nLive RLS : REFUSÉ — MARKETPLACE_TEST_URL doit pointer vers localhost (base de test).");
    return 1;
  }

  console.log("\nLive (utilisateur A)…");
  let failed = 0;
  const session = await supabaseAuth(baseUrl, anonKey, emailA, passA);
  const token = session.access_token;
  const uid = session.user?.id;

  const roleInsert = await rest(baseUrl, anonKey, token, "POST", "user_roles", "", {
    user_id: uid,
    role: "admin",
  });
  if (roleInsert.ok) {
    console.log("  FAIL user_roles insert autorisé pour utilisateur standard");
    failed++;
  } else {
    console.log("  OK  user_roles insert refusé");
  }

  const profileHack = await rest(baseUrl, anonKey, token, "PATCH", "profiles", `?id=eq.${uid}`, {
    account_status: "suspended",
  });
  if (profileHack.ok) {
    console.log("  FAIL account_status modifiable par l'utilisateur");
    failed++;
  } else {
    console.log("  OK  account_status non modifiable par l'utilisateur");
  }

  const pubAttempt = await rest(baseUrl, anonKey, token, "PATCH", "listings", "?owner_id=eq." + uid, {
    status: "published",
  });
  if (pubAttempt.ok && Array.isArray(pubAttempt.json) && pubAttempt.json.length > 0) {
    console.log("  FAIL publication directe possible");
    failed++;
  } else {
    console.log("  OK  publication directe bloquée ou sans effet");
  }

  const publicView = await fetch(`${baseUrl}/rest/v1/listings_public?select=id,moderation_notes_internal&limit=1`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  });
  const pubBody = await publicView.text();
  if (pubBody.includes("moderation_notes_internal")) {
    console.log("  FAIL listings_public expose moderation_notes_internal");
    failed++;
  } else {
    console.log("  OK  listings_public sans colonne interne demandée");
  }

  return failed;
}

console.log("Marketplace — tests sécurité\nStatic migrations:");
const migrations = readMigrations();
let failed = runStatic(migrations);
failed += await runLive();

if (failed > 0) {
  console.log(`\n${failed} échec(s).`);
  process.exit(1);
}
console.log("\nTous les contrôles exécutés ont réussi.");
