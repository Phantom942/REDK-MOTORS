#!/usr/bin/env node
/**
 * Régression ciblée : résolution approve/reject (alignée sur admin.js) + Edge Functions.
 */
import { requireLocalEnv } from "./lib/marketplace-local-env.mjs";
import {
  approveListing,
  authToken,
  createDraftListing,
  makeTestJpeg,
  moderateEdge,
  rest,
  rpc,
  uploadPhotoEdge,
} from "./lib/marketplace-test-api.mjs";

/** Miroir de assets/js/marketplace/admin.js (handler submit modération). */
export function moderationActionFromSubmit(submitterValue, formDataAction) {
  const action = submitterValue ?? formDataAction;
  return action === "approve" ? "approve" : "reject";
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  console.log("Marketplace — régression actions modération\n");
  let failed = 0;

  try {
    assert(moderationActionFromSubmit("approve", null) === "approve", "submitter approve");
    assert(moderationActionFromSubmit("reject", "approve") === "reject", "submitter reject prime");
    assert(moderationActionFromSubmit(null, "approve") === "approve", "FormData action approve");
    assert(moderationActionFromSubmit(null, null) === "reject", "sans submitter ni action → reject (legacy)");
    console.log("  OK  résolution action (miroir admin.js)");
  } catch (e) {
    console.error("  FAIL", e.message);
    failed++;
  }

  const { baseUrl, anonKey } = requireLocalEnv();
  const mod = await authToken(baseUrl, anonKey, "mp-moderateur@test.local");
  const seller = await authToken(baseUrl, anonKey, "mp-vendeur-b@test.local");

  async function pendingListing() {
    const draft = await createDraftListing(baseUrl, anonKey, seller.token, seller.userId, {
      make: "Renault",
      model: "Clio",
      model_year: 2018,
    });
    const id = draft.json[0].id;
    const img = await makeTestJpeg();
    for (let i = 0; i < 3; i++) await uploadPhotoEdge(baseUrl, anonKey, seller.token, id, img, i);
    await rpc(baseUrl, anonKey, seller.token, "submit_listing_for_review", { p_listing_id: id });
    const { json: row } = await rest(
      baseUrl,
      anonKey,
      mod.token,
      "GET",
      `listings?id=eq.${id}&select=status,pending_version`,
    );
    return { id, pendingVersion: row[0].pending_version };
  }

  try {
    const { id, pendingVersion } = await pendingListing();
    const appr = await moderateEdge(baseUrl, anonKey, mod.token, {
      listingId: id,
      versionNumber: pendingVersion,
      action: "approve",
    });
    assert(appr.ok, `approve edge: ${JSON.stringify(appr.body)}`);
    assert(appr.body?.status === "published" && appr.body?.slug, "publié avec slug");
    const { json: pub } = await rest(baseUrl, anonKey, null, "GET", `listings_public?id=eq.${id}&select=slug`);
    assert(pub?.[0]?.slug, "visible dans listings_public");
    console.log("  OK  Edge approve sans motif public");
  } catch (e) {
    console.error("  FAIL", e.message);
    failed++;
  }

  try {
    const { id, pendingVersion } = await pendingListing();
    const rej = await moderateEdge(baseUrl, anonKey, mod.token, {
      listingId: id,
      versionNumber: pendingVersion,
      action: "reject",
      publicReason: "Photos insuffisantes (test)",
    });
    assert(rej.ok, `reject edge: ${JSON.stringify(rej.body)}`);
    const { json: row } = await rest(
      baseUrl,
      anonKey,
      mod.token,
      "GET",
      `listings?id=eq.${id}&select=status,rejection_reason_public`,
    );
    assert(row[0]?.status === "rejected", "statut rejected");
    assert(row[0]?.rejection_reason_public?.includes("Photos"), "motif public enregistré");
    console.log("  OK  Edge reject avec motif public");
  } catch (e) {
    console.error("  FAIL", e.message);
    failed++;
  }

  console.log(failed ? `\nÉchoués : ${failed}` : "\nRéussis : 3");
  process.exit(failed ? 1 : 0);
}

main();
