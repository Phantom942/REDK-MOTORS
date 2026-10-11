#!/usr/bin/env node
/** Tests panel admin + RPC — local uniquement. */
import { assertLocalSupabaseUrl } from "./lib/marketplace-local-guard.mjs";
import { requireLocalEnv } from "./lib/marketplace-local-env.mjs";
import {
  authToken,
  rest,
  rpc,
  publishListingWithPhotos,
  uploadPhotoEdge,
  makeTestJpeg,
  approveListing,
} from "./lib/marketplace-test-api.mjs";

const results = { ok: [], fail: [] };
function pass(n) {
  results.ok.push(n);
  console.log(`  OK  ${n}`);
}
function fail(n, d) {
  results.fail.push({ n, d });
  console.log(`  FAIL ${n}${d ? ` — ${d}` : ""}`);
}

async function main() {
  console.log("Marketplace E2E admin / staff\n");
  const { baseUrl, anonKey } = requireLocalEnv();
  assertLocalSupabaseUrl(baseUrl);

  const userA = await authToken(baseUrl, anonKey, process.env.MARKETPLACE_TEST_USER_A_EMAIL || "mp-vendeur-a@test.local");
  const userB = await authToken(baseUrl, anonKey, process.env.MARKETPLACE_TEST_USER_B_EMAIL || "mp-vendeur-b@test.local");
  const mod = await authToken(baseUrl, anonKey, process.env.MARKETPLACE_TEST_MOD_EMAIL || "mp-moderateur@test.local");
  const admin = await authToken(baseUrl, anonKey, process.env.MARKETPLACE_TEST_ADMIN_EMAIL || "mp-admin@test.local");
  const staffEmail = process.env.MARKETPLACE_TEST_STAFF_EMAIL || "mp-staff@test.local";
  let staff;
  try {
    staff = await authToken(baseUrl, anonKey, staffEmail);
  } catch {
    fail("compte garage_staff", "lancer seed avec STAFF");
    return finish(1);
  }

  const consPayload = {
    make: "Citroën",
    model: "C3",
    model_year: 2020,
    mileage_km: 35000,
    fuel: "essence",
    gearbox: "manuelle",
    price_cents: 1100000,
    city: "Ivry-sur-Seine",
    postal_code: "94200",
    description:
      "Dépôt-vente garage test local — véhicule confié par un client pour revente en showroom Red-K Motors.",
    contact_phone: "0145960000",
  };

  const staffCreate = await rpc(baseUrl, anonKey, staff.token, "create_consignment_listing", {
    p_payload: consPayload,
  });
  staffCreate.ok && staffCreate.json
    ? pass("staff — create_consignment_listing")
    : fail("staff consignment", JSON.stringify(staffCreate.json));

  const userCons = await rpc(baseUrl, anonKey, userA.token, "create_consignment_listing", { p_payload: consPayload });
  !userCons.ok ? pass("particulier — consignment refusé") : fail("particulier consignment", "autorisé");

  const consignmentId =
    typeof staffCreate.json === "string"
      ? staffCreate.json.replace(/^"|"$/g, "")
      : staffCreate.json?.id ?? staffCreate.json?.[0];

  if (consignmentId) {
    const img = await makeTestJpeg();
    for (let i = 0; i < 3; i++) await uploadPhotoEdge(baseUrl, anonKey, staff.token, consignmentId, img, i);
    await rpc(baseUrl, anonKey, staff.token, "submit_listing_for_review", { p_listing_id: consignmentId });
    const { json: row } = await rest(baseUrl, anonKey, mod.token, "GET", `listings?id=eq.${consignmentId}&select=pending_version,seller_type,status`);
    row?.[0]?.seller_type === "consignment" && row?.[0]?.status === "pending_review"
      ? pass("dépôt-vente soumis en attente")
      : fail("dépôt statut", JSON.stringify(row));
    const pv = row?.[0]?.pending_version;
    const appr = await approveListing(baseUrl, anonKey, mod.token, consignmentId, pv);
    appr.ok ? pass("dépôt-vente approuvé") : fail("dépôt approbation", appr.body?.error);
  }

  const { listingId: pubForReport } = await publishListingWithPhotos(
    baseUrl,
    anonKey,
    userA.token,
    userA.userId,
    mod.token,
  );
  const reportRes = await fetch(`${baseUrl}/rest/v1/listing_reports`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${userB.token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      listing_id: pubForReport,
      reporter_id: userB.userId,
      reason: "test_signal",
      details: "e2e",
    }),
  });
  const reportIns = { ok: reportRes.ok, json: await reportRes.json().catch(() => null) };
  const reportId = reportIns.json?.[0]?.id;
  if (reportId) {
    const closeRes = await fetch(`${baseUrl}/rest/v1/listing_reports?id=eq.${reportId}`, {
      method: "PATCH",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${mod.token}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        status: "resolved",
        resolved_at: new Date().toISOString(),
        resolved_by: mod.userId,
      }),
    });
    closeRes.ok ? pass("signalement clos modérateur") : fail("clôture signalement", await closeRes.text());
  } else fail("création signalement", JSON.stringify(reportIns.json));

  const { listingId } = await publishListingWithPhotos(baseUrl, anonKey, userA.token, userA.userId, mod.token);
  const withdraw = await rpc(baseUrl, anonKey, mod.token, "admin_withdraw_listing", {
    p_listing_id: listingId,
    p_internal_note: "e2e admin withdraw",
  });
  withdraw.ok ? pass("retrait admin modérateur") : fail("admin withdraw", JSON.stringify(withdraw.json));

  const { json: audit } = await rest(
    baseUrl,
    anonKey,
    admin.token,
    "GET",
    `admin_audit_log?target_id=eq.${listingId}&action=eq.admin_withdraw_listing&select=action&limit=1`,
  );
  audit?.length ? pass("journalisation admin_withdraw") : fail("audit log", "absent");

  const modConsents = await rest(
    baseUrl,
    anonKey,
    mod.token,
    "GET",
    `consent_records?user_id=eq.${userA.userId}&select=channel&limit=1`,
  );
  !modConsents.ok || (Array.isArray(modConsents.json) && modConsents.json.length === 0)
    ? pass("consentements — mod sans accès admin")
    : fail("consentements mod", "lecture autorisée");

  const adminConsents = await rest(
    baseUrl,
    anonKey,
    admin.token,
    "GET",
    `consent_records?user_id=eq.${userA.userId}&select=channel,granted&limit=5`,
  );
  adminConsents.ok ? pass("consentements — admin lecture") : fail("consentements admin", adminConsents.status);

  const modSuspend = await rpc(baseUrl, anonKey, mod.token, "suspend_account", {
    p_user_id: userA.userId,
    p_reason: "mod_should_fail",
  });
  !modSuspend.ok ? pass("suspension — modérateur refusé") : fail("suspension mod", "autorisée");

  const expMod = await fetch(`${baseUrl}/functions/v1/admin-export`, {
    method: "POST",
    headers: { Authorization: `Bearer ${mod.token}`, apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ exportType: "consents" }),
  });
  expMod.status === 403 ? pass("export — modérateur refusé") : fail("export mod", expMod.status);

  return finish(results.fail.length ? 1 : 0);
}

function finish(code) {
  console.log("\n=== Bilan E2E admin ===");
  console.log(`Réussis : ${results.ok.length}`);
  console.log(`Échoués : ${results.fail.length}`);
  if (results.fail.length) console.log(results.fail);
  process.exit(code);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
