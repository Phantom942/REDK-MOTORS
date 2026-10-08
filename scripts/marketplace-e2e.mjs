#!/usr/bin/env node
/**
 * Parcours E2E marketplace — Supabase LOCAL uniquement.
 * Prérequis : supabase start, db reset, seed, functions serve (process-listing-photo, serve-listing-photo, moderate-listing).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { assertLocalSupabaseUrl } from "./lib/marketplace-local-guard.mjs";
import { requireLocalEnv } from "./lib/marketplace-local-env.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PASSWORD = process.env.MARKETPLACE_TEST_USER_A_PASSWORD || "TestMarketplace-Local-2026!";

const results = { ok: [], fail: [], skip: [] };
function pass(n) {
  results.ok.push(n);
  console.log(`  OK  ${n}`);
}
function fail(n, detail) {
  results.fail.push({ n, detail });
  console.log(`  FAIL ${n}${detail ? ` — ${detail}` : ""}`);
}
function skip(n, why) {
  results.skip.push({ n, why });
  console.log(`  SKIP ${n} — ${why}`);
}

async function token(baseUrl, anonKey, email, password) {
  const res = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || "auth");
  return { token: data.access_token, userId: data.user.id };
}

async function rest(baseUrl, anonKey, token, method, table, query = "", body) {
  const res = await fetch(`${baseUrl}/rest/v1/${table}${query}`, {
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

async function rpc(baseUrl, anonKey, token, fn, args) {
  return rest(baseUrl, anonKey, token, "POST", `rpc/${fn}`, "", args);
}

async function makeTestWebp() {
  return sharp({
    create: { width: 800, height: 600, channels: 3, background: { r: 40, g: 80, b: 120 } },
  })
    .webp()
    .toBuffer();
}

async function uploadPhoto(baseUrl, anonKey, userToken, listingId, buffer, sortOrder) {
  const form = new FormData();
  form.set("listingId", listingId);
  form.set("sortOrder", String(sortOrder));
  form.set("file", new Blob([buffer], { type: "image/png" }), "test.png");
  const res = await fetch(`${baseUrl}/functions/v1/process-listing-photo`, {
    method: "POST",
    headers: { Authorization: `Bearer ${userToken}`, apikey: anonKey },
    body: form,
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

async function main() {
  console.log("Marketplace E2E (runtime)\n");

  let env;
  try {
    env = requireLocalEnv();
  } catch (e) {
    console.error("NON EXÉCUTÉ :", e.message);
    process.exit(3);
  }

  const { baseUrl, anonKey, serviceKey } = env;
  assertLocalSupabaseUrl(baseUrl);

  const emailA = process.env.MARKETPLACE_TEST_USER_A_EMAIL || "mp-vendeur-a@test.local";
  const emailB = process.env.MARKETPLACE_TEST_USER_B_EMAIL || "mp-vendeur-b@test.local";
  const emailMod = process.env.MARKETPLACE_TEST_MOD_EMAIL || "mp-moderateur@test.local";
  const emailAdmin = process.env.MARKETPLACE_TEST_ADMIN_EMAIL || "mp-admin@test.local";

  // --- Auth / RLS ---
  const anonList = await rest(baseUrl, anonKey, null, "GET", "listings?select=id&limit=1");
  anonList.ok ? fail("anon listings") : pass("anon listings refusé");

  let userA, userB, mod;
  try {
    userA = await token(baseUrl, anonKey, emailA, PASSWORD);
    userB = await token(baseUrl, anonKey, emailB, PASSWORD);
    mod = await token(baseUrl, anonKey, emailMod, PASSWORD);
    pass("auth vendeurs A/B + modérateur");
  } catch (e) {
    fail("auth comptes seed", e.message);
    printSummary();
    process.exit(1);
  }

  const roleHack = await rest(baseUrl, anonKey, userA.token, "POST", "user_roles", "", {
    user_id: userA.userId,
    role: "admin",
  });
  roleHack.ok ? fail("escalade rôle admin") : pass("escalade rôle refusée");

  const profileHack = await rest(baseUrl, anonKey, userA.token, "PATCH", `profiles?id=eq.${userA.userId}`, {
    account_status: "suspended",
  });
  profileHack.ok ? fail("patch account_status") : pass("account_status protégé");

  // Consentements : métadonnées invalides ne créent pas d'opt-in (vérif en base après signup seed = false)
  const { json: consentsA } = await rest(
    baseUrl,
    anonKey,
    userA.token,
    "GET",
    `consent_records?user_id=eq.${userA.userId}&select=channel,granted`,
  );
  if (Array.isArray(consentsA) && consentsA.every((c) => c.granted === false)) pass("consentements seed default false");
  else fail("consentements seed", JSON.stringify(consentsA));

  // --- Listing draft + photos ---
  const draft = await rest(baseUrl, anonKey, userA.token, "POST", "listings", "", {
    owner_id: userA.userId,
    seller_type: "private",
    status: "draft",
    make: "Peugeot",
    model: "208",
    model_year: 2019,
    mileage_km: 45000,
    fuel: "essence",
    gearbox: "manuelle",
    price_cents: 1200000,
    city: "Ivry-sur-Seine",
    postal_code: "94200",
    description: "Véhicule test E2E local — description minimale pour validation modération.",
    contact_phone: "0612345678",
  });
  if (!draft.ok || !draft.json?.[0]?.id) {
    fail("création brouillon", JSON.stringify(draft.json));
    printSummary();
    process.exit(1);
  }
  const listingId = draft.json[0].id;
  pass("brouillon créé");

  const webp = await makeTestWebp();
  const uploads = [];
  for (let i = 0; i < 3; i++) {
    const up = await uploadPhoto(baseUrl, anonKey, userA.token, listingId, webp, i);
    uploads.push(up);
  }
  if (uploads.every((u) => u.ok)) pass("3 photos via process-listing-photo");
  else {
    fail("upload photos edge", uploads.map((u) => u.body?.error || u.status).join("; "));
    skip("suite parcours", "edge functions indisponibles — lancer `supabase functions serve`");
    printSummary();
    process.exit(1);
  }

  const badUpload = await uploadPhoto(baseUrl, anonKey, userB.token, listingId, webp, 9);
  badUpload.ok ? fail("photo listing autre vendeur") : pass("photo autre vendeur refusée");

  const junk = Buffer.from("not-an-image");
  const formJunk = new FormData();
  formJunk.set("listingId", listingId);
  formJunk.set("sortOrder", "0");
  formJunk.set("file", new Blob([junk]), "fake.jpg");
  const junkRes = await fetch(`${baseUrl}/functions/v1/process-listing-photo`, {
    method: "POST",
    headers: { Authorization: `Bearer ${userA.token}`, apikey: anonKey },
    body: formJunk,
  });
  junkRes.ok ? fail("fichier invalide accepté") : pass("fichier invalide refusé");

  const submit = await rpc(baseUrl, anonKey, userA.token, "submit_listing_for_review", { p_listing_id: listingId });
  submit.ok ? pass("soumission pending_review") : fail("soumission", JSON.stringify(submit.json));

  const { json: pendingRow } = await rest(
    baseUrl,
    anonKey,
    mod.token,
    "GET",
    `listings?id=eq.${listingId}&select=status,pending_version`,
  );
  const pv = pendingRow?.[0]?.pending_version;

  const modRes = await fetch(`${baseUrl}/functions/v1/moderate-listing`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${mod.token}`,
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listingId, versionNumber: pv, action: "approve" }),
  });
  const modBody = await modRes.json().catch(() => ({}));
  modRes.ok ? pass("approbation modérateur") : fail("approbation", modBody.error || modRes.status);

  const { json: photosPub } = await rest(baseUrl, anonKey, null, "GET", `listing_public_photos?listing_id=eq.${listingId}&select=id`);
  const photoId = photosPub?.[0]?.id;
  if (photoId) pass("listing_public_photos après publish");
  else fail("listing_public_photos vide");

  if (photoId) {
    const serve = await fetch(`${baseUrl}/functions/v1/serve-listing-photo?photoId=${photoId}`);
    serve.ok ? pass("serve-listing-photo 200") : fail("serve photo", serve.status);
    const cc = serve.headers.get("cache-control") || "";
    cc.includes("max-age=60") ? pass("Cache-Control max-age=60 présent") : fail("Cache-Control", cc);
  }

  // Retrait
  const withdraw = await rpc(baseUrl, anonKey, userA.token, "withdraw_listing", { p_listing_id: listingId });
  withdraw.ok ? pass("retrait vendeur") : fail("retrait", JSON.stringify(withdraw.json));

  if (photoId) {
    const serveAfter = await fetch(`${baseUrl}/functions/v1/serve-listing-photo?photoId=${photoId}`);
    serveAfter.status === 404 ? pass("serve 404 après retrait") : fail("serve après retrait", serveAfter.status);
  }

  // Legacy edge désactivée
  const legacy = await fetch(`${baseUrl}/functions/v1/publish-listing-photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Marketplace-Internal": "test" },
    body: "{}",
  });
  legacy.status === 410 ? pass("publish-listing-photos neutralisée (410)") : fail("legacy publish", legacy.status);

  // Admin export refus mod
  const expMod = await fetch(`${baseUrl}/functions/v1/admin-export`, {
    method: "POST",
    headers: { Authorization: `Bearer ${mod.token}`, apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ exportType: "consents" }),
  });
  expMod.status === 403 ? pass("export CSV refusé modérateur") : fail("export mod", expMod.status);

  try {
    const admin = await token(baseUrl, anonKey, emailAdmin, PASSWORD);
    const expAd = await fetch(`${baseUrl}/functions/v1/admin-export`, {
      method: "POST",
      headers: { Authorization: `Bearer ${admin.token}`, apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ exportType: "consents" }),
    });
    expAd.ok ? pass("export CSV admin") : fail("export admin", expAd.status);
  } catch {
    skip("export admin", "compte admin absent");
  }

  printSummary();
  process.exit(results.fail.length ? 1 : 0);
}

function printSummary() {
  console.log("\n=== Bilan E2E ===");
  console.log(`Réussis : ${results.ok.length}`);
  console.log(`Échoués : ${results.fail.length}`);
  if (results.fail.length) console.log(results.fail);
  console.log(`Ignorés : ${results.skip.length}`);
  if (results.skip.length) console.log(results.skip);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
