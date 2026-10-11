#!/usr/bin/env node
/**
 * Smoke tests marketplace — préproduction Supabase UNIQUEMENT.
 *
 * - Aucun db reset, aucun seed destructif.
 * - Crée une annonce marquée [preprod-smoke] puis retrait (withdraw) en fin de run.
 * - Refuse localhost et refuse si le projet = prod déclarée.
 *
 * Variables : voir docs/marketplace/PREPROD_PLAN.md § Tests distants.
 */
import sharp from "sharp";
import { requirePreprodEnv } from "./lib/marketplace-preprod-guard.mjs";

const SMOKE_TAG = "[preprod-smoke]";
const results = { ok: [], fail: [] };

function pass(n) {
  results.ok.push(n);
  console.log(`  OK  ${n}`);
}
function fail(n, detail) {
  results.fail.push({ n, detail });
  console.log(`  FAIL ${n}${detail ? ` — ${detail}` : ""}`);
}

async function token(baseUrl, anonKey, email, password) {
  const res = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "auth");
  return { token: data.access_token, userId: data.user.id };
}

async function rest(baseUrl, anonKey, userToken, method, table, query = "", body) {
  const res = await fetch(`${baseUrl}/rest/v1/${table}${query}`, {
    method,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${userToken ?? anonKey}`,
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

async function rpc(baseUrl, anonKey, userToken, fn, args) {
  return rest(baseUrl, anonKey, userToken, "POST", `rpc/${fn}`, "", args);
}

async function makeTestImage() {
  return sharp({
    create: { width: 640, height: 480, channels: 3, background: { r: 180, g: 40, b: 40 } },
  })
    .jpeg({ quality: 88 })
    .toBuffer();
}

async function uploadPhoto(baseUrl, anonKey, userToken, listingId, buffer, sortOrder) {
  const form = new FormData();
  form.set("listingId", listingId);
  form.set("sortOrder", String(sortOrder));
  form.set("file", new Blob([buffer], { type: "image/jpeg" }), "preprod-smoke.jpg");
  const res = await fetch(`${baseUrl}/functions/v1/process-listing-photo`, {
    method: "POST",
    headers: { Authorization: `Bearer ${userToken}`, apikey: anonKey },
    body: form,
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

async function cleanupWithdraw(baseUrl, anonKey, userToken, listingId) {
  if (!listingId || !userToken) return;
  try {
    await rpc(baseUrl, anonKey, userToken, "withdraw_listing", { p_listing_id: listingId });
    console.log(`  … retrait annonce smoke ${listingId}`);
  } catch (e) {
    console.warn(`  … retrait smoke échoué (${listingId}) : ${e.message}`);
  }
}

async function main() {
  console.log("Marketplace smoke — préproduction (sans reset)\n");

  let env;
  try {
    env = requirePreprodEnv();
  } catch (e) {
    console.error("NON EXÉCUTÉ :", e.message);
    process.exit(3);
  }

  const { baseUrl, anonKey } = env;
  const password = process.env.MARKETPLACE_PREPROD_TEST_PASSWORD;
  const emailVendor = process.env.MARKETPLACE_PREPROD_TEST_VENDOR_EMAIL;
  const emailMod = process.env.MARKETPLACE_PREPROD_TEST_MODERATOR_EMAIL;

  if (!password || !emailVendor || !emailMod) {
    console.error(
      "NON EXÉCUTÉ : définir MARKETPLACE_PREPROD_TEST_VENDOR_EMAIL, MARKETPLACE_PREPROD_TEST_MODERATOR_EMAIL, MARKETPLACE_PREPROD_TEST_PASSWORD (comptes préprod dédiés).",
    );
    process.exit(3);
  }

  let listingId = null;
  let userA;

  try {
    userA = await token(baseUrl, anonKey, emailVendor, password);
    pass("auth vendeur préprod");
  } catch (e) {
    fail("auth vendeur préprod", e.message);
    printSummary();
    process.exit(1);
  }

  const anonList = await rest(baseUrl, anonKey, null, "GET", "listings?select=id&limit=1");
  anonList.ok ? fail("RLS listings anon") : pass("RLS listings anon refusé");

  const desc = `${SMOKE_TAG} ${new Date().toISOString()} — annonce jetable smoke préprod. Minimum quarante caractères requis pour validation.`;
  const draft = await rest(baseUrl, anonKey, userA.token, "POST", "listings", "", {
    owner_id: userA.userId,
    seller_type: "private",
    status: "draft",
    make: "SmokePreprod",
    model: "Test",
    model_year: 2020,
    mileage_km: 1,
    fuel: "essence",
    gearbox: "manuelle",
    price_cents: 100000,
    city: "Ivry-sur-Seine",
    postal_code: "94200",
    description: desc,
    contact_phone: "0600000000",
  });

  if (!draft.ok || !draft.json?.[0]?.id) {
    fail("création brouillon smoke", JSON.stringify(draft.json));
    printSummary();
    process.exit(1);
  }
  listingId = draft.json[0].id;
  pass(`brouillon smoke créé (${listingId})`);

  const img = await makeTestImage();
  for (let i = 0; i < 3; i++) {
    const up = await uploadPhoto(baseUrl, anonKey, userA.token, listingId, img, i);
    if (!up.ok) {
      fail("upload photo edge", up.body?.error || String(up.status));
      await cleanupWithdraw(baseUrl, anonKey, userA.token, listingId);
      printSummary();
      process.exit(1);
    }
  }
  pass("3 photos process-listing-photo");

  const submit = await rpc(baseUrl, anonKey, userA.token, "submit_listing_for_review", {
    p_listing_id: listingId,
  });
  submit.ok ? pass("soumission pending_review") : fail("soumission", JSON.stringify(submit.json));

  let mod;
  try {
    mod = await token(baseUrl, anonKey, emailMod, password);
  } catch (e) {
    fail("auth modérateur préprod", e.message);
    await cleanupWithdraw(baseUrl, anonKey, userA.token, listingId);
    printSummary();
    process.exit(1);
  }

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
  modRes.ok ? pass("approbation modérateur (edge)") : fail("approbation", modBody.error || modRes.status);

  const withdraw = await rpc(baseUrl, anonKey, userA.token, "withdraw_listing", {
    p_listing_id: listingId,
  });
  withdraw.ok ? pass("retrait + nettoyage smoke") : fail("retrait smoke", JSON.stringify(withdraw.json));
  listingId = null;

  printSummary();
  process.exit(results.fail.length ? 1 : 0);
}

function printSummary() {
  console.log("\n=== Bilan smoke préprod ===");
  console.log(`Réussis : ${results.ok.length}`);
  console.log(`Échoués : ${results.fail.length}`);
  if (results.fail.length) console.log(results.fail);
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
