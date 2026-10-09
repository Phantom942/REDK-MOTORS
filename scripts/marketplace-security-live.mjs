#!/usr/bin/env node
/**
 * Tests RLS live — Supabase LOCAL uniquement (127.0.0.1 / localhost).
 * Prérequis : Docker Desktop, Supabase CLI, migrations appliquées, comptes de test créés.
 *
 * MARKETPLACE_TEST_URL=http://127.0.0.1:54321
 * MARKETPLACE_TEST_ANON_KEY=...
 * MARKETPLACE_TEST_SERVICE_ROLE_KEY=... (bootstrap rôles)
 * MARKETPLACE_TEST_USER_A_EMAIL / PASSWORD
 * MARKETPLACE_TEST_USER_B_EMAIL / PASSWORD
 * MARKETPLACE_TEST_MOD_EMAIL / PASSWORD
 * MARKETPLACE_TEST_ADMIN_EMAIL / PASSWORD (optionnel si bootstrap)
 */
import { loadSupabaseLocalEnv } from "./lib/marketplace-local-env.mjs";
import { assertLocalSupabaseUrl } from "./lib/marketplace-local-guard.mjs";

let baseUrl = process.env.MARKETPLACE_TEST_URL?.replace(/\/$/, "");
let anonKey = process.env.MARKETPLACE_TEST_ANON_KEY;
let serviceKey = process.env.MARKETPLACE_TEST_SERVICE_ROLE_KEY;

if (!baseUrl || !anonKey) {
  const loaded = loadSupabaseLocalEnv();
  if (!loaded.error && loaded.url && loaded.anonKey) {
    baseUrl = loaded.url.replace(/\/$/, "");
    anonKey = loaded.anonKey;
    serviceKey = serviceKey || loaded.serviceKey;
  }
}

let failed = 0;
function fail(label) {
  console.log(`  FAIL ${label}`);
  failed++;
}
function ok(label) {
  console.log(`  OK  ${label}`);
}

async function auth(email, password) {
  const res = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || "auth_failed");
  return data;
}

async function rest(token, method, path, body) {
  const res = await fetch(`${baseUrl}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token ?? anonKey}`,
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

async function run() {
  console.log("Marketplace — tests RLS live\n");

  if (!baseUrl || !anonKey) {
    console.log("NON EXÉCUTÉ — variables MARKETPLACE_TEST_URL / ANON_KEY manquantes.\n");
    console.log("Installation Windows (résumé) :");
    console.log("  1. Docker Desktop : https://docs.docker.com/desktop/setup/install/windows-install/");
    console.log("  2. Supabase CLI : winget install Supabase.CLI  (ou scoop install supabase)");
    console.log("  3. cd marketplace && supabase start");
    console.log("  4. supabase db reset  (uniquement si URL = 127.0.0.1:54321)");
    console.log("  5. Emails locaux : http://127.0.0.1:54324 (Inbucket) — pas de SMTP prod");
    console.log("  6. npm run test:marketplace-live avec les variables ci-dessus");
    process.exit(3);
  }

  assertLocalSupabaseUrl(baseUrl, "tests RLS live");

  const emailA = process.env.MARKETPLACE_TEST_USER_A_EMAIL;
  const passA = process.env.MARKETPLACE_TEST_USER_A_PASSWORD;
  const emailB = process.env.MARKETPLACE_TEST_USER_B_EMAIL;
  const passB = process.env.MARKETPLACE_TEST_USER_B_PASSWORD;
  const emailMod = process.env.MARKETPLACE_TEST_MOD_EMAIL;
  const passMod = process.env.MARKETPLACE_TEST_MOD_PASSWORD;

  if (!emailA || !passA) {
    console.log("NON EXÉCUTÉ — comptes de test A manquants.");
    process.exit(3);
  }

  // Visiteur
  const anonListings = await rest(null, "GET", "listings?select=id&limit=1");
  if (anonListings.ok) fail("anon select listings");
  else ok("anon select listings refusé");

  const anonPublic = await rest(null, "GET", "listings_public?select=id&limit=1");
  if (anonPublic.ok) ok("anon listings_public lecture");
  else fail("anon listings_public");

  const sessionA = await auth(emailA, passA);
  const tokenA = sessionA.access_token;
  const uidA = sessionA.user.id;

  const roleHack = await rest(tokenA, "POST", "user_roles", { user_id: uidA, role: "admin" });
  if (roleHack.ok) fail("insert user_roles admin");
  else ok("insert user_roles refusé");

  const profileHack = await rest(tokenA, "PATCH", `profiles?id=eq.${uidA}`, { account_status: "suspended" });
  if (profileHack.ok) fail("patch account_status");
  else ok("account_status protégé");

  if (emailB && passB) {
    const sessionB = await auth(emailB, passB);
    const { json: draftsB } = await rest(sessionB.access_token, "GET", `listings?owner_id=eq.${uidA}&select=id`);
    if (Array.isArray(draftsB) && draftsB.length > 0) fail("B voit annonces A");
    else ok("isolation vendeurs");
  } else {
    console.log("  SKIP isolation B (USER_B non configuré)");
  }

  if (emailMod && passMod) {
    const mod = await auth(emailMod, passMod);
    const pubTry = await rest(mod.access_token, "PATCH", "listings?status=eq.pending_review", { status: "published" });
    if (pubTry.ok && Array.isArray(pubTry.json) && pubTry.json.length) fail("mod publish direct");
    else ok("publication directe refusée");
  } else {
    console.log("  SKIP modérateur (MOD non configuré)");
  }

  // Storage direct upload (doit échouer sans edge)
  const fakeUpload = await fetch(`${baseUrl}/storage/v1/object/listing-photos-private/${uidA}/fake/x.webp`, {
    method: "POST",
    headers: { apikey: anonKey, Authorization: `Bearer ${tokenA}`, "Content-Type": "image/webp" },
    body: new Uint8Array([0x52, 0x49, 0x46, 0x46]),
  });
  if (fakeUpload.ok) fail("upload storage direct client");
  else ok("upload storage direct refusé");

  const explicitInternal = await fetch(
    `${baseUrl}/rest/v1/listings_public?select=id,moderation_notes_internal&limit=1`,
    { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } },
  );
  const explicitJson = await explicitInternal.json().catch(() => null);
  if (explicitInternal.status === 400 && explicitJson?.code === "42703") {
    ok("visiteur — colonne interne refusée sur listings_public");
  } else if (explicitInternal.ok && Array.isArray(explicitJson)) {
    const leak = explicitJson.some((r) => "moderation_notes_internal" in r);
    if (leak) fail("visiteur — fuite moderation_notes_internal");
    else ok("visiteur — projection interne sans données");
  } else {
    fail(`visiteur — test colonne interne (${explicitInternal.status})`);
  }

  const star = await rest(null, "GET", "listings_public?select=*&limit=3");
  if (star.ok && Array.isArray(star.json)) {
    const leak = star.json.some((r) => "moderation_notes_internal" in r || "registration_fingerprint" in r);
    if (leak) fail("visiteur — listings_public select=* fuite");
    else ok("visiteur — listings_public select=* OK");
  } else if (star.ok) ok("visiteur — listings_public vide");
  else fail("visiteur — listings_public select=*");

  const sellerInternal = await rest(tokenA, "GET", "listings?select=moderation_notes_internal&limit=1");
  if (sellerInternal.ok && Array.isArray(sellerInternal.json) && sellerInternal.json.some((r) => "moderation_notes_internal" in r)) {
    fail("vendeur lit moderation_notes_internal");
  } else {
    ok("vendeur — pas de note interne via listings REST");
  }

  if (failed) {
    console.log(`\n${failed} échec(s) RLS live.`);
    process.exit(1);
  }
  console.log("\nTests RLS live exécutés avec succès ( périmètre script ).");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
